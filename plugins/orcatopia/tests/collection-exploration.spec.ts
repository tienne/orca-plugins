import { test, expect, type Page } from '@playwright/test';
import { empty, landmarks, collectionTheme } from '../src/game';
import { openTreasure } from './treasure-menu';
import { collectionSnapshot } from './tourism-state';

async function seed(
  page: Page,
  count: number,
  tickets: number,
  legacy = false,
  rolls: number[] = [0],
) {
  const state = empty();
  const land = landmarks.filter((l) => collectionTheme(l.id) === 'land');
  for (let i = 0; i < count + tickets; i++) {
    state.tickets.push({ workspaceId: `collection-${i}`, at: '2026-11-15' });
    if (i < count)
      state.receipts.push({
        workspaceId: `collection-${i}`,
        landmark: land[i].id,
        at: '2026-11-15',
      });
  }
  const saved: any = state;
  if (legacy) {
    saved.version = 6;
    delete saved.discoveredPlaces;
    delete saved.firstExplorations;
  }
  await page.addInitScript(
    ({ value, rolls }) => {
      if (!localStorage.getItem('landmark-island-demo-v1'))
        localStorage.setItem('landmark-island-demo-v1', JSON.stringify(value));
      let index = 0;
      Math.random = () => rolls[index++ % rolls.length];
    },
    { value: saved, rolls },
  );
}
const saved = (page: Page) =>
  page.evaluate(() =>
    JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
  );

test('locked collection shows next goal and preserves terrain editing', async ({
  page,
}) => {
  await seed(page, 11, 1);
  await page.goto('/?lang=en');
  await openTreasure(page);
  await expect(
    page.getByText('River exploration: 11/12 places', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'First river exploration', exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole('button', { name: 'First sea exploration', exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByText('River: unlock at 12 different places', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Sea: unlock at 25 different places', { exact: true }),
  ).toBeVisible();
  await page.locator('#close-treasure').click();
  await expect(page.locator('.ocean')).toBeVisible();
});

for (const lang of ['en', 'ko']) {
  test(`legacy first river opportunity costs one ticket once, with persisted ${lang} labels`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await seed(page, 12, 2, true);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/?lang=${lang}`);
    await openTreasure(page);
    const river = page.locator('[data-first-exploration=river]');
    await expect(river).toHaveText(
      lang === 'ko' ? '강 첫 탐험' : 'First river exploration',
    );
    await expect(
      page.getByText(
        lang === 'ko'
          ? '바다 탐험까지 12/25종'
          : 'Sea exploration: 12/25 places',
        { exact: true },
      ),
    ).toBeVisible();
    await expect(river).toBeEnabled();
    await river.scrollIntoViewIfNeeded();
    expect(
      await page
        .locator('#treasure-menu')
        .evaluate((menu) => menu.scrollWidth <= menu.clientWidth),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/landmark-island/collection-exploration-${lang}.jpg`,
      type: 'jpeg',
      quality: 80,
    });
    await page.locator('#skip-discovery').check();
    await river.click();
    await expect
      .poll(async () => (await saved(page)).firstExplorations.length)
      .toBe(1);
    const state = await saved(page);
    expect(state.version).toBe(8);
    expect(state.receipts).toHaveLength(13);
    expect(collectionTheme(state.receipts.at(-1).landmark)).toBe('river');
    expect(state.firstExplorations).toEqual([
      { theme: 'river', ticketId: 'collection-12' },
    ]);
    await page.reload();
    await openTreasure(page);
    await expect(page.locator('[data-first-exploration=river]')).toBeDisabled();
    await expect(
      page.getByText(
        lang === 'ko' ? '첫 탐험 사용 완료' : 'First exploration used',
        { exact: true },
      ),
    ).toBeVisible();
    await expect(page.locator('#ticket-count')).toHaveText('1');
    expect((await saved(page)).firstExplorations).toHaveLength(1);
  });
}

test('unlocked sea opportunity waits for a ticket and survives reload', async ({
  page,
}) => {
  await seed(page, 25, 0, true);
  await page.goto('/?lang=en');
  await openTreasure(page);
  await expect(page.locator('[data-first-exploration=sea]')).toBeDisabled();
  await expect(
    page.getByText(
      'Not enough exploration tickets. Your opportunity is saved.',
      { exact: true },
    ),
  ).toHaveCount(2);
  await page.reload();
  await page.getByRole('button', { name: 'Demo worktree' }).click();
  await openTreasure(page);
  await expect(page.locator('[data-first-exploration=sea]')).toBeEnabled();
  await page.locator('#skip-discovery').check();
  await page.locator('[data-first-exploration=sea]').click();
  await expect
    .poll(async () => (await saved(page)).firstExplorations.length)
    .toBe(1);
  const state = await saved(page);
  expect(state.firstExplorations[0].theme).toBe('sea');
  expect(collectionTheme(state.receipts.at(-1).landmark)).toBe('sea');
});

test('a new twelfth place announces river unlock and keeps the separate first opportunity', async ({
  page,
}) => {
  const land = landmarks.filter((l) => collectionTheme(l.id) === 'land');
  const pool = land.filter((l) => l.tier === 'common');
  const target = pool.find(
    (l) => !land.slice(0, 11).some((owned) => owned.id === l.id),
  )!;
  await seed(page, 11, 2, false, [
    0.35,
    (pool.indexOf(target) + 0.5) / pool.length,
  ]);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=en');
  await openTreasure(page);
  await page.locator('#skip-discovery').check();
  await page.locator('#draw-ticket').click();
  await expect(page.locator('.reveal-keep')).toBeVisible();
  await page.locator('.reveal-keep').click();
  await expect(page.locator('.notice')).toContainText(
    'River exploration unlocked',
  );
  await openTreasure(page);
  await expect(page.locator('[data-first-exploration=river]')).toBeEnabled();
  expect((await saved(page)).firstExplorations).toEqual([]);
});

test('lost first-exploration response retries the same theme and ticket', async ({
  page,
}) => {
  await seed(page, 12, 2);
  await page.addInitScript(() => {
    const set = Storage.prototype.setItem;
    let lost = false;
    Storage.prototype.setItem = function (key, value) {
      set.call(this, key, value);
      if (
        key === 'landmark-island-demo-v1' &&
        !lost &&
        JSON.parse(value).firstExplorations?.length
      ) {
        lost = true;
        throw Error('response lost');
      }
    };
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=en');
  await openTreasure(page);
  await page.locator('#skip-discovery').check();
  await page.locator('[data-first-exploration=river]').click();
  await expect(page.locator('[role=alert]')).toContainText('response lost');
  const committed = await saved(page);
  expect(committed.firstExplorations).toHaveLength(1);
  await page
    .getByRole('button', { name: 'Retry discovery', exact: true })
    .click();
  await expect(page.locator('.reveal-keep')).toBeVisible();
  const retried = await saved(page);
  expect(collectionSnapshot(retried)).toEqual(collectionSnapshot(committed));
  expect(retried.tourism.coins).toBe(committed.tourism.coins);
  expect(retried.tourism.buildings).toEqual(committed.tourism.buildings);
  await page.locator('.reveal-keep').click();
  await openTreasure(page);
  await expect(page.locator('[data-first-exploration=river]')).toBeDisabled();
  await expect(page.locator('#ticket-count')).toHaveText('1');
});

test('pre-restore copy remains restorable after its ticket is reused for a first exploration', async ({
  page,
}) => {
  await seed(page, 12, 1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=en');
  const pending = await saved(page);
  await openTreasure(page);
  await page.locator('#skip-discovery').check();
  await page.locator('#draw-ticket').click();
  await page.locator('.reveal-keep').click();
  const ordinary = await saved(page);
  await page.locator('#backups').click();
  await expect(page.locator('#backup-choose')).toBeEnabled();
  await page.locator('#backup-file').setInputFiles({
    name: 'pending-ticket.json',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({
        format: 'landmark-island-backup',
        version: 1,
        exportedAt: '2026-11-15T00:00:00.000Z',
        state: pending,
      }),
    ),
  });
  await page.locator('#backup-confirm').check();
  await page.locator('#backup-restore').click();
  await expect(page.locator('.backup-status')).toContainText(
    'Island restored.',
  );
  await page.locator('.backup-close').click();
  await openTreasure(page);
  await page.locator('[data-first-exploration=river]').click();
  await page.locator('.reveal-keep').click();
  await page.locator('#backups').click();
  await expect(page.locator('#backup-previous')).toBeEnabled();
  await page.locator('#backup-previous').click();
  await page.locator('#backup-confirm').check();
  await page.locator('#backup-restore').click();
  await expect(page.locator('.backup-status')).toContainText(
    'Island restored.',
  );
  const restored = await saved(page);
  expect(restored.receipts).toEqual(ordinary.receipts);
  expect(restored.firstExplorations).toEqual([{ theme: 'river' }]);
  await page.locator('.backup-close').click();
  await page.reload();
  await openTreasure(page);
  await expect(page.locator('[data-first-exploration=river]')).toBeDisabled();
});

test('locked landmark details show the unlocked tier pool and its theme condition', async ({
  page,
}) => {
  await seed(page, 11, 0);
  await page.goto('/?lang=en');
  await page.locator('[data-inventory=landmarks]').click();
  await page.locator('[data-info=liberty]').click();
  const commonLand = landmarks.filter(
    (l) => l.tier === 'common' && collectionTheme(l.id) === 'land',
  ).length;
  await expect(page.locator('.landmark-detail .detail-rarity')).toContainText(
    `${commonLand} unlocked landmarks in this tier`,
  );
  await expect(page.locator('.collection-lock')).toHaveText(
    'Sea: unlock at 25 different places',
  );
});
