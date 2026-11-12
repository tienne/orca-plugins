import {
  collectibleLandmarks,
  landmarkById,
  enhancedId,
  baseId,
  isEnhanced,
} from './landmark-variants';
import { renderIsland } from './render-island';
import { observeCatalogMotion } from './catalog-motion';
import { ExpeditionCamp } from './expedition-camp';
import { observeExpedition, type Expedition } from './expeditions';
import './expedition-camp.css';
import { startLocalization, translate } from './i18n';
import {
  Game,
  layout,
  sameLayout,
  type Layout,
  validate,
  islandLand,
  islandLevel,
  materials,
  decorationQuantity,
  decodeBackup,
  MAX_BACKUP_BYTES,
  empty,
  availableTickets,
  landmarks,
  quantity,
  discovered,
  weights,
  type State,
} from './game';
import { revealDiscovery, revealResults, type DiscoveryReward } from './reveal';
import { art } from './art';
import { IslandScene } from './scene';
import { terrain } from './terrain-art';
import { landTiles, landAtLevel, MAX_LAND_LEVEL } from './world';
import {
  decorations,
  decorationById,
  decorationArt,
  DUPLICATE_MATERIALS,
  isFloor,
  canRotate,
} from './decorations';
startLocalization();
const rarities = [
  { id: 'common', name: 'Discovery', rank: 1, numeral: 'I' },
  { id: 'rare', name: 'Treasure', rank: 2, numeral: 'II' },
  { id: 'epic', name: 'Marvel', rank: 3, numeral: 'III' },
  { id: 'legendary', name: 'Wonder', rank: 4, numeral: 'IV' },
] as const;
let rarityFilter = 'all';
let variantFilter: 'normal' | 'plus' = 'normal';
function rarityBadge(tier: string, enhanced = false) {
  const rarity = rarities.find((r) => r.id === tier)!;
  return `<span class="rarity-badge" data-tier="${rarity.id}" role="img" aria-label="${rarity.name}, rarity ${rarity.rank}${enhanced ? '.5' : ''} of 4${enhanced ? '.5' : ''}" title="${rarity.name} · Rarity ${rarity.rank}${enhanced ? '.5' : ''}/4${enhanced ? '.5' : ''}"><span class="rarity-number" aria-hidden="true">${rarity.numeral}${enhanced ? '+' : ''}</span><span class="rarity-name" aria-hidden="true">${rarity.name}</span><span class="rarity-scale" aria-hidden="true">${Array.from({ length: 4 }, (_, i) => `<i class="${i < rarity.rank ? 'filled' : ''}"></i>`).join('')}</span></span>`;
}
import world from './world.json';
import './style.css';
import './scene.css';
import './world.css';
import './storybook.css';
import './landmark-life.css';
import './scenes/actors.css';
import './landmark-intensity.css';
import './island-life.css';
import { renderLandmarkLifePreview } from './landmark-life-preview';
type Bridge = {
  request<T = State>(name: string, input: unknown): Promise<T>;
  on(name: string, fn: () => void): unknown;
};
const frame = (
  window as unknown as {
    orca?: {
      plugin: Bridge;
      files: {
        saveAs(options: {
          suggestedName: string;
          mimeType: string;
          data: string;
        }): Promise<{ status: 'saved' | 'cancelled' }>;
      };
      shell: {
        openExternal(
          url: string,
        ): Promise<{ opened: boolean; reason?: string }>;
      };
    };
  }
).orca;
const bridge = frame?.plugin;
const demo = !bridge;
const scene = new IslandScene(
  bridge
    ? (timezone) => bridge.request('island.weather', { timezone })
    : undefined,
  frame ? (url) => frame.shell.openExternal(url) : undefined,
);
const expeditionPreview =
  demo && new URLSearchParams(location.search).get('preview') === 'expedition';
let previewCrew: Expedition[] = expeditionPreview
  ? [
      ...observeExpedition([], 'scout', 'working', 1000),
      ...observeExpedition(
        observeExpedition([], 'builder', 'working', 1001),
        'builder',
        'waiting',
        1002,
      ),
      ...observeExpedition(
        observeExpedition([], 'observer', 'working', 1003),
        'observer',
        'done',
        1004,
        'success',
      ),
    ]
  : [];
const camp = new ExpeditionCamp(async (run) => {
  if (bridge) return bridge.request('island.welcome', { run });
  const record = previewCrew.find((e) => e.run === run && e.pending);
  if (!record)
    throw new Error('This expedition is no longer waiting to be welcomed.');
  previewCrew = previewCrew.map((e) =>
    e === record ? { ...e, pending: false, welcomed: true } : e,
  );
  return previewCrew;
}, expeditionPreview);
const readCrew = () =>
  camp.refresh(() =>
    bridge
      ? bridge.request('island.expeditions', {})
      : Promise.resolve(previewCrew),
  );
const demoKey = 'landmark-island-demo-v1';
const game = new Game({
  read: async () => JSON.parse(localStorage.getItem(demoKey) ?? 'null'),
  write: async (s) => localStorage.setItem(demoKey, JSON.stringify(s)),
  readBackup: async () =>
    JSON.parse(localStorage.getItem(`${demoKey}-before-restore`) ?? 'null'),
  writeBackup: async (s) =>
    localStorage.setItem(`${demoKey}-before-restore`, JSON.stringify(s)),
});
let state: State = empty(),
  view = 'island',
  selected = '',
  selectedDecor = '',
  editLayer: 'floor' | 'objects' = 'objects',
  brushEnabled = false,
  placementRotation = 0,
  from: number | undefined,
  moving = false,
  moveBlocked = false,
  busy = false,
  message =
    'New worktree → one exploration ticket. Use a ticket to discover a landmark.',
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
  const landmark = landmarkById(id);
  if (!landmark) return;
  detailOpener = document.activeElement as HTMLElement | null;
  const rarity = rarities.find((r) => r.id === landmark.tier)!;
  detail.dataset.tier = rarity.id;
  detail.dataset.owned = String(discovered(state, id));
  detail.innerHTML = `<button class="detail-close" aria-label="Close landmark details" autofocus>×</button><div class="detail-art">${art(id)}</div><p class="detail-country">${escape(landmark.country)} · ${escape(landmark.region)}</p><h2 id="detail-title">${escape(landmark.name)}</h2><div class="detail-rarity">${rarityBadge(landmark.tier, isEnhanced(id))}<p>${isEnhanced(id) ? 'Fusion only · Half a rarity step above the normal version' : `${weights[rarity.id]}% tier chance per draw · ${landmarks.filter((l) => l.tier === rarity.id).length} landmarks in this tier`}</p></div><p id="detail-description">${escape(landmark.description)}</p><p class="detail-source">Read more: <a href="${escape(landmark.descriptionSource)}" target="_blank" rel="noopener noreferrer">${escape(landmark.descriptionSourceName)} ↗</a></p>`;
  const stock = document.createElement('section');
  stock.className = 'variant-details';
  const count = quantity(state, id);
  const placed = state.placements.filter((p) => p.landmark === id).length;
  const normal = baseId(id);
  stock.innerHTML = `<p>Owned ×${count} · ${count - placed} available · ${placed} placed</p><div><button data-detail-variant="${isEnhanced(id) ? normal : enhancedId(id)}">${isEnhanced(id) ? 'View normal version' : 'View + version'}</button>${!isEnhanced(id) ? `<button data-fusion="${id}" ${quantity(state, id) - placed < 2 && !pendingFusions.has(id) ? 'disabled' : ''}>${pendingFusions.has(id) ? 'Retry fusion' : 'Fuse 2 → 1 +'}</button>` : `<button data-plus-place ${count - placed < 1 ? 'disabled' : ''}>Place + on island</button><button data-plus-decor>View exclusive decoration</button>`}</div>`;
  detail.append(stock);
  stock.querySelector<HTMLButtonElement>('[data-detail-variant]')!.onclick =
    () => showDetails(isEnhanced(id) ? normal : enhancedId(id));
  stock
    .querySelector<HTMLButtonElement>('[data-fusion]')
    ?.addEventListener('click', () => {
      detail.close();
      prepareFusion(normal);
    });
  stock
    .querySelector<HTMLButtonElement>('[data-plus-place]')
    ?.addEventListener('click', () => {
      detail.close();
      placeDiscovery(id);
    });
  stock
    .querySelector<HTMLButtonElement>('[data-plus-decor]')
    ?.addEventListener('click', () => {
      detail.close();
      showPlusDecoration(normal);
    });
  detail.querySelector<HTMLButtonElement>('.detail-close')!.onclick = () =>
    detail.close();
  if (!demo) {
    const link = detail.querySelector<HTMLAnchorElement>('.detail-source a')!;
    const status = document.createElement('p');
    status.className = 'detail-link-status';
    status.setAttribute('role', 'status');
    status.hidden = true;
    detail.append(status);
    link.onclick = async (event) => {
      event.preventDefault();
      status.hidden = true;
      try {
        // Call inside the real click: the host owns external-link consent/routing.
        const result = await frame!.shell.openExternal(
          landmark.descriptionSource,
        );
        if (!result.opened) {
          status.setAttribute('role', 'status');
          status.textContent = 'The link was not opened.';
          status.hidden = false;
        }
      } catch {
        status.setAttribute('role', 'alert');
        status.textContent = 'Could not open the source. Please try again.';
        status.hidden = false;
      }
    };
  }
  if (!detail.open) detail.showModal();
}
async function request(name: string, input: unknown = {}) {
  const result = await (bridge
    ? bridge.request(name, input)
    : name === 'island.read'
      ? game.snapshot()
      : name === 'island.draw'
        ? game.redeem(input)
        : name === 'island.drawMany'
          ? game.redeemMany(input)
          : name === 'island.fuse'
            ? game.fuse(input)
            : name === 'island.craft'
              ? game.craft(input)
              : name === 'island.layout'
                ? game.replaceLayout(input)
                : name === 'island.paint'
                  ? game.paint(input)
                  : name === 'island.rotate'
                    ? game.rotate(input)
                    : name === 'island.decorate'
                      ? game.decorate(input)
                      : game.place(input));
  return validate(result);
}
let loaded = false;
let pendingTicket: string | undefined;
let pendingTickets: string[] | undefined;
let skipDiscovery = false;
const undoStack: { before: Layout; after: Layout }[] = [];
async function run(
  action: () => Promise<State>,
  mode: 'read' | 'edit' | 'undo' = 'read',
) {
  if (busy) return;
  busy = true;
  error = '';
  render();
  try {
    const before = layout(state);
    const next = await action();
    const after = layout(next);
    if (mode === 'undo') undoStack.pop();
    else if (!sameLayout(before, after)) {
      if (mode === 'edit') {
        undoStack.push({ before, after });
        if (undoStack.length > 20) undoStack.shift();
      } else undoStack.length = 0;
    }
    const last = next.receipts.at(-1);
    if (loaded && last && next.receipts.length > state.receipts.length)
      message = `${next.receipts.filter((r) => r.landmark === last.landmark).length > 1 ? 'Duplicate discovered' : 'New discovery'}: ${landmarks.find((l) => l.id === last.landmark)!.name} · owned ×${quantity(next, last.landmark)}`;
    if (loaded && next.tickets.length > state.tickets.length)
      message = 'Exploration ticket received. A new destination awaits.';
    state = next;
    loaded = true;
  } catch (e) {
    error = String(e);
  } finally {
    busy = false;
    render();
  }
}
function placeDiscovery(id: string) {
  selected = id;
  editLayer = 'objects';
  brushEnabled = false;
  selectedDecor = '';
  from = undefined;
  moving = false;
  moveBlocked = false;
  scene.mode = 'build';
  view = 'island';
  inventoryTab = undefined;
  render();
  root.querySelector<HTMLElement>('.ocean')?.focus({ preventScroll: true });
}
async function useTicket(amount: 1 | 10 = 1) {
  if (
    busy ||
    (amount === 1 && pendingTickets) ||
    (amount === 10 && pendingTicket)
  )
    return;
  const ids =
    amount === 10
      ? (pendingTickets ??
        availableTickets(state)
          .slice(0, 10)
          .map((t) => t.workspaceId))
      : [pendingTicket ?? availableTickets(state)[0]?.workspaceId].filter(
          (id): id is string => !!id,
        );
  if (ids.length !== amount) return;
  if (amount === 10) pendingTickets = ids;
  else pendingTicket = ids[0];
  view = 'island';
  if (inventoryTab) setInventory(undefined, false);
  treasureOpen = false;
  let rewards: DiscoveryReward[] | undefined;
  busy = true;
  error = '';
  render();
  try {
    const next = await request(
      amount === 10 ? 'island.drawMany' : 'island.draw',
      amount === 10 ? { ticketIds: ids } : { ticketId: ids[0] },
    );
    if (ids.some((id) => !next.receipts.some((r) => r.workspaceId === id)))
      throw Error(
        'Draw result was not returned. Retry to recover this ticket.',
      );
    // Receipt order, rather than the final quantity, distinguishes the first
    // discovery from copies in this batch and survives response-loss retries.
    const seen = new Map<string, number>();
    const results = new Map<string, DiscoveryReward>();
    for (const receipt of next.receipts) {
      const count = (seen.get(receipt.landmark) ?? 0) + 1;
      seen.set(receipt.landmark, count);
      if (!ids.includes(receipt.workspaceId)) continue;
      const landmark = landmarks.find((l) => l.id === receipt.landmark)!;
      const gift = decorations.find(
        (d) => d.landmark === landmark.id && d.gift,
      )!;
      results.set(receipt.workspaceId, {
        landmark,
        count: quantity(next, landmark.id),
        isNew: count === 1,
        rewardNote:
          count > 1
            ? `+${DUPLICATE_MATERIALS} materials · Your landmark is kept`
            : `${gift.name} gifted · Theme unlocked`,
      });
    }
    rewards = ids.map((id) => results.get(id)!);
    const addedLand = islandLand(next).length - islandLand(state).length;
    state = next;
    pendingTicket = undefined;
    pendingTickets = undefined;
    if (amount === 1) {
      const reward = rewards[0];
      if (addedLand > 0) reward.rewardNote += ` · +${addedLand} land tiles`;
      message = `${reward.isNew ? 'New discovery' : 'Duplicate discovered'}: ${reward.landmark.name} · owned ×${reward.count} · ${reward.rewardNote}`;
    } else {
      const fresh = rewards.filter((r) => r.isNew).length;
      message = `10 treasures opened · ${fresh} new discoveries · +${(10 - fresh) * DUPLICATE_MATERIALS} materials`;
    }
  } catch (e) {
    treasureOpen = true;
    error = `${String(e)} · ${amount === 10 ? 'Retry 10 treasures to recover the same tickets.' : 'Retry discovery to recover the same ticket.'}`;
  } finally {
    busy = false;
    render();
  }
  if (!rewards) return;
  const container = root.querySelector<HTMLElement>('.ocean')!;
  const animate = (r: DiscoveryReward) => r.isNew && !skipDiscovery;
  const drawAgain = () => ({
    tickets: availableTickets(state).length,
    onDraw: (amount: 1 | 10) => {
      void useTicket(amount);
    },
  });
  if (amount === 1) {
    const r = rewards[0];
    revealDiscovery(
      r.landmark,
      r.count,
      rarityBadge(r.landmark.tier),
      () => placeDiscovery(r.landmark.id),
      {
        isNew: r.isNew,
        rewardNote: r.rewardNote,
        container,
        animate: animate(r),
        drawAgain: drawAgain(),
      },
    );
    return;
  }
  const allRewards = rewards;
  const highlights = rewards.filter(animate);
  const summary = () =>
    revealResults(
      allRewards,
      rarityBadge,
      placeDiscovery,
      container,
      drawAgain(),
    );
  const nextHighlight = (index: number) => {
    const r = highlights[index];
    if (!r) return summary();
    revealDiscovery(
      r.landmark,
      r.count,
      rarityBadge(r.landmark.tier),
      () => {},
      {
        container,
        isNew: r.isNew,
        rewardNote: r.rewardNote,
        batch: {
          index: index + 1,
          total: highlights.length,
          onClose: (action) =>
            action === 'results' ? summary() : nextHighlight(index + 1),
        },
      },
    );
  };
  nextHighlight(0);
}
const pendingFusions = new Map<string, { id: string; landmark: string }>();
function showPlusDecoration(id: string) {
  view = 'island';
  decorTheme = enhancedId(id);
  inventoryFilters.decorations = { query: '', stock: 'all', category: 'all' };
  setInventory('decorations', false);
  render();
}
function prepareFusion(id: string) {
  if (busy) return;
  const landmark = landmarkById(id)!;
  const first = !discovered(state, enhancedId(id));
  const placed = state.placements.filter((p) => p.landmark === id).length;
  const available = quantity(state, id) - placed;
  const dialog = document.createElement('dialog');
  dialog.className = 'fusion-confirm';
  dialog.setAttribute('aria-labelledby', 'fusion-title');
  dialog.innerHTML = `<h2 id="fusion-title">Fuse ${escape(landmark.name)} +</h2><div class="fusion-preview">${art(id)}<b>2 → 1</b>${art(enhancedId(id))}</div><p>Consume 2 unplaced normal copies → receive 1 + copy.</p><p>${available} available · ${placed} placed</p><p>Placed copies stay on the island. Materials and discovery rewards stay yours.</p><p>${rarities.find((r) => r.id === landmark.tier)!.numeral}+ · Half a rarity step higher · No ++ fusion</p><p>First fusion unlocks an exclusive star monument and gifts one copy.</p><p role="alert" class="fusion-error"></p><button data-confirm-fusion ${available < 2 && !pendingFusions.has(id) ? 'disabled' : ''}>${pendingFusions.has(id) ? 'Retry fusion' : 'Confirm fusion'}</button><button data-cancel-fusion>Cancel</button>`;
  document.body.append(dialog);
  dialog.addEventListener('close', () => dialog.remove(), { once: true });
  dialog.querySelector<HTMLButtonElement>('[data-cancel-fusion]')!.onclick =
    () => dialog.close();
  dialog.querySelector<HTMLButtonElement>('[data-confirm-fusion]')!.onclick =
    async () => {
      if (busy) return;
      const fusionRequest = pendingFusions.get(id) ?? {
        id: crypto.randomUUID(),
        landmark: id,
      };
      pendingFusions.set(id, fusionRequest);
      let committed: State | undefined;
      await run(async () => {
        committed = await request('island.fuse', fusionRequest);
        pendingFusions.delete(id);
        return committed;
      });
      if (!committed) {
        dialog.querySelector('[role="alert"]')!.textContent = error;
        dialog.querySelector('[data-confirm-fusion]')!.textContent =
          'Retry fusion';
        return;
      }
      dialog.close();
      const plus = landmarkById(enhancedId(id))!;
      revealDiscovery(
        plus,
        quantity(state, plus.id),
        rarityBadge(plus.tier, true),
        () => placeDiscovery(plus.id),
        {
          fusion: true,
          rewardNote: first
            ? 'Fusion complete · Exclusive star monument unlocked'
            : 'Fusion complete · + copy saved · No additional gift',
          onDetails: () => showDetails(plus.id),
          onDecoration: () => showPlusDecoration(id),
        },
      );
    };
  dialog.showModal();
}
let decorTheme = 'unlocked';
let pendingCraft: { id: string; decoration: string } | undefined;
function workshop() {
  return `<section class="workshop" aria-label="Decoration workshop"><div class="section-title"><h2><small>The garden workshop</small>Make this place yours</h2><strong class="material-balance">${materials(state)} materials</strong></div><details class="workshop-help"><summary>About gifts &amp; materials</summary><p>Basics are free. Every first discovery gifts one decoration and opens its set. Each duplicate brings ${DUPLICATE_MATERIALS} materials; your landmark stays yours.</p></details><label for="decor-theme">Garden set</label> <select id="decor-theme"><option value="unlocked">All unlocked sets</option><option value="all">All garden sets</option><option value="basics">Free essentials</option>${collectibleLandmarks.map((l) => `<option value="${l.id}">${l.country} · ${l.name}${discovered(state, l.id) ? '' : ' · Locked'}</option>`).join('')}</select><div class="decoration-shelf">${decorations
    .map((d) => {
      const unlocked = !d.landmark || discovered(state, d.landmark);
      const count = decorationQuantity(state, d.id);
      const available =
        count - state.decorations.filter((p) => p.decoration === d.id).length;
      return `<article class="decoration-card" data-decor-card="${d.id}" ${!unlocked ? 'data-locked="true"' : ''}>${decorationArt(d.id)}<h3>${d.name}</h3><p>${d.landmark ? landmarkById(d.landmark)!.name : 'Free essentials'}</p><small>${!unlocked ? `Discover its landmark to unlock${d.gift ? ' · First copy is a gift' : ''}` : !d.landmark ? 'Unlimited · Free to place' : `Owned ×${count} · ${available} available`}</small><div><button data-decor-place="${d.id}" aria-pressed="${selectedDecor === d.id}" ${!unlocked || available < 1 ? 'disabled' : ''}>Place</button>${d.landmark ? `<button data-craft="${d.id}" ${!unlocked || (pendingCraft ? pendingCraft.decoration !== d.id : materials(state) < d.cost) ? 'disabled' : ''}>${pendingCraft?.decoration === d.id ? 'Retry craft' : `Craft · ${d.cost} materials`}</button>` : ''}</div></article>`;
    })
    .join(
      '',
    )}</div><p class="muted">Move or return decorations at no cost. Returned pieces stay in your inventory. Preview locked sets with the menu above.</p></section>`;
}
function collection() {
  const owned = landmarks.filter((l) => discovered(state, l.id));
  return `<section class="collection-section"><div class="section-title"><h2><small>Field notes</small> Your collection</h2><span>Souvenirs from faraway places</span></div><div class="collection-progress"><label for="discovery-progress"><strong>${owned.length} / ${landmarks.length}</strong> landmarks discovered${owned.length === landmarks.length ? ' · Collection complete' : ''}</label><progress id="discovery-progress" value="${owned.length}" max="${landmarks.length}"></progress></div><p class="rarity-guide">Rarity I → IV <span>More filled marks = rarer discoveries</span></p><div class="rarity-filters" role="group" aria-label="Collection rarity"><button data-tier-filter="all" aria-pressed="${rarityFilter === 'all'}">All <small>${owned.length}/${landmarks.length}</small></button>${rarities.map((r) => `<button data-tier-filter="${r.id}" data-tier="${r.id}" aria-pressed="${rarityFilter === r.id}">${rarityBadge(r.id)} <small>${owned.filter((l) => l.tier === r.id).length}/${landmarks.filter((l) => l.tier === r.id).length}</small></button>`).join('')}</div><p class="rarity-summary" aria-live="polite"></p><div class="variant-filters" role="group" aria-label="Landmark version"><button data-variant="normal" aria-pressed="${variantFilter === 'normal'}">Normal</button><button data-variant="plus" aria-pressed="${variantFilter === 'plus'}">+ versions</button></div><div class="collection">${collectibleLandmarks
    .filter((l) => isEnhanced(l.id) === (variantFilter === 'plus'))
    .map((l) => {
      const count = quantity(state, l.id),
        available =
          count - state.placements.filter((p) => p.landmark === l.id).length;
      return `<article class="card ${!discovered(state, l.id) ? 'locked' : ''}" data-catalog-id="${l.id}" data-tier="${l.tier}">${rarityBadge(l.tier, isEnhanced(l.id))}<button class="collect-action" data-landmark="${l.id}" aria-pressed="${selected === l.id}" ${available < 1 ? 'disabled' : ''}>${art(l.id)}<strong>${escape(l.name)}</strong><span class="card-country">${escape(l.country)}</span><span>${escape(l.region)}</span><small>${discovered(state, l.id) ? `Owned ×${count} · ${available} available` : 'Not discovered yet'}</small></button><button class="about-landmark" data-info="${l.id}" aria-label="About ${escape(l.name)}" aria-haspopup="dialog">About this landmark ↗</button></article>`;
    })
    .join('')}</div></section>`;
}
let treasureOpen = false;
let inventoryTab: 'decorations' | 'landmarks' | undefined;
const inventoryScroll = { decorations: 0, landmarks: 0 };
type InventoryKind = 'decorations' | 'landmarks';
const inventoryFilters: Record<
  InventoryKind,
  { query: string; stock: string; category: string }
> = {
  decorations: { query: '', stock: 'all', category: 'all' },
  landmarks: { query: '', stock: 'all', category: 'all' },
};
const normalizeSearch = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/\s+/gu, '');
const searchTerms = (values: string[]) =>
  normalizeSearch(
    values.flatMap((value) => [value, translate(value, 'ko-KR')]).join(' '),
  );
const landmarkSearch = new Map(
  collectibleLandmarks.map((l) => [
    l.id,
    searchTerms([l.name, l.country, l.region]),
  ]),
);
const decorSearch = new Map(
  decorations.map((d) => [
    d.id,
    searchTerms([d.name]) +
      (d.landmark
        ? landmarkSearch.get(d.landmark)
        : searchTerms(['Free essentials'])),
  ]),
);
function inventoryFinder() {
  return `<div class="inventory-finder"><label class="visually-hidden" for="inventory-search">Search inventory</label><div class="inventory-search-row"><input id="inventory-search" type="search" placeholder="Search name or country" autocomplete="off" spellcheck="false"/><button id="clear-inventory-search" aria-label="Clear search">×</button></div><div class="inventory-filter-row"><label class="visually-hidden" for="inventory-stock">Inventory availability</label><select id="inventory-stock"><option value="all">All items</option><option value="owned">Owned items</option><option value="available">Ready to place</option></select><label class="visually-hidden" for="inventory-category">Decoration category</label><select id="inventory-category"><option value="all">All categories</option><option value="tiles">Tiles</option><option value="plants">Plants</option><option value="furniture">Furniture &amp; structures</option><option value="water">Water features</option></select><button id="reset-inventory-filters">Reset filters</button></div><small id="inventory-results" aria-live="polite"></small></div>`;
}
function applyInventoryFilters() {
  const matches = (index: string, query: string) =>
    query
      .trim()
      .split(/\s+/u)
      .every((term) => index.includes(normalizeSearch(term)));
  const stockMatches = (stock: string, count: number, available: number) =>
    stock === 'all' || (stock === 'owned' ? count > 0 : available > 0);
  let landmarkCount = 0,
    decorCount = 0;
  const lf = inventoryFilters.landmarks,
    df = inventoryFilters.decorations;
  root.querySelectorAll<HTMLElement>('[data-catalog-id]').forEach((card) => {
    const id = card.dataset.catalogId!;
    const count = quantity(state, id);
    const available =
      count - state.placements.filter((p) => p.landmark === id).length;
    card.hidden = !(
      matches(landmarkSearch.get(id)!, lf.query) &&
      stockMatches(lf.stock, count, available) &&
      (rarityFilter === 'all' || card.dataset.tier === rarityFilter)
    );
    if (!card.hidden) landmarkCount++;
  });
  root.querySelectorAll<HTMLElement>('[data-decor-card]').forEach((card) => {
    const d = decorationById(card.dataset.decorCard!)!;
    const count = decorationQuantity(state, d.id);
    const available =
      count -
      (isFloor(d.id) ? state.floors : state.decorations).filter(
        (p) => p.decoration === d.id,
      ).length;
    const category = isFloor(d.id)
      ? 'tiles'
      : ['tree', 'palm', 'flowers', 'fernBed'].includes(d.shape)
        ? 'plants'
        : ['pond', 'fountain'].includes(d.shape)
          ? 'water'
          : 'furniture';
    const inTheme =
      decorTheme === 'all' ||
      (decorTheme === 'unlocked'
        ? !d.landmark || discovered(state, d.landmark)
        : decorTheme === 'basics'
          ? !d.landmark
          : d.landmark === decorTheme);
    card.hidden = !(
      inTheme &&
      matches(decorSearch.get(d.id)!, df.query) &&
      stockMatches(df.stock, count, available) &&
      (df.category === 'all' || df.category === category)
    );
    if (!card.hidden) decorCount++;
  });
  const kind = inventoryTab ?? 'decorations';
  const filters = inventoryFilters[kind];
  const input = root.querySelector<HTMLInputElement>('#inventory-search')!;
  if (input.value !== filters.query) input.value = filters.query;
  root.querySelector<HTMLSelectElement>('#inventory-stock')!.value =
    filters.stock;
  const category = root.querySelector<HTMLSelectElement>(
    '#inventory-category',
  )!;
  category.hidden = kind !== 'decorations';
  category.value = filters.category;
  const count = kind === 'landmarks' ? landmarkCount : decorCount;
  root.querySelector('#inventory-results')!.textContent =
    `${count} matching items`;
  const empty = root.querySelector<HTMLElement>('.inventory-empty')!;
  empty.hidden = count !== 0;
}

const satchelArt = `<svg viewBox="0 0 72 70" aria-hidden="true"><ellipse cx="36" cy="64" rx="27" ry="4" fill="#193c3933"/><path d="M24 18V12q12-10 24 0v6" fill="none" stroke="#654e38" stroke-width="5"/><path d="M12 23q24-8 48 0l3 35q-26 12-54 0z" fill="#ab8051" stroke="#654e38" stroke-width="2"/><path d="M10 22q26-12 52 0L55 40q-18 7-38 0z" fill="#ceab70" stroke="#765b3d" stroke-width="2"/><path d="M18 26q18-6 36 0M16 49l1 9m39-9-1 9" fill="none" stroke="#ecd6a3" stroke-width="1.5"/><path d="M31 32h10v18H31z" fill="#816344"/><rect x="31" y="38" width="10" height="8" rx="2" fill="#e8c879" stroke="#654e38"/><path d="M48 18q-4-14 8-15 1 11-8 15" fill="#7c9c5c" stroke="#516b48"/><path d="M47 22l8-15" stroke="#516b48"/></svg>`;
const journalArt = `<svg viewBox="0 0 72 70" aria-hidden="true"><ellipse cx="36" cy="64" rx="26" ry="4" fill="#193c3933"/><path d="M15 12L52 7l8 45-40 9z" fill="#607c6a" stroke="#3b554c" stroke-width="2"/><path d="M21 15l28-4 7 38-32 7z" fill="#f0e4bf" stroke="#ab9c73"/><path d="M15 12l6 45 5 4-7-46z" fill="#9e7951"/><path d="M24 28l25-4m-23 10 25-4m-22 16 23-4" stroke="#b7aa82"/><path d="M33 38l5-19 9 17-7-3z" fill="#86a17c" stroke="#61755f"/><circle cx="40" cy="28" r="2" fill="#f6ecc9"/><path d="M43 51l2 14 5-5 5 3-3-14" fill="#af6950"/><path d="M17 20l4-1m-2 10 4-1m-2 10 4-1m-2 10 4-1" stroke="#e4c591" stroke-width="2"/></svg>`;
const chestArt = `<svg viewBox="0 0 72 70" aria-hidden="true"><ellipse cx="36" cy="64" rx="29" ry="4" fill="#193c3933"/><path d="M9 34h54v25q-27 9-54 0z" fill="#98623b" stroke="#563f2c" stroke-width="2"/><path d="M9 34V23Q10 7 36 7t27 16v11z" fill="#bd9155" stroke="#563f2c" stroke-width="2"/><path d="M10 26h52M10 46h52M11 55h50" stroke="#785333" stroke-width="2"/><path d="M18 11v51m36-51v51" stroke="#e2bf70" stroke-width="6"/><path d="M9 34h54" stroke="#ebcb80" stroke-width="5"/><rect x="29" y="29" width="14" height="17" rx="3" fill="#edcf83" stroke="#785333"/><path d="M36 34a2 2 0 1 0 0 4v4" fill="none" stroke="#664d30" stroke-width="2"/><path d="M34 10l2-5 2 5 5 2-5 2-2 5-2-5-5-2z" fill="#fff1bb"/></svg>`;
function canvasInventory() {
  const tickets = availableTickets(state).length;
  const drawLabel = pendingTicket ? 'Retry discovery' : 'Open 1 treasure';
  return `<div class="island-satchel" role="group" aria-label="Island collections"><button class="satchel-item" data-inventory="decorations" aria-label="Open decorations" aria-controls="canvas-inventory" aria-expanded="${inventoryTab === 'decorations'}">${satchelArt}<span>Decorations</span></button><button class="satchel-item" data-inventory="landmarks" aria-label="Open landmarks" aria-controls="canvas-inventory" aria-expanded="${inventoryTab === 'landmarks'}">${journalArt}<span>Landmarks</span></button><button id="open-treasure" class="satchel-item treasure-chest" aria-label="Open treasure menu" aria-controls="treasure-menu" aria-expanded="${treasureOpen}" ${!loaded || busy ? 'disabled' : ''}>${chestArt}<span>Treasure</span><b id="ticket-count" aria-label="${tickets} exploration tickets">${tickets}</b></button></div><aside id="treasure-menu" class="treasure-menu" aria-labelledby="treasure-title" ${treasureOpen ? '' : 'hidden'}><div class="inventory-heading"><div><small>EXPLORATION TICKETS</small><h2 id="treasure-title">Treasure</h2></div><button id="close-treasure" aria-label="Close treasure menu">×</button></div><div class="treasure-menu-body"><p class="treasure-balance">${tickets} exploration tickets</p><p id="treasure-help">Create a worktree to earn an exploration ticket</p><div class="treasure-choices"><button id="draw-ticket" aria-label="${drawLabel}" aria-describedby="treasure-help" aria-haspopup="dialog" ${!loaded || busy || !!pendingTickets || (!tickets && !pendingTicket) ? 'disabled' : ''}><strong>${pendingTicket ? 'Retry discovery' : 'Open 1'}</strong><small>1 ticket</small></button><button id="draw-ten" aria-label="${pendingTickets ? 'Retry 10 treasures' : 'Open 10 treasures'}" aria-describedby="treasure-help" aria-haspopup="dialog" ${!loaded || busy || !!pendingTicket || (!pendingTickets && tickets < 10) ? 'disabled' : ''}><strong>${pendingTickets ? 'Retry ×10' : 'Open 10'}</strong><small>10 tickets</small></button></div><label class="skip-discovery" title="When checked, both single and ten-ticket draws show results immediately."><input id="skip-discovery" type="checkbox" ${skipDiscovery ? 'checked' : ''} ${busy ? 'disabled' : ''}><span>Skip animation</span></label><p class="treasure-note">Only new discoveries play an animation, at every tier.</p></div></aside><aside id="canvas-inventory" class="canvas-inventory" aria-label="Island inventory" ${inventoryTab ? '' : 'hidden'}><div class="inventory-heading"><div><small>THE EXPLORER’S SATCHEL</small><h2 id="inventory-title">${inventoryTab === 'landmarks' ? 'Landmark journal' : 'Garden treasures'}</h2></div><button id="close-inventory" aria-label="Close inventory">×</button></div>${inventoryFinder()}<div class="inventory-scroll" data-inventory-tab="${inventoryTab ?? 'decorations'}"><div data-inventory-page="decorations" ${inventoryTab === 'decorations' ? '' : 'hidden'}>${workshop()}</div><div data-inventory-page="landmarks" ${inventoryTab === 'landmarks' ? '' : 'hidden'}>${collection()}</div><p class="inventory-empty" hidden>No matching items. Try another name or reset the filters.</p></div><p class="inventory-hint">Choose a piece to place it on your island.</p></aside>`;
}
function setTreasure(open: boolean, focus = true) {
  if (open && inventoryTab) setInventory(undefined, false);
  treasureOpen = open;
  root.querySelector<HTMLElement>('#treasure-menu')!.hidden = !open;
  root
    .querySelector('#open-treasure')!
    .setAttribute('aria-expanded', String(open));
  const ocean = root.querySelector<HTMLElement>('.ocean');
  if (ocean)
    ocean.dataset.inventoryOpen = String(open || Boolean(inventoryTab));
  if (focus)
    root
      .querySelector<HTMLElement>(open ? '#close-treasure' : '#open-treasure')
      ?.focus({ preventScroll: true });
}
document.addEventListener('pointerdown', (event) => {
  if (
    treasureOpen &&
    !(event.target as Element).closest('#treasure-menu,#open-treasure')
  )
    setTreasure(false, false);
});
document.addEventListener('keydown', (event) => {
  if (treasureOpen && event.key === 'Escape') {
    event.preventDefault();
    setTreasure(false);
  }
});
function setInventory(tab: typeof inventoryTab, focus = true) {
  if (tab && treasureOpen) setTreasure(false, false);
  const scroll = root.querySelector<HTMLElement>('.inventory-scroll');
  if (scroll && inventoryTab && !scroll.closest('[hidden]'))
    inventoryScroll[
      scroll.dataset.inventoryTab as keyof typeof inventoryScroll
    ] = scroll.scrollTop;
  const previous = inventoryTab;
  inventoryTab = tab;
  root.querySelector<HTMLElement>('.canvas-inventory')!.hidden = !tab;
  root
    .querySelectorAll<HTMLElement>('[data-inventory-page]')
    .forEach((page) => {
      page.hidden = page.dataset.inventoryPage !== tab;
    });
  root.querySelectorAll<HTMLElement>('[data-inventory]').forEach((button) => {
    button.setAttribute(
      'aria-expanded',
      String(button.dataset.inventory === tab),
    );
  });
  root.querySelector('#inventory-title')!.textContent =
    tab === 'landmarks' ? 'Landmark journal' : 'Garden treasures';
  if (tab && scroll) {
    scroll.dataset.inventoryTab = tab;
    scroll.scrollTop = inventoryScroll[tab];
  }
  applyInventoryFilters();
  const ocean = root.querySelector<HTMLElement>('.ocean');
  if (ocean) {
    ocean.dataset.inventoryOpen = String(Boolean(tab));
    if (tab) {
      const bounds = ocean.getBoundingClientRect();
      if (bounds.top < 0 || bounds.bottom > window.innerHeight)
        ocean.scrollIntoView({ block: 'center', behavior: 'instant' });
    }
  }
  if (focus)
    root
      .querySelector<HTMLElement>(
        tab
          ? '#close-inventory'
          : `[data-inventory="${previous ?? 'landmarks'}"]`,
      )
      ?.focus({ preventScroll: true });
}
function edit(name: string, input: unknown) {
  const checkedInput = { ...(input as object), expected: layout(state) };
  return run(() => request(name, checkedInput), 'edit');
}
let selectionMode: 'walk' | 'build' = 'build';
function selectPiece(cell: number, layer: 'floor' | 'objects' = 'objects') {
  if (busy) return;
  selectionMode = scene.mode;
  from = cell;
  editLayer = layer;
  moving = moveBlocked = brushEnabled = false;
  selected = selectedDecor = '';
  render();
  root
    .querySelector<HTMLElement>('#move-piece')
    ?.focus({ preventScroll: true });
}
function positionPieceMenu() {
  const menu = root.querySelector<HTMLElement>('.piece-menu');
  const ocean = root.querySelector<HTMLElement>('.ocean');
  if (!menu || menu.hidden || !ocean || from === undefined) return;
  const tile = root.querySelector<HTMLElement>(`[data-world-cell="${from}"]`);
  const anchor = (
    tile?.querySelector(editLayer === 'floor' ? '.cell' : '.building-select') ??
    tile
  )?.getBoundingClientRect();
  if (!anchor) return;
  const bounds = ocean.getBoundingClientRect();
  const gap = 10;
  let left = anchor.right - bounds.left + gap;
  let top = anchor.top - bounds.top;
  if (left + menu.offsetWidth > ocean.clientWidth - gap) {
    const before = anchor.left - bounds.left - menu.offsetWidth - gap;
    if (before >= gap) left = before;
    else {
      left =
        (anchor.left + anchor.right) / 2 - bounds.left - menu.offsetWidth / 2;
      const below = anchor.bottom - bounds.top + gap;
      top =
        below + menu.offsetHeight <= ocean.clientHeight - gap
          ? below
          : anchor.top - bounds.top - menu.offsetHeight - gap;
    }
  }
  menu.style.left = `${Math.max(gap, Math.min(left, ocean.clientWidth - menu.offsetWidth - gap))}px`;
  menu.style.top = `${Math.max(gap, Math.min(top, ocean.clientHeight - menu.offsetHeight - gap))}px`;
}
function pieceMenu() {
  if (from === undefined || moving)
    return '<aside class="piece-menu" hidden></aside>';
  const landmark =
    editLayer === 'objects'
      ? state.placements.find((p) => p.cell === from)
      : undefined;
  const decor = (editLayer === 'floor' ? state.floors : state.decorations).find(
    (p) => p.cell === from,
  );
  const item = landmark
    ? landmarkById(landmark.landmark)
    : decor
      ? decorationById(decor.decoration)
      : undefined;
  if (!item) return '<aside class="piece-menu" hidden></aside>';
  const rotatable = Boolean(
    landmark ||
    (editLayer === 'objects' && decor && canRotate(decor.decoration)),
  );
  return `<aside class="piece-menu" aria-labelledby="piece-title"><div class="piece-heading"><strong id="piece-title">${escape(item.name)}</strong><button id="cancel" aria-label="Cancel selection">×</button></div><button id="move-piece">Move</button><div class="piece-rotation" role="group" aria-label="Piece rotation"><button id="rotate-left" data-rotate="-1" ${rotatable ? '' : 'disabled'}>Rotate left</button><button id="rotate-piece" data-rotate="1" ${rotatable ? '' : 'disabled'}>Rotate right</button></div><span class="piece-direction">${landmark ? ((landmark.rotation ?? 0) === 0 ? 'Original facing' : 'Mirrored facing') : `${decor && 'rotation' in decor ? Number(decor.rotation ?? 0) * 90 : 0}°`}</span><small>${landmark ? 'Two facing directions' : rotatable ? 'Four facing directions' : 'This piece has a fixed orientation.'}</small>${landmark ? '<button id="inspect-piece">About this landmark</button>' : ''}${editLayer === 'objects' && state.floors.some((p) => p.cell === from) ? '<button id="select-floor">Select floor beneath</button>' : ''}<button id="remove">Return to collection</button></aside>`;
}
function cancelPiece() {
  const cell = from;
  if (moving) {
    moving = false;
    scene.mode = selectionMode;
  } else from = undefined;
  moveBlocked = false;
  render();
  root
    .querySelector<HTMLElement>(
      from !== undefined
        ? '#move-piece'
        : `[data-world-cell="${cell}"] .building-select`,
    )
    ?.focus({ preventScroll: true });
}
document.addEventListener('keydown', (event) => {
  if (
    event.key !== 'Escape' ||
    from === undefined ||
    treasureOpen ||
    inventoryTab ||
    document.querySelector('dialog[open]')
  )
    return;
  event.preventDefault();
  cancelPiece();
});
function editorTools() {
  const current =
    from === undefined
      ? undefined
      : state.decorations.find((p) => p.cell === from);
  const rotatable =
    editLayer === 'objects' &&
    (current ? canRotate(current.decoration) : canRotate(selectedDecor));
  const paintable =
    selectedDecor &&
    (isFloor(selectedDecor) ||
      decorationById(selectedDecor)?.shape === 'flowers');
  return `<div class="editor-tools" aria-label="Island editing tools"><button id="undo-layout" ${!undoStack.length ? 'disabled' : ''}>Undo layout${undoStack.length ? ` · ${undoStack.length}` : ''}</button>${scene.mode === 'build' ? `<div role="group" aria-label="Edit layer"><button data-edit-layer="objects" aria-pressed="${editLayer === 'objects'}">Objects</button><button data-edit-layer="floor" aria-pressed="${editLayer === 'floor'}">Floor</button></div>${paintable ? `<button id="brush-toggle" aria-pressed="${brushEnabled}">Brush · ${brushEnabled ? 'On' : 'Off'}</button>` : ''}${from === undefined && rotatable ? `<div class="rotation-controls" role="group" aria-label="Piece rotation"><button id="rotate-left" data-rotate="-1" ${!rotatable || moving ? 'disabled' : ''}>Rotate left</button><button id="rotate-piece" data-rotate="1" ${!rotatable || moving ? 'disabled' : ''}>Rotate right</button>${rotatable ? `<span class="piece-direction">${(current ? (current.rotation ?? 0) : placementRotation) * 90}°</span>` : '<small>This piece has a fixed orientation.</small>'}</div>` : ''}${selectedDecor || selected ? '<button id="stop-placing">Cancel selection</button>' : ''}<small>${editLayer === 'floor' ? 'Floor layer · Paint beneath objects' : 'Object layer · Floors stay in place'}${selectedDecor && canRotate(selectedDecor) ? ` · Facing ${placementRotation * 90}°` : ''}</small>` : ''}</div>`;
}
function canvasEditor() {
  const hint =
    from !== undefined
      ? moving
        ? moveBlocked
          ? 'That tile is occupied. Choose another destination.'
          : editLayer === 'floor'
            ? 'Choose a tile without flooring to move the selected piece.'
            : 'Choose an empty cell to move the selected piece.'
        : editLayer === 'floor'
          ? 'Floor selected. Choose Move, then click a destination without flooring.'
          : 'Piece selected. Choose Move or a rotation direction from the menu.'
      : selectedDecor
        ? isFloor(selectedDecor)
          ? `Lay ${decorationById(selectedDecor)!.name} on any unlocked tile, including beneath objects.`
          : `Place ${decorationById(selectedDecor)!.name} on an empty cell.`
        : selected
          ? `Place ${escape(landmarkById(selected)!.name)} on an empty cell.`
          : 'Open the satchel or journal on the island to choose a piece.';
  if (moving)
    return `<aside class="canvas-editor moving-editor" aria-label="Island arrangement"><p class="placement-hint" aria-live="polite">${hint}</p><button id="cancel">Cancel move</button></aside>`;
  return `<aside class="canvas-editor" aria-label="Island arrangement">${scene.modeMarkup()}${scene.mode === 'build' ? `<p class="placement-hint" aria-live="polite">${hint}</p>` : ''}${editorTools()}${moving ? '<div class="tools"><button id="cancel">Cancel move</button></div>' : ''}</aside>`;
}
let disposeCatalogMotion: (() => void) | undefined;
window.addEventListener('pagehide', (event) => {
  if (!event.persisted) disposeCatalogMotion?.();
});
function render() {
  disposeCatalogMotion?.();
  const previousScroll = root.querySelector<HTMLElement>('.inventory-scroll');
  if (previousScroll && inventoryTab && !previousScroll.closest('[hidden]'))
    inventoryScroll[
      previousScroll.dataset.inventoryTab as keyof typeof inventoryScroll
    ] = previousScroll.scrollTop;
  const focused = document.activeElement as HTMLElement | null;
  const focusSelector = focused?.matches('[data-variant]')
    ? `[data-variant="${focused.dataset.variant}"]`
    : focused?.matches('[data-craft]')
      ? `[data-craft="${focused.dataset.craft}"]`
      : focused?.id &&
          [
            'decor-theme',
            'inventory-search',
            'inventory-stock',
            'inventory-category',
            'skip-discovery',
            'close-treasure',
            'draw-ticket',
            'draw-ten',
          ].includes(focused.id)
        ? `#${focused.id}`
        : undefined;
  const owned = landmarks.filter((l) => discovered(state, l.id));
  const latest = landmarks.find(
    (l) => l.id === state.receipts.at(-1)?.landmark,
  );
  const markup = `<header><div class="book-title"><div class="eyebrow">A little island between tasks ${demo ? '<b>DEMO · LOCAL FIXTURES</b>' : ''}</div><h1>Orcatopia</h1></div><div class="stats"><strong>${owned.length}<small> / ${landmarks.length} discovered</small></strong><strong>${state.receipts.length}<small> discoveries</small></strong><strong>${new Set(owned.map((l) => l.code)).size}<small> countries</small></strong></div></header><nav><button data-view="island" aria-pressed="${view === 'island'}">My Island</button><button data-view="map" aria-pressed="${view === 'map'}">World Map</button>${demo ? '<button id="expedition">＋ Demo worktree</button>' : ''}<button id="refresh">Refresh</button><button id="backups" aria-haspopup="dialog">Backups</button></nav><p class="notice ${latest ? 'discovery-notice' : ''}" ${latest ? `data-tier="${latest.tier}"` : ''} role="status">${latest ? rarityBadge(latest.tier) : ''}<span>${escape(message)}</span></p>${error ? `<p role="alert">${escape(error)}</p>` : ''}
 ${
   view === 'island'
     ? `<section class="island-section"><div class="section-title"><h2><small>Chapter I</small> A place to wander</h2><span>${islandLand(state).length} / ${landTiles.length} land tiles</span></div><p class="land-progress">${islandLevel(state) >= MAX_LAND_LEVEL ? 'Your whole island is open.' : `At ${islandLevel(state) + 1} unique landmarks: +${landAtLevel(islandLevel(state) + 1).length - islandLand(state).length} land tiles · ${owned.length} unique discoveries`}${state.landFloor > owned.length ? ' · Existing settlement preserved; collection will catch up before further growth.' : ''}</p>${scene.markup()}<div class="ocean" tabindex="0" role="region" aria-label="Interactive island"><div class="camera"><div class="island">${terrain(state, from)}${scene.avatar()}</div><div class="sailboat" aria-hidden="true"><svg viewBox="0 0 90 90"><path d="M5 73q15-4 29 0m10 7q18-4 35 0" fill="none" stroke="#e7eedb" stroke-width="2"/><path d="M13 60q32 7 65-1L65 73H26z" fill="#ad7355" stroke="#655542" stroke-width="2"/><path d="M46 60V7" stroke="#655542" stroke-width="2"/><path d="M42 13Q26 29 20 50l22-3z" fill="#fcf3d8" stroke="#8c8268"/><path d="M50 21l20 29-20 2z" fill="#d9b07d" stroke="#8c8268"/><path d="M47 8l14 3-14 6" fill="#b76550"/></svg></div></div>${scene.layers(state)}${canvasInventory()}${canvasEditor()}${pieceMenu()}</div></section>`
     : `<section><div class="section-title"><h2><small>Chapter II</small> A world of discoveries</h2><span>${owned.length} real locations</span></div><svg class="world" viewBox="0 0 720 360" role="img" aria-label="World map of collected landmarks">${world.map((c) => `<path d="${c.path}" class="${owned.some((l) => l.code === c.code) ? 'acquired' : ''}"><title>${escape(c.name)}</title></path>`).join('')}${owned.map((l) => `<circle cx="${(l.lon + 180) * 2}" cy="${(90 - l.lat) * 2}" r="4"><title>${escape(l.name)} · ${escape(l.country)}</title></circle>`).join('')}</svg><p class="muted">Made with Natural Earth · approximate locations · equirectangular projection</p><div class="countries">${[...new Set(landmarks.map((l) => l.country))].map((c) => `<span>${escape(c)} <strong>${owned.filter((l) => l.country === c).length}/${landmarks.filter((l) => l.country === c).length}</strong></span>`).join('')}</div><p><button id="map-journal">Open landmark journal on island</button></p></section><div hidden>${canvasInventory()}</div>`
 }
<footer>${landmarks.length}-landmark prototype · Tier chances: ${rarities.map((r) => `${r.numeral} ${r.name} ${weights[r.id]}%`).join(' / ')}. Each item within a tier is equally likely. No guarantees.<br>${demo ? 'Demo saves only in this browser.' : 'Saved locally on this Orca host. Events missed while disabled are not backfilled.'}</footer>`;
  renderIsland(root, markup);
  // Retained world buttons must become available again after a pending save.
  root
    .querySelectorAll<HTMLButtonElement>('.camera button')
    .forEach((button) => {
      button.disabled = busy;
    });
  const filterCollection = () => {
    root
      .querySelectorAll<HTMLButtonElement>('[data-tier-filter]')
      .forEach((button) => {
        button.setAttribute(
          'aria-pressed',
          String(button.dataset.tierFilter === rarityFilter),
        );
      });
    const rarity = rarities.find((r) => r.id === rarityFilter);
    root.querySelector('.rarity-summary')!.textContent = rarity
      ? `${rarity.numeral} ${rarity.name} · Rarity ${rarity.rank}/4 · ${weights[rarity.id]}% tier chance per draw · ${owned.filter((l) => l.tier === rarity.id).length} of ${landmarks.filter((l) => l.tier === rarity.id).length} discovered`
      : 'Four rarity tiers · Counts track unique landmarks, not duplicate copies.';
    applyInventoryFilters();
  };
  root
    .querySelectorAll<HTMLButtonElement>('[data-tier-filter]')
    .forEach((button) => {
      button.onclick = () => {
        rarityFilter = button.dataset.tierFilter!;
        filterCollection();
      };
    });
  filterCollection();
  const updateFinder = () => {
    applyInventoryFilters();
    root.querySelector<HTMLElement>('.inventory-scroll')!.scrollTop = 0;
    inventoryScroll[inventoryTab ?? 'decorations'] = 0;
  };
  const search = root.querySelector<HTMLInputElement>('#inventory-search')!;
  search.oninput = () => {
    const kind = inventoryTab ?? 'decorations';
    inventoryFilters[kind].query = search.value;
    // Searching starts across the full catalog, including discoverable locked sets.
    if (
      kind === 'decorations' &&
      search.value.trim() &&
      decorTheme === 'unlocked'
    ) {
      decorTheme = 'all';
      root.querySelector<HTMLSelectElement>('#decor-theme')!.value = 'all';
    }
    updateFinder();
  };
  root.querySelector<HTMLButtonElement>('#clear-inventory-search')!.onclick =
    () => {
      inventoryFilters[inventoryTab ?? 'decorations'].query = '';
      updateFinder();
      search.focus({ preventScroll: true });
    };
  root.querySelector<HTMLSelectElement>('#inventory-stock')!.onchange = (
    event,
  ) => {
    inventoryFilters[inventoryTab ?? 'decorations'].stock = (
      event.target as HTMLSelectElement
    ).value;
    updateFinder();
  };
  root.querySelector<HTMLSelectElement>('#inventory-category')!.onchange = (
    event,
  ) => {
    inventoryFilters.decorations.category = (
      event.target as HTMLSelectElement
    ).value;
    updateFinder();
  };
  root.querySelector<HTMLButtonElement>('#reset-inventory-filters')!.onclick =
    () => {
      const kind = inventoryTab ?? 'decorations';
      inventoryFilters[kind] = { query: '', stock: 'all', category: 'all' };
      if (kind === 'landmarks') rarityFilter = 'all';
      else {
        decorTheme = 'unlocked';
        root.querySelector<HTMLSelectElement>('#decor-theme')!.value =
          decorTheme;
      }
      filterCollection();
      updateFinder();
      search.focus({ preventScroll: true });
    };
  root.querySelectorAll<HTMLButtonElement>('button').forEach((b) => {
    if (busy) b.disabled = true;
  });
  root.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(
    (b) =>
      (b.onclick = () => {
        view = b.dataset.view!;
        selected = '';
        selectedDecor = '';
        from = undefined;
        moving = false;
        moveBlocked = false;
        render();
      }),
  );
  root.querySelectorAll<HTMLButtonElement>('[data-landmark]').forEach(
    (b) =>
      (b.onclick = () => {
        setInventory(undefined, false);
        selected = b.dataset.landmark!;
        editLayer = 'objects';
        brushEnabled = false;
        selectedDecor = '';
        scene.mode = 'build';
        from = undefined;
        moving = false;
        moveBlocked = false;
        view = 'island';
        render();
        root
          .querySelector<HTMLElement>('.ocean')
          ?.focus({ preventScroll: true });
      }),
  );
  root.querySelectorAll<HTMLButtonElement>('[data-cell], [data-site]').forEach(
    (b) =>
      (b.onclick = () => {
        const cell = Number(b.dataset.cell ?? b.dataset.site);
        let p =
          editLayer === 'floor'
            ? state.floors.find((p) => p.cell === cell)
            : (state.placements.find((p) => p.cell === cell) ??
              state.decorations.find((p) => p.cell === cell));
        if (selectedDecor && isFloor(selectedDecor)) {
          const decoration = selectedDecor;
          if (!brushEnabled) selectedDecor = '';
          edit('island.decorate', { cell, decoration, layer: 'floor' });
          return;
        }
        if (from !== undefined && moving) {
          if (p) {
            moveBlocked = true;
            render();
            return;
          }
          const origin = from;
          const name =
            editLayer === 'floor' ||
            state.decorations.some((p) => p.cell === origin)
              ? 'island.decorate'
              : 'island.place';
          const expected = layout(state);
          void run(async () => {
            const next = await request(name, {
              cell,
              from: origin,
              layer: editLayer,
              expected,
            });
            from = undefined;
            moving = false;
            moveBlocked = false;
            scene.mode = selectionMode;
            return next;
          }, 'edit');
          return;
        }
        // A visible floor can be selected directly when no placement is active.
        if (!p && editLayer === 'objects' && !selected && !selectedDecor) {
          const floor = state.floors.find((p) => p.cell === cell);
          if (floor) {
            editLayer = 'floor';
            p = floor;
          }
        }
        if (p) {
          selectPiece(cell, editLayer);
          return;
        }
        // Selecting a piece is not permission to move it. Empty clicks leave it in place.
        if (from !== undefined) return;
        if (selectedDecor) {
          const decoration = selectedDecor;
          if (!brushEnabled) selectedDecor = '';
          edit('island.decorate', {
            cell,
            decoration,
            rotation: canRotate(decoration) ? placementRotation : undefined,
          });
        } else if (selected) {
          const landmark = selected;
          selected = '';
          edit('island.place', { cell, landmark });
        }
      }),
  );
  root.querySelectorAll<HTMLButtonElement>('[data-info]').forEach((button) => {
    button.onclick = () => showDetails(button.dataset.info!);
  });
  const themeSelect = root.querySelector<HTMLSelectElement>('#decor-theme');
  if (themeSelect) {
    themeSelect.value = decorTheme;
    themeSelect.disabled = busy;
    themeSelect.onchange = () => {
      decorTheme = themeSelect.value;
      render();
      root
        .querySelector<HTMLElement>('#decor-theme')
        ?.focus({ preventScroll: true });
    };
  }
  root
    .querySelectorAll<HTMLButtonElement>('[data-decor-place]')
    .forEach((button) => {
      button.onclick = () => {
        setInventory(undefined, false);
        selectedDecor = button.dataset.decorPlace!;
        editLayer = isFloor(selectedDecor) ? 'floor' : 'objects';
        brushEnabled = false;
        placementRotation = 0;
        selected = '';
        from = undefined;
        moving = false;
        moveBlocked = false;
        scene.mode = 'build';
        render();
        root
          .querySelector<HTMLElement>('.ocean')
          ?.focus({ preventScroll: true });
      };
    });
  root
    .querySelectorAll<HTMLButtonElement>('[data-variant]')
    .forEach((button) => {
      button.onclick = () => {
        variantFilter = button.dataset.variant as typeof variantFilter;
        render();
      };
    });
  root.querySelectorAll<HTMLButtonElement>('[data-craft]').forEach((button) => {
    button.onclick = () => {
      pendingCraft ??= {
        id: crypto.randomUUID(),
        decoration: button.dataset.craft!,
      };
      void run(async () => {
        const result = await request('island.craft', pendingCraft);
        message = `${decorationById(pendingCraft!.decoration)!.name} crafted. Ready to place on your island.`;
        pendingCraft = undefined;
        return result;
      });
    };
  });
  root
    .querySelectorAll<HTMLButtonElement>('[data-edit-layer]')
    .forEach((button) => {
      button.onclick = () => {
        editLayer = button.dataset.editLayer as typeof editLayer;
        selected = selectedDecor = '';
        from = undefined;
        moving = false;
        moveBlocked = false;
        brushEnabled = false;
        render();
      };
    });
  const brushButton = root.querySelector<HTMLButtonElement>('#brush-toggle');
  if (brushButton)
    brushButton.onclick = () => {
      brushEnabled = !brushEnabled;
      render();
    };
  const stop = root.querySelector<HTMLButtonElement>('#stop-placing');
  if (stop)
    stop.onclick = () => {
      selected = selectedDecor = '';
      brushEnabled = false;
      render();
    };
  root
    .querySelectorAll<HTMLButtonElement>('[data-rotate]')
    .forEach((button) => {
      button.onclick = () => {
        const step = Number(button.dataset.rotate);
        if (from !== undefined) {
          const current =
            state.placements.find((p) => p.cell === from) ??
            state.decorations.find((p) => p.cell === from);
          if (
            !current ||
            ('decoration' in current && !canRotate(current.decoration)) ||
            moving ||
            editLayer === 'floor'
          )
            return;
          const directions = 'landmark' in current ? 2 : 4;
          const focusId = button.id;
          void edit('island.rotate', {
            cell: from,
            rotation:
              ((current.rotation ?? 0) + step + directions) % directions,
          }).then(() =>
            root
              .querySelector<HTMLElement>(`#${focusId}`)
              ?.focus({ preventScroll: true }),
          );
        } else {
          placementRotation = (placementRotation + step + 4) % 4;
          render();
        }
      };
    });
  const selectFloor = root.querySelector<HTMLButtonElement>('#select-floor');
  if (selectFloor)
    selectFloor.onclick = () => {
      editLayer = 'floor';
      moving = false;
      moveBlocked = false;
      render();
      root
        .querySelector<HTMLElement>('#move-piece')
        ?.focus({ preventScroll: true });
    };
  const move = root.querySelector<HTMLButtonElement>('#move-piece');
  if (move)
    move.onclick = () => {
      scene.mode = 'build';
      moving = true;
      moveBlocked = false;
      render();
      root.querySelector<HTMLElement>('.ocean')?.focus({ preventScroll: true });
    };
  const undo = root.querySelector<HTMLButtonElement>('#undo-layout');
  if (undo)
    undo.onclick = () => {
      const entry = undoStack.at(-1);
      if (!entry) return;
      selected = selectedDecor = '';
      from = undefined;
      moving = false;
      moveBlocked = false;
      brushEnabled = false;
      void run(async () => {
        const next = await request('island.layout', {
          expected: entry.after,
          layout: entry.before,
        });
        message =
          'Layout change undone. Your discoveries and crafted pieces are kept.';
        return next;
      }, 'undo');
    };
  root
    .querySelectorAll<HTMLButtonElement>('[data-inventory]')
    .forEach((button) => {
      button.onclick = () =>
        setInventory(
          inventoryTab === button.dataset.inventory
            ? undefined
            : (button.dataset.inventory as typeof inventoryTab),
        );
    });
  root.querySelector<HTMLButtonElement>('#close-inventory')!.onclick = () =>
    setInventory(undefined);
  root.querySelector<HTMLElement>('.canvas-inventory')!.onkeydown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setInventory(undefined);
    }
  };
  root.querySelector<HTMLElement>('.canvas-inventory')!.addEventListener(
    'wheel',
    (event) => {
      if ((event.target as Element).closest('.inventory-scroll')) return;
      event.preventDefault();
      const scroll = root.querySelector<HTMLElement>('.inventory-scroll')!;
      const unit =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? scroll.clientHeight
            : 1;
      scroll.scrollTop += event.deltaY * unit;
    },
    { passive: false },
  );
  const mapJournal = root.querySelector<HTMLButtonElement>('#map-journal');
  if (mapJournal)
    mapJournal.onclick = () => {
      view = 'island';
      inventoryTab = 'landmarks';
      render();
      root
        .querySelector<HTMLElement>('#close-inventory')
        ?.focus({ preventScroll: true });
    };
  if (inventoryTab) {
    const scroll = root.querySelector<HTMLElement>('.inventory-scroll')!;
    scroll.scrollTop = inventoryScroll[inventoryTab];
  }
  disposeCatalogMotion = observeCatalogMotion(
    root.querySelector<HTMLElement>('.inventory-scroll')!,
  );
  const ocean = root.querySelector<HTMLElement>('.ocean');
  if (ocean)
    ocean.dataset.inventoryOpen = String(treasureOpen || Boolean(inventoryTab));
  if (focusSelector && (inventoryTab || treasureOpen))
    root
      .querySelector<HTMLElement>(focusSelector)
      ?.focus({ preventScroll: true });
  scene.mount(
    root,
    state,
    () => {
      selected = '';
      selectedDecor = '';
      from = undefined;
      moving = false;
      moveBlocked = false;
      brushEnabled = false;
      inventoryTab = undefined;
      render();
      root
        .querySelector<HTMLElement>(`button[data-mode="${scene.mode}"]`)
        ?.focus({ preventScroll: true });
    },
    busy,
    selectPiece,
    brushEnabled && selectedDecor && scene.mode === 'build'
      ? {
          decoration: selectedDecor,
          available:
            decorationQuantity(state, selectedDecor) -
            state.decorations.filter((p) => p.decoration === selectedDecor)
              .length,
          onStroke: (cells) => {
            message = `Placing ${cells.length} tiles. Occupied objects and unchanged floors are skipped.`;
            edit('island.paint', {
              decoration: selectedDecor,
              cells,
              expected: layout(state),
            });
          },
        }
      : undefined,
    positionPieceMenu,
  );
  camp.bind(root, state, busy);
  requestAnimationFrame(positionPieceMenu);
  root.querySelector<HTMLElement>('.piece-menu')?.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      const menu = event.currentTarget as HTMLElement;
      menu.scrollTop +=
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? menu.clientHeight
            : 1);
    },
    { passive: false },
  );
  const inspectPiece = root.querySelector<HTMLButtonElement>('#inspect-piece');
  if (inspectPiece)
    inspectPiece.onclick = () => {
      const item = state.placements.find((p) => p.cell === from);
      if (item) showDetails(item.landmark);
    };
  const remove = root.querySelector<HTMLButtonElement>('#remove');
  if (remove)
    remove.onclick = () => {
      const cell = from;
      from = undefined;
      moving = false;
      moveBlocked = false;
      edit(
        editLayer === 'floor' || state.decorations.some((p) => p.cell === cell)
          ? 'island.decorate'
          : 'island.place',
        { cell, layer: editLayer },
      );
    };
  const cancel = root.querySelector<HTMLButtonElement>('#cancel');
  if (cancel) cancel.onclick = cancelPiece;
  root.querySelector<HTMLButtonElement>('#backups')!.onclick = () =>
    void openBackups();
  root.querySelector<HTMLButtonElement>('#refresh')!.onclick = () =>
    void run(() => request('island.read')).then(() => readCrew());
  root.querySelector<HTMLButtonElement>('#open-treasure')!.onclick = () =>
    setTreasure(!treasureOpen);
  root.querySelector<HTMLButtonElement>('#close-treasure')!.onclick = () =>
    setTreasure(false);
  root.querySelector<HTMLElement>('#treasure-menu')!.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      const menu = event.currentTarget as HTMLElement;
      menu.scrollTop +=
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? menu.clientHeight
            : 1);
    },
    { passive: false },
  );
  root.querySelector<HTMLButtonElement>('#draw-ticket')!.onclick = () =>
    void useTicket();
  root.querySelector<HTMLButtonElement>('#draw-ten')!.onclick = () =>
    void useTicket(10);
  root.querySelector<HTMLInputElement>('#skip-discovery')!.onchange = (
    event,
  ) => {
    skipDiscovery = (event.currentTarget as HTMLInputElement).checked;
  };
  const expedition = root.querySelector<HTMLButtonElement>('#expedition');
  if (expedition)
    expedition.onclick = () =>
      void run(() =>
        game.acquire({ workspaceId: crypto.randomUUID(), kind: 'worktree' }),
      );
}
// The host save API needs a fresh user gesture: prepare data before enabling Save.
const backupDialog = document.createElement('dialog');
backupDialog.className = 'backup-dialog';
backupDialog.setAttribute('aria-labelledby', 'backup-title');
document.body.append(backupDialog);
let backupWorking = false;
backupDialog.addEventListener('cancel', (event) => {
  if (backupWorking) event.preventDefault();
});
backupDialog.addEventListener('close', () => {
  backupDialog.replaceChildren();
  root
    .querySelector<HTMLButtonElement>('#backups')
    ?.focus({ preventScroll: true });
});
const backupRequest = (previous = false) =>
  bridge
    ? bridge.request<string>('island.backup', { previous })
    : game.exportBackup(previous);
function saveSummary(s: State) {
  return `${availableTickets(s).length} unused tickets · ${s.receipts.length - s.fusions.length} landmarks (${collectibleLandmarks.filter((l) => quantity(s, l.id) > 0).length} unique) · ${s.placements.length} placed · ${s.decorations.length} decorations placed · ${s.floors.length} floor tiles · ${materials(s)} materials · ${islandLand(s).length} land tiles`;
}
async function openBackups() {
  if (busy || backupDialog.open) return;
  backupDialog.innerHTML = `<button class="backup-close" aria-label="Close backups" autofocus>×</button><h2 id="backup-title">Your island, safely kept</h2><p>Save a file to keep a backup or move your island to another computer. Nothing is uploaded.</p><p class="backup-current"></p><button id="backup-save" disabled>Save backup file</button><hr><label for="backup-file">Choose a backup to restore</label><input id="backup-file" type="file" accept=".json,application/json" hidden><button id="backup-choose">Choose file…</button><button id="backup-previous">Review pre-restore copy</button><div class="backup-review" hidden><h3>Restore this island?</h3><p class="backup-incoming"></p><p>This replaces all current tickets, landmarks, decorations, materials and land; it does not merge them. Progress after the backup will be lost. A copy of your current save is kept before replacement.</p><label><input id="backup-confirm" type="checkbox"> I want to replace my current island</label><button id="backup-restore" disabled>Replace island</button></div><p class="backup-status" role="status"></p><small>Files contain workspace identifiers, which may include local paths. Keep them private. Maximum file size: 256 KiB. Walking, weather and camera position are not saved.</small>`;
  backupDialog.showModal();
  const status = backupDialog.querySelector<HTMLElement>('.backup-status')!;
  const save = backupDialog.querySelector<HTMLButtonElement>('#backup-save')!;
  const file = backupDialog.querySelector<HTMLInputElement>('#backup-file')!;
  const choose =
    backupDialog.querySelector<HTMLButtonElement>('#backup-choose')!;
  choose.onclick = () => file.click();
  const previous =
    backupDialog.querySelector<HTMLButtonElement>('#backup-previous')!;
  const confirm =
    backupDialog.querySelector<HTMLInputElement>('#backup-confirm')!;
  const restore =
    backupDialog.querySelector<HTMLButtonElement>('#backup-restore')!;
  const review = backupDialog.querySelector<HTMLElement>('.backup-review')!;
  const close = backupDialog.querySelector<HTMLButtonElement>('.backup-close')!;
  let exportText = '',
    incomingText = '',
    expected: State;
  const tell = (text: string, failed = false) => {
    status.setAttribute('role', failed ? 'alert' : 'status');
    status.textContent = text;
  };
  const controls = (working: boolean) => {
    backupWorking = working;
    close.disabled =
      choose.disabled =
      file.disabled =
      previous.disabled =
      confirm.disabled =
        working;
    save.disabled = working || !exportText;
    restore.disabled = working || !incomingText || !confirm.checked;
  };
  const clearReview = () => {
    incomingText = '';
    confirm.checked = false;
    review.hidden = true;
    restore.disabled = true;
  };
  const preview = (text: string) => {
    const parsed = decodeBackup(text);
    incomingText = text;
    backupDialog.querySelector('.backup-incoming')!.textContent =
      `${saveSummary(parsed.state)} · Exported ${parsed.exportedAt}`;
    review.hidden = false;
    tell('Review the backup before replacing your island.');
  };
  close.onclick = () => {
    if (!backupWorking) backupDialog.close();
  };
  confirm.onchange = () => controls(false);
  file.onchange = async () => {
    clearReview();
    const chosen = file.files?.[0];
    if (!chosen) return;
    controls(true);
    try {
      if (chosen.size > MAX_BACKUP_BYTES)
        throw Error('Choose a backup of at most 256 KiB.');
      preview(await chosen.text());
    } catch (e) {
      tell(String(e), true);
    } finally {
      file.value = '';
      controls(false);
    }
  };
  previous.onclick = async () => {
    clearReview();
    controls(true);
    try {
      preview(await backupRequest(true));
    } catch (e) {
      tell(String(e), true);
    } finally {
      controls(false);
    }
  };
  save.onclick = async () => {
    if (backupWorking || !exportText) return;
    controls(true);
    try {
      const suggestedName = `landmark-island-${new Date().toISOString().slice(0, 10)}.json`;
      if (frame) {
        // No asynchronous preparation before this gesture-bound call.
        const result = await frame.files.saveAs({
          suggestedName,
          mimeType: 'application/json',
          data: exportText,
        });
        tell(
          result.status === 'saved'
            ? 'Backup file saved.'
            : 'Save cancelled. Your island is unchanged.',
        );
      } else {
        const url = URL.createObjectURL(
          new Blob([exportText], { type: 'application/json' }),
        );
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = suggestedName;
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        tell('Backup download started.');
      }
    } catch (e) {
      tell(`Could not save the backup: ${String(e)}`, true);
    } finally {
      controls(false);
    }
  };
  restore.onclick = async () => {
    if (backupWorking || !incomingText || !confirm.checked) return;
    controls(true);
    busy = true;
    try {
      const input = { text: incomingText, expected };
      state = bridge
        ? validate(await bridge.request('island.restore', input))
        : await game.restore(input);
      loaded = true;
      pendingTicket = undefined;
      pendingTickets = undefined;
      pendingCraft = undefined;
      pendingFusions.clear();
      undoStack.length = 0;
      selected = '';
      selectedDecor = '';
      from = undefined;
      moving = false;
      moveBlocked = false;
      error = '';
      message = 'Island restored from backup.';
      clearReview();
      exportText = await backupRequest();
      expected = decodeBackup(exportText).state;
      backupDialog.querySelector('.backup-current')!.textContent =
        `Current snapshot: ${saveSummary(expected)}`;
      tell('Island restored. The pre-restore copy is available above.');
    } catch (e) {
      // The host may have committed before a response failed: do not claim it did not.
      clearReview();
      exportText = '';
      tell(
        `${String(e)} Close Backups and refresh to check the saved island before retrying.`,
        true,
      );
    } finally {
      busy = false;
      controls(false);
      render();
    }
  };
  controls(true);
  try {
    exportText = await backupRequest();
    expected = decodeBackup(exportText).state;
    backupDialog.querySelector('.backup-current')!.textContent =
      `Current snapshot: ${saveSummary(expected)}. Reopen Backups to refresh this snapshot.`;
    tell('Ready to save a backup file.');
  } catch (e) {
    tell(String(e), true);
  } finally {
    controls(false);
    // Never allow a restore without a successfully read current snapshot.
    if (!exportText) choose.disabled = file.disabled = previous.disabled = true;
  }
}
function renderRevealPreview() {
  document.title = 'Orcatopia · Reveal Preview';
  document.body.classList.add('reveal-preview-page');
  const params = new URLSearchParams(location.search);
  let tier =
    rarities.find((r) => r.id === params.get('tier'))?.id ?? 'legendary';
  root.innerHTML = `<main class="reveal-preview"><p class="preview-eyebrow">LANDMARK ISLAND · DEMO</p><h1>The discovery theatre</h1><p class="preview-intro">A little light. A distant place. A new story.</p><div class="preview-compass" aria-hidden="true">✦</div><div class="preview-tiers" role="group" aria-label="Preview rarity">${rarities.map((r) => `<button data-preview-tier="${r.id}" aria-pressed="${r.id === tier}">${rarityBadge(r.id)}</button>`).join('')}</div><button id="preview-play">Play animation</button><p class="preview-note">Animation preview only. No tickets used. Your collection stays as it is.</p><a href="./">Return to island</a></main>`;
  const play = () => {
    const landmark = landmarks.find((l) => l.tier === tier)!;
    revealDiscovery(landmark, 1, rarityBadge(tier), play, { preview: true });
  };
  root
    .querySelectorAll<HTMLButtonElement>('[data-preview-tier]')
    .forEach((button) => {
      button.onclick = () => {
        tier = button.dataset.previewTier as typeof tier;
        root
          .querySelectorAll<HTMLButtonElement>('[data-preview-tier]')
          .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
        const url = new URL(location.href);
        url.searchParams.set('tier', tier);
        history.replaceState(null, '', url);
        play();
      };
    });
  root.querySelector<HTMLButtonElement>('#preview-play')!.onclick = play;
  if (params.get('autoplay') === '1') play();
}
// A browser-only theatre reuses the real reveal without reading or writing a save.
// Plugin frames always take the worker-backed application path.
if (demo && new URLSearchParams(location.search).get('preview') === 'reveal') {
  renderRevealPreview();
} else if (
  demo &&
  new URLSearchParams(location.search).get('preview') === 'landmark-life'
) {
  renderLandmarkLifePreview(root);
} else {
  bridge?.on('island.expeditions.changed', () => {
    void readCrew();
  });
  bridge?.on('island.changed', () => {
    void reload();
  });
  render();
  void reload();
}
// Refreshing replaces the canvas. Wait for its reward dialog to close as well
// as the request, so the draw's own notification cannot remove the reveal.
// Notifications received during the reveal still refresh newly earned tickets.
async function reload() {
  while (busy || root.querySelector('.discovery-theatre[open]'))
    await new Promise((r) => setTimeout(r, 50));
  await run(() => request('island.read'));
  await readCrew();
}
