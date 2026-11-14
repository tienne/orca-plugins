import { test, expect } from '@playwright/test';
import { empty, validate } from '../src/game';

test.use({ timezoneId: 'Asia/Seoul' });

test('device daylight crosses every local boundary without replacing the island or touching saves', async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2026-11-08T04:59:00+09:00') });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const save = empty();
  save.tickets.push({ workspaceId: 'daylight-fixture', at: '2026-11-08' });
  save.receipts.push({
    workspaceId: 'daylight-fixture',
    landmark: 'eiffel',
    at: '2026-11-08',
  });
  save.placements.push({ landmark: 'eiffel', cell: 0 });
  await page.addInitScript(
    (state) =>
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(state)),
    validate(save),
  );
  await page.goto('/?lang=en');
  await page.clock.pauseAt(new Date('2026-11-08T04:59:59+09:00'));
  const ocean = page.locator('.ocean');
  await expect(page.getByLabel('Time of day', { exact: true })).toHaveValue(
    'auto',
  );
  await expect(ocean).toHaveAttribute('data-time-source', 'device');
  await expect(ocean).toHaveAttribute('data-phase', 'night');
  await page.getByLabel('Weather', { exact: true }).selectOption('0');
  const saved = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  const island = await page.locator('.island').elementHandle();
  const camera = await page.locator('.camera').getAttribute('style');
  for (const [ms, phase] of [
    [1000, 'dawn'],
    [7200000, 'day'],
    [36000000, 'sunset'],
    [7200000, 'night'],
    [36000000, 'dawn'],
  ] as const) {
    await page.clock.fastForward(ms);
    await expect(ocean).toHaveAttribute('data-phase', phase);
    await expect(ocean).toHaveAttribute('data-weather', 'sunny');
    expect(
      await island!.evaluate(
        (node) => node === document.querySelector('.island'),
      ),
    ).toBe(true);
    await expect(page.locator('.camera')).toHaveAttribute('style', camera!);
  }
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(saved);
});

test('manual daylight survives weather and renders, while Auto and focus restore the current clock', async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2026-11-08T12:00:00+09:00') });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=en');
  await page.clock.pauseAt(new Date('2026-11-08T12:00:05+09:00'));
  const ocean = page.locator('.ocean');
  const daylight = page.getByLabel('Time of day', { exact: true });
  await expect(ocean).toHaveAttribute('data-phase', 'day');
  await daylight.selectOption('2');
  await page.clock.runFor(30000);
  await expect(ocean).toHaveAttribute('data-weather', 'cloudy');
  await expect(ocean).toHaveAttribute('data-phase', 'night');
  await expect(ocean).toHaveAttribute('data-time-source', 'manual');
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await expect(daylight).toHaveValue('2');
  await page.getByRole('button', { name: 'World Map', exact: true }).click();
  await page.clock.setSystemTime(new Date('2026-11-08T06:00:00+09:00'));
  await page.getByRole('button', { name: 'My Island', exact: true }).click();
  await expect(ocean).toHaveAttribute('data-phase', 'night');
  await daylight.selectOption('auto');
  await expect(ocean).toHaveAttribute('data-phase', 'dawn');
  await page.clock.setSystemTime(new Date('2026-11-08T18:59:59+09:00'));
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(ocean).toHaveAttribute('data-phase', 'sunset');
  await page.clock.runFor(1000);
  await expect(ocean).toHaveAttribute('data-phase', 'night');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.setSystemTime(new Date('2026-11-09T12:00:00+09:00'));
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(ocean).toHaveAttribute('data-phase', 'day');
  await daylight.selectOption('2');
  await page.reload();
  await expect(daylight).toHaveValue('auto');
  await expect(ocean).toHaveAttribute('data-phase', 'day');
});

for (const [timezoneId, phase] of [
  ['Asia/Seoul', 'sunset'],
  ['America/Los_Angeles', 'night'],
] as const) {
  test.describe(timezoneId, () => {
    test.use({ timezoneId });
    test('the same instant uses the device timezone and Korean controls fit a narrow panel', async ({
      page,
    }) => {
      await page.clock.install({ time: new Date('2026-11-08T08:00:00Z') });
      await page.setViewportSize({ width: 360, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/?lang=ko');
      await expect(page.locator('.ocean')).toHaveAttribute('data-phase', phase);
      await expect(page.getByLabel('시간대', { exact: true })).toHaveValue(
        'auto',
      );
      await expect(page.locator('#daylight option:checked')).toHaveText(
        '자동 · 기기 시간',
      );
      await expect(page.locator('.forecast')).toContainText('기기 시간');
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(360);
      for (const id of ['weather', 'daylight']) {
        const box = (await page.locator(`#${id}`).boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(360);
      }
      await page.screenshot({
        path: `test-results/landmark-island/device-time-${phase}-ko.png`,
        fullPage: true,
        animations: 'disabled',
      });
    });
  });
}

test.describe('daylight saving time', () => {
  test.use({ timezoneId: 'America/New_York' });
  test('the night boundary uses local calendar time across the DST fallback', async ({
    page,
  }) => {
    await page.clock.install({ time: new Date('2026-10-31T18:59:00-04:00') });
    await page.goto('/?lang=en');
    await page.clock.pauseAt(new Date('2026-10-31T19:00:00-04:00'));
    await expect(page.locator('.ocean')).toHaveAttribute('data-phase', 'night');
    // The repeated hour makes this night eleven real hours long.
    await page.clock.fastForward(11 * 60 * 60 * 1000 - 1000);
    await expect(page.locator('.ocean')).toHaveAttribute('data-phase', 'night');
    await page.clock.runFor(1000);
    await expect(page.locator('.ocean')).toHaveAttribute('data-phase', 'dawn');
  });
});
