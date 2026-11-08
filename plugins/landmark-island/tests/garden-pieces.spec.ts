import { test, expect } from '@playwright/test';
import { empty, validate } from '../src/game';

const pieces = [
  ['fuji', 'fuji-pond', '달빛 잉어 연못'],
  ['taj', 'taj-pavilion', '대리석 정원 파빌리온'],
  ['eiffel', 'eiffel-rose-arch', '장미 덩굴 아치'],
  ['angkor', 'angkor-fern-bed', '양치식물 화단'],
];

test('focal garden pieces craft, place, persist and localize', async ({
  page,
}) => {
  // The standalone preview has no favicon; keep its browser request out of art diagnostics.
  await page.route('**/favicon.ico', (route) => route.fulfill({ status: 204 }));
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.setViewportSize({ width: 1280, height: 1100 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=en');
  await page.locator('[data-inventory=decorations]').click();
  for (const [theme, id] of pieces) {
    await page.locator('#decor-theme').selectOption(theme);
    await expect(page.locator(`[data-craft="${id}"]`)).toBeDisabled();
  }
  const save = empty();
  const ids = [
    ...pieces.map(([theme]) => theme),
    ...Array<string>(12).fill('eiffel'),
  ];
  for (const [i, landmark] of ids.entries()) {
    save.tickets.push({ workspaceId: `focal-fixture-${i}`, at: '2026-11-07' });
    save.receipts.push({
      workspaceId: `focal-fixture-${i}`,
      landmark,
      at: '2026-11-07',
    });
  }
  await page.evaluate(
    (save) =>
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(save)),
    validate(save),
  );
  await page.reload();
  for (const [cell, [theme, id]] of pieces.entries()) {
    const menu = page.locator('[data-inventory=decorations]');
    if ((await menu.getAttribute('aria-expanded')) !== 'true')
      await menu.click();
    await page.locator('#decor-theme').selectOption(theme);
    await page.locator(`[data-craft="${id}"]`).click();
    await expect(page.locator(`[data-decor-card="${id}"]`)).toContainText(
      'Owned ×1',
    );
    await page
      .locator('.canvas-inventory')
      .screenshot({ path: `test-results/landmark-island/garden-${id}.png` });
    await page.locator(`[data-decor-place="${id}"]`).click();
    await page
      .getByRole('button', { name: `Cell ${cell + 1}: empty`, exact: true })
      .click();
    await expect(
      page.locator(`.garden-object[data-decoration="${id}"]`),
    ).toHaveCount(1);
  }
  await expect(page.locator('.material-balance')).toHaveText('0 materials');
  await page.reload();
  for (const [, id] of pieces)
    await expect(
      page.locator(`.garden-object[data-decoration="${id}"]`),
    ).toHaveCount(1);
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('landmark-island-demo-v1')!),
  );
  expect(stored.crafts).toHaveLength(4);
  expect(stored.decorations).toHaveLength(4);
  await page.screenshot({
    path: 'test-results/landmark-island/garden-focal-pieces.png',
    fullPage: true,
  });
  await page.goto('/?lang=ko');
  await page.locator('[data-inventory=decorations]').click();
  for (const [theme, id, name] of pieces) {
    await page.locator('#decor-theme').selectOption(theme);
    await expect(page.locator(`[data-decor-card="${id}"]`)).toContainText(name);
    await expect(page.locator(`[data-craft="${id}"]`)).toBeDisabled();
  }
  expect(errors).toEqual([]);
});
