import { test, expect, type Page } from '@playwright/test';
import { empty, validate, landmarks } from '../src/game';

const now = Date.parse('2026-11-15T12:00:00Z');
async function start(page: Page, minutes = 10, places = 1) {
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now + 1000);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const save = empty();
  for (let i = 0; i < places; i++) {
    const workspaceId = `tourism-fixture-${i}`;
    save.tickets.push({ workspaceId, at: '2026-11-15' });
    save.receipts.push({
      workspaceId,
      landmark: landmarks[i].id,
      at: '2026-11-15',
    });
    save.placements.push({ landmark: landmarks[i].id, cell: i });
  }
  save.tourism = {
    coins: 0,
    settledAt: now - minutes * 60_000,
    remainder: 0,
    buildings: [],
    away: null,
  };
  await page.addInitScript((state) => {
    if (!localStorage.getItem('landmark-island-demo-v1'))
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(state));
  }, validate(save));
  await page.goto('/?lang=en');
  await expect(page.locator('.tourism-balance')).toContainText(
    `${Math.min(minutes, 720) * places} tourism coins`,
  );
  await page.locator('#weather').selectOption('0');
  return save;
}

test('tourism pays away time and builds a permanent reward with free undo and replacement', async ({
  page,
}) => {
  await start(page);
  await expect(page.locator('.tourism-away')).toContainText(
    '10 visitors · 10 tourism coins · 10 minutes',
  );
  await page.locator('[data-view=map]').click();
  await page.locator('#open-tourism').click();
  await expect(page.locator('#open-tourism')).toHaveAccessibleName(
    '10 tourism coins',
  );
  const information = page.locator('[data-special-building="tourism-info"]');
  await information
    .getByRole('button', { name: 'Choose construction site' })
    .click();
  await expect(page.locator('[data-view=island]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page
    .getByRole('button', { name: 'Cell 2: empty', exact: true })
    .click();
  await expect(
    page.locator('.garden-object[data-decoration="tourism-info"]'),
  ).toHaveCount(1);
  await expect(page.locator('.tourism-balance')).toHaveText('0 tourism coins');
  await page.locator('#undo-layout').click();
  await expect(
    page.locator('.garden-object[data-decoration="tourism-info"]'),
  ).toHaveCount(0);
  await expect(information).toContainText('Built · Ready to place');
  await expect(page.locator('.tourism-balance')).toHaveText('0 tourism coins');
  await information.getByRole('button', { name: 'Place', exact: true }).click();
  await page
    .getByRole('button', { name: 'Cell 3: empty', exact: true })
    .click();
  await expect(
    page.locator('.garden-object[data-decoration="tourism-info"]'),
  ).toHaveCount(1);
  await page
    .getByRole('button', { name: 'Explore island', exact: true })
    .click();
  const retainedCard = await page
    .locator('.collection .card')
    .first()
    .elementHandle();
  await page.clock.runFor(60_000);
  expect(await retainedCard!.evaluate((card) => card.isConnected)).toBe(true);
  await expect(page.locator('.tourism-balance')).toHaveText('1 tourism coins');
  await expect(page.locator('#open-tourism')).toHaveAccessibleName(
    '1 tourism coins',
  );
  await page.screenshot({
    path: 'test-results/landmark-island/tourism-buildings.jpeg',
    type: 'jpeg',
    quality: 80,
    fullPage: true,
  });
});

test('offline cap is an actual saved receipt and Korean text covers the construction flow', async ({
  page,
}) => {
  await start(page, 1440);
  await expect(page.locator('.tourism-away')).toContainText(
    '720 visitors · 720 tourism coins · 720 minutes',
  );
  await expect(page.locator('.tourism-panel')).toContainText(
    '12-hour limit applied',
  );
  await page.goto('/?lang=ko');
  await expect(page.locator('.tourism-balance')).toHaveText('관광 코인 720개');
  await expect(page.locator('#open-tourism')).toHaveAccessibleName(
    '관광 코인 720개',
  );
  await expect(page.locator('.tourism-away')).toContainText(
    '부재중 관광객 720명 · 관광 코인 720개 · 720분',
  );
  await page.locator('.tourism-construction summary').click();
  await expect(
    page.locator('[data-special-building="tourism-info"]'),
  ).toContainText('관광 안내소');
  await expect(
    page.getByRole('button', { name: '건설할 곳 선택' }),
  ).toHaveCount(4);
});

test('visiting tourists are bounded and pause with editing, visibility and reduced motion', async ({
  page,
}) => {
  await start(page, 0, 12);
  await page.clock.runFor(25_000);
  const visitors = page.locator('.island-tourist');
  expect(await visitors.count()).toBeGreaterThan(0);
  expect(await visitors.count()).toBeLessThanOrEqual(6);
  await expect(page.locator('.island-resident')).toHaveCount(3);
  const positions = () =>
    visitors.evaluateAll((nodes) =>
      nodes.map((node) => [
        node.getAttribute('style'),
        (node as HTMLElement).dataset.action,
      ]),
    );
  await page
    .getByRole('button', { name: 'Arrange landmarks', exact: true })
    .click();
  const editing = await positions();
  await page.clock.runFor(10_000);
  expect(await positions()).toEqual(editing);
  await page
    .getByRole('button', { name: 'Explore island', exact: true })
    .click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const reduced = await positions();
  await page.clock.runFor(10_000);
  expect(await positions()).toEqual(reduced);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const hidden = await positions();
  await page.clock.runFor(10_000);
  expect(await positions()).toEqual(hidden);
});

test('all four permanent buildings add visitor activities without changing the income rate', async ({
  page,
}) => {
  test.setTimeout(90_000);
  await start(page, 0, 6);
  await page.evaluate(() => {
    const key = 'landmark-island-demo-v1';
    const save = JSON.parse(localStorage.getItem(key)!);
    save.tourism.buildings = [
      'tourism-info',
      'tourism-cafe',
      'tourism-shop',
      'tourism-lookout',
    ];
    save.decorations = save.tourism.buildings.map(
      (decoration: string, i: number) => ({ decoration, cell: 20 + i }),
    );
    save.floors = Array.from({ length: 36 }, (_, cell) => ({
      cell,
      decoration: 'path',
    }));
    localStorage.setItem(key, JSON.stringify(save));
  });
  await page.locator('#refresh').click();
  await expect(page.locator('.tourism-panel')).toContainText(
    '6 visitors / min · 6 coins / min',
  );
  await page.evaluate(() => {
    const observed = new Set<string>();
    (window as unknown as { visitorActions: Set<string> }).visitorActions =
      observed;
    new MutationObserver((records) => {
      for (const record of records) {
        const actor = record.target as HTMLElement;
        if (actor.matches('.island-tourist'))
          observed.add(actor.dataset.action!);
      }
    }).observe(document.querySelector('.world-ground')!, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-action'],
    });
  });
  await page.clock.runFor(180_000);
  const activities = await page.evaluate(() => [
    ...(window as unknown as { visitorActions: Set<string> }).visitorActions,
  ]);
  expect(activities).toEqual(
    expect.arrayContaining(['photo', 'guide', 'drink', 'shop']),
  );
  await expect(page.locator('.tourism-panel')).toContainText(
    '6 visitors / min · 6 coins / min',
  );
});
