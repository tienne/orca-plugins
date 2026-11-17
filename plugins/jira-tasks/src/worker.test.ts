import { assert, test } from 'orca/testing';
import { createJiraClient, normalizeTask } from './jira';

test('reads comments with a validated site/key and forwards cancellation', async () => {
  const controller = new AbortController();
  const client = createJiraClient(async (args, signal) => {
    assert.deepEqual(args, ['comment', 'list', 'DEMO-1', '--site', 'site-a']);
    assert.equal(signal, controller.signal);
    return [
      {
        id: '42',
        user: { displayName: 'Reviewer' },
        createdAt: '2026-11-17T03:00:00Z',
        body: '## Review\n\n- Looks good',
      },
    ];
  });
  const result = await client.comments(
    { siteId: 'site-a', key: 'DEMO-1' },
    controller.signal,
  );
  assert.equal(result.comments[0].author, 'Reviewer');
  assert.equal(result.comments[0].createdAt, '2026-11-17T03:00:00Z');
  assert.equal(result.comments[0].description, '## Review\n\n- Looks good');
  assert.equal(result.limitReached, false);
});

test('rejects invalid comment requests and malformed responses', async () => {
  let calls = 0;
  const client = createJiraClient(async () => {
    calls++;
    return {};
  });
  for (const input of [
    { siteId: '--help', key: 'DEMO-1' },
    { siteId: 'site-a', key: '--help' },
    { siteId: 'site-a', key: 'DEMO-1; rm' },
  ])
    await assert.rejects(() => client.comments(input));
  assert.equal(calls, 0);
  await assert.rejects(() =>
    client.comments({ siteId: 'site-a', key: 'DEMO-1' }),
  );
  const failing = createJiraClient(async () => {
    throw new Error('unavailable');
  });
  await assert.rejects(() =>
    failing.comments({ siteId: 'site-a', key: 'DEMO-1' }),
  );
});

test('bounds comment text, images and page size below the frame response limit', async () => {
  const client = createJiraClient(async () =>
    Array.from({ length: 101 }, (_, id) => ({
      id: String(id),
      body: '가'.repeat(30000),
    })),
  );
  const result = await client.comments({ siteId: 'site-a', key: 'DEMO-1' });
  assert.ok(result.comments.length > 0);
  assert.equal(result.comments[0].description.length, 24000);
  assert.equal(result.comments[0].descriptionTruncated, true);
  assert.equal(result.comments[0].author, '');
  assert.equal(result.limitReached, true);
  assert.ok(Buffer.byteLength(JSON.stringify(result)) < 1024 * 1024);
  const images = createJiraClient(async () =>
    Array.from({ length: 10 }, () => ({
      body: `![Image](data:image/png;base64,${'A'.repeat(500000)})`,
    })),
  );
  const page = await images.comments({ siteId: 'site-a', key: 'DEMO-1' });
  assert.equal(page.comments.length, 1);
  assert.equal(page.limitReached, true);
  assert.ok(page.comments[0].images?.[0].src.startsWith('data:image/png;'));
  assert.ok(Buffer.byteLength(JSON.stringify(page)) < 1024 * 1024);
  const empty = createJiraClient(async () => []);
  assert.deepEqual(await empty.comments({ siteId: 'site-a', key: 'DEMO-1' }), {
    comments: [],
    limitReached: false,
  });
});

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
