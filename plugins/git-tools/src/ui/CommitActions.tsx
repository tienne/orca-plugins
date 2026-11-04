import { useEffect, useRef, useState } from 'react';
import type {
  Commit,
  GitAction,
  OperationInput,
  OperationPlan,
  OperationResult,
  Repository,
} from '../protocol';
import { request } from './client';
export interface CommitMenu {
  commit: Commit;
  x: number;
  y: number;
}
const labels: Record<GitAction, string> = {
  checkout: '체크아웃…',
  branch: '여기서 브랜치 생성…',
  merge: '현재 브랜치로 병합…',
  rebase: '현재 브랜치를 여기로 리베이스…',
  'cherry-pick': '체리픽…',
  revert: '리버트…',
  reset: '현재 브랜치를 여기로 리셋…',
};
const menuGroups: { label: string; actions: GitAction[] }[] = [
  { label: '브랜치·이동', actions: ['checkout', 'branch'] },
  { label: '변경 통합', actions: ['merge', 'rebase', 'cherry-pick'] },
  { label: '취소·이력 변경', actions: ['revert', 'reset'] },
];
export function CommitActions({
  repo,
  workspaceId,
  menu,
  closeMenu,
  changed,
  running,
}: {
  repo: Repository;
  workspaceId: string;
  menu: CommitMenu | null;
  closeMenu: () => void;
  changed: () => Promise<void>;
  running: (value: boolean) => void;
}) {
  const demo = !window.orca;
  const [target, setTarget] = useState<Commit | null>(null);
  const [action, setAction] = useState<GitAction>('checkout');
  const [branch, setBranch] = useState('');
  const [resetMode, setResetMode] = useState<'soft' | 'mixed' | 'hard'>(
    'mixed',
  );
  const [mainline, setMainline] = useState('');
  const [plan, setPlan] = useState<OperationPlan | null>(null);
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<OperationResult | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  useEffect(() => {
    if (target && !dialog.current?.open) dialog.current?.showModal();
  }, [target]);
  useEffect(() => {
    if (!menu) return;
    menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [menu]);
  const dismiss = () => {
    if (inFlight.current) return;
    dialog.current?.close();
    setTarget(null);
    setPlan(null);
    setError('');
  };
  function choose(next: GitAction) {
    if (!menu) return;
    setTarget(menu.commit);
    setAction(next);
    setBranch('');
    setMainline('');
    setResetMode('mixed');
    setPlan(null);
    setConfirmation('');
    setError('');
    setResult(null);
    closeMenu();
  }
  async function prepare() {
    if (!target || inFlight.current) return;
    setBusy(true);
    setError('');
    inFlight.current = true;
    const operation: OperationInput = {
      action,
      commit: target.hash,
      ...(branch ? { branch } : {}),
      ...(action === 'reset' ? { resetMode } : {}),
      ...((action === 'cherry-pick' || action === 'revert') &&
      target.parents.length > 1
        ? { mainline: Number(mainline) }
        : {}),
    };
    try {
      if (demo) {
        setPlan({
          token: 'demo',
          action,
          root: repo.root,
          head: repo.head!,
          currentBranch: repo.branch,
          target: target.hash,
          command: ['DEMO', action, target.hash],
          summary:
            'DEMO · 확인 화면 미리보기입니다. 실제 Git 명령은 실행되지 않습니다.',
          confirmation:
            action === 'reset' && resetMode === 'hard'
              ? target.hash.slice(0, 7)
              : '',
        });
      } else
        setPlan(
          await request('prepare', { repo: repo.root, workspaceId, operation }),
        );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  async function execute() {
    if (!plan || inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    running(true);
    setError('');
    try {
      const response: OperationResult = demo
        ? {
            status: 'success',
            message: 'DEMO: 실제 Git 명령을 실행하지 않았습니다.',
            conflicts: [],
          }
        : await request('execute', {
            repo: repo.root,
            workspaceId,
            token: plan.token,
            confirmation,
          });
      setResult(response);
      setPlan(null);
      dialog.current?.close();
      setTarget(null);
      if (!demo) {
        try {
          await changed();
        } catch (e) {
          setResult({
            ...response,
            message:
              response.message +
              '\n그래프 새로고침 실패: ' +
              (e instanceof Error ? e.message : String(e)),
          });
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setPlan(null);
    } finally {
      inFlight.current = false;
      setBusy(false);
      running(false);
    }
  }
  return (
    <>
      {menu && (
        <>
          <div className="context-dismiss" onPointerDown={closeMenu} />
          <div
            ref={menuRef}
            role="menu"
            aria-label="커밋 작업"
            className="commit-menu"
            style={{
              left: Math.max(8, Math.min(menu.x, window.innerWidth - 260)),
              top: Math.max(8, Math.min(menu.y, window.innerHeight - 380)),
            }}
            onKeyDown={(event) => {
              if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key))
                return;
              event.preventDefault();
              const items = [
                ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
                  'button',
                ),
              ];
              const index = items.indexOf(
                document.activeElement as HTMLButtonElement,
              );
              items[
                event.key === 'Home'
                  ? 0
                  : event.key === 'End'
                    ? items.length - 1
                    : (index +
                        (event.key === 'ArrowDown' ? 1 : -1) +
                        items.length) %
                      items.length
              ]?.focus();
            }}
          >
            <small>{menu.commit.hash.slice(0, 7)} · 커밋 작업</small>
            {menuGroups.map((group) => (
              <div
                key={group.label}
                role="group"
                aria-label={group.label}
                className="commit-menu-group"
              >
                {group.actions.map((item) => (
                  <button
                    key={item}
                    role="menuitem"
                    onClick={() => choose(item)}
                  >
                    {labels[item]}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
      <dialog
        ref={dialog}
        className="operation-dialog"
        aria-labelledby="operation-title"
        onCancel={(event) => {
          event.preventDefault();
          dismiss();
        }}
      >
        {target && (
          <>
            <h2 id="operation-title">
              {labels[action].replace('…', '')}
              {demo ? ' · DEMO' : ''}
            </h2>
            <p className="operation-subject">{target.message.split('\n')[0]}</p>
            <dl>
              <dt>저장소</dt>
              <dd>{repo.root}</dd>
              <dt>현재 브랜치</dt>
              <dd>{plan?.currentBranch ?? repo.branch}</dd>
              <dt>현재 HEAD</dt>
              <dd>
                <code>{plan?.head ?? repo.head}</code>
              </dd>
              <dt>대상 커밋</dt>
              <dd>
                <code>{target.hash}</code>
              </dd>
            </dl>
            {!plan ? (
              <>
                {action === 'branch' && (
                  <label>
                    새 브랜치 이름
                    <input
                      aria-label="새 브랜치 이름"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      disabled={busy}
                    />
                  </label>
                )}
                {action === 'checkout' && (
                  <label>
                    체크아웃 대상
                    <select
                      aria-label="체크아웃 대상"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      disabled={busy}
                    >
                      <option value="">선택 커밋 · Detached HEAD</option>
                      {(repo.localBranches ?? [])
                        .filter((b) => b.hash === target.hash)
                        .map((b) => (
                          <option key={b.name} value={b.name}>
                            {b.name}
                          </option>
                        ))}
                    </select>
                    <small>
                      로컬 브랜치는 해당 커밋을 가리킬 때만 전환합니다. 원격
                      브랜치 생성은 지원하지 않습니다.
                    </small>
                  </label>
                )}
                {action === 'reset' && (
                  <label>
                    리셋 모드
                    <select
                      aria-label="리셋 모드"
                      value={resetMode}
                      onChange={(e) =>
                        setResetMode(e.target.value as typeof resetMode)
                      }
                      disabled={busy}
                    >
                      <option value="soft">
                        Soft · index와 파일 유지 (staged)
                      </option>
                      <option value="mixed">
                        Mixed · 파일 유지 (unstaged)
                      </option>
                      <option value="hard">
                        Hard · index와 작업 트리 교체
                      </option>
                    </select>
                  </label>
                )}
                {(action === 'cherry-pick' || action === 'revert') &&
                  target.parents.length > 1 && (
                    <label>
                      merge 기준 부모
                      <select
                        aria-label="merge 기준 부모"
                        value={mainline}
                        onChange={(e) => setMainline(e.target.value)}
                        disabled={busy}
                      >
                        <option value="">부모를 선택하세요</option>
                        {target.parents.map((p, i) => (
                          <option key={p} value={i + 1}>
                            부모 {i + 1} · {p.slice(0, 7)}
                          </option>
                        ))}
                      </select>
                      <small>
                        선택한 부모에 대한 merge 변경을 적용/취소합니다.
                      </small>
                    </label>
                  )}
                <p className="operation-note">
                  변경 파일과 untracked 파일이 없는 상태에서만 실행합니다. 충돌
                  해결·계속·중단은 터미널에서 처리합니다.
                </p>
              </>
            ) : (
              <>
                <p
                  className={
                    ['reset', 'rebase'].includes(action)
                      ? 'operation-warning'
                      : 'operation-note'
                  }
                >
                  {plan.summary}
                </p>
                <pre className="operation-command">
                  git {plan.command.join(' ')}
                </pre>
                {plan.backupRef && (
                  <p className="operation-note">
                    이전 HEAD 백업: <code>{plan.backupRef}</code>
                  </p>
                )}
                {plan.confirmation && (
                  <label>
                    Hard reset 확인: <code>{plan.confirmation}</code> 입력
                    <input
                      aria-label="Hard reset 확인 해시"
                      autoComplete="off"
                      value={confirmation}
                      onChange={(e) => setConfirmation(e.target.value)}
                      disabled={busy}
                    />
                  </label>
                )}
                <small>
                  확인 이후 HEAD·브랜치·작업 파일이 바뀌면 거절합니다. Git
                  hooks와 커밋 서명은 실행하지 않습니다.
                </small>
              </>
            )}
            {error && (
              <p role="alert" className="operation-warning">
                {error}
              </p>
            )}
            <div className="operation-buttons">
              <button disabled={busy} onClick={dismiss}>
                취소
              </button>
              {plan ? (
                <button
                  disabled={busy || confirmation !== plan.confirmation}
                  onClick={() => void execute()}
                >
                  {busy ? '실행 중…' : demo ? 'DEMO 실행' : '확인하고 실행'}
                </button>
              ) : (
                <button
                  disabled={
                    busy ||
                    (action === 'branch' && !branch) ||
                    ((action === 'cherry-pick' || action === 'revert') &&
                      target.parents.length > 1 &&
                      !mainline)
                  }
                  onClick={() => void prepare()}
                >
                  {busy ? '검사 중…' : '대상과 영향 확인'}
                </button>
              )}
            </div>
          </>
        )}
      </dialog>
      {result && (
        <section
          className={`operation-result operation-${result.status}`}
          role="status"
        >
          <button aria-label="명령 결과 닫기" onClick={() => setResult(null)}>
            ×
          </button>
          <b>
            {result.status === 'success'
              ? 'Git 작업 완료'
              : result.status === 'conflict'
                ? 'Git 충돌 · 터미널 조치 필요'
                : 'Git 작업 미완료'}
          </b>
          <pre>{result.message}</pre>
          {result.conflicts.map((path) => (
            <code key={path}>
              {path}
              <br />
            </code>
          ))}
          {result.backupRef && (
            <p>
              이전 HEAD 백업: <code>{result.backupRef}</code>
            </p>
          )}
        </section>
      )}
    </>
  );
}
