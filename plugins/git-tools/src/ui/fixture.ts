import type { ChangeSet, FileDiff, Repository } from '../protocol';
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
      author: '서연',
      date: '2026-11-04T09:20:00+09:00',
      message:
        'Merge branch feature/readable-diff\n\n좌우 비교와 변경 탐색을 하나의 흐름으로 연결합니다.',
      refs: ['HEAD', 'main', 'origin/main'],
    },
    {
      hash: hash(7),
      parents: [hash(5)],
      author: 'David',
      date: '2026-11-04T08:30:00+09:00',
      message: 'Improve empty states and keyboard focus',
      refs: [],
    },
    {
      hash: hash(6),
      parents: [hash(5)],
      author: '지우',
      date: '2026-11-03T18:00:00+09:00',
      message:
        'Add aligned side-by-side comparison\n\n공백 비교 옵션 및 동기 스크롤을 추가합니다.',
      refs: ['feature/readable-diff', 'origin/feature/readable-diff'],
    },
    {
      hash: hash(5),
      parents: [hash(4)],
      author: 'David',
      date: '2026-11-03T14:12:00+09:00',
      message: 'Extract repository connection controls',
      refs: [],
    },
    {
      hash: hash(4),
      parents: [hash(3)],
      author: '서연',
      date: '2026-11-02T11:10:00+09:00',
      message: 'Handle binary and renamed files',
      refs: [],
    },
    {
      hash: hash(3),
      parents: [],
      author: 'David',
      date: '2026-11-01T10:00:00+09:00',
      message: 'Initial implementation',
      refs: [],
    },
  ],
};
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
  const file = fixtureSet.files.find((f) => f.path === path)!;
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
        '      options={options}\n      ariaLabel="읽기 전용 코드 비교"',
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

export function fixtureLog(scope: string): Repository {
  const branch = fixtureRepo.branches?.find((branch) => branch.ref === scope);
  if (!branch) return fixtureRepo;
  const reachable = new Set<string>();
  const pending = [branch.hash];
  while (pending.length) {
    const hash = pending.pop()!;
    if (reachable.has(hash)) continue;
    reachable.add(hash);
    pending.push(
      ...(fixtureRepo.commits.find((commit) => commit.hash === hash)?.parents ??
        []),
    );
  }
  return {
    ...fixtureRepo,
    commits: fixtureRepo.commits.filter((commit) => reachable.has(commit.hash)),
  };
}
