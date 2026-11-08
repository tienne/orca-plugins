import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import {
  LOAD_LIMIT,
  STALE_CURSOR_PREFIX,
  type Commit,
  type Repository,
} from '../../protocol';
import { request } from '../client';
import { demo, message } from '../env';
import { fixtureLog } from '../fixture';
import {
  emptyGraph,
  layoutFrom,
  type GraphRow,
  type GraphState,
} from '../graph';
import { effectiveFilter, logInput, type LogRequest } from '../logQuery';

type Pages = {
  base: Repository | null;
  commits: Commit[];
  rows: GraphRow[];
  graph: GraphState;
  width: number;
  cursor?: string;
  hasMore: boolean;
};

const widthOf = (rows: GraphRow[], from = 44) =>
  rows.reduce(
    (max, row) =>
      Math.max(max, (Math.max(row.before.length, row.after.length) + 1) * 14),
    from,
  );

function start(repo: Repository | null): Pages {
  const commits = repo?.commits ?? [];
  const { rows, state } = layoutFrom(emptyGraph, commits);
  return {
    base: repo,
    commits,
    rows,
    graph: state,
    width: widthOf(rows),
    cursor: repo?.nextCursor,
    hasMore: !!repo?.hasMore && !!repo.nextCursor,
  };
}

// 앞 행은 다시 계산하지 않고 이전 레인 상태에서 이어 붙인다.
function append(pages: Pages, next: Repository): Pages {
  const seen = new Set(pages.commits.map((commit) => commit.hash));
  const fresh = next.commits.filter((commit) => !seen.has(commit.hash));
  const { rows, state } = layoutFrom(pages.graph, fresh);
  const commits = [...pages.commits, ...fresh];
  const hasMore =
    !!next.hasMore && !!next.nextCursor && commits.length < LOAD_LIMIT;
  return {
    ...pages,
    commits,
    rows: [...pages.rows, ...rows],
    graph: state,
    width: widthOf(rows, pages.width),
    cursor: hasMore ? next.nextCursor : undefined,
    hasMore,
  };
}

type Options = {
  repo: Repository | null;
  logSeq: MutableRefObject<number>;
  loaded: MutableRefObject<LogRequest>;
  reloadLog: () => Promise<boolean>;
};

/** 첫 페이지(useRepository의 repo) 뒤로 다음 페이지를 누적한다. repo가 바뀌면 처음부터 다시 쌓는다. */
export function useCommitPages({ repo, logSeq, loaded, reloadLog }: Options) {
  const [pages, setPages] = useState(() => start(repo));
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState('');
  const [notice, setNotice] = useState('');
  const [retry, setRetry] = useState(0);
  let current = pages;
  if (pages.base !== repo) {
    current = start(repo);
    setPages(current);
  }
  const pagesRef = useRef(current);
  pagesRef.current = current;
  // 필터 요청이 끊은 페이지 요청도 응답(취소 오류)이 와야 끝난다. 그 전에는 다음 요청을 보내지 않는다.
  const inFlight = useRef(false);
  const staleReload = useRef(false);
  useEffect(() => {
    setPageError('');
    if (staleReload.current) staleReload.current = false;
    else setNotice('');
  }, [repo]);

  async function loadMore() {
    const base = pagesRef.current;
    if (!repo || base.base !== repo || !base.hasMore || !base.cursor) return;
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setPageError('');
    const seq = logSeq.current;
    const input = loaded.current;
    const cursor = base.cursor;
    const stillCurrent = () =>
      seq === logSeq.current && pagesRef.current.base === repo;
    try {
      const next = demo
        ? await Promise.resolve().then(() =>
            fixtureLog(
              input.scope,
              effectiveFilter(input.scope, input.filter),
              cursor,
            ),
          )
        : await request('log', {
            ...logInput(repo.root, input.scope, input.filter),
            cursor,
          });
      if (!stillCurrent()) return;
      setNotice('');
      setPages((pages) =>
        pages.base === repo && pages.cursor === cursor
          ? append(pages, next)
          : pages,
      );
    } catch (e) {
      if (!stillCurrent()) return;
      const text = message(e);
      if (text.startsWith(STALE_CURSOR_PREFIX)) {
        // 다시 불러오기가 실패하면 repo가 안 바뀌어 안내가 남으므로 여기서 거둔다.
        staleReload.current = true;
        setNotice(text);
        void reloadLog().then((ok) => {
          if (ok) return;
          staleReload.current = false;
          setNotice('');
        });
      } else setPageError(text);
    } finally {
      inFlight.current = false;
      setLoading(false);
      // 요청 중에 목록 끝에 닿아 있었다면 응답 뒤 다시 확인한다.
      setRetry((n) => n + 1);
    }
  }

  // 목록 끝에서 threshold행 이내면 다음 페이지를 요청한다. 실패 뒤에는 사용자가 다시 스크롤할 때만 재시도한다.
  function reachEnd(lastVisible: number, threshold = 10, scrolled = false) {
    if (pageError && !scrolled) return;
    if (pagesRef.current.commits.length - 1 - lastVisible <= threshold)
      void loadMore();
  }

  const limitReached = !current.hasMore && current.commits.length >= LOAD_LIMIT;
  return {
    commits: current.commits,
    rows: current.rows,
    graphWidth: current.width,
    hasMore: current.hasMore,
    loading,
    pageError,
    notice,
    limitReached,
    retry,
    reachEnd,
  };
}
