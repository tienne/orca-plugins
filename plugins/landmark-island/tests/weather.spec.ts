import { test, expect, type Page } from '@playwright/test';
import { empty } from '../src/game';
const hour = 3600000;
test.use({ timezoneId: 'Asia/Seoul' });
async function fixture(
  page: Page,
  options: { fail?: boolean; hold?: boolean } = {},
) {
  await page.clock.install({ time: new Date('2026-11-08T11:59:00+09:00') });
  await page.clock.pauseAt(new Date('2026-11-08T12:00:00+09:00'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(
    ({ save, options }) => {
      const f = window as unknown as { weatherFixture: any; orca: unknown };
      const state = (f.weatherFixture = {
        calls: [] as string[],
        links: [] as string[],
        zone: 'Asia/Seoul',
        kind: 2,
        fail: Boolean(options.fail),
        hold: Boolean(options.hold),
        release: {} as Record<string, (kind: number) => void>,
      });
      const dateTimeFormat = Intl.DateTimeFormat;
      Intl.DateTimeFormat = new Proxy(dateTimeFormat, {
        apply(target, thisArg, args) {
          const formatter = Reflect.apply(target, thisArg, args);
          const resolved = formatter.resolvedOptions.bind(formatter);
          formatter.resolvedOptions = () => ({
            ...resolved(),
            timeZone: state.zone,
          });
          return formatter;
        },
      });
      const report = (timezone: string, weather: number) => ({
        timezone,
        weather,
        updatedAt: Date.now(),
        nextCheckAt: Date.now() + 3600000,
        status: 'fresh',
      });
      f.orca = {
        locale: 'en-US',
        shell: {
          async openExternal(url: string) {
            state.links.push(url);
            return { opened: true };
          },
        },
        plugin: {
          on() {},
          async request(name: string, input: { timezone?: string }) {
            if (name === 'island.read') return save;
            if (name !== 'island.weather')
              throw new Error('Unexpected fixture request');
            const timezone = input.timezone!;
            state.calls.push(timezone);
            if (state.hold)
              return new Promise((resolve) => {
                state.release[timezone] = (kind) =>
                  resolve(report(timezone, kind));
              });
            if (state.fail) throw new Error('offline');
            return report(timezone, state.kind);
          },
        },
      };
    },
    { save: empty(), options },
  );
  await page.goto('/');
}
const calls = (page: Page) =>
  page.evaluate(() => (window as any).weatherFixture.calls);

test('timezone weather refreshes hourly, keeps the scene, and respects manual selection', async ({
  page,
}) => {
  await fixture(page);
  await expect(page.locator('#weather')).toHaveValue('timezone');
  await expect(page.locator('.ocean')).toHaveAttribute('data-weather', 'rain');
  await expect(page.locator('.weather-summary')).toContainText('Seoul');
  await expect(page.locator('.weather-updated')).toContainText(
    'Weather updated',
  );
  expect(await calls(page)).toEqual(['Asia/Seoul']);
  const island = await page.locator('.island').elementHandle();
  const camera = await page.locator('.camera').getAttribute('style');
  await page.clock.fastForward(hour - 1);
  expect(await calls(page)).toHaveLength(1);
  await page.evaluate(() => {
    (window as any).weatherFixture.kind = 3;
  });
  await page.clock.runFor(1);
  await expect(page.locator('.ocean')).toHaveAttribute('data-weather', 'snow');
  expect(await calls(page)).toHaveLength(2);
  expect(
    await island!.evaluate(
      (node) => node === document.querySelector('.island'),
    ),
  ).toBe(true);
  await expect(page.locator('.camera')).toHaveAttribute('style', camera!);
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  expect(await calls(page)).toHaveLength(2);
  await page.locator('#weather').selectOption('0');
  await page.clock.fastForward(2 * hour);
  expect(await calls(page)).toHaveLength(2);
  await expect(page.locator('.ocean')).toHaveAttribute('data-weather', 'sunny');
  await expect(page.locator('.weather-status')).toBeHidden();
  await page.locator('#weather').selectOption('timezone');
  await expect.poll(() => calls(page)).toHaveLength(3);
  await expect(page.locator('.ocean')).toHaveAttribute('data-weather', 'snow');
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(null);
});

test('hidden and closed islands stop querying and resume only when the cache is due', async ({
  page,
}) => {
  await fixture(page);
  await expect(page.locator('.ocean')).toHaveAttribute('data-weather', 'rain');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.fastForward(2 * hour);
  expect(await calls(page)).toHaveLength(1);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect.poll(() => calls(page)).toHaveLength(2);
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  expect(await calls(page)).toHaveLength(2);
  await page.getByRole('button', { name: 'World Map', exact: true }).click();
  await page.clock.fastForward(2 * hour);
  expect(await calls(page)).toHaveLength(2);
  await page.getByRole('button', { name: 'My Island', exact: true }).click();
  await expect.poll(() => calls(page)).toHaveLength(3);
});

test('failed updates retain the last weather, timestamp and an hourly retry delay', async ({
  page,
}) => {
  await fixture(page);
  await expect(page.locator('.ocean')).toHaveAttribute('data-weather', 'rain');
  const updated = await page.locator('.weather-updated').textContent();
  await page.evaluate(() => {
    (window as any).weatherFixture.fail = true;
  });
  await page.clock.fastForward(hour);
  await expect(page.locator('.weather-summary')).toContainText(
    'Keeping last weather',
  );
  await expect(page.locator('.ocean')).toHaveAttribute('data-weather', 'rain');
  await expect(page.locator('.weather-updated')).toHaveText(updated!);
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await page.clock.runFor(30000);
  expect(await calls(page)).toHaveLength(2);
  await expect(page.locator('.ocean')).toHaveAttribute('data-weather', 'rain');
  await page.evaluate(() => {
    (window as any).weatherFixture.fail = false;
    (window as any).weatherFixture.kind = 3;
  });
  await page.clock.fastForward(hour);
  await expect(page.locator('.ocean')).toHaveAttribute('data-weather', 'snow');
  await expect(page.locator('.weather-summary')).toContainText(
    'Reference city',
  );
});

test('first failure and unmapped timezones use clearly labelled simulated weather', async ({
  page,
}) => {
  await fixture(page, { fail: true });
  await expect(page.locator('.weather-summary')).toContainText(
    'Weather unavailable',
  );
  await page.clock.runFor(30000);
  await expect(page.locator('.ocean')).toHaveAttribute(
    'data-weather',
    'cloudy',
  );
  expect(await calls(page)).toHaveLength(1);
  await page.evaluate(() => {
    (window as any).weatherFixture.zone = 'UTC';
    window.dispatchEvent(new Event('focus'));
  });
  await expect(page.locator('.weather-summary')).toContainText(
    'No reference city',
  );
  await expect(page.locator('.weather-updated')).toHaveText('');
  expect(await calls(page)).toHaveLength(1);
});

test('timezone switches ignore late old-city replies; Korean source details fit and links need a click', async ({
  page,
}) => {
  await fixture(page, { hold: true });
  await expect.poll(() => calls(page)).toEqual(['Asia/Seoul']);
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  expect(await calls(page)).toHaveLength(1);
  await page.evaluate(() => {
    (window as any).weatherFixture.zone = 'Asia/Tokyo';
    window.dispatchEvent(new Event('focus'));
  });
  await expect.poll(() => calls(page)).toEqual(['Asia/Seoul', 'Asia/Tokyo']);
  await page.evaluate(() =>
    (window as any).weatherFixture.release['Asia/Tokyo'](3),
  );
  await expect(page.locator('.ocean')).toHaveAttribute('data-weather', 'snow');
  await page.evaluate(() =>
    (window as any).weatherFixture.release['Asia/Seoul'](2),
  );
  await expect(page.locator('.ocean')).toHaveAttribute('data-weather', 'snow');
  await expect(page.locator('.weather-summary')).toContainText('Tokyo');
  expect(
    await page.evaluate(() => (window as any).weatherFixture.links),
  ).toEqual([]);
  await page.locator('.weather-source').click();
  expect(
    await page.evaluate(() => (window as any).weatherFixture.links),
  ).toEqual(['https://open-meteo.com/']);
  await page.evaluate(() => {
    (window as any).orca.locale = 'ko-KR';
  });
  await page.clock.runFor(500);
  await expect(page.locator('.weather-summary')).toContainText(
    '타임존 날씨 · 도쿄',
  );
  await expect(page.locator('.weather-updated')).toContainText(
    '마지막 날씨 갱신',
  );
  await page.setViewportSize({ width: 360, height: 900 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(360);
  await page.evaluate(() =>
    document.body.insertAdjacentHTML(
      'afterbegin',
      '<p>DEMO · Mock weather / 가상 날씨 데이터</p>',
    ),
  );
  await page.screenshot({
    path: 'test-results/landmark-island/timezone-weather-ko.png',
    animations: 'disabled',
    fullPage: true,
  });
});
