import { openTreasure } from './treasure-menu';
import { test, expect, type Page } from '@playwright/test';
import { empty } from '../src/game';

async function seed(
  page: Page,
  tickets = 10,
  rolls: number[] = [0],
  owned: string[] = [],
) {
  const state = empty();
  for (let i = 0; i < tickets + owned.length; i++)
    state.tickets.push({ workspaceId: `ten-${i}`, at: '2026-11-08' });
  owned.forEach((landmark, i) =>
    state.receipts.push({
      workspaceId: `ten-${i}`,
      landmark,
      at: '2026-11-08',
    }),
  );
  await page.addInitScript(
    ({ state, rolls }) => {
      if (!localStorage.getItem('landmark-island-demo-v1'))
        localStorage.setItem('landmark-island-demo-v1', JSON.stringify(state));
      let roll = 0;
      Math.random = () => rolls[roll++ % rolls.length];
    },
    { state, rolls },
  );
}
const saved = (page: Page) =>
  page.evaluate(() =>
    JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
  );

test('ten treasures require ten tickets, save once, classify batch duplicates and place from results', async ({
  page,
}) => {
  await seed(page, 9);
  await page.goto('/');
  await expect(page.locator('#draw-ten')).toBeDisabled();
  await page.getByRole('button', { name: 'Demo worktree' }).click();
  await expect(page.locator('#draw-ten')).toBeEnabled();
  await openTreasure(page);
  await page.locator('#draw-ten').evaluate((button: HTMLButtonElement) => {
    button.click();
    button.click();
  });
  await page
    .getByRole('button', { name: 'View all 10 results' })
    .first()
    .click();
  const dialog = page.locator('.treasure-results');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.treasure-result')).toHaveCount(10);
  await expect(dialog.locator('[data-new=true]')).toHaveCount(1);
  await expect(dialog.locator('[data-new=false]')).toHaveCount(9);
  await expect(
    dialog.getByRole('button', { name: 'Place on island', exact: true }),
  ).toHaveCount(1);
  await expect(
    dialog.getByRole('button', { name: 'Place another copy', exact: true }),
  ).toHaveCount(9);
  await expect(dialog.locator('[data-new=true] .discovery-status')).toHaveText(
    'New discovery',
  );
  await expect(
    dialog.locator('[data-new=false] .discovery-status').first(),
  ).toHaveText('Already discovered');
  await expect(dialog.locator('.results-totals')).toHaveText(
    '1 new discoveries · 9 duplicates · +27 materials',
  );
  await expect(page.locator('.reveal-skip')).toHaveCount(0);
  expect((await saved(page)).receipts).toHaveLength(10);
  await dialog
    .getByRole('button', { name: 'Place another copy' })
    .first()
    .click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('.ocean')).toHaveAttribute('data-mode', 'build');
  await page
    .getByRole('button', { name: 'Cell 1: empty', exact: true })
    .click();
  expect((await saved(page)).placements).toEqual([
    { cell: 0, landmark: 'liberty' },
  ]);
  await page.reload();
  await expect(page.locator('#ticket-count')).toHaveText('0');
  expect((await saved(page)).receipts).toHaveLength(10);
  await page.getByRole('button', { name: 'Demo worktree' }).click();
  await openTreasure(page);
  await page.locator('#draw-ticket').click();
  await expect(page.locator('.discovery-status')).toHaveText(
    'Already discovered',
  );
  await expect(page.locator('.reveal-place')).toHaveText('Place another copy');
  await expect(page.locator('.discovery-theatre')).toHaveClass(
    /static-discovery/,
  );
  await page
    .locator('.discovery-theatre')
    .screenshot({ path: 'test-results/landmark-island/duplicate-result.png' });
});

test('ten treasures animate first discoveries at every tier and skip duplicates', async ({
  page,
}) => {
  // New common, new Treasure, owned Wonder, new Marvel twice, new Wonder,
  // then ordinary copies. The repeated Marvel must animate only once.
  await seed(
    page,
    10,
    [
      0, 0, 0.8, 0, 0.999, 0, 0.95, 0, 0.95, 0, 0.999, 0.5, 0, 0, 0.8, 0, 0.95,
      0, 0.999, 0,
    ],
    ['petra'],
  );
  await page.goto('/');
  await openTreasure(page);
  await page.locator('#draw-ten').click();
  const theatre = page.locator('.discovery-theatre:not(.treasure-results)');
  expect((await saved(page)).receipts).toHaveLength(11);
  for (const [index, tier] of [
    'common',
    'rare',
    'epic',
    'legendary',
  ].entries()) {
    await expect(theatre).toHaveAttribute('data-tier', tier);
    await expect(theatre.locator('.discovery-heading > span')).toHaveText(
      `New discovery ${index + 1} of 4`,
    );
    if (tier !== 'legendary') {
      await theatre.getByRole('button', { name: 'Skip animation' }).click();
      await theatre
        .getByRole('button', { name: 'Continue', exact: true })
        .click();
    }
  }
  await theatre
    .getByRole('button', { name: 'View all 10 results' })
    .first()
    .click();
  await expect(page.locator('.treasure-results')).toBeVisible();
  await expect(page.locator('.treasure-result')).toHaveCount(10);
  await expect(page.locator('.treasure-result[data-new=true]')).toHaveCount(4);
  await expect(page.locator('.results-totals')).toHaveText(
    '4 new discoveries · 6 duplicates · +18 materials',
  );
  await page.keyboard.press('Escape');
  await expect(page.locator('#open-treasure')).toBeFocused();
  expect((await saved(page)).receipts).toHaveLength(11);
});

for (const outcome of ['failed write', 'lost response'] as const)
  test(`ten treasures recover the same tickets after ${outcome}`, async ({
    page,
  }) => {
    await seed(page, 20, [0.999, 0]);
    await page.goto('/');
    await page.evaluate((outcome) => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        Storage.prototype.setItem = original;
        if (outcome === 'lost response') original.call(this, key, value);
        throw Error('Fixture batch save failure');
      };
    }, outcome);
    await openTreasure(page);
    await page.locator('#draw-ten').click();
    await expect(page.getByRole('alert')).toContainText(
      'Fixture batch save failure',
    );
    await expect(page.locator('#draw-ticket')).toBeDisabled();
    await expect(page.locator('#draw-ten')).toHaveAccessibleName(
      'Retry 10 treasures',
    );
    expect((await saved(page)).receipts).toHaveLength(
      outcome === 'failed write' ? 0 : 10,
    );
    await page.getByRole('button', { name: 'Refresh' }).click();
    await openTreasure(page);
    await page.locator('#draw-ten').click();
    await expect(page.locator('.discovery-theatre')).toHaveAttribute(
      'data-tier',
      'legendary',
    );
    // Escape from a batch highlight jumps directly to all results.
    await page.keyboard.press('Escape');
    await expect(page.locator('.treasure-results')).toBeVisible();
    await expect(page.locator('.treasure-result[data-new=true]')).toHaveCount(
      1,
    );
    const committed = await saved(page);
    expect(committed.receipts).toHaveLength(10);
    expect(
      committed.receipts.map((r: { workspaceId: string }) => r.workspaceId),
    ).toEqual(Array.from({ length: 10 }, (_, i) => `ten-${i}`));
    await page.getByRole('button', { name: 'Keep exploring' }).click();
    await expect(page.locator('#ticket-count')).toHaveText('10');
    await expect(page.locator('#open-treasure')).toBeFocused();
    // All ten are now duplicates, even though they are Wonders.
    await openTreasure(page);
    await page.locator('#draw-ten').click();
    await expect(page.locator('.treasure-results')).toBeVisible();
    await expect(page.locator('.treasure-result[data-new=true]')).toHaveCount(
      0,
    );
    await expect(page.locator('.reveal-skip')).toHaveCount(0);
  });

for (const width of [1000, 360])
  test(`ten treasures results fit the canvas and scroll independently at ${width}px in Korean`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await seed(page);
    await page.goto('/?lang=ko');
    await openTreasure(page);
    await page.getByRole('button', { name: '보물상자 10개 열기' }).click();
    await page
      .getByRole('button', { name: '10개 결과 모두 보기' })
      .first()
      .click();
    const dialog = page.locator('.treasure-results');
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText(
      '보물상자 10개 개봉 완료',
    );
    await expect(dialog.locator('.results-totals')).toHaveText(
      '새로운 발견 1종 · 중복 9개 · 재료 +27개',
    );
    const bounds = await dialog.boundingBox();
    await expect(
      dialog.getByRole('button', { name: '섬에 배치', exact: true }),
    ).toHaveCount(1);
    await expect(
      dialog.getByRole('button', { name: '하나 더 배치', exact: true }),
    ).toHaveCount(9);
    await expect(
      dialog.locator('[data-new=false] .discovery-status').first(),
    ).toHaveText('이미 발견한 랜드마크');
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    expect(await dialog.evaluate((e) => e.scrollWidth <= e.clientWidth)).toBe(
      true,
    );
    const scroll = page.locator('.results-grid');
    const before = await page.evaluate(() => scrollY);
    await scroll.hover();
    await page.mouse.wheel(0, 3000);
    await expect
      .poll(() => scroll.evaluate((e) => e.scrollTop))
      .toBeGreaterThan(0);
    expect(await page.evaluate(() => scrollY)).toBe(before);
    await dialog.screenshot({
      path: `test-results/landmark-island/ten-results-${width}.png`,
    });
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });

test('ten treasures keep host notifications queued through highlights and summary', async ({
  page,
}) => {
  const state = empty();
  state.tickets = Array.from({ length: 10 }, (_, i) => ({
    workspaceId: `host-ten-${i}`,
    at: '2026-11-08',
  }));
  await page.addInitScript((state) => {
    let changed = () => {};
    const host = window as unknown as { orca: unknown; batchCalls: number };
    host.batchCalls = 0;
    host.orca = {
      locale: 'en-US',
      plugin: {
        on(_name: string, listener: () => void) {
          changed = listener;
        },
        async request(name: string, input: { ticketIds?: string[] }) {
          if (name === 'island.drawMany') {
            host.batchCalls++;
            for (const [i, workspaceId] of input.ticketIds!.entries())
              state.receipts.push({
                workspaceId,
                landmark: i === 0 ? 'petra' : 'liberty',
                at: '2026-11-08',
              });
            changed();
            setTimeout(() => {
              state.tickets.push({
                workspaceId: 'earned-during-batch',
                at: '2026-11-08',
              });
              changed();
            }, 100);
          }
          return structuredClone(state);
        },
      },
    };
  }, state);
  await page.goto('/');
  await openTreasure(page);
  await page.locator('#draw-ten').click();
  await expect(page.locator('.discovery-theatre')).toHaveAttribute(
    'data-tier',
    'legendary',
  );
  await page.waitForTimeout(250);
  await page
    .getByRole('button', { name: 'View all 10 results' })
    .first()
    .click();
  await expect(page.locator('.treasure-results')).toBeVisible();
  await page.waitForTimeout(150);
  await expect(page.locator('.treasure-result')).toHaveCount(10);
  await page.getByRole('button', { name: 'Keep exploring' }).click();
  await expect(page.locator('#ticket-count')).toHaveText('1');
  expect(
    await page.evaluate(
      () => (window as unknown as { batchCalls: number }).batchCalls,
    ),
  ).toBe(1);
});

for (const language of ['en', 'ko'])
  test(`skip checkbox controls single and ten-ticket discoveries without changing rewards (${language})`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await seed(page, 12, [...Array(20).fill(0), 0.8, 0, 0.999, 0]);
    await page.goto(`/?lang=${language}`);
    const skip = page.getByRole('checkbox', {
      name: language === 'ko' ? '연출 건너뛰기' : 'Skip animation',
      exact: true,
    });
    await openTreasure(page);
    await expect(skip).not.toBeChecked();
    const camera = await page.locator('.camera').getAttribute('style');
    await skip.focus();
    await page.keyboard.press('Space');
    await openTreasure(page);
    await expect(skip).toBeChecked();
    expect(await page.locator('.camera').getAttribute('style')).toBe(camera);
    await page.locator('[data-inventory=landmarks]').click();
    await page.locator('#close-inventory').click();
    await page.locator('#refresh').click();
    await openTreasure(page);
    await expect(skip).toBeChecked();
    const bounds = (await page.locator('.skip-discovery').boundingBox())!;
    const ocean = (await page.locator('.ocean').boundingBox())!;
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(ocean.x + ocean.width);
    await page.locator('.ocean').screenshot({
      path: `test-results/landmark-island/skip-checkbox-${language}.png`,
    });
    await openTreasure(page);
    await page.locator('#draw-ten').click();
    await expect(page.locator('.treasure-results')).toBeVisible();
    await expect(page.locator('.treasure-result[data-new=true]')).toHaveCount(
      1,
    );
    await expect(page.locator('.reveal-skip')).toHaveCount(0);
    expect((await saved(page)).receipts).toHaveLength(10);
    await page.locator('.results-close').click();
    await openTreasure(page);
    await expect(skip).toBeChecked();
    await skip.uncheck();
    await openTreasure(page);
    await page.locator('#draw-ticket').click();
    await expect(page.locator('.discovery-theatre')).not.toHaveClass(
      /static-discovery/,
    );
    await expect(page.locator('.reveal-skip')).toBeVisible();
    await page.locator('.reveal-skip').click();
    await page.locator('.reveal-keep').click();
    await openTreasure(page);
    await expect(skip).not.toBeChecked();
    await skip.check();
    await openTreasure(page);
    await page.locator('#draw-ticket').click();
    await expect(page.locator('.discovery-theatre')).toHaveClass(
      /static-discovery/,
    );
    await expect(page.locator('.reveal-skip')).toBeHidden();
    await expect(page.locator('.reveal-actions')).toBeVisible();
    await page.locator('.reveal-keep').click();
    expect(
      (await saved(page)).receipts.map((r: { landmark: string }) => r.landmark),
    ).toEqual([...Array(10).fill('liberty'), 'eiffel', 'petra']);
    await openTreasure(page);
    await expect(skip).toBeChecked();
  });

for (const [width, language] of [
  [1000, 'en'],
  [360, 'ko'],
] as const)
  test(`treasure menu groups choices without spending tickets at ${width}px`, async ({
    page,
  }) => {
    await seed(page, 9);
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/?lang=${language}`);
    const before = await saved(page);
    const camera = await page.locator('.camera').elementHandle();
    const transform = await page.locator('.camera').getAttribute('style');
    await expect(page.locator('#draw-ten')).toBeHidden();
    await expect(page.locator('#skip-discovery')).toBeHidden();
    await openTreasure(page);
    const menu = page.locator('#treasure-menu');
    await expect(menu).toBeVisible();
    await expect(page.locator('#draw-ticket')).toBeEnabled();
    await expect(page.locator('#draw-ten')).toBeDisabled();
    await expect(page.locator('.treasure-balance')).toContainText('9');
    await expect(page.locator('#draw-ticket strong')).toHaveText(
      language === 'ko' ? '1개 열기' : 'Open 1',
    );
    await expect(page.locator('#draw-ten strong')).toHaveText(
      language === 'ko' ? '10개 열기' : 'Open 10',
    );
    const bounds = (await menu.boundingBox())!;
    const ocean = (await page.locator('.ocean').boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(ocean.x);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(ocean.x + ocean.width);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(
      ocean.y + ocean.height,
    );
    const y = await page.evaluate(() => scrollY);
    await menu.hover();
    await page.mouse.wheel(0, 500);
    expect(await page.evaluate(() => scrollY)).toBe(y);
    expect(await page.locator('.camera').getAttribute('style')).toBe(transform);
    await page.locator('.ocean').screenshot({
      path: `test-results/landmark-island/treasure-menu-${language}.png`,
    });
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(page.locator('#open-treasure')).toBeFocused();
    await openTreasure(page);
    await page.locator('[data-inventory=landmarks]').click();
    await expect(menu).toBeHidden();
    await openTreasure(page);
    await expect(page.locator('.canvas-inventory')).toBeHidden();
    await page.locator('#open-treasure').click();
    await expect(menu).toBeHidden();
    expect(await saved(page)).toEqual(before);
    expect(
      await camera!.evaluate(
        (node) => node === document.querySelector('.camera'),
      ),
    ).toBe(true);
    await page.locator('#expedition').click();
    await openTreasure(page);
    await expect(page.locator('#draw-ten')).toBeEnabled();
  });

for (const [width, language] of [
  [1000, 'en'],
  [360, 'ko'],
] as const)
  test(`draw again chains single and ten results and disables unaffordable draws at ${width}px`, async ({
    page,
  }) => {
    await seed(page, 12);
    await page.setViewportSize({ width, height: 800 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/?lang=${language}`);
    await openTreasure(page);
    await page.locator('#draw-ticket').click();
    const one = () => page.locator('.discovery-theatre [data-draw-again="1"]');
    const ten = () => page.locator('.discovery-theatre [data-draw-again="10"]');
    await expect(one()).toBeEnabled();
    await expect(ten()).toBeEnabled();
    await expect(one()).toHaveText(
      language === 'ko' ? '1개 더 뽑기' : 'Draw 1 more',
    );
    await expect(page.locator('.repeat-balance')).toContainText('11');
    // Double clicks must not turn one selection into two requests.
    await ten().evaluate((button: HTMLButtonElement) => {
      button.click();
      button.click();
    });
    await expect(page.locator('.treasure-results')).toBeVisible();
    expect((await saved(page)).receipts).toHaveLength(11);
    await expect(one()).toBeEnabled();
    await expect(ten()).toBeDisabled();
    await expect(page.locator('.repeat-balance')).toContainText('1');
    await page
      .locator('.treasure-results')
      .screenshot({
        path: `test-results/landmark-island/draw-again-${width}.png`,
      });
    await one().click();
    await expect(page.locator('.treasure-results')).toHaveCount(0);
    await expect(page.locator('.discovery-theatre')).toHaveCount(1);
    await expect(one()).toBeDisabled();
    await expect(ten()).toBeDisabled();
    await expect(page.locator('.repeat-balance')).toContainText('0');
    expect((await saved(page)).receipts).toHaveLength(12);
    await one().evaluate((button: HTMLButtonElement) => button.click());
    expect((await saved(page)).receipts).toHaveLength(12);
    await page.locator('.reveal-keep').click();
    await expect(page.locator('#open-treasure')).toBeFocused();
  });

test('draw again uses exact ten-ticket threshold and preserves a failed draw for retry', async ({
  page,
}) => {
  await seed(page, 11);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await openTreasure(page);
  await page.locator('#draw-ticket').click();
  await expect(page.locator('[data-draw-again="10"]')).toBeEnabled();
  await page.locator('[data-draw-again="1"]').click();
  await expect(page.locator('.repeat-balance')).toHaveText(
    'Tickets remaining: 9',
  );
  await expect(page.locator('[data-draw-again="10"]')).toBeDisabled();
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      Storage.prototype.setItem = original;
      throw Error('Fixture repeat save failure');
    };
  });
  await page.locator('[data-draw-again="1"]').click();
  await expect(page.getByRole('alert')).toContainText(
    'Fixture repeat save failure',
  );
  await expect(page.locator('.discovery-theatre')).toHaveCount(0);
  expect((await saved(page)).receipts).toHaveLength(2);
  await page.locator('#draw-ticket').click();
  await expect(page.locator('.repeat-balance')).toHaveText(
    'Tickets remaining: 8',
  );
  expect((await saved(page)).receipts).toHaveLength(3);
});
