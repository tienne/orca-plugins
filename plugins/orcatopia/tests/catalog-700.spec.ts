import { test, expect } from '@playwright/test';
import { empty, landmarks, validate } from '../src/game';
import catalog from '../src/catalog-700.json';
import { collectionSnapshot } from './tourism-state';

test('700-place journal reads and fuses new sea and river places without catalog-load rewards', async ({
  page,
}) => {
  const state = empty();
  state.discoveredPlaces = landmarks.slice(0, 25).map((e) => e.id);
  for (const [i, id] of [
    'eiffel',
    'eddystone',
    'eddystone',
    'towerbridge',
    'towerbridge',
  ].entries()) {
    const workspaceId = `water700-${i}`;
    state.tickets.push({ workspaceId, at: '2026-11-17' });
    state.receipts.push({ workspaceId, landmark: id, at: '2026-11-17' });
  }
  state.placements.push({ landmark: 'eiffel', cell: 0 });
  const normalized = validate(state);
  await page.addInitScript((save) => {
    if (!localStorage.getItem('landmark-island-demo-v1'))
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save));
  }, normalized);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=ko');
  expect(
    collectionSnapshot(
      await page.evaluate(() =>
        localStorage.getItem('landmark-island-demo-v1'),
      ),
    ),
  ).toEqual(collectionSnapshot(normalized));
  await page.locator('[data-inventory="landmarks"]').click();
  await expect(page.locator('.collection .card')).toHaveCount(700);
  for (const id of ['eddystone', 'towerbridge']) {
    const entry = catalog.find((e) => e.record.id === id)!;
    await page.locator('#inventory-search').fill(entry.korean.name);
    await expect(page.locator('.collection .card:visible')).toHaveCount(1);
    await page.locator(`[data-info="${id}"]`).click();
    await expect(page.locator('#detail-description')).toHaveText(
      entry.korean.description,
    );
    await expect(page.locator('.detail-source a')).toHaveAttribute(
      'href',
      entry.record.descriptionSource,
    );
    await expect(
      page.locator(`.landmark-detail [data-water-place="${id}"]`),
    ).toBeVisible();
    await page.locator(`[data-fusion="${id}"]`).click();
    await page.locator('[data-confirm-fusion]').click();
    await expect(
      page.locator(`.fusion-reveal [data-water-place="${id}"]`),
    ).toHaveCount(1);
    await expect(
      page.locator(`.fusion-reveal [data-landmark-life="${id}"]`),
    ).toHaveCount(1);
    await page.keyboard.press('Escape');
  }
  const after = JSON.parse(
    (await page.evaluate(() =>
      localStorage.getItem('landmark-island-demo-v1'),
    ))!,
  );
  expect(after.receipts).toEqual(state.receipts);
  expect(after.tickets).toEqual(state.tickets);
  expect(after.placements).toEqual(state.placements);
  expect(after.fusions.map((f: { landmark: string }) => f.landmark)).toEqual([
    'eddystone',
    'towerbridge',
  ]);
  await page.reload();
  expect(
    JSON.parse(
      (await page.evaluate(() =>
        localStorage.getItem('landmark-island-demo-v1'),
      ))!,
    ).fusions,
  ).toEqual(after.fusions);
});

test('all 100 water miniatures have English DEMO contact sheets at preview and placement sizes', async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1200, height: 1100 });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const start = Date.now();
  await page.goto('/?preview=landmark-life&lang=en');
  await expect(page.locator('.life-preview-card')).toHaveCount(700);
  const invalidPaths = await page
    .locator('[data-water-place] path')
    .evaluateAll((paths) =>
      paths.flatMap((element) => {
        const path = element as SVGPathElement;
        try {
          return path.getTotalLength() > 0 ? [] : [path.getAttribute('d')];
        } catch {
          return [path.getAttribute('d')];
        }
      }),
    );
  expect(invalidPaths).toEqual([]);
  const cards = await page.evaluate(
    (ids) =>
      ids.map((id) => {
        const card = document.querySelector(`#scene-${id}`)!;
        return {
          id,
          html: card.outerHTML,
          art: card.querySelector('.detail-art')!.innerHTML,
        };
      }),
    catalog.map((e) => e.record.id),
  );
  for (let i = 0; i < cards.length; i += 20) {
    await page.evaluate(
      ({ cards, index }) => {
        document.body.innerHTML = `<main class="water700-sheet"><h1>DEMO · Orcatopia · water additions ${index + 1}–${index + cards.length} / 100</h1><div>${cards.map((card) => `<section>${card.html}<div class="nominal sea">${card.art}</div><div class="nominal river">${card.art}</div></section>`).join('')}</div></main>`;
      },
      { cards: cards.slice(i, i + 20), index: i },
    );
    await page.addStyleTag({
      content:
        '.water700-sheet{padding:16px;background:#eee8d4;color:#375747}.water700-sheet>div{display:grid;grid-template-columns:repeat(5,1fr);gap:9px}.water700-sheet section{background:#fbf4df;padding:7px;border-radius:8px;min-width:0}.water700-sheet article{display:block!important;margin:0;padding:0}.water700-sheet .detail-art{height:110px}.water700-sheet h3{font-size:12px;min-height:29px}.water700-sheet p{font-size:9px;line-height:1.3;min-height:32px}.water700-sheet .nominal{display:inline-flex;width:48%;height:52px;align-items:center;justify-content:center}.water700-sheet .nominal svg{width:40px!important;height:44px!important}.water700-sheet .sea{background:#358c9a}.water700-sheet .river{background:#93c4c0}',
    });
    await page.locator('.water700-sheet').screenshot({
      path: test.info().outputPath(`water700-${i / 20 + 1}.jpg`),
      type: 'jpeg',
      quality: 80,
    });
  }
  expect(errors).toEqual([]);
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBeNull();
  await test.info().attach('water700-preview-timing', {
    body: JSON.stringify({ throughContactSheetsMs: Date.now() - start }),
    contentType: 'application/json',
  });
});
