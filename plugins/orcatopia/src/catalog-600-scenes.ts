import catalog from './catalog-600.json';
import expansion from './landmark-expansion.json';
import * as a from './scenes/actors';

const byId = new Map(expansion.map((entry) => [entry.id, entry]));

/** 역사적 재현과 구분되는 가상 장면을 장소의 지형·동식물·구조 특징에 맞춘다. */
export const catalog600Scenes = catalog.map((profile) => {
  const entry = byId.get(profile.id)!;
  const { detail, heights: h } = profile;
  const { id, name, nameKo, shape, color, feature, featureKo } = entry;
  const x = 12 + h[0] / 3;
  let layers: string[], en: string, ko: string;
  if (
    ['fish', 'whaleshark', 'whale', 'turtle', 'stromatolite', 'ice'].includes(
      detail,
    )
  ) {
    const wildlife =
      detail === 'turtle'
        ? '<ellipse cx="0" cy="0" rx="8" ry="5" fill="#8b9870"/><path d="M-6-4l-5-4m5 11-5 4m17-11 5-3m-5 11 5 3M7 0h5" stroke="#718565" stroke-width="3"/>'
        : detail === 'whale' || detail === 'whaleshark'
          ? '<path d="M-17 0q6-12 25-6l10 7 6-6-2 9-7 1Q-7 13-17 0z" fill="#718f95"/><path d="M-1-5l3-7 5 8" fill="#6c868b"/>'
          : '<path d="M-8 0q9-8 17 0-8 8-17 0l-6 5V-5z" fill="#d6bd80"/>';
    layers = [
      a.water(22, 120, 80),
      a.at(
        x,
        114,
        a.motion('travel', detail === 'ice' ? a.stone(0, 0, 11) : wildlife, {
          dx: 40,
          duration: 17,
        }),
      ),
      a.bird(97, 35, '#e8e8d3', 14, -2),
    ];
    en =
      detail === 'ice'
        ? 'Small ice fragments drift past the frozen shoreline.'
        : 'A small aquatic silhouette passes the water while ripples follow the shore.';
    ko =
      detail === 'ice'
        ? '작은 얼음 조각이 얼어붙은 물가를 따라 떠갑니다.'
        : '작은 수생 동물의 모습이 물 위를 지나고 물가를 따라 잔물결이 번집니다.';
  } else if (
    ['waterbirds', 'seabird', 'boat', 'sail', 'forestwater'].includes(detail) ||
    profile.placement === 'coastal'
  ) {
    layers = [
      a.water(20, 120, 83),
      a.boat(x, 120, detail === 'sail' ? 'sail' : 'canoe', 27, color, 0.65),
      a.bird(83, 40, '#e1e5d1', 27, -3),
      a.bird(102, 32, '#c3d2bd', 18, -2, 0.7),
    ];
    en = 'A little boat follows the water as birds cross the shoreline.';
    ko = '작은 배가 물길을 따라 움직이고 새들이 물가를 가로지릅니다.';
  } else if (
    ['gorilla', 'okapi', 'rhino', 'herd', 'bison', 'dragon', 'monkey'].includes(
      detail,
    )
  ) {
    const animal =
      detail === 'gorilla' || detail === 'monkey'
        ? '<path d="M-8 3q-3-10 3-14 7-3 11 5l5 9M-4 1l-2 8m10-7 3 7" fill="#788479" stroke="#657066" stroke-width="3"/><circle cx="1" cy="-12" r="4" fill="#9a9e84"/>'
        : detail === 'dragon'
          ? '<path d="M-17 1l9-5 17 1 6-4 7 2-5 5-8 2-17-1-15 4z" fill="#889779"/><path d="M-5 1l-4 6M7 1l3 6" stroke="#6a785f" stroke-width="2"/>'
          : '<ellipse cy="-4" rx="10" ry="6" fill="#939c84"/><path d="M7-6l5-4 6 4-2 4H8M-6-1v8m8-8v8m7-8v8" fill="#939c84" stroke="#798470" stroke-width="2"/>';
    layers = [
      a.at(x, 119, a.motion('stroll', animal, { dx: 34, duration: 19 })),
      a.leaves(93, 48, '#8fa36e', 0.8),
      a.bird(89, 29, '#c4ceb1', 14, -2),
    ];
    en =
      'A tiny animal moves at the edge of the habitat while leaves drift overhead.';
    ko = '작은 동물이 서식지 가장자리를 움직이고 머리 위로 잎이 흩날립니다.';
  } else if (detail === 'butterflies') {
    layers = [
      a.butterflies(x, 75, '#d69a61'),
      a.butterflies(82, 91, '#e4b76c'),
      a.leaves(100, 54),
    ];
    en =
      'Orange wings flutter between the trees in a miniature winter gathering.';
    ko = '작은 월동 무리를 이룬 주황색 날개들이 나무 사이로 날아다닙니다.';
  } else if (
    ['wheel', 'silk', 'lock', 'ironwater', 'channels', 'drainage'].includes(
      detail,
    )
  ) {
    layers = [
      a.wheel(90, 89),
      a.person(x, 121, 'walk', color, 13),
      ...(profile.placement === 'river'
        ? [a.water(31, 120, 67)]
        : [a.glint('M43 87v20m12-20v20', '#dfd6b2', 8)]),
    ];
    en =
      'A little wheel turns beside the working structure while a visitor follows its edge.';
    ko = '시설 곁의 작은 바퀴가 돌아가고 관람객이 가장자리를 따라 걷습니다.';
  } else if (['steam', 'lava', 'crater'].includes(detail)) {
    layers = [
      a.steam(63, Math.max(15, 117 - h[2]), '#dedbc9'),
      a.cloud(24, 47, 17),
      a.person(111, 123, 'sketch', color, 0),
    ];
    en =
      'A pale plume rises above the volcanic terrain as an observer sketches from the margin.';
    ko =
      '화산 지형 위로 옅은 수증기가 피어오르고 관찰자가 가장자리에서 풍경을 그립니다.';
  } else if (['waterfall', 'cascade', 'whitewater'].includes(detail)) {
    layers = [
      a.fountain(79, 107, 15),
      a.water(29, 121, 68),
      a.bird(101, 37, '#dce5ca', 14, 3),
    ];
    en =
      'Water descends in bright threads and spreads into ripples beneath the terraces.';
    ko = '밝은 실처럼 물이 흘러내리고 단 아래로 잔물결이 퍼집니다.';
  } else if (['cave', 'caveriver', 'salt', 'mine'].includes(detail)) {
    layers = [
      a.person(35, 120, 'lantern', color, 17, -4),
      a.glint('M40 62l8 17m26-19-4 20', '#d5d6b6', 10),
      ...(detail === 'caveriver'
        ? [a.water(40, 121, 46)]
        : [a.lantern(83, 88, -3)]),
    ];
    en =
      'A lantern-bearing visitor pauses as light traces the underground formations.';
    ko = '랜턴을 든 관람객이 멈추고 빛이 지하 지형의 윤곽을 따라 흐릅니다.';
  } else if (
    [
      'forest',
      'gianttrees',
      'palm',
      'flowers',
      'garden',
      'bodhi',
      'moorland',
    ].includes(detail)
  ) {
    layers = [
      a.leaves(96, 52, '#8fa672', 0.8),
      a.butterflies(x, 94, color),
      a.bird(81, 32, '#c5cdae', 19, -2),
    ];
    en = 'Leaves turn gently and small wings pass between the plants.';
    ko = '잎들이 부드럽게 돌고 작은 날개들이 식물 사이를 지납니다.';
  } else if (
    [
      'snow',
      'granite',
      'tablemountain',
      'karst',
      'twin',
      'rift',
      'monolith',
      'bands',
      'dunes',
      'quiet',
    ].includes(detail) ||
    ['peaks', 'redrocks', 'cliff'].includes(shape)
  ) {
    layers = [
      a.cloud(33, 30, 25),
      a.bird(92, 44, '#d3d9c1', 18, -3),
      ...(detail === 'quiet'
        ? [a.water(30, 120, 60)]
        : [a.person(x, 122, 'sketch', color, 0)]),
    ];
    en =
      'Clouds pass the distinctive rock outline while a quiet light crosses the landscape.';
    ko =
      '독특한 바위 윤곽을 따라 구름이 지나고 잔잔한 빛이 경관을 가로지릅니다.';
  } else if (['sun', 'beacon'].includes(detail)) {
    layers = [
      a.sunbeam(65, 21, 39, 87),
      a.person(x, 121, 'sketch', color, 0),
      a.glint('M16 96h97', '#e5cf98', 11),
    ];
    en =
      'A band of light sweeps past the landmark while an observer records its path.';
    ko = '한 줄기 빛이 랜드마크를 훑고 관찰자가 그 움직임을 기록합니다.';
  } else if (
    [
      'library',
      'mosaic',
      'fresco',
      'engravings',
      'relief',
      'sgraffito',
      'sculpture',
      'deer',
      'horse',
      'heads',
      'army',
      'poles',
      'spiral',
    ].includes(detail)
  ) {
    layers = [
      a.person(x, 122, 'sketch', color, 0),
      a.sunbeam(22, 26, 72, 87),
      a.glint('M42 87l16 7 25-10', '#dfc799', 10),
    ];
    en =
      'A visitor sketches the decorated surfaces as a soft light reveals their details.';
    ko = '관람객이 장식 표면을 그리고 부드러운 빛이 세부를 드러냅니다.';
  } else {
    layers = [
      a.person(x, 122, 'walk', color, 16),
      a.bird(97, 32, '#d1d7bc', 16, -3),
      a.glint(`M17 ${123 - h[1]}h91`, '#e0cca2', 10),
    ];
    en =
      'A visitor walks beside the characteristic structures while daylight moves across their outline.';
    ko = '관람객이 특징적인 구조물 곁을 걷고 햇빛이 그 윤곽을 따라 흐릅니다.';
  }
  return a.scene(
    id,
    `${name}: ${feature}. Miniature scene: ${en}`,
    `${nameKo}: ${featureKo}. 작은 가상 장면: ${ko}`,
    ...layers,
  );
});
