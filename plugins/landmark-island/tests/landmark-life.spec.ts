import { test, expect } from '@playwright/test';
import { empty, validate, landmarks } from '../src/game';
import { landmarkScenes } from '../src/landmark-life';
import { translate } from '../src/i18n';

for (const [id, motion] of [
  ['greatwall', '.wall-porter'],
  ['giza', '.pyramid-haul'],
])
  test(`${id} construction tells its own story only when owned and respects reduced motion`, async ({
    page,
  }) => {
    await page.goto('/?lang=en');
    await page.locator('[data-inventory="landmarks"]').click();
    await page.locator(`[data-info="${id}"]`).click();
    await expect(page.locator('.detail-art .landmark-life')).toHaveCSS(
      'display',
      'none',
    );
    await page.keyboard.press('Escape');

    const save = empty();
    for (const [index, cell] of [31, 33].entries()) {
      const workspaceId = `construction-${index}`;
      save.tickets.push({ workspaceId, at: '2026-11-11' });
      save.receipts.push({ workspaceId, landmark: id, at: '2026-11-11' });
      save.placements.push({ landmark: id, cell, rotation: index });
    }
    await page.evaluate((state) => {
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(state));
    }, validate(save));
    await page.reload();
    await page.locator('#daylight').selectOption('0');
    const original = page.locator('[data-world-cell="31"]');
    const mirrored = page.locator('[data-world-cell="33"]');
    const moving = original.locator(motion);
    await expect(moving).toBeVisible();
    await expect(original.locator('.landmark-aura')).toHaveCount(0);
    const start = await moving.evaluate((el) => getComputedStyle(el).transform);
    await expect
      .poll(() => moving.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe(start);
    await expect(mirrored.locator('.building-select')).toHaveCSS(
      'transform',
      'matrix(-1, 0, 0, 1, 0, 0)',
    );

    const retained = await moving.elementHandle();
    await page.locator('[data-mode="build"]').click();
    expect(await retained!.evaluate((el) => el.isConnected)).toBe(true);
    await original
      .locator('.building-select')
      .click({ position: { x: 10, y: 20 } });
    await page.locator('#inspect-piece').click();
    const detail = page.locator(`.detail-art ${motion}`);
    await expect(detail).toBeVisible();
    const detailStart = await detail.evaluate(
      (el) => getComputedStyle(el).transform,
    );
    await expect
      .poll(() => detail.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe(detailStart);
    await page
      .locator('.detail-art')
      .screenshot({ path: test.info().outputPath(`${id}-construction.png`) });

    const stored = await page.evaluate(() =>
      localStorage.getItem('landmark-island-demo-v1'),
    );
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(detail).toHaveCSS('animation-name', 'none');
    await expect(page.locator('.detail-art .worker-hammer').first()).toHaveCSS(
      'animation-name',
      'none',
    );
    await expect(page.locator('.detail-art .site-dust').first()).toHaveCSS(
      'opacity',
      '0',
    );
    await page.keyboard.press('Escape');
    await expect(moving).toHaveCSS('animation-name', 'none');
    const still = await moving.evaluate((el) => getComputedStyle(el).transform);
    await page.waitForTimeout(200);
    expect(await moving.evaluate((el) => getComputedStyle(el).transform)).toBe(
      still,
    );
    expect(
      await page.evaluate(() =>
        localStorage.getItem('landmark-island-demo-v1'),
      ),
    ).toBe(stored);
  });

test('landmark stories preview shows all one hundred scenes in Korean without touching an existing save', async ({
  page,
}) => {
  const existing = JSON.stringify(validate(empty()));
  await page.addInitScript(
    (value) => localStorage.setItem('landmark-island-demo-v1', value),
    existing,
  );
  await page.goto('/?preview=landmark-life&lang=ko');
  await expect(
    page.getByRole('heading', { name: '작은 랜드마크의 하루' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: '만리장성' })).toBeVisible();
  await expect(page.locator('.landmark-life')).toHaveCount(landmarks.length);
  await expect(page.locator('.wall-hoist-load')).toHaveCSS(
    'animation-name',
    'wall-lift-stone',
  );
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(existing);
  await page.screenshot({
    path: test.info().outputPath('landmark-life-preview.png'),
  });
});

test('eight landmark stories stay still when unowned, animate on the island and freeze with reduced motion', async ({
  page,
}) => {
  const stories = [
    ['eiffel', '.eiffel-beacon'],
    ['fuji', '.fuji-cloud'],
    ['kinderdijk', '.mill-sails'],
    ['opera', '.opera-sailboat'],
    ['merlion', '.merlion-ripple'],
    ['liberty', '.liberty-flame'],
    ['taj', '.taj-peacock-tail'],
    ['colosseum', '.gladiator-left'],
  ];
  await page.goto('/?lang=en');
  for (const [id] of stories)
    await expect(
      page.locator(`[data-landmark="${id}"] .landmark-life`),
    ).toHaveCSS('display', 'none');
  await expect(
    page.locator('[data-landmark="kinderdijk"] .mill-sails').first(),
  ).toHaveCSS('animation-name', 'none');

  const save = empty();
  for (const [index, [id]] of stories.entries()) {
    const workspaceId = `story-${id}`;
    save.tickets.push({ workspaceId, at: '2026-11-11' });
    save.receipts.push({ workspaceId, landmark: id, at: '2026-11-11' });
    save.placements.push({ landmark: id, cell: index });
  }
  await page.evaluate(
    (state) =>
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(state)),
    validate(save),
  );
  await page.reload();
  for (const [id, selector] of stories) {
    const building = page.locator(
      `.world-object.building:has([data-landmark-life="${id}"])`,
    );
    await expect(building.locator('.landmark-life')).toBeVisible();
    await expect(building.locator('.landmark-aura')).toHaveCount(0);
    const motion = building.locator(selector).first();
    const start = await motion.evaluate((el) => getComputedStyle(el).transform);
    await expect
      .poll(() => motion.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe(start);
  }
  const saved = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  await page.goto('/?preview=landmark-life&lang=en');
  for (const [id, selector] of stories) {
    const card = page.locator(
      `.life-preview-card:has([data-landmark-life="${id}"])`,
    );
    await card
      .locator('.detail-art')
      .screenshot({ path: test.info().outputPath(`${id}-story.png`) });
    expect(
      await card
        .locator(selector)
        .first()
        .evaluate((el) => getComputedStyle(el).animationName),
    ).not.toBe('none');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [id, selector] of stories) {
    const card = page.locator(
      `.life-preview-card:has([data-landmark-life="${id}"])`,
    );
    await expect(card.locator(selector).first()).toHaveCSS(
      'animation-name',
      'none',
    );
  }
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(saved);
});

test('Colosseum gladiators alternate attacking and guarding, with brief clashes and a still reduced-motion pose', async ({
  page,
}) => {
  await page.goto('/?preview=landmark-life&lang=ko#scene-colosseum');
  const card = page.locator('.life-preview-card:has(.arena-duel)');
  await expect(card).toBeInViewport();
  const sample = (time: number) =>
    card.locator('.arena-duel').evaluate((el, at) => {
      for (const animation of el.getAnimations({ subtree: true })) {
        animation.pause();
        animation.currentTime = at;
      }
      const angle = (selector: string) => {
        const matrix = new DOMMatrix(
          getComputedStyle(el.querySelector(selector)!).transform,
        );
        return Math.atan2(matrix.b, matrix.a);
      };
      return {
        left: angle('.gladiator-left .gladiator-sword'),
        right: angle('.gladiator-right .gladiator-sword'),
        clash: Number(
          getComputedStyle(el.querySelector('.arena-clash')!).opacity,
        ),
      };
    }, time);
  const left = await sample(960);
  expect(left.left).toBeGreaterThan(0);
  expect(left.right).toBeLessThan(0);
  expect(left.clash).toBe(1);
  const right = await sample(2560);
  expect(right.right).toBeGreaterThan(0);
  expect(right.left).toBeLessThan(0);
  expect(right.clash).toBe(1);
  expect((await sample(1600)).clash).toBe(0);
  await sample(960);
  await card
    .locator('.detail-art')
    .screenshot({ path: test.info().outputPath('colosseum-duel.png') });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(card.locator('.gladiator-left')).toHaveCSS(
    'animation-name',
    'none',
  );
  await expect(card.locator('.gladiator-right .gladiator-sword')).toHaveCSS(
    'animation-name',
    'none',
  );
  await expect(card.locator('.arena-clash')).toHaveCSS('opacity', '0');
  await expect(card.locator('.arena-dust')).toHaveCSS('opacity', '0');
});

test('rarity stages grow from ambient moments to grounded Wonder spectacles while honoring reduced motion', async ({
  page,
}) => {
  await page.goto('/?preview=landmark-life&lang=ko');
  for (const [tier, count] of [
    ['common', 154],
    ['rare', 119],
    ['epic', 25],
    ['legendary', 8],
  ] as const) {
    const section = page.locator(
      `.life-preview-tier[data-animation-tier="${tier}"]`,
    );
    await expect(section.locator('.life-preview-card')).toHaveCount(count);
    await expect(
      section.locator(`.landmark-art[data-animation-tier="${tier}"]`),
    ).toHaveCount(count);
  }
  await page
    .getByRole('navigation', { name: '등급별 애니메이션' })
    .getByRole('link', { name: 'IV 불가사의' })
    .click();
  await expect(
    page.getByRole('heading', { name: 'IV 불가사의' }),
  ).toBeInViewport();
  await expect(page.locator('.eiffel-show')).toBeVisible();
  await expect(page.locator('.opera-performance')).toBeVisible();
  await expect(page.locator('.arena-crowd')).toBeVisible();
  await expect(page.locator('.taj-fountain-show')).toBeVisible();
  for (const [id, motion] of [
    ['petra', '.petra-caravan'],
    ['angkor', '.angkor-lantern'],
    ['machu', '.machu-condor'],
  ]) {
    const card = page.locator(`#scene-${id}`);
    await expect(card.locator('.wonder-body .landmark-life')).toHaveCount(0);
    const animated = card.locator(motion).first();
    const start = await animated.evaluate(
      (el) => getComputedStyle(el).transform,
    );
    await expect
      .poll(() => animated.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe(start);
    await card.locator('.wonder-story').evaluate((el) => {
      for (const animation of el.getAnimations({ subtree: true })) {
        animation.pause();
        animation.currentTime = 6000;
      }
    });
    await card
      .locator('.detail-art')
      .screenshot({ path: test.info().outputPath(`${id}-spectacle.png`) });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const selector of [
    '.petra-caravan',
    '.angkor-lantern',
    '.machu-condor',
    '.arena-spectator',
    '.taj-fountains',
    '.eiffel-light-wave',
  ])
    await expect(page.locator(selector).first()).toHaveCSS(
      'animation-name',
      'none',
    );
  await expect(page.locator('.eiffel-camera-flash')).toHaveCSS('opacity', '0');
});

test('the complete catalog has unique localized living scenes, safe SVG artwork and still reduced-motion poses', async ({
  page,
}) => {
  test.setTimeout(300_000);
  expect(landmarkScenes.map((scene) => scene.id).sort()).toEqual(
    landmarks.map((landmark) => landmark.id).sort(),
  );
  expect(new Set(landmarkScenes.map((scene) => scene.id)).size).toBe(
    landmarks.length,
  );
  for (const scene of landmarkScenes)
    expect(translate(scene.description, 'ko-KR')).not.toBe(scene.description);
  const svgErrors: string[] = [];
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /SVG|<path>|attribute d/i.test(message.text())
    )
      svgErrors.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/?lang=en');
  await expect(page.locator('.card .landmark-life')).toHaveCount(
    landmarks.length,
  );
  for (const scene of await page.locator('.card .landmark-life').all())
    await expect(scene).toHaveCSS('display', 'none');
  await expect(
    page.locator('[data-landmark="bahrainwtc"] .catalog-turbine-rotor').first(),
  ).toHaveCSS('animation-name', 'none');
  await page.goto('/?preview=landmark-life&lang=en');
  await expect(page.locator('.life-preview-card')).toHaveCount(
    landmarks.length,
  );
  await page.addStyleTag({
    content:
      '.life-preview-card .landmark-art, .life-preview-card .landmark-art * { animation-play-state: paused !important; }',
  });
  for (const landmark of landmarks) {
    const card = page.locator(`#scene-${landmark.id}`);
    const art = card.locator('.detail-art');
    expect(
      await art.evaluate((el) => el.getAnimations({ subtree: true }).length),
      landmark.id,
    ).toBeGreaterThan(0);
    await art.evaluate((el) => {
      for (const animation of el.getAnimations({ subtree: true })) {
        animation.pause();
        animation.currentTime = 3600;
      }
    });
    await art.screenshot({
      path: test.info().outputPath(`catalog/${landmark.id}.jpg`),
      quality: 80,
    });
  }
  expect(svgErrors).toEqual([]);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await page
      .locator('.life-preview-card .detail-art')
      .evaluateAll((elements) =>
        elements.reduce(
          (count, el) => count + el.getAnimations({ subtree: true }).length,
          0,
        ),
      ),
  ).toBe(0);
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBeNull();
});

test('the catalog preview searches both languages and countries, hides empty tiers and clears without changing saves', async ({
  page,
}) => {
  const saved = JSON.stringify(validate(empty()));
  await page.addInitScript(
    (value) => localStorage.setItem('landmark-island-demo-v1', value),
    saved,
  );
  await page.goto('/?preview=landmark-life&lang=en');
  const search = page.getByRole('searchbox');
  await search.fill('모스타르');
  await expect(page.locator('.life-preview-card:visible')).toHaveCount(1);
  await expect(page.locator('#scene-mostar')).toBeVisible();
  await expect(page.locator('.life-preview-tier:visible')).toHaveCount(1);
  await expect(page.locator('.life-preview-count')).toHaveText(
    '1 landmark scene',
  );
  await search.fill('Netherlands');
  await expect(page.locator('#scene-kinderdijk')).toBeVisible();
  await search.fill('천문');
  await expect(page.locator('#scene-pragueclock')).toBeVisible();
  await search.fill('not-a-landmark');
  await expect(page.locator('.life-preview-card:visible')).toHaveCount(0);
  await expect(page.locator('.life-preview-empty')).toBeVisible();
  await page.getByRole('button', { name: 'Clear search', exact: true }).click();
  await expect(search).toBeFocused();
  await expect(page.locator('.life-preview-card:visible')).toHaveCount(
    landmarks.length,
  );
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(saved);
  await page.setViewportSize({ width: 360, height: 900 });
  await search.fill('sagrada');
  await expect(page.locator('#scene-sagrada')).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('stone cranes reel their ropes as blocks rise vertically and native wind turbines spin only when owned', async ({
  page,
}) => {
  await page.goto('/?preview=landmark-life&lang=en');
  for (const id of ['sagrada', 'nanmadol']) {
    const result = await page.locator(`#scene-${id}`).evaluate((el) => {
      for (const animation of el.getAnimations({ subtree: true })) {
        animation.pause();
        animation.currentTime = 8000;
      }
      const load = new DOMMatrix(
        getComputedStyle(el.querySelector('[data-motion="lift"]')!).transform,
      );
      const rope = new DOMMatrix(
        getComputedStyle(el.querySelector('[data-motion="reel"]')!).transform,
      );
      return { x: load.e, y: load.f, length: rope.d };
    });
    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(-18);
    expect(result.length).toBeCloseTo(0.25);
    const inside = await page.locator(`#scene-${id}`).evaluate((el) => {
      const frame = el.querySelector('.landmark-art')!.getBoundingClientRect();
      const block = el
        .querySelector('[data-motion="lift"]')!
        .getBoundingClientRect();
      return (
        block.left >= frame.left &&
        block.right <= frame.right &&
        block.top >= frame.top &&
        block.bottom <= frame.bottom
      );
    });
    expect(inside).toBe(true);
  }
  const turbines = page.locator('#scene-bahrainwtc .catalog-turbine-rotor');
  await expect(turbines).toHaveCount(3);
  await expect(turbines.first()).toHaveCSS('animation-name', 'scene-spin');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(turbines.first()).toHaveCSS('animation-name', 'none');
});

test('rarity intensity grows on the island without growing hitboxes, and accent waves follow the action', async ({
  page,
}) => {
  await page.goto('/?lang=en');
  await expect(page.locator('.card .tier-presence')).toHaveCount(
    landmarks.length * 2,
  );
  await expect(page.locator('.card .tier-presence').first()).toHaveCSS(
    'display',
    'none',
  );
  const entries = [
    ['gyeongbokgung', 0, 1.02, 90],
    ['eiffel', 5, 1.05, 90],
    ['colosseum', 30, 1.12, 90],
    ['petra', 35, 1.2, 110],
  ] as const;
  const save = empty();
  for (const [id, cell] of entries) {
    const workspaceId = `intensity-${id}`;
    save.tickets.push({ workspaceId, at: '2026-11-11' });
    save.receipts.push({ workspaceId, landmark: id, at: '2026-11-11' });
    save.placements.push({ landmark: id, cell });
  }
  await page.evaluate(
    (state) =>
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(state)),
    validate(save),
  );
  await page.reload();
  for (const [id, , scale, width] of entries) {
    const art = page.locator(`.building-select > [data-material-art="${id}"]`);
    const measured = await art.evaluate((el) => ({
      ratio:
        el.getBoundingClientRect().width /
        el.parentElement!.getBoundingClientRect().width,
      buttonWidth: parseFloat(getComputedStyle(el.parentElement!).width),
      pointer: getComputedStyle(el).pointerEvents,
    }));
    expect(measured.ratio).toBeCloseTo(scale, 2);
    expect(measured.buttonWidth).toBe(width);
    expect(measured.pointer).toBe('none');
  }
  const stored = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  await page.goto('/?preview=landmark-life&lang=en');
  for (const [id, time] of [
    ['gyeongbokgung', 3600],
    ['eiffel', 3600],
    ['colosseum', 960],
    ['petra', 6000],
    ['angkor', 6000],
    ['machu', 7000],
  ] as const) {
    const card = page.locator(`#scene-${id}`);
    await card.locator('.detail-art').evaluate((el, at) => {
      for (const animation of el.getAnimations({ subtree: true })) {
        animation.pause();
        animation.currentTime = at;
      }
    }, time);
    await card
      .locator('.detail-art')
      .screenshot({ path: test.info().outputPath(`${id}-intensity.png`) });
  }
  for (const [id, at] of [
    ['colosseum', 960],
    ['giza', 5740],
    ['greatwall', 4160],
  ] as const) {
    const wave = page.locator(`#scene-${id} .tier-wave`).first();
    await wave.evaluate((el, time) => {
      for (const animation of el.getAnimations()) {
        animation.pause();
        animation.currentTime = time;
      }
    }, at);
    expect(
      Number(await wave.evaluate((el) => getComputedStyle(el).opacity)),
    ).toBeGreaterThan(0.8);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#scene-colosseum .tier-wave').first()).toHaveCSS(
    'animation-name',
    'none',
  );
  await expect(page.locator('#scene-petra .tier-ember').first()).toHaveCSS(
    'opacity',
    '0',
  );
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(stored);
});
