import assert from 'node:assert/strict';

export async function testFusion({
  Game,
  empty,
  quantity,
  validate,
  materials,
  decorationQuantity,
  encodeBackup,
  decodeBackup,
  landmarks,
}) {
  const fixture = (count = 4) => {
    const s = empty();
    for (let i = 0; i < count; i++) {
      s.tickets.push({ workspaceId: `f-${i}`, at: '2026-11-13' });
      s.receipts.push({
        workspaceId: `f-${i}`,
        landmark: 'eiffel',
        at: '2026-11-13',
      });
    }
    return s;
  };
  let saved = fixture();
  saved.placements.push({ landmark: 'eiffel', cell: 0 });
  const original = structuredClone(saved);
  let writes = 0;
  let fail = false;
  let loseResponse = false;
  const store = {
    read: async () => structuredClone(saved),
    write: async (s) => {
      if (fail) throw Error('Disk full');
      saved = structuredClone(s);
      writes++;
      if (loseResponse) {
        loseResponse = false;
        throw Error('Response lost');
      }
    },
  };
  const request = { id: 'fusion-1', landmark: 'eiffel' };
  let game = new Game(store);
  fail = true;
  await assert.rejects(game.fuse(request), /Disk full/);
  assert.deepEqual(saved, original);
  fail = false;
  loseResponse = true;
  await assert.rejects(game.fuse(request), /Response lost/);
  game = new Game(store);
  await Promise.all([game.fuse(request), game.fuse(request)]);
  assert.equal(writes, 1);
  assert.equal(quantity(saved, 'eiffel'), 2);
  assert.equal(quantity(saved, 'eiffel+'), 1);
  assert.deepEqual(saved.placements, original.placements);
  assert.deepEqual(saved.receipts, original.receipts);
  assert.equal(materials(saved), materials(original));
  assert.equal(decorationQuantity(saved, 'eiffel-gift'), 1);
  assert.equal(decorationQuantity(saved, 'eiffel-plus-star'), 1);
  assert.deepEqual(decodeBackup(encodeBackup(saved)).state, saved);
  await assert.rejects(
    game.fuse({ ...request, landmark: 'petra' }),
    /already used/,
  );
  await assert.rejects(game.fuse({ id: 'f-2', landmark: 'eiffel+' }));
  await assert.rejects(
    game.fuse({ id: 'f-2', landmark: 'eiffel' }),
    /unplaced/,
  );
  saved.placements = [];
  const results = await Promise.allSettled([
    game.fuse({ id: 'f-2', landmark: 'eiffel' }),
    game.fuse({ id: 'f-3', landmark: 'eiffel' }),
  ]);
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
  assert.equal(quantity(saved, 'eiffel'), 0);
  assert.equal(quantity(saved, 'eiffel+'), 2);
  assert.equal(decorationQuantity(saved, 'eiffel-plus-star'), 1);
  await game.craft({ id: 'star-craft', decoration: 'eiffel-plus-star' });
  assert.equal(decorationQuantity(saved, 'eiffel-plus-star'), 2);
  await game.decorate({ cell: 0, decoration: 'eiffel-plus-star' });
  await game.place({ cell: 2, landmark: 'eiffel+' });
  assert.deepEqual(decodeBackup(encodeBackup(saved)).state, saved);
  const tampered = structuredClone(saved);
  tampered.fusions.push({ id: 'bad', landmark: 'eiffel', at: '2026-11-13' });
  assert.throws(() => validate(tampered), /exceeds ownership/);
  assert.throws(
    () => validate({ ...saved, fusions: [saved.fusions[0], saved.fusions[0]] }),
    /Invalid fusion/,
  );
  for (const version of [1, 2, 3, 4, 5]) {
    const old = { ...fixture(2), version };
    delete old.fusions;
    const migrated = validate(old);
    assert.deepEqual(migrated.fusions, []);
    assert.equal(quantity(migrated, 'eiffel'), 2);
  }
  for (const l of landmarks) {
    const state = fixture(2);
    state.receipts.forEach((r) => {
      r.landmark = l.id;
    });
    const instance = new Game({
      read: async () => state,
      write: async (s) => Object.assign(state, s),
    });
    await instance.fuse({ id: 'all-landmarks', landmark: l.id });
    assert.equal(quantity(state, `${l.id}+`), 1);
    assert.equal(decorationQuantity(state, `${l.id}-plus-star`), 1);
  }
  console.log(
    'PASS: fusion atomicity, response loss, restart, concurrency, ownership, migration, backup and all 300 exclusive gifts',
  );
}
