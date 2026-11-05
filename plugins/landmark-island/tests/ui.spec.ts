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
  await page
    .getByRole('button', { name: 'Cell 2: empty', exact: true })
    .click();
  await page.reload();
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
