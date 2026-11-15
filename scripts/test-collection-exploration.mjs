import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

export async function testCollectionExploration(dir) {
  const {
    Game,
    empty,
    validate,
    landmarks,
    weights,
    draw,
    collectionTheme,
    collectionDiscoveries,
    collectionUnlocked,
    firstExplorationAvailable,
    availableTickets,
    encodeBackup,
    decodeBackup,
    islandLevel,
    quantity,
  } = await import(pathToFileURL(join(dir, 'game.mjs')));
  const at = '2026-11-15';
  const land = landmarks.filter((l) => collectionTheme(l.id) === 'land');
  const fixture = (count, tickets = 15) => {
    const s = empty();
    land.slice(0, count).forEach((l, i) => {
      s.tickets.push({ workspaceId: `owned-${i}`, at });
      s.receipts.push({ workspaceId: `owned-${i}`, landmark: l.id, at });
    });
    for (let i = 0; i < tickets; i++)
      s.tickets.push({ workspaceId: `new-${i}`, at });
    return validate(s);
  };
  const make = (initial, random = () => 0) => {
    let state = structuredClone(initial),
      backup = null,
      fail = false,
      lose = false,
      writes = 0;
    const store = {
      read: async () => structuredClone(state),
      write: async (s) => {
        if (fail) throw Error('disk full');
        state = structuredClone(s);
        writes++;
        if (lose) {
          lose = false;
          throw Error('response lost');
        }
      },
      readBackup: async () => structuredClone(backup),
      writeBackup: async (s) => {
        backup = structuredClone(s);
      },
    };
    return {
      game: new Game(store, random),
      store,
      get state() {
        return state;
      },
      get writes() {
        return writes;
      },
      fail(v) {
        fail = v;
      },
      lose() {
        lose = true;
      },
    };
  };
  assert.equal(
    landmarks.filter((l) => collectionTheme(l.id) === 'river').length,
    7,
  );
  assert.equal(
    landmarks.filter((l) => collectionTheme(l.id) === 'sea').length,
    12,
  );
  for (const [count, river, sea] of [
    [11, false, false],
    [12, true, false],
    [24, true, false],
    [25, true, true],
  ]) {
    const state = fixture(count);
    assert.equal(collectionUnlocked(state, 'river'), river);
    assert.equal(collectionUnlocked(state, 'sea'), sea);
    for (const [tier, weight] of Object.entries(weights)) {
      const pool = landmarks.filter(
        (l) =>
          l.tier === tier &&
          (collectionTheme(l.id) === 'land' ||
            collectionUnlocked(state, collectionTheme(l.id))),
      );
      assert.ok(pool.length, `empty normal tier ${tier} at ${count}`);
      const before = Object.entries(weights)
        .slice(0, Object.keys(weights).indexOf(tier))
        .reduce((n, [, w]) => n + w, 0);
      for (let i = 0; i < pool.length; i++) {
        let call = 0;
        assert.equal(
          draw(
            () =>
              call++ ? (i + 0.5) / pool.length : (before + weight / 2) / 100,
            state,
          ),
          pool[i].id,
        );
      }
    }
  }
  // Every reachable theme/tier candidate is selected with rescaled weights.
  for (const theme of ['river', 'sea']) {
    const state = fixture(25);
    const tiers = Object.entries(weights).filter(([t]) =>
      landmarks.some((l) => collectionTheme(l.id) === theme && l.tier === t),
    );
    const total = tiers.reduce((n, [, w]) => n + w, 0);
    let before = 0;
    for (const [tier, w] of tiers) {
      const pool = landmarks.filter(
        (l) => l.tier === tier && collectionTheme(l.id) === theme,
      );
      for (let i = 0; i < pool.length; i++) {
        let call = 0;
        assert.equal(
          draw(
            () => (call++ ? (i + 0.5) / pool.length : (before + w / 2) / total),
            state,
            theme,
          ),
          pool[i].id,
        );
      }
      before += w;
    }
  }
  // Select a new land place at the boundary, then a river/sea candidate on the next draw.
  for (const [count, theme] of [
    [11, 'river'],
    [24, 'sea'],
  ]) {
    const initial = fixture(count);
    const fresh = land.find((l) => !initial.discoveredPlaces.includes(l.id));
    const target = landmarks.find((l) => collectionTheme(l.id) === theme);
    let n = 0;
    const rolls = [];
    for (const l of [fresh, target, ...Array(8).fill(target)]) {
      const state = fixture(count + (rolls.length ? 1 : 0));
      const pool = landmarks.filter(
        (x) =>
          x.tier === l.tier &&
          (collectionTheme(x.id) === 'land' ||
            collectionUnlocked(state, collectionTheme(x.id))),
      );
      const before = Object.entries(weights)
        .slice(0, Object.keys(weights).indexOf(l.tier))
        .reduce((v, [, w]) => v + w, 0);
      rolls.push(
        (before + weights[l.tier] / 2) / 100,
        (pool.findIndex((x) => x.id === l.id) + 0.5) / pool.length,
      );
    }
    const box = make(initial, () => rolls[n++]);
    const result = await box.game.redeemMany({
      ticketIds: Array.from({ length: 10 }, (_, i) => `new-${i}`),
    });
    assert.equal(result.receipts[count].landmark, fresh.id);
    assert.equal(collectionTheme(result.receipts[count + 1].landmark), theme);
    assert.equal(box.writes, 1);
    assert.equal(firstExplorationAvailable(result, theme), true);
  }
  const duplicates = fixture(11);
  duplicates.tickets.push({ workspaceId: 'duplicate', at });
  duplicates.receipts.push({
    workspaceId: 'duplicate',
    landmark: land[0].id,
    at,
  });
  const box = make(duplicates);
  const before = collectionDiscoveries(duplicates).length;
  await box.game.fuse({ id: 'fusion', landmark: land[0].id });
  assert.equal(quantity(box.state, `${land[0].id}+`), 1);
  assert.equal(collectionDiscoveries(box.state).length, before);
  assert.equal(collectionUnlocked(box.state, 'river'), false);
  const both = make(fixture(25));
  const noTickets = make(fixture(25, 0));
  await assert.rejects(
    noTickets.game.exploreTheme({ theme: 'river', ticketId: 'missing' }),
    /ticket/,
  );
  assert.equal(firstExplorationAvailable(noTickets.state, 'river'), true);
  const locked = make(fixture(11));
  await assert.rejects(
    locked.game.exploreTheme({ theme: 'river', ticketId: 'new-0' }),
    /not available/,
  );
  const request = { theme: 'river', ticketId: 'new-0' };
  both.fail(true);
  await assert.rejects(both.game.exploreTheme(request), /disk/);
  assert.equal(both.state.firstExplorations.length, 0);
  assert.equal(availableTickets(both.state).length, 15);
  both.fail(false);
  both.lose();
  await assert.rejects(both.game.exploreTheme(request), /response/);
  const restart = new Game(both.store);
  await Promise.all([
    restart.exploreTheme(request),
    restart.exploreTheme(request),
  ]);
  assert.equal(both.state.firstExplorations.length, 1);
  assert.equal(availableTickets(both.state).length, 14);
  assert.equal(collectionTheme(both.state.receipts.at(-1).landmark), 'river');
  await assert.rejects(
    restart.exploreTheme({ theme: 'river', ticketId: 'new-1' }),
    /not available/,
  );
  await assert.rejects(
    restart.exploreTheme({ theme: 'sea', ticketId: 'new-0' }),
    /ticket/,
  );
  await Promise.allSettled([
    restart.exploreTheme({ theme: 'sea', ticketId: 'new-1' }),
    restart.exploreTheme({ theme: 'sea', ticketId: 'new-2' }),
  ]);
  assert.equal(both.state.firstExplorations.length, 2);
  assert.equal(availableTickets(both.state).length, 13);
  const roundtrip = decodeBackup(encodeBackup(both.state)).state;
  assert.deepEqual(roundtrip, both.state);
  const beforeRestore = await restart.snapshot();
  const old = fixture(2);
  const text = encodeBackup(old);
  const restored = await restart.restore({ text, expected: beforeRestore });
  assert.equal(restored.firstExplorations.length, 2);
  assert.equal(
    collectionDiscoveries(restored).length,
    collectionDiscoveries(beforeRestore).length,
  );
  assert.equal(islandLevel(restored), islandLevel(beforeRestore));
  assert.equal(firstExplorationAvailable(restored, 'river'), false);
  assert.deepEqual(
    await new Game(both.store).restore({ text, expected: beforeRestore }),
    restored,
  );
  assert.deepEqual(
    decodeBackup(await restart.exportBackup(true)).state,
    beforeRestore,
  );
  const legacy = { ...fixture(25), version: 6 };
  delete legacy.discoveredPlaces;
  delete legacy.firstExplorations;
  const migrated = validate(legacy);
  assert.equal(firstExplorationAvailable(migrated, 'river'), true);
  assert.equal(firstExplorationAvailable(migrated, 'sea'), true);
  assert.deepEqual(migrated.receipts, legacy.receipts);
  for (const bad of [
    { ...migrated, firstExplorations: null },
    { ...migrated, discoveredPlaces: ['unknown'] },
    {
      ...migrated,
      firstExplorations: [
        { theme: 'river', ticketId: 'new-0' },
        { theme: 'river', ticketId: 'new-1' },
      ],
    },
    {
      ...fixture(11),
      firstExplorations: [{ theme: 'river', ticketId: 'new-0' }],
    },
  ])
    assert.throws(() => validate(bad));
  // A legacy restore cannot launder a used opportunity; incompatible divergent rewards fail safely.
  const conflict = fixture(25);
  conflict.receipts.push({ workspaceId: 'new-0', landmark: land[0].id, at });
  const current = make(beforeRestore);
  await assert.rejects(
    current.game.restore({
      text: encodeBackup(conflict),
      expected: beforeRestore,
    }),
    /first exploration ledger/,
  );
  assert.deepEqual(current.state, beforeRestore);
  console.log(
    'PASS: collection unlock boundaries, all gated tier pools, rescaled theme tiers, mid-batch unlock, fusion history, one-time theme requests, concurrency, restart/response loss, failure rollback and backup anti-reissue',
  );
}
