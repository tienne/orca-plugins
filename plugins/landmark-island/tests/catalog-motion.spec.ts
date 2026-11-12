import { test, expect } from '@playwright/test';
import { empty, landmarks, validate } from '../src/game';

test('the 300-landmark journal only animates visible cards across scrolling, filtering and rerenders', async ({
  page,
}) => {
  test.setTimeout(60_000);
  const save = empty();
  for (const landmark of landmarks) {
    const workspaceId = `motion-${landmark.id}`;
    save.tickets.push({ workspaceId, at: '2026-11-12' });
    save.receipts.push({
      workspaceId,
      landmark: landmark.id,
      at: '2026-11-12',
    });
  }
  save.placements.push({ landmark: 'greatwall', cell: 0 });
  await page.addInitScript((state) => {
    if (!localStorage.getItem('landmark-island-demo-v1'))
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(state));
  }, validate(save));
  await page.goto('/?lang=en');
  const stored = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  const cards = page.locator('.collection .card');
  const first = cards.first();
  const last = cards.last();
  const running = (card: typeof first) =>
    card
      .locator('.landmark-art')
      .evaluate(
        (art) =>
          art
            .getAnimations({ subtree: true })
            .filter((animation) => animation.playState === 'running').length,
      );
  await expect(cards).toHaveCount(300);
  await expect.poll(() => running(first)).toBe(0);
  await page.locator('[data-inventory="landmarks"]').click();
  await expect(first).toHaveAttribute('data-motion-visible', 'true');
  await expect.poll(() => running(first)).toBeGreaterThan(0);
  await expect.poll(() => running(last)).toBe(0);
  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveAttribute('data-motion-visible', 'true');
  await expect.poll(() => running(last)).toBeGreaterThan(0);
  await expect.poll(() => running(first)).toBe(0);

  await page.locator('#close-inventory').click();
  await expect.poll(() => running(last)).toBe(0);
  await page.locator('[data-inventory="landmarks"]').click();
  await expect.poll(() => running(last)).toBeGreaterThan(0);
  await page.locator('[data-inventory="decorations"]').click();
  await expect.poll(() => running(last)).toBe(0);
  await page.locator('[data-inventory="landmarks"]').click();
  await page.locator('#inventory-search').fill(landmarks[0].name);
  await first.scrollIntoViewIfNeeded();
  await expect.poll(() => running(first)).toBeGreaterThan(0);
  await expect(last).toBeHidden();
  await expect.poll(() => running(last)).toBe(0);

  const previous = await first.elementHandle();
  await page.locator('#refresh').click();
  await expect
    .poll(() => previous!.evaluate((card) => card.isConnected))
    .toBe(false);
  await expect(first).toHaveAttribute('data-motion-visible', 'true');
  await expect.poll(() => running(first)).toBeGreaterThan(0);
  await page.locator(`[data-info="${landmarks[0].id}"]`).click();
  await expect
    .poll(() =>
      page
        .locator('.detail-art .landmark-art')
        .evaluate(
          (art) =>
            art
              .getAnimations({ subtree: true })
              .filter((animation) => animation.playState === 'running').length,
        ),
    )
    .toBeGreaterThan(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('.world-object.building .wall-porter')).toHaveCSS(
    'animation-play-state',
    'running',
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect
    .poll(() =>
      first
        .locator('.landmark-art')
        .evaluate((art) => art.getAnimations({ subtree: true }).length),
    )
    .toBe(0);
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(stored);
});
