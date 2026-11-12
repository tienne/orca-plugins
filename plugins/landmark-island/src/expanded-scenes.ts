import expansion from './landmark-expansion.json';
import * as a from './scenes/actors';

const aquatic = new Set([
  'canal',
  'harbor',
  'coast',
  'fjord',
  'island',
  'bridge',
  'aqueduct',
  'waterworks',
  'wetland',
  'mangrove',
  'reef',
]);
const mountain = new Set([
  'peaks',
  'pillars',
  'redrocks',
  'badlands',
  'cliff',
  'canyon',
  'basalt',
  'glacier',
  'clifftemple',
]);
const temples = new Set([
  'pagoda',
  'roundtemple',
  'stupa',
  'templetower',
  'torii',
  'rocktemple',
  'cliffbuddha',
]);
const churches = new Set([
  'cathedral',
  'basilica',
  'woodchurch',
  'cloister',
  'dome',
]);
const greenery = new Set([
  'forest',
  'savanna',
  'garden',
  'terraces',
  'lakes',
  'crater',
]);

/** 실제 장소의 특징에 맞는 작은 가상 장면을 배치하고 한·영 설명을 함께 둔다. */
export const expandedScenes = expansion.map((entry) => {
  const { id, shape, seed, color, name, nameKo } = entry;
  const x = 18 + (seed % 13),
    offset = seed % 9;
  let layers: string[], en: string, ko: string;
  if (id === 'robbeneiland') {
    layers = [
      a.water(28, 119, 56),
      a.bird(22, 36, '#e6e8d3', 26, -3),
      a.cloud(82, 34, 12),
    ];
    en =
      'Quiet waves pass the island while a seabird crosses above the low roofs.';
    ko = '잔잔한 물결이 섬을 지나고 바닷새가 낮은 지붕 위를 가로지릅니다.';
  } else if (id === 'centralamazon') {
    layers = [
      a.boat(27, 120, 'canoe', 42, color, 0.8),
      a.water(33, 122, 63),
      a.bird(86, 42, '#b9ad6c', 16, -3, 0.9, true),
    ];
    en =
      'A canoe follows the forest channel while a bright-beaked bird passes the broad canopy.';
    ko =
      '카누가 숲의 물길을 따라 움직이고 밝은 부리의 새가 넓은 수관을 지나갑니다.';
  } else if (id === 'chiloe') {
    layers = [
      a.bell(64, 56, 0.65),
      a.person(21, 122, 'walk', color, 21),
      a.leaves(105, 68, '#9fae7e', 0.6),
    ];
    en =
      'A small bell moves inside the timber tower as a visitor walks past the wooden church.';
    ko =
      '목조 탑 안에서 작은 종이 움직이고 관람객이 나무 교회 앞을 걸어갑니다.';
  } else if (id === 'pisa') {
    layers = [
      a.person(22, 120, 'sketch', color, 0),
      a.motion('sway', a.glint('M65 13l-8 93', '#e4d7af', 7), {
        angle: 2,
        duration: 9,
      }),
      a.bird(92, 38, '#d9d9c1', 14, -3),
    ];
    en =
      'A visitor sketches the leaning arcades as a bird passes the bell tower.';
    ko = '관람객이 기울어진 회랑을 그리는 동안 새가 종탑 곁을 지나갑니다.';
  } else if (id === 'samarra') {
    layers = [
      a.at(
        43,
        89,
        a.motion('travel', a.person(0, 0, 'climb', color, 0), {
          dx: 26,
          dy: -43,
          duration: 12,
        }),
      ),
      a.sunbeam(70, 17, 13, 92),
    ];
    en =
      'A tiny climber follows the rising spiral as warm light moves over the minaret.';
    ko =
      '작은 등반객이 나선 경사로를 따라 올라가고 따뜻한 빛이 미나레트를 훑습니다.';
  } else if (id === 'konark') {
    layers = [
      a.sunbeam(21, 19, 70, 93),
      a.person(110, 121, 'brush', color, 0),
      a.glint('M21 107h85', '#e2c58c', 8),
    ];
    en =
      'Sunlight traces the great chariot wheels while a caretaker brushes the stone below.';
    ko =
      '햇빛이 거대한 전차 바퀴를 따라 흐르고 관리인이 아래의 돌을 조심스럽게 닦습니다.';
  } else if (shape === 'geoglyph') {
    layers = [
      a.bird(26, 32, '#8e7767', 56, 5, 1.2),
      a.sunbeam(32, 36, 55, 72),
      a.glint('M29 99l27-28 36 26', '#edcf98', 10),
    ];
    en =
      'A bird crosses the desert as a narrow light reveals the lines drawn on the plateau.';
    ko = '새가 사막 위를 지나고 가느다란 빛이 고원에 그려진 선을 드러냅니다.';
  } else if (shape === 'volcano' || shape === 'geyser') {
    layers = [
      a.steam(64, shape === 'geyser' ? 31 : 28, '#e8e7d3'),
      a.cloud(24, 44, 19),
      a.person(109, 122, 'sketch', color, 0),
    ];
    en =
      'A little plume rises above the volcanic landscape as an observer sketches from the edge.';
    ko =
      '화산 지형 위로 작은 수증기가 피어오르고 관찰자가 가장자리에서 풍경을 그립니다.';
  } else if (shape === 'waterfall') {
    layers = [
      a.fountain(61, 105, 34),
      a.water(28, 119, 68),
      a.bird(94, 38, '#d8e2c7', 16, 4),
    ];
    en =
      'Bright streams pulse down the rock face and spread into ripples below the falls.';
    ko = '밝은 물줄기가 암벽을 타고 흘러내리고 폭포 아래로 잔물결이 퍼집니다.';
  } else if (shape === 'cave' || shape === 'mine') {
    layers = [
      a.person(40, 119, 'lantern', color, 14, -6),
      a.lantern(78, 87, -offset),
      a.glint('M44 57l6 13m20-10-2 17', '#c5d0b9', 9),
    ];
    en =
      'A lantern-bearing explorer passes the entrance while light touches the rock formations.';
    ko = '랜턴을 든 탐험가가 입구를 지나가고 빛이 바위의 윤곽에 닿습니다.';
  } else if (aquatic.has(shape)) {
    layers = [
      a.boat(
        x,
        117,
        shape === 'wetland' || shape === 'mangrove' ? 'canoe' : 'row',
        28 + offset,
        color,
        0.75,
      ),
      a.water(31, 121, 57),
      a.bird(91, 31, '#e1e3cd', 14 + offset, -3),
    ];
    en =
      'A small boat follows the water while a seabird glides past the shoreline silhouette.';
    ko =
      '작은 배가 물길을 따라 움직이고 바닷새가 물가의 윤곽을 스쳐 지나갑니다.';
  } else if (mountain.has(shape)) {
    layers = [
      a.person(x, 122, 'climb', color, 20, -5),
      a.cloud(43, 31, 13 + offset),
      a.bird(99, 43, '#b9c4af', 12, -5),
    ];
    en =
      'A small hiker follows the foot of the rocks as clouds slide between the high silhouettes.';
    ko = '작은 등산객이 바위 아래를 걷고 구름이 높은 윤곽 사이로 흘러갑니다.';
  } else if (temples.has(shape)) {
    layers = [
      a.person(x, 121, 'walk', color, 13 + offset),
      a.leaves(92, 53, '#8fa46b', 0.65),
      a.glint('M47 29l17-8 18 8', '#e8d29d', 8 + offset / 3),
    ];
    en =
      'A visitor passes the temple steps while leaves drift beside the layered sacred silhouette.';
    ko =
      '관람객이 사원의 계단을 지나고 겹겹이 쌓인 건축물 곁으로 나뭇잎이 흩날립니다.';
  } else if (churches.has(shape)) {
    layers = [
      a.bell(76, 52 + offset, 0.6),
      a.person(x, 121, 'sketch', color, 0),
      a.sunbeam(23, 23, 72, 93),
    ];
    en =
      'A small bell swings while a visitor sketches and a band of light crosses the facade.';
    ko =
      '작은 종이 흔들리는 동안 관람객이 그림을 그리고 한 줄기 빛이 정면을 가로지릅니다.';
  } else if (greenery.has(shape)) {
    layers = [
      a.butterflies(35, 91, color),
      a.leaves(89, 57, '#89a270', 0.7),
      shape === 'savanna'
        ? a.at(
            55,
            117,
            a.motion(
              'stroll',
              `<g class="scene-wildlife"><ellipse cy="-5" rx="${id === 'kaziranga' ? 9 : 6}" ry="4" fill="#9a9e8a"/><path d="M5-5l3-4 5 2-1 4z" fill="#9a9e8a"/><path class="scene-stride" d="M-5-3v6m5-6v6m6-6v6" stroke="#727d6c" stroke-width="1.5"/>${id === 'kaziranga' ? '<path d="M11-7l2-5 1 6" fill="#d6d1b7"/>' : '<path d="M9-8l-3-5m4 5 2-5" stroke="#707b65"/>'}</g>`,
              { dx: 23, duration: 14 },
            ),
          )
        : a.person(x, 121, 'water', color, 0),
    ];
    en =
      'Small wings drift over the greenery while the landscape settles into a slow everyday rhythm.';
    ko =
      '작은 날개가 녹음 위를 떠다니고 풍경 속에 느린 일상의 움직임이 이어집니다.';
  } else if (shape === 'industrial') {
    layers = [
      a.steam(93, 24),
      a.wheel(51, 38),
      a.person(17, 122, 'walk', color, 14),
    ];
    en =
      'A pulley turns above the industrial structure while a worker walks below a soft plume.';
    ko = '산업 시설 위의 도르래가 돌고 작은 연기 아래로 작업자가 걸어갑니다.';
  } else if (shape === 'observatory') {
    layers = [
      a.sunbeam(31, 19, 55, 91),
      a.person(108, 122, 'sketch', color, 0),
      a.glint('M59 37v58', '#e6ca8c', 7),
    ];
    en =
      'A moving band of sunlight crosses the measuring instruments as an observer takes notes.';
    ko = '움직이는 햇빛 띠가 관측 기구를 가로지르고 관찰자가 기록을 남깁니다.';
  } else if (shape === 'modern') {
    layers = [
      a.glint(`M25 ${36 + offset}v65m49-41v41`, '#e1ece0', 7),
      a.person(x, 121, 'walk', color, 22),
      a.cloud(82, 25, 17),
    ];
    en =
      'A reflection moves across the geometric facade while a pedestrian crosses the plaza.';
    ko = '기하학적인 정면을 따라 반사가 흐르고 보행자가 광장을 가로지릅니다.';
  } else if (shape === 'jars' || shape === 'stelae') {
    layers = [
      a.person(x, 121, 'brush', color, 0),
      a.leaves(92, 71, '#b2b68c', 0.6),
      a.cloud(35, 32, 14),
    ];
    en =
      'A caretaker gently brushes the stone while wind carries small leaves across the open site.';
    ko =
      '관리인이 돌을 조심스럽게 닦고 바람이 탁 트인 유적 위로 작은 잎을 옮깁니다.';
  } else {
    layers = [
      a.person(
        x,
        121,
        shape === 'pyramid' || shape === 'ziggurat' ? 'mason' : 'walk',
        color,
        shape === 'pyramid' ? 0 : 17 + offset,
      ),
      a.flag(105, 80, color, 13),
      a.bird(31, 29, '#c6cdb6', 18, -2),
    ];
    en =
      'A small figure moves beside the stonework while a banner catches the breeze above the site.';
    ko =
      '작은 인물이 석조 건물 곁에서 움직이고 유적 위의 깃발이 바람을 받습니다.';
  }
  return a.scene(id, `${name}: ${en}`, `${nameKo}: ${ko}`, ...layers);
});
