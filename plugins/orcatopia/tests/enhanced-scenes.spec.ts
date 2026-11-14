import { test, expect } from '@playwright/test';
import { empty } from '../src/game';

for (const [id, motion, workers] of [
  ['greatwall', '.wall-porter', 2],
  ['giza', '.pyramid-haul', 3],
] as const) {
  test(`${id} + keeps workers, tools and animation in island, fusion comparison and details`, async ({
    page,
  }) => {
    const state = empty();
    for (let i = 0; i < 5; i++) {
      state.tickets.push({ workspaceId: `scene-${i}`, at: '2026-11-14' });
      state.receipts.push({
        workspaceId: `scene-${i}`,
        landmark: id,
        at: '2026-11-14',
      });
    }
    state.fusions = [{ id: `scene-${id}`, landmark: id, at: '2026-11-14' }];
    state.placements = [
      { landmark: id, cell: 31 },
      { landmark: `${id}+`, cell: 33 },
    ];
    await page.addInitScript((save) => {
      if (!localStorage.getItem('landmark-island-demo-v1'))
        localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save));
    }, state);
    await page.goto('/?lang=ko');
    await page.locator('#daylight').selectOption('0');
    const original = page.locator('[data-world-cell="31"] .landmark-art');
    const plus = page.locator('[data-world-cell="33"] .enhanced-art');
    await expect(original.locator('.site-worker')).toHaveCount(workers);
    await expect(plus.locator('.site-worker')).toHaveCount(workers);
    await expect(plus.locator('.landmark-life')).toHaveCSS('display', 'inline');
    await expect(plus.locator(motion)).toHaveCSS(
      'animation-play-state',
      'running',
    );
    expect(
      await plus
        .locator(motion)
        .evaluate((el) =>
          el.getAnimations().some((a) => a.playState === 'running'),
        ),
    ).toBe(true);
    expect(
      await plus
        .locator('[data-enhanced-layer=back]')
        .evaluate((el) =>
          Boolean(
            el.compareDocumentPosition(
              el.parentElement!.querySelector('.landmark-life')!,
            ) & Node.DOCUMENT_POSITION_FOLLOWING,
          ),
        ),
    ).toBe(true);
    await page.locator('[data-inventory=landmarks]').click();
    await page.locator(`[data-info="${id}"]`).click();
    await page.locator(`[data-fusion="${id}"]`).click();
    const comparison = page.locator('.fusion-preview');
    await expect(
      comparison.locator('.landmark-art:not(.enhanced-art) .site-worker'),
    ).toHaveCount(workers);
    await expect(comparison.locator('.enhanced-art .site-worker')).toHaveCount(
      workers,
    );
    await expect(comparison.locator('.enhanced-art .landmark-life')).toHaveCSS(
      'display',
      'inline',
    );
    await expect(comparison.locator(`.enhanced-art ${motion}`)).toHaveCSS(
      'animation-play-state',
      'running',
    );
    await expect(
      comparison.locator('.enhanced-art .tier-presence').first(),
    ).toHaveCSS('display', 'inline');
    await page.locator('.fusion-confirm').screenshot({
      path: `test-results/landmark-island/${id}-plus-comparison.jpg`,
      type: 'jpeg',
      quality: 80,
    });
    await page.locator('[data-cancel-fusion]').click();
    await page.locator(`[data-info="${id}"]`).click();
    await page.locator(`[data-detail-variant="${id}+"]`).click();
    const detail = page.locator('.landmark-detail .enhanced-art');
    await expect(detail.locator('.site-worker')).toHaveCount(workers);
    await expect(detail.locator(motion)).toHaveCSS(
      'animation-play-state',
      'running',
    );
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(detail.locator('.landmark-life')).toHaveCSS(
      'display',
      'inline',
    );
    await expect(detail.locator(motion)).toHaveCSS('animation-name', 'none');
    await expect(detail.locator('.enhanced-aura')).toHaveCSS(
      'animation-name',
      'none',
    );
    await expect(detail.locator('.enhanced-orbit')).toHaveCSS(
      'animation-name',
      'none',
    );
    await page.locator('.detail-art').screenshot({
      path: `test-results/landmark-island/${id}-plus-still.jpg`,
      type: 'jpeg',
      quality: 80,
    });
    await page.locator('.detail-close').click();
    await page.locator('[data-info=colosseum]').click();
    await page.locator('[data-detail-variant="colosseum+"]').click();
    await expect(page.locator('.landmark-detail .landmark-life')).toHaveCSS(
      'display',
      'none',
    );
  });
}

test('a discovered normal landmark keeps its workers in an unowned + detail preview without granting a copy', async ({
  page,
}) => {
  const state = empty();
  state.tickets = [{ workspaceId: 'known-wall', at: '2026-11-14' }];
  state.receipts = [
    { workspaceId: 'known-wall', landmark: 'greatwall', at: '2026-11-14' },
  ];
  await page.addInitScript(
    (save) =>
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save)),
    state,
  );
  await page.goto('/?lang=ko');
  await page.locator('[data-inventory=landmarks]').click();
  await page.locator('[data-info=greatwall]').click();
  await page.locator('[data-detail-variant="greatwall+"]').click();
  const detail = page.locator('.landmark-detail');
  await expect(detail).toHaveAttribute('data-owned', 'false');
  await expect(detail).toHaveAttribute('data-scene-owned', 'true');
  await expect(detail.locator('.landmark-life')).toHaveCSS('display', 'inline');
  await expect(detail.locator('.site-worker')).toHaveCount(2);
  await expect(detail.locator('.wall-porter')).toHaveCSS(
    'animation-play-state',
    'running',
  );
  await expect(detail.locator('[data-plus-place]')).toBeDisabled();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
  );
  expect(saved.fusions).toEqual([]);
  expect(saved.receipts).toEqual(state.receipts);
  await page.locator('.detail-close').click();
  await page.locator('[data-info=giza]').click();
  await page.locator('[data-detail-variant="giza+"]').click();
  await expect(detail).toHaveAttribute('data-scene-owned', 'false');
  await expect(detail.locator('.landmark-life')).toHaveCSS('display', 'none');
});
