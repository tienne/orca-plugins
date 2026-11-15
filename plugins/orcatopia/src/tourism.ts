import { baseId, landmarkById } from './landmark-variants';

export const TOURISM = {
  minuteMs: 60_000,
  visitsPerPlacePerMinute: 1,
  coinsPerVisit: 1,
  offlineCapMs: 12 * 60 * 60_000,
  awaySummaryMs: 60_000,
  pollMs: 30_000,
  maxCoins: 1_000_000_000,
  maxVisitors: 6,
  visualPlacesPerVisitor: 2,
} as const;

export const specialBuildings = [
  {
    id: 'tourism-info',
    name: 'Tourist information',
    cost: 10,
    color: '#69a99a',
    activity: 'guide',
  },
  {
    id: 'tourism-cafe',
    name: 'Island café',
    cost: 60,
    color: '#d2a078',
    activity: 'drink',
  },
  {
    id: 'tourism-shop',
    name: 'Souvenir shop',
    cost: 180,
    color: '#c58a9e',
    activity: 'shop',
  },
  {
    id: 'tourism-lookout',
    name: 'Scenic lookout',
    cost: 360,
    color: '#829fc0',
    activity: 'photo',
  },
] as const;
/** 관광 건물의 가격과 장면 정의를 조회한다. */
export const specialBuilding = (id: string) =>
  specialBuildings.find((b) => b.id === id);
export type Tourism = {
  coins: number;
  settledAt: number;
  remainder: number;
  buildings: string[];
  away: {
    at: number;
    elapsedMs: number;
    coins: number;
    visitors: number;
    capped: boolean;
  } | null;
};

/** 일반/+와 같은 장소의 중복 배치를 하나로 센다. */
export function tourismRate(state: { placements: { landmark: string }[] }) {
  return (
    new Set(
      state.placements
        .filter((p) => landmarkById(p.landmark))
        .map((p) => baseId(p.landmark)),
    ).size * TOURISM.visitsPerPlacePerMinute
  );
}

/** 소급 지급 없이 관광을 시작한다. 기준시각과 잔액은 항상 함께 저장한다. */
export function startTourism(now: number): Tourism {
  return { coins: 0, settledAt: now, remainder: 0, buildings: [], away: null };
}

/** 저장된 시간 구간만 정산하며 역행 중에는 기존 기준시각을 유지한다. */
export function settleTourism(
  tourism: Tourism,
  rate: number,
  now: number,
): Tourism {
  const elapsed = Math.max(0, now - tourism.settledAt);
  const creditedMs = Math.min(elapsed, TOURISM.offlineCapMs);
  const units = creditedMs * rate + tourism.remainder;
  const visitors = Math.floor(units / TOURISM.minuteMs);
  const coins = Math.min(
    TOURISM.maxCoins - tourism.coins,
    visitors * TOURISM.coinsPerVisit,
  );
  return {
    ...tourism,
    coins: tourism.coins + coins,
    settledAt: Math.max(now, tourism.settledAt),
    remainder: units % TOURISM.minuteMs,
    away:
      elapsed >= TOURISM.awaySummaryMs
        ? {
            at: now,
            elapsedMs: creditedMs,
            coins,
            visitors,
            capped: elapsed > creditedMs,
          }
        : tourism.away,
  };
}

/** 손상된 관광 저장은 거부하며 잔액과 건물을 임의로 초기화하지 않는다. */
export function validateTourism(value: unknown): Tourism | null {
  if (value === null) return null;
  const t = value as Tourism;
  const integer = (n: unknown) => Number.isSafeInteger(n) && (n as number) >= 0;
  if (
    !t ||
    !integer(t.coins) ||
    t.coins > TOURISM.maxCoins ||
    !integer(t.settledAt) ||
    !integer(t.remainder) ||
    t.remainder >= TOURISM.minuteMs ||
    !Array.isArray(t.buildings) ||
    new Set(t.buildings).size !== t.buildings.length ||
    t.buildings.some((id) => !specialBuilding(id)) ||
    (t.away !== null &&
      (!t.away ||
        !integer(t.away.at) ||
        !integer(t.away.elapsedMs) ||
        t.away.elapsedMs > TOURISM.offlineCapMs ||
        !integer(t.away.coins) ||
        !integer(t.away.visitors) ||
        typeof t.away.capped !== 'boolean'))
  )
    throw Error('Invalid tourism ledger. Save was not overwritten.');
  return structuredClone({
    coins: t.coins,
    settledAt: t.settledAt,
    remainder: t.remainder,
    buildings: t.buildings,
    away: t.away,
  });
}
