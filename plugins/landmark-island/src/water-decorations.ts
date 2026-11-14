import landmarks from './landmarks.json';
import waterCatalog from './water-catalog.json';
import { waterThemes, waterShapeNames, type WaterShape } from './water-themes';
import type { Decoration } from './decorations';

const newIds = new Set(waterCatalog.map((entry) => entry.record.id));
/** 기존 정원 장식을 보존하고 별도 ID로 물 전용 보상과 제작품을 추가한다. */
export const waterDecorations: Decoration[] = waterThemes.flatMap((theme) => {
  const landmark = landmarks.find((l) => l.id === theme.id)!;
  return [theme.gift, theme.special].map((shape, index): Decoration => ({
    id: `${theme.id}-${newIds.has(theme.id) ? '' : 'water-'}${index === 0 ? 'gift' : 'special'}`,
    name: `${landmark.name} ${waterShapeNames[shape][0]}`,
    landmark: theme.id,
    cost: index === 0 ? 3 : 6,
    gift: index === 0,
    shape,
    surface: theme.placement === 'river' ? 'river' : 'sea',
    color: theme.placement === 'river' ? '#85b995' : '#68b8c4',
    walkable: false,
  }));
});

/** 물 장식은 바닥판 없이 수면 위의 독립된 SVG로 그린다. */
export function waterDecorationArt(shape: WaterShape, color: string) {
  const ripple =
    '<ellipse cx="40" cy="90" rx="33" ry="8" fill="none" stroke="#c6efec" stroke-width="1.4"/>';
  const bodies: Record<WaterShape, string> = {
    coral:
      '<path d="M24 88V65m0 10L12 62m12 6 10-15m16 34V52m0 14L39 56m11 16 15-20m-1 36V73l9-8" stroke="#da9c87" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="40" cy="91" rx="25" ry="5" fill="#589d9c" opacity=".5"/>',
    buoy: `<path d="M26 84l14-10 14 10-14 12z" fill="${color}"/><path d="M34 81V43h12v38z" fill="#f0c385"/><path d="M34 60h12v12H34zM34 43l6-10 6 10z" fill="#b96c53"/><circle cx="40" cy="29" r="5" fill="#f7df9b"/><path d="M25 27h-7m37 0h7" stroke="#f6deb3" stroke-width="2"/>`,
    sailboat:
      '<path d="M9 84q31 10 63-1L59 99H24z" fill="#a77d59" stroke="#635f49"/><path d="M40 84V20" stroke="#655c49" stroke-width="2"/><path d="M36 24Q17 43 15 73h21z" fill="#fbefd1"/><path d="M44 36l22 38H44z" fill="#dbb77a"/>',
    lotus:
      '<ellipse cx="40" cy="86" rx="29" ry="11" fill="#73a984"/><path d="M20 84l13 4-7 7m28-16-10 8 16 2" stroke="#467d65" fill="none"/><path d="M40 84q-19-6-14-17 10-2 14 10-3-16 4-23 10 9 2 24 11-13 20-7-4 13-26 13z" fill="#e8a8b8"/><circle cx="42" cy="78" r="4" fill="#f7dd8b"/>',
    raft: '<g stroke="#786e4f" stroke-width="5" stroke-linecap="round"><path d="M11 88l39-15m-33 21 39-15m-33 21 39-15m-33 21 39-15"/></g><path d="M25 80l22 20m-4-27 22 18M48 80V34" stroke="#5b6048" stroke-width="2"/><path d="M49 38q15 6 19 27H49z" fill="#eee0b2"/>',
    waterwheel:
      '<path d="M22 89V57h7v32m28 0V57h7v32" fill="#967959"/><circle cx="43" cy="60" r="27" fill="none" stroke="#846749" stroke-width="5"/><circle cx="43" cy="60" r="8" fill="#a98963"/><path d="M43 33v54M16 60h54M24 41l38 38m0-38L24 79" stroke="#b49269" stroke-width="4"/><path d="M20 91q22 10 45-1" fill="none" stroke="#d9efde" stroke-width="2"/>',
  };
  return `<svg viewBox="0 0 80 110" class="water-decoration-art">${ripple}${bodies[shape]}</svg>`;
}
