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
// 목록이 끝났는데 부모가 목록에 없는 레인(상한 절단, 얕은 클론)은 아래로 이어지는 선을 끊어 점에서 끝나게 한다.
export function closeOpenLanes(rows: GraphRow[], open: string[]): GraphRow[] {
  if (!open.length) return rows;
  const dangling = new Set(open);
  return rows.map((row) => {
    const edges = row.edges.filter((edge) => !dangling.has(row.after[edge.to]));
    return edges.length === row.edges.length ? row : { ...row, edges };
  });
}
