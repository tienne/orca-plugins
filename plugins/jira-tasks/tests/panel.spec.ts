import { test, expect, type Page } from '@playwright/test';
import { connection, page as taskPage, task } from '../src/fixtures';
const image =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aemQAAAAASUVORK5CYII=';
const detail = {
  ...task,
  assigneeAvatarUrl:
    'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/demo/48',
  images: [{ alt: 'Demo checkout screenshot', src: image }],
  description:
    '[요약]\nCheckout summary.\n\n[테스트단말/환경]\n\n- Android tablet\n- Development environment\n\n[상세설명]\n\n[Open design](https://example.com/design)\n\n[[image:0]]\n\n[재현절차]\n\n1. Open checkout\n2. Choose a time\n\n[기대결과]\n\n- Checkout succeeds',
};
async function start(
  page: Page,
  options: {
    locale?: string;
    disconnected?: boolean;
    error?: boolean;
    theme?: 'light' | 'dark';
    statuses?: boolean;
    statusColors?: boolean;
    typeColors?: boolean;
    scopedLists?: boolean;
    multipleSites?: boolean;
    beyondLimit?: boolean;
    childrenFailureOnce?: boolean;
    childOptionsLimited?: boolean;
    avatarUnavailable?: boolean;
    refresh?: boolean;
    refreshFailure?: boolean;
    parent?: boolean;
    children?: 'populated' | 'filterable' | 'error';
  } = {},
) {
  await page.addInitScript(
    ({ connection, taskPage, detail, options, image }) => {
      const calls: string[] = [];
      const listSites: string[] = [];
      (window as unknown as { jiraListSites: string[] }).jiraListSites =
        listSites;
      (window as unknown as { jiraCalls: string[] }).jiraCalls = calls;
      (window as unknown as { orca: unknown }).orca = {
        locale: options.locale ?? 'ko-KR',
        shell: { openExternal: async () => ({ opened: true }) },
        plugin: {
          request: async (
            name: string,
            input?: {
              key?: string;
              filter?: string;
              siteId?: string;
              search?: string;
              statuses?: string[];
              assignees?: string[];
              includeOptions?: boolean;
            },
          ) => {
            calls.push(name);
            if (name === 'jira.list') listSites.push(input?.siteId ?? '');
            if (options.error) throw new Error('Connection failed');
            if (name === 'jira.avatar')
              return options.avatarUnavailable ? null : image;
            if (name === 'jira.connection')
              return options.disconnected
                ? { sites: [], selectedSiteId: null }
                : options.multipleSites
                  ? {
                      ...connection,
                      sites: [
                        ...connection.sites,
                        {
                          id: 'second-site',
                          siteUrl: 'https://second.atlassian.net',
                          email: 'second@example.com',
                        },
                      ],
                    }
                  : connection;
            if (name === 'jira.list' && options.typeColors)
              return {
                tasks: ['Bug', 'Task', 'Story', 'Epic', 'Sub-task'].map(
                  (name, i) => ({
                    ...detail,
                    key: `DEMO-${i + 1}`,
                    title: name,
                    issueType: { name, subtask: name === 'Sub-task' },
                  }),
                ),
                limitReached: false,
              };
            if (name === 'jira.list' && options.statusColors)
              return {
                tasks: [
                  'IN PROGRESS',
                  'IN QA',
                  'PR',
                  'HOLD',
                  'BLOCKED',
                  'DONE',
                  'BACKLOG',
                ].map((status, i) => ({
                  ...detail,
                  key: `DEMO-${i + 1}`,
                  title: status,
                  status,
                  category: status === 'DONE' ? 'done' : 'indeterminate',
                })),
                limitReached: false,
              };
            if (name === 'jira.list' && options.scopedLists) {
              if (input?.filter === 'reported')
                return {
                  tasks: [
                    { ...taskPage.tasks[0], status: 'Done', category: 'done' },
                  ],
                  limitReached: false,
                };
              if (input?.filter === 'done')
                return {
                  tasks: [
                    {
                      ...taskPage.tasks[0],
                      key: 'DEMO-104',
                      title: 'Completed reservation',
                      project: 'OTHER',
                      status: 'Done',
                      category: 'done',
                    },
                  ],
                  limitReached: false,
                };
              return taskPage;
            }
            if (name === 'jira.list')
              return options.statuses
                ? {
                    tasks: [
                      {
                        ...detail,
                        key: 'DEMO-1',
                        title: 'Todo issue',
                        category: 'new',
                        status: 'To do',
                      },
                      {
                        ...detail,
                        key: 'DEMO-2',
                        title: 'Progress issue',
                        category: 'indeterminate',
                        status: 'In progress',
                      },
                      {
                        ...detail,
                        key: 'DEMO-3',
                        title: 'Done issue',
                        category: 'done',
                        status: 'Done',
                      },
                      {
                        ...detail,
                        key: 'DEMO-4',
                        title: 'Custom issue',
                        category: 'custom',
                        status: 'Custom',
                      },
                    ],
                    limitReached: false,
                  }
                : taskPage;
            if (name === 'jira.children') {
              if (
                options.childrenFailureOnce &&
                calls.filter((call) => call === name).length === 1
              )
                throw new Error('Initial children unavailable');
              if (options.children === 'error')
                throw new Error('Children unavailable');
              let tasks =
                (options.children === 'populated' ||
                  options.children === 'filterable') &&
                input?.key === detail.key
                  ? [
                      {
                        ...detail,
                        key: 'DEMO-201',
                        title: 'Child task',
                        assignee: 'Alex',
                        assigneeId: 'alex-id',
                        status: 'Done',
                        category: 'done',
                      },
                      ...(options.children === 'filterable'
                        ? [
                            {
                              ...detail,
                              key: 'DEMO-202',
                              title: 'Booking followup',
                              assignee: 'Morgan',
                              assigneeId: 'morgan-id',
                              status: 'In progress',
                              category: 'indeterminate',
                            },
                            {
                              ...detail,
                              key: 'DEMO-203',
                              title: 'Confirm booking',
                              assignee: '',
                              assigneeId: '',
                              status: 'To do',
                              category: 'new',
                            },
                          ]
                        : []),
                    ]
                  : [];
              if (options.beyondLimit && input?.key === detail.key)
                tasks = [
                  ...Array.from({ length: 100 }, (_, i) => ({
                    ...detail,
                    key: `DEMO-${300 + i}`,
                    title: `Existing ticket ${i}`,
                    assignee: 'Alex',
                    assigneeId: 'alex-id',
                    status: 'Done',
                    category: 'done',
                  })),
                  {
                    ...detail,
                    key: 'DEMO-999',
                    title: 'Hidden matching ticket',
                    assignee: 'Taylor',
                    assigneeId: 'outside-id',
                    status: 'Blocked',
                    category: 'new',
                  },
                ];
              const all = tasks;
              tasks = tasks.filter(
                (task) =>
                  (!input?.statuses?.length ||
                    input.statuses.includes(task.status)) &&
                  (!input?.assignees?.length ||
                    input.assignees.includes(
                      task.assigneeId ? `id:${task.assigneeId}` : 'unassigned',
                    )) &&
                  (!input?.search ||
                    (/^[a-z][a-z0-9_]*-\d+$/i.test(input.search)
                      ? task.key === input.search.toUpperCase()
                      : task.title
                          .toLowerCase()
                          .includes(input.search.toLowerCase()))),
              );
              const people = new Map(
                all.map((task) => [
                  task.assigneeId ? `id:${task.assigneeId}` : 'unassigned',
                  task.assignee,
                ]),
              );
              return {
                tasks: tasks.slice(0, 100),
                limitReached: tasks.length >= 100,
                ...(input?.includeOptions
                  ? {
                      options: {
                        statuses: [...new Set(all.map((task) => task.status))],
                        assignees: [...people].map(([value, label]) => ({
                          value,
                          label,
                        })),
                        limited: options.childOptionsLimited ?? false,
                      },
                    }
                  : {}),
              };
            }
            if (name === 'jira.issue') {
              const count = calls.filter(
                (name) => name === 'jira.issue',
              ).length;
              if (options.refreshFailure && count === 2)
                throw new Error('Refresh failed');
              if (options.refresh && count > 1)
                return {
                  ...detail,
                  title: 'Updated checkout details',
                  status: 'Done',
                  category: 'done',
                };
              if (input?.key === 'DEMO-201')
                return {
                  ...detail,
                  key: 'DEMO-201',
                  title: 'Child task',
                  parent: {
                    key: detail.key,
                    title: detail.title,
                    issueTypeName: 'Story',
                  },
                };

              if (input?.key === 'DEMO-10')
                return {
                  ...detail,
                  key: 'DEMO-10',
                  title: 'Checkout improvements',
                  parent: null,
                };
              return options.parent
                ? {
                    ...detail,
                    parent: {
                      key: 'DEMO-10',
                      title: 'Checkout improvements',
                      issueTypeName: 'Story',
                    },
                  }
                : detail;
            }
            throw new Error('Unknown request');
          },
        },
      };
      document.addEventListener('DOMContentLoaded', () => {
        const colors =
          options.theme === 'light'
            ? {
                background: '#ffffff',
                foreground: '#202020',
                card: '#f8f8f8',
                border: '#dddddd',
                muted: '#eeeeee',
                primary: '#2864cc',
                'muted-foreground': '#666666',
              }
            : {
                background: '#181818',
                foreground: '#eeeeee',
                card: '#202020',
                border: '#383838',
                muted: '#252525',
                primary: '#91b9ff',
                'muted-foreground': '#a0a0a0',
              };
        for (const [key, value] of Object.entries(colors))
          document.documentElement.style.setProperty(`--orca-${key}`, value);
      });
    },
    { connection, taskPage, detail, options, image },
  );
  await page.goto('/');
}
test('filters loaded issues and opens the Jira-shaped detail', async ({
  page,
}) => {
  await start(page);
  await expect(page.getByLabel('Jira 사이트')).toHaveCount(0);
  await page.getByLabel('불러온 티켓 검색').fill('DEMO-101');
  await expect(
    page.getByRole('button', { name: 'Fix reservation search', exact: true }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: task.title, exact: true }).click();
  await expect(
    page.getByRole('heading', { name: '요약', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: '재현절차', exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel('Jira 사이트')).toHaveCount(0);
  const spacing = await page
    .locator('.description section')
    .nth(1)
    .evaluate((node) => ({
      padding: parseFloat(getComputedStyle(node).paddingTop),
      margin: parseFloat(getComputedStyle(node).marginTop),
    }));
  expect(spacing.padding + spacing.margin).toBeGreaterThanOrEqual(56);
  await page.getByRole('button', { name: '목록으로' }).click();
  await expect(page.getByLabel('불러온 티켓 검색')).toHaveValue('DEMO-101');
});
test('shows inline attachment and enlarges it inside the panel', async ({
  page,
}) => {
  await start(page);
  await page.getByRole('button', { name: task.title, exact: true }).click();
  const preview = page.locator('figure img');
  await expect(preview).toBeVisible();
  await expect
    .poll(() => preview.evaluate((node: HTMLImageElement) => node.naturalWidth))
    .toBeGreaterThan(0);
  await page
    .getByRole('button', {
      name: '이미지 확대: Demo checkout screenshot',
      exact: true,
    })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: '닫기', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
for (const theme of ['light', 'dark'] as const)
  test(`inherits ${theme} Orca theme colors`, async ({ page }) => {
    await start(page, { theme });
    await page.getByRole('button', { name: task.title, exact: true }).click();
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(24, 24, 24)',
    );
    await page.screenshot({
      path: `/tmp/jira-tasks-detail-demo-${theme}.jpg`,
      type: 'jpeg',
      quality: 80,
      fullPage: true,
    });
  });
test('shows connection guidance and lookup failures', async ({ page }) => {
  await start(page, { disconnected: true });
  await expect(
    page.getByText('Orca에서 Jira를 연결해 주세요', { exact: true }),
  ).toBeVisible();
});
test('shows lookup errors without rendering issue markup as HTML', async ({
  page,
}) => {
  await start(page, { error: true });
  await expect(
    page.getByText('Jira 작업을 불러오지 못했습니다', { exact: true }),
  ).toBeVisible();
});

for (const theme of ['light', 'dark'] as const)
  test(`distinguishes Jira categories in list and detail in ${theme} theme`, async ({
    page,
  }) => {
    await start(page, { theme, statuses: true });
    const badges = page.locator('.task-list .status-badge');
    await expect(badges).toHaveCount(4);
    const categories = await badges.evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLElement).dataset.category),
    );
    expect(categories).toEqual(['todo', 'progress', 'done', 'todo']);
    const colors = await badges.evaluateAll((nodes) =>
      nodes.map((node) => getComputedStyle(node).backgroundColor),
    );
    expect(new Set(colors.slice(0, 3)).size).toBe(3);
    await page
      .getByRole('button', { name: 'Progress issue', exact: true })
      .click();
    await expect(page.locator('.issue-meta .status-badge')).toHaveAttribute(
      'data-category',
      'progress',
    );
    await expect(page.locator('.issue-meta .status-badge')).toHaveText(
      'In progress',
    );
  });

test('shows the parent issue and opens its detail in the sidebar', async ({
  page,
}) => {
  await start(page, { parent: true });
  await page.getByRole('button', { name: task.title, exact: true }).click();
  const parent = page.getByRole('button', {
    name: '상위 항목: DEMO-10 Checkout improvements',
    exact: true,
  });
  await expect(parent).toBeVisible();
  await expect(parent).toContainText('Story');
  await parent.click();
  await expect(
    page.getByRole('heading', { name: 'Checkout improvements', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('상위 항목 없음', { exact: true })).toBeVisible();
  await expect(page.locator('.parent-link')).toHaveCount(0);
});

test('shows child issue statuses and opens a selected child', async ({
  page,
}) => {
  await start(page, { children: 'populated' });
  await page.getByRole('button', { name: task.title, exact: true }).click();
  const children = page.locator('#child-issues');
  await expect(
    children.getByRole('heading', { name: '하위 항목', exact: true }),
  ).toBeVisible();
  await expect(children.locator('.status-badge')).toHaveAttribute(
    'data-category',
    'done',
  );
  await children
    .getByRole('button', { name: 'DEMO-201 Child task', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Child task', exact: true }),
  ).toBeVisible();
  await expect(page.locator('#child-issues')).toContainText(
    '조회 조건에 맞는 하위 티켓이 없습니다.',
  );
  await expect(page.locator('.child-row')).toHaveCount(0);
});
test('keeps the description readable if child lookup fails', async ({
  page,
}) => {
  await start(page, { children: 'error' });
  await page.getByRole('button', { name: task.title, exact: true }).click();
  await expect(page.locator('#child-issues')).toContainText(
    '하위 항목을 불러오지 못했습니다',
  );
  await expect(
    page.getByRole('heading', { name: '요약', exact: true }),
  ).toBeVisible();
});

test('applies child query conditions on Search or Enter and keeps selected statuses', async ({
  page,
}) => {
  await start(page, { children: 'filterable' });
  await page.getByRole('button', { name: task.title, exact: true }).click();
  const children = page.locator('#child-issues');
  await children.getByLabel('하위 티켓 상태').click();
  await children.getByRole('checkbox', { name: 'Done', exact: true }).check();
  await children
    .getByRole('checkbox', { name: 'In progress', exact: true })
    .check();
  await expect(children.locator('.child-row')).toHaveCount(3);
  await children.getByRole('button', { name: '조회', exact: true }).click();
  await expect(children.locator('.child-row')).toHaveCount(2);
  await expect(children.getByLabel('하위 티켓 상태')).toContainText('Done');
  await expect(children.getByLabel('하위 티켓 상태')).toContainText(
    'In progress',
  );
  await children.getByLabel('하위 티켓 검색').fill('DEMO-202');
  await expect(children.locator('.child-row')).toHaveCount(2);
  await children.getByLabel('하위 티켓 검색').press('Enter');
  await expect(children.locator('.child-row')).toHaveCount(1);
  await expect(children.locator('.child-row')).toContainText('DEMO-202');
  await children
    .getByRole('button', { name: '조건 초기화', exact: true })
    .click();
  await expect(children.locator('.child-row')).toHaveCount(3);
  await expect(children.getByLabel('하위 티켓 검색')).toHaveValue('');
});
test('combines assignees and status in server queries and keeps controls after an empty result', async ({
  page,
}) => {
  await start(page, { children: 'filterable' });
  await page.getByRole('button', { name: task.title, exact: true }).click();
  const children = page.locator('#child-issues');
  await children.getByLabel('하위 티켓 담당자').click();
  await children.getByRole('checkbox', { name: 'Alex', exact: true }).check();
  await children.getByRole('checkbox', { name: 'Morgan', exact: true }).check();
  await children.getByLabel('하위 티켓 상태').click();
  await children
    .getByRole('checkbox', { name: 'In progress', exact: true })
    .check();
  await children.getByLabel('하위 티켓 검색').fill('booking');
  await children.getByRole('button', { name: '조회', exact: true }).click();
  await expect(children.locator('.child-row')).toHaveCount(1);
  await expect(children.locator('.child-row')).toContainText('Morgan');
  await expect(children.getByLabel('하위 티켓 담당자')).toHaveText(
    'Alex, Morgan',
  );
  await children.getByLabel('하위 티켓 검색').fill('nothing matches');
  await children.getByRole('button', { name: '조회', exact: true }).click();
  await expect(children.locator('.child-row')).toHaveCount(0);
  await expect(children).toContainText(
    '조회 조건에 맞는 하위 티켓이 없습니다.',
  );
  await expect(children.getByLabel('하위 티켓 담당자')).toHaveText(
    'Alex, Morgan',
  );
  await children
    .getByRole('button', { name: '조건 초기화', exact: true })
    .click();
  await children.getByLabel('하위 티켓 담당자').click();
  await children.getByRole('checkbox', { name: '미지정', exact: true }).check();
  await children.getByRole('button', { name: '조회', exact: true }).click();
  await expect(children.locator('.child-row')).toHaveCount(1);
  await expect(children.locator('.child-row')).toContainText('DEMO-203');
});
test('queries a ticket outside the original 100 using complete assignee and status choices', async ({
  page,
}) => {
  await start(page, { beyondLimit: true });
  await page.getByRole('button', { name: task.title, exact: true }).click();
  const children = page.locator('#child-issues');
  await expect(children.locator('.child-row')).toHaveCount(100);
  await expect(
    children.getByRole('button', {
      name: 'DEMO-999 Hidden matching ticket',
      exact: true,
    }),
  ).toHaveCount(0);
  await children.getByLabel('하위 티켓 담당자').click();
  await children.getByRole('checkbox', { name: 'Taylor', exact: true }).check();
  await children.getByLabel('하위 티켓 상태').click();
  await children
    .getByRole('checkbox', { name: 'Blocked', exact: true })
    .check();
  await children.getByLabel('하위 티켓 검색').fill('DEMO-999');
  await children.getByRole('button', { name: '조회', exact: true }).click();
  await expect(children.locator('.child-row')).toHaveCount(1);
  await expect(
    children.getByRole('button', {
      name: 'DEMO-999 Hidden matching ticket',
      exact: true,
    }),
  ).toBeVisible();
});
test('shows assignee names with profile photos on detail and child rows', async ({
  page,
}) => {
  await start(page, { children: 'filterable' });
  await page.getByRole('button', { name: task.title, exact: true }).click();
  await expect(page.locator('.properties .assignee-name')).toHaveText('Alex');
  await expect(page.locator('.properties .assignee-avatar img')).toHaveCount(1);
  const child = page.getByRole('button', {
    name: 'DEMO-201 Child task',
    exact: true,
  });
  await expect(child.locator('.child-assignee')).toContainText('담당자');
  await expect(child.locator('.assignee-name')).toHaveText('Alex');
  await expect(child.locator('.assignee-avatar img')).toHaveCount(1);
  await expect(
    page
      .getByRole('button', { name: 'DEMO-203 Confirm booking', exact: true })
      .locator('.assignee-name'),
  ).toHaveText('미지정');
});
test('keeps initials and name visible if the profile photo is unavailable', async ({
  page,
}) => {
  await start(page, { avatarUnavailable: true });
  await page.getByRole('button', { name: task.title, exact: true }).click();
  await expect(page.locator('.properties .assignee-name')).toHaveText('Alex');
  await expect(page.locator('.properties .assignee-avatar')).toHaveText('Al');
  await expect(page.locator('.properties .assignee-avatar img')).toHaveCount(0);
});

test('shows photos and assignee names in the main list, including unassigned and filtered rows', async ({
  page,
}) => {
  await start(page);
  const row = page.getByRole('button', { name: task.title, exact: true });
  await expect(row.locator('.list-assignee .assignee-name')).toHaveText('Alex');
  await expect(row.locator('.list-assignee .assignee-avatar img')).toHaveCount(
    1,
  );
  await page.screenshot({
    path: '/tmp/jira-compact-header-narrow.jpg',
    type: 'jpeg',
    quality: 80,
  });
  await page.setViewportSize({ width: 555, height: 972 });
  await page.screenshot({
    path: '/tmp/jira-compact-header-wide.jpg',
    type: 'jpeg',
    quality: 80,
  });
  await page.setViewportSize({ width: 368, height: 972 });
  const unassigned = page.getByRole('button', {
    name: 'Fix reservation search',
    exact: true,
  });
  await expect(unassigned.locator('.assignee-name')).toHaveText('미지정');
  await expect(unassigned.locator('.assignee-avatar img')).toHaveCount(0);
  await page.getByLabel('불러온 티켓 검색').fill('DEMO-101');
  await expect(page.locator('.task-row')).toHaveCount(1);
  await expect(row.locator('.assignee-avatar img')).toHaveCount(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('refreshes detail and children while preserving child search, status and assignees', async ({
  page,
}) => {
  await start(page, { children: 'filterable', refresh: true });
  await page.getByRole('button', { name: task.title, exact: true }).click();
  const children = page.locator('#child-issues');
  await children.getByLabel('하위 티켓 검색').fill('booking');
  await children.getByLabel('하위 티켓 상태').click();
  await children
    .getByRole('checkbox', { name: 'In progress', exact: true })
    .check();
  await children.getByLabel('하위 티켓 담당자').click();
  await children.getByRole('checkbox', { name: 'Morgan', exact: true }).check();
  await page.getByRole('button', { name: '새로고침', exact: true }).click();
  await expect(
    page.getByRole('heading', {
      name: 'Updated checkout details',
      exact: true,
    }),
  ).toBeVisible();
  await expect(children.getByLabel('하위 티켓 검색')).toHaveValue('booking');
  await expect(children.getByLabel('하위 티켓 상태')).toHaveText('In progress');
  await expect(children.getByLabel('하위 티켓 담당자')).toHaveText('Morgan');
  await expect(children.locator('.child-row')).toHaveCount(1);
  await expect(children.locator('.child-row')).toContainText('DEMO-202');
  const counts = await page.evaluate(() => {
    const calls = (window as unknown as { jiraCalls: string[] }).jiraCalls;
    return {
      issues: calls.filter((name) => name === 'jira.issue').length,
      children: calls.filter((name) => name === 'jira.children').length,
    };
  });
  expect(counts).toEqual({ issues: 2, children: 2 });
});
test('can retry a failed detail refresh without leaving the issue or losing search', async ({
  page,
}) => {
  await start(page, { children: 'filterable', refreshFailure: true });
  await page.getByRole('button', { name: task.title, exact: true }).click();
  await page.getByLabel('하위 티켓 검색').fill('DEMO-202');
  await page.getByRole('button', { name: '새로고침', exact: true }).click();
  await expect(
    page.getByText('티켓 상세를 불러오지 못했습니다', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: '다시 시도', exact: true }).click();
  await expect(page.getByLabel('하위 티켓 검색')).toHaveValue('DEMO-202');
  await expect(page.locator('.child-row')).toHaveCount(1);
  await expect(
    page.getByRole('heading', { name: task.title, exact: true }),
  ).toBeVisible();
});

test('keeps search, project and status when changing to a scope that still contains them', async ({
  page,
}) => {
  await start(page, { scopedLists: true });
  await page.getByLabel('불러온 티켓 검색').fill('DEMO-10');
  await page.getByLabel('프로젝트', { exact: true }).selectOption('DEMO');
  await page.getByLabel('상태', { exact: true }).selectOption('In progress');
  await page.getByRole('button', { name: '전체 티켓', exact: true }).click();
  await expect(page.getByLabel('불러온 티켓 검색')).toHaveValue('DEMO-10');
  await expect(page.getByLabel('프로젝트', { exact: true })).toHaveValue(
    'DEMO',
  );
  await expect(page.getByLabel('상태', { exact: true })).toHaveValue(
    'In progress',
  );
  await expect(page.locator('.task-row')).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: task.title, exact: true }),
  ).toBeVisible();
});
test('clears only project or status values missing from the new scope and keeps search', async ({
  page,
}) => {
  await start(page, { scopedLists: true });
  await page.getByLabel('불러온 티켓 검색').fill('DEMO-10');
  await page.getByLabel('프로젝트', { exact: true }).selectOption('DEMO');
  await page.getByLabel('상태', { exact: true }).selectOption('In progress');
  await page.getByRole('button', { name: '내가 등록', exact: true }).click();
  await expect(page.getByLabel('프로젝트', { exact: true })).toHaveValue(
    'DEMO',
  );
  await expect(page.getByLabel('상태', { exact: true })).toHaveValue('');
  await expect(page.getByLabel('불러온 티켓 검색')).toHaveValue('DEMO-10');
  await page.getByLabel('상태', { exact: true }).selectOption('Done');
  await page.getByRole('button', { name: '완료', exact: true }).click();
  await expect(page.getByLabel('프로젝트', { exact: true })).toHaveValue('');
  await expect(page.getByLabel('상태', { exact: true })).toHaveValue('Done');
  await expect(page.getByLabel('불러온 티켓 검색')).toHaveValue('DEMO-10');
  await expect(page.locator('.task-row')).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: 'Completed reservation', exact: true }),
  ).toBeVisible();
});

test('shows site choice for multiple connections and switches the lookup site', async ({
  page,
}) => {
  await start(page, { multipleSites: true });
  await expect(page.getByLabel('Jira 사이트')).toHaveValue('demo-site');
  await page.getByLabel('불러온 티켓 검색').fill('DEMO-101');
  await page.getByLabel('프로젝트', { exact: true }).selectOption('DEMO');
  await page.getByLabel('Jira 사이트').selectOption('second-site');
  await expect(page.getByLabel('Jira 사이트')).toHaveValue('second-site');
  await expect(
    page.getByRole('button', { name: '내 담당', exact: true }),
  ).toBeEnabled();
  await expect(page.getByLabel('불러온 티켓 검색')).toHaveValue('');
  await expect(page.getByLabel('프로젝트', { exact: true })).toHaveValue('');
  const sites = await page.evaluate(
    () => (window as unknown as { jiraListSites: string[] }).jiraListSites,
  );
  expect(sites.at(-1)).toBe('second-site');
});

async function gateChildRequests(page: Page, key: string, count: number) {
  await page.evaluate(
    ({ key, count }) => {
      const state = window as unknown as {
        orca: {
          plugin: {
            request: (
              name: string,
              input?: { key?: string },
              options?: unknown,
            ) => Promise<unknown>;
          };
        };
        jiraChildReleases: (() => void)[];
      };
      const original = state.orca.plugin.request;
      state.jiraChildReleases = [];
      let remaining = count;
      state.orca.plugin.request = async (name, input, options) => {
        const result = await original(name, input, options);
        if (name === 'jira.children' && input?.key === key && remaining-- > 0)
          await new Promise<void>((resolve) =>
            state.jiraChildReleases.push(resolve),
          );
        return result;
      };
    },
    { key, count },
  );
}
async function releaseChildRequest(page: Page, index: number) {
  await page.evaluate((index) => {
    (
      window as unknown as { jiraChildReleases: (() => void)[] }
    ).jiraChildReleases[index]();
  }, index);
}

test('retries initial option discovery and retains limited choices after another query', async ({
  page,
}) => {
  await start(page, {
    beyondLimit: true,
    childrenFailureOnce: true,
    childOptionsLimited: true,
  });
  await page.getByRole('button', { name: task.title, exact: true }).click();
  const children = page.locator('#child-issues');
  await expect(children.getByRole('status')).toContainText(
    '하위 항목을 불러오지 못했습니다',
  );
  await children
    .getByRole('button', { name: '다시 시도', exact: true })
    .click();
  await expect(children.locator('.child-row')).toHaveCount(100);
  await children.getByLabel('하위 티켓 담당자').click();
  await children.getByRole('checkbox', { name: 'Taylor', exact: true }).check();
  await children.getByRole('button', { name: '조회', exact: true }).click();
  await expect(children.locator('.child-row')).toHaveCount(1);
  await expect(children).toContainText('선택 항목을 일부만 불러왔습니다.');
  await expect(children.getByRole('status')).toContainText('1');
});

test('restarts unfinished option discovery when returning to a detail', async ({
  page,
}) => {
  await start(page, { beyondLimit: true, parent: true });
  await gateChildRequests(page, task.key, 1);
  await page.getByRole('button', { name: task.title, exact: true }).click();
  await expect(page.locator('#child-issues').getByRole('status')).toContainText(
    '불러오는 중',
  );
  await page.locator('.parent-link').click();
  await expect(
    page.getByRole('heading', { name: 'Checkout improvements', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: '‹ 뒤로가기', exact: true }).click();
  const children = page.locator('#child-issues');
  await expect(children.locator('.child-row')).toHaveCount(100);
  await children.getByLabel('하위 티켓 담당자').click();
  await expect(
    children.getByRole('checkbox', { name: 'Taylor', exact: true }),
  ).toBeVisible();
  await children.getByLabel('하위 티켓 상태').click();
  await expect(
    children.getByRole('checkbox', { name: 'Blocked', exact: true }),
  ).toBeVisible();
  await releaseChildRequest(page, 0);
  await expect(children.locator('.child-row')).toHaveCount(100);
});

test('keeps query input focus and selection through loading, then keeps the apply button focused', async ({
  page,
}) => {
  await start(page, { children: 'filterable' });
  await page.getByRole('button', { name: task.title, exact: true }).click();
  const children = page.locator('#child-issues');
  await expect(children.locator('.child-row')).toHaveCount(3);
  await gateChildRequests(page, task.key, 1);
  const input = children.getByLabel('하위 티켓 검색');
  await input.fill('DEMO-201');
  await input.evaluate((node: HTMLInputElement) =>
    node.setSelectionRange(2, 6, 'backward'),
  );
  await input.press('Enter');
  await expect(children.getByRole('status')).toContainText('불러오는 중');
  await expect(input).toBeFocused();
  await expect
    .poll(() =>
      input.evaluate((node: HTMLInputElement) => [
        node.selectionStart,
        node.selectionEnd,
        node.selectionDirection,
      ]),
    )
    .toEqual([2, 6, 'backward']);
  await releaseChildRequest(page, 0);
  await expect(children.locator('.child-row')).toHaveCount(1);
  await expect(input).toBeFocused();
  expect(
    await input.evaluate((node: HTMLInputElement) => [
      node.selectionStart,
      node.selectionEnd,
      node.selectionDirection,
    ]),
  ).toEqual([2, 6, 'backward']);
  const apply = children.getByRole('button', { name: '조회', exact: true });
  await apply.click();
  await expect(children.getByRole('status')).toContainText('1');
  await expect(apply).toBeFocused();
});

for (const filter of ['하위 티켓 상태', '하위 티켓 담당자'])
  test(`keeps an open ${filter} picker and checkbox focus when a query finishes`, async ({
    page,
  }) => {
    await start(page, { children: 'filterable' });
    await page.getByRole('button', { name: task.title, exact: true }).click();
    const children = page.locator('#child-issues');
    await expect(children.locator('.child-row')).toHaveCount(3);
    await gateChildRequests(page, task.key, 1);
    await children.getByRole('button', { name: '조회', exact: true }).click();
    await expect(children.getByRole('status')).toContainText('불러오는 중');
    const summary = children.getByLabel(filter, { exact: true });
    await summary.click();
    const picker = summary.locator('..');
    const checkbox = picker.getByRole('checkbox').first();
    await checkbox.check();
    await expect(checkbox).toBeFocused();
    await releaseChildRequest(page, 0);
    await expect(children.locator('.child-row')).toHaveCount(3);
    await expect(picker).toHaveAttribute('open', '');
    await expect(checkbox).toBeChecked();
    await expect(checkbox).toBeFocused();
  });

test('ignores queued and late back-navigation scroll restoration after opening another detail', async ({
  page,
}) => {
  await start(page, { beyondLimit: true, parent: true });
  await gateChildRequests(page, task.key, 2);
  await page.getByRole('button', { name: task.title, exact: true }).click();
  await expect(page.locator('#child-issues').getByRole('status')).toContainText(
    '불러오는 중',
  );
  await page.locator('.parent-link').click();
  await expect(
    page.getByRole('heading', { name: 'Checkout improvements', exact: true }),
  ).toBeVisible();
  await page.evaluate(() => {
    const state = window as unknown as {
      jiraFrames: FrameRequestCallback[];
      jiraScrolls: number[];
    };
    state.jiraFrames = [];
    state.jiraScrolls = [];
    window.requestAnimationFrame = (callback) =>
      state.jiraFrames.push(callback);
    window.scrollTo = (x?: number | ScrollToOptions, y?: number): void => {
      state.jiraScrolls.push(typeof x === 'number' ? (y ?? 0) : (x?.top ?? 0));
    };
  });
  await page.getByRole('button', { name: '‹ 뒤로가기', exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { jiraChildReleases: unknown[] })
            .jiraChildReleases.length,
      ),
    )
    .toBe(2);
  await page.getByRole('button', { name: '목록으로', exact: true }).click();
  await page.getByRole('button', { name: task.title, exact: true }).click();
  await expect(page.locator('.child-row')).toHaveCount(100);
  await page.evaluate(() => {
    (window as unknown as { jiraScrolls: number[] }).jiraScrolls.length = 0;
  });
  await releaseChildRequest(page, 1);
  await releaseChildRequest(page, 0);
  // 취소된 요청의 후속 microtask까지 비운 뒤 예약된 화면 복원을 실행한다.
  await page.evaluate(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    const state = window as unknown as { jiraFrames: FrameRequestCallback[] };
    for (const callback of state.jiraFrames.splice(0))
      callback(performance.now());
  });
  expect(
    await page.evaluate(
      () => (window as unknown as { jiraScrolls: number[] }).jiraScrolls,
    ),
  ).toEqual([]);
});

test('goes back from a child to the previous detail with filters and scroll restored, then back to list', async ({
  page,
}) => {
  await start(page, { children: 'filterable' });
  await page.getByLabel('불러온 티켓 검색').fill('DEMO-101');
  await page.getByRole('button', { name: task.title, exact: true }).click();
  const children = page.locator('#child-issues');
  await children.getByLabel('하위 티켓 검색').fill('DEMO-201');
  await children.getByLabel('하위 티켓 상태').click();
  await children.getByRole('checkbox', { name: 'Done', exact: true }).check();
  await children.getByLabel('하위 티켓 담당자').click();
  await children.getByRole('checkbox', { name: 'Alex', exact: true }).check();
  await page.getByRole('button', { name: '새로고침', exact: true }).click();
  await expect(children.locator('.child-row')).toHaveCount(1);
  await page.evaluate(() => window.scrollTo(0, 120));
  const scrollY = await page.evaluate(() => window.scrollY);
  await children
    .getByRole('button', { name: 'DEMO-201 Child task', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Child task', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: '‹ 뒤로가기', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: task.title, exact: true }),
  ).toBeVisible();
  await expect(children.getByLabel('하위 티켓 검색')).toHaveValue('DEMO-201');
  await expect(children.getByLabel('하위 티켓 상태')).toHaveText('Done');
  await expect(children.getByLabel('하위 티켓 담당자')).toHaveText('Alex');
  await expect(children.locator('.child-row')).toHaveCount(1);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrollY);
  const issueCalls = await page.evaluate(
    () =>
      (window as unknown as { jiraCalls: string[] }).jiraCalls.filter(
        (name) => name === 'jira.issue',
      ).length,
  );
  expect(issueCalls).toBe(3);
  await page.getByRole('button', { name: '‹ 뒤로가기', exact: true }).click();
  await expect(page.getByLabel('불러온 티켓 검색')).toHaveValue('DEMO-101');
  await expect(
    page.getByRole('button', { name: '‹ 뒤로가기', exact: true }),
  ).toHaveCount(0);
});
test('returns directly to the list from nested detail and clears the old navigation history', async ({
  page,
}) => {
  await start(page, { children: 'populated' });
  await page.getByRole('button', { name: task.title, exact: true }).click();
  await page
    .getByRole('button', { name: 'DEMO-201 Child task', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Child task', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: '목록으로', exact: true }).click();
  await expect(page.getByLabel('불러온 티켓 검색')).toBeVisible();
  await page.getByRole('button', { name: task.title, exact: true }).click();
  await page.getByRole('button', { name: '‹ 뒤로가기', exact: true }).click();
  await expect(page.getByLabel('불러온 티켓 검색')).toBeVisible();
});

for (const theme of ['light', 'dark'] as const)
  test(`uses distinct workflow status text colors in ${theme} theme`, async ({
    page,
  }) => {
    await start(page, { theme, statusColors: true });
    const badges = page.locator('.task-list .status-badge');
    await expect(badges).toHaveCount(7);
    const colors = await badges.evaluateAll((nodes) =>
      nodes.map((node) => getComputedStyle(node).color),
    );
    expect(new Set(colors).size).toBe(7);
    const progressColor = await page
      .getByRole('button', { name: 'IN PROGRESS', exact: true })
      .locator('.status-badge')
      .evaluate((node) => getComputedStyle(node).color);
    await page
      .getByRole('button', { name: 'IN PROGRESS', exact: true })
      .click();
    await expect(page.locator('.issue-meta .status-badge')).toHaveCSS(
      'color',
      progressColor,
    );
  });

for (const theme of ['light', 'dark'] as const)
  test(`shows distinct issue type colors independently of status in ${theme} theme`, async ({
    page,
  }) => {
    await start(page, { theme, typeColors: true });
    const types = page.locator('.task-list .issue-type-badge');
    await expect(types).toHaveCount(5);
    const colors = await types.evaluateAll((nodes) =>
      nodes.map((node) => getComputedStyle(node).color),
    );
    expect(new Set(colors).size).toBe(5);
    const statusColors = await page
      .locator('.task-list .status-badge')
      .evaluateAll((nodes) =>
        nodes.map((node) => getComputedStyle(node).color),
      );
    expect(new Set(statusColors).size).toBe(1);
    await page.getByRole('button', { name: 'Story', exact: true }).click();
    await expect(page.locator('.issue-meta .issue-type-badge')).toHaveAttribute(
      'aria-label',
      '티켓 유형: Story',
    );
  });

test('shows reporter separately from assignee with a profile photo', async ({
  page,
}) => {
  await start(page);
  await page.getByRole('button', { name: task.title, exact: true }).click();
  await expect(
    page.locator('.properties').getByText('보고자', { exact: true }),
  ).toBeVisible();
  await expect(page.locator('.properties .reporter-name')).toHaveText('Casey');
  await expect(page.locator('.properties .reporter-avatar img')).toHaveCount(1);
  await expect(page.locator('.properties .assignee-name')).toHaveText('Alex');
});
test('keeps the reporter name and initials when its photo cannot load', async ({
  page,
}) => {
  await start(page, { avatarUnavailable: true });
  await page.getByRole('button', { name: task.title, exact: true }).click();
  await expect(page.locator('.properties .reporter-name')).toHaveText('Casey');
  await expect(page.locator('.properties .reporter-avatar')).toHaveText('Ca');
});

for (const locale of ['ko', 'ko-KR', 'en-US', 'ja-JP', 'de-DE']) {
  test(`uses Korean only for Korean Orca locale: ${locale}`, async ({
    page,
  }) => {
    await start(page, { locale });
    const korean = locale === 'ko' || locale === 'ko-KR';
    await expect(page.locator('html')).toHaveAttribute(
      'lang',
      korean ? 'ko-KR' : 'en-US',
    );
    await expect(
      page.getByRole('button', {
        name: korean ? '내 담당' : 'Assigned to me',
        exact: true,
      }),
    ).toBeVisible();
    await page.getByRole('button', { name: task.title, exact: true }).click();
    await expect(
      page
        .locator('.properties dt')
        .filter({ hasText: korean ? /^보고자$/ : /^Reporter$/ }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', {
        name: korean ? '목록으로' : 'Issue list',
        exact: true,
      }),
    ).toBeVisible();
    if (!korean)
      await expect(page.locator('.properties dd').last()).toContainText(
        '11/14/2026',
      );
  });
}

for (const locale of ['ko-KR', 'ja-JP']) {
  for (const failure of ['list', 'detail', 'children'] as const) {
    test(`localizes ${failure} failures without raw worker diagnostics for ${locale}`, async ({
      page,
    }) => {
      const korean = locale === 'ko-KR';
      await start(page, {
        locale,
        error: failure === 'list',
        refreshFailure: failure === 'detail',
        children: failure === 'children' ? 'error' : undefined,
      });
      if (failure !== 'list') {
        await page
          .getByRole('button', { name: task.title, exact: true })
          .click();
        if (failure === 'detail') {
          await expect(page.locator('.issue-title')).toBeVisible();
          await page
            .getByRole('button', {
              name: korean ? '새로고침' : 'Refresh',
              exact: true,
            })
            .click();
        }
      }
      const messages = korean
        ? {
            list: 'Jira 작업을 불러오지 못했습니다',
            detail: '티켓 상세를 불러오지 못했습니다',
            children: '하위 항목을 불러오지 못했습니다',
          }
        : {
            list: 'Could not load Jira',
            detail: 'Could not load issue details',
            children: 'Could not load child issues',
          };
      await expect(page.locator('.error')).toHaveText(messages[failure]);
      await expect(page.locator('body')).not.toContainText(
        /Connection failed|Refresh failed|Children unavailable/,
      );
      if (failure !== 'list')
        await expect(
          page.getByRole('button', {
            name: korean ? '다시 시도' : 'Retry',
            exact: true,
          }),
        ).toBeVisible();
      if (failure === 'children')
        await expect(page.getByRole('status')).toHaveText(messages.children);
    });
  }
}
