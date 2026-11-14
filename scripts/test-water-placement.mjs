import assert from 'node:assert/strict';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function testWaterPlacement(dir) {
  const load = (file) => import(pathToFileURL(join(dir, file + '.mjs')));
  const {
    Game,
    empty,
    validate,
    islandLand,
    islandLevel,
    surfaceAt,
    decorationQuantity,
    materials,
    layout,
    encodeBackup,
    decodeBackup,
  } = await load('game');
  const { tiles, at, landTiles } = await load('world');
  const { placementType } = await load('placement');
  const { terrain } = await load('terrain-art');
  const broad = empty();
  broad.floors = [0, 1, 6, 7].map((cell) => ({ cell, decoration: 'river' }));
  assert.equal(
    (terrain(broad).match(/data-river-wide="true"/g) ?? []).length,
    4,
  );
  broad.floors = [0, 1].map((cell) => ({ cell, decoration: 'river' }));
  assert.equal(
    (terrain(broad).match(/data-river-wide="true"/g) ?? []).length,
    0,
  );
  assert.equal(placementType('halong'), 'sea');
  assert.equal(placementType('halong+'), 'sea');
  assert.equal(placementType('papahanaumokuakea'), 'sea');
  assert.equal(placementType('venice+'), 'coastal');
  assert.equal(placementType('eiffel'), 'land');
  let saved = empty();
  for (const landmark of ['halong', 'eiffel', 'venice']) {
    saved.tickets.push({ workspaceId: landmark, at: '2026-11-14' });
    saved.receipts.push({ workspaceId: landmark, landmark, at: '2026-11-14' });
  }
  const store = {
    read: async () => structuredClone(saved),
    write: async (s) => {
      saved = structuredClone(s);
    },
  };
  let game = new Game(store);
  const land = new Set(islandLand(saved).map((t) => t.id));
  const coast = islandLand(saved).find((t) => {
    const id = at(t.col + 1, t.row);
    return id !== undefined && !land.has(id);
  });
  const sea = at(coast.col + 1, coast.row);
  const nextSea = at(coast.col + 2, coast.row);
  const level = islandLevel(saved);
  await game.place({ cell: sea, landmark: 'halong' });
  assert.equal(islandLevel(saved), level);
  assert.equal(islandLand(saved).length, land.size);
  assert.match(terrain(saved), new RegExp('data-world-cell="' + sea + '"'));
  assert.match(terrain(saved), /sea-tile/);
  const expected = layout(saved);
  await assert.rejects(game.place({ cell: sea, landmark: 'venice' }), /empty/);
  await assert.rejects(
    game.place({ cell: nextSea, landmark: 'eiffel' }),
    /not unlocked/,
  );
  await assert.rejects(game.decorate({ cell: nextSea, decoration: 'river' }));
  await assert.rejects(game.place({ cell: -1, landmark: 'halong' }));
  await assert.rejects(game.place({ cell: tiles.length, landmark: 'halong' }));
  assert.deepEqual(layout(saved), expected);
  await game.rotate({ cell: sea, rotation: 1 });
  await game.place({ cell: nextSea, from: sea });
  assert.equal(saved.placements[0].rotation, 1);
  game = new Game(store);
  assert.deepEqual(decodeBackup(encodeBackup(saved)).state, saved);
  await game.place({ cell: nextSea });
  assert.deepEqual(saved.placements, []);
  await game.place({ cell: 0, landmark: 'halong' });
  assert.equal(validate(saved).placements[0].cell, 0);
  await game.place({ cell: sea, from: 0 });
  await game.place({ cell: nextSea, landmark: 'venice' });
  await game.decorate({ cell: coast.id, decoration: 'river' });
  assert.match(
    terrain(saved),
    new RegExp('data-river-to="' + sea + '" data-river-mouth="true"'),
  );
  const riverLayout = layout(saved);
  const inland = at(coast.col - 1, coast.row);
  if (land.has(inland)) {
    await game.paint({
      decoration: 'river',
      cells: [inland],
      expected: layout(saved),
    });
    assert.match(
      terrain(saved),
      new RegExp('data-river-to="' + coast.id + '" data-river-mouth="false"'),
    );
  }
  assert.deepEqual(decodeBackup(encodeBackup(saved)).state, saved);
  await game.replaceLayout({ layout: riverLayout, expected: layout(saved) });
  assert.deepEqual(layout(saved), riverLayout);
  const grown = validate({ ...saved, landFloor: 100 });
  assert.deepEqual(grown.placements, saved.placements);
  assert.ok(landTiles.some((t) => t.id === sea));
  assert.doesNotMatch(
    terrain(grown),
    new RegExp('data-river-to="' + sea + '" data-river-mouth="true"'),
  );
  saved = empty();
  const ids = [
    'halong',
    'kinderdijk',
    'liriver',
    'greatbarrierreef',
    'bluehole',
    'geirangerfjord',
    'rockislands',
    'middlerhine',
    ...Array(12).fill('halong'),
  ];
  for (const [i, landmark] of ids.entries()) {
    saved.tickets.push({ workspaceId: `water-${i}`, at: '2026-11-14' });
    saved.receipts.push({
      workspaceId: `water-${i}`,
      landmark,
      at: '2026-11-14',
    });
  }
  game = new Game(store);
  const open = new Set(islandLand(saved).map((t) => t.id));
  const waterCells = landTiles.filter((t) => !open.has(t.id));
  const waterCell = waterCells[0].id,
    otherWater = waterCells[1].id;
  const marineGift = 'halong-water-gift',
    riverGift = 'kinderdijk-water-gift';
  assert.equal(placementType('kinderdijk+'), 'river');
  assert.equal(placementType('greatbarrierreef+'), 'sea');
  assert.equal(decorationQuantity(saved, marineGift), 1);
  assert.equal(decorationQuantity(saved, riverGift), 1);
  await game.paint({
    decoration: 'river',
    cells: [0, 1, 2],
    expected: layout(saved),
  });
  for (const [decoration, cell] of [
    [marineGift, 0],
    [marineGift, 3],
    [riverGift, waterCell],
    [riverGift, 3],
  ]) {
    const before = structuredClone(saved);
    await assert.rejects(game.decorate({ cell, decoration }), /matching/);
    assert.deepEqual(saved, before);
  }
  await assert.rejects(game.place({ cell: 2, landmark: 'halong' }));
  await assert.rejects(game.place({ cell: otherWater, landmark: 'liriver' }));
  await game.place({ cell: 1, landmark: 'liriver' });
  await game.decorate({ cell: 0, decoration: riverGift });
  await game.decorate({ cell: waterCell, decoration: marineGift });
  const withWater = structuredClone(saved);
  await assert.rejects(
    game.paint({ decoration: 'grass', cells: [0, 2], expected: layout(saved) }),
    /decoration/,
  );
  assert.deepEqual(saved, withWater);
  await assert.rejects(game.decorate({ cell: 2, from: waterCell }), /matching/);
  await assert.rejects(
    game.decorate({ cell: otherWater, from: 0 }),
    /matching/,
  );
  await assert.rejects(
    game.decorate({ cell: otherWater, decoration: marineGift }),
    /ownership/,
  );
  const beforeCraft = materials(saved);
  await game.craft({ id: 'sea-special', decoration: 'halong-water-special' });
  assert.equal(materials(saved), beforeCraft - 6);
  await game.craft({ id: 'sea-special', decoration: 'halong-water-special' });
  assert.equal(materials(saved), beforeCraft - 6);
  await game.decorate({ cell: otherWater, decoration: 'halong-water-special' });
  assert.match(terrain(saved), /water-decoration-art/);
  game = new Game(store);
  assert.deepEqual(decodeBackup(encodeBackup(saved)).state, saved);
  saved = validate({ ...saved, landFloor: 100 });
  assert.equal(surfaceAt(saved, waterCell), 'sea');
  assert.ok(!islandLand(saved).some((t) => t.id === waterCell));
  const full = layout(saved);
  await game.decorate({ cell: waterCell });
  assert.equal(surfaceAt(saved, waterCell), 'land');
  await game.replaceLayout({ layout: full, expected: layout(saved) });
  assert.equal(surfaceAt(saved, waterCell), 'sea');
  assert.deepEqual(decodeBackup(encodeBackup(saved)).state, saved);
  console.log(
    'PASS: exclusive sea/river decorations, gifts and craft costs, cross-surface rejection, atomic river-floor edits, water reservation through growth, backup and undo',
  );
  console.log(
    'PASS: land/sea classification, coastal rivers, sea placement/move/rotation/removal, ownership, restart, backup, undo and island growth',
  );
}
