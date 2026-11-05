import { art } from './art';
import {
  landTiles,
  project,
  tiles,
  SIZE,
  WORLD_W,
  WORLD_H,
  type Tile,
} from './world';
import { landmarks, type State } from './game';
const tree = (pine: boolean) =>
  pine
    ? `<svg viewBox="0 0 80 120"><ellipse cx="43" cy="109" rx="29" ry="9" fill="#294f3f35"/><path d="M38 105V55" stroke="#74513c" stroke-width="9"/><path d="M40 3L17 43h11L7 70h15L0 98h80L58 70h15L52 43h11z" fill="#326650"/><path d="M40 3L17 43h11L7 70h15L0 98h40z" fill="#55956b"/><path d="M40 3v95l15-28h-9l9-27H44z" fill="#417e59"/></svg>`
    : `<svg viewBox="0 0 100 116"><ellipse cx="53" cy="106" rx="37" ry="10" fill="#294f3f35"/><path d="M50 105V49m0 30L29 62m21 9 22-21" stroke="#806046" stroke-width="9" stroke-linecap="round"/><path d="M18 75C-9 62 1 34 20 29 18 1 53-6 68 12 99 5 111 39 91 55 106 79 76 97 54 80 37 97 21 88 18 75" fill="#4b8456"/><path d="M18 68C-2 52 10 36 28 34 21 12 46 4 61 20 78 12 94 28 84 44 91 66 64 75 49 60 40 78 25 78 18 68" fill="#79ab65"/><path d="M29 31Q30 15 49 21" fill="none" stroke="#a6c67d" stroke-width="6" stroke-linecap="round"/></svg>`;
const rock = `<svg viewBox="0 0 70 60"><ellipse cx="36" cy="50" rx="32" ry="9" fill="#314d3430"/><path d="M5 44L17 15 43 5 62 25 64 47 36 57z" fill="#788c83"/><path d="M17 15L43 5 44 35 5 44z" fill="#b1b8a0"/><path d="M44 35L62 25 64 47 36 57z" fill="#5f786f"/></svg>`;
const flowers = `<svg viewBox="0 0 80 40"><path d="M18 34l2-15m12 13 2-11m16 12 3-19m7 21 5-10" stroke="#678a4a" stroke-width="2"/><g fill="#f7dc7c"><circle cx="20" cy="16" r="5"/><circle cx="34" cy="20" r="4"/><circle cx="53" cy="12" r="5"/></g><g fill="#edac9e"><circle cx="64" cy="23" r="4"/><circle cx="42" cy="27" r="3"/></g></svg>`;
const colors: Record<Tile['kind'], string[]> = {
  grass: ['#9cb97a', '#a3bf80', '#94b176', '#a9c486'],
  sand: ['#e7d29b', '#e0c88e', '#e9d6a4'],
  path: ['#d4c3a0', '#d9c9a8', '#d0bf9a'],
  rock: ['#a3b298', '#9baa90', '#b2bba3'],
};
export function terrain(state: State, selectedCell?: number) {
  const placements = new Map(state.placements.map((p) => [p.cell, p.landmark]));
  return `<div class="world-ground" style="width:${WORLD_W}px;height:${WORLD_H}px">${landTiles
    .map((t) => {
      const p = project(t.id),
        id = placements.get(t.id),
        landmark = landmarks.find((l) => l.id === id),
        fill = colors[t.kind][(t.col * 7 + t.row * 3) % colors[t.kind].length],
        h = t.height + 14;
      const label = `Cell ${t.id + 1}: ${landmark ? landmark.name : 'empty'}`;
      const decoration = id
        ? `<div class="world-object building" data-depth="${p.depth}">${art(id)}<span class="building-label">${landmark!.name}</span></div>`
        : t.prop
          ? `<div class="world-object ${t.prop}" aria-hidden="true">${t.prop === 'pine' ? tree(true) : t.prop === 'oak' ? tree(false) : t.prop === 'rock' ? rock : flowers}</div>`
          : '';
      return `<div class="world-tile" style="left:${p.x - 40}px;top:${p.y - 20}px;z-index:${p.depth}" data-world-cell="${t.id}"><svg class="tile-base" width="80" height="${40 + h}" viewBox="0 0 80 ${40 + h}" aria-hidden="true"><path d="M0 20L40 40V${40 + h}L0 ${20 + h}Z" fill="${t.kind === 'sand' ? '#c9ae79' : '#8a8b62'}"/><path d="M40 40L80 20V${20 + h}L40 ${40 + h}Z" fill="${t.kind === 'sand' ? '#b89d69' : '#6f7856'}"/><path d="M0 20L40 0 80 20 40 40Z" fill="${fill}"/>${t.kind === 'grass' && t.id % 3 === 0 ? '<path d="M18 21l2-4 1 4m38 1 3-4" stroke="#809d64" stroke-width="1" fill="none"/>' : ''}${t.kind === 'path' ? '<path d="M22 18l14-7m8 18 14-7" stroke="#b7a98a70" stroke-width="1"/>' : ''}</svg><button class="cell ${id ? 'occupied' : ''} ${selectedCell === t.id ? 'selected' : ''}" data-cell="${t.id}" aria-label="${label}" title="${landmark?.name ?? t.region}" tabindex="-1"></button>${decoration}</div>`;
    })
    .join(
      '',
    )}<div class="world-sign" style="left:${project(14).x - 20}px;top:${project(14).y - 65}px;z-index:${project(14).depth + 1}" aria-hidden="true"><span>LANDMARK<br>COMMONS</span></div></div>`;
}
export function minimap() {
  return `<button id="overview" class="minimap" aria-label="Show whole island"><svg viewBox="0 0 ${SIZE * 4} ${SIZE * 4}" aria-hidden="true">${tiles
    .filter((t) => t.land)
    .map(
      (t) =>
        `<rect x="${t.col * 4}" y="${t.row * 4}" width="4.1" height="4.1" fill="${t.kind === 'sand' ? '#dcc494' : t.kind === 'path' ? '#ded1ac' : t.height > 16 ? '#4f7859' : '#8fab6c'}"/>`,
    )
    .join(
      '',
    )}<circle class="mini-player" r="3" fill="#fff0b3" stroke="#244d4f" stroke-width="1.4"/></svg><span>Whole island ↗</span></button>`;
}
