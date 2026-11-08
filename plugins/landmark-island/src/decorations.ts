/** Bundled, fictional garden sets inspired by each landmark's surroundings. */
export type Decoration = {
  id: string;
  name: string;
  landmark?: string;
  cost: number;
  gift: boolean;
  shape:
    | 'grass'
    | 'path'
    | 'tree'
    | 'flowers'
    | 'lamp'
    | 'bench'
    | 'palm'
    | 'fountain'
    | 'stones'
    | 'gate'
    | 'pond'
    | 'pavilion'
    | 'roseArch'
    | 'fernBed';
  color: string;
  walkable: boolean;
};
const themes: [
  string,
  string,
  Decoration['shape'],
  string,
  Decoration['shape'],
  string,
][] = [
  ['eiffel', 'Paris lantern', 'lamp', 'Café bench', 'bench', '#426b65'],
  [
    'colosseum',
    'Roman cypress',
    'tree',
    'Travertine fountain',
    'fountain',
    '#cdbb9a',
  ],
  [
    'stonehenge',
    'Meadow flowers',
    'flowers',
    'Standing-stone garden',
    'stones',
    '#9dadaa',
  ],
  ['liberty', 'Harbor lantern', 'lamp', 'Promenade bench', 'bench', '#69a294'],
  [
    'opera',
    'Coastal flowers',
    'flowers',
    'Harborside fountain',
    'fountain',
    '#c6dce1',
  ],
  ['fuji', 'Cherry blossom tree', 'tree', 'Woodland gate', 'gate', '#dba3ae'],
  [
    'taj',
    'Mughal garden flowers',
    'flowers',
    'Marble fountain',
    'fountain',
    '#ead9be',
  ],
  ['petra', 'Desert palm', 'palm', 'Sandstone garden', 'stones', '#cd9278'],
  [
    'chichen',
    'Tropical flowers',
    'flowers',
    'Limestone garden',
    'stones',
    '#b2bd91',
  ],
  ['angkor', 'Jungle tree', 'tree', 'Mossy garden gate', 'gate', '#79977a'],
  [
    'machu',
    'Highland flowers',
    'flowers',
    'Terrace stone bench',
    'bench',
    '#a4ac86',
  ],
  ['giza', 'Oasis palm', 'palm', 'Oasis fountain', 'fountain', '#d7bc7e'],
  ['gyeongbokgung', 'Palace pine', 'tree', 'Courtyard gate', 'gate', '#688e76'],
  [
    'merlion',
    'Bay flowers',
    'flowers',
    'Lion City fountain',
    'fountain',
    '#a4c6c0',
  ],
  [
    'brandenburg',
    'Linden tree',
    'tree',
    'Berlin garden bench',
    'bench',
    '#a6b185',
  ],
  [
    'belem',
    'River lantern',
    'lamp',
    'Navigator fountain',
    'fountain',
    '#c5bb9b',
  ],
  ['christ', 'Tropical palm', 'palm', 'Hilltop bench', 'bench', '#91a98c'],
  ['burj', 'Desert lantern', 'lamp', 'Skyline fountain', 'fountain', '#8ab5bd'],
  ['hagia', 'Tulip garden', 'flowers', 'Bosphorus gate', 'gate', '#c79a85'],
  [
    'borobudur',
    'Lotus flowers',
    'flowers',
    'Volcanic stone garden',
    'stones',
    '#8f9a87',
  ],
  ['zimbabwe', 'Savanna tree', 'tree', 'Granite garden', 'stones', '#b2a487'],
  [
    'sagrada',
    'Mosaic flowers',
    'flowers',
    'Gaudí garden bench',
    'bench',
    '#c2ac7e',
  ],
  ['moai', 'Island meadow', 'flowers', 'Basalt garden', 'stones', '#8e9582'],
  ['greatwall', 'Mountain pine', 'tree', 'Watchtower gate', 'gate', '#a6aa7e'],
  ['cn', 'Maple tree', 'tree', 'Lakeside bench', 'bench', '#c78758'],
  [
    'kinderdijk',
    'Canal flowers',
    'flowers',
    'Windmill garden gate',
    'gate',
    '#c5af75',
  ],
  [
    'hallgrim',
    'Lava stones',
    'stones',
    'Northern light lantern',
    'lamp',
    '#879f9f',
  ],
  [
    'atomium',
    'Brussels garden flowers',
    'flowers',
    'Crystal fountain',
    'fountain',
    '#b2bcb6',
  ],
  [
    'petronas',
    'Skybridge lantern',
    'lamp',
    'Twin garden fountain',
    'fountain',
    '#83aeb5',
  ],
  [
    'shwedagon',
    'Golden garden lantern',
    'lamp',
    'Pagoda garden gate',
    'gate',
    '#d2ad57',
  ],
  [
    'acropolis',
    'Olive tree',
    'tree',
    'Athenian marble bench',
    'bench',
    '#a3ad7b',
  ],
  [
    'basil',
    'Cathedral garden flowers',
    'flowers',
    'Red Square lantern',
    'lamp',
    '#bb7e72',
  ],
  [
    'aitbenhaddou',
    'Valley date palm',
    'palm',
    'Earthen garden gate',
    'gate',
    '#c38a66',
  ],
  [
    'sigiriya',
    'Rock garden flowers',
    'flowers',
    'Lion Rock fountain',
    'fountain',
    '#a69c72',
  ],
  [
    'sossusvlei',
    'Dune stones',
    'stones',
    'Desert rest bench',
    'bench',
    '#ce9169',
  ],
  [
    'kilimanjaro',
    'Savanna tree',
    'tree',
    'Summit stone garden',
    'stones',
    '#9aa99c',
  ],
  [
    'pragueclock',
    'Old Town lantern',
    'lamp',
    'Astronomer’s bench',
    'bench',
    '#bda271',
  ],
  [
    'parliament',
    'Danube garden flowers',
    'flowers',
    'Riverside fountain',
    'fountain',
    '#b68483',
  ],
  [
    'schonbrunn',
    'Palace rose bed',
    'flowers',
    'Imperial garden bench',
    'bench',
    '#d3ae84',
  ],
  [
    'matterhorn',
    'Alpine pine',
    'tree',
    'Alpine stone garden',
    'stones',
    '#8a9a8a',
  ],
  [
    'mermaid',
    'Harbour flowers',
    'flowers',
    'Seaside bench',
    'bench',
    '#9bb8b0',
  ],
  [
    'borgund',
    'Nordic woodland tree',
    'tree',
    'Carved woodland gate',
    'gate',
    '#82765b',
  ],
  [
    'helsinki',
    'Senate Square flowers',
    'flowers',
    'Cathedral garden fountain',
    'fountain',
    '#b5c3bd',
  ],
  [
    'obelisco',
    'Jacaranda tree',
    'tree',
    'Buenos Aires park bench',
    'bench',
    '#b39ac2',
  ],
  [
    'dubrovnik',
    'Adriatic lantern',
    'lamp',
    'Coastal stone garden',
    'stones',
    '#d5bc94',
  ],
  [
    'boudhanath',
    'Stupa garden flowers',
    'flowers',
    'Pilgrim’s rest bench',
    'bench',
    '#d3b673',
  ],
  [
    'halong',
    'Bay garden tree',
    'tree',
    'Limestone garden rocks',
    'stones',
    '#83a997',
  ],
  ['hegra', 'Oasis palm', 'palm', 'Sandstone garden gate', 'gate', '#cdac84'],
  [
    'lotte',
    'Seoul skyline lantern',
    'lamp',
    'Sky garden bench',
    'bench',
    '#8caeb3',
  ],
  [
    'marinabaysands',
    'Bay rooftop palm',
    'palm',
    'SkyPark fountain',
    'fountain',
    '#8da991',
  ],
  [
    'guggenheim',
    'Riverside flower bed',
    'flowers',
    'Sculpture garden stones',
    'stones',
    '#afafa0',
  ],
];
export const decorations: Decoration[] = [
  {
    id: 'grass',
    name: 'Soft grass',
    cost: 0,
    gift: false,
    shape: 'grass',
    color: '#91b96e',
    walkable: true,
  },
  {
    id: 'path',
    name: 'Earth path',
    cost: 0,
    gift: false,
    shape: 'path',
    color: '#c5ae82',
    walkable: true,
  },
  {
    id: 'stonepath',
    name: 'Stone paving',
    cost: 0,
    gift: false,
    shape: 'path',
    color: '#aeb5a1',
    walkable: true,
  },
  {
    id: 'oak',
    name: 'Garden oak',
    cost: 0,
    gift: false,
    shape: 'tree',
    color: '#79a960',
    walkable: false,
  },
  ...themes.flatMap(([landmark, first, shape, second, shape2, color]) => [
    {
      id: `${landmark}-gift`,
      name: first,
      landmark,
      cost: 3,
      gift: true,
      shape,
      color,
      walkable: shape === 'flowers',
    },
    {
      id: `${landmark}-special`,
      name: second,
      landmark,
      cost: 6,
      gift: false,
      shape: shape2,
      color,
      walkable: false,
    },
  ]),
  {
    id: 'fuji-pond',
    name: 'Moonlit koi pond',
    landmark: 'fuji',
    cost: 9,
    gift: false,
    shape: 'pond',
    color: '#80b8ae',
    walkable: false,
  },
  {
    id: 'taj-pavilion',
    name: 'Marble garden pavilion',
    landmark: 'taj',
    cost: 12,
    gift: false,
    shape: 'pavilion',
    color: '#e4dbc0',
    walkable: false,
  },
  {
    id: 'eiffel-rose-arch',
    name: 'Rose-covered archway',
    landmark: 'eiffel',
    cost: 9,
    gift: false,
    shape: 'roseArch',
    color: '#bc8e91',
    walkable: false,
  },
  {
    id: 'angkor-fern-bed',
    name: 'Fern sanctuary',
    landmark: 'angkor',
    cost: 6,
    gift: false,
    shape: 'fernBed',
    color: '#719c72',
    walkable: false,
  },
];
export const decorationById = (id: string) =>
  decorations.find((d) => d.id === id);
export const DUPLICATE_MATERIALS = 3;

export const isFloor = (id: string) =>
  ['grass', 'path', 'stonepath'].includes(id);
export const canRotate = (id: string) =>
  ['bench', 'gate'].includes(decorationById(id)?.shape ?? '');

// Small original 3D furniture drawings keep upright posts upright when rotated.
function furnitureArt(d: Decoration, rotation: number) {
  type Point = [number, number, number];
  const faces: { points: Point[]; fill: string }[] = [];
  const turn = ([x, y, z]: Point): Point => {
    for (let i = 0; i < rotation; i++) [x, y] = [-y, x];
    return [x, y, z];
  };
  const box = (
    x: number,
    y: number,
    z: number,
    w: number,
    depth: number,
    h: number,
  ) => {
    const vertices: Point[] = [
      [x, y, z],
      [x + w, y, z],
      [x + w, y + depth, z],
      [x, y + depth, z],
      [x, y, z + h],
      [x + w, y, z + h],
      [x + w, y + depth, z + h],
      [x, y + depth, z + h],
    ];
    for (const [indices, fill] of [
      [[0, 1, 5, 4], '#65705b'],
      [[1, 2, 6, 5], d.color],
      [[2, 3, 7, 6], d.color],
      [[3, 0, 4, 7], '#65705b'],
      [[4, 5, 6, 7], '#d6c7a0'],
    ] as [number[], string][])
      faces.push({ points: indices.map((i) => turn(vertices[i])), fill });
  };
  if (d.shape === 'bench') {
    for (const x of [-23, 18]) for (const y of [-10, 7]) box(x, y, 0, 5, 5, 20);
    for (let y = -12; y <= 8; y += 7) box(-27, y, 20, 54, 6, 3);
    for (const x of [-23, 18]) box(x, -12, 20, 5, 4, 25);
    for (const z of [29, 39]) box(-27, -14, z, 54, 4, 7);
  } else {
    for (const x of [-23, 17]) box(x, -3, 0, 6, 6, 62);
    box(-30, -5, 54, 60, 10, 7);
    box(-26, -4, 37, 52, 8, 5);
  }
  const depth = (p: Point[]) =>
    p.reduce((sum, [x, y, z]) => sum + x + y + z * 0.001, 0) / p.length;
  faces.sort((a, b) => depth(a.points) - depth(b.points));
  return `<svg class="decoration-art" viewBox="0 0 80 104" aria-hidden="true"><ellipse cx="40" cy="90" rx="31" ry="9" fill="#244e3825"/>${faces.map((f) => `<polygon points="${f.points.map(([x, y, z]) => `${40 + (x - y) * 0.65},${86 + (x + y) * 0.32 - z}`).join(' ')}" fill="${f.fill}" stroke="#53624d" stroke-width=".7" stroke-linejoin="round"/>`).join('')}</svg>`;
}
// Low planting keeps views across paths open; small blossoms sit in layered foliage.
function flowerBedArt(color: string) {
  const blooms = [
    [17, 74],
    [27, 65],
    [39, 73],
    [49, 62],
    [61, 74],
    [29, 82],
    [49, 83],
  ];
  return `<ellipse cx="40" cy="84" rx="31" ry="11" fill="#49694b" stroke="none"/>
    <g fill="#759765" stroke="#57764f" stroke-width=".5">
      <ellipse cx="22" cy="78" rx="15" ry="8"/><ellipse cx="43" cy="70" rx="18" ry="9"/>
      <ellipse cx="57" cy="80" rx="15" ry="9"/><ellipse cx="38" cy="85" rx="18" ry="7"/>
    </g>
    ${blooms
      .map(
        ([x, y], i) => `<g transform="translate(${x} ${y})">
      <path d="M0 4v9m0-4q-8-7-8-1 4 4 8 3m0-6q8-6 8-1-4 4-8 3" fill="#94b57a" stroke="#486e49" stroke-width=".7"/>
      <g fill="${i % 3 === 0 ? '#f5e8cf' : color}" stroke="none">
        ${[0, 72, 144, 216, 288].map((angle) => `<ellipse cy="-2.8" rx="2.5" ry="3.4" transform="rotate(${angle})"/>`).join('')}
      </g><circle r="1.7" fill="#d8af64" stroke="none"/>
    </g>`,
      )
      .join('')}
    <path d="M12 84l5 2m17 4 6 1m17-4 5-2m-28-8 4 1" stroke="#bed09c" stroke-width="1" fill="none"/>`;
}
function gardenTreeArt(color: string) {
  return `<path d="M34 93q7-25 3-50l8-1q-4 29 5 50z" fill="#8b785c" stroke="#6c694e" stroke-width=".8"/>
    <path d="M40 74L22 46m19 15 17-26" fill="none" stroke="#8b785c" stroke-width="3"/>
    <g fill="${color}" stroke="#526e4b" stroke-width=".6">
      <path d="M11 58Q1 49 10 38Q6 25 21 23Q25 9 39 15Q50 6 59 20Q73 19 72 34Q84 43 72 55Q76 69 60 70Q50 81 37 72Q20 78 17 65Q9 65 11 58Z"/>
    </g>
    <path d="M12 54q15 10 26 1t34-5q4 16-15 19-13 9-23 1-20 3-22-16" fill="#354f43" opacity=".16" stroke="none"/>
    <g fill="#fff3d6" opacity=".2" stroke="none">
      <ellipse cx="25" cy="32" rx="13" ry="9"/><ellipse cx="44" cy="25" rx="12" ry="8"/>
      <ellipse cx="57" cy="40" rx="12" ry="9"/><ellipse cx="27" cy="49" rx="10" ry="7"/>
    </g>
    <path d="m19 31 3-2m7-6 3 1m7-5 3 1m9 8 4-1m9 13 3 2m-44 8 4 1m7-8 3-2m11 11 4-2m-13 15 3 1m18-9 4-2" stroke="#f4e9c9" opacity=".5" stroke-width="1.3" stroke-linecap="round" fill="none"/>`;
}
export function decorationArt(id: string, rotation = 0) {
  const d = decorationById(id)!;
  if (canRotate(id)) return furnitureArt(d, rotation);
  const shapes: Record<Decoration['shape'], string> = {
    grass:
      '<path d="M5 78L40 58 75 78 40 98Z"/><path d="M20 78l3-8 3 8m17 6 4-10 3 9m8-8 3-7 2 8" fill="none" stroke="#547644"/>',
    path: '<path d="M5 78L40 58 75 78 40 98Z"/><path d="M16 78l21-12m2 25 23-14" stroke="#e4cfaa"/>',
    tree: gardenTreeArt(d.color),
    flowers: flowerBedArt(d.color),
    lamp: '<path d="M29 90h22l-6-7H35zM38 83V37h4v46"/><path d="M27 17l13-8 13 8-4 25H31Z"/><path d="M32 20h16l-3 17H35Z" fill="#f7db83"/><path d="M40 18v20M25 18h30" stroke="#354e4e"/><circle cx="40" cy="27" r="16" fill="#ffdf8b" opacity=".12" stroke="none"/>',
    bench:
      '<path d="M12 68v20m48-15v20m-39-23v16m47-20v18" stroke="#5b6354" stroke-width="4"/><path d="M10 65l45-9 17 10-46 12Z"/><path d="M12 63V43l45-9v20Z"/><path d="M17 48l35-7m-34 15 34-7" stroke="#e8d3ac" fill="none"/>',
    palm: '<path d="M35 91q10-29 4-55l6-1q12 31 0 58" fill="#b19868"/><path d="M42 37Q9 8 4 44q21-17 38-7Q26 0 56 5q-9 14-14 32Q72 6 77 44 59 29 42 37Q13 28 12 64q11-19 30-27Q75 28 71 66 57 42 42 37Z" fill="#7b9d59"/><path d="M38 78l11 3m-10-14 12 2m-11-14 10 1" stroke="#766746"/>',
    fountain:
      '<path d="M8 75q32-20 64 0v12q-32 19-64 0Z"/><ellipse cx="40" cy="75" rx="30" ry="12" fill="#7fbbbc"/><path d="M33 74V49h14v25M18 45q22 16 44 0l-6 13H24Z"/><ellipse cx="40" cy="45" rx="22" ry="7" fill="#a3d9d2"/><path d="M40 45V21m0 0q-18 0-17 21m17-21q18 0 17 21" stroke="#bfece5" stroke-width="3" fill="none"/>',
    stones:
      '<path d="M6 80l13-28 16 2 7 31-19 9ZM38 82l8-48 17-6 9 51-18 12Z"/><path d="M19 52l4 42m23-60 8 57M8 80l13-5m22 8 23-9" fill="none" stroke="#6e7d69"/><path d="M12 85l12 5 11-5m11-2 9 4 11-8" fill="none" stroke="#799e5e" stroke-width="4"/>',
    pond: `<path d="M5 72Q-1 55 17 46Q33 36 58 46Q82 53 76 74L68 89Q45 102 16 88Z" fill="#8e9b8a"/>
      <path d="M7 67Q3 52 25 46Q52 39 72 54Q83 68 63 81Q34 95 12 79Z" fill="#d5ccb0"/>
      <path d="M12 66Q9 55 28 50Q50 44 66 56Q76 66 59 77Q36 87 18 76Z" fill="#3e7e83" stroke="#667e6b"/>
      <path d="M16 65Q25 50 45 53Q63 52 67 64Q54 82 30 79Q17 76 16 65Z" fill="#70b9b4" stroke="none"/>
      <path d="M21 61q12-7 23-5m-21 17q15 6 27 0m8-10 6 1" fill="none" stroke="#d7eee0" stroke-width="1.4"/>
      <path d="M28 64q9-6 14 2-7 7-14-2l-6 3 1-7z" fill="#e4a16c" stroke="#ab7956" stroke-width=".5"/>
      <path d="M48 71q5-6 10-2-3 6-10 2l-4 4-1-5z" fill="#f4e2b8" stroke="none"/>
      <path d="M54 53q8-6 11 1-6 7-11-1l6 1" fill="#628e59"/><path d="M56 53l3-5 3 3 4-1-2 5z" fill="#e0a7b3" stroke="#a8778c" stroke-width=".6"/>
      <g fill="#c2c6a7" stroke="#7d8b78" stroke-width=".8"><path d="M8 55l9-8 9 2-6 6z"/><path d="M45 44l12 1 9 5-10 2z"/><path d="M65 76l9-8 1 9-6 7z"/><path d="M13 81l12 4 2 7-12-4z"/><path d="M39 88l14-3 4 6-15 4z"/></g>
      <path d="M7 72Q0 61 5 55m1 16q6-9 5-15M70 86q8-9 6-17" fill="none" stroke="#628750" stroke-width="2"/>`,
    pavilion: `<path d="M7 81L39 63 75 81 42 101 7 87Z" fill="#9caa97"/><path d="M7 81L39 63 75 81 42 95Z" fill="#e0d7bd"/>
      <path d="M17 79L40 66 64 79 41 92Z" fill="#a9bcb1"/><path d="M21 81l20 8 17-9" stroke="#f6edd5" fill="none"/>
      <g fill="#e9e1cb" stroke="#8c9580"><path d="M16 78V37l5 2v42z"/><path d="M37 68V29l5 1v41z"/><path d="M62 80V38l5-2v41z"/><path d="M38 91V48l6 1v39z"/></g>
      <g fill="#c6c8ac"><path d="M13 76l9-2v7l-9 1zM35 87l11-2v7l-11 3zM60 76l9-2v7l-9 2z"/></g>
      <path d="M5 37L39 13 75 37 41 55Z" fill="#4d867b"/><path d="M5 37L39 13 41 49Z" fill="#85aaa0"/><path d="M41 49L39 13 75 37Z" fill="#3e6e68"/>
      <path d="M5 37v7l36 17 34-18v-6L41 53Z" fill="#e2cfaa"/><path d="M14 35l25-17m-12 26 12-26m15 24L41 18m22 20L41 18" stroke="#b6c3a1" stroke-width=".8" fill="none"/>
      <path d="M35 15l5-10 5 10-5 4z" fill="#d8ba76"/><path d="M40 5V1" stroke="#ae945c"/>
      <path d="M17 61q-9-9-7-19m8 31q-9-10-6-15m51 8q8-9 6-19" stroke="#679160" stroke-width="2" fill="none"/>
      <g fill="#93b378" stroke="none"><ellipse cx="10" cy="47" rx="5" ry="3"/><ellipse cx="15" cy="59" rx="5" ry="3"/><ellipse cx="68" cy="51" rx="5" ry="3"/></g>`,
    roseArch: `<path d="M8 87L40 69 73 88 42 101Z" fill="#b2b49b"/>
      <path d="M15 85V38Q15 9 39 12Q64 14 64 42v44l-7 4V41Q57 21 39 20Q22 18 22 39v50Z" fill="#d4c6a3"/>
      <path d="M24 88V43Q24 24 41 27Q57 30 57 45v44" fill="none" stroke="#7c8e71" stroke-width="2"/>
      <path d="M15 46l8 5m-8 5 8 5m-8 5 8 5m-8 5 8 5m34-32 8-5m-8 15 8-5m-8 15 8-5m-8 15 8-5" stroke="#8c987a" stroke-width="1"/>
      <path d="M18 87Q9 63 19 40T42 15Q65 14 60 42t2 43" stroke="#557d51" stroke-width="4" fill="none"/>
      <g fill="#79a462" stroke="#577a4d" stroke-width=".7"><ellipse cx="13" cy="60" rx="7" ry="4" transform="rotate(-35 13 60)"/><ellipse cx="23" cy="43" rx="7" ry="4"/><ellipse cx="25" cy="21" rx="8" ry="4" transform="rotate(-40 25 21)"/><ellipse cx="47" cy="16" rx="8" ry="4"/><ellipse cx="65" cy="37" rx="7" ry="4" transform="rotate(50 65 37)"/><ellipse cx="58" cy="69" rx="7" ry="4"/></g>
      <g fill="#d9a1af" stroke="#aa7285" stroke-width=".8"><circle cx="17" cy="31" r="6"/><circle cx="35" cy="15" r="7"/><circle cx="56" cy="23" r="6"/><circle cx="64" cy="52" r="6"/><circle cx="15" cy="77" r="5"/></g>
      <path d="M14 31q2-5 6 0-3 5-5 0m17-16q3-6 7 0-4 5-6 0m20 8q2-4 5 0m-2 29q3-5 6 0m-51 25 3-2" fill="none" stroke="#f5d5d5" stroke-width="1.4"/>
      <path d="M8 86l18-1-3 10-12-2zM55 88l16-5-1 10-12 5z" fill="#9b8871"/>`,
    fernBed: `<path d="M6 79L40 60 74 79v10L40 104 6 89Z" fill="#8b9681"/><path d="M6 79L40 60 74 79 40 96Z" fill="#c4bda0"/>
      <path d="M12 79L40 65 67 79 40 91Z" fill="#64745b"/><path d="M12 90l24 10m9-1 24-12" stroke="#b7b997" fill="none"/>
      <g fill="none" stroke="#487655" stroke-width="1.6"><path d="M23 84Q17 63 8 57m15 27Q24 55 35 47m8 41Q43 60 58 48m-15 40Q29 63 23 60m32 23Q64 67 72 63"/></g>
      <g fill="#81ac70" stroke="#567b51" stroke-width=".6"><path d="M19 74Q8 76 8 68q8-2 11 6m-4-9Q4 67 3 59q8-2 12 6m8 7q-3-12 4-15 5 7-4 15m6-13q-3-12 4-15 5 7-4 15m17 15q-4-13 5-17 4 9-5 17m8-14q-3-13 6-16 3 9-6 16m-14 20q-12-2-12-10 9-2 12 10m18-4q6-12 14-8-2 9-14 8"/></g>
      <path d="M31 79q8-6 16 0l-2 9q-6 5-12 0z" fill="#749e9c"/><ellipse cx="39" cy="79" rx="8" ry="3" fill="#b3d0bc"/>
      <path d="M38 79V66m-1 7-5-4m8 3 6-6" stroke="#5b8158" fill="none"/><g fill="#d7b5cf" stroke="#a28da4" stroke-width=".5"><circle cx="38" cy="65" r="4"/><circle cx="31" cy="68" r="3"/><circle cx="47" cy="65" r="3"/></g>`,
    gate: '<path d="M16 90V31h8v59m32 0V31h8v59M10 29h60v9H10Zm-5-14q35 10 70 0v10q-35 9-70 0Z"/><path d="M24 47h32v6H24Z"/><path d="M13 22q27 6 54 0" stroke="#ead8ae" fill="none"/>',
  };
  return `<svg class="decoration-art" viewBox="0 0 80 104" aria-hidden="true"><ellipse cx="40" cy="92" rx="31" ry="7" fill="#244e3825"/><g fill="${d.color}" stroke="#53624d" stroke-width="1.3" stroke-linejoin="round">${shapes[d.shape]}</g></svg>`;
}
