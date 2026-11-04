import { StrictMode, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type {
  ChangeSet,
  Comparison,
  Descriptor,
  FileDiff,
  Repository,
  WorkspaceChoice,
} from '../protocol';
import { request } from './client';
import { fixtureDiff, fixtureRepo, fixtureSet } from './fixture';
import { layout } from './graph';
import { DiffView } from './DiffView';
import './styles.css';
const demo = !window.orca;
const scenario = demo
  ? (new URLSearchParams(location.search).get('fixture') ?? 'default')
  : 'default';
const editorMode = document.body.dataset.surface === 'editor';
const colors = [
  'var(--graph-blue)',
  'var(--graph-purple)',
  'var(--graph-teal)',
  'var(--graph-amber)',
  'var(--graph-pink)',
];
const message = (e: unknown) => (e instanceof Error ? e.message : String(e));
function App() {
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
  const [all, setAll] = useState(false);
  const [search, setSearch] = useState('');
  const [comparison, setComparison] = useState<Comparison>({ kind: 'working' });
  const [set, setSet] = useState<ChangeSet | null>(null);
  const [file, setFile] = useState('');
  const [data, setData] = useState<FileDiff | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingDiff, setLoadingDiff] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [fileSearch, setFileSearch] = useState('');
  const [theme, setTheme] = useState('system');
  const [workspace, setWorkspace] = useState('');
  const logSeq = useRef(0);
  const pendingPath = useRef('');
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
        if (d.version !== 1 || typeof d.repo !== 'string' || !d.comparison)
          throw new Error('유효한 .orcadiff 문서가 아닙니다.');
        setRepo({ root: d.repo, branch: '', head: null, commits: [] });
        setComparison(d.comparison);
        pendingPath.current = d.path ?? '';
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
  useEffect(() => {
    if (!demo) return;
    document.documentElement.classList.remove('dark', 'light');
    if (theme !== 'system') document.documentElement.classList.add(theme);
  }, [theme]);
  function refreshDemo() {
    setRepo(
      scenario === 'empty'
        ? { ...fixtureRepo, commits: [], head: null }
        : fixtureRepo,
    );
    setComparison({ kind: 'working' });
    setGeneration((n) => n + 1);
  }
  useEffect(() => {
    if (demo && !editorMode) refreshDemo();
  }, [all]);
  useEffect(() => {
    if (demo || editorMode) return;
    let active = true;
    async function load(workspaceId?: string) {
      if (!active) return;
      const seq = ++logSeq.current;
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
          all,
          ...(workspaceId ? { workspaceId } : {}),
        });
        if (!active || seq !== logSeq.current) return;
        if (result.status === 'connected') {
          setRepo(result.repository);
          setWorkspace(result.workspace.id);
          setComparison({ kind: 'working' });
          setFileSearch('');
          setSearch('');
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
      void load();
    });
    void load();
    return () => {
      active = false;
      connectActive.current = () => {};
      if (typeof stop === 'function') stop();
    };
  }, [all, autoTick]);
  useEffect(() => {
    if (!repo) return;
    let active = true;
    setLoadingFiles(true);
    setData(null);
    setSet(null);
    setError('');
    (demo
      ? scenario === 'loading'
        ? new Promise<ChangeSet>(() => {})
        : scenario === 'error'
          ? Promise.reject(
              new Error('DEMO 오류 상태 · 저장소 조회 실패 fixture'),
            )
          : Promise.resolve({
              ...fixtureSet,
              ...(scenario === 'empty' || scenario === 'unchanged'
                ? { files: [] }
                : {}),
              comparison,
              left:
                comparison.kind === 'commit'
                  ? (comparison.parent ?? '부모 1')
                  : fixtureSet.left,
              right:
                comparison.kind === 'commit'
                  ? comparison.commit
                  : fixtureSet.right,
            })
      : request('changes', { repo: repo.root, comparison })
    )
      .then((result) => {
        if (active) {
          setSet(result);
          setFile(
            result.files.some((f) => f.path === pendingPath.current)
              ? pendingPath.current
              : (result.files[0]?.path ?? ''),
          );
          pendingPath.current = '';
        }
      })
      .catch((e) => {
        if (active) setError(message(e));
      })
      .finally(() => {
        if (active) setLoadingFiles(false);
      });
    return () => {
      active = false;
    };
  }, [repo?.root, comparison, generation]);
  useEffect(() => {
    setData(null);
    setLoadingDiff(false);
    if (!repo || !file || !set) return;
    let active = true;
    setLoadingDiff(true);
    (demo
      ? Promise.resolve(fixtureDiff(file))
      : request('diff', {
          repo: repo.root,
          comparison: set.comparison,
          path: file,
        })
    )
      .then((result) => {
        if (active) setData(result);
      })
      .catch((e) => {
        if (active) setError(message(e));
      })
      .finally(() => {
        if (active) setLoadingDiff(false);
      });
    return () => {
      active = false;
    };
  }, [repo?.root, set, file]);
  const rows = useMemo(() => layout(repo?.commits ?? []), [repo?.commits]);
  const graphWidth = Math.max(
    44,
    ...rows.map(
      (row) => (Math.max(row.before.length, row.after.length) + 1) * 14,
    ),
  );
  const selected =
    comparison.kind === 'commit'
      ? repo?.commits.find((c) => c.hash === comparison.commit)
      : undefined;
  const visible =
    repo?.commits
      .map((commit, index) => ({ commit, row: rows[index] }))
      .filter(({ commit }) =>
        `${commit.message} ${commit.author} ${commit.hash} ${commit.refs.join(' ')}`
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase()),
      ) ?? [];
  async function openEditor() {
    if (!repo || !set || !workspace) return;
    setBusy(true);
    setError('');
    try {
      await request('open', {
        descriptor: {
          version: 1,
          repo: repo.root,
          comparison: set.comparison,
          path: file,
        },
        workspaceId: workspace,
      });
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  const files = (
    <section className="files">
      <div className="section-heading">
        <b>변경 파일</b>
        <span>{set?.files.length ?? 0}</span>
      </div>
      <input
        aria-label="파일 검색"
        placeholder="파일 이름으로 찾기"
        value={fileSearch}
        onChange={(e) => setFileSearch(e.target.value)}
      />
      {loadingFiles ? (
        <p className="state" role="status">
          변경 파일을 읽는 중…
        </p>
      ) : set?.files.length === 0 ? (
        <p className="state">이 비교 기준에는 변경 파일이 없습니다.</p>
      ) : (
        <div className="file-list">
          {set?.files
            .filter((f) =>
              f.path.toLowerCase().includes(fileSearch.toLowerCase()),
            )
            .map((f) => (
              <button
                className={`file-row ${file === f.path ? 'selected' : ''}`}
                key={f.path}
                onClick={() => {
                  setError('');
                  setFile(f.path);
                }}
                title={`${f.oldPath ? f.oldPath + ' → ' : ''}${f.path}`}
                aria-pressed={file === f.path}
              >
                <span className={`status status-${f.status}`}>{f.status}</span>
                <span className="file-name">
                  {f.path}
                  {f.oldPath && <small>← {f.oldPath}</small>}
                  <small>
                    {[
                      f.staged && 'staged',
                      f.unstaged && 'unstaged',
                      f.untracked && 'untracked',
                      f.conflict && '충돌',
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </small>
                </span>
              </button>
            ))}
          {set &&
            set.files.length > 0 &&
            !set.files.some((f) =>
              f.path.toLowerCase().includes(fileSearch.toLowerCase()),
            ) && <p className="state">검색 결과가 없습니다.</p>}
        </div>
      )}
    </section>
  );
  return (
    <main
      className={`${editorMode ? 'editor-mode' : demo ? 'demo-mode' : 'panel-mode'}`}
    >
      {demo && (
        <div className="demo-banner">
          <b>DEMO</b> 실제 Git 데이터 아님 · 브라우저 fixture
          <select
            aria-label="미리보기 상태"
            value={scenario}
            onChange={(e) => {
              location.search =
                e.target.value === 'default'
                  ? ''
                  : `?fixture=${e.target.value}`;
            }}
          >
            <option value="default">일반 변경</option>
            <option value="empty">빈 저장소</option>
            <option value="unchanged">변경 없음</option>
            <option value="loading">로딩</option>
            <option value="error">오류</option>
          </select>
          <select
            aria-label="미리보기 테마"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="system">시스템 테마</option>
            <option value="dark">다크</option>
            <option value="light">라이트</option>
          </select>
        </div>
      )}
      <header className="app-header">
        <div>
          <span className="brand">⑂</span>
          <h1>{editorMode ? 'Git Diff' : 'Git Logs'}</h1>
          <span className="subtle">LOCAL / READ ONLY</span>
        </div>
        <button
          disabled={busy}
          onClick={() =>
            editorMode
              ? (comparison.kind === 'working' &&
                  setComparison({ kind: 'working' }),
                setGeneration((n) => n + 1))
              : demo
                ? refreshDemo()
                : setAutoTick((n) => n + 1)
          }
          title="새로고침"
        >
          ↻ 새로고침
        </button>
      </header>
      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}
      <div className="workspace-layout">
        {!editorMode && (
          <aside className="history">
            {!demo && (
              <div className="workspace-connect">
                <small role="status">{connectionNote}</small>
                {choices.length > 0 && (
                  <select
                    aria-label="연결할 워크트리"
                    value=""
                    disabled={busy}
                    onChange={(e) => connectActive.current(e.target.value)}
                  >
                    <option value="">워크트리 선택</option>
                    {choices.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} · {w.branch ?? '브랜치 없음'} · {w.path}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
            {repo ? (
              <>
                <div className="repo-heading" title={repo.root}>
                  <b>{repo.root.split('/').pop()}</b>
                  <span>⑂ {repo.branch}</span>
                </div>
                <div className="history-controls">
                  <select
                    aria-label="브랜치 범위"
                    value={all ? 'all' : 'current'}
                    onChange={(e) => setAll(e.target.value === 'all')}
                    disabled={busy}
                  >
                    <option value="current">현재 브랜치</option>
                    <option value="all">전체 브랜치</option>
                  </select>
                  <input
                    aria-label="커밋 검색"
                    placeholder="커밋 · 작성자 · 해시 검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button
                  className={`working-row ${comparison.kind === 'working' ? 'selected' : ''}`}
                  onClick={() => setComparison({ kind: 'working' })}
                >
                  ◉ 작업 트리 <small>HEAD ↔ 현재 디스크</small>
                </button>
                <div className="section-heading">
                  <b>{search ? '검색 결과 · 그래프 생략' : '커밋 그래프'}</b>
                  <span>{visible.length} / 최대 200</span>
                </div>
                <div className="commit-list">
                  {visible.map(({ commit, row }) => (
                    <button
                      key={commit.hash}
                      className={`commit-row ${selected?.hash === commit.hash ? 'selected' : ''}`}
                      onClick={() =>
                        setComparison({
                          kind: 'commit',
                          commit: commit.hash,
                          parent: commit.parents[0],
                        })
                      }
                      aria-pressed={selected?.hash === commit.hash}
                    >
                      {!search && (
                        <svg
                          width={Math.min(110, graphWidth)}
                          viewBox={`0 0 ${graphWidth} 64`}
                          preserveAspectRatio="none"
                          height="64"
                          aria-hidden="true"
                        >
                          <path
                            d={`M${12 + row.lane * 14} 0 V32`}
                            stroke={colors[row.lane % colors.length]}
                            fill="none"
                            strokeWidth="2"
                          />
                          {row.edges.map((edge, i) => (
                            <path
                              key={i}
                              d={`M${12 + edge.from * 14} ${edge.parent ? 32 : 0} C${12 + edge.from * 14} 48 ${12 + edge.to * 14} 48 ${12 + edge.to * 14} 64`}
                              fill="none"
                              stroke={
                                colors[
                                  (edge.parent ? edge.to : edge.from) %
                                    colors.length
                                ]
                              }
                              strokeWidth="2"
                            />
                          ))}
                          <circle
                            cx={12 + row.lane * 14}
                            cy="32"
                            r="4"
                            fill={colors[row.lane % colors.length]}
                          />
                        </svg>
                      )}
                      <span className="commit-content">
                        <span
                          className="commit-subject"
                          title={commit.message.split('\n')[0]}
                        >
                          {commit.message.split('\n')[0]}
                        </span>
                        {commit.refs.length > 0 && (
                          <span className="refs">
                            {commit.refs.map((ref) => (
                              <em key={ref} title={ref}>
                                {ref}
                              </em>
                            ))}
                          </span>
                        )}
                        <small>
                          {commit.author}{' '}
                          <span>
                            {new Date(commit.date).toLocaleDateString()} ·{' '}
                            {commit.hash.slice(0, 7)}
                          </span>
                        </small>
                      </span>
                    </button>
                  ))}
                  {!visible.length && (
                    <p className="state">
                      {search
                        ? '일치하는 커밋이 없습니다.'
                        : '커밋이 없습니다. 최초 커밋 전에도 작업 트리를 비교할 수 있습니다.'}
                    </p>
                  )}
                </div>
                <section className="details">
                  {selected ? (
                    <>
                      <div className="section-heading">
                        <b>커밋 정보</b>
                        <code>{selected.hash.slice(0, 7)}</code>
                      </div>
                      <pre>{selected.message}</pre>
                      <small>
                        {selected.author} ·{' '}
                        {new Date(selected.date).toLocaleString()}
                      </small>
                      <code className="hash">{selected.hash}</code>
                      {selected.parents.length > 1 && (
                        <label>
                          Merge 부모
                          <select
                            aria-label="비교할 merge 부모"
                            value={
                              comparison.kind === 'commit'
                                ? comparison.parent
                                : ''
                            }
                            onChange={(e) =>
                              selected &&
                              setComparison({
                                kind: 'commit',
                                commit: selected.hash,
                                parent: e.target.value,
                              })
                            }
                          >
                            {selected.parents.map((p, i) => (
                              <option key={p} value={p}>
                                부모 {i + 1} · {p.slice(0, 7)}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                      {selected.parents.length === 0 && (
                        <p>최초 커밋 · 빈 트리와 비교</p>
                      )}
                    </>
                  ) : (
                    <p>
                      HEAD → 현재 디스크 최종 내용.
                      <br />
                      staged: HEAD↔index · unstaged: index↔디스크 · untracked:
                      index에 없는 파일.
                      <br />
                      서로 상쇄되어 HEAD와 같은 변경은 목록에서 제외됩니다.
                    </p>
                  )}
                </section>
              </>
            ) : (
              <div className="state">
                <h2>열린 워크트리 연결</h2>
                <p>
                  Orca에서 로컬 Git 워크트리를 열면 자동으로 연결됩니다. SSH는
                  지원하지 않습니다.
                </p>
              </div>
            )}
            {!demo && repo && (
              <>
                {files}
                <div className="open-editor">
                  <button
                    className="primary"
                    disabled={!workspace || !set || busy}
                    onClick={() => void openEditor()}
                  >
                    중앙 Diff 탭 열기 ↗
                  </button>
                  <small>
                    저장소의 .orca/git-tools/에 비교 문서를 생성합니다. Git에서
                    무시되지 않으면 untracked로 표시됩니다.
                  </small>
                </div>
              </>
            )}
          </aside>
        )}
        {(demo || editorMode) && (
          <section className="comparison">
            <div className="comparison-heading">
              <div>
                <span className="eyebrow">SIDE BY SIDE</span>
                <h2 title={file}>
                  {file ? file.split('/').pop() : '변경 파일 비교'}
                </h2>
                <small title={file}>{file}</small>
              </div>
              <span className="readonly">읽기 전용</span>
            </div>
            <div className="diff-layout">
              {files}
              <div className="diff-content">
                {loadingFiles || loadingDiff ? (
                  <div className="state" role="status">
                    비교 내용을 읽는 중…
                  </div>
                ) : data && set ? (
                  <DiffView data={data} left={set.left} right={set.right} />
                ) : (
                  <div className="state">
                    <h3>
                      {error
                        ? '비교를 불러올 수 없습니다'
                        : '비교할 파일을 선택하세요'}
                    </h3>
                    {editorMode && (
                      <p>
                        사이드바에서 문서에 기록된 저장소에 연결한 후
                        새로고침하세요.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
      <footer>
        <span>
          {busy
            ? 'Git 조회 중…'
            : demo
              ? 'FIXTURE PREVIEW'
              : 'LOCAL GIT · 읽기 전용'}
        </span>
        <span>
          {editorMode
            ? '문서에 기록된 기준으로 비교 · 동기 스크롤'
            : '체크아웃 · staging · commit 기능 없음'}
        </span>
      </footer>
    </main>
  );
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
