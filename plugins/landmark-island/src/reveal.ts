import { art } from './art';
import type { landmarks } from './game';
import './reveal.css';

// Presentation only: the worker has already committed the ticket and reward.
export function revealDiscovery(
  landmark: (typeof landmarks)[number],
  count: number,
  badge: string,
  onPlace: () => void,
) {
  const dialog = document.createElement('dialog');
  dialog.className = 'discovery-theatre';
  dialog.dataset.tier = landmark.tier;
  dialog.setAttribute('aria-label', 'A new destination');
  const duration =
    { common: 3000, rare: 3400, epic: 4000, legendary: 4600 }[landmark.tier] ??
    3000;
  dialog.style.setProperty('--journey-time', `${duration}ms`);
  // Catalog strings are bundled, rendered through textContent below.
  dialog.innerHTML = `<div class="discovery-heading"><span>THE EXPLORER’S ATLAS</span><button class="reveal-skip" autofocus>Skip animation</button></div>
    <div class="discovery-stage" aria-hidden="true">
      <div class="atlas-stars">✧ <span>✦</span> ✧ <span>✦</span> ✧</div>
      <div class="invitation"><span>ONE NEW JOURNEY</span><i>✦</i><small>Landmark Island</small></div>
      <div class="atlas-map"><svg viewBox="0 0 640 390" class="atlas-ink">
        <defs><pattern id="atlas-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#9a8b62" stroke-opacity=".16"/></pattern></defs>
        <rect width="640" height="390" fill="url(#atlas-grid)"/>
        <g fill="#b3b78b" stroke="#7b8966" stroke-width="2"><path d="M47 119l40-46 66-15 32 21 37 2 27 43-22 31-43 5-9 40-39 18-19-37-37-5z"/><path d="M198 219l31 10 17 32-9 43-25 39-20-36-18-36z"/><path d="M316 97l44-30 49 16 29-27 90 23 60 45-21 32-57-5-24 37-37-20-28 21-26-28-39 6-11-35-35-5z"/><path d="M341 184l52 4 34 40-27 63-31 14-22-53-25-32z"/><path d="M491 287l41-21 50 23-5 35-55 6-27-17z"/></g>
        <g fill="none" stroke="#8f805b" opacity=".5"><circle cx="555" cy="217" r="28"/><path d="M555 177v80m-40-40h80m-59-19 38 38m0-38-38 38"/></g><path class="atlas-route" d="M114 157Q190 77 274 150T423 153"/><circle class="atlas-destination" cx="423" cy="153" r="10"/>
      </svg><div class="atlas-fold fold-left"></div><div class="atlas-fold fold-right"></div></div>
      <div class="discovery-halo"></div><div class="discovery-mist"></div>
      <div class="discovery-monument">${art(landmark.id)}</div>
      <div class="discovery-orbit"><i></i><i></i><i></i></div>
    </div>
    <p class="journey-caption" role="status">Unsealing your invitation…</p>
    <div class="discovery-result" hidden><div class="reveal-badge">${badge}</div><p class="reveal-country"></p><h2></h2><p class="reveal-quantity"></p><div class="reveal-actions"><button class="reveal-place">Place on island</button><button class="reveal-keep">Keep exploring</button></div><small>Saved to your collection</small></div>`;
  dialog.querySelector('.reveal-country')!.textContent =
    `${landmark.country} · ${landmark.region}`;
  dialog.querySelector('h2')!.textContent = landmark.name;
  dialog.querySelector('.reveal-quantity')!.textContent =
    count > 1
      ? `Another piece of the world · Owned ×${count}`
      : 'A new page in your collection';
  document.body.append(dialog);
  let revealed = false;
  const timers: ReturnType<typeof setTimeout>[] = [];
  const finish = () => {
    if (revealed) return;
    revealed = true;
    timers.forEach(clearTimeout);
    dialog.classList.add('revealed');
    dialog.querySelector<HTMLElement>('.discovery-result')!.hidden = false;
    dialog.querySelector<HTMLElement>('.journey-caption')!.textContent =
      count > 1 ? 'A familiar wonder, found again' : 'A destination discovered';
    dialog.querySelector<HTMLButtonElement>('.reveal-skip')!.hidden = true;
    dialog.setAttribute('aria-label', `${landmark.name} discovered`);
    dialog
      .querySelector<HTMLButtonElement>('.reveal-place')!
      .focus({ preventScroll: true });
  };
  dialog.querySelector<HTMLButtonElement>('.reveal-skip')!.onclick = finish;
  dialog.querySelector<HTMLButtonElement>('.reveal-keep')!.onclick = () =>
    dialog.close();
  dialog.querySelector<HTMLButtonElement>('.reveal-place')!.onclick = () => {
    dialog.close();
    onPlace();
  };
  dialog.addEventListener('cancel', (event) => {
    if (!revealed) {
      event.preventDefault();
      finish();
    }
  });
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const reduce = () => {
    if (preference.matches) finish();
  };
  preference.addEventListener('change', reduce);
  dialog.addEventListener(
    'close',
    () => {
      timers.forEach(clearTimeout);
      preference.removeEventListener('change', reduce);
      dialog.remove();
      document
        .querySelector<HTMLButtonElement>(
          '#draw-ticket:not(:disabled), #refresh',
        )
        ?.focus({ preventScroll: true });
    },
    { once: true },
  );
  dialog.showModal();
  timers.push(
    setTimeout(() => {
      dialog.querySelector('.journey-caption')!.textContent =
        'Following a path beyond the horizon…';
    }, 1000),
  );
  timers.push(setTimeout(finish, duration));
  reduce();
}
