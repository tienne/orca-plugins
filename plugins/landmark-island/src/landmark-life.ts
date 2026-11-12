import { additionalSceneArt, additionalScenes } from './scenes';
import { landmarkEncore, landmarkSpectacle } from './landmark-spectacles';

export const animationTiers = [
  { id: 'common', name: 'I Discovery', summary: 'A quiet everyday moment' },
  {
    id: 'rare',
    name: 'II Treasure',
    summary: 'A scene with a supporting performance',
  },
  {
    id: 'epic',
    name: 'III Marvel',
    summary: 'Characters react to one another',
  },
  {
    id: 'legendary',
    name: 'IV Wonder',
    summary: 'The whole landscape tells a story',
  },
] as const;

export const landmarkScenes = [
  {
    id: 'greatwall',
    description:
      'Porters carry masonry, a mason hammers, and a wooden hoist lifts stone.',
  },
  {
    id: 'giza',
    description:
      'Workers pull a stone sledge up a ramp while a mason shapes blocks below.',
  },
  {
    id: 'eiffel',
    description:
      'A light show climbs the tower while a beacon sweeps the sky and a visitor takes a photo.',
  },
  {
    id: 'fuji',
    description:
      'Clouds drift across the mountain as cherry blossoms float on the breeze.',
  },
  {
    id: 'kinderdijk',
    description:
      'Windmill sails turn above the canal as a little family of ducks paddles past.',
  },
  {
    id: 'opera',
    description:
      'A sailboat crosses the harbour as warm stage lights and musical notes signal a performance.',
  },
  {
    id: 'merlion',
    description:
      'Water streams from the Merlion into a sparkling splash and spreading ripples.',
  },
  {
    id: 'liberty',
    description:
      'The torch flickers in the sea breeze while gulls wheel beside the crown.',
  },
  {
    id: 'taj',
    description:
      'A peacock fans its tail as fountains bloom in the reflecting pool.',
  },
  {
    id: 'colosseum',
    description:
      'Gladiators trade sword strikes and shield blocks as spectators cheer each clash.',
  },
  {
    id: 'petra',
    description:
      'Sunlight reveals the carved facade as a camel caravan crosses the canyon.',
  },
  {
    id: 'angkor',
    description:
      'Jungle vines unfold, the sanctuary glows, and lanterns rise above a procession.',
  },
  {
    id: 'machu',
    description:
      'A condor circles the sunlit terraces as the sea of clouds rolls through.',
  },
  ...additionalScenes,
] as const;

function worker(
  tunic: string,
  task: 'carry' | 'hammer' | 'pull',
  hat: boolean,
) {
  return `<g class="site-worker" fill="none" stroke="#574b39" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cy="1" rx="5" ry="1.5" fill="#354135" opacity=".2" stroke="none"/>
    <g class="worker-legs"><path class="worker-leg-left" d="M-1-4L-3 0" stroke-width="1.8"/><path class="worker-leg-right" d="M1-4L3 0" stroke-width="1.8"/></g>
    <path d="M-2-10h4l1 6h-6z" fill="${tunic}"/>
    <circle cy="-13" r="2.5" fill="#dfb38a"/>
    ${hat ? '<path d="M-4-14l4-3 4 3z" fill="#dbc18a"/>' : '<path d="M-2-15h4v2h-4z" fill="#ede0b6"/>'}
    ${task === 'carry' ? '<path d="M-2-9l-3-4m7 4 3-4" stroke="#dfb38a" stroke-width="1.4"/><path class="carried-stone" d="M-5-16h10v4H-5z" fill="#d2c3a1"/>' : task === 'hammer' ? '<path d="M-2-9l-3 4" stroke="#dfb38a" stroke-width="1.4"/><g class="worker-hammer"><path d="M1-9l5 1 2-6" stroke="#dfb38a" stroke-width="1.4"/><path d="M8-16v7" stroke="#8b6c44" stroke-width="1.4"/><path d="M5-16h6v3H5z" fill="#72776b"/></g>' : '<path class="worker-pull-arms" d="M-2-9l-5 4m9-4-5 5" stroke="#dfb38a" stroke-width="1.4"/>'}
  </g>`;
}

function dust(x: number, y: number) {
  return `<g transform="translate(${x} ${y})"><g class="site-dust" fill="#ebd7ac"><circle r="1.8"/><circle cx="4" cy="-2" r="1.1"/><circle cx="-3" cy="-1" r="1.3"/></g></g>`;
}

function gladiator(color: string, side: string) {
  return `<g class="gladiator gladiator-${side}"><g class="gladiator-presence">
    <ellipse cy="1" rx="6" ry="1.8" fill="#63543d" opacity=".25"/>
    <path d="M-1-4l-3 4m5-4 3 4" fill="none" stroke="#af865e" stroke-width="2" stroke-linecap="round"/>
    <path d="M-3-10h6l1 6h-8z" fill="${color}" stroke="#6e5840" stroke-width=".6"/>
    <path d="M-3-5h6l1 2h-8z" fill="#a08354"/>
    <circle cy="-13" r="2.6" fill="#d4ac7d"/>
    <path d="M-3-13q-1-5 3-5 4 0 3 5z" fill="#b9a06a" stroke="#78623f" stroke-width=".6"/>
    <path d="M-1-18q1-4 5-2l-1 3z" fill="${color}"/><path d="M0-14h3" stroke="#554f3e" stroke-width="1"/>
    <g class="gladiator-shield"><ellipse cx="3" cy="-5" rx="3.8" ry="5" fill="${color}" stroke="#c5ab73" stroke-width="1"/><path d="M3-9v8M0-5h6" stroke="#d7bb80" stroke-width=".6"/><circle cx="3" cy="-5" r="1.2" fill="#d3b97b"/></g>
    <g class="gladiator-sword"><path d="M2-9l4 3 2-4" fill="none" stroke="#d4ac7d" stroke-width="1.6" stroke-linecap="round"/><path d="M6-11l4 3" stroke="#bfa46d" stroke-width="1.2"/><path d="M8-11l4-8 2-1-1 3-4 7z" fill="#e4e5ce" stroke="#8d9687" stroke-width=".6"/></g>
  </g></g>`;
}

export function landmarkLife(id: string) {
  if (id === 'greatwall')
    return `<g class="landmark-life wall-worksite" data-landmark-life="greatwall" aria-hidden="true">
      <g fill="none" stroke="#9b7950" stroke-width="1.3" stroke-linecap="round"><path d="M103 101V62m18 47V68M103 70l18 6m-18 8 18 6m-18-14 18 25m-18-3 18-22"/><path d="M100 61l24 9" stroke-width="2"/></g>
      <g transform="translate(54 85)"><g class="wall-porter">${worker('#6f9393', 'carry', true)}</g></g>
      <g transform="translate(102 65)">${worker('#b87a59', 'hammer', true)}</g>
      <path d="M115 69v-17l8 2" fill="none" stroke="#8c6b45" stroke-width="1.5"/>
      <g class="wall-hoist"><path class="wall-hoist-rope" d="M117 56v33" fill="none" stroke="#dfcb9e" stroke-width=".8"/><g class="wall-hoist-load"><path d="M111 88l7-3 7 4-7 4z" fill="#d1c2a3" stroke="#6f705d" stroke-width=".7"/><path d="M111 88v5l7 4 7-4v-4l-7 4z" fill="#a69b81"/></g></g>
      <path class="wall-new-stone" d="M65 76v-6l4-4v6z" fill="#e2d2ac" stroke="#8f876d" stroke-width=".6"/>
      ${dust(111, 65)}
    </g>`;
  if (id === 'giza')
    return `<g class="landmark-life pyramid-worksite" data-landmark-life="giza" aria-hidden="true">
      <path d="M6 119L38 65l10 5-30 53z" fill="#b39b6b" stroke="#8e7d55" stroke-width=".8"/>
      <path d="M9 118L40 68m-24 51 28-47M13 113l8 4m-4-11 9 4m-4-11 8 4m-4-12 8 4m-4-11 8 4m-4-11 8 4" fill="none" stroke="#e0c494" stroke-width="1"/>
      <g class="pyramid-haul">
        <path d="M10 112l12-3 5 5-12 4z" fill="#94734e" stroke="#6e5b3f" stroke-width=".8"/>
        <path d="M11 105l10-3 5 6-11 4z" fill="#e4d1a4" stroke="#9a845d" stroke-width=".7"/><path d="M11 105v7l4 4 11-4v-4l-11 4z" fill="#c5ab7d"/>
        <path d="M22 106l5-10 7-10" fill="none" stroke="#715f40" stroke-width=".9"/>
        <g transform="translate(28 98)">${worker('#e7d9b3', 'pull', false)}</g>
        <g transform="translate(36 87)">${worker('#c59461', 'pull', false)}</g>
      </g>
      <g transform="translate(88 111)">${worker('#e9d9aa', 'hammer', false)}</g>
      <path d="M94 111l9-3 7 4-9 4zM105 117l9-3 7 4-9 4z" fill="#dfc699" stroke="#967d54" stroke-width=".8"/>
      <path d="M94 111v5l7 4 9-4v-4l-9 4z" fill="#b69a6d"/>
      <path class="pyramid-set-stone" d="M40 72l4-7 8 1-4 8z" fill="#eedcb3" stroke="#ae9469" stroke-width=".6"/>
      ${dust(99, 110)}${dust(14, 119)}
    </g>`;
  if (id === 'eiffel')
    return `<g class="landmark-life" data-landmark-life="eiffel" aria-hidden="true">
      <g class="eiffel-beacon"><path d="M64 9L18 1l1 18zM64 9l45-8 2 18z" fill="#ffe9a2" opacity=".26"/></g>
      <path d="M30 113L54 62l10-37 10 37 24 51M44 72h40" fill="none" stroke="#ffe3a0" stroke-width="1" opacity=".75"/>
      ${[
        [-30, 100],
        [-20, 80],
        [-10, 60],
        [0, 28],
        [10, 60],
        [20, 80],
        [30, 100],
      ]
        .map(
          ([x, y], i) =>
            `<circle class="eiffel-light" cx="${64 + x}" cy="${y}" r="1.7" fill="#fff2bb" style="--life-delay:-${i * 0.45}s"/>`,
        )
        .join('')}
      <g transform="translate(64 9)"><path class="eiffel-star" d="M0-5l1.5 3.5L5 0 1.5 1.5 0 5-1.5 1.5-5 0-1.5-1.5z" fill="#fff0b0"/></g>
      ${landmarkEncore(id)}
    </g>`;
  if (id === 'fuji')
    return `<g class="landmark-life" data-landmark-life="fuji" aria-hidden="true">
      <g transform="translate(5 63)"><path class="fuji-cloud" d="M0 0q2-6 8-4 3-9 11-5 5-3 8 3 8 0 9 6z" fill="#f6f2e4" opacity=".8"/></g>
      <g transform="translate(69 82)"><path class="fuji-cloud cloud-lower" d="M0 0q3-7 10-4 4-8 12-3 9-2 12 7z" fill="#e8eeDF" opacity=".7"/></g>
      <path d="M12 118V98m0 10-7-7m7 2 7-8" fill="none" stroke="#78614c" stroke-width="1.5"/>
      <g fill="#dca5a2"><circle cx="5" cy="98" r="5"/><circle cx="13" cy="94" r="6"/><circle cx="20" cy="97" r="5"/><circle cx="12" cy="101" r="5"/></g>
      ${[
        [8, 93],
        [17, 96],
        [23, 102],
        [5, 100],
      ]
        .map(
          ([x, y], i) =>
            `<g transform="translate(${x} ${y})"><path class="fuji-petal" style="--life-delay:-${i * 1.3}s" d="M0 0q5-4 4 1Q1 5 0 0" fill="#efb9b5"/></g>`,
        )
        .join('')}
    </g>`;
  if (id === 'kinderdijk')
    return `<g class="landmark-life" data-landmark-life="kinderdijk" aria-hidden="true">
      <g class="mill-ducks">${[0, 9, 16].map((x, i) => `<g transform="translate(${12 + x} ${118 + (i % 2)}) scale(${i === 0 ? 1 : 0.7})"><path d="M-5 3q4 2 10 0" fill="none" stroke="#d4e5d5" stroke-width=".7"/><ellipse rx="3.2" ry="1.6" fill="#e2cf8d"/><circle cx="2" cy="-2" r="1.5" fill="#e7d9a2"/><path d="M3-2h2" stroke="#bb8751" stroke-width="1"/></g>`).join('')}</g>
    </g>`;
  if (id === 'opera')
    return `<g class="landmark-life" data-landmark-life="opera" aria-hidden="true">
      <path d="M1 121q32-5 63 0t63 0v6H1z" fill="#699f9f" opacity=".65"/>
      <g transform="translate(9 121)"><g class="opera-sailboat"><path d="M-9 1h19l-4 4H-5z" fill="#8f6b4f"/><path d="M0-17V1" stroke="#77654c" stroke-width=".9"/><path d="M-1-16L-8-1h7z" fill="#f2e7c8"/><path d="M1-13L7-1H1z" fill="#c88b70"/><path d="M-12 6h8m7 0h10" stroke="#d8e6d5" stroke-width=".8"/></g></g>
      <path class="opera-water" d="M30 124h14m12 0h19m16 0h13" fill="none" stroke="#d7e7db" stroke-width="1"/>
      ${landmarkEncore(id)}
    </g>`;
  if (id === 'merlion')
    return `<g class="landmark-life" data-landmark-life="merlion" aria-hidden="true">
      <path class="merlion-stream" d="M86 39q30 4 32 62" fill="none" stroke="#f0fff1" stroke-width="2.2" stroke-dasharray="2 5"/>
      <g transform="translate(116 103)"><g class="merlion-splash"><path d="M-7 1l-3-7m8 5 1-10m4 11 5-7" fill="none" stroke="#d1f0e7" stroke-width="1.4" stroke-linecap="round"/><circle cx="-8" cy="-8" r="1.2" fill="#e7f6e4"/><circle cx="7" cy="-8" r="1" fill="#e7f6e4"/></g></g>
      <g transform="translate(114 108)"><ellipse class="merlion-ripple" rx="10" ry="2.7" fill="none" stroke="#d2e9dc" stroke-width="1"/></g>
    </g>`;
  if (id === 'liberty')
    return `<g class="landmark-life" data-landmark-life="liberty" aria-hidden="true">
      <ellipse class="liberty-glow" cx="36" cy="9" rx="10" ry="12" fill="#e8c77d" opacity=".2"/>
      <g class="liberty-flame"><path d="M32 14Q28 9 35 3l1-3q9 8 3 14z" fill="#ddb363"/><path d="M35 14q-3-4 2-9 5 7 0 9z" fill="#fff0b1"/></g>
      <g transform="translate(93 29)"><g class="liberty-gulls"><path class="gull-wings" d="M-8 0q4-5 8 0 4-5 8 0M2-11q3-4 6 0 3-4 6 0" fill="none" stroke="#eef0db" stroke-width="1.2" stroke-linecap="round"/></g></g>
    </g>`;
  if (id === 'taj')
    return `<g class="landmark-life" data-landmark-life="taj" aria-hidden="true">
      <path d="M44 119h40l8 8H36z" fill="#719d9b" opacity=".85"/>
      <g transform="translate(64 123)"><ellipse class="taj-pool" rx="17" ry="2.2" fill="none" stroke="#c7ded2" stroke-width=".9"/></g>
      <g transform="translate(19 116)"><g class="taj-peacock-tail"><path d="M0 0Q-16-12-8-21 8-25 12-9z" fill="#568f7d" stroke="#3e7266" stroke-width=".7"/>
      ${[
        [-8, -12],
        [-6, -18],
        [0, -19],
        [6, -15],
        [7, -9],
      ]
        .map(
          ([x, y]) =>
            `<ellipse cx="${x}" cy="${y}" rx="2" ry="2.7" fill="#c5bb74"/><circle cx="${x}" cy="${y}" r="1" fill="#426b83"/>`,
        )
        .join('')}</g>
      <ellipse cy="-1" rx="3" ry="4" fill="#4f8192"/><path d="M1-3q5-7 2-10m0-1-2-2m2 2 2-2M-1 2v4m3-4v4" fill="none" stroke="#487583" stroke-width="1.1"/><circle cx="3" cy="-13" r="1.7" fill="#4f8192"/><path d="M4-13h2" stroke="#cfb98a" stroke-width=".8"/></g>
      ${landmarkEncore(id)}
    </g>`;
  if (id === 'colosseum')
    return `<g class="landmark-life arena-duel" data-landmark-life="colosseum" aria-hidden="true">
      <ellipse cx="64" cy="53" rx="32" ry="10" fill="#bba276" stroke="#cebc94" stroke-width=".7"/>
      <path d="M39 54q25-9 50 0M45 59q18-5 38 0" fill="none" stroke="#d8c49b" stroke-width=".6" opacity=".6"/>
      <g transform="translate(50 57)">${gladiator('#b7775d', 'left')}</g>
      <g transform="translate(78 57) scale(-1 1)">${gladiator('#648d8d', 'right')}</g>
      <g transform="translate(64 50)"><g class="arena-clash" stroke="#fff0b4" stroke-width="1.2" stroke-linecap="round"><path d="M-4 0h8M0-4v8M-3-3l6 6m-6 0 6-6"/><circle r="1.4" fill="#fff2c5" stroke="none"/></g></g>
      <g transform="translate(53 59)"><g class="arena-dust" fill="#e0cca2"><circle r="1.3"/><circle cx="4" cy="-1" r=".8"/></g></g>
      ${landmarkEncore(id)}
    </g>`;
  return landmarkSpectacle(id) || additionalSceneArt(id);
}
