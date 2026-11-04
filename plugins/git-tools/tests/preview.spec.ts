import { test, expect } from '@playwright/test';
test('packaged Monaco renders aligned read-only panes, local worker, navigation and themes', async ({
  page,
}, info) => {
  const errors: string[] = [];
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    if (
      !request.url().startsWith('http://127.0.0.1:4173/') &&
      !request.url().startsWith('data:')
    )
      externalRequests.push(request.url());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByText('DEMO', { exact: true })).toBeVisible();
  await expect(page.getByText('2개 변경', { exact: true })).toBeVisible();
  await expect(page.locator('.monaco-editor[role=code]')).toHaveCount(2);
  await expect
    .poll(() =>
      page.evaluate(() =>
        performance
          .getEntriesByType('resource')
          .some((e) => e.name.includes('/assets/editor.worker-')),
      ),
    )
    .toBe(true);
  await expect(page.locator('.char-insert').first()).toBeVisible();
  await expect(
    page.locator('.diff-hidden-lines .center:visible').first(),
  ).toBeVisible();
  const before = await page.locator('.monaco-container').innerText();
  await page.locator('.monaco-editor[role=code]').last().click();
  await page.keyboard.type('MUST_NOT_EDIT');
  expect(await page.locator('.monaco-container').innerText()).not.toContain(
    'MUST_NOT_EDIT',
  );
  await page.getByRole('button', { name: '↓ 다음' }).click();
  await page.getByLabel('줄 앞뒤 공백 무시').check();
  await page.getByLabel('변경 없는 영역 접기').uncheck();
  await page.getByLabel('변경 없는 영역 접기').check();
  await page.getByLabel('미리보기 테마').selectOption('light');
  await expect(page.locator('html')).toHaveClass(/light/);
  await page.screenshot({ path: info.outputPath('light.png') });
  await page.getByLabel('미리보기 테마').selectOption('dark');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.screenshot({ path: info.outputPath('dark.png') });
  expect(before).toContain('readOnly');
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
});
test('merge parent, search, long names, binary and empty file UX', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Merge branch/ }).click();
  await expect(
    page.getByText('좌우 비교와 변경 탐색을 하나의 흐름으로 연결합니다.', {
      exact: false,
    }),
  ).toBeVisible();
  await page.getByLabel('비교할 merge 부모').selectOption({ index: 1 });
  await page.getByLabel('커밋 검색').fill('no-such-commit');
  await expect(page.getByText('일치하는 커밋이 없습니다.')).toBeVisible();
  await page.getByLabel('커밋 검색').fill('');
  await page.getByRole('button', { name: /^R docs\/design/ }).click();
  await expect(
    page.getByRole('heading', {
      name: 'side-by-side-comparison-and-navigation.md',
    }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: /assets\/preview.png untracked/ })
    .click();
  await expect(
    page.getByRole('heading', { name: '텍스트 비교를 표시할 수 없습니다' }),
  ).toBeVisible();
  await page.getByRole('button', { name: /src\/empty.ts staged/ }).click();
  await expect(page.getByText('빈 파일 · 0 B', { exact: true })).toBeVisible();
  await expect(page.getByText('파일 없음', { exact: true })).toBeVisible();
});
for (const [scenario, expected] of [
  [
    'empty',
    '커밋이 없습니다. 최초 커밋 전에도 작업 트리를 비교할 수 있습니다.',
  ],
  ['unchanged', '이 비교 기준에는 변경 파일이 없습니다.'],
  ['loading', '변경 파일을 읽는 중…'],
  ['error', 'DEMO 오류 상태 · 저장소 조회 실패 fixture'],
]) {
  test(`explicit fixture state: ${scenario}`, async ({ page }) => {
    await page.goto(`/?fixture=${scenario}`);
    await expect(page.getByText(expected, { exact: true })).toBeVisible();
  });
}
test('narrow layout keeps page within viewport and code comparison scrolls internally', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/');
  await expect(page.locator('.monaco-editor[role=code]')).toHaveCount(2);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(360);
  await page.screenshot({
    path: info.outputPath('narrow.png'),
    fullPage: true,
  });
});

test('Orca color tokens update UI and Monaco without remounting editors', async ({
  page,
}, info) => {
  await page.goto('/');
  await expect(page.getByText('2개 변경', { exact: true })).toBeVisible();
  const original = await page
    .locator('.monaco-editor[role=code]')
    .first()
    .elementHandle();
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    const tokens = {
      '--orca-background': 'rgb(20 32 51)',
      '--orca-foreground': '#e9eef8',
      '--orca-card': '#1a2943',
      '--orca-muted': '#22344f',
      '--orca-muted-foreground': '#b2c0d6',
      '--orca-primary': '#caa3ff',
      '--orca-primary-foreground': '#171023',
      '--orca-accent': '#394d72',
      '--orca-accent-foreground': '#f4f0ff',
      '--orca-border': '#506181',
      '--orca-ring': '#e1b7ff',
      '--orca-destructive': '#ff8092',
    };
    for (const [name, value] of Object.entries(tokens))
      document.documentElement.style.setProperty(name, value);
  });
  await expect(page.locator('.app-header')).toHaveCSS(
    'background-color',
    'rgb(26, 41, 67)',
  );
  await expect(page.locator('.brand')).toHaveCSS('color', 'rgb(202, 163, 255)');
  await expect(page.locator('.monaco-editor-background').first()).toHaveCSS(
    'background-color',
    'rgb(20, 32, 51)',
  );
  await page.screenshot({ path: info.outputPath('orca-tokens.png') });
  // Update only the token stylesheet, leaving the theme class and models intact.
  await page.evaluate(() =>
    document.documentElement.style.setProperty('--orca-background', '#172b24'),
  );
  await expect(page.locator('.monaco-editor-background').first()).toHaveCSS(
    'background-color',
    'rgb(23, 43, 36)',
  );
  expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
  await expect(page.getByText('2개 변경', { exact: true })).toBeVisible();
});

test('panel remains a panel when Orca supplies a document API on every surface', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.orca = {
      api: { major: 1, minor: 3 },
      host: { has: () => true },
      plugin: {
        request: async <T>() =>
          ({
            status: 'unavailable',
            choices: [],
            message: '열린 workspace 없음',
          }) as T,
      },
      document: {
        session: async () => {
          throw new Error('Panel must not subscribe to document');
        },
      },
    };
  });
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Git Logs', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('열린 workspace 없음', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('다른 저장소 경로로 연결', { exact: true }),
  ).toHaveCount(0);
  await expect(page.getByLabel('로컬 Git 저장소 절대 경로')).toHaveCount(0);
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('dedicated editor entry subscribes to descriptor and renders a worker comparison', async ({
  page,
}) => {
  const { fixtureRepo, fixtureSet, fixtureDiff } =
    await import('../src/ui/fixture');
  await page.addInitScript(
    ({ repo, set, diff }) => {
      window.orca = {
        api: { major: 1, minor: 3 },
        host: { has: () => true },
        plugin: {
          request: async <T>(name: string) =>
            (name === 'changes' ? set : diff) as T,
        },
        document: {
          session: async () => ({
            value: JSON.stringify({
              version: 1,
              repo: repo.root,
              comparison: { kind: 'working' },
              path: diff.file.path,
            }),
            onReplace: () => () => {},
            dispose() {},
          }),
        },
      };
    },
    {
      repo: fixtureRepo,
      set: fixtureSet,
      diff: fixtureDiff(fixtureSet.files[0].path),
    },
  );
  await page.goto('/editor.html');
  await expect(
    page.getByRole('heading', { name: 'Git Diff', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('2개 변경', { exact: true })).toBeVisible();
  await expect(page.getByLabel('로컬 Git 저장소 절대 경로')).toHaveCount(0);
  await expect(page.locator('.monaco-editor[role=code]')).toHaveCount(2);
});

test('sidebar auto-connects and follows workspace switches without asking for a path', async ({
  page,
}) => {
  const { fixtureRepo } = await import('../src/ui/fixture');
  await page.addInitScript((initial) => {
    let current = initial;
    const listeners = new Set<() => void>();
    window.addEventListener('test-workspace', (event) => {
      current = (event as CustomEvent).detail;
      for (const fn of listeners) fn();
    });
    window.orca = {
      api: { major: 1, minor: 3 },
      host: { has: () => true },
      on: (event, handler) => {
        const listener = () => handler(undefined as never);
        if (event === 'workspace.changed') listeners.add(listener);
        return () => listeners.delete(listener);
      },
      plugin: {
        request: async <T>(name: string) => {
          if (name === 'active')
            return {
              status: 'connected',
              repository: current,
              workspace: {
                id: current.root,
                name: current.root.split('/').pop(),
                path: current.root,
                branch: current.branch,
              },
            } as T;
          if (name === 'changes')
            return {
              comparison: { kind: 'working' },
              files: [],
              left: 'HEAD',
              right: '디스크',
            } as T;
          throw new Error(`Unexpected request: ${name}`);
        },
      },
    };
  }, fixtureRepo);
  await page.goto('/');
  await expect(page.locator('.repo-heading b')).toHaveText('atlas');
  await expect(page.getByLabel('로컬 Git 저장소 절대 경로')).not.toBeVisible();
  await page.evaluate(
    (next) =>
      window.dispatchEvent(new CustomEvent('test-workspace', { detail: next })),
    { ...fixtureRepo, root: '/demo/other', branch: 'feature', commits: [] },
  );
  await expect(page.locator('.repo-heading b')).toHaveText('other');
  await expect(page.locator('.repo-heading')).toContainText('feature');
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('ambiguous active workspace uses a workspace picker instead of guessing a repository', async ({
  page,
}) => {
  const { fixtureRepo } = await import('../src/ui/fixture');
  await page.addInitScript((repo) => {
    window.orca = {
      api: { major: 1, minor: 3 },
      host: { has: () => true },
      plugin: {
        request: async <T>(name: string, input: unknown) => {
          if (name === 'active') {
            const choices = ['one', 'two'].map((id) => ({
              id,
              name: 'Same name',
              path: `/demo/${id}`,
              branch: 'main',
            }));
            return (
              (input as { workspaceId?: string }).workspaceId
                ? {
                    status: 'connected',
                    repository: { ...repo, root: '/demo/two' },
                    workspace: choices[1],
                  }
                : {
                    status: 'choose',
                    choices,
                    message: '이름과 브랜치가 같은 workspace가 여러 개입니다.',
                  }
            ) as T;
          }
          if (name === 'changes')
            return {
              files: [],
              comparison: { kind: 'working' },
              left: 'HEAD',
              right: '디스크',
            } as T;
          throw new Error(name);
        },
      },
    };
  }, fixtureRepo);
  await page.goto('/');
  await expect(page.locator('.repo-heading')).toHaveCount(0);
  await page.getByLabel('연결할 워크트리').selectOption('two');
  await expect(page.locator('.repo-heading b')).toHaveText('two');
});
