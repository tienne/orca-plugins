import { mkdir, lstat, writeFile, realpath } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import {
  checkDescriptorVersion,
  descriptorVersion,
  type Descriptor,
  type Requests,
  type WorkerApi,
  type WorkspaceContext,
  type WorkspaceChoice,
} from '../protocol';
import { changes, commitMessage, diff, log, repository, git } from './git';
import { createOperations } from './operations';
import { ensureLocalIgnore } from './local-ignore';
export default function activate(orca: WorkerApi): void {
  function requireHost(name: string) {
    if (orca.api?.major !== 1 || orca.api.minor < 3 || !orca.host.has(name))
      throw new Error(
        `이 Orca에서 ${name}을 지원하지 않습니다. Host API 1.3 이상이 필요합니다.`,
      );
  }
  const connected = new Set<string>();
  const operations = createOperations();
  const setupWarning =
    'Git Logs의 로컬 제외 규칙을 설정하지 못했습니다. 저장소 권한과 ignore 규칙을 확인하세요.';
  async function setup(root: string) {
    try {
      await ensureLocalIgnore(root);
    } catch (error) {
      orca.log(
        `Git Logs local exclude setup failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      return setupWarning;
    }
  }
  async function setupWorkspace(created?: {
    workspaceId: string;
    kind: string;
    path: string;
  }) {
    if (created && created.kind !== 'worktree') return;
    requireHost('workspace.list');
    const result = (await orca.host.call('workspace.list', {})) as {
      workspaces: (WorkspaceChoice & { kind: string; hostId: string | null })[];
      truncated?: boolean;
    };
    let selected;
    if (created) {
      selected = result.workspaces.find(
        (w) =>
          w.id === created.workspaceId &&
          w.kind === 'worktree' &&
          (w.hostId === null || w.hostId === 'local'),
      );
      if (
        !selected ||
        (await realpath(selected.path)) !== (await realpath(created.path))
      )
        return;
    } else {
      requireHost('workspace.readContext');
      const context = (await orca.host.call(
        'workspace.readContext',
        {},
      )) as WorkspaceContext | null;
      const matches = result.workspaces.filter(
        (w) =>
          w.name === context?.displayName &&
          (w.branch ?? '') === context?.branch,
      );
      if (result.truncated || matches.length !== 1) return;
      selected = matches[0];
      if (
        selected.kind !== 'worktree' ||
        (selected.hostId !== null && selected.hostId !== 'local')
      )
        return;
    }
    await setup(await repository(selected.path));
  }
  const backgroundSetup = async (created?: {
    workspaceId: string;
    kind: string;
    path: string;
  }) => {
    try {
      await setupWorkspace(created);
    } catch (error) {
      orca.log(
        `Git Logs workspace setup skipped: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };
  orca.events?.on('workspace.created', (event) => backgroundSetup(event));
  orca.events?.on('workspace.changed', () => backgroundSetup());
  async function mutationRoot(root: string, workspaceId: string) {
    check(root);
    requireHost('workspace.list');
    requireHost('workspace.readContext');
    const context = (await orca.host.call(
      'workspace.readContext',
      {},
    )) as WorkspaceContext | null;
    const result = (await orca.host.call('workspace.list', {})) as {
      workspaces: (WorkspaceChoice & { kind: string; hostId: string | null })[];
      truncated: boolean;
    };
    const w = result.workspaces.find((w) => w.id === workspaceId);
    const matches = result.workspaces.filter(
      (candidate) =>
        candidate.name === context?.displayName &&
        (candidate.branch ?? '') === context?.branch,
    );
    if (
      result.truncated ||
      matches.length !== 1 ||
      !w ||
      w.kind !== 'worktree' ||
      (w.hostId !== null && w.hostId !== 'local') ||
      w.name !== context?.displayName ||
      (w.branch ?? '') !== context?.branch ||
      (await repository(w.path)) !== root
    )
      throw new Error(
        '현재 열린 로컬 워크트리와 명령 대상이 다릅니다. 새로고침 후 다시 확인하세요.',
      );
    return root;
  }
  const check = (root: string) => {
    if (!connected.has(root))
      throw new Error(
        'Git Logs 사이드바에서 이 저장소의 워크트리를 열어 연결하세요.',
      );
    return root;
  };
  function handle<K extends keyof Requests>(
    name: K,
    fn: (input: Requests[K]['input']) => Promise<Requests[K]['output']>,
  ) {
    orca.panels.handle(name, async (raw) => {
      if (!raw || typeof raw !== 'object' || Array.isArray(raw))
        throw new Error('잘못된 요청입니다.');
      return fn(raw as Requests[K]['input']);
    });
  }
  handle('active', async ({ all, workspaceId }) => {
    requireHost('workspace.list');
    requireHost('workspace.readContext');
    const context = (await orca.host.call(
      'workspace.readContext',
      {},
    )) as WorkspaceContext | null;
    const result = (await orca.host.call('workspace.list', {})) as {
      workspaces: (WorkspaceChoice & { kind: string; hostId: string | null })[];
      truncated: boolean;
    };
    const local = result.workspaces.filter(
      (w) =>
        w.kind === 'worktree' && (w.hostId === null || w.hostId === 'local'),
    );
    const choice = (w: WorkspaceChoice): WorkspaceChoice => ({
      id: w.id,
      name: w.name,
      path: w.path,
      branch: w.branch,
    });
    // readContext intentionally has no id/path. Never guess when labels collide,
    // including a local and SSH workspace sharing the same name and branch.
    const matches = context
      ? result.workspaces.filter(
          (w) =>
            w.name === context.displayName &&
            (w.branch ?? '') === context.branch,
        )
      : [];
    const selected = workspaceId
      ? local.find((w) => w.id === workspaceId)
      : matches.length === 1 && !result.truncated
        ? local.find((w) => w.id === matches[0].id)
        : undefined;
    if (workspaceId && !selected)
      throw new Error('선택한 로컬 Git 워크트리를 찾을 수 없습니다.');
    if (selected) {
      const root = await repository(selected.path);
      await setup(root);
      connected.add(root);
      return {
        status: 'connected',
        repository: await log(root, all === true),
        workspace: choice(selected),
      };
    }
    const candidates =
      matches.length > 1
        ? local.filter((w) => matches.some((m) => m.id === w.id))
        : local;
    return {
      status: candidates.length ? 'choose' : 'unavailable',
      choices: candidates.map(choice),
      message: result.truncated
        ? 'workspace 목록이 일부만 제공되어 자동 연결을 확정할 수 없습니다.'
        : matches.length > 1
          ? '이름과 브랜치가 같은 workspace가 여러 개입니다. 연결할 워크트리를 선택하세요.'
          : matches.length === 1
            ? '현재 workspace는 로컬 Git 워크트리가 아닙니다. SSH는 지원하지 않습니다.'
            : '현재 workspace를 자동으로 식별하지 못했습니다. 로컬 워크트리를 선택하세요.',
    };
  });
  // 필터를 연달아 바꾸면 앞선 요청의 git 프로세스를 끊어 새 요청이 밀리지 않게 한다.
  // 필터 요청은 같은 저장소에서 아직 도는 다음 페이지 요청도 함께 끊는다. 이미 버려질 결과라서다.
  // 페이지 요청끼리는 서로 끊지 않는다.
  const filterRequests = new Map<string, AbortController>();
  const pageRequests = new Map<string, Set<AbortController>>();
  handle('log', async ({ repo, all, branchRef, filter, cursor, cancelKey }) => {
    const root = check(repo);
    if (cancelKey !== 'filter') {
      if (!cursor) return log(root, all === true, branchRef, filter, cursor);
      const controller = new AbortController();
      const pending = pageRequests.get(root) ?? new Set<AbortController>();
      pending.add(controller);
      pageRequests.set(root, pending);
      try {
        return await log(
          root,
          all === true,
          branchRef,
          filter,
          cursor,
          controller.signal,
        );
      } finally {
        pending.delete(controller);
        if (pending.size === 0 && pageRequests.get(root) === pending)
          pageRequests.delete(root);
      }
    }
    filterRequests.get(root)?.abort();
    for (const pending of pageRequests.get(root) ?? []) pending.abort();
    const controller = new AbortController();
    filterRequests.set(root, controller);
    try {
      return await log(
        root,
        all === true,
        branchRef,
        filter,
        cursor,
        controller.signal,
      );
    } finally {
      if (filterRequests.get(root) === controller) filterRequests.delete(root);
    }
  });
  handle('prepare', async ({ repo, workspaceId, operation }) =>
    operations.prepare(await mutationRoot(repo, workspaceId), operation),
  );
  handle('execute', async ({ repo, workspaceId, token, confirmation }) =>
    operations.execute(
      await mutationRoot(repo, workspaceId),
      token,
      confirmation,
    ),
  );
  handle('commitMessage', async ({ repo, commit }) =>
    commitMessage(check(repo), commit),
  );
  handle('changes', async ({ repo, comparison }) => {
    const root = check(repo);
    const warning = await setup(root);
    const result = await changes(root, comparison);
    const visibleDocuments = result.files.some(
      (file) => file.untracked && file.path.startsWith('.orca/git-logs/'),
    );
    return {
      ...result,
      ...(warning || visibleDocuments
        ? { setupWarning: warning ?? setupWarning }
        : {}),
    };
  });
  handle('diff', async ({ repo, comparison, path }) =>
    diff(check(repo), comparison, path),
  );
  async function workspaces(root: string) {
    requireHost('workspace.list');
    const result = (await orca.host.call('workspace.list', {})) as {
      workspaces: {
        id: string;
        name: string;
        path: string;
        hostId: string | null;
      }[];
    };
    const matches: { id: string; name: string }[] = [];
    for (const w of result.workspaces)
      if (w.hostId === null || w.hostId === 'local') {
        try {
          if ((await realpath(w.path)) === root)
            matches.push({ id: w.id, name: w.name });
        } catch {
          /* unavailable workspace */
        }
      }
    return matches;
  }
  handle('workspaces', async ({ repo }) => workspaces(check(repo)));
  handle('open', async ({ descriptor, workspaceId }) => {
    requireHost('editor.open');
    requireHost('workspace.open');
    checkDescriptorVersion(descriptor);
    const root = check(descriptor.repo);
    if (!(await workspaces(root)).some((w) => w.id === workspaceId))
      throw new Error(
        '연결한 저장소와 같은 로컬 Orca 워크스페이스를 선택하세요.',
      );
    const set = await changes(root, descriptor.comparison);
    if (descriptor.path && !set.files.some((f) => f.path === descriptor.path))
      throw new Error('변경 파일이 사라졌습니다. 새로고침하세요.');
    const safe: Descriptor = {
      version: descriptorVersion(set.comparison),
      repo: root,
      comparison: set.comparison,
      ...(descriptor.path ? { path: descriptor.path } : {}),
    };
    // Generated descriptors and local excludes are written; source/index/shared ignore files are not.
    let directory = root;
    for (const part of ['.orca', 'git-logs']) {
      directory = join(directory, part);
      try {
        await mkdir(directory, { mode: 0o700 });
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      }
      const stat = await lstat(directory);
      if (
        stat.isSymbolicLink() ||
        !stat.isDirectory() ||
        (await realpath(directory)) !== directory
      )
        throw new Error(
          '비교 문서 폴더는 저장소 내부의 실제 디렉터리여야 합니다.',
        );
    }
    let warning = await setup(root);
    const path = `.orca/git-logs/${randomUUID()}.orcadiff`;
    try {
      await git(root, ['check-ignore', '--no-index', '--quiet', '--', path]);
    } catch {
      warning = setupWarning;
    }
    await writeFile(join(root, path), JSON.stringify(safe, null, 2), {
      mode: 0o600,
      flag: 'wx',
    });
    await orca.host.call('workspace.open', { workspaceId });
    const result = (await orca.host.call('editor.open', {
      workspaceId,
      path,
    })) as {
      opened: true;
    };
    return { ...result, ...(warning ? { setupWarning: warning } : {}) };
  });
  orca.log('Git Logs worker ready (mutations require a prepared confirmation)');
}
