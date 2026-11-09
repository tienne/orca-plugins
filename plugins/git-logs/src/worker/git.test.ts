import { test } from 'node:test';
import assert from 'node:assert/strict';
import { constants } from 'node:fs';
import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import {
  mkdtemp,
  writeFile,
  rm,
  rename,
  symlink,
  mkdir,
  readFile,
  realpath,
  open,
  readdir,
} from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  git,
  repository,
  log,
  changes,
  diff,
  commitMessage,
  commitHash,
  validateFilter,
  encodeCursor,
  page,
} from './git';
import {
  LOAD_LIMIT,
  STALE_CURSOR_PREFIX,
  checkDescriptorVersion,
  descriptorVersion,
} from '../protocol';
import { closeOpenLanes, layout, layoutFrom } from '../ui/graph';
import activate from './main';
async function fixture(
  run: (
    root: string,
    commit: (msg: string) => Promise<string>,
  ) => Promise<void>,
) {
  const root = await realpath(
    await mkdtemp(join(tmpdir(), 'git-logs-fixture-')),
  );
  try {
    await git(root, ['init', '-b', 'main']);
    await git(root, ['config', 'user.name', 'Fixture User']);
    await git(root, ['config', 'user.email', 'fixture@example.invalid']);
    const commit = async (msg: string) => {
      await git(root, ['add', '-A']);
      await git(root, ['commit', '--allow-empty', '-m', msg]);
      return (await git(root, ['rev-parse', 'HEAD'])).toString().trim();
    };
    await run(root, commit);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
test('unborn repository and empty added files preserve missing vs empty', () =>
  fixture(async (root) => {
    assert.equal(await repository(root), root);
    assert.equal((await log(root)).commits.length, 0);
    await writeFile(join(root, 'empty.txt'), '');
    await git(root, ['add', '.']);
    const set = await changes(root, { kind: 'working' });
    assert.equal(set.files[0].staged, true);
    const d = await diff(root, { kind: 'working' }, 'empty.txt');
    assert.equal(d.original.kind, 'missing');
    assert.equal(d.modified.kind, 'text');
    assert.equal(d.modified.bytes, 0);
  }));
test('root commit, full message, refs, paths containing tabs/newlines and binary', () =>
  fixture(async (root, commit) => {
    await writeFile(join(root, 'line\nbreak\t.txt'), 'hello\n');
    await writeFile(join(root, 'empty'), '');
    await writeFile(join(root, 'binary'), Buffer.from([0, 1, 2]));
    const hash = await commit('Initial\n\nFull message\nwith details');
    await git(root, ['update-ref', 'refs/remotes/origin/main', hash]);
    const l = await log(root);
    assert.equal(l.commits.length, 1);
    assert.equal(l.commits[0].subject, 'Initial');
    assert.equal(
      (await commitMessage(root, hash)).message,
      'Initial\n\nFull message\nwith details',
    );
    assert.deepEqual(l.commits[0].parents, []);
    assert.ok(l.commits[0].refs.includes('origin/main'));
    const set = await changes(root, { kind: 'commit', commit: hash });
    assert.equal(set.files.length, 3);
    assert.ok(set.files.some((f) => f.path === 'line\nbreak\t.txt'));
    assert.equal(
      (await diff(root, set.comparison, 'binary')).modified.kind,
      'binary',
    );
    assert.equal(
      (await diff(root, set.comparison, 'empty')).original.kind,
      'missing',
    );
  }));
test('working tree compares HEAD to disk, with staged and unstaged annotations', () =>
  fixture(async (root, commit) => {
    await writeFile(join(root, 'a'), 'HEAD\n');
    await commit('base');
    await writeFile(join(root, 'a'), 'index\n');
    await git(root, ['add', 'a']);
    await writeFile(join(root, 'a'), 'disk\n');
    await writeFile(join(root, 'new'), 'new\n');
    const set = await changes(root, { kind: 'working' });
    const a = set.files.find((f) => f.path === 'a')!;
    assert.equal(a.staged, true);
    assert.equal(a.unstaged, true);
    const d = await diff(root, set.comparison, 'a');
    assert.equal(d.original.text, 'HEAD\n');
    assert.equal(d.modified.text, 'disk\n');
    assert.equal(
      (await diff(root, set.comparison, 'new')).original.kind,
      'missing',
    );
    await writeFile(join(root, 'a'), 'HEAD\n');
    assert.ok(
      !(await changes(root, set.comparison)).files.some((f) => f.path === 'a'),
    );
  }));
test('rename, delete and literal pathspec names compare correct sides', () =>
  fixture(async (root, commit) => {
    await writeFile(join(root, 'old'), 'same\n'.repeat(10));
    await writeFile(join(root, 'gone'), 'delete me');
    await commit('base');
    await rename(join(root, 'old'), join(root, 'new'));
    await rm(join(root, 'gone'));
    await writeFile(join(root, '[literal]*.txt'), 'literal');
    const hash = await commit('rename');
    const set = await changes(root, { kind: 'commit', commit: hash });
    assert.equal(set.files.find((f) => f.path === 'new')?.oldPath, 'old');
    assert.equal(
      (await diff(root, set.comparison, 'new')).original.text,
      'same\n'.repeat(10),
    );
    assert.equal(
      (await diff(root, set.comparison, 'gone')).modified.kind,
      'missing',
    );
    assert.equal(
      (await diff(root, set.comparison, '[literal]*.txt')).modified.text,
      'literal',
    );
  }));
test('graph ends at the dot when the list stops before a parent', () => {
  const commit = (hash: string, parents: string[]) =>
    ({ hash, parents }) as Parameters<typeof layout>[0][number];
  const { rows, state } = layoutFrom({ lanes: [] }, [
    commit('c', ['b', 'x']),
    commit('b', ['a']),
  ]);
  assert.deepEqual(state.lanes, ['a', 'x']);
  const closed = closeOpenLanes(rows, state.lanes);
  assert.deepEqual(
    closed.map((row) => row.edges.length),
    [1, 0],
  );
  assert.deepEqual(
    rows.map((row) => row.edges.length),
    [2, 2],
  );
  const full = layoutFrom({ lanes: [] }, [commit('b', ['a']), commit('a', [])]);
  assert.equal(closeOpenLanes(full.rows, full.state.lanes), full.rows);
});
test('merge selects an actual parent; graph contains both parent edges', () =>
  fixture(async (root, commit) => {
    await writeFile(join(root, 'base'), 'base');
    const base = await commit('base');
    await git(root, ['checkout', '-b', 'feature']);
    await writeFile(join(root, 'feature'), 'feature');
    const feature = await commit('feature');
    await git(root, ['checkout', 'main']);
    await writeFile(join(root, 'main'), 'main');
    await commit('main');
    await git(root, ['merge', '--no-ff', 'feature', '-m', 'merge']);
    const l = await log(root, true);
    assert.equal(l.commits[0].parents.length, 2);
    assert.equal(layout(l.commits)[0].edges.filter((e) => e.parent).length, 2);
    const set = await changes(root, {
      kind: 'commit',
      commit: l.head!,
      parent: feature,
    });
    assert.deepEqual(
      set.files.map((f) => f.path),
      ['main'],
    );
    await assert.rejects(
      changes(root, { kind: 'commit', commit: l.head!, parent: base }),
      /직접 부모/,
    );
  }));
test('binary, invalid UTF8, large, symlink and boundary validation', () =>
  fixture(async (root, commit) => {
    await commit('base');
    await writeFile(join(root, 'binary'), Buffer.from([0, 1]));
    await writeFile(join(root, 'invalid'), Buffer.from([255, 254]));
    await writeFile(join(root, 'large'), Buffer.alloc(800000, 65));
    await symlink('/etc/passwd', join(root, 'link'));
    for (const [path, kind] of [
      ['binary', 'binary'],
      ['invalid', 'binary'],
      ['large', 'large'],
      ['link', 'special'],
    ] as const)
      assert.equal(
        (await diff(root, { kind: 'working' }, path)).modified.kind,
        kind,
      );
    await assert.rejects(diff(root, { kind: 'working' }, '../outside'));
    await assert.rejects(diff(root, { kind: 'working' }, '.git/config'));
    await assert.rejects(diff(root, { kind: 'working' }, 'not-in-changes'));
    await assert.rejects(changes(root, { kind: 'commit', commit: '--all' }));
  }));
test(
  'tracked files replaced by FIFOs return special without waiting for a writer',
  {
    skip: process.platform === 'win32',
  },
  () =>
    fixture(async (root, commit) => {
      const path = join(root, 'pipe');
      await writeFile(path, 'original\n');
      await commit('base');
      await rm(path);
      await promisify(execFile)('mkfifo', [path]);
      let waitedForWriter = false;
      let rescue: ReturnType<typeof open> | undefined;
      // Unblock the old implementation so a regression fails instead of hanging Node.
      const timer = setTimeout(() => {
        waitedForWriter = true;
        rescue = open(path, constants.O_RDWR | constants.O_NONBLOCK);
      }, 2000);
      try {
        const result = await diff(root, { kind: 'working' }, 'pipe');
        assert.equal(waitedForWriter, false, 'Diff waited for a FIFO writer');
        assert.equal(result.original.text, 'original\n');
        assert.equal(result.modified.kind, 'special');
      } finally {
        clearTimeout(timer);
        if (rescue) await (await rescue).close();
      }
    }),
);
test('conflicts are explicitly unsupported rather than a fake two-way resolution', () =>
  fixture(async (root, commit) => {
    await writeFile(join(root, 'a'), 'base');
    await commit('base');
    await git(root, ['checkout', '-b', 'feature']);
    await writeFile(join(root, 'a'), 'feature');
    await commit('feature');
    await git(root, ['checkout', 'main']);
    await writeFile(join(root, 'a'), 'main');
    await commit('main');
    await assert.rejects(git(root, ['merge', 'feature']));
    const d = await diff(root, { kind: 'working' }, 'a');
    assert.equal(d.file.conflict, true);
    assert.equal(d.modified.kind, 'special');
  }));
test('log bounds at 200 and current/all branch filters', () =>
  fixture(async (root, commit) => {
    await commit('base');
    await git(root, ['checkout', '-b', 'other']);
    const other = await commit('other only');
    await git(root, ['checkout', 'main']);
    assert.ok(!(await log(root)).commits.some((c) => c.hash === other));
    assert.ok((await log(root, true)).commits.some((c) => c.hash === other));
    // Commit-tree avoids 200 working-tree/index mutations while creating a real parent chain.
    const tree = (await git(root, ['rev-parse', 'HEAD^{tree}']))
      .toString()
      .trim();
    let parent = (await log(root)).head!;
    for (let i = 0; i < 202; i++)
      parent = (
        await git(root, [
          'commit-tree',
          tree,
          '-p',
          parent,
          '-m',
          `fixture ${i}`,
        ])
      )
        .toString()
        .trim();
    await git(root, ['update-ref', 'refs/heads/main', parent]);
    assert.equal((await log(root)).commits.length, 200);
  }));
test('tags label commits (lightweight, annotated, multiple, tree) and stay out of branch lists', () =>
  fixture(async (root, commit) => {
    const first = await commit('first');
    const second = await commit('second');
    await git(root, ['tag', 'light', first]);
    await git(root, ['tag', '-a', 'annotated', '-m', 'release', second]);
    await git(root, ['tag', 'pair', second]);
    await git(root, ['tag', '-a', 'pair-ann', '-m', 'release', second]);
    const tree = (await git(root, ['rev-parse', 'HEAD^{tree}']))
      .toString()
      .trim();
    await git(root, ['tag', 'tree-tag', tree]);
    const l = await log(root);
    const refsOf = (hash: string) =>
      l.commits.find((c) => c.hash === hash)!.refs;
    assert.ok(refsOf(first).includes('tag: light'));
    assert.ok(refsOf(second).includes('tag: annotated'));
    assert.ok(refsOf(second).includes('tag: pair'));
    assert.ok(refsOf(second).includes('tag: pair-ann'));
    assert.ok(
      l.commits.every((c) => c.refs.every((r) => !r.includes('tree-tag'))),
    );
    assert.deepEqual(l.localBranches, [{ name: 'main', hash: second }]);
    assert.deepEqual(
      l.branches?.map((b) => b.ref),
      ['refs/heads/main'],
    );
    await assert.rejects(log(root, false, 'refs/tags/light'));
  }));
test('worker requires an Orca workspace connection and validates workspace before opening generated descriptor', () =>
  fixture(async (root, commit) => {
    await commit('base');
    await writeFile(join(root, 'new'), 'new');
    const handlers = new Map<string, (input: unknown) => unknown>();
    let opened = '';
    const api = { major: 1, minor: 3 };
    const methods = new Set([
      'workspace.list',
      'workspace.readContext',
      'workspace.open',
      'editor.open',
    ]);
    activate({
      api,
      panels: {
        handle: (name, fn) => {
          handlers.set(name, fn);
        },
      },
      log() {},
      host: {
        has: (name) => methods.has(name),
        async call(name, params) {
          if (name === 'workspace.readContext')
            return { displayName: 'Fixture', branch: 'main', terminals: [] };
          if (name === 'workspace.list')
            return {
              workspaces: [
                {
                  id: 'local',
                  kind: 'worktree',
                  name: 'Fixture',
                  branch: 'main',
                  path: root,
                  hostId: 'local',
                },
                {
                  id: 'remote',
                  kind: 'worktree',
                  name: 'SSH',
                  branch: 'main',
                  path: root,
                  hostId: 'ssh',
                },
              ],
            };
          if (name === 'workspace.open') return { opened: true };
          if (name === 'editor.open') {
            opened = (params as { path: string }).path;
            return { opened: true };
          }
          throw Error(name);
        },
      },
    });
    await assert.rejects(async () =>
      handlers.get('changes')!({ repo: root, comparison: { kind: 'working' } }),
    );
    await handlers.get('active')!({});
    const descriptor = {
      version: 1,
      repo: root,
      comparison: { kind: 'working' },
      path: 'new',
    };
    await assert.rejects(async () =>
      handlers.get('open')!({ descriptor, workspaceId: 'remote' }),
    );
    methods.delete('editor.open');
    await assert.rejects(
      async () => handlers.get('open')!({ descriptor, workspaceId: 'local' }),
      /지원하지 않습니다/,
    );
    assert.equal(opened, '');
    methods.add('editor.open');
    api.minor = 2;
    await assert.rejects(
      async () => handlers.get('workspaces')!({ repo: root }),
      /Host API 1.3/,
    );
    api.minor = 3;
    await handlers.get('open')!({ descriptor, workspaceId: 'local' });
    assert.ok(opened.endsWith('.orcadiff'));
    assert.equal(
      JSON.parse(await readFile(join(root, opened), 'utf8')).repo,
      descriptor.repo,
    );
    assert.ok(opened.startsWith('.orca/git-logs/'));
    await rm(join(root, '.orca'), { recursive: true, force: true });
    await symlink('/tmp', join(root, '.orca'));
    await assert.rejects(
      async () => handlers.get('open')!({ descriptor, workspaceId: 'local' }),
      /실제 디렉터리/,
    );
  }));

test('staged deletion with recreated disk file uses HEAD baseline; stale HEAD is refused', () =>
  fixture(async (root, commit) => {
    await writeFile(join(root, 'a'), 'original');
    await commit('base');
    await git(root, ['rm', 'a']);
    await writeFile(join(root, 'a'), 'recreated');
    const set = await changes(root, { kind: 'working' });
    const d = await diff(root, set.comparison, 'a');
    assert.equal(d.original.text, 'original');
    assert.equal(d.modified.text, 'recreated');
    assert.equal(d.file.status, 'M');
    await writeFile(join(root, 'a'), 'original');
    assert.equal((await changes(root, { kind: 'working' })).files.length, 0);
    await commit('new head');
    await assert.rejects(diff(root, set.comparison, 'a'), /HEAD가 변경/);
  }));

test('partial clone repositories are refused without fetching objects', () =>
  fixture(async (root, commit) => {
    await commit('base');
    await git(root, ['config', 'remote.origin.promisor', 'true']);
    await assert.rejects(repository(root), /부분 clone/);
  }));

test('active workspace connects uniquely, rejects remote/forged selection and requires a choice for ambiguous or truncated context', () =>
  fixture(async (root, commit) => {
    await commit('active repository');
    const handlers = new Map<string, (input: unknown) => unknown>();
    const local = {
      id: 'here',
      kind: 'worktree',
      name: 'Current',
      path: root,
      branch: 'main',
      hostId: 'local',
    };
    let context: {
      displayName: string;
      branch: string;
      terminals: never[];
    } | null = { displayName: 'Current', branch: 'main', terminals: [] };
    let rows = [local];
    let truncated = false;
    activate({
      api: { major: 1, minor: 3 },
      log() {},
      panels: {
        handle: (name, fn) => {
          handlers.set(name, fn);
        },
      },
      host: {
        has: () => true,
        async call(name) {
          if (name === 'workspace.readContext') return context;
          if (name === 'workspace.list') return { workspaces: rows, truncated };
          throw new Error(name);
        },
      },
    });
    const active = (input = {}) =>
      handlers.get('active')!(input) as Promise<
        import('../protocol').ActiveConnection
      >;
    const initial = await active();
    assert.equal(initial.status, 'connected');
    if (initial.status === 'connected') {
      assert.equal(initial.repository.root, root);
      assert.equal(initial.workspace.id, 'here');
    }
    rows = [
      local,
      { ...local, id: 'duplicate', path: '/must-not-read-this-ambiguous-path' },
    ];
    assert.equal((await active()).status, 'choose');
    rows = [local, { ...local, id: 'ssh', hostId: 'remote-host' }];
    assert.equal(
      (await active()).status,
      'choose',
      'local + SSH collisions must never auto-connect to local',
    );
    await assert.rejects(active({ workspaceId: 'ssh' }), /로컬 Git 워크트리/);
    const chosen = await active({ workspaceId: 'here' });
    assert.equal(chosen.status, 'connected');
    rows = [{ ...local, hostId: 'remote-host' }];
    assert.equal((await active()).status, 'unavailable');
    rows = [local];
    truncated = true;
    assert.equal((await active()).status, 'choose');
    truncated = false;
    context = null;
    assert.equal((await active()).status, 'choose');
    await assert.rejects(
      active({ workspaceId: 'forged' }),
      /로컬 Git 워크트리/,
    );
  }));

// Mutations are exercised only in disposable local repositories.
import { createOperations } from './operations';
import type { OperationInput } from '../protocol';
async function runOperation(root: string, operation: OperationInput) {
  const service = createOperations();
  const plan = await service.prepare(root, operation);
  const result = await service.execute(root, plan.token, plan.confirmation);
  assert.equal(result.status, 'success', result.message);
  return { plan, result };
}
test('commit actions create slash-named branches and checkout local/detached targets', () =>
  fixture(async (root, commit) => {
    const base = await commit('base');
    await runOperation(root, {
      action: 'branch',
      commit: base,
      branch: 'feature/from-log',
    });
    assert.equal((await log(root)).branch, 'main');
    assert.ok(
      (await log(root)).localBranches?.some(
        (b) => b.name === 'feature/from-log',
      ),
    );
    await runOperation(root, {
      action: 'checkout',
      commit: base,
      branch: 'feature/from-log',
    });
    assert.equal((await log(root)).branch, 'feature/from-log');
    await runOperation(root, { action: 'checkout', commit: base });
    assert.equal((await log(root)).branch, 'Detached HEAD');
    await assert.rejects(
      createOperations().prepare(root, {
        action: 'reset',
        commit: base,
        resetMode: 'hard',
      }),
      /Detached/,
    );
    await assert.rejects(
      createOperations().prepare(root, {
        action: 'branch',
        commit: base,
        branch: '--force',
      }),
      /브랜치/,
    );
  }));
test('checkout respects another worktree and rejects moved branch plans', () =>
  fixture(async (root, commit) => {
    const base = await commit('base');
    await git(root, ['branch', 'other', base]);
    const service = createOperations();
    const plan = await service.prepare(root, {
      action: 'checkout',
      commit: base,
      branch: 'other',
    });
    const next = await commit('next');
    await git(root, ['update-ref', 'refs/heads/other', next]);
    await git(root, ['reset', '--hard', base]);
    await assert.rejects(
      service.execute(root, plan.token, ''),
      /브랜치가 변경/,
    );
    const worktree = join(root, 'linked');
    await git(root, ['worktree', 'add', worktree, 'other']);
    // Hide only the linked worktree directory from status, as a typical external worktree would be.
    await writeFile(join(root, '.git', 'info', 'exclude'), 'linked/\n');
    const plan2 = await service.prepare(root, {
      action: 'checkout',
      commit: next,
      branch: 'other',
    });
    const result = await service.execute(root, plan2.token, '');
    assert.equal(result.status, 'failed');
    assert.equal((await log(root)).branch, 'main');
  }));
test('merge ignores configured squash/no-commit and creates an actual merge commit', () =>
  fixture(async (root, commit) => {
    await writeFile(join(root, 'base'), 'base');
    const base = await commit('base');
    await git(root, ['switch', '-c', 'feature']);
    await writeFile(join(root, 'feature'), 'feature');
    const feature = await commit('feature');
    await git(root, ['switch', 'main']);
    await writeFile(join(root, 'main'), 'main');
    await commit('main');
    await git(root, [
      'config',
      'branch.main.mergeOptions',
      '--squash --no-commit',
    ]);
    await runOperation(root, { action: 'merge', commit: feature });
    const current = await log(root);
    assert.equal(current.commits[0].parents.length, 2);
    assert.equal((await git(root, ['status', '--porcelain'])).length, 0);
    await git(root, ['reset', '--hard', base]);
    await runOperation(root, { action: 'merge', commit: feature });
    assert.equal((await log(root)).head, feature); // fast-forward
  }));
test('cherry-pick and revert create new commits, with merge mainline explicitly checked', () =>
  fixture(async (root, commit) => {
    const base = await commit('base');
    await git(root, ['switch', '-c', 'feature']);
    await writeFile(join(root, 'feature'), 'hello');
    const feature = await commit('feature');
    await git(root, ['switch', 'main']);
    await writeFile(join(root, 'main'), 'main');
    await commit('main');
    await runOperation(root, { action: 'cherry-pick', commit: feature });
    assert.equal(await readFile(join(root, 'feature'), 'utf8'), 'hello');
    await runOperation(root, {
      action: 'revert',
      commit: (await log(root)).head!,
    });
    await assert.rejects(readFile(join(root, 'feature')), /ENOENT/);
    await git(root, ['reset', '--hard', base]);
    await writeFile(join(root, 'main'), 'main');
    await commit('diverge');
    await git(root, ['merge', '--no-edit', 'feature']);
    const merge = (await log(root)).head!;
    const service = createOperations();
    for (const action of ['cherry-pick', 'revert'] as const) {
      await assert.rejects(
        service.prepare(root, { action, commit: merge }),
        /기준 부모/,
      );
      await assert.rejects(
        service.prepare(root, { action, commit: merge, mainline: 3 }),
        /기준 부모/,
      );
    }
    await runOperation(root, { action: 'revert', commit: merge, mainline: 1 });
    await assert.rejects(readFile(join(root, 'feature')), /ENOENT/);
    await git(root, ['reset', '--hard', base]);
    await runOperation(root, {
      action: 'cherry-pick',
      commit: merge,
      mainline: 1,
    });
    assert.equal(await readFile(join(root, 'feature'), 'utf8'), 'hello');
  }));
for (const resetMode of ['soft', 'mixed', 'hard'] as const) {
  test(`reset ${resetMode} preserves a backup and has correct index/worktree semantics`, () =>
    fixture(async (root, commit) => {
      await writeFile(join(root, 'file'), 'base');
      const base = await commit('base');
      await writeFile(join(root, 'file'), 'next');
      const next = await commit('next');
      const { plan } = await runOperation(root, {
        action: 'reset',
        commit: base,
        resetMode,
      });
      assert.equal((await log(root)).head, base);
      assert.equal(
        (await git(root, ['rev-parse', plan.backupRef!])).toString().trim(),
        next,
      );
      assert.equal(
        await readFile(join(root, 'file'), 'utf8'),
        resetMode === 'hard' ? 'base' : 'next',
      );
      const staged = (await git(root, ['diff', '--cached', '--name-only']))
        .toString()
        .trim();
      const unstaged = (await git(root, ['diff', '--name-only']))
        .toString()
        .trim();
      assert.equal(staged, resetMode === 'soft' ? 'file' : '');
      assert.equal(unstaged, resetMode === 'mixed' ? 'file' : '');
    }));
}
test('confirmation tokens reject changed state, dirty/untracked, unknown actions, mismatched hashes and replay', () =>
  fixture(async (root, commit) => {
    const base = await commit('base');
    const service = createOperations();
    const plan = await service.prepare(root, {
      action: 'reset',
      commit: base,
      resetMode: 'hard',
    });
    await assert.rejects(service.execute(root, plan.token, 'wrong'), /일치/);
    await service.execute(root, plan.token, plan.confirmation);
    await assert.rejects(
      service.execute(root, plan.token, plan.confirmation),
      /만료/,
    );
    await assert.rejects(
      service.prepare(root, { action: 'push' as never, commit: base }),
      /지원하지/,
    );
    await assert.rejects(
      service.prepare(root, { action: 'merge', commit: '--help' }),
      /전체 커밋/,
    );
    const stale = await service.prepare(root, {
      action: 'branch',
      commit: base,
      branch: 'new',
    });
    await commit('external change');
    await assert.rejects(service.execute(root, stale.token, ''), /HEAD/);
    const changed = await service.prepare(root, {
      action: 'checkout',
      commit: base,
    });
    await writeFile(join(root, 'untracked'), 'do not lose');
    await assert.rejects(service.execute(root, changed.token, ''), /untracked/);
    await assert.rejects(
      service.prepare(root, {
        action: 'reset',
        commit: base,
        resetMode: 'hard',
      }),
      /untracked/,
    );
    assert.equal(
      await readFile(join(root, 'untracked'), 'utf8'),
      'do not lose',
    );
  }));
test('assume-unchanged, sparse index flags and ignored path obstructions cannot be overwritten', () =>
  fixture(async (root, commit) => {
    await writeFile(join(root, 'tracked'), 'base');
    const base = await commit('base');
    await git(root, ['update-index', '--assume-unchanged', 'tracked']);
    await writeFile(join(root, 'tracked'), 'hidden edit');
    await assert.rejects(
      createOperations().prepare(root, {
        action: 'reset',
        commit: base,
        resetMode: 'hard',
      }),
      /assume-unchanged/,
    );
    await git(root, ['update-index', '--no-assume-unchanged', 'tracked']);
    await git(root, ['reset', '--hard', base]);
    await git(root, ['update-index', '--skip-worktree', 'tracked']);
    await assert.rejects(
      createOperations().prepare(root, { action: 'checkout', commit: base }),
      /skip-worktree/,
    );
    await git(root, ['update-index', '--no-skip-worktree', 'tracked']);
    await writeFile(join(root, 'future'), 'committed');
    const future = await commit('future');
    await git(root, ['reset', '--hard', base]);
    await writeFile(join(root, '.git', 'info', 'exclude'), 'future\n');
    const service = createOperations();
    const plan = await service.prepare(root, {
      action: 'reset',
      commit: future,
      resetMode: 'hard',
    });
    await writeFile(join(root, 'future'), 'ignored precious');
    await assert.rejects(
      service.execute(root, plan.token, plan.confirmation),
      /ignored/,
    );
    assert.equal(
      await readFile(join(root, 'future'), 'utf8'),
      'ignored precious',
    );
  }));
test('merge conflicts remain visible and subsequent actions are blocked until externally resolved/aborted', () =>
  fixture(async (root, commit) => {
    await writeFile(join(root, 'file'), 'base\n');
    await commit('base');
    await git(root, ['switch', '-c', 'feature']);
    await writeFile(join(root, 'file'), 'feature\n');
    const feature = await commit('feature');
    await git(root, ['switch', 'main']);
    await writeFile(join(root, 'file'), 'main\n');
    const main = await commit('main');
    const service = createOperations();
    const plan = await service.prepare(root, {
      action: 'merge',
      commit: feature,
    });
    const result = await service.execute(root, plan.token, '');
    assert.equal(result.status, 'conflict');
    assert.deepEqual(result.conflicts, ['file']);
    assert.equal((await log(root)).head, main);
    await assert.rejects(
      service.prepare(root, {
        action: 'reset',
        commit: feature,
        resetMode: 'hard',
      }),
      /진행 중/,
    );
    await git(root, ['merge', '--abort']);
    await assert.rejects(service.execute(root, plan.token, ''), /만료/);
  }));
test('rebase rewrites only current branch onto target and preserves a recovery ref', () =>
  fixture(async (root, commit) => {
    await commit('base');
    await git(root, ['switch', '-c', 'feature']);
    await writeFile(join(root, 'feature'), 'feature');
    const original = await commit('feature');
    await git(root, ['branch', 'keep-original']);
    await git(root, ['switch', 'main']);
    await writeFile(join(root, 'main'), 'main');
    const target = await commit('main');
    await git(root, ['switch', 'feature']);
    await git(root, ['config', 'rebase.updateRefs', 'true']);
    await git(root, ['config', 'rebase.rebaseMerges', 'true']);
    const { plan } = await runOperation(root, {
      action: 'rebase',
      commit: target,
    });
    const result = await log(root);
    assert.equal(result.branch, 'feature');
    assert.notEqual(result.head, original);
    assert.equal(result.commits[0].parents[0], target);
    assert.equal(
      (await git(root, ['rev-parse', plan.backupRef!])).toString().trim(),
      original,
    );
    assert.equal(
      (await git(root, ['rev-parse', 'keep-original'])).toString().trim(),
      original,
    );
    assert.equal(await readFile(join(root, 'feature'), 'utf8'), 'feature');
    assert.equal(await readFile(join(root, 'main'), 'utf8'), 'main');
  }));
test('rebase conflicts are reported without losing original branch backup', () =>
  fixture(async (root, commit) => {
    await writeFile(join(root, 'file'), 'base\n');
    await commit('base');
    await git(root, ['switch', '-c', 'feature']);
    await writeFile(join(root, 'file'), 'feature\n');
    const original = await commit('feature');
    await git(root, ['switch', 'main']);
    await writeFile(join(root, 'file'), 'main\n');
    const target = await commit('main');
    await git(root, ['switch', 'feature']);
    const service = createOperations();
    const plan = await service.prepare(root, {
      action: 'rebase',
      commit: target,
    });
    const result = await service.execute(root, plan.token, '');
    assert.equal(result.status, 'conflict');
    assert.deepEqual(result.conflicts, ['file']);
    assert.equal(
      (await git(root, ['rev-parse', plan.backupRef!])).toString().trim(),
      original,
    );
    await assert.rejects(
      service.prepare(root, { action: 'checkout', commit: target }),
      /진행 중/,
    );
    await git(root, ['rebase', '--abort']);
    assert.equal((await log(root)).head, original);
  }));
test('worker mutations require the uniquely active local workspace at prepare and execute', () =>
  fixture(async (root, commit) => {
    const head = await commit('base');
    const handlers = new Map<string, (input: unknown) => unknown>();
    let context = { displayName: 'Fixture', branch: 'main', terminals: [] };
    const w = {
      id: 'fixture',
      kind: 'worktree',
      name: 'Fixture',
      branch: 'main',
      path: root,
      hostId: 'local',
    };
    let workspaces = [w];
    activate({
      api: { major: 1, minor: 3 },
      panels: {
        handle: (name, handler) => {
          handlers.set(name, handler);
        },
      },
      log() {},
      host: {
        has: () => true,
        async call(name) {
          if (name === 'workspace.readContext') return context;
          if (name === 'workspace.list')
            return { workspaces, truncated: false };
          throw new Error('unexpected host method');
        },
      },
    });
    const prepare = () =>
      Promise.resolve(
        handlers.get('prepare')!({
          repo: root,
          workspaceId: w.id,
          operation: { action: 'branch', commit: head, branch: 'new' },
        }),
      );
    await assert.rejects(prepare(), /연결/);
    await handlers.get('active')!({});
    const plan = (await prepare()) as { token: string };
    context = { ...context, displayName: 'Elsewhere' };
    const execute = () =>
      Promise.resolve(
        handlers.get('execute')!({
          repo: root,
          workspaceId: w.id,
          token: plan.token,
          confirmation: '',
        }),
      );
    await assert.rejects(execute(), /대상이 다릅니다/);
    context = { ...context, displayName: 'Fixture' };
    workspaces = [w, { ...w, id: 'duplicate' }];
    await assert.rejects(execute(), /대상이 다릅니다/);
    workspaces = [w];
    const result = (await execute()) as { status: string };
    assert.equal(result.status, 'success');
  }));
test('rebase protects ignored files created by intermediate commits that are absent at both tips', () =>
  fixture(async (root, commit) => {
    const base = await commit('base');
    await git(root, ['switch', '-c', 'feature']);
    await writeFile(join(root, 'intermediate'), 'tracked temporarily');
    await commit('add temporary file');
    await rm(join(root, 'intermediate'));
    await commit('remove temporary file');
    await writeFile(join(root, '.git', 'info', 'exclude'), 'intermediate\n');
    await writeFile(join(root, 'intermediate'), 'precious ignored content');
    await assert.rejects(
      createOperations().prepare(root, { action: 'rebase', commit: base }),
      /ignored/,
    );
    assert.equal(
      await readFile(join(root, 'intermediate'), 'utf8'),
      'precious ignored content',
    );
  }));
test('branch listing includes refs outside the recent graph and selected local/remote history stays read-only', () =>
  fixture(async (root, commit) => {
    const base = await commit('base');
    await git(root, ['switch', '-c', 'feature/search-this-branch']);
    const feature = await commit('feature-only');
    await git(root, ['switch', 'main']);
    await commit('main-only');
    await git(root, [
      'update-ref',
      'refs/remotes/origin/feature/search-this-branch',
      feature,
    ]);
    await git(root, [
      'update-ref',
      'refs/remotes/origin/main',
      (await log(root)).head!,
    ]);
    await git(root, [
      'symbolic-ref',
      'refs/remotes/origin/HEAD',
      'refs/remotes/origin/main',
    ]);
    const current = await log(root);
    assert.ok(!current.commits.some((commit) => commit.hash === feature));
    assert.ok(
      current.branches?.some(
        (branch) => branch.ref === 'refs/heads/feature/search-this-branch',
      ),
    );
    assert.ok(
      current.branches?.some(
        (branch) =>
          branch.ref === 'refs/remotes/origin/feature/search-this-branch' &&
          branch.kind === 'remote',
      ),
    );
    assert.ok(
      !current.branches?.some((branch) => branch.name === 'origin/HEAD'),
    );
    for (const ref of [
      'refs/heads/feature/search-this-branch',
      'refs/remotes/origin/feature/search-this-branch',
    ]) {
      const selected = await log(root, false, ref);
      assert.deepEqual(
        selected.commits.map((commit) => commit.hash),
        [feature, base],
      );
      assert.equal(selected.branch, 'main');
      assert.equal(selected.head, current.head);
      assert.equal((await git(root, ['status', '--porcelain'])).length, 0);
    }
    await assert.rejects(log(root, true, '--all'), /브랜치/);
    await assert.rejects(log(root, false, base), /브랜치/);
    await git(root, ['branch', '-D', 'feature/search-this-branch']);
    await assert.rejects(
      log(root, false, 'refs/heads/feature/search-this-branch'),
      /브랜치/,
    );
  }));
test('list carries only the subject while commitMessage returns the full body without loss', () =>
  fixture(async (root, commit) => {
    const multi = await commit(
      'Subject line\n\nParagraph one\n\nParagraph two\n- item',
    );
    const empty = await commit('Subject only');
    const tabbed = await commit(
      'Tab\tsubject\n\nbody\twith\ttabs\n\n\nafter blank lines',
    );
    const l = await log(root);
    const byHash = new Map(l.commits.map((c) => [c.hash, c]));
    assert.equal(l.commits.length, 3);
    assert.equal(byHash.get(multi)!.subject, 'Subject line');
    assert.equal(byHash.get(empty)!.subject, 'Subject only');
    assert.equal(byHash.get(tabbed)!.subject, 'Tab\tsubject');
    assert.ok(
      l.commits.every(
        (c) => !c.subject.includes('\n') && !Object.hasOwn(c, 'message'),
      ),
    );
    assert.equal(
      (await commitMessage(root, multi)).message,
      'Subject line\n\nParagraph one\n\nParagraph two\n- item',
    );
    assert.equal((await commitMessage(root, empty)).message, 'Subject only');
    assert.equal(
      (await commitMessage(root, tabbed)).message,
      'Tab\tsubject\n\nbody\twith\ttabs\n\nafter blank lines',
    );
  }));
test('commitMessage rejects short, malformed and unknown hashes', () =>
  fixture(async (root, commit) => {
    const hash = await commit('first');
    for (const bad of [
      hash.slice(0, 7),
      'HEAD',
      '--format=%H',
      `${hash}\n`,
      hash.toUpperCase(),
      '',
    ])
      await assert.rejects(commitMessage(root, bad));
    await assert.rejects(commitMessage(root, 'f'.repeat(40)));
    await assert.rejects(commitMessage(root, undefined as unknown as string));
  }));

// git() 래퍼는 GIT_* 환경 변수를 지우므로 날짜를 고정할 때만 직접 실행한다.
async function datedCommit(root: string, msg: string, date: string) {
  await promisify(execFile)(
    'git',
    ['commit', '-q', '--allow-empty', '-m', msg],
    {
      cwd: root,
      env: {
        ...process.env,
        GIT_AUTHOR_DATE: date,
        GIT_COMMITTER_DATE: date,
      },
    },
  );
}
const subjects = async (
  root: string,
  filter: Parameters<typeof log>[3],
  all = false,
) => (await log(root, all, undefined, filter)).commits.map((c) => c.subject);
test('log filter treats text and author as literal, case-insensitive strings', () =>
  fixture(async (root, commit) => {
    await commit('base');
    await commit('fix: --all flag handling');
    await commit('regex .* literal');
    await commit('bracket [ open');
    await commit('Upper CASE subject');
    await git(root, [
      '-c',
      'user.name=Kim Dev',
      '-c',
      'user.email=kim@example.invalid',
      'commit',
      '--allow-empty',
      '-m',
      'kim work on bracket',
    ]);
    assert.deepEqual(await subjects(root, { text: '--all' }), [
      'fix: --all flag handling',
    ]);
    assert.deepEqual(await subjects(root, { text: '.*' }), [
      'regex .* literal',
    ]);
    assert.deepEqual(await subjects(root, { text: '[' }), ['bracket [ open']);
    assert.deepEqual(await subjects(root, { text: 'upper case' }), [
      'Upper CASE subject',
    ]);
    assert.equal((await subjects(root, { text: '   ' })).length, 6);
    assert.deepEqual(await subjects(root, { author: 'kim' }), [
      'kim work on bracket',
    ]);
    assert.deepEqual(await subjects(root, { author: '--author=Kim' }), []);
    assert.deepEqual(await subjects(root, { author: '.*' }), []);
    assert.deepEqual(await subjects(root, { text: 'bracket', author: 'KIM' }), [
      'kim work on bracket',
    ]);
    await assert.rejects(
      log(root, false, undefined, { text: 'x'.repeat(201) }),
    );
    await assert.rejects(
      log(root, false, undefined, { author: 'a'.repeat(201) }),
    );
    assert.ok(validateFilter({ text: 'x'.repeat(200) }));
    await assert.rejects(log(root, false, undefined, { text: 'a\nb' }));
    await assert.rejects(
      log(root, false, undefined, 'x' as unknown as Record<string, never>),
    );
    await assert.rejects(
      log(root, false, undefined, { text: 1 as unknown as string }),
    );
  }));
test('log filter date bounds include the whole day and reject impossible dates', () =>
  fixture(async (root) => {
    await datedCommit(root, 'before', '2024-03-09T23:30:00');
    await datedCommit(root, 'start', '2024-03-10T00:10:00');
    await datedCommit(root, 'end', '2024-03-10T23:50:00');
    await datedCommit(root, 'after', '2024-03-11T00:05:00');
    assert.deepEqual(await subjects(root, { since: '2024-03-10' }), [
      'after',
      'end',
      'start',
    ]);
    assert.deepEqual(await subjects(root, { until: '2024-03-10' }), [
      'end',
      'start',
      'before',
    ]);
    assert.deepEqual(
      await subjects(root, { since: '2024-03-10', until: '2024-03-10' }),
      ['end', 'start'],
    );
    assert.deepEqual(await subjects(root, { since: '2024-03-12' }), []);
    for (const bad of [
      '2024-02-30',
      '2023-02-29',
      '2024-2-1',
      '2024/03/10',
      '--all',
    ])
      await assert.rejects(
        log(root, false, undefined, { since: bad }),
        /YYYY-MM-DD/,
      );
    assert.ok(validateFilter({ until: '2024-02-29' }));
  }));
test('log path filter is literal, repository-relative and bounded', () =>
  fixture(async (root, commit) => {
    await mkdir(join(root, 'dir'));
    await writeFile(join(root, 'a.txt'), 'a\n');
    await commit('add a');
    await writeFile(join(root, 'dir', 'b.txt'), 'b\n');
    await commit('add b');
    await writeFile(join(root, '*.md'), 'star\n');
    await commit('add star');
    assert.deepEqual(await subjects(root, { path: 'a.txt' }), ['add a']);
    assert.deepEqual(await subjects(root, { path: 'dir' }), ['add b']);
    assert.deepEqual(await subjects(root, { path: ':(glob)*.txt' }), []);
    assert.deepEqual(await subjects(root, { path: '*.txt' }), []);
    assert.deepEqual(await subjects(root, { path: '*.md' }), ['add star']);
    for (const bad of [
      '..',
      '../x',
      'dir/../a.txt',
      '/etc/passwd',
      'a\0b',
      '.git',
    ])
      await assert.rejects(log(root, false, undefined, { path: bad }));
    await assert.rejects(
      log(root, false, undefined, { path: 'a'.repeat(4097) }),
    );
  }));
test('log follow tracks renames for files only and is refused across all branches', () =>
  fixture(async (root, commit) => {
    const body = Array.from({ length: 40 }, (_, i) => `line ${i}`).join('\n');
    await mkdir(join(root, 'dir'));
    await writeFile(join(root, 'dir', 'old.txt'), `${body}\n`);
    await commit('create old');
    await writeFile(join(root, 'dir', 'old.txt'), `${body}\nmore\n`);
    await commit('edit old');
    await git(root, ['mv', 'dir/old.txt', 'dir/new.txt']);
    await commit('rename');
    await writeFile(join(root, 'dir', 'new.txt'), `${body}\nmore\nlast\n`);
    await commit('edit new');
    assert.deepEqual(await subjects(root, { path: 'dir/new.txt' }), [
      'edit new',
      'rename',
    ]);
    assert.deepEqual(
      await subjects(root, { path: 'dir/new.txt', follow: true }),
      ['edit new', 'rename', 'edit old', 'create old'],
    );
    const branch = (await log(root)).branches!.find(
      (b) => b.ref === 'refs/heads/main',
    )!;
    assert.equal(
      (
        await log(root, false, branch.ref, {
          path: 'dir/new.txt',
          follow: true,
        })
      ).commits.length,
      4,
    );
    assert.deepEqual(
      await subjects(root, { path: 'dir', follow: true }),
      await subjects(root, { path: 'dir' }),
    );
    await assert.rejects(
      log(root, true, undefined, { path: 'dir/new.txt', follow: true }),
      /전체 브랜치에서는 이름 변경 추적을 쓸 수 없습니다/,
    );
    await assert.rejects(
      log(root, false, undefined, {
        path: 'dir',
        follow: 'yes' as unknown as boolean,
      }),
    );
  }));
test('log text that is a unique hash prefix puts that commit first', () =>
  fixture(async (root, commit) => {
    const first = await commit('first');
    await commit('second');
    await commit(`revert ${first.slice(0, 8)}`);
    assert.deepEqual(
      (
        await log(root, false, undefined, { text: first.slice(0, 7) })
      ).commits.map((c) => c.hash)[0],
      first,
    );
    assert.deepEqual(
      await subjects(root, { text: first.slice(0, 8).toUpperCase() }),
      ['first', `revert ${first.slice(0, 8)}`],
    );
    // 4자 미만은 해시로 보지 않고 메시지 검색만 한다.
    assert.deepEqual(await subjects(root, { text: first.slice(0, 3) }), [
      `revert ${first.slice(0, 8)}`,
    ]);
    const missing = first.startsWith('0000') ? '1111' : '0000';
    await git(root, ['branch', `${missing}beef`]);
    assert.deepEqual(await subjects(root, { text: `${missing}beef` }), []);
  }));

// 수백~수천 개 커밋을 commit 명령으로 하나씩 만들면 테스트가 느려서 fast-import로 한 번에 쌓는다.
async function chain(
  root: string,
  count: number,
  make: (i: number) => { author?: string; message: string },
): Promise<void> {
  const parent = (
    await git(root, ['rev-parse', '--verify', '--quiet', 'HEAD']).catch(() =>
      Buffer.from(''),
    )
  )
    .toString()
    .trim();
  const parts: string[] = [];
  for (let i = 0; i < count; i++) {
    const { author = 'Fixture User', message } = make(i);
    const who = `${author} <fixture@example.invalid> ${1700000000 + i} +0000`;
    parts.push(
      `commit refs/heads/main\nauthor ${who}\ncommitter ${who}\n`,
      `data ${Buffer.byteLength(message)}\n${message}\n`,
      i === 0 && parent ? `from ${parent}\n` : '',
      '\n',
    );
  }
  await new Promise<void>((done, fail) => {
    const child = spawn('git', ['fast-import', '--quiet'], {
      cwd: root,
      stdio: ['pipe', 'ignore', 'inherit'],
    });
    child.on('error', fail);
    child.on('close', (code) =>
      code === 0 ? done() : fail(new Error(`fast-import ${code}`)),
    );
    child.stdin.end(parts.join(''));
  });
}
async function pages(
  root: string,
  all = false,
  branchRef?: string,
  filter?: Parameters<typeof log>[3],
) {
  const out: Awaited<ReturnType<typeof log>>[] = [];
  let cursor: string | undefined;
  do {
    const r = await log(root, all, branchRef, filter, cursor);
    out.push(r);
    cursor = r.nextCursor;
    assert.equal(r.hasMore, cursor !== undefined);
  } while (cursor && out.length < 30);
  return out;
}
function snapshotOf(cursor: string): string {
  return JSON.parse(Buffer.from(cursor, 'base64url').toString()).snapshot;
}
test('log pages 450 commits as 200/200/50 in topo order without gaps or duplicates', () =>
  fixture(async (root) => {
    await chain(root, 450, (i) => ({ message: `c${i}` }));
    const result = await pages(root);
    assert.deepEqual(
      result.map((r) => r.commits.length),
      [200, 200, 50],
    );
    assert.deepEqual(
      result.map((r) => r.hasMore),
      [true, true, false],
    );
    assert.equal(result[2].nextCursor, undefined);
    const expected = (await git(root, ['rev-list', '--topo-order', 'HEAD']))
      .toString()
      .trim()
      .split('\n');
    assert.deepEqual(
      result.flatMap((r) => r.commits.map((c) => c.hash)),
      expected,
    );
    // 첫 페이지는 0.1.1 응답 필드를 그대로 두고 페이징 필드만 더한다.
    assert.deepEqual(Object.keys(result[0]).sort(), [
      'branch',
      'branches',
      'commits',
      'hasMore',
      'head',
      'localBranches',
      'nextCursor',
      'root',
    ]);
    assert.equal(result[1].commits[0].refs.length, 0);
    assert.deepEqual(result[0].commits[0].refs, ['HEAD', 'main']);
  }));
test('log rejects malformed, out-of-range and stale cursors', () =>
  fixture(async (root) => {
    await chain(root, 450, (i) => ({ message: `c${i}` }));
    const first = await log(root);
    const snapshot = snapshotOf(first.nextCursor!);
    const raw = (v: unknown) =>
      Buffer.from(JSON.stringify(v)).toString('base64url');
    for (const cursor of [
      encodeCursor(LOAD_LIMIT + 1, snapshot),
      encodeCursor(-1, snapshot),
      encodeCursor(1.5, snapshot),
      raw({ skip: '200', snapshot }),
      raw({ skip: 200 }),
      raw([200, snapshot]),
      raw(null),
      Buffer.from('not json').toString('base64url'),
      '%%%',
      'abc=',
      '',
      'A'.repeat(600),
    ])
      await assert.rejects(log(root, false, undefined, undefined, cursor), {
        message: /^잘못된 페이지 커서입니다/,
      });
    await assert.rejects(
      log(root, false, undefined, undefined, 42 as unknown as string),
      { message: /^잘못된 페이지 커서입니다/ },
    );
    const stale =
      /^stale-cursor: 이력이 바뀌었습니다\. 처음부터 다시 불러옵니다\./;
    // 범위나 필터가 달라진 요청에 이전 커서를 쓰면 다른 목록의 위치이므로 거부한다.
    await assert.rejects(
      log(root, true, undefined, undefined, first.nextCursor),
      {
        message: stale,
      },
    );
    await assert.rejects(
      log(root, false, undefined, { author: 'x' }, first.nextCursor),
      { message: stale },
    );
    await assert.rejects(
      log(root, false, 'refs/heads/main', undefined, first.nextCursor),
      { message: stale },
    );
    const second = await log(
      root,
      false,
      undefined,
      undefined,
      first.nextCursor,
    );
    assert.equal(second.commits.length, 200);
    // 다른 브랜치만 생겨도 --all 목록이 바뀔 수 있으므로 커서를 무효로 본다.
    await git(root, ['update-ref', 'refs/heads/side', `${first.head}~300`]);
    await assert.rejects(
      log(root, false, undefined, undefined, second.nextCursor),
      {
        message: stale,
      },
    );
    await git(root, ['update-ref', '-d', 'refs/heads/side']);
    assert.equal(
      (await log(root, false, undefined, undefined, second.nextCursor)).commits
        .length,
      50,
    );
    await git(root, ['update-ref', 'refs/remotes/origin/main', first.head!]);
    await assert.rejects(
      log(root, false, undefined, undefined, second.nextCursor),
      {
        message: stale,
      },
    );
    const reloaded = await pages(root);
    assert.equal(
      new Set(reloaded.flatMap((r) => r.commits.map((c) => c.hash))).size,
      450,
    );
  }));
test('log pages combine with author filters and selected branches', () =>
  fixture(async (root) => {
    await chain(root, 450, (i) => ({
      author: i % 3 === 0 ? 'Alice Kim' : 'Bob Lee',
      message: `c${i}`,
    }));
    const alice = await pages(root, false, undefined, { author: 'alice' });
    assert.deepEqual(
      alice.map((r) => r.commits.length),
      [150],
    );
    const bob = await pages(root, false, 'refs/heads/main', { author: 'BOB' });
    assert.deepEqual(
      bob.map((r) => r.commits.length),
      [200, 100],
    );
    assert.ok(
      bob.flatMap((r) => r.commits).every((c) => c.author === 'Bob Lee'),
    );
    assert.equal(
      new Set(bob.flatMap((r) => r.commits.map((c) => c.hash))).size,
      300,
    );
  }));
// 5자리 16진수 문자열 16^5개를 모두 한 번씩 담는 de Bruijn 수열이다.
// 커밋 본문에 넣으면 그 커밋 해시의 앞 5자리가 본문에도 반드시 들어가 --grep에 걸린다.
function hexDeBruijn(n: number): string {
  const k = 16;
  const a = new Array(k * n).fill(0);
  const out: number[] = [];
  const db = (t: number, p: number) => {
    if (t > n) {
      if (n % p === 0) for (let j = 1; j <= p; j++) out.push(a[j]);
    } else {
      a[t] = a[t - p];
      db(t + 1, p);
      for (let j = a[t - p] + 1; j < k; j++) {
        a[t] = j;
        db(t + 1, t);
      }
    }
  };
  db(1, 1);
  const s = out.map((d) => d.toString(16)).join('');
  return s + s.slice(0, n - 1);
}
test('hash prefix row stays on the first page and is not repeated on later pages', () =>
  fixture(async (root) => {
    await chain(root, 1, () => ({
      message: `deep target\n\n${hexDeBruijn(5)}`,
    }));
    const target = (await git(root, ['rev-parse', 'HEAD'])).toString().trim();
    const prefix = target.slice(0, 5);
    await chain(root, 250, (i) => ({ message: `mention ${prefix} ${i}` }));
    const result = await pages(root, false, undefined, { text: prefix });
    assert.deepEqual(
      result.map((r) => r.commits.length),
      [201, 50],
    );
    assert.equal(result[0].commits[0].hash, target);
    const hashes = result.flatMap((r) => r.commits.map((c) => c.hash));
    assert.equal(new Set(hashes).size, 251);
    assert.ok(!result[1].commits.some((c) => c.hash === target));
  }));
test('log stops at the 5,000 commit load limit', () =>
  fixture(async (root) => {
    await chain(root, LOAD_LIMIT + 100, (i) => ({ message: `c${i}` }));
    const first = await log(root);
    const snapshot = snapshotOf(first.nextCursor!);
    const before = await log(
      root,
      false,
      undefined,
      undefined,
      encodeCursor(LOAD_LIMIT - 400, snapshot),
    );
    assert.equal(before.commits.length, 200);
    assert.equal(before.hasMore, true);
    const last = await log(
      root,
      false,
      undefined,
      undefined,
      before.nextCursor,
    );
    assert.equal(last.commits.length, 200);
    assert.equal(last.hasMore, false);
    assert.equal(last.nextCursor, undefined);
    const odd = await log(
      root,
      false,
      undefined,
      undefined,
      encodeCursor(LOAD_LIMIT - 50, snapshot),
    );
    assert.equal(odd.commits.length, 50);
    assert.equal(odd.hasMore, false);
    const end = await log(
      root,
      false,
      undefined,
      undefined,
      encodeCursor(LOAD_LIMIT, snapshot),
    );
    assert.deepEqual([end.commits.length, end.hasMore], [0, false]);
  }));
test('page arithmetic caps the window at the load limit', () => {
  assert.deepEqual(page(0, 201), {
    size: 200,
    taken: 200,
    next: 200,
    hasMore: true,
  });
  assert.deepEqual(page(400, 50), {
    size: 200,
    taken: 50,
    next: 450,
    hasMore: false,
  });
  assert.deepEqual(page(400, 200), {
    size: 200,
    taken: 200,
    next: 600,
    hasMore: false,
  });
  assert.deepEqual(page(LOAD_LIMIT - 200, 201), {
    size: 200,
    taken: 200,
    next: LOAD_LIMIT,
    hasMore: false,
  });
  assert.deepEqual(page(LOAD_LIMIT, 0), {
    size: 0,
    taken: 0,
    next: LOAD_LIMIT,
    hasMore: false,
  });
});

async function branches(
  root: string,
  commit: (msg: string) => Promise<string>,
) {
  await writeFile(join(root, 'shared'), 'one\n');
  await writeFile(join(root, 'moved'), 'moved content\n'.repeat(20));
  const fork = await commit('base');
  await git(root, ['checkout', '-b', 'feature']);
  await writeFile(join(root, 'feature'), 'feature');
  await writeFile(join(root, 'shared'), 'one\nfeature\n');
  await rename(join(root, 'moved'), join(root, 'renamed'));
  const feature = await commit('feature');
  await git(root, ['checkout', 'main']);
  await writeFile(join(root, 'main-only'), 'main');
  const main = await commit('main');
  return { fork, feature, main };
}
const nameStatus = async (root: string, args: string[]) =>
  (await git(root, ['diff', '-M', '--name-status', ...args]))
    .toString()
    .trim()
    .split('\n')
    .map((line) => line.split('\t').at(-1))
    .sort();
test('range compares two branch tips, with optional merge-base left side', () =>
  fixture(async (root, commit) => {
    const { fork, feature, main } = await branches(root, commit);
    const set = await changes(root, {
      kind: 'range',
      base: main,
      target: feature,
    });
    assert.deepEqual(
      set.files.map((f) => f.path).sort(),
      await nameStatus(root, [main, feature]),
    );
    assert.equal(set.left, main);
    assert.equal(set.right, feature);
    assert.deepEqual(set.comparison, {
      kind: 'range',
      base: main,
      target: feature,
      mergeBase: false,
    });
    assert.ok(
      set.files.some((f) => f.path === 'main-only' && f.status === 'D'),
    );
    const merged = await changes(root, {
      kind: 'range',
      base: main,
      target: feature,
      mergeBase: true,
    });
    assert.equal(merged.left, fork);
    assert.deepEqual(
      merged.files.map((f) => f.path).sort(),
      await nameStatus(root, [fork, feature]),
    );
    assert.ok(!merged.files.some((f) => f.path === 'main-only'));
    const shared = await diff(
      root,
      { kind: 'range', base: main, target: feature, mergeBase: true },
      'shared',
    );
    assert.equal(shared.original.text, 'one\n');
    assert.equal(shared.modified.text, 'one\nfeature\n');
    const renamed = await diff(
      root,
      { kind: 'range', base: main, target: feature },
      'renamed',
    );
    assert.equal(renamed.file.oldPath, 'moved');
    assert.equal(renamed.original.text, renamed.modified.text);
    const added = await diff(
      root,
      { kind: 'range', base: main, target: feature },
      'feature',
    );
    assert.equal(added.original.kind, 'missing');
    assert.equal(added.modified.text, 'feature');
  }));
test('range rejects orphan merge-base, same commit, short hashes and over 2,000 files', () =>
  fixture(async (root, commit) => {
    const { fork, main } = await branches(root, commit);
    await git(root, ['checkout', '--orphan', 'orphan']);
    await git(root, ['rm', '-rf', '--quiet', '.']);
    await writeFile(join(root, 'orphan'), 'orphan');
    const orphan = await commit('orphan');
    const plain = await changes(root, {
      kind: 'range',
      base: main,
      target: orphan,
    });
    assert.ok(plain.files.length > 0);
    await assert.rejects(
      changes(root, {
        kind: 'range',
        base: main,
        target: orphan,
        mergeBase: true,
      }),
      /공통 조상이 없습니다/,
    );
    await assert.rejects(
      changes(root, { kind: 'range', base: main, target: main }),
      /같은 커밋입니다/,
    );
    // target이 base의 조상이면 merge-base가 target 자신이 된다.
    await assert.rejects(
      changes(root, {
        kind: 'range',
        base: main,
        target: fork,
        mergeBase: true,
      }),
      /같은 커밋입니다/,
    );
    await assert.rejects(
      changes(root, { kind: 'range', base: main.slice(0, 7), target: fork }),
      /전체 커밋 해시/,
    );
    await assert.rejects(
      changes(root, { kind: 'range', base: main, target: 'main' }),
      /전체 커밋 해시/,
    );
    await git(root, ['checkout', 'main']);
    await mkdir(join(root, 'many'));
    for (let i = 0; i <= 2000; i++)
      await writeFile(join(root, 'many', `f${i}`), String(i));
    const many = await commit('many');
    await assert.rejects(
      changes(root, { kind: 'range', base: main, target: many }),
      /2,000개를 초과/,
    );
  }));
test('descriptor version: range documents are version 2, version 1 cannot carry range', () => {
  const hash = 'a'.repeat(40);
  assert.equal(descriptorVersion({ kind: 'working' }), 1);
  assert.equal(descriptorVersion({ kind: 'commit', commit: hash }), 1);
  assert.equal(
    descriptorVersion({ kind: 'range', base: hash, target: hash }),
    2,
  );
  const range = { kind: 'range', base: hash, target: hash };
  checkDescriptorVersion({ version: 1, comparison: { kind: 'working' } });
  checkDescriptorVersion({ version: 2, comparison: range });
  assert.throws(
    () => checkDescriptorVersion({ version: 1, comparison: range }),
    /지원하지 않는 비교 문서/,
  );
  assert.throws(
    () => checkDescriptorVersion({ version: 3, comparison: range }),
    /지원하지 않는 비교 문서/,
  );
  assert.throws(() => checkDescriptorVersion(null), /지원하지 않는/);
});
test('worker open saves range as version 2, reopens it, and keeps version 1 documents', () =>
  fixture(async (root, commit) => {
    const { feature, main } = await branches(root, commit);
    const handlers = new Map<string, (input: unknown) => unknown>();
    const opened: string[] = [];
    activate({
      api: { major: 1, minor: 3 },
      panels: {
        handle: (name, fn) => {
          handlers.set(name, fn);
        },
      },
      log() {},
      host: {
        has: () => true,
        async call(name, params) {
          if (name === 'workspace.readContext')
            return { displayName: 'Fixture', branch: 'main', terminals: [] };
          if (name === 'workspace.list')
            return {
              workspaces: [
                {
                  id: 'local',
                  kind: 'worktree',
                  name: 'Fixture',
                  branch: 'main',
                  path: root,
                  hostId: 'local',
                },
              ],
            };
          if (name === 'workspace.open') return { opened: true };
          if (name === 'editor.open') {
            opened.push((params as { path: string }).path);
            return { opened: true };
          }
          throw Error(name);
        },
      },
    });
    await handlers.get('active')!({});
    const open = (descriptor: unknown) =>
      handlers.get('open')!({ descriptor, workspaceId: 'local' });
    const saved = async () =>
      JSON.parse(await readFile(join(root, opened.at(-1)!), 'utf8'));
    const range = {
      kind: 'range',
      base: main,
      target: feature,
      mergeBase: true,
    };
    await open({ version: 2, repo: root, comparison: range, path: 'shared' });
    const v2 = await saved();
    assert.equal(v2.version, 2);
    assert.deepEqual(v2.comparison, range);
    await open(v2);
    assert.equal(opened.length, 2);
    assert.equal((await saved()).version, 2);
    await open({
      version: 1,
      repo: root,
      comparison: { kind: 'commit', commit: feature },
      path: 'feature',
    });
    assert.equal((await saved()).version, 1);
    await assert.rejects(
      async () => open({ version: 1, repo: root, comparison: range }),
      /지원하지 않는 비교 문서/,
    );
    assert.equal(opened.length, 3);
  }));

interface ImportCommit {
  author?: string;
  message: string;
  ops?: string[];
}
const put = (path: string, content: string) =>
  `M 100644 inline ${path}\ndata ${Buffer.byteLength(content)}\n${content}\n`;
const move = (from: string, to: string) => `R ${from} ${to}\n`;
// chain은 파일을 만들지 못하므로 파일 변경이 필요한 이력만 이 도우미로 쌓는다.
async function importCommits(root: string, commits: ImportCommit[]) {
  const parts = commits.map(
    ({ author = 'Fixture User', message, ops = [] }, i) => {
      const who = `${author} <fixture@example.invalid> ${1700000000 + i} +0000`;
      return [
        `commit refs/heads/main\nauthor ${who}\ncommitter ${who}\n`,
        `data ${Buffer.byteLength(message)}\n${message}\n`,
        ...ops,
        '\n',
      ].join('');
    },
  );
  await new Promise<void>((done, fail) => {
    const child = spawn('git', ['fast-import', '--quiet'], {
      cwd: root,
      stdio: ['pipe', 'ignore', 'inherit'],
    });
    child.on('error', fail);
    child.on('close', (code) =>
      code === 0 ? done() : fail(new Error(`fast-import ${code}`)),
    );
    child.stdin.end(parts.join(''));
  });
}
const hashesOf = (result: Awaited<ReturnType<typeof log>>[]) =>
  result.flatMap((r) => r.commits.map((c) => c.hash));
const revList = async (root: string, args: string[]) =>
  (await git(root, ['rev-list', '--topo-order', ...args]))
    .toString()
    .trim()
    .split('\n')
    .filter(Boolean);
const STALE = /^stale-cursor: 이력이 바뀌었습니다\. 처음부터 다시 불러옵니다\./;

test('stale 커서 오류 문구는 UI가 판별하는 접두사로 시작한다', () => {
  // worker와 fixture는 i18n 검사 때문에 원문을 풀어 쓰므로 접두사가 어긋나지 않게 여기서 묶는다.
  assert.ok(
    'stale-cursor: 이력이 바뀌었습니다.'.startsWith(STALE_CURSOR_PREFIX),
  );
  assert.ok(STALE.source.startsWith(`^${STALE_CURSOR_PREFIX}`));
});

test('필터와 페이징을 함께 쓴 뒤 ref가 움직이면 stale-cursor이고, 처음부터 다시 불러오면 중복도 누락도 없다', () =>
  fixture(async (root) => {
    await chain(root, 450, (i) => ({
      author: i % 2 === 0 ? 'Alice Kim' : 'Bob Lee',
      message: `c${i}`,
    }));
    const filter = { author: 'alice' };
    const grep = ['--author=alice', '--fixed-strings', '--regexp-ignore-case'];
    const first = await log(root, false, undefined, filter);
    assert.equal(first.commits.length, 200);
    assert.ok(first.nextCursor);
    // 커서가 필터에 묶여 있어 같은 위치라도 필터를 바꾸면 쓸 수 없다.
    await assert.rejects(
      log(root, false, undefined, { author: 'bob' }, first.nextCursor),
      { message: STALE },
    );
    assert.equal(
      (await log(root, false, undefined, filter, first.nextCursor)).commits
        .length,
      25,
    );

    // 페이지 사이에 앞으로 한 커밋 나아가면 skip 위치가 밀리므로 커서를 거부한다.
    await chain(root, 1, () => ({ author: 'Alice Kim', message: 'forward' }));
    await assert.rejects(
      log(root, false, undefined, filter, first.nextCursor),
      { message: STALE },
    );
    const forward = await pages(root, false, undefined, filter);
    assert.deepEqual(
      forward.map((r) => r.commits.length),
      [200, 26],
    );
    assert.equal(forward[0].commits[0].subject, 'forward');
    assert.deepEqual(hashesOf(forward), await revList(root, [...grep, 'HEAD']));
    assert.equal(new Set(hashesOf(forward)).size, 226);

    // 브랜치를 함께 고른 상태에서 선택한 브랜치 끝이 뒤로 가도 마찬가지다.
    const ref = 'refs/heads/main';
    const picked = await log(root, false, ref, filter);
    await git(root, ['update-ref', ref, `${picked.head}~5`]);
    await assert.rejects(log(root, false, ref, filter, picked.nextCursor), {
      message: STALE,
    });
    const rewound = await pages(root, false, ref, filter);
    assert.deepEqual(hashesOf(rewound), await revList(root, [...grep, ref]));
    assert.equal(new Set(hashesOf(rewound)).size, hashesOf(rewound).length);
    assert.ok(!hashesOf(rewound).includes(picked.head!));
  }));

// renameAt번째 커밋에서 old.txt를 new.txt로 이름만 바꾼다. sparse면 홀수 번째 커밋은 다른 파일만 건드린다.
async function renamedHistory(
  root: string,
  total: number,
  renameAt: number,
  sparse: boolean,
) {
  const body = Array.from({ length: 40 }, (_, i) => `line ${i}`).join('\n');
  await importCommits(
    root,
    Array.from({ length: total }, (_, i): ImportCommit => {
      const message = `c${i}`;
      if (sparse && i % 2 === 1)
        return { message, ops: [put('noise.txt', `n${i}\n`)] };
      if (i === renameAt) return { message, ops: [move('old.txt', 'new.txt')] };
      const file = i < renameAt ? 'old.txt' : 'new.txt';
      return { message, ops: [put(file, `${body}\nrev ${i}\n`)] };
    }),
  );
}
// rev-list는 --follow를 받지 않아 log로 기대 목록을 만든다.
const followed = async (root: string, path: string) =>
  (
    await git(root, [
      'log',
      '--topo-order',
      '--follow',
      '--format=%H',
      'HEAD',
      '--',
      path,
    ])
  )
    .toString()
    .trim()
    .split('\n');
const indexOf = (c: { subject: string }) => Number(c.subject.slice(1));
test('follow와 페이징은 모든 커밋이 파일을 건드리고 이름 변경이 둘째 페이지 안에 있을 때 옛 이름 이력까지 이어진다', () =>
  fixture(async (root) => {
    await renamedHistory(root, 350, 100, false);
    const filter = { path: 'new.txt', follow: true };
    const expected = await followed(root, 'new.txt');
    assert.equal(expected.length, 350);
    const result = await pages(root, false, undefined, filter);
    assert.deepEqual(
      result.map((r) => r.commits.length),
      [200, 150],
    );
    assert.deepEqual(hashesOf(result), expected);
    // 첫 페이지는 전부 이름 변경 이후이고, 이름 변경 커밋(c100)과 옛 이름 이력은 둘째 페이지에서 이어진다.
    assert.ok(result[0].commits.every((c) => indexOf(c) > 100));
    assert.ok(result[1].commits.some((c) => indexOf(c) === 100));
    assert.equal(indexOf(result[1].commits.at(-1)!), 0);
    // follow를 끄면 이름 변경 이후 이력만 남는다.
    const plain = await pages(root, false, undefined, { path: 'new.txt' });
    assert.deepEqual(
      plain.map((r) => r.commits.length),
      [200, 50],
    );
    // 받은 follow 커서를 follow 없이 쓰거나 다른 파일에 쓰면 다른 목록의 위치이므로 거부한다.
    await assert.rejects(
      log(root, false, undefined, { path: 'new.txt' }, result[0].nextCursor),
      { message: STALE },
    );
    await assert.rejects(
      log(
        root,
        false,
        undefined,
        { path: 'old.txt', follow: true },
        result[0].nextCursor,
      ),
      { message: STALE },
    );
  }));
// git log의 --skip은 --follow와 함께 쓰면 경로에 걸리지 않는 커밋까지 세므로 워커는 follow일 때 --skip을 쓰지 않는다.
test('follow와 페이징은 파일을 건드리지 않는 커밋이 섞인 이력에서도 중복 없이 이어진다', () =>
  fixture(async (root) => {
    await renamedHistory(root, 450, 100, true);
    const expected = await followed(root, 'new.txt');
    assert.equal(expected.length, 225);
    const result = await pages(root, false, undefined, {
      path: 'new.txt',
      follow: true,
    });
    assert.deepEqual(hashesOf(result), expected);
    assert.deepEqual(
      result.map((r) => r.commits.length),
      [200, 25],
    );
  }));
// --skip으로 건너뛴 커밋은 diff하지 않아 --follow가 그 안의 이름 변경을 놓치므로 처음부터 받아 잘라낸다.
test('follow와 페이징은 이름 변경 커밋이 앞 페이지에 있어도 옛 이름 이력이 이어진다', () =>
  fixture(async (root) => {
    await renamedHistory(root, 350, 250, false);
    const expected = await followed(root, 'new.txt');
    assert.equal(expected.length, 350);
    const result = await pages(root, false, undefined, {
      path: 'new.txt',
      follow: true,
    });
    assert.deepEqual(hashesOf(result), expected);
    assert.deepEqual(
      result.map((r) => r.commits.length),
      [200, 150],
    );
  }));
// 홀수 번째는 다른 파일만 건드리므로 짝수 번째만 세어 400커밋은 200개, 401커밋은 201개가 된다.
test('follow와 페이징은 파일을 건드린 커밋이 정확히 200개면 한 페이지로 끝난다', () =>
  fixture(async (root) => {
    await renamedHistory(root, 400, 100, true);
    const exact = await pages(root, false, undefined, {
      path: 'new.txt',
      follow: true,
    });
    assert.deepEqual(
      exact.map((r) => r.commits.length),
      [200],
    );
    assert.equal(exact[0].hasMore, false);
    assert.deepEqual(hashesOf(exact), await followed(root, 'new.txt'));
  }));
test('follow와 페이징은 파일을 건드린 커밋이 201개면 200/1로 나뉘고 마지막은 옛 이름의 첫 커밋이다', () =>
  fixture(async (root) => {
    await renamedHistory(root, 401, 100, true);
    const over = await pages(root, false, undefined, {
      path: 'new.txt',
      follow: true,
    });
    assert.deepEqual(
      over.map((r) => r.commits.length),
      [200, 1],
    );
    assert.deepEqual(hashesOf(over), await followed(root, 'new.txt'));
    assert.equal(indexOf(over[1].commits[0]), 0);
  }));

test('현재 브랜치 범위에서는 태그를 추가하거나 지워도 페이징 스냅샷이 그대로여서 같은 커서가 계속 유효하다', () =>
  fixture(async (root) => {
    await chain(root, 450, (i) => ({ message: `c${i}` }));
    for (const all of [false]) {
      const first = await log(root, all);
      const baseline = await log(
        root,
        all,
        undefined,
        undefined,
        first.nextCursor,
      );
      const third = baseline.nextCursor!;
      const target = baseline.commits[10].hash;
      await git(root, ['tag', 'v-light', target]);
      await git(root, ['tag', '-a', 'v-ann', '-m', 'release', first.head!]);
      await git(root, ['tag', 'v-tail', baseline.commits.at(-1)!.hash]);
      // 태그는 스냅샷에 들어가지 않으므로 처음부터 다시 받아도 커서 문자열이 같다.
      const again = await log(root, all);
      assert.equal(again.nextCursor, first.nextCursor);
      assert.ok(again.commits[0].refs.includes('tag: v-ann'));
      const second = await log(
        root,
        all,
        undefined,
        undefined,
        first.nextCursor,
      );
      assert.deepEqual(
        second.commits.map((c) => c.hash),
        baseline.commits.map((c) => c.hash),
      );
      // 커서가 같아도 뒷 페이지의 라벨에는 새 태그가 반영된다.
      assert.ok(second.commits[10].refs.includes('tag: v-light'));
      assert.equal(
        (await log(root, all, undefined, undefined, third)).commits.length,
        50,
      );
      assert.deepEqual(
        again.branches?.map((b) => b.ref),
        ['refs/heads/main'],
      );
      await git(root, ['tag', '-d', 'v-light', 'v-ann', 'v-tail']);
      const removed = await log(
        root,
        all,
        undefined,
        undefined,
        first.nextCursor,
      );
      assert.deepEqual(
        removed.commits.map((c) => c.hash),
        baseline.commits.map((c) => c.hash),
      );
      assert.ok(
        removed.commits.every((c) =>
          c.refs.every((r) => !r.startsWith('tag: ')),
        ),
      );
      assert.equal(removed.nextCursor, third);
    }
  }));

test('--all 범위에서는 태그나 stash 같은 브랜치 밖 ref가 움직이면 이전 커서를 거부한다', () =>
  fixture(async (root) => {
    await chain(root, 450, (i) => ({ message: `c${i}` }));
    const first = await log(root, true);
    const second = await log(
      root,
      true,
      undefined,
      undefined,
      first.nextCursor,
    );
    const head = first.head!;
    const snapshot = snapshotOf(first.nextCursor!);

    // 브랜치에서 안 보이는 커밋만 가리키는 태그도 --all은 걷기 때문에 skip 위치가 밀린다.
    await git(root, ['tag', 'v-tail', second.commits.at(-1)!.hash]);
    await assert.rejects(
      log(root, true, undefined, undefined, first.nextCursor),
      { message: STALE },
    );
    const tagged = await log(root, true);
    assert.notEqual(snapshotOf(tagged.nextCursor!), snapshot);
    await git(root, ['tag', '-d', 'v-tail']);
    assert.equal(
      snapshotOf((await log(root, true)).nextCursor!),
      snapshot,
      '태그를 지우면 스냅샷이 원래대로 돌아와야 한다',
    );

    // 움직이는 태그: 같은 이름이 다른 커밋을 가리켜도 거부한다.
    await git(root, ['tag', 'v-move', head]);
    const withTag = await log(root, true);
    await git(root, ['tag', '-f', 'v-move', `${head}~100`]);
    await assert.rejects(
      log(root, true, undefined, undefined, withTag.nextCursor),
      { message: STALE },
    );
    await git(root, ['tag', '-d', 'v-move']);

    // refs/stash도 --all이 걷는 ref다.
    await writeFile(join(root, 'dirty.txt'), 'dirty\n');
    await git(root, ['add', 'dirty.txt']);
    const before = await log(root, true);
    await git(root, ['stash', 'push', '-m', 'snapshot-test']);
    await assert.rejects(
      log(root, true, undefined, undefined, before.nextCursor),
      { message: STALE },
    );
  }));

test('현재 브랜치나 선택한 브랜치 범위의 커서는 태그가 움직여도 유효하다', () =>
  fixture(async (root) => {
    await chain(root, 450, (i) => ({ message: `c${i}` }));
    const head = (await log(root)).head!;
    for (const branchRef of [undefined, 'refs/heads/main']) {
      const first = await log(root, false, branchRef);
      await git(root, ['tag', 'v-a', head]);
      await git(root, ['tag', '-f', 'v-a', `${head}~100`]);
      const second = await log(
        root,
        false,
        branchRef,
        undefined,
        first.nextCursor,
      );
      assert.equal(second.commits.length, 200);
      await git(root, ['tag', '-d', 'v-a']);
    }
  }));

test('log는 이미 취소된 signal을 받으면 git을 돌리지 않고 거부한다', () =>
  fixture(async (root) => {
    await chain(root, 5, (i) => ({ message: `c${i}` }));
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(
      log(root, false, undefined, undefined, undefined, controller.signal),
      { name: 'AbortError' },
    );
    // 취소가 다음 요청에 번지지 않는다.
    assert.equal((await log(root)).commits.length, 5);
  }));

test('commitHash도 이미 취소된 signal을 받으면 거부한다', () =>
  fixture(async (root) => {
    await chain(root, 2, (i) => ({ message: `c${i}` }));
    const hash = (await log(root)).head!;
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(commitHash(root, hash, controller.signal), {
      name: 'AbortError',
    });
    assert.equal(await commitHash(root, hash), hash);
  }));

test('cancelKey가 filter인 log 요청은 앞선 필터 요청과 진행 중인 페이지 요청을 취소하고 페이지 요청은 필터 요청을 취소하지 않는다', () =>
  fixture(async (root) => {
    await chain(root, 450, (i) => ({
      author: i % 2 ? 'Alice Kim' : 'Bob Lee',
      message: `c${i}`,
    }));
    const worker = await connectedWorker(root);
    const first = (await worker.call('log', { repo: root })) as Awaited<
      ReturnType<typeof log>
    >;
    const filtered = (filter: { author: string }) =>
      worker.call('log', { repo: root, filter, cancelKey: 'filter' });

    // 앞 요청이 끝나기 전에 같은 키로 다음 요청이 오면 앞 것은 거부되고 뒤 것은 정상 응답한다.
    const early = filtered({ author: 'Alice' });
    const late = filtered({ author: 'Bob' });
    const [earlyResult, lateResult] = await Promise.allSettled([early, late]);
    assert.equal(lateResult.status, 'fulfilled');
    assert.equal(
      (lateResult as PromiseFulfilledResult<Awaited<ReturnType<typeof log>>>)
        .value.commits.length,
      200,
    );
    assert.equal(earlyResult.status, 'rejected');
    assert.equal(
      (earlyResult as PromiseRejectedResult).reason.name,
      'AbortError',
    );

    // 키 없는 페이징 요청은 진행 중인 필터 요청을 취소하지 않는다.
    const pending = filtered({ author: 'Alice' });
    const paging = worker.call('log', {
      repo: root,
      cursor: first.nextCursor,
    });
    const [pendingResult, pagingResult] = await Promise.allSettled([
      pending,
      paging,
    ]);
    assert.equal(pendingResult.status, 'fulfilled');
    assert.equal(pagingResult.status, 'fulfilled');

    // 필터 요청이 오면 아직 도는 페이지 요청은 끊기고 필터 요청은 정상 응답한다.
    const stalePage = worker.call('log', {
      repo: root,
      cursor: first.nextCursor,
    });
    const next = filtered({ author: 'Bob' });
    const [staleResult, nextResult] = await Promise.allSettled([
      stalePage,
      next,
    ]);
    assert.equal(staleResult.status, 'rejected');
    assert.equal(
      (staleResult as PromiseRejectedResult).reason.name,
      'AbortError',
    );
    assert.equal(nextResult.status, 'fulfilled');
  }));

// 워커 핸들러를 임시 레포에 연결한다. open이 쓴 문서는 opened 경로로 다시 읽는다.
async function connectedWorker(root: string) {
  const handlers = new Map<string, (input: unknown) => unknown>();
  const opened: string[] = [];
  activate({
    api: { major: 1, minor: 3 },
    panels: {
      handle: (name, fn) => {
        handlers.set(name, fn);
      },
    },
    log() {},
    host: {
      has: () => true,
      async call(name, params) {
        if (name === 'workspace.readContext')
          return { displayName: 'Fixture', branch: 'main', terminals: [] };
        if (name === 'workspace.list')
          return {
            workspaces: [
              {
                id: 'local',
                kind: 'worktree',
                name: 'Fixture',
                branch: 'main',
                path: root,
                hostId: 'local',
              },
            ],
          };
        if (name === 'workspace.open') return { opened: true };
        if (name === 'editor.open') {
          opened.push((params as { path: string }).path);
          return { opened: true };
        }
        throw Error(name);
      },
    },
  });
  await handlers.get('active')!({});
  return {
    call: (name: string, input: unknown) => handlers.get(name)!(input),
    open: (descriptor: unknown) =>
      handlers.get('open')!({ descriptor, workspaceId: 'local' }),
    saved: async () =>
      JSON.parse(await readFile(join(root, opened.at(-1)!), 'utf8')),
    count: () => opened.length,
  };
}

test('range 문서를 version 2로 저장해 다시 열어도 같은 비교가 유지되고 version 1 문서도 그대로 열린다', () =>
  fixture(async (root, commit) => {
    const { feature, main } = await branches(root, commit);
    await writeFile(join(root, 'shared'), 'one\nlocal edit\n');
    const worker = await connectedWorker(root);
    const range = { kind: 'range', base: main, target: feature };

    await worker.open({
      version: 2,
      repo: root,
      comparison: range,
      path: 'feature',
    });
    const first = await worker.saved();
    assert.equal(first.version, 2);
    assert.deepEqual(first.comparison, { ...range, mergeBase: false });
    // 저장된 문서를 그대로 다시 열면 같은 내용으로 다시 저장된다.
    await worker.open(first);
    assert.deepEqual(await worker.saved(), first);
    await worker.open(first);
    assert.deepEqual(await worker.saved(), first);

    // 0.1.x가 만든 commit/working 문서는 version 1 그대로 열린다.
    for (const [comparison, path] of [
      [{ kind: 'commit', commit: feature }, 'feature'],
      [{ kind: 'working' }, 'shared'],
      [{ kind: 'working' }, undefined],
    ] as const) {
      await worker.open({ version: 1, repo: root, comparison, path });
      const saved = await worker.saved();
      assert.equal(saved.version, 1);
      // 저장 시 parent나 head 같은 필드가 붙을 수 있어 비교 종류와 식별 값만 본다.
      assert.equal(saved.comparison.kind, comparison.kind);
      if (comparison.kind === 'commit')
        assert.equal(saved.comparison.commit, comparison.commit);
      assert.equal(saved.path, path);
      await worker.open(saved);
      assert.deepEqual(await worker.saved(), saved);
    }

    // range가 사라진 파일을 가리키거나 해시가 짧으면 문서를 만들지 않는다.
    const before = worker.count();
    await assert.rejects(
      async () =>
        worker.open({
          version: 2,
          repo: root,
          comparison: range,
          path: 'gone',
        }),
      /변경 파일이 사라졌습니다/,
    );
    await assert.rejects(
      async () =>
        worker.open({
          version: 2,
          repo: root,
          comparison: { ...range, base: main.slice(0, 7) },
        }),
      /전체 커밋 해시/,
    );
    await assert.rejects(
      async () => worker.open({ version: 1, repo: root, comparison: range }),
      /지원하지 않는 비교 문서/,
    );
    assert.equal(worker.count(), before);
  }));

test('전체 브랜치 범위의 follow 거부는 다른 필터나 커서가 함께 와도 유지된다', () =>
  fixture(async (root) => {
    await chain(root, 250, (i) => ({
      author: i % 2 === 0 ? 'Alice Kim' : 'Bob Lee',
      message: `c${i}`,
    }));
    const refusal = /전체 브랜치에서는 이름 변경 추적을 쓸 수 없습니다/;
    const first = await log(root, true);
    const combos = [
      { path: 'a.txt', follow: true },
      { follow: true },
      { path: 'a.txt', follow: true, author: 'alice' },
      {
        path: 'a.txt',
        follow: true,
        text: 'c1',
        since: '2023-01-01',
        until: '2024-01-01',
      },
    ];
    for (const filter of combos) {
      await assert.rejects(log(root, true, undefined, filter), refusal);
      // 유효한 커서를 들고 와도 stale-cursor가 아니라 같은 사유로 거부한다.
      await assert.rejects(
        log(root, true, undefined, filter, first.nextCursor),
        refusal,
      );
      // 같은 필터라도 follow만 빼면 all 범위에서 정상 동작한다.
      const { follow: _follow, ...rest } = filter;
      assert.ok(
        Array.isArray((await log(root, true, undefined, rest)).commits),
      );
    }
    // 현재 브랜치 범위에서는 같은 요청이 거부되지 않는다.
    await log(root, false, undefined, combos[2]);
    const worker = await connectedWorker(root);
    for (const filter of combos)
      await assert.rejects(
        async () =>
          worker.call('log', {
            repo: root,
            all: true,
            filter,
            cursor: first.nextCursor,
          }),
        refusal,
      );
    assert.equal(
      (
        (await worker.call('log', {
          repo: root,
          all: true,
          filter: { author: 'bob' },
        })) as Awaited<ReturnType<typeof log>>
      ).commits.length,
      125,
    );
  }));

// 번들된 테스트 파일 옆에는 소스가 없어 실행 위치(워크스페이스 루트 또는 플러그인 폴더) 기준으로 읽는다.
async function workerSources() {
  const dirs = [
    join(process.cwd(), 'plugins/git-logs/src/worker'),
    join(process.cwd(), 'src/worker'),
  ];
  for (const dir of dirs) {
    const names = await readdir(dir).catch(() => undefined);
    if (!names) continue;
    const sources = new Map<string, string>();
    for (const name of names.filter(
      (n) => n.endsWith('.ts') && !n.endsWith('.test.ts'),
    ))
      sources.set(
        name,
        (await readFile(join(dir, name), 'utf8'))
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/^\s*\/\/.*$/gm, ''),
      );
    return sources;
  }
  throw new Error('worker 소스 위치를 찾지 못했습니다.');
}
test('worker의 Git 실행은 전부 git(root, [...]) 인자 배열 래퍼를 거치고 셸이나 문자열 조합 실행이 없다', async () => {
  const sources = await workerSources();
  for (const name of ['git.ts', 'main.ts', 'operations.ts', 'local-ignore.ts'])
    assert.ok(sources.has(name), `${name} 소스를 읽지 못했습니다.`);
  const calls = new Map<string, number>();
  for (const [name, source] of sources) {
    // child_process는 래퍼를 가진 git.ts만 쓰고, 그 안에서도 execFile 하나뿐이다.
    const imports = [
      ...source.matchAll(
        /(?:from\s+|require\(\s*)['"](?:node:)?child_process['"]/g,
      ),
    ];
    if (name === 'git.ts') {
      assert.equal(imports.length, 1);
      assert.match(
        source,
        /import\s*\{\s*execFile\s*\}\s*from\s*'node:child_process'/,
      );
      assert.equal([...source.matchAll(/\bexec\(/g)].length, 1);
      assert.match(source, /\bexec\(\s*'git',\s*\[/);
    } else
      assert.equal(imports.length, 0, `${name}이 child_process를 가져옵니다.`);
    assert.doesNotMatch(
      source,
      /\b(?:execSync|execFileSync|spawn|spawnSync|fork)\s*\(/,
      `${name}에 동기/스트림 실행 호출이 있습니다.`,
    );
    if (name !== 'git.ts')
      assert.doesNotMatch(
        source,
        /\bexec\s*\(/,
        `${name}이 exec를 직접 호출합니다.`,
      );
    assert.doesNotMatch(
      source,
      /\bshell\s*:/,
      `${name}에 shell 옵션이 있습니다.`,
    );
    assert.doesNotMatch(
      source,
      /\.exec\s*\(\s*[`'"]/,
      `${name}에 명령 문자열 실행이 있습니다.`,
    );
    // 래퍼 호출의 둘째 인자는 배열 리터럴이거나 래퍼가 그대로 넘기는 args뿐이어야 한다.
    let count = 0;
    for (const match of source.matchAll(
      /\b(git|optional|text)\(\s*(\w+)\s*,\s*([^\s])/g,
    )) {
      count++;
      const rest = source.slice(match.index! + match[0].length - 1);
      assert.ok(
        // 두 배열 리터럴을 고르는 삼항식도 인자 배열로 본다.
        match[3] === '[' ||
          /^args\s*[,)]/.test(rest) ||
          /^\w+\s*\?\s*\[/.test(rest),
        `${name}: ${match[1]}(${match[2]}, ${rest.slice(0, 20)}…)는 인자 배열이 아닙니다.`,
      );
    }
    calls.set(name, count);
    // 첫 인자가 root가 아닌 호출이나 줄바꿈 뒤 문자열 인자도 놓치지 않는다.
    assert.doesNotMatch(source, /\b(?:git|optional|text)\(\s*\w+\s*,\s*[`'"]/);
    assert.doesNotMatch(source, /\bgit\(\s*[`'"]/);
  }
  // 정규식이 아무것도 못 잡아 검사가 헛도는 일을 막는다.
  assert.ok(calls.get('git.ts')! >= 15);
  assert.ok(calls.get('operations.ts')! >= 8);
  assert.ok(calls.get('main.ts')! >= 1);
  // operations.ts는 읽기만 하고 같은 래퍼를 가져다 쓴다.
  assert.match(
    sources.get('operations.ts')!,
    /import\s*\{[^}]*\bgit\b[^}]*\}\s*from\s*'\.\/git'/,
  );
  assert.match(
    sources.get('main.ts')!,
    /import\s*\{[^}]*\bgit\b[^}]*\}\s*from\s*'\.\/git'/,
  );
});
