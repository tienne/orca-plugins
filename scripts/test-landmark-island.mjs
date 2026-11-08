import { build } from 'esbuild';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const dir = await mkdtemp(join(tmpdir(), 'landmark-test-'));
try {
  await build({
    entryPoints: [
      'plugins/landmark-island/src/game.ts',
      'plugins/landmark-island/src/i18n.ts',
      'plugins/landmark-island/src/decorations.ts',
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
  const {
    Game,
    layout,
    empty,
    landmarks,
    islandLand,
    islandLevel,
    materials,
    decorationQuantity,
    draw,
    validate,
    availableTickets,
    encodeBackup,
    decodeBackup,
    MAX_BACKUP_BYTES,
  } = await import(pathToFileURL(join(dir, 'game.mjs')));
  const { translate, resolveLocale } = await import(
    pathToFileURL(join(dir, 'i18n.mjs'))
  );
  for (const value of ['fr-FR', 'ja', 'bad_locale', '', undefined, null])
    assert.equal(resolveLocale(value), 'en-US');
  assert.equal(resolveLocale('ko-kr'), 'ko-KR');
  assert.equal(resolveLocale('en-GB'), 'en-GB');
  assert.equal(translate('  World Map ', 'ko-KR'), '  세계 지도 ');
  assert.equal(
    translate('Owned ×3 · 2 available', 'ko-KR'),
    '보유 ×3 · 배치 가능 2개',
  );
  assert.equal(translate('2 decorations placed', 'ko-KR'), '장식 배치 2개');
  assert.equal(translate('Cell 1: Eiffel Tower', 'ko-KR'), '1번 칸: 에펠탑');
  assert.equal(
    translate('☀ Sunny · Day · Auto', 'ko-KR'),
    '☀ 맑음 · 낮 · 자동',
  );
  assert.equal(
    translate(
      'New discovery: Eiffel Tower · owned ×1 · Paris lantern gifted · Theme unlocked · +23 land tiles',
      'ko-KR',
    ),
    '새로운 발견: 에펠탑 · 보유 ×1 · 파리 등불 선물 · 테마 해금 · 땅 +23칸',
  );
  assert.equal(translate('Eiffel Tower', 'en-US'), 'Eiffel Tower');
  const { decorations } = await import(
    pathToFileURL(join(dir, 'decorations.mjs'))
  );
  assert.equal(landmarks.length, 59);
  assert.equal(new Set(landmarks.map((l) => l.id)).size, 59);
  assert.equal(new Set(landmarks.map((l) => l.code)).size, 56);
  assert.equal(decorations.length, 126);
  for (const code of ['KOR', 'SGP', 'ESP']) {
    const entries = landmarks.filter((l) => l.code === code);
    assert.equal(entries.length, 2);
    assert.equal(new Set(entries.map((l) => l.country)).size, 1);
    assert.equal(
      new Set(entries.map((l) => translate(l.country, 'ko-KR'))).size,
      1,
    );
  }
  for (const [tier, count, roll] of [
    ['common', 30, 0.35],
    ['rare', 19, 0.8],
    ['epic', 7, 0.95],
    ['legendary', 3, 0.995],
  ]) {
    const pool = landmarks.filter((l) => l.tier === tier);
    assert.equal(pool.length, count);
    for (let i = 0; i < pool.length; i++) {
      let n = 0;
      assert.equal(
        draw(() => (n++ === 0 ? roll : (i + 0.5) / pool.length)),
        pool[i].id,
      );
    }
  }
  for (const landmark of landmarks) {
    assert.ok(Number.isFinite(landmark.lat) && Math.abs(landmark.lat) <= 90);
    assert.ok(Number.isFinite(landmark.lon) && Math.abs(landmark.lon) <= 180);
    assert.match(landmark.source, /^https:\/\/www\.wikidata\.org\/wiki\/Q\d+$/);
    assert.match(landmark.descriptionSource, /^https:\/\//);
    assert.ok(landmark.description.length > 100);
    const set = decorations.filter((d) => d.landmark === landmark.id);
    assert.equal(
      set.length,
      ['fuji', 'taj', 'eiffel', 'angkor'].includes(landmark.id) ? 3 : 2,
    );
    assert.equal(set.filter((d) => d.gift).length, 1);
    for (const d of set) assert.notEqual(translate(d.name, 'ko-KR'), d.name);
  }
  assert.equal(translate('/ 51 discovered', 'ko-KR'), '/ 51종 발견');
  assert.equal(
    translate('51-landmark prototype', 'ko-KR'),
    '랜드마크 51종 프로토타입',
  );

  assert.equal(
    translate('Error: This file is not valid JSON.', 'ko-KR'),
    '오류: 올바른 JSON 파일이 아니에요.',
  );
  assert.equal(
    translate('/private/user-file.json', 'ko-KR'),
    '/private/user-file.json',
  );
  assert.equal(
    translate('https://example.com/World%20Map', 'ko-KR'),
    'https://example.com/World%20Map',
  );
  const koreanCatalog = JSON.parse(
    await readFile('plugins/landmark-island/src/landmarks.ko.json', 'utf8'),
  );
  for (const landmark of landmarks) {
    for (const field of [
      'name',
      'country',
      'region',
      'description',
      'descriptionSourceName',
    ]) {
      assert.equal(
        translate(landmark[field], 'ko-KR'),
        koreanCatalog[landmark.id][field],
        `${landmark.id}.${field}`,
      );
      assert.equal(translate(landmark[field], 'en-US'), landmark[field]);
    }
  }
  assert.ok(
    translate(
      'Current snapshot: 2 unused tickets · 3 landmarks (1 unique) · 1 placed · 2 decorations placed · 4 floor tiles · 6 materials · 59 land tiles',
      'ko-KR',
    ).includes('장식 배치 2개'),
  );
  for (const locale of ['en-US', 'ko-KR'])
    assert.ok(
      !translate(
        '0 unused tickets · Exported 2026-11-06T01:02:03.000Z',
        locale,
      ).includes('T01:02'),
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
  let fixtureRoll = 0;
  let game = new Game(store, () => (fixtureRoll++ % 2 === 0 ? 0.8 : 0));
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
  assert.equal(oldSave.version, 4);
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
  assert.equal(legacy.version, 4);
  assert.equal(availableTickets(legacy).length, 1);
  assert.deepEqual(legacy.receipts, value.receipts);
  assert.deepEqual(legacy.placements, value.placements);
  assert.deepEqual(
    oldSave.placements.map((p) => p.cell),
    Array.from({ length: 36 }, (_, i) => i),
  );
  const expanded = islandLand(value).find((t) => t.id >= 36).id;
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
    [0, 'liberty'],
    [0.7, 'eiffel'],
    [0.93, 'colosseum'],
    [0.99, 'petra'],
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
  // Backup round trips preserve all ledgers and expanded placement addresses.
  let backupState = structuredClone(value),
    previousState = null;
  let failRecovery = false,
    failRestore = false,
    loseRestoreResponse = false;
  let recoveryWrites = 0,
    restoreWrites = 0;
  const backupStore = {
    read: async () => structuredClone(backupState),
    readBackup: async () => structuredClone(previousState),
    writeBackup: async (s) => {
      if (failRecovery) throw Error('recovery disk full');
      previousState = structuredClone(s);
      recoveryWrites++;
    },
    write: async (s) => {
      if (failRestore) throw Error('restore disk full');
      backupState = structuredClone(s);
      restoreWrites++;
      if (loseRestoreResponse) {
        loseRestoreResponse = false;
        throw Error('lost restore response');
      }
    },
  };
  let backups = new Game(backupStore, () => 0);
  await assert.rejects(backups.exportBackup(true), /No pre-restore/);
  const baseline = structuredClone(backupState);
  const exported = await backups.exportBackup();
  assert.deepEqual(decodeBackup(exported).state, baseline);
  assert.equal(restoreWrites, 0);
  const incoming = validate({
    version: 2,
    tickets: [
      { workspaceId: 'imported-spent', at: '2026-11-06' },
      { workspaceId: 'imported-unused', at: '2026-11-06' },
    ],
    receipts: [
      { workspaceId: 'imported-spent', landmark: 'giza', at: '2026-11-06' },
    ],
    placements: [{ landmark: 'giza', cell: expanded }],
  });
  const text = encodeBackup(incoming);
  const envelope = JSON.parse(text);
  for (const bad of [
    '{',
    'null',
    JSON.stringify(incoming),
    JSON.stringify({ ...envelope, version: 99 }),
    JSON.stringify({ ...envelope, state: null }),
    JSON.stringify({ ...envelope, state: { ...incoming, version: 99 } }),
    JSON.stringify({ ...envelope, state: { ...incoming, tickets: [] } }),
    JSON.stringify({
      ...envelope,
      state: { ...incoming, placements: [{ landmark: 'giza', cell: 36 }] },
    }),
    ' '.repeat(MAX_BACKUP_BYTES + 1),
  ]) {
    await assert.rejects(backups.restore({ text: bad, expected: baseline }));
    assert.deepEqual(backupState, baseline);
    assert.equal(recoveryWrites, 0);
  }
  failRecovery = true;
  await assert.rejects(
    backups.restore({ text, expected: baseline }),
    /recovery disk full/,
  );
  assert.deepEqual(backupState, baseline);
  failRecovery = false;
  failRestore = true;
  await assert.rejects(
    backups.restore({ text, expected: baseline }),
    /restore disk full/,
  );
  assert.deepEqual(backupState, baseline);
  assert.deepEqual(previousState, baseline);
  failRestore = false;
  // A background event after preview must be preserved, not overwritten by import.
  await backups.acquire({
    workspaceId: 'arrived-during-preview',
    kind: 'worktree',
  });
  await assert.rejects(
    backups.restore({ text, expected: baseline }),
    /island changed/,
  );
  const withEvent = structuredClone(backupState);
  loseRestoreResponse = true;
  await assert.rejects(
    backups.restore({ text, expected: withEvent }),
    /lost restore response/,
  );
  assert.deepEqual(backupState, incoming);
  assert.deepEqual(previousState, withEvent);
  const savedRecoveryWrites = recoveryWrites;
  backups = new Game(backupStore);
  assert.deepEqual(
    await backups.restore({ text, expected: withEvent }),
    incoming,
  );
  assert.equal(recoveryWrites, savedRecoveryWrites);
  assert.deepEqual(
    decodeBackup(await backups.exportBackup(true)).state,
    withEvent,
  );
  // Repeat import cannot add copies or tickets; the retained copy can be restored.
  await backups.restore({ text, expected: incoming });
  assert.equal(availableTickets(backupState).length, 1);
  const undoText = await backups.exportBackup(true);
  await backups.restore({ text: undoText, expected: incoming });
  assert.deepEqual(backupState, withEvent);
  assert.deepEqual(previousState, incoming);
  const legacyBackup = JSON.stringify({
    ...envelope,
    state: {
      version: 1,
      receipts: incoming.receipts,
      placements: incoming.placements,
    },
  });
  assert.equal(availableTickets(decodeBackup(legacyBackup).state).length, 0);
  const sanitized = decodeBackup(
    JSON.stringify({
      ...envelope,
      state: {
        ...incoming,
        extra: 'discard',
        tickets: incoming.tickets.map((t) => ({ ...t, secret: 'discard' })),
      },
    }),
  ).state;
  assert.deepEqual(sanitized, incoming);
  const { default: activate } = await import(
    pathToFileURL(join(dir, 'worker/main.mjs'))
  );
  const handlers = {},
    events = {};
  let posted = 0,
    hostPrevious = null;
  activate({
    host: {
      call: async (name, input) =>
        name === 'storage.get'
          ? {
              value:
                input.key === 'island-before-restore-v1' ? hostPrevious : value,
            }
          : (input.key === 'island-before-restore-v1'
              ? (hostPrevious = structuredClone(input.value))
              : (value = structuredClone(input.value)),
            { ok: true }),
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
    'island.backup',
    'island.restore',
    'island.draw',
    'island.craft',
    'island.layout',
    'island.paint',
    'island.rotate',
    'island.decorate',
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
  const hostBefore = await handlers['island.read']();
  assert.deepEqual(
    decodeBackup(await handlers['island.backup']({})).state,
    hostBefore,
  );
  await handlers['island.restore']({ text, expected: hostBefore });
  assert.deepEqual(await handlers['island.read'](), incoming);
  assert.deepEqual(
    decodeBackup(await handlers['island.backup']({ previous: true })).state,
    hostBefore,
  );
  // Progression, migration, material conservation, and durable craft request IDs.
  const fixture = (ids) =>
    validate({
      version: 2,
      tickets: ids.map((_, i) => ({
        workspaceId: `garden-${i}`,
        at: '2026-11-06',
      })),
      receipts: ids.map((landmark, i) => ({
        workspaceId: `garden-${i}`,
        landmark,
        at: '2026-11-06',
      })),
      placements: [],
    });
  assert.equal(islandLand(empty()).length, 36);
  let priorLand = new Set();
  for (let count = 0; count <= landmarks.length; count++) {
    const s = fixture(landmarks.slice(0, count).map((l) => l.id));
    const land = new Set(islandLand(s).map((t) => t.id));
    assert.ok([...priorLand].every((id) => land.has(id)));
    assert.equal(land.size, 36 + Math.floor((Math.min(count, 12) * 282) / 12));
    const blocked = new Set(
      landTiles.filter((t) => !land.has(t.id)).map((t) => t.id),
    );
    for (const id of land)
      if (id !== 0)
        assert.ok(
          route(0, id, blocked).length,
          `Disconnected stage ${count} cell ${id}`,
        );
    priorLand = land;
  }

  const fullCatalog = fixture(landmarks.map((l) => l.id));
  fullCatalog.placements = landmarks.map((l, i) => ({
    landmark: l.id,
    cell: landTiles[i].id,
  }));
  fullCatalog.decorations = landmarks.map((l, i) => ({
    decoration: `${l.id}-gift`,
    cell: 36 + i,
  }));
  // Use unlocked land addresses rather than assuming every outer cell is land.
  fullCatalog.decorations.forEach(
    (d, i) => (d.cell = landTiles[landmarks.length + i].id),
  );
  assert.deepEqual(decodeBackup(encodeBackup(fullCatalog)).state, fullCatalog);
  assert.equal(islandLand(fullCatalog).length, 318);
  assert.equal(materials(fullCatalog), 0);
  for (const landmark of landmarks)
    assert.equal(decorationQuantity(fullCatalog, `${landmark.id}-gift`), 1);
  console.log(
    'PASS: all 59 catalog draws across 56 countries, 126 decorations, localized descriptions, full-catalog backup and unchanged land cap',
  );

  // The four focal pieces use the same ownership and durable craft ledger.
  const focalIds = [
    'fuji-pond',
    'taj-pavilion',
    'eiffel-rose-arch',
    'angkor-fern-bed',
  ];
  let focalSave = fixture([
    'fuji',
    'taj',
    'eiffel',
    'angkor',
    ...Array(12).fill('eiffel'),
  ]);
  const focalStore = {
    read: async () => structuredClone(focalSave),
    write: async (s) => {
      focalSave = structuredClone(s);
    },
  };
  let focalGame = new Game(focalStore);
  const lockedGame = new Game({
    read: async () => fixture(Array(20).fill('giza')),
    write: async () => {
      throw Error('Unexpected write');
    },
  });
  for (const [cell, decoration] of focalIds.entries()) {
    await assert.rejects(lockedGame.craft({ id: decoration, decoration }));
    await focalGame.craft({ id: decoration, decoration });
    focalGame = new Game(focalStore);
    await focalGame.craft({ id: decoration, decoration });
    assert.equal(decorationQuantity(focalSave, decoration), 1);
    await focalGame.decorate({ cell, decoration });
    await assert.rejects(focalGame.decorate({ cell: cell + 10, decoration }));
  }
  assert.equal(materials(focalSave), 0);
  assert.equal(focalSave.crafts.length, 4);
  assert.deepEqual(decodeBackup(encodeBackup(focalSave)).state, focalSave);
  await assert.rejects(
    focalGame.craft({ id: 'unfunded', decoration: focalIds[0] }),
  );
  console.log(
    'PASS: focal garden pieces enforce ownership, exact costs, retry/restart safety, placement quantity and backup round-trip',
  );

  let expandedSave = fixture([...landmarks.map((l) => l.id), 'hegra', 'hegra']);
  const expandedGame = new Game({
    read: async () => expandedSave,
    write: async (s) => {
      expandedSave = structuredClone(s);
    },
  });
  await expandedGame.craft({
    id: 'expanded-craft',
    decoration: 'hegra-special',
  });
  await expandedGame.craft({
    id: 'expanded-craft',
    decoration: 'hegra-special',
  });
  assert.equal(materials(expandedSave), 0);
  assert.equal(decorationQuantity(expandedSave, 'hegra-special'), 1);
  assert.equal(decorationQuantity(expandedSave, 'hegra-gift'), 1);
  assert.deepEqual(
    decodeBackup(encodeBackup(expandedSave)).state,
    expandedSave,
  );
  let garden = fixture(['eiffel', 'eiffel', 'eiffel', 'eiffel']);
  assert.equal(islandLand(garden).length, 59);
  assert.equal(materials(garden), 9);
  assert.equal(decorationQuantity(garden, 'eiffel-gift'), 1);
  assert.equal(decorationQuantity(garden, 'eiffel-special'), 0);
  assert.equal(decorationQuantity(garden, 'giza-gift'), 0);
  let gardenWrites = 0,
    loseCraft = false,
    failCraft = false;
  const gardenStore = {
    read: async () => structuredClone(garden),
    write: async (s) => {
      if (failCraft) throw Error('craft disk full');
      garden = structuredClone(s);
      gardenWrites++;
      if (loseCraft) {
        loseCraft = false;
        throw Error('craft response lost');
      }
    },
  };
  let gardener = new Game(gardenStore);
  const lockedCell = landTiles.find(
    (t) => !islandLand(garden).some((u) => u.id === t.id),
  ).id;
  await assert.rejects(
    gardener.place({ cell: lockedCell, landmark: 'eiffel' }),
    /not unlocked/,
  );
  await assert.rejects(
    gardener.decorate({ cell: lockedCell, decoration: 'grass' }),
    /not unlocked/,
  );
  await assert.rejects(
    gardener.craft({ id: 'locked', decoration: 'giza-gift' }),
  );
  await assert.rejects(gardener.craft({ id: 'free', decoration: 'oak' }));
  await assert.rejects(
    gardener.decorate({ cell: 0, decoration: 'eiffel-special' }),
  );
  assert.equal(gardenWrites, 0);
  failCraft = true;
  await assert.rejects(
    gardener.craft({ id: 'first', decoration: 'eiffel-special' }),
  );
  assert.equal(materials(garden), 9);
  failCraft = false;
  loseCraft = true;
  await assert.rejects(
    gardener.craft({ id: 'first', decoration: 'eiffel-special' }),
    /response lost/,
  );
  gardener = new Game(gardenStore);
  await gardener.craft({ id: 'first', decoration: 'eiffel-special' });
  assert.equal(materials(garden), 3);
  assert.equal(decorationQuantity(garden, 'eiffel-special'), 1);
  assert.equal(gardenWrites, 1);
  await assert.rejects(
    gardener.craft({ id: 'first', decoration: 'eiffel-gift' }),
  );
  const raced = await Promise.allSettled([
    gardener.craft({ id: 'second', decoration: 'eiffel-gift' }),
    gardener.craft({ id: 'third', decoration: 'eiffel-gift' }),
  ]);
  assert.equal(raced.filter((r) => r.status === 'fulfilled').length, 1);
  assert.equal(materials(garden), 0);
  assert.equal(decorationQuantity(garden, 'eiffel-gift'), 2);
  await gardener.decorate({ cell: 0, decoration: 'eiffel-special' });
  await assert.rejects(gardener.place({ cell: 0, landmark: 'eiffel' }));
  await gardener.decorate({ cell: 1, from: 0 });
  await gardener.decorate({ cell: 2, decoration: 'grass' });
  await gardener.decorate({ cell: 3, decoration: 'grass' });
  await gardener.place({ cell: 4, landmark: 'eiffel' });
  await assert.rejects(gardener.decorate({ cell: 4, decoration: 'oak' }));
  const fullBackup = encodeBackup(garden);
  assert.deepEqual(decodeBackup(fullBackup).state, garden);
  await gardener.decorate({ cell: 1 });
  assert.equal(decorationQuantity(garden, 'eiffel-special'), 1);
  assert.equal(materials(garden), 0);
  await gardener.decorate({ cell: 5, decoration: 'eiffel-special' });
  await assert.rejects(
    gardener.decorate({ cell: 6, decoration: 'eiffel-special' }),
  );
  const oldOuter = {
    version: 2,
    tickets: garden.tickets,
    receipts: garden.receipts,
    placements: [{ landmark: 'eiffel', cell: landTiles.at(-1).id }],
  };
  const migratedOuter = validate(oldOuter);
  assert.deepEqual(migratedOuter.placements, oldOuter.placements);
  assert.ok(islandLevel(migratedOuter) > 1);
  assert.deepEqual(validate(migratedOuter), migratedOuter);
  assert.throws(() =>
    validate({ ...garden, crafts: [...garden.crafts, garden.crafts[0]] }),
  );
  assert.throws(() => validate({ ...garden, landFloor: 13 }));
  assert.throws(() =>
    validate({
      ...garden,
      decorations: [{ decoration: 'oak', cell: lockedCell }],
    }),
  );
  assert.equal(islandLand(garden).length, 59); // duplicates and decoration edits never grow land
  // Floors share a cell with exactly one object; rotation and a whole brush stroke
  // are reversible without rolling back discoveries or crafting inventory.
  const beforeFloor = layout(garden);
  await gardener.decorate({ cell: 4, decoration: 'stonepath' });
  assert.ok(garden.placements.some((p) => p.cell === 4));
  assert.ok(garden.floors.some((p) => p.cell === 4));
  await gardener.decorate({ cell: 5, decoration: 'grass' });
  await gardener.rotate({ cell: 5, rotation: 3 });
  assert.equal(garden.decorations.find((p) => p.cell === 5).rotation, 3);
  assert.deepEqual(decodeBackup(encodeBackup(garden)).state, garden);
  await assert.rejects(gardener.rotate({ cell: 5, rotation: 4 }));
  await assert.rejects(gardener.rotate({ cell: 4, rotation: 1 }));
  const beforeStroke = layout(garden);
  await gardener.paint({
    decoration: 'stonepath',
    cells: [0, 1, 4, 5],
    expected: beforeStroke,
  });
  const afterStroke = layout(garden);
  assert.equal(
    garden.floors.filter((p) => [0, 1, 4, 5].includes(p.cell)).length,
    4,
  );
  const beforeRewardCount = garden.receipts.length;
  let gardenRoll = 0;
  gardener = new Game(gardenStore, () => (gardenRoll++ % 2 === 0 ? 0.8 : 0));
  await gardener.acquire({ workspaceId: 'during-edit', kind: 'worktree' });
  await gardener.redeem({ ticketId: 'during-edit' });
  await gardener.craft({ id: 'after-stroke', decoration: 'eiffel-gift' });
  const craftsKept = garden.crafts.length;
  await gardener.replaceLayout({ expected: afterStroke, layout: beforeStroke });
  assert.deepEqual(layout(garden), beforeStroke);
  assert.equal(garden.receipts.length, beforeRewardCount + 1);
  assert.equal(garden.crafts.length, craftsKept);
  await gardener.replaceLayout({ expected: afterStroke, layout: beforeStroke }); // lost-response retry
  await assert.rejects(
    gardener.replaceLayout({ expected: beforeFloor, layout: afterStroke }),
    /layout changed/,
  );
  for (const [method, input] of [
    ['place', { cell: 0, landmark: 'eiffel' }],
    ['decorate', { cell: 0, decoration: 'grass' }],
    ['rotate', { cell: 5, rotation: 2 }],
  ]) {
    const stable = structuredClone(garden);
    await assert.rejects(
      gardener[method]({ ...input, expected: beforeFloor }),
      /layout changed/,
    );
    assert.deepEqual(garden, stable);
  }
  const unchangedGarden = structuredClone(garden);
  for (const input of [
    { decoration: 'grass', cells: [0, lockedCell] },
    { decoration: 'oak', cells: [0] },
    { decoration: 'giza-gift', cells: [0] },
    { decoration: 'chichen-gift', cells: [0] },
    { decoration: 'grass', cells: [0, 0] },
  ]) {
    await assert.rejects(
      gardener.paint({ ...input, expected: layout(garden) }),
    );
    assert.deepEqual(garden, unchangedGarden);
  }
  // A valid old v3 floor becomes a floor layer at the same address.
  const oldV3 = {
    ...fixture(['eiffel']),
    version: 3,
    decorations: [{ cell: 0, decoration: 'path' }],
  };
  delete oldV3.floors;
  const migratedV3 = validate(oldV3);
  assert.deepEqual(migratedV3.floors, [{ cell: 0, decoration: 'path' }]);
  assert.deepEqual(migratedV3.decorations, []);
  assert.equal(migratedV3.version, 4);
  assert.throws(() =>
    validate({ ...garden, floors: [{ cell: 0, decoration: 'oak' }] }),
  );
  assert.throws(() =>
    validate({ ...garden, decorations: [{ cell: 1, decoration: 'grass' }] }),
  );
  assert.throws(() =>
    validate({
      ...garden,
      decorations: [{ cell: 1, decoration: 'eiffel-gift', rotation: 1 }],
    }),
  );
  garden = fixture(['stonehenge', 'stonehenge']);
  gardener = new Game(gardenStore);
  await gardener.craft({ id: 'flowers-copy', decoration: 'stonehenge-gift' });
  const flowersBefore = layout(garden);
  await assert.rejects(
    gardener.paint({
      decoration: 'stonehenge-gift',
      cells: [0, 1, 2],
      expected: flowersBefore,
    }),
    /ownership/,
  );
  assert.deepEqual(layout(garden), flowersBefore);
  await gardener.paint({
    decoration: 'stonehenge-gift',
    cells: [0, 1],
    expected: flowersBefore,
  });
  assert.equal(garden.decorations.length, 2);
  await assert.rejects(
    gardener.paint({
      decoration: 'grass',
      cells: [2],
      expected: flowersBefore,
    }),
    /layout changed/,
  );
  await gardener.replaceLayout({
    expected: layout(garden),
    layout: flowersBefore,
  });
  assert.equal(decorationQuantity(garden, 'stonehenge-gift'), 2);
  failCraft = true;
  await assert.rejects(
    gardener.paint({
      decoration: 'grass',
      cells: [0, 1],
      expected: layout(garden),
    }),
    /disk full/,
  );
  failCraft = false;
  assert.deepEqual(layout(garden), flowersBefore);
  console.log(
    'PASS: layered occupancy, floor migration, four-way furniture rotation, atomic strokes, quantity limits, layout-only undo, stale edits and response-loss retry',
  );
  console.log(
    'PASS: connected progressive land, legacy settlement preservation, gifts, duplicate materials, locked cells/sets, craft retry/restart/concurrency, placement ownership/collisions and backup conservation',
  );
  console.log(
    'PASS: concurrent events, duplicates, restart deduplication, placement/movement/removal, validation, failed-save recovery, tier boundaries, worker wiring without panels, backup validation, restore conflicts/recovery/retry',
  );
} finally {
  await rm(dir, { recursive: true, force: true });
}
