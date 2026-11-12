export type ExpeditionState = 'working' | 'waiting' | 'blocked' | 'done';
export type Expedition = {
  id: string;
  name: string;
  run: string;
  state: ExpeditionState;
  startedAt: number;
  updatedAt: number;
  outcome: string;
  pending: boolean;
  welcomed: boolean;
};
export const EXPEDITION_LIMIT = 24;
const states = new Set(['working', 'waiting', 'blocked', 'done']);
const outcomes = new Set([
  'success',
  'failure',
  'cancellation',
  'superseded',
  'interruption',
  'unconfirmed',
]);

/** 생활 연출의 별도 저장값과 프레임 응답을 제한된 구조로 읽는다. */
export function readExpeditions(value: unknown): Expedition[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value
    .slice(0, EXPEDITION_LIMIT)
    .filter((item): item is Expedition => {
      if (!item || typeof item !== 'object') return false;
      const e = item as Expedition;
      if (
        typeof e.id !== 'string' ||
        !/^[a-zA-Z0-9-]{1,64}$/.test(e.id) ||
        seen.has(e.id) ||
        typeof e.run !== 'string' ||
        e.run !== `${e.id}:${e.startedAt}` ||
        !states.has(e.state) ||
        !Number.isSafeInteger(e.startedAt) ||
        e.startedAt < 0 ||
        !Number.isSafeInteger(e.updatedAt) ||
        e.updatedAt < e.startedAt ||
        !outcomes.has(e.outcome) ||
        typeof e.pending !== 'boolean' ||
        typeof e.welcomed !== 'boolean' ||
        (e.pending &&
          (e.state !== 'done' ||
            e.welcomed ||
            !['success', 'unconfirmed'].includes(e.outcome)))
      )
        return false;
      seen.add(e.id);
      return true;
    })
    .slice(0, EXPEDITION_LIMIT)
    .map((e) => ({
      id: e.id,
      name:
        typeof e.name === 'string'
          ? e.name.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 60)
          : '',
      run: e.run,
      state: e.state,
      startedAt: e.startedAt,
      updatedAt: e.updatedAt,
      outcome: e.outcome,
      pending: e.pending,
      welcomed: e.welcomed,
    }));
}

/** 실제로 관측한 작업만 귀환 후보로 만들고 오래된 상태는 버린다. */
export function observeExpedition(
  records: Expedition[],
  id: string,
  state: ExpeditionState,
  at: number,
  outcome = 'unconfirmed',
  name = '',
) {
  const prior = records.find((e) => e.id === id);
  if (prior && at <= prior.updatedAt) return records;
  if (!prior && state !== 'working') return records;
  const newRun = !prior || (prior.state === 'done' && state === 'working');
  const startedAt = newRun ? at : prior.startedAt;
  const resolved = outcomes.has(outcome) ? outcome : 'unconfirmed';
  const next: Expedition = {
    id,
    name:
      name
        .replace(/[\u0000-\u001f\u007f]/g, '')
        .trim()
        .slice(0, 60) ||
      prior?.name ||
      '',
    run: `${id}:${startedAt}`,
    state,
    startedAt,
    updatedAt: at,
    outcome: state === 'done' ? resolved : 'unconfirmed',
    pending:
      state === 'done' &&
      ['success', 'unconfirmed'].includes(resolved) &&
      !(!newRun && prior?.welcomed),
    welcomed: !newRun && Boolean(prior?.welcomed),
  };
  return [next, ...records.filter((e) => e.id !== id)].slice(
    0,
    EXPEDITION_LIMIT,
  );
}
