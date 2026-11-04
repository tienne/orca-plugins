import { mkdir, lstat, writeFile, realpath } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import type {
  Descriptor,
  Requests,
  WorkerApi,
  WorkspaceContext,
  WorkspaceChoice,
} from '../protocol';
import { changes, diff, log, repository } from './git';
import { createOperations } from './operations';
export default function activate(orca: WorkerApi): void {
  function requireHost(name: string) {
    if (orca.api?.major !== 1 || orca.api.minor < 3 || !orca.host.has(name))
      throw new Error(
        `이 Orca에서 ${name}을 지원하지 않습니다. Host API 1.3 이상이 필요합니다.`,
      );
  }
  const connected = new Set<string>();
  const operations = createOperations();
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
  handle('log', async ({ repo, all, branchRef }) =>
    log(check(repo), all === true, branchRef),
  );
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
  handle('changes', async ({ repo, comparison }) =>
    changes(check(repo), comparison),
  );
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
    if (descriptor?.version !== 1)
      throw new Error('지원하지 않는 비교 문서입니다.');
    const root = check(descriptor.repo);
    if (!(await workspaces(root)).some((w) => w.id === workspaceId))
      throw new Error(
        '연결한 저장소와 같은 로컬 Orca 워크스페이스를 선택하세요.',
      );
    const set = await changes(root, descriptor.comparison);
    if (descriptor.path && !set.files.some((f) => f.path === descriptor.path))
      throw new Error('변경 파일이 사라졌습니다. 새로고침하세요.');
    const safe: Descriptor = {
      version: 1,
      repo: root,
      comparison: set.comparison,
      ...(descriptor.path ? { path: descriptor.path } : {}),
    };
    // Only generated descriptors are written, never source/index/config files.
    let directory = root;
    for (const part of ['.orca', 'git-tools']) {
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
    const path = `.orca/git-tools/${randomUUID()}.orcadiff`;
    await writeFile(join(root, path), JSON.stringify(safe, null, 2), {
      mode: 0o600,
      flag: 'wx',
    });
    await orca.host.call('workspace.open', { workspaceId });
    return (await orca.host.call('editor.open', { workspaceId, path })) as {
      opened: true;
    };
  });
  orca.log('Git Logs worker ready (mutations require a prepared confirmation)');
}
