import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

export async function testExpeditions(dir) {
  const { default: activate } = await import(
    pathToFileURL(join(dir, 'worker/main.mjs'))
  );
  const storage = new Map();
  let writes = 0,
    failWrite = false;
  function worker() {
    const handlers = {},
      events = {};
    activate({
      host: {
        call: async (name, input) => {
          if (name === 'storage.get')
            return { value: structuredClone(storage.get(input.key) ?? null) };
          assert.equal(name, 'storage.set');
          if (failWrite) throw new Error('storage unavailable');
          writes++;
          storage.set(input.key, structuredClone(input.value));
          return { ok: true };
        },
      },
      panels: {
        handle: (name, fn) => (handlers[name] = fn),
        post: async () => {
          throw new Error('panel closed');
        },
      },
      events: { on: (name, fn) => (events[name] = fn) },
      log: () => {},
    });
    return {
      read: () => handlers['island.expeditions'](),
      welcome: (run) => handlers['island.welcome']({ run }),
      emit: (event) => events['agent.status.changed'](event),
    };
  }
  let live = worker();
  const event = (state, receivedAt, outcome, paneKey = 'pane-1') => ({
    workspaceId: 'private/workspace',
    paneKey,
    receivedAt,
    state,
    ...(outcome
      ? { mainAgent: { state, outcome, stateStartedAt: receivedAt } }
      : {}),
  });
  await live.emit(event('done', 100, 'success'));
  await live.emit({ ...event('working', 100), workspaceId: null });
  assert.deepEqual(await live.read(), []);
  await live.emit(event('working', 200));
  const run = (await live.read())[0].run;
  await live.emit(event('blocked', 250));
  await live.emit(event('waiting', 300));
  await live.emit(event('working', 299));
  assert.equal((await live.read())[0].state, 'waiting');
  await live.emit(event('done', 400, 'success'));
  assert.equal((await live.read())[0].pending, true);
  assert.equal(storage.has('island-v1'), false);
  assert.ok(!JSON.stringify(await live.read()).includes('private/workspace'));
  const beforeDuplicate = writes;
  await live.emit(event('done', 400, 'success'));
  assert.equal(writes, beforeDuplicate);
  failWrite = true;
  await assert.rejects(live.welcome(run), /storage unavailable/);
  assert.equal((await live.read())[0].pending, true);
  failWrite = false;
  await Promise.all([live.welcome(run), live.welcome(run)]);
  assert.equal(writes, beforeDuplicate + 1);
  live = worker();
  assert.equal((await live.read())[0].welcomed, true);
  await live.emit(event('done', 450, 'success'));
  assert.equal((await live.read())[0].pending, false);
  await live.emit(event('working', 500));
  await assert.rejects(live.welcome(run), /no longer/);
  await live.emit(event('done', 600, 'failure'));
  assert.equal((await live.read())[0].pending, false);
  await live.emit(event('working', 700));
  await live.emit(event('done', 800));
  assert.equal((await live.read())[0].pending, true);
  assert.equal((await live.read())[0].outcome, 'unconfirmed');
  await live.emit({
    ...event('done', 850),
    mainAgent: { state: 'working', stateStartedAt: 850 },
  });
  assert.equal((await live.read())[0].state, 'working');
  for (let i = 0; i < 30; i++)
    await live.emit(event('working', 900 + i, undefined, `pane-${i + 2}`));
  assert.equal((await live.read()).length, 24);
  assert.equal(storage.has('island-v1'), false);
  console.log(
    'PASS: expedition event validation, ordering, main-agent state, separate bounded storage, restart, failure recovery and idempotent welcome',
  );
}
