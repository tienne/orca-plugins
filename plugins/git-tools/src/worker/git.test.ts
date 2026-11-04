import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtemp,
  writeFile,
  rm,
  rename,
  symlink,
  mkdir,
  readFile,
  realpath,
} from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { git, repository, log, changes, diff } from './git';
import { layout } from '../ui/graph';
import activate from './main';
async function fixture(
  run: (
    root: string,
    commit: (msg: string) => Promise<string>,
  ) => Promise<void>,
) {
  const root = await realpath(
    await mkdtemp(join(tmpdir(), 'git-tools-fixture-')),
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
    assert.ok(l.commits[0].message.includes('Full message'));
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
    assert.ok(opened.startsWith('.orca/git-tools/'));
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
