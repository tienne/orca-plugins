import landmarks from './landmarks.json';
export { landmarks };
export const weights = { common: 70, rare: 23, epic: 6, legendary: 1 };
export type Placement = { landmark: string; cell: number };
export type Receipt = { workspaceId: string; landmark: string; at: string };
export type State = {
  version: 1;
  receipts: Receipt[];
  placements: Placement[];
};
export const empty = (): State => ({
  version: 1,
  receipts: [],
  placements: [],
});
export function quantity(s: State, id: string) {
  return s.receipts.filter((r) => r.landmark === id).length;
}
export function validate(value: unknown): State {
  if (value == null) return empty();
  const s = value as State;
  if (
    s.version !== 1 ||
    !Array.isArray(s.receipts) ||
    !Array.isArray(s.placements)
  )
    throw Error('Unsupported or damaged save. Save was not overwritten.');
  const ids = new Set<string>();
  const cells = new Set<number>();
  for (const r of s.receipts) {
    if (
      !r ||
      typeof r.workspaceId !== 'string' ||
      !r.workspaceId ||
      ids.has(r.workspaceId) ||
      !landmarks.some((l) => l.id === r.landmark) ||
      typeof r.at !== 'string'
    )
      throw Error('Invalid acquisition receipt');
    ids.add(r.workspaceId);
  }
  for (const p of s.placements) {
    if (
      !p ||
      !Number.isInteger(p.cell) ||
      p.cell < 0 ||
      p.cell >= 36 ||
      cells.has(p.cell) ||
      !landmarks.some((l) => l.id === p.landmark)
    )
      throw Error('Invalid placement');
    cells.add(p.cell);
    if (
      s.placements.filter((x) => x.landmark === p.landmark).length >
      quantity(s, p.landmark)
    )
      throw Error('Placement exceeds ownership');
  }
  return structuredClone(s);
}
export function draw(random: () => number): string {
  const roll = random() * 100;
  let cumulative = 0;
  for (const [tier, weight] of Object.entries(weights)) {
    cumulative += weight;
    if (roll < cumulative) {
      const pool = landmarks.filter((l) => l.tier === tier);
      return pool[Math.floor(random() * pool.length)].id;
    }
  }
  throw Error('Invalid random source');
}
export interface Store {
  read(): Promise<unknown>;
  write(state: State): Promise<void>;
}
export class Game {
  private tail: Promise<unknown> = Promise.resolve();
  constructor(
    private store: Store,
    private random = Math.random,
  ) {}
  private queue<T>(action: (s: State) => Promise<T>) {
    const result = this.tail.then(async () =>
      action(validate(await this.store.read())),
    );
    this.tail = result.catch(() => {});
    return result;
  }
  snapshot() {
    return this.queue(async (s) => s);
  }
  acquire(event: { workspaceId: string; kind: string }) {
    return this.queue(async (s) => {
      if (event.kind !== 'worktree') return s;
      if (
        typeof event.workspaceId !== 'string' ||
        !event.workspaceId ||
        event.workspaceId.length > 256
      )
        throw Error('Invalid workspace ID');
      if (s.receipts.some((r) => r.workspaceId === event.workspaceId)) return s;
      s.receipts.push({
        workspaceId: event.workspaceId,
        landmark: draw(this.random),
        at: new Date().toISOString(),
      });
      await this.store.write(s);
      return s;
    });
  }
  place(input: unknown) {
    return this.queue(async (s) => {
      const p = input as { cell: number; landmark?: string; from?: number };
      if (!p || !Number.isInteger(p.cell) || p.cell < 0 || p.cell >= 36)
        throw Error('Invalid island cell');
      if (p.from !== undefined) {
        if (!Number.isInteger(p.from) || p.from === p.cell)
          throw Error('Choose another cell');
        const old = s.placements.find((x) => x.cell === p.from);
        if (!old || s.placements.some((x) => x.cell === p.cell))
          throw Error('Move requires an empty destination');
        old.cell = p.cell;
      } else {
        s.placements = s.placements.filter((x) => x.cell !== p.cell);
        if (p.landmark !== undefined)
          s.placements.push({ cell: p.cell, landmark: p.landmark });
      }
      validate(s);
      await this.store.write(s);
      return s;
    });
  }
}
