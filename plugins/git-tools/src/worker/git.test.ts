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
test('worker requires explicit connection and validates workspace before opening generated descriptor', () =>
  fixture(async (root, commit) => {
    await commit('base');
    await writeFile(join(root, 'new'), 'new');
    const handlers = new Map<string, (input: unknown) => unknown>();
    let opened = '';
    const api = { major: 1, minor: 3 };
    const methods = new Set([
      'workspace.list',
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
          if (name === 'workspace.list')
            return {
              workspaces: [
                { id: 'local', name: 'Fixture', path: root, hostId: 'local' },
                { id: 'remote', name: 'SSH', path: root, hostId: 'ssh' },
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
    await handlers.get('connect')!({ path: root });
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
