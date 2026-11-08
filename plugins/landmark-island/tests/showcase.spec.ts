import { introductionHtml } from './introduction';
import { test, expect } from '@playwright/test';
import { empty, validate, islandLand } from '../src/game';
import { decorationById, DUPLICATE_MATERIALS } from '../src/decorations';
import { at, landAtLevel, landTiles, neighbours } from '../src/world';

test('Orcatopia showcase keeps legacy storage and shows an English fixture island', async ({
  page,
}) => {
  const fixture = empty();
  const acquire = (landmark: string) => {
    const workspaceId = `showcase-${fixture.tickets.length}`;
    fixture.tickets.push({ workspaceId, at: '2026-11-07' });
    fixture.receipts.push({ workspaceId, landmark, at: '2026-11-07' });
  };
  // Twelve collected destinations unlock the complete island through normal rules.
  for (const landmark of [
    'eiffel',
    'taj',
    'petra',
    'fuji',
    'kinderdijk',
    'angkor',
    'stonehenge',
    'hagia',
    'sagrada',
    'opera',
    'colosseum',
    'belem',
  ])
    acquire(landmark);
  fixture.placements = [
    { landmark: 'eiffel', cell: at(9, 7)! },
    { landmark: 'fuji', cell: at(6, 6)! },
    { landmark: 'taj', cell: at(14, 9)! },
    { landmark: 'kinderdijk', cell: at(6, 15)! },
    { landmark: 'petra', cell: at(17, 16)! },
  ];
  const land = landAtLevel(12);
  // The inner promenade and outer ramble join at a central open cross.
  const promenade = (col: number, row: number) =>
    col === 11 ||
    row === 11 ||
    ((row === 8 || row === 15) && col >= 8 && col <= 15) ||
    ((col === 8 || col === 15) && row >= 8 && row <= 15) ||
    (row === 5 && col >= 7 && col <= 15) ||
    (row === 18 && col >= 5 && col <= 18) ||
    (col === 5 && row >= 8 && row <= 18) ||
    (col === 18 && row >= 10 && row <= 18);
  for (const tile of land)
    fixture.floors.push({
      cell: tile.id,
      decoration: promenade(tile.col, tile.row) ? 'stonepath' : 'grass',
    });
  const garden: [string, number, number, number?][] = [
    // Central parterre: open sight lines, paired water features and flower beds.
    ['taj-special', 10, 9],
    ['taj-special', 12, 9],
    ['taj-pavilion', 13, 13],
    ['fuji-pond', 9, 10],
    ['fuji-pond', 13, 10],
    ['eiffel-special', 9, 12, 1],
    ['eiffel-special', 13, 12, 3],
    ['eiffel-rose-arch', 10, 16],
    ['eiffel-rose-arch', 12, 16],
    ['eiffel-gift', 10, 14],
    ['eiffel-gift', 12, 14],
    ['eiffel-gift', 7, 10],
    ['eiffel-gift', 7, 12],
    ['eiffel-gift', 16, 12],
    ['eiffel-gift', 14, 10],
    // A cherry grove descends from the mountain to a quiet pond terrace.
    ['fuji-pond', 4, 9],
    ['fuji-pond', 6, 10],
    ['fuji-gift', 4, 7],
    ['fuji-gift', 6, 8],
    ['fuji-gift', 8, 6],
    ['fuji-gift', 4, 12],
    ['fuji-gift', 6, 13],
    ['fuji-gift', 7, 9],
    ['fuji-special', 7, 7],
    ['eiffel-special', 4, 10, 1],
    ['angkor-fern-bed', 5, 6],
    ['angkor-fern-bed', 7, 6],
    // Rose garden behind the tower; fountains and benches face the lagoon.
    ['eiffel-rose-arch', 10, 4],
    ['eiffel-rose-arch', 14, 4],
    ['eiffel-special', 13, 6, 2],
    ['eiffel-gift', 10, 6],
    ['eiffel-gift', 14, 6],
    ['fuji-gift', 9, 3],
    ['fuji-gift', 13, 3],
    ['fuji-gift', 15, 4],
    ['eiffel-special', 19, 10, 3],
    ['colosseum-gift', 19, 6],
    ['colosseum-gift', 20, 8],
    ['taj-pavilion', 19, 13],
    ['belem-gift', 19, 12],
    // A windmill meadow, a woodland rest and an oasis at the southern shore.
    ['kinderdijk-special', 7, 16],
    ['eiffel-special', 6, 17, 1],
    ['fuji-gift', 4, 15],
    ['fuji-gift', 7, 18],
    ['angkor-gift', 3, 13],
    ['angkor-gift', 3, 16],
    ['angkor-fern-bed', 4, 14],
    ['angkor-fern-bed', 4, 16],
    ['colosseum-special', 9, 17],
    ['eiffel-gift', 10, 19],
    ['eiffel-gift', 12, 19],
    ['eiffel-rose-arch', 10, 20],
    ['eiffel-rose-arch', 12, 20],
    ['fuji-gift', 8, 19],
    ['fuji-gift', 14, 19],
    ['petra-gift', 16, 15],
    ['petra-gift', 19, 16],
    ['petra-gift', 16, 18],
    ['petra-special', 19, 18],
    ['belem-special', 16, 17],
    ['eiffel-special', 15, 17, 3],
    ['oak', 16, 13],
    ['oak', 7, 4],
    ['oak', 15, 6],
    ['oak', 20, 12],
    ['oak', 20, 15],
    ['oak', 16, 4],
    ['hagia-gift', 15, 3],
    ['stonehenge-gift', 3, 9],
    ['opera-gift', 19, 14],
    ['opera-gift', 20, 14],
    ['angkor-fern-bed', 17, 12],
  ];
  const reserved = new Set(fixture.placements.map((p) => p.cell));
  for (const [, col, row] of garden) {
    const cell = at(col, row)!;
    expect(reserved.has(cell)).toBe(false);
    reserved.add(cell);
  }
  // Repeated border planting ties the distinct gardens together. Keep lawn gaps
  // between the formal beds and the trees, rather than filling every free cell.
  for (const tile of land) {
    const { col, row } = tile;
    if (reserved.has(tile.id) || promenade(col, row)) continue;
    const formal =
      col >= 9 &&
      col <= 14 &&
      row >= 9 &&
      row <= 14 &&
      (row === 9 || row === 14 || col === 9 || col === 14);
    const border =
      ((row === 7 || row === 16) && col >= 8 && col <= 14) ||
      ((col === 7 || col === 16) && row >= 8 && row <= 15) ||
      (row === 6 && col >= 9 && col <= 14) ||
      (row === 19 && col >= 9 && col <= 15);
    const meadow = col >= 6 && col <= 9 && row >= 16 && row <= 17;
    if (formal || border || meadow) {
      const flower = meadow
        ? 'kinderdijk-gift'
        : row < 9
          ? 'hagia-gift'
          : col < 11
            ? 'sagrada-gift'
            : 'taj-gift';
      garden.push([flower, col, row]);
    } else if (
      col % 3 === 0 &&
      row % 3 === 0 &&
      neighbours(tile.id).length === 4
    ) {
      garden.push([col < 11 ? 'fuji-gift' : 'colosseum-gift', col, row]);
    } else if ((col + row * 2) % 11 === 0 && row > 6) {
      garden.push([col < 8 ? 'angkor-fern-bed' : 'stonehenge-gift', col, row]);
    }
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
  expect(islandLand(save)).toHaveLength(landTiles.length);
  expect(landTiles).toHaveLength(318);
  expect(save.floors).toHaveLength(318);
  // Every walkable lawn and path must remain reachable in the decorated layout.
  const blocked = new Set([
    ...save.placements.map((p) => p.cell),
    ...save.decorations
      .filter((p) => !decorationById(p.decoration)!.walkable)
      .map((p) => p.cell),
  ]);
  const reached = new Set([at(11, 11)!]);
  for (const cell of reached)
    for (const next of neighbours(cell))
      if (!blocked.has(next)) reached.add(next);
  expect(
    land
      .filter((t) => !blocked.has(t.id) && !reached.has(t.id))
      .map((t) => [t.col, t.row]),
  ).toEqual([]);
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
    // Capture a closer garden view using the game's camera controls.
    for (let step = 0; step < 3; step++) await page.locator('#zoom-in').click();
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
