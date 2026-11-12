import { test, expect } from '@playwright/test';
import { empty } from '../src/game';

for (const [width, language] of [
  [1000, 'en'],
  [360, 'ko'],
] as const)
  test(`landmark click selects actions, Move arms a destination and facing persists at ${width}px`, async ({
    page,
  }) => {
    const state = empty();
    for (const landmark of ['eiffel', 'petra']) {
      state.tickets.push({ workspaceId: landmark, at: '2026-11-08' });
      state.receipts.push({
        workspaceId: landmark,
        landmark,
        at: '2026-11-08',
      });
    }
    state.placements = [
      { landmark: 'eiffel', cell: 0 },
      { landmark: 'petra', cell: 35 },
    ];
    state.floors = [{ decoration: 'path', cell: 0 }];
    const legacy = { ...state, version: 4 };
    await page.addInitScript((save) => {
      if (!localStorage.getItem('landmark-island-demo-v1'))
        localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save));
    }, legacy);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/?lang=${language}`);
    await page.locator('#daylight').selectOption('0');
    await page.locator('#overview').click();
    const camera = await page.locator('.camera').elementHandle();
    const saved = () =>
      page.evaluate(() =>
        JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
      );
    await page.locator('[data-site="0"]').click();
    await expect(page.locator('.landmark-detail')).toBeHidden();
    const menu = page.locator('.piece-menu');
    await expect(menu).toBeVisible();
    await expect(page.locator('.ocean')).toHaveAttribute('data-mode', 'walk');
    expect(await saved()).toEqual(legacy);
    const box = (await menu.boundingBox())!;
    const canvas = (await page.locator('.ocean').boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(canvas.x);
    expect(box.x + box.width).toBeLessThanOrEqual(canvas.x + canvas.width);
    expect(box.y + box.height).toBeLessThanOrEqual(canvas.y + canvas.height);
    await page.locator('.ocean').screenshot({
      path: `test-results/landmark-island/landmark-actions-${language}.png`,
    });
    await page.locator('#rotate-piece').click();
    await expect(
      page.locator('[data-world-cell="0"] .building'),
    ).toHaveAttribute('data-rotation', '1');
    expect((await saved()).version).toBe(6);
    await page.locator('#rotate-left').click();
    await expect(
      page.locator('[data-world-cell="0"] .building'),
    ).toHaveAttribute('data-rotation', '0');
    await page.locator('#rotate-piece').click();
    await page.locator('#move-piece').click();
    await expect(menu).toBeHidden();
    await expect(page.locator('.ocean')).toHaveAttribute('data-mode', 'build');
    await expect(page.locator('[data-cell="0"]')).toHaveClass(/selected/);
    await page.locator('[data-site="35"]').click();
    expect((await saved()).placements[0]).toEqual({
      landmark: 'eiffel',
      cell: 0,
      rotation: 1,
    });
    await expect(page.locator('[data-cell="0"]')).toHaveClass(/selected/);
    await page.locator('[data-cell="2"]').click();
    await expect(
      page.locator('[data-world-cell="2"] .building'),
    ).toHaveAttribute('data-rotation', '1');
    await expect(page.locator('.ocean')).toHaveAttribute('data-mode', 'walk');
    const moved = await saved();
    expect(moved.receipts).toEqual(state.receipts);
    expect(moved.floors).toEqual(state.floors);
    expect(
      await camera!.evaluate(
        (node) => node === document.querySelector('.camera'),
      ),
    ).toBe(true);
    await page.locator('[data-site="2"]').click();
    await page.locator('#move-piece').click();
    await page.keyboard.press('Escape');
    await expect(menu).toBeVisible();
    expect(await saved()).toEqual(moved);
    await page.locator('#cancel').click();
    await expect(menu).toBeHidden();
    await page.reload();
    await expect(
      page.locator('[data-world-cell="2"] .building'),
    ).toHaveAttribute('data-rotation', '1');
    expect(await saved()).toEqual(moved);
  });
