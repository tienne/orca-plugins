import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const dir = await mkdtemp(join(tmpdir(), 'landmark-test-'));
try {
  await build({
    entryPoints: [
      'plugins/landmark-island/src/game.ts',
      'plugins/landmark-island/src/walk.ts',
      'plugins/landmark-island/src/worker/main.ts',
    ],
    outdir: dir,
    outbase: 'plugins/landmark-island/src',
    bundle: true,
    platform: 'node',
    format: 'esm',
    outExtension: { '.js': '.mjs' },
  });
  const { Game, draw, validate } = await import(
    pathToFileURL(join(dir, 'game.mjs'))
  );
  const { route } = await import(pathToFileURL(join(dir, 'walk.mjs')));
  assert.deepEqual(route(0, 2, new Set([1])), [6, 7, 8, 2]);
  assert.deepEqual(route(0, 35, new Set([1, 6])), []);
  assert.deepEqual(route(5, 6, new Set()), [11, 10, 9, 8, 7, 6]);
  assert.deepEqual(route(0, 1, new Set([1])), []);
  assert.deepEqual(route(-1, 0, new Set()), []);
  assert.deepEqual(route(0, 0, new Set()), []);
  let value = null,
    writes = 0,
    fail = false;
  const store = {
    read: async () => structuredClone(value),
    write: async (s) => {
      if (fail) throw Error('disk full');
      await new Promise((r) => setTimeout(r, 1));
      value = structuredClone(s);
      writes++;
    },
  };
  let game = new Game(store, () => 0);
  await game.acquire({ workspaceId: 'folder', kind: 'folder' });
  assert.equal(writes, 0);
  await Promise.all(
    Array.from({ length: 80 }, (_, i) =>
      game.acquire({ workspaceId: `w${i % 40}`, kind: 'worktree' }),
    ),
  );
  assert.equal(value.receipts.length, 40);
  assert.equal(writes, 40);
  assert.ok(value.receipts.every((r) => r.landmark === 'eiffel'));
  game = new Game(store, () => 0.999);
  await game.acquire({ workspaceId: 'w0', kind: 'worktree' });
  assert.equal(writes, 40);
  await game.place({ cell: 0, landmark: 'eiffel' });
  await game.place({ cell: 1, from: 0 });
  assert.deepEqual(value.placements, [{ cell: 1, landmark: 'eiffel' }]);
  await game.place({ cell: 1 });
  assert.equal(value.receipts.length, 40);
  assert.equal(value.placements.length, 0);
  await assert.rejects(game.place({ cell: 2, landmark: 'taj' }));
  await assert.rejects(game.place({ cell: 36 }));
  await assert.rejects(game.place({ cell: 1, landmark: '__proto__' }));
  fail = true;
  await assert.rejects(
    game.acquire({ workspaceId: 'failed', kind: 'worktree' }),
  );
  assert.equal(value.receipts.length, 40);
  fail = false;
  await game.acquire({ workspaceId: 'failed', kind: 'worktree' });
  assert.equal(value.receipts.length, 41);
  for (const [r, id] of [
    [0, 'eiffel'],
    [0.7, 'taj'],
    [0.93, 'angkor'],
    [0.99, 'giza'],
  ]) {
    let n = 0;
    assert.equal(
      draw(() => (n++ ? 0 : r)),
      id,
    );
  }
  assert.throws(() => validate({ version: 2 }));
  assert.throws(() =>
    validate({ ...value, receipts: [value.receipts[0], value.receipts[0]] }),
  );
  const { default: activate } = await import(
    pathToFileURL(join(dir, 'worker/main.mjs'))
  );
  const handlers = {},
    events = {};
  let posted = 0;
  activate({
    host: {
      call: async (name, input) =>
        name === 'storage.get'
          ? { value }
          : ((value = structuredClone(input.value)), { ok: true }),
    },
    panels: {
      handle: (n, f) => (handlers[n] = f),
      post: async () => {
        posted++;
      },
    },
    events: { on: (n, f) => (events[n] = f) },
    log: () => {},
  });
  assert.deepEqual(Object.keys(events), ['workspace.created']);
  assert.deepEqual(Object.keys(handlers), ['island.read', 'island.place']);
  await events['workspace.created']({
    workspaceId: 'background',
    kind: 'worktree',
    path: '/never-read',
  });
  await events['workspace.created']({
    workspaceId: 'background',
    kind: 'worktree',
  });
  assert.equal((await handlers['island.read']()).receipts.length, 42);
  assert.ok(posted);
  console.log(
    'PASS: concurrent events, duplicates, restart deduplication, placement/movement/removal, validation, failed-save recovery, tier boundaries, worker wiring without panels',
  );
} finally {
  await rm(dir, { recursive: true, force: true });
}
