import { Game, empty, landmarks, quantity, type State } from './game';
import { art } from './art';
import { IslandScene } from './scene';
import { terrain } from './terrain-art';
import { landTiles } from './world';
const scene = new IslandScene();
import world from './world.json';
import './style.css';
import './scene.css';
import './world.css';
type Bridge = {
  request(name: string, input: unknown): Promise<State>;
  on(name: string, fn: () => void): unknown;
};
const bridge = (window as unknown as { orca?: { plugin: Bridge } }).orca
  ?.plugin;
const demo = !bridge;
const demoKey = 'landmark-island-demo-v1';
const game = new Game({
  read: async () => JSON.parse(localStorage.getItem(demoKey) ?? 'null'),
  write: async (s) => localStorage.setItem(demoKey, JSON.stringify(s)),
});
let state: State = empty(),
  view = 'island',
  selected = '',
  from: number | undefined,
  busy = false,
  message = 'Every new worktree is a new expedition.',
  error = '';
const root = document.querySelector<HTMLDivElement>('#app')!;
const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );
async function request(name: string, input: unknown = {}) {
  return bridge
    ? bridge.request(name, input)
    : name === 'island.read'
      ? game.snapshot()
      : game.place(input);
}
async function run(action: () => Promise<State>) {
  if (busy) return;
  busy = true;
  error = '';
  render();
  try {
    const next = await action();
    const last = next.receipts.at(-1);
    if (last && next.receipts.length > state.receipts.length)
      message = `${quantity(next, last.landmark) > 1 ? 'Duplicate discovered' : 'New discovery'}: ${landmarks.find((l) => l.id === last.landmark)!.name} · owned ×${quantity(next, last.landmark)}`;
    state = next;
  } catch (e) {
    error = String(e);
  } finally {
    busy = false;
    render();
  }
}
function render() {
  const owned = landmarks.filter((l) => quantity(state, l.id) > 0);
  root.innerHTML = `<header><div class="eyebrow">EXPEDITION JOURNAL ${demo ? '<b>DEMO · LOCAL FIXTURES</b>' : ''}</div><h1>Landmark Island<span>✦</span></h1><p>A little world, built one worktree at a time.</p><div class="stats"><strong>${owned.length}<small> / 12 discovered</small></strong><strong>${state.receipts.length}<small> expeditions</small></strong><strong>${new Set(owned.map((l) => l.code)).size}<small> countries</small></strong></div></header><nav><button data-view="island" aria-pressed="${view === 'island'}">My Island</button><button data-view="map" aria-pressed="${view === 'map'}">World Map</button>${demo ? '<button id="expedition">＋ Demo expedition</button>' : ''}<button id="refresh">Refresh</button></nav><p class="notice" role="status">${escape(message)}</p>${error ? `<p role="alert">${escape(error)}</p>` : ''}
 ${
   view === 'island'
     ? `<section class="island-section"><div class="section-title"><h2>An island of your own</h2><span>24 × 24 world · ${landTiles.length} land tiles</span></div><p>${from !== undefined ? 'Choose an empty cell to move the landmark.' : selected ? `Place ${escape(landmarks.find((l) => l.id === selected)!.name)} on an empty cell.` : scene.mode === 'walk' ? 'Take a stroll, watch the weather, and make yourself at home.' : 'Select a collected landmark below, then choose a cell.'}</p>${scene.markup()}<div class="ocean" tabindex="0" role="region" aria-label="Interactive island"><div class="camera"><div class="island">${terrain(state, from)}${scene.avatar()}</div><div class="sailboat" aria-hidden="true">⛵</div></div>${scene.layers()}</div>${from !== undefined ? '<div class="tools"><button id="remove">Return to collection</button><button id="cancel">Cancel move</button></div>' : ''}</section>`
     : `<section><div class="section-title"><h2>A world of discoveries</h2><span>${owned.length} real locations</span></div><svg class="world" viewBox="0 0 720 360" role="img" aria-label="World map of collected landmarks">${world.map((c) => `<path d="${c.path}" class="${owned.some((l) => l.code === c.code) ? 'acquired' : ''}"><title>${escape(c.name)}</title></path>`).join('')}${owned.map((l) => `<circle cx="${(l.lon + 180) * 2}" cy="${(90 - l.lat) * 2}" r="4"><title>${escape(l.name)} · ${escape(l.country)}</title></circle>`).join('')}</svg><p class="muted">Made with Natural Earth · approximate locations · equirectangular projection</p><div class="countries">${[...new Set(landmarks.map((l) => l.country))].map((c) => `<span>${escape(c)} <strong>${owned.filter((l) => l.country === c).length}/${landmarks.filter((l) => l.country === c).length}</strong></span>`).join('')}</div></section>`
 }
 <section><div class="section-title"><h2>Your collection</h2><span>Duplicates welcome</span></div><div class="collection">${landmarks
   .map((l) => {
     const count = quantity(state, l.id),
       available =
         count - state.placements.filter((p) => p.landmark === l.id).length;
     return `<button class="card ${!count ? 'locked' : ''}" data-landmark="${l.id}" aria-pressed="${selected === l.id}" ${available < 1 ? 'disabled' : ''}>${art(l.id)}<strong>${escape(l.name)}</strong><span>${escape(l.country)} · ${l.tier}</span><small>${count ? `Owned ×${count} · ${available} available` : 'Not discovered yet'}</small></button>`;
   })
   .join(
     '',
   )}</div></section><footer>12-landmark prototype · Tier chances: Common 70% / Rare 23% / Epic 6% / Legendary 1%. Each item within a tier is equally likely. No guarantees.<br>${demo ? 'Demo saves only in this browser.' : 'Saved locally on this Orca host. Events missed while disabled are not backfilled.'}</footer>`;
  root.querySelectorAll<HTMLButtonElement>('button').forEach((b) => {
    if (busy) b.disabled = true;
  });
  root.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(
    (b) =>
      (b.onclick = () => {
        view = b.dataset.view!;
        selected = '';
        from = undefined;
        render();
      }),
  );
  root.querySelectorAll<HTMLButtonElement>('[data-landmark]').forEach(
    (b) =>
      (b.onclick = () => {
        selected = b.dataset.landmark!;
        scene.mode = 'build';
        from = undefined;
        view = 'island';
        render();
      }),
  );
  root.querySelectorAll<HTMLButtonElement>('[data-cell]').forEach(
    (b) =>
      (b.onclick = () => {
        const cell = Number(b.dataset.cell);
        const p = state.placements.find((p) => p.cell === cell);
        if (p) {
          from = cell;
          selected = '';
          render();
          return;
        }
        if (from !== undefined) {
          const origin = from;
          from = undefined;
          void run(() => request('island.place', { cell, from: origin }));
        } else if (selected) {
          const landmark = selected;
          selected = '';
          void run(() => request('island.place', { cell, landmark }));
        }
      }),
  );
  scene.mount(
    root,
    state,
    () => {
      selected = '';
      from = undefined;
      render();
    },
    busy,
  );
  const remove = root.querySelector<HTMLButtonElement>('#remove');
  if (remove)
    remove.onclick = () => {
      const cell = from;
      from = undefined;
      void run(() => request('island.place', { cell }));
    };
  const cancel = root.querySelector<HTMLButtonElement>('#cancel');
  if (cancel)
    cancel.onclick = () => {
      from = undefined;
      render();
    };
  root.querySelector<HTMLButtonElement>('#refresh')!.onclick = () =>
    void run(() => request('island.read'));
  const expedition = root.querySelector<HTMLButtonElement>('#expedition');
  if (expedition)
    expedition.onclick = () =>
      void run(() =>
        game.acquire({ workspaceId: crypto.randomUUID(), kind: 'worktree' }),
      );
}
bridge?.on('island.changed', () => {
  void reload();
});
// Queue refreshes behind in-flight requests so an acquisition notification is not lost.
async function reload() {
  while (busy) await new Promise((r) => setTimeout(r, 50));
  await run(() => request('island.read'));
}
render();
void reload();
