import { test, expect, type Page } from '@playwright/test';
import { empty } from '../src/game';
import { observeExpedition } from '../src/expeditions';

async function clock(page: Page) {
  await page.clock.install({ time: new Date('2026-11-12T12:00:00+09:00') });
  await page.clock.pauseAt(new Date('2026-11-12T12:00:30+09:00'));
}
async function host(page: Page) {
  const records = observeExpedition(
    [],
    'live-agent',
    'working',
    1000,
    undefined,
    '<img src=x onerror=alert(1)>',
  );
  await page.addInitScript(
    ({ save, records }) => {
      const callbacks: Record<string, (() => void)[]> = {};
      const fixture = {
        records,
        calls: [] as string[],
        finish: undefined as ((value: unknown) => void) | undefined,
        emit: () =>
          callbacks['island.expeditions.changed']?.forEach((fn) => fn()),
      };
      Object.assign(window, {
        crewFixture: fixture,
        orca: {
          locale: 'en-US',
          plugin: {
            on: (name: string, fn: () => void) =>
              (callbacks[name] ??= []).push(fn),
            request: async (name: string) => {
              fixture.calls.push(name);
              if (name === 'island.read') return save;
              if (name === 'island.expeditions') return fixture.records;
              if (name === 'island.welcome')
                return new Promise((resolve) => (fixture.finish = resolve));
              throw new Error('fixture unavailable');
            },
          },
        },
      });
    },
    { save: empty(), records },
  );
}

test('preview crew requires a welcome click, sails home once and leaves the collection untouched', async ({
  page,
}) => {
  await clock(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/?preview=expedition&lang=ko');
  await expect(page.locator('.expedition-member')).toHaveCount(3);
  const save = await page.evaluate(() =>
    localStorage.getItem('landmark-island-demo-v1'),
  );
  await page.locator('.expedition-camp summary').click();
  await expect(page.locator('.expedition-camp')).toContainText('미리보기 대원');
  await expect(
    page.locator('.expedition-row[data-expedition-state="returning"]'),
  ).toHaveCount(1);
  await expect(page.locator('.expedition-homecoming')).toHaveCount(0);
  await page.getByRole('button', { name: '맞이하기', exact: true }).click();
  await expect(page.locator('.expedition-homecoming')).toHaveCount(1);
  await expect(page.locator('.expedition-camp')).toContainText(
    '캠프에 돌아왔어요',
  );
  await expect(
    page.getByRole('button', { name: '맞이하기', exact: true }),
  ).toHaveCount(0);
  await page.clock.runFor(1600);
  await expect(page.locator('.expedition-homecoming')).toHaveCSS(
    'opacity',
    '1',
  );
  await page.locator('.ocean').screenshot({
    path: test.info().outputPath('expedition-homecoming.jpg'),
    type: 'jpeg',
    quality: 80,
  });
  await page.clock.runFor(8200);
  await expect(page.locator('.expedition-homecoming')).toHaveCount(0);
  expect(
    await page.evaluate(() => localStorage.getItem('landmark-island-demo-v1')),
  ).toBe(save);
  await page.goto('/?lang=ko');
  await expect(page.locator('.expedition-member')).toHaveCount(0);
});

test('real status updates preserve the island, show safe terminal titles and never celebrate automatically', async ({
  page,
}) => {
  await clock(page);
  await host(page);
  await page.goto('/');
  await expect(page.locator('.expedition-member')).toHaveCount(1);
  const actor = await page.locator('.expedition-member').elementHandle();
  const camera = await page.locator('.camera').getAttribute('style');
  await page.locator('.expedition-camp summary').click();
  await expect(page.locator('.expedition-list img')).toHaveCount(0);
  await expect(page.locator('.expedition-row')).toContainText(
    '<img src=x onerror=alert(1)>',
  );
  await page.evaluate(() => {
    const f = (window as any).crewFixture;
    f.records = f.records.map((e: any) => ({
      ...e,
      state: 'done',
      outcome: 'success',
      pending: true,
      updatedAt: 2000,
    }));
    f.emit();
  });
  await expect(
    page.getByRole('button', { name: 'Welcome home', exact: true }),
  ).toHaveCount(1);
  expect(await actor!.evaluate((element) => element.isConnected)).toBe(true);
  expect(await page.locator('.camera').getAttribute('style')).toBe(camera);
  await page.evaluate(() => {
    (window as any).orca.locale = 'ko-KR';
  });
  await page.clock.runFor(600);
  await expect(page.locator('.expedition-camp summary')).toContainText(
    '에이전트 탐험대',
  );
  await expect(
    page.getByRole('button', { name: '맞이하기', exact: true }),
  ).toHaveCount(1);
  await page.evaluate(() => {
    (window as any).orca.locale = 'en-US';
  });
  await page.clock.runFor(600);
  await expect(page.locator('.expedition-camp summary')).toContainText(
    'Expedition crew',
  );
  await expect(
    page.getByRole('button', { name: 'Welcome home', exact: true }),
  ).toHaveCount(1);
  await expect(page.locator('.expedition-homecoming')).toHaveCount(0);
  expect(
    await page.evaluate(
      () =>
        (window as any).crewFixture.calls.filter(
          (name: string) => name === 'island.welcome',
        ).length,
    ),
  ).toBe(0);
});

test('a newer expedition status wins over an old welcome response', async ({
  page,
}) => {
  await clock(page);
  await host(page);
  await page.goto('/');
  await expect(page.locator('.expedition-member')).toHaveCount(1);
  await page.evaluate(() => {
    const f = (window as any).crewFixture;
    f.records = f.records.map((e: any) => ({
      ...e,
      state: 'done',
      outcome: 'success',
      pending: true,
      updatedAt: 2000,
    }));
    f.emit();
  });
  await page.locator('.expedition-camp summary').click();
  await page.getByRole('button', { name: 'Welcome home', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Welcome home', exact: true }),
  ).toBeDisabled();
  await page.evaluate(() => {
    const f = (window as any).crewFixture;
    f.old = f.records.map((e: any) => ({
      ...e,
      pending: false,
      welcomed: true,
    }));
    f.records = f.records.map((e: any) => ({
      ...e,
      run: `${e.id}:3000`,
      startedAt: 3000,
      updatedAt: 3000,
      state: 'working',
      pending: false,
      welcomed: false,
    }));
    f.emit();
  });
  await expect(page.locator('.expedition-member')).toHaveAttribute(
    'data-state',
    'working',
  );
  await page.evaluate(() => {
    const f = (window as any).crewFixture;
    f.finish(f.old);
  });
  await expect(page.locator('.expedition-homecoming')).toHaveCount(1);
  await expect(page.locator('.expedition-member')).toHaveAttribute(
    'data-state',
    'working',
  );
  await expect(page.locator('.expedition-row')).toContainText(
    'On an expedition',
  );
});

test('narrow reduced-motion crew remains usable and does not overlap inventory or arrangement', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?preview=expedition&lang=ko');
  await expect(page.locator('.expedition-member')).toHaveCount(3);
  await expect(
    page
      .locator('.expedition-member[data-state="working"] .resident-leg')
      .first(),
  ).toHaveCSS('animation-name', 'none');
  await page.locator('.expedition-camp summary').click();
  await page.getByRole('button', { name: '맞이하기', exact: true }).click();
  await expect(page.locator('.expedition-homecoming')).toHaveCSS(
    'animation-name',
    'none',
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(360);
  await page.locator('[data-inventory="landmarks"]').click();
  await expect(page.locator('.expedition-camp')).toBeHidden();
  await page.locator('[data-inventory="landmarks"]').click();
  await expect(page.locator('.expedition-camp')).toBeVisible();
  await page.locator('[data-mode="build"]').first().click();
  await expect(page.locator('.expedition-camp')).toBeHidden();
});
