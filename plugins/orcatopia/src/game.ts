import {
  TOURISM,
  specialBuilding,
  startTourism,
  settleTourism,
  tourismRate,
  validateTourism,
  type Tourism,
} from './tourism';
import { waterTheme } from './water-themes';
import { allowsSea, allowsRiver, isWorldCell } from './placement';
import landmarks from './landmarks.json';
import {
  landmarkById,
  baseId,
  enhancedId,
  isEnhanced,
} from './landmark-variants';
import { isLand, expansionLevel, landAtLevel, MAX_LAND_LEVEL } from './world';
import {
  decorationById,
  DUPLICATE_MATERIALS,
  isFloor,
  canRotate,
} from './decorations';
export { landmarks };
export const weights = { common: 70, rare: 23, epic: 6, legendary: 1 };
export type Placement = { landmark: string; cell: number; rotation?: number };
export type Receipt = { workspaceId: string; landmark: string; at: string };
export type Ticket = { workspaceId: string; at: string };
export type CollectionTheme = 'river' | 'sea';
export const collectionThresholds = { river: 12, sea: 25 } as const;
export type State = {
  version: 8;
  tourism: Tourism | null;
  discoveredPlaces: string[];
  firstExplorations: { theme: CollectionTheme; ticketId?: string }[];
  fusions: {
    id: string;
    landmark: string;
    at: string;
    from?: number;
    cell?: number;
  }[];
  floors: { decoration: string; cell: number }[];
  landFloor: number;
  crafts: { id: string; decoration: string }[];
  decorations: { decoration: string; cell: number; rotation?: number }[];
  tickets: Ticket[];
  receipts: Receipt[];
  placements: Placement[];
};
export const empty = (): State => ({
  version: 8,
  tourism: null,
  discoveredPlaces: [],
  firstExplorations: [],
  fusions: [],
  floors: [],
  landFloor: 0,
  crafts: [],
  decorations: [],
  tickets: [],
  receipts: [],
  placements: [],
});
export function quantity(s: State, id: string) {
  const fused = s.fusions.filter((f) => f.landmark === baseId(id)).length;
  return isEnhanced(id)
    ? fused
    : s.receipts.filter((r) => r.landmark === id).length - fused * 2;
}
export function discovered(s: State, id: string) {
  return isEnhanced(id)
    ? s.fusions.some((f) => enhancedId(f.landmark) === id)
    : s.receipts.some((r) => r.landmark === id);
}
/** 중복과 + 합성은 원래 장소 하나로 세며 복원 전 발견도 유지한다. */
export function collectionDiscoveries(s: State) {
  return [
    ...new Set([
      ...s.discoveredPlaces,
      ...s.receipts.map((r) => baseId(r.landmark)),
    ]),
  ];
}
/** 해안형은 배치 호환성과 별개로 바다 수집에 묶는다. */
export function collectionTheme(id: string): CollectionTheme | 'land' {
  const placement = waterTheme(id)?.placement;
  return placement === 'coastal' ? 'sea' : (placement ?? 'land');
}
/** 해금은 보유 수량 대신 누적 발견 이력에서 계산한다. */
export function collectionUnlocked(s: State, theme: CollectionTheme) {
  return collectionDiscoveries(s).length >= collectionThresholds[theme];
}
/** 일반 추첨과 독립적으로 테마별 소비 기록을 확인한다. */
export function firstExplorationAvailable(s: State, theme: CollectionTheme) {
  return (
    collectionUnlocked(s, theme) &&
    !s.firstExplorations.some((e) => e.theme === theme)
  );
}
export function islandLevel(s: State) {
  return Math.max(s.landFloor, collectionDiscoveries(s).length);
}
export function islandLand(s: State) {
  const reserved = new Set(
    s.decorations
      .filter((p) => decorationById(p.decoration)?.surface === 'sea')
      .map((p) => p.cell),
  );
  return landAtLevel(islandLevel(s)).filter((t) => !reserved.has(t.id));
}
export function unlockedCell(s: State, cell: number) {
  return (
    isLand(cell) &&
    (expansionLevel.get(cell) ?? Infinity) <= islandLevel(s) &&
    !s.decorations.some(
      (p) => p.cell === cell && decorationById(p.decoration)?.surface === 'sea',
    )
  );
}
/** 현재 배치 가능한 표면. 섬 확장 후에도 해상 장식 아래의 물은 유지한다. */
export function surfaceAt(
  s: State,
  cell: number,
): 'land' | 'sea' | 'river' | undefined {
  if (!isWorldCell(cell)) return undefined;
  return !unlockedCell(s, cell)
    ? 'sea'
    : s.floors.some((p) => p.cell === cell && p.decoration === 'river')
      ? 'river'
      : 'land';
}
/** 새 랜드마크 배치 시 바다와 강을 혼용하지 않는다. */
export function canPlaceLandmark(s: State, id: string, cell: number) {
  const surface = surfaceAt(s, cell);
  return (
    surface === 'land' ||
    (surface === 'sea' && allowsSea(id)) ||
    (surface === 'river' && allowsRiver(id))
  );
}
/** 물 전용 장식은 해당 물 영역에서만 배치하고 보관한다. */
export function canPlaceDecoration(s: State, id: string, cell: number) {
  const decoration = decorationById(id);
  const surface = surfaceAt(s, cell);
  return Boolean(
    decoration &&
    surface &&
    (specialBuilding(id)
      ? surface === 'land'
      : decoration.surface
        ? surface === decoration.surface
        : surface !== 'sea'),
  );
}
/** 같은 일반판의 배치 쌍만 후보로 삼고, 확정 시 워커에서 다시 검증한다. */
export function placedFusionLandmark(s: State, from: number, cell: number) {
  if (!isWorldCell(from) || !isWorldCell(cell) || from === cell)
    return undefined;
  const source = s.placements.find((p) => p.cell === from);
  const target = s.placements.find((p) => p.cell === cell);
  return source &&
    target &&
    source.landmark === target.landmark &&
    !isEnhanced(source.landmark)
    ? source.landmark
    : undefined;
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
  if (specialBuilding(id)) return s.tourism?.buildings.includes(id) ? 1 : 0;
  if (!d.landmark) return Infinity;
  return (
    (d.gift && discovered(s, d.landmark) ? 1 : 0) +
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
    (version !== 1 &&
      version !== 2 &&
      version !== 3 &&
      version !== 4 &&
      version !== 5 &&
      version !== 6 &&
      version !== 7 &&
      version !== 8) ||
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
  const fusions = version >= 6 ? s.fusions : [];
  if (!Array.isArray(fusions)) throw Error('Invalid fusion ledger');
  const fusionIds = new Set<string>();
  const fusedCounts = new Map<string, number>();
  for (const f of fusions) {
    if (
      !f ||
      typeof f.id !== 'string' ||
      !f.id ||
      f.id.length > 128 ||
      fusionIds.has(f.id) ||
      !landmarks.some((l) => l.id === f.landmark) ||
      typeof f.at !== 'string' ||
      !Number.isFinite(Date.parse(f.at)) ||
      ((f.from !== undefined || f.cell !== undefined) &&
        (!isWorldCell(f.from!) || !isWorldCell(f.cell!) || f.from === f.cell))
    )
      throw Error('Invalid fusion ledger');
    fusionIds.add(f.id);
    fusedCounts.set(f.landmark, (fusedCounts.get(f.landmark) ?? 0) + 1);
    if (fusedCounts.get(f.landmark)! * 2 > (owned.get(f.landmark) ?? 0))
      throw Error('Fusion exceeds ownership');
  }
  const tourism = version >= 8 ? validateTourism(s.tourism) : null;
  const discoveredPlaces = version >= 7 ? s.discoveredPlaces : [];
  const firstExplorations = version >= 7 ? s.firstExplorations : [];
  if (
    !Array.isArray(discoveredPlaces) ||
    discoveredPlaces.some((id) => !landmarks.some((l) => l.id === id)) ||
    new Set(discoveredPlaces).size !== discoveredPlaces.length
  )
    throw Error('Invalid collection discovery ledger');
  if (
    !Array.isArray(firstExplorations) ||
    firstExplorations.length > 2 ||
    new Set(firstExplorations.map((e) => e?.theme)).size !==
      firstExplorations.length ||
    new Set(
      firstExplorations.flatMap((e) =>
        e?.ticketId === undefined ? [] : [e.ticketId],
      ),
    ).size !==
      firstExplorations.filter((e) => e?.ticketId !== undefined).length ||
    firstExplorations.some(
      (e) =>
        !e ||
        !['river', 'sea'].includes(e.theme) ||
        (e.ticketId !== undefined &&
          (typeof e.ticketId !== 'string' ||
            !e.ticketId ||
            e.ticketId.length > 256)),
    )
  )
    throw Error('Invalid first exploration ledger');
  const history = [
    ...new Set([...discoveredPlaces, ...s.receipts.map((r) => r.landmark)]),
  ].sort();
  for (const e of firstExplorations) {
    const reward = s.receipts.find((r) => r.workspaceId === e.ticketId);
    if (
      history.length < collectionThresholds[e.theme] ||
      (reward && collectionTheme(reward.landmark) !== e.theme)
    )
      throw Error('Invalid first exploration ledger');
  }
  const inventory: State = {
    ...s,
    fusions,
    tourism,
    discoveredPlaces: history,
    firstExplorations,
  };
  for (const p of s.placements) {
    if (
      !p ||
      (!isLand(p.cell) && !(isWorldCell(p.cell) && allowsSea(p.landmark))) ||
      cells.has(p.cell) ||
      !landmarkById(p.landmark) ||
      (p.rotation !== undefined && p.rotation !== 0 && p.rotation !== 1)
    )
      throw Error('Invalid placement');
    cells.add(p.cell);
    placed.set(p.landmark, (placed.get(p.landmark) ?? 0) + 1);
    if (placed.get(p.landmark)! > quantity(inventory, p.landmark))
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
    version >= 3
      ? s.landFloor
      : Math.max(
          0,
          ...s.placements.map((p) => expansionLevel.get(p.cell) ?? 0),
        );
  const crafts = version >= 3 ? s.crafts : [];
  const oldDecor = version >= 3 ? s.decorations : [];
  if (!Array.isArray(oldDecor)) throw Error('Invalid decoration placements');
  const floors =
    version >= 4
      ? s.floors
      : oldDecor.filter((p) => p && isFloor(p.decoration));
  const decor =
    version >= 4
      ? oldDecor
      : oldDecor.filter((p) => !p || !isFloor(p.decoration));
  if (
    !Number.isInteger(landFloor) ||
    landFloor < 0 ||
    landFloor > MAX_LAND_LEVEL ||
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
      !discovered(inventory, d.landmark) ||
      typeof c.id !== 'string' ||
      !c.id ||
      c.id.length > 128 ||
      craftIds.has(c.id)
    )
      throw Error('Invalid crafting ledger');
    craftIds.add(c.id);
  }
  const next: State = {
    ...inventory,
    fusions,
    landFloor,
    crafts,
    decorations: decor,
    floors,
  };
  if (materials(next) < 0) throw Error('Not enough materials');
  for (const p of s.placements)
    if (
      !unlockedCell(next, p.cell) &&
      !(isWorldCell(p.cell) && allowsSea(p.landmark))
    )
      throw Error('Land is not unlocked');
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
      !canPlaceDecoration(next, p.decoration, p.cell) ||
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
    version: 8,
    tourism,
    discoveredPlaces: history,
    firstExplorations: firstExplorations
      .map(({ theme, ticketId }) => ({
        theme,
        ...(ticketId !== undefined ? { ticketId } : {}),
      }))
      .sort(
        (a, b) => collectionThresholds[a.theme] - collectionThresholds[b.theme],
      ),
    fusions: fusions.map(({ id, landmark, at, from, cell }) => ({
      id,
      landmark,
      at,
      ...(from !== undefined ? { from, cell } : {}),
    })),
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
    placements: s.placements.map(({ landmark, cell, rotation }) => ({
      landmark,
      cell,
      ...(rotation ? { rotation } : {}),
    })),
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
export function draw(
  random: () => number,
  state?: State,
  theme?: CollectionTheme,
): string {
  const progress = state ? collectionDiscoveries(state).length : Infinity;
  const candidates = landmarks.filter((l) => {
    const candidateTheme = collectionTheme(l.id);
    return theme
      ? candidateTheme === theme
      : candidateTheme === 'land' ||
          progress >= collectionThresholds[candidateTheme];
  });
  const tiers = Object.entries(weights).filter(
    ([tier]) => !theme || candidates.some((l) => l.tier === tier),
  );
  const total = tiers.reduce((sum, [, weight]) => sum + weight, 0);
  const roll = random() * total;
  let cumulative = 0;
  for (const [tier, weight] of tiers) {
    cumulative += weight;
    if (roll < cumulative) {
      const pool = candidates.filter((l) => l.tier === tier);
      if (!pool.length) throw Error('No landmarks available for this tier.');
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
  private pendingState?: State;
  // 정산과 변경을 한 번에 저장하도록 커밋은 queue 끝에서만 한다.
  private stage(state: State) {
    this.pendingState = state;
  }
  private tail: Promise<unknown> = Promise.resolve();
  constructor(
    private store: Store,
    private random = Math.random,
    private now = Date.now,
  ) {}
  private queue<T>(action: (s: State) => Promise<T>, settle = true) {
    const result = this.tail.then(async () => {
      this.pendingState = undefined;
      const state = validate(await this.store.read());
      let tourismChanged = false;
      if (settle) {
        const now = this.now();
        if (!Number.isSafeInteger(now) || now < 0)
          throw Error('Invalid tourism clock');
        const tourism = state.tourism
          ? settleTourism(state.tourism, tourismRate(state), now)
          : startTourism(now);
        if (JSON.stringify(tourism) !== JSON.stringify(state.tourism)) {
          state.tourism = tourism;
          tourismChanged = true;
        }
      }
      const output = await action(state);
      if (this.pendingState || tourismChanged)
        await this.store.write(this.pendingState ?? state);
      return output;
    });
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
    }, !previous);
  }
  restore(input: unknown) {
    return this.queue(async (s) => {
      const data = input as { text?: unknown; expected?: unknown } | null;
      const next = decodeBackup(data?.text).state;
      next.discoveredPlaces = [
        ...new Set([
          ...collectionDiscoveries(next),
          ...collectionDiscoveries(s),
        ]),
      ].sort();
      next.firstExplorations = (['river', 'sea'] as const).flatMap((theme) => {
        const spent =
          next.firstExplorations.find((e) => e.theme === theme) ??
          s.firstExplorations.find((e) => e.theme === theme);
        if (!spent) return [];
        // 분기 백업의 같은 탐험권이 다른 보상에 쓰였어도 소비 사실은 남긴다.
        const reward = next.receipts.find(
          (r) =>
            r.workspaceId === spent.ticketId &&
            collectionTheme(r.landmark) === theme,
        );
        return [{ theme, ...(reward ? { ticketId: spent.ticketId } : {}) }];
      });
      const content = (state: State) =>
        JSON.stringify({
          ...state,
          tourism: {
            coins: state.tourism?.coins ?? 0,
            buildings: state.tourism?.buildings ?? [],
          },
        });
      // 복원은 잔액을 교체하며 과거 기준시각을 가져오지 않는다. 응답 유실 재시도는 무변경이다.
      if (content(next) === content(s)) return s;
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
      const now = this.now();
      if (!Number.isSafeInteger(now) || now < 0)
        throw Error('Invalid tourism clock');
      next.tourism = next.tourism
        ? { ...next.tourism, settledAt: now, remainder: 0, away: null }
        : startTourism(now);
      const restored = validate(next);
      this.stage(restored);
      return restored;
    }, false);
  }
  construct(input: unknown) {
    return this.queue(async (s) => {
      const p = input as {
        building?: string;
        cell?: number;
        expected?: Layout;
      } | null;
      const building = p && specialBuilding(p.building!);
      if (!building || !Number.isInteger(p?.cell))
        throw Error('Choose a special building and an empty land cell.');
      // 영구 소유권으로 재시도를 식별해 회수 후에도 재과금·자동 재배치하지 않는다.
      if (s.tourism!.buildings.includes(building.id)) return s;
      checkLayout(s, input);
      if (
        !canPlaceDecoration(s, building.id, p!.cell!) ||
        s.placements.some((x) => x.cell === p!.cell) ||
        s.decorations.some((x) => x.cell === p!.cell)
      )
        throw Error('Choose an empty land cell for construction.');
      if (s.tourism!.coins < building.cost)
        throw Error('Not enough tourism coins.');
      s.tourism!.coins -= building.cost;
      s.tourism!.buildings.push(building.id);
      s.decorations.push({ decoration: building.id, cell: p!.cell! });
      const next = validate(s);
      this.stage(next);
      return next;
    });
  }
  acquire(event: { workspaceId: string; kind: string }) {
    if (event.kind !== 'worktree') return this.queue(async (s) => s, false);
    return this.queue(async (s) => {
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
      s.discoveredPlaces = collectionDiscoveries(s).sort();
      this.stage(s);
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
        landmark: draw(this.random, s),
        at: new Date().toISOString(),
      });
      s.discoveredPlaces = collectionDiscoveries(s).sort();
      this.stage(s);
      return s;
    });
  }
  exploreTheme(input: unknown) {
    return this.queue(async (s) => {
      const { theme, ticketId } = (input ?? {}) as {
        theme?: unknown;
        ticketId?: unknown;
      };
      if (
        (theme !== 'river' && theme !== 'sea') ||
        typeof ticketId !== 'string' ||
        !ticketId ||
        ticketId.length > 256
      )
        throw Error('Choose a valid first exploration and ticket.');
      const prior = s.firstExplorations.find((e) => e.theme === theme);
      if (
        prior?.ticketId === ticketId &&
        s.receipts.some(
          (r) =>
            r.workspaceId === ticketId && collectionTheme(r.landmark) === theme,
        )
      )
        return s;
      if (!firstExplorationAvailable(s, theme))
        throw Error('This first exploration is not available.');
      if (!availableTickets(s).some((t) => t.workspaceId === ticketId))
        throw Error('This ticket is not available');
      s.receipts.push({
        workspaceId: ticketId,
        landmark: draw(this.random, s, theme),
        at: new Date().toISOString(),
      });
      s.firstExplorations.push({ theme, ticketId });
      const next = validate(s);
      this.stage(next);
      return next;
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
        s.receipts.push({ workspaceId, landmark: draw(this.random, s), at });
      // One durable write: a failed save cannot consume only part of the batch.
      s.discoveredPlaces = collectionDiscoveries(s).sort();
      this.stage(s);
      return s;
    });
  }
  fuse(input: unknown) {
    return this.queue(async (s) => {
      const p = input as {
        id?: unknown;
        landmark?: unknown;
        from?: number;
        cell?: number;
        expected?: Layout;
      } | null;
      if (
        typeof p?.id !== 'string' ||
        !p.id ||
        p.id.length > 128 ||
        typeof p.landmark !== 'string' ||
        isEnhanced(p.landmark) ||
        !landmarkById(p.landmark)
      )
        throw Error('Choose a normal landmark and a valid fusion request.');
      const onIsland = p.from !== undefined || p.cell !== undefined;
      if (
        onIsland &&
        (!isWorldCell(p.from!) || !isWorldCell(p.cell!) || p.from === p.cell)
      )
        throw Error('Choose two different placed normal copies.');
      const prior = s.fusions.find((f) => f.id === p.id);
      if (prior) {
        if (
          prior.landmark !== p.landmark ||
          prior.from !== p.from ||
          prior.cell !== p.cell
        )
          throw Error('Fusion request was already used.');
        return s;
      }
      if (onIsland) {
        if (!p.expected || !sameLayout(layout(s), p.expected))
          throw Error('Island layout changed. Refresh before editing again.');
        if (placedFusionLandmark(s, p.from!, p.cell!) !== p.landmark)
          throw Error('Choose two placed copies of the same normal landmark.');
        const target = s.placements.find((item) => item.cell === p.cell)!;
        s.placements = s.placements.filter(
          (item) => item.cell !== p.from && item.cell !== p.cell,
        );
        s.placements.push({ ...target, landmark: enhancedId(p.landmark) });
      } else {
        const placed = s.placements.filter(
          (item) => item.landmark === p.landmark,
        ).length;
        if (quantity(s, p.landmark) - placed < 2)
          throw Error(
            'Fusion needs two unplaced normal copies. Return placed copies first.',
          );
      }
      s.fusions.push({
        id: p.id,
        landmark: p.landmark,
        at: new Date().toISOString(),
        ...(onIsland ? { from: p.from, cell: p.cell } : {}),
      });
      const next = validate(s);
      this.stage(next);
      return next;
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
      this.stage(next);
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
      this.stage(next);
      return next;
    });
  }
  rotate(input: unknown) {
    return this.queue(async (s) => {
      checkLayout(s, input);
      const p = input as { cell?: number; rotation?: number } | null;
      const item =
        s.placements.find((d) => d.cell === p?.cell) ??
        s.decorations.find((d) => d.cell === p?.cell);
      if (
        !item ||
        ('decoration' in item && !canRotate(item.decoration)) ||
        !Number.isInteger(p?.rotation) ||
        p!.rotation! < 0 ||
        p!.rotation! > ('landmark' in item ? 1 : 3)
      )
        throw Error(
          'Choose a piece that supports turning and a valid direction',
        );
      item.rotation = p!.rotation;
      const next = validate(s);
      this.stage(next);
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
        p.cells.length > islandLand(s).length ||
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
      this.stage(next);
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
      if (!p || !isWorldCell(p.cell)) throw Error('Land is not unlocked');
      if (p.layer !== undefined && p.layer !== 'floor' && p.layer !== 'objects')
        throw Error('Invalid editing layer');
      const floor =
        p.layer === 'floor' ||
        (p.decoration !== undefined && isFloor(p.decoration));
      if (floor) {
        if (!unlockedCell(s, p.cell)) throw Error('Land is not unlocked');
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
        const decoration =
          p.from !== undefined
            ? s.decorations.find((x) => x.cell === p.from)?.decoration
            : (p.decoration ??
              s.decorations.find((x) => x.cell === p.cell)?.decoration);
        if (
          decoration
            ? !canPlaceDecoration(s, decoration, p.cell)
            : !unlockedCell(s, p.cell)
        )
          throw Error('Choose the matching land, sea or river surface');
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
      this.stage(next);
      return next;
    });
  }
  place(input: unknown) {
    return this.queue(async (s) => {
      checkLayout(s, input);
      const p = input as { cell: number; landmark?: string; from?: number };
      const landmark =
        p?.from !== undefined
          ? s.placements.find((x) => x.cell === p.from)?.landmark
          : (p?.landmark ??
            s.placements.find((x) => x.cell === p?.cell)?.landmark);
      if (
        !p ||
        (p.landmark === undefined && p.from === undefined
          ? !unlockedCell(s, p.cell) &&
            !s.placements.some((x) => x.cell === p.cell)
          : !landmark || !canPlaceLandmark(s, landmark, p.cell))
      )
        throw Error('Land is not unlocked');
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
      s.discoveredPlaces = collectionDiscoveries(s).sort();
      this.stage(s);
      return s;
    });
  }
}
