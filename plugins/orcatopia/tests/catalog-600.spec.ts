import { test, expect } from '@playwright/test';
import { empty, landmarks } from '../src/game';
import additions from '../src/catalog-600.json';
import korean from '../src/landmarks.ko.json';

test('600-place journal keeps bilingual new-place details, fusion, gifts and map points compatible with an existing receipt', async ({
  page,
}) => {
  test.setTimeout(120_000);
  const state = empty();
  for (const [index, id] of [
    'eiffel',
    'jam',
    'jam',
    'galapagos',
    'canaima',
    'antiguadockyard',
  ].entries()) {
    const workspaceId = `catalog600-${index}`;
    state.tickets.push({ workspaceId, at: '2026-11-15' });
    state.receipts.push({ workspaceId, landmark: id, at: '2026-11-15' });
  }
  state.placements.push({ landmark: 'eiffel', cell: 0 });
  await page.addInitScript(
    (save) =>
      localStorage.setItem(
        'landmark-island-demo-v1',
        localStorage.getItem('landmark-island-demo-v1') ?? JSON.stringify(save),
      ),
    state,
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const start = Date.now();
  await page.goto('/?lang=ko');
  await page.locator('[data-inventory="landmarks"]').click();
  await expect(page.locator('.collection .card')).toHaveCount(700);
  await expect(page.locator('header .stats strong').first()).toContainText(
    '/ 700',
  );
  await page.locator('#inventory-search').fill('잠의 미나레트');
  await expect(page.locator('.collection .card:visible')).toHaveCount(1);
  await page.locator('[data-info="jam"]').click();
  await expect(page.locator('#detail-description')).toHaveText(
    korean.jam.description,
  );
  await expect(page.locator('.detail-source a')).toHaveAttribute(
    'href',
    'https://whc.unesco.org/en/list/211/',
  );
  await page.locator('[data-fusion="jam"]').click();
  await page.locator('[data-confirm-fusion]').click();
  await expect(page.locator('.fusion-reveal .enhanced-art')).toHaveCount(1);
  await page.keyboard.press('Escape');
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
  );
  expect(saved.receipts).toEqual(state.receipts);
  expect(saved.placements).toEqual(state.placements);
  expect(saved.fusions).toHaveLength(1);
  expect(saved.fusions[0].landmark).toBe('jam');
  await page.locator('#close-inventory').click();
  await page.locator('[data-view="map"]').click();
  await expect(page.locator('.world circle')).toHaveCount(5);
  await expect(
    page.locator('.world circle title').filter({ hasText: '앤티가' }),
  ).toHaveCount(1);
  await expect(page.locator('.countries > span')).toHaveCount(153);
  await test.info().attach('catalog600-journal-timing', {
    body: JSON.stringify({ throughFusionAndMapMs: Date.now() - start }),
    contentType: 'application/json',
  });
  await page.reload();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem('landmark-island-demo-v1')!).receipts,
    ),
  ).toEqual(state.receipts);
});

test('all 294 new illustrations have readable bilingual contact sheets without touching a save', async ({
  page,
}) => {
  test.setTimeout(180_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1200, height: 1000 });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const start = Date.now();
  await page.goto('/?preview=landmark-life&lang=en');
  await expect(page.locator('.life-preview-card')).toHaveCount(700);
  expect(
    await page
      .locator('.life-preview-card .landmark-art')
      .evaluateAll((svgs) => {
        const ids = svgs.flatMap((svg) =>
          [...svg.querySelectorAll('[id]')].map((node) => node.id),
        );
        const missing = svgs.flatMap((svg) =>
          [...svg.querySelectorAll('[fill],[stroke],[clip-path]')].flatMap(
            (node) =>
              ['fill', 'stroke', 'clip-path']
                .map(
                  (attribute) =>
                    node.getAttribute(attribute)?.match(/^url\(#(.+)\)$/)?.[1],
                )
                .filter((ref) => ref && !svg.querySelector(`[id="${ref}"]`)),
          ),
        );
        return { unique: new Set(ids).size === ids.length, missing };
      }),
  ).toEqual({ unique: true, missing: [] });
  const before = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  await page.locator('#life-preview-search').fill('렌소이스');
  await expect(page.locator('.life-preview-card:visible')).toHaveCount(1);
  await page.locator('#life-preview-search').fill('Minaret of Jam');
  await expect(page.locator('#scene-jam')).toBeVisible();
  await page.locator('#life-preview-clear').click();
  const cards = await page.evaluate(
    (ids) => ids.map((id) => document.querySelector(`#scene-${id}`)!.outerHTML),
    additions.map((entry) => entry.id),
  );
  expect(cards).toHaveLength(294);
  const allIds = new Set(landmarks.map((entry) => entry.id));
  expect(additions.every((entry) => allIds.has(entry.id))).toBe(true);
  for (let index = 0; index < cards.length; index += 24) {
    await page.evaluate(
      ({ cards, index }) => {
        document.body.innerHTML = `<main class="contact600"><h1>DEMO · Orcatopia · additions ${index + 1}–${Math.min(index + 24, 294)} / 294</h1><div>${cards.slice(index, index + 24).join('')}</div></main>`;
      },
      { cards, index },
    );
    await page.addStyleTag({
      content:
        '.contact600{padding:16px;background:#eee8d4;color:#375747}.contact600>div{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}.contact600 article{padding:6px;background:#fbf4df;border-radius:8px;min-width:0}.contact600 .detail-art{height:125px}.contact600 h3{font-size:12px}.contact600 p{font-size:9px;line-height:1.25}.contact600 .rarity-badge{font-size:9px}',
    });
    await page.locator('.contact600').screenshot({
      path: test.info().outputPath(`new-places-${index / 24 + 1}.jpg`),
      type: 'jpeg',
      quality: 80,
    });
  }
  expect(errors).toEqual([]);
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(before);
  await test.info().attach('catalog600-preview-timing', {
    body: JSON.stringify({ previewAnd12SheetsMs: Date.now() - start }),
    contentType: 'application/json',
  });
});
