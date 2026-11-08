import type { Commit } from '../protocol';
export interface GraphRow {
  lane: number;
  before: string[];
  after: string[];
  edges: { from: number; to: number; parent: boolean }[];
}
/** 마지막 행 뒤에 열려 있는 레인. 다음 페이지 레이아웃은 여기서 이어간다. */
export interface GraphState {
  lanes: string[];
}
export const emptyGraph: GraphState = { lanes: [] };
export function layoutFrom(
  state: GraphState,
  commits: Commit[],
): { rows: GraphRow[]; state: GraphState } {
  const lanes = [...state.lanes];
  const rows = commits.map((commit) => {
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
  return { rows, state: { lanes } };
}
export function layout(commits: Commit[]): GraphRow[] {
  return layoutFrom(emptyGraph, commits).rows;
}
