import landmarks from './landmarks.json';
import { isLand } from './world';
export { landmarks };
export const weights = { common: 70, rare: 23, epic: 6, legendary: 1 };
export type Placement = { landmark: string; cell: number };
export type Receipt = { workspaceId: string; landmark: string; at: string };
export type Ticket = { workspaceId: string; at: string };
export type State = {
  version: 2;
  tickets: Ticket[];
  receipts: Receipt[];
  placements: Placement[];
};
export const empty = (): State => ({
  version: 2,
  tickets: [],
  receipts: [],
  placements: [],
});
export function quantity(s: State, id: string) {
  return s.receipts.filter((r) => r.landmark === id).length;
}
export function availableTickets(s: State) {
  const spent = new Set(s.receipts.map((r) => r.workspaceId));
  return s.tickets.filter((t) => !spent.has(t.workspaceId));
}
export function validate(value: unknown): State {
  if (value == null) return empty();
  const raw = value as State & { version: number };
  const version = (value as { version?: number }).version;
  const s = raw;
  if (
    (version !== 1 && version !== 2) ||
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
      !isLand(p.cell) ||
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
  // Legacy rewards are already redeemed tickets, never new free draws.
  const tickets =
    version === 1
      ? s.receipts.map(({ workspaceId, at }) => ({ workspaceId, at }))
      : s.tickets;
  if (!Array.isArray(tickets)) throw Error('Invalid ticket ledger');
  const earned = new Set<string>();
  for (const t of tickets) {
    if (
      !t ||
      typeof t.workspaceId !== 'string' ||
      !t.workspaceId ||
      t.workspaceId.length > 256 ||
      earned.has(t.workspaceId) ||
      typeof t.at !== 'string'
    )
      throw Error('Invalid ticket ledger');
    earned.add(t.workspaceId);
  }
  if (s.receipts.some((r) => !earned.has(r.workspaceId)))
    throw Error('Reward has no matching ticket');
  return structuredClone({
    version: 2,
    tickets,
    receipts: s.receipts,
    placements: s.placements,
  });
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
      if (s.tickets.some((r) => r.workspaceId === event.workspaceId)) return s;
      s.tickets.push({
        workspaceId: event.workspaceId,
        at: new Date().toISOString(),
      });
      await this.store.write(s);
      return s;
    });
  }
  redeem(input: unknown) {
    return this.queue(async (s) => {
      const ticketId = (input as { ticketId?: unknown } | null)?.ticketId;
      if (typeof ticketId !== 'string' || !ticketId || ticketId.length > 256)
        throw Error('Invalid ticket ID');
      if (!s.tickets.some((t) => t.workspaceId === ticketId))
        throw Error('This ticket is not available');
      // Replaying a request returns its committed reward, even after restart.
      if (s.receipts.some((r) => r.workspaceId === ticketId)) return s;
      s.receipts.push({
        workspaceId: ticketId,
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
      if (!p || !isLand(p.cell)) throw Error('Invalid island cell');
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
