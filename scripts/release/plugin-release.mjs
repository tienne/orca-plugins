import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  cp,
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  lstat,
  readdir,
  realpath,
  rm,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, relative, isAbsolute } from 'node:path';
import { validateArtifact } from '../validate-plugin-artifact.mjs';

function pluginPathFor(plugin) {
  invariant(
    ['git-logs', 'landmark-island'].includes(plugin),
    'Unsupported release plugin.',
  );
  return `plugins/${plugin}`;
}
const branch = 'release';
const sha = /^[a-f0-9]{40}$/;
const stableVersion = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
export function git(cwd, args) {
  return execFileSync(
    'git',
    [
      '-c',
      'core.hooksPath=/dev/null',
      '-c',
      'commit.gpgSign=false',
      '-C',
      cwd,
      ...args,
    ],
    {
      encoding: 'utf8',
      maxBuffer: 8 * 1024 * 1024,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  ).trim();
}
export function orcaJson(args) {
  const command =
    process.env.ORCA_CLI_COMMAND ||
    (process.platform === 'linux' ? 'orca-ide' : 'orca');
  const raw = execFileSync(command, ['plugin', ...args, '--json'], {
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const result = JSON.parse(raw);
  if (!result.ok)
    throw new Error(`Orca ${args[0]} failed: ${JSON.stringify(result.error)}`);
  return result.result;
}
function invariant(value, message) {
  if (!value) throw new Error(message);
}
async function json(path) {
  invariant((await lstat(path)).isFile(), `Expected a regular file: ${path}`);
  return JSON.parse(await readFile(path, 'utf8'));
}
async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}
async function digestDirectory(root) {
  const hash = createHash('sha256');
  async function walk(directory, prefix = '') {
    for (const entry of (
      await readdir(directory, { withFileTypes: true })
    ).sort((a, b) => a.name.localeCompare(b.name))) {
      const path = join(directory, entry.name);
      const name = prefix + entry.name;
      if (entry.isDirectory()) await walk(path, name + '/');
      else {
        invariant(entry.isFile(), 'Artifacts may contain only regular files.');
        hash.update(name + '\0');
        hash.update(await readFile(path));
        hash.update('\0');
      }
    }
  }
  await walk(root);
  return hash.digest('hex');
}
function repositoryIdentity(repository, plugin) {
  const match =
    /^https:\/\/github\.com\/([A-Za-z0-9-]+)\/([A-Za-z0-9_.-]+)\.git$/.exec(
      repository,
    );
  invariant(
    match && !['.', '..'].includes(match[2]),
    'Repository must be an HTTPS GitHub URL ending in .git.',
  );
  return {
    owner: match[1].toLowerCase(),
    pluginKey: `${match[1].toLowerCase()}.${plugin}`,
  };
}
function newer(a, b) {
  invariant(
    stableVersion.test(a) && stableVersion.test(b),
    'Only stable x.y.z versions are supported.',
  );
  const left = a.split('.').map(BigInt),
    right = b.split('.').map(BigInt);
  for (let i = 0; i < 3; i++)
    if (left[i] !== right[i]) return left[i] > right[i];
  return false;
}
function clean(source) {
  invariant(
    !git(source, ['status', '--porcelain']),
    'Source checkout must be clean. Commit changes before preparing a release.',
  );
}
function optionalRef(source, ref) {
  try {
    return git(source, ['rev-parse', '--verify', ref]);
  } catch (error) {
    if (error.status === 128) return null;
    throw error;
  }
}
function commit(directory, message) {
  git(directory, [
    '-c',
    'user.name=Orca plugins release',
    '-c',
    'user.email=release@users.noreply.github.com',
    'commit',
    '-m',
    message,
  ]);
  return git(directory, ['rev-parse', 'HEAD']);
}
function validateReleaseEntry(result, artifactCommit, version, pluginPath) {
  invariant(
    result.sourcePath === pluginPath,
    'Orca returned a different plugin path.',
  );
  const entry = result.entry;
  invariant(
    entry?.version === version &&
      entry.commit === artifactCommit &&
      /^[a-f0-9]{64}$/.test(entry.contentHash),
    'Orca returned invalid release metadata.',
  );
  return entry;
}

/** Build a candidate in a separate Git repository. Never changes source branches,
 * contacts a network remote, approves a plugin, or publishes anything. */
export async function prepareRelease({
  source,
  repository,
  version,
  sourceCommit,
  orca = orcaJson,
  plugin = 'git-logs',
}) {
  const pluginPath = pluginPathFor(plugin);
  source = await realpath(resolve(source));
  const { owner, pluginKey } = repositoryIdentity(repository, plugin);
  invariant(
    stableVersion.test(version) && version.length < 64,
    'Version must be stable x.y.z.',
  );
  invariant(
    sha.test(sourceCommit) &&
      git(source, ['rev-parse', 'HEAD']) === sourceCommit,
    'Source commit must be the full SHA of the checked-out HEAD.',
  );
  clean(source);
  const manifest = await json(join(source, pluginPath, 'orca-plugin.json'));
  const artifact = join(source, 'dist', pluginPath);
  invariant(
    (await realpath(artifact)) === artifact &&
      (await lstat(artifact)).isDirectory(),
    'Build artifact directory must not use symlinks.',
  );
  const built = await json(join(artifact, 'orca-plugin.json'));
  invariant(
    manifest.id === plugin &&
      built.id === plugin &&
      manifest.version === version &&
      built.version === version,
    'Source and built manifest must match the requested plugin and version.',
  );
  invariant(
    JSON.stringify(manifest) === JSON.stringify(built),
    'Built manifest does not match source. Rebuild before release.',
  );
  await validateArtifact(artifact);
  await orca(['validate', artifact]);
  const sourceCatalog = await json(join(source, 'orca-catalog.json'));
  invariant(
    sourceCatalog.owner === owner && sourceCatalog.catalogVersion === 2,
    'Source catalog owner must match the publishing repository.',
  );
  const baseCommit = optionalRef(source, 'refs/remotes/origin/release');
  invariant(!baseCommit || sha.test(baseCommit), 'Invalid release base.');
  const tag = `${plugin}/v${version}`;
  invariant(
    !optionalRef(source, `refs/tags/${tag}`),
    `Version tag already exists: ${tag}`,
  );
  const directory = await mkdtemp(join(tmpdir(), 'orca-plugin-release-'));
  try {
    git(directory, ['init', '-b', branch]);
    git(directory, ['config', 'core.autocrlf', 'false']);
    git(directory, ['remote', 'add', 'origin', repository]);
    let catalog = {
      catalogVersion: 2,
      name: sourceCatalog.name,
      owner,
      plugins: [],
    };
    if (baseCommit) {
      git(directory, ['fetch', '--no-tags', source, baseCommit]);
      git(directory, ['checkout', '-B', branch, 'FETCH_HEAD']);
      catalog = await json(join(directory, 'orca-catalog.json'));
      await orca(['validate', join(directory, 'orca-catalog.json')]);
      invariant(
        catalog.owner === owner &&
          catalog.catalogVersion === 2 &&
          Array.isArray(catalog.plugins),
        'Release catalog owner or format differs.',
      );
    }
    const previous = catalog.plugins.find((entry) => entry.id === pluginKey);
    if (previous) {
      invariant(
        previous.source?.url === repository &&
          previous.source.ref === branch &&
          previous.source.path === pluginPath,
        'Existing catalog source differs; do not change install identity or path during release.',
      );
      invariant(
        previous.releases.length < 32,
        'Release history is full. Review compatibility before pruning it.',
      );
      invariant(
        previous.releases.every((entry) => newer(version, entry.version)),
        'Version must be newer than every existing release; published versions are immutable.',
      );
    }
    const parent = join(directory, 'plugins');
    try {
      await mkdir(parent);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
    invariant(
      (await lstat(parent)).isDirectory() &&
        !(await lstat(parent)).isSymbolicLink(),
      'Release plugins directory must not be a symlink.',
    );
    const target = join(directory, pluginPath);
    // Remove only the target plugin in this newly created candidate repository.
    await rm(target, { recursive: true, force: true });
    await mkdir(join(directory, 'plugins'), { recursive: true });
    await cp(artifact, target, { recursive: true, dereference: false });
    await validateArtifact(target);
    await orca(['validate', target]);
    const provenancePath = join(directory, 'release-provenance.json');
    let provenance = baseCommit
      ? await json(provenancePath)
      : { format: 1, plugins: {} };
    invariant(
      provenance.format === 1 &&
        provenance.plugins &&
        typeof provenance.plugins === 'object' &&
        !Array.isArray(provenance.plugins),
      'Invalid release provenance.',
    );
    provenance.plugins[pluginKey] = {
      version,
      sourceCommit,
      repository,
      path: pluginPath,
    };
    await writeJson(provenancePath, provenance);
    git(directory, ['add', '-f', '--', pluginPath, 'release-provenance.json']);
    const artifactCommit = commit(
      directory,
      `Build ${plugin} ${version}\n\nSource-Commit: ${sourceCommit}`,
    );
    const entry = validateReleaseEntry(
      await orca(['release-entry', target]),
      artifactCommit,
      version,
      pluginPath,
    );
    const catalogEntry = {
      id: pluginKey,
      source: { kind: 'git', url: repository, ref: branch, path: pluginPath },
      description: built.description,
      categories: [plugin === 'landmark-island' ? 'games' : 'developer-tools'],
      releases: [entry, ...(previous?.releases ?? [])],
    };
    catalog.plugins = [
      ...catalog.plugins.filter((item) => item.id !== pluginKey),
      catalogEntry,
    ];
    await writeJson(join(directory, 'orca-catalog.json'), catalog);
    await orca(['validate', join(directory, 'orca-catalog.json')]);
    git(directory, ['add', '--', 'orca-catalog.json']);
    const catalogCommit = commit(
      directory,
      `Publish ${plugin} ${version} in catalog`,
    );
    const plan = {
      contentHash: entry.contentHash,
      format: 1,
      directory,
      repository,
      pluginKey,
      plugin,
      version,
      tag,
      sourceCommit,
      baseCommit,
      artifactCommit,
      catalogCommit,
    };
    await verifyCandidate(plan, { source, orca });
    return plan;
  } catch (error) {
    await rm(directory, { recursive: true, force: true });
    throw error;
  }
}

export async function verifyCandidate(plan, { source, orca = orcaJson }) {
  const plugin = plan.plugin ?? 'git-logs';
  const pluginPath = pluginPathFor(plugin);
  const identity = repositoryIdentity(plan.repository, plugin);
  invariant(
    plan.format === 1 &&
      plan.pluginKey === identity.pluginKey &&
      stableVersion.test(plan.version) &&
      plan.tag === `${plugin}/v${plan.version}`,
    'Invalid release plan identity.',
  );
  for (const key of ['sourceCommit', 'artifactCommit', 'catalogCommit'])
    invariant(sha.test(plan[key]), `Invalid ${key}.`);
  invariant(
    plan.baseCommit === null || sha.test(plan.baseCommit),
    'Invalid release base.',
  );
  invariant(
    isAbsolute(plan.directory) &&
      relative(resolve(source), resolve(plan.directory)).startsWith('..'),
    'Candidate must be outside the source checkout.',
  );
  invariant(
    git(source, ['rev-parse', 'HEAD']) === plan.sourceCommit,
    'Source HEAD changed after preparation.',
  );
  clean(source);
  clean(plan.directory);
  invariant(
    git(plan.directory, ['rev-parse', 'HEAD']) === plan.catalogCommit,
    'Candidate HEAD changed after preparation.',
  );
  invariant(
    git(plan.directory, ['rev-parse', `${plan.catalogCommit}^`]) ===
      plan.artifactCommit,
    'Catalog must follow the artifact commit.',
  );
  if (plan.baseCommit)
    invariant(
      git(plan.directory, ['rev-parse', `${plan.artifactCommit}^`]) ===
        plan.baseCommit,
      'Artifact must follow the expected release base.',
    );
  else
    invariant(
      git(plan.directory, ['rev-list', '--count', plan.artifactCommit]) === '1',
      'First artifact must be an orphan root commit.',
    );
  // Validate the blobs that users will fetch, not just the working files: clean
  // filters can change JSON while leaving git status clean.
  for (const name of ['orca-catalog.json', 'release-provenance.json']) {
    const committed = git(plan.directory, [
      'rev-parse',
      `${plan.catalogCommit}:${name}`,
    ]);
    const working = git(plan.directory, [
      'hash-object',
      '--no-filters',
      join(plan.directory, name),
    ]);
    invariant(
      committed === working,
      'Committed release metadata differs from validated working files.',
    );
  }
  const catalog = await json(join(plan.directory, 'orca-catalog.json'));
  invariant(
    catalog.owner === identity.owner,
    'Candidate catalog owner differs.',
  );
  const selected = catalog.plugins.find((item) => item.id === plan.pluginKey);
  invariant(
    selected?.source?.url === plan.repository &&
      selected.source.ref === branch &&
      selected.source.path === pluginPath,
    'Candidate catalog source differs.',
  );
  const entry = selected.releases[0];
  invariant(
    entry?.commit === plan.artifactCommit &&
      entry.version === plan.version &&
      entry.contentHash === plan.contentHash,
    'Candidate catalog release differs.',
  );
  const provenance = await json(
    join(plan.directory, 'release-provenance.json'),
  );
  invariant(
    provenance.plugins?.[plan.pluginKey]?.sourceCommit === plan.sourceCommit &&
      provenance.plugins[plan.pluginKey].version === plan.version &&
      provenance.plugins[plan.pluginKey].repository === plan.repository,
    'Candidate provenance differs.',
  );
  const target = join(plan.directory, pluginPath);
  await validateArtifact(target);
  const entries = git(plan.directory, [
    'ls-tree',
    '-rz',
    plan.artifactCommit,
    '--',
    pluginPath,
  ])
    .split('\0')
    .filter(Boolean);
  const actual = await validateArtifact(target);
  invariant(
    entries.length === actual.count,
    'Committed artifact omits build files.',
  );
  for (const entry of entries) {
    const [metadata, name] = entry.split('\t');
    const [mode, type, oid] = metadata.split(' ');
    invariant(
      mode === '100644' && type === 'blob' && name.startsWith(pluginPath + '/'),
      'Committed artifact has an unsupported file.',
    );
    invariant(
      git(plan.directory, [
        'hash-object',
        '--no-filters',
        join(plan.directory, name),
      ]) === oid,
      'Committed artifact bytes differ from the tested build.',
    );
  }
  const builtArtifact = join(source, 'dist', pluginPath);
  await validateArtifact(builtArtifact);
  invariant(
    (await digestDirectory(target)) === (await digestDirectory(builtArtifact)),
    'Candidate differs from the tested build artifact.',
  );
  const changed = git(plan.directory, [
    'diff-tree',
    '--root',
    '--no-commit-id',
    '--name-only',
    '--no-renames',
    '-r',
    plan.artifactCommit,
  ]).split('\n');
  invariant(
    changed.every(
      (path) =>
        path === 'release-provenance.json' || path.startsWith(pluginPath + '/'),
    ),
    'Artifact commit changes unrelated files.',
  );
  await orca(['validate', target]);
  await orca(['validate', join(plan.directory, 'orca-catalog.json')]);
  const current = validateReleaseEntry(
    await orca(['release-entry', target]),
    plan.catalogCommit,
    plan.version,
    pluginPath,
  );
  invariant(
    JSON.stringify({ ...current, commit: plan.artifactCommit }) ===
      JSON.stringify(entry),
    'Candidate content no longer matches the pinned release.',
  );
  const paths = git(plan.directory, [
    'diff-tree',
    '--no-commit-id',
    '--name-only',
    '-r',
    plan.catalogCommit,
  ]).split('\n');
  invariant(
    paths.length === 1 && paths[0] === 'orca-catalog.json',
    'Catalog commit changes files outside the catalog.',
  );
}

function remoteRef(source, repository, ref) {
  const output = git(source, ['ls-remote', '--refs', repository, ref]);
  return output ? output.split(/\s/)[0] : null;
}
/** The only function that writes a remote. The CLI requires --publish explicitly. */
export async function publishRelease(
  plan,
  { source, orca = orcaJson, push = git },
) {
  source = resolve(source);
  await verifyCandidate(plan, { source, orca });
  try {
    const rewrites = git(source, [
      'config',
      '--get-regexp',
      '^url\\..*\\.pushinsteadof$',
    ]);
    invariant(
      !rewrites,
      'Push-only URL rewrites are not supported by release publication.',
    );
  } catch (error) {
    if (error.status !== 1) throw error;
  }
  invariant(
    git(source, ['config', '--get', 'remote.origin.url']).replace(
      /\.git$/,
      '',
    ) === plan.repository.replace(/\.git$/, ''),
    'Origin differs from the planned publishing repository.',
  );
  invariant(
    remoteRef(source, plan.repository, 'refs/heads/main') === plan.sourceCommit,
    'Remote main changed. Prepare and validate a new release run.',
  );
  invariant(
    remoteRef(source, plan.repository, 'refs/heads/release') ===
      plan.baseCommit,
    'Remote release changed. Fetch and prepare a new candidate.',
  );
  invariant(
    !remoteRef(source, plan.repository, `refs/tags/${plan.tag}`),
    'Version tag already exists on origin.',
  );
  git(source, ['fetch', '--no-tags', plan.directory, plan.catalogCommit]);
  // The parent checks prove this is a fast-forward. The server-side lease also
  // rejects a deletion/reset between the preflight read and push negotiation.
  // Push the checked URL explicitly: named remotes may have different push URLs.
  push(source, [
    'push',
    '--atomic',
    `--force-with-lease=refs/heads/release:${plan.baseCommit ?? ''}`,
    plan.repository,
    `${plan.catalogCommit}:refs/heads/release`,
    `${plan.sourceCommit}:refs/tags/${plan.tag}`,
  ]);
  invariant(
    remoteRef(source, plan.repository, 'refs/heads/release') ===
      plan.catalogCommit &&
      remoteRef(source, plan.repository, `refs/tags/${plan.tag}`) ===
        plan.sourceCommit,
    'Remote verification failed after push. Inspect origin before retrying.',
  );
}
