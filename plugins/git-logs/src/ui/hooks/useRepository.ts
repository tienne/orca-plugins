import { useEffect, useRef, useState } from 'react';
import type {
  Descriptor,
  LogFilter,
  Repository,
  WorkspaceChoice,
} from '../../protocol';
import { request } from '../client';
import { demo, editorMode, message, scenario } from '../env';
import { fixtureLog, fixtureRepo } from '../fixture';
import { checkDescriptorVersion } from '../../protocol';
import { effectiveFilter, logInput, type LogRequest } from '../logQuery';
import type { ComparisonState } from './useComparison';
import { filterKey, hasFilter } from './useLogFilter';

type Options = {
  comparison: ComparisonState;
  busy: boolean;
  setBusy: (value: boolean) => void;
  setError: (value: string) => void;
  filter: LogFilter;
  resetFilter: () => void;
};

export function useRepository({
  comparison: view,
  busy,
  setBusy,
  setError,
  filter,
  resetFilter,
}: Options) {
  const {
    setComparison,
    setGeneration,
    setSet,
    setData,
    setFileSearch,
    setBaseCommit,
  } = view;
  const [repo, setRepo] = useState<Repository | null>(
    demo
      ? scenario === 'empty'
        ? { ...fixtureRepo, commits: [], head: null }
        : fixtureRepo
      : null,
  );
  const [autoTick, setAutoTick] = useState(0);
  const [choices, setChoices] = useState<WorkspaceChoice[]>([]);
  const [connectionNote, setConnectionNote] =
    useState('열린 워크트리에 연결하는 중…');
  const connectActive = useRef<(workspaceId?: string) => void>(() => {});
  const [scope, setScope] = useState('current');
  const scopeRef = useRef('current');
  const [branchNote, setBranchNote] = useState('');
  const [workspace, setWorkspace] = useState('');
  const logSeq = useRef(0);
  // 지금 보이는 첫 페이지를 받은 조건. 다음 페이지 커서는 이 조건과 함께 보내야 스냅샷이 맞는다.
  const loaded = useRef<LogRequest>({ scope: 'current', filter: {} });
  const filterRef = useRef(filter);
  filterRef.current = filter;
  // 마지막으로 요청한 필터. 진행 중인 요청 기준으로 비교해야 이전 조건으로 되돌렸을 때도
  // 새 요청이 나가 늦게 오는 응답이 logSeq로 버려진다.
  const requestedFilter = useRef(filterKey(filter));
  const currentRoot = useRef(repo?.root);
  currentRoot.current = repo?.root;
  async function operationChanged() {
    if (!repo) return;
    const root = repo.root;
    const input = { scope, filter: filterRef.current };
    const updated = await request(
      'log',
      logInput(root, input.scope, input.filter),
    );
    if (currentRoot.current !== root) return;
    loaded.current = input;
    setRepo((current) => (current?.root === root ? updated : current));
    setComparison({ kind: 'working' });
    setGeneration((n) => n + 1);
  }
  useEffect(() => {
    if (!editorMode) return;
    if (typeof window.orca?.document?.session !== 'function') {
      setError(
        '이 Orca는 document.session을 지원하지 않습니다. Orca를 업데이트하세요.',
      );
      return;
    }
    let disposed = false;
    let stop: (() => void) | undefined;
    let session:
      | Awaited<
          ReturnType<
            NonNullable<NonNullable<typeof window.orca>['document']>['session']
          >
        >
      | undefined;
    const receive = (raw: string) => {
      try {
        const d = JSON.parse(raw) as Descriptor;
        if (typeof d.repo !== 'string' || !d.comparison)
          throw new Error('유효한 .orcadiff 문서가 아닙니다.');
        checkDescriptorVersion(d);
        setRepo({ root: d.repo, branch: '', head: null, commits: [] });
        setComparison(d.comparison);
        view.pendingPath.current = d.path ?? '';
        setGeneration((n) => n + 1);
      } catch (e) {
        setError(message(e));
      }
    };
    window
      .orca!.document!.session()
      .then((s) => {
        if (disposed) {
          s.dispose();
          return;
        }
        session = s;
        receive(s.value);
        stop = s.onReplace(receive);
      })
      .catch((e) => setError(message(e)));
    return () => {
      disposed = true;
      stop?.();
      session?.dispose();
    };
  }, []);
  // 필터만 바뀌면 보던 비교를 유지하고, 선택 커밋이 목록에서 빠질 때만 작업 트리로 돌린다.
  function showLog(
    updated: Repository,
    input: LogRequest,
    keepComparison: boolean,
  ) {
    loaded.current = input;
    setRepo(updated);
    if (keepComparison) {
      setComparison((current) =>
        current.kind === 'commit' &&
        !updated.commits.some((commit) => commit.hash === current.commit)
          ? { kind: 'working' }
          : current,
      );
      return;
    }
    setComparison({ kind: 'working' });
    setGeneration((n) => n + 1);
  }
  function refreshDemo(keepComparison = false) {
    const input = { scope: scopeRef.current, filter: filterRef.current };
    showLog(
      scenario === 'empty'
        ? { ...fixtureRepo, commits: [], head: null }
        : fixtureLog(input.scope, effectiveFilter(input.scope, input.filter)),
      input,
      keepComparison,
    );
  }
  useEffect(() => {
    if (demo && !editorMode) refreshDemo();
  }, []);
  useEffect(() => {
    if (demo || editorMode) return;
    let active = true;
    async function load(workspaceId?: string, resetScope = !!workspaceId) {
      if (!active) return;
      const seq = ++logSeq.current;
      const previousRoot = currentRoot.current;
      setBusy(true);
      setError('');
      setRepo(null);
      setSet(null);
      setData(null);
      setWorkspace('');
      setChoices([]);
      setConnectionNote('열린 워크트리에 연결하는 중…');
      try {
        const result = await request('active', {
          all: false,
          ...(workspaceId ? { workspaceId } : {}),
        });
        if (!active || seq !== logSeq.current) return;
        if (result.status === 'connected') {
          const reset =
            resetScope ||
            (!!previousRoot && previousRoot !== result.repository.root);
          let selection = reset ? 'current' : scopeRef.current;
          const filter = reset ? {} : filterRef.current;
          requestedFilter.current = filterKey(filter);
          const missing =
            selection !== 'current' &&
            selection !== 'all' &&
            !(result.repository.branches ?? []).some(
              (branch) => branch.ref === selection,
            );
          if (missing) selection = 'current';
          const repository =
            selection === 'current' && !hasFilter(filter)
              ? result.repository
              : await request(
                  'log',
                  logInput(result.repository.root, selection, filter),
                );
          if (!active || seq !== logSeq.current) return;
          if (reset) {
            resetFilter();
            setBaseCommit(null);
          }
          scopeRef.current = selection;
          loaded.current = { scope: selection, filter };
          setScope(selection);
          setBranchNote(
            missing ? '선택한 브랜치가 없어 현재 브랜치를 표시합니다.' : '',
          );
          setRepo(repository);
          setWorkspace(result.workspace.id);
          setComparison({ kind: 'working' });
          setFileSearch('');
          setGeneration((n) => n + 1);
          setConnectionNote(`열린 워크트리 · ${result.workspace.name}`);
        } else {
          setChoices(result.choices);
          setConnectionNote(result.message);
        }
      } catch (e) {
        if (active && seq === logSeq.current) {
          setError(message(e));
          setConnectionNote(
            '자동 연결에 실패했습니다. Orca에서 로컬 Git 워크트리를 열고 새로고침하세요.',
          );
        }
      } finally {
        if (active && seq === logSeq.current) setBusy(false);
      }
    }
    connectActive.current = (id) => {
      void load(id);
    };
    const stop = window.orca?.on?.('workspace.changed', () => {
      void load(undefined, true);
    });
    void load();
    return () => {
      active = false;
      connectActive.current = () => {};
      if (typeof stop === 'function') stop();
    };
  }, [autoTick]);
  // true는 목록이 바뀌었거나 더 새 요청이 이어받은 경우이고, false는 요청이 실패해 이전 목록이 남은 경우다.
  async function loadLog(
    next: string,
    keepComparison = false,
  ): Promise<boolean> {
    if (!repo) return false;
    const previous = scopeRef.current;
    const root = repo.root;
    const seq = ++logSeq.current;
    const filter = filterRef.current;
    scopeRef.current = next;
    setScope(next);
    setBranchNote('');
    requestedFilter.current = filterKey(filter);
    if (demo) {
      refreshDemo(keepComparison);
      return true;
    }
    setBusy(true);
    setError('');
    try {
      const updated = await request('log', {
        ...logInput(root, next, filter),
        cancelKey: 'filter',
      });
      if (seq !== logSeq.current || currentRoot.current !== root) return true;
      showLog(updated, { scope: next, filter }, keepComparison);
      return true;
    } catch (e) {
      if (seq === logSeq.current && currentRoot.current === root) {
        scopeRef.current = previous;
        setScope(previous);
        setError(message(e));
        return false;
      }
      return true;
    } finally {
      if (seq === logSeq.current) setBusy(false);
    }
  }
  // actionBusy는 커밋 메뉴 hook이 저장소에 의존해 여기로 넘길 수 없으므로 호출 측에서 막는다.
  async function selectScope(next: string) {
    if (!repo || busy) return;
    await loadLog(next);
  }
  // 필터 요청은 busy여도 보낸다. 앞선 요청은 logSeq로 버려지므로 최신 입력만 반영된다.
  const currentFilterKey = filterKey(filter);
  useEffect(() => {
    if (editorMode || !repo || currentFilterKey === requestedFilter.current)
      return;
    void loadLog(scopeRef.current, true);
  }, [currentFilterKey, repo?.root]);
  // 페이지 커서가 낡았을 때 같은 조건으로 첫 페이지부터 다시 받는다.
  function reloadLog() {
    return loadLog(scopeRef.current, true);
  }
  function refresh() {
    if (editorMode) {
      if (view.comparison.kind === 'working')
        setComparison({ kind: 'working' });
      setGeneration((n) => n + 1);
    } else if (demo) refreshDemo();
    else setAutoTick((n) => n + 1);
  }
  return {
    repo,
    choices,
    connectionNote,
    connectActive,
    scope,
    branchNote,
    workspace,
    selectScope,
    operationChanged,
    refresh,
    logSeq,
    loaded,
    reloadLog,
  };
}
