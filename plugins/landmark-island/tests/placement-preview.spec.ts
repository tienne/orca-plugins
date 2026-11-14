import { test, expect, type Page } from '@playwright/test';
import { empty } from '../src/game';

async function pointOnCell(page: Page, selector: string) {
  const point = await page.locator(selector).evaluateAll((cells) => {
    for (const cell of cells) {
      const box = cell.getBoundingClientRect();
      const x = box.x + box.width / 2,
        y = box.y + box.height / 2;
      const tile = document
        .elementFromPoint(x, y)
        ?.closest<HTMLElement>('[data-world-cell]');
      if (tile && tile.dataset.worldCell === (cell as HTMLElement).dataset.cell)
        return { x, y, cell: tile.dataset.worldCell! };
    }
    return null;
  });
  expect(point, `an exposed tile for ${selector}`).not.toBeNull();
  return point!;
}

async function start(page: Page) {
  const state = empty();
  for (const [i, landmark] of [
    'eiffel',
    'eiffel',
    'petra',
    'halong',
    'liriver',
  ].entries()) {
    state.tickets.push({ workspaceId: `preview-${i}`, at: '2026-11-14' });
    state.receipts.push({
      workspaceId: `preview-${i}`,
      landmark,
      at: '2026-11-14',
    });
  }
  state.placements = [
    { landmark: 'eiffel', cell: 0 },
    { landmark: 'petra', cell: 35 },
  ];
  state.floors = [{ cell: 3, decoration: 'river' }];
  await page.addInitScript((save) => {
    if (!localStorage.getItem('landmark-island-demo-v1'))
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save));
  }, state);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=ko');
  await page.locator('#overview').click();
  await page.locator('[data-mode=build]').click();
}

test('picking a landmark hides the tray; the cursor preview follows, rejects occupied cells and never saves hover state', async ({
  page,
}) => {
  await start(page);
  const saved = () =>
    page.evaluate(() =>
      JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
    );
  const before = await saved();
  await page.locator('[data-place-ready=eiffel]').click();
  await expect(page.locator('.ready-landmarks')).toHaveCount(0);
  const preview = page.locator('.placement-preview');
  await expect(preview).toHaveAttribute('data-landmark', 'eiffel');
  const first = await pointOnCell(
    page,
    '.cell:not(.occupied):not([data-cell="3"])',
  );
  await page.mouse.move(first.x, first.y);
  await expect(preview).toBeVisible();
  await expect(preview).toHaveAttribute('data-valid', 'true');
  await expect(preview).toHaveAttribute('data-preview-cell', first.cell);
  const firstBox = (await preview.boundingBox())!;
  expect(firstBox.x + firstBox.width / 2).toBeCloseTo(first.x, 0);
  expect(firstBox.y + firstBox.height).toBeCloseTo(first.y, 0);
  await page.mouse.move(first.x + 4, first.y);
  await expect
    .poll(async () => (await preview.boundingBox())!.x)
    .toBeCloseTo(firstBox.x + 4, 0);
  expect(await saved()).toEqual(before);
  const occupied = await pointOnCell(page, '.cell.occupied');
  await page.mouse.move(occupied.x, occupied.y);
  await expect(preview).toHaveAttribute('data-valid', 'false');
  await expect(page.locator(`[data-cell="${occupied.cell}"]`)).toHaveAttribute(
    'data-preview-valid',
    'false',
  );
  await page.mouse.click(occupied.x, occupied.y);
  await expect(page.locator('.ready-landmarks')).toHaveCount(0);
  expect(await saved()).toEqual(before);
  await page.keyboard.press('Escape');
  await expect(preview).toHaveCount(0);
  await expect(page.locator('.placement-target')).toHaveCount(0);
  await expect(page.locator('[data-place-ready=eiffel]')).toBeVisible();
  await page.locator('[data-place-ready=eiffel]').click();
  const destination = await pointOnCell(
    page,
    '.cell:not(.occupied):not([data-cell="3"])',
  );
  await page.mouse.move(destination.x, destination.y);
  await expect(preview).toHaveAttribute('data-valid', 'true');
  await page.locator('.ocean').screenshot({
    path: 'test-results/landmark-island/placement-preview-ko.jpg',
    type: 'jpeg',
    quality: 80,
  });
  await page.mouse.click(destination.x, destination.y);
  await expect(preview).toHaveCount(0);
  await expect(page.locator('.ready-landmarks')).toBeVisible();
  await expect(page.locator('[data-place-ready=eiffel]')).toHaveCount(0);
  expect((await saved()).placements).toContainEqual({
    landmark: 'eiffel',
    cell: Number(destination.cell),
  });
});

test('sea and river previews use their own surfaces and hide over menus or outside the island', async ({
  page,
}) => {
  await start(page);
  await page.locator('[data-place-ready=halong]').click();
  const preview = page.locator('.placement-preview');
  const land = await pointOnCell(
    page,
    '.world-tile:not(.sea-tile) .cell:not(.occupied):not([data-cell="3"])',
  );
  await page.mouse.move(land.x, land.y);
  await expect(preview).toHaveAttribute('data-valid', 'true');
  const river = await pointOnCell(page, '[data-cell="3"]');
  await page.mouse.move(river.x, river.y);
  await expect(preview).toHaveAttribute('data-valid', 'false');
  const sea = await pointOnCell(page, '.sea-tile .cell');
  await page.mouse.move(sea.x, sea.y);
  await expect(preview).toHaveAttribute('data-valid', 'true');
  await page.locator('#stop-placing').hover();
  await expect(preview).toBeHidden();
  await page.mouse.move(sea.x, sea.y);
  await expect(preview).toBeVisible();
  await page.mouse.move(1, 1);
  await expect(preview).toBeHidden();
  await page.locator('#stop-placing').click();
  await page.locator('[data-place-ready=liriver]').click();
  await page.mouse.move(river.x, river.y);
  await expect(preview).toHaveAttribute('data-valid', 'true');
  await page.mouse.move(sea.x, sea.y);
  await expect(preview).toHaveAttribute('data-valid', 'false');
  const nextLand = await pointOnCell(
    page,
    '.world-tile:not(.sea-tile) .cell:not(.occupied):not([data-cell="3"])',
  );
  await page.mouse.move(nextLand.x, nextLand.y);
  await expect(preview).toHaveAttribute('data-valid', 'true');
  await page.locator('#stop-placing').click();
  await expect(preview).toHaveCount(0);
  await expect(page.locator('.ready-landmarks')).toBeVisible();
});

test.describe('touch placement', () => {
  test.use({ hasTouch: true, viewport: { width: 360, height: 950 } });
  test('touch selection keeps the preview hidden and places with a tap', async ({
    page,
  }) => {
    await start(page);
    await page.locator('[data-place-ready=eiffel]').tap();
    await expect(page.locator('.ready-landmarks')).toHaveCount(0);
    await expect(page.locator('.placement-preview')).toBeHidden();
    const destination = await pointOnCell(
      page,
      '.cell:not(.occupied):not([data-cell="3"])',
    );
    await page.touchscreen.tap(destination.x, destination.y);
    await expect(page.locator('.placement-preview')).toHaveCount(0);
    await expect(page.locator('.ready-landmarks')).toBeVisible();
    await expect(
      page.locator(`[data-world-cell="${destination.cell}"] .building`),
    ).toHaveCount(1);
  });
});
