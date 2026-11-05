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
      'plugins/landmark-island/src/world.ts',
      'plugins/landmark-island/src/worker/main.ts',
    ],
    outdir: dir,
    outbase: 'plugins/landmark-island/src',
    bundle: true,
    platform: 'node',
    format: 'esm',
    outExtension: { '.js': '.mjs' },
  });
  const { Game, draw, validate, availableTickets } = await import(
    pathToFileURL(join(dir, 'game.mjs'))
  );
  const { route } = await import(pathToFileURL(join(dir, 'walk.mjs')));
  const { tiles, landTiles, neighbours, solidProps, isLand, project, at } =
    await import(pathToFileURL(join(dir, 'world.mjs')));
  assert.equal(tiles.length, 576);
  assert.equal(landTiles.length, 318);
  assert.equal(new Set(tiles.map((t) => `${t.col},${t.row}`)).size, 576);
  for (let id = 0; id < 36; id++) {
    assert.equal(tiles[id].col, 9 + (id % 6));
    assert.equal(tiles[id].row, 9 + Math.floor(id / 6));
    assert.ok(isLand(id));
  }
  const detour = route(0, 2, new Set([1]));
  assert.equal(detour.length, 4);
  assert.equal(detour.at(-1), 2);
  assert.ok(!detour.includes(1));
  assert.deepEqual(route(0, 35, new Set(neighbours(0))), []);
  assert.deepEqual(route(0, 1, new Set([1])), []);
  assert.deepEqual(route(-1, 0, new Set()), []);
  assert.deepEqual(route(0, 0, new Set()), []);
  // Every non-decorated piece of land can be reached from the original plaza.
  for (const tile of landTiles.filter(
    (t) => !solidProps.has(t.id) && t.id !== 30,
  )) {
    const path = route(30, tile.id, solidProps);
    assert.ok(path.length, `Unreachable land ${tile.id}`);
    let last = 30;
    for (const step of path) {
      assert.ok(neighbours(last).includes(step));
      assert.ok(!solidProps.has(step));
      last = step;
    }
  }
  assert.ok(project(at(12, 13)).depth > project(at(12, 12)).depth);
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
  assert.equal(value.tickets.length, 40);
  assert.equal(value.receipts.length, 0);
  assert.equal(availableTickets(value).length, 40);
  assert.equal(writes, 40);
  await assert.rejects(game.redeem({ ticketId: 'missing' }));
  await assert.rejects(game.redeem(null));
  await Promise.all(
    Array.from({ length: 80 }, (_, i) =>
      game.redeem({ ticketId: `w${i % 40}` }),
    ),
  );
  assert.equal(value.receipts.length, 40);
  assert.equal(writes, 80);
  assert.equal(availableTickets(value).length, 0);
  assert.ok(value.receipts.every((r) => r.landmark === 'eiffel'));
  game = new Game(store, () => 0.999);
  await game.acquire({ workspaceId: 'w0', kind: 'worktree' });
  await game.redeem({ ticketId: 'w0' });
  assert.equal(value.receipts[0].landmark, 'eiffel');
  assert.equal(writes, 80);
  await game.place({ cell: 0, landmark: 'eiffel' });
  await game.place({ cell: 1, from: 0 });
  assert.deepEqual(value.placements, [{ cell: 1, landmark: 'eiffel' }]);
  const oldSave = validate({
    version: 1,
    receipts: value.receipts,
    placements: Array.from({ length: 36 }, (_, cell) => ({
      cell,
      landmark: 'eiffel',
    })),
  });
  assert.equal(oldSave.version, 2);
  assert.equal(availableTickets(oldSave).length, 0);
  assert.equal(oldSave.placements.length, 36);
  let legacy = {
    version: 1,
    receipts: value.receipts,
    placements: value.placements,
  };
  const legacyGame = new Game({
    read: async () => legacy,
    write: async (s) => {
      legacy = structuredClone(s);
    },
  });
  await legacyGame.acquire({ workspaceId: 'w0', kind: 'worktree' });
  assert.equal(legacy.version, 1); // reads / duplicate delivery do not rewrite saves
  await legacyGame.acquire({ workspaceId: 'new-worktree', kind: 'worktree' });
  assert.equal(legacy.version, 2);
  assert.equal(availableTickets(legacy).length, 1);
  assert.deepEqual(legacy.receipts, value.receipts);
  assert.deepEqual(legacy.placements, value.placements);
  assert.deepEqual(
    oldSave.placements.map((p) => p.cell),
    Array.from({ length: 36 }, (_, i) => i),
  );
  const expanded = landTiles.find((t) => t.id >= 36 && t.kind === 'grass').id;
  await game.place({ cell: expanded, landmark: 'eiffel' });
  assert.ok(
    (await new Game(store).snapshot()).placements.some(
      (p) => p.cell === expanded,
    ),
  );
  await game.place({ cell: expanded });
  await assert.rejects(
    game.place({ cell: tiles.find((t) => !t.land).id, landmark: 'eiffel' }),
  );
  await assert.rejects(game.place({ cell: 576 }));
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
  assert.equal(value.receipts.length, 40);
  assert.equal(value.tickets.length, 41);
  fail = true;
  await assert.rejects(game.redeem({ ticketId: 'failed' }));
  assert.equal(availableTickets(value).length, 1);
  assert.equal(value.receipts.length, 40);
  fail = false;
  await game.redeem({ ticketId: 'failed' });
  assert.equal(value.receipts.length, 41);
  assert.equal(availableTickets(value).length, 0);
  // A lost response after storage committed is safe to retry after restart.
  let responseLost = false;
  const ambiguous = new Game(
    {
      read: store.read,
      write: async (s) => {
        await store.write(s);
        if (
          s.receipts.some((r) => r.workspaceId === 'ambiguous') &&
          !responseLost
        ) {
          responseLost = true;
          throw Error('response lost');
        }
      },
    },
    () => 0,
  );
  await ambiguous.acquire({ workspaceId: 'ambiguous', kind: 'worktree' });
  await assert.rejects(ambiguous.redeem({ ticketId: 'ambiguous' }));
  const committed = structuredClone(value);
  await new Game(store, () => 0.999).redeem({ ticketId: 'ambiguous' });
  assert.deepEqual(value, committed);
  assert.throws(() => validate({ ...value, tickets: [] }));
  assert.throws(() =>
    validate({ ...value, tickets: [...value.tickets, value.tickets[0]] }),
  );
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
  assert.deepEqual(Object.keys(handlers), [
    'island.read',
    'island.draw',
    'island.place',
  ]);
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
  assert.equal(availableTickets(await handlers['island.read']()).length, 1);
  await handlers['island.draw']({ ticketId: 'background' });
  await handlers['island.draw']({ ticketId: 'background' });
  assert.equal((await handlers['island.read']()).receipts.length, 43);
  assert.equal(availableTickets(await handlers['island.read']()).length, 0);
  assert.ok(posted);
  console.log(
    'PASS: concurrent events, duplicates, restart deduplication, placement/movement/removal, validation, failed-save recovery, tier boundaries, worker wiring without panels',
  );
} finally {
  await rm(dir, { recursive: true, force: true });
}
