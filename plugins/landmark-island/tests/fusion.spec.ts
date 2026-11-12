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
    await expect(page.locator('[data-cancel-fusion]')).toHaveText(
      language === 'ko' ? '취소' : 'Cancel',
    );
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
    await page.locator('[data-variant="plus"]').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-variant="plus"]')).toBeFocused();
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
  for (let i = 0; i < 2; i++) {
    save.tickets.push({ workspaceId: `petra-${i}`, at: '2026-11-13' });
    save.receipts.push({
      workspaceId: `petra-${i}`,
      landmark: 'petra',
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
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    const style = document.documentElement.style;
    style.setProperty('--orca-popover', '#102030');
    style.setProperty('--orca-popover-foreground', '#eef2f6');
    style.setProperty('--orca-border', '#618fab');
    style.setProperty('--orca-radius', '7px');
    style.setProperty('--orca-destructive', '#ffb09f');
  });
  const confirm = page.locator('.fusion-confirm');
  await expect(confirm).toHaveCSS('background-color', 'rgb(16, 32, 48)');
  await expect(confirm).toHaveCSS('color', 'rgb(238, 242, 246)');
  await expect(confirm).toHaveCSS('border-top-color', 'rgb(97, 143, 171)');
  await expect(confirm).toHaveCSS('border-top-left-radius', '7px');
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
  const contrast = await page.locator('.fusion-error').evaluate((node) => {
    const luminance = (value: string) => {
      const rgb = value
        .match(/\d+/g)!
        .slice(0, 3)
        .map(Number)
        .map((v) => {
          const c = v / 255;
          return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
      return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
    };
    const a = luminance(getComputedStyle(node).color);
    const b = luminance(
      getComputedStyle(node.closest('dialog')!).backgroundColor,
    );
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  });
  expect(contrast).toBeGreaterThanOrEqual(4.5);
  await expect(page.locator('.fusion-error')).toHaveCSS(
    'color',
    'rgb(255, 176, 159)',
  );
  await page.evaluate(() => {
    const style = document.documentElement.style;
    style.setProperty('--orca-popover', '#fffafe');
    style.setProperty('--orca-popover-foreground', '#1f2937');
    style.setProperty('--orca-border', '#475569');
    style.setProperty('--orca-radius', '13px');
    style.setProperty('--orca-destructive', '#9f1239');
  });
  await expect(confirm).toBeVisible();
  await expect(confirm).toHaveCSS('background-color', 'rgb(255, 250, 254)');
  await expect(confirm).toHaveCSS('color', 'rgb(31, 41, 55)');
  await expect(confirm).toHaveCSS('border-top-left-radius', '13px');
  await expect(page.locator('.fusion-error')).toHaveCSS(
    'color',
    'rgb(159, 18, 57)',
  );
  await page.locator('[data-cancel-fusion]').click();
  await page.locator('[data-info="petra"]').click();
  await page.locator('[data-fusion="petra"]').click();
  await page.locator('[data-confirm-fusion]').click();
  await expect(page.locator('.fusion-reveal')).toBeVisible();
  await page.locator('.fusion-reveal .reveal-keep').click();
  await page.locator('[data-info="eiffel"]').click();
  await expect(page.locator('[data-fusion="eiffel"]')).toHaveText(
    'Retry fusion',
  );
  await page.locator('[data-fusion="eiffel"]').click();
  await page.locator('[data-confirm-fusion]').click();
  await expect(page.locator('.fusion-reveal')).toBeVisible();
  await page.locator('.fusion-reveal .reveal-keep').click();
  await expect(page.locator('[data-catalog-id="eiffel"]')).not.toHaveClass(
    /locked/,
  );
  await expect(page.locator('[data-catalog-id="eiffel"]')).toContainText(
    'Owned ×0',
  );
  await expect(page.locator('[data-landmark="eiffel"]')).toBeDisabled();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem('landmark-island-demo-v1')!).fusions,
    ),
  ).toHaveLength(2);
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

test('fusion keeps detail scenes unlocked and refresh recognizes a historic duplicate', async ({
  page,
}) => {
  const save = empty();
  for (let i = 0; i < 3; i++)
    save.tickets.push({ workspaceId: `sync-${i}`, at: '2026-11-13' });
  save.receipts = save.tickets
    .slice(0, 2)
    .map((t) => ({ ...t, landmark: 'petra' }));
  save.fusions = [{ id: 'fused-petra', landmark: 'petra', at: '2026-11-13' }];
  await page.addInitScript(
    (state) =>
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(state)),
    save,
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=en');
  await page.locator('[data-inventory="landmarks"]').click();
  await expect(page.locator('[data-catalog-id="petra"]')).toContainText(
    'Owned ×0',
  );
  await page.locator('[data-info="petra"]').click();
  await expect(page.locator('.landmark-detail .landmark-life')).toBeVisible();
  await expect(page.locator('.variant-details')).toContainText('Owned ×0');
  await page.locator('.detail-close').click();
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('landmark-island-demo-v1')!);
    state.receipts.push({ ...state.tickets[2], landmark: 'petra' });
    localStorage.setItem('landmark-island-demo-v1', JSON.stringify(state));
  });
  await page.locator('#refresh').click();
  await expect(page.locator('.notice')).toContainText(
    'Duplicate discovered: Petra',
  );
  await expect(page.locator('.notice')).toContainText('owned ×1');
});

for (const [landmark, message] of [
  ['eiffel+', '합성 기록이 올바르지 않습니다.'],
  ['eiffel', '합성 횟수가 보유 수량을 초과합니다.'],
] as const) {
  test(`damaged fusion saves show a Korean reason without overwriting data (${landmark})`, async ({
    page,
  }) => {
    const save = empty();
    save.fusions.push({ id: 'damaged-fusion', landmark, at: '2026-11-13' });
    const original = JSON.stringify(save);
    await page.addInitScript(
      (value) => localStorage.setItem('landmark-island-demo-v1', value),
      original,
    );
    await page.goto('/?lang=ko');
    await expect(page.getByRole('alert')).toContainText(message);
    await page.locator('#refresh').click();
    await expect(page.getByRole('alert')).toContainText(message);
    expect(
      await page.evaluate(() =>
        localStorage.getItem('landmark-island-demo-v1'),
      ),
    ).toBe(original);
  });
}
