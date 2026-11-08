import { isLand, neighbours } from './world';
/** Breadth-first routes respect water, cliffs and scene obstacles. */
export function route(
  start: number,
  goal: number,
  blocked: Set<number>,
): number[] {
  if (!isLand(start) || !isLand(goal) || blocked.has(goal)) return [];
  const queue = [start],
    previous = new Map<number, number>([[start, -1]]);
  for (let i = 0; i < queue.length; i++) {
    const cell = queue[i];
    if (cell === goal) {
      const path: number[] = [];
      for (let c = goal; c !== start; c = previous.get(c)!) path.unshift(c);
      return path;
    }
    for (const next of neighbours(cell)) {
      if (blocked.has(next) || previous.has(next)) continue;
      previous.set(next, cell);
      queue.push(next);
    }
  }
  return [];
}
