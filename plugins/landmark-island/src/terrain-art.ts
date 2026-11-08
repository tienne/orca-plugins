import { art } from './art';
import {
  project,
  at,
  SIZE,
  WORLD_OFFSET,
  WORLD_W,
  WORLD_H,
  type Tile,
} from './world';
import { landmarks, islandLand, type State } from './game';
import { decorationById, decorationArt } from './decorations';
// Original silhouettes with irregular ink contours and layered wash colors.
const tree = (pine: boolean) =>
  pine
    ? `<svg viewBox="0 0 80 120"><ellipse cx="42" cy="110" rx="28" ry="7" fill="#56644925"/><path d="M37 109l2-55h6l2 55" fill="#92765b" stroke="#6e634b" stroke-width="1.3"/><path d="M40 4Q31 22 22 34l7-2Q19 49 12 55l12-1Q12 74 4 80l13-1L3 99q34 13 73-1L61 78l13 2-19-27 12 2-19-24 9 3z" fill="#377b61" stroke="#275a45" stroke-width="1.3" stroke-linejoin="round"/><path d="M40 6Q30 25 24 31l11-3-18 24 16-5L10 78l21-8L9 97q13 5 24 4l6-29-5 2 9-27-6 2 7-23z" fill="#75a668"/><path d="M46 30l8 3M43 51l14 3M42 79l19 4M19 94l7-3M24 67l5-3" stroke="#b3d285" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M43 99v8" stroke="#c0a47a" stroke-width="2"/></svg>`
    : `<svg viewBox="0 0 100 116"><ellipse cx="51" cy="108" rx="35" ry="8" fill="#56644925"/><path d="M44 107l3-49 7-1 3 50M48 83L29 61m24 15 18-20" fill="#a0845e" stroke="#6d684c" stroke-width="2" stroke-linecap="round"/><path d="M12 70Q0 64 7 51 0 40 15 33 11 17 30 17 34 2 48 9 59-2 70 12 87 9 88 27 103 31 94 47 104 60 88 69 86 84 69 80 60 92 45 81 25 93 20 79 8 81 12 70Z" fill="#498a50" stroke="#356946" stroke-width="1.3"/><path d="M12 49Q6 38 22 35 17 20 34 23 38 7 49 16 64 6 70 22 85 15 85 33 95 40 84 49 76 44 69 52 60 44 54 57 42 49 33 58 20 54 12 60" fill="#91bd62"/><path d="M16 69q9 5 17-1m6 9q8-8 16-1m12-11q9 4 16-3M28 35q7-7 14-2m13-10 7 4m8 13 8-2" fill="none" stroke="#c3dc85" stroke-width="2" stroke-linecap="round"/><path d="M28 48l3-3m22-6 3 4m20 16 3-3m-32 9 4-1" stroke="#518342" stroke-width="1.3" stroke-linecap="round"/><path d="M50 88v14" stroke="#d3ba86" stroke-width="2"/></svg>`;
const rock = `<svg viewBox="0 0 70 60"><ellipse cx="36" cy="50" rx="32" ry="9" fill="#234b3438"/><path d="M5 44L17 15 43 5 62 25 64 47 36 57z" fill="#7d9683" stroke="#4e6c55" stroke-width="1"/><path d="M17 15L43 5 44 35 5 44z" fill="#b2bba0"/><path d="M44 35L62 25 64 47 36 57z" fill="#5e7d69"/><path d="M15 20l4-7 24-8 9 10-12 7-8-4-7 9z" fill="#71994c"/><path d="M19 14l21-7-9 7-7 1" fill="#a6c16d"/><path d="M46 32l-7 8 2 8" fill="none" stroke="#54715d" stroke-width="1.4"/></svg>`;
// Uses existing blocked rock cells: ruins are scenery, not a new reward or interaction.
const ruin = `<svg viewBox="0 0 80 110"><ellipse cx="40" cy="99" rx="35" ry="9" fill="#284c3845"/><path d="M12 88l26-14 33 14-29 16z" fill="#84947c" stroke="#486451"/><path d="M24 85V26l9-12 23 4 6 14v54L42 96z" fill="#7e9c88" stroke="#456451" stroke-width="1.5"/><path d="M24 26l18 8v62L24 85z" fill="#a8b69a"/><path d="M24 26l9-12 23 4 6 14-20 2z" fill="#c1c8a4"/><path d="M32 17l8 9 8-3-1-7m-7 14-6 8 4 8" fill="none" stroke="#69836a" stroke-width="1.4"/><path d="M47 46q11-5 10 9t-10 16z" fill="#355f55"/><path class="ruin-rune" d="M51 49v16m-3-11 6 4m-5 4 6-8" fill="none" stroke="#b1e6be" stroke-width="1.5" stroke-linecap="round"/><path d="M19 82l11-5 9 8 16-4 11 7-24 9z" fill="#58874b"/><path d="M27 20l7-7 17 3-7 4-7-2-4 5z" fill="#77a655"/><path d="M21 89l5-9m33 12 4-9" stroke="#91ba66" stroke-width="2"/></svg>`;
const flowers = `<svg viewBox="0 0 80 40"><path d="M18 34l2-15m12 13 2-11m16 12 3-19m7 21 5-10" stroke="#678a4a" stroke-width="2"/><g fill="#f7dc7c"><circle cx="20" cy="16" r="5"/><circle cx="34" cy="20" r="4"/><circle cx="53" cy="12" r="5"/></g><g fill="#edac9e"><circle cx="64" cy="23" r="4"/><circle cx="42" cy="27" r="3"/></g></svg>`;
const colors: Record<Tile['kind'], string[]> = {
  grass: ['#8cb866', '#90bb69', '#89b463', '#8db967'],
  sand: ['#e5d4a3', '#e3d1a0', '#e7d6a7'],
  path: ['#b8bba0', '#bdc1a5', '#b4b99d'],
  rock: ['#b1baa1', '#adb79d', '#b6bfa6'],
};
export function terrain(state: State, selectedCell?: number) {
  const land = islandLand(state);
  const heights = new Map(land.map((tile) => [tile.id, tile.height]));
  const floors = new Map(state.floors.map((p) => [p.cell, p.decoration]));
  const landmarkRotations = new Map(
    state.placements.map((p) => [p.cell, p.rotation ?? 0]),
  );
  const rotations = new Map(
    state.decorations.map((p) => [p.cell, p.rotation ?? 0]),
  );
  const decor = new Map(
    state.decorations.map((p) => [p.cell, decorationById(p.decoration)!]),
  );
  const placements = new Map(state.placements.map((p) => [p.cell, p.landmark]));
  return `<div class="world-ground" style="width:${WORLD_W}px;height:${WORLD_H}px">${islandLand(
    state,
  )
    .map((tile) => {
      const floor = floors.get(tile.id);
      const t = {
        ...tile,
        kind: (floor
          ? floor === 'grass'
            ? 'grass'
            : 'path'
          : tile.kind) as Tile['kind'],
      };
      const p = project(t.id),
        id = placements.get(t.id),
        ornament = decor.get(t.id),
        landmark = landmarks.find((l) => l.id === id),
        fill = floor
          ? decorationById(floor)!.color
          : colors[t.kind][
              (((t.col * 7 + t.row * 3) % colors[t.kind].length) +
                colors[t.kind].length) %
                colors[t.kind].length
            ],
        h = t.height + 14;
      // Internal faces are hidden by adjacent land. Draw only exposed cliffs,
      // including the shorter drops between terraces, so lawns stay continuous.
      const drop = (col: number, row: number) => {
        const neighbour = at(col, row);
        const height =
          neighbour === undefined ? undefined : heights.get(neighbour);
        return height === undefined ? h : Math.max(0, t.height - height);
      };
      const leftDrop = drop(t.col, t.row + 1);
      const rightDrop = drop(t.col + 1, t.row);
      const label = `Cell ${t.id + 1}: ${landmark ? landmark.name : ornament ? ornament.name : floor ? decorationById(floor)!.name : 'empty'}`;
      const decoration = id
        ? `<div class="world-object building" data-rotation="${landmarkRotations.get(t.id) ?? 0}" data-tier="${landmark!.tier}" data-depth="${p.depth}"><button class="building-select" data-site="${t.id}" aria-label="Landmark: ${landmark!.name}" title="${landmark!.name} · ${landmark!.country}">${art(id)}</button><span class="building-label">${landmark!.name} · ${landmark!.country}</span></div>`
        : ornament
          ? `<div class="world-object garden-object ${ornament.walkable ? 'low-object' : ''}" data-decoration="${ornament.id}" data-rotation="${rotations.get(t.id) ?? 0}"><button class="building-select" data-site="${t.id}" aria-label="Decoration: ${ornament.name}">${decorationArt(ornament.id, rotations.get(t.id))}</button></div>`
          : t.prop && !floor
            ? `<div class="world-object ${t.prop}${t.prop === 'rock' && t.kind === 'rock' ? ' ruin' : ''}" aria-hidden="true">${t.prop === 'pine' ? tree(true) : t.prop === 'oak' ? tree(false) : t.prop === 'rock' ? (t.kind === 'rock' ? ruin : rock) : flowers}</div>`
            : '';
      return `<div class="world-tile" style="left:${p.x - 40}px;top:${p.y - 20}px;z-index:${p.depth}" data-world-cell="${t.id}" data-object-key="${id ? `landmark:${id}:${landmarkRotations.get(t.id) ?? 0}` : ornament ? `decor:${ornament.id}:${rotations.get(t.id) ?? 0}` : !floor ? `prop:${t.prop ?? ''}:${t.kind}` : 'none'}"><svg class="tile-base" ${floor ? `data-decoration="${floor}" data-floor="${floor}"` : ''} width="80" height="${40 + h}" viewBox="0 0 80 ${40 + h}" aria-hidden="true">${leftDrop ? `<path d="M0 20L40 40V${40 + leftDrop}L0 ${20 + leftDrop}Z" fill="${t.kind === 'sand' ? '#cdb68a' : '#7f8d5b'}"/>` : ''}${rightDrop ? `<path d="M40 40L80 20V${20 + rightDrop}L40 ${40 + rightDrop}Z" fill="${t.kind === 'sand' ? '#bda880' : '#5e754e'}"/>` : ''}<path d="M0 20L40 0 80 20 40 40Z" fill="${fill}"/>${t.kind === 'grass' && t.id % 3 === 0 ? '<path d="M18 21l2-4 1 4m38 1 3-4" stroke="#809d64" stroke-width="1" fill="none"/>' : ''}${t.kind === 'path' && floor !== 'path' ? '<path d="M8 20l16-8 14 7-16 8zm32 2 17-8 15 7-17 9z" fill="#d5d3b2" stroke="#8b9c7b" stroke-width=".8" opacity=".7"/><path d="M22 16l4 2-3 3m34 1 5-2" fill="none" stroke="#8b9c7b" stroke-width=".8"/>' : ''}</svg><button class="cell ${id || ornament ? 'occupied' : ''} ${selectedCell === t.id ? 'selected' : ''}" data-cell="${t.id}" aria-label="${label}" title="${landmark?.name ?? ornament?.name ?? t.region}" tabindex="-1"></button>${decoration}</div>`;
    })
    .join(
      '',
    )}<div class="world-sign" style="left:${project(14).x - 20}px;top:${project(14).y - 65}px;z-index:${project(14).depth + 1}" aria-hidden="true"><span>The<br>Commons</span><i class="trail-lantern"></i></div></div>`;
}
export function minimap(state: State) {
  return `<button id="overview" class="minimap" aria-label="Show whole island"><svg viewBox="0 0 ${SIZE * 4} ${SIZE * 4}" aria-hidden="true">${islandLand(
    state,
  )
    .map(
      (t) =>
        `<rect x="${(t.col + WORLD_OFFSET) * 4}" y="${(t.row + WORLD_OFFSET) * 4}" width="4.1" height="4.1" fill="${t.kind === 'sand' ? '#dcc494' : t.kind === 'path' ? '#ded1ac' : t.height > 16 ? '#4f7859' : '#8fab6c'}"/>`,
    )
    .join(
      '',
    )}<circle class="mini-player" r="3" fill="#fff0b3" stroke="#244d4f" stroke-width="1.4"/></svg><span>Whole island ↗</span></button>`;
}
