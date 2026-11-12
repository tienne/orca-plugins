import { test, expect } from '@playwright/test';
import { empty } from '../src/game';

for (const [language, width] of [
  ['en', 1000],
  ['ko', 360],
] as const) {
  test(`fusion protects placed copies, separates + details and unlocks its decoration (${language})`, async ({
    page,
  }) => {
    const state = empty();
    for (let i = 0; i < 3; i++) {
      state.tickets.push({ workspaceId: `f-${i}`, at: '2026-11-13' });
      state.receipts.push({
        workspaceId: `f-${i}`,
        landmark: 'eiffel',
        at: '2026-11-13',
      });
    }
    state.placements = [{ landmark: 'eiffel', cell: 0 }];
    await page.addInitScript((save) => {
      if (!localStorage.getItem('landmark-island-demo-v1'))
        localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save));
    }, state);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/?lang=${language}`);
    await page.locator('[data-inventory="landmarks"]').click();
    await page.locator('[data-info="eiffel"]').click();
    await page.locator('[data-fusion="eiffel"]').click();
    await expect(page.locator('.fusion-confirm')).toBeVisible();
    await page.locator('[data-confirm-fusion]').click();
    await expect(page.locator('.fusion-reveal.revealed')).toBeVisible();
    await expect(
      page.locator('.fusion-reveal .reveal-badge .rarity-number'),
    ).toHaveText('II+');
    await expect(page.locator('.fusion-reveal .enhanced-art')).toHaveCount(1);
    await expect(page.locator('.fusion-reveal .enhanced-aura')).toHaveCSS(
      'animation-name',
      'none',
    );
    await page.locator('.fusion-reveal').screenshot({
      path: `test-results/fusion-${language}.jpg`,
      type: 'jpeg',
      quality: 80,
    });
    await page
      .locator('.fusion-reveal .reveal-actions button')
      .filter({ hasText: language === 'ko' ? '+ 사전 보기' : 'View + details' })
      .click();
    await expect(page.locator('#detail-title')).toHaveText(
      language === 'ko' ? '에펠탑 +' : 'Eiffel Tower +',
    );
    await expect(page.locator('.variant-details')).toContainText(
      language === 'ko' ? '보유 ×1' : 'Owned ×1',
    );
    await expect(page.locator('[data-fusion]')).toHaveCount(0);
    await page.locator('[data-plus-decor]').click();
    await expect(
      page.locator('[data-decor-card="eiffel-plus-star"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-decor-card="eiffel-plus-star"]'),
    ).toContainText(language === 'ko' ? '보유 ×1' : 'Owned ×1');
    await page.locator('[data-decor-place="eiffel-plus-star"]').click();
    await page.locator('#overview').click();
    await page.locator('.cell[data-cell="2"]').click();
    await page.locator('[data-inventory="landmarks"]').click();
    await page.locator('[data-variant="plus"]').click();
    await page.locator('[data-landmark="eiffel+"]').click();
    await page.locator('.cell[data-cell="7"]').click();
    await page.reload();
    await expect(
      page.locator('[data-world-cell="7"] .enhanced-art'),
    ).toHaveCount(1);
    const saved = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
    );
    expect(saved.fusions).toHaveLength(1);
    expect(saved.receipts).toEqual(state.receipts);
    expect(saved.placements).toContainEqual(state.placements[0]);
    expect(saved.placements).toContainEqual({ landmark: 'eiffel+', cell: 7 });
    expect(saved.decorations).toContainEqual({
      decoration: 'eiffel-plus-star',
      cell: 2,
    });
    await page.locator('[data-inventory="landmarks"]').click();
    await page.locator('[data-info="eiffel"]').click();
    await expect(page.locator('[data-fusion]')).toBeDisabled();
  });
}

test('failed fusion save retains a stable retry and commits once', async ({
  page,
}) => {
  const save = empty();
  for (let i = 0; i < 2; i++) {
    save.tickets.push({ workspaceId: `r-${i}`, at: '2026-11-13' });
    save.receipts.push({
      workspaceId: `r-${i}`,
      landmark: 'eiffel',
      at: '2026-11-13',
    });
  }
  await page.addInitScript((s) => {
    localStorage.setItem('landmark-island-demo-v1', JSON.stringify(s));
    const set = Storage.prototype.setItem;
    let fail = true;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'landmark-island-demo-v1' && fail) {
        fail = false;
        throw Error('Simulated disk full');
      }
      return set.call(this, key, value);
    };
  }, save);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=en');
  await page.locator('[data-inventory="landmarks"]').click();
  await page.locator('[data-info="eiffel"]').click();
  await page.locator('[data-fusion]').click();
  await page.locator('[data-confirm-fusion]').click();
  await expect(page.locator('.fusion-error')).toContainText(
    'Simulated disk full',
  );
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem('landmark-island-demo-v1')!).fusions,
    ),
  ).toHaveLength(0);
  await page.locator('[data-confirm-fusion]').click();
  await expect(page.locator('.fusion-reveal')).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem('landmark-island-demo-v1')!).fusions,
    ),
  ).toHaveLength(1);
});

test('drawing after fusion reports current ownership and retains duplicate rewards', async ({
  page,
}) => {
  const save = empty();
  for (let i = 0; i < 3; i++)
    save.tickets.push({ workspaceId: `draw-${i}`, at: '2026-11-13' });
  save.receipts = save.tickets
    .slice(0, 2)
    .map((t) => ({ ...t, landmark: 'eiffel' }));
  save.fusions = [{ id: 'prior-fusion', landmark: 'eiffel', at: '2026-11-13' }];
  const { landmarks } = await import('../src/game');
  const pool = landmarks.filter((l) => l.tier === 'rare');
  const roll = (pool.findIndex((l) => l.id === 'eiffel') + 0.5) / pool.length;
  await page.addInitScript(
    ({ save, roll }) => {
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save));
      let i = 0;
      Math.random = () => [0.8, roll][i++ % 2];
    },
    { save, roll },
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=en');
  await page.locator('#open-treasure').click();
  await page.locator('#draw-ticket').click();
  await expect(page.locator('.discovery-theatre.revealed')).toBeVisible();
  await expect(page.locator('.discovery-status')).toHaveText(
    'Already discovered',
  );
  await expect(page.locator('.reveal-quantity')).toContainText('Owned ×1');
  await expect(page.locator('.reveal-bonus')).toContainText('+3 materials');
});
