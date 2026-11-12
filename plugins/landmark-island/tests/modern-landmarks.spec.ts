import { openTreasure } from './treasure-menu';
import { test, expect } from '@playwright/test';
import { empty, landmarks, validate } from '../src/game';
import korean from '../src/landmarks.ko.json';

test('modern discoveries share countries while keeping individual gifts, placements and saves', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const fixture = window as unknown as {
      modernRolls: number[];
      modernRollIndex: number;
    };
    fixture.modernRolls = [0, 0];
    fixture.modernRollIndex = 0;
    Math.random = () => fixture.modernRolls[fixture.modernRollIndex++ % 2];
  });
  const save = empty();
  for (const landmark of ['gyeongbokgung', 'merlion', 'sagrada']) {
    const workspaceId = `existing-${landmark}`;
    save.tickets.push({ workspaceId, at: '2026-11-08' });
    save.receipts.push({ workspaceId, landmark, at: '2026-11-08' });
  }
  save.placements.push({ landmark: 'gyeongbokgung', cell: 0 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=en');
  await page.evaluate(
    (save) =>
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save)),
    validate(save),
  );
  await page.reload();
  const modern = landmarks.slice(48, 51);
  const draw = async (entry: (typeof modern)[number]) => {
    const pool = landmarks.filter((l) => l.tier === entry.tier);
    const tierRoll = entry.tier === 'common' ? 0.35 : 0.8;
    await page.evaluate(
      ([tier, item]) => {
        const fixture = window as unknown as {
          modernRolls: number[];
          modernRollIndex: number;
        };
        fixture.modernRolls = [tier, item];
        fixture.modernRollIndex = 0;
      },
      [
        tierRoll,
        (pool.findIndex((l) => l.id === entry.id) + 0.5) / pool.length,
      ],
    );
    await page.getByRole('button', { name: 'Demo worktree' }).click();
    await openTreasure(page);
    await page.locator('#draw-ticket').click();
    await expect(page.locator('.discovery-result h2')).toHaveText(entry.name);
    await expect(
      page.locator('.discovery-monument [data-material-art]'),
    ).toHaveAttribute('data-material-art', entry.id);
    await page.getByRole('button', { name: 'Keep exploring' }).click();
  };
  for (const [i, entry] of modern.entries()) {
    await draw(entry);
    await expect(
      page.locator(`[data-decor-card="${entry.id}-gift"]`),
    ).toContainText('Owned ×1');
    await page.locator('[data-inventory=landmarks]').click();
    await page.locator(`[data-landmark="${entry.id}"]`).click();
    await page
      .getByRole('button', { name: `Cell ${i + 2}: empty`, exact: true })
      .click();
  }
  await expect(page.locator('.stats strong').nth(0)).toContainText('6');
  await expect(page.locator('.stats strong').nth(2)).toHaveText('3 countries');
  await page.getByRole('button', { name: 'World Map', exact: true }).click();
  await expect(page.locator('.world circle')).toHaveCount(6);
  for (const country of ['South Korea', 'Singapore', 'Spain']) {
    const row = page.locator('.countries > span').filter({ hasText: country });
    await expect(row).toHaveCount(1);
    await expect(row).toHaveText(
      `${country} 2/${landmarks.filter((entry) => entry.country === country).length}`,
    );
  }
  await page.getByRole('button', { name: 'My Island', exact: true }).click();
  await draw(modern[0]);
  await draw(modern[0]);
  await expect(page.locator('.stats strong').nth(2)).toHaveText('3 countries');
  await expect(page.locator('.material-balance')).toHaveText('6 materials');
  await page.locator('[data-inventory=decorations]').click();
  await page.locator('#decor-theme').selectOption('lotte');
  await page.locator('[data-craft=lotte-special]').click();
  await expect(page.locator('.material-balance')).toHaveText('0 materials');
  await page.locator('[data-decor-place=lotte-special]').click();
  await page
    .getByRole('button', { name: 'Cell 5: empty', exact: true })
    .click();
  await page.reload();
  await expect(
    page.locator('.garden-object[data-decoration=lotte-special]'),
  ).toHaveCount(1);
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
  );
  expect(stored.receipts).toHaveLength(8);
  expect(stored.receipts.slice(0, 3)).toEqual(save.receipts);
  expect(stored.placements).toContainEqual(save.placements[0]);
  for (const [i, entry] of modern.entries())
    expect(stored.placements).toContainEqual({
      landmark: entry.id,
      cell: i + 1,
    });
  await page.goto('/?lang=ko');
  for (const entry of modern) {
    const menu = page.locator('[data-inventory=landmarks]');
    if ((await menu.getAttribute('aria-expanded')) !== 'true')
      await menu.click();
    await page.locator(`[data-info="${entry.id}"]`).click();
    await expect(page.locator('.landmark-detail h2')).toHaveText(
      korean[entry.id as keyof typeof korean].name,
    );
    await expect(page.locator('#detail-description')).toHaveText(
      korean[entry.id as keyof typeof korean].description,
    );
    await page.keyboard.press('Escape');
  }
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
    ),
  ).toEqual(stored);
});

for (const [start, end, theme] of [
  [51, 59, 'nmoq'],
  [59, 67, 'taipei101'],
  [67, 78, 'lalibela'],
  [78, 89, 'sava'],
  [89, 100, 'copan'],
] as const)
  test(`country expansion ${start}–${end} draws new countries and preserves an existing collection`, async ({
    page,
  }) => {
    // Each entry exercises draw, placement and both locales on shared CI CPUs.
    test.setTimeout(process.env.CI ? 180_000 : 60_000);
    await page.addInitScript(() => {
      const fixture = window as unknown as {
        modernRolls: number[];
        modernRollIndex: number;
      };
      fixture.modernRolls = [0, 0];
      fixture.modernRollIndex = 0;
      Math.random = () => fixture.modernRolls[fixture.modernRollIndex++ % 2];
    });
    const save = empty();
    for (const landmark of ['eiffel']) {
      const workspaceId = `existing-${landmark}`;
      save.tickets.push({ workspaceId, at: '2026-11-08' });
      save.receipts.push({ workspaceId, landmark, at: '2026-11-08' });
    }
    save.placements.push({ landmark: 'eiffel', cell: 0 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/?lang=en');
    await page.evaluate(
      (save) =>
        localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save)),
      validate(save),
    );
    await page.reload();
    const modern = landmarks.slice(start, end);
    const draw = async (entry: (typeof modern)[number]) => {
      const pool = landmarks.filter((l) => l.tier === entry.tier);
      const tierRoll =
        entry.tier === 'common' ? 0.35 : entry.tier === 'rare' ? 0.8 : 0.96;
      await page.evaluate(
        ([tier, item]) => {
          const fixture = window as unknown as {
            modernRolls: number[];
            modernRollIndex: number;
          };
          fixture.modernRolls = [tier, item];
          fixture.modernRollIndex = 0;
        },
        [
          tierRoll,
          (pool.findIndex((l) => l.id === entry.id) + 0.5) / pool.length,
        ],
      );
      await page.getByRole('button', { name: 'Demo worktree' }).click();
      await openTreasure(page);
      await page.locator('#draw-ticket').click();
      await expect(page.locator('.discovery-result h2')).toHaveText(entry.name);
      await expect(
        page.locator('.discovery-monument [data-material-art]'),
      ).toHaveAttribute('data-material-art', entry.id);
      await page.getByRole('button', { name: 'Keep exploring' }).click();
    };
    for (const [i, entry] of modern.entries()) {
      await draw(entry);
      await expect(
        page.locator(`[data-decor-card="${entry.id}-gift"]`),
      ).toContainText('Owned ×1');
      await page.locator('[data-inventory=landmarks]').click();
      await page.locator(`[data-landmark="${entry.id}"]`).click();
      await page
        .getByRole('button', { name: `Cell ${i + 2}: empty`, exact: true })
        .click();
    }
    await expect(page.locator('.stats strong').nth(0)).toContainText(
      String(modern.length + 1),
    );
    await expect(page.locator('.stats strong').nth(2)).toHaveText(
      `${modern.length + 1} countries`,
    );
    await page.getByRole('button', { name: 'World Map', exact: true }).click();
    await expect(page.locator('.world circle')).toHaveCount(modern.length + 1);
    for (const country of modern.map((entry) => entry.country)) {
      const row = page
        .locator('.countries')
        .getByText(
          `${country} 1/${landmarks.filter((entry) => entry.country === country).length}`,
          { exact: true },
        );
      await expect(row).toHaveCount(1);
      await expect(row).toHaveText(
        `${country} 1/${landmarks.filter((entry) => entry.country === country).length}`,
      );
    }
    await page.getByRole('button', { name: 'My Island', exact: true }).click();
    await draw(modern[0]);
    await draw(modern[0]);
    await expect(page.locator('.stats strong').nth(2)).toHaveText(
      `${modern.length + 1} countries`,
    );
    await expect(page.locator('.material-balance')).toHaveText('6 materials');
    await page.locator('[data-inventory=decorations]').click();
    await page.locator('#decor-theme').selectOption(theme);
    await page.locator(`[data-craft=${theme}-special]`).click();
    await expect(page.locator('.material-balance')).toHaveText('0 materials');
    await page.locator(`[data-decor-place=${theme}-special]`).click();
    await page
      .getByRole('button', {
        name: `Cell ${modern.length + 2}: empty`,
        exact: true,
      })
      .click();
    await page.reload();
    await expect(
      page.locator(`.garden-object[data-decoration=${theme}-special]`),
    ).toHaveCount(1);
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
    );
    expect(stored.receipts).toHaveLength(modern.length + 3);
    expect(stored.receipts.slice(0, 1)).toEqual(save.receipts);
    expect(stored.placements).toContainEqual(save.placements[0]);
    for (const [i, entry] of modern.entries())
      expect(stored.placements).toContainEqual({
        landmark: entry.id,
        cell: i + 1,
      });
    await page.goto('/?lang=ko');
    for (const entry of modern) {
      const menu = page.locator('[data-inventory=landmarks]');
      if ((await menu.getAttribute('aria-expanded')) !== 'true')
        await menu.click();
      await page.locator(`[data-info="${entry.id}"]`).click();
      await expect(page.locator('.landmark-detail h2')).toHaveText(
        korean[entry.id as keyof typeof korean].name,
      );
      await expect(page.locator('#detail-description')).toHaveText(
        korean[entry.id as keyof typeof korean].description,
      );
      await page.keyboard.press('Escape');
    }
    expect(
      await page.evaluate(() =>
        JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
      ),
    ).toEqual(stored);
  });
