import { art } from './art';
import { terrain } from './terrain-art';
import { showcaseFixture } from './showcase-fixture';
import { islandLand, landmarks } from './game';
import { project } from './world';
import { translate } from './i18n';
import { revealDiscovery } from './reveal';
import './showcase-preview.css';

export function renderShowcasePreview(root: HTMLElement) {
  const t = translate;
  const state = showcaseFixture();
  document.title = 'Orcatopia · Showcase';
  document.body.classList.add('showcase-preview-page');
  root.innerHTML = `<main class="showcase"><header class="showcase-heading"><div><p class="preview-eyebrow">ORCATOPIA · DEMO</p><h1>${t('A world beyond the shore')}</h1><p>${t('Sea gardens, winding rivers and living wonders.')}</p></div><a href="./">${t('Return to island')}</a></header><nav class="showcase-tabs" aria-label="${t('Preview scenes')}"><button data-showcase="water" aria-pressed="true">${t('Sea & river')}</button><button data-showcase="wonders" aria-pressed="false">${t('Wonders up close')}</button><button data-showcase="fusion" aria-pressed="false">${t('Landmark fusion')}</button></nav><section data-showcase-panel="water"><div class="showcase-water ocean"><div class="showcase-world" inert aria-hidden="true">${terrain(state, undefined, true)}</div><div class="showcase-caption"><span>DEMO · ${t('Sea & river')}</span><strong>${t('Follow the river to the sea')}</strong><p>${t('Ha Long Bay · Great Barrier Reef · Li River · Middle Rhine')}</p></div></div><div class="showcase-legend"><span>◈ ${t('Sea landmarks')}</span><span>≈ ${t('River landmarks')}</span><span>✧ ${t('Sea decorations')} / ${t('River decorations')}</span></div></section><section data-showcase-panel="wonders" hidden><div class="showcase-wonders">${[
    'montsaintmichel',
    'machu',
    'petra',
  ]
    .map((id) => {
      const l = landmarks.find((l) => l.id === id)!;
      return `<article class="landmark-detail" data-owned="true" data-tier="legendary"><span class="showcase-rank">IV · ${t('Wonder')}</span><div class="detail-art">${art(id)}</div><h2>${t(l.name)}</h2><p>${t(l.country)}</p></article>`;
    })
    .join(
      '',
    )}</div><p class="showcase-note">${t('Living vector scenes, enlarged without losing detail.')}</p></section><section data-showcase-panel="fusion" hidden><div class="showcase-fusion fusion-preview"><div>${art('greatwall')}</div><b>2 → 1 +</b><div>${art('greatwall+')}</div></div><p>${t('Two stories, one new light.')}</p><button id="showcase-fuse">${t('Play animation')}</button></section><footer class="showcase-footer">DEMO · ${t('Fictional miniature scenes. No tickets or saves used.')}</footer></main>`;
  const fit = () => {
    const ocean = root.querySelector<HTMLElement>('.showcase-water')!;
    if (!ocean.clientWidth || !ocean.clientHeight) return;
    const points = [
      ...islandLand(state).map((t) => project(t.id)),
      ...state.placements.map((p) => project(p.cell)),
      ...state.decorations.map((p) => project(p.cell)),
    ];
    const minX = Math.min(...points.map((p) => p.x)) - 70;
    const maxX = Math.max(...points.map((p) => p.x)) + 120;
    const minY = Math.min(...points.map((p) => p.y)) - 130;
    const maxY = Math.max(...points.map((p) => p.y)) + 65;
    const scale = Math.min(
      ocean.clientWidth / (maxX - minX),
      (ocean.clientHeight - 80) / (maxY - minY),
    );
    root.querySelector<HTMLElement>('.showcase-world')!.style.transform =
      `translate(${(ocean.clientWidth - (maxX - minX) * scale) / 2 - minX * scale}px, ${40 - minY * scale}px) scale(${scale})`;
  };
  const observer = new ResizeObserver(fit);
  observer.observe(root.querySelector('.showcase-water')!);
  window.addEventListener('pagehide', () => observer.disconnect(), {
    once: true,
  });
  for (const button of root.querySelectorAll<HTMLButtonElement>(
    '[data-showcase]',
  ))
    button.onclick = () => {
      for (const panel of root.querySelectorAll<HTMLElement>(
        '[data-showcase-panel]',
      ))
        panel.hidden = panel.dataset.showcasePanel !== button.dataset.showcase;
      for (const tab of root.querySelectorAll('[data-showcase]'))
        tab.setAttribute('aria-pressed', String(tab === button));
      if (button.dataset.showcase === 'water') fit();
    };
  root.querySelector<HTMLButtonElement>('#showcase-fuse')!.onclick = () => {
    const l = landmarks.find((l) => l.id === 'greatwall')!;
    revealDiscovery(
      { ...l, id: 'greatwall+', name: `${l.name} +` },
      1,
      'I+',
      () => {},
      { fusion: true, preview: true },
    );
  };
  fit();
}
