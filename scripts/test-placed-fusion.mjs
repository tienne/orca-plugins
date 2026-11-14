import assert from 'node:assert/strict';

export async function testPlacedFusion({
  Game,
  empty,
  validate,
  quantity,
  materials,
  decorationQuantity,
  encodeBackup,
  decodeBackup,
}) {
  const layout = (s) =>
    structuredClone({
      placements: s.placements,
      decorations: s.decorations,
      floors: s.floors,
    });
  const fixture = (landmark = 'eiffel') => {
    const s = empty();
    for (let i = 0; i < 4; i++) {
      s.tickets.push({ workspaceId: `placed-${i}`, at: '2026-11-14' });
      s.receipts.push({
        workspaceId: `placed-${i}`,
        landmark,
        at: '2026-11-14',
      });
    }
    s.placements = [
      { landmark, cell: 0 },
      { landmark, cell: 1, rotation: 1 },
      { landmark, cell: 2 },
    ];
    s.floors = [
      { cell: 0, decoration: 'path' },
      { cell: 1, decoration: 'grass' },
    ];
    return validate(s);
  };
  let saved = fixture(),
    writes = 0,
    fail = false,
    lose = false;
  const store = {
    read: async () => structuredClone(saved),
    write: async (next) => {
      if (fail) throw Error('Disk full');
      saved = structuredClone(next);
      writes++;
      if (lose) {
        lose = false;
        throw Error('Response lost');
      }
    },
  };
  let game = new Game(store);
  const before = structuredClone(saved);
  const request = {
    id: 'on-island-1',
    landmark: 'eiffel',
    from: 0,
    cell: 1,
    expected: layout(saved),
  };
  for (const invalid of [
    { ...request, cell: 0 },
    { ...request, from: -1 },
    { ...request, cell: 99999 },
    { ...request, cell: undefined },
    { ...request, expected: undefined },
    { ...request, landmark: 'petra' },
    { ...request, landmark: 'eiffel+' },
    { ...request, cell: 3 },
  ]) {
    await assert.rejects(game.fuse(invalid));
    assert.deepEqual(saved, before);
  }
  fail = true;
  await assert.rejects(game.fuse(request), /Disk full/);
  assert.deepEqual(saved, before);
  fail = false;
  lose = true;
  await assert.rejects(game.fuse(request), /Response lost/);
  game = new Game(store);
  await Promise.all([game.fuse(request), game.fuse(request)]);
  assert.equal(writes, 1);
  assert.equal(quantity(saved, 'eiffel'), 2);
  assert.equal(quantity(saved, 'eiffel+'), 1);
  assert.deepEqual(saved.placements, [
    { landmark: 'eiffel', cell: 2 },
    { landmark: 'eiffel+', cell: 1, rotation: 1 },
  ]);
  assert.deepEqual(saved.floors, before.floors);
  assert.deepEqual(saved.receipts, before.receipts);
  assert.equal(materials(saved), materials(before));
  assert.equal(decorationQuantity(saved, 'eiffel-plus-star'), 1);
  assert.equal(saved.fusions[0].from, 0);
  assert.equal(saved.fusions[0].cell, 1);
  assert.deepEqual(decodeBackup(encodeBackup(saved)).state, saved);
  await assert.rejects(game.fuse({ ...request, cell: 2 }), /already used/);
  await assert.rejects(
    game.fuse({ id: request.id, landmark: request.landmark }),
    /already used/,
  );
  await assert.rejects(
    game.replaceLayout({ layout: layout(before), expected: layout(saved) }),
    /ownership/,
  );
  assert.throws(
    () => validate({ ...saved, fusions: [{ ...saved.fusions[0], from: 1 }] }),
    /fusion ledger/,
  );
  assert.throws(
    () =>
      validate({
        ...saved,
        fusions: [{ ...saved.fusions[0], cell: undefined }],
      }),
    /fusion ledger/,
  );
  const committed = structuredClone(saved);
  saved = fixture();
  const expected = layout(saved);
  saved.floors.push({ cell: 3, decoration: 'grass' });
  const stale = structuredClone(saved);
  await assert.rejects(
    game.fuse({ ...request, id: 'stale', expected }),
    /layout changed/,
  );
  assert.deepEqual(saved, stale);
  saved = fixture();
  const competing = [1, 2].map((cell) =>
    game.fuse({
      ...request,
      id: `race-${cell}`,
      cell,
      expected: layout(saved),
    }),
  );
  const results = await Promise.allSettled(competing);
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1);
  assert.equal(saved.fusions.length, 1);
  assert.equal(quantity(saved, 'eiffel+'), 1);
  saved = structuredClone(committed);
  await assert.rejects(
    game.fuse({
      ...request,
      id: 'cannot-fuse-plus',
      from: 1,
      cell: 2,
      expected: layout(saved),
    }),
  );
  for (const id of ['halong', 'liriver']) {
    saved = fixture(id);
    if (id === 'liriver')
      saved.floors = [0, 1].map((cell) => ({ cell, decoration: 'river' }));
    if (id === 'halong') {
      saved.placements[0].cell = 575;
      saved.placements[1].cell = 574;
    }
    saved = validate(saved);
    const floors = structuredClone(saved.floors),
      source = saved.placements[0].cell,
      destination = saved.placements[1].cell;
    await game.fuse({
      id: `surface-${id}`,
      landmark: id,
      from: source,
      cell: destination,
      expected: layout(saved),
    });
    assert.ok(
      saved.placements.some(
        (p) => p.cell === destination && p.landmark === `${id}+`,
      ),
    );
    assert.deepEqual(saved.floors, floors);
  }
  console.log(
    'PASS: placed fusion atomicity, destination/facing/floor preservation, stale layouts, race/replay/restart identity, backup, gift conservation and land/sea/river pairs',
  );
}
