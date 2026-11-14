import { test, expect } from '@playwright/test';
import { empty, validate } from '../src/game';

const entries = ['liberty', 'stonehenge', 'sagrada', 'petra', 'pngparliament'];

for (const language of ['en', 'ko'])
  test(`placed landmark labels stay above nearby terrain and buildings (${language})`, async ({
    page,
  }) => {
    const save = empty();
    for (const [i, landmark] of entries.entries()) {
      const workspaceId = `presence-${i}`;
      save.tickets.push({ workspaceId, at: '2026-11-11' });
      save.receipts.push({ workspaceId, landmark, at: '2026-11-11' });
      save.placements.push({ landmark, cell: i });
    }
    await page.addInitScript((state) => {
      localStorage.setItem('landmark-island-demo-v1', JSON.stringify(state));
    }, validate(save));
    await page.goto(`/?lang=${language}`);
    await page.locator('[data-mode="build"]').click();
    await page.locator('#daylight').selectOption('0');
    await page.locator('.ocean').scrollIntoViewIfNeeded();
    const tile = page.locator('[data-world-cell="0"]');
    await tile
      .locator('.building-select')
      .hover({ position: { x: 10, y: 20 } });
    const label = tile.locator('.building-label');
    await expect(label).toHaveCSS('opacity', '1');
    await page.locator('.ocean').screenshot({
      path: test.info().outputPath(`landmark-presence-${language}.png`),
    });
    await expect(label.locator('strong')).toHaveText(
      language === 'en' ? 'Statue of Liberty' : '자유의 여신상',
    );
    expect(
      await label.evaluate((el) => {
        const box = el.getBoundingClientRect();
        (el as HTMLElement).style.pointerEvents = 'auto';
        const front = document.elementFromPoint(
          box.x + box.width / 2,
          box.y + box.height / 2,
        );
        (el as HTMLElement).style.pointerEvents = '';
        return front === el || el.contains(front);
      }),
    ).toBe(true);
    for (const label of await page.locator('.building-label').all())
      expect(
        await label.evaluate(
          (el) =>
            el.scrollWidth <= el.clientWidth &&
            el.scrollHeight <= el.clientHeight,
        ),
      ).toBe(true);

    const buildings = page.locator('.world-object.building');
    for (const building of await buildings.all()) {
      await expect(building.locator('.landmark-life')).toHaveCount(1);
      await expect(building.locator('.landmark-aura')).toHaveCount(0);
    }
    const before = await buildings
      .nth(1)
      .locator('.landmark-life')
      .elementHandle();
    await page.locator('[data-mode="walk"][aria-pressed]').click();
    expect(await before?.evaluate((el) => el.isConnected)).toBe(true);
    await expect(page.locator('.building-label')).toHaveCount(5);
    await page.locator('[data-mode="build"]').click();
  });
