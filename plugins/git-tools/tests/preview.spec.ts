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
  async function verifyGraphAndMetadata() {
    const colors = await page
      .locator('.commit-row')
      .first()
      .evaluate((row) => {
        const color = (selector: string, property = 'color') =>
          getComputedStyle(row.querySelector(selector)!).getPropertyValue(
            property,
          );
        return {
          subject: color('.commit-subject'),
          author: color('.commit-author'),
          date: color('.commit-date'),
          hash: color('.commit-hash'),
          node: color('circle', 'fill'),
          edge: color('path', 'stroke'),
        };
      });
    expect(colors.node).toBe(colors.edge);
    expect(colors.node).not.toBe(colors.subject);
    expect(
      new Set([colors.subject, colors.author, colors.date, colors.hash]).size,
    ).toBe(4);
    await expect(page.locator('.commit-date').first()).toHaveAttribute(
      'datetime',
      /.+/,
    );
    await expect(page.locator('.commit-hash').first()).toHaveCSS(
      'font-family',
      /monospace/,
    );
  }
  await page.getByLabel('미리보기 테마').selectOption('light');
  await expect(page.locator('html')).toHaveClass(/light/);
  // Host primary can equal foreground; graph lanes must remain visibly colored.
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--orca-primary', '#252a35');
    document.documentElement.style.setProperty('--orca-foreground', '#252a35');
  });
  await verifyGraphAndMetadata();
  await page.screenshot({ path: info.outputPath('light.png') });
  await page.getByLabel('미리보기 테마').selectOption('dark');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--orca-primary', '#e0e4ed');
    document.documentElement.style.setProperty('--orca-foreground', '#e0e4ed');
  });
  await verifyGraphAndMetadata();
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
  await page.getByLabel('비교할 부모 커밋').selectOption({ index: 1 });
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
    page.getByRole('heading', { name: '텍스트로 비교할 수 없는 파일입니다' }),
  ).toBeVisible();
  await page.getByRole('button', { name: /src\/empty.ts staged/ }).click();
  await expect(page.getByText('빈 파일 · 0 B', { exact: true })).toBeVisible();
  await expect(page.getByText('파일 없음', { exact: true })).toBeVisible();
});
for (const [scenario, expected] of [
  [
    'empty',
    '아직 커밋이 없습니다. 커밋 전 파일은 작업 트리에서 확인할 수 있습니다.',
  ],
  ['unchanged', '변경된 파일이 없습니다.'],
  ['loading', '변경 파일을 읽는 중…'],
  ['error', '샘플 오류: 저장소를 불러오지 못했습니다.'],
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
      '--orca-card-foreground': '#dde8fb',
      '--orca-popover': '#16233a',
      '--orca-popover-foreground': '#f1d9ff',
      '--orca-secondary': '#304864',
      '--orca-secondary-foreground': '#d9fff5',
      '--orca-radius': '0.875rem',
      '--orca-input': '#7194b7',
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
  await expect(page.locator('.app-header')).toHaveCSS(
    'color',
    'rgb(221, 232, 251)',
  );
  await expect(page.getByLabel('커밋 검색')).toHaveCSS('border-radius', '12px');
  await expect(page.getByLabel('커밋 검색')).toHaveCSS(
    'border-color',
    'rgb(113, 148, 183)',
  );
  await expect(page.locator('.monaco-editor-background').first()).toHaveCSS(
    'background-color',
    'rgb(20, 32, 51)',
  );
  await page.screenshot({ path: info.outputPath('orca-tokens.png') });
  const graphBefore = await page
    .locator('.commit-row circle')
    .first()
    .evaluate((node) => getComputedStyle(node).fill);
  await page.evaluate(() =>
    document.documentElement.style.setProperty('--orca-foreground', '#c6e8dc'),
  );
  await expect
    .poll(() =>
      page
        .locator('.commit-row circle')
        .first()
        .evaluate((node) => getComputedStyle(node).fill),
    )
    .not.toBe(graphBefore);
  await expect(page.locator('.commit-date').first()).toHaveCSS(
    'color',
    'rgb(178, 192, 214)',
  );
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
  await page
    .getByRole('button', { name: /^Merge branch/ })
    .click({ button: 'right' });
  const menu = page.getByRole('menu', { name: '커밋 작업' });
  await expect(menu).toHaveCSS('background-color', 'rgb(22, 35, 58)');
  await expect(menu).toHaveCSS('color', 'rgb(241, 217, 255)');
  await expect(menu).toHaveCSS('border-radius', '12px');
  await expect(
    page.getByRole('menuitem', { name: '체크아웃…', exact: true }),
  ).toHaveCSS('color', 'rgb(241, 217, 255)');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: '새 브랜치…' })).toHaveCSS(
    'color',
    'rgb(244, 240, 255)',
  );
  await page.screenshot({ path: info.outputPath('orca-menu-tokens.png') });
  await page.getByRole('menuitem', { name: '체크아웃…', exact: true }).click();
  await page.mouse.move(0, 0);
  const dialog = page.getByRole('dialog');
  await expect(dialog).toHaveCSS('background-color', 'rgb(22, 35, 58)');
  await expect(dialog).toHaveCSS('color', 'rgb(241, 217, 255)');
  await expect(dialog).toHaveCSS('border-radius', '14px');
  await expect(
    dialog.getByRole('button', { name: '취소', exact: true }),
  ).toHaveCSS('background-color', 'rgb(48, 72, 100)');
  await expect(
    dialog.getByRole('button', { name: '취소', exact: true }),
  ).toHaveCSS('color', 'rgb(217, 255, 245)');
  await expect(
    dialog.getByRole('button', { name: '실행 내용 확인' }),
  ).toHaveCSS('background-color', 'rgb(202, 163, 255)');
  await expect(
    dialog.getByRole('button', { name: '실행 내용 확인' }),
  ).toHaveCSS('color', 'rgb(23, 16, 35)');
  await page.screenshot({ path: info.outputPath('orca-dialog-tokens.png') });
  await page.evaluate(() =>
    document.documentElement.style.setProperty('--orca-radius', '0.25rem'),
  );
  await expect(dialog).toHaveCSS('border-radius', '4px');
  expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
  await dialog.getByRole('button', { name: '취소', exact: true }).click();
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
  await page.getByLabel('연결할 작업 공간').selectOption('two');
  await expect(page.locator('.repo-heading b')).toHaveText('two');
});

test('commit context menu supports keyboard navigation and a safe demo hard reset confirmation', async ({
  page,
}, info) => {
  await page.goto('/');
  const commit = page.getByRole('button', { name: /^Merge branch/ });
  await commit.click({ button: 'right' });
  await expect(page.getByRole('menu', { name: '커밋 작업' })).toBeVisible();
  await expect(page.getByRole('menuitem')).toHaveCount(7);
  // Arrow navigation crosses visual group boundaries without stopping on labels.
  await page.keyboard.press('ArrowDown');
  await expect(
    page.getByRole('menuitem', { name: '새 브랜치…' }),
  ).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(
    page.getByRole('menuitem', { name: '현재 브랜치에 병합…' }),
  ).toBeFocused();
  await page.screenshot({ path: info.outputPath('commit-menu.png') });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await commit.focus();
  await page.keyboard.press('Shift+F10');
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toContainText('DEMO');
  await page.getByLabel('리셋 방식').selectOption('hard');
  await page.getByRole('button', { name: '실행 내용 확인' }).click();
  await expect(page.getByRole('button', { name: 'DEMO 실행' })).toBeDisabled();
  await page.getByLabel('확인용 커밋 해시').fill('wrong');
  await expect(page.getByRole('button', { name: 'DEMO 실행' })).toBeDisabled();
  await page.getByLabel('확인용 커밋 해시').fill('8a4f19c');
  await page.getByRole('button', { name: 'DEMO 실행' }).click();
  await expect(page.locator('.operation-result')).toContainText(
    '샘플 실행을 마쳤습니다. 저장소는 변경하지 않았습니다.',
  );
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('merge parent action requires an explicit mainline and dialogs fit narrow light/dark frames', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/');
  for (const theme of ['light', 'dark']) {
    await page.getByLabel('미리보기 테마').selectOption(theme);
    await page
      .getByRole('button', { name: /^Merge branch/ })
      .click({ button: 'right' });
    await page.getByRole('menuitem', { name: '리버트…', exact: true }).click();
    await expect(
      page.getByRole('button', { name: '실행 내용 확인' }),
    ).toBeDisabled();
    await page.getByLabel('기준 부모 커밋').selectOption('2');
    await expect(
      page.getByRole('button', { name: '실행 내용 확인' }),
    ).toBeEnabled();
    const box = await page.getByRole('dialog').boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(360);
    await page.screenshot({
      path: info.outputPath(`commit-action-${theme}.png`),
    });
    await page.getByRole('button', { name: '취소', exact: true }).click();
  }
});
test('host action executes a prepared token once and displays conflicts after refreshing graph', async ({
  page,
}) => {
  const { fixtureRepo } = await import('../src/ui/fixture');
  await page.addInitScript((repo) => {
    let prepared = 0;
    let executed = 0;
    window.orca = {
      api: { major: 1, minor: 3 },
      host: { has: () => true },
      plugin: {
        request: async <T>(name: string, raw: unknown) => {
          const input = raw as {
            token?: string;
            operation?: { action: string; commit: string };
          };
          if (name === 'active')
            return {
              status: 'connected',
              repository: repo,
              workspace: {
                id: 'fixture',
                name: 'Fixture',
                path: repo.root,
                branch: repo.branch,
              },
            } as T;
          if (name === 'changes')
            return {
              comparison: { kind: 'working' },
              files: [],
              left: 'HEAD',
              right: '디스크',
            } as T;
          if (name === 'log') return repo as T;
          if (name === 'prepare') {
            prepared++;
            return {
              token: 'one-shot',
              action: input.operation!.action,
              root: repo.root,
              head: repo.head,
              currentBranch: repo.branch,
              target: input.operation!.commit,
              command: ['merge', input.operation!.commit],
              summary: '現在ブランチに merge'.replace(
                '現在ブランチに',
                '현재 브랜치로',
              ),
              confirmation: '',
            } as T;
          }
          if (name === 'execute') {
            executed++;
            if (prepared !== 1 || executed !== 1 || input.token !== 'one-shot')
              throw new Error('unexpected execution');
            return {
              status: 'conflict',
              message: '충돌: 터미널에서 해결하거나 git merge --abort 하세요.',
              conflicts: ['src/conflict.ts'],
            } as T;
          }
          throw new Error(`Unexpected request: ${name}`);
        },
      },
    };
  }, fixtureRepo);
  await page.goto('/');
  await page
    .getByRole('button', { name: /^Merge branch/ })
    .click({ button: 'right' });
  await page.getByRole('menuitem', { name: '현재 브랜치에 병합…' }).click();
  await page.getByRole('button', { name: '실행 내용 확인' }).click();
  await expect(page.getByRole('dialog')).toContainText('현재 브랜치로 merge');
  await page.getByRole('button', { name: '실행' }).click();
  await expect(page.locator('.operation-result')).toContainText(
    '충돌을 해결해야 합니다',
  );
  await expect(page.locator('.operation-result')).toContainText(
    'src/conflict.ts',
  );
  await expect(page.locator('.commit-row')).toHaveCount(
    fixtureRepo.commits.length,
  );
});

test('preview language switches all plugin surfaces without replacing Monaco models', async ({
  page,
}, info) => {
  await page.goto('/');
  await expect(page.getByText('2개 변경', { exact: true })).toBeVisible();
  const original = await page
    .locator('.monaco-editor[role=code]')
    .first()
    .elementHandle();
  await page.getByLabel('미리보기 언어').selectOption('en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByLabel('Search commits')).toBeVisible();
  await expect(page.locator('.commit-author').first()).toHaveText('서연');
  await page.getByLabel('Preview theme').selectOption('dark');
  await expect(page.getByText('2 changes', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Fold unchanged regions')).toBeChecked();
  await expect(
    page.getByText('Comparing HEAD with saved files.', { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText('Working tree · saved files', { exact: true }),
  ).toHaveCount(1);
  for (const action of [
    'Checkout…',
    'New branch…',
    'Merge into current branch…',
    'Rebase onto this commit…',
    'Cherry-pick…',
    'Revert…',
    'Reset to this commit…',
  ]) {
    await page
      .getByRole('button', { name: /^Merge branch/ })
      .click({ button: 'right' });
    await page.getByRole('menuitem', { name: action, exact: true }).click();
    await expect(page.getByRole('dialog')).toContainText('Selected commit');
    await expect(page.getByRole('dialog')).toContainText(
      'Requires no uncommitted changes or untracked files.',
    );
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  }
  await page.screenshot({ path: info.outputPath('english.png') });
  expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
  await page.getByLabel('Preview language').selectOption('ko');
  await expect(page.getByText('2개 변경', { exact: true })).toBeVisible();
  expect(await original!.evaluate((node) => node.isConnected)).toBe(true);
  await page.goto('/?lang=en&fixture=error');
  await expect(page.getByRole('alert')).toContainText('DEMO error');
});
test('Orca locale takes precedence over navigator and preview overrides, including worker errors and confirmations', async ({
  page,
}, info) => {
  const { fixtureRepo } = await import('../src/ui/fixture');
  await page.addInitScript((repo) => {
    let locale = 'en-GB';
    let rejected = false;
    window.addEventListener('test-locale', (e) => {
      locale = (e as CustomEvent).detail;
    });
    window.orca = {
      get locale() {
        return locale;
      },
      api: { major: 1, minor: 3 },
      host: { has: () => true },
      plugin: {
        request: async <T>(name: string, raw: unknown) => {
          if (name === 'active')
            return {
              status: 'connected',
              repository: repo,
              workspace: {
                id: 'fixture',
                name: 'Fixture',
                path: repo.root,
                branch: repo.branch,
              },
            } as T;
          if (name === 'changes')
            return {
              comparison: { kind: 'working' },
              files: [],
              left: 'HEAD',
              right: '현재 작업 트리 · 디스크',
            } as T;
          if (name === 'prepare') {
            if (!rejected) {
              rejected = true;
              throw new Error(
                '커밋되지 않은 변경 또는 untracked 파일이 있습니다. 먼저 보관/커밋/정리하세요. 자동 stash나 변경 폐기는 하지 않습니다.',
              );
            }
            const operation = (raw as { operation: { commit: string } })
              .operation;
            return {
              token: 'preview-only',
              action: 'reset',
              root: repo.root,
              head: repo.head,
              currentBranch: repo.branch,
              target: operation.commit,
              command: ['reset', '--hard', operation.commit],
              summary:
                '현재 브랜치의 끝을 선택 커밋으로 옮깁니다. 공유한 브랜치의 이력을 바꿀 수 있습니다. Hard: index와 작업 트리를 선택 커밋 내용으로 바꿉니다. 경로를 막는 untracked 파일이 삭제될 수 있습니다.',
              confirmation: operation.commit.slice(0, 7),
            } as T;
          }
          throw new Error('Unexpected operation');
        },
      },
    };
  }, fixtureRepo);
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/?lang=ko');
  await expect(page.getByLabel('Search commits')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB');
  await expect(page.getByLabel('Preview language')).toHaveCount(0);
  const date = await page.locator('.commit-date').first().innerText();
  expect(date).toMatch(/^04\/11\/2026$/);
  await page
    .getByRole('button', { name: /^Merge branch/ })
    .click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Reset to this commit…' }).click();
  await page.getByLabel('Reset mode').selectOption('hard');
  await page.getByRole('button', { name: 'Review action' }).click();
  await expect(page.getByRole('alert')).toContainText(
    'There are uncommitted changes or untracked files.',
  );
  await page.getByRole('button', { name: 'Review action' }).click();
  await expect(page.getByRole('dialog')).toContainText(
    'Shared branch history may be rewritten',
  );
  await expect(page.getByRole('dialog')).toContainText(
    'untracked files may be deleted',
  );
  await expect(page.getByRole('button', { name: 'Run' })).toBeDisabled();
  await page.screenshot({ path: info.outputPath('english-confirmation.png') });
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.evaluate(() =>
    window.dispatchEvent(new CustomEvent('test-locale', { detail: 'ko-KR' })),
  );
  await expect(page.getByLabel('커밋 검색')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko-KR');
  await page.evaluate(() =>
    window.dispatchEvent(new CustomEvent('test-locale', { detail: 'fr-FR' })),
  );
  await expect(page.getByLabel('Search commits')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US');
});
