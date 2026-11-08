import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

export async function testWeather(dir) {
  const { WeatherService, fetchWeather } = await import(
    pathToFileURL(join(dir, 'worker/weather.mjs'))
  );
  const { timezoneLocation, weatherKind, WEATHER_HOUR } = await import(
    pathToFileURL(join(dir, 'weather.mjs'))
  );
  for (const [zone, city] of [
    ['Asia/Seoul', 'Seoul'],
    ['Asia/Tokyo', 'Tokyo'],
    ['America/Los_Angeles', 'Los Angeles'],
    ['US/Pacific', 'Los Angeles'],
    ['Asia/Calcutta', 'Kolkata'],
  ]) {
    assert.equal(timezoneLocation(zone).city, city);
  }
  for (const zone of [
    'UTC',
    'Etc/GMT+9',
    'constructor',
    '__proto__',
    'https://example.com/',
    null,
  ])
    assert.equal(timezoneLocation(zone), null);
  for (const [code, kind] of [
    [0, 0],
    [1, 0],
    [3, 1],
    [48, 1],
    [61, 2],
    [97, 2],
    [99, 2],
    [71, 3],
    [86, 3],
    [null, null],
    ['61', null],
    [1000, null],
  ])
    assert.equal(weatherKind(code), kind);
  let now = Date.parse('2026-11-08T12:00:00Z'),
    calls = 0,
    fail = false,
    kind = 2;
  const records = new Map([['island-v1', { private: 'game stays untouched' }]]);
  const store = {
    read: async (key) => structuredClone(records.get(key)),
    write: async (key, value) => {
      assert.ok(key.startsWith('weather-v1:'));
      records.set(key, structuredClone(value));
    },
  };
  const fetcher = async () => {
    calls++;
    await Promise.resolve();
    if (fail) throw new Error('offline');
    return kind;
  };
  let service = new WeatherService(store, fetcher, () => now);
  const request = { timezone: 'Asia/Seoul' };
  const reports = await Promise.all(
    Array.from({ length: 10 }, () => service.read(request)),
  );
  assert.equal(calls, 1);
  assert.ok(reports.every((r) => r.weather === 2 && r.status === 'fresh'));
  now += WEATHER_HOUR - 1;
  await service.read(request);
  assert.equal(calls, 1);
  service = new WeatherService(store, fetcher, () => now);
  await service.read(request);
  assert.equal(calls, 1); // survives idle-worker restart
  now++;
  kind = 3;
  const snow = await service.read(request);
  assert.equal(calls, 2);
  assert.equal(snow.weather, 3);
  now += WEATHER_HOUR;
  fail = true;
  const stale = await service.read(request);
  assert.equal(calls, 3);
  assert.equal(stale.status, 'stale');
  assert.equal(stale.weather, 3);
  assert.equal(stale.updatedAt, snow.updatedAt);
  service = new WeatherService(store, fetcher, () => now);
  await service.read(request);
  assert.equal(calls, 3); // failure cooldown survives restart
  const missing = await service.read({ timezone: 'Asia/Tokyo' });
  assert.equal(calls, 4);
  assert.equal(missing.status, 'unavailable');
  assert.equal(missing.weather, null);
  assert.equal((await service.read({ timezone: 'UTC' })).status, 'unsupported');
  assert.equal(calls, 4);
  await assert.rejects(service.read({ timezone: {} }));
  assert.equal(calls, 4);
  now += WEATHER_HOUR;
  fail = false;
  kind = 0;
  assert.equal((await service.read(request)).weather, 0);
  assert.equal(calls, 5);
  now -= 2 * WEATHER_HOUR;
  await service.read(request);
  assert.equal(calls, 6); // recover from a backwards clock
  assert.deepEqual(records.get('island-v1'), {
    private: 'game stays untouched',
  });
  const brokenStore = {
    read: async () => {
      throw new Error('read failed');
    },
    write: async () => {
      throw new Error('write failed');
    },
  };
  const fallback = new WeatherService(brokenStore, fetcher, () => now);
  await fallback.read(request);
  await fallback.read(request);
  assert.equal(calls, 7);
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url.origin, 'https://api.open-meteo.com');
      assert.equal(url.pathname, '/v1/forecast');
      assert.deepEqual([...url.searchParams.keys()].sort(), [
        'current',
        'forecast_days',
        'latitude',
        'longitude',
        'timeformat',
      ]);
      assert.equal(url.searchParams.get('current'), 'weather_code');
      assert.equal(options.redirect, 'error');
      assert.ok(options.signal);
      return Response.json({ current: { weather_code: 73 } });
    };
    assert.equal(await fetchWeather(timezoneLocation('Asia/Seoul')), 3);
    for (const response of [
      Response.json({ current: { weather_code: null } }),
      Response.json({ error: true }),
      new Response('no', { status: 429 }),
      new Response(' '.repeat(32769)),
    ]) {
      globalThis.fetch = async () => response;
      await assert.rejects(fetchWeather(timezoneLocation('Asia/Seoul')));
    }
    let fetchCount = 0;
    globalThis.fetch = async () => {
      fetchCount++;
      return Response.json({ current: { weather_code: 61 } });
    };
    const { default: activate } = await import(
      pathToFileURL(join(dir, 'worker/main.mjs'))
    );
    const handlers = {},
      writes = [],
      isolated = new Map();
    activate({
      host: {
        call: async (name, input) => {
          if (name === 'storage.get') return { value: isolated.get(input.key) };
          writes.push(input.key);
          isolated.set(input.key, input.value);
          return { ok: true };
        },
      },
      panels: {
        handle: (name, handler) => {
          handlers[name] = handler;
        },
        post: async () => {
          throw new Error('Weather must not notify game changes');
        },
      },
      events: { on() {} },
      log() {},
    });
    assert.equal(fetchCount, 0); // no activation/background fetch
    const result = await handlers['island.weather'](request);
    assert.equal(result.weather, 2);
    assert.equal(fetchCount, 1);
    await handlers['island.weather'](request);
    assert.equal(fetchCount, 1);
    assert.deepEqual(writes, ['weather-v1:Asia/Seoul']);
  } finally {
    globalThis.fetch = originalFetch;
  }
  if (process.env.ORCATOPIA_WEATHER_LIVE === '1') {
    const live = await fetchWeather(timezoneLocation('Asia/Seoul'));
    assert.ok([0, 1, 2, 3].includes(live));
    console.log(
      'PASS: live Open-Meteo request for the Seoul reference location',
    );
  }
  console.log(
    'PASS: timezone weather mapping, bounded provider response, hourly durable cache, failure cooldown, coalescing, worker restart and isolated storage',
  );
}
