import {
  t,
  useLocale,
  formatDate,
  formatNumber,
  setPreviewLocale,
} from './i18n';
import {
  StrictMode,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { createRoot } from 'react-dom/client';
import { LOAD_LIMIT, descriptorVersion, type Commit } from '../protocol';
import { request } from './client';
import { DiffView } from './DiffView';
import { BranchPicker } from './BranchPicker';
import { PaneResizer, usePaneLayout } from './PaneResizer';
import { CommitActions } from './CommitActions';
import { FileActions, type FileMenu } from './FileActions';
import { demo, editorMode, message, scenario } from './env';
import { useComparison, useComparisonLoader } from './hooks/useComparison';
import { useRepository } from './hooks/useRepository';
import { useCommitPages } from './hooks/useCommitPages';
import { ROW_HEIGHT, useRowWindow } from './hooks/useRowWindow';
import { RefLabels } from './RefLabels';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import { useCommitMenu } from './hooks/useCommitMenu';
import { useCommitMessage } from './hooks/useCommitMessage';
import { filterLabels, hasFilter, useLogFilter } from './hooks/useLogFilter';
import './styles.css';
const ROW_MID = ROW_HEIGHT / 2;
const ROW_CURVE = (ROW_HEIGHT * 3) / 4;
const colors = [
  'var(--graph-blue)',
  'var(--graph-purple)',
  'var(--graph-teal)',
  'var(--graph-amber)',
  'var(--graph-pink)',
];
function App() {
  const locale = useLocale();
  const logFilter = useLogFilter();
  const filtered = hasFilter(logFilter.filter);
  // 좁은 패널에서 커밋 목록 높이를 지키려고 필터 입력은 접어 두고, 적용된 필터는 칩으로 항상 보인다.
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [theme, setTheme] = useState('system');
  const openingEditor = useRef(false);
  const [fileMenu, setFileMenu] = useState<FileMenu | null>(null);
  const view = useComparison();
  const {
    comparison,
    setComparison,
    set,
    file,
    setFile,
    data,
    loadingFiles,
    loadingDiff,
    fileSearch,
    setFileSearch,
    baseCommit,
    setBaseCommit,
    compareWithBase,
    changeMergeBase,
    historyPath,
  } = view;
  const {
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
  } = useRepository({
    comparison: view,
    busy,
    setBusy,
    setError,
    filter: logFilter.filter,
    resetFilter: logFilter.clearAll,
  });
  const historyRef = useRef<HTMLElement>(null);
  usePaneLayout(historyRef, repo?.root);
  const { commitMenu, setCommitMenu, actionBusy, setActionBusy } =
    useCommitMenu(repo?.root, workspace);
  useEffect(() => {
    if (!demo) return;
    document.documentElement.classList.remove('dark', 'light');
    if (theme !== 'system') document.documentElement.classList.add(theme);
  }, [theme]);
  useComparisonLoader(repo, view, setError);
  useEffect(() => {
    setFileMenu(null);
  }, [repo?.root, workspace, set]);
  // 전체 브랜치 범위에서는 UI가 follow를 빼고 요청하므로 칩과 안내를 거기에 맞춘다.
  const followBlocked =
    scope === 'all' && !!logFilter.filter.path && !!logFilter.filter.follow;
  const pages = useCommitPages({ repo, logSeq, loaded, reloadLog });
  const { commits, rows, graphWidth } = pages;
  const selectedIndex =
    comparison.kind === 'commit'
      ? commits.findIndex((c) => c.hash === comparison.commit)
      : -1;
  const selected = selectedIndex >= 0 ? commits[selectedIndex] : undefined;
  const [listElement, setListElement] = useState<HTMLDivElement | null>(null);
  const [focusedHash, setFocusedHash] = useState<string | null>(null);
  const focusedIndex = useMemo(
    () => (focusedHash ? commits.findIndex((c) => c.hash === focusedHash) : -1),
    [commits, focusedHash],
  );
  // 선택 행과 포커스 행은 창 밖으로 스크롤돼도 남겨 Shift+F10 메뉴와 포커스를 잃지 않게 한다.
  const { segments, lastVisible } = useRowWindow(
    listElement,
    commits.length,
    [selectedIndex, focusedIndex],
    repo,
  );
  const [fileListElement, setFileListElement] = useState<HTMLDivElement | null>(
    null,
  );
  const visibleFiles = useMemo(
    () =>
      (set?.files ?? []).filter((f) =>
        f.path.toLowerCase().includes(fileSearch.toLowerCase()),
      ),
    [set, fileSearch],
  );
  function selectCommit(commit: Commit) {
    // 파일 히스토리 목록이면 changes 응답 뒤 그 파일을 고르도록 알려 준다.
    historyPath.current = logFilter.filter.path ?? '';
    setComparison({
      kind: 'commit',
      commit: commit.hash,
      parent: commit.parents[0],
    });
  }
  const { graphArea, filesArea } = useKeyboardNav({
    graph: {
      count: commits.length,
      selectedIndex,
      listElement,
      enabled: !busy && !editorMode,
      select: (index) => selectCommit(commits[index]),
    },
    files: {
      paths: visibleFiles.map((f) => f.path),
      selected: file,
      listElement: fileListElement,
      select: (path) => {
        setError('');
        setFile(path);
      },
    },
    blocked: commitMenu !== null || fileMenu !== null,
  });
  // 스크롤로 끝에 닿은 경우만 실패 뒤 재시도를 허용한다.
  useEffect(() => {
    if (!busy) pages.reachEnd(lastVisible, 10, true);
  }, [lastVisible]);
  useEffect(() => {
    if (!busy) pages.reachEnd(lastVisible);
  }, [pages.retry, commits.length, busy]);
  const { body: commitBody, error: commitBodyError } = useCommitMessage(
    repo?.root,
    selected?.hash,
  );
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
      const result = await request('open', {
        descriptor: {
          version: descriptorVersion(set.comparison),
          repo: repo.root,
          comparison: set.comparison,
          path,
        },
        workspaceId: workspace,
      });
      if (result.setupWarning) setError(result.setupWarning);
    } catch (e) {
      setError(message(e));
    } finally {
      openingEditor.current = false;
      setBusy(false);
    }
  }
  const files = (
    <section className="files" id="changed-files" {...filesArea}>
      <div className="section-heading">
        <b>{t('변경 파일')}</b>
        <span>{formatNumber(set?.files.length ?? 0)}</span>
      </div>
      {comparison.kind === 'range' && (
        <label
          className="range-options"
          title={t(
            '끄면 기준과 대상을 직접 비교하고, 켜면 두 지점의 공통 조상에서 대상까지의 변경을 봅니다.',
          )}
        >
          <input
            type="checkbox"
            checked={comparison.mergeBase === true}
            disabled={editorMode}
            onChange={(e) => changeMergeBase(e.target.checked)}
          />
          <span>{t('공통 조상 기준으로 비교')}</span>
          <code>
            {comparison.base.slice(0, 7)}..{comparison.target.slice(0, 7)}
          </code>
        </label>
      )}
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
        <div className="file-list" ref={setFileListElement}>
          {visibleFiles.map((f) => (
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
              onContextMenu={(event) => {
                if (editorMode) return;
                event.preventDefault();
                if (busy || actionBusy) return;
                const rect = event.currentTarget.getBoundingClientRect();
                setFileMenu({
                  path: f.path,
                  x: event.clientX || rect.left + 24,
                  y: event.clientY || rect.top + 20,
                  origin: event.currentTarget,
                });
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !editorMode && !demo) {
                  event.preventDefault();
                  setFile(f.path);
                  void openEditor(f.path);
                } else if (
                  event.key === 'F10' &&
                  event.shiftKey &&
                  !editorMode &&
                  !busy &&
                  !actionBusy
                ) {
                  event.preventDefault();
                  const rect = event.currentTarget.getBoundingClientRect();
                  setFileMenu({
                    path: f.path,
                    x: rect.left + 24,
                    y: rect.top + 20,
                    origin: event.currentTarget,
                  });
                }
              }}
              aria-haspopup={editorMode ? undefined : 'menu'}
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
          {set && set.files.length > 0 && visibleFiles.length === 0 && (
            <p className="state">{t('검색 결과가 없습니다.')}</p>
          )}
        </div>
      )}
      {!editorMode && !demo && (
        <small
          className="file-open-hint"
          title={t(
            '저장소의 .orca/git-logs/에 비교 문서를 생성합니다. Git에서 무시되지 않으면 untracked로 표시됩니다.',
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
          onClick={refresh}
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
            {...graphArea}
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
                    onChange={(value) => {
                      if (!actionBusy) void selectScope(value);
                    }}
                  />
                  {branchNote && <small role="status">{t(branchNote)}</small>}
                  <div className="search-row">
                    <input
                      aria-label={t('커밋 검색')}
                      placeholder={t('커밋 메시지 검색')}
                      maxLength={200}
                      value={logFilter.input.text}
                      onChange={(e) => logFilter.change('text', e.target.value)}
                    />
                    <button
                      className="filter-toggle"
                      aria-expanded={filtersOpen}
                      aria-controls="log-filters"
                      onClick={() => setFiltersOpen((open) => !open)}
                    >
                      {t('필터')}
                    </button>
                  </div>
                  <div
                    className="filter-row"
                    id="log-filters"
                    hidden={!filtersOpen}
                  >
                    <input
                      aria-label={t('작성자')}
                      placeholder={t('작성자')}
                      maxLength={200}
                      value={logFilter.input.author}
                      onChange={(e) =>
                        logFilter.change('author', e.target.value)
                      }
                    />
                    <input
                      aria-label={t('경로')}
                      placeholder={t('경로')}
                      value={logFilter.input.path}
                      onChange={(e) => logFilter.change('path', e.target.value)}
                    />
                    <input
                      type="date"
                      aria-label={t('시작일 (committer date)')}
                      title={t('시작일 (committer date)')}
                      value={logFilter.input.since}
                      onChange={(e) =>
                        logFilter.change('since', e.target.value)
                      }
                    />
                    <input
                      type="date"
                      aria-label={t('종료일 (committer date)')}
                      title={t('종료일 (committer date)')}
                      value={logFilter.input.until}
                      onChange={(e) =>
                        logFilter.change('until', e.target.value)
                      }
                    />
                    <small className="filter-note">
                      {t(
                        '날짜 필터는 committer date 기준입니다. 목록의 날짜는 작성일입니다.',
                      )}
                    </small>
                  </div>
                  {logFilter.chips.length > 0 && (
                    <div className="filter-chips" aria-label={t('적용된 필터')}>
                      {logFilter.chips.map(({ field, value, follow }) => (
                        <span className="filter-chip" key={field}>
                          <span title={value}>
                            {follow
                              ? followBlocked
                                ? `${t('파일')}: ${value}`
                                : t('파일: {p0} (이름 변경 추적)', {
                                    p0: value,
                                  })
                              : `${t(filterLabels[field])}: ${value}`}
                          </span>
                          <button
                            aria-label={t('{p0} 필터 해제', {
                              p0: t(follow ? '파일' : filterLabels[field]),
                            })}
                            onClick={() => logFilter.clear(field)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <button
                        className="filter-clear"
                        onClick={logFilter.clearAll}
                      >
                        {t('모두 해제')}
                      </button>
                    </div>
                  )}
                  {followBlocked && (
                    <small className="follow-note" role="status">
                      {t(
                        '전체 브랜치 보기에서는 이름 변경 추적을 쓸 수 없습니다.',
                      )}
                    </small>
                  )}
                  {baseCommit && (
                    <div className="filter-chips" aria-label={t('비교 기준')}>
                      <span className="filter-chip">
                        <span title={baseCommit}>
                          {t('기준: {p0}', { p0: baseCommit.slice(0, 7) })}
                        </span>
                        <button
                          aria-label={t('비교 기준 해제')}
                          onClick={() => setBaseCommit(null)}
                        >
                          ×
                        </button>
                      </span>
                    </div>
                  )}
                </div>
                <button
                  className={`working-row ${comparison.kind === 'working' ? 'selected' : ''}`}
                  onClick={() => setComparison({ kind: 'working' })}
                >
                  {t('◉ 작업 트리')} <small>{t('HEAD ↔ 현재 디스크')}</small>
                </button>
                <div className="section-heading">
                  <b>
                    {filtered ? t('검색 결과 · 그래프 생략') : t('커밋 그래프')}
                  </b>
                  <span>
                    {formatNumber(commits.length)}{' '}
                    {t('/ 최대 {p0}', { p0: formatNumber(LOAD_LIMIT) })}
                  </span>
                </div>
                {pages.notice && (
                  <small className="page-notice" role="status">
                    {t(pages.notice)}
                  </small>
                )}
                <div
                  className="commit-list"
                  style={{ '--row-height': `${ROW_HEIGHT}px` } as CSSProperties}
                  aria-busy={busy || pages.loading}
                  ref={setListElement}
                >
                  {busy && (
                    <p className="state" role="status">
                      {t('Git 조회 중…')}
                    </p>
                  )}
                  {!busy &&
                    segments.map((segment) => {
                      if ('gap' in segment)
                        return (
                          <div
                            key={`gap-${segment.at}`}
                            className="commit-spacer"
                            style={{ height: segment.gap }}
                            aria-hidden="true"
                          />
                        );
                      const commit = commits[segment.index];
                      const row = rows[segment.index];
                      return (
                        <button
                          key={commit.hash}
                          data-index={segment.index}
                          onFocus={() => setFocusedHash(commit.hash)}
                          onBlur={() =>
                            setFocusedHash((current) =>
                              current === commit.hash ? null : current,
                            )
                          }
                          className={`commit-row ${selected?.hash === commit.hash ? 'selected' : ''}`}
                          onClick={() => selectCommit(commit)}
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
                              origin: event.currentTarget,
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
                                origin: event.currentTarget,
                              });
                            }
                          }}
                        >
                          {!filtered && (
                            <svg
                              width={Math.min(110, graphWidth)}
                              viewBox={`0 0 ${graphWidth} ${ROW_HEIGHT}`}
                              preserveAspectRatio="none"
                              height={ROW_HEIGHT}
                              aria-hidden="true"
                            >
                              <path
                                d={`M${12 + row.lane * 14} 0 V${ROW_MID}`}
                                stroke={colors[row.lane % colors.length]}
                                fill="none"
                                strokeWidth="2"
                              />
                              {row.edges.map((edge, i) => (
                                <path
                                  key={i}
                                  d={`M${12 + edge.from * 14} ${edge.parent ? ROW_MID : 0} C${12 + edge.from * 14} ${ROW_CURVE} ${12 + edge.to * 14} ${ROW_CURVE} ${12 + edge.to * 14} ${ROW_HEIGHT}`}
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
                              title={commit.subject}
                            >
                              {commit.subject}
                            </span>
                            {commit.refs.length > 0 && (
                              <RefLabels refs={commit.refs} />
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
                      );
                    })}
                  {!busy && pages.loading && (
                    <p className="page-state" role="status">
                      {t('이전 커밋을 불러오는 중…')}
                    </p>
                  )}
                  {!busy && pages.pageError && (
                    <p className="page-state page-error" role="alert">
                      {t(pages.pageError)}
                    </p>
                  )}
                  {!busy && pages.limitReached && (
                    <p className="page-state" role="status">
                      {t(
                        '최근 커밋 {p0}개까지만 불러옵니다. 더 오래된 커밋은 검색이나 필터로 찾으세요.',
                        { p0: formatNumber(LOAD_LIMIT) },
                      )}
                    </p>
                  )}
                  {!busy && !commits.length && (
                    <p className="state">
                      {filtered
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
                      <pre>{commitBody ?? selected.subject}</pre>
                      {commitBodyError !== undefined && (
                        <div className="commit-body-error" role="alert">
                          <p>{t('커밋 본문을 불러오지 못했습니다.')}</p>
                          {commitBodyError && (
                            <small className="commit-body-error-reason">
                              {t(commitBodyError)}
                            </small>
                          )}
                        </div>
                      )}
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
        <FileActions
          menu={fileMenu}
          closeMenu={() => setFileMenu(null)}
          showHistory={logFilter.followFile}
        />
      )}
      {!editorMode && repo && (
        <CommitActions
          key={`${repo.root}:${workspace}`}
          repo={repo}
          workspaceId={workspace}
          menu={commitMenu}
          closeMenu={() => setCommitMenu(null)}
          changed={operationChanged}
          running={setActionBusy}
          hasBase={baseCommit !== null}
          setBase={(commit) => setBaseCommit(commit.hash)}
          compareWithBase={(commit) => compareWithBase(commit.hash)}
          clearBase={() => setBaseCommit(null)}
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
