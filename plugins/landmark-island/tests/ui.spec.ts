import { test, expect, type Page } from '@playwright/test';
import { landTiles } from '../src/world';
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
    expect(await page.locator('.cell').count()).toBeGreaterThan(300);
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
  await page.locator('[data-landmark=eiffel]').click();
  await page.getByRole('button', { name: 'Show whole island' }).click();
  const destination = landTiles.find(
    (t) => t.id >= 36 && t.kind === 'grass' && t.col > 16 && t.row > 15,
  )!;
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
  const entries = [
    ['eiffel', 'Eiffel Tower', 'France'],
    ['colosseum', 'Colosseum', 'Italy'],
    ['stonehenge', 'Stonehenge', 'United Kingdom'],
    ['liberty', 'Statue of Liberty', 'United States'],
    ['opera', 'Sydney Opera House', 'Australia'],
    ['fuji', 'Mount Fuji', 'Japan'],
    ['taj', 'Taj Mahal', 'India'],
    ['petra', 'Petra', 'Jordan'],
    ['chichen', 'Chichén Itzá', 'Mexico'],
    ['angkor', 'Angkor Wat', 'Cambodia'],
    ['machu', 'Machu Picchu', 'Peru'],
    ['giza', 'Great Pyramid of Giza', 'Egypt'],
  ];
  for (const [id, name, country] of entries) {
    const about = page.locator(`[data-info="${id}"]`);
    await expect(page.locator(`[data-landmark="${id}"]`)).toBeDisabled();
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
    Math.random = () => fixtureWindow.fixtureRoll;
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
    ['common', 6, 0, 70, 1, 'Discovery'],
    ['rare', 3, 0, 23, 2, 'Treasure'],
    ['epic', 2, 0, 6, 3, 'Marvel'],
    ['legendary', 1, 1, 1, 4, 'Wonder'],
  ] as const) {
    const filter = page.locator(`[data-tier-filter="${tier}"]`);
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
  await page.locator('[data-tier-filter="all"]').click();
  await expect(page.locator('.collection .card:visible')).toHaveCount(12);
  await expect(page.locator('[data-tier-filter="all"]')).toContainText('2/12');
  await page.locator('.collection-section').screenshot({
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
  await page.locator('[data-tier-filter="legendary"]').click();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(360);
  await page.locator('.collection-section').screenshot({
    path: 'test-results/landmark-island/rarity-mobile-demo.png',
  });
});

test('owned Wonder moves in the guide and on the island, with a static reduced-motion alternative', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0.999;
  });
  await page.goto('/');
  const cardBody = page.locator('[data-landmark="giza"] .wonder-body');
  expect(
    await cardBody.evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
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
  const cardStart = await cardBody.evaluate(
    (el) => getComputedStyle(el).transform,
  );
  await expect
    .poll(() => cardBody.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(cardStart);
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
      await page.waitForTimeout(3300);
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
