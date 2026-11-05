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
import './storybook.css';
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
const detail = document.createElement('dialog');
detail.className = 'landmark-detail';
detail.setAttribute('aria-labelledby', 'detail-title');
detail.setAttribute('aria-describedby', 'detail-description');
document.body.append(detail);
let detailOpener: HTMLElement | null = null;
detail.addEventListener('close', () => {
  const target = detailOpener?.isConnected
    ? detailOpener
    : root.querySelector<HTMLElement>('.ocean, [data-info]');
  target?.focus({ preventScroll: true });
});
function showDetails(id: string) {
  const landmark = landmarks.find((l) => l.id === id);
  if (!landmark) return;
  detailOpener = document.activeElement as HTMLElement | null;
  detail.innerHTML = `<button class="detail-close" aria-label="Close landmark details" autofocus>×</button><div class="detail-art">${art(id)}</div><p class="detail-country">${escape(landmark.country)} · ${escape(landmark.region)}</p><h2 id="detail-title">${escape(landmark.name)}</h2><p id="detail-description">${escape(landmark.description)}</p><p class="detail-source">Read more: <a href="${escape(landmark.descriptionSource)}" target="_blank" rel="noopener noreferrer">${escape(landmark.descriptionSourceName)} ↗</a></p>`;
  detail.querySelector<HTMLButtonElement>('.detail-close')!.onclick = () =>
    detail.close();
  if (!detail.open) detail.showModal();
}
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
  root.innerHTML = `<header><div class="book-title"><div class="eyebrow">A worktree travel journal ${demo ? '<b>DEMO · LOCAL FIXTURES</b>' : ''}</div><h1>Landmark Island</h1></div><div class="stats"><strong>${owned.length}<small> / 12 discovered</small></strong><strong>${state.receipts.length}<small> expeditions</small></strong><strong>${new Set(owned.map((l) => l.code)).size}<small> countries</small></strong></div></header><nav><button data-view="island" aria-pressed="${view === 'island'}">My Island</button><button data-view="map" aria-pressed="${view === 'map'}">World Map</button>${demo ? '<button id="expedition">＋ Demo expedition</button>' : ''}<button id="refresh">Refresh</button></nav><p class="notice" role="status">${escape(message)}</p>${error ? `<p role="alert">${escape(error)}</p>` : ''}
 ${
   view === 'island'
     ? `<section class="island-section"><div class="section-title"><h2><small>Chapter I</small> A place to wander</h2><span>${landTiles.length} little places to call home</span></div><p>${from !== undefined ? 'Choose an empty cell to move the landmark.' : selected ? `Place ${escape(landmarks.find((l) => l.id === selected)!.name)} on an empty cell.` : scene.mode === 'walk' ? 'Take a stroll, watch the weather, and make yourself at home.' : 'Select a collected landmark below, then choose a cell.'}</p>${scene.markup()}<div class="ocean" tabindex="0" role="region" aria-label="Interactive island"><div class="camera"><div class="island">${terrain(state, from)}${scene.avatar()}</div><div class="sailboat" aria-hidden="true"><svg viewBox="0 0 90 90"><path d="M5 73q15-4 29 0m10 7q18-4 35 0" fill="none" stroke="#e7eedb" stroke-width="2"/><path d="M13 60q32 7 65-1L65 73H26z" fill="#ad7355" stroke="#655542" stroke-width="2"/><path d="M46 60V7" stroke="#655542" stroke-width="2"/><path d="M42 13Q26 29 20 50l22-3z" fill="#fcf3d8" stroke="#8c8268"/><path d="M50 21l20 29-20 2z" fill="#d9b07d" stroke="#8c8268"/><path d="M47 8l14 3-14 6" fill="#b76550"/></svg></div></div>${scene.layers()}</div>${from !== undefined ? '<div class="tools"><button id="remove">Return to collection</button><button id="cancel">Cancel move</button></div>' : ''}</section>`
     : `<section><div class="section-title"><h2><small>Chapter II</small> A world of discoveries</h2><span>${owned.length} real locations</span></div><svg class="world" viewBox="0 0 720 360" role="img" aria-label="World map of collected landmarks">${world.map((c) => `<path d="${c.path}" class="${owned.some((l) => l.code === c.code) ? 'acquired' : ''}"><title>${escape(c.name)}</title></path>`).join('')}${owned.map((l) => `<circle cx="${(l.lon + 180) * 2}" cy="${(90 - l.lat) * 2}" r="4"><title>${escape(l.name)} · ${escape(l.country)}</title></circle>`).join('')}</svg><p class="muted">Made with Natural Earth · approximate locations · equirectangular projection</p><div class="countries">${[...new Set(landmarks.map((l) => l.country))].map((c) => `<span>${escape(c)} <strong>${owned.filter((l) => l.country === c).length}/${landmarks.filter((l) => l.country === c).length}</strong></span>`).join('')}</div></section>`
 }
 <section class="collection-section"><div class="section-title"><h2><small>Field notes</small> Your collection</h2><span>Souvenirs from faraway places</span></div><div class="collection">${landmarks
   .map((l) => {
     const count = quantity(state, l.id),
       available =
         count - state.placements.filter((p) => p.landmark === l.id).length;
     return `<article class="card ${!count ? 'locked' : ''}"><button class="collect-action" data-landmark="${l.id}" aria-pressed="${selected === l.id}" ${available < 1 ? 'disabled' : ''}>${art(l.id)}<strong>${escape(l.name)}</strong><span class="card-country">${escape(l.country)}</span><span>${l.tier} · ${escape(l.region)}</span><small>${count ? `Owned ×${count} · ${available} available` : 'Not discovered yet'}</small></button><button class="about-landmark" data-info="${l.id}" aria-label="About ${escape(l.name)}" aria-haspopup="dialog">About this landmark ↗</button></article>`;
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
  root.querySelectorAll<HTMLButtonElement>('[data-cell], [data-site]').forEach(
    (b) =>
      (b.onclick = () => {
        const cell = Number(b.dataset.cell ?? b.dataset.site);
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
  root.querySelectorAll<HTMLButtonElement>('[data-info]').forEach((button) => {
    button.onclick = () => showDetails(button.dataset.info!);
  });
  scene.mount(
    root,
    state,
    () => {
      selected = '';
      from = undefined;
      render();
    },
    busy,
    showDetails,
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
