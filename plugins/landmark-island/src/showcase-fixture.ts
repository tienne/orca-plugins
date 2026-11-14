import {
  empty,
  validate,
  islandLand,
  canPlaceLandmark,
  canPlaceDecoration,
} from './game';
import { at, tiles } from './world';
import { decorationById, DUPLICATE_MATERIALS } from './decorations';

export function showcaseFixture() {
  const state = empty();
  const acquire = (landmark: string) => {
    const workspaceId = `showcase-water-${state.tickets.length}`;
    state.tickets.push({ workspaceId, at: '2026-11-14' });
    state.receipts.push({ workspaceId, landmark, at: '2026-11-14' });
  };
  [
    'halong',
    'greatbarrierreef',
    'bluehole',
    'rockislands',
    'geirangerfjord',
    'papahanaumokuakea',
    'montsaintmichel',
    'opera',
    'belem',
    'venice',
    'liriver',
    'middlerhine',
    'mostar',
    'pontdugard',
    'kinderdijk',
    'dujiangyan',
    'taj',
    'eiffel',
    'petra',
    'angkor',
    'machu',
    'fuji',
    'neuschwanstein',
    'colosseum',
    'stonehenge',
    'sagrada',
    'cn',
    'gyeongbokgung',
  ].forEach(acquire);
  const land = islandLand(state);
  const landIds = new Set(land.map((t) => t.id));
  const cell = (col: number, row: number) => at(col, row)!;
  let mouth = 10;
  while (landIds.has(cell(mouth, 12))) mouth++;
  const river = (col: number, row: number) =>
    (col >= 7 &&
      Math.abs(row - (col >= 12 && col <= 16 ? 13 : 12)) <=
        (col >= mouth - 4 ? 2 : 1)) ||
    (col >= 12 && col <= 14 && row >= 5 && row <= 12);
  const promenade = (col: number, row: number) =>
    row === 8 ||
    row === 17 ||
    col === 8 ||
    col === 18 ||
    (row === 20 && col >= 6 && col <= 18);
  for (const t of land)
    state.floors.push({
      cell: t.id,
      decoration: river(t.col, t.row)
        ? 'river'
        : promenade(t.col, t.row)
          ? 'stonepath'
          : t.col > 15 && t.row > 15
            ? 'path'
            : 'grass',
    });
  const reserved = new Set<number>();
  const place = (landmark: string, col: number, row: number) => {
    const address = cell(col, row);
    if (reserved.has(address) || !canPlaceLandmark(state, landmark, address))
      throw new Error(`Invalid resort landmark: ${landmark} at ${col},${row}`);
    state.placements.push({ landmark, cell: address });
    reserved.add(address);
  };
  for (const [id, col, row] of [
    ['liriver', 8, 12],
    ['mostar', 12, 13],
    ['pontdugard', 16, 13],
    ['kinderdijk', 19, 12],
    ['middlerhine', mouth - 2, 12],
    ['dujiangyan', 13, 6],
    ['fuji', 6, 6],
    ['taj', 10, 6],
    ['angkor', 4, 12],
    ['machu', 5, 16],
    ['colosseum', 8, 19],
    ['eiffel', 12, 18],
    ['petra', 17, 18],
    ['neuschwanstein', 19, 8],
    ['sagrada', 18, 5],
    ['stonehenge', 16, 21],
  ] as const)
    place(id, col, row);
  const water = tiles.filter(
    (t) =>
      !landIds.has(t.id) &&
      land.some((l) => Math.abs(l.col - t.col) + Math.abs(l.row - t.row) <= 5),
  );
  const seaNear = (col: number, row: number, gap: number) =>
    water
      .filter(
        (t) =>
          !reserved.has(t.id) &&
          state.placements.every(
            (p) =>
              Math.abs(tiles[p.cell].col - t.col) +
                Math.abs(tiles[p.cell].row - t.row) >=
              gap,
          ),
      )
      .sort(
        (a, b) =>
          Math.hypot(a.col - col, a.row - row) -
          Math.hypot(b.col - col, b.row - row),
      )[0];
  for (const [id, col, row] of [
    ['halong', mouth + 1, 12],
    ['montsaintmichel', mouth, 6],
    ['rockislands', mouth + 4, 9],
    ['bluehole', mouth + 4, 15],
    ['greatbarrierreef', mouth + 1, 19],
    ['opera', 22, 22],
    ['venice', 18, 25],
    ['belem', 12, 25],
    ['papahanaumokuakea', 5, 23],
    ['geirangerfjord', 0, 17],
  ] as const) {
    const tile = seaNear(col, row, 4);
    if (!tile) throw new Error(`No sea space for ${id}`);
    place(id, tile.col, tile.row);
  }
  const used = new Map<string, number>();
  const decorate = (decoration: string, address: number) => {
    if (
      reserved.has(address) ||
      !canPlaceDecoration(state, decoration, address)
    )
      return;
    const definition = decorationById(decoration)!;
    const count = (used.get(decoration) ?? 0) + 1;
    used.set(decoration, count);
    if (definition.cost && count > (definition.gift ? 1 : 0))
      state.crafts.push({
        id: `showcase-craft-${state.crafts.length}`,
        decoration,
      });
    state.decorations.push({ decoration, cell: address });
    reserved.add(address);
  };
  for (const [id, col, row] of [
    ['taj-pavilion', 10, 9],
    ['taj-special', 11, 7],
    ['fuji-pond', 6, 9],
    ['fuji-pond', 4, 8],
    ['fuji-special', 7, 7],
    ['eiffel-rose-arch', 9, 17],
    ['eiffel-rose-arch', 14, 17],
    ['colosseum-special', 9, 19],
    ['sagrada-special', 16, 8],
    ['sagrada-special', 9, 15],
    ['kinderdijk-water-special', 18, 11],
    ['middlerhine-special', 21, 13],
  ] as const)
    decorate(id, cell(col, row));
  const riverDecor = [
    'liriver-gift',
    'mostar-water-gift',
    'pontdugard-water-special',
    'kinderdijk-water-special',
    'middlerhine-gift',
  ];
  const riverTiles = land.filter((t) => river(t.col, t.row));
  for (const t of riverTiles) {
    if ((t.col + t.row * 2) % 4 !== 0 || reserved.has(t.id)) continue;
    decorate(riverDecor[(t.col + t.row) % riverDecor.length], t.id);
  }
  for (const p of state.placements.filter((p) => !landIds.has(p.cell))) {
    const t = tiles[p.cell];
    for (const [dx, dy, id] of [
      [-1, 1, 'halong-water-special'],
      [1, 1, 'greatbarrierreef-gift'],
      [0, -2, 'bluehole-gift'],
    ] as const) {
      const target = seaNear(t.col + dx, t.row + dy, 1);
      if (target) decorate(id, target.id);
    }
  }
  for (const t of land) {
    if (reserved.has(t.id) || river(t.col, t.row)) continue;
    const nearBuilding = state.placements.some(
      (p) =>
        Math.abs(tiles[p.cell].col - t.col) +
          Math.abs(tiles[p.cell].row - t.row) <=
        1,
    );
    if (promenade(t.col, t.row)) {
      if ((t.col + t.row) % 3 === 0 && !nearBuilding)
        decorate((t.col + t.row) % 2 ? 'eiffel-gift' : 'eiffel-special', t.id);
      continue;
    }
    if (nearBuilding) {
      if ((t.col + t.row) % 2 === 0)
        decorate(t.col > 14 ? 'opera-gift' : 'taj-gift', t.id);
      continue;
    }
    const bank = riverTiles.some(
      (r) => Math.abs(r.col - t.col) + Math.abs(r.row - t.row) === 1,
    );
    const shore = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ].some(([dx, dy]) => !landIds.has(cell(t.col + dx, t.row + dy)));
    if (bank)
      decorate(
        (t.col + t.row) % 2 ? 'kinderdijk-gift' : 'angkor-fern-bed',
        t.id,
      );
    else if (shore)
      decorate((t.col + t.row) % 3 ? 'petra-gift' : 'opera-gift', t.id);
    else if ((t.col + t.row * 2) % 4 !== 0)
      decorate(
        t.row < 10
          ? t.col < 11
            ? 'fuji-gift'
            : 'cn-gift'
          : t.col > 11
            ? (t.col + t.row) % 3
              ? 'petra-gift'
              : 'taj-gift'
            : (t.col + t.row) % 3
              ? 'gyeongbokgung-gift'
              : 'angkor-fern-bed',
        t.id,
      );
  }
  const cost = state.crafts.reduce(
    (sum, c) => sum + decorationById(c.decoration)!.cost,
    0,
  );
  for (let i = 0; i < Math.ceil(cost / DUPLICATE_MATERIALS); i++)
    acquire('eiffel');
  return validate(state);
}
