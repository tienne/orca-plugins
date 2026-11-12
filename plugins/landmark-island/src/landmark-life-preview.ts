import { art } from './art';
import { landmarks } from './game';
import { translate } from './i18n';
import { animationTiers, landmarkScenes } from './landmark-life';

export function renderLandmarkLifePreview(root: HTMLElement) {
  document.title = 'Orcatopia · Landmark Preview';
  const byId = new Map(landmarks.map((landmark) => [landmark.id, landmark]));
  const navigation = `<nav class="life-preview-nav" aria-label="${translate('Animation rarity')}">${animationTiers.map((tier) => `<a href="#tier-${tier.id}" data-preview-tier="${tier.id}">${translate(tier.name)}</a>`).join('')}</nav>`;
  root.innerHTML = `<main class="life-preview"><p class="preview-eyebrow">ORCATOPIA · DEMO</p><h1>${translate('Little landmarks, living stories')}</h1><p>${translate('Fictional miniature scenes. No tickets or saves used.')}</p><div class="life-preview-finder"><label for="life-preview-search">${translate('Find a landmark scene')}</label><div><input id="life-preview-search" type="search" placeholder="${translate('English or Korean name, country or scene')}" autocomplete="off"><button id="life-preview-clear" type="button">${translate('Clear search')}</button></div><p class="life-preview-count" role="status"></p></div>${navigation}<p class="life-preview-empty" hidden>${translate('No matching landmark scenes.')}</p>${animationTiers
    .map(
      (tier) =>
        `<section id="tier-${tier.id}" class="life-preview-tier" data-animation-tier="${tier.id}"><h2>${translate(tier.name)}</h2><p>${translate(tier.summary)}</p><div class="life-preview-grid">${landmarkScenes
          .filter((scene) => byId.get(scene.id)!.tier === tier.id)
          .map(
            ({ id, description }) =>
              `<article id="scene-${id}" class="landmark-detail life-preview-card" data-scene-id="${id}" data-owned="true" data-tier="${tier.id}"><div class="detail-art">${art(id)}</div><h3>${translate(byId.get(id)!.name)}</h3><p>${translate(description)}</p></article>`,
          )
          .join('')}</div></section>`,
    )
    .join('')}<a href="./">${translate('Return to island')}</a></main>`;

  const normalize = (text: string) =>
    text.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  const searchText = new Map(
    landmarkScenes.map((scene) => {
      const landmark = byId.get(scene.id)!;
      return [
        scene.id,
        normalize(
          [
            scene.id,
            landmark.name,
            landmark.country,
            scene.description,
            translate(landmark.name, 'ko-KR'),
            translate(landmark.country, 'ko-KR'),
            translate(scene.description, 'ko-KR'),
          ].join(' '),
        ),
      ];
    }),
  );
  const input = root.querySelector<HTMLInputElement>('#life-preview-search')!;
  const cards = Array.from(
    root.querySelectorAll<HTMLElement>('.life-preview-card'),
  );
  const update = () => {
    const query = normalize(input.value);
    let count = 0;
    for (const card of cards) {
      card.hidden = !searchText.get(card.dataset.sceneId!)!.includes(query);
      if (!card.hidden) count++;
    }
    for (const tier of animationTiers) {
      const section = root.querySelector<HTMLElement>(`#tier-${tier.id}`)!;
      section.hidden = !cards.some(
        (card) => card.dataset.tier === tier.id && !card.hidden,
      );
      root.querySelector<HTMLElement>(
        `[data-preview-tier="${tier.id}"]`,
      )!.hidden = section.hidden;
    }
    root.querySelector('.life-preview-count')!.textContent = translate(
      count === 1 ? '1 landmark scene' : `${count} landmark scenes`,
    );
    root.querySelector<HTMLElement>('.life-preview-empty')!.hidden = count > 0;
  };
  input.addEventListener('input', update);
  root.querySelector<HTMLButtonElement>('#life-preview-clear')!.onclick =
    () => {
      input.value = '';
      update();
      input.focus();
    };
  update();
}
