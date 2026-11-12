import { test, expect } from '@playwright/test';
import { empty, landmarks, validate } from '../src/game';
import { at, landTiles } from '../src/world';

test('full collection fits the expanded island and outer placements survive moving and reload', async ({
  page,
}) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const save = empty();
  const source = at(8, 25)!;
  const destination = at(9, 25)!;
  const available = landTiles.filter(
    (t) => !(t.col >= 6 && t.col <= 12 && t.row >= 23 && t.row <= 29),
  );
  landmarks.forEach((entry, index) => {
    const workspaceId = `full-island-${entry.id}`;
    save.tickets.push({ workspaceId, at: '2026-11-08' });
    save.receipts.push({ workspaceId, landmark: entry.id, at: '2026-11-08' });
    save.placements.push({
      landmark: entry.id,
      cell:
        entry.id === 'lalibela'
          ? source
          : available[Math.floor((index * available.length) / landmarks.length)]
              .id,
    });
  });
  save.floors = landTiles.map((t) => ({ cell: t.id, decoration: 'grass' }));
  const fixture = validate(save);
  await page.addInitScript(
    (save) =>
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save)),
    fixture,
  );
  await page.setViewportSize({ width: 1280, height: 1100 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=en');
  await page.locator('#daylight').selectOption('0');
  await page.locator('#weather').selectOption('0');
  await expect(page.locator('.cell')).toHaveCount(1044);
  await expect(page.locator('.building')).toHaveCount(landmarks.length);
  await expect(page.locator('.land-progress')).toContainText(
    'Your whole island is open.',
  );
  await page.locator('#overview').click();
  await page.locator('.ocean').screenshot({
    path: 'test-results/landmark-island/300-landmarks-full-island.png',
  });
  const camera = await page.locator('.camera').elementHandle();
  await page
    .getByRole('button', { name: 'Arrange landmarks', exact: true })
    .click();
  await page.locator(`[data-world-cell="${source}"] .building-select`).click();
  await page.locator('#move-piece').click();
  await expect(page.locator('.placement-hint')).toContainText(
    'Choose an empty cell',
  );
  await page.locator(`[data-cell="${destination}"]`).click();
  await expect(
    page.locator(`[data-world-cell="${destination}"] .building`),
  ).toHaveCount(1);
  expect(
    await camera!.evaluate(
      (node) => node === document.querySelector('.camera'),
    ),
  ).toBe(true);
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
  );
  expect(stored.placements).toHaveLength(landmarks.length);
  expect(stored.placements).toContainEqual({
    landmark: 'lalibela',
    cell: destination,
  });
  expect(stored.floors).toEqual(fixture.floors);
  expect(stored.receipts).toEqual(fixture.receipts);
  // Remove the initialization fixture before reloading so persistence is actually exercised.
  const fresh = await page
    .context()
    .browser()!
    .newContext({ viewport: { width: 390, height: 844 } });
  const narrow = await fresh.newPage();
  await narrow.goto('http://127.0.0.1:43189/?lang=ko');
  await narrow.evaluate(
    (save) =>
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save)),
    stored,
  );
  await narrow.reload();
  await expect(narrow.locator('.cell')).toHaveCount(1044);
  await expect(
    narrow.locator(`[data-world-cell="${destination}"] .building`),
  ).toHaveCount(1);
  await narrow.locator('#overview').click();
  expect(
    await narrow.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await narrow.locator('.ocean').screenshot({
    path: 'test-results/landmark-island/300-landmarks-narrow.png',
  });
  await fresh.close();
  expect(errors).toEqual([]);
});
