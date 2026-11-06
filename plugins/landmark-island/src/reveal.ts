import { art } from './art';
import type { landmarks } from './game';
import './reveal.css';

// Presentation only: the worker has already committed the ticket and reward.
export function revealDiscovery(
  landmark: (typeof landmarks)[number],
  count: number,
  badge: string,
  onPlace: () => void,
  options: {
    preview?: boolean;
    rewardNote?: string;
    container?: HTMLElement;
  } = {},
) {
  const opener = document.activeElement as HTMLElement | null;
  const dialog = document.createElement('dialog');
  dialog.className = 'discovery-theatre';
  dialog.dataset.tier = landmark.tier;
  dialog.setAttribute('aria-label', 'A new destination');
  // Each phase has a distinct job: travel, rarity cue, transition, artwork,
  // then information and actions. The reward was committed before any phase.
  const omenAt = 2100;
  const omenDuration =
    { common: 450, rare: 750, epic: 1050, legendary: 1550 }[landmark.tier] ??
    450;
  const burstAt = omenAt + omenDuration;
  const monumentAt = burstAt + 350;
  const detailsAt = monumentAt + 650;
  const readyAt = detailsAt + 450;
  dialog.dataset.phase = 'invitation';
  // Catalog strings are bundled, rendered through textContent below.
  dialog.innerHTML = `<div class="discovery-heading"><span>THE EXPLORER’S ATLAS</span><button class="reveal-skip" autofocus>Skip animation</button></div>
    <div class="discovery-stage" aria-hidden="true">
      <div class="atlas-stars">✧ <span>✦</span> ✧ <span>✦</span> ✧</div>
      <div class="invitation"><span>ONE NEW JOURNEY</span><i>✦</i><small>Landmark Island</small></div>
      <div class="atlas-camera"><div class="atlas-map"><svg viewBox="0 0 640 390" class="atlas-ink">
        <defs><pattern id="atlas-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#9a8b62" stroke-opacity=".16"/></pattern></defs>
        <rect width="640" height="390" fill="url(#atlas-grid)"/>
        <g fill="#b3b78b" stroke="#7b8966" stroke-width="2"><path d="M47 119l40-46 66-15 32 21 37 2 27 43-22 31-43 5-9 40-39 18-19-37-37-5z"/><path d="M198 219l31 10 17 32-9 43-25 39-20-36-18-36z"/><path d="M316 97l44-30 49 16 29-27 90 23 60 45-21 32-57-5-24 37-37-20-28 21-26-28-39 6-11-35-35-5z"/><path d="M341 184l52 4 34 40-27 63-31 14-22-53-25-32z"/><path d="M491 287l41-21 50 23-5 35-55 6-27-17z"/></g>
        <g fill="none" stroke="#8f805b" opacity=".5"><circle cx="555" cy="217" r="28"/><path d="M555 177v80m-40-40h80m-59-19 38 38m0-38-38 38"/></g><path class="atlas-route" d="M114 157Q190 77 274 150T423 153"/><circle class="atlas-destination" cx="423" cy="153" r="10"/>
        <g class="atlas-comet"><path class="comet-tail" d="M-125-24Q-70-22 0 0Q-50 10-125-24Z"/><path class="comet-thread" d="M-155-31Q-70-8 0 0"/><circle r="10"/><path class="comet-star" d="M0-24 5-5 26 0 5 5 0 24-5 5-26 0-5-5Z"/></g>
      </svg><div class="atlas-fold fold-left"></div><div class="atlas-fold fold-right"></div></div></div>
      <div class="omen-rings"><i></i><i></i><i></i></div><div class="omen-particles"><i style="--ray:0"></i><i style="--ray:1"></i><i style="--ray:2"></i><i style="--ray:3"></i><i style="--ray:4"></i><i style="--ray:5"></i><i style="--ray:6"></i><i style="--ray:7"></i><i style="--ray:8"></i><i style="--ray:9"></i><i style="--ray:10"></i><i style="--ray:11"></i></div><div class="omen-label">${badge}</div><div class="discovery-halo"></div><div class="discovery-mist"></div>
      <div class="discovery-monument">${art(landmark.id)}</div>
      <div class="discovery-orbit"><i></i><i></i><i></i></div>
    </div>
    <div class="discovery-flash" aria-hidden="true"></div><p class="journey-caption" role="status">Unsealing your invitation…</p>
    <div class="discovery-result" hidden><div class="reveal-badge">${badge}</div><p class="reveal-country"></p><h2></h2><p class="reveal-quantity"></p><p class="reveal-bonus"></p><div class="reveal-actions" hidden><button class="reveal-place">Place on island</button><button class="reveal-keep">Keep exploring</button></div><small>Saved to your collection</small></div>`;
  dialog.querySelector('.reveal-country')!.textContent =
    `${landmark.country} · ${landmark.region}`;
  dialog.querySelector('h2')!.textContent = landmark.name;
  dialog.querySelector('.reveal-quantity')!.textContent =
    count > 1
      ? `Another piece of the world · Owned ×${count}`
      : 'A new page in your collection';
  dialog.querySelector('.reveal-bonus')!.textContent = options.rewardNote ?? '';
  if (options.preview) {
    dialog.querySelector('.discovery-heading > span')!.textContent =
      'DEMO · ANIMATION PREVIEW';
    dialog.querySelector('.reveal-quantity')!.textContent =
      'Preview only · No ticket used';
    dialog.querySelector('.reveal-place')!.textContent = 'Replay animation';
    dialog.querySelector('.reveal-keep')!.textContent = 'Choose rarity';
    dialog.querySelector('.discovery-result > small')!.textContent =
      'Your collection is unchanged';
  }
  const container = options.container;
  let observer: ResizeObserver | undefined;
  const fitCanvas = () => {
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    // The native dialog stays in the top layer for focus/inert handling, while
    // its visible surface is bounded by the island and the current viewport.
    const left = Math.max(0, bounds.left);
    const top = Math.max(0, bounds.top);
    const right = Math.min(document.documentElement.clientWidth, bounds.right);
    const bottom = Math.min(window.innerHeight, bounds.bottom);
    dialog.style.left = `${left}px`;
    dialog.style.top = `${top}px`;
    dialog.style.width = `${Math.max(1, right - left)}px`;
    dialog.style.height = `${Math.max(1, bottom - top)}px`;
  };
  if (container) {
    dialog.classList.add('canvas-discovery');
    container.scrollIntoView({ block: 'center', behavior: 'instant' });
    container.append(dialog);
    observer = new ResizeObserver(fitCanvas);
    observer.observe(container);
    window.addEventListener('resize', fitCanvas);
    window.addEventListener('scroll', fitCanvas, true);
    fitCanvas();
  } else document.body.append(dialog);
  let revealed = false;
  let placing = false;
  const timers: ReturnType<typeof setTimeout>[] = [];
  const result = dialog.querySelector<HTMLElement>('.discovery-result')!;
  const actions = dialog.querySelector<HTMLElement>('.reveal-actions')!;
  const caption = dialog.querySelector<HTMLElement>('.journey-caption')!;
  const showDetails = () => {
    result.hidden = false;
    caption.textContent =
      count > 1 ? 'A familiar wonder, found again' : 'A destination discovered';
    dialog.setAttribute('aria-label', `${landmark.name} discovered`);
  };
  const finish = (skip = false) => {
    if (revealed) return;
    revealed = true;
    timers.forEach(clearTimeout);
    dialog.dataset.phase = 'complete';
    dialog.classList.add('revealed');
    if (skip) dialog.classList.add('skipped');
    showDetails();
    actions.hidden = false;
    dialog.querySelector<HTMLButtonElement>('.reveal-skip')!.hidden = true;
    dialog
      .querySelector<HTMLButtonElement>('.reveal-place')!
      .focus({ preventScroll: true });
  };
  dialog.querySelector<HTMLButtonElement>('.reveal-skip')!.onclick = () =>
    finish(true);
  dialog.querySelector<HTMLButtonElement>('.reveal-keep')!.onclick = () =>
    dialog.close();
  dialog.querySelector<HTMLButtonElement>('.reveal-place')!.onclick = () => {
    placing = true;
    dialog.close();
    onPlace();
  };
  dialog.addEventListener('cancel', (event) => {
    if (!revealed) {
      event.preventDefault();
      finish(true);
    }
  });
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const reduce = () => {
    if (preference.matches) finish(true);
  };
  preference.addEventListener('change', reduce);
  dialog.addEventListener(
    'close',
    () => {
      timers.forEach(clearTimeout);
      observer?.disconnect();
      window.removeEventListener('resize', fitCanvas);
      window.removeEventListener('scroll', fitCanvas, true);
      preference.removeEventListener('change', reduce);
      dialog.remove();
      if (placing) return;
      const target =
        opener?.isConnected &&
        opener.matches('button:not(:disabled), a[href], [tabindex]')
          ? opener
          : (container?.querySelector<HTMLButtonElement>(
              '#draw-ticket:not(:disabled)',
            ) ??
            container?.querySelector<HTMLButtonElement>(
              '[data-inventory=landmarks]',
            ) ??
            document.querySelector<HTMLButtonElement>(
              '#refresh, #preview-play',
            ));
      target?.focus({ preventScroll: true });
    },
    { once: true },
  );
  dialog.showModal();
  fitCanvas();
  const phase = (at: number, name: string, description?: string) => {
    timers.push(
      setTimeout(() => {
        dialog.dataset.phase = name;
        if (description) caption.textContent = description;
        if (name === 'omen') {
          dialog.classList.add('rarity-known');
          const rarity = {
            common: 'Discovery',
            rare: 'Treasure',
            epic: 'Marvel',
            legendary: 'Wonder',
          }[landmark.tier];
          caption.textContent = `${rarity} on the horizon…`;
        }
        if (name === 'details') showDetails();
      }, at),
    );
  };
  phase(800, 'journey', 'Following a path beyond the horizon…');
  phase(omenAt, 'omen', 'Something stirs beyond the horizon…');
  phase(burstAt, 'burst');
  phase(monumentAt, 'monument', 'A place begins to take shape…');
  phase(detailsAt, 'details');
  timers.push(setTimeout(() => finish(), readyAt));
  reduce();
}
