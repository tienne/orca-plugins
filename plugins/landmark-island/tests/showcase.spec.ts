import { test, expect } from '@playwright/test';
import { empty } from '../src/game';

test('Orcatopia showcase keeps legacy storage and shows an English fixture island', async ({
  page,
}) => {
  const save = empty();
  for (const [index, landmark] of ['eiffel', 'taj', 'petra'].entries()) {
    const workspaceId = `showcase-${index}`;
    save.tickets.push({ workspaceId, at: '2026-11-07' });
    save.receipts.push({ workspaceId, landmark, at: '2026-11-07' });
    save.placements.push({ landmark, cell: index * 2 });
  }
  await page.addInitScript((save) => {
    localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save));
  }, save);
  await page.setViewportSize({ width: 1280, height: 1100 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=en');
  await expect(page).toHaveTitle('Orcatopia');
  await expect(
    page.getByRole('heading', { name: 'Orcatopia', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('DEMO · LOCAL FIXTURES')).toBeVisible();
  await expect(page.locator('.cell.occupied')).toHaveCount(3);
  await page.getByRole('button', { name: 'Show whole island' }).click();
  await page.screenshot({
    path: 'test-results/landmark-island/orcatopia-island-demo.png',
    fullPage: true,
  });
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
  );
  expect(stored).toEqual(save);
});
