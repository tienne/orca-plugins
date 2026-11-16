import catalog from './catalog-700.json';
import * as a from './scenes/actors';

/** 수면 위 고유 소품도 기존 장면의 동작 줄이기와 화면 밖 정지 규칙을 따른다. */
export const catalog700Scenes = catalog.map(({ record, visual: p, scene }) => {
  const x = p.actorX,
    y = 109 - p.height;
  const water = a.water(64, 119, p.width * 0.8);
  const fish = '<path d="M-7 0q7-7 15 0-8 7-15 0l-5 4v-8z" fill="#e4c28c"/>';
  let layers: string[];
  switch (p.motif) {
    case 'beacon':
      layers = [
        water,
        a.sunbeam(64, y - 4, x, 80),
        a.bird(x, 47, '#e5e5cc', 18, -2, 0.7),
      ];
      break;
    case 'gulls':
      layers = [
        water,
        a.bird(x, 35, '#edebd5', x < 64 ? 29 : -29, -4),
        a.bird(128 - x, 57, '#cadbcb', 17, 3, 0.7),
      ];
      break;
    case 'spray':
      layers = [
        a.at(
          x,
          111,
          a.motion(
            'pulse',
            '<path d="M-13 0q8-19 15-2t15-2" fill="none" stroke="#e0ead8" stroke-width="2"/>',
            { duration: 3.5 },
          ),
        ),
        a.water(75, 116, p.width + 30),
      ];
      break;
    case 'cascade':
      layers = [
        water,
        a.at(
          15 + p.spans * 3,
          113 - p.height,
          a.motion(
            'dash',
            `<path d="M10 3v${p.height - 7}m18-${p.height - 7}v${p.height - 5}m18-${p.height - 5}v${p.height - 9}" fill="none" stroke="#eff0db" stroke-width="1.6" stroke-dasharray="2 5"/>`,
            { duration: 2.4 },
          ),
        ),
        a.person(x, 115, 'sketch', p.color, 0, 0, 0.7),
      ];
      break;
    case 'canalship':
      layers = [
        water,
        a.at(
          64,
          101,
          a.motion(
            'travel',
            `<path d="M-6 8V-8l6-8 6 8V8l-6 4z" fill="#a68562"/><path d="M-4 2V-7h8v9z" fill="#d9dcc0"/><path d="M-2-5h4v3h-4z" fill="${p.color}"/>`,
            { dx: 0, dy: -25 - p.spans * 3, duration: 20 },
          ),
        ),
      ];
      break;
    case 'lock':
      layers = [
        water,
        a.boat(58, 89, 'ferry', 0, p.color, 0.7),
        a.at(
          64,
          103,
          a.motion(
            'sway',
            '<path d="M-17-5l17 7 17-7" fill="none" stroke="#c9b88b" stroke-width="2"/>',
            { angle: 5, duration: 7 },
          ),
        ),
      ];
      break;
    case 'wheel':
      layers = [
        water,
        a.at(
          64,
          59,
          a.motion(
            'spin',
            '<path d="M-24-24l48 48m-48 0 48-48" stroke="#c2cbb7" stroke-width="3"/>',
            { duration: 26 },
          ),
        ),
      ];
      break;
    case 'lift':
      layers = [
        water,
        a.at(
          64,
          82,
          a.motion(
            'travel',
            '<path d="M-17-4h34v8h-34z" fill="#b6cabb"/><path d="M-14-5h28l-4 4h-20z" fill="#a68460"/>',
            { dx: 0, dy: -33, duration: 16 },
          ),
        ),
        a.person(x, 107, 'guard', p.color, 0, 0, 0.65),
      ];
      break;
    case 'train':
      layers = [
        water,
        a.at(
          x < 64 ? 18 : 78,
          record.id === 'sydneybridge'
            ? 74
            : record.id === 'garabit'
              ? 41
              : p.shape === 'railviaduct'
                ? 31
                : 63,
          a.motion(
            'travel',
            `<path d="M0-8h18v8H0zm21 0h16v8H21z" fill="${p.color}"/><path d="M3-6h10m12 0h8" stroke="#dce4ce" stroke-width="2"/><circle cx="4" r="2" fill="#526b60"/><circle cx="15" r="2" fill="#526b60"/><circle cx="25" r="2" fill="#526b60"/><circle cx="34" r="2" fill="#526b60"/>`,
            { dx: x < 64 ? 42 : -42, duration: 16 },
          ),
        ),
      ];
      break;
    case 'gondola':
      layers = [
        water,
        a.at(
          43,
          89,
          a.motion(
            'travel',
            '<path d="M-8-65v58m18-58v58M-12-7h28v8h-28z" fill="#a1b6a1" stroke="#71887a" stroke-width="1"/>',
            { dx: 42, duration: 19 },
          ),
        ),
      ];
      break;
    case 'fountain':
      layers = [
        water,
        ...[27, 52, 77, 102].map((at) =>
          a.at(
            at,
            72,
            a.motion(
              'dash',
              '<path d="M0 0q-9 12-5 32m5-32q8 10 7 32" stroke="#dfc2d1" stroke-width="1.7" stroke-dasharray="3 2" fill="none"/>',
              { duration: 2.2 },
            ),
          ),
        ),
      ];
      break;
    case 'diver':
      layers = [
        water,
        a.at(
          x < 64 ? 30 : 85,
          81,
          a.motion(
            'travel',
            '<circle cx="8" cy="-2" r="3" fill="#c5b795"/><path d="M4-1h-15m3 0-8-5m8 5-8 5m19-6 5 5" stroke="#62888a" stroke-width="3" fill="none"/><circle cx="13" cy="-10" r="1.5" fill="none" stroke="#cbe3d8"/>',
            { dx: x < 64 ? 27 : -27, dy: -9, duration: 14 },
          ),
        ),
      ];
      break;
    case 'flag':
      layers = [
        water,
        a.flag(65, 57, p.color, 21),
        a.bird(x, 42, '#e4e6d1', 22),
      ];
      break;
    case 'seagrass':
      layers = [
        water,
        a.leaves(x < 64 ? 27 : 95, 115, '#7eab85', 0.9),
        a.at(
          128 - x,
          95,
          a.motion('travel', fish, { dx: x < 64 ? -23 : 23, duration: 13 }),
        ),
      ];
      break;
    case 'whale':
      layers = [
        water,
        a.at(
          x < 64 ? 34 : 91,
          85,
          a.motion(
            'travel',
            '<path d="M-19 0q8-13 28-4l11-5-4 9 4 7-12-3q-20 10-27-4z" fill="#799da1"/><path d="M-3 5l7 8 5-9" fill="#6b8d96"/>',
            { dx: x < 64 ? 32 : -32, duration: 20 },
          ),
        ),
      ];
      break;
    case 'turtle':
      layers = [
        water,
        a.at(
          x < 64 ? 27 : 94,
          87,
          a.motion(
            'travel',
            '<ellipse rx="8" ry="6" fill="#8eaa7c"/><path d="M7 0h6m-18-4-6-5m6 12-6 5m16-13 5-4m-5 13 5 4" stroke="#779673" stroke-width="3"/><path d="M-4-3h7v6h-7z" fill="none" stroke="#c0c49b"/>',
            { dx: x < 64 ? 30 : -30, dy: -8, duration: 19 },
          ),
        ),
      ];
      break;
    case 'fish':
      layers = [
        water,
        ...[0, 1, 2].map((i) =>
          a.at(
            18 + ((x + i * 19) % 85),
            75 + (p.height % 17) + i * 6,
            a.motion('travel', fish, {
              dx: 17 + p.spans,
              dy: i - 1,
              duration: 12 + i,
              delay: i * 1.3,
            }),
          ),
        ),
      ];
      break;
    case 'walk':
      layers = [
        water,
        a.person(x, 64, 'walk', p.color, x < 64 ? 37 : -37, 0, 0.7),
        a.water(33 + p.spans * 4, 114, 27),
      ];
      break;
    default:
      throw new Error(`Unsupported water scene: ${record.id}/${p.motif}`);
  }
  return a.scene(record.id, scene.description, scene.descriptionKo, ...layers);
});
