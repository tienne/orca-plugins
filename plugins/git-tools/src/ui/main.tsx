import {
  t,
  useLocale,
  formatDate,
  formatNumber,
  setPreviewLocale,
} from './i18n';
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
import { fixtureDiff, fixtureRepo, fixtureSet, fixtureLog } from './fixture';
import { layout } from './graph';
import { DiffView } from './DiffView';
import { BranchPicker } from './BranchPicker';
import { PaneResizer, usePaneLayout } from './PaneResizer';
import { CommitActions, type CommitMenu } from './CommitActions';
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
  const locale = useLocale();
  const [repo, setRepo] = useState<Repository | null>(
    demo
      ? scenario === 'empty'
        ? { ...fixtureRepo, commits: [], head: null }
        : fixtureRepo
      : null,
  );
  const historyRef = useRef<HTMLElement>(null);
  usePaneLayout(historyRef, repo?.root);
  const [autoTick, setAutoTick] = useState(0);
  const [choices, setChoices] = useState<WorkspaceChoice[]>([]);
  const [connectionNote, setConnectionNote] =
    useState('열린 워크트리에 연결하는 중…');
  const connectActive = useRef<(workspaceId?: string) => void>(() => {});
  const [scope, setScope] = useState('current');
  const scopeRef = useRef('current');
  const all = scope === 'all';
  const [branchNote, setBranchNote] = useState('');
  const [search, setSearch] = useState('');
  const [comparison, setComparison] = useState<Comparison>({ kind: 'working' });
  const [set, setSet] = useState<ChangeSet | null>(null);
  const [file, setFile] = useState('');
  const [data, setData] = useState<FileDiff | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [commitMenu, setCommitMenu] = useState<CommitMenu | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingDiff, setLoadingDiff] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [fileSearch, setFileSearch] = useState('');
  const [theme, setTheme] = useState('system');
  const [workspace, setWorkspace] = useState('');
  const logSeq = useRef(0);
  const openingEditor = useRef(false);
  const pendingPath = useRef('');
  const currentRoot = useRef(repo?.root);
  currentRoot.current = repo?.root;
  useEffect(() => {
    setCommitMenu(null);
  }, [repo?.root, workspace]);
  async function operationChanged() {
    if (!repo) return;
    const root = repo.root;
    const updated = await request('log', {
      repo: root,
      all,
      ...(scope !== 'current' && scope !== 'all' ? { branchRef: scope } : {}),
    });
    if (currentRoot.current !== root) return;
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
        : fixtureLog(scopeRef.current),
    );
    setComparison({ kind: 'working' });
    setGeneration((n) => n + 1);
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
          let selection =
            resetScope ||
            (previousRoot && previousRoot !== result.repository.root)
              ? 'current'
              : scopeRef.current;
          const missing =
            selection !== 'current' &&
            selection !== 'all' &&
            !(result.repository.branches ?? []).some(
              (branch) => branch.ref === selection,
            );
          if (missing) selection = 'current';
          const repository =
            selection === 'current'
              ? result.repository
              : await request('log', {
                  repo: result.repository.root,
                  all: selection === 'all',
                  ...(selection !== 'all' ? { branchRef: selection } : {}),
                });
          if (!active || seq !== logSeq.current) return;
          scopeRef.current = selection;
          setScope(selection);
          setBranchNote(
            missing ? '선택한 브랜치가 없어 현재 브랜치를 표시합니다.' : '',
          );
          setRepo(repository);
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
      void load(undefined, true);
    });
    void load();
    return () => {
      active = false;
      connectActive.current = () => {};
      if (typeof stop === 'function') stop();
    };
  }, [autoTick]);
  async function selectScope(next: string) {
    if (!repo || busy || actionBusy) return;
    const previous = scopeRef.current;
    const root = repo.root;
    const seq = ++logSeq.current;
    scopeRef.current = next;
    setScope(next);
    setBranchNote('');
    if (demo) {
      refreshDemo();
      return;
    }
    setBusy(true);
    setError('');
    try {
      const updated = await request('log', {
        repo: root,
        all: next === 'all',
        ...(next !== 'current' && next !== 'all' ? { branchRef: next } : {}),
      });
      if (seq !== logSeq.current || currentRoot.current !== root) return;
      setRepo(updated);
      setComparison({ kind: 'working' });
      setGeneration((n) => n + 1);
    } catch (e) {
      if (seq === logSeq.current && currentRoot.current === root) {
        scopeRef.current = previous;
        setScope(previous);
        setError(message(e));
      }
    } finally {
      if (seq === logSeq.current) setBusy(false);
    }
  }
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
  async function openEditor(path: string) {
    if (
      !repo ||
      !set ||
      !workspace ||
      loadingFiles ||
      busy ||
      actionBusy ||
      openingEditor.current
    )
      return;
    openingEditor.current = true;
    setBusy(true);
    setError('');
    try {
      await request('open', {
        descriptor: {
          version: 1,
          repo: repo.root,
          comparison: set.comparison,
          path,
        },
        workspaceId: workspace,
      });
    } catch (e) {
      setError(message(e));
    } finally {
      openingEditor.current = false;
      setBusy(false);
    }
  }
  const files = (
    <section className="files" id="changed-files">
      <div className="section-heading">
        <b>{t('변경 파일')}</b>
        <span>{formatNumber(set?.files.length ?? 0)}</span>
      </div>
      <input
        aria-label={t('파일 검색')}
        placeholder={t('파일 이름으로 찾기')}
        value={fileSearch}
        onChange={(e) => setFileSearch(e.target.value)}
      />
      {loadingFiles ? (
        <p className="state" role="status">
          {t('변경 파일을 읽는 중…')}{' '}
        </p>
      ) : set?.files.length === 0 ? (
        <p className="state">{t('이 비교 기준에는 변경 파일이 없습니다.')}</p>
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
                onDoubleClick={() => {
                  if (!editorMode && !demo) void openEditor(f.path);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !editorMode && !demo) {
                    event.preventDefault();
                    setFile(f.path);
                    void openEditor(f.path);
                  }
                }}
                aria-keyshortcuts={!editorMode && !demo ? 'Enter' : undefined}
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
                      f.conflict && t('충돌'),
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
            ) && <p className="state">{t('검색 결과가 없습니다.')}</p>}
        </div>
      )}
      {!editorMode && !demo && (
        <small
          className="file-open-hint"
          title={t(
            '저장소의 .orca/git-tools/에 비교 문서를 생성합니다. Git에서 무시되지 않으면 untracked로 표시됩니다.',
          )}
        >
          {t('더블클릭 또는 Enter로 Diff 열기')}
        </small>
      )}
    </section>
  );
  return (
    <main
      className={`${editorMode ? 'editor-mode' : demo ? 'demo-mode' : 'panel-mode'}`}
    >
      {demo && (
        <div className="demo-banner">
          <b>DEMO</b> {t('실제 Git 데이터 아님 · 브라우저 fixture')}{' '}
          <select
            aria-label={t('미리보기 상태')}
            value={scenario}
            onChange={(e) => {
              const url = new URL(location.href);
              if (e.target.value === 'default')
                url.searchParams.delete('fixture');
              else url.searchParams.set('fixture', e.target.value);
              location.search = url.search;
            }}
          >
            <option value="default">{t('일반 변경')}</option>
            <option value="empty">{t('빈 저장소')}</option>
            <option value="unchanged">{t('변경 없음')}</option>
            <option value="loading">{t('로딩')}</option>
            <option value="error">{t('오류')}</option>
          </select>
          <select
            aria-label={t('미리보기 언어')}
            value={locale.startsWith('ko') ? 'ko' : 'en'}
            onChange={(e) => setPreviewLocale(e.target.value)}
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
          <select
            aria-label={t('미리보기 테마')}
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="system">{t('시스템 테마')}</option>
            <option value="dark">{t('다크')}</option>
            <option value="light">{t('라이트')}</option>
          </select>
        </div>
      )}
      <header className="app-header">
        <div>
          <h1>{editorMode ? 'Git Diff' : 'Git Logs'}</h1>
          <span className="subtle">
            {editorMode ? t('읽기 전용 비교') : t('로컬 Git')}
          </span>
        </div>
        <button
          disabled={busy || actionBusy}
          onClick={() =>
            editorMode
              ? (comparison.kind === 'working' &&
                  setComparison({ kind: 'working' }),
                setGeneration((n) => n + 1))
              : demo
                ? refreshDemo()
                : setAutoTick((n) => n + 1)
          }
          title={t('새로고침')}
        >
          {t('↻ 새로고침')}{' '}
        </button>
      </header>
      {error && (
        <div className="error" role="alert">
          {t(error)}
        </div>
      )}
      <div className="workspace-layout">
        {!editorMode && (
          <aside
            className="history"
            ref={historyRef}
            data-layout-kind={demo ? 'preview' : 'panel'}
          >
            {!demo && (
              <div className="workspace-connect">
                <small role="status">{t(connectionNote)}</small>
                {choices.length > 0 && (
                  <select
                    aria-label={t('연결할 워크트리')}
                    value=""
                    disabled={busy || actionBusy}
                    onChange={(e) => connectActive.current(e.target.value)}
                  >
                    <option value="">{t('워크트리 선택')}</option>
                    {choices.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} · {w.branch ?? t('브랜치 없음')} · {w.path}
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
                  <BranchPicker
                    branches={repo.branches ?? []}
                    value={scope}
                    disabled={busy || actionBusy}
                    onChange={(value) => void selectScope(value)}
                  />
                  {branchNote && <small role="status">{t(branchNote)}</small>}
                  <input
                    aria-label={t('커밋 검색')}
                    placeholder={t('커밋 · 작성자 · 해시 검색')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button
                  className={`working-row ${comparison.kind === 'working' ? 'selected' : ''}`}
                  onClick={() => setComparison({ kind: 'working' })}
                >
                  {t('◉ 작업 트리')} <small>{t('HEAD ↔ 현재 디스크')}</small>
                </button>
                <div className="section-heading">
                  <b>
                    {search ? t('검색 결과 · 그래프 생략') : t('커밋 그래프')}
                  </b>
                  <span>
                    {formatNumber(visible.length)} {t('/ 최대 200')}
                  </span>
                </div>
                <div className="commit-list" aria-busy={busy}>
                  {busy && (
                    <p className="state" role="status">
                      {t('Git 조회 중…')}
                    </p>
                  )}
                  {!busy &&
                    visible.map(({ commit, row }) => (
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
                        aria-haspopup="menu"
                        onContextMenu={(event) => {
                          event.preventDefault();
                          if (busy || actionBusy) return;
                          const rect =
                            event.currentTarget.getBoundingClientRect();
                          setCommitMenu({
                            commit,
                            x: event.clientX || rect.left + 24,
                            y: event.clientY || rect.top + 20,
                          });
                        }}
                        onKeyDown={(event) => {
                          if (
                            event.key === 'F10' &&
                            event.shiftKey &&
                            !busy &&
                            !actionBusy
                          ) {
                            event.preventDefault();
                            const rect =
                              event.currentTarget.getBoundingClientRect();
                            setCommitMenu({
                              commit,
                              x: rect.left + 24,
                              y: rect.top + 20,
                            });
                          }
                        }}
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
                          <small className="commit-meta">
                            <span
                              className="commit-author"
                              title={commit.author}
                            >
                              {commit.author}
                            </span>
                            <time
                              className="commit-date"
                              dateTime={commit.date}
                              title={formatDate(commit.date, true)}
                            >
                              {formatDate(commit.date)}
                            </time>
                            <code className="commit-hash" title={commit.hash}>
                              {commit.hash.slice(0, 7)}
                            </code>
                          </small>
                        </span>
                      </button>
                    ))}
                  {!busy && !visible.length && (
                    <p className="state">
                      {search
                        ? t('일치하는 커밋이 없습니다.')
                        : t(
                            '커밋이 없습니다. 최초 커밋 전에도 작업 트리를 비교할 수 있습니다.',
                          )}
                    </p>
                  )}
                </div>
                <PaneResizer pane="details" />
                <section className="details" id="commit-details">
                  {selected ? (
                    <>
                      <div className="section-heading">
                        <b>{t('커밋 정보')}</b>
                        <code>{selected.hash.slice(0, 7)}</code>
                      </div>
                      <pre>{selected.message}</pre>
                      <small>
                        {selected.author} · {formatDate(selected.date, true)}
                      </small>
                      <code className="hash">{selected.hash}</code>
                      {selected.parents.length > 1 && (
                        <label>
                          {t('Merge 부모')}{' '}
                          <select
                            aria-label={t('비교할 merge 부모')}
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
                                {t('부모')} {i + 1} · {p.slice(0, 7)}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                      {selected.parents.length === 0 && (
                        <p>{t('최초 커밋 · 빈 트리와 비교')}</p>
                      )}
                    </>
                  ) : (
                    <p>{t('커밋을 선택하면 상세 정보를 볼 수 있습니다.')}</p>
                  )}
                </section>
              </>
            ) : (
              <div className="state">
                <h2>{t('열린 워크트리 연결')}</h2>
                <p>
                  {t(
                    'Orca에서 로컬 Git 워크트리를 열면 자동으로 연결됩니다. SSH는 지원하지 않습니다.',
                  )}{' '}
                </p>
              </div>
            )}
            {!demo && repo && (
              <>
                <PaneResizer pane="files" />
                {files}
              </>
            )}
          </aside>
        )}
        {(demo || editorMode) && (
          <section className="comparison">
            <div className="comparison-heading">
              <div>
                <span className="eyebrow">{t('좌우 비교')}</span>
                <h2 title={file}>
                  {file ? file.split('/').pop() : t('변경 파일 비교')}
                </h2>
                <small title={file}>{file}</small>
              </div>
              <span className="readonly">{t('읽기 전용')}</span>
            </div>
            <div className="diff-layout">
              {files}
              <div className="diff-content">
                {loadingFiles || loadingDiff ? (
                  <div className="state" role="status">
                    {t('비교 내용을 읽는 중…')}{' '}
                  </div>
                ) : data && set ? (
                  <DiffView data={data} left={set.left} right={set.right} />
                ) : (
                  <div className="state">
                    <h3>
                      {error
                        ? t('비교를 불러올 수 없습니다')
                        : t('비교할 파일을 선택하세요')}
                    </h3>
                    {editorMode && (
                      <p>
                        {t(
                          '사이드바에서 문서에 기록된 저장소에 연결한 후 새로고침하세요.',
                        )}{' '}
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
            ? t('Git 조회 중…')
            : demo
              ? t('브라우저 미리보기')
              : actionBusy
                ? t('Git 변경 명령 실행 중…')
                : editorMode
                  ? t('LOCAL GIT · 읽기 전용 비교')
                  : t('로컬 Git')}
        </span>
        <span>
          {editorMode
            ? t('문서에 기록된 기준으로 비교 · 동기 스크롤')
            : t('커밋 우클릭 · 작업 메뉴 (Shift+F10)')}
        </span>
      </footer>
      {!editorMode && repo && (
        <CommitActions
          key={`${repo.root}:${workspace}`}
          repo={repo}
          workspaceId={workspace}
          menu={commitMenu}
          closeMenu={() => setCommitMenu(null)}
          changed={operationChanged}
          running={setActionBusy}
        />
      )}
    </main>
  );
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
