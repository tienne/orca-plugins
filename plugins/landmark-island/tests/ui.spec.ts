import { test, expect } from '@playwright/test';
import { landTiles } from '../src/world';
test('demo acquisition, duplicate, placement, move, removal and persistent map', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.goto('/');
  await expect(page.getByText('DEMO · LOCAL FIXTURES')).toBeVisible();
  await page.getByRole('button', { name: 'Demo expedition' }).click();
  await expect(page.getByRole('status')).toContainText(
    'New discovery: Eiffel Tower',
  );
  await page.getByRole('button', { name: 'Demo expedition' }).click();
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
  await page.getByRole('button', { name: 'Demo expedition' }).click();
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
