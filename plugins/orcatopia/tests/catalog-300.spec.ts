import { test, expect } from '@playwright/test';
import { empty, landmarks, validate } from '../src/game';
import { openTreasure } from './treasure-menu';
import korean from '../src/landmarks.ko.json';

const additions = [
  'montsaintmichel',
  'neuschwanstein',
  'forbiddencity',
  'bagan',
  'grandcanyon',
  'pontdugard',
  'abusimbel',
  'samarra',
  'brasilia',
  'kaziranga',
];

test('new landmarks draw across all tiers, grant their gardens and preserve an existing collection through placement and reload', async ({
  page,
}) => {
  test.setTimeout(90_000);
  const save = empty();
  save.tickets.push({ workspaceId: 'legacy', at: '2026-11-12' });
  save.receipts.push({
    workspaceId: 'legacy',
    landmark: 'eiffel',
    at: '2026-11-12',
  });
  save.placements.push({ landmark: 'eiffel', cell: 0 });
  for (let i = 0; i < 10; i++)
    save.tickets.push({ workspaceId: `new-${i}`, at: '2026-11-12' });
  const rolls = additions.flatMap((id) => {
    const entry = landmarks.find((l) => l.id === id)!;
    const pool = landmarks.filter((l) => l.tier === entry.tier);
    const tierRoll = { common: 0.35, rare: 0.8, epic: 0.95, legendary: 0.995 }[
      entry.tier
    ];
    if (tierRoll === undefined) throw new Error(`Unknown tier: ${entry.tier}`);
    return [tierRoll, (pool.findIndex((l) => l.id === id) + 0.5) / pool.length];
  });
  await page.addInitScript(
    ({ save, rolls }) => {
      if (!localStorage.getItem('landmark-island-demo-v1'))
        localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save));
      let i = 0;
      Math.random = () => rolls[i++ % rolls.length];
    },
    { save: validate(save), rolls },
  );
  await page.goto('/?lang=en');
  await openTreasure(page);
  await page.locator('#skip-discovery').check();
  await page.locator('#draw-ten').click();
  await expect(page.locator('.treasure-result[data-new=true]')).toHaveCount(10);
  for (const id of additions)
    await expect(
      page.locator(`.treasure-result [data-material-art="${id}"]`),
    ).toHaveCount(1);
  await page.locator('.results-close').click();
  await page.locator('[data-inventory="landmarks"]').click();
  await page.locator('[data-landmark="montsaintmichel"]').click();
  await page.locator('.cell[data-cell="7"]').click();
  await page.reload();
  await expect(
    page.locator('[data-world-cell="7"] .landmark-art'),
  ).toHaveAttribute('data-material-art', 'montsaintmichel');
  await expect(
    page.locator('[data-world-cell="0"] .landmark-art'),
  ).toHaveAttribute('data-material-art', 'eiffel');
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
  );
  expect(stored.receipts).toHaveLength(11);
  expect(stored.receipts[0]).toEqual(save.receipts[0]);
  expect(stored.receipts.slice(1).map((r: any) => r.landmark)).toEqual(
    additions,
  );
  expect(stored.placements).toContainEqual(save.placements[0]);
  await page.locator('[data-inventory="decorations"]').click();
  for (const id of additions)
    await expect(page.locator(`[data-decor-card="${id}-gift"]`)).toContainText(
      'Owned ×1',
    );
  await page.goto('/?lang=ko');
  await page.locator('[data-inventory="landmarks"]').click();
  await page.locator('[data-info="forbiddencity"]').click();
  await expect(page.locator('.landmark-detail h2')).toHaveText('자금성');
  await expect(page.locator('#detail-description')).toHaveText(
    korean.forbiddencity.description,
  );
  await expect(page.locator('.detail-source a')).toHaveAttribute(
    'href',
    'https://whc.unesco.org/en/list/439/',
  );
});

test('a new garden set crafts, rotates and survives reload without changing old receipts', async ({
  page,
}) => {
  const save = empty();
  for (let i = 0; i < 3; i++) {
    save.tickets.push({ workspaceId: `garden-${i}`, at: '2026-11-12' });
    save.receipts.push({
      workspaceId: `garden-${i}`,
      landmark: 'neuschwanstein',
      at: '2026-11-12',
    });
  }
  await page.addInitScript((save) => {
    if (!localStorage.getItem('landmark-island-demo-v1'))
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save));
  }, save);
  await page.goto('/?lang=en');
  await page.locator('[data-inventory="decorations"]').click();
  await page.locator('#decor-theme').selectOption('neuschwanstein');
  await expect(page.locator('.material-balance')).toHaveText('6 materials');
  await page.locator('[data-craft="neuschwanstein-special"]').click();
  await expect(page.locator('.material-balance')).toHaveText('0 materials');
  await page.locator('[data-decor-place="neuschwanstein-special"]').click();
  await page.locator('.cell[data-cell="1"]').click();
  await page.locator('[data-mode="build"]').first().click();
  await page.locator('.cell[data-cell="1"]').click();
  await page.locator('#rotate-piece').click();
  await page.reload();
  await expect(
    page.locator(
      '[data-world-cell="1"] [data-decoration="neuschwanstein-special"]',
    ),
  ).toHaveCount(1);
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
  );
  expect(stored.receipts).toEqual(save.receipts);
  expect(stored.crafts).toHaveLength(1);
  expect(stored.decorations).toContainEqual({
    decoration: 'neuschwanstein-special',
    cell: 1,
    rotation: 1,
  });
});

test('new landmark contact sheets expose varied silhouettes and bilingual search without using a save', async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1200, height: 950 });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/?preview=landmark-life&lang=ko');
  await expect(page.locator('.life-preview-card')).toHaveCount(306);
  const search = page.locator('#life-preview-search');
  await search.fill('사마라');
  await expect(page.locator('.life-preview-card:visible')).toHaveCount(1);
  await expect(page.locator('#scene-samarra')).toBeVisible();
  await page.locator('#life-preview-clear').click();
  await search.fill('Neuschwanstein');
  await expect(page.locator('.life-preview-card:visible')).toHaveCount(1);
  await page.locator('#life-preview-clear').click();
  const selected = [
    'montsaintmichel',
    'neuschwanstein',
    'forbiddencity',
    'bagan',
    'grandcanyon',
    'pisa',
    'pontdugard',
    'fujian',
    'bulguksa',
    'samarra',
    'abusimbel',
    'kaziranga',
    'yazd',
    'brasilia',
    'jars',
    'yellowstone',
    'chiloe',
    'centralamazon',
    'serengeti',
    'giantscauseway',
  ].map((id) => (id === 'jars' ? 'plainjars' : id));
  await page.evaluate((ids) => {
    const pictures = ids
      .map((id) => document.querySelector(`#scene-${id}`)!.outerHTML)
      .join('');
    document.body.innerHTML = `<main class="catalog-review"><h1>DEMO · 206 new destinations · 306 landmarks total</h1><div>${pictures}</div></main>`;
  }, selected);
  await page.addStyleTag({
    content:
      '.catalog-review{padding:20px;background:#eee8d4;color:#375747}.catalog-review>div{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.catalog-review article{padding:12px;border-radius:12px;background:#fbf4df}.catalog-review .detail-art{height:170px}.catalog-review h3{font-size:16px}.catalog-review p{font-size:12px;line-height:1.5}',
  });
  await page.locator('.catalog-review').screenshot({
    path: test.info().outputPath('new-landmarks-contact-sheet.jpg'),
    type: 'jpeg',
    quality: 80,
  });
  expect(errors).toEqual([]);
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBeNull();
});
