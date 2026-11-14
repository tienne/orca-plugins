import { assert, test } from 'orca/testing';
import { openPanel, parseOpenResponse } from './open-panel';

test('rejects killed, signalled and transport failures even with a not-found response', () => {
  const response = JSON.stringify({
    ok: false,
    error: { code: 'plugin_not_found' },
  });
  assert.equal(
    parseOpenResponse(response, { code: 1 }).error?.code,
    'plugin_not_found',
  );
  for (const error of [
    { code: 1, killed: true },
    { code: 1, signal: 'SIGTERM' },
    { code: 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER' },
    { code: 'ENOENT' },
    { code: 127 },
    { code: 2 },
    { code: 3 },
  ])
    assert.throws(() => parseOpenResponse(response, error));
  assert.throws(() => parseOpenResponse('{"ok":true}', { code: 1 }));
});

test('opens the published identity and uses the development identity only when missing', async () => {
  const calls: string[] = [];
  await openPanel(new AbortController().signal, async (key) => {
    calls.push(key);
    return { ok: true };
  });
  assert.deepEqual(calls, ['tienne.jira-tasks']);
  calls.length = 0;
  await openPanel(new AbortController().signal, async (key) => {
    calls.push(key);
    return key.startsWith('local.')
      ? { ok: true }
      : { ok: false, error: { code: 'plugin_not_found' } };
  });
  assert.deepEqual(calls, ['tienne.jira-tasks', 'local.jira-tasks']);
});

test('does not fall back after permission failures, transport errors or cancellation', async () => {
  let calls = 0;
  await assert.rejects(() =>
    openPanel(new AbortController().signal, async () => {
      calls++;
      return { ok: false, error: { code: 'approval_required' } };
    }),
  );
  assert.equal(calls, 1);
  await assert.rejects(() =>
    openPanel(new AbortController().signal, async () => {
      calls++;
      throw new Error('Transport failed');
    }),
  );
  assert.equal(calls, 2);
  const controller = new AbortController();
  await assert.rejects(() =>
    openPanel(controller.signal, async () => {
      calls++;
      controller.abort();
      return { ok: false, error: { code: 'plugin_not_found' } };
    }),
  );
  assert.equal(calls, 3);
});
