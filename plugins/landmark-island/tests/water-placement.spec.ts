import { test, expect } from '@playwright/test';
import { empty, islandLand } from '../src/game';
import { at } from '../src/world';

for (const language of ['en', 'ko']) {
  test(`sea placement and river mouth survive editing and reload (${language})`, async ({
    page,
  }) => {
    const state = empty();
    state.tickets = [{ workspaceId: 'sea', at: '2026-11-14' }];
    state.receipts = [
      { workspaceId: 'sea', landmark: 'halong', at: '2026-11-14' },
    ];
    const land = new Set(islandLand(state).map((t) => t.id));
    const coast = islandLand(state)
      .sort((a, b) => b.row - a.row)
      .find((t) => {
        const id = at(t.col + 1, t.row);
        return id !== undefined && !land.has(id);
      })!;
    const sea = at(coast.col + 1, coast.row)!;
    state.floors = [
      { cell: coast.id, decoration: 'river' },
      { cell: at(coast.col - 1, coast.row)!, decoration: 'river' },
    ];
    await page.addInitScript((save) => {
      if (!localStorage.getItem('landmark-island-demo-v1')) {
        localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save));
      }
    }, state);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/?lang=${language}`);
    await page.locator('#overview').click();
    await expect(
      page.locator(`[data-floor=river] [data-river-to="${sea}"]`),
    ).toHaveAttribute('data-river-mouth', 'true');
    await page.locator('[data-inventory=landmarks]').click();
    await expect(
      page.locator('[data-catalog-id=halong] [data-placement-type=sea]'),
    ).toHaveText(
      language === 'ko' ? '해상 · 육지 배치도 가능' : 'Sea · Land compatible',
    );
    await page.locator('[data-landmark=halong]').click();
    await page.locator('#zoom-out').click();
    const canvas = (await page.locator('.ocean').boundingBox())!;
    await page.mouse.move(
      canvas.x + canvas.width * 0.97,
      canvas.y + canvas.height * 0.5,
    );
    await page.mouse.down();
    await page.mouse.move(
      canvas.x + canvas.width * 0.97,
      canvas.y + canvas.height * 0.1,
      { steps: 8 },
    );
    await page.mouse.up();
    const target = page.locator(`[data-cell="${sea}"]`);
    await expect(target.locator('..')).toHaveClass(/sea-tile/);
    await target.click();
    await expect(page.locator(`[data-site="${sea}"]`)).toBeVisible();
    await page.locator(`[data-site="${sea}"]`).click();
    await page.locator('#rotate-piece').click();
    await expect(
      page.locator(`[data-world-cell="${sea}"] .building`),
    ).toHaveAttribute('data-rotation', '1');
    await page.reload();
    await page.locator('#overview').click();
    await expect(
      page.locator(`[data-world-cell="${sea}"] .building`),
    ).toHaveAttribute('data-rotation', '1');
    await page.locator('.ocean').screenshot({
      path: `test-results/landmark-island/water-${language}.jpg`,
      type: 'jpeg',
      quality: 80,
    });
    await page.locator(`[data-site="${sea}"]`).click();
    await expect(page.locator('.piece-menu')).toBeVisible();
    const errors = await page.locator('[role=alert]').allTextContents();
    expect(errors.filter(Boolean)).toEqual([]);
  });
}

test('new water gifts, separate filters and sea/river placement work in Korean', async ({
  page,
}) => {
  const state = empty();
  for (const [i, landmark] of [
    'greatbarrierreef',
    'greatbarrierreef',
    'greatbarrierreef',
    'liriver',
  ].entries()) {
    state.tickets.push({ workspaceId: `water-${i}`, at: '2026-11-14' });
    state.receipts.push({
      workspaceId: `water-${i}`,
      landmark,
      at: '2026-11-14',
    });
  }
  state.floors = [0, 1, 2].map((cell) => ({ cell, decoration: 'river' }));
  const open = new Set(islandLand(state).map((t) => t.id));
  const coast = islandLand(state)
    .sort((a, b) => b.row - a.row)
    .find((t) => {
      const next = at(t.col + 1, t.row);
      return next !== undefined && !open.has(next);
    })!;
  const sea = at(coast.col + 1, coast.row)!;
  await page.addInitScript((save) => {
    if (!localStorage.getItem('landmark-island-demo-v1'))
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save));
  }, state);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=ko');
  await page.locator('#overview').click();
  await page.locator('[data-inventory=landmarks]').click();
  await page.locator('#inventory-category').selectOption('river');
  await expect(page.locator('[data-catalog-id=liriver]')).toBeVisible();
  await expect(page.locator('[data-catalog-id=greatbarrierreef]')).toBeHidden();
  await page.locator('[data-inventory=decorations]').click();
  await page.locator('#inventory-category').selectOption('sea');
  await expect(
    page.locator('[data-decor-card=greatbarrierreef-gift] [data-surface=sea]'),
  ).toHaveText('바다 전용');
  await expect(page.locator('[data-decor-card=liriver-gift]')).toBeHidden();
  await page.locator('[data-decor-place=greatbarrierreef-gift]').click();
  const canvas = (await page.locator('.ocean').boundingBox())!;
  await page.mouse.move(
    canvas.x + canvas.width * 0.97,
    canvas.y + canvas.height * 0.5,
  );
  await page.mouse.down();
  await page.mouse.move(
    canvas.x + canvas.width * 0.97,
    canvas.y + canvas.height * 0.1,
    { steps: 8 },
  );
  await page.mouse.up();
  await page.locator(`[data-cell="${sea}"]`).click();
  await expect(
    page.locator(
      `[data-world-cell="${sea}"] [data-decoration=greatbarrierreef-gift]`,
    ),
  ).toBeVisible();
  await page.locator('[data-inventory=decorations]').click();
  await page.locator('#inventory-category').selectOption('river');
  await expect(
    page.locator('[data-decor-card=liriver-gift] [data-surface=river]'),
  ).toHaveText('강 전용');
  await expect(
    page.locator('[data-decor-card=greatbarrierreef-gift]'),
  ).toBeHidden();
  await page.locator('[data-decor-place=liriver-gift]').click();
  await page.locator('#overview').click();
  await page.locator('[data-cell="0"]').click();
  await expect(
    page.locator('[data-world-cell="0"] [data-decoration=liriver-gift]'),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.locator(
      `[data-world-cell="${sea}"] [data-decoration=greatbarrierreef-gift]`,
    ),
  ).toHaveCount(1);
  await expect(
    page.locator('[data-world-cell="0"] [data-decoration=liriver-gift]'),
  ).toHaveCount(1);
  await page.locator('.ocean').screenshot({
    path: 'test-results/landmark-island/water-decorations-ko.jpg',
    type: 'jpeg',
    quality: 80,
  });
});

test('six new marine and river illustrations have distinct silhouettes and readable names', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1100, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?preview=landmark-life&lang=en');
  const ids = [
    'greatbarrierreef',
    'bluehole',
    'geirangerfjord',
    'rockislands',
    'liriver',
    'middlerhine',
  ];
  for (const id of ids)
    await expect(page.locator(`#scene-${id} .expanded-landmark`)).toHaveCount(
      1,
    );
  await page.evaluate((ids) => {
    const cards = ids
      .map((id) => document.querySelector(`#scene-${id}`)!.outerHTML)
      .join('');
    document.body.innerHTML = `<main style="padding:24px"><h1>DEMO · Sea & river discoveries</h1><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">${cards}</div></main>`;
  }, ids);
  await page.locator('main').screenshot({
    path: 'test-results/landmark-island/water-discoveries-en.jpg',
    type: 'jpeg',
    quality: 80,
  });
});
