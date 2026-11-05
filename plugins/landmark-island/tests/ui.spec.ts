import { test, expect } from '@playwright/test';
test('demo acquisition, duplicate, placement, move, removal and persistent map', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.goto('/');
  await expect(page.getByText('DEMO · LOCAL FIXTURES')).toBeVisible();
  await page.getByRole('button', { name: 'Demo expedition' }).click();
  await expect(page.getByRole('status')).toContainText(
    'New discovery: Eiffel Tower',
  );
  await page.getByRole('button', { name: 'Demo expedition' }).click();
  await expect(page.getByRole('status')).toContainText(
    'Duplicate discovered: Eiffel Tower',
  );
  await page.locator('[data-landmark=eiffel]').click();
  await page
    .getByRole('button', { name: 'Cell 1: empty', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Cell 1: Eiffel Tower', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Cell 1: Eiffel Tower', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Return to collection' }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Cell 2: empty', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Cell 2: Eiffel Tower', exact: true }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Arrange landmarks' }).click();
  await expect(
    page.getByRole('button', { name: 'Cell 2: Eiffel Tower', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Cell 2: Eiffel Tower', exact: true })
    .click();
  await page.getByRole('button', { name: 'Return to collection' }).click();
  await expect(page.locator('[data-landmark=eiffel]')).toContainText(
    'Owned ×2 · 2 available',
  );
  await page.getByRole('button', { name: 'World Map', exact: true }).click();
  await expect(page.locator('.world circle')).toHaveCount(1);
  await expect(page.locator('.world path.acquired')).toHaveCount(1);
  await expect(page.locator('.countries')).toContainText('France 1/1');
  await page.screenshot({ path: 'test-results/landmark-island/map-demo.png' });
});
for (const theme of ['light', 'dark'])
  test(`${theme} responsive island`, async ({ page }) => {
    await page.goto('/');
    await page.evaluate(
      (theme) => (document.documentElement.className = theme),
      theme,
    );
    await page.setViewportSize({ width: 360, height: 800 });
    await expect(page.locator('.cell')).toHaveCount(36);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(360);
    const ocean = await page.locator('.ocean').boundingBox();
    for (const cell of await page.locator('.cell').all()) {
      const box = await cell.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(ocean!.x);
      expect(box!.x + box!.width).toBeLessThanOrEqual(ocean!.x + ocean!.width);
    }

    await page.screenshot({
      path: `test-results/landmark-island/${theme}-mobile-demo.png`,
      fullPage: true,
    });
  });
test('damaged save is not silently replaced', async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem('landmark-island-demo-v1', '{"version":99}'),
  );
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('not overwritten');
});

test('walk, camera and weather are independent from collection ownership', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'landmark-island-demo-v1',
      JSON.stringify({
        version: 1,
        receipts: [
          { workspaceId: 'fixture', landmark: 'eiffel', at: '2026-11-05' },
        ],
        placements: [{ landmark: 'eiffel', cell: 31 }],
      }),
    ),
  );
  await page.goto('/');
  const ocean = page.getByRole('region', { name: 'Interactive island' }),
    walker = page.getByRole('img', { name: 'Island explorer' });
  await expect(walker).toHaveAttribute('data-cell', '30');
  await page
    .getByRole('button', { name: 'Cell 33: empty', exact: true })
    .click();
  await expect(walker).toHaveAttribute('data-cell', '32'); // Takes a route around the building at 31.
  await ocean.focus();
  await page.keyboard.press('ArrowRight');
  await expect(walker).toHaveAttribute('data-cell', '33');
  await page.getByRole('button', { name: 'Walk north' }).click();
  await expect(walker).toHaveAttribute('data-cell', '27');
  await page.screenshot({
    path: 'test-results/landmark-island/explore-demo.png',
    fullPage: true,
  });
  const saved = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(page.locator('#zoom-value')).toHaveText('115%');
  const camera = page.locator('.camera');
  const before = await camera.getAttribute('style');
  const box = (await ocean.boundingBox())!;
  await page.mouse.move(box.x + 30, box.y + 180);
  await page.mouse.down();
  await page.mouse.move(box.x + 90, box.y + 210, { steps: 8 });
  await page.mouse.up();
  expect(await camera.getAttribute('style')).not.toBe(before);
  await page.getByRole('button', { name: 'Reset camera' }).click();
  await expect(page.locator('#zoom-value')).toHaveText('100%');
  await page.getByLabel('Weather', { exact: true }).selectOption('2');
  await expect(ocean).toHaveAttribute('data-weather', 'rain');
  await page.getByRole('button', { name: 'Change time of day' }).click();
  await page.getByRole('button', { name: 'Change time of day' }).click();
  await expect(ocean).toHaveAttribute('data-phase', 'night');
  await page.screenshot({
    path: 'test-results/landmark-island/rain-night-demo.png',
    animations: 'disabled',
    fullPage: true,
  });
  await page.getByLabel('Weather', { exact: true }).selectOption('3');
  await expect(ocean).toHaveAttribute('data-weather', 'snow');
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(saved);
  await page.getByRole('button', { name: 'World Map', exact: true }).click();
  await expect(page.locator('.world circle')).toHaveCount(1);
});

test('automatic climate cycles, manual override and reduced motion', async ({
  page,
}) => {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const ocean = page.locator('.ocean');
  await expect(ocean).toHaveAttribute('data-weather', 'sunny');
  await page.clock.runFor(30000);
  await expect(ocean).toHaveAttribute('data-weather', 'cloudy');
  await page.clock.runFor(30000);
  await expect(ocean).toHaveAttribute('data-weather', 'rain');
  await expect(ocean).toHaveAttribute('data-phase', 'sunset');
  await page.getByLabel('Weather', { exact: true }).selectOption('0');
  await page.clock.runFor(60000);
  await expect(ocean).toHaveAttribute('data-weather', 'sunny');
  await expect(ocean).toHaveAttribute('data-phase', 'sunset');
  expect(
    await page
      .locator('.cloud-one')
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
  await page
    .getByRole('button', { name: 'Cell 26: empty', exact: true })
    .click();
  await page.clock.runFor(1000);
  await expect(page.locator('.walker')).toHaveAttribute('data-cell', '25');
});
