/** Stable world addresses: the original 36 cells remain the central 6×6 plaza. */
export const SIZE = 24;
export const TILE_W = 80,
  TILE_H = 40;
export const WORLD_W = SIZE * TILE_W + 160,
  WORLD_H = SIZE * TILE_H + 240;
export type Tile = {
  id: number;
  col: number;
  row: number;
  land: boolean;
  height: number;
  kind: 'grass' | 'sand' | 'path' | 'rock';
  region: string;
  prop: 'pine' | 'oak' | 'rock' | 'flowers' | null;
};
const coordinates: [number, number][] = [];
for (let row = 9; row < 15; row++)
  for (let col = 9; col < 15; col++) coordinates.push([col, row]);
for (let row = 0; row < SIZE; row++)
  for (let col = 0; col < SIZE; col++)
    if (!(col >= 9 && col < 15 && row >= 9 && row < 15))
      coordinates.push([col, row]);
export const tiles: Tile[] = coordinates.map(([col, row], id) => {
  const edge = Math.hypot((col - 11.5) / 10.6, (row - 11.5) / 10.1);
  const coast =
    1 + Math.sin(col * 0.8 + row * 0.5) * 0.045 + Math.cos(row * 1.1) * 0.035;
  const lake = Math.hypot(col - 17, row - 7) < 1.8;
  const land = id < 36 || (edge < coast && !lake);
  const hill = Math.hypot(col - 6, row - 7);
  const height =
    id < 36 ? 16 : edge > 0.86 ? 4 : hill < 2.5 ? 48 : hill < 4.3 ? 32 : 16;
  const path =
    land &&
    (col === 11 ||
      col === 12 ||
      row === 12 ||
      (row === 7 && col >= 6 && col <= 12) ||
      (col === 6 && row >= 7 && row <= 12));
  const kind =
    land && edge > 0.86
      ? 'sand'
      : path
        ? 'path'
        : hill < 2.3
          ? 'rock'
          : 'grass';
  const hash = (col * 17 + row * 31 + col * row * 7) % 31;
  const region =
    id < 36
      ? 'Landmark Commons'
      : hill < 4.3
        ? 'Pinecrest Heights'
        : col > 14 && row < 11
          ? 'Moonwater Lagoon'
          : row > 15
            ? 'Sunflower Meadows'
            : col < 8
              ? 'Whispering Woods'
              : 'Coral Coast';
  // Spaced trunks leave walking corridors between forest patches.
  const prop =
    !land || path || id < 36 || kind === 'sand'
      ? null
      : col % 3 === 0 && row % 2 === 0
        ? kind === 'rock' || hash % 5 === 0
          ? 'rock'
          : col < 11
            ? 'pine'
            : 'oak'
        : kind !== 'rock' && hash < 8
          ? 'flowers'
          : null;
  return { id, col, row, land, height, kind, region, prop };
});
export const landTiles = tiles.filter((t) => t.land);
const byCoordinate = new Map(tiles.map((t) => [`${t.col},${t.row}`, t.id]));
export const at = (col: number, row: number) =>
  byCoordinate.get(`${col},${row}`);
// Grade coastal terraces into walkable steps without changing cell identity.
for (let pass = 0; pass < SIZE; pass++)
  for (const tile of landTiles) {
    for (const [dx, dy] of [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
    ]) {
      const id = at(tile.col + dx, tile.row + dy);
      if (id !== undefined && tiles[id].land)
        tile.height = Math.min(tile.height, tiles[id].height + 16);
    }
  }
export function isLand(id: number) {
  return Number.isInteger(id) && Boolean(tiles[id]?.land);
}
export function neighbours(id: number) {
  const t = tiles[id];
  return t
    ? [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
      ]
        .map(([x, y]) => at(t.col + x, t.row + y))
        .filter(
          (n): n is number =>
            n !== undefined &&
            isLand(n) &&
            Math.abs(tiles[n].height - t.height) <= 16,
        )
    : [];
}
export function project(id: number) {
  const t = tiles[id];
  return {
    x: WORLD_W / 2 + ((t.col - t.row) * TILE_W) / 2,
    y: 120 + ((t.col + t.row) * TILE_H) / 2 - t.height,
    depth: (t.col + t.row) * 100 + t.col * 2,
  };
}
export const solidProps = new Set(
  landTiles
    .filter((t) => t.prop === 'pine' || t.prop === 'oak' || t.prop === 'rock')
    .map((t) => t.id),
);

// Breadth-first coast growth keeps each unlocked prefix connected to the commons.
// IDs and coordinates never move when the coastline expands.
const expansionOrder = Array.from({ length: 36 }, (_, i) => i);
const reached = new Set(expansionOrder);
for (let i = 0; i < expansionOrder.length; i++) {
  for (const id of neighbours(expansionOrder[i])) {
    if (!reached.has(id)) {
      reached.add(id);
      expansionOrder.push(id);
    }
  }
}
export const expansionLevel = new Map(
  expansionOrder.map((id, rank) => [
    id,
    rank < 36 ? 0 : Math.ceil(((rank - 35) * 12) / (landTiles.length - 36)),
  ]),
);
export function landAtLevel(level: number) {
  return landTiles.filter(
    (t) => (expansionLevel.get(t.id) ?? Infinity) <= level,
  );
}
