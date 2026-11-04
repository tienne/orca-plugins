import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  rm,
  realpath,
  symlink,
  link,
  stat,
  open,
  rename,
  chmod,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { git } from './git';
import { ensureLocalIgnore } from './local-ignore';
import activate from './main';
import type { WorkerApi, ChangeSet } from '../protocol';
const rule = '/.orca/git-logs/';
async function fixture(run: (root: string, parent: string) => Promise<void>) {
  const parent = await realpath(
    await mkdtemp(join(tmpdir(), 'local-ignore-fixture-')),
  );
  const root = join(parent, 'main');
  try {
    await mkdir(root);
    await git(root, ['init', '-b', 'main']);
    await git(root, ['config', 'user.name', 'Fixture']);
    await git(root, ['config', 'user.email', 'fixture@example.invalid']);
    await git(root, ['config', 'core.excludesFile', '/dev/null']);
    await git(root, ['config', 'core.hooksPath', '/dev/null']);
    await writeFile(join(root, '.gitignore'), 'node_modules/\n');
    await git(root, ['add', '.']);
    await git(root, ['-c', 'commit.gpgSign=false', 'commit', '-m', 'Fixture']);
    await run(root, parent);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
}
const exclude = (root: string) => join(root, '.git/info/exclude');

test('local exclude is appended once under concurrent setup, preserving bytes and shared ignore', () =>
  fixture(async (root) => {
    const before = Buffer.from('# user rules\r\nbuild/');
    await writeFile(exclude(root), before);
    const shared = await readFile(join(root, '.gitignore'));
    await Promise.all(
      Array.from({ length: 12 }, () => ensureLocalIgnore(root)),
    );
    const after = await readFile(exclude(root));
    assert.ok(after.subarray(0, before.length).equals(before));
    assert.equal(after.toString(), before + '\r\n' + rule + '\r\n');
    await mkdir(join(root, '.orca/git-logs'), { recursive: true });
    await writeFile(join(root, '.orca/git-logs/example.orcadiff'), '{}');
    await writeFile(
      join(root, '.orca/other.txt'),
      'Do not hide unrelated files.',
    );
    assert.equal(
      (await git(root, ['status', '--porcelain', '--untracked-files=all']))
        .toString()
        .trim(),
      '?? .orca/other.txt',
    );
    assert.ok(shared.equals(await readFile(join(root, '.gitignore'))));
    assert.equal((await git(root, ['diff', '--cached'])).length, 0);
  }));

test('linked worktrees share the Git-discovered exclude without duplicate lines', () =>
  fixture(async (root, parent) => {
    const linked = join(parent, 'linked');
    await git(root, ['worktree', 'add', '-b', 'feature', linked]);
    await Promise.all([
      ensureLocalIgnore(root),
      ensureLocalIgnore(linked),
      ensureLocalIgnore(linked),
    ]);
    assert.equal(
      (await readFile(exclude(root), 'utf8'))
        .split('\n')
        .filter((line) => line === rule).length,
      1,
    );
    await git(linked, [
      'check-ignore',
      '--quiet',
      '--',
      '.orca/git-logs/example.orcadiff',
    ]);
    assert.equal((await git(root, ['status', '--porcelain'])).length, 0);
    assert.equal((await git(linked, ['status', '--porcelain'])).length, 0);
  }));

test('shared ignore does not replace the one-time local rule', () =>
  fixture(async (root) => {
    await writeFile(join(root, '.gitignore'), '.orca/\n');
    const before = await readFile(exclude(root));
    await ensureLocalIgnore(root);
    const after = await readFile(exclude(root));
    assert.ok(after.subarray(0, before.length).equals(before));
    assert.equal(
      after
        .toString()
        .split('\n')
        .filter((line) => line === rule).length,
      1,
    );
    assert.equal(await readFile(join(root, '.gitignore'), 'utf8'), '.orca/\n');
  }));

test('missing Git exclude metadata is not created implicitly', () =>
  fixture(async (root) => {
    await rm(exclude(root));
    await assert.rejects(() => ensureLocalIgnore(root));
    await assert.rejects(() => stat(exclude(root)), { code: 'ENOENT' });
    await rm(join(root, '.git/info'), { recursive: true });
    await assert.rejects(() => ensureLocalIgnore(root));
    await assert.rejects(() => stat(join(root, '.git/info')), {
      code: 'ENOENT',
    });
  }));

test('symlinked exclude and info paths never change their outside targets', () =>
  fixture(async (root, parent) => {
    const outside = join(parent, 'outside');
    await writeFile(outside, '# untouched\n');
    await rm(exclude(root));
    await symlink(outside, exclude(root));
    await assert.rejects(() => ensureLocalIgnore(root));
    assert.equal(await readFile(outside, 'utf8'), '# untouched\n');
    await rm(join(root, '.git/info'), { recursive: true });
    const directory = join(parent, 'outside-info');
    await mkdir(directory);
    await writeFile(join(directory, 'exclude'), '# untouched directory\n');
    await symlink(directory, join(root, '.git/info'));
    await assert.rejects(() => ensureLocalIgnore(root), /real directory/);
    assert.equal(
      await readFile(join(directory, 'exclude'), 'utf8'),
      '# untouched directory\n',
    );
  }));

test('hard links and oversized local excludes are rejected without modification', () =>
  fixture(async (root, parent) => {
    const outside = join(parent, 'outside');
    await writeFile(outside, '# keep\n');
    await rm(exclude(root));
    await link(outside, exclude(root));
    await assert.rejects(() => ensureLocalIgnore(root), /hard links/);
    assert.equal(await readFile(outside, 'utf8'), '# keep\n');
    await rm(exclude(root));
    const large = '#\n'.repeat(600000);
    await writeFile(exclude(root), large);
    await assert.rejects(() => ensureLocalIgnore(root), /small regular/);
    assert.equal((await stat(exclude(root))).size, Buffer.byteLength(large));
  }));

test('higher-priority unignore rules are preserved and do not cause repeated appends', () =>
  fixture(async (root) => {
    const shared = '!/.orca/git-logs/\n!/.orca/git-logs/**\n';
    await writeFile(join(root, '.gitignore'), shared);
    await ensureLocalIgnore(root);
    const first = await readFile(exclude(root));
    await ensureLocalIgnore(root);
    await assert.rejects(() =>
      git(root, [
        'check-ignore',
        '--quiet',
        '--',
        '.orca/git-logs/test.orcadiff',
      ]),
    );
    assert.ok(first.equals(await readFile(exclude(root))));
    assert.equal(await readFile(join(root, '.gitignore'), 'utf8'), shared);
  }));

test('already tracked documents are not removed from the index', () =>
  fixture(async (root) => {
    await mkdir(join(root, '.orca/git-logs'), { recursive: true });
    await writeFile(join(root, '.orca/git-logs/tracked.orcadiff'), '{}');
    await git(root, ['add', '.orca/git-logs/tracked.orcadiff']);
    const index = await git(root, ['ls-files', '--stage']);
    await ensureLocalIgnore(root);
    assert.ok(index.equals(await git(root, ['ls-files', '--stage'])));
  }));

test('created and changed events verify local workspace identity; panel and diff requests repair existing worktrees', () =>
  fixture(async (root) => {
    const handlers = new Map<string, (value: unknown) => unknown>();
    const events = new Map<string, (value: never) => void | Promise<void>>();
    const logs: string[] = [];
    const local = {
      id: 'local',
      kind: 'worktree',
      name: 'Fixture',
      branch: 'main',
      path: root,
      hostId: 'local',
    };
    let rows = [local, { ...local, id: 'ssh', name: 'SSH', hostId: 'ssh' }];
    let truncated = false;
    const api: WorkerApi = {
      api: { major: 1, minor: 3 },
      log: (message) => logs.push(message),
      panels: {
        handle(name, fn) {
          handlers.set(name, fn);
        },
      },
      events: {
        on(name, fn) {
          events.set(name, fn as (value: never) => void | Promise<void>);
          return { dispose() {} };
        },
      },
      host: {
        has: () => true,
        async call(name) {
          if (name === 'workspace.list') return { workspaces: rows, truncated };
          if (name === 'workspace.readContext')
            return { displayName: 'Fixture', branch: 'main', terminals: [] };
          if (name === 'workspace.open' || name === 'editor.open')
            return { opened: true };
          throw new Error(name);
        },
      },
    };
    activate(api);
    const emit = (name: string, value: unknown) =>
      events.get(name)!(value as never);
    const before = await readFile(exclude(root));
    await emit('workspace.created', {
      workspaceId: 'ssh',
      kind: 'worktree',
      path: root,
    });
    await emit('workspace.created', {
      workspaceId: 'local',
      kind: 'folder',
      path: root,
    });
    await emit('workspace.created', {
      workspaceId: 'forged',
      kind: 'worktree',
      path: root,
    });
    assert.ok(before.equals(await readFile(exclude(root))));
    await emit('workspace.created', {
      workspaceId: 'local',
      kind: 'worktree',
      path: root,
    });
    assert.ok((await readFile(exclude(root), 'utf8')).includes(rule));
    await writeFile(exclude(root), before);
    rows = [local, { ...local, id: 'ambiguous' }];
    await emit('workspace.changed', {
      context: { displayName: 'Not trusted', branch: 'other' },
    });
    assert.ok(before.equals(await readFile(exclude(root))));
    rows = [local];
    truncated = true;
    await emit('workspace.changed', { context: null });
    assert.ok(before.equals(await readFile(exclude(root))));
    truncated = false;
    await emit('workspace.changed', { context: null });
    assert.ok((await readFile(exclude(root), 'utf8')).includes(rule));
    await writeFile(exclude(root), before);
    await handlers.get('active')!({});
    assert.ok((await readFile(exclude(root), 'utf8')).includes(rule));
    await writeFile(exclude(root), before);
    const result = (await handlers.get('changes')!({
      repo: root,
      comparison: { kind: 'working' },
    })) as ChangeSet;
    assert.equal(result.setupWarning, undefined);
    assert.ok((await readFile(exclude(root), 'utf8')).includes(rule));
    await writeFile(join(root, 'new.txt'), 'change');
    await writeFile(exclude(root), before);
    await handlers.get('open')!({
      workspaceId: 'local',
      descriptor: {
        version: 1,
        repo: root,
        comparison: { kind: 'working' },
        path: 'new.txt',
      },
    });
    assert.ok((await readFile(exclude(root), 'utf8')).includes(rule));
    // Setup trouble must not hide the graph, but must prevent another generated file.
    await writeFile(
      join(root, '.gitignore'),
      '!/.orca/git-logs/\n!/.orca/git-logs/**\n',
    );
    const warning = (await handlers.get('changes')!({
      repo: root,
      comparison: { kind: 'working' },
    })) as ChangeSet;
    assert.match(warning.setupWarning!, /로컬 제외 규칙/);
    await assert.rejects(
      async () =>
        handlers.get('open')!({
          workspaceId: 'local',
          descriptor: {
            version: 1,
            repo: root,
            comparison: { kind: 'working' },
            path: 'new.txt',
          },
        }),
      /로컬 제외 규칙/,
    );
  }));

test('partial hidden-file patterns do not count as excluding descriptor files', () =>
  fixture(async (root) => {
    await writeFile(join(root, '.gitignore'), '/.orca/git-logs/.*\n');
    await ensureLocalIgnore(root);
    assert.ok((await readFile(exclude(root), 'utf8')).includes(rule));
    await mkdir(join(root, '.orca/git-logs'), { recursive: true });
    await writeFile(join(root, '.orca/git-logs/visible.orcadiff'), '{}');
    await git(root, [
      'check-ignore',
      '--quiet',
      '--',
      '.orca/git-logs/visible.orcadiff',
    ]);
    assert.ok(
      !(await git(root, ['status', '--porcelain', '--untracked-files=all']))
        .toString()
        .includes('visible.orcadiff'),
    );
  }));

test('parent replacement between validation and open cannot create an outside exclude file', () =>
  fixture(async (root, parent) => {
    const outside = join(parent, 'outside-info');
    const saved = join(parent, 'saved-info');
    await mkdir(outside);
    const original = await readFile(exclude(root));
    await assert.rejects(() =>
      ensureLocalIgnore(root, {
        async open(path, flags, mode) {
          await rename(join(root, '.git/info'), saved);
          await symlink(outside, join(root, '.git/info'));
          return open(path, flags, mode);
        },
      }),
    );
    await assert.rejects(() => stat(join(outside, 'exclude')), {
      code: 'ENOENT',
    });
    assert.ok(original.equals(await readFile(join(saved, 'exclude'))));
  }));

test('a children wildcard and descriptor unignore do not skip registering the scoped directory rule', () =>
  fixture(async (root) => {
    await writeFile(
      join(root, '.gitignore'),
      '/.orca/git-logs/*\n!*.orcadiff\n',
    );
    await ensureLocalIgnore(root);
    assert.ok((await readFile(exclude(root), 'utf8')).includes(rule));
    await mkdir(join(root, '.orca/git-logs'), { recursive: true });
    await writeFile(join(root, '.orca/git-logs/test.orcadiff'), '{}');
    await git(root, [
      'check-ignore',
      '--quiet',
      '--',
      '.orca/git-logs/test.orcadiff',
    ]);
  }));

test(
  'read-only excludes can be read when configured, but are never overwritten for setup',
  { skip: process.getuid?.() === 0 || process.platform === 'win32' },
  () =>
    fixture(async (root) => {
      await chmod(exclude(root), 0o400);
      try {
        await assert.rejects(() => ensureLocalIgnore(root));
      } finally {
        await chmod(exclude(root), 0o600);
      }
      await ensureLocalIgnore(root);
      await chmod(exclude(root), 0o400);
      try {
        await ensureLocalIgnore(root);
      } finally {
        await chmod(exclude(root), 0o600);
      }
    }),
);

test('a final CR is completed as a line ending without adding another CR', () =>
  fixture(async (root) => {
    const before = '# user\r\nbuild/\r';
    await writeFile(exclude(root), before);
    await ensureLocalIgnore(root);
    assert.equal(
      await readFile(exclude(root), 'utf8'),
      before + '\n' + rule + '\r\n',
    );
  }));
