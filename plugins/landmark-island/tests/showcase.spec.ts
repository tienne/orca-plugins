import { test, expect } from '@playwright/test';
import { empty, validate } from '../src/game';
import { decorationById, DUPLICATE_MATERIALS } from '../src/decorations';
import { at } from '../src/world';

test('Orcatopia showcase keeps legacy storage and shows an English fixture island', async ({
  page,
}) => {
  const fixture = empty();
  const acquire = (landmark: string) => {
    const workspaceId = `showcase-${fixture.tickets.length}`;
    fixture.tickets.push({ workspaceId, at: '2026-11-07' });
    fixture.receipts.push({ workspaceId, landmark, at: '2026-11-07' });
  };
  for (const landmark of ['eiffel', 'taj', 'petra', 'fuji']) acquire(landmark);
  fixture.placements = [
    { landmark: 'eiffel', cell: at(8, 10)! },
    { landmark: 'taj', cell: at(13, 8)! },
    { landmark: 'petra', cell: at(14, 13)! },
  ];
  // A walkable cross connects the three landmark gardens and fountain court.
  for (let row = 9; row <= 14; row++)
    for (let col = 9; col <= 14; col++)
      fixture.floors.push({
        cell: at(col, row)!,
        decoration: col === 11 || row === 11 ? 'stonepath' : 'grass',
      });
  const garden: [string, number, number, number?][] = [
    ['fuji-gift', 9, 9],
    ['eiffel-gift', 10, 9],
    ['taj-gift', 14, 9],
    ['taj-gift', 10, 10],
    ['taj-gift', 12, 10],
    ['taj-gift', 13, 10],
    ['eiffel-gift', 14, 10],
    ['eiffel-special', 9, 11, 1],
    ['taj-special', 12, 11],
    ['eiffel-special', 14, 11, 3],
    ['fuji-gift', 9, 12],
    ['taj-gift', 10, 12],
    ['taj-gift', 13, 12],
    ['fuji-gift', 14, 12],
    ['eiffel-gift', 9, 13],
    ['taj-gift', 10, 13],
    ['taj-gift', 12, 13],
    ['fuji-gift', 9, 14],
    ['eiffel-special', 10, 14],
    ['eiffel-gift', 12, 14],
    ['taj-gift', 13, 14],
    ['petra-gift', 14, 14],
  ];
  const used = new Map<string, number>();
  for (const [decoration, col, row, rotation] of garden) {
    const count = (used.get(decoration) ?? 0) + 1;
    used.set(decoration, count);
    if (count > (decorationById(decoration)!.gift ? 1 : 0))
      fixture.crafts.push({
        id: `garden-${fixture.crafts.length}`,
        decoration,
      });
    fixture.decorations.push({
      decoration,
      cell: at(col, row)!,
      ...(rotation ? { rotation } : {}),
    });
  }
  // Fixture duplicates fund the exact craft ledger; no free material override.
  const cost = fixture.crafts.reduce(
    (sum, craft) => sum + decorationById(craft.decoration)!.cost,
    0,
  );
  for (let i = 0; i < Math.ceil(cost / DUPLICATE_MATERIALS); i++)
    acquire('eiffel');
  const save = validate(fixture);
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
  await expect(page.locator('.cell.occupied')).toHaveCount(
    save.placements.length + save.decorations.length,
  );
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
