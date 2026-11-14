import { test, expect, type Page } from '@playwright/test';
import { empty } from '../src/game';

async function exposedEmptyCell(page: Page) {
  const cell = await page
    .locator('.cell:not(.occupied)')
    .evaluateAll((buttons) => {
      const match = buttons.find((button) => {
        const bounds = button.getBoundingClientRect();
        return (
          document.elementFromPoint(
            bounds.x + bounds.width / 2,
            bounds.y + bounds.height / 2,
          ) === button
        );
      });
      return (match as HTMLElement | undefined)?.dataset.cell;
    });
  expect(cell).toBeDefined();
  return page.locator(`[data-cell="${cell}"]`);
}

for (const [width, language] of [
  [1000, 'en'],
  [360, 'ko'],
] as const) {
  test(`unplaced landmark tray places copies and + versions, updates after undo and return at ${width}px`, async ({
    page,
  }) => {
    const state = empty();
    for (const [i, landmark] of [
      'eiffel',
      'eiffel',
      'eiffel',
      'eiffel',
      'halong',
      'liriver',
      'petra',
    ].entries()) {
      state.tickets.push({ workspaceId: `ready-${i}`, at: '2026-11-14' });
      state.receipts.push({
        workspaceId: `ready-${i}`,
        landmark,
        at: '2026-11-14',
      });
    }
    state.fusions = [
      { id: 'ready-fusion', landmark: 'eiffel', at: '2026-11-14' },
    ];
    state.placements = [
      { landmark: 'eiffel', cell: 0 },
      { landmark: 'petra', cell: 35 },
    ];
    await page.addInitScript((save) => {
      if (!localStorage.getItem('landmark-island-demo-v1'))
        localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save));
    }, state);
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/?lang=${language}`);
    await expect(page.locator('.ready-landmarks')).toHaveCount(0);
    await page.locator('[data-mode=build]').click();
    const tray = page.locator('.ready-landmarks');
    await expect(tray).toBeVisible();
    await expect(tray.locator('.ready-landmark-heading strong')).toHaveText(
      language === 'ko' ? '미배치 랜드마크' : 'Unplaced landmarks',
    );
    await expect(tray.locator('[data-place-ready]')).toHaveCount(4);
    await expect(tray.locator('[data-place-ready=eiffel]')).toHaveAttribute(
      'data-ready-count',
      '1',
    );
    await expect(tray.locator('[data-place-ready="eiffel+"]')).toHaveAttribute(
      'data-ready-count',
      '1',
    );
    await expect(tray.locator('[data-place-ready=petra]')).toHaveCount(0);
    await expect(tray.locator('[data-place-ready=fuji]')).toHaveCount(0);
    await tray.locator('[data-place-ready=eiffel]').click();
    await expect(tray).toHaveCount(0);
    await expect(page.locator('#stop-placing')).toBeVisible();
    const target = await exposedEmptyCell(page);
    const cell = await target.getAttribute('data-cell');
    const camera = await page.locator('.camera').elementHandle();
    await target.click();
    await expect(tray.locator('[data-place-ready=eiffel]')).toHaveCount(0);
    await expect(tray.locator('[data-place-ready="eiffel+"]')).toHaveCount(1);
    expect(await camera!.evaluate((el) => el.isConnected)).toBe(true);
    await page.locator('#undo-layout').click();
    await expect(tray.locator('[data-place-ready=eiffel]')).toHaveAttribute(
      'data-ready-count',
      '1',
    );
    await tray.locator('[data-place-ready=eiffel]').click();
    await page.locator(`[data-cell="${cell}"]`).click();
    await expect(tray.locator('[data-place-ready=eiffel]')).toHaveCount(0);
    await page.locator(`[data-site="${cell}"]`).click();
    await expect(tray).toHaveCount(0);
    await page.locator('#remove').click();
    await expect(tray.locator('[data-place-ready=eiffel]')).toHaveAttribute(
      'data-ready-count',
      '1',
    );
    await tray.locator('[data-place-ready="eiffel+"]').click();
    await (await exposedEmptyCell(page)).click();
    await expect(tray.locator('[data-place-ready="eiffel+"]')).toHaveCount(0);
    await expect(tray.locator('[data-place-ready=eiffel]')).toHaveAttribute(
      'data-ready-count',
      '1',
    );
    if (width === 360) {
      const list = tray.locator('.ready-landmark-list');
      await list.evaluate((el) => {
        el.scrollLeft = el.scrollWidth;
      });
      const before = await list.evaluate((el) => el.scrollLeft);
      expect(before).toBeGreaterThan(0);
      await tray.locator('[data-place-ready=liriver]').click();
      await expect(tray).toHaveCount(0);
      await page.locator('#stop-placing').click();
      expect(await list.evaluate((el) => el.scrollLeft)).toBeCloseTo(before, 0);
    }
    await page.locator('.canvas-editor').screenshot({
      path: `test-results/landmark-island/ready-landmarks-${language}.jpg`,
      type: 'jpeg',
      quality: 80,
    });
    await page.locator('.finish-arranging').click();
    await expect(tray).toHaveCount(0);
    await page.reload();
    await page.locator('[data-mode=build]').click();
    await expect(tray.locator('[data-place-ready=eiffel]')).toHaveAttribute(
      'data-ready-count',
      '1',
    );
    await expect(tray.locator('[data-place-ready="eiffel+"]')).toHaveCount(0);
  });
}

test('the tray shows an empty state before discovery and after all copies are placed', async ({
  page,
}) => {
  await page.goto('/?lang=en');
  await page.locator('[data-mode=build]').click();
  await expect(page.locator('.ready-landmark-empty')).toHaveText(
    'Discover a landmark to place it here.',
  );
  const state = empty();
  state.tickets = [{ workspaceId: 'only', at: '2026-11-14' }];
  state.receipts = [
    { workspaceId: 'only', landmark: 'eiffel', at: '2026-11-14' },
  ];
  state.placements = [{ landmark: 'eiffel', cell: 0 }];
  await page.evaluate(
    (save) =>
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save)),
    state,
  );
  await page.reload();
  await page.locator('[data-mode=build]').click();
  await expect(page.locator('.ready-landmark-empty')).toHaveText(
    'All owned landmarks are placed.',
  );
});
