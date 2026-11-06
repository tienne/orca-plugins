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
    | 'gate';
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
export function decorationArt(id: string, rotation = 0) {
  const d = decorationById(id)!;
  if (canRotate(id)) return furnitureArt(d, rotation);
  const shapes: Record<Decoration['shape'], string> = {
    grass:
      '<path d="M5 78L40 58 75 78 40 98Z"/><path d="M20 78l3-8 3 8m17 6 4-10 3 9m8-8 3-7 2 8" fill="none" stroke="#547644"/>',
    path: '<path d="M5 78L40 58 75 78 40 98Z"/><path d="M16 78l21-12m2 25 23-14" stroke="#e4cfaa"/>',
    tree: '<path d="M36 90l2-40h6l2 40" fill="#8e7255"/><path d="M12 58Q0 42 17 34 10 17 30 20 35 3 48 17 66 10 66 31 83 40 67 53 70 72 49 67 34 82 26 66 9 73 12 58Z"/><path d="M20 37q10-14 21-9m6-4 10 7M18 54l7 3m18 2 15-6" fill="none" stroke="#e2e9b0" opacity=".6"/>',
    flowers:
      '<path d="M8 80L40 63 72 80 40 96Z" fill="#728f58"/><path d="M22 82V64m18 22V55m18 27V64" stroke="#4e744a" stroke-width="3"/><g stroke="#9d755d"><circle cx="22" cy="61" r="8"/><circle cx="40" cy="53" r="9"/><circle cx="58" cy="62" r="8"/></g><g fill="#f8dd8d" stroke="none"><circle cx="22" cy="61" r="3"/><circle cx="40" cy="53" r="3"/><circle cx="58" cy="62" r="3"/></g>',
    lamp: '<path d="M29 90h22l-6-7H35zM38 83V37h4v46"/><path d="M27 17l13-8 13 8-4 25H31Z"/><path d="M32 20h16l-3 17H35Z" fill="#f7db83"/><path d="M40 18v20M25 18h30" stroke="#354e4e"/><circle cx="40" cy="27" r="16" fill="#ffdf8b" opacity=".12" stroke="none"/>',
    bench:
      '<path d="M12 68v20m48-15v20m-39-23v16m47-20v18" stroke="#5b6354" stroke-width="4"/><path d="M10 65l45-9 17 10-46 12Z"/><path d="M12 63V43l45-9v20Z"/><path d="M17 48l35-7m-34 15 34-7" stroke="#e8d3ac" fill="none"/>',
    palm: '<path d="M35 91q10-29 4-55l6-1q12 31 0 58" fill="#b19868"/><path d="M42 37Q9 8 4 44q21-17 38-7Q26 0 56 5q-9 14-14 32Q72 6 77 44 59 29 42 37Q13 28 12 64q11-19 30-27Q75 28 71 66 57 42 42 37Z" fill="#7b9d59"/><path d="M38 78l11 3m-10-14 12 2m-11-14 10 1" stroke="#766746"/>',
    fountain:
      '<path d="M8 75q32-20 64 0v12q-32 19-64 0Z"/><ellipse cx="40" cy="75" rx="30" ry="12" fill="#7fbbbc"/><path d="M33 74V49h14v25M18 45q22 16 44 0l-6 13H24Z"/><ellipse cx="40" cy="45" rx="22" ry="7" fill="#a3d9d2"/><path d="M40 45V21m0 0q-18 0-17 21m17-21q18 0 17 21" stroke="#bfece5" stroke-width="3" fill="none"/>',
    stones:
      '<path d="M6 80l13-28 16 2 7 31-19 9ZM38 82l8-48 17-6 9 51-18 12Z"/><path d="M19 52l4 42m23-60 8 57M8 80l13-5m22 8 23-9" fill="none" stroke="#6e7d69"/><path d="M12 85l12 5 11-5m11-2 9 4 11-8" fill="none" stroke="#799e5e" stroke-width="4"/>',
    gate: '<path d="M16 90V31h8v59m32 0V31h8v59M10 29h60v9H10Zm-5-14q35 10 70 0v10q-35 9-70 0Z"/><path d="M24 47h32v6H24Z"/><path d="M13 22q27 6 54 0" stroke="#ead8ae" fill="none"/>',
  };
  return `<svg class="decoration-art" viewBox="0 0 80 104" aria-hidden="true"><ellipse cx="40" cy="92" rx="31" ry="7" fill="#244e3825"/><g fill="${d.color}" stroke="#53624d" stroke-width="1.3" stroke-linejoin="round">${shapes[d.shape]}</g></svg>`;
}
