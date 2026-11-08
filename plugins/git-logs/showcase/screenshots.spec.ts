import { test, expect } from '@playwright/test';
import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const output = resolve('docs/screenshots');
for (const theme of ['light', 'dark']) {
  test(`English mock screenshots: ${theme}`, async ({ page }) => {
    await mkdir(output, { recursive: true });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/?lang=en&sample=en');
    await page.getByLabel('Preview theme').selectOption(theme);
    await expect(page.getByText('DEMO', { exact: true })).toBeVisible();
    await expect(page.getByText('2 changes', { exact: true })).toBeVisible();
    await expect(page.locator('.monaco-editor[role=code]')).toHaveCount(2);
    await expect(page.locator('.char-insert').first()).toBeVisible();
    await expect(page.locator('.commit-author').first()).toHaveText(
      'Alex Morgan',
    );
    await page.getByRole('button', { name: /^Merge branch/ }).click();
    await expect(page.locator('.details')).toContainText(
      'Bring aligned comparison',
    );
    await page
      .getByRole('button', { name: /Add aligned side-by-side comparison/ })
      .click();
    await expect(page.locator('.details')).toContainText(
      'Add whitespace options',
    );
    // Move focus off the rows so screenshots show the resting interface.
    await page.locator('.app-header h1').click();
    await page.screenshot({
      path: resolve(output, `git-logs-${theme}.png`),
      animations: 'disabled',
    });
    if (theme === 'dark') {
      await page
        .getByRole('button', { name: /Add aligned side-by-side comparison/ })
        .click({ button: 'right' });
      await expect(page.getByRole('menu')).toBeVisible();
      await expect(
        page.getByRole('menuitem', { name: 'Cherry-pick…', exact: true }),
      ).toBeVisible();
      await page.screenshot({
        path: resolve(output, 'git-logs-commit-menu.png'),
        animations: 'disabled',
      });
    }
    expect(errors).toEqual([]);
  });
}

// 위 dark 캡처를 같은 파일 안에서 순서대로 이어받아 쓰므로 이 테스트는 맨 끝에 둔다.
test('English hero card', async ({ page }) => {
  const [template, icon, shot] = await Promise.all([
    readFile(resolve('plugins/git-logs/showcase/hero.html'), 'utf8'),
    readFile(resolve('plugins/git-logs/showcase/icon.svg'), 'utf8'),
    readFile(resolve(output, 'git-logs-dark.png')),
  ]);
  await page.setContent(
    template
      .replace('{{ICON}}', icon)
      .replace('{{SHOT}}', `data:image/png;base64,${shot.toString('base64')}`),
  );
  await expect(page.locator('.frame img')).toBeVisible();
  await page.screenshot({
    path: resolve(output, 'git-logs-hero.png'),
    animations: 'disabled',
  });
});
