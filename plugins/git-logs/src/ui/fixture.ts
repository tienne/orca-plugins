import type {
  ChangeSet,
  ChangedFile,
  Comparison,
  FileDiff,
  LogFilter,
  Repository,
} from '../protocol';
// English sample data is opt-in and available only in the browser demo.
// Real commit messages, author names and file contents are never translated.
const englishSample =
  typeof window !== 'undefined' &&
  !window.orca &&
  new URLSearchParams(window.location.search).get('sample') === 'en';
const sample = (ko: string, en: string) => (englishSample ? en : ko);
const hash = (n: number) =>
  (n.toString(16) + 'a4f19c8e0b72d61f534eaa0982c7db6f1049abc').slice(0, 40);
export const fixtureRepo: Repository = {
  root: '/demo/atlas',
  branches: [
    { ref: 'refs/heads/main', name: 'main', hash: hash(8), kind: 'local' },
    {
      ref: 'refs/heads/feature/readable-diff',
      name: 'feature/readable-diff',
      hash: hash(6),
      kind: 'local',
    },
    {
      ref: 'refs/remotes/origin/main',
      name: 'origin/main',
      hash: hash(8),
      kind: 'remote',
    },
    {
      ref: 'refs/remotes/origin/feature/readable-diff',
      name: 'origin/feature/readable-diff',
      hash: hash(6),
      kind: 'remote',
    },
  ],
  branch: 'main',
  head: hash(8),
  commits: [
    {
      hash: hash(8),
      parents: [hash(7), hash(6)],
      author: sample('서연', 'Alex Morgan'),
      date: '2026-11-04T09:20:00+09:00',
      subject: 'Merge branch feature/readable-diff',
      refs: ['HEAD', 'main', 'origin/main'],
    },
    {
      hash: hash(7),
      parents: [hash(5)],
      author: 'David',
      date: '2026-11-04T08:30:00+09:00',
      subject: 'Improve empty states and keyboard focus',
      refs: ['tag: v1.0.0'],
    },
    {
      hash: hash(6),
      parents: [hash(5)],
      author: sample('지우', 'Sam Taylor'),
      date: '2026-11-03T18:00:00+09:00',
      subject: 'Add aligned side-by-side comparison',
      refs: ['feature/readable-diff', 'origin/feature/readable-diff'],
    },
    {
      hash: hash(5),
      parents: [hash(4)],
      author: 'David',
      date: '2026-11-03T14:12:00+09:00',
      subject: 'Extract repository connection controls',
      refs: ['tag: v0.9.0', 'tag: v0.9.0-rc.1'],
    },
    {
      hash: hash(4),
      parents: [hash(3)],
      author: sample('서연', 'Alex Morgan'),
      date: '2026-11-02T11:10:00+09:00',
      subject: 'Handle binary and renamed files',
      refs: [],
    },
    {
      hash: hash(3),
      parents: [],
      author: 'David',
      date: '2026-11-01T10:00:00+09:00',
      subject: 'Initial implementation',
      refs: [],
    },
  ],
};
const fixtureBodies: Record<string, string> = {
  [hash(8)]: sample(
    '좌우 비교와 변경 탐색을 하나의 흐름으로 연결합니다.',
    'Bring aligned comparison and change navigation into one view.',
  ),
  [hash(6)]: sample(
    '공백 비교 옵션 및 동기 스크롤을 추가합니다.',
    'Add whitespace options and synchronized scrolling.',
  ),
};
// 본문이 없는 커밋은 워커처럼 제목만 돌려준다.
export function fixtureCommitMessage(commitHash: string): { message: string } {
  const commit = fixtureCommits().find((c) => c.hash === commitHash);
  if (!commit) throw new Error('커밋을 찾을 수 없습니다.');
  const body = fixtureBodies[commitHash];
  return { message: body ? `${commit.subject}\n\n${body}` : commit.subject };
}
export const fixtureSet: ChangeSet = {
  comparison: { kind: 'working' },
  left: 'HEAD · main',
  right: '현재 작업 트리 · 디스크',
  files: [
    {
      path: 'src/components/comparison/DiffViewer.tsx',
      status: 'M',
      staged: true,
      unstaged: true,
    },
    { path: 'src/styles/comparison.css', status: 'M', unstaged: true },
    {
      path: 'docs/design/very-long-folder-name/side-by-side-comparison-and-navigation.md',
      oldPath: 'docs/diff.md',
      status: 'R',
      staged: true,
    },
    { path: 'assets/preview.png', status: '?', untracked: true },
    { path: 'src/empty.ts', status: 'A', staged: true },
    { path: 'src/legacy.ts', status: 'D', unstaged: true },
  ],
};
export function fixtureDiff(path: string): FileDiff {
  const file = [
    ...fixtureSet.files,
    ...renameWorking,
    ...Object.values(renameChanges).flat(),
  ].find((f) => f.path === path)!;
  const original = {
    kind: 'text' as const,
    text: 'import { useState } from "react";\n\ninterface ComparisonOptions {\n  readOnly: boolean;\n}\n\nexport function DiffViewer() {\n  const [activeFile, setActiveFile] = useState(null);\n\n  const options = {\n    readOnly: false,\n    renderSideBySide: false,\n    fontSize: 12,\n  };\n\n  return (\n    <Comparison\n      file={activeFile}\n      options={options}\n    />\n  );\n}\n',
    bytes: 420,
  };
  const context = Array.from(
    { length: 24 },
    (_, i) => `// DEMO: unchanged context ${i + 1}\n`,
  ).join('');
  original.text = context + original.text + context;
  const modified = {
    kind: 'text' as const,
    text: original.text
      .replace('readOnly: false', 'readOnly: true')
      .replace('renderSideBySide: false', 'renderSideBySide: true')
      .replace('fontSize: 12', 'fontSize: 13,\n    scrollSync: true')
      .replace(
        '      options={options}',
        sample(
          '      options={options}\n      ariaLabel="읽기 전용 코드 비교"',
          '      options={options}\n      ariaLabel="Read-only code comparison"',
        ),
      ),
    bytes: 490,
  };
  if (path.endsWith('.png'))
    return {
      file,
      original: { kind: 'missing', text: '', bytes: 0 },
      modified: { kind: 'binary', text: '', bytes: 2048 },
    };
  if (file.status === 'A')
    return {
      file,
      original: { kind: 'missing', text: '', bytes: 0 },
      modified: { kind: 'text', text: '', bytes: 0 },
    };
  if (file.status === 'D')
    return {
      file,
      original,
      modified: { kind: 'missing', text: '', bytes: 0 },
    };
  return { file, original, modified };
}

// 파일 히스토리 미리보기(?fixture=rename). src/ui/History.tsx가 Timeline.tsx로 이름을 바꾼 이력이다.
const renameHash = (n: number) =>
  `e${n}c3a9f0d17b24685e0ac91d3f7b52e8046a1c9d`.slice(0, 40);
const renameCommits: Repository['commits'] = [
  {
    hash: renameHash(5),
    parents: [renameHash(4)],
    author: 'David',
    date: '2026-11-06T10:00:00+09:00',
    subject: 'Update README for the history view',
    refs: ['HEAD', 'main', 'origin/main'],
  },
  {
    hash: renameHash(4),
    parents: [renameHash(3)],
    author: 'David',
    date: '2026-11-05T15:20:00+09:00',
    subject: 'Polish timeline keyboard focus',
    refs: ['tag: v1.1.0'],
  },
  {
    hash: renameHash(3),
    parents: [renameHash(2)],
    author: sample('서연', 'Alex Morgan'),
    date: '2026-11-04T11:40:00+09:00',
    subject: 'Rename History to Timeline',
    refs: [],
  },
  {
    hash: renameHash(2),
    parents: [renameHash(1)],
    author: 'David',
    date: '2026-11-03T09:05:00+09:00',
    subject: 'Add history filters',
    refs: [],
  },
  {
    hash: renameHash(1),
    parents: [],
    author: 'David',
    date: '2026-11-02T09:00:00+09:00',
    subject: 'Add history view',
    refs: [],
  },
];
const renameChanges: Record<string, ChangedFile[]> = {
  [renameHash(5)]: [{ path: 'README.md', status: 'M' }],
  [renameHash(4)]: [
    { path: 'src/ui/Timeline.tsx', status: 'M' },
    { path: 'src/ui/focus.ts', status: 'M' },
  ],
  [renameHash(3)]: [
    { path: 'src/connection.ts', status: 'M' },
    { path: 'src/ui/Timeline.tsx', oldPath: 'src/ui/History.tsx', status: 'R' },
  ],
  [renameHash(2)]: [
    { path: 'src/ui/filters.ts', status: 'A' },
    { path: 'src/ui/History.tsx', status: 'M' },
  ],
  [renameHash(1)]: [{ path: 'src/ui/History.tsx', status: 'A' }],
};
const renameWorking: ChangedFile[] = [
  { path: 'src/ui/Timeline.tsx', status: 'M', unstaged: true },
  { path: 'README.md', status: 'M', unstaged: true },
];
// 비교 종류에 맞는 변경 파일. 이름 변경 이력 시나리오만 커밋마다 다른 파일을 돌려준다.
export function fixtureFiles(comparison: Comparison): ChangedFile[] {
  if (scenario() !== 'rename') return fixtureSet.files;
  return comparison.kind === 'commit'
    ? (renameChanges[comparison.commit] ?? [])
    : renameWorking;
}
// follow면 최신 커밋부터 거슬러 올라가며 이름이 바뀐 이전 경로를 추적 대상에 더한다.
function renamedNames(path: string, follow: boolean) {
  const names = new Set([path]);
  if (follow)
    for (const commit of renameCommits)
      for (const file of renameChanges[commit.hash] ?? [])
        if (file.oldPath && names.has(file.path)) names.add(file.oldPath);
  return names;
}

// 경로 필터 미리보기용으로 커밋마다 바꾼 파일을 정해 둔다.
const fixturePaths: Record<string, string[]> = {
  [hash(8)]: ['src/components/comparison/DiffViewer.tsx'],
  [hash(7)]: ['src/ui/focus.ts'],
  [hash(6)]: ['src/components/comparison/DiffViewer.tsx'],
  [hash(5)]: ['src/connection.ts'],
  [hash(4)]: ['src/components/comparison/DiffViewer.tsx', 'src/binary.ts'],
  [hash(3)]: ['README.md', 'src/components/comparison/DiffViewer.tsx'],
};
// 워커의 git log 필터를 흉내 낸다. 날짜는 fixture에 committer date가 없어 표시 날짜로 대신한다.
function matches(commit: Repository['commits'][number], filter: LogFilter) {
  const includes = (value: string, query?: string) =>
    !query || value.toLocaleLowerCase().includes(query.toLocaleLowerCase());
  const day = commit.date.slice(0, 10);
  const path = filter.path?.replace(/\/+$/, '');
  const within = (file: string, targets: Set<string>) =>
    [...targets].some((name) => file === name || file.startsWith(`${name}/`));
  const names = path ? renamedNames(path, filter.follow === true) : undefined;
  return (
    includes(commit.subject, filter.text) &&
    includes(commit.author, filter.author) &&
    (!filter.since || day >= filter.since) &&
    (!filter.until || day <= filter.until) &&
    (!names ||
      (scenario() === 'rename'
        ? (renameChanges[commit.hash] ?? []).some(
            (file) =>
              within(file.path, names) ||
              (!!file.oldPath && within(file.oldPath, names)),
          )
        : (fixturePaths[commit.hash] ?? []).some((file) =>
            within(file, names),
          )))
  );
}

// 페이징 미리보기용 시나리오. paged·stale은 450개(200/200/50), many는 상한(5,000)을 넘는 이력이다.
const generatedCount: Record<string, number> = {
  paged: 450,
  stale: 450,
  many: 5200,
};
const PAGE_SIZE = 200;
const LOAD_LIMIT = 5000;
let generated: Repository['commits'] | undefined;
const pagedHash = (n: number) =>
  `f${n.toString(16).padStart(7, '0')}${hash(0).slice(8)}`.slice(0, 40);
// 100행마다 15행 뒤로 이어지는 곁가지를 두어 페이지 경계(200행)를 넘는 그래프 선을 만든다.
function fixtureCommits(): Repository['commits'] {
  if (scenario() === 'rename') return renameCommits;
  const count = generatedCount[scenario()];
  if (!count) return fixtureRepo.commits;
  generated ??= Array.from({ length: count }, (_, i) => ({
    hash: pagedHash(i),
    parents:
      i === count - 1
        ? []
        : i % 100 === 90 && i + 15 < count
          ? [pagedHash(i + 1), pagedHash(i + 15)]
          : [pagedHash(i + 1)],
    author: i % 3 ? 'David' : sample('서연', 'Alex Morgan'),
    date: new Date(Date.UTC(2026, 10, 4, 0) - i * 3_600_000).toISOString(),
    subject: `DEMO paged commit ${i + 1}`,
    refs: i === 0 ? ['HEAD', 'main', 'origin/main'] : [],
  }));
  return generated;
}
function scenario() {
  return typeof window === 'undefined' || window.orca
    ? 'default'
    : (new URLSearchParams(window.location.search).get('fixture') ?? 'default');
}
// stale 시나리오는 첫 다음 페이지 요청에서 한 번만 이력이 바뀐 것처럼 실패한다.
let staleOnce = true;

export function fixtureLog(
  scope: string,
  filter: LogFilter = {},
  cursor?: string,
): Repository {
  const commits = fixtureCommits();
  const branch = fixtureRepo.branches?.find((branch) => branch.ref === scope);
  const byHash = new Map(commits.map((commit) => [commit.hash, commit]));
  const reachable = new Set<string>();
  // 생성 이력에서는 브랜치를 고르면 앞 50개를 건너뛴 지점부터 보여 준다.
  const pending = branch
    ? [commits === fixtureRepo.commits ? branch.hash : pagedHash(50)]
    : [];
  while (pending.length) {
    const hash = pending.pop()!;
    if (reachable.has(hash)) continue;
    reachable.add(hash);
    pending.push(...(byHash.get(hash)?.parents ?? []));
  }
  let skip = 0;
  if (cursor !== undefined) {
    const match = /^demo-(\d+)$/.exec(cursor);
    if (!match || Number(match[1]) > LOAD_LIMIT)
      throw new Error('잘못된 페이지 커서입니다. 처음부터 다시 불러오세요.');
    if (scenario() === 'stale' && staleOnce) {
      staleOnce = false;
      throw new Error(
        'stale-cursor: 이력이 바뀌었습니다. 처음부터 다시 불러옵니다.',
      );
    }
    skip = Number(match[1]);
  }
  const matched = commits.filter(
    (commit) =>
      (!branch || reachable.has(commit.hash)) && matches(commit, filter),
  );
  const next = Math.min(skip + PAGE_SIZE, LOAD_LIMIT, matched.length);
  const hasMore = next < matched.length && next < LOAD_LIMIT;
  return {
    ...fixtureRepo,
    head: commits[0]?.hash ?? null,
    commits: matched.slice(skip, next),
    hasMore,
    ...(hasMore ? { nextCursor: `demo-${next}` } : {}),
  };
}

// 첫 번째로 만나는 공통 조상을 쓴다. 미리보기용이라 가장 가까운 조상을 보장하지는 않는다.
function fixtureMergeBase(base: string, target: string) {
  const parents = new Map(
    fixtureCommits().map((commit) => [commit.hash, commit.parents]),
  );
  const ancestors = new Set<string>();
  const pending = [base];
  while (pending.length) {
    const hash = pending.pop()!;
    if (ancestors.has(hash)) continue;
    ancestors.add(hash);
    pending.push(...(parents.get(hash) ?? []));
  }
  const queue = [target];
  const seen = new Set<string>();
  while (queue.length) {
    const hash = queue.shift()!;
    if (ancestors.has(hash)) return hash;
    if (seen.has(hash)) continue;
    seen.add(hash);
    queue.push(...(parents.get(hash) ?? []));
  }
  return undefined;
}

// 워커 rangeChanges와 같은 순서로 오류를 낸다. unrelated 시나리오는 공통 조상이 없는 저장소를 흉내 낸다.
export function fixtureRange(
  comparison: Extract<Comparison, { kind: 'range' }>,
): ChangeSet {
  const known = new Set(fixtureCommits().map((commit) => commit.hash));
  if (!known.has(comparison.base) || !known.has(comparison.target))
    throw new Error('커밋을 찾을 수 없습니다.');
  const mergeBase = comparison.mergeBase === true;
  let left = comparison.base;
  if (mergeBase) {
    const found =
      scenario() === 'unrelated'
        ? undefined
        : fixtureMergeBase(comparison.base, comparison.target);
    if (!found) throw new Error('공통 조상이 없습니다.');
    left = found;
  }
  if (left === comparison.target) throw new Error('같은 커밋입니다.');
  const files = fixtureSet.files
    .filter((file) => file.status !== '?')
    .map(({ path, oldPath, status }) => ({
      path,
      status,
      ...(oldPath ? { oldPath } : {}),
    }));
  return {
    comparison: { ...comparison, mergeBase },
    files: mergeBase ? files.slice(0, 2) : files,
    left,
    right: comparison.target,
  };
}
