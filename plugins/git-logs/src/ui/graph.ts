import type { Commit } from '../protocol';
export interface GraphRow {
  lane: number;
  before: string[];
  after: string[];
  edges: { from: number; to: number; parent: boolean }[];
}
export function layout(commits: Commit[]): GraphRow[] {
  let lanes: string[] = [];
  return commits.map((commit) => {
    if (!lanes.includes(commit.hash)) lanes.push(commit.hash);
    const before = [...lanes];
    const lane = lanes.indexOf(commit.hash);
    lanes.splice(lane, 1);
    for (const parent of commit.parents)
      if (!lanes.includes(parent))
        lanes.splice(
          Math.min(lane + commit.parents.indexOf(parent), lanes.length),
          0,
          parent,
        );
    const edges = before.flatMap((hash, from) =>
      hash === commit.hash
        ? commit.parents.map((hash) => ({
            from,
            to: lanes.indexOf(hash),
            parent: true,
          }))
        : [{ from, to: lanes.indexOf(hash), parent: false }],
    );
    return { lane, before, after: [...lanes], edges };
  });
}
