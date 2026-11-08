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
  await expect(dialog.locator('.results-totals')).toHaveText(
    '1 new discoveries · 9 duplicates · +27 materials',
  );
  await expect(page.locator('.reveal-skip')).toHaveCount(0);
  expect((await saved(page)).receipts).toHaveLength(10);
  await dialog.getByRole('button', { name: 'Place on island' }).first().click();
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
  await expect(page.locator('[data-inventory=landmarks]')).toBeFocused();
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
    await expect(page.locator('#draw-ten')).toBeFocused();
    // All ten are now duplicates, even though they are Wonders.
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
