/** Four-neighbour island navigation. Buildings are obstacles, never inventory edits. */
export function route(
  start: number,
  goal: number,
  blocked: Set<number>,
): number[] {
  if (
    ![start, goal].every((n) => Number.isInteger(n) && n >= 0 && n < 36) ||
    blocked.has(goal)
  )
    return [];
  const queue = [start],
    previous = new Map<number, number>([[start, -1]]);
  for (let i = 0; i < queue.length; i++) {
    const cell = queue[i];
    if (cell === goal) {
      const path: number[] = [];
      for (let c = goal; c !== start; c = previous.get(c)!) path.unshift(c);
      return path;
    }
    for (const next of [cell - 6, cell + 1, cell + 6, cell - 1]) {
      if (
        next < 0 ||
        next >= 36 ||
        Math.abs((next % 6) - (cell % 6)) +
          Math.abs(Math.floor(next / 6) - Math.floor(cell / 6)) !==
          1 ||
        blocked.has(next) ||
        previous.has(next)
      )
        continue;
      previous.set(next, cell);
      queue.push(next);
    }
  }
  return [];
}
