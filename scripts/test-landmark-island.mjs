import { testFusion } from './test-landmark-fusion.mjs';
import { build } from 'esbuild';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { testWeather } from './test-landmark-weather.mjs';
import { testExpeditions } from './test-landmark-expeditions.mjs';
const dir = await mkdtemp(join(tmpdir(), 'landmark-test-'));
try {
  await build({
    entryPoints: [
      'plugins/landmark-island/src/game.ts',
      'plugins/landmark-island/src/art.ts',
      'plugins/landmark-island/src/i18n.ts',
      'plugins/landmark-island/src/decorations.ts',
      'plugins/landmark-island/src/walk.ts',
      'plugins/landmark-island/src/world.ts',
      'plugins/landmark-island/src/worker/main.ts',
      'plugins/landmark-island/src/worker/weather.ts',
      'plugins/landmark-island/src/weather.ts',
    ],
    outdir: dir,
    outbase: 'plugins/landmark-island/src',
    bundle: true,
    platform: 'node',
    format: 'esm',
    outExtension: { '.js': '.mjs' },
  });
  await testWeather(dir);
  await testExpeditions(dir);
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
  await testFusion({
    Game,
    empty,
    quantity: (await import(pathToFileURL(join(dir, 'game.mjs')))).quantity,
    validate,
    materials,
    decorationQuantity,
    encodeBackup,
    decodeBackup,
    landmarks,
  });
  assert.equal(landmarks.length, 300);
  assert.equal(
    createHash('sha256')
      .update(JSON.stringify(landmarks.slice(0, 100)))
      .digest('hex'),
    (await readFile('scripts/data/orcatopia-legacy100.sha256', 'utf8')).trim(),
  );
  assert.equal(new Set(landmarks.map((l) => l.id)).size, 300);
  assert.equal(new Set(landmarks.map((l) => l.code)).size, 101);
  assert.equal(decorations.length, 908);
  for (const code of ['KOR', 'SGP', 'ESP']) {
    const entries = landmarks.filter((l) => l.code === code);
    assert.ok(entries.length >= 2);
    assert.equal(new Set(entries.map((l) => l.country)).size, 1);
    assert.equal(
      new Set(entries.map((l) => translate(l.country, 'ko-KR'))).size,
      1,
    );
  }
  for (const [tier, count, roll] of [
    ['common', 153, 0.35],
    ['rare', 115, 0.8],
    ['epic', 24, 0.95],
    ['legendary', 8, 0.995],
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
  const { art } = await import(pathToFileURL(join(dir, 'art.mjs')));
  const illustrations = new Map();
  const repeatedGeometry = [];
  for (const entry of landmarks.slice(100)) {
    const markup = art(entry.id);
    assert.ok(markup.includes('class="expanded-landmark"'), entry.id);
    assert.ok(markup.includes(`data-landmark-life="${entry.id}"`), entry.id);
    const geometry =
      markup.match(/<g class="expanded-landmark"[\s\S]*?<\/g>/)?.[0] ?? '';
    const signature = [
      ...geometry.matchAll(
        /(?: d|points|cx|cy|rx|ry|x|y|width|height)="([^"]+)"/g,
      ),
    ]
      .map((m) => m[1])
      .join('|');
    const prior = illustrations.get(signature);
    if (prior) repeatedGeometry.push(`${prior} / ${entry.id}`);
    illustrations.set(signature, entry.id);
  }
  assert.deepEqual(repeatedGeometry, []);
  for (const landmark of landmarks) {
    assert.ok(Number.isFinite(landmark.lat) && Math.abs(landmark.lat) <= 90);
    assert.ok(Number.isFinite(landmark.lon) && Math.abs(landmark.lon) <= 180);
    assert.match(
      landmark.source,
      /^https:\/\/(?:www\.wikidata\.org\/wiki\/Q\d+|whc\.unesco\.org\/en\/list\/\d+\/)$/,
    );
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
  const {
    tiles,
    landTiles,
    landAtLevel,
    expansionLevel,
    WORLD_W,
    WORLD_H,
    neighbours,
    solidProps,
    isLand,
    project,
    at,
  } = await import(pathToFileURL(join(dir, 'world.mjs')));
  assert.equal(tiles.length, 1600);
  assert.equal(landTiles.length, 1044);
  assert.equal(new Set(tiles.map((t) => `${t.col},${t.row}`)).size, 1600);
  const digest = (value) =>
    createHash('sha256').update(JSON.stringify(value)).digest('hex');
  assert.equal(
    digest(tiles.slice(0, 576).map(({ id, col, row }) => ({ id, col, row }))),
    '37a522f6b88221beebbc915a7d69de57c640ebfb93382de2a772061a4c5f7635',
  );
  assert.equal(
    digest(
      landAtLevel(12).map((t) => ({ ...t, level: expansionLevel.get(t.id) })),
    ),
    'cc702bdb20281bbd056d4bcd4a83b376991930db66c7840c3b650bfe5361000e',
  );
  for (const tile of landTiles) {
    const p = project(tile.id);
    assert.ok(
      p.x >= 40 && p.x <= WORLD_W - 40 && p.y >= 20 && p.y <= WORLD_H - 20,
    );
    assert.ok(p.depth >= 0);
  }
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
  // Ten-ticket draws commit once, validate before randomness, and replay safely.
  {
    let batchState = empty(),
      batchWrites = 0,
      randomCalls = 0;
    let saveMode = 'ok';
    const batchStore = {
      read: async () => structuredClone(batchState),
      write: async (next) => {
        if (saveMode === 'fail') throw Error('batch disk full');
        batchState = structuredClone(next);
        batchWrites++;
        if (saveMode === 'lost') {
          saveMode = 'ok';
          throw Error('batch response lost');
        }
      },
    };
    const batchGame = new Game(batchStore, () => {
      randomCalls++;
      return 0;
    });
    for (let i = 0; i < 20; i++)
      await batchGame.acquire({ workspaceId: `batch-${i}`, kind: 'worktree' });
    const ticketIds = batchState.tickets.slice(0, 10).map((t) => t.workspaceId);
    for (const input of [
      null,
      {},
      { ticketIds: ticketIds.slice(1) },
      { ticketIds: [...ticketIds, 'batch-10'] },
      { ticketIds: Array(10).fill(ticketIds[0]) },
      { ticketIds: [...ticketIds.slice(1), 42] },
      { ticketIds: [...ticketIds.slice(1), 'missing'] },
    ])
      await assert.rejects(batchGame.redeemMany(input));
    assert.equal(randomCalls, 0);
    assert.equal(batchWrites, 20);
    saveMode = 'fail';
    await assert.rejects(batchGame.redeemMany({ ticketIds }), /disk full/);
    assert.equal(batchState.receipts.length, 0);
    assert.equal(availableTickets(batchState).length, 20);
    saveMode = 'ok';
    await Promise.all([
      batchGame.redeemMany({ ticketIds }),
      batchGame.redeemMany({ ticketIds }),
      batchGame.redeem({ ticketId: ticketIds[0] }),
    ]);
    assert.equal(batchWrites, 21);
    assert.equal(batchState.receipts.length, 10);
    assert.equal(materials(batchState), 9 * 3);
    const first = structuredClone(batchState.receipts);
    const calls = randomCalls;
    await new Game(batchStore, () => {
      throw Error('must not reroll');
    }).redeemMany({ ticketIds });
    assert.deepEqual(batchState.receipts, first);
    assert.equal(randomCalls, calls);
    const overlap = batchState.tickets.slice(5, 15).map((t) => t.workspaceId);
    await batchGame.redeemMany({ ticketIds: overlap });
    assert.equal(batchState.receipts.length, 15);
    assert.deepEqual(batchState.receipts.slice(0, 10), first);
    saveMode = 'lost';
    const last = batchState.tickets.slice(10).map((t) => t.workspaceId);
    await assert.rejects(
      batchGame.redeemMany({ ticketIds: last }),
      /response lost/,
    );
    const committed = structuredClone(batchState);
    await new Game(batchStore, () => {
      throw Error('must not reroll');
    }).redeemMany({ ticketIds: last });
    assert.deepEqual(batchState, committed);
    assert.equal(availableTickets(batchState).length, 0);
    assert.equal(batchState.receipts.length, 20);
    console.log(
      'PASS: atomic ten-ticket draw, invalid IDs, failures, overlapping requests and restart/response-loss replay',
    );
  }
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
  assert.equal(oldSave.version, 6);
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
  assert.equal(legacy.version, 6);
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
  assert.deepEqual(Object.keys(events), [
    'workspace.created',
    'agent.status.changed',
  ]);
  assert.deepEqual(Object.keys(handlers), [
    'island.weather',
    'island.read',
    'island.backup',
    'island.restore',
    'island.draw',
    'island.drawMany',
    'island.fuse',
    'island.craft',
    'island.layout',
    'island.paint',
    'island.rotate',
    'island.decorate',
    'island.place',
    'island.expeditions',
    'island.welcome',
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
  const hostBatchIds = Array.from({ length: 10 }, (_, i) => `host-batch-${i}`);
  for (const workspaceId of hostBatchIds)
    await events['workspace.created']({ workspaceId, kind: 'worktree' });
  const beforeBatchPost = posted;
  await handlers['island.drawMany']({ ticketIds: hostBatchIds });
  assert.equal(posted, beforeBatchPost + 1);
  assert.equal((await handlers['island.read']()).receipts.length, 53);
  await handlers['island.drawMany']({ ticketIds: hostBatchIds });
  assert.equal((await handlers['island.read']()).receipts.length, 53);
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
    assert.equal(
      land.size,
      count <= 12
        ? 36 + Math.floor((count * 282) / 12)
        : 318 + Math.floor(((Math.min(count, 100) - 12) * 726) / 88),
    );
    const blocked = new Set(
      landTiles.filter((t) => !land.has(t.id)).map((t) => t.id),
    );
    const connected = new Set([0]);
    for (const id of connected)
      for (const next of neighbours(id))
        if (!blocked.has(next)) connected.add(next);
    assert.equal(connected.size, land.size, `Disconnected stage ${count}`);
    if (count > 0 && count <= 100)
      assert.ok(land.size > priorLand.size, `No growth at discovery ${count}`);
    if (count > 100) assert.equal(land.size, priorLand.size);
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
  assert.equal(islandLand(fullCatalog).length, 1044);
  assert.equal(materials(fullCatalog), 0);
  let paintedIsland = structuredClone(fullCatalog);
  let paintWrites = 0;
  const fullIslandPainter = new Game({
    read: async () => structuredClone(paintedIsland),
    write: async (next) => {
      paintedIsland = structuredClone(next);
      paintWrites++;
    },
  });
  await fullIslandPainter.paint({
    decoration: 'path',
    cells: landTiles.map((t) => t.id),
    expected: layout(paintedIsland),
  });
  assert.equal(paintedIsland.floors.length, 1044);
  assert.equal(paintWrites, 1);
  const afterFullStroke = structuredClone(paintedIsland);
  await assert.rejects(
    fullIslandPainter.paint({
      decoration: 'grass',
      cells: [...landTiles.map((t) => t.id), 99999],
      expected: layout(paintedIsland),
    }),
    /Invalid brush stroke/,
  );
  assert.deepEqual(paintedIsland, afterFullStroke);
  assert.equal(paintWrites, 1);
  assert.deepEqual(paintedIsland.placements, fullCatalog.placements);
  assert.deepEqual(paintedIsland.receipts, fullCatalog.receipts);
  fullCatalog.floors = landTiles.map((t) => ({
    decoration: 'path',
    cell: t.id,
  }));
  assert.deepEqual(decodeBackup(encodeBackup(fullCatalog)).state, fullCatalog);
  assert.ok(
    new TextEncoder().encode(encodeBackup(fullCatalog)).length <
      MAX_BACKUP_BYTES,
  );
  for (const landmark of landmarks)
    assert.equal(decorationQuantity(fullCatalog, `${landmark.id}-gift`), 1);
  console.log(
    'PASS: all 300 catalog draws across 101 countries, 908 decorations, localized descriptions, full-catalog backup and preserved legacy land',
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
  assert.throws(() => validate({ ...garden, landFloor: 101 }));
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
  await assert.rejects(gardener.rotate({ cell: 4, rotation: 2 }));
  const oldV4 = { ...structuredClone(garden), version: 4 };
  assert.deepEqual(validate(oldV4), garden);
  const beforeFacing = layout(garden);
  const facingReceipts = structuredClone(garden.receipts);
  await gardener.rotate({ cell: 4, rotation: 1, expected: beforeFacing });
  assert.equal(garden.placements.find((p) => p.cell === 4).rotation, 1);
  assert.deepEqual(garden.receipts, facingReceipts);
  assert.deepEqual(decodeBackup(encodeBackup(garden)).state, garden);
  await assert.rejects(
    gardener.rotate({ cell: 4, rotation: 0, expected: beforeFacing }),
  );
  await gardener.place({ from: 4, cell: 6, expected: layout(garden) });
  assert.equal(garden.placements.find((p) => p.cell === 6).rotation, 1);
  await gardener.place({ from: 6, cell: 4, expected: layout(garden) });
  await gardener.replaceLayout({
    expected: layout(garden),
    layout: beforeFacing,
  });
  assert.deepEqual(layout(garden), beforeFacing);
  for (const rotation of [-1, 2, 0.5, '1', null])
    assert.throws(() =>
      validate({
        ...garden,
        placements: garden.placements.map((p) => ({ ...p, rotation })),
      }),
    );
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
  assert.equal(migratedV3.version, 6);
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
