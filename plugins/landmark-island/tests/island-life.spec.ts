import { test, expect, type Page } from '@playwright/test';
import { empty, validate, islandLand } from '../src/game';
import { neighbours, solidProps, tiles, project } from '../src/world';
import { route } from '../src/walk';
import { decorations, type Decoration } from '../src/decorations';

async function start(
  page: Page,
  copies = 1,
  garden: [Decoration['shape'], number][] = [],
) {
  await page.clock.install({ time: new Date('2026-11-12T12:00:00+09:00') });
  await page.clock.pauseAt(new Date('2026-11-12T12:00:30+09:00'));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const save = empty();
  for (let i = 0; i < copies; i++) {
    const workspaceId = `living-island-${i}`;
    save.tickets.push({ workspaceId, at: '2026-11-12' });
    save.receipts.push({ workspaceId, landmark: 'eiffel', at: '2026-11-12' });
  }
  for (const [i, [shape, cell]] of garden.entries()) {
    const decoration = decorations.find((item) => item.shape === shape)!;
    for (let j = 0; j < 20; j++) {
      const workspaceId = `living-garden-${i}-${j}`;
      save.tickets.push({ workspaceId, at: '2026-11-12' });
      save.receipts.push({
        workspaceId,
        landmark: decoration.landmark ?? 'eiffel',
        at: '2026-11-12',
      });
    }
    if (!decoration.gift)
      save.crafts.push({ id: `living-craft-${i}`, decoration: decoration.id });
    save.decorations.push({ decoration: decoration.id, cell });
  }
  save.placements.push({ landmark: 'eiffel', cell: 0 });
  await page.addInitScript(
    (state) =>
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(state)),
    validate(save),
  );
  await page.goto('/?lang=en');
  await page.locator('#daylight').selectOption('0');
  await page.locator('#weather').selectOption('0');
  await expect(page.locator('.island-resident')).toHaveCount(3);
  return save;
}

async function residents(page: Page) {
  return page.locator('.island-resident').evaluateAll((elements) =>
    elements.map((element) => ({
      role: (element as HTMLElement).dataset.lifeResident!,
      cell: Number((element as HTMLElement).dataset.lifeCell),
      action: (element as HTMLElement).dataset.action!,
    })),
  );
}

test('wind travels through vegetation while residents follow valid routes, stop to work and leave the save alone', async ({
  page,
}) => {
  const save = await start(page);
  const stored = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  await expect(page.locator('.island-critter[data-kind="bird"]')).toHaveCount(
    2,
  );
  await expect(
    page.locator('.island-critter[data-kind="butterfly"]'),
  ).toHaveCount(3);
  expect(await page.locator('.wind-grass').count()).toBeGreaterThan(0);
  const delays = await page
    .locator('.world-tile')
    .evaluateAll(
      (elements) =>
        new Set(
          elements.map((el) =>
            (el as HTMLElement).style.getPropertyValue('--wind-delay'),
          ),
        ).size,
    );
  expect(delays).toBeGreaterThan(1);
  await expect(page.locator('.wind-grass').first()).toHaveCSS(
    'animation-name',
    'island-wind-grass',
  );
  expect(
    await page
      .locator('.island-wind-thread')
      .first()
      .evaluate((el) => el.parentElement!.getAttribute('transform')),
  ).toContain('translate(');
  const allowed = new Set(islandLand(save).map((tile) => tile.id));
  const blocked = new Set([...solidProps, 0, 14, 30]);
  let before = await residents(page);
  const initial = before.map((resident) => resident.cell);
  const actions = new Set<string>();
  for (let i = 0; i < 36; i++) {
    await page.clock.runFor(900);
    const current = await residents(page);
    expect(new Set(current.map((resident) => resident.cell)).size).toBe(3);
    for (const resident of current) {
      expect(allowed.has(resident.cell)).toBe(true);
      expect(blocked.has(resident.cell)).toBe(false);
      const previous = before.find((other) => other.role === resident.role)!;
      expect(
        resident.cell === previous.cell ||
          neighbours(previous.cell).includes(resident.cell),
      ).toBe(true);
      actions.add(resident.action);
    }
    before = current;
  }
  expect(before.map((resident) => resident.cell)).not.toEqual(initial);
  expect(actions.has('water')).toBe(true);
  expect(actions.has('photo')).toBe(true);
  expect(
    await page
      .locator('.island-resident')
      .first()
      .evaluate((el) => getComputedStyle(el).pointerEvents),
  ).toBe('none');
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(stored);
  await page.locator('.ocean').screenshot({
    path: test.info().outputPath('living-island.jpg'),
    type: 'jpeg',
    quality: 80,
  });
});

test('approaching wildlife makes birds flee and butterflies follow briefly before returning; build and reduced motion stop the simulation', async ({
  page,
}) => {
  const save = await start(page);
  const allowed = new Set(islandLand(save).map((tile) => tile.id));
  const blocked = new Set([
    ...tiles.filter((tile) => !allowed.has(tile.id)).map((tile) => tile.id),
    ...solidProps,
    0,
  ]);
  const approach = async (home: number) => {
    const start = Number(
      await page.locator('.walker').getAttribute('data-cell'),
    );
    const choices = [...allowed]
      .filter(
        (cell) =>
          !blocked.has(cell) &&
          Math.abs(tiles[cell].col - tiles[home].col) +
            Math.abs(tiles[cell].row - tiles[home].row) <=
            1 &&
          cell !== start,
      )
      .map((cell) => ({ cell, path: route(start, cell, blocked) }))
      .filter((entry) => entry.path.length)
      .sort((a, b) => a.path.length - b.path.length);
    expect(choices.length).toBeGreaterThan(0);
    await page.locator(`[data-cell="${choices[0].cell}"].cell`).click();
    await page.clock.runFor(choices[0].path.length * 180 + 50);
  };
  const bird = page.locator('.island-critter[data-kind="bird"]').first();
  const originalBird = Number(await bird.getAttribute('data-home'));
  await approach(originalBird);
  await expect(bird).toHaveAttribute('data-behavior', 'flee');
  expect(Number(await bird.getAttribute('data-home'))).not.toBe(originalBird);
  await expect(bird.locator('.bird-wing')).toHaveCSS(
    'animation-name',
    'island-bird-flap',
  );
  const butterfly = page
    .locator('.island-critter[data-kind="butterfly"]')
    .first();
  if ((await butterfly.getAttribute('data-behavior')) !== 'follow')
    await approach(Number(await butterfly.getAttribute('data-home')));
  await expect(butterfly).toHaveAttribute('data-behavior', 'follow');
  const home = await butterfly.getAttribute('data-home');
  await page.clock.runFor(7200);
  await expect(butterfly).toHaveAttribute('data-behavior', 'idle');
  await expect(butterfly).toHaveAttribute('data-life-cell', home!);
  const hiddenState = await residents(page);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('.ocean')).toHaveAttribute(
    'data-life-paused',
    'true',
  );
  await page.clock.runFor(9000);
  expect(await residents(page)).toEqual(hiddenState);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('.ocean')).toHaveAttribute(
    'data-life-paused',
    'false',
  );
  const starts = await page
    .locator('.wind-grass')
    .evaluateAll((elements) =>
      elements.flatMap((el) =>
        el.getAnimations().map((animation) => animation.startTime),
      ),
    );
  expect(new Set(starts).size).toBe(1);
  const retained = await page
    .locator('.island-resident')
    .first()
    .elementHandle();
  await page.locator('[data-mode="build"]').click();
  await expect(page.locator('.ocean')).toHaveAttribute(
    'data-life-paused',
    'true',
  );
  const stopped = await residents(page);
  await page.clock.runFor(15000);
  expect(await residents(page)).toEqual(stopped);
  expect(await retained!.evaluate((el) => el.isConnected)).toBe(true);
  await page.locator('[data-mode="walk"][aria-pressed]').click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.ocean')).toHaveAttribute(
    'data-life-paused',
    'true',
  );
  await expect(page.locator('.wind-grass').first()).toHaveCSS(
    'animation-name',
    'none',
  );
  await expect(butterfly.locator('.butterfly-wings')).toHaveCSS(
    'animation-name',
    'none',
  );
  const still = await residents(page);
  await page.clock.runFor(9000);
  expect(await residents(page)).toEqual(still);
});

test('placement relocates residents without replacing the live layer or restarting the wind, and view changes do not duplicate actors', async ({
  page,
}) => {
  await start(page, 2);
  await page.clock.runFor(1800);
  const resident = page.locator('[data-life-resident="gardener"]');
  const element = await resident.elementHandle();
  const grass = await page.locator('.wind-grass').first().elementHandle();
  const windStart = await grass!.evaluate(
    (el) => el.getAnimations()[0].startTime,
  );
  await page.locator('[data-inventory="landmarks"]').click();
  await page.locator('[data-landmark="eiffel"]').click();
  const cell = Number(await resident.getAttribute('data-life-cell'));
  await page.locator(`[data-cell="${cell}"].cell`).click();
  await expect(
    page.locator(`[data-world-cell="${cell}"] .building`),
  ).toHaveCount(1);
  expect(Number(await resident.getAttribute('data-life-cell'))).not.toBe(cell);
  expect(await element!.evaluate((el) => el.isConnected)).toBe(true);
  expect(await grass!.evaluate((el) => el.isConnected)).toBe(true);
  expect(await grass!.evaluate((el) => el.getAnimations()[0].startTime)).toBe(
    windStart,
  );
  const stored = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  await page.getByRole('button', { name: 'Refresh', exact: true }).click();
  await expect(page.locator('.island-resident')).toHaveCount(3);
  await expect(page.locator('.island-critter')).toHaveCount(5);
  await page.getByRole('button', { name: 'World Map', exact: true }).click();
  await expect(page.locator('.island-resident')).toHaveCount(0);
  await page.getByRole('button', { name: 'My Island', exact: true }).click();
  await expect(page.locator('.island-resident')).toHaveCount(3);
  await expect(page.locator('.island-critter')).toHaveCount(5);
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(stored);
});

test('wind ripples sit on decoration water and coastal water instead of on the ground', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const save = empty();
  const water = ['pond', 'fountain'].map((shape) =>
    decorations.find((item) => item.shape === shape)!,
  );
  for (let i = 0; i < 40; i++) {
    const landmark = water[i % 2].landmark ?? 'eiffel';
    save.tickets.push({ workspaceId: `water-${i}`, at: '2026-11-12' });
    save.receipts.push({
      workspaceId: `water-${i}`,
      landmark,
      at: '2026-11-12',
    });
  }
  for (const [i, decoration] of water.entries()) {
    if (!decoration.gift)
      save.crafts.push({ id: `water-craft-${i}`, decoration: decoration.id });
    save.decorations.push({ decoration: decoration.id, cell: i + 1 });
  }
  await page.addInitScript(
    (state) =>
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(state)),
    validate(save),
  );
  await page.goto('/?lang=en');
  await expect(page.locator('.island-water-detail')).toHaveCount(2);
  for (const [i, shape] of ['pond', 'fountain'].entries()) {
    const detail = page.locator(
      `[data-world-cell="${i + 1}"] .island-water-detail`,
    );
    await expect(detail).toHaveAttribute(
      'transform',
      `translate(40 ${shape === 'pond' ? 65 : 75})`,
    );
    expect(
      await detail.evaluate((el) => el.parentElement!.tagName.toLowerCase()),
    ).toBe('svg');
  }
  const coast = await page
    .locator('.island-water-ripple')
    .evaluateAll((elements) =>
      elements.map((el) => Number((el as HTMLElement).dataset.rippleCell)),
    );
  expect(coast).toHaveLength(2);
  const visibleLand = new Set(islandLand(save).map((tile) => tile.id));
  for (const cell of coast) expect(visibleLand.has(cell)).toBe(false);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.island-water-detail ellipse').first()).toHaveCSS(
    'animation-name',
    'none',
  );
});

const livingGarden: [Decoration['shape'], number][] = [
  ['bench', 7],
  ['fountain', 4],
  ['flowers', 35],
  ['lamp', 6],
  ['pavilion', 8],
];

test('placed furnishings become destinations and planted flowers attract a butterfly without changing inventory', async ({
  page,
}) => {
  const save = await start(page, 1, livingGarden);
  const stored = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  const blocked = new Set([
    ...solidProps,
    ...save.decorations.map((p) => p.cell),
    0,
    14,
  ]);
  let seated = false;
  let fountainPhoto = false;
  for (let i = 0; i < 90 && (!seated || !fountainPhoto); i++) {
    await page.clock.runFor(900);
    const visitor = page.locator('[data-life-resident="visitor"]');
    if ((await visitor.getAttribute('data-action')) === 'sit') {
      if (!seated)
        await page.locator('.ocean').screenshot({
          path: test.info().outputPath('garden-seating.jpg'),
          type: 'jpeg',
          quality: 80,
        });
      seated = true;
      await expect(visitor).toHaveAttribute('data-subject', '7');
      const cell = Number(await visitor.getAttribute('data-life-cell'));
      expect(neighbours(7)).toContain(cell);
      expect(blocked.has(cell)).toBe(false);
      await expect(visitor.locator('.resident-seated-legs')).toBeVisible();
    }
    const photographer = page.locator('[data-life-resident="photographer"]');
    if (
      (await photographer.getAttribute('data-action')) === 'photo' &&
      (await photographer.getAttribute('data-subject')) === '4'
    ) {
      fountainPhoto = true;
      expect(neighbours(4)).toContain(
        Number(await photographer.getAttribute('data-life-cell')),
      );
    }
  }
  expect(seated).toBe(true);
  expect(fountainPhoto).toBe(true);
  expect(
    await page
      .locator('.island-critter[data-kind="butterfly"][data-home="35"]')
      .count(),
  ).toBe(1);
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(stored);
});

test('weather interrupts outdoor work, residents seek shelter with umbrellas and change to winter poses in snow', async ({
  page,
}) => {
  await start(page, 1, livingGarden);
  const stored = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  await page.clock.runFor(6300);
  await page.locator('#weather').selectOption('2');
  await expect(page.locator('.resident-umbrella').first()).toBeVisible();
  const sheltered = new Set<string>();
  for (let i = 0; i < 65; i++) {
    await page.clock.runFor(900);
    for (const resident of await residents(page)) {
      expect(['water', 'photo', 'sit']).not.toContain(resident.action);
      if (resident.action === 'shelter') sheltered.add(resident.role);
    }
  }
  expect(sheltered.size).toBe(3);
  await expect(
    page.locator('.island-critter[data-kind="butterfly"]').first(),
  ).toHaveCSS('opacity', '0');
  await page.locator('#weather').selectOption('3');
  await expect(page.locator('.resident-umbrella').first()).toBeHidden();
  await expect(page.locator('.resident-cold').first()).toBeVisible();
  await page.locator('#weather').selectOption('0');
  await expect(page.locator('.resident-cold').first()).toBeHidden();
  const resumed = new Set<string>();
  for (let i = 0; i < 55; i++) {
    await page.clock.runFor(900);
    (await residents(page)).forEach((resident) => resumed.add(resident.action));
  }
  expect(resumed.has('water')).toBe(true);
  expect(resumed.has('photo')).toBe(true);
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(stored);
});

test('night lights follow placed lamps and pavilions; fireflies respect climate, pause and reduced motion', async ({
  page,
}) => {
  await start(page, 1, livingGarden);
  await expect(page.locator('.island-night-light')).toHaveCount(2);
  await expect(page.locator('.island-night-light').first()).toHaveCSS(
    'opacity',
    '0',
  );
  await expect(page.locator('.resident-lantern').first()).toBeHidden();
  const firefly = page.locator('.island-firefly').first();
  expect(await page.locator('.island-firefly').count()).toBeLessThanOrEqual(6);
  await expect(firefly).toHaveCSS('opacity', '0');
  await page.locator('#daylight').selectOption('2');
  await page.clock.runFor(1800);
  await expect(page.locator('.island-night-light').first()).toHaveCSS(
    'opacity',
    '1',
  );
  await expect(page.locator('.resident-lantern').first()).toBeVisible();
  await expect(firefly).toHaveCSS('animation-name', 'island-firefly-drift');
  await expect(firefly).toHaveCSS('opacity', '1');
  await page.locator('.ocean').screenshot({
    path: test.info().outputPath('garden-night.jpg'),
    type: 'jpeg',
    quality: 80,
  });
  await page.locator('#weather').selectOption('2');
  await expect(firefly).toHaveCSS('opacity', '0');
  await page.locator('#weather').selectOption('0');
  await page.locator('[data-mode="build"]').first().click();
  await expect(firefly).toHaveCSS('animation-play-state', 'paused');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(firefly).toHaveCSS('animation-name', 'none');
  await expect(firefly.locator('i')).toHaveCSS('animation-name', 'none');
  await page.locator('#daylight').selectOption('0');
  await expect(page.locator('.resident-lantern').first()).toBeHidden();
  await expect(page.locator('.island-night-light').first()).toHaveCSS(
    'opacity',
    '0',
  );
});

test('residents stay above both ground tiles throughout a backwards step and settle to their resting depth', async ({
  page,
}) => {
  await start(page);
  let before = await residents(page);
  let crossing: { role: string; from: number; to: number } | undefined;
  for (let i = 0; i < 75 && !crossing; i++) {
    await page.clock.runFor(900);
    const after = await residents(page);
    for (const resident of after) {
      const previous = before.find((other) => other.role === resident.role)!;
      if (
        resident.cell !== previous.cell &&
        project(resident.cell).depth < project(previous.cell).depth
      ) {
        crossing = {
          role: resident.role,
          from: previous.cell,
          to: resident.cell,
        };
        break;
      }
    }
    before = after;
  }
  expect(crossing).toBeDefined();
  const resident = page.locator(`[data-life-resident="${crossing!.role}"]`);
  await resident.evaluate((el) => getComputedStyle(el).transform);
  await page.clock.runFor(400);
  const depth = await resident.evaluate((el) =>
    Number(getComputedStyle(el).zIndex),
  );
  expect(depth).toBeGreaterThan(
    Math.max(project(crossing!.from).depth, project(crossing!.to).depth),
  );
  await page
    .locator('.ocean')
    .screenshot({
      path: test.info().outputPath('resident-mid-step.jpg'),
      type: 'jpeg',
      quality: 80,
    });
  await page.locator('[data-mode="build"]').first().click();
  const cell = Number(await resident.getAttribute('data-life-cell'));
  await expect(resident).toHaveCSS('z-index', String(project(cell).depth + 1));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(resident).toHaveCSS('transition-duration', '0s');
});
