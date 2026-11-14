import { test, expect, type Page } from '@playwright/test';
import { empty } from '../src/game';

async function seed(page: Page, withPlus = false) {
  const state = empty();
  const ids = [...Array(withPlus ? 6 : 3).fill('greatwall'), 'petra'];
  for (const [i, landmark] of ids.entries()) {
    state.tickets.push({ workspaceId: `placed-${i}`, at: '2026-11-14' });
    state.receipts.push({
      workspaceId: `placed-${i}`,
      landmark,
      at: '2026-11-14',
    });
  }
  state.placements = [
    { landmark: 'greatwall', cell: 31 },
    { landmark: 'greatwall', cell: 33, rotation: 1 },
    { landmark: 'petra', cell: 0 },
  ];
  if (withPlus) {
    state.fusions = [0, 1].map((i) => ({
      id: `prior-${i}`,
      landmark: 'greatwall',
      at: '2026-11-14',
    }));
    state.placements.push(
      { landmark: 'greatwall+', cell: 7 },
      { landmark: 'greatwall+', cell: 35 },
    );
  } else state.placements.push({ landmark: 'greatwall', cell: 35 });
  state.floors = [
    { decoration: 'path', cell: 31 },
    { decoration: 'stonepath', cell: 33 },
  ];
  await page.addInitScript((save) => {
    if (!localStorage.getItem('landmark-island-demo-v1'))
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save));
  }, state);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=ko');
  await page.locator('#daylight').selectOption('0');
  return state;
}
const saved = (page: Page) =>
  page.evaluate(() =>
    JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
  );
async function overlap(page: Page) {
  await page.locator('[data-site="31"]').click();
  await page.locator('#move-piece').click();
  await page.locator('[data-site="33"]').hover();
  await expect(page.locator('.placement-preview')).toHaveAttribute(
    'data-action',
    'merge',
  );
  await expect(page.locator('.placement-preview-status')).toHaveText('+');
  await page.locator('[data-site="33"]').click();
  await expect(page.locator('.fusion-confirm')).toBeVisible();
}

for (const width of [1000, 360]) {
  test(`overlap confirms placed fusion while preserving destination and floors at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    const initial = await seed(page);
    await overlap(page);
    await expect(page.locator('.fusion-confirm')).toContainText(
      '출발 32번 칸 → 목적지 34번 칸',
    );
    expect(await saved(page)).toEqual(initial);
    await page.locator('[data-cancel-fusion]').click();
    expect(await saved(page)).toEqual(initial);
    await page.locator('[data-site="33"]').click();
    await page.locator('.fusion-confirm').screenshot({
      path: `test-results/landmark-island/placed-fusion-${width}.jpg`,
      type: 'jpeg',
      quality: 80,
    });
    await page.locator('[data-confirm-fusion]').click();
    await expect(page.locator('.fusion-reveal.revealed')).toBeVisible();
    await expect(page.locator('.reveal-place')).toHaveText('섬에서 보기');
    const next = await saved(page);
    expect(next.placements).toEqual([
      { landmark: 'petra', cell: 0 },
      { landmark: 'greatwall', cell: 35 },
      { landmark: 'greatwall+', cell: 33, rotation: 1 },
    ]);
    expect(next.floors).toEqual(initial.floors);
    expect(next.receipts).toEqual(initial.receipts);
    expect(next.fusions).toHaveLength(1);
    expect(next.fusions[0]).toMatchObject({
      landmark: 'greatwall',
      from: 31,
      cell: 33,
    });
    await page.locator('.reveal-place').click();
    await expect(page.locator('.piece-menu')).toBeVisible();
    await expect(page.locator('.piece-menu #piece-title')).toContainText('+');
    await expect(page.locator('.placement-preview')).toHaveCount(0);
    await expect(page.locator('[data-world-cell="31"] .building')).toHaveCount(
      0,
    );
    await expect(
      page.locator('[data-world-cell="33"] .building'),
    ).toHaveAttribute('data-rotation', '1');
    await page.reload();
    await expect(
      page.locator('[data-world-cell="33"] .enhanced-art'),
    ).toHaveCount(1);
    expect((await saved(page)).fusions[0]).toMatchObject({
      from: 31,
      cell: 33,
    });
  });
}

test('different landmarks and + pairs cannot be merged by moving', async ({
  page,
}) => {
  const initial = await seed(page, true);
  await page.locator('[data-site="31"]').click();
  await page.locator('#move-piece').click();
  await page.locator('[data-site="0"]').hover();
  await expect(page.locator('.placement-preview')).toHaveAttribute(
    'data-valid',
    'false',
  );
  await page.locator('[data-site="0"]').click();
  await expect(page.locator('.fusion-confirm')).toHaveCount(0);
  expect(await saved(page)).toEqual(initial);
  await page.locator('#cancel').click();
  await page.locator('#cancel').click();
  await page.locator('[data-site="7"]').click();
  await page.locator('#move-piece').click();
  await page.locator('[data-site="35"]').hover();
  await expect(page.locator('.placement-preview')).toHaveAttribute(
    'data-valid',
    'false',
  );
  await page.locator('[data-site="35"]').click();
  await expect(page.locator('.fusion-confirm')).toHaveCount(0);
  expect(await saved(page)).toEqual(initial);
});

test('changing the layout after confirmation opens refuses the stale fusion without consuming copies', async ({
  page,
}) => {
  await seed(page);
  await overlap(page);
  const changed = await page.evaluate(() => {
    const save = JSON.parse(localStorage.getItem('landmark-island-demo-v1')!);
    save.floors.push({ decoration: 'grass', cell: 3 });
    localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save));
    return save;
  });
  await page.locator('[data-confirm-fusion]').click();
  await expect(page.locator('[data-confirm-fusion]')).toBeDisabled();
  await expect(page.locator('[data-confirm-fusion]')).toContainText(
    '배치가 바뀌었어요',
  );
  await expect(page.locator('[data-cancel-fusion]')).toBeEnabled();
  expect(await saved(page)).toEqual(changed);
  await page.locator('[data-cancel-fusion]').click();
  await page.locator('#refresh').click();
  await page.locator('[data-site="33"]').click();
  await page.locator('[data-confirm-fusion]').click();
  await expect(page.locator('.fusion-reveal.revealed')).toBeVisible();
  expect((await saved(page)).fusions).toHaveLength(1);
});
