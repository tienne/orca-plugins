import { assert, test } from 'orca/testing';
import { childJql } from './child-query';
import { createJiraClient } from './jira';

test('applies search, multiple statuses and assignees before the result limit', () => {
  const jql = childJql({
    siteId: 'site',
    key: 'DEMO-1',
    search: 'DEMO-999',
    statuses: ['Done', 'In progress'],
    assignees: ['id:account-1', 'unassigned'],
  });
  assert.equal(
    jql,
    'parent = "DEMO-1" AND key = "DEMO-999" AND status IN ("Done", "In progress") AND (assignee IN ("account-1") OR assignee IS EMPTY) ORDER BY key ASC',
  );
  assert.ok(
    childJql({ siteId: 'site', key: 'DEMO-1', search: '예약 문제' }).includes(
      'summary ~ "예약 문제*"',
    ),
  );
});
test('quotes state and assignee values and rejects malformed criteria', () => {
  const jql = childJql({
    siteId: 'site',
    key: 'DEMO-1',
    statuses: ['Done" OR project = SECRET'],
    assignees: ['id:abc" OR assignee IS NOT EMPTY'],
  });
  assert.ok(jql.includes('Done\\" OR project = SECRET'));
  assert.ok(jql.includes('abc\\" OR assignee IS NOT EMPTY'));
  assert.throws(() =>
    childJql({ siteId: 'site', key: 'DEMO-1', search: 'a\nb' }),
  );
  assert.throws(() =>
    childJql({
      siteId: 'site',
      key: 'DEMO-1',
      statuses: 'bad' as unknown as string[],
    }),
  );
});
test('discovers query choices beyond the first result page without truncating them to 100 rows', async () => {
  const calls: string[][] = [];
  const client = createJiraClient(async (args) => {
    calls.push(args);
    if (calls.length === 1)
      return [
        {
          key: 'DEMO-1',
          status: { name: 'Done' },
          assignee: { accountId: 'first', displayName: 'Alex' },
        },
      ];
    if (calls.length === 2)
      return [
        {
          key: 'DEMO-999',
          status: { name: 'Blocked' },
          assignee: { accountId: 'outside', displayName: 'Taylor' },
        },
      ];
    return [];
  });
  const page = await client.children({
    siteId: 'site',
    key: 'DEMO-10',
    includeOptions: true,
  });
  assert.deepEqual(page.options?.statuses, ['Done', 'Blocked']);
  assert.ok(
    page.options?.assignees.some((person) => person.value === 'id:outside'),
  );
  assert.equal(page.options?.limited, false);
  assert.ok(calls[1][1].includes('assignee NOT IN ("first")'));
});

test('returns matching children with partial choices when the discovery budget expires', async () => {
  let calls = 0;
  const client = createJiraClient(async (_args, signal) => {
    calls++;
    if (calls === 1) return [{ key: 'DEMO-1', status: { name: 'Done' } }];
    return new Promise((_resolve, reject) => {
      signal!.addEventListener(
        'abort',
        () => reject(new Error('Discovery aborted')),
        { once: true },
      );
    });
  }, 5);
  const result = await client.children({
    siteId: 'site',
    key: 'DEMO-10',
    includeOptions: true,
  });
  assert.equal(result.tasks[0].key, 'DEMO-1');
  assert.equal(result.options?.limited, true);
  assert.deepEqual(result.options?.statuses, ['Done']);
  assert.equal(calls, 2);
});

test('propagates parent cancellation during discovery and initial search failures', async () => {
  const controller = new AbortController();
  let calls = 0;
  const client = createJiraClient(async () => {
    if (++calls === 1) return [{ key: 'DEMO-1' }];
    controller.abort();
    throw new Error('Cancelled');
  });
  await assert.rejects(() =>
    client.children(
      { siteId: 'site', key: 'DEMO-10', includeOptions: true },
      controller.signal,
    ),
  );
  const failure = createJiraClient(async () => {
    throw new Error('Search failed');
  });
  await assert.rejects(() =>
    failure.children({ siteId: 'site', key: 'DEMO-10', includeOptions: true }),
  );
});
