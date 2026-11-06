import { test, expect, type Page } from '@playwright/test';
import { landTiles, landAtLevel } from '../src/world';
import { validate, landmarks } from '../src/game';
async function openInventory(page: Page, kind: 'decorations' | 'landmarks') {
  const menu = page.locator(`[data-inventory="${kind}"]`);
  if ((await menu.getAttribute('aria-expanded')) !== 'true') await menu.click();
}
async function demoDiscovery(page: Page) {
  await page.getByRole('button', { name: 'Demo worktree' }).click();
  await page.getByRole('button', { name: 'Use ticket · Discover' }).click();
  await page.getByRole('button', { name: 'Skip animation' }).click();
  await page.getByRole('button', { name: 'Keep exploring' }).click();
}

test('demo acquisition, duplicate, placement, move, removal and persistent map', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.goto('/');
  await expect(page.getByText('DEMO · LOCAL FIXTURES')).toBeVisible();
  await demoDiscovery(page);
  await expect(page.getByRole('status')).toContainText(
    'New discovery: Eiffel Tower',
  );
  await demoDiscovery(page);
  await expect(page.getByRole('status')).toContainText(
    'Duplicate discovered: Eiffel Tower',
  );
  await openInventory(page, 'landmarks');
  await page.locator('[data-landmark=eiffel]').click();
  await page
    .getByRole('button', { name: 'Cell 1: empty', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Cell 1: Eiffel Tower', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Cell 1: Eiffel Tower', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Return to collection' }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Cell 2: empty', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Cell 2: Eiffel Tower', exact: true }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Arrange landmarks' }).click();
  await expect(
    page.getByRole('button', { name: 'Cell 2: Eiffel Tower', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Cell 2: Eiffel Tower', exact: true })
    .click();
  await page.getByRole('button', { name: 'Return to collection' }).click();
  await expect(page.locator('[data-landmark=eiffel]')).toContainText(
    'Owned ×2 · 2 available',
  );
  await page.getByRole('button', { name: 'World Map', exact: true }).click();
  await expect(page.locator('.world circle')).toHaveCount(1);
  await expect(page.locator('.world path.acquired')).toHaveCount(1);
  await expect(page.locator('.countries')).toContainText('France 1/1');
  await page.screenshot({ path: 'test-results/landmark-island/map-demo.png' });
});
for (const theme of ['light', 'dark'])
  test(`${theme} responsive island`, async ({ page }) => {
    await page.goto('/');
    await page.evaluate(
      (theme) => (document.documentElement.className = theme),
      theme,
    );
    await page.setViewportSize({ width: 360, height: 800 });
    expect(await page.locator('.cell').count()).toBe(36);
    await page.getByRole('button', { name: 'Show whole island' }).click();
    await expect(page.locator('.ocean')).toHaveAttribute(
      'data-follow',
      'false',
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(360);
    const ocean = await page.locator('.ocean').boundingBox();
    await expect
      .poll(async () =>
        page.locator('.cell').evaluateAll((cells) => {
          const ocean = document
            .querySelector('.ocean')!
            .getBoundingClientRect();
          return cells.every((cell) => {
            const b = cell.getBoundingClientRect();
            return (
              b.x >= ocean.x &&
              b.right <= ocean.right &&
              b.y >= ocean.y &&
              b.bottom <= ocean.bottom
            );
          });
        }),
      )
      .toBe(true);

    await page.screenshot({
      path: `test-results/landmark-island/${theme}-mobile-demo.png`,
      fullPage: true,
    });
  });
test('damaged save is not silently replaced', async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem('landmark-island-demo-v1', '{"version":99}'),
  );
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('not overwritten');
});

test('walk, camera and weather are independent from collection ownership', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'landmark-island-demo-v1',
      JSON.stringify({
        version: 1,
        receipts: [
          { workspaceId: 'fixture', landmark: 'eiffel', at: '2026-11-05' },
        ],
        placements: [{ landmark: 'eiffel', cell: 31 }],
      }),
    ),
  );
  await page.goto('/');
  const ocean = page.getByRole('region', { name: 'Interactive island' }),
    walker = page.getByRole('img', { name: 'Island explorer' });
  await expect(walker).toHaveAttribute('data-cell', '30');
  const buildingDepth = await page
    .locator('[data-world-cell="31"]')
    .evaluate((el) => Number(getComputedStyle(el).zIndex));
  expect(
    await walker.evaluate((el) => Number(getComputedStyle(el).zIndex)),
  ).toBeLessThan(buildingDepth);
  await page
    .getByRole('button', { name: 'Cell 33: empty', exact: true })
    .click();
  await expect(walker).toHaveAttribute('data-cell', '32');
  expect(
    await walker.evaluate((el) => Number(getComputedStyle(el).zIndex)),
  ).toBeGreaterThan(buildingDepth); // Takes a route around the building at 31.
  await ocean.focus();
  await page.keyboard.press('ArrowRight');
  await expect(walker).toHaveAttribute('data-cell', '33');
  await page.getByRole('button', { name: 'Walk north' }).click();
  await expect(walker).toHaveAttribute('data-cell', '27');
  await page.screenshot({
    path: 'test-results/landmark-island/explore-demo.png',
    fullPage: true,
  });
  const saved = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(page.locator('#zoom-value')).toHaveText('115%');
  const camera = page.locator('.camera');
  const before = await camera.getAttribute('style');
  await ocean.scrollIntoViewIfNeeded();
  const box = (await ocean.boundingBox())!;
  await page.mouse.move(box.x + 30, box.y + 180);
  await page.mouse.down();
  await page.mouse.move(box.x + 90, box.y + 210, { steps: 8 });
  await page.mouse.up();
  expect(await camera.getAttribute('style')).not.toBe(before);
  await expect(ocean).toHaveAttribute('data-follow', 'false');
  await page.getByRole('button', { name: 'Reset camera' }).click();
  await expect(page.locator('#zoom-value')).toHaveText('100%');
  await expect(ocean).toHaveAttribute('data-follow', 'true');
  await page.getByLabel('Weather', { exact: true }).selectOption('2');
  await expect(ocean).toHaveAttribute('data-weather', 'rain');
  await page.getByRole('button', { name: 'Change time of day' }).click();
  await page.getByRole('button', { name: 'Change time of day' }).click();
  await expect(ocean).toHaveAttribute('data-phase', 'night');
  await page.screenshot({
    path: 'test-results/landmark-island/rain-night-demo.png',
    animations: 'disabled',
    fullPage: true,
  });
  await page.getByLabel('Weather', { exact: true }).selectOption('3');
  await expect(ocean).toHaveAttribute('data-weather', 'snow');
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(saved);
  await page.getByRole('button', { name: 'World Map', exact: true }).click();
  await expect(page.locator('.world circle')).toHaveCount(1);
});

test('automatic climate cycles, manual override and reduced motion', async ({
  page,
}) => {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const ocean = page.locator('.ocean');
  await expect(ocean).toHaveAttribute('data-weather', 'sunny');
  await page.clock.runFor(30000);
  await expect(ocean).toHaveAttribute('data-weather', 'cloudy');
  await page.clock.runFor(30000);
  await expect(ocean).toHaveAttribute('data-weather', 'rain');
  await expect(ocean).toHaveAttribute('data-phase', 'sunset');
  await page.getByLabel('Weather', { exact: true }).selectOption('0');
  await page.clock.runFor(60000);
  await expect(ocean).toHaveAttribute('data-weather', 'sunny');
  await expect(ocean).toHaveAttribute('data-phase', 'sunset');
  expect(
    await page
      .locator('.cloud-one')
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
  await page
    .getByRole('button', { name: 'Cell 26: empty', exact: true })
    .click();
  await page.clock.runFor(1000);
  await expect(page.locator('.walker')).toHaveAttribute('data-cell', '25');
});

test('expanded land keeps old cell addresses and persists new placements', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.goto('/');
  await page.evaluate(() =>
    localStorage.setItem(
      'landmark-island-demo-v1',
      JSON.stringify({
        version: 1,
        receipts: [
          { workspaceId: 'legacy', landmark: 'eiffel', at: '2026-11-05' },
        ],
        placements: [{ landmark: 'eiffel', cell: 0 }],
      }),
    ),
  );
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Cell 1: Eiffel Tower', exact: true }),
  ).toBeAttached();
  await demoDiscovery(page);
  await openInventory(page, 'landmarks');
  await page.locator('[data-landmark=eiffel]').click();
  await page.getByRole('button', { name: 'Show whole island' }).click();
  const destination = landAtLevel(1).find((t) => t.id >= 36 && !t.prop)!;
  await page
    .getByRole('button', {
      name: `Cell ${destination.id + 1}: empty`,
      exact: true,
    })
    .click();
  await expect(
    page.getByRole('button', {
      name: `Cell ${destination.id + 1}: Eiffel Tower`,
      exact: true,
    }),
  ).toBeAttached();
  await page.reload();
  await expect(
    page.getByRole('button', { name: 'Cell 1: Eiffel Tower', exact: true }),
  ).toBeAttached();
  await expect(
    page.getByRole('button', {
      name: `Cell ${destination.id + 1}: Eiffel Tower`,
      exact: true,
    }),
  ).toBeAttached();
  await expect(page.locator('[data-landmark=eiffel]')).toContainText(
    'Owned ×2 · 0 available',
  );
  await page.getByRole('button', { name: 'Show whole island' }).click();
  await page.screenshot({
    path: 'test-results/landmark-island/large-island-demo.png',
    animations: 'disabled',
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Follow explorer' }).click();
  await expect(page.locator('.ocean')).toHaveAttribute('data-follow', 'true');
});

test('hover wheel zoom needs no focus or modifier, anchors the pointer and leaves outside scrolling alone', async ({
  page,
}) => {
  await page.goto('/');
  const ocean = page.locator('.ocean');
  await page.getByLabel('Weather', { exact: true }).focus();
  await ocean.scrollIntoViewIfNeeded();
  await ocean.scrollIntoViewIfNeeded();
  const box = (await ocean.boundingBox())!;
  const point = { x: box.x + box.width * 0.35, y: box.y + box.height * 0.48 };
  const sample = () =>
    page.evaluate(({ x, y }) => {
      const ocean = document.querySelector<HTMLElement>('.ocean')!,
        rect = ocean.getBoundingClientRect();
      const m = new DOMMatrixReadOnly(
        getComputedStyle(document.querySelector('.camera')!).transform,
      );
      return {
        zoom: m.a,
        x: (x - rect.left - ocean.clientLeft - m.e) / m.a,
        y: (y - rect.top - ocean.clientTop - m.f) / m.d,
        scroll: window.scrollY,
      };
    }, point);
  await page.mouse.move(point.x, point.y);
  await expect
    .poll(() =>
      page
        .locator('.camera')
        .evaluate(
          (el) =>
            el.getAnimations().filter((a) => a.playState === 'running').length,
        ),
    )
    .toBe(0);
  const before = await sample();
  await page.mouse.wheel(0, -120);
  await expect
    .poll(async () => (await sample()).zoom)
    .toBeGreaterThan(before.zoom);
  const after = await sample();
  expect(Math.abs(after.x - before.x)).toBeLessThan(1);
  expect(Math.abs(after.y - before.y)).toBeLessThan(1);
  expect(after.scroll).toBe(before.scroll);
  await expect(page.getByLabel('Weather', { exact: true })).toBeFocused();
  await expect(ocean).toHaveAttribute('data-follow', 'false');
  await page.mouse.wheel(0, 120);
  await expect
    .poll(async () => (await sample()).zoom)
    .toBeCloseTo(before.zoom, 2);
  await page.mouse.wheel(0, -10000);
  await expect(page.locator('#zoom-value')).toHaveText('180%');
  await page.mouse.wheel(0, 10000);
  await expect(page.locator('#zoom-value')).toHaveText('12%');
  await page.mouse.wheel(0, 120);
  await expect(page.locator('#zoom-value')).toHaveText('12%');
  expect((await sample()).scroll).toBe(before.scroll);
  await page.mouse.move(5, 100);
  await page.mouse.wheel(0, 200);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(before.scroll);
  await expect(page.locator('#zoom-value')).toHaveText('12%');
  await page.getByRole('button', { name: 'Follow explorer' }).click();
  await expect(ocean).toHaveAttribute('data-follow', 'true');
});

test('field guide describes all landmarks, including unowned ones, without changing the save', async ({
  page,
}) => {
  await page.goto('/');
  const before = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  const entries = landmarks.map(({ id, name, country }) => [id, name, country]);
  for (const [id, name, country] of entries) {
    const about = page.locator(`[data-info="${id}"]`);
    await expect(page.locator(`[data-landmark="${id}"]`)).toBeDisabled();
    await openInventory(page, 'landmarks');
    await about.click();
    const dialog = page.getByRole('dialog', { name, exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('.detail-country')).toContainText(country);
    expect(
      (await dialog.locator('#detail-description').innerText()).length,
    ).toBeGreaterThan(100);
    await expect(dialog.getByRole('link')).toHaveAttribute(
      'href',
      /^https:\/\//,
    );
    await expect(
      dialog.getByRole('button', { name: 'Close landmark details' }),
    ).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(about).toBeFocused();
  }
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(before);
  await expect(page.locator('.ocean')).toHaveAttribute('data-mode', 'walk');
  await page.setViewportSize({ width: 360, height: 800 });
  await openInventory(page, 'landmarks');
  await page.locator('[data-info="giza"]').click();
  const dialog = page.getByRole('dialog');
  const bounds = (await dialog.boundingBox())!;
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(360);
  expect(bounds.height).toBeLessThanOrEqual(760);
  await page.screenshot({
    path: 'test-results/landmark-island/details-mobile-demo.png',
  });
  await dialog.getByRole('button', { name: 'Close landmark details' }).click();
  await expect(dialog).not.toBeVisible();
});

test('a placed building opens its story during exploration and stays movable in arrange mode', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'landmark-island-demo-v1',
      JSON.stringify({
        version: 1,
        receipts: [
          { workspaceId: 'story-fixture', landmark: 'taj', at: '2026-11-05' },
        ],
        placements: [{ landmark: 'taj', cell: 31 }],
      }),
    ),
  );
  await page.goto('/');
  const saved = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  await page
    .getByRole('button', { name: 'Landmark: Taj Mahal', exact: true })
    .click();
  const dialog = page.getByRole('dialog', { name: 'Taj Mahal', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('India · Agra');
  await expect(dialog).toContainText('Mumtaz Mahal');
  await expect(page.locator('.walker')).toHaveAttribute('data-cell', '30');
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(saved);
  await page.screenshot({
    path: 'test-results/landmark-island/details-demo.png',
  });
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Arrange landmarks' }).click();
  await page
    .getByRole('button', { name: 'Landmark: Taj Mahal', exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Return to collection' }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Cell 33: empty', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Cell 33: Taj Mahal', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Explore island' }).click();
  await page
    .getByRole('button', { name: 'Cell 33: Taj Mahal', exact: true })
    .click();
  await expect(dialog).toBeVisible();
});

test('rarity filters, discoveries and progress distinguish unique landmarks from duplicates', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const fixtureWindow = window as typeof window & { fixtureRoll: number };
    fixtureWindow.fixtureRoll = 0.999;
    let roll = 0;
    Math.random = () => (roll++ % 2 === 0 ? fixtureWindow.fixtureRoll : 0);
  });
  await page.goto('/');
  await demoDiscovery(page);
  await expect(page.getByRole('status')).toContainText(
    'New discovery: Great Pyramid of Giza',
  );
  await expect(page.getByRole('status').locator('.rarity-badge')).toHaveText(
    'IVWonder',
  );
  await expect(
    page
      .getByRole('status')
      .getByRole('img', { name: 'Wonder, rarity 4 of 4', exact: true }),
  ).toBeVisible();
  await expect(page.locator('#discovery-progress')).toHaveAttribute(
    'value',
    '1',
  );
  await demoDiscovery(page);
  await expect(page.getByRole('status')).toContainText(
    'Duplicate discovered: Great Pyramid of Giza',
  );
  await expect(page.locator('[data-landmark="giza"]')).toContainText(
    'Owned ×2',
  );
  await expect(
    page
      .getByRole('status')
      .getByRole('img', { name: 'Wonder, rarity 4 of 4', exact: true }),
  ).toBeVisible();
  await expect(page.locator('#discovery-progress')).toHaveAttribute(
    'value',
    '1',
  );
  const before = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  const camera = await page.locator('.camera').getAttribute('style');
  for (const [tier, visible, collected, chance, rank, name] of [
    ['common', 18, 0, 70, 1, 'Discovery'],
    ['rare', 9, 0, 23, 2, 'Treasure'],
    ['epic', 6, 0, 6, 3, 'Marvel'],
    ['legendary', 3, 1, 1, 4, 'Wonder'],
  ] as const) {
    const filter = page.locator(`[data-tier-filter="${tier}"]`);
    await openInventory(page, 'landmarks');
    await filter.click();
    await expect(filter).toHaveAttribute('aria-pressed', 'true');
    await expect(filter).toBeFocused();
    await expect(filter).toContainText(`${collected}/${visible}`);
    await expect(
      filter.getByRole('img', {
        name: `${name}, rarity ${rank} of 4`,
        exact: true,
      }),
    ).toBeVisible();
    await expect(filter.locator('.rarity-scale i')).toHaveCount(4);
    await expect(filter.locator('.rarity-scale .filled')).toHaveCount(rank);
    for (const badge of await page
      .locator(`.card[data-tier="${tier}"] .rarity-badge`)
      .all()) {
      await expect(badge).toHaveAttribute(
        'aria-label',
        `${name}, rarity ${rank} of 4`,
      );
      await expect(badge.locator('.rarity-scale .filled')).toHaveCount(rank);
    }
    await expect(page.locator('.collection .card:visible')).toHaveCount(
      visible,
    );
    await expect(page.locator('.rarity-summary')).toContainText(
      `${chance}% tier chance`,
    );
    await expect(page.locator('.rarity-summary')).toContainText(
      `${collected} of ${visible} discovered`,
    );
  }
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(before);
  expect(await page.locator('.camera').getAttribute('style')).toBe(camera);
  await expect(page.locator('.ocean')).toHaveAttribute('data-mode', 'walk');
  await openInventory(page, 'landmarks');
  await page.locator('[data-info="giza"]').click();
  await expect(page.getByRole('dialog').locator('.rarity-badge')).toContainText(
    'Wonder',
  );
  await expect(page.getByRole('dialog')).toContainText(
    '1% tier chance per draw',
  );
  await expect(
    page
      .getByRole('dialog')
      .getByRole('img', { name: 'Wonder, rarity 4 of 4', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await page.evaluate(() => {
    (window as typeof window & { fixtureRoll: number }).fixtureRoll = 0;
  });
  await demoDiscovery(page);
  await expect(page.getByRole('status').locator('.rarity-badge')).toContainText(
    'Discovery',
  );
  await expect(page.locator('#discovery-progress')).toHaveAttribute(
    'value',
    '2',
  );
  await expect(page.locator('[data-tier-filter="legendary"]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await openInventory(page, 'landmarks');
  await page.locator('[data-tier-filter="all"]').click();
  await expect(page.locator('.collection .card:visible')).toHaveCount(36);
  await expect(page.locator('[data-tier-filter="all"]')).toContainText('2/36');
  await openInventory(page, 'landmarks');
  await page.locator('.canvas-inventory').screenshot({
    path: 'test-results/landmark-island/rarity-collection-demo.png',
  });
  await page.reload();
  await expect(page.locator('#discovery-progress')).toHaveAttribute(
    'value',
    '2',
  );
  await page.setViewportSize({ width: 360, height: 800 });
  await page.evaluate(() => {
    document.documentElement.className = 'dark';
  });
  await openInventory(page, 'landmarks');
  await page.locator('[data-tier-filter="legendary"]').click();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(360);
  await openInventory(page, 'landmarks');
  await page.locator('.canvas-inventory').screenshot({
    path: 'test-results/landmark-island/rarity-mobile-demo.png',
  });
});

test('owned Wonder moves in the guide and on the island, with a static reduced-motion alternative', async ({
  page,
}) => {
  await page.addInitScript(() => {
    let roll = 0;
    Math.random = () => (roll++ % 2 === 0 ? 0.999 : 0);
  });
  await page.goto('/');
  const cardBody = page.locator('[data-landmark="giza"] .wonder-body');
  expect(
    await cardBody.evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
  await openInventory(page, 'landmarks');
  await page.locator('[data-info="giza"]').click();
  expect(
    await page
      .locator('.detail-art .wonder-body')
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
  await page.keyboard.press('Escape');
  await demoDiscovery(page);
  await expect(page.locator('[data-landmark="giza"]')).toContainText(
    'Owned ×1',
  );
  await openInventory(page, 'landmarks');
  const cardStart = await cardBody.evaluate(
    (el) => getComputedStyle(el).transform,
  );
  await expect
    .poll(() => cardBody.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(cardStart);
  await openInventory(page, 'landmarks');
  await page.locator('[data-landmark="giza"]').click();
  await page
    .getByRole('button', { name: 'Cell 32: empty', exact: true })
    .click();
  await expect(
    page.getByRole('button', {
      name: 'Landmark: Great Pyramid of Giza',
      exact: true,
    }),
  ).toBeVisible();
  const islandBody = page.locator('.building .wonder-body');
  const islandStart = await islandBody.evaluate(
    (el) => getComputedStyle(el).transform,
  );
  await expect
    .poll(() => islandBody.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(islandStart);
  const orbit = page.locator('.building .wonder-orbit');
  const orbitStart = await orbit.evaluate(
    (el) => getComputedStyle(el).transform,
  );
  await expect
    .poll(() => orbit.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(orbitStart);
  const save = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  await page.getByRole('button', { name: 'Explore island' }).click();
  await page
    .getByRole('button', {
      name: 'Landmark: Great Pyramid of Giza',
      exact: true,
    })
    .click();
  const detailBody = page.locator('.detail-art .wonder-body');
  const detailStart = await detailBody.evaluate(
    (el) => getComputedStyle(el).transform,
  );
  await expect
    .poll(() => detailBody.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(detailStart);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const selector of [
    '.wonder-body',
    '.wonder-orbit',
    '.wonder-spark',
    '.wonder-shadow',
  ]) {
    expect(
      await page
        .locator(selector)
        .evaluateAll((els) =>
          els.every((el) => getComputedStyle(el).animationName === 'none'),
        ),
    ).toBe(true);
  }
  expect(
    await detailBody.evaluate((el) => getComputedStyle(el).transform),
  ).not.toBe('none');
  await page.screenshot({
    path: 'test-results/landmark-island/wonder-detail-demo.png',
  });
  await page.keyboard.press('Escape');
  await page.locator('.ocean').screenshot({
    path: 'test-results/landmark-island/wonder-island-demo.png',
  });
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(save);
});

test('tickets accumulate before drawing; map reveal commits once and survives reload', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.goto('/');
  await expect(page.locator('#draw-ticket')).toBeDisabled();
  for (let i = 0; i < 3; i++)
    await page.getByRole('button', { name: 'Demo worktree' }).click();
  await expect(page.locator('#ticket-count')).toHaveText('3');
  await expect(page.locator('#discovery-progress')).toHaveAttribute(
    'value',
    '0',
  );
  await page.reload();
  await expect(page.locator('#ticket-count')).toHaveText('3');
  await page.locator('#draw-ticket').evaluate((button: HTMLButtonElement) => {
    button.click();
    button.click();
  });
  const theatre = page.locator('.discovery-theatre');
  await expect(theatre).toBeVisible();
  await expect(theatre.locator('.discovery-result')).toBeHidden();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
  );
  expect(saved.tickets).toHaveLength(3);
  expect(saved.receipts).toHaveLength(1);
  await page.waitForTimeout(1600);
  await theatre.screenshot({
    path: 'test-results/landmark-island/map-unfold-demo.png',
  });
  await expect(theatre.locator('.discovery-result')).toBeVisible();
  await expect(theatre.getByRole('heading')).toHaveText('Eiffel Tower');
  await theatre.screenshot({
    path: 'test-results/landmark-island/discovery-result-demo.png',
  });
  await page.getByRole('button', { name: 'Place on island' }).click();
  await expect(page.locator('.ocean')).toHaveAttribute('data-mode', 'build');
  await expect(page.locator('.ocean')).toBeFocused();
  await page
    .getByRole('button', { name: 'Cell 1: empty', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Cell 1: Eiffel Tower', exact: true }),
  ).toBeVisible();
  await page.locator('#draw-ticket').click();
  await expect(theatre).toBeVisible();
  await page.reload();
  await expect(page.locator('#ticket-count')).toHaveText('1');
  await expect(page.locator('[data-landmark=eiffel]')).toContainText(
    'Owned ×2',
  );
  await expect(theatre).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 360, height: 800 });
  await page.locator('#draw-ticket').click();
  await expect(theatre.locator('.discovery-result')).toBeVisible();
  await expect(
    theatre.getByRole('button', { name: 'Skip animation' }),
  ).toBeHidden();
  await expect(theatre.locator('.reveal-quantity')).toContainText('Owned ×3');
  const box = await theatre.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(360);
  await theatre.screenshot({
    path: 'test-results/landmark-island/discovery-mobile-demo.png',
  });
  await page.keyboard.press('Escape');
  await expect(page.locator('#ticket-count')).toHaveText('0');
  await expect(page.locator('#draw-ticket')).toBeDisabled();
});

test('failed save retains ticket; retry and Escape reveal without charging again', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Demo worktree' }).click();
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      Storage.prototype.setItem = original;
      throw Error('Fixture storage failure');
    };
  });
  await page.locator('#draw-ticket').click();
  await expect(page.getByRole('alert')).toContainText(
    'Fixture storage failure',
  );
  await expect(page.locator('.discovery-theatre')).toHaveCount(0);
  await expect(page.locator('#ticket-count')).toHaveText('1');
  await page.getByRole('button', { name: 'Retry discovery' }).click();
  await expect(page.locator('.discovery-theatre')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.discovery-result')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#ticket-count')).toHaveText('0');
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
  );
  expect(saved.receipts).toHaveLength(1);
  expect(saved.tickets).toHaveLength(1);
});

test('Treasure, Marvel and Wonder reveal distinct effects with accessible ranks', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const fixture = window as typeof window & { fixtureRoll: number };
    fixture.fixtureRoll = 0.7;
    Math.random = () => fixture.fixtureRoll;
  });
  await page.goto('/');
  for (const [roll, tier, rank] of [
    [0.7, 'rare', 2],
    [0.93, 'epic', 3],
    [0.999, 'legendary', 4],
  ] as const) {
    await page.evaluate((roll) => {
      (window as typeof window & { fixtureRoll: number }).fixtureRoll = roll;
    }, roll);
    await page.getByRole('button', { name: 'Demo worktree' }).click();
    await page.locator('#draw-ticket').click();
    const theatre = page.locator('.discovery-theatre');
    await expect(theatre).toHaveAttribute('data-tier', tier);
    const before = await theatre.boundingBox();
    await page.getByRole('button', { name: 'Skip animation' }).click();
    const after = await theatre.boundingBox();
    expect(Math.abs(before!.height - after!.height)).toBeLessThan(2);
    await expect(
      theatre.getByRole('img', { name: new RegExp(`rarity ${rank} of 4`) }),
    ).toBeVisible();
    if (tier === 'epic')
      expect(
        await theatre
          .locator('.discovery-mist')
          .evaluate((e) => getComputedStyle(e).animationName),
      ).toBe('mist-drift');
    if (tier === 'legendary') {
      expect(
        await theatre
          .locator('.wonder-body')
          .evaluate((e) => getComputedStyle(e).animationName),
      ).toBe('wonder-levitate');
      expect(
        Number(
          await theatre
            .locator('.discovery-orbit')
            .evaluate((e) => getComputedStyle(e).opacity),
        ),
      ).toBeGreaterThan(0);
      await theatre.screenshot({
        path: 'test-results/landmark-island/wonder-reveal-demo.png',
      });
    }
    await page.getByRole('button', { name: 'Keep exploring' }).click();
    await expect(page.locator('#ticket-count')).toHaveText('0');
  }
});

test('cinematic discovery reveals rarity before artwork, then information and actions', async ({
  page,
}) => {
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await page.addInitScript(() => {
    let roll = 0;
    Math.random = () => (roll++ % 2 === 0 ? 0.999 : 0);
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Demo worktree' }).click();
  await page.locator('#draw-ticket').click();
  const theatre = page.locator('.discovery-theatre');
  const result = theatre.locator('.discovery-result');
  const actions = theatre.locator('.reveal-actions');
  const saved = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  await expect(theatre).toHaveAttribute('data-phase', 'invitation');
  await page.clock.runFor(900);
  await expect(theatre).toHaveAttribute('data-phase', 'journey');
  expect(
    await theatre.evaluate((e) =>
      getComputedStyle(e).getPropertyValue('--reveal-color').trim(),
    ),
  ).toBe('#dce9d3');
  await expect(result).toBeHidden();
  await expect(actions).toBeHidden();
  await expect(theatre.locator('.discovery-monument')).toHaveCSS(
    'opacity',
    '0',
  );
  const cameraBefore = await theatre
    .locator('.atlas-camera')
    .evaluate((e) => getComputedStyle(e).transform);
  await page.waitForTimeout(200);
  expect(
    await theatre
      .locator('.atlas-camera')
      .evaluate((e) => getComputedStyle(e).transform),
  ).not.toBe(cameraBefore);
  await page.clock.runFor(1300);
  await expect(theatre).toHaveAttribute('data-phase', 'omen');
  expect(
    await theatre.evaluate((e) =>
      getComputedStyle(e).getPropertyValue('--reveal-color').trim(),
    ),
  ).toBe('#ffdc77');
  await expect(theatre.locator('.omen-label')).toContainText('Wonder');
  await expect(theatre.getByRole('status')).toHaveText(
    'Wonder on the horizon…',
  );
  await expect(result).toBeHidden();
  await page.waitForTimeout(500);
  await theatre.screenshot({
    path: 'test-results/landmark-island/wonder-omen-demo.png',
  });
  await page.clock.runFor(1500);
  await expect(theatre).toHaveAttribute('data-phase', 'burst');
  await expect(actions).toBeHidden();
  await page.clock.runFor(350);
  await expect(theatre).toHaveAttribute('data-phase', 'monument');
  await expect(result).toBeHidden();
  await page.clock.runFor(650);
  await expect(theatre).toHaveAttribute('data-phase', 'details');
  await expect(result).toBeVisible();
  await expect(actions).toBeHidden();
  await page.clock.runFor(450);
  await expect(theatre).toHaveAttribute('data-phase', 'complete');
  await expect(actions).toBeVisible();
  await expect(
    theatre.getByRole('button', { name: 'Place on island' }),
  ).toBeFocused();
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(saved);
  await page.waitForTimeout(1300);
  await theatre.screenshot({
    path: 'test-results/landmark-island/cinematic-result-demo.png',
  });
  await page.getByRole('button', { name: 'Keep exploring' }).click();
  await page.getByRole('button', { name: 'Demo worktree' }).click();
  await page.locator('#draw-ticket').click();
  await page.clock.runFor(2200);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(theatre).toHaveAttribute('data-phase', 'complete');
  await expect(actions).toBeVisible();
  await expect(theatre.locator('.discovery-flash')).toBeHidden();
  await page.clock.runFor(10000);
  await expect(theatre).toHaveAttribute('data-phase', 'complete');
  await page.keyboard.press('Escape');
  await expect(theatre).toHaveCount(0);
});

test('standalone reveal preview replays every rarity without accessing the save', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem('landmark-island-demo-v1', 'preserve-this-save');
    const read = Storage.prototype.getItem;
    let calls = 0;
    Object.defineProperty(window, 'previewStorageCalls', { get: () => calls });
    Storage.prototype.getItem = function (key) {
      calls++;
      return read.call(this, key);
    };
    Storage.prototype.setItem = () => {
      throw Error('Preview must not write storage');
    };
  });
  await page.goto('/?preview=reveal&tier=legendary&autoplay=1');
  await expect(page).toHaveTitle('Landmark Island · Reveal Preview');
  const theatre = page.locator('.discovery-theatre');
  await expect(theatre).toHaveAttribute('data-tier', 'legendary');
  await expect(page.locator('.ocean')).toHaveCount(0);
  await page.getByRole('button', { name: 'Skip animation' }).click();
  await expect(theatre).toContainText('Preview only · No ticket used');
  await expect(
    theatre.getByRole('button', { name: 'Place on island' }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Replay animation' }).click();
  await expect(theatre).toHaveCount(1);
  await expect(theatre).toHaveAttribute('data-phase', 'invitation');
  await page.getByRole('button', { name: 'Skip animation' }).click();
  await page.getByRole('button', { name: 'Choose rarity' }).click();
  for (const tier of ['common', 'rare', 'epic', 'legendary']) {
    await page.locator(`[data-preview-tier=${tier}]`).click();
    await expect(theatre).toHaveAttribute('data-tier', tier);
    await page.keyboard.press('Escape');
    await expect(theatre).toHaveAttribute('data-phase', 'complete');
    await page.keyboard.press('Escape');
    await expect(page.locator(`[data-preview-tier=${tier}]`)).toBeFocused();
  }
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { previewStorageCalls: number })
          .previewStorageCalls,
    ),
  ).toBe(0);
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe('preserve-this-save');
  expect(errors).toEqual([]);
  await page.setViewportSize({ width: 360, height: 800 });
  await page.screenshot({
    path: 'test-results/landmark-island/reveal-preview-mobile.png',
  });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(360);
});

test('host theme tokens update reading and controls live while preserving game art and state', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'landmark-island-demo-v1',
      JSON.stringify({
        version: 1,
        receipts: [
          { workspaceId: 'theme-fixture', landmark: 'taj', at: '2026-11-05' },
        ],
        placements: [{ landmark: 'taj', cell: 31 }],
      }),
    );
  });
  await page.goto('/');
  const save = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  const camera = await page.locator('.camera').getAttribute('style');
  const art = await page.locator('.world-ground').innerHTML();
  const water = await page
    .locator('.ocean')
    .evaluate((e) => getComputedStyle(e).backgroundImage);
  for (const dark of [false, true]) {
    const tokens = dark
      ? {
          background: '#111827',
          foreground: '#e5e7eb',
          card: '#1f2937',
          'card-foreground': '#f9fafb',
          popover: '#172033',
          'popover-foreground': '#e0f2fe',
          primary: '#67e8f9',
          'primary-foreground': '#083344',
          secondary: '#334155',
          'secondary-foreground': '#f1f5f9',
          accent: '#164e63',
          'accent-foreground': '#cffafe',
          border: '#64748b',
          input: '#94a3b8',
          ring: '#fbbf24',
          'muted-foreground': '#cbd5e1',
          radius: '10px',
        }
      : {
          background: '#f6f4ef',
          foreground: '#202a38',
          card: '#ffffff',
          'card-foreground': '#202a38',
          popover: '#fffcf6',
          'popover-foreground': '#2d252a',
          primary: '#6f2c58',
          'primary-foreground': '#ffffff',
          secondary: '#e2e6eb',
          'secondary-foreground': '#192635',
          accent: '#eddaea',
          'accent-foreground': '#491e40',
          border: '#89808e',
          input: '#706878',
          ring: '#0070a6',
          'muted-foreground': '#5b5f66',
          radius: '10px',
        };
    await page.evaluate(
      ({ tokens, dark }) => {
        document.documentElement.className = dark ? 'dark' : 'light';
        for (const [name, value] of Object.entries(tokens))
          document.documentElement.style.setProperty(`--orca-${name}`, value);
      },
      { tokens, dark },
    );
    const rgb = (hex: string) =>
      `rgb(${[1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16)).join(', ')})`;
    await expect(page.locator('html')).toHaveCSS(
      'background-color',
      rgb(tokens.background),
    );
    await expect(page.locator('html')).toHaveCSS(
      'color',
      rgb(tokens.foreground),
    );
    await expect(page.locator('html')).toHaveCSS('font-size', '16px');
    await expect(page.locator('#ticket-count')).toHaveCSS(
      'background-color',
      rgb(tokens.primary),
    );
    await expect(page.locator('#ticket-count')).toHaveCSS(
      'color',
      rgb(tokens['primary-foreground']),
    );
    await expect(page.locator('.climate-controls select')).toHaveCSS(
      'border-top-color',
      rgb(tokens.input),
    );
    await page.locator('[data-view=island]').focus();
    await expect(page.locator('[data-view=island]')).toHaveCSS(
      'outline-color',
      rgb(tokens.ring),
    );
    await expect(page.locator('[data-view=island]')).toHaveCSS(
      'outline-style',
      'solid',
    );
    await expect(page.locator('.camera-controls')).toHaveCSS(
      'background-color',
      rgb(tokens.popover),
    );
    await expect(page.locator('.camera-controls button').first()).toHaveCSS(
      'color',
      rgb(tokens['secondary-foreground']),
    );
    expect(await page.locator('.camera').getAttribute('style')).toBe(camera);
    expect(await page.locator('.world-ground').innerHTML()).toBe(art);
    expect(
      await page
        .locator('.ocean')
        .evaluate((e) => getComputedStyle(e).backgroundImage),
    ).toBe(water);
    await page.screenshot({
      path: `test-results/landmark-island/host-theme-${dark ? 'dark' : 'light'}.png`,
    });
    await openInventory(page, 'landmarks');
    await page.locator('[data-info=taj]').click();
    await expect(page.locator('.landmark-detail')).toHaveCSS(
      'background-color',
      rgb(tokens.popover),
    );
    await expect(page.locator('.landmark-detail')).toHaveCSS(
      'color',
      rgb(tokens['popover-foreground']),
    );
    await expect(page.locator('.landmark-detail')).toHaveCSS(
      'border-top-left-radius',
      '10px',
    );
    await page.keyboard.press('Escape');
  }
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(save);
  await page.getByRole('button', { name: 'Demo worktree' }).click();
  await page.locator('#draw-ticket').click();
  await page.getByRole('button', { name: 'Skip animation' }).click();
  await expect(page.locator('.discovery-theatre')).toHaveCSS(
    'background-color',
    'rgb(23, 32, 51)',
  );
  await expect(page.locator('.discovery-result h2')).toHaveCSS(
    'color',
    'rgb(224, 242, 254)',
  );
  await expect(page.locator('.reveal-place')).toHaveCSS(
    'background-color',
    'rgb(103, 232, 249)',
  );
  await expect(page.locator('.reveal-place')).toHaveCSS(
    'color',
    'rgb(8, 51, 68)',
  );
  await page
    .locator('.discovery-theatre')
    .screenshot({ path: 'test-results/landmark-island/host-theme-reveal.png' });
});

test('host source links use the public external-link API only on click', async ({
  page,
  context,
}) => {
  await page.addInitScript(() => {
    const fixture = window as unknown as {
      externalLinks: string[];
      refuseLink: boolean;
      orca: unknown;
    };
    fixture.externalLinks = [];
    fixture.refuseLink = false;
    fixture.orca = {
      plugin: {
        request: async () => ({
          version: 2,
          tickets: [],
          receipts: [],
          placements: [],
        }),
        on: () => {},
      },
      shell: {
        openExternal: async (url: string) => {
          fixture.externalLinks.push(url);
          if (fixture.refuseLink) throw Error('Fixture failure');
          return { opened: true };
        },
      },
    };
  });
  await page.goto('/');
  await openInventory(page, 'landmarks');
  await page.locator('[data-info=eiffel]').click();
  expect(
    await page.evaluate(
      () => (window as unknown as { externalLinks: string[] }).externalLinks,
    ),
  ).toEqual([]);
  const link = page.locator('.detail-source a');
  const url = await link.getAttribute('href');
  await link.click();
  expect(
    await page.evaluate(
      () => (window as unknown as { externalLinks: string[] }).externalLinks,
    ),
  ).toEqual([url]);
  expect(context.pages()).toHaveLength(1);
  await page.evaluate(() => {
    (window as unknown as { refuseLink: boolean }).refuseLink = true;
  });
  await link.click();
  await expect(page.getByRole('alert')).toHaveText(
    'Could not open the source. Please try again.',
  );
  await expect(page.locator('.landmark-detail')).toBeVisible();
});

const backupFixture = {
  version: 2,
  tickets: [
    { workspaceId: 'saved-ticket', at: '2026-11-06' },
    { workspaceId: 'unused-ticket', at: '2026-11-06' },
  ],
  receipts: [
    { workspaceId: 'saved-ticket', landmark: 'eiffel', at: '2026-11-06' },
  ],
  placements: [{ landmark: 'eiffel', cell: 0 }],
};
const backupFile = (state: unknown) =>
  JSON.stringify({
    format: 'landmark-island-backup',
    version: 1,
    exportedAt: '2026-11-06T00:00:00.000Z',
    state,
  });
const uploadBackup = (page: Page, text: string) =>
  page.locator('#backup-file').setInputFiles({
    name: 'island.json',
    mimeType: 'application/json',
    buffer: Buffer.from(text),
  });
async function seedBackup(page: Page) {
  await page.goto('/');
  await page.evaluate(
    (s) => localStorage.setItem('landmark-island-demo-v1', JSON.stringify(s)),
    backupFixture,
  );
  await page.reload();
  await page.getByRole('button', { name: 'Backups', exact: true }).click();
  await expect(page.locator('#backup-save')).toBeEnabled();
}

test('backup download, confirmed replacement, restart and pre-restore recovery', async ({
  page,
}) => {
  await seedBackup(page);
  const downloadEvent = page.waitForEvent('download');
  await page.locator('#backup-save').click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toMatch(/^landmark-island-.*\.json$/);
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(chunk);
  const exported = JSON.parse(Buffer.concat(chunks).toString());
  expect(exported.state).toEqual(validate(backupFixture));
  const incoming = {
    ...backupFixture,
    receipts: [
      { workspaceId: 'saved-ticket', landmark: 'giza', at: '2026-11-06' },
    ],
    placements: [
      { landmark: 'giza', cell: landTiles.find((t) => t.id > 36)!.id },
    ],
  };
  await uploadBackup(page, backupFile(incoming));
  await expect(page.locator('.backup-incoming')).toContainText(
    '1 unused tickets · 1 landmarks (1 unique) · 1 placed',
  );
  await expect(page.locator('#backup-restore')).toBeDisabled();
  await page.keyboard.press('Escape');
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
    ),
  ).toEqual(backupFixture);
  await expect(
    page.getByRole('button', { name: 'Backups', exact: true }),
  ).toBeFocused();
  await page.getByRole('button', { name: 'Backups', exact: true }).click();
  await uploadBackup(page, backupFile(incoming));
  await page.locator('#backup-confirm').check();
  await page.locator('#backup-restore').click();
  await expect(page.locator('.backup-status')).toContainText(
    'Island restored.',
  );
  expect(
    await page.evaluate(() =>
      JSON.parse(
        localStorage.getItem('landmark-island-demo-v1-before-restore')!,
      ),
    ),
  ).toEqual(validate(backupFixture));
  await page.reload();
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
    ),
  ).toEqual(validate(incoming));
  await expect(page.locator('[data-landmark=giza]')).toContainText('Owned ×1');
  await page.getByRole('button', { name: 'Backups', exact: true }).click();
  await page.locator('#backup-previous').click();
  await page.setViewportSize({ width: 390, height: 844 });
  for (const theme of ['light', 'dark']) {
    await page.evaluate((t) => (document.documentElement.className = t), theme);
    await page
      .locator('.backup-dialog')
      .screenshot({ path: `test-results/landmark-island/backup-${theme}.png` });
    expect(
      await page
        .locator('.backup-dialog')
        .evaluate((e) => e.scrollWidth <= e.clientWidth),
    ).toBe(true);
  }
  await page.locator('#backup-confirm').check();
  await page.locator('#backup-restore').click();
  await expect(page.locator('.backup-status')).toContainText(
    'Island restored.',
  );
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
    ),
  ).toEqual(validate(backupFixture));
});

test('backup rejects damaged, future, oversized files and stale restore previews', async ({
  page,
}) => {
  await seedBackup(page);
  for (const text of [
    '{',
    'null',
    backupFile(null),
    backupFile({ ...backupFixture, version: 99 }),
    backupFile({ ...backupFixture, tickets: [] }),
    ' '.repeat(256 * 1024 + 1),
  ]) {
    await uploadBackup(page, text);
    await expect(page.locator('.backup-status')).toHaveAttribute(
      'role',
      'alert',
    );
    await expect(page.locator('#backup-restore')).toBeDisabled();
    expect(
      await page.evaluate(() =>
        JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
      ),
    ).toEqual(backupFixture);
  }
  await uploadBackup(
    page,
    backupFile({ version: 2, tickets: [], receipts: [], placements: [] }),
  );
  await page.locator('#backup-confirm').check();
  const changed = {
    ...backupFixture,
    tickets: [
      ...backupFixture.tickets,
      { workspaceId: 'arrived-now', at: '2026-11-06' },
    ],
  };
  await page.evaluate(
    (s) => localStorage.setItem('landmark-island-demo-v1', JSON.stringify(s)),
    changed,
  );
  await page.locator('#backup-restore').click();
  await expect(page.locator('.backup-status')).toContainText(
    'Your island changed',
  );
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
    ),
  ).toEqual(changed);
  expect(
    await page.evaluate(() =>
      localStorage.getItem('landmark-island-demo-v1-before-restore'),
    ),
  ).toBeNull();
});

test('restore keeps the current island when recovery storage fails', async ({
  page,
}) => {
  await seedBackup(page);
  await page.evaluate(() => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.endsWith('-before-restore')) throw Error('Recovery storage full');
      return set.call(this, key, value);
    };
  });
  await uploadBackup(
    page,
    backupFile({ version: 2, tickets: [], receipts: [], placements: [] }),
  );
  await page.locator('#backup-confirm').check();
  await page.locator('#backup-restore').click();
  await expect(page.locator('.backup-status')).toContainText(
    'Recovery storage full',
  );
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
    ),
  ).toEqual(backupFixture);
});

test('host backup export calls saveAs only from a fresh click and reports cancellation/errors', async ({
  page,
}) => {
  await page.addInitScript(
    ({ text }) => {
      const fixture = window as unknown as {
        orca: unknown;
        saved: unknown[];
        fail: boolean;
      };
      fixture.saved = [];
      fixture.fail = false;
      fixture.orca = {
        plugin: {
          request: async (name: string) =>
            name === 'island.backup' ? text : JSON.parse(text).state,
          on: () => {},
        },
        files: {
          saveAs: async (options: unknown) => {
            fixture.saved.push({
              options,
              active: navigator.userActivation.isActive,
            });
            if (fixture.fail) throw Error('Save dialog unavailable');
            return { status: 'cancelled' };
          },
        },
      };
    },
    { text: backupFile(backupFixture) },
  );
  await page.goto('/');
  await page.getByRole('button', { name: 'Backups', exact: true }).click();
  await expect(page.locator('#backup-save')).toBeEnabled();
  expect(
    await page.evaluate(
      () => (window as unknown as { saved: unknown[] }).saved,
    ),
  ).toEqual([]);
  await page.locator('#backup-save').click();
  await expect(page.locator('.backup-status')).toContainText('Save cancelled');
  const saved = await page.evaluate(
    () =>
      (
        window as unknown as {
          saved: {
            active: boolean;
            options: { data: string; mimeType: string };
          }[];
        }
      ).saved,
  );
  expect(saved[0].active).toBe(true);
  expect(saved[0].options.mimeType).toBe('application/json');
  expect(JSON.parse(saved[0].options.data).state).toEqual(backupFixture);
  await page.evaluate(
    () => ((window as unknown as { fail: boolean }).fail = true),
  );
  await page.locator('#backup-save').click();
  await expect(page.locator('.backup-status')).toContainText(
    'Could not save the backup',
  );
});

test('material artwork keeps local paint references isolated across collection, copies and details', async ({
  page,
}) => {
  const svgErrors: string[] = [];
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /<path>|attribute d|SVG/i.test(message.text())
    )
      svgErrors.push(message.text());
  });
  const ids = [...landmarks.map((l) => l.id), 'giza'];
  const save = {
    version: 2,
    tickets: ids.map((_, i) => ({
      workspaceId: `art-fixture-${i}`,
      at: '2026-11-06',
    })),
    receipts: ids.map((landmark, i) => ({
      workspaceId: `art-fixture-${i}`,
      landmark,
      at: '2026-11-06',
    })),
    placements: [
      { landmark: 'giza', cell: 0 },
      { landmark: 'giza', cell: 1 },
    ],
  };
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(
    (s) => localStorage.setItem('landmark-island-demo-v1', JSON.stringify(s)),
    save,
  );
  await page.reload();
  await expect(page.locator('.collection .landmark-art')).toHaveCount(36);
  await expect(page.locator('.building .landmark-art')).toHaveCount(2);
  await page.setViewportSize({ width: 1200, height: 1000 });
  await openInventory(page, 'landmarks');
  await page.locator('.canvas-inventory').screenshot({
    path: 'test-results/landmark-island/material-collection.png',
  });
  for (const id of [
    'taj',
    'colosseum',
    'giza',
    'gyeongbokgung',
    'merlion',
    'sagrada',
    'greatwall',
    'cn',
    'atomium',
    'basil',
    'kilimanjaro',
  ]) {
    await openInventory(page, 'landmarks');
    await page.locator(`[data-info=${id}]`).click();
    const result = await page.evaluate(() => {
      const allIds = [...document.querySelectorAll('.landmark-art [id]')].map(
        (e) => e.id,
      );
      const missing: string[] = [];
      document.querySelectorAll('.landmark-art').forEach((svg) => {
        svg.querySelectorAll('[fill],[stroke]').forEach((node) => {
          for (const attribute of ['fill', 'stroke']) {
            const ref = node
              .getAttribute(attribute)
              ?.match(/^url\(#(.+)\)$/)?.[1];
            if (ref && !svg.querySelector(`[id="${ref}"]`)) missing.push(ref);
          }
        });
      });
      return { unique: new Set(allIds).size === allIds.length, missing };
    });
    expect(result).toEqual({ unique: true, missing: [] });
    await page
      .locator('.landmark-detail')
      .screenshot({ path: `test-results/landmark-island/material-${id}.png` });
    await page.keyboard.press('Escape');
  }
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
    ),
  ).toEqual(save);
  expect(svgErrors).toEqual([]);
  // An isolated contact sheet for reviewing the bundled artwork, not a product screen.
  await page.evaluate((entries) => {
    const cards = entries
      .map(({ id, name, country }) => {
        const svg = document.querySelector(
          `[data-landmark="${id}"] svg`,
        )!.outerHTML;
        return `<article>${svg}<strong>${name}</strong><small>${country}</small></article>`;
      })
      .join('');
    document.body.innerHTML = `<main id="art-review"><h1>DEMO · New destinations</h1><div>${cards}</div></main>`;
  }, landmarks.slice(24));
  await page.addStyleTag({
    content: `
    body { margin: 0; background: #ede9d3; color: #344b3d; }
    #art-review { padding: 24px; font-family: sans-serif; }
    #art-review h1 { font-size: 22px; margin: 0 0 18px; }
    #art-review > div { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    #art-review article { display: flex; flex-direction: column; align-items: center; padding: 12px; background: #f7f3df; border: 1px solid #c6c9a7; border-radius: 12px; }
    #art-review svg { width: 180px; height: 180px; }
    #art-review strong { font-size: 14px; margin-top: 6px; }
    #art-review small { font-size: 12px; color: #627159; }
  `,
  });
  await page.screenshot({
    path: 'test-results/landmark-island/new-destinations-36-demo.png',
    fullPage: true,
  });
});

test('new discoveries grow land, gifts unlock sets, duplicates craft chosen decorations', async ({
  page,
}) => {
  await page.addInitScript(() => {
    let roll = 0;
    Math.random = () => {
      const tierRoll =
        (window as unknown as { fixtureRoll?: number }).fixtureRoll ?? 0;
      return roll++ % 2 === 0 ? tierRoll : tierRoll === 0.71 ? 2 / 9 : 0;
    };
  });
  await page.goto('/');
  await expect(page.locator('.cell')).toHaveCount(36);
  await expect(page.locator('.material-balance')).toHaveText('0 materials');
  await openInventory(page, 'decorations');
  await page.locator('#decor-theme').selectOption('eiffel');
  await expect(page.locator('[data-craft=eiffel-special]')).toBeDisabled();
  await expect(page.locator('[data-decor-place=eiffel-gift]')).toBeDisabled();
  await openInventory(page, 'decorations');
  await page.locator('#decor-theme').selectOption('basics');
  await openInventory(page, 'decorations');
  await page.locator('[data-decor-place=path]').click();
  await page
    .getByRole('button', { name: 'Cell 1: empty', exact: true })
    .click();
  await expect(
    page.locator('[data-world-cell="0"] [data-decoration=path]'),
  ).toHaveCount(1);
  await page
    .getByRole('button', { name: 'Cell 1: Earth path', exact: true })
    .click();
  await page.getByRole('button', { name: 'Return to collection' }).click();
  await demoDiscovery(page);
  await expect(page.locator('.cell')).toHaveCount(59);
  await expect(page.locator('.notice')).toContainText('+23 land tiles');
  await openInventory(page, 'decorations');
  await page.locator('#decor-theme').selectOption('eiffel');
  await expect(page.locator('[data-decor-card=eiffel-gift]')).toContainText(
    'Owned ×1 · 1 available',
  );
  await openInventory(page, 'decorations');
  await page.locator('[data-decor-place=eiffel-gift]').click();
  await page
    .getByRole('button', { name: 'Cell 1: empty', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Cell 1: Paris lantern', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Cell 2: empty', exact: true })
    .click();
  await expect(
    page.locator('[data-world-cell="1"] [data-decoration=eiffel-gift]'),
  ).toHaveCount(1);
  await demoDiscovery(page);
  await expect(page.locator('.cell')).toHaveCount(59);
  await expect(page.locator('.material-balance')).toHaveText('3 materials');
  await expect(page.locator('[data-craft=eiffel-special]')).toBeDisabled();
  await demoDiscovery(page);
  await expect(page.locator('.material-balance')).toHaveText('6 materials');
  await openInventory(page, 'decorations');
  await page.locator('[data-craft=eiffel-special]').click();
  await expect(page.locator('.material-balance')).toHaveText('0 materials');
  await expect(page.locator('[data-landmark=eiffel]')).toContainText(
    'Owned ×3',
  );
  await openInventory(page, 'decorations');
  await page.locator('[data-decor-place=eiffel-special]').click();
  await page
    .getByRole('button', { name: 'Cell 3: empty', exact: true })
    .click();
  await page.reload();
  await expect(
    page.locator('[data-world-cell="1"] [data-decoration=eiffel-gift]'),
  ).toHaveCount(1);
  await expect(
    page.locator('[data-world-cell="2"] [data-decoration=eiffel-special]'),
  ).toHaveCount(1);
  await expect(page.locator('.material-balance')).toHaveText('0 materials');
  await page.getByRole('button', { name: 'Arrange landmarks' }).click();
  await page
    .getByRole('button', { name: 'Cell 3: Café bench', exact: true })
    .click();
  await page.getByRole('button', { name: 'Return to collection' }).click();
  await expect(page.locator('[data-decor-card=eiffel-special]')).toContainText(
    'Owned ×1 · 1 available',
  );
  await expect(page.locator('.material-balance')).toHaveText('0 materials');
  await page.evaluate(() => {
    (window as unknown as { fixtureRoll: number }).fixtureRoll = 0.71;
  });
  await demoDiscovery(page);
  await expect(page.locator('.cell')).toHaveCount(83);
  await expect(page.locator('.notice')).toContainText('+24 land tiles');
  await expect(page.locator('[data-decor-card=chichen-gift]')).toContainText(
    'Owned ×1',
  );
  await page.getByRole('button', { name: 'Show whole island' }).click();
  await page
    .locator('.island-section')
    .screenshot({ path: 'test-results/landmark-island/growing-island.png' });
});

test('garden workshop fits narrow themes and craft response-loss retry spends once', async ({
  page,
}) => {
  await page.goto('/');
  const ids = ['eiffel', 'eiffel', 'eiffel', 'giza', 'fuji'];
  await page.evaluate((ids) => {
    localStorage.setItem(
      'landmark-island-demo-v1',
      JSON.stringify({
        version: 2,
        tickets: ids.map((_, i) => ({
          workspaceId: `garden${i}`,
          at: '2026-11-06',
        })),
        receipts: ids.map((landmark, i) => ({
          workspaceId: `garden${i}`,
          landmark,
          at: '2026-11-06',
        })),
        placements: [],
      }),
    );
  }, ids);
  await page.reload();
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    let lost = false;
    Storage.prototype.setItem = function (key, value) {
      original.call(this, key, value);
      if (
        !lost &&
        key === 'landmark-island-demo-v1' &&
        JSON.parse(value).crafts?.length
      ) {
        lost = true;
        throw Error('Craft response lost');
      }
    };
  });
  await openInventory(page, 'decorations');
  await page.locator('[data-craft=eiffel-special]').click();
  await expect(page.getByRole('alert')).toContainText('Craft response lost');
  await openInventory(page, 'decorations');
  await page.locator('[data-craft=eiffel-special]').click();
  await expect(page.locator('.material-balance')).toHaveText('0 materials');
  await expect(page.locator('[data-decor-card=eiffel-special]')).toContainText(
    'Owned ×1',
  );
  await page.reload();
  await expect(page.locator('[data-decor-card=eiffel-special]')).toContainText(
    'Owned ×1',
  );
  await page.setViewportSize({ width: 360, height: 800 });
  for (const theme of ['light', 'dark']) {
    await page.evaluate(
      (theme) => (document.documentElement.className = theme),
      theme,
    );
    await openInventory(page, 'decorations');
    await page.locator('#decor-theme').selectOption('giza');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(360);
    await page
      .locator('.canvas-inventory')
      .screenshot({ path: `test-results/landmark-island/garden-${theme}.png` });
  }
  await openInventory(page, 'decorations');
  await page.locator('#decor-theme').selectOption('angkor');
  await expect(page.locator('[data-decor-card=angkor-gift]')).toContainText(
    'Discover its landmark',
  );
  await expect(page.locator('[data-craft=angkor-special]')).toBeDisabled();
});

test('explorer respects the locked coast and decoration collisions', async ({
  page,
}) => {
  await page.goto('/');
  const walker = page.locator('.walker');
  await expect(walker).toHaveAttribute('data-cell', '30');
  await page.getByRole('button', { name: 'Walk south', exact: true }).click();
  await expect(page.locator('.walk-hint')).toContainText('No clear path');
  await expect(walker).toHaveAttribute('data-cell', '30');
  await openInventory(page, 'decorations');
  await page.locator('[data-decor-place=oak]').click();
  await page
    .getByRole('button', { name: 'Cell 32: empty', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Explore island', exact: true })
    .click();
  await page.getByRole('button', { name: 'Walk east', exact: true }).click();
  await expect(page.locator('.walk-hint')).toContainText('No clear path');
  await expect(walker).toHaveAttribute('data-cell', '30');
  await page
    .getByRole('button', { name: 'Arrange landmarks', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Cell 32: Garden oak', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Return to collection', exact: true })
    .click();
  await openInventory(page, 'decorations');
  await page.locator('[data-decor-place=path]').click();
  await page
    .getByRole('button', { name: 'Cell 32: empty', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Explore island', exact: true })
    .click();
  await page.getByRole('button', { name: 'Walk east', exact: true }).click();
  await expect(walker).toHaveAttribute('data-cell', '31');
  await expect(page.locator('#ticket-count')).toHaveText('0');
  await expect(page.locator('.material-balance')).toHaveText('0 materials');
});

test('all modals scroll internally without moving the page and release the lock on close', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1000, height: 400 });
  await page.goto('/');
  for (const kind of ['details', 'backup', 'discovery']) {
    if (kind === 'details') {
      await openInventory(page, 'landmarks');
      await openInventory(page, 'landmarks');
      await page.locator('[data-info=eiffel]').click();
    } else if (kind === 'backup') await page.locator('#backups').click();
    else {
      await page.locator('#expedition').click();
      await page.locator('#draw-ticket').click();
      await page.getByRole('button', { name: 'Skip animation' }).click();
    }
    const modal = page.locator('dialog:modal');
    await expect(modal).toHaveCount(1);
    await expect(page.locator('html')).toHaveCSS('overflow-y', 'hidden');
    const scrollY = await page.evaluate(() => window.scrollY);
    await modal.evaluate((e) => {
      e.scrollTop = 0;
    });
    const bounds = (await modal.boundingBox())!;
    await page.mouse.move(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    );
    await page.mouse.wheel(0, 300);
    await expect
      .poll(() => modal.evaluate((e) => e.scrollTop))
      .toBeGreaterThan(0);
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
    // Wheel at either inner edge and on the backdrop must not chain to the page.
    await modal.evaluate((e) => {
      e.scrollTop = e.scrollHeight;
    });
    await page.mouse.wheel(0, 800);
    await page.mouse.move(4, 200);
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(150); // allow asynchronous wheel scrolling to settle
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
    await modal.evaluate((e) => {
      e.scrollTop = 0;
    });
    await page.mouse.move(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    );
    await page.mouse.wheel(0, -800);
    await page.waitForTimeout(150);
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog:modal')).toHaveCount(0);
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
    await page.evaluate(() => window.scrollTo(0, 250));
    await page.mouse.move(4, 200);
    await page.mouse.wheel(0, 300);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(250);
  }
});

async function dragTiles(page: Page, cells: number[], cancel = false) {
  const points = [];
  for (const cell of cells) {
    const b = (await page.locator(`.cell[data-cell="${cell}"]`).boundingBox())!;
    points.push({ x: b.x + b.width / 2, y: b.y + b.height / 2 });
  }
  await page.mouse.move(points[0].x, points[0].y);
  await page.mouse.down();
  for (const p of points.slice(1))
    await page.mouse.move(p.x, p.y, { steps: 8 });
  if (cancel) await page.keyboard.press('Escape');
  await page.mouse.up();
}

test('floors overlap furniture; four directions, movement and undo preserve the collection', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const ids = ['eiffel', 'eiffel', 'eiffel'];
  await page.evaluate(
    (ids) =>
      localStorage.setItem(
        'landmark-island-demo-v1',
        JSON.stringify({
          version: 2,
          tickets: ids.map((_, i) => ({
            workspaceId: `layers-${i}`,
            at: '2026-11-06',
          })),
          receipts: ids.map((landmark, i) => ({
            workspaceId: `layers-${i}`,
            landmark,
            at: '2026-11-06',
          })),
          placements: [],
        }),
      ),
    ids,
  );
  await page.reload();
  await openInventory(page, 'decorations');
  await page.locator('[data-craft=eiffel-special]').click();
  await openInventory(page, 'decorations');
  await page.locator('[data-decor-place=stonepath]').click();
  await page
    .getByRole('button', { name: 'Cell 1: empty', exact: true })
    .click();
  await openInventory(page, 'landmarks');
  await page.locator('[data-landmark=eiffel]').click();
  await page
    .getByRole('button', { name: 'Cell 1: Stone paving', exact: true })
    .click();
  await expect(page.locator('[data-world-cell="0"] .building')).toHaveCount(1);
  await expect(
    page.locator('[data-world-cell="0"] [data-floor=stonepath]'),
  ).toHaveCount(1);
  await openInventory(page, 'decorations');
  await page.locator('[data-decor-place=eiffel-special]').click();
  await page.locator('#rotate-piece').click();
  await page
    .getByRole('button', { name: 'Cell 2: empty', exact: true })
    .click();
  await expect(
    page.locator('[data-world-cell="1"] .garden-object'),
  ).toHaveAttribute('data-rotation', '1');
  await openInventory(page, 'decorations');
  await page.locator('[data-decor-place=path]').click();
  await page
    .getByRole('button', { name: 'Cell 2: Café bench', exact: true })
    .click();
  await expect(
    page.locator('[data-world-cell="1"] [data-floor=path]'),
  ).toHaveCount(1);
  await expect(
    page.locator('[data-world-cell="1"] .garden-object'),
  ).toHaveAttribute('data-rotation', '1');
  await page.locator('[data-edit-layer=objects]').click();
  await page
    .getByRole('button', { name: 'Cell 2: Café bench', exact: true })
    .click();
  const views = new Set<string>();
  for (let rotation = 2; rotation <= 5; rotation++) {
    await page.locator('#rotate-piece').click();
    const art = page.locator('[data-world-cell="1"] .garden-object');
    await expect(art).toHaveAttribute('data-rotation', String(rotation % 4));
    await expect(page.locator('#rotate-piece')).toHaveText(
      `Rotate · ${(rotation % 4) * 90}°`,
    );
    views.add(await art.innerHTML());
  }
  expect(views.size).toBe(4);
  await page
    .getByRole('button', { name: 'Cell 3: empty', exact: true })
    .click();
  await expect(
    page.locator('[data-world-cell="2"] .garden-object'),
  ).toHaveAttribute('data-rotation', '1');
  await expect(
    page.locator('[data-world-cell="1"] [data-floor=path]'),
  ).toHaveCount(1);
  await page.locator('#undo-layout').click();
  await expect(
    page.locator('[data-world-cell="1"] .garden-object'),
  ).toHaveAttribute('data-rotation', '1');
  await page.locator('[data-edit-layer=floor]').click();
  await page
    .getByRole('button', { name: 'Cell 2: Café bench', exact: true })
    .click();
  await page.locator('#remove').click();
  await expect(page.locator('[data-world-cell="1"] [data-floor]')).toHaveCount(
    0,
  );
  await expect(
    page.locator('[data-world-cell="1"] .garden-object'),
  ).toHaveCount(1);
  await page.locator('#undo-layout').click();
  await expect(
    page.locator('[data-world-cell="1"] [data-floor=path]'),
  ).toHaveCount(1);
  await page.reload();
  await expect(
    page.locator('[data-world-cell="1"] .garden-object'),
  ).toHaveAttribute('data-rotation', '1');
  await expect(
    page.locator('[data-world-cell="0"] [data-floor=stonepath]'),
  ).toHaveCount(1);
  await expect(page.locator('[data-landmark=eiffel]')).toContainText(
    'Owned ×3',
  );
  await expect(page.locator('.material-balance')).toHaveText('0 materials');
  await expect(page.locator('#undo-layout')).toBeDisabled();
  await page.getByRole('button', { name: 'Show whole island' }).click();
  await page.locator('.island-section').screenshot({
    path: 'test-results/landmark-island/layered-garden.png',
    animations: 'disabled',
  });
});

test('brush strokes preview, cancel, save as one undo and stop at flower ownership', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() =>
    localStorage.setItem(
      'landmark-island-demo-v1',
      JSON.stringify({
        version: 3,
        landFloor: 0,
        tickets: [
          { workspaceId: 'flower', at: '2026-11-06' },
          { workspaceId: 'flower-copy', at: '2026-11-06' },
        ],
        receipts: [
          { workspaceId: 'flower', landmark: 'stonehenge', at: '2026-11-06' },
          {
            workspaceId: 'flower-copy',
            landmark: 'stonehenge',
            at: '2026-11-06',
          },
        ],
        crafts: [{ id: 'crafted-flower', decoration: 'stonehenge-gift' }],
        placements: [{ cell: 2, landmark: 'stonehenge' }],
        decorations: [],
      }),
    ),
  );
  await page.reload();
  await openInventory(page, 'decorations');
  await page.locator('[data-decor-place=path]').click();
  await page.locator('#brush-toggle').click();
  await page.getByRole('button', { name: 'Show whole island' }).click();
  const cameraBefore = await page.locator('.camera').getAttribute('style');
  await dragTiles(page, [0, 1, 2, 3], true);
  await expect(page.locator('[data-floor]')).toHaveCount(0);
  await expect(page.locator('.brush-preview')).toHaveCount(0);
  await expect(page.locator('#undo-layout')).toBeDisabled();
  await dragTiles(page, [0, 1, 2, 3]);
  await expect(page.locator('[data-floor=path]')).toHaveCount(4);
  await expect(page.locator('#undo-layout')).toHaveText('Undo layout · 1');
  expect(await page.locator('.camera').getAttribute('style')).toBe(
    cameraBefore,
  );
  await expect(page.locator('[data-world-cell="2"] .building')).toHaveCount(1);
  await page.locator('#undo-layout').click();
  await expect(page.locator('[data-floor]')).toHaveCount(0);
  await expect(page.locator('[data-world-cell="2"] .building')).toHaveCount(1);
  await openInventory(page, 'decorations');
  await page.locator('[data-decor-place=stonehenge-gift]').click();
  await page.locator('#brush-toggle').click();
  await dragTiles(page, [0, 1, 2, 3]);
  await expect(
    page.locator('.garden-object[data-decoration=stonehenge-gift]'),
  ).toHaveCount(2);
  await expect(page.locator('[data-decor-card=stonehenge-gift]')).toContainText(
    'Owned ×2 · 0 available',
  );
  await expect(page.locator('#undo-layout')).toHaveText('Undo layout · 1');
  await page.locator('#undo-layout').click();
  await expect(page.locator('.garden-object')).toHaveCount(0);
  await expect(page.locator('[data-decor-card=stonehenge-gift]')).toContainText(
    'Owned ×2 · 2 available',
  );
  await expect(page.locator('.material-balance')).toHaveText('0 materials');
});

test('canvas inventories contain scrolling, preserve camera, and hand selection back to the island', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.goto('/');
  await demoDiscovery(page);
  await page.getByRole('button', { name: 'Show whole island' }).click();
  const drawer = page.locator('.canvas-inventory');
  const ocean = page.locator('.ocean');
  await expect(drawer).toBeHidden();
  await expect(page.locator('.ocean .collection-section')).toHaveCount(1);
  await expect(page.locator('.ocean .workshop')).toHaveCount(1);
  await ocean.scrollIntoViewIfNeeded();
  await page.screenshot({
    path: 'test-results/landmark-island/canvas-closed.png',
  });
  const camera = await page.locator('.camera').getAttribute('style');
  await openInventory(page, 'landmarks');
  await expect(page.locator('#close-inventory')).toBeFocused();
  await ocean.screenshot({
    path: 'test-results/landmark-island/canvas-journal-desktop.png',
  });
  const scroll = page.locator('.inventory-scroll');
  const bounds = (await scroll.boundingBox())!;
  const pageY = await page.evaluate(() => window.scrollY);
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.wheel(0, 500);
  await expect
    .poll(() => scroll.evaluate((e) => e.scrollTop))
    .toBeGreaterThan(0);
  const savedScroll = await scroll.evaluate((e) => e.scrollTop);
  expect(await page.locator('.camera').getAttribute('style')).toBe(camera);
  expect(await page.evaluate(() => window.scrollY)).toBe(pageY);
  await openInventory(page, 'decorations');
  await expect(page.locator('.workshop')).toBeVisible();
  await openInventory(page, 'landmarks');
  expect(await scroll.evaluate((e) => e.scrollTop)).toBe(savedScroll);
  await scroll.evaluate((e) => {
    e.scrollTop = e.scrollHeight;
  });
  const edgeBounds = (await scroll.boundingBox())!;
  await page.mouse.move(
    edgeBounds.x + edgeBounds.width / 2,
    edgeBounds.y + edgeBounds.height / 2,
  );
  const edgePageY = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 600);
  await expect(page.locator('.camera')).toHaveAttribute('style', camera!);
  expect(await page.evaluate(() => window.scrollY)).toBe(edgePageY);
  await scroll.evaluate((e) => {
    e.scrollTop = 0;
  });
  const heading = (await page.locator('.inventory-heading').boundingBox())!;
  await page.mouse.move(heading.x + 30, heading.y + 20);
  await page.mouse.wheel(0, 180);
  await expect
    .poll(() => scroll.evaluate((e) => e.scrollTop))
    .toBeGreaterThan(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(edgePageY);
  const closedScroll = await scroll.evaluate((e) => e.scrollTop);
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await expect(page.locator('[data-inventory=landmarks]')).toBeFocused();
  await openInventory(page, 'landmarks');
  expect(await scroll.evaluate((e) => e.scrollTop)).toBe(closedScroll);
  await page.locator('[data-landmark=eiffel]').click();
  await expect(drawer).toBeHidden();
  await expect(ocean).toBeFocused();
  await page
    .getByRole('button', { name: 'Cell 1: empty', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Cell 1: Eiffel Tower', exact: true }),
  ).toBeVisible();
  await openInventory(page, 'decorations');
  await page.locator('[data-decor-place=stonepath]').click();
  await expect(drawer).toBeHidden();
  await expect(ocean).toBeFocused();
  await page
    .getByRole('button', { name: 'Cell 1: Eiffel Tower', exact: true })
    .click();
  await expect(
    page.locator('[data-world-cell="0"] [data-decoration=stonepath]'),
  ).toHaveCount(1);
  await page.getByRole('button', { name: 'World Map', exact: true }).click();
  await page.locator('#map-journal').click();
  await expect(drawer).toBeVisible();
  await expect(page.locator('[data-inventory=landmarks]')).toHaveAttribute(
    'aria-expanded',
    'true',
  );
});

for (const theme of ['light', 'dark'])
  test(`${theme} canvas inventory stays inside a narrow island`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    await page.evaluate((theme) => {
      document.documentElement.className = theme;
    }, theme);
    for (const kind of ['decorations', 'landmarks'] as const) {
      await openInventory(page, kind);
      const ocean = (await page.locator('.ocean').boundingBox())!;
      for (const selector of ['.island-satchel', '.canvas-inventory']) {
        const box = (await page.locator(selector).boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(ocean.x);
        expect(box.y).toBeGreaterThanOrEqual(ocean.y);
        expect(box.x + box.width).toBeLessThanOrEqual(ocean.x + ocean.width);
        expect(box.y + box.height).toBeLessThanOrEqual(ocean.y + ocean.height);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(360);
      await expect(
        page
          .locator(
            kind === 'landmarks'
              ? '.collection .landmark-art'
              : '.decoration-card > svg',
          )
          .first(),
      ).toBeInViewport();
      await page.locator('.ocean').screenshot({
        path: `test-results/landmark-island/canvas-${kind}-${theme}.png`,
      });
    }
    await page.locator('#close-inventory').click();
    await expect(page.locator('.canvas-inventory')).toBeHidden();
  });

test('treasure opens and reveals inside the canvas, keeps scrolling local and restores island focus', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.goto('/');
  await expect(page.locator('.ticket-desk')).toHaveCount(0);
  await expect(page.locator('.ocean #draw-ticket')).toBeDisabled();
  await page.locator('#expedition').click();
  await expect(page.locator('.ocean #ticket-count')).toHaveText('1');
  await page.locator('#draw-ticket').click();
  const theatre = page.locator('.ocean > .discovery-theatre');
  await expect(theatre).toBeVisible();
  expect(await theatre.evaluate((e) => e.matches(':modal'))).toBe(true);
  const contained = async () => {
    const canvas = (await page.locator('.ocean').boundingBox())!;
    const box = (await theatre.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(Math.max(0, canvas.x) - 1);
    expect(box.y).toBeGreaterThanOrEqual(Math.max(0, canvas.y) - 1);
    expect(box.x + box.width).toBeLessThanOrEqual(canvas.x + canvas.width + 1);
    expect(box.y + box.height).toBeLessThanOrEqual(
      canvas.y + canvas.height + 1,
    );
    expect(box.y + box.height).toBeLessThanOrEqual(
      page.viewportSize()!.height + 1,
    );
  };
  await contained();
  await page.getByRole('button', { name: 'Skip animation' }).click();
  await expect(theatre.getByRole('heading')).toHaveText('Eiffel Tower');
  await page.screenshot({
    path: 'test-results/landmark-island/canvas-treasure-desktop.png',
  });
  await page.setViewportSize({ width: 360, height: 800 });
  await expect(theatre).toHaveCSS('padding-left', '12px');
  await contained();
  await page.screenshot({
    path: 'test-results/landmark-island/canvas-treasure-mobile.png',
  });
  const camera = await page.locator('.camera').getAttribute('style');
  const y = await page.evaluate(() => window.scrollY);
  await theatre.evaluate((e) => {
    e.scrollTop = e.scrollHeight;
  });
  const box = (await theatre.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, 350);
  await expect(page.locator('.camera')).toHaveAttribute('style', camera!);
  expect(await page.evaluate(() => window.scrollY)).toBe(y);
  await page.getByRole('button', { name: 'Keep exploring' }).click();
  await expect(theatre).toHaveCount(0);
  await expect(page.locator('[data-inventory=landmarks]')).toBeFocused();
  await expect(page.locator('#ticket-count')).toHaveText('0');
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
  );
  expect(saved.receipts).toHaveLength(1);
});

for (const reducedMotion of [false, true])
  test(`walking resumes camera follow after free browsing (${reducedMotion ? 'narrow reduced motion' : 'desktop'})`, async ({
    page,
  }) => {
    if (reducedMotion) {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
    }
    await page.goto('/');
    const ocean = page.locator('.ocean');
    const camera = page.locator('.camera');
    const walker = page.locator('.walker');
    const save = await page.evaluate(() =>
      localStorage.getItem('landmark-island-demo-v1'),
    );
    const centered = async (cell: number) => {
      await expect(walker).toHaveAttribute('data-cell', String(cell));
      await expect(ocean).toHaveAttribute('data-follow', 'true');
      await expect(page.locator('#follow-player')).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      // Check the rendered character's feet, not just the target CSS transform.
      await expect
        .poll(() =>
          page.evaluate(() => {
            const ocean = document.querySelector<HTMLElement>('.ocean')!;
            const bounds = ocean.getBoundingClientRect();
            const walker = document
              .querySelector('.walker')!
              .getBoundingClientRect();
            return Math.hypot(
              walker.x +
                walker.width / 2 -
                bounds.x -
                ocean.clientLeft -
                ocean.clientWidth / 2,
              walker.bottom -
                bounds.y -
                ocean.clientTop -
                ocean.clientHeight / 2,
            );
          }),
        )
        .toBeLessThan(1);
    };
    await centered(30);
    await ocean.scrollIntoViewIfNeeded();
    let box = (await ocean.boundingBox())!;
    await page.mouse.move(box.x + 30, box.y + 180);
    await page.mouse.down();
    await page.mouse.move(box.x + 90, box.y + 210, { steps: 8 });
    await page.mouse.up();
    await expect(ocean).toHaveAttribute('data-follow', 'false');
    const pan = await camera.getAttribute('style');
    // A rejected move must not pull the camera away from the user's view.
    await ocean.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(walker).toHaveAttribute('data-cell', '30');
    expect(await camera.getAttribute('style')).toBe(pan);
    await expect(ocean).toHaveAttribute('data-follow', 'false');
    await page.keyboard.press('d');
    await centered(31);
    expect(await camera.getAttribute('style')).not.toBe(pan);

    await page.getByRole('button', { name: 'Show whole island' }).click();
    await expect(ocean).toHaveAttribute('data-follow', 'false');
    const overviewZoom = await page.locator('#zoom-value').textContent();
    // A multi-cell click route resumes following without changing overview zoom.
    await page
      .getByRole('button', { name: 'Cell 35: empty', exact: true })
      .click();
    await centered(34);
    await expect(page.locator('#zoom-value')).toHaveText(overviewZoom!);

    box = (await ocean.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.45);
    await page.mouse.wheel(0, -120);
    await expect(ocean).toHaveAttribute('data-follow', 'false');
    const wheelZoom = await page.locator('#zoom-value').textContent();
    await page.getByRole('button', { name: 'Walk north' }).click();
    await centered(28);
    await expect(page.locator('#zoom-value')).toHaveText(wheelZoom!);
    expect(await camera.evaluate((el) => el.style.transition)).toBe('');
    // Repeated direction keys continue tracking, rather than only recentering once.
    await ocean.focus();
    await page.keyboard.press('ArrowLeft');
    await centered(27);
    await page.keyboard.press('ArrowLeft');
    await centered(26);
    expect(
      await page.evaluate(() =>
        localStorage.getItem('landmark-island-demo-v1'),
      ),
    ).toBe(save);
  });

for (const wave of [
  {
    start: 12,
    wonder: 'greatwall',
    firstName: '경복궁',
    firstFact: '1395년',
    wonderName: '만리장성',
    wonderFact: '명나라',
  },
  {
    start: 24,
    wonder: 'kilimanjaro',
    firstName: 'CN 타워',
    firstFact: '1976년',
    wonderName: '킬리만자로',
    wonderFact: '5,895미터',
  },
])
  test(`expanded catalog wave ${wave.start / 12} draws landmarks, grants sets and preserves an old island`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      const fixture = window as unknown as {
        catalogRolls: number[];
        catalogRollIndex: number;
      };
      fixture.catalogRolls = [0, 0];
      fixture.catalogRollIndex = 0;
      Math.random = () => fixture.catalogRolls[fixture.catalogRollIndex++ % 2];
      localStorage.setItem(
        'landmark-island-demo-v1',
        JSON.stringify({
          version: 1,
          receipts: [
            {
              workspaceId: 'legacy-owner',
              landmark: 'eiffel',
              at: '2026-11-05',
            },
          ],
          placements: [{ landmark: 'eiffel', cell: 0 }],
        }),
      );
    });
    await page.goto('/');
    const entries = landmarks.slice(wave.start, wave.start + 12);
    await expect(page.locator('#discovery-progress')).toHaveAttribute(
      'max',
      '36',
    );
    const tierRolls = { common: 0.35, rare: 0.8, epic: 0.95, legendary: 0.995 };
    for (const entry of entries) {
      const pool = landmarks.filter((l) => l.tier === entry.tier);
      await page.evaluate(
        ([tier, item]) => {
          const fixture = window as unknown as {
            catalogRolls: number[];
            catalogRollIndex: number;
          };
          fixture.catalogRolls = [tier, item];
          fixture.catalogRollIndex = 0;
        },
        [
          tierRolls[entry.tier as keyof typeof tierRolls],
          (pool.findIndex((l) => l.id === entry.id) + 0.5) / pool.length,
        ],
      );
      await page.getByRole('button', { name: 'Demo worktree' }).click();
      await page.locator('#draw-ticket').click();
      await expect(page.locator('.discovery-result h2')).toHaveText(entry.name);
      await expect(page.locator('.discovery-result')).toContainText(
        entry.country,
      );
      await expect(
        page.locator('.discovery-monument [data-material-art]'),
      ).toHaveAttribute('data-material-art', entry.id);
      await expect(page.locator('.reveal-bonus')).toContainText(
        'Theme unlocked',
      );
      await page.getByRole('button', { name: 'Keep exploring' }).click();
      await expect(
        page.locator(`[data-decor-card="${entry.id}-gift"]`),
      ).toContainText('Owned ×1');
    }
    await expect(page.locator('.cell')).toHaveCount(318);
    await expect(page.locator('.land-progress')).toContainText(
      'Your whole island is open.',
    );
    await openInventory(page, 'landmarks');
    await page.locator(`[data-info=${wave.wonder}]`).click();
    await expect(page.locator('.landmark-detail .wonder-effects')).toHaveCSS(
      'opacity',
      '1',
    );
    await expect(page.locator('.landmark-detail .wonder-body')).toHaveCSS(
      'animation-name',
      'none',
    );
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    const movingWonder = page.locator('.landmark-detail .wonder-body');
    const wonderPose = await movingWonder.evaluate(
      (el) => getComputedStyle(el).transform,
    );
    await expect
      .poll(() => movingWonder.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe(wonderPose);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(movingWonder).toHaveCSS('animation-name', 'none');
    await page.keyboard.press('Escape');
    await page.locator(`[data-landmark=${wave.wonder}]`).click();
    await page
      .getByRole('button', { name: 'Cell 2: empty', exact: true })
      .click();
    const saved = JSON.parse(
      (await page.evaluate(() =>
        localStorage.getItem('landmark-island-demo-v1'),
      ))!,
    );
    expect(saved.receipts).toHaveLength(13);
    expect(saved.receipts[0]).toEqual({
      workspaceId: 'legacy-owner',
      landmark: 'eiffel',
      at: '2026-11-05',
    });
    expect(saved.placements).toContainEqual({ landmark: 'eiffel', cell: 0 });
    expect(saved.placements).toContainEqual({ landmark: wave.wonder, cell: 1 });
    await page.getByRole('button', { name: 'World Map', exact: true }).click();
    await expect(page.locator('.world circle')).toHaveCount(13);
    await expect(page.locator('.countries')).toContainText(entries[0].country);
    await expect(page.locator('.countries')).toContainText(
      entries.at(-1)!.country,
    );
    // Change preview language in place; keep the user's save untouched.
    await page.evaluate(() => {
      (window as unknown as { orca: unknown }).orca = { locale: 'ko-KR' };
    });
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko-KR');
    await page.getByRole('button', { name: '내 섬', exact: true }).click();
    await openInventory(page, 'landmarks');
    await page.locator(`[data-info=${entries[0].id}]`).click();
    await expect(page.locator('.landmark-detail h2')).toHaveText(
      wave.firstName,
    );
    await expect(page.locator('#detail-description')).toContainText(
      wave.firstFact,
    );
    await page.keyboard.press('Escape');
    await page.locator(`[data-info=${wave.wonder}]`).click();
    await expect(page.locator('.landmark-detail h2')).toHaveText(
      wave.wonderName,
    );
    await expect(page.locator('#detail-description')).toContainText(
      wave.wonderFact,
    );
    expect(
      JSON.parse(
        (await page.evaluate(() =>
          localStorage.getItem('landmark-island-demo-v1'),
        ))!,
      ),
    ).toEqual(saved);
  });
