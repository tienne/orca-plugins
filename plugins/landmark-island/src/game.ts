import landmarks from './landmarks.json';
import { isLand, expansionLevel, landAtLevel } from './world';
import {
  decorationById,
  DUPLICATE_MATERIALS,
  isFloor,
  canRotate,
} from './decorations';
export { landmarks };
export const weights = { common: 70, rare: 23, epic: 6, legendary: 1 };
export type Placement = { landmark: string; cell: number };
export type Receipt = { workspaceId: string; landmark: string; at: string };
export type Ticket = { workspaceId: string; at: string };
export type State = {
  version: 4;
  floors: { decoration: string; cell: number }[];
  landFloor: number;
  crafts: { id: string; decoration: string }[];
  decorations: { decoration: string; cell: number; rotation?: number }[];
  tickets: Ticket[];
  receipts: Receipt[];
  placements: Placement[];
};
export const empty = (): State => ({
  version: 4,
  floors: [],
  landFloor: 0,
  crafts: [],
  decorations: [],
  tickets: [],
  receipts: [],
  placements: [],
});
export function quantity(s: State, id: string) {
  return s.receipts.filter((r) => r.landmark === id).length;
}
export function islandLevel(s: State) {
  return Math.max(s.landFloor, new Set(s.receipts.map((r) => r.landmark)).size);
}
export function islandLand(s: State) {
  return landAtLevel(islandLevel(s));
}
export function unlockedCell(s: State, cell: number) {
  return (
    isLand(cell) && (expansionLevel.get(cell) ?? Infinity) <= islandLevel(s)
  );
}
export function materials(s: State) {
  return (
    (s.receipts.length - new Set(s.receipts.map((r) => r.landmark)).size) *
      DUPLICATE_MATERIALS -
    s.crafts.reduce((sum, c) => sum + decorationById(c.decoration)!.cost, 0)
  );
}
export function decorationQuantity(s: State, id: string) {
  const d = decorationById(id);
  if (!d) return 0;
  if (!d.landmark) return Infinity;
  return (
    (d.gift && quantity(s, d.landmark) > 0 ? 1 : 0) +
    s.crafts.filter((c) => c.decoration === id).length
  );
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
    (version !== 1 && version !== 2 && version !== 3 && version !== 4) ||
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
  const landFloor =
    version === 3 || version === 4
      ? s.landFloor
      : Math.max(
          0,
          ...s.placements.map((p) => expansionLevel.get(p.cell) ?? 0),
        );
  const crafts = version === 3 || version === 4 ? s.crafts : [];
  const oldDecor = version === 3 || version === 4 ? s.decorations : [];
  if (!Array.isArray(oldDecor)) throw Error('Invalid decoration placements');
  const floors =
    version === 4
      ? s.floors
      : oldDecor.filter((p) => p && isFloor(p.decoration));
  const decor =
    version === 4
      ? oldDecor
      : oldDecor.filter((p) => !p || !isFloor(p.decoration));
  if (
    !Number.isInteger(landFloor) ||
    landFloor < 0 ||
    landFloor > 12 ||
    !Array.isArray(crafts) ||
    !Array.isArray(decor) ||
    !Array.isArray(floors)
  )
    throw Error('Invalid island progression');
  const craftIds = new Set<string>();
  for (const c of crafts) {
    const d = c && decorationById(c.decoration);
    if (
      !d?.landmark ||
      !owned.has(d.landmark) ||
      typeof c.id !== 'string' ||
      !c.id ||
      c.id.length > 128 ||
      craftIds.has(c.id)
    )
      throw Error('Invalid crafting ledger');
    craftIds.add(c.id);
  }
  const next: State = { ...s, landFloor, crafts, decorations: decor, floors };
  if (materials(next) < 0) throw Error('Not enough materials');
  for (const p of s.placements)
    if (!unlockedCell(next, p.cell)) throw Error('Land is not unlocked');
  const usedDecor = new Map<string, number>();
  for (const p of decor) {
    if (
      !p ||
      !decorationById(p.decoration) ||
      isFloor(p.decoration) ||
      (p.rotation !== undefined &&
        (!canRotate(p.decoration) ||
          !Number.isInteger(p.rotation) ||
          p.rotation < 0 ||
          p.rotation > 3)) ||
      !unlockedCell(next, p.cell) ||
      cells.has(p.cell)
    )
      throw Error('Invalid decoration placement');
    cells.add(p.cell);
    usedDecor.set(p.decoration, (usedDecor.get(p.decoration) ?? 0) + 1);
    if (usedDecor.get(p.decoration)! > decorationQuantity(next, p.decoration))
      throw Error('Decoration placement exceeds ownership');
  }
  const floorCells = new Set<number>();
  for (const p of floors) {
    if (
      !p ||
      !isFloor(p.decoration) ||
      !unlockedCell(next, p.cell) ||
      floorCells.has(p.cell)
    )
      throw Error('Invalid floor placement');
    floorCells.add(p.cell);
  }
  return structuredClone({
    version: 4,
    floors: floors.map(({ decoration, cell }) => ({ decoration, cell })),
    landFloor,
    crafts: crafts.map(({ id, decoration }) => ({ id, decoration })),
    decorations: decor.map(({ decoration, cell, rotation }) => ({
      decoration,
      cell,
      ...(rotation ? { rotation } : {}),
    })),
    tickets: tickets.map(({ workspaceId, at }) => ({ workspaceId, at })),
    receipts: s.receipts.map(({ workspaceId, landmark, at }) => ({
      workspaceId,
      landmark,
      at,
    })),
    placements: s.placements.map(({ landmark, cell }) => ({ landmark, cell })),
  });
}
export type Layout = Pick<State, 'placements' | 'decorations' | 'floors'>;
export function layout(s: State): Layout {
  return structuredClone({
    placements: s.placements,
    decorations: s.decorations,
    floors: s.floors,
  });
}
export function sameLayout(a: Layout, b: Layout) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function checkLayout(s: State, input: unknown) {
  const expected = (input as { expected?: Layout } | null)?.expected;
  if (expected !== undefined && !sameLayout(layout(s), expected))
    throw Error('Island layout changed. Refresh before editing again.');
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
    throw Error('Choose a Orcatopia backup of at most 256 KiB.');
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
    throw Error('Unsupported or damaged Orcatopia backup.');
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
  redeemMany(input: unknown) {
    return this.queue(async (s) => {
      const ids = (input as { ticketIds?: unknown } | null)?.ticketIds;
      if (
        !Array.isArray(ids) ||
        ids.length !== 10 ||
        ids.some((id) => typeof id !== 'string' || !id || id.length > 256) ||
        new Set(ids).size !== 10
      )
        throw Error('Choose 10 different exploration tickets.');
      // Check the whole request before drawing anything. Replayed IDs retain
      // their original rewards, including after a restart or overlapping draw.
      if (ids.some((id) => !s.tickets.some((t) => t.workspaceId === id)))
        throw Error('One or more tickets are not available.');
      const unused = ids.filter(
        (id) => !s.receipts.some((r) => r.workspaceId === id),
      );
      if (!unused.length) return s;
      const at = new Date().toISOString();
      for (const workspaceId of unused)
        s.receipts.push({ workspaceId, landmark: draw(this.random), at });
      // One durable write: a failed save cannot consume only part of the batch.
      await this.store.write(s);
      return s;
    });
  }
  craft(input: unknown) {
    return this.queue(async (s) => {
      const p = input as { id?: unknown; decoration?: unknown } | null;
      if (
        typeof p?.id !== 'string' ||
        !p.id ||
        p.id.length > 128 ||
        typeof p.decoration !== 'string'
      )
        throw Error('Invalid craft request');
      const prior = s.crafts.find((c) => c.id === p.id);
      if (prior) {
        if (prior.decoration !== p.decoration)
          throw Error('Craft request was already used');
        return s;
      }
      s.crafts.push({ id: p.id, decoration: p.decoration });
      const next = validate(s);
      await this.store.write(next);
      return next;
    });
  }
  replaceLayout(input: unknown) {
    return this.queue(async (s) => {
      const p = input as { expected?: Layout; layout?: Layout } | null;
      if (!p?.layout || !p.expected) throw Error('Invalid layout request');
      // Only layout fields can be replaced. New discoveries and crafts stay intact.
      const next = validate({
        ...s,
        placements: p.layout.placements,
        decorations: p.layout.decorations,
        floors: p.layout.floors,
      });
      if (sameLayout(layout(s), layout(next))) return s;
      if (!sameLayout(layout(s), p.expected))
        throw Error('Island layout changed. Refresh before editing again.');
      await this.store.write(next);
      return next;
    });
  }
  rotate(input: unknown) {
    return this.queue(async (s) => {
      checkLayout(s, input);
      const p = input as { cell?: number; rotation?: number } | null;
      const item = s.decorations.find((d) => d.cell === p?.cell);
      if (
        !item ||
        !canRotate(item.decoration) ||
        !Number.isInteger(p?.rotation) ||
        p!.rotation! < 0 ||
        p!.rotation! > 3
      )
        throw Error('Choose a bench or gate and a valid direction');
      item.rotation = p!.rotation;
      const next = validate(s);
      await this.store.write(next);
      return next;
    });
  }
  paint(input: unknown) {
    return this.queue(async (s) => {
      const p = input as {
        decoration?: string;
        cells?: number[];
        expected?: Layout;
      } | null;
      const d = p && decorationById(p.decoration!);
      if (
        !d ||
        (!isFloor(d.id) && d.shape !== 'flowers') ||
        !Array.isArray(p?.cells) ||
        !p.cells.length ||
        p.cells.length > 318 ||
        new Set(p.cells).size !== p.cells.length ||
        p.cells.some((cell) => !unlockedCell(s, cell))
      )
        throw Error('Invalid brush stroke');
      if (!p.expected || !sameLayout(layout(s), p.expected))
        throw Error('Island layout changed. Try the stroke again.');
      for (const cell of p.cells) {
        if (isFloor(d.id)) {
          s.floors = s.floors.filter((f) => f.cell !== cell);
          s.floors.push({ cell, decoration: d.id });
        } else {
          if (
            s.placements.some((x) => x.cell === cell) ||
            s.decorations.some((x) => x.cell === cell)
          )
            throw Error('Brush requires empty object cells');
          s.decorations.push({ cell, decoration: d.id });
        }
      }
      const next = validate(s); // entire stroke succeeds or no cells change
      await this.store.write(next);
      return next;
    });
  }
  decorate(input: unknown) {
    return this.queue(async (s) => {
      checkLayout(s, input);
      const p = input as {
        cell: number;
        decoration?: string;
        from?: number;
        layer?: string;
        rotation?: number;
      } | null;
      if (!p || !unlockedCell(s, p.cell)) throw Error('Land is not unlocked');
      if (p.layer !== undefined && p.layer !== 'floor' && p.layer !== 'objects')
        throw Error('Invalid editing layer');
      const floor =
        p.layer === 'floor' ||
        (p.decoration !== undefined && isFloor(p.decoration));
      if (floor) {
        if (p.decoration !== undefined && !isFloor(p.decoration))
          throw Error('Choose a floor');
        if (p.from !== undefined) {
          const old = s.floors.find((f) => f.cell === p.from);
          if (
            !old ||
            p.from === p.cell ||
            s.floors.some((f) => f.cell === p.cell)
          )
            throw Error('Move requires an empty floor');
          old.cell = p.cell;
        } else {
          s.floors = s.floors.filter((f) => f.cell !== p.cell);
          if (p.decoration !== undefined)
            s.floors.push({ cell: p.cell, decoration: p.decoration });
        }
      } else {
        if (s.placements.some((x) => x.cell === p.cell))
          throw Error('Cell is occupied by a landmark');
        if (p.from !== undefined) {
          if (!Number.isInteger(p.from) || p.from === p.cell)
            throw Error('Choose another cell');
          const old = s.decorations.find((x) => x.cell === p.from);
          if (!old || s.decorations.some((x) => x.cell === p.cell))
            throw Error('Move requires an empty destination');
          old.cell = p.cell;
        } else {
          if (
            p.decoration !== undefined &&
            s.decorations.some((x) => x.cell === p.cell)
          )
            throw Error('Choose an empty cell');
          s.decorations = s.decorations.filter((x) => x.cell !== p.cell);
          if (p.decoration !== undefined)
            s.decorations.push({
              cell: p.cell,
              decoration: p.decoration,
              ...(p.rotation ? { rotation: p.rotation } : {}),
            });
        }
      }
      const next = validate(s);
      await this.store.write(next);
      return next;
    });
  }
  place(input: unknown) {
    return this.queue(async (s) => {
      checkLayout(s, input);
      const p = input as { cell: number; landmark?: string; from?: number };
      if (!p || !unlockedCell(s, p.cell)) throw Error('Land is not unlocked');
      if (s.decorations.some((d) => d.cell === p.cell))
        throw Error('Cell is occupied by a decoration');
      if (p.from !== undefined) {
        if (!Number.isInteger(p.from) || p.from === p.cell)
          throw Error('Choose another cell');
        const old = s.placements.find((x) => x.cell === p.from);
        if (!old || s.placements.some((x) => x.cell === p.cell))
          throw Error('Move requires an empty destination');
        old.cell = p.cell;
      } else {
        if (
          p.landmark !== undefined &&
          s.placements.some((x) => x.cell === p.cell)
        )
          throw Error('Choose an empty cell');
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
