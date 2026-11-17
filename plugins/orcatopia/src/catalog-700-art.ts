import catalog from './catalog-700.json';

const profiles = new Map(
  catalog.map((entry) => [entry.record.id, entry.visual]),
);
const repeat = (n: number, draw: (i: number) => string) =>
  Array.from({ length: n }, (_, i) => draw(i)).join('');

/** 수상 100종의 구조 비례와 수중 지형을 장소별 프로필로 그린다. */
export function catalog700Art(id: string, paint: (name: string) => string) {
  const p = profiles.get(id);
  if (!p) return '';
  const { shape, height: h, width: w, spans: n, color } = p;
  const path = (d: string, fill = paint('stone')) =>
    `<path d="${d}" fill="${fill}" stroke="#536c69" stroke-width=".8" stroke-linejoin="round"/>`;
  const line = (d: string, stroke = '#e7e5c8', width = 1.3) =>
    `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const box = (
    x: number,
    y: number,
    width: number,
    height: number,
    fill?: string,
  ) => path(`M${x} ${y}h${width}v${height}h-${width}z`, fill);
  const water = `<ellipse cx="64" cy="109" rx="61" ry="16" fill="#5b9fa8"/>${line('M7 111h22m10 9h28m24-10h30', '#c8e5d6')}`;
  let body = '';
  if (
    ['lighthouse', 'stripedlight', 'pilelight', 'caissonlight'].includes(shape)
  ) {
    const top = 109 - h,
      left = 64 - w / 2;
    if (shape === 'pilelight') {
      body =
        line(
          'M44 103l6-39m34 39-6-39m-31 23h34m-31-17 29 29m-29 0 29-29',
          '#53645e',
          3,
        ) +
        box(44, 45, 40, 26, '#d8d3b0') +
        path('M39 45l25-17 25 17z', '#8b6f55') +
        box(59, 17, 10, 13, '#f5e0a6') +
        line('M45 56h37M51 48v13m25-13v13', '#53645e', 2);
    } else if (shape === 'caissonlight') {
      body =
        box(45, 84, 38, 24, '#d7d8b9') +
        box(53, top, 22, 109 - top, '#ebe6cb') +
        box(50, top + 14, 28, 11, '#b87562') +
        box(43, top - 4, 42, 4, '#d6d4b7') +
        line(`M44 ${top - 6}h40m-38-3v5m36-5v5`, '#72877c');
    } else {
      const rock = p.terrainHeight;
      body =
        path(
          `M15 112l12-${rock} 17 4 15-${rock / 2} 18 8 22-6 16 ${rock + 2}z`,
          paint('mountain'),
        ) +
        path(
          `M${left - 4} 109Q${left + 2} ${top + 35} ${left + 3} ${top}h${w - 6}Q${left + w - 2} ${top + 35} ${left + w + 4} 109z`,
          id === 'fastnet' || id === 'skerryvore' ? paint('stone') : '#dddcc5',
        );
      if (shape === 'stripedlight')
        body += repeat(Math.max(1, n), (i) =>
          box(
            left + 1,
            top + 22 + i * 19,
            w - 2,
            8,
            id === 'dubhartach' || id === 'needleslight'
              ? '#b97061'
              : '#556c68',
          ),
        );
      body += repeat(3, (i) => box(62, top + 26 + i * 18, 3.5, 6, '#49666a'));
      if (id === 'eddystone') body += box(93, 89, 13, 22, paint('stone'));
      if (id === 'needleslight')
        body += repeat(3, (i) =>
          path(
            `M${7 + i * 13} 108l9-${30 - i * 6} 9 ${30 - i * 6}z`,
            '#e9e3cb',
          ),
        );
      if (
        [
          'oryukdolight',
          'somaemuldolight',
          'brotherslight',
          'gageodolight',
        ].includes(id)
      )
        body +=
          box(75, 91, 25, 13, '#d9dfc3') +
          path('M72 91l16-10 15 10z', '#9e7961');
    }
    body +=
      box(64 - w / 2 + 1, top - 9, w - 2, 10, '#f0dda3') +
      path(
        `M${64 - w / 2 - 3} ${top - 9}l${w / 2 + 3}-8 ${w / 2 + 3} 8z`,
        '#657b72',
      ) +
      line(`M${64 - w / 2 - 4} ${top + 2}h${w + 8}`, '#556f69', 2);
    if (id === 'bishoprock' || id === 'wolfrock')
      body +=
        box(46, top - 20, 36, 3, '#6f8177') +
        line(`M51 ${top - 20}v8m26-8v8`, '#6f8177');
  } else if (shape.includes('falls') || shape === 'rapids') {
    const tiers = ['tieredfalls', 'splitfalls', 'rapids'].includes(shape)
      ? n
      : 1;
    body = path(
      `M5 108V${109 - h}l18-9 26 5 22-6 29 8 22-4V110z`,
      paint('mountain'),
    );
    body += repeat(tiers, (i) => {
      const x = 12 + i * (w / Math.max(tiers, 1)),
        width = w / Math.max(tiers, 1) - 5;
      const y = 111 - h + i * (h / (tiers + 2));
      return (
        path(
          `M${x} ${y}q${width / 2}-5 ${width} 0l-2 ${111 - y}q-${width / 2} 7-${width - 4} 0z`,
          '#b1d7d2',
        ) +
        line(
          `M${x + width / 3} ${y + 3}v${105 - y}m${width / 3}-${104 - y}v${104 - y}`,
          '#eff0d8',
          2,
        )
      );
    });
    if (shape === 'horseshoefalls')
      body += path('M13 51q49 31 101 0l-4 14q-44 29-94 0z', '#e0e8d2');
    if (shape === 'gorgefalls')
      body += path(
        'M7 35l44 15-8 61H6zM121 29L76 50l8 61h38z',
        paint('mountain'),
      );
    body += repeat(
      4,
      (i) =>
        `<ellipse cx="${20 + i * 28}" cy="111" rx="14" ry="4" fill="#dfebe0" opacity=".8"/>`,
    );
  } else if (
    [
      'lock',
      'stairlock',
      'shipcanal',
      'cutcanal',
      'boatlift',
      'rotatinglift',
    ].includes(shape)
  ) {
    body = path(
      'M9 110l18-68h30l-9 68zM82 110L70 42h30l21 68z',
      shape === 'cutcanal' ? paint('sandstone') : paint('stone'),
    );
    if (shape === 'lock' || shape === 'stairlock') {
      body += repeat(shape === 'stairlock' ? 5 : n, (i) => {
        const y = 55 + i * (48 / (shape === 'stairlock' ? 5 : n));
        return line(`M43 ${y}l21 8 21-8M64 ${y + 8}v8`, '#6e7762', 4);
      });
    } else if (shape === 'boatlift') {
      body +=
        box(28, 30, 8, 77, paint('iron')) +
        box(92, 30, 8, 77, paint('iron')) +
        line('M30 32h68M32 38l63 57m0-57L32 95', '#69877f', 3) +
        box(36, 71, 54, 13, '#8cafa4') +
        line('M39 74h47', '#cee9dd', 3);
    } else if (shape === 'rotatinglift') {
      body +=
        path('M52 108l5-55h14l6 55z', paint('stone')) +
        `<circle cx="64" cy="59" r="31" fill="none" stroke="#829990" stroke-width="9"/>` +
        box(24, 25, 32, 12, '#9ebdb4') +
        box(73, 83, 32, 12, '#9ebdb4') +
        line('M41 34l47 50M63 59h3', '#657e76', 6);
    } else if (shape === 'cutcanal')
      body += line('M14 62l30 8m40 0 30-8M10 82l32 8m43 0 32-8', '#b9a682', 2);
    else
      body += repeat(3, (i) =>
        line(`M${15 + i * 4} ${60 + i * 20}l21 4m52-4 22 3`, '#92ac83', 2),
      );
  } else if (
    [
      'steelarch',
      'bascule',
      'stonebridge',
      'chainbridge',
      'shopbridge',
      'lowarch',
      'cablestayed',
      'railviaduct',
      'coveredbridge',
      'waterbridge',
      'trussbridge',
      'transporter',
      'romanbridge',
      'suspension',
      'tiltingbridge',
      'cantilever',
      'coveredpagoda',
      'openarch',
      'chainfootbridge',
      'fivearch',
      'fountainbridge',
      'concretearch',
    ].includes(shape)
  ) {
    const deck =
      id === 'newriverbridge'
        ? 35
        : id === 'garabit'
          ? 45
          : id === 'sydneybridge'
            ? 78
            : shape === 'railviaduct'
              ? 35
              : shape === 'lowarch'
                ? 80
                : 67;
    body = box(
      7,
      deck,
      114,
      shape === 'waterbridge' ? 11 : 5,
      shape === 'steelarch' || shape === 'cantilever' ? color : paint('stone'),
    );
    if (
      [
        'stonebridge',
        'romanbridge',
        'railviaduct',
        'concretearch',
        'shopbridge',
        'coveredbridge',
        'coveredpagoda',
        'fivearch',
        'openarch',
      ].includes(shape)
    ) {
      const spans = Math.max(1, n),
        span = 110 / spans;
      body += repeat(spans, (i) => {
        const x = 9 + i * span;
        return line(
          `M${x} 106V${deck + 19}q${span / 2}-${shape === 'fivearch' ? 33 : 24} ${span} 0V106`,
          shape === 'fivearch' ? '#a88b66' : '#b4b39c',
          shape === 'openarch' ? 6 : 5,
        );
      });
      if (shape === 'shopbridge')
        body += repeat(6, (i) =>
          box(
            12 + i * 17,
            deck - 20 - (i % 2) * 4,
            16,
            20 + (i % 2) * 4,
            ['#ccbc8f', '#bda17b', '#c9a385'][i % 3],
          ),
        );
      if (shape === 'coveredbridge' || shape === 'coveredpagoda') {
        body += repeat(shape === 'coveredpagoda' ? 5 : 6, (i) => {
          const x = 10 + i * 20,
            roofY = shape === 'coveredpagoda' ? 30 + (i % 2) * 7 : deck - 18;
          return (
            box(x + 5, roofY, 3, deck - roofY, '#a08561') +
            path(`M${x} ${roofY}l11-10 12 10z`, '#8f7e62')
          );
        });
        if (shape === 'coveredbridge')
          body +=
            path('M89 102V52l10-10 10 10v50z', paint('stone')) +
            path('M85 53l14-21 14 21z', '#9b7860');
      }
      if (shape === 'romanbridge')
        body += box(58, deck - 28, 12, 28) + path(`M56 ${deck - 28}l8-7 8 7z`);
      if (shape === 'openarch')
        body += line('M13 83q9-20 18-4m66 0q9-20 18 4', '#5b8b88', 5);
      if (shape === 'railviaduct')
        body += path('M105 34l4-30 15 4v40z', paint('mountain'));
    } else if (shape === 'waterbridge') {
      body +=
        box(9, deck + 1, 110, 4, '#8bb6ad') +
        repeat(3, (i) => box(17 + i * 44, deck + 11, 7, 34, paint('stone'))) +
        line(`M7 ${deck - 3}h114M7 ${deck + 12}h114`, '#bdc8b3', 2);
      if (id === 'briareaqueduct')
        body += repeat(
          8,
          (i) =>
            line(`M${14 + i * 14} ${deck}v-13`, '#9b9d7a', 1.5) +
            `<circle cx="${14 + i * 14}" cy="${deck - 14}" r="2" fill="#d9c697"/>`,
        );
    } else if (shape === 'trussbridge') {
      body += repeat(3, (i) => {
        const x = 9 + i * 37;
        return (
          (id === 'hohenzollernbridge'
            ? line(`M${x} ${deck}q18-32 37 0`, color, 3) +
              repeat(5, (j) =>
                line(
                  `M${x + 5 + j * 6} ${deck - 16 * Math.sin(((j + 1) / 6) * Math.PI)}V${deck}`,
                  '#7e9b8c',
                ),
              )
            : line(
                `M${x} ${deck - 23}h37v23h-37zM${x} ${deck}l12-23 12 23 13-23`,
                '#6d8a7c',
                2,
              )) + box(x, deck + 5, 4, 36, paint('stone'))
        );
      });
    } else if (shape === 'cantilever') {
      body +=
        line(
          `M8 ${deck}l23-39 19 24 28 0 21-24 21 39M31 ${deck - 39}v39m68-39v39M8 ${deck}h112`,
          color,
          3,
        ) +
        repeat(8, (i) =>
          line(`M${15 + i * 14} ${deck}l7-18 7 18`, '#8da499', 1.2),
        );
    } else if (['steelarch', 'lowarch', 'tiltingbridge'].includes(shape)) {
      const peak = ['garabit', 'newriverbridge'].includes(id)
        ? deck + 14
        : shape === 'lowarch'
          ? deck + 10
          : 109 - h;
      body += line(
        `M9 101Q64 ${2 * peak - 101} 119 101`,
        color,
        shape === 'lowarch' ? 5 : 4,
      );
      body += repeat(9, (i) => {
        const x = 14 + i * 12,
          y = 101 - (101 - peak) * (1 - ((x - 64) / 55) ** 2);
        return line(`M${x} ${y}V${deck}`, '#6d8a81', 1.5);
      });
      if (id === 'sydneybridge')
        body += repeat(2, (i) => box(9 + i * 97, 49, 12, 58, paint('stone')));
    } else {
      const towerY = shape === 'transporter' ? 17 : 109 - h;
      body += repeat(2, (i) =>
        box(
          shape === 'bascule' ? 18 + i * 77 : 22 + i * 76,
          towerY,
          shape === 'bascule' ? 14 : 7,
          109 - towerY,
          shape === 'bascule' ? paint('stone') : '#80988c',
        ),
      );
      body += line(
        `M11 ${towerY + 7}Q64 ${deck + 26} 117 ${towerY + 7}`,
        '#647f76',
        2.3,
      );
      body += repeat(10, (i) => {
        const top = towerY + 11 + 20 * Math.sin((i / 9) * Math.PI);
        return Math.abs(top - deck) < 0.01
          ? ''
          : line(`M${12 + i * 11} ${top}V${deck}`, '#90a79a', 1);
      });
      if (shape === 'bascule')
        body +=
          repeat(2, (i) =>
            path(`M${17 + i * 76} ${towerY}l9-14 10 14z`, '#709087'),
          ) + line(`M24 ${towerY + 16}h78`, '#718d81', 4);
      if (shape === 'transporter')
        body +=
          line('M26 18h78', '#66857b', 4) +
          line('M60 19v60m17-60v60', '#66857b') +
          box(55, 79, 26, 9, '#bcae83');
      if (shape === 'cablestayed')
        body += repeat(7, (i) =>
          line(`M${11 + i * 16} 19v83m0-74-8 40m8-40 8 40`, '#bec5b4', 1.4),
        );
    }
  } else if (shape === 'wreck') {
    body =
      path(`M10 105l12-${h / 2} 78 7 17 15-23 10-64 2z`, '#7f8d7e') +
      box(41, 89 - h / 3, 38, h / 3, '#97a18b') +
      line('M27 98h61m-53 5h65', '#bbbd9e', 2);
    if (id === 'monitorwreck')
      body += `<ellipse cx="66" cy="78" rx="15" ry="7" fill="#788c80"/>${box(51, 78, 30, 14, '#788c80')}${line('M56 81l-12-5m31 5 13-4', '#536960', 3)}`;
    else
      body += line('M32 89V64h31m19 30V72h24M47 78v-8m46 8v-5', '#7a8e7e', 3);
  } else if (shape === 'seafort') {
    body =
      path('M10 89l29-30 61 5 20 29-31 18-58-3z', '#b38365') +
      path('M23 85l23-16 46 3 15 17-23 12-43-2z', '#849b77') +
      line('M11 89l21 19 57 3 31-18M39 59l-7 49m68-44-11 47', '#e0b897', 2) +
      repeat(8, (i) => box(30 + i * 9, 91 + Math.sin(i) * 4, 3, 5, '#655f50'));
  } else if (
    ['seastack', 'volcanicisland', 'graniteisland', 'karstlagoon'].includes(
      shape,
    )
  ) {
    body = repeat(Math.max(2, n), (i) => {
      const x = 7 + i * (100 / Math.max(2, n)),
        peak = h * (i % 2 ? 0.75 : 1),
        width = w / Math.max(2, n);
      return (
        path(
          `M${x} 111l${width * 0.15}-${peak * 0.7} ${width * 0.4}-${peak * 0.3} ${width * 0.35} ${peak * 0.55} ${width * 0.1} ${peak * 0.45}z`,
          shape === 'karstlagoon'
            ? '#779679'
            : shape === 'volcanicisland'
              ? '#697c76'
              : paint('mountain'),
        ) +
        line(
          `M${x + width * 0.4} ${111 - peak}l${width * 0.1} ${peak * 0.8}`,
          '#b0b99d',
        )
      );
    });
    if (shape === 'graniteisland')
      body += `<ellipse cx="88" cy="75" rx="17" ry="12" fill="#bcb9a0" stroke="#6f8173"/>`;
  } else if (
    [
      'reef',
      'reefwalls',
      'atoll',
      'seagrass',
      'mangrovereef',
      'mushroomreef',
      'sandbar',
      'sandbank',
    ].includes(shape)
  ) {
    body = `<ellipse cx="64" cy="104" rx="${w / 2}" ry="18" fill="#8dc4b8"/>`;
    if (shape === 'atoll' || id === 'newcaledonialagoons' || id === 'aporeef')
      body += `<ellipse cx="64" cy="99" rx="${w / 2 - 6}" ry="15" fill="none" stroke="#dad5a6" stroke-width="7"/>`;
    if (shape === 'reefwalls')
      body += path(`M9 91l27-${h / 2} 42 6 39 20-21 20-70-1z`, '#779f94');
    if (shape === 'sandbar' || shape === 'sandbank')
      body += path(
        `M7 106q${w / 3}-${h} ${w * 0.6}-8t${w * 0.3} 8l-18 8-56-4z`,
        '#d9d0a3',
      );
    else
      body += repeat(Math.max(3, n), (i) => {
        const x = 15 + i * (97 / Math.max(3, n)),
          y = 111 - (i % 3) * 5;
        if (shape === 'seagrass' || shape === 'mangrovereef')
          return (
            line(
              `M${x} ${y}q-8-${h / 2} 0-${h}m0 ${h}q9-${h / 3} 10-${h * 0.8}`,
              '#6d9b78',
              2.7,
            ) +
            (shape === 'mangrovereef'
              ? `<ellipse cx="${x + 1}" cy="${y - h}" rx="11" ry="9" fill="#73977a"/>`
              : '')
          );
        if (shape === 'mushroomreef')
          return (
            box(x - 3, y - h / 2, 6, h / 2, '#839b80') +
            `<ellipse cx="${x}" cy="${y - h / 2}" rx="10" ry="6" fill="${color}"/>`
          );
        return line(
          `M${x} ${y}v-${h / 2}m0 ${h / 4}l-7-8m7 1 8-10`,
          i % 2 ? '#d8b58f' : color,
          3.4,
        );
      });
  } else throw new Error(`Unsupported water illustration: ${id}/${shape}`);
  if (id === 'charlesbridge') {
    body +=
      repeat(
        2,
        (i) =>
          box(7 + i * 102, 29, 12, 45) +
          path(`M${5 + i * 102} 30l8-15 8 15z`, '#7d8770'),
      ) +
      repeat(
        6,
        (i) =>
          `<circle cx="${28 + i * 13}" cy="58" r="1.4" fill="#7b8068"/>${line(`M${28 + i * 13} 59v7`, '#7b8068', 2)}`,
      );
  } else if (id === 'regensburgbridge') {
    body +=
      box(10, 27, 16, 47, '#cbc4a3') +
      path('M7 28l11-11 11 11z', '#aa8068') +
      box(16, 41, 4, 9, '#65857b');
  } else if (id === 'alexandrebridge') {
    body += repeat(
      4,
      (i) =>
        box([10, 24, 99, 113][i], 57, 4, 24, '#c8be9b') +
        `<path d="M${[10, 24, 99, 113][i] - 2} 55l4-6 4 6-4 3z" fill="#d8bb78"/>`,
    );
  } else if (id === 'pulteneybridge') {
    body +=
      path('M36 47l28-12 28 12z', '#c5b690') +
      box(58, 44, 12, 20, '#d4c8a4') +
      line('M11 106q53 27 108 0m-102 4q48 24 96 0', '#dce6d4', 3);
  } else if (id === 'panamacanal') {
    body +=
      line('M32 46v62m63-62v62', '#d3dac4', 3) +
      box(35, 78, 55, 7, '#adbdab') +
      line('M45 82h33m-27-5h21', '#688c82', 2);
  } else if (id === 'gotacanal') {
    body +=
      box(6, 69, 17, 16, '#b98a71') +
      path('M3 70l12-10 11 10z', '#7f8e73') +
      line('M103 111l-7-63m3 28 8-18m-9 3-8-14', '#7c9b72', 3);
  } else if (id === 'suezcanal') {
    body +=
      path('M5 108l20-68 12 5-12 63zM93 110L80 43l20-2 22 69z', '#d4be91') +
      line('M13 93l17-7m67-24 12 4', '#bba379', 2);
  } else if (id === 'kielcanal') {
    body +=
      line('M14 104l14-58m74 58-12-57', '#8ca581', 5) +
      line('M35 49h51m-43-6v7m35-7v7', '#758b7d', 3) +
      box(6, 80, 14, 13, '#b8b99b');
  } else if (id === 'canalcentre') {
    body += repeat(
      4,
      (i) =>
        box(8 + i * 28, 91 - i * 7, 17, 6, '#c3cdbb') +
        line(`M${12 + i * 28} ${97 - i * 7}v14m9-14v14`, '#76978a', 3),
    );
  } else if (id === 'andertonlift') {
    body +=
      line('M34 104v-61m58 61V43', '#4e7068', 4) +
      box(39, 47, 20, 10, '#bdcdb9') +
      line('M49 57v15m36 13v21', '#68877c', 3);
  }
  return `<g class="expanded-landmark" data-water-place="${id}" data-water-shape="${shape}">${water}${body}</g>`;
}
