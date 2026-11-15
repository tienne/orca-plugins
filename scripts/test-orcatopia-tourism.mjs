import assert from 'node:assert/strict';

export async function testTourism({
  Game,
  empty,
  validate,
  layout,
  encodeBackup,
  landmarks,
  islandLand,
}) {
  const minute = 60_000;
  let now = 1_000_000;
  let saved = empty();
  let failed = false;
  let loseReply = false;
  let recovery = null;
  const store = {
    read: async () => structuredClone(saved),
    write: async (s) => {
      if (failed) throw Error('disk unavailable');
      saved = structuredClone(s);
      if (loseReply) {
        loseReply = false;
        throw Error('reply lost');
      }
    },
    readBackup: async () => structuredClone(recovery),
    writeBackup: async (state) => {
      recovery = structuredClone(state);
    },
  };
  const makeGame = () =>
    new Game(
      store,
      () => 0,
      () => now,
    );
  let game = makeGame();
  const add = (id, cell) => {
    const workspaceId = `tourism-${saved.receipts.length}`;
    saved.tickets.push({ workspaceId, at: '2026-11-15' });
    saved.receipts.push({ workspaceId, landmark: id, at: '2026-11-15' });
    if (cell !== undefined) saved.placements.push({ landmark: id, cell });
  };
  await game.snapshot();
  now += minute * 100;
  assert.equal((await game.snapshot()).tourism.coins, 0);
  add('eiffel', 0);
  add('eiffel', 1);
  add('eiffel');
  saved.fusions.push({
    id: 'tourism-plus',
    landmark: 'eiffel',
    at: new Date(now).toISOString(),
  });
  saved.placements = [
    { landmark: 'eiffel', cell: 0 },
    { landmark: 'eiffel+', cell: 1 },
  ];
  now += minute / 2;
  assert.equal((await game.snapshot()).tourism.coins, 0);
  now += minute / 2;
  assert.equal(
    (await game.snapshot()).tourism.coins,
    1,
    'duplicates and plus share one rate',
  );
  const second = landmarks.find((l) => l.id !== 'eiffel').id;
  add(second);
  now += minute;
  await game.place({ landmark: second, cell: 2 });
  assert.equal(saved.tourism.coins, 2, 'new rate is not retroactive');
  now += minute;
  const concurrent = await Promise.all([
    game.snapshot(),
    game.snapshot(),
    game.snapshot(),
  ]);
  assert.deepEqual(
    concurrent.map((s) => s.tourism.coins),
    [4, 4, 4],
  );
  now += minute / 2;
  failed = true;
  await assert.rejects(game.snapshot(), /disk/);
  assert.equal(saved.tourism.coins, 4);
  failed = false;
  game = makeGame();
  assert.equal((await game.snapshot()).tourism.coins, 5);
  now += minute;
  loseReply = true;
  await assert.rejects(game.snapshot(), /reply lost/);
  assert.equal(saved.tourism.coins, 7);
  assert.equal((await makeGame().snapshot()).tourism.coins, 7);
  const highWater = now;
  now -= minute * 100;
  await game.snapshot();
  now = highWater;
  assert.equal(
    (await game.snapshot()).tourism.coins,
    7,
    'backward time cannot replay income',
  );
  let boundaryState = structuredClone(saved);
  const boundaryCoins = boundaryState.tourism.coins;
  boundaryState.tourism.settledAt = now + minute * 60 * 12;
  const boundaryGame = new Game(
    {
      read: async () => structuredClone(boundaryState),
      write: async (next) => {
        boundaryState = structuredClone(next);
      },
    },
    () => 0,
    () => now,
  );
  await boundaryGame.snapshot();
  assert.equal(
    boundaryState.tourism.settledAt,
    now + minute * 60 * 12,
    'exactly 12 hours keeps the timestamp',
  );
  boundaryState.tourism.settledAt++;
  await boundaryGame.snapshot();
  assert.equal(
    boundaryState.tourism.settledAt,
    now,
    'more than 12 hours rebases without income',
  );
  assert.equal(boundaryState.tourism.coins, boundaryCoins);
  now += minute * 60 * 12;
  let state = await game.snapshot();
  assert.equal(state.tourism.away.visitors, 1440);
  assert.equal(state.tourism.away.capped, false);
  now += minute * 60 * 24 * 100;
  state = await game.snapshot();
  assert.equal(state.tourism.away.visitors, 1440);
  assert.equal(state.tourism.away.capped, true);
  assert.equal(
    (await makeGame().snapshot()).tourism.coins,
    state.tourism.coins,
  );
  const futureCoins = saved.tourism.coins;
  now -= minute * 60 * 24 * 100;
  assert.equal((await game.snapshot()).tourism.coins, futureCoins);
  assert.equal(
    saved.tourism.settledAt,
    now,
    'large reverse clock recovers without payout',
  );
  assert.equal((await makeGame().snapshot()).tourism.coins, futureCoins);
  now += minute;
  assert.equal((await game.snapshot()).tourism.coins, futureCoins + 2);
  const cell = islandLand(saved).find(
    (t) => !saved.placements.some((p) => p.cell === t.id),
  ).id;
  const before = saved.tourism.coins;
  failed = true;
  await assert.rejects(
    game.construct({ building: 'tourism-info', cell, expected: layout(saved) }),
    /disk/,
  );
  assert.equal(saved.tourism.coins, before);
  assert.deepEqual(saved.tourism.buildings, []);
  failed = false;
  const input = { building: 'tourism-info', cell, expected: layout(saved) };
  await Promise.all([game.construct(input), game.construct(input)]);
  assert.equal(saved.tourism.coins, before - 10);
  assert.deepEqual(saved.tourism.buildings, ['tourism-info']);
  await makeGame().construct(input);
  assert.equal(
    saved.tourism.coins,
    before - 10,
    'lost response survives restart',
  );
  await game.decorate({ cell });
  await game.construct(input);
  assert.ok(
    !saved.decorations.length,
    'replay cannot silently replace a returned building',
  );
  await game.decorate({ cell, decoration: 'tourism-info' });
  assert.equal(
    saved.tourism.coins,
    before - 10,
    'owned building is free to place',
  );
  await assert.rejects(
    game.construct({ building: 'tourism-cafe', cell }),
    /empty land/,
  );
  await assert.rejects(
    game.construct({ building: 'tourism-cafe', cell: -1 }),
    /empty land/,
  );
  const otherCell = islandLand(saved).find(
    (t) =>
      !saved.placements.some((p) => p.cell === t.id) &&
      !saved.decorations.some((p) => p.cell === t.id),
  ).id;
  const cafe = {
    building: 'tourism-cafe',
    cell: otherCell,
    expected: layout(saved),
  };
  const beforeCafe = saved.tourism.coins;
  loseReply = true;
  await assert.rejects(game.construct(cafe), /reply lost/);
  assert.equal(saved.tourism.coins, beforeCafe - 60);
  await makeGame().construct(cafe);
  assert.equal(saved.tourism.coins, beforeCafe - 60);
  const backup = encodeBackup(saved);
  await game.decorate({ cell });
  const expected = await game.snapshot();
  now += minute * 60;
  state = await game.restore({ text: backup, expected });
  assert.equal(state.tourism.settledAt, now);
  assert.equal(state.tourism.coins, expected.tourism.coins);
  assert.equal(
    (await makeGame().restore({ text: backup, expected })).tourism.coins,
    state.tourism.coins,
  );
  const reviewedCurrent = await game.snapshot();
  now++;
  const retainedBackup = await game.exportBackup(true);
  assert.deepEqual(
    saved,
    reviewedCurrent,
    'reading recovery does not stale the reviewed current snapshot',
  );
  await game.restore({ text: retainedBackup, expected: reviewedCurrent });
  now += minute;
  assert.equal((await game.snapshot()).tourism.coins, state.tourism.coins + 2);
  const legacy = { ...saved, version: 6, decorations: [] };
  delete legacy.tourism;
  saved = legacy;
  now += minute * 1000;
  state = await makeGame().snapshot();
  assert.equal(state.version, 7);
  assert.equal(
    state.tourism.coins,
    0,
    'legacy save has no historical tourism income',
  );
  assert.equal(state.tourism.settledAt, now);
  const invalid = structuredClone(state);
  invalid.tourism.coins = -1;
  assert.throws(() => validate(invalid), /tourism ledger/);
  invalid.tourism.coins = 1.2;
  assert.throws(() => validate(invalid), /tourism ledger/);
  invalid.tourism.coins = 0;
  invalid.tourism.buildings = ['tourism-info', 'tourism-info'];
  assert.throws(() => validate(invalid), /tourism ledger/);
  const unspent = structuredClone(saved);
  saved.tourism.coins = 0;
  const noFunds = structuredClone(saved);
  await assert.rejects(
    game.construct({ building: 'tourism-shop', cell: 3 }),
    /tourism coins/,
  );
  assert.deepEqual(saved, noFunds);
  saved = unspent;
  await assert.rejects(
    new Game(
      store,
      () => 0,
      () => NaN,
    ).snapshot(),
    /clock/,
  );
  assert.deepEqual(saved, unspent);
  let large = empty();
  for (const [i, landmark] of landmarks.entries()) {
    const workspaceId = `tourism-large-${i}`;
    large.tickets.push({ workspaceId, at: '2026-11-15' });
    large.receipts.push({
      workspaceId,
      landmark: landmark.id,
      at: '2026-11-15',
    });
  }
  const cells = islandLand(large);
  large.placements = landmarks.map((landmark, i) => ({
    landmark: landmark.id,
    cell: cells[i].id,
  }));
  const largeGame = new Game(
    {
      read: async () => large,
      write: async (s) => {
        large = structuredClone(s);
      },
    },
    () => 0,
    () => now,
  );
  await largeGame.snapshot();
  now += minute * 3;
  assert.equal(
    (await largeGame.snapshot()).tourism.coins,
    landmarks.length * 3,
  );
  large.tourism.coins = 999_999_999;
  now += minute * 3;
  assert.equal((await largeGame.snapshot()).tourism.coins, 1_000_000_000);
  assert.equal(large.tourism.away.coins, 1);
  console.log(
    'Tourism: settlement, clocks, migration, restore, concurrency and construction passed',
  );
}
