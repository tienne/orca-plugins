import { test, expect, type Page } from '@playwright/test';
test('packaged Monaco renders aligned read-only panes, local worker, navigation and themes', async ({
  page,
}, info) => {
  const errors: string[] = [];
  const externalRequests: string[] = [];
  const fontRequests: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'font') fontRequests.push(request.url());
    if (
      !request.url().startsWith(new URL('/', info.project.use.baseURL).href) &&
      !request.url().startsWith('data:')
    )
      externalRequests.push(request.url());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByText('DEMO', { exact: true })).toBeVisible();
  await expect(page.getByText('2개 변경', { exact: true })).toBeVisible();
  await expect(page.locator('.details')).toHaveText(
    '커밋을 선택하면 상세 정보를 볼 수 있습니다.',
  );
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
    const icons = await page.locator('.codicon').evaluateAll((nodes) =>
      nodes
        .filter((node) => node.getBoundingClientRect().width > 0)
        .map((node) => {
          const icon = getComputedStyle(node, '::before');
          return {
            name: node.className,
            mask: icon.maskImage,
            color: icon.color,
            background: icon.backgroundColor,
          };
        }),
    );
    expect(icons.some((icon) => icon.name.includes('codicon-unfold'))).toBe(
      true,
    );
    for (const icon of icons) {
      expect(icon.mask, icon.name).toContain('data:image/svg+xml');
      expect(icon.background, icon.name).toBe(icon.color);
    }
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
  expect(fontRequests).toEqual([]);
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
  await expect(page.getByRole('menuitem')).toHaveCount(10);
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
    page.getByText('Select a commit to view its details.', { exact: true }),
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

test('branch search filters local and remote history, supports keyboard selection and keeps commit search separate', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/');
  await page.getByRole('button', { name: '브랜치 범위' }).click();
  await page.getByLabel('브랜치 검색').fill('ORIGIN/FEATURE');
  const remote = page.getByRole('option', {
    name: 'origin/feature/readable-diff 원격',
  });
  await expect(remote).toBeVisible();
  await expect(
    page.getByRole('option', {
      name: 'feature/readable-diff 로컬',
      exact: true,
    }),
  ).toHaveCount(0);
  await page.screenshot({ path: info.outputPath('branch-search-narrow.png') });
  await page.getByLabel('브랜치 검색').press('Enter');
  await expect(page.getByRole('button', { name: '브랜치 범위' })).toHaveText(
    'origin/feature/readable-diff⌄',
  );
  await expect(page.locator('.commit-row')).toHaveCount(4);
  await expect(page.getByRole('button', { name: /^Merge branch/ })).toHaveCount(
    0,
  );
  await expect(page.locator('.repo-heading')).toContainText('main');
  await page.getByRole('button', { name: '새로고침' }).click();
  await expect(page.locator('.commit-row')).toHaveCount(4);
  await page.getByRole('button', { name: '브랜치 범위' }).click();
  await page.getByLabel('브랜치 검색').fill('no-such-branch');
  await expect(page.getByText('일치하는 브랜치가 없습니다.')).toBeVisible();
  await page.getByLabel('브랜치 검색').press('Escape');
  await expect(page.getByLabel('브랜치 검색')).toHaveCount(0);
  await expect(page.locator('.commit-row')).toHaveCount(4);
  await page.getByRole('button', { name: '브랜치 범위' }).click();
  await page.getByRole('option', { name: '전체 브랜치', exact: true }).click();
  await expect(page.locator('.commit-row')).toHaveCount(6);
  // 검색창은 메시지 전용이라 작성자 이름은 작성자 필터로 찾는다(설계 D6).
  await page.getByLabel('커밋 검색').fill('David');
  await expect(page.getByText('일치하는 커밋이 없습니다.')).toBeVisible();
  await page.getByLabel('커밋 검색').fill('');
  await page.getByRole('button', { name: '필터', exact: true }).click();
  await page.getByLabel('작성자', { exact: true }).fill('David');
  await expect(page.locator('.commit-row')).toHaveCount(3);
});
test('selected branch refreshes through worker RPC, disappears cleanly and resets on workspace change', async ({
  page,
}) => {
  const { fixtureRepo, fixtureLog } = await import('../src/ui/fixture');
  await page.addInitScript(
    ({ repo, selected }) => {
      let removed = false;
      let other = false;
      const listeners = new Set<() => void>();
      window.addEventListener('test-remove-branch', () => {
        removed = true;
      });
      window.addEventListener('test-switch-workspace', () => {
        other = true;
        for (const fn of listeners) fn();
      });
      window.orca = {
        locale: 'en-US',
        api: { major: 1, minor: 3 },
        host: { has: () => true },
        on: (_event, fn) => {
          const callback = () => fn(undefined as never);
          listeners.add(callback);
          return () => listeners.delete(callback);
        },
        plugin: {
          request: async <T>(name: string, raw: unknown) => {
            if (name === 'active')
              return {
                status: 'connected',
                repository: {
                  ...repo,
                  root: other ? '/demo/other' : repo.root,
                  branches: removed || other ? [] : repo.branches,
                },
                workspace: {
                  id: other ? 'other' : 'fixture',
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
            if (name === 'log') {
              const input = raw as { branchRef?: string; all?: boolean };
              if (
                input.branchRef ===
                  'refs/remotes/origin/feature/readable-diff' &&
                !removed &&
                !other
              )
                return selected as T;
              if (!input.branchRef) return repo as T;
              throw new Error('Unexpected branch ref');
            }
            throw new Error(`Unexpected request: ${name}`);
          },
        },
      };
    },
    {
      repo: fixtureRepo,
      selected: fixtureLog('refs/remotes/origin/feature/readable-diff'),
    },
  );
  await page.goto('/');
  await page.getByRole('button', { name: 'Branch scope' }).click();
  await page.getByLabel('Search branches').fill('origin/feature');
  await page.getByLabel('Search branches').press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.locator('.commit-row')).toHaveCount(4);
  await page.getByRole('button', { name: '↻ Refresh' }).click();
  await expect(page.locator('.commit-row')).toHaveCount(4);
  await page.evaluate(() =>
    window.dispatchEvent(new Event('test-remove-branch')),
  );
  await page.getByRole('button', { name: '↻ Refresh' }).click();
  await expect(
    page.getByRole('button', { name: 'Branch scope' }),
  ).toContainText('Current branch');
  await expect(
    page.getByText(
      'The selected branch no longer exists. Showing the current branch.',
    ),
  ).toBeVisible();
  await expect(page.locator('.commit-row')).toHaveCount(6);
  await page.evaluate(() =>
    window.dispatchEvent(new Event('test-switch-workspace')),
  );
  await expect(page.locator('.repo-heading b')).toHaveText('other');
  await expect(
    page.getByRole('button', { name: 'Branch scope' }),
  ).toContainText('Current branch');
});

test('sidebar bottom panes keep their height and files open a central diff on double-click or Enter', async ({
  page,
}, info) => {
  const { fixtureRepo, fixtureSet, fixtureDiff } =
    await import('../src/ui/fixture');
  const files = Array.from({ length: 80 }, (_, index) => ({
    path: `src/long-folder-name/file-${index}.ts`,
    status: 'M',
  }));
  const repo = fixtureRepo;
  const longMessage = `${repo.commits[0].subject}\n${'Long commit details\n'.repeat(60)}`;
  await page.addInitScript(
    ({ repo, files, set, diff, longMessage }) => {
      const opens: unknown[] = [];
      Object.defineProperty(window, 'testOpenRequests', { get: () => opens });
      window.orca = {
        locale: 'ko-KR',
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
            if (name === 'changes') {
              const input = raw as { comparison: { kind: string } };
              return {
                ...set,
                comparison: input.comparison,
                files:
                  input.comparison.kind === 'commit'
                    ? files.slice(0, 2)
                    : files,
              } as T;
            }
            if (name === 'diff') return diff as T;
            if (name === 'commitMessage') return { message: longMessage } as T;
            if (name === 'open') {
              opens.push(raw);
              return { opened: true } as T;
            }
            throw new Error(`Unexpected request: ${name}`);
          },
        },
      };
    },
    {
      repo,
      files,
      set: fixtureSet,
      diff: fixtureDiff(fixtureSet.files[0].path),
      longMessage,
    },
  );
  await page.setViewportSize({ width: 380, height: 900 });
  await page.goto('/');
  await expect(page.locator('.file-row')).toHaveCount(80);
  const heights = async () =>
    page.evaluate(() => ({
      details: document.querySelector('.details')!.getBoundingClientRect()
        .height,
      files: document.querySelector('.files')!.getBoundingClientRect().height,
    }));
  const before = await heights();
  expect(before).toEqual({ details: 144, files: 240 });
  expect(
    await page
      .locator('.file-list')
      .evaluate((node) => node.scrollHeight > node.clientHeight),
  ).toBe(true);
  await expect(page.locator('.open-editor')).toHaveCount(0);
  await page.locator('.file-row').nth(1).click();
  expect(
    await page.evaluate(() => Reflect.get(window, 'testOpenRequests')),
  ).toHaveLength(0);
  await page.locator('.file-row').nth(1).dblclick();
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, 'testOpenRequests')))
    .toHaveLength(1);
  let opens = await page.evaluate(() =>
    Reflect.get(window, 'testOpenRequests'),
  );
  expect(opens[0]).toMatchObject({
    workspaceId: 'fixture',
    descriptor: {
      repo: repo.root,
      path: files[1].path,
      comparison: { kind: 'working' },
    },
  });
  await page.locator('.file-row').nth(2).press('Enter');
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, 'testOpenRequests')))
    .toHaveLength(2);
  opens = await page.evaluate(() => Reflect.get(window, 'testOpenRequests'));
  expect(opens[1].descriptor.path).toBe(files[2].path);
  await page.getByRole('button', { name: /^Merge branch/ }).click();
  await expect(page.locator('.file-row')).toHaveCount(2);
  expect(await heights()).toEqual(before);
  expect(
    await page
      .locator('.details')
      .evaluate((node) => node.scrollHeight > node.clientHeight),
  ).toBe(true);
  await page.getByLabel('파일 검색').fill('does-not-exist');
  await expect(page.getByText('검색 결과가 없습니다.')).toBeVisible();
  expect(await heights()).toEqual(before);
  await page.screenshot({ path: info.outputPath('fixed-bottom-panes.png') });
});

test('bottom splitters resize, persist, cancel, clamp and reset without storage permission', async ({
  page,
}, info) => {
  const { fixtureRepo, fixtureSet, fixtureDiff } =
    await import('../src/ui/fixture');
  await page.addInitScript(
    ({ repo, set, diff }) => {
      window.orca = {
        locale: 'ko-KR',
        api: { major: 1, minor: 3 },
        host: { has: () => true },
        plugin: {
          request: async <T>(name: string) => {
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
            if (name === 'changes') return set as T;
            if (name === 'diff') return diff as T;
            throw new Error(name);
          },
        },
      };
    },
    {
      repo: fixtureRepo,
      set: fixtureSet,
      diff: fixtureDiff(fixtureSet.files[0].path),
    },
  );
  await page.setViewportSize({ width: 380, height: 1000 });
  await page.goto('/');
  const details = page.getByRole('separator', { name: '커밋 정보 높이 조절' });
  const files = page.getByRole('separator', { name: '변경 파일 높이 조절' });
  const heights = () =>
    page.evaluate(() => ({
      details: document.querySelector('.details')!.getBoundingClientRect()
        .height,
      files: document.querySelector('.files')!.getBoundingClientRect().height,
    }));
  await expect(details).toHaveAttribute('aria-valuenow', '144');
  async function drag(handle: typeof details, delta: number, cancel = false) {
    const box = (await handle.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      box.x + box.width / 2,
      box.y + box.height / 2 + delta,
      { steps: 6 },
    );
    if (cancel) await page.keyboard.press('Escape');
    await page.mouse.up();
  }
  await drag(details, -80);
  expect(await heights()).toEqual({ details: 224, files: 240 });
  await page.reload();
  await expect(details).toHaveAttribute('aria-valuenow', '224');
  await drag(files, -50);
  expect(await heights()).toEqual({ details: 174, files: 290 });
  await files.press('ArrowDown');
  expect(await heights()).toEqual({ details: 184, files: 280 });
  await drag(details, 30, true);
  expect(await heights()).toEqual({ details: 184, files: 280 });
  await page.reload();
  await expect(details).toHaveAttribute('aria-valuenow', '184');
  await page.setViewportSize({ width: 380, height: 600 });
  await expect
    .poll(async () => (await heights()).details + (await heights()).files)
    .toBeLessThan(464);
  await expect(page.locator('.commit-list')).toBeVisible();
  await page.setViewportSize({ width: 380, height: 1000 });
  await details.dblclick();
  await expect(details).toHaveAttribute('aria-valuenow', '144');
  expect(await heights()).toEqual({ details: 144, files: 240 });
  await files.press('Home');
  expect((await heights()).files).toBe(120);
  await details.dblclick();
  await page.screenshot({
    path: info.outputPath('resizable-bottom-panes.png'),
  });
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Unavailable', 'SecurityError');
      },
    });
  });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.reload();
  await expect(details).toHaveAttribute('aria-valuenow', '144');
  await details.press('Shift+ArrowUp');
  expect((await heights()).details).toBe(184);
  expect(errors).toEqual([]);
});

test('local ignore setup warnings are translated without hiding the connected graph', async ({
  page,
}, info) => {
  const { fixtureRepo, fixtureSet, fixtureDiff } =
    await import('../src/ui/fixture');
  await page.addInitScript(
    ({ repo, set, diff }) => {
      const warning =
        'Git Logs의 로컬 제외 규칙을 설정하지 못했습니다. 저장소 권한과 ignore 규칙을 확인하세요.';
      window.orca = {
        locale: 'en-US',
        api: { major: 1, minor: 3 },
        host: { has: () => true },
        plugin: {
          request: async <T>(name: string) => {
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
              return { ...set, setupWarning: warning } as T;
            if (name === 'diff') return diff as T;
            if (name === 'open') {
              document.documentElement.dataset.diffOpened = 'true';
              return { opened: true, setupWarning: warning } as T;
            }
            throw new Error(name);
          },
        },
      };
    },
    {
      repo: fixtureRepo,
      set: fixtureSet,
      diff: fixtureDiff(fixtureSet.files[0].path),
    },
  );
  await page.setViewportSize({ width: 420, height: 900 });
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(
    fixtureRepo.commits.length,
  );
  await expect(page.locator('.file-row')).toHaveCount(fixtureSet.files.length);
  await expect(page.getByRole('alert')).toContainText(
    'Could not hide Git Logs files from Git.',
  );
  await page.locator('.file-row').first().dblclick();
  await expect(page.locator('html')).toHaveAttribute(
    'data-diff-opened',
    'true',
  );
  await expect(page.getByRole('alert')).toContainText(
    'Check repository permissions and ignore rules.',
  );
  await expect(page.locator('.commit-row')).toHaveCount(
    fixtureRepo.commits.length,
  );
  await page.screenshot({ path: info.outputPath('local-ignore-warning.png') });
});
test('commit tags render as badges without changing row height or branch options', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto('/');
  await page.getByRole('button', { name: '브랜치 범위' }).click();
  await page.getByRole('option', { name: '전체 브랜치', exact: true }).click();
  await expect(page.locator('.commit-row')).toHaveCount(6);
  const single = page.locator('.commit-row', {
    hasText: 'Improve empty states',
  });
  await expect(single.locator('.tag-badge')).toHaveText(['v1.0.0']);
  const double = page.locator('.commit-row', {
    hasText: 'Extract repository connection controls',
  });
  await expect(double.locator('.tag-badge')).toHaveText([
    'v0.9.0',
    'v0.9.0-rc.1',
  ]);
  await expect(double.locator('.tag-badge').first()).toBeVisible();
  const heights = await page
    .locator('.commit-row')
    .evaluateAll((rows) =>
      rows.map((row) => row.getBoundingClientRect().height),
    );
  expect(heights.length).toBeGreaterThan(0);
  expect(new Set(heights)).toEqual(new Set([64]));
  const fits = await double.evaluate((row) => {
    const box = row.querySelector('.tag-badges')!.getBoundingClientRect();
    return Array.from(
      row.querySelectorAll('.tag-badge:not([data-folded])'),
    ).every((badge) => badge.getBoundingClientRect().right <= box.right + 0.5);
  });
  expect(fits).toBe(true);
  for (const theme of ['light', 'dark']) {
    await page.getByLabel('미리보기 테마').selectOption(theme);
    const badgeColor = await double
      .locator('.tag-badge')
      .first()
      .evaluate((el) => getComputedStyle(el).color);
    const branchColor = await page
      .locator('.commit-row', { hasText: 'Merge branch' })
      .locator('.refs em')
      .first()
      .evaluate((el) => getComputedStyle(el).color);
    expect(badgeColor).not.toBe(branchColor);
  }
  await page.getByRole('button', { name: '브랜치 범위' }).click();
  await expect(
    page.getByRole('option', { name: /v1\.0\.0|v0\.9\.0/ }),
  ).toHaveCount(0);
  await page.getByLabel('브랜치 검색').press('Escape');
  await page.screenshot({ path: info.outputPath('commit-tags.png') });
});
test('commit details show the subject first and fill in the body on selection', async ({
  page,
}) => {
  await page.goto('/?sample=en');
  await page.locator('.commit-row', { hasText: 'Merge branch' }).click();
  await expect(page.locator('.details pre')).toHaveText(
    /^Merge branch feature\/readable-diff\n\nBring aligned comparison/,
  );
  await page
    .locator('.commit-row', { hasText: 'Handle binary and renamed files' })
    .click();
  await expect(page.locator('.details pre')).toHaveText(
    'Handle binary and renamed files',
  );
  await expect(page.locator('.commit-body-error')).toHaveCount(0);
});
test('commit message failure keeps the subject and shows an error note with its cause inside the alert', async ({
  page,
}) => {
  await page.goto('/?fixture=messageError');
  await page.locator('.commit-row', { hasText: 'Merge branch' }).click();
  await expect(page.locator('.commit-body-error p')).toHaveText(
    '커밋 본문을 불러오지 못했습니다.',
  );
  await expect(
    page.locator('.commit-body-error[role="alert"] .commit-body-error-reason'),
  ).toHaveText('DEMO 커밋 본문 조회 실패 fixture');
  await expect(page.locator('.details pre')).toHaveText(
    'Merge branch feature/readable-diff',
  );
});
test('a late commit message response for a previous selection is discarded', async ({
  page,
}) => {
  const { fixtureRepo, fixtureSet, fixtureDiff } =
    await import('../src/ui/fixture');
  await page.addInitScript(
    ({ repo, set, diff }) => {
      const pending: Record<string, (value: unknown) => void> = {};
      Object.defineProperty(window, 'testPending', {
        get: () => Object.keys(pending).length,
      });
      Object.defineProperty(window, 'testResolve', {
        value: (hash: string, message: string) => pending[hash]({ message }),
      });
      window.orca = {
        locale: 'ko-KR',
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
                ...set,
                comparison: (raw as { comparison: unknown }).comparison,
              } as T;
            if (name === 'diff') return diff as T;
            if (name === 'commitMessage')
              return new Promise<T>((resolve) => {
                pending[(raw as { commit: string }).commit] = resolve as never;
              });
            throw new Error(`Unexpected request: ${name}`);
          },
        },
      };
    },
    {
      repo: fixtureRepo,
      set: fixtureSet,
      diff: fixtureDiff(fixtureSet.files[0].path),
    },
  );
  await page.goto('/');
  const [first, second] = fixtureRepo.commits;
  await page.locator('.commit-row').nth(0).click();
  await expect(page.locator('.details pre')).toHaveText(first.subject);
  await page.locator('.commit-row').nth(1).click();
  await expect(page.locator('.details pre')).toHaveText(second.subject);
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, 'testPending')))
    .toBe(2);
  await page.evaluate(
    ([hash]) => Reflect.get(window, 'testResolve')(hash, 'LATE BODY'),
    [first.hash],
  );
  await page.waitForTimeout(100);
  await expect(page.locator('.details pre')).toHaveText(second.subject);
  await page.evaluate(
    ([hash]) => Reflect.get(window, 'testResolve')(hash, 'SECOND BODY'),
    [second.hash],
  );
  await expect(page.locator('.details pre')).toHaveText('SECOND BODY');
});

test('log filters chip, clear and hide the graph in the browser fixture', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  await expect(page.locator('.commit-row svg')).toHaveCount(6);
  await expect(page.getByLabel('작성자', { exact: true })).toBeHidden();
  await page.getByRole('button', { name: '필터', exact: true }).click();
  await page.getByLabel('작성자', { exact: true }).fill('david');
  await page.getByLabel('커밋 검색').fill('implement');
  await expect(page.locator('.commit-row')).toHaveCount(1);
  await expect(page.locator('.commit-row svg')).toHaveCount(0);
  await expect(page.getByText('검색 결과 · 그래프 숨김')).toBeVisible();
  const chips = page.locator('.filter-chip');
  await expect(chips).toHaveText(['메시지: implement×', '작성자: david×']);
  await page.getByRole('button', { name: '메시지 필터 해제' }).click();
  await expect(page.getByLabel('커밋 검색')).toHaveValue('');
  await expect(chips).toHaveText(['작성자: david×']);
  await expect(page.locator('.commit-row')).toHaveCount(3);
  await page.getByLabel('시작일 (committer date)').fill('2026-11-03');
  await page.getByLabel('종료일 (committer date)').fill('2026-11-03');
  await expect(page.locator('.commit-row')).toHaveCount(1);
  await expect(page.locator('.filter-note')).toContainText('committer date');
  await page.getByRole('button', { name: '모두 해제' }).click();
  await expect(chips).toHaveCount(0);
  await expect(page.getByLabel('작성자', { exact: true })).toHaveValue('');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  await expect(page.locator('.commit-row svg')).toHaveCount(6);
  await expect(page.locator('.commit-row').first()).toHaveCSS('height', '64px');
  await page.getByLabel('경로').fill('src/connection.ts');
  await expect(page.locator('.commit-row')).toHaveCount(1);
  await expect(page.locator('.commit-row')).toContainText(
    'Extract repository connection controls',
  );
});

test('log filters reach the worker once after debounce, AND with the branch and drop late responses', async ({
  page,
}) => {
  const { fixtureRepo } = await import('../src/ui/fixture');
  await page.addInitScript((repo) => {
    const calls: unknown[] = [];
    const slow: Array<() => void> = [];
    Reflect.set(window, 'testLogCalls', calls);
    Reflect.set(window, 'testReleaseSlow', () =>
      slow.splice(0).forEach((fn) => fn()),
    );
    window.orca = {
      locale: 'ko-KR',
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
          if (name === 'log') {
            const input = raw as {
              filter?: { author?: string; text?: string };
            };
            calls.push(input);
            const author = input.filter?.author ?? '';
            const result = {
              ...repo,
              commits: repo.commits.filter((c) =>
                c.author.toLowerCase().includes(author.toLowerCase()),
              ),
            };
            // 'slow'로 시작하는 작성자는 다음 입력보다 늦게 도착하게 한다.
            if (author.startsWith('slow'))
              return new Promise<T>((resolve) =>
                slow.push(() =>
                  resolve({
                    ...repo,
                    commits: repo.commits.slice(0, 1),
                  } as T),
                ),
              );
            return result as T;
          }
          throw new Error(`Unexpected request: ${name}`);
        },
      },
    };
  }, fixtureRepo);
  const calls = () =>
    page.evaluate(() => Reflect.get(window, 'testLogCalls') as unknown[]);
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  await page.getByRole('button', { name: '브랜치 범위' }).click();
  await page
    .getByRole('option', { name: 'feature/readable-diff 로컬', exact: true })
    .click();
  await expect.poll(async () => (await calls()).length).toBe(1);
  await page.getByRole('button', { name: '필터', exact: true }).click();
  await page
    .getByLabel('작성자', { exact: true })
    .pressSequentially('David', { delay: 60 });
  await page.waitForTimeout(600);
  const afterTyping = await calls();
  expect(afterTyping).toHaveLength(2);
  expect(afterTyping[1]).toEqual({
    repo: fixtureRepo.root,
    all: false,
    branchRef: 'refs/heads/feature/readable-diff',
    filter: { author: 'David' },
    cancelKey: 'filter',
  });
  await expect(page.locator('.commit-row')).toHaveCount(3);
  await expect(page.locator('.commit-row svg')).toHaveCount(0);

  await page.getByLabel('작성자', { exact: true }).fill('slow');
  await expect.poll(async () => (await calls()).length).toBe(3);
  await page.getByLabel('작성자', { exact: true }).fill('David');
  await expect.poll(async () => (await calls()).length).toBe(4);
  await expect(page.locator('.commit-row')).toHaveCount(3);
  await page.evaluate(() => Reflect.get(window, 'testReleaseSlow')());
  await page.waitForTimeout(200);
  await expect(page.locator('.commit-row')).toHaveCount(3);
  await expect(page.getByRole('alert')).toHaveCount(0);
});

// 가상화된 목록에서 DOM에 남아도 되는 행 수: 보이는 행 + 위아래 여유 8행씩 + 고정(선택·포커스) 2행.
async function rowBudget(page: import('@playwright/test').Page) {
  const height = await page
    .locator('.commit-list')
    .evaluate((el) => el.clientHeight);
  return Math.ceil(height / 64) + 1 + 16 + 2;
}
const scrollListTo = (
  page: import('@playwright/test').Page,
  where: 'top' | 'bottom',
) =>
  page.locator('.commit-list').evaluate((el, where) => {
    el.scrollTop = where === 'top' ? 0 : el.scrollHeight;
    el.dispatchEvent(new Event('scroll'));
  }, where);
const loadedCount = (page: import('@playwright/test').Page) =>
  page.locator('.history > .section-heading span');

test('infinite scroll loads 200/200/50 fixture pages, keeps rows windowed and continues the graph', async ({
  page,
}) => {
  await page.goto('/?fixture=paged');
  await expect(loadedCount(page)).toHaveText('200 / 최대 5,000');
  const budget = await rowBudget(page);
  expect(await page.locator('.commit-row').count()).toBeLessThanOrEqual(budget);
  await expect(page.locator('.commit-row').first()).toHaveAttribute(
    'data-index',
    '0',
  );
  // 선택하고 포커스한 행은 창 밖으로 스크롤돼도 DOM과 포커스에 남는다.
  const first = page.locator('.commit-row[data-index="0"]');
  await first.click();
  await expect(first).toBeFocused();
  await scrollListTo(page, 'bottom');
  await expect(loadedCount(page)).toHaveText('400 / 최대 5,000');
  await scrollListTo(page, 'bottom');
  await expect(loadedCount(page)).toHaveText('450 / 최대 5,000');
  await scrollListTo(page, 'bottom');
  await expect(page.locator('.commit-row').last()).toHaveAttribute(
    'data-index',
    '449',
  );
  await expect(page.locator('.commit-row').last()).toContainText(
    'DEMO paged commit 450',
  );
  expect(await page.locator('.commit-row').count()).toBeLessThanOrEqual(budget);
  await expect(first).toBeFocused();
  await expect(page.locator('.commit-row.selected')).toHaveAttribute(
    'data-index',
    '0',
  );
  await page.keyboard.press('Shift+F10');
  await expect(page.getByRole('menu', { name: '커밋 작업' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByText('이전 커밋을 불러오는 중…')).toHaveCount(0);
  await expect(page.locator('.page-state')).toHaveCount(0);
  // 190행에서 갈라진 곁가지가 205행까지 이어지므로 두 번째 페이지 첫 행도 레인 2개를 그린다.
  await page
    .locator('.commit-list')
    .evaluate((el) => (el.scrollTop = 195 * 64));
  const boundary = page.locator('.commit-row[data-index="200"] svg path');
  await expect(boundary).toHaveCount(3);
  await expect(
    page.locator('.commit-row[data-index="199"] svg path'),
  ).toHaveCount(3);
  await scrollListTo(page, 'top');
  await expect(page.locator('.commit-row').first()).toHaveAttribute(
    'data-index',
    '0',
  );
  await expect(page.locator('.commit-row').nth(1)).toHaveAttribute(
    'data-index',
    '1',
  );
  const spacerTotal = await page
    .locator('.commit-list')
    .evaluate((el) => el.scrollHeight);
  expect(spacerTotal).toBeGreaterThanOrEqual(450 * 64);
  // 필터가 켜진 목록도 같은 조건으로 이어 받고, 그래프는 그리지 않는다.
  await page.getByRole('button', { name: '필터', exact: true }).click();
  await page.getByLabel('작성자', { exact: true }).fill('David');
  await expect(loadedCount(page)).toHaveText('200 / 최대 5,000');
  await expect(page.locator('.commit-row svg')).toHaveCount(0);
  await scrollListTo(page, 'bottom');
  await expect(loadedCount(page)).toHaveText('300 / 최대 5,000');
  await scrollListTo(page, 'bottom');
  await expect(page.locator('.commit-row').last()).toContainText(
    'DEMO paged commit 450',
  );
});

test('page requests run one at a time, reload on stale cursors and reset on branch change', async ({
  page,
}) => {
  const { fixtureRepo } = await import('../src/ui/fixture');
  await page.addInitScript((repo) => {
    const commits = Array.from({ length: 450 }, (_, i) => ({
      hash: `e${i.toString(16).padStart(7, '0')}`.padEnd(40, '0'),
      parents:
        i === 449
          ? []
          : [`e${(i + 1).toString(16).padStart(7, '0')}`.padEnd(40, '0')],
      author: 'David',
      date: '2026-11-04T09:20:00+09:00',
      subject: `Worker page commit ${i + 1}`,
      refs: [],
    }));
    const pageOf = (skip: number, branch: boolean) => {
      const list = branch ? commits.slice(100) : commits;
      const next = Math.min(skip + 200, list.length);
      const hasMore = next < list.length;
      return {
        ...repo,
        head: commits[0].hash,
        commits: list.slice(skip, next),
        hasMore,
        ...(hasMore ? { nextCursor: `c${next}` } : {}),
      };
    };
    const calls: Record<string, unknown>[] = [];
    const held: Array<() => void> = [];
    let stale = false;
    Reflect.set(window, 'testLogCalls', calls);
    Reflect.set(window, 'testRelease', () =>
      held.splice(0).forEach((fn) => fn()),
    );
    Reflect.set(window, 'testStale', () => {
      stale = true;
    });
    window.orca = {
      locale: 'en-US',
      api: { major: 1, minor: 3 },
      host: { has: () => true },
      plugin: {
        request: async <T>(name: string, raw: unknown) => {
          if (name === 'active')
            return {
              status: 'connected',
              repository: pageOf(0, false),
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
          if (name === 'log') {
            const input = raw as { cursor?: string; branchRef?: string };
            calls.push(input);
            const branch = !!input.branchRef;
            if (input.cursor === undefined) return pageOf(0, branch) as T;
            if (stale) {
              stale = false;
              throw new Error(
                'stale-cursor: 이력이 바뀌었습니다. 처음부터 다시 불러옵니다.',
              );
            }
            const skip = Number(input.cursor.slice(1));
            return new Promise<T>((resolve) =>
              held.push(() => resolve(pageOf(skip, branch) as T)),
            );
          }
          throw new Error(`Unexpected request: ${name}`);
        },
      },
    };
  }, fixtureRepo);
  const calls = () =>
    page.evaluate(
      () => Reflect.get(window, 'testLogCalls') as Record<string, unknown>[],
    );
  const pageCalls = async () =>
    (await calls()).filter((call) => 'cursor' in call);
  await page.goto('/');
  await expect(loadedCount(page)).toHaveText('200 / max 5,000');
  expect(await calls()).toHaveLength(0);
  await scrollListTo(page, 'bottom');
  await expect.poll(async () => (await pageCalls()).length).toBe(1);
  expect((await pageCalls())[0]).toEqual({
    repo: fixtureRepo.root,
    all: false,
    cursor: 'c200',
  });
  await expect(page.getByText('Loading older commits…')).toBeVisible();
  // 응답 전 스크롤을 반복해도 두 번째 요청은 나가지 않는다.
  for (const offset of [64, 0, 128, 0]) {
    await page.locator('.commit-list').evaluate((el, offset) => {
      el.scrollTop = el.scrollHeight - el.clientHeight - offset;
      el.dispatchEvent(new Event('scroll'));
    }, offset);
    await page.waitForTimeout(50);
  }
  expect(await pageCalls()).toHaveLength(1);
  await page.evaluate(() => Reflect.get(window, 'testRelease')());
  await expect(loadedCount(page)).toHaveText('400 / max 5,000');
  expect(await page.locator('.commit-row').count()).toBeLessThanOrEqual(
    await rowBudget(page),
  );

  // 낡은 커서 오류는 알림 없이 첫 페이지부터 다시 받고, 다시 이어 받아도 중복이 없다.
  await page.evaluate(() => Reflect.get(window, 'testStale')());
  await scrollListTo(page, 'bottom');
  await expect(
    page.getByText('History changed. Reloading from the start.'),
  ).toBeVisible();
  await expect(loadedCount(page)).toHaveText('200 / max 5,000');
  const reload = (await calls()).at(-1)!;
  expect(reload).toEqual({
    repo: fixtureRepo.root,
    all: false,
    cancelKey: 'filter',
  });
  await expect(page.getByRole('alert')).toHaveCount(0);
  await scrollListTo(page, 'bottom');
  await expect.poll(async () => (await pageCalls()).length).toBe(3);
  await page.evaluate(() => Reflect.get(window, 'testRelease')());
  await expect(loadedCount(page)).toHaveText('400 / max 5,000');
  await scrollListTo(page, 'bottom');
  await expect.poll(async () => (await pageCalls()).length).toBe(4);
  await page.evaluate(() => Reflect.get(window, 'testRelease')());
  await expect(loadedCount(page)).toHaveText('450 / max 5,000');
  await scrollListTo(page, 'bottom');
  await expect(page.locator('.commit-row').last()).toContainText(
    'Worker page commit 450',
  );
  const hashes = await page
    .locator('.commit-row .commit-hash')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('title')));
  expect(new Set(hashes).size).toBe(hashes.length);

  // 브랜치를 바꾸면 페이지 상태가 초기화되고, 이전 범위의 늦은 페이지 응답은 버려진다.
  await page.getByRole('button', { name: '↻ Refresh' }).click();
  await expect(loadedCount(page)).toHaveText('200 / max 5,000');
  await scrollListTo(page, 'bottom');
  await expect.poll(async () => (await pageCalls()).length).toBe(5);
  await page.getByRole('button', { name: 'Branch scope' }).click();
  await page.getByLabel('Search branches').fill('feature/readable-diff');
  await page.getByLabel('Search branches').press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(loadedCount(page)).toHaveText('200 / max 5,000');
  await expect(page.locator('.commit-row').first()).toContainText(
    'Worker page commit 101',
  );
  expect(
    await page.locator('.commit-list').evaluate((el) => el.scrollTop),
  ).toBe(0);
  await page.evaluate(() => Reflect.get(window, 'testRelease')());
  await page.waitForTimeout(200);
  await expect(loadedCount(page)).toHaveText('200 / max 5,000');
  await expect(page.locator('.commit-row').first()).toContainText(
    'Worker page commit 101',
  );
  // 이전 요청이 끝난 뒤에야 새 범위의 다음 페이지가 커서와 브랜치를 함께 싣고 나간다.
  await scrollListTo(page, 'bottom');
  await expect.poll(async () => (await pageCalls()).length).toBe(6);
  expect((await pageCalls()).at(-1)).toMatchObject({
    branchRef: expect.stringContaining('feature/readable-diff'),
    cursor: 'c200',
  });
});

test('a failed reload after a stale cursor clears the notice and shows the first page error', async ({
  page,
}) => {
  const { fixtureRepo } = await import('../src/ui/fixture');
  await page.addInitScript((repo) => {
    const commits = Array.from({ length: 450 }, (_, i) => ({
      hash: `f${i.toString(16).padStart(7, '0')}`.padEnd(40, '0'),
      parents:
        i === 449
          ? []
          : [`f${(i + 1).toString(16).padStart(7, '0')}`.padEnd(40, '0')],
      author: 'David',
      date: '2026-11-04T09:20:00+09:00',
      subject: `Reload failure commit ${i + 1}`,
      refs: [],
    }));
    const firstPage = () => ({
      ...repo,
      head: commits[0].hash,
      commits: commits.slice(0, 200),
      hasMore: true,
      nextCursor: 'c200',
    });
    let stale = false;
    let reloadFailed = false;
    window.orca = {
      locale: 'en-US',
      api: { major: 1, minor: 3 },
      host: { has: () => true },
      plugin: {
        request: async <T>(name: string, raw: unknown) => {
          if (name === 'active')
            return {
              status: 'connected',
              repository: firstPage(),
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
          if (name === 'log') {
            const input = raw as { cursor?: string };
            if (input.cursor === undefined) {
              // 낡은 커서 오류 직후의 다시 불러오기만 실패시킨다.
              if (stale && !reloadFailed) {
                reloadFailed = true;
                throw new Error('Reload failure fixture');
              }
              return firstPage() as T;
            }
            if (!stale) {
              stale = true;
              throw new Error(
                'stale-cursor: 이력이 바뀌었습니다. 처음부터 다시 불러옵니다.',
              );
            }
            return new Promise<T>(() => {});
          }
          throw new Error(`Unexpected request: ${name}`);
        },
      },
    };
  }, fixtureRepo);
  await page.goto('/');
  await expect(loadedCount(page)).toHaveText('200 / max 5,000');
  await scrollListTo(page, 'bottom');
  await expect(page.getByRole('alert')).toHaveText('Reload failure fixture');
  await expect(
    page.getByText('History changed. Reloading from the start.'),
  ).toHaveCount(0);
  await expect(page.locator('.page-notice')).toHaveCount(0);
});

test('loading stops at the 5,000 commit limit with a notice and a bounded DOM', async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.goto('/?fixture=many');
  await expect(loadedCount(page)).toHaveText('200 / 최대 5,000');
  for (let loaded = 200; loaded < 5000; loaded += 200) {
    await scrollListTo(page, 'bottom');
    await expect(loadedCount(page)).toHaveText(
      `${(loaded + 200).toLocaleString('en-US')} / 최대 5,000`,
    );
  }
  await scrollListTo(page, 'bottom');
  await expect(
    page.getByText(
      '최근 커밋 5,000개까지만 불러옵니다. 더 오래된 커밋은 검색이나 필터로 찾으세요.',
    ),
  ).toBeVisible();
  await page.waitForTimeout(200);
  await expect(loadedCount(page)).toHaveText('5,000 / 최대 5,000');
  await expect(page.locator('.commit-row').last()).toHaveAttribute(
    'data-index',
    '4999',
  );
  const budget = await rowBudget(page);
  expect(await page.locator('.commit-row').count()).toBeLessThanOrEqual(budget);
  expect(
    await page.locator('.commit-list').evaluate((el) => el.scrollHeight),
  ).toBeGreaterThanOrEqual(5000 * 64);
  await scrollListTo(page, 'top');
  await expect(page.locator('.commit-row').first()).toHaveAttribute(
    'data-index',
    '0',
  );
  expect(await page.locator('.commit-row').count()).toBeLessThanOrEqual(budget);
});

// 임의 비교(range) 진입 UI 테스트
const rangeRow = (page: import('@playwright/test').Page, subject: string) =>
  page.locator('.commit-row', { hasText: subject });
const improve = 'Improve empty states';
const aligned = 'Add aligned side-by-side comparison';

test('commit menu lists base items, enables compare only after a base is set, and the chip clears it', async ({
  page,
}) => {
  await page.goto('/');
  await rangeRow(page, improve).click({ button: 'right' });
  const menu = page.getByRole('menu', { name: '커밋 작업' });
  await expect(menu.getByRole('menuitem')).toHaveCount(10);
  const setBase = menu.getByRole('menuitem', { name: '비교 기준으로 지정' });
  const compare = menu.getByRole('menuitem', { name: '지정한 커밋과 비교' });
  const clear = menu.getByRole('menuitem', { name: '기준 해제' });
  await expect(setBase).toBeVisible();
  await expect(compare).toHaveAttribute('aria-disabled', 'true');
  await expect(clear).toHaveAttribute('aria-disabled', 'true');
  await expect(page.getByLabel('비교 기준', { exact: true })).toHaveCount(0);
  // 비활성 항목을 눌러도 메뉴가 유지되고 비교로 바뀌지 않는다.
  await compare.click({ force: true });
  await expect(menu).toBeVisible();
  await expect(page.locator('.working-row')).toHaveClass(/selected/);
  await setBase.click();
  await expect(menu).toHaveCount(0);
  await expect(page.getByLabel('비교 기준', { exact: true })).toContainText(
    '기준: 7a4f19c',
  );
  await rangeRow(page, aligned).click({ button: 'right' });
  await expect(compare).toHaveAttribute('aria-disabled', 'false');
  await expect(clear).toHaveAttribute('aria-disabled', 'false');
  // 비활성 항목도 방향키 이동에서 빠지지 않는다.
  await page.keyboard.press('End');
  await expect(page.getByRole('menuitem', { name: /리셋/ })).toBeFocused();
  await clear.click();
  await expect(page.getByLabel('비교 기준', { exact: true })).toHaveCount(0);
  await rangeRow(page, aligned).click({ button: 'right' });
  await expect(compare).toHaveAttribute('aria-disabled', 'true');
  await page.keyboard.press('Escape');
  await rangeRow(page, improve).click({ button: 'right' });
  await setBase.click();
  await page.getByRole('button', { name: '비교 기준 해제' }).click();
  await expect(page.getByLabel('비교 기준', { exact: true })).toHaveCount(0);
});

test('fixture range comparison follows the merge-base toggle and shows worker status messages', async ({
  page,
}) => {
  await page.goto('/');
  await rangeRow(page, improve).click({ button: 'right' });
  await page.getByRole('menuitem', { name: '비교 기준으로 지정' }).click();
  await rangeRow(page, aligned).click({ button: 'right' });
  await page.getByRole('menuitem', { name: '지정한 커밋과 비교' }).click();
  const toggle = page.getByRole('checkbox', {
    name: /공통 조상 기준으로 비교/,
  });
  await expect(toggle).not.toBeChecked();
  await expect(page.locator('.range-options code')).toHaveText(
    '7a4f19c..6a4f19c',
  );
  await expect(page.locator('.file-row')).toHaveCount(5);
  await toggle.check();
  await expect(page.locator('.file-row')).toHaveCount(2);
  await toggle.uncheck();
  await expect(page.locator('.file-row')).toHaveCount(5);
  // 같은 커밋은 워커처럼 요청 결과를 상태 문구로 보여 준다.
  await rangeRow(page, improve).click({ button: 'right' });
  await page.getByRole('menuitem', { name: '지정한 커밋과 비교' }).click();
  await expect(page.locator('.error[role=alert]')).toHaveText(
    '같은 커밋입니다.',
  );
  await rangeRow(page, aligned).click({ button: 'right' });
  await page.getByRole('menuitem', { name: '지정한 커밋과 비교' }).click();
  await expect(page.locator('.error[role=alert]')).toHaveCount(0);
  await expect(page.locator('.file-row')).toHaveCount(5);
});

test('fixture without a common ancestor reports it only when merge-base is on, and English copy is localized', async ({
  page,
}) => {
  await page.goto('/?fixture=unrelated&lang=en');
  await rangeRow(page, improve).click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Set as comparison base' }).click();
  await rangeRow(page, aligned).click({ button: 'right' });
  await page
    .getByRole('menuitem', { name: 'Compare with base commit' })
    .click();
  await expect(page.locator('.file-row')).toHaveCount(5);
  await page
    .getByRole('checkbox', { name: /Compare from common ancestor/ })
    .check();
  await expect(page.locator('.error[role=alert]')).toHaveText(
    'No common ancestor.',
  );
  await page
    .getByRole('checkbox', { name: /Compare from common ancestor/ })
    .uncheck();
  await rangeRow(page, improve).click({ button: 'right' });
  await page
    .getByRole('menuitem', { name: 'Compare with base commit' })
    .click();
  await expect(page.locator('.error[role=alert]')).toHaveText(
    'Both sides are the same commit.',
  );
  await expect(
    page.getByLabel('Comparison base', { exact: true }),
  ).toContainText('Base: 7a4f19c');
});

test('worker requests carry the range comparison, the merge-base value, and a version 2 descriptor', async ({
  page,
}) => {
  const { fixtureRepo, fixtureSet, fixtureDiff } =
    await import('../src/ui/fixture');
  await page.addInitScript(
    ({ repo, set, diff }) => {
      const calls: Array<{ name: string; input: any }> = [];
      Object.defineProperty(window, 'testCalls', { get: () => calls });
      window.orca = {
        locale: 'ko-KR',
        api: { major: 1, minor: 3 },
        host: { has: () => true },
        plugin: {
          request: async <T>(name: string, raw: unknown) => {
            calls.push({ name, input: raw });
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
            if (name === 'changes') {
              const { comparison } = raw as { comparison: any };
              if (comparison.kind === 'range') {
                if (comparison.base === comparison.target)
                  throw new Error('같은 커밋입니다.');
                if (
                  comparison.mergeBase &&
                  comparison.target === repo.commits[5].hash
                )
                  throw new Error('공통 조상이 없습니다.');
              }
              return { ...set, comparison } as T;
            }
            if (name === 'diff') return diff as T;
            if (name === 'commitMessage') return { message: 'm' } as T;
            if (name === 'open') return { opened: true } as T;
            throw new Error(`Unexpected request: ${name}`);
          },
        },
      };
    },
    {
      repo: fixtureRepo,
      set: fixtureSet,
      diff: fixtureDiff(fixtureSet.files[0].path),
    },
  );
  const calls = (name: string) =>
    page.evaluate(
      (wanted) =>
        (
          Reflect.get(window, 'testCalls') as Array<{
            name: string;
            input: any;
          }>
        )
          .filter((call) => call.name === wanted)
          .map((call) => call.input),
      name,
    );
  const [, improved, alignedCommit, , , first] = fixtureRepo.commits;
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  await rangeRow(page, improve).click({ button: 'right' });
  await page.getByRole('menuitem', { name: '비교 기준으로 지정' }).click();
  await rangeRow(page, aligned).click({ button: 'right' });
  await page.getByRole('menuitem', { name: '지정한 커밋과 비교' }).click();
  await expect
    .poll(async () => (await calls('changes')).at(-1)?.comparison)
    .toEqual({
      kind: 'range',
      base: improved.hash,
      target: alignedCommit.hash,
      mergeBase: false,
    });
  const toggle = page.getByRole('checkbox', {
    name: /공통 조상 기준으로 비교/,
  });
  await toggle.check();
  await expect
    .poll(async () => (await calls('changes')).at(-1)?.comparison.mergeBase)
    .toBe(true);
  await toggle.uncheck();
  await expect
    .poll(async () => (await calls('changes')).at(-1)?.comparison.mergeBase)
    .toBe(false);
  // 토글 값은 다음 비교에도 이어진다.
  await toggle.check();
  await rangeRow(page, 'Merge branch').click({ button: 'right' });
  await page.getByRole('menuitem', { name: '지정한 커밋과 비교' }).click();
  await expect
    .poll(async () => (await calls('changes')).at(-1)?.comparison)
    .toMatchObject({ target: fixtureRepo.commits[0].hash, mergeBase: true });
  await rangeRow(page, 'Initial implementation').click({ button: 'right' });
  await page.getByRole('menuitem', { name: '지정한 커밋과 비교' }).click();
  await expect(page.locator('.error[role=alert]')).toHaveText(
    '공통 조상이 없습니다.',
  );
  expect((await calls('changes')).at(-1).comparison.target).toBe(first.hash);
  await rangeRow(page, improve).click({ button: 'right' });
  await page.getByRole('menuitem', { name: '지정한 커밋과 비교' }).click();
  await expect(page.locator('.error[role=alert]')).toHaveText(
    '같은 커밋입니다.',
  );
  await rangeRow(page, aligned).click({ button: 'right' });
  await page.getByRole('menuitem', { name: '지정한 커밋과 비교' }).click();
  await expect(page.locator('.file-row').first()).toBeVisible();
  await expect(page.locator('.error[role=alert]')).toHaveCount(0);
  await page.locator('.file-row').first().dblclick();
  await expect.poll(async () => (await calls('open')).length).toBe(1);
  expect((await calls('open'))[0]).toMatchObject({
    workspaceId: 'fixture',
    descriptor: {
      version: 2,
      repo: fixtureRepo.root,
      comparison: {
        kind: 'range',
        base: improved.hash,
        target: alignedCommit.hash,
        mergeBase: true,
      },
    },
  });
  // range가 아닌 비교는 이전처럼 version 1로 저장한다.
  await page.locator('.working-row').click();
  await expect(page.locator('.file-row').first()).toBeVisible();
  await page.locator('.file-row').first().dblclick();
  await expect.poll(async () => (await calls('open')).length).toBe(2);
  expect((await calls('open'))[1].descriptor).toMatchObject({
    version: 1,
    comparison: { kind: 'working' },
  });
});

test('editor entry opens a version 2 range descriptor and rejects version 1 with a range', async ({
  page,
}) => {
  const { fixtureRepo, fixtureSet, fixtureDiff } =
    await import('../src/ui/fixture');
  const range = {
    kind: 'range',
    base: fixtureRepo.commits[1].hash,
    target: fixtureRepo.commits[2].hash,
    mergeBase: true,
  };
  const install = (version: number) =>
    page.addInitScript(
      ({ repo, set, diff, descriptor }) => {
        const requests: Array<{ name: string; input: unknown }> = [];
        Object.defineProperty(window, 'testRequests', { get: () => requests });
        window.orca = {
          api: { major: 1, minor: 3 },
          host: { has: () => true },
          plugin: {
            request: async <T>(name: string, input: unknown) => {
              requests.push({ name, input });
              return (
                name === 'changes'
                  ? { ...set, comparison: descriptor.comparison }
                  : diff
              ) as T;
            },
          },
          document: {
            session: async () => ({
              value: JSON.stringify(descriptor),
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
        descriptor: {
          version,
          repo: fixtureRepo.root,
          comparison: range,
          path: fixtureSet.files[0].path,
        },
      },
    );
  await install(2);
  await page.goto('/editor.html');
  await expect(page.locator('.monaco-editor[role=code]')).toHaveCount(2);
  await expect(page.locator('.error[role=alert]')).toHaveCount(0);
  const requests = await page.evaluate(
    () =>
      Reflect.get(window, 'testRequests') as Array<{
        name: string;
        input: { comparison: unknown };
      }>,
  );
  expect(requests.find((r) => r.name === 'changes')?.input.comparison).toEqual(
    range,
  );
  const toggle = page.getByRole('checkbox', {
    name: /공통 조상 기준으로 비교/,
  });
  await expect(toggle).toBeChecked();
  await expect(toggle).toBeDisabled();

  const rejected = await page.context().newPage();
  await rejected.addInitScript(
    ({ repo, descriptor }) => {
      const requests: unknown[] = [];
      Object.defineProperty(window, 'testRequests', { get: () => requests });
      window.orca = {
        api: { major: 1, minor: 3 },
        host: { has: () => true },
        plugin: {
          request: async <T>(name: string) => {
            requests.push(name);
            throw new Error(`Unexpected request: ${name} ${repo.root}`);
          },
        },
        document: {
          session: async () => ({
            value: JSON.stringify(descriptor),
            onReplace: () => () => {},
            dispose() {},
          }),
        },
      };
    },
    {
      repo: fixtureRepo,
      descriptor: {
        version: 1,
        repo: fixtureRepo.root,
        comparison: range,
      },
    },
  );
  await rejected.goto('/editor.html');
  await expect(rejected.locator('.error[role=alert]')).toHaveText(
    '지원하지 않는 비교 문서입니다.',
  );
  expect(
    await rejected.evaluate(() => Reflect.get(window, 'testRequests')),
  ).toEqual([]);
});

async function mockFileHistoryWorker(page: import('@playwright/test').Page) {
  const { fixtureRepo } = await import('../src/ui/fixture');
  await page.addInitScript((repo) => {
    const calls: unknown[] = [];
    Reflect.set(window, 'testLogCalls', calls);
    window.orca = {
      locale: 'ko-KR',
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
              files: [
                { path: 'src/ui/Timeline.tsx', status: 'M', unstaged: true },
                { path: 'README.md', status: 'M', unstaged: true },
              ],
              left: 'HEAD',
              right: '현재 작업 트리 · 디스크',
            } as T;
          if (name === 'diff')
            return {
              file: { path: 'src/ui/Timeline.tsx', status: 'M' },
              original: { kind: 'text', text: 'a\n', bytes: 2 },
              modified: { kind: 'text', text: 'b\n', bytes: 2 },
            } as T;
          if (name === 'log') {
            calls.push(raw);
            const input = raw as { filter?: { path?: string } };
            return {
              ...repo,
              commits: input.filter?.path
                ? repo.commits.slice(1, 4)
                : repo.commits,
            } as T;
          }
          throw new Error(`Unexpected request: ${name}`);
        },
      },
    };
  }, fixtureRepo);
  return {
    fixtureRepo,
    calls: () =>
      page.evaluate(() => Reflect.get(window, 'testLogCalls') as unknown[]),
  };
}
const fileRow = (page: import('@playwright/test').Page, name: string) =>
  page.locator('.file-row', { hasText: name });

test('right-clicking a changed file opens a file menu whose history item follows renames and returns focus', async ({
  page,
}) => {
  const { fixtureRepo, calls } = await mockFileHistoryWorker(page);
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  const row = fileRow(page, 'Timeline.tsx');
  await row.click({ button: 'right' });
  const menu = page.getByRole('menu', { name: '파일 작업' });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('menuitem')).toHaveCount(1);
  await expect(menu.getByRole('menuitem', { name: '히스토리' })).toBeFocused();
  await menu.getByRole('menuitem', { name: '히스토리' }).click();
  await expect(menu).toHaveCount(0);
  await expect(row).toBeFocused();
  await expect(page.locator('.filter-chip')).toHaveText([
    '파일: src/ui/Timeline.tsx (이름 변경 추적)×',
  ]);
  await expect(page.getByText('검색 결과 · 그래프 숨김')).toBeVisible();
  await expect(page.locator('.commit-row')).toHaveCount(3);
  await expect(page.locator('.commit-row svg')).toHaveCount(0);
  const sent = await calls();
  expect(sent).toHaveLength(1);
  expect(sent[0]).toEqual({
    repo: fixtureRepo.root,
    all: false,
    filter: { path: 'src/ui/Timeline.tsx', follow: true },
    cancelKey: 'filter',
  });
});

test('Shift+F10 on a changed file opens the menu, Escape closes it and focus returns to the file', async ({
  page,
}) => {
  await page.goto('/?fixture=rename');
  await expect(page.locator('.commit-row')).toHaveCount(5);
  const row = fileRow(page, 'Timeline.tsx');
  await row.focus();
  await page.keyboard.press('Shift+F10');
  const item = page.getByRole('menuitem', { name: '히스토리' });
  await expect(page.getByRole('menu', { name: '파일 작업' })).toBeVisible();
  await expect(item).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(item).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(row).toBeFocused();
  await page.keyboard.press('Shift+F10');
  await page.keyboard.press('Enter');
  await expect(page.locator('.filter-chip')).toHaveText([
    '파일: src/ui/Timeline.tsx (이름 변경 추적)×',
  ]);
  await expect(row).toBeFocused();
});

test('clearing the file chip returns to the original list and keeps other filters ANDed', async ({
  page,
}) => {
  await page.goto('/?fixture=rename');
  await expect(page.locator('.commit-row')).toHaveCount(5);
  await fileRow(page, 'Timeline.tsx').click({ button: 'right' });
  await page.getByRole('menuitem', { name: '히스토리' }).click();
  // 이름이 바뀌기 전 커밋까지 이어진다. README만 바꾼 커밋은 빠진다.
  await expect(page.locator('.commit-row')).toHaveCount(4);
  await expect(page.locator('.commit-row').last()).toContainText(
    'Add history view',
  );
  await page.getByLabel('커밋 검색').fill('view');
  await expect(page.locator('.commit-row')).toHaveCount(1);
  await expect(page.locator('.filter-chip')).toHaveText([
    '메시지: view×',
    '파일: src/ui/Timeline.tsx (이름 변경 추적)×',
  ]);
  await page.getByRole('button', { name: '파일 필터 해제' }).click();
  await expect(page.locator('.filter-chip')).toHaveText(['메시지: view×']);
  await expect(page.locator('.commit-row')).toHaveCount(2);
  await page.getByRole('button', { name: '메시지 필터 해제' }).click();
  await expect(page.locator('.filter-chip')).toHaveCount(0);
  await expect(page.locator('.commit-row')).toHaveCount(5);
  await expect(page.locator('.commit-row svg')).toHaveCount(5);
});

test('picking a commit in a file history selects the file by oldPath when it was renamed there', async ({
  page,
}) => {
  await page.goto('/?fixture=rename');
  await page.locator('.commit-row', { hasText: 'Add history filters' }).click();
  await expect(fileRow(page, 'History.tsx')).toBeVisible();
  await fileRow(page, 'History.tsx').click({ button: 'right' });
  await page.getByRole('menuitem', { name: '히스토리' }).click();
  await expect(page.locator('.filter-chip')).toHaveText([
    '파일: src/ui/History.tsx (이름 변경 추적)×',
  ]);
  await expect(page.locator('.commit-row')).toHaveCount(3);
  await page
    .locator('.commit-row', { hasText: 'Rename History to Timeline' })
    .click();
  // 첫 파일은 connection.ts지만 oldPath가 히스토리 경로와 일치하는 Timeline.tsx를 고른다.
  await expect(fileRow(page, 'connection.ts')).not.toHaveClass(/selected/);
  await expect(fileRow(page, 'Timeline.tsx')).toHaveClass(/selected/);
  await expect(page.locator('.comparison-heading h2')).toHaveText(
    'Timeline.tsx',
  );
});

test('picking a commit in a file history selects the only changed file and leaves none when nothing matches', async ({
  page,
}) => {
  await page.goto('/?fixture=rename');
  await fileRow(page, 'Timeline.tsx').click({ button: 'right' });
  await page.getByRole('menuitem', { name: '히스토리' }).click();
  await expect(page.locator('.commit-row')).toHaveCount(4);
  await page.locator('.commit-row', { hasText: 'Add history view' }).click();
  await expect(page.locator('.file-row')).toHaveCount(1);
  await expect(fileRow(page, 'History.tsx')).toHaveClass(/selected/);
  await expect(page.locator('.comparison-heading h2')).toHaveText(
    'History.tsx',
  );
  // 이름이 바뀌기 전 경로(History.tsx)만 있는 커밋에서는 path와 oldPath 모두 안 맞아 고르지 않는다.
  await page.locator('.commit-row', { hasText: 'Add history filters' }).click();
  await expect(page.locator('.file-row')).toHaveCount(2);
  await expect(page.locator('.file-row.selected')).toHaveCount(0);
  await expect(page.locator('.comparison-heading h2')).toHaveText(
    '변경 파일 비교',
  );
  // 다음 커밋 선택은 이전 선택 규칙을 물려받지 않고 일치하는 파일을 다시 고른다.
  await page.locator('.commit-row', { hasText: 'Polish timeline' }).click();
  await expect(fileRow(page, 'Timeline.tsx')).toHaveClass(/selected/);
});

test('all-branches scope drops follow before the request, shows a notice and restores follow on a branch scope', async ({
  page,
}) => {
  const { fixtureRepo, calls } = await mockFileHistoryWorker(page);
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  await page.getByRole('button', { name: '브랜치 범위' }).click();
  await page.getByRole('option', { name: '전체 브랜치', exact: true }).click();
  await expect.poll(async () => (await calls()).length).toBe(1);
  await fileRow(page, 'Timeline.tsx').click({ button: 'right' });
  await page.getByRole('menuitem', { name: '히스토리' }).click();
  await expect.poll(async () => (await calls()).length).toBe(2);
  const sent = await calls();
  expect(sent[1]).toEqual({
    repo: fixtureRepo.root,
    all: true,
    filter: { path: 'src/ui/Timeline.tsx' },
    cancelKey: 'filter',
  });
  expect(Object.keys((sent[1] as { filter: object }).filter)).toEqual(['path']);
  await expect(page.locator('.follow-note')).toHaveText(
    '전체 브랜치 보기에서는 이름 변경 추적을 쓸 수 없습니다.',
  );
  await expect(page.locator('.filter-chip')).toHaveText([
    '파일: src/ui/Timeline.tsx×',
  ]);
  await page.getByRole('button', { name: '브랜치 범위' }).click();
  await page.getByRole('option', { name: '현재 브랜치', exact: true }).click();
  await expect.poll(async () => (await calls()).length).toBe(3);
  expect((await calls())[2]).toEqual({
    repo: fixtureRepo.root,
    all: false,
    filter: { path: 'src/ui/Timeline.tsx', follow: true },
    cancelKey: 'filter',
  });
  await expect(page.locator('.follow-note')).toHaveCount(0);
  await expect(page.locator('.filter-chip')).toHaveText([
    '파일: src/ui/Timeline.tsx (이름 변경 추적)×',
  ]);
});

const selectedRow = (page: import('@playwright/test').Page) =>
  page.locator('.commit-row.selected');
const commitAt = (page: import('@playwright/test').Page, index: number) =>
  page.locator(`.commit-row[data-index="${index}"]`);
const selectedFile = (page: import('@playwright/test').Page) =>
  page.locator('.file-row.selected');

test('arrow keys move the selected commit one row at a time and stop at both ends', async ({
  page,
}) => {
  await page.goto('/');
test('canceling an action dialog returns focus to the commit row that opened the menu', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  const cancel = () =>
    page
      .getByRole('dialog')
      .getByRole('button', { name: '취소', exact: true })
      .click();
  await commitAt(page, 3).click({ button: 'right' });
  await page.getByRole('menuitem', { name: '체크아웃…', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await cancel();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(commitAt(page, 3)).toBeFocused();

  await commitAt(page, 2).focus();
  await page.keyboard.press('Shift+F10');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(commitAt(page, 2)).toBeFocused();
});

  await expect(page.locator('.commit-row')).toHaveCount(6);
  await commitAt(page, 2).click();
  await expect(selectedRow(page)).toHaveAttribute('data-index', '2');
  await page.keyboard.press('ArrowDown');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '3');
  await expect(commitAt(page, 3)).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '2');
  await expect(commitAt(page, 2)).toBeFocused();
  // 수식키가 붙으면 다른 단축키에 양보한다.
  await page.keyboard.press('Alt+ArrowDown');
  await page.keyboard.press('Shift+ArrowDown');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '2');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '0');
  await page.keyboard.press('ArrowDown');
  for (let i = 0; i < 8; i++) await page.keyboard.press('ArrowDown');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '5');
  await expect(commitAt(page, 5)).toBeFocused();
  // 선택한 커밋의 변경 파일 목록도 따라 바뀐다.
  await expect(page.locator('.file-row')).toHaveCount(6);
});

test('arrow keys start from the first commit when the working tree is selected', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  await page.locator('.working-row').click();
  await expect(selectedRow(page)).toHaveCount(0);
  await page.keyboard.press('ArrowDown');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '0');
});

test('arrow keys after clicking the file list move only the selected file', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  await commitAt(page, 1).click();
  await expect(page.locator('.file-row')).toHaveCount(6);
  await page.locator('.file-row').nth(1).click();
  await expect(selectedFile(page)).toContainText('comparison.css');
  await page.keyboard.press('ArrowDown');
  await expect(selectedFile(page)).toContainText('side-by-side-comparison');
  await expect(page.locator('.file-row').nth(2)).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('.file-row').nth(0)).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  // 첫 행에서 멈추고 그래프 선택은 그대로다.
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('.file-row').nth(0)).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  for (let i = 0; i < 8; i++) await page.keyboard.press('ArrowDown');
  await expect(page.locator('.file-row').nth(5)).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(selectedRow(page)).toHaveAttribute('data-index', '1');
});

test('clicking the other area switches which list the arrow keys move', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  await commitAt(page, 1).click();
  await expect(page.locator('.file-row')).toHaveCount(6);
  await page.locator('.file-row').nth(0).click();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('.file-row').nth(1)).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(selectedRow(page)).toHaveAttribute('data-index', '1');
  await commitAt(page, 1).click();
  await expect(page.locator('.file-row')).toHaveCount(6);
  await page.keyboard.press('ArrowDown');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '2');
  await page.locator('.file-row').nth(0).click();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('.file-row').nth(1)).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(selectedRow(page)).toHaveAttribute('data-index', '2');
});

test('arrow keys keep the selected row visible and focused in a windowed list', async ({
  page,
}) => {
  await page.goto('/?fixture=many');
  await expect(commitAt(page, 0)).toBeVisible();
  await commitAt(page, 0).click();
  for (let i = 0; i < 40; i++) await page.keyboard.press('ArrowDown');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '40');
  const inside = () =>
    page.evaluate(() => {
      const list = document
        .querySelector('.commit-list')!
        .getBoundingClientRect();
      const row = document
        .querySelector('.commit-row.selected')!
        .getBoundingClientRect();
      return row.top >= list.top - 1 && row.bottom <= list.bottom + 1;
    });
  expect(await inside()).toBe(true);
  await expect(commitAt(page, 40)).toBeFocused();
  const scrolled = await page
    .locator('.commit-list')
    .evaluate((el) => el.scrollTop);
  expect(scrolled).toBeGreaterThan(0);
  for (let i = 0; i < 40; i++) await page.keyboard.press('ArrowUp');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '0');
  expect(await inside()).toBe(true);
  await expect(commitAt(page, 0)).toBeFocused();
  expect(
    await page.locator('.commit-list').evaluate((el) => el.scrollTop),
  ).toBe(0);
  const budget = await rowBudget(page);
  expect(await page.locator('.commit-row').count()).toBeLessThanOrEqual(budget);
});

test('moving down near the end of the loaded commits requests the next page', async ({
  page,
}) => {
  await page.goto('/?fixture=paged');
  await expect(loadedCount(page)).toHaveText('200 / 최대 5,000');
  await page.locator('.commit-list').evaluate((el) => {
    el.scrollTop = 175 * 64;
    el.dispatchEvent(new Event('scroll'));
  });
  await commitAt(page, 185).click();
  for (let i = 0; i < 14; i++) await page.keyboard.press('ArrowDown');
  await expect(loadedCount(page)).toHaveText('400 / 최대 5,000');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '199');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '201');
  await expect(commitAt(page, 201)).toBeFocused();
});

test('arrow keys are ignored while the branch picker is open', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  await commitAt(page, 1).click();
  await page.getByRole('button', { name: '브랜치 범위' }).click();
  await expect(
    page.getByRole('listbox', { name: '브랜치 목록' }),
  ).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(
    page.getByRole('listbox', { name: '브랜치 목록' }).locator(':focus'),
  ).toHaveCount(1);
  await expect(selectedRow(page)).toHaveAttribute('data-index', '1');
  // 트리거에 포커스가 있어도 열려 있는 동안은 커밋 선택이 움직이지 않는다.
  await page.getByRole('button', { name: '브랜치 범위' }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '1');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await commitAt(page, 1).click();
  await page.keyboard.press('ArrowDown');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '2');
});

test('arrow keys leave the commit menu to its own navigation', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  await commitAt(page, 1).click();
  await commitAt(page, 3).click({ button: 'right' });
  const menu = page.getByRole('menu', { name: '커밋 작업' });
  await expect(menu).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await expect(
    page.getByRole('menuitem', { name: '새 브랜치…' }),
  ).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(
    page.getByRole('menuitem', { name: '현재 브랜치에 병합…' }),
  ).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(
    page.getByRole('menuitem', { name: '새 브랜치…' }),
  ).toBeFocused();
  await expect(selectedRow(page)).toHaveAttribute('data-index', '1');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(commitAt(page, 3)).toBeFocused();
});

test('arrow keys leave the file menu to its own navigation and resume after it closes', async ({
  page,
}) => {
  await page.goto('/?fixture=rename');
  await expect(page.locator('.commit-row')).toHaveCount(5);
  const first = page.locator('.file-row').nth(0);
  await first.click();
  const before = await selectedFile(page).textContent();
  await page.locator('.file-row').nth(1).click({ button: 'right' });
  const item = page.getByRole('menuitem', { name: '히스토리' });
  await expect(item).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowUp');
  await expect(item).toBeFocused();
  await expect(selectedFile(page)).toHaveText(before ?? '');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.locator('.file-row').nth(1)).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('.file-row').nth(0)).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('clicking the commit menu title keeps Escape working and returns focus to the row', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  await commitAt(page, 1).click();
  await commitAt(page, 3).click({ button: 'right' });
  const menu = page.getByRole('menu', { name: '커밋 작업' });
  await menu.locator('small').first().click();
  await expect(menu).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(commitAt(page, 3)).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '2');
});

test('clicking the file menu title keeps Escape working and returns focus to the row', async ({
  page,
}) => {
  await page.goto('/?fixture=rename');
  await expect(page.locator('.commit-row')).toHaveCount(5);
  await page.locator('.file-row').nth(0).click();
  await page.locator('.file-row').nth(1).click({ button: 'right' });
  const menu = page.getByRole('menu');
  await menu.locator('small').first().click();
  await expect(menu).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(page.locator('.file-row').nth(1)).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('.file-row').nth(1)).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('Escape inside a menu stops at the menu instead of reaching document listeners', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  await page.evaluate(() => {
    const seen: string[] = [];
    Reflect.set(window, 'testEscapes', seen);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') seen.push(event.key);
    });
  });
  const escapes = () =>
    page.evaluate(() => (Reflect.get(window, 'testEscapes') as string[]).length);
  await commitAt(page, 3).click({ button: 'right' });
  const menu = page.getByRole('menu', { name: '커밋 작업' });
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  expect(await escapes()).toBe(0);
  // 메뉴 밖에서는 같은 키가 document까지 올라가므로 리스너가 살아 있는지 함께 확인한다.
  await page.keyboard.press('Escape');
  expect(await escapes()).toBe(1);
});

test('Tab closes the commit menu', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  await commitAt(page, 3).click({ button: 'right' });
  const menu = page.getByRole('menu', { name: '커밋 작업' });
  await expect(menu).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(menu).toHaveCount(0);
});

test('arrow keys pressed with focus on the menu itself go to the first or last item', async ({
  page,
  // 닫으면서 행으로 돌린 포커스에서 Tab이 다음 행으로 넘어가 body로 빠지지 않는다.
  await expect(commitAt(page, 4)).toBeFocused();
});

test('Tab closes the file menu without dropping focus to the page', async ({
  page,
}) => {
  await page.goto('/?fixture=rename');
  await expect(page.locator('.commit-row')).toHaveCount(5);
  await page.locator('.file-row').nth(0).click();
  await page.locator('.file-row').nth(1).click({ button: 'right' });
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(menu).toHaveCount(0);
  await expect
    .poll(() => page.evaluate(() => document.activeElement?.tagName))
    .not.toBe('BODY');
}) => {
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  await commitAt(page, 3).click({ button: 'right' });
  const menu = page.getByRole('menu', { name: '커밋 작업' });
  const items = menu.getByRole('menuitem');
  await menu.locator('small').first().click();
  await expect(menu).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(items.first()).toBeFocused();
  await menu.locator('small').first().click();
  await expect(menu).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(items.last()).toBeFocused();
});

test('arrow keys are ignored while an input has focus', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  await commitAt(page, 1).click();
  await expect(page.locator('.file-row')).toHaveCount(6);
  const search = page.getByLabel('커밋 검색');
  await search.click();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowUp');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '1');
  const fileSearch = page.getByLabel('파일 검색');
  await fileSearch.click();
  const selected = await selectedFile(page).textContent();
  await page.keyboard.press('ArrowDown');
  await expect(selectedFile(page)).toHaveText(selected ?? '');
  await expect(fileSearch).toBeFocused();
});

// 통과 판정 순서(메인 배포 태그 확인 → 두 배포 사이 비교 → 오래된 커밋 확인 → 특정 인물 작업분 검색 → 키보드 이동)를
// 한 세션에서 이어 간다. fixture는 page.goto로 바꿔 가며 같은 흐름을 유지한다.
test('acceptance order: deploy tags, range between two deploys, old commit, one author, keyboard', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  const latestDeploy = rangeRow(page, improve);
  const previousDeploy = rangeRow(
    page,
    'Extract repository connection controls',
  );
  await expect(latestDeploy.locator('.tag-badge')).toHaveText(['v1.0.0']);
  await expect(previousDeploy.locator('.tag-badge')).toHaveText([
    'v0.9.0',
    'v0.9.0-rc.1',
  ]);
  await previousDeploy.click({ button: 'right' });
  await page.getByRole('menuitem', { name: '비교 기준으로 지정' }).click();
  await expect(page.getByLabel('비교 기준', { exact: true })).toContainText(
    '기준: 5a4f19c',
  );
  await latestDeploy.click({ button: 'right' });
  await page.getByRole('menuitem', { name: '지정한 커밋과 비교' }).click();
  await expect(page.locator('.range-options code')).toHaveText(
    '5a4f19c..7a4f19c',
  );
  await expect(page.locator('.file-row')).toHaveCount(5);
  await expect(page.locator('.error[role=alert]')).toHaveCount(0);

  // 200개 상한 밖의 오래된 커밋까지 스크롤로 불러와 내용을 확인한다.
  await page.goto('/?fixture=paged');
  await expect(loadedCount(page)).toHaveText('200 / 최대 5,000');
  await scrollListTo(page, 'bottom');
  await expect(loadedCount(page)).toHaveText('400 / 최대 5,000');
  await scrollListTo(page, 'bottom');
  await expect(loadedCount(page)).toHaveText('450 / 최대 5,000');
  await scrollListTo(page, 'bottom');
  await expect(page.locator('.commit-row').last()).toHaveAttribute(
    'data-index',
    '449',
  );
  await commitAt(page, 449).click();
  await expect(page.locator('.details pre')).toHaveText(
    'DEMO paged commit 450',
  );

  // 특정 인물의 작업분만 모은다. 450개 중 3의 배수 번째 150개가 해당한다.
  await page.getByRole('button', { name: '필터', exact: true }).click();
  await page.getByLabel('작성자', { exact: true }).fill('서연');
  await expect(page.locator('.filter-chip')).toHaveText(['작성자: 서연×']);
  await expect(loadedCount(page)).toHaveText('150 / 최대 5,000');
  await expect(page.locator('.commit-row').first()).toHaveAttribute(
    'data-index',
    '0',
  );
  const everyByAuthor = await page
    .locator('.commit-row')
    .evaluateAll((rows) =>
      rows.every((row) => row.textContent?.includes('서연')),
    );
  expect(everyByAuthor).toBe(true);

  await commitAt(page, 0).click();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '2');
  await expect(commitAt(page, 2)).toBeFocused();
  await expect(page.locator('.details pre')).toHaveText('DEMO paged commit 7');
  await page.keyboard.press('ArrowUp');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '1');
});

test('read-only tools chain in one session: tag, message search, branch AND author, range, file history, keys, paging', async ({
  page,
}) => {
  const rows = page.locator('.commit-row');
  // 비교 기준 칩도 같은 .filter-chip 클래스를 쓰므로 적용된 필터 묶음만 본다.
  const chips = page.locator('[aria-label="적용된 필터"] .filter-chip');
  await page.goto('/');
  await expect(rows).toHaveCount(6);
  await expect(rangeRow(page, improve).locator('.tag-badge')).toHaveText([
    'v1.0.0',
  ]);

  // 메시지 검색은 그래프를 생략하고 칩으로 남는다.
  await page.getByLabel('커밋 검색').fill('aligned');
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText(aligned);
  await expect(page.locator('.commit-row svg')).toHaveCount(0);
  await expect(chips).toHaveText(['메시지: aligned×']);
  await page.getByLabel('커밋 검색').fill('');
  await expect(chips).toHaveCount(0);
  await expect(rows).toHaveCount(6);

  // 브랜치와 작성자는 AND로 걸린다. feature 브랜치의 4개 중 David는 2개다.
  await page.getByRole('button', { name: '브랜치 범위' }).click();
  await page
    .getByRole('option', { name: 'feature/readable-diff 로컬', exact: true })
    .click();
  await expect(rows).toHaveCount(4);
  await page.getByRole('button', { name: '필터', exact: true }).click();
  await page.getByLabel('작성자', { exact: true }).fill('David');
  await expect(chips).toHaveText(['작성자: David×']);
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0)).toContainText('Extract repository connection');
  await expect(rows.nth(1)).toContainText('Initial implementation');
  await page.getByRole('button', { name: '모두 해제' }).click();
  await expect(rows).toHaveCount(4);

  // 브랜치 안에서 처음 커밋과 끝 커밋을 range로 비교한다.
  await rangeRow(page, 'Initial implementation').click({ button: 'right' });
  await page.getByRole('menuitem', { name: '비교 기준으로 지정' }).click();
  await rangeRow(page, aligned).click({ button: 'right' });
  await page.getByRole('menuitem', { name: '지정한 커밋과 비교' }).click();
  await expect(page.locator('.range-options code')).toHaveText(
    '3a4f19c..6a4f19c',
  );
  const mergeBaseToggle = page.getByRole('checkbox', {
    name: /공통 조상 기준으로 비교/,
  });
  await expect(page.locator('.file-row')).toHaveCount(5);
  await mergeBaseToggle.check();
  await expect(page.locator('.file-row')).toHaveCount(2);
  await mergeBaseToggle.uncheck();
  await expect(page.locator('.file-row')).toHaveCount(5);

  // 변경 파일 우클릭으로 파일 히스토리에 들어가면 같은 브랜치 안에서 그 파일을 바꾼 3개 커밋만 남는다.
  await fileRow(page, 'DiffViewer.tsx').click({ button: 'right' });
  await page.getByRole('menuitem', { name: '히스토리' }).click();
  await expect(chips).toHaveText([
    '파일: src/components/comparison/DiffViewer.tsx (이름 변경 추적)×',
  ]);
  await expect(rows).toHaveCount(3);
  await expect(page.locator('.commit-row svg')).toHaveCount(0);

  await commitAt(page, 0).click();
  await page.keyboard.press('ArrowDown');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '1');
  await expect(selectedRow(page)).toContainText('Handle binary and renamed');
  await expect(page.locator('.file-row')).toHaveCount(6);
  await page.locator('.file-row').nth(0).click();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('.file-row').nth(1)).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(selectedRow(page)).toHaveAttribute('data-index', '1');

  // 파일 히스토리 칩을 해제하면 브랜치 범위의 원래 목록으로 돌아온다.
  await page.getByRole('button', { name: '파일 필터 해제' }).click();
  await expect(chips).toHaveCount(0);
  await expect(rows).toHaveCount(4);

  // 450개 이력에서는 브랜치와 작성자 필터를 건 채로 다음 페이지를 이어 받는다.
  // main은 앞 50개를 건너뛴 400개 중 David가 267개이고, 첫 페이지는 200개다.
  await page.goto('/?fixture=paged');
  await expect(loadedCount(page)).toHaveText('200 / 최대 5,000');
  await page.getByRole('button', { name: '브랜치 범위' }).click();
  await page.getByRole('option', { name: 'main 로컬', exact: true }).click();
  await expect(loadedCount(page)).toHaveText('200 / 최대 5,000');
  await expect(rows.first()).toContainText('DEMO paged commit 51');
  await page.getByRole('button', { name: '필터', exact: true }).click();
  await page.getByLabel('작성자', { exact: true }).fill('David');
  // 디바운스 뒤 필터 응답이 반영돼 51번째(서연)가 빠진 것을 확인한 다음에 스크롤한다.
  await expect(rows.nth(1)).toContainText('DEMO paged commit 53');
  await expect(loadedCount(page)).toHaveText('200 / 최대 5,000');
  await scrollListTo(page, 'bottom');
  await expect(loadedCount(page)).toHaveText('267 / 최대 5,000');
  await scrollListTo(page, 'bottom');
  await expect(rows.last()).toContainText('DEMO paged commit 450');
  await expect(page.locator('.page-state')).toHaveCount(0);
});

// 위 explicit fixture state 목록은 주소만으로 닿는 정적 상태다. 아래는 조작이 필요한 새 상태를 같은 이름으로 모은다.
// 상한 5,000 안내는 'loading stops at the 5,000 commit limit...' 테스트가 이미 덮는다.
test('explicit fixture state: stale-cursor reloads from the start with Korean copy and no internal prefix', async ({
  page,
}) => {
  await page.goto('/?fixture=stale');
  await expect(loadedCount(page)).toHaveText('200 / 최대 5,000');
  await scrollListTo(page, 'bottom');
  await expect(
    page.getByText('이력이 바뀌었습니다. 처음부터 다시 불러옵니다.', {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByText('stale-cursor')).toHaveCount(0);
  await expect(loadedCount(page)).toHaveText('200 / 최대 5,000');
  await expect(page.locator('.page-state[role=alert]')).toHaveCount(0);
  // 낡은 커서 오류는 한 번만 나고 다시 이어 받으면 중복 없이 400개까지 쌓인다.
  await scrollListTo(page, 'bottom');
  await expect(loadedCount(page)).toHaveText('400 / 최대 5,000');
  await expect(page.locator('.page-state[role=alert]')).toHaveCount(0);
});

test('explicit fixture state: no common ancestor and the same commit are shown in Korean', async ({
  page,
}) => {
  await page.goto('/?fixture=unrelated');
  await rangeRow(page, improve).click({ button: 'right' });
  await page.getByRole('menuitem', { name: '비교 기준으로 지정' }).click();
  await rangeRow(page, aligned).click({ button: 'right' });
  await page.getByRole('menuitem', { name: '지정한 커밋과 비교' }).click();
  await expect(page.locator('.file-row')).toHaveCount(5);
  await expect(page.locator('.error[role=alert]')).toHaveCount(0);
  const toggle = page.getByRole('checkbox', {
    name: /공통 조상 기준으로 비교/,
  });
  await toggle.check();
  await expect(page.locator('.error[role=alert]')).toHaveText(
    '공통 조상이 없습니다.',
  );
  await toggle.uncheck();
  await rangeRow(page, improve).click({ button: 'right' });
  await page.getByRole('menuitem', { name: '지정한 커밋과 비교' }).click();
  await expect(page.locator('.error[role=alert]')).toHaveText(
    '같은 커밋입니다.',
  );
});

test('explicit fixture state: all-branches scope shows the rename tracking notice over the rename history fixture', async ({
  page,
}) => {
  await page.goto('/?fixture=rename');
  await expect(page.locator('.commit-row')).toHaveCount(5);
  await page.getByRole('button', { name: '브랜치 범위' }).click();
  await page.getByRole('option', { name: '전체 브랜치', exact: true }).click();
  await fileRow(page, 'Timeline.tsx').click({ button: 'right' });
  await page.getByRole('menuitem', { name: '히스토리' }).click();
  await expect(page.locator('.follow-note')).toHaveText(
    '전체 브랜치 보기에서는 이름 변경 추적을 쓸 수 없습니다.',
  );
  await expect(page.locator('.filter-chip')).toHaveText([
    '파일: src/ui/Timeline.tsx×',
  ]);
  // 추적 없이 새 경로만 보므로 이름이 바뀌기 전 두 커밋은 빠진다.
  await expect(page.locator('.commit-row')).toHaveCount(2);
  await page.getByRole('button', { name: '브랜치 범위' }).click();
  await page.getByRole('option', { name: '현재 브랜치', exact: true }).click();
  await expect(page.locator('.follow-note')).toHaveCount(0);
  await expect(page.locator('.commit-row')).toHaveCount(4);
});

// 패널 모드(window.orca)를 흉내 내는 목. changes 요청은 window.__changes에 커밋 해시를 쌓는다.
async function installPanelOrca(page: Page) {
  const { fixtureRepo, fixtureFiles, fixtureCommitMessage, fixtureDiff } =
    await import('../src/ui/fixture');
  const second = fixtureRepo.commits[1].hash;
  const files = fixtureFiles({ kind: 'commit', commitHash: second });
  await page.addInitScript(
    ([repo, list, message, diffs]) => {
      const seen: string[] = [];
      (window as unknown as { __changes: string[] }).__changes = seen;
      window.orca = {
        locale: 'ko-KR',
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
            if (name === 'changes') {
              const comparison = (
                raw as { comparison: { kind: string; commit?: string } }
              ).comparison;
              if (comparison.kind === 'commit' && comparison.commit)
                seen.push(comparison.commit);
              return {
                comparison,
                files: list,
                left: 'parent',
                right: 'commit',
              } as T;
            }
            if (name === 'commitMessage') return message as T;
            if (name === 'diff')
              return diffs[(raw as { path: string }).path] as T;
            throw new Error(`Unexpected request: ${name}`);
          },
        },
      };
    },
    [
      fixtureRepo,
      files,
      fixtureCommitMessage(second),
      Object.fromEntries(files.map((f) => [f.path, fixtureDiff(f.path)])),
    ] as const,
  );
  return { files, hashes: fixtureRepo.commits.map((commit) => commit.hash) };
}

test('panel layout: arrow keys after clicking the file list move the file, not the commit', async ({
  page,
}) => {
  const { files } = await installPanelOrca(page);
  await page.goto('/');
  await expect(page.locator('.history[data-layout-kind="panel"]')).toHaveCount(
    1,
  );
  await expect(page.locator('.commit-row')).toHaveCount(6);
  await commitAt(page, 1).click();
  await expect(page.locator('.file-row')).toHaveCount(files.length);
  await page.locator('.file-row').nth(0).click();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('.file-row').nth(1)).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(selectedRow(page)).toHaveAttribute('data-index', '1');
  // 커밋 정보 영역을 누르면 방향키가 어느 목록도 움직이지 않는다.
  await page.locator('.details .section-heading').first().click();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('.file-row').nth(1)).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(selectedRow(page)).toHaveAttribute('data-index', '1');
  // 그래프 행을 누르면 다시 커밋이 움직인다.
  await commitAt(page, 1).click();
  await page.keyboard.press('ArrowDown');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '2');
});

test('panel layout: holding ArrowDown requests changes only for the commit it stops on', async ({
  page,
}) => {
  const { hashes } = await installPanelOrca(page);
  await page.goto('/');
  await expect(page.locator('.commit-row')).toHaveCount(6);
  await commitAt(page, 1).click();
  await expect(page.locator('.file-row').first()).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(selectedRow(page)).toHaveAttribute('data-index', '4');
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { __changes: string[] }).__changes,
      ),
    )
    .toContain(hashes[4]);
  const seen = await page.evaluate(
    () => (window as unknown as { __changes: string[] }).__changes,
  );
  expect(seen).not.toContain(hashes[2]);
  expect(seen).not.toContain(hashes[3]);
});
