import { mkdtemp, writeFile, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Descriptor, Requests, WorkerApi } from '../protocol';
import { changes, diff, log, repository } from './git';
export default function activate(orca: WorkerApi): void {
  const connected = new Set<string>();
  const check = (root: string) => {
    if (!connected.has(root))
      throw new Error(
        'Git Tools 사이드바에서 이 로컬 저장소 경로에 먼저 연결하세요.',
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
  handle('connect', async ({ path, all }) => {
    const root = await repository(path);
    connected.add(root);
    return log(root, all === true);
  });
  handle('log', async ({ repo, all }) => log(check(repo), all === true));
  handle('changes', async ({ repo, comparison }) =>
    changes(check(repo), comparison),
  );
  handle('diff', async ({ repo, comparison, path }) =>
    diff(check(repo), comparison, path),
  );
  async function workspaces(root: string) {
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
      if (w.hostId === null) {
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
    const dir = await mkdtemp(join(tmpdir(), 'orca-git-tools-'));
    const path = join(dir, 'comparison.orcadiff');
    await writeFile(path, JSON.stringify(safe, null, 2), { mode: 0o600 });
    return (await orca.host.call('editor.open', { workspaceId, path })) as {
      opened: true;
    };
  });
  orca.log('Git Tools read-only worker ready');
}
