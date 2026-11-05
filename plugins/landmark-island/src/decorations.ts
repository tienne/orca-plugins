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

export function decorationArt(id: string) {
  const d = decorationById(id)!;
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
