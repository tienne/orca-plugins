/** 저장 데이터와 분리된 장면 그림 및 한·영 설명을 묶는다. */
export type Scene = {
  id: string;
  description: string;
  descriptionKo: string;
  markup: string;
};
type Motion = {
  dx?: number;
  dy?: number;
  duration?: number;
  delay?: number;
  angle?: number;
};
/** 소품의 배치 좌표계를 움직임의 좌표계와 분리한다. */
export const at = (x: number, y: number, body: string, scale = 1) =>
  `<g transform="translate(${x} ${y}) scale(${scale})">${body}</g>`;
/** 프레임이나 저장 상태를 갱신하지 않는 CSS 동작을 만든다. */
export function motion(kind: string, body: string, options: Motion = {}) {
  const { dx = 18, dy = 0, duration = 9, delay = 0, angle = 12 } = options;
  return `<g class="scene-motion" data-motion="${kind}" style="--scene-dx:${dx}px;--scene-dy:${dy}px;--scene-duration:${duration}s;--scene-delay:${delay}s;--scene-angle:${angle}deg">${body}</g>`;
}
/** 미보유 상태에서 숨길 수 있는 독립된 랜드마크 장면을 만든다. */
export const scene = (
  id: string,
  description: string,
  descriptionKo: string,
  ...layers: string[]
): Scene => ({
  id,
  description,
  descriptionKo,
  markup: `<g class="landmark-life catalog-scene" data-landmark-life="${id}" aria-hidden="true">${layers.join('')}</g>`,
});
/** 건물을 가리지 않는 반투명 구름에 느린 이동 경로를 부여한다. */
export function cloud(
  x: number,
  y: number,
  dx = 18,
  color = '#edf0df',
  scale = 0.65,
) {
  return at(
    x,
    y,
    motion(
      'drift',
      `<path d="M-14 0q2-6 8-4 2-9 10-6 7-3 10 4 8 0 10 6z" fill="${color}" opacity=".65"/>`,
      { dx, duration: 14 },
    ),
    scale,
  );
}
/** 날갯짓과 이동 경로를 분리해 새의 종류와 배치를 조합한다. */
export function bird(
  x: number,
  y: number,
  color = '#eee9d4',
  dx = 24,
  dy = -4,
  scale = 1,
  toucan = false,
) {
  return at(
    x,
    y,
    motion(
      'drift',
      `<g class="scene-wildlife"><ellipse rx="2.4" ry="1.5" fill="${color}"/><path class="scene-wings" d="M0 0l-6-4 2-1 5 3 5-4 1 2-5 4z" fill="${color}"/><path d="M2-1h${toucan ? 6 : 2}l-1 2H2z" fill="${toucan ? '#d6a05a' : '#b69b70'}"/></g>`,
      { dx, dy, duration: 11 },
    ),
    scale,
  );
}
/** 깃대는 고정하고 깃발 천에만 바람 움직임을 적용한다. */
export function flag(x: number, y: number, color = '#b47e69', height = 16) {
  return at(
    x,
    y,
    `<path d="M0 0v-${height}" stroke="#8c7956" stroke-width=".8"/>${at(0, -height, `<g class="world-banner">${motion('sway', `<path d="M0 0q5-2 11 1v6Q5 5 0 7z" fill="${color}"/>`, { angle: 8, duration: 3 })}</g>`)}`,
  );
}
/** 선체와 승객, 물결을 묶어 같은 항로를 따라 움직인다. */
export function boat(
  x: number,
  y: number,
  kind: 'sail' | 'row' | 'ship' | 'ferry' | 'canoe' = 'sail',
  dx = 34,
  color = '#b58566',
  scale = 1,
) {
  const top =
    kind === 'row' || kind === 'canoe'
      ? `<circle cy="-6" r="1.6" fill="#d3b087"/><path d="M-2-4h4v4h-4z" fill="${color}"/><path class="scene-oar" d="M-1-2l8 7" stroke="#d9c599" stroke-width="1"/>`
      : kind === 'ferry'
        ? `<path d="M-6-4h13v4H-6z" fill="#e2d9b9"/><path d="M-3-7h6v3h-6z" fill="${color}"/><path d="M-3-3h2m3 0h2" stroke="#5f868b"/>`
        : `<path d="M0 0v-${kind === 'ship' ? 18 : 14}" stroke="#89724d" stroke-width=".8"/><path d="M-1-13L-7-1h6z" fill="#eee3c4"/><path d="M1-11L7-1H1z" fill="${color}"/>${kind === 'ship' ? '<path d="M-5-16h10v4H-5z" fill="#e5d9b9"/>' : ''}`;
  return at(
    x,
    y,
    motion(
      'travel',
      `<g class="scene-vessel"><path d="M-10 0h20l-5 4H-5z" fill="#8d7153"/>${top}<path d="M-12 6h8m6 0h10" stroke="#dcead7" stroke-width=".8"/></g>`,
      { dx, duration: 13 },
    ),
    scale,
  );
}
/** 배나 해안의 위치를 바꾸지 않는 수면 반짝임을 만든다. */
export function water(x: number, y: number, width = 38) {
  return at(
    x,
    y,
    motion(
      'pulse',
      `<ellipse rx="${width / 2}" ry="2.5" fill="none" stroke="#d6e6d6" stroke-width=".8"/>`,
      { duration: 4 },
    ),
  );
}
/** 고정된 가로대 아래에서 종이 흔들리는 장면을 만든다. */
export function bell(x: number, y: number, scale = 1) {
  return at(
    x,
    y,
    `<path d="M-5-7H5" stroke="#827351" stroke-width="1"/>${motion('sway', '<path d="M-4 0l1-6q3-4 6 0l1 6z" fill="#c6ae75" stroke="#8a7b54" stroke-width=".6"/><circle cy="2" r="1.2" fill="#8a7750"/>', { angle: 18, duration: 3.5 })}`,
    scale,
  );
}
/** 시계 중심을 기준으로 바늘만 회전시킨다. */
export function clock(x: number, y: number, radius = 5) {
  return at(
    x,
    y,
    `<circle r="${radius}" fill="#e1d2a4" stroke="#8d805d" stroke-width=".8"/>${motion('spin', `<path d="M0 0v-${radius - 1}m0 ${radius - 1}h${radius - 2}" stroke="#596f62" stroke-width=".9" stroke-linecap="round"/>`, { duration: 18 })}<circle r=".7" fill="#657460"/>`,
  );
}
/** 고정된 승강로를 따라 불빛이 위로 이동하게 한다. */
export function elevator(x: number, y: number, rise = 60, color = '#edd69a') {
  return at(
    x,
    y,
    `<path d="M0 0v-${rise}" stroke="#dbe3cd" stroke-width=".6" opacity=".5"/>${motion('travel', `<rect x="-1.7" y="-4" width="3.4" height="6" rx="1" fill="${color}" stroke="#78908a" stroke-width=".5"/>`, { dx: 0, dy: -rise, duration: 10 })}`,
  );
}
/** 작은 수면과 점선 물줄기를 묶어 분수의 흐름을 만든다. */
export function fountain(x: number, y: number, width = 12) {
  return at(
    x,
    y,
    `<ellipse rx="${width}" ry="2.4" fill="#7da6a0" opacity=".7"/>${motion('dash', `<path d="M-${width / 2} 0q${width / 2} -18 ${width} 0M0 0v-12" fill="none" stroke="#e0eee0" stroke-width="1" stroke-dasharray="2 2"/>`, { duration: 2.5 })}`,
  );
}
/** 식물의 뿌리를 고정한 채 잎사귀가 바람을 타게 한다. */
export function leaves(x: number, y: number, color = '#779868', scale = 1) {
  return at(
    x,
    y,
    motion(
      'sway',
      `<path d="M0 0q-2-9 1-17m-1 8q-11-1-9-9Q0-18 0-9m0 4q11-1 9-9Q1-14 0-5" fill="${color}" stroke="#6a885d" stroke-width=".6"/>`,
      { angle: 7, duration: 5 },
    ),
    scale,
  );
}
/** 역할별 소품과 작업 동작을 인물의 이동 경로에 결합한다. */
export function person(
  x: number,
  y: number,
  task:
    | 'walk'
    | 'guard'
    | 'mason'
    | 'brush'
    | 'water'
    | 'sketch'
    | 'weave'
    | 'drum'
    | 'lantern'
    | 'climb' = 'walk',
  color = '#b78c65',
  dx = 12,
  dy = 0,
  scale = 1,
) {
  const walking = ['walk', 'guard', 'lantern', 'climb'].includes(task);
  const tools =
    task === 'guard'
      ? '<path d="M5 1v-17m-1 0 1-3 1 3" stroke="#807457" stroke-width=".9"/><path d="M-3-7l-2 4" stroke="#d4b38b"/>'
      : task === 'lantern'
        ? '<path d="M2-7l5 2" stroke="#d4b38b"/><rect x="5" y="-6" width="3" height="4" rx="1" fill="#e8ca80"/>'
        : task === 'water'
          ? '<path d="M2-7l4 3" stroke="#d4b38b"/><path d="M4-4h5v4H4zM9-3l4 2" fill="#87a39a" stroke="#657f72" stroke-width=".7"/><path class="scene-sprinkle" d="M13-1l3 5m-1-4 3 5" stroke="#c9e3d8" stroke-width=".7" stroke-dasharray="1 2"/>'
          : task === 'weave'
            ? '<path d="M3-12h9V0H3z" fill="#b08569" stroke="#8d7553" stroke-width=".6"/><path d="M5-10v8m3-8v8m2-8v8" stroke="#d5b986" stroke-width=".7"/>'
            : task === 'drum'
              ? '<ellipse cx="6" cy="-5" rx="4" ry="2" fill="#dbc496"/><path d="M2-5v5q4 3 8 0v-5" fill="#ab7a5d" stroke="#7f6b50" stroke-width=".6"/>'
              : task === 'sketch'
                ? '<path d="M5 0l3-12 5 12M5-10h7v6H5z" fill="#eadfc4" stroke="#8e7958" stroke-width=".7"/>'
                : '';
  const arm = walking
    ? ''
    : motion(
        task === 'water' ? 'nod' : 'work',
        `<path d="M2-8l4 2 3-5" fill="none" stroke="#d4b38b" stroke-width="1.3"/><path d="M8-12l3-3" stroke="#88775a" stroke-width="1"/>${task === 'mason' ? '<path d="M8-16h5v2H8z" fill="#a7ab97"/>' : ''}`,
        { duration: task === 'mason' ? 1.8 : 3 },
      );
  const body = `<g class="scene-figure"><ellipse cy="1" rx="4" ry="1.1" fill="#4e5844" opacity=".2"/><path class="${walking ? 'scene-stride' : ''}" d="M-1-3l-2 4m4-4 2 4" stroke="#726349" stroke-width="1.4"/><path d="M-2-9h4l1 6h-6z" fill="${color}"/><circle cy="-12" r="2" fill="#d4b38b"/>${['mason', 'brush', 'sketch'].includes(task) ? '<path d="M-3-13h6l-1-2h-4z" fill="#c5b480"/>' : task === 'guard' ? '<path d="M-3-14l3-3 3 3z" fill="#b9b895"/>' : ''}${tools}${arm}</g>`;
  return at(
    x,
    y,
    walking ? motion('stroll', body, { dx, dy, duration: 12 }) : body,
    scale,
  );
}
/** 여러 장면에서 별도 SVG 정의 없이 사용할 수 있는 석재를 만든다. */
export function stone(x: number, y: number, width = 10) {
  return at(
    x,
    y,
    `<path d="M0 0l${width / 2}-3 ${width / 2} 3v5l-${width / 2} 3L0 5z" fill="#cdbb93" stroke="#948467" stroke-width=".6"/><path d="M0 0l${width / 2} 3 ${width / 2}-3" fill="none" stroke="#e1d2af" stroke-width=".6"/>`,
  );
}
/** 건물 윤곽을 따라 움직이는 빛을 지정한 경로 안에 제한한다. */
export function glint(d: string, color = '#f2d69b', duration = 8) {
  return motion(
    'dash',
    `<path d="${d}" fill="none" stroke="${color}" stroke-width="1.2" stroke-dasharray="5 18" opacity=".8"/>`,
    { duration },
  );
}
/** 태양과 투명한 빛기둥을 하나의 느린 밝기 주기로 묶는다. */
export function sunbeam(x: number, y: number, dx = 22, dy = 85) {
  return at(
    x,
    y,
    motion(
      'pulse',
      `<circle r="4" fill="#e6cb85"/><path d="M-3 3L${dx - 8} ${dy}h16L3 3z" fill="#f1db9e" opacity=".2"/>`,
      { duration: 12 },
    ),
  );
}
/** 고정된 줄을 따라 서로 다른 위상으로 펄럭이는 천을 배치한다. */
export function prayerFlags(x: number, y: number, width = 28) {
  return at(
    x,
    y,
    `<path d="M0 0q${width / 2} 8 ${width} 0" fill="none" stroke="#a38c67" stroke-width=".7"/>${Array.from({ length: 5 }, (_, i) => at((i * width) / 5, 2 + Math.sin((i / 4) * Math.PI) * 2, motion('sway', `<path d="M0 0h4v6H0z" fill="${['#bc8874', '#d9c38c', '#7fa398', '#8f9faa', '#b6a77c'][i]}"/>`, { duration: 3, delay: -i * 0.3, angle: 10 }))).join('')}`,
  );
}
/** 등불이 떠오르고 사라지는 동작을 독립된 위상으로 반복한다. */
export function lantern(x: number, y: number, delay = 0) {
  return at(
    x,
    y,
    motion(
      'rise',
      '<path d="M-2-4q2-2 4 0v6h-4z" fill="#e4c17a"/><path d="M-1 2h2" stroke="#ac8953" stroke-width=".7"/>',
      { dx: 4, dy: -22, duration: 12, delay },
    ),
  );
}
/** 종별 실루엣과 걸음 동작을 같은 이동 경로에 묶는다. */
export function animal(
  x: number,
  y: number,
  kind: 'camel' | 'donkey' | 'horse' | 'oryx' | 'sheep',
  dx = 22,
  scale = 1,
) {
  const color =
    kind === 'sheep' ? '#e0ddc5' : kind === 'donkey' ? '#9f9e8b' : '#b8976a';
  return at(
    x,
    y,
    motion(
      'stroll',
      `<g class="scene-wildlife"><ellipse cy="-4" rx="5" ry="2.7" fill="${color}"/><path d="M4-4l1-5 4 1-1 5" fill="${color}"/><path class="scene-stride" d="M-3-3l-1 4m4-4 1 4m2-4 2 4" stroke="${color}" stroke-width="1.4"/>${kind === 'camel' ? '<path d="M-2-6q0-5 4 0" fill="#b8976a"/>' : kind === 'oryx' ? '<path d="M6-9l-2-8m3 8-1-8" stroke="#6d6650" stroke-width=".9"/>' : kind === 'donkey' ? '<path d="M5-8l-1-5m3 5 1-5" stroke="#888a78" stroke-width="1.1"/>' : kind === 'horse' ? '<path d="M4-8l-1 5" stroke="#6b6350" stroke-width="2"/>' : ''}<path d="M-5-5l-3 2" stroke="${color}" stroke-width=".8"/></g>`,
      { dx, duration: 14 },
    ),
    scale,
  );
}
/** 차체와 바퀴가 같은 속도로 광장을 지나가게 한다. */
export function cart(
  x: number,
  y: number,
  color = '#bd976a',
  dx = 30,
  bus = false,
) {
  return at(
    x,
    y,
    motion(
      'travel',
      `<path d="M-7-${bus ? 7 : 4}h14v6H-7z" fill="${color}" stroke="#8c7758" stroke-width=".6"/>${bus ? '<path d="M-5-6h3m2 0h3m2 0h1" stroke="#cbded0" stroke-width="1.5"/>' : ''}<circle cx="-4" cy="2" r="1.7" fill="#6c6c55"/><circle cx="4" cy="2" r="1.7" fill="#6c6c55"/>`,
      { dx, duration: 12 },
    ),
  );
}
/** 고정 케이블을 따라 객실이 같은 경사를 이동하게 한다. */
export function cableCar(x: number, y: number, dx = 38, dy = -26) {
  return at(
    x,
    y,
    `<path d="M0 0l${dx} ${dy}" stroke="#8c937d" stroke-width=".8"/>${motion('travel', '<path d="M0 0v4" stroke="#887958" stroke-width=".7"/><rect x="-4" y="4" width="8" height="6" rx="1.4" fill="#b77c66" stroke="#816e53" stroke-width=".6"/><path d="M-2 5h4v2h-4z" fill="#d2dfce"/>', { dx, dy, duration: 14 })}`,
  );
}
/** 원통의 폭을 바꿔 마니차가 돌아가는 모습을 표현한다. */
export function wheel(x: number, y: number) {
  return at(
    x,
    y,
    motion(
      'turn',
      '<rect x="-2.5" y="-5" width="5" height="10" rx="1" fill="#c5a568" stroke="#937c50" stroke-width=".7"/><path d="M-2-2h4m-4 4h4" stroke="#e3ce96" stroke-width=".8"/>',
      { duration: 4 },
    ),
  );
}
/** 날갯짓과 이동을 분리해 나비의 작은 비행 경로를 만든다. */
export function butterflies(x: number, y: number, color = '#d3a36b') {
  return at(
    x,
    y,
    motion(
      'drift',
      `<path class="scene-wings" d="M0 0q-7-9-7-2T0 2q7 4 7-3T0 0" fill="${color}"/><path d="M0-2v5" stroke="#8d7d5b" stroke-width=".7"/>`,
      { dx: 14, dy: -7, duration: 9 },
    ),
  );
}
/** 석재의 수직 이동량과 줄을 감는 비율을 같은 주기로 맞춘다. */
export function crane(x: number, y: number, height = 62) {
  return at(
    x,
    y,
    `<path d="M0 0v-${height}m-10 0h29M-2 0l4-${height}M0-${height}l19 6" fill="none" stroke="#a98b5b" stroke-width="1"/>${at(14, -height + 3, `${motion('reel', '<path d="M0 0v24" stroke="#bfa675" stroke-width=".7"/>', { duration: 8 })}${motion('lift', stone(-3, 24, 7), { dx: 0, dy: -18, duration: 8 })}`)}`,
  );
}
/** 반투명한 기류가 정상에서 떠올라 흩어지게 한다. */
export function steam(x: number, y: number, color = '#e3e7d6') {
  return at(
    x,
    y,
    motion(
      'rise',
      `<path d="M-4 0q-7-6-1-9-4-7 3-8 7-3 8 4 7 3 2 9z" fill="${color}" opacity=".65"/>`,
      { dx: 4, dy: -16, duration: 10 },
    ),
  );
}
/** 도약과 낙하, 물보라를 하나의 시간축에 맞춘다. */
export function diver(x: number, y: number, drop = 26) {
  return at(
    x,
    y,
    `${motion('dive', '<circle cy="-5" r="1.7" fill="#d3b38c"/><path d="M0-3v5m0-3-5-2m5 2 5-2m-5 5-3 4m3-4 3 4" fill="none" stroke="#bd9f7a" stroke-width="1.4" stroke-linecap="round"/>', { dx: 9, dy: drop, duration: 8 })}${at(9, drop + 2, motion('splash', '<path d="M-5 0l-3-4m5 3v-6m4 6 3-5m-10 8q5-3 12 0" fill="none" stroke="#d3eadd" stroke-width="1"/>', { duration: 8 }))}`,
  );
}
/** 고정된 나뭇가지 아래에서 원숭이가 매달려 흔들리게 한다. */
export function monkey(x: number, y: number) {
  return at(
    x,
    y,
    `<path d="M-12-6h26" stroke="#6f875b" stroke-width="1.2"/>${motion('sway', '<path d="M0-6v7" stroke="#9a7752" stroke-width="1.4"/><ellipse cy="4" rx="3" ry="4" fill="#9a7752"/><circle cx="1" cy="0" r="2.2" fill="#b5996d"/><path d="M-2 6q-11 12-12 3t6-3" fill="none" stroke="#9a7752" stroke-width="1.3"/><path d="M2 6l4 4" stroke="#9a7752" stroke-width="1.2"/>', { duration: 4, angle: 24 })}`,
  );
}
