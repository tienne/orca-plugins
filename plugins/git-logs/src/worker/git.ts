import { constants } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { realpath, lstat, open } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import {
  LOAD_LIMIT,
  PAGE_SIZE,
  type ChangedFile,
  type ChangeSet,
  type Commit,
  type Comparison,
  type FileDiff,
  type FileSide,
  type Repository,
  type BranchRef,
  type LogFilter,
} from '../protocol';
const exec = promisify(execFile);
const LIMIT = 768 * 1024;
export async function git(
  root: string,
  args: string[],
  timeout = 15000,
  signal?: AbortSignal,
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
      signal,
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
async function optional(root: string, args: string[], signal?: AbortSignal) {
  try {
    return (await git(root, args, undefined, signal)).toString().trim();
  } catch (e) {
    // 취소는 빈 값으로 바꿔 넘기지 않고 호출한 쪽까지 올려 보낸다.
    if (signal?.aborted) throw e;
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
export async function commitHash(
  root: string,
  ref: string,
  signal?: AbortSignal,
): Promise<string> {
  if (typeof ref !== 'string' || !/^[a-f0-9]{40,64}$/.test(ref))
    throw new Error('전체 커밋 해시가 필요합니다.');
  const hash = (
    await git(
      root,
      ['rev-parse', '--verify', `${ref}^{commit}`],
      undefined,
      signal,
    )
  )
    .toString()
    .trim();
  if (hash !== ref) throw new Error('커밋이 일치하지 않습니다.');
  return hash;
}
export async function commitMessage(
  root: string,
  commit: string,
): Promise<{ message: string }> {
  const hash = await commitHash(root, commit);
  const raw = await git(root, ['show', '-s', '--format=%B', hash, '--']);
  return { message: raw.toString().trimEnd() };
}
const MAX_QUERY = 200;
const MAX_PATH = 4096;
const FORMAT = '--format=%H%x00%P%x00%an%x00%aI%x00%s%x00';
export interface ValidFilter {
  args: string[];
  path?: string;
  follow: boolean;
  hashPrefix?: string;
}
function query(value: unknown, label: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') throw new Error('잘못된 필터입니다.');
  const q = value.trim();
  if (!q) return undefined;
  if (q.length > MAX_QUERY)
    throw new Error(`${label}는 ${MAX_QUERY}자 이하로 입력하세요.`);
  // 고정 문자열 검색에서도 줄바꿈은 패턴 구분자로 쪼개지므로 미리 막는다.
  if (/[\0\r\n]/.test(q))
    throw new Error(`${label}에 줄바꿈이나 NUL 문자를 쓸 수 없습니다.`);
  return q;
}
function day(value: unknown): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    throw new Error('날짜는 YYYY-MM-DD 형식의 실제 날짜여야 합니다.');
  const date = new Date(`${value}T00:00:00Z`);
  // 2월 30일처럼 Date가 다음 달로 넘겨 버리는 값을 왕복 비교로 거른다.
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value)
    throw new Error('날짜는 YYYY-MM-DD 형식의 실제 날짜여야 합니다.');
  return value;
}
export function validateFilter(
  filter: unknown,
  all = false,
): ValidFilter | undefined {
  if (filter === undefined || filter === null) return undefined;
  if (typeof filter !== 'object' || Array.isArray(filter))
    throw new Error('잘못된 필터입니다.');
  const f = filter as LogFilter;
  const text = query(f.text, '검색어');
  const author = query(f.author, '작성자');
  const since = day(f.since);
  const until = day(f.until);
  let path: string | undefined;
  if (f.path !== undefined && f.path !== null && f.path !== '') {
    validPath(f.path);
    if (f.path.length > MAX_PATH)
      throw new Error('잘못된 저장소 상대 경로입니다.');
    path = f.path;
  }
  if (f.follow !== undefined && typeof f.follow !== 'boolean')
    throw new Error('잘못된 필터입니다.');
  if (f.follow === true && all)
    throw new Error('전체 브랜치에서는 이름 변경 추적을 쓸 수 없습니다.');
  const args: string[] = [];
  if (text) args.push(`--grep=${text}`);
  if (author) args.push(`--author=${author}`);
  if (text || author) args.push('--fixed-strings', '--regexp-ignore-case');
  // 날짜만 주면 Git이 현재 시각을 붙여 해석해 당일 커밋 일부가 빠진다.
  if (since) args.push(`--since=${since} 00:00:00`);
  if (until) args.push(`--until=${until} 23:59:59`);
  if (!args.length && !path) return undefined;
  return {
    args,
    path,
    follow: f.follow === true && path !== undefined,
    hashPrefix:
      text && /^[0-9a-f]{4,64}$/i.test(text) ? text.toLowerCase() : undefined,
  };
}
// i18n 검사가 소스의 한글 원문 리터럴로 번역 키를 찾아서 접두사를 보간하지 않고 풀어 쓴다.
// 접두사가 STALE_CURSOR_PREFIX와 같은지는 git.test.ts가 확인한다.
const STALE_CURSOR =
  'stale-cursor: 이력이 바뀌었습니다. 처음부터 다시 불러옵니다.';
const BAD_CURSOR = '잘못된 페이지 커서입니다. 처음부터 다시 불러오세요.';
export function encodeCursor(skip: number, snapshot: string): string {
  return Buffer.from(JSON.stringify({ skip, snapshot })).toString('base64url');
}
export function decodeCursor(
  cursor: unknown,
  snapshot: string,
): number | undefined {
  if (cursor === undefined || cursor === null) return undefined;
  // Node의 base64url 디코더는 모르는 문자를 조용히 버리므로 문자 집합을 먼저 확인한다.
  if (
    typeof cursor !== 'string' ||
    cursor.length > 512 ||
    !/^[A-Za-z0-9_-]+$/.test(cursor)
  )
    throw new Error(BAD_CURSOR);
  let value: unknown;
  try {
    value = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
  } catch {
    throw new Error(BAD_CURSOR);
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    throw new Error(BAD_CURSOR);
  const { skip, snapshot: saved } = value as {
    skip?: unknown;
    snapshot?: unknown;
  };
  if (
    typeof skip !== 'number' ||
    !Number.isInteger(skip) ||
    skip < 0 ||
    skip > LOAD_LIMIT ||
    typeof saved !== 'string'
  )
    throw new Error(BAD_CURSOR);
  if (saved !== snapshot) throw new Error(STALE_CURSOR);
  return skip;
}
export function page(skip: number, fetched: number) {
  const size = Math.min(PAGE_SIZE, LOAD_LIMIT - skip);
  const taken = Math.min(size, fetched);
  const next = skip + taken;
  return { size, taken, next, hasMore: fetched > size && next < LOAD_LIMIT };
}
function parseCommits(
  raw: string,
  head: string,
  refs: Map<string, string[]>,
): Commit[] {
  const fields = raw.split('\0');
  const commits: Commit[] = [];
  for (let i = 0; i + 5 < fields.length; i += 5) {
    const hash = fields[i].trim();
    commits.push({
      hash,
      parents: fields[i + 1].split(' ').filter(Boolean),
      author: fields[i + 2],
      date: fields[i + 3],
      subject: fields[i + 4].trimEnd(),
      refs: [...(hash === head ? ['HEAD'] : []), ...(refs.get(hash) ?? [])],
    });
  }
  return commits;
}
type RefIndex = {
  refs: Map<string, string[]>;
  localBranches: { name: string; hash: string }[];
  branches: BranchRef[];
  walked: string[];
  extraWalked: string[];
};
// 브랜치 피커와 커밋 라벨, 페이지 스냅샷이 같이 쓰는 ref 목록을 한 번에 읽는다.
async function readRefs(
  root: string,
  all: boolean,
  signal?: AbortSignal,
): Promise<RefIndex> {
  const refs = new Map<string, string[]>();
  const localBranches: { name: string; hash: string }[] = [];
  const branches: BranchRef[] = [];
  const walked: string[] = [];
  // --all은 브랜치 밖의 태그, stash, notes도 걷는다. 목록에 보이지 않아도 움직이면 커서 위치가 밀린다.
  const extraWalked: string[] = [];
  for (const line of (
    await git(
      root,
      [
        'for-each-ref',
        '--format=%(objectname)%09%(refname)%09%(symref)%09%(objecttype)%09%(*objectname)%09%(*objecttype)',
        'refs/',
      ],
      undefined,
      signal,
    )
  )
    .toString()
    .split('\n')
    .filter(Boolean)) {
    const [hash, name, symbolic, type, peeled, peeledType] = line.split('\t');
    if (name?.startsWith('refs/tags/')) {
      if (all) extraWalked.push(line);
      // 태그 목록 자체는 브랜치 피커에 노출하지 않고, 커밋 라벨로만 붙인다.
      const target =
        type === 'commit'
          ? hash
          : type === 'tag' && peeledType === 'commit'
            ? peeled
            : undefined;
      if (target)
        refs.set(target, [
          ...(refs.get(target) ?? []),
          `tag: ${name.replace(/^refs\/tags\//, '')}`,
        ]);
      continue;
    }
    if (
      !name?.startsWith('refs/heads/') &&
      !name?.startsWith('refs/remotes/')
    ) {
      if (all) extraWalked.push(line);
      continue;
    }
    walked.push(line);
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
  return { refs, localBranches, branches, walked, extraWalked };
}
// 워커는 재시작마다 메모리를 잃으므로 같은 이력인지는 요청마다 다시 계산해 비교한다.
function snapshotKey(input: {
  head: string;
  walked: string[];
  extra: string[];
  all: boolean;
  branchRef?: string;
  valid: ReturnType<typeof validateFilter>;
}): string {
  const { head, walked, extra, all, branchRef, valid } = input;
  return createHash('sha256')
    .update(
      JSON.stringify({
        head,
        refs: walked,
        extra,
        all,
        branchRef: branchRef ?? null,
        filter: valid
          ? { args: valid.args, path: valid.path ?? null, follow: valid.follow }
          : null,
      }),
    )
    .digest('hex');
}
// 해시로 검색한 커밋을 목록에 맞춰 넣는다. commits를 직접 고친다.
async function placeHashMatch(
  root: string,
  commits: Commit[],
  skip: number,
  hashPrefix: string,
  head: string,
  refs: Map<string, string[]>,
  signal?: AbortSignal,
): Promise<void> {
  const match = await optional(
    root,
    ['rev-parse', '--verify', '--quiet', `${hashPrefix}^{commit}`],
    signal,
  );
  // 같은 이름의 ref로 풀린 경우는 해시 검색이 아니므로 버린다.
  const found = /^[a-f0-9]{40,64}$/.test(match) && match.startsWith(hashPrefix);
  // 첫 페이지 범위 밖의 일치 커밋은 첫 페이지 맨 위에 이미 붙었으므로 뒷 페이지에서는 뺀다.
  // skip은 Git 출력 행 기준이라 여기서 빼도 다음 커서 위치는 어긋나지 않는다.
  if (found && skip > 0) {
    const at = commits.findIndex((c) => c.hash === match);
    if (at >= 0 && skip + at >= PAGE_SIZE) commits.splice(at, 1);
  } else if (found && !commits.some((c) => c.hash === match))
    commits.unshift(
      ...parseCommits(
        (
          await git(
            root,
            ['log', '-1', '--no-walk', FORMAT, match, '--'],
            undefined,
            signal,
          )
        ).toString(),
        head,
        refs,
      ),
    );
}
export async function log(
  root: string,
  all = false,
  branchRef?: string,
  filter?: LogFilter,
  cursor?: string,
  signal?: AbortSignal,
): Promise<Repository> {
  const valid = validateFilter(filter, all);
  // 세 호출은 서로 입력에 의존하지 않아 함께 돌린다.
  const [head, branch, refIndex] = await Promise.all([
    optional(root, ['rev-parse', '--verify', 'HEAD'], signal),
    optional(root, ['symbolic-ref', '--short', '-q', 'HEAD'], signal),
    readRefs(root, all, signal),
  ]);
  const { refs, localBranches, branches, walked, extraWalked } = refIndex;
  const selected =
    branchRef === undefined
      ? undefined
      : branches.find((b) => b.ref === branchRef);
  if (branchRef !== undefined && !selected)
    throw new Error('선택한 브랜치를 찾을 수 없습니다. 새로고침하세요.');
  const selectedHash = selected
    ? await commitHash(root, selected.hash, signal)
    : undefined;
  // 워커는 재시작마다 메모리를 잃으므로 같은 이력인지는 요청마다 다시 계산해 비교한다.
  const snapshot = snapshotKey({
    head,
    walked,
    extra: all ? extraWalked : [],
    all,
    branchRef,
    valid,
  });
  const skip = decodeCursor(cursor, snapshot) ?? 0;
  const { size } = page(skip, 0);
  // 디렉터리에 --follow를 걸면 이력이 엉뚱하게 끊기므로 파일일 때만 켠다.
  const start = selectedHash ?? head;
  const follow =
    valid?.follow === true &&
    !!start &&
    (await optional(
      root,
      ['cat-file', '-t', `${start}:${valid.path}`],
      signal,
    )) !== 'tree';
  // --follow와 --skip을 함께 쓰면 skip이 경로에 안 걸리는 커밋까지 세고, 건너뛴 구간의
  // 이름 변경도 놓친다. follow일 때는 처음부터 받아 앞 skip개를 JS에서 잘라낸다(상한 5,000이라 비용 제한적).
  const range = follow
    ? [`-${skip + size + 1}`]
    : [`--skip=${skip}`, `-${size + 1}`];
  // NUL 구분자로 제목의 탭 문자도 손실 없이 받는다. Git adds one LF between records.
  const raw =
    (!head && !all && !selectedHash) || size <= 0
      ? ''
      : (
          await git(
            root,
            [
              '--literal-pathspecs',
              'log',
              '--topo-order',
              ...range,
              FORMAT,
              ...(valid?.args ?? []),
              ...(follow ? ['--follow'] : []),
              ...(selectedHash
                ? [selectedHash]
                : all
                  ? ['--all', ...(head ? ['HEAD'] : [])]
                  : ['HEAD']),
              '--',
              ...(valid?.path ? [valid.path] : []),
            ],
            undefined,
            signal,
          )
        ).toString();
  const parsed = parseCommits(raw, head, refs);
  const fetched = follow ? parsed.slice(skip) : parsed;
  const { taken, next, hasMore } = page(skip, fetched.length);
  const commits = fetched.slice(0, taken);
  if (valid?.hashPrefix)
    await placeHashMatch(
      root,
      commits,
      skip,
      valid.hashPrefix,
      head,
      refs,
      signal,
    );
  return {
    root,
    branch: branch || 'Detached HEAD',
    head: head || null,
    commits,
    localBranches,
    branches,
    hasMore,
    ...(hasMore ? { nextCursor: encodeCursor(next, snapshot) } : {}),
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
function limitFiles(files: ChangedFile[]) {
  if (files.length > 2000)
    throw new Error(
      '변경 파일이 2,000개를 초과합니다. 더 작은 비교가 필요합니다.',
    );
  return files;
}
async function rangeChanges(
  root: string,
  input: Extract<Comparison, { kind: 'range' }>,
): Promise<ChangeSet> {
  const base = await commitHash(root, input.base);
  const target = await commitHash(root, input.target);
  const mergeBase = input.mergeBase === true;
  let left = base;
  if (mergeBase) {
    const found = await optional(root, ['merge-base', base, target]);
    if (!found) throw new Error('공통 조상이 없습니다.');
    left = found;
  }
  if (left === target) throw new Error('같은 커밋입니다.');
  const files = limitFiles(
    parseNames(
      await git(root, [
        'diff',
        '--no-ext-diff',
        '--no-textconv',
        '-M',
        '--name-status',
        '-z',
        left,
        target,
        '--',
      ]),
    ),
  );
  return {
    comparison: { kind: 'range', base, target, mergeBase },
    files,
    left,
    right: target,
  };
}
export async function changes(
  root: string,
  input: Comparison,
): Promise<ChangeSet> {
  if (!input || !['working', 'commit', 'range'].includes(input.kind))
    throw new Error('잘못된 비교 모드입니다.');
  if (input.kind === 'range') return rangeChanges(root, input);
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
    limitFiles(files);
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
  // range의 왼쪽은 mergeBase 여부에 따라 바뀌므로 changes()가 확정한 left를 쓴다.
  const base =
    c.kind === 'range'
      ? set.left
      : c.kind === 'commit'
        ? c.parent
        : (c.head ?? undefined);
  const original =
    file.status === 'A'
      ? missing()
      : await blob(root, base, file.oldPath ?? path);
  const modified =
    c.kind === 'range'
      ? await blob(root, c.target, path)
      : c.kind === 'commit'
        ? await blob(root, c.commit, path)
        : await disk(root, path);
  return { file, original, modified };
}
