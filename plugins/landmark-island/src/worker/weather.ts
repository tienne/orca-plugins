import {
  WEATHER_HOUR,
  timezoneLocation,
  validWeather,
  weatherKind,
  type WeatherKind,
  type WeatherReport,
} from '../weather';

type Cache = {
  weather: WeatherKind | null;
  updatedAt: number | null;
  attemptedAt: number;
  failed: boolean;
};
type Store = {
  read(key: string): Promise<unknown>;
  write(key: string, value: Cache): Promise<void>;
};

// Only this trusted worker contacts the fixed provider. No arbitrary URLs,
// coordinates, headers, user identifiers or repository data come from a frame.
export async function fetchWeather(
  location: NonNullable<ReturnType<typeof timezoneLocation>>,
): Promise<WeatherKind> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.search = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: 'weather_code',
    forecast_days: '1',
    timeformat: 'unixtime',
  }).toString();
  const response = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    redirect: 'error',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok || !response.body) throw new Error('Weather unavailable');
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 32768) throw new Error('Weather response too large');
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const data = JSON.parse(new TextDecoder().decode(bytes));
  const weather = weatherKind(data?.current?.weather_code);
  if (data?.error || weather === null)
    throw new Error('Invalid weather response');
  return weather;
}
function validCache(value: unknown): value is Cache {
  if (!value || typeof value !== 'object') return false;
  const c = value as Cache;
  return (
    Number.isFinite(c.attemptedAt) &&
    c.attemptedAt >= 0 &&
    typeof c.failed === 'boolean' &&
    ((c.weather === null && c.updatedAt === null && c.failed) ||
      (validWeather(c.weather) &&
        Number.isFinite(c.updatedAt) &&
        Number(c.updatedAt) >= 0 &&
        Number(c.updatedAt) <= c.attemptedAt))
  );
}
export class WeatherService {
  private memory = new Map<string, Cache>();
  private pending = new Map<string, Promise<Cache>>();
  constructor(
    private store: Store,
    private fetcher = fetchWeather,
    private now = Date.now,
  ) {}
  async read(input: unknown): Promise<WeatherReport> {
    const timezone = (input as { timezone?: unknown } | null)?.timezone;
    if (typeof timezone !== 'string' || timezone.length > 100)
      throw new Error('Invalid timezone');
    const location = timezoneLocation(timezone);
    if (!location)
      return {
        timezone,
        weather: null,
        updatedAt: null,
        status: 'unsupported',
        nextCheckAt: this.now() + WEATHER_HOUR,
      };
    const key = `weather-v1:${location.zone}`;
    let task = this.pending.get(key);
    if (!task) {
      task = this.load(key, location);
      this.pending.set(key, task);
    }
    let c: Cache;
    try {
      c = await task;
    } finally {
      if (this.pending.get(key) === task) this.pending.delete(key);
    }
    return {
      timezone,
      weather: c.weather,
      updatedAt: c.updatedAt,
      nextCheckAt: c.attemptedAt + WEATHER_HOUR,
      status: c.weather === null ? 'unavailable' : c.failed ? 'stale' : 'fresh',
    };
  }
  private async load(
    key: string,
    location: NonNullable<ReturnType<typeof timezoneLocation>>,
  ): Promise<Cache> {
    let c = this.memory.get(key);
    if (!c) {
      try {
        const stored = await this.store.read(key);
        if (validCache(stored)) c = stored;
      } catch {
        /* Keep the island usable if weather storage is unavailable. */
      }
    }
    const now = this.now();
    if (c && now >= c.attemptedAt && now - c.attemptedAt < WEATHER_HOUR) {
      this.memory.set(key, c);
      return c;
    }
    try {
      const weather = await this.fetcher(location);
      if (!validWeather(weather)) throw new Error('Invalid weather');
      const updatedAt = this.now();
      c = { weather, updatedAt, attemptedAt: updatedAt, failed: false };
    } catch {
      c = {
        weather: c?.weather ?? null,
        updatedAt: c?.updatedAt ?? null,
        attemptedAt: this.now(),
        failed: true,
      };
      // A device-clock rollback must not persist an impossible future timestamp.
      if (c.updatedAt !== null && c.updatedAt > c.attemptedAt)
        c = { ...c, weather: null, updatedAt: null };
    }
    this.memory.set(key, c);
    try {
      await this.store.write(key, c);
    } catch {
      /* The in-process cache still prevents repeated requests. */
    }
    return c;
  }
}
