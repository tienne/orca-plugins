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
  const owned = new Map<string, number>();
  const placed = new Map<string, number>();
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
    owned.set(r.landmark, (owned.get(r.landmark) ?? 0) + 1);
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
    placed.set(p.landmark, (placed.get(p.landmark) ?? 0) + 1);
    if (placed.get(p.landmark)! > (owned.get(p.landmark) ?? 0))
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
    tickets: tickets.map(({ workspaceId, at }) => ({ workspaceId, at })),
    receipts: s.receipts.map(({ workspaceId, landmark, at }) => ({
      workspaceId,
      landmark,
      at,
    })),
    placements: s.placements.map(({ landmark, cell }) => ({ landmark, cell })),
  });
}
export const MAX_BACKUP_BYTES = 256 * 1024;
export function encodeBackup(state: State): string {
  const text = JSON.stringify(
    {
      format: 'landmark-island-backup',
      version: 1,
      exportedAt: new Date().toISOString(),
      state: validate(state),
    },
    null,
    2,
  );
  if (new TextEncoder().encode(text).length > MAX_BACKUP_BYTES)
    throw Error('Backup exceeds the 256 KiB file limit. Nothing was changed.');
  return text;
}
export function decodeBackup(text: unknown): {
  state: State;
  exportedAt: string;
} {
  if (
    typeof text !== 'string' ||
    new TextEncoder().encode(text).length > MAX_BACKUP_BYTES
  )
    throw Error('Choose a Landmark Island backup of at most 256 KiB.');
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw Error('This file is not valid JSON.');
  }
  if (
    !data ||
    data.format !== 'landmark-island-backup' ||
    data.version !== 1 ||
    typeof data.exportedAt !== 'string' ||
    !Number.isFinite(Date.parse(data.exportedAt)) ||
    !data.state ||
    typeof data.state !== 'object'
  )
    throw Error('Unsupported or damaged Landmark Island backup.');
  return { state: validate(data.state), exportedAt: data.exportedAt };
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
  readBackup?(): Promise<unknown>;
  writeBackup?(state: State): Promise<void>;
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
  exportBackup(previous = false) {
    return this.queue(async (s) => {
      if (!previous) return encodeBackup(s);
      const old = await this.store.readBackup?.();
      if (old == null) throw Error('No pre-restore backup is available yet.');
      return encodeBackup(validate(old));
    });
  }
  restore(input: unknown) {
    return this.queue(async (s) => {
      const data = input as { text?: unknown; expected?: unknown } | null;
      const next = decodeBackup(data?.text).state;
      // Response-loss retries must not overwrite the pre-restore copy.
      if (JSON.stringify(next) === JSON.stringify(s)) return s;
      if (
        !data?.expected ||
        JSON.stringify(validate(data.expected)) !== JSON.stringify(s)
      )
        throw Error(
          'Your island changed. Close Backups and review the file again before restoring.',
        );
      if (!this.store.writeBackup)
        throw Error('Recovery storage is unavailable. Nothing was changed.');
      await this.store.writeBackup(s);
      await this.store.write(next);
      return next;
    });
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
