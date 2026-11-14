import { test, expect } from '@playwright/test';
import { introductionHtml } from './introduction';
import { showcaseFixture } from '../src/showcase-fixture';
import { canPlaceLandmark, canPlaceDecoration, surfaceAt } from '../src/game';

test('showcase scenes stay usable on a narrow screen without changing a saved island', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 850 });
  await page.addInitScript(() =>
    localStorage.setItem(
      'landmark-island-demo-v1',
      'unchanged-showcase-sentinel',
    ),
  );
  await page.goto('/?lang=ko&preview=showcase');
  await expect(page.locator('.showcase-water')).toBeVisible();
  await page.locator('[data-showcase=wonders]').click();
  await expect(page.locator('.showcase-wonders article')).toHaveCount(3);
  await expect(page.locator('.showcase-wonders article').last()).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(360);
  await page.locator('[data-showcase=water]').click();
  await expect(page.locator('.showcase-water')).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe('unchanged-showcase-sentinel');
});

test('registration showcase includes valid sea and river scenes, enlarged Wonders and fusion without saves', async ({
  page,
}) => {
  test.setTimeout(60000);
  const fixture = showcaseFixture();
  expect(fixture.placements.length).toBeGreaterThanOrEqual(25);
  expect(fixture.decorations.length).toBeGreaterThanOrEqual(200);
  expect(
    fixture.floors.filter((p) => p.decoration === 'river').length,
  ).toBeGreaterThanOrEqual(60);
  for (const p of fixture.placements)
    expect(canPlaceLandmark(fixture, p.landmark, p.cell)).toBe(true);
  for (const p of fixture.decorations)
    expect(canPlaceDecoration(fixture, p.decoration, p.cell)).toBe(true);
  for (const id of ['halong', 'greatbarrierreef', 'bluehole'])
    expect(
      surfaceAt(
        fixture,
        fixture.placements.find((p) => p.landmark === id)!.cell,
      ),
    ).toBe('sea');
  for (const id of ['liriver', 'middlerhine', 'mostar'])
    expect(
      surfaceAt(
        fixture,
        fixture.placements.find((p) => p.landmark === id)!.cell,
      ),
    ).toBe('river');
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=en&preview=showcase');
  const before = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  const cover = await page.context().newPage();
  await cover.setViewportSize({ width: 1600, height: 1000 });
  for (const locale of ['en', 'ko'] as const) {
    await page.goto(`/?lang=${locale}&preview=showcase`);
    await expect(page.locator('.showcase-water .landmark-art')).toHaveCount(
      fixture.placements.length,
    );
    expect(
      await page.locator('.showcase-water [data-river-wide=true]').count(),
    ).toBeGreaterThan(30);
    await expect(page.locator('.showcase-water')).toBeVisible();
    const water = await page.locator('.showcase-water').screenshot();
    await page.screenshot({
      path: `test-results/landmark-island/orcatopia-island-demo${locale === 'ko' ? '.ko' : ''}.png`,
    });
    await page.locator('[data-showcase=wonders]').click();
    await expect(page.locator('.showcase-wonders .landmark-art')).toHaveCount(
      3,
    );
    await expect(
      page.locator('.showcase-wonders .detail-art').first(),
    ).toHaveCSS('height', '340px');
    const wonders = await page.locator('.showcase-wonders').screenshot();
    await page.screenshot({
      path: `test-results/landmark-island/orcatopia-wonders${locale === 'ko' ? '.ko' : ''}.png`,
    });
    await cover.setContent(
      introductionHtml(
        water.toString('base64'),
        locale,
        wonders.toString('base64'),
      ),
    );
    await cover.locator('img').evaluateAll(async (imgs) => {
      await Promise.all(imgs.map((img) => (img as HTMLImageElement).decode()));
    });
    await expect(cover.locator('.wonder-screen')).toBeVisible();
    await cover.screenshot({
      path: `test-results/landmark-island/orcatopia-introduction${locale === 'ko' ? '.ko' : ''}.png`,
    });
    await page.locator('[data-showcase=fusion]').click();
    await page.locator('#showcase-fuse').click();
    await expect(page.locator('.fusion-reveal.revealed')).toBeVisible();
    await expect(page.locator('.discovery-heading')).toContainText('DEMO');
    await page.screenshot({
      path: `test-results/landmark-island/orcatopia-fusion${locale === 'ko' ? '.ko' : ''}.png`,
    });
    await page.locator('.reveal-keep').click();
  }
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(before);
  await cover.close();
});
