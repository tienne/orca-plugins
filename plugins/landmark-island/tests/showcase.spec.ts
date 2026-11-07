import { introductionHtml } from './introduction';
import { test, expect } from '@playwright/test';
import { empty, validate } from '../src/game';
import { decorationById, DUPLICATE_MATERIALS } from '../src/decorations';
import { at, landAtLevel } from '../src/world';

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
    { landmark: 'eiffel', cell: at(9, 7)! },
    { landmark: 'taj', cell: at(14, 9)! },
    { landmark: 'petra', cell: at(15, 14)! },
  ];
  // A promenade loops around four planted courts, with open cross paths.
  const land = landAtLevel(4);
  const promenade = (col: number, row: number) =>
    col === 11 ||
    row === 11 ||
    ((row === 8 || row === 14) && col >= 8 && col <= 14) ||
    ((col === 8 || col === 14) && row >= 8 && row <= 14);
  for (const tile of land)
    fixture.floors.push({
      cell: tile.id,
      decoration: promenade(tile.col, tile.row) ? 'stonepath' : 'grass',
    });
  const garden: [string, number, number, number?][] = [
    // Cherry grove and water garden, with benches facing the ponds.
    ['fuji-pond', 9, 10],
    ['fuji-pond', 9, 12],
    ['fuji-gift', 7, 9],
    ['fuji-gift', 7, 12],
    ['fuji-gift', 7, 14],
    ['fuji-gift', 9, 15],
    ['fuji-gift', 13, 15],
    ['fuji-gift', 9, 6],
    ['fuji-gift', 12, 6],
    ['fuji-gift', 15, 8],
    ['eiffel-special', 10, 10, 1],
    ['eiffel-special', 10, 12, 1],
    // A pavilion and matching fountains anchor the formal flower garden.
    ['taj-pavilion', 13, 13],
    ['taj-special', 12, 9],
    ['taj-special', 12, 12],
    ['eiffel-special', 13, 10, 3],
    ['eiffel-special', 12, 15, 2],
    ['eiffel-rose-arch', 11, 16],
    ['eiffel-rose-arch', 6, 11],
    ['eiffel-rose-arch', 15, 11],
    // Paired lanterns mark the garden entrances, without filling the paths.
    ['eiffel-gift', 10, 15],
    ['eiffel-gift', 12, 16],
    ['eiffel-gift', 7, 10],
    ['eiffel-gift', 7, 13],
    ['eiffel-gift', 10, 7],
    ['eiffel-gift', 13, 8],
    ['eiffel-gift', 15, 10],
    ['eiffel-gift', 15, 12],
    ['petra-gift', 16, 13],
    ['petra-gift', 14, 15],
    ['petra-special', 16, 14],
    // Green canopies frame the pink grove and soften the outer lawns.
    ['oak', 6, 12],
    ['oak', 16, 10],
    ['oak', 13, 6],
    ['fuji-gift', 10, 17],
    ['fuji-gift', 13, 16],
    ['taj-gift', 9, 16],
    ['taj-gift', 10, 16],
    ['taj-gift', 14, 16],
    ['taj-gift', 14, 7],
    ['taj-gift', 10, 6],
    ['taj-gift', 13, 7],
  ];
  // Low flower borders repeat around the courts; taller pieces stay spaced.
  const reserved = new Set([
    ...fixture.placements.map((p) => p.cell),
    ...garden.map(([, col, row]) => at(col, row)!),
  ]);
  for (const tile of land) {
    if (reserved.has(tile.id) || promenade(tile.col, tile.row)) continue;
    const { col, row } = tile;
    if (
      (col >= 9 && col <= 13 && row >= 9 && row <= 13) ||
      (row === 7 && col >= 8 && col <= 13) ||
      (row === 15 && col >= 8 && col <= 14) ||
      (col === 15 && row >= 9 && row <= 13) ||
      (col === 7 && row >= 9 && row <= 14)
    )
      garden.push(['taj-gift', col, row]);
  }
  const used = new Map<string, number>();
  for (const [decoration, col, row, rotation] of garden) {
    const count = (used.get(decoration) ?? 0) + 1;
    used.set(decoration, count);
    const definition = decorationById(decoration)!;
    if (definition.cost > 0 && count > (definition.gift ? 1 : 0))
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
  const cover = await page.context().newPage();
  await cover.setViewportSize({ width: 1600, height: 1000 });
  for (const locale of ['en', 'ko'] as const) {
    if (locale === 'ko') {
      await page.goto('/?lang=ko');
      await page.locator('#overview').click();
    }
    const canvas = await page.locator('.ocean').screenshot();
    await cover.setContent(introductionHtml(canvas.toString('base64'), locale));
    await expect(cover.locator('.screen img')).toBeVisible();
    await cover
      .locator('.screen img')
      .evaluate((img: HTMLImageElement) => img.decode());
    await expect(cover.locator('h1')).toHaveText('Orcatopia');
    await expect(cover.locator('.demo')).toContainText('DEMO');
    await cover.screenshot({
      path: `test-results/landmark-island/orcatopia-introduction${locale === 'ko' ? '.ko' : ''}.png`,
    });
  }
  await cover.close();
});
