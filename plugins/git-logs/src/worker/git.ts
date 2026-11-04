import { constants } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { realpath, lstat, open } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import type {
  ChangedFile,
  ChangeSet,
  Commit,
  Comparison,
  FileDiff,
  FileSide,
  Repository,
  BranchRef,
} from '../protocol';
const exec = promisify(execFile);
const LIMIT = 768 * 1024;
export async function git(
  root: string,
  args: string[],
  timeout = 15000,
): Promise<Buffer> {
  const env = { ...process.env };
  for (const key of Object.keys(env))
    if (key.startsWith('GIT_')) delete env[key];
  const result = await exec(
    'git',
    [
      '--no-pager',
      '-c',
      'core.fsmonitor=false',
      '-c',
      'color.ui=false',
      '-c',
      'log.showSignature=false',
      '-c',
      'protocol.allow=never',
      '-c',
      'core.quotePath=false',
      ...args,
    ],
    {
      cwd: root,
      encoding: 'buffer',
      maxBuffer: 8 * 1024 * 1024,
      timeout,
      env: {
        ...env,
        GIT_OPTIONAL_LOCKS: '0',
        GIT_TERMINAL_PROMPT: '0',
        GIT_NO_REPLACE_OBJECTS: '1',
        GIT_NO_LAZY_FETCH: '1',
        GIT_CONFIG_COUNT: '0',
      },
    },
  );
  return result.stdout;
}
async function optional(root: string, args: string[]) {
  try {
    return (await git(root, args)).toString().trim();
  } catch {
    return '';
  }
}
export async function repository(path: string): Promise<string> {
  if (typeof path !== 'string' || !isAbsolute(path) || path.includes('\0'))
    throw new Error('로컬 저장소의 절대 경로를 입력하세요.');
  const root = await realpath(path);
  if (
    (await git(root, ['rev-parse', '--is-inside-work-tree']))
      .toString()
      .trim() !== 'true'
  )
    throw new Error('작업 트리가 있는 Git 저장소가 필요합니다.');
  const promisor = await optional(root, [
    'config',
    '--bool',
    '--get-regexp',
    '^remote\\..*\\.promisor$',
  ]);
  if (
    promisor.split('\n').some((line) => line.endsWith(' true')) ||
    (await optional(root, ['config', '--get', 'extensions.partialClone']))
  )
    throw new Error(
      '부분 clone 저장소는 지원하지 않습니다. 필요한 객체가 로컬에 있는 일반 저장소를 선택하세요.',
    );
  return realpath(
    (await git(root, ['rev-parse', '--show-toplevel'])).toString().trim(),
  );
}
function validPath(path: string) {
  if (
    typeof path !== 'string' ||
    !path ||
    path.includes('\0') ||
    isAbsolute(path) ||
    path.split(/[\\/]/).some((p) => p === '..' || p === '.git')
  )
    throw new Error('잘못된 저장소 상대 경로입니다.');
}
export async function commitHash(root: string, ref: string): Promise<string> {
  if (typeof ref !== 'string' || !/^[a-f0-9]{40,64}$/.test(ref))
    throw new Error('전체 커밋 해시가 필요합니다.');
  const hash = (await git(root, ['rev-parse', '--verify', `${ref}^{commit}`]))
    .toString()
    .trim();
  if (hash !== ref) throw new Error('커밋이 일치하지 않습니다.');
  return hash;
}
export async function log(
  root: string,
  all = false,
  branchRef?: string,
): Promise<Repository> {
  const head = await optional(root, ['rev-parse', '--verify', 'HEAD']);
  const branch = await optional(root, [
    'symbolic-ref',
    '--short',
    '-q',
    'HEAD',
  ]);
  const refs = new Map<string, string[]>();
  const localBranches: { name: string; hash: string }[] = [];
  const branches: BranchRef[] = [];
  for (const line of (
    await git(root, [
      'for-each-ref',
      '--format=%(objectname)%09%(refname)%09%(symref)',
      'refs/heads',
      'refs/remotes',
    ])
  )
    .toString()
    .trim()
    .split('\n')) {
    const [hash, name, symbolic] = line.split('\t');
    if (name?.startsWith('refs/heads/'))
      localBranches.push({ name: name.slice(11), hash });
    if (name && !symbolic)
      branches.push({
        ref: name,
        name: name.replace(/^refs\/(heads|remotes)\//, ''),
        hash,
        kind: name.startsWith('refs/heads/') ? 'local' : 'remote',
      });
    if (name)
      refs.set(hash, [
        ...(refs.get(hash) ?? []),
        name.replace(/^refs\/(heads|remotes)\//, ''),
      ]);
  }
  const selected =
    branchRef === undefined
      ? undefined
      : branches.find((b) => b.ref === branchRef);
  if (branchRef !== undefined && !selected)
    throw new Error('선택한 브랜치를 찾을 수 없습니다. 새로고침하세요.');
  const selectedHash = selected
    ? await commitHash(root, selected.hash)
    : undefined;
  // NUL fields preserve tabs/newlines in messages. Git adds one LF between records.
  const raw =
    !head && !all && !selectedHash
      ? ''
      : (
          await git(root, [
            'log',
            '--topo-order',
            '-200',
            '--format=%H%x00%P%x00%an%x00%aI%x00%B%x00',
            ...(selectedHash
              ? [selectedHash]
              : all
                ? ['--all', ...(head ? ['HEAD'] : [])]
                : ['HEAD']),
            '--',
          ])
        ).toString();
  const fields = raw.split('\0');
  const commits: Commit[] = [];
  for (let i = 0; i + 5 < fields.length; i += 5) {
    const hash = fields[i].trim();
    commits.push({
      hash,
      parents: fields[i + 1].split(' ').filter(Boolean),
      author: fields[i + 2],
      date: fields[i + 3],
      message: fields[i + 4].trimEnd(),
      refs: [...(hash === head ? ['HEAD'] : []), ...(refs.get(hash) ?? [])],
    });
  }
  return {
    root,
    branch: branch || 'Detached HEAD',
    head: head || null,
    commits,
    localBranches,
    branches,
  };
}
export function parseNames(raw: Buffer): ChangedFile[] {
  const parts = raw.toString('utf8').split('\0');
  const files: ChangedFile[] = [];
  for (let i = 0; i < parts.length - 1;) {
    const status = parts[i++];
    const first = parts[i++];
    if (/^[RC]/.test(status))
      files.push({ status: status[0], oldPath: first, path: parts[i++] });
    else files.push({ status: status[0], path: first });
  }
  return files;
}
export async function changes(
  root: string,
  input: Comparison,
): Promise<ChangeSet> {
  if (!input || !['working', 'commit'].includes(input.kind))
    throw new Error('잘못된 비교 모드입니다.');
  if (input.kind === 'commit') {
    const hash = await commitHash(root, input.commit);
    const parents = (await git(root, ['show', '-s', '--format=%P', hash, '--']))
      .toString()
      .trim()
      .split(' ')
      .filter(Boolean);
    const parent = input.parent ?? parents[0];
    if (parent && !parents.includes(parent))
      throw new Error('선택 커밋의 직접 부모만 비교할 수 있습니다.');
    const files = parseNames(
      await git(
        root,
        parent
          ? [
              'diff',
              '--no-ext-diff',
              '--no-textconv',
              '-M',
              '--name-status',
              '-z',
              parent,
              hash,
              '--',
            ]
          : [
              'diff-tree',
              '--root',
              '--no-commit-id',
              '-r',
              '-M',
              '--name-status',
              '-z',
              hash,
              '--',
            ],
      ),
    );
    if (files.length > 2000)
      throw new Error(
        '변경 파일이 2,000개를 초과합니다. 더 작은 비교가 필요합니다.',
      );
    return {
      comparison: {
        kind: 'commit',
        commit: hash,
        ...(parent ? { parent } : {}),
      },
      files,
      left: parent ?? '빈 트리 (최초 커밋)',
      right: hash,
    };
  }
  const head = await optional(root, ['rev-parse', '--verify', 'HEAD']);
  if ('head' in input && input.head !== (head || null))
    throw new Error('HEAD가 변경되었습니다. 비교를 새로고침하세요.');
  let files = head
    ? parseNames(
        await git(root, [
          'diff',
          '--no-ext-diff',
          '--no-textconv',
          '-M',
          '--name-status',
          '-z',
          head,
          '--',
        ]),
      )
    : (await git(root, ['ls-files', '-z']))
        .toString()
        .split('\0')
        .filter(Boolean)
        .map((path) => ({ path, status: 'A' }) as ChangedFile);
  const status = (
    await git(root, ['status', '--porcelain=v1', '-z', '--untracked-files=all'])
  )
    .toString()
    .split('\0');
  for (let i = 0; i < status.length; i++) {
    const row = status[i];
    if (!row) continue;
    const xy = row.slice(0, 2);
    const path = row.slice(3);
    if (xy.includes('R') || xy.includes('C')) i++;
    let file = files.find((f) => f.path === path);
    const conflict = xy.includes('U') || xy === 'AA' || xy === 'DD';
    if (!file && (xy === '??' || conflict)) {
      file = { path, status: conflict ? 'U' : '?' };
      files.push(file);
    }
    if (file)
      Object.assign(file, {
        staged: xy[0] !== ' ' && xy[0] !== '?',
        unstaged: xy[1] !== ' ' && xy[1] !== '?',
        untracked: xy === '??',
        conflict,
      });
  }
  // Index deletions can leave an untracked file at the very same path. Compare
  // that disk file to HEAD, rather than displaying a false deletion/addition.
  if (files.length > 2000)
    throw new Error(
      '변경 파일이 2,000개를 초과합니다. 더 작은 저장소에서 비교하세요.',
    );
  const normalized: ChangedFile[] = [];
  for (const file of files) {
    if (file.oldPath && (await disk(root, file.oldPath)).kind !== 'missing') {
      file.status = 'A';
      delete file.oldPath;
    }
    if (file.untracked || file.status === 'D') {
      const before = await blob(root, head || undefined, file.path);
      const after = await disk(root, file.path);
      if (
        (before.kind === 'missing' && after.kind === 'missing') ||
        (before.kind === 'text' &&
          after.kind === 'text' &&
          before.text === after.text)
      )
        continue;
      if (after.kind !== 'missing' && before.kind !== 'missing')
        file.status = 'M';
    }
    normalized.push(file);
  }
  files = [...new Map(normalized.map((f) => [f.path, f])).values()].sort(
    (a, b) => a.path.localeCompare(b.path),
  );
  if (files.length > 2000)
    throw new Error(
      '변경 파일이 2,000개를 초과합니다. 더 작은 저장소에서 비교하세요.',
    );
  return {
    comparison: { kind: 'working', head: head || null },
    files,
    left: head || '빈 트리 (HEAD 없음)',
    right: '현재 작업 트리 · 디스크',
  };
}
const missing = (): FileSide => ({ kind: 'missing', text: '', bytes: 0 });
function decode(data: Buffer): FileSide {
  if (data.length > LIMIT)
    return { kind: 'large', text: '', bytes: data.length };
  try {
    if (data.includes(0)) throw Error();
    return {
      kind: 'text',
      text: new TextDecoder('utf-8', { fatal: true }).decode(data),
      bytes: data.length,
    };
  } catch {
    return { kind: 'binary', text: '', bytes: data.length };
  }
}
async function blob(
  root: string,
  ref: string | undefined,
  path: string,
): Promise<FileSide> {
  if (!ref) return missing();
  validPath(path);
  const entry = (
    await git(root, ['ls-tree', '-z', ref, '--', `:(literal)${path}`])
  ).toString();
  if (!entry) return missing();
  const header = entry.slice(0, entry.indexOf('\t')).split(' ');
  if (header[1] !== 'blob' || header[0] === '120000')
    return { kind: 'special', text: '', bytes: 0 };
  const size = Number(
    (await git(root, ['cat-file', '-s', header[2]])).toString(),
  );
  if (size > LIMIT) return { kind: 'large', text: '', bytes: size };
  return decode(await git(root, ['cat-file', 'blob', header[2]]));
}
async function disk(root: string, path: string): Promise<FileSide> {
  validPath(path);
  const full = resolve(root, path);
  try {
    // Reject every symlink component, including links that happen to point back inside.
    let current = root;
    for (const part of relative(root, full).split(sep)) {
      current = resolve(current, part);
      const s = await lstat(current);
      if (s.isSymbolicLink() || (current === full && !s.isFile()))
        return { kind: 'special', text: '', bytes: s.size };
    }
    const actual = await realpath(full);
    const rel = relative(root, actual);
    if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel))
      throw new Error('저장소 경계를 벗어난 파일입니다.');
    const handle = await open(
      actual,
      constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK,
    );
    try {
      const stat = await handle.stat();
      if (!stat.isFile())
        return { kind: 'special', text: '', bytes: stat.size };
      if (stat.size > LIMIT)
        return { kind: 'large', text: '', bytes: stat.size };
      const buffer = Buffer.alloc(LIMIT + 1);
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
      return decode(buffer.subarray(0, bytesRead));
    } finally {
      await handle.close();
    }
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return missing();
    throw e;
  }
}
export async function diff(
  root: string,
  comparison: Comparison,
  path: string,
): Promise<FileDiff> {
  validPath(path);
  const set = await changes(root, comparison);
  const file = set.files.find((f) => f.path === path);
  if (!file) throw new Error('변경 목록에 없는 파일입니다. 새로고침하세요.');
  if (file.conflict)
    return {
      file,
      original: { kind: 'special', text: '', bytes: 0 },
      modified: { kind: 'special', text: '', bytes: 0 },
    };
  const c = set.comparison;
  const base = c.kind === 'commit' ? c.parent : (c.head ?? undefined);
  const original =
    file.status === 'A'
      ? missing()
      : await blob(root, base, file.oldPath ?? path);
  const modified =
    c.kind === 'commit'
      ? await blob(root, c.commit, path)
      : await disk(root, path);
  return { file, original, modified };
}
