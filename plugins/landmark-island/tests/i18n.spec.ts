import { test, expect, type Page } from '@playwright/test';
import { empty } from '../src/game';

async function setHostLocale(page: Page, locale: string) {
  await page.evaluate((locale) => {
    (window as unknown as { orca: { locale: string } }).orca.locale = locale;
  }, locale);
  await expect(page.locator('html')).toHaveAttribute(
    'lang',
    /^(ko|en)/.test(locale) ? locale : 'en-US',
  );
}

test('Orca locale wins over browser and preview settings; live changes preserve the open journal, camera, focus and save', async ({
  page,
}) => {
  const save = empty();
  save.tickets.push({ workspaceId: 'language-fixture', at: '2026-11-06' });
  save.receipts.push({
    workspaceId: 'language-fixture',
    landmark: 'eiffel',
    at: '2026-11-06',
  });
  save.placements.push({ landmark: 'eiffel', cell: 0 });
  await page.addInitScript((save) => {
    const fixture = window as unknown as { orca: unknown; calls: string[] };
    fixture.calls = [];
    fixture.orca = {
      locale: 'ko-KR',
      plugin: {
        on() {},
        async request(name: string) {
          fixture.calls.push(name);
          return save;
        },
      },
    };
  }, save);
  await page.goto('/?lang=en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko-KR');
  await expect(
    page.getByRole('button', { name: '내 섬', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: '랜드마크: 에펠탑', exact: true }),
  ).toHaveCount(1);
  await page
    .getByRole('button', { name: '랜드마크 열기', exact: true })
    .click();
  await expect(page.locator('#inventory-title')).toHaveText('랜드마크 도감');
  const camera = await page.locator('.camera').getAttribute('style');
  const scroll = page.locator('.inventory-scroll');
  await scroll.evaluate((e) => {
    e.scrollTop = 60;
  });
  await page.locator('#close-inventory').focus();
  await setHostLocale(page, 'en-US');
  await expect(page.locator('#inventory-title')).toHaveText('Landmark journal');
  await expect(page.locator('#close-inventory')).toBeFocused();
  expect(await page.locator('.camera').getAttribute('style')).toBe(camera);
  expect(await scroll.evaluate((e) => e.scrollTop)).toBe(60);
  await page
    .getByRole('button', { name: 'About Eiffel Tower', exact: true })
    .click();
  const dialog = page.locator('.landmark-detail');
  await expect(dialog.locator('h2')).toHaveText('Eiffel Tower');
  await setHostLocale(page, 'ko-KR');
  await expect(dialog.locator('h2')).toHaveText('에펠탑');
  await expect(dialog.locator('#detail-description')).toContainText(
    '1889년 파리 만국박람회',
  );
  await expect(
    dialog.getByRole('button', { name: '랜드마크 소개 닫기' }),
  ).toBeFocused();
  await setHostLocale(page, 'fr-FR');
  await expect(dialog.locator('h2')).toHaveText('Eiffel Tower');
  await setHostLocale(page, 'ko-KR');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-info=eiffel]')).toBeFocused();
  expect(
    await page.evaluate(() => (window as unknown as { calls: string[] }).calls),
  ).toEqual(['island.read']);
  await page.locator('#close-inventory').click();
  await page.getByRole('button', { name: '세계 지도', exact: true }).click();
  await expect(page.locator('.countries')).toContainText('프랑스');
  await expect(
    page.locator('.world title').filter({ hasText: '미국' }),
  ).toHaveCount(1);
});

test('Korean browser fixture covers discovery, placement, decorations, dynamic weather and backup without changing identifiers', async ({
  page,
}) => {
  await page.addInitScript(() => {
    let roll = 0;
    Math.random = () => (roll++ % 2 === 0 ? 0.8 : 0);
  });
  await page.goto('/?lang=ko-KR');
  await expect(
    page.getByRole('button', { name: '탐험권 사용 · 발견하기' }),
  ).toBeDisabled();
  await page.getByRole('button', { name: '데모 워크트리' }).click();
  await expect(page.getByRole('status')).toContainText('탐험권을 받았어요');
  await page.getByRole('button', { name: '탐험권 사용 · 발견하기' }).click();
  await page.getByRole('button', { name: '연출 건너뛰기' }).click();
  await expect(page.locator('.discovery-result h2')).toHaveText('에펠탑');
  await expect(page.locator('.reveal-bonus')).toContainText('파리 등불 선물');
  await page.getByRole('button', { name: '섬에 배치', exact: true }).click();
  await page
    .getByRole('button', { name: '1번 칸: 빈 칸', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: '1번 칸: 에펠탑', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: '장식 열기', exact: true }).click();
  await page.locator('#decor-theme').selectOption('eiffel');
  await expect(page.locator('[data-decor-card=eiffel-gift]')).toContainText(
    '파리 등불',
  );
  await page.locator('[data-decor-place=eiffel-gift]').click();
  await page
    .getByRole('button', { name: '2번 칸: 빈 칸', exact: true })
    .click();
  await page.locator('#weather').selectOption('2');
  await expect(page.locator('.forecast')).toContainText('비');
  await page.locator('#daylight').click();
  await expect(page.locator('.forecast')).toContainText('노을');
  const before = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  const saved = JSON.parse(before!);
  expect(saved.receipts[0].landmark).toBe('eiffel');
  expect(saved.decorations[0].decoration).toBe('eiffel-gift');
  await page.getByRole('button', { name: '백업', exact: true }).click();
  await expect(page.locator('#backup-title')).toHaveText(
    '소중한 섬을 안전하게',
  );
  await expect(page.locator('.backup-current')).toContainText(
    '랜드마크 1개 (1종)',
  );
  await expect(page.locator('.backup-current')).toContainText('장식 배치 1개');
  const [chooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: '파일 선택…', exact: true }).click(),
  ]);
  await chooser.setFiles({
    name: 'broken.json',
    mimeType: 'application/json',
    buffer: Buffer.from('broken'),
  });
  await expect(page.locator('.backup-status')).toContainText(
    '올바른 JSON 파일이 아니에요.',
  );
  await page.keyboard.press('Escape');
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(before);
  await page.setViewportSize({ width: 360, height: 800 });
  for (const theme of ['light', 'dark']) {
    await page.evaluate((theme) => {
      document.documentElement.className = theme;
    }, theme);
    await page
      .getByRole('button', { name: '랜드마크 열기', exact: true })
      .click();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(360);
    await page.locator('.ocean').screenshot({
      path: `test-results/landmark-island/korean-inventory-${theme}.png`,
    });
    await page.locator('#close-inventory').click();
  }
});

test('language changes keep a running reveal and backup confirmation intact and restore English source text', async ({
  page,
}) => {
  // Minimal public-locale fixture; demo storage remains isolated in this context.
  await page.addInitScript(() => {
    (window as unknown as { orca: unknown }).orca = { locale: 'en-US' };
    let roll = 0;
    Math.random = () => (roll++ % 2 === 0 ? 0.999 : 0);
  });
  await page.goto('/?lang=ko');
  await page.locator('#expedition').click();
  await page.locator('#draw-ticket').click();
  const theatre = page.locator('.discovery-theatre');
  await expect(theatre).toBeVisible();
  const before = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  await setHostLocale(page, 'ko-KR');
  await expect(
    page.getByRole('button', { name: '연출 건너뛰기' }),
  ).toBeVisible();
  await expect(theatre).toHaveAttribute('data-phase', 'omen', {
    timeout: 5000,
  });
  await expect(theatre.locator('.journey-caption')).toContainText('불가사의');
  await setHostLocale(page, 'en-US');
  await page.getByRole('button', { name: 'Skip animation' }).click();
  await expect(theatre.locator('h2')).toHaveText('Petra');
  await setHostLocale(page, 'ko-KR');
  await expect(theatre.locator('h2')).toHaveText('페트라');
  await expect(theatre.locator('.reveal-place')).toBeFocused();
  await page.keyboard.press('Escape');
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(before);
  await page.locator('#backups').click();
  const envelope = {
    format: 'landmark-island-backup',
    version: 1,
    exportedAt: '2026-11-06T01:02:03.000Z',
    state: JSON.parse(before!),
  };
  await page.locator('#backup-file').setInputFiles({
    name: 'fixture.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(envelope)),
  });
  await expect(page.locator('.backup-review')).toBeVisible();
  await page.locator('#backup-confirm').check();
  await expect(page.locator('.backup-incoming')).toContainText('내보낸 시각');
  await setHostLocale(page, 'en-US');
  await expect(page.locator('#backup-confirm')).toBeChecked();
  await expect(page.locator('#backup-restore')).toBeEnabled();
  await expect(page.locator('.backup-incoming')).toContainText('Exported');
  await page.keyboard.press('Escape');
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(before);
});

test('standalone preview follows the browser language without accessing a save', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'language', { value: 'ko-KR' });
  });
  await page.goto('/?preview=reveal');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko-KR');
  await expect(
    page.getByRole('heading', { name: '발견의 무대' }),
  ).toBeVisible();
  await expect(page).toHaveTitle('Orcatopia · 연출 미리보기');
  await page.getByRole('button', { name: '연출 재생' }).click();
  await page.getByRole('button', { name: '연출 건너뛰기' }).click();
  await expect(page.locator('.discovery-result h2')).toHaveText('페트라');
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBeNull();
});

for (const language of ['ja-JP', 'bad_locale'])
  test(`unsupported locale ${language} falls back to English`, async ({
    page,
  }) => {
    await page.goto(`/?lang=${language}`);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
    await expect(
      page.getByRole('button', { name: 'My Island', exact: true }),
    ).toBeVisible();
  });
