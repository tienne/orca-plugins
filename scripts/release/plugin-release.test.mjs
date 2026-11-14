import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  cp,
  rm,
  symlink,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  prepareRelease,
  publishRelease,
  verifyCandidate,
  orcaJson,
  git,
} from './plugin-release.mjs';

const repository = 'https://github.com/tienne/orca-plugins.git';
const integration = process.env.ORCA_RELEASE_INTEGRATION === '1';
// This mock tests release orchestration, not Orca's schema/hash algorithm. The
// integration run uses the installed Orca CLI for every validation and hash.
function mockOrca([command, path]) {
  if (command === 'validate') return { valid: true };
  assert.equal(command, 'release-entry');
  const directory = join(path, '../..');
  return readFile(join(path, 'orca-plugin.json'), 'utf8').then((raw) => {
    const manifest = JSON.parse(raw);
    const commit = git(directory, ['rev-parse', 'HEAD']);
    const tree = git(directory, [
      'rev-parse',
      `${commit}:plugins/${manifest.id}`,
    ]);
    return {
      sourcePath: `plugins/${manifest.id}`,
      entry: {
        version: manifest.version,
        commit,
        contentHash: createHash('sha256').update(tree).digest('hex'),
        execution: manifest.execution,
        minimumOrca: '1.4.248',
        name: manifest.name,
      },
    };
  });
}
const orca = integration ? orcaJson : mockOrca;
async function fixture(run) {
  const root = await mkdtemp(join(tmpdir(), 'release-test-'));
  const source = join(root, 'source'),
    remote = join(root, 'origin.git');
  const candidates = [];
  try {
    await mkdir(source);
    git(source, ['init', '-b', 'main']);
    git(source, ['config', 'user.name', 'Fixture']);
    git(source, ['config', 'user.email', 'fixture@example.invalid']);
    git(root, ['init', '--bare', remote]);
    git(source, ['remote', 'add', 'origin', repository]);
    // Redirect the public URL to a temporary bare repository. No network writes.
    git(source, ['config', `url.file://${remote}.insteadOf`, repository]);
    await writeFile(join(source, '.gitignore'), 'dist/\n');
    await writeFile(
      join(source, 'orca-catalog.json'),
      JSON.stringify({
        catalogVersion: 2,
        name: 'Fixture',
        owner: 'tienne',
        plugins: [],
      }),
    );
    const path = join(source, 'plugins/git-logs');
    await mkdir(join(path, 'ui'), { recursive: true });
    await writeFile(
      join(path, 'orca-plugin.json'),
      JSON.stringify({
        manifestVersion: 2,
        id: 'git-logs',
        name: 'Git Logs',
        version: '0.1.0',
        engines: { orca: '>=1.4.248' },
        execution: 'sandboxed-ui',
        license: 'MIT',
        description: 'Fixture only.',
        contributes: {
          panels: [
            { id: 'git-logs', title: 'Git Logs', entry: 'ui/index.html' },
          ],
        },
      }),
    );
    await writeFile(
      join(path, 'ui/index.html'),
      '<!doctype html><html><body>Fixture</body></html>',
    );
    await writeFile(join(path, 'LICENSE'), 'MIT fixture');
    await cp(path, join(source, 'dist/plugins/git-logs'), { recursive: true });
    async function save(message) {
      git(source, ['add', '.']);
      git(source, ['commit', '-m', message]);
      git(source, ['push', 'origin', 'HEAD:refs/heads/main']);
    }
    await save('Fixture source');
    async function prepare(overrides = {}) {
      const plan = await prepareRelease({
        source,
        repository,
        version: '0.1.0',
        sourceCommit: git(source, ['rev-parse', 'HEAD']),
        orca,
        ...overrides,
      });
      candidates.push(plan.directory);
      return plan;
    }
    async function version(value) {
      const manifest = JSON.parse(
        await readFile(join(path, 'orca-plugin.json'), 'utf8'),
      );
      manifest.version = value;
      const text = JSON.stringify(manifest);
      await writeFile(join(path, 'orca-plugin.json'), text);
      await writeFile(
        join(source, 'dist/plugins/git-logs/orca-plugin.json'),
        text,
      );
      await save(`Version ${value}`);
    }
    await run({ source, remote, prepare, save, version });
  } finally {
    await Promise.all(
      [...candidates, root].map((path) =>
        rm(path, { recursive: true, force: true }),
      ),
    );
  }
}

test(`first release is an orphan candidate and preview never publishes (${integration ? 'Orca CLI' : 'mock validation'})`, () =>
  fixture(async ({ source, remote, prepare }) => {
    const before = git(source, ['rev-parse', 'HEAD']);
    const plan = await prepare();
    assert.equal(plan.baseCommit, null);
    assert.equal(
      git(plan.directory, ['rev-list', '--count', plan.catalogCommit]),
      '2',
    );
    assert.equal(git(source, ['rev-parse', 'HEAD']), before);
    assert.equal(
      git(remote, ['show-ref', '--heads']),
      `${before} refs/heads/main`,
    );
    const catalog = JSON.parse(
      await readFile(join(plan.directory, 'orca-catalog.json'), 'utf8'),
    );
    assert.equal(catalog.plugins[0].releases[0].commit, plan.artifactCommit);
    assert.notEqual(plan.artifactCommit, plan.catalogCommit);
    assert.equal(
      git(plan.directory, ['ls-tree', '--name-only', plan.artifactCommit]),
      'plugins\nrelease-provenance.json',
    );
    await verifyCandidate(plan, { source, orca });
  }));

test('publishes branch and immutable source tag to a local bare remote; keeps previous releases and sibling files', () =>
  fixture(async ({ source, remote, prepare, version }) => {
    const first = await prepare();
    await publishRelease(first, { source, orca });
    assert.equal(
      git(remote, ['rev-parse', 'refs/heads/release']),
      first.catalogCommit,
    );
    assert.equal(
      git(remote, ['rev-parse', 'refs/tags/git-logs/v0.1.0']),
      first.sourceCommit,
    );
    await assert.rejects(
      () => publishRelease(first, { source, orca }),
      /Remote release changed|already exists/,
    );
    // Existing release content must survive the next candidate.
    await mkdir(join(first.directory, 'plugins/other'), { recursive: true });
    await writeFile(
      join(first.directory, 'plugins/other/README.md'),
      'Keep this sibling.',
    );
    git(first.directory, ['add', '.']);
    git(first.directory, [
      '-c',
      'user.name=Fixture',
      '-c',
      'user.email=fixture@example.invalid',
      'commit',
      '-m',
      'Sibling fixture',
    ]);
    git(source, ['fetch', first.directory, 'HEAD']);
    git(source, ['push', 'origin', 'FETCH_HEAD:refs/heads/release']);
    git(source, [
      'fetch',
      'origin',
      'refs/heads/release:refs/remotes/origin/release',
    ]);
    await version('0.2.0');
    const second = await prepare({ version: '0.2.0' });
    const catalog = JSON.parse(
      await readFile(join(second.directory, 'orca-catalog.json'), 'utf8'),
    );
    assert.deepEqual(
      catalog.plugins[0].releases.map((r) => r.version),
      ['0.2.0', '0.1.0'],
    );
    assert.equal(
      await readFile(join(second.directory, 'plugins/other/README.md'), 'utf8'),
      'Keep this sibling.',
    );
    await publishRelease(second, { source, orca });
    assert.equal(
      git(remote, ['rev-parse', 'refs/heads/release']),
      second.catalogCommit,
    );
    assert.equal(
      git(remote, ['rev-parse', 'refs/tags/git-logs/v0.1.0']),
      first.sourceCommit,
    );
  }));

test('rejects dirty sources, mismatched artifacts, invalid repository/version and artifact symlinks', () =>
  fixture(async ({ source, prepare }) => {
    await assert.rejects(
      () => prepare({ repository: 'file:///tmp/other' }),
      /HTTPS GitHub/,
    );
    await assert.rejects(
      () => prepare({ version: '0.1.0;echo bad' }),
      /stable/,
    );
    await assert.rejects(
      () => prepare({ sourceCommit: 'a'.repeat(40) }),
      /checked-out HEAD/,
    );
    await writeFile(join(source, 'untracked.txt'), 'dirty');
    await assert.rejects(() => prepare(), /must be clean/);
    await rm(join(source, 'untracked.txt'));
    const path = join(source, 'dist/plugins/git-logs/orca-plugin.json');
    const original = await readFile(path, 'utf8');
    await writeFile(path, original.replace('0.1.0', '0.2.0'));
    await assert.rejects(() => prepare(), /manifest must match/);
    await writeFile(path, original);
    await symlink('/etc/passwd', join(source, 'dist/plugins/git-logs/link.md'));
    await assert.rejects(() => prepare(), /symlink/);
  }));

test('rejects duplicate/downgraded versions and changed catalog source', () =>
  fixture(async ({ source, prepare, version }) => {
    const first = await prepare();
    await publishRelease(first, { source, orca });
    git(source, [
      'fetch',
      'origin',
      'refs/heads/release:refs/remotes/origin/release',
    ]);
    // Remove the auto-fetched source tag to exercise the catalog version guard.
    git(source, ['tag', '-d', 'git-logs/v0.1.0']);
    await assert.rejects(() => prepare(), /newer than every/);
    await version('0.0.9');
    await assert.rejects(
      () => prepare({ version: '0.0.9' }),
      /newer than every/,
    );
    await version('0.2.0');
    const path = join(first.directory, 'orca-catalog.json');
    const catalog = JSON.parse(await readFile(path, 'utf8'));
    catalog.plugins[0].source.path = 'plugins/renamed';
    await writeFile(path, JSON.stringify(catalog));
    git(first.directory, ['add', '.']);
    git(first.directory, [
      '-c',
      'user.name=Fixture',
      '-c',
      'user.email=fixture@example.invalid',
      'commit',
      '-m',
      'Changed source fixture',
    ]);
    git(source, ['fetch', first.directory, 'HEAD:refs/remotes/origin/release']);
    await assert.rejects(
      () => prepare({ version: '0.2.0' }),
      /Existing catalog source differs/,
    );
  }));

test('refuses to publish when remote main advances, or candidate files change', () =>
  fixture(async ({ source, prepare, save }) => {
    const plan = await prepare();
    await writeFile(
      join(plan.directory, 'plugins/git-logs/ui/index.html'),
      'modified',
    );
    await assert.rejects(
      () => publishRelease(plan, { source, orca }),
      /must be clean/,
    );
    git(plan.directory, ['restore', '.']);
    await writeFile(join(source, 'new.txt'), 'new main');
    await save('Advance main');
    // Simulate a validated older run retaining its old checkout.
    git(source, ['checkout', '--detach', plan.sourceCommit]);
    await assert.rejects(
      () => publishRelease(plan, { source, orca }),
      /Remote main changed/,
    );
  }));

test('refuses a stale release base and tag collision without changing either remote ref', () =>
  fixture(async ({ source, remote, prepare }) => {
    const first = await prepare(),
      second = await prepare();
    await publishRelease(first, { source, orca });
    await assert.rejects(
      () => publishRelease(second, { source, orca }),
      /Remote release changed/,
    );
    assert.equal(
      git(remote, ['rev-parse', 'refs/heads/release']),
      first.catalogCommit,
    );
  }));

test('CLI has no implicit publish mode', () => {
  const env = { ...process.env };
  for (const key of Object.keys(env))
    if (key.startsWith('RELEASE_')) delete env[key];
  const result = spawnSync(process.execPath, ['scripts/release-plugin.mjs'], {
    encoding: 'utf8',
    env,
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Preparation requires/);
});

test('publication ignores named-remote push URLs and writes only the checked repository URL', () =>
  fixture(async ({ source, remote, prepare }) => {
    const other = join(remote, '..', 'other.git');
    git(source, ['init', '--bare', other]);
    git(source, ['config', '--add', 'remote.origin.pushurl', other]);
    git(source, ['config', '--add', 'remote.origin.pushurl', repository]);
    const plan = await prepare();
    await publishRelease(plan, { source, orca });
    assert.equal(
      git(remote, ['rev-parse', 'refs/heads/release']),
      plan.catalogCommit,
    );
    assert.throws(
      () => git(other, ['show-ref']),
      (error) => error.status === 1,
    );
  }));

test('push-only URL rewriting is rejected before any remote writes', () =>
  fixture(async ({ source, remote, prepare }) => {
    const plan = await prepare();
    const other = join(remote, '..', 'other.git');
    git(source, ['init', '--bare', other]);
    git(source, ['config', `url.file://${other}.pushInsteadOf`, repository]);
    await assert.rejects(
      () => publishRelease(plan, { source, orca }),
      /Push-only URL rewrites/,
    );
    assert.throws(
      () => git(remote, ['rev-parse', 'refs/heads/release']),
      (error) => error.status === 128,
    );
    assert.throws(
      () => git(other, ['show-ref']),
      (error) => error.status === 1,
    );
  }));

test('a server lease rejects release deletion between preflight and push without creating a tag', () =>
  fixture(async ({ source, remote, prepare, version }) => {
    const first = await prepare();
    await publishRelease(first, { source, orca });
    git(source, [
      'fetch',
      '--no-tags',
      'origin',
      'refs/heads/release:refs/remotes/origin/release',
    ]);
    await version('0.2.0');
    const next = await prepare({ version: '0.2.0' });
    await assert.rejects(
      () =>
        publishRelease(next, {
          source,
          orca,
          push: (cwd, args) => {
            git(remote, ['update-ref', '-d', 'refs/heads/release']);
            return git(cwd, args);
          },
        }),
      /Command failed/,
    );
    assert.throws(
      () => git(remote, ['rev-parse', 'refs/heads/release']),
      (error) => error.status === 128,
    );
    assert.throws(
      () => git(remote, ['rev-parse', 'refs/tags/git-logs/v0.2.0']),
      (error) => error.status === 128,
    );
    assert.equal(
      git(remote, ['rev-parse', 'refs/tags/git-logs/v0.1.0']),
      first.sourceCommit,
    );
  }));

test('a remote version tag collision leaves the release branch untouched', () =>
  fixture(async ({ source, remote, prepare }) => {
    const plan = await prepare();
    git(source, [
      'push',
      'origin',
      `${plan.sourceCommit}:refs/tags/${plan.tag}`,
    ]);
    await assert.rejects(
      () => publishRelease(plan, { source, orca }),
      /Version tag already exists/,
    );
    assert.throws(
      () => git(remote, ['rev-parse', 'refs/heads/release']),
      (error) => error.status === 128,
    );
  }));

test('candidate must still match the checked build files before publication', () =>
  fixture(async ({ source, prepare }) => {
    const plan = await prepare();
    await writeFile(
      join(source, 'dist/plugins/git-logs/ui/index.html'),
      'changed ignored build',
    );
    await assert.rejects(
      () => publishRelease(plan, { source, orca }),
      /tested build artifact/,
    );
  }));

test('publication remains pinned to the reviewed source snapshot if main advances after preflight', () =>
  fixture(async ({ source, remote, prepare }) => {
    const plan = await prepare();
    const newerMain = git(source, [
      'commit-tree',
      'HEAD^{tree}',
      '-p',
      'HEAD',
      '-m',
      'Concurrent main advance',
    ]);
    await publishRelease(plan, {
      source,
      orca,
      push: (cwd, args) => {
        git(source, ['push', 'origin', `${newerMain}:refs/heads/main`]);
        return git(cwd, args);
      },
    });
    assert.equal(git(remote, ['rev-parse', 'refs/heads/main']), newerMain);
    assert.equal(
      git(remote, ['rev-parse', `refs/tags/${plan.tag}`]),
      plan.sourceCommit,
    );
    assert.equal(
      git(remote, ['rev-parse', 'refs/heads/release']),
      plan.catalogCommit,
    );
  }));

test('all build files are committed even when the runner has global ignore rules', () =>
  fixture(async ({ source, remote, prepare }) => {
    const previous = process.env.GIT_CONFIG_GLOBAL;
    const config = join(remote, '..', 'global.gitconfig');
    const ignored = join(remote, '..', 'global-ignore');
    await writeFile(ignored, '*.css\n');
    await writeFile(config, `[core]\nexcludesFile = ${ignored}\n`);
    process.env.GIT_CONFIG_GLOBAL = config;
    try {
      await writeFile(
        join(source, 'dist/plugins/git-logs/ui/ignored.css'),
        'body {}',
      );
      const plan = await prepare();
      assert.equal(
        git(plan.directory, [
          'show',
          `${plan.artifactCommit}:plugins/git-logs/ui/ignored.css`,
        ]),
        'body {}',
      );
    } finally {
      if (previous === undefined) delete process.env.GIT_CONFIG_GLOBAL;
      else process.env.GIT_CONFIG_GLOBAL = previous;
    }
  }));

test('a symlinked plugins directory in a release base cannot delete files outside the candidate', () =>
  fixture(async ({ source, remote, prepare, version }) => {
    const first = await prepare();
    const outside = join(remote, '..', 'outside');
    await mkdir(join(outside, 'git-logs'), { recursive: true });
    const sentinel = join(outside, 'git-logs/keep.txt');
    await writeFile(sentinel, 'Keep this file.');
    await rm(join(first.directory, 'plugins'), { recursive: true });
    await symlink(outside, join(first.directory, 'plugins'));
    git(first.directory, ['add', '-A']);
    git(first.directory, [
      '-c',
      'user.name=Fixture',
      '-c',
      'user.email=fixture@example.invalid',
      'commit',
      '-m',
      'Symlinked release fixture',
    ]);
    git(source, ['fetch', first.directory, 'HEAD:refs/remotes/origin/release']);
    await version('0.2.0');
    await assert.rejects(
      () => prepare({ version: '0.2.0' }),
      /plugins directory must not be a symlink/,
    );
    assert.equal(await readFile(sentinel, 'utf8'), 'Keep this file.');
  }));

test('clean filters cannot silently change the committed catalog or source provenance', () =>
  fixture(async ({ remote, prepare }) => {
    const previous = process.env.GIT_CONFIG_GLOBAL;
    const config = join(remote, '..', 'global.gitconfig');
    const attributes = join(remote, '..', 'global-attributes');
    const filter = join(remote, '..', 'filter.mjs');
    await writeFile(
      attributes,
      'orca-catalog.json filter=rewrite\nrelease-provenance.json filter=rewrite\n',
    );
    await writeFile(
      filter,
      "let text=''; for await (const chunk of process.stdin) text+=chunk; process.stdout.write(text.replace(/[a-f0-9]{40}/g, '0'.repeat(40)));\n",
    );
    await writeFile(
      config,
      `[core]\nattributesFile = ${attributes}\n[filter "rewrite"]\nclean = node ${filter}\nsmudge = cat\nrequired = true\n`,
    );
    process.env.GIT_CONFIG_GLOBAL = config;
    try {
      await assert.rejects(
        () => prepare(),
        /Committed release metadata differs/,
      );
    } finally {
      if (previous === undefined) delete process.env.GIT_CONFIG_GLOBAL;
      else process.env.GIT_CONFIG_GLOBAL = previous;
    }
  }));

test('Orcatopia candidates preserve Git Logs, separate identity and reject a mismatched plan', () =>
  fixture(async ({ source, remote, prepare, save }) => {
    const logs = await prepare();
    await publishRelease(logs, { source, orca });
    git(source, ['fetch', 'origin', 'release:refs/remotes/origin/release']);
    const path = join(source, 'plugins/landmark-island');
    await cp(join(source, 'plugins/git-logs'), path, { recursive: true });
    const manifest = JSON.parse(
      await readFile(join(path, 'orca-plugin.json'), 'utf8'),
    );
    manifest.id = 'landmark-island';
    manifest.name = 'Orcatopia';
    manifest.contributes.panels[0].id = 'landmark-island';
    manifest.contributes.panels[0].title = 'Orcatopia';
    await writeFile(join(path, 'orca-plugin.json'), JSON.stringify(manifest));
    await cp(path, join(source, 'dist/plugins/landmark-island'), {
      recursive: true,
    });
    await save('Add Orcatopia fixture');
    const beforeRefs = git(remote, ['show-ref']);
    const plan = await prepare({ plugin: 'landmark-island' });
    assert.equal(plan.pluginKey, 'tienne.landmark-island');
    assert.equal(plan.tag, 'landmark-island/v0.1.0');
    assert.equal(plan.baseCommit, logs.catalogCommit);
    assert.equal(
      git(remote, ['show-ref']),
      beforeRefs,
      'Preparation never publishes',
    );
    assert.equal(
      git(plan.directory, [
        'rev-parse',
        `${plan.catalogCommit}:plugins/git-logs`,
      ]),
      git(logs.directory, [
        'rev-parse',
        `${logs.catalogCommit}:plugins/git-logs`,
      ]),
    );
    const catalog = JSON.parse(
      await readFile(join(plan.directory, 'orca-catalog.json'), 'utf8'),
    );
    assert.deepEqual(catalog.plugins.map((p) => p.id).sort(), [
      'tienne.git-logs',
      'tienne.landmark-island',
    ]);
    assert.deepEqual(
      catalog.plugins.find((p) => p.id === 'tienne.landmark-island').categories,
      ['games'],
    );
    assert.deepEqual(
      catalog.plugins.find((p) => p.id === 'tienne.git-logs').categories,
      ['developer-tools'],
    );
    assert.equal(
      catalog.plugins.find((p) => p.id === 'tienne.landmark-island').releases[0]
        .name,
      'Orcatopia',
    );
    await verifyCandidate(plan, { source, orca });
    await assert.rejects(
      verifyCandidate({ ...plan, plugin: 'git-logs' }, { source, orca }),
      /identity/,
    );
    await assert.rejects(
      verifyCandidate({ ...plan, plugin: '../outside' }, { source, orca }),
      /Unsupported release plugin/,
    );
    await assert.rejects(
      prepare({ plugin: '../outside' }),
      /Unsupported release plugin/,
    );
    await publishRelease(plan, { source, orca }); // Temporary local bare repository only.
    assert.equal(
      git(remote, ['rev-parse', 'refs/tags/landmark-island/v0.1.0']),
      plan.sourceCommit,
    );
    assert.equal(
      git(remote, ['rev-parse', 'refs/tags/git-logs/v0.1.0']),
      logs.sourceCommit,
    );
  }));

test('legacy Git Logs plans without a plugin selector still validate', () =>
  fixture(async ({ source, prepare }) => {
    const plan = await prepare();
    delete plan.plugin;
    await verifyCandidate(plan, { source, orca });
  }));
