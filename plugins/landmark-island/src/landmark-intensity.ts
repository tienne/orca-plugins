const palettes = {
  common: { rank: 1, color: '#c9dcae', sparks: 1 },
  rare: { rank: 2, color: '#a6d9e4', sparks: 3 },
  epic: { rank: 3, color: '#cdb0f0', sparks: 6 },
  legendary: { rank: 4, color: '#f6d58a', sparks: 10 },
} as const;

/** 고유 장면의 시간축과 클릭 영역을 유지하면서 등급별 배경·전경 강조를 만든다. */
export function landmarkIntensity(tier: string, id: string, prefix: string) {
  const preset = palettes[tier as keyof typeof palettes] ?? palettes.common;
  const { rank, color, sparks } = preset;
  const cycle =
    {
      colosseum: 4,
      greatwall: 8,
      giza: 7,
      taj: 6,
      sagrada: 16,
      nanmadol: 16,
      halong: 13,
      machu: 14,
    }[id] ?? 12;
  const event =
    id === 'colosseum'
      ? 'duel'
      : id === 'giza'
        ? 'pyramid'
        : id === 'greatwall'
          ? 'wall'
          : 'scene';
  const attributes = `class="tier-presence" data-tier-presence="${tier}" data-tier-event="${event}" style="--tier-cycle:${cycle}s" aria-hidden="true"`;
  const radius = rank === 4 ? 72 : rank === 3 ? 57 : rank === 2 ? 50 : 43;
  const back = `<g ${attributes} data-tier-layer="back"><defs><radialGradient id="${prefix}-tier-ground"><stop stop-color="${color}" stop-opacity="${rank >= 3 ? '.7' : '.4'}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs><ellipse class="tier-ground" cx="64" cy="116" rx="${radius}" ry="${rank >= 3 ? 15 : 10}" fill="url(#${prefix}-tier-ground)"/>
    ${rank >= 2 ? `<path class="tier-airflow" d="M${64 - radius} 115q${radius} -24 ${radius * 2} 0M${68 - radius} 120q${radius - 4} -15 ${radius * 2 - 8} 0" fill="none" stroke="${color}" stroke-width="${rank >= 3 ? 1.2 : 0.8}" stroke-dasharray="9 25"/>` : ''}
    ${rank >= 3 ? `<g transform="translate(64 118)"><ellipse class="tier-wave" rx="${radius}" ry="${rank === 4 ? 14 : 10}" fill="none" stroke="${color}" stroke-width="${rank === 4 ? 2.3 : 1.7}"/><ellipse class="tier-wave tier-wave-follow" rx="${radius - 7}" ry="${rank === 4 ? 10 : 7}" fill="none" stroke="${color}" stroke-width=".8" stroke-dasharray="3 5"/></g><g class="tier-rays" fill="${color}"><path d="M9 116L16 43l9 73zM103 116l9-79 8 79z"/>${rank === 4 ? '<path d="M44 118L57-13l8 131zM76 118L83-7l12 125z"/>' : ''}</g>` : ''}
    </g>`;
  const front = `<g ${attributes} data-tier-layer="front"><g class="tier-sparks" fill="${color}">${Array.from(
    { length: sparks },
    (_, i) => {
      const x = sparks === 1 ? 20 : 7 + i * (114 / (sparks - 1));
      const y = rank >= 3 ? 108 - (i % 3) * 11 : 55 + (i % 3) * 26;
      const size = rank === 4 ? 3.5 : rank === 3 ? 2.7 : 2;
      return `<g transform="translate(${x} ${y})"><path class="${rank >= 3 ? 'tier-ember' : 'tier-glint'}" style="--tier-delay:-${i * 0.8}s" d="M0-${size}l${size * 0.4} ${size * 0.6} ${size * 0.6} ${size * 0.4}-${size * 0.6} ${size * 0.4}-${size * 0.4} ${size * 0.6}-${size * 0.4}-${size * 0.6}-${size * 0.6}-${size * 0.4} ${size * 0.6}-${size * 0.4}z"/></g>`;
    },
  ).join(
    '',
  )}</g>${rank === 4 ? `<g transform="translate(64 60)"><g class="tier-corona" fill="none" stroke="${color}" stroke-width=".8" opacity=".65"><path d="M-65 12l-4 8 6 7m128-15 4 8-6 7M-46-48l-7 4m103-4 7 4M-26-61l-3-5m58 5 3-5"/><circle cy="-56" r="2"/><circle cx="-60" cy="-18" r="1.6"/><circle cx="60" cy="-18" r="1.6"/></g></g>` : ''}</g>`;
  return { back, front };
}
