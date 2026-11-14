import { assert, test } from 'orca/testing';
import { createJiraClient, normalizeTask } from './jira';

test('uses only read commands, pins local site, and omits list descriptions', async () => {
  const calls: string[][] = [];
  const client = createJiraClient(async (args) => {
    calls.push(args);
    if (args[0] === 'connection')
      return {
        sites: [
          {
            id: 'site-a',
            siteUrl: 'https://demo.atlassian.net',
            email: 'demo@example.com',
          },
        ],
        selectedSiteId: 'site-a',
      };
    return [
      { key: 'DEMO-1', title: 'Demo', description: 'private long description' },
    ];
  });
  assert.equal((await client.connection()).selectedSiteId, 'site-a');
  const page = await client.list({ siteId: 'site-a', filter: 'assigned' });
  assert.equal(page.tasks[0].description, '');
  assert.deepEqual(calls[1], [
    'list',
    '--site',
    'site-a',
    '--filter',
    'assigned',
    '--limit',
    '100',
  ]);
});
test('rejects malformed sites, filters and issue keys before invoking CLI', async () => {
  let calls = 0;
  const client = createJiraClient(async () => {
    calls++;
    return [];
  });
  await assert.rejects(() =>
    client.list({ siteId: '--environment', filter: 'assigned' }),
  );
  await assert.rejects(() =>
    client.list({ siteId: 'valid', filter: 'create' as 'all' }),
  );
  await assert.rejects(() => client.issue({ siteId: 'valid', key: '--help' }));
  await assert.rejects(() =>
    client.issue({ siteId: 'valid', key: 'DEMO-1; rm' }),
  );
  assert.equal(calls, 0);
});
test('bounds large issue descriptions and refuses unsafe issue links', () => {
  const task = normalizeTask(
    {
      key: 'DEMO-1',
      description: '가'.repeat(500000),
      url: 'javascript:alert(1)',
    },
    true,
  );
  assert.equal(task.description.length, 24000);
  assert.equal(task.descriptionTruncated, true);
  assert.equal(task.url, '');
});
test('reports the loaded-list limit and rejects malformed answers', async () => {
  const client = createJiraClient(async () =>
    Array.from({ length: 100 }, () => ({ key: 'DEMO-1' })),
  );
  assert.equal(
    (await client.list({ siteId: 'valid', filter: 'assigned' })).limitReached,
    true,
  );
  const invalid = createJiraClient(async () => ({ tasks: [] }));
  await assert.rejects(() => invalid.list({ siteId: 'valid', filter: 'all' }));
});

test('removes embedded images before truncating so the following paragraphs remain readable', () => {
  const description = `## Summary\n\nFirst paragraph.\n\n![Screenshot](data:image/png;base64,${'A'.repeat(200000)})\n\n## Steps\n\n- Open checkout\n- Select a time\n\n[Design](https://example.com/design)`;
  const task = normalizeTask({ key: 'DEMO-1', description }, true);
  assert.ok(task.description.includes('## Steps'));
  assert.ok(task.description.includes('- Select a time'));
  assert.ok(task.description.includes('[Design](https://example.com/design)'));
  assert.ok(task.description.includes('[[image:0]]'));
  assert.equal(task.images?.[0].alt, 'Screenshot');
  assert.ok(task.images?.[0].src.startsWith('data:image/png;base64,'));
  assert.equal(task.description.includes('data:image'), false);
  assert.equal(task.descriptionTruncated, false);
});

test('preserves parent key, title and type and ignores malformed parent references', () => {
  const parent = {
    key: 'DEMO-10',
    title: 'Checkout improvements',
    issueTypeName: 'Story',
  };
  assert.deepEqual(normalizeTask({ key: 'DEMO-11', parent }).parent, parent);
  assert.equal(normalizeTask({ key: 'DEMO-11' }).parent, null);
  assert.equal(
    normalizeTask({ key: 'DEMO-11', parent: { key: '--help' } }).parent,
    null,
  );
});

test('queries direct children with a fixed validated parent JQL and omits their descriptions', async () => {
  const calls: string[][] = [];
  const client = createJiraClient(async (args) => {
    calls.push(args);
    return [
      {
        key: 'DEMO-11',
        title: 'Child',
        description: 'Long body',
        status: { name: 'Done', categoryKey: 'done' },
      },
    ];
  });
  const page = await client.children({ siteId: 'site-a', key: 'DEMO-10' });
  assert.deepEqual(calls[0], [
    'search',
    'parent = "DEMO-10" ORDER BY key ASC',
    '--site',
    'site-a',
    '--limit',
    '100',
  ]);
  assert.equal(page.tasks[0].category, 'done');
  assert.equal(page.tasks[0].description, '');
  await assert.rejects(() =>
    client.children({ siteId: 'site-a', key: 'DEMO-10" OR project = SECRET' }),
  );
  assert.equal(calls.length, 1);
});

test('preserves the stable assignee identity for child filters', () => {
  const task = normalizeTask({
    key: 'DEMO-1',
    assignee: { accountId: 'account-1', displayName: 'Alex' },
  });
  assert.equal(task.assignee, 'Alex');
  assert.equal(task.assigneeId, 'account-1');
  assert.equal(normalizeTask({ key: 'DEMO-2', assignee: null }).assigneeId, '');
});

test('keeps Jira issue type metadata for both normal and sub-task types', () => {
  assert.deepEqual(
    normalizeTask({
      key: 'DEMO-1',
      issueType: { name: 'Bug Sub-Task', subtask: true },
    }).issueType,
    { name: 'Bug Sub-Task', subtask: true },
  );
});

test('keeps reporter identity separate from assignee and tolerates missing reporter data', () => {
  const task = normalizeTask({
    key: 'DEMO-1',
    assignee: { displayName: 'Alex' },
    reporter: {
      displayName: 'Casey',
      avatarUrl:
        'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/reporter/48',
    },
  });
  assert.equal(task.assignee, 'Alex');
  assert.equal(task.reporter?.name, 'Casey');
  assert.ok(task.reporter?.avatarUrl);
  assert.deepEqual(normalizeTask({ key: 'DEMO-2', reporter: null }).reporter, {
    name: '',
    avatarUrl: '',
  });
});
