import expansion from './landmark-expansion.json';
const entries = new Map(expansion.map((entry) => [entry.id, entry]));

/** 새 도감의 장소별 윤곽을 기존 그림의 재질과 독립된 SVG 도형으로 그린다. */
export function expandedLandmarkArt(
  id: string,
  paint: (name: string) => string,
) {
  const entry = entries.get(id);
  if (!entry) return '';
  const { shape, seed, color } = entry;
  const n = seed % 7,
    width = 76 + (seed % 13),
    top = 35 + (seed % 11);
  const path = (d: string, material = 'stone', texture = true) =>
    `<path d="${d}" fill="${paint(material)}" stroke="#666653" stroke-width=".7" stroke-linejoin="round"/>${texture ? `<path d="${d}" fill="${paint(material === 'stone' ? 'masonry' : 'grain')}"/>` : ''}`;
  const line = (d: string, stroke = '#eaddbc', w = 0.8) =>
    `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const rect = (
    x: number,
    y: number,
    w: number,
    h: number,
    material = 'stone',
  ) => path(`M${x} ${y}h${w}v${h}h-${w}z`, material);
  const arch = (x: number, y: number, w: number, h: number) =>
    `<path d="M${x} ${y + h}v-${h - w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0v${h - w / 2}z" fill="#476250" opacity=".8"/>`;
  const repeat = (count: number, fn: (i: number) => string) =>
    Array.from({ length: count }, (_, i) => fn(i)).join('');
  const arcade = (x: number, y: number, count: number, w = 9, h = 16) =>
    repeat(count, (i) => arch(x + i * (w + 3), y, w, h));
  const roof = (x: number, y: number, w: number, h = 15, material = 'copper') =>
    path(
      `M${x - 4} ${y}l${w / 2 + 4}-${h} ${w / 2 + 4} ${h}z`,
      material,
      false,
    );
  const hall = (
    x: number,
    y: number,
    w: number,
    h: number,
    material = 'stone',
  ) =>
    rect(x, y, w, h, material) +
    roof(x, y, w, 12) +
    arcade(x + 4, y + 7, Math.max(1, Math.floor((w - 5) / 12)), 7, 11);
  const tower = (
    x: number,
    y: number,
    w: number,
    h: number,
    material = 'stone',
  ) =>
    rect(x, y, w, h, material) +
    roof(x, y, w, w) +
    arch(x + w * 0.3, y + 8, w * 0.4, 10);
  const water = `<path d="M4 104Q30 95 64 104t60 0v17H4z" fill="#8cb9b4"/>${line('M9 111h21m16 5h19m19-5h30', '#d8e9d5')}`;
  const rock = (
    x: number,
    y: number,
    w: number,
    h: number,
    material = 'mountain',
  ) =>
    path(
      `M${x} ${y + h}l${w * 0.18}-${h * 0.7} ${w * 0.4}-${h * 0.3} ${w * 0.34} ${h * 0.45} ${w * 0.08} ${h * 0.55}z`,
      material,
    );
  const tree = (x: number, y: number, h = 24) =>
    line(`M${x} ${y}v-${h * 0.6}`, '#826f4b', 2) +
    `<path d="M${x - h * 0.28} ${y - 7}l${h * 0.28}-${h} ${h * 0.28} ${h}z" fill="#61815b"/>`;
  let body = '';
  if (id === 'greatbarrierreef') {
    body =
      `<ellipse cx="64" cy="106" rx="59" ry="17" fill="#76bdc5"/><path d="M12 103q13-20 29-6t31-3 43 12l-13 9-80 2z" fill="#75a491"/>` +
      repeat(8, (i) =>
        line(
          `M${18 + i * 13} ${112 - (i % 2) * 7}v-${13 + (i % 3) * 6}m0 8-6-7m6 4 6-9`,
          ['#dfae98', '#c795a5', '#f2cf96'][i % 3],
          3,
        ),
      ) +
      `<path d="M45 98l8-5 8 5-8 4zM83 110l7-4 7 4-7 4z" fill="#f1d586"/>`;
  } else if (id === 'bluehole') {
    body = `<ellipse cx="64" cy="99" rx="59" ry="23" fill="#7ebfb7"/><ellipse cx="64" cy="98" rx="48" ry="18" fill="#baD4b7"/><ellipse cx="64" cy="97" rx="34" ry="15" fill="#367784"/><ellipse cx="64" cy="97" rx="24" ry="10" fill="#284e68"/><path d="M19 91q-5 9 8 14m74-14q8 8-1 12" stroke="#e7ead1" stroke-width="3" fill="none"/><path d="M92 83l12-2-4 6z" fill="#eee3bd"/>`;
  } else if (id === 'rockislands') {
    body =
      `<ellipse cx="64" cy="106" rx="59" ry="16" fill="#76c2b5"/>` +
      repeat(4, (i) => {
        const x = 9 + i * 29,
          y = 83 + (i % 2) * 15;
        return (
          path(`M${x + 4} ${y}l3-18 13-6 9 14-5 15z`, 'mountain') +
          `<ellipse cx="${x + 15}" cy="${y - 13}" rx="17" ry="13" fill="${i % 2 ? '#639961' : '#7ca468'}"/><path d="M${x + 1} ${y + 8}h25" stroke="#d4eee0" fill="none"/>`
        );
      });
  } else if (id === 'geirangerfjord') {
    body =
      `<path d="M3 111l41-29 31 2 50 29-59 11z" fill="#80b7c0"/>` +
      rock(3, 20, 44, 93) +
      rock(84, 9, 40, 105) +
      line('M28 35l4 27-4 21 8 25M105 24l-6 33 6 22-11 26', '#d5e9dc', 3) +
      `<path d="M46 111l24-3-5 8H52z" fill="#e7d7b5"/>`;
  } else if (id === 'liriver') {
    body =
      `<path d="M5 108Q36 88 62 102t61 4v16H5z" fill="#79b5ad"/>` +
      rock(9, 34, 30, 74, 'grass') +
      rock(41, 13, 35, 94, 'grass') +
      rock(83, 43, 33, 63, 'grass') +
      line('M12 115l37-5m22 6 34-4', '#d2e8cf', 1.4) +
      `<path d="M40 117l17-5 16 4-18 5z" fill="#c8b48a"/>`;
  } else if (id === 'middlerhine') {
    body =
      path('M5 106l32-48 56 10 30 40-57 14z', 'grass') +
      `<path d="M5 109q29-18 52-8t66 8v13H5z" fill="#7baeb3"/>` +
      hall(42, 58, 38, 38) +
      tower(32, 33, 17, 61) +
      tower(77, 39, 16, 58) +
      line('M10 93l23-15m-18 25 22-16m57-5 16 13', '#b8bf86', 2);
  } else if (['cathedral', 'basilica', 'woodchurch'].includes(shape)) {
    const material =
      shape === 'woodchurch' ? 'iron' : id === 'albi' ? 'sandstone' : 'stone';
    const count =
      id === 'tournai' ? 5 : id === 'speyer' ? 4 : id === 'albi' ? 1 : 2;
    body =
      hall(30, top + 20, 68, 62 - top / 2, material) +
      path(`M48 ${top + 15}l16-22 16 22v68H48z`, material) +
      arcade(49, 91, 2, 12, 23);
    body += repeat(count, (i) => {
      const x = count === 2 ? 19 + i * 71 : 12 + i * 22;
      const y =
        id === 'chartres' ? (i === 0 ? 30 : 16) : 18 + (i % 2) * 8 + n * 0.3;
      return tower(x, y, count === 2 ? 20 : 14, 110 - y, material);
    });
    body += `<circle cx="64" cy="${top + 25}" r="9" fill="#71969b" stroke="#e3d3ad" stroke-width="2"/>${line(`M64 ${top + 16}v18m-9-9h18M58 ${top + 19}l12 12m0-12-12 12`, '#d7d2a7', 0.7)}`;
  } else if (['castle', 'fortress'].includes(shape)) {
    const stone = ['agrafort', 'redfort', 'avila'].includes(id)
      ? 'sandstone'
      : 'stone';
    body = rect(12, 75, 104, 38, stone) + arcade(49, 88, 2, 11, 24);
    const count = shape === 'castle' ? 4 : 3;
    body += repeat(count, (i) => {
      const x = 10 + i * (88 / (count - 1)),
        y = shape === 'castle' ? 30 + (i % 2) * 18 + n : 52 + (i % 2) * 10;
      const base = rect(x, y, 18, 113 - y, stone) + arch(x + 6, y + 12, 6, 12);
      return (
        base +
        (shape === 'castle'
          ? roof(x, y, 18, 22, 'slate')
          : repeat(4, (j) => rect(x + j * 5 - 1, y - 5, 3, 7, stone)))
      );
    });
    if (id === 'neuschwanstein')
      body += tower(58, 12, 18, 98, 'marble') + tower(82, 24, 14, 87, 'marble');
    body += line('M15 80h94M17 106h91');
  } else if (['palace', 'cloister', 'hall'].includes(shape)) {
    body = hall(
      12,
      top + 20,
      104,
      58 - n / 2,
      id === 'alhambra' ? 'sandstone' : 'stone',
    );
    if (shape === 'palace')
      body +=
        hall(44, top, 40, 77 - top / 3) +
        tower(16, top + 9, 15, 92 - top) +
        tower(98, top + 9, 15, 92 - top);
    else if (shape === 'cloister')
      body +=
        path('M27 91l36-18 38 18-37 19z', 'grass') +
        arcade(14, top + 29, 8, 8, 16) +
        tower(93, top - 8, 14, 100 - top);
    else
      body += repeat(9, (i) =>
        line(`M${20 + i * 11} ${top + 22}v48`, '#6e6e54', 1.2),
      );
  } else if (['dome', 'mosque'].includes(shape)) {
    body = rect(22, 66, 84, 47) + arcade(26, 79, 6, 10, 27);
    body +=
      `<path d="M35 64Q32 41 64 ${top - 22}Q96 41 93 64z" fill="${paint(id === 'florence' ? 'sandstone' : 'copper')}" stroke="#66725c" stroke-width=".8"/>` +
      line(`M64 ${top - 22}v-6M39 62q25 7 49 0`);
    if (id === 'aachen')
      body += path('M45 38l19-10 20 10v23l-20 8-19-8z', 'iron');
    body +=
      shape === 'mosque'
        ? tower(8, 24 + n, 14, 89 - n) + tower(108, 29 + n, 10, 84 - n)
        : tower(105, 30 + n, 13, 83 - n);
    if (id === 'kairouan')
      body =
        path('M9 85l55-17 54 17v28H9z') +
        rect(17, 35, 24, 77) +
        rect(21, 22, 16, 17) +
        rect(25, 12, 8, 13) +
        arcade(48, 85, 5, 9, 25);
  } else if (['pagoda', 'templetower', 'roundtemple'].includes(shape)) {
    if (shape === 'roundtemple') {
      body =
        repeat(
          3,
          (i) =>
            `<ellipse cx="64" cy="${112 - i * 7}" rx="${51 - i * 5}" ry="${10 - i}" fill="${paint('marble')}" stroke="#a8a28d" stroke-width=".7"/>`,
        ) + rect(42, 52, 44, 45, 'sandstone');
      body +=
        repeat(
          3,
          (i) =>
            `<path d="M${29 + i * 8} ${77 - i * 24}q${35 - i * 8}-${36 - i * 6} ${70 - i * 16} 0q-${35 - i * 8} 10-${70 - i * 16} 0z" fill="#608a9d" stroke="#d1bb7d" stroke-width="1.2"/>`,
        ) + line('M64 21V9', '#c7a367', 2);
    } else if (shape === 'templetower') {
      body =
        rect(14, 91, 100, 23) +
        repeat(5, (i) => {
          const w = 65 - i * 10,
            x = 64 - w / 2,
            y = 91 - i * 15;
          return (
            rect(x, y - 12, w, 14, id === 'hampi' ? 'stone' : 'sandstone') +
            line(`M${x} ${y - 11}h${w}`)
          );
        }) +
        arch(57, 94, 14, 20) +
        repeat(
          5,
          (i) => `<circle cx="${44 + i * 10}" cy="19" r="2" fill="#bd9d63"/>`,
        );
    } else if (id === 'forbiddencity') {
      body =
        path('M7 114l22-24 70 0 22 24z', 'marble') +
        repeat(3, (i) => {
          const x = 17 + i * 34,
            y = 67 - (i === 1 ? 22 : 0);
          return (
            rect(x, y, 29, 44, 'sandstone') +
            roof(x - 4, y, 37, 15, 'gold') +
            roof(x - 4, y + 12, 37, 12, 'gold')
          );
        }) +
        line('M64 111V89m-9 23 2-23m15 23-2-23');
    } else {
      const levels = id === 'horyuji' || id === 'himeji' ? 5 : 3 + (n % 3);
      body = path('M14 113l12-18 77-1 12 19z');
      body +=
        repeat(levels, (i) => {
          const w = 66 - i * (42 / levels),
            x = 64 - w / 2,
            y = 96 - i * (73 / levels);
          return (
            rect(x, y - 12, w, 15, id === 'himeji' ? 'marble' : 'iron') +
            roof(
              x - 5,
              y - 12,
              w + 10,
              11,
              id === 'bagan' ? 'sandstone' : 'copper',
            )
          );
        }) + line('M64 19V6', '#998052', 1.3);
      if (id === 'bagan')
        body +=
          tower(8, 67, 17, 47, 'sandstone') +
          tower(105, 79, 14, 35, 'sandstone');
    }
  } else if (['aqueduct', 'bridge', 'arcades'].includes(shape)) {
    const count = 4 + (n % 3);
    if (shape === 'bridge' && id === 'forthbridge')
      body =
        water +
        line(
          'M8 87h112M12 88l16-50 20 50 16-50 20 50 16-50 18 50M18 70h26m7 0h27m7 0h26',
          '#a86f57',
          3,
        ) +
        line(
          'M12 88l32-18-16-32m20 50 30-18-14-32m20 50 27-18-11-32',
          '#c58b6b',
          1.5,
        );
    else if (shape === 'bridge')
      body =
        water +
        path(`M6 80Q64 ${top - 22} 122 80v14Q64 ${top - 8} 6 94z`, 'iron') +
        line('M6 78Q64 13 122 78', '#cabfa1', 1.4);
    else {
      const levels = shape === 'aqueduct' ? (id === 'pontdugard' ? 3 : 2) : 1;
      body =
        (shape === 'aqueduct' ? water : '') +
        repeat(
          levels,
          (i) =>
            rect(9, 94 - i * 25, 110, 21) +
            arcade(13, 97 - i * 25, count, Math.floor(99 / count) - 3, 18),
        );
      if (shape === 'arcades')
        body +=
          rect(9, top + 10, 110, 8) +
          repeat(7, (i) =>
            line(`M${16 + i * 15} ${top + 16}v42`, '#c9b995', 3),
          );
    }
  } else if (['columns', 'ruins', 'theatre', 'arena'].includes(shape)) {
    body = path('M7 110l52-11 62 13-51 10z', 'stone');
    if (shape === 'arena')
      body =
        `<ellipse cx="64" cy="62" rx="52" ry="20" fill="#6e7558"/>` +
        path('M12 62q52 33 104 0v41q-52 27-104 0z') +
        repeat(2, (j) => arcade(16, 65 + j * 19, 9, 8, 14));
    else if (shape === 'theatre')
      body =
        path('M6 72Q64 125 122 72v29Q64 141 6 101z') +
        repeat(4, (i) =>
          line(
            `M${8 + i * 4} ${77 + i * 8}q${56 - i * 4} 38 ${112 - i * 8} 0`,
            '#b3a384',
            2,
          ),
        ) +
        hall(28, 47, 74, 32);
    else {
      const count = 5 + (n % 4);
      body += repeat(count, (i) => {
        const x = 14 + i * (93 / (count - 1)),
          y = shape === 'ruins' ? 55 + (i % 3) * 13 : top + 10;
        return (
          rect(x, y, 6, 111 - y, 'marble') + rect(x - 2, y - 3, 10, 4, 'stone')
        );
      });
      if (shape === 'columns') body += path(`M10 ${top + 6}l54-23 54 23v6H10z`);
      if (id === 'ephesus')
        body +=
          rect(12, top + 31, 104, 5) +
          arcade(18, top + 13, 7, 8, 17) +
          arcade(18, top + 46, 7, 8, 18);
    }
  } else if (['pyramid', 'ziggurat', 'stepwell'].includes(shape)) {
    if (shape === 'stepwell')
      body =
        repeat(6, (i) =>
          path(
            `M${5 + i * 7} ${109 - i * 9}l${59 - i * 7}-${21 - i * 2} ${59 - i * 7} ${21 - i * 2}-${59 - i * 7} ${18 - i * 2}z`,
          ),
        ) +
        rect(52, 53, 24, 24) +
        arcade(55, 60, 2, 7, 14);
    else
      body =
        repeat(6, (i) => {
          const w = 108 - i * 15,
            x = 64 - w / 2,
            y = 108 - i * 12;
          return rect(
            x,
            y - 9,
            w,
            12,
            shape === 'ziggurat' ? 'sandstone' : 'stone',
          );
        }) +
        hall(53, top - 21, 22, 17) +
        path('M58 42h12l11 73H47z', 'marble') +
        repeat(10, (i) =>
          line(
            `M${56 - i * 0.7} ${49 + i * 6}h${16 + i * 1.4}`,
            '#8e8a72',
            0.6,
          ),
        );
  } else if (
    ['stupa', 'tomb', 'minaret', 'spiral', 'leaning'].includes(shape)
  ) {
    if (shape === 'stupa')
      body =
        path('M16 110h96v-9H16z') +
        `<path d="M29 100a35 37 0 0 1 70 0z" fill="${paint('stone')}" stroke="#8b8165"/>` +
        rect(55, 49, 18, 11) +
        line('M64 49V19m-13 8h26m-21 8h16m-19 8h22', '#b8a06e', 2) +
        tower(13, 67, 8, 46) +
        tower(108, 67, 8, 46);
    else if (shape === 'tomb')
      body =
        repeat(5, (i) => rect(12 + i * 8, 108 - i * 7, 104 - i * 16, 8)) +
        hall(44, 52, 40, 29, 'marble');
    else if (shape === 'spiral')
      body =
        path('M14 111l37-91h26l36 91z', 'sandstone') +
        repeat(7, (i) =>
          line(
            `M${21 + i * 5.2} ${102 - i * 12}q${43 - i * 5.2} 13 ${86 - i * 10.4} 0`,
            '#e6c6a1',
            3,
          ),
        ) +
        rect(54, 11, 20, 15, 'sandstone');
    else if (shape === 'leaning')
      body = `<g transform="rotate(-7 64 113)">${repeat(7, (i) => `<ellipse cx="64" cy="${107 - i * 12}" rx="${25 - i * 0.7}" ry="6" fill="${paint('marble')}"/>` + rect(39 + i * 0.7, 97 - i * 12, 50 - i * 1.4, 11, 'marble') + arcade(42 + i * 0.7, 99 - i * 12, 5, 6, 8))}</g>`;
    else
      body =
        path(
          `M${44 - n} 113l${8 + n} -${91 - n}h24l${8 + n} ${91 - n}z`,
          'sandstone',
        ) +
        repeat(4, (i) =>
          rect(41 + i * 3, 96 - i * 24, 46 - i * 6, 4, 'stone'),
        ) +
        arch(60, 86, 8, 22);
  } else if (
    [
      'roundhouse',
      'octagon',
      'trulli',
      'thatched',
      'adobe',
      'town',
      'square',
      'canal',
      'harbor',
      'modern',
      'towers',
      'industrial',
      'woodchurch',
    ].includes(shape)
  ) {
    if (shape === 'roundhouse')
      body =
        `<ellipse cx="64" cy="68" rx="52" ry="28" fill="#7d6550"/>` +
        path('M12 68q52 36 104 0v41q-52 24-104 0z', 'sandstone') +
        `<ellipse cx="64" cy="68" rx="30" ry="14" fill="#86a16c"/>` +
        arcade(19, 85, 8, 8, 12) +
        line('M13 79q51 30 102 0');
    else if (shape === 'octagon')
      body =
        path('M28 54l36-14 36 14v55l-36 11-36-11z') +
        repeat(4, (i) => {
          const x = 14 + i * 27;
          return path(`M${x} 53l8-6 10 6v59l-9 5-9-5z`);
        }) +
        arch(59, 86, 11, 27);
    else if (shape === 'industrial')
      body =
        hall(10, 73, 68, 41, 'sandstone') +
        rect(88, 25, 13, 88, 'iron') +
        line(
          'M29 108V30h41v78M24 30h51M29 53h41M29 76h41M29 30l41 46M70 30 29 76',
          '#6f796c',
          3,
        ) +
        repeat(3, (i) => rect(10 + i * 21, 57, 12, 18, 'iron'));
    else if (shape === 'modern')
      body =
        rect(12, 65, width, 48, 'marble') +
        rect(23, top, 21, 77 - top, 'glass') +
        rect(70, top + 13, 39, 96 - top, 'glass') +
        repeat(6, (i) =>
          line(
            `M28 ${top + 6 + i * 8}h13M75 ${top + 18 + i * 8}h29`,
            '#e7e9d6',
            0.8,
          ),
        );
    else if (shape === 'towers')
      body = repeat(5, (i) =>
        tower(
          10 + i * 22,
          20 + ((i * 13 + seed) % 45),
          15,
          93 - ((i * 13 + seed) % 45),
        ),
      );
    else if (shape === 'trulli' || shape === 'thatched')
      body = repeat(5, (i) => {
        const x = 8 + i * 23,
          y = 86 - (i % 2) * 18;
        return (
          rect(x, y, 21, 28, shape === 'trulli' ? 'marble' : 'iron') +
          roof(x - 2, y, 25, shape === 'trulli' ? 28 : 35, 'iron') +
          arch(x + 8, y + 12, 6, 16)
        );
      });
    else if (shape === 'adobe')
      body =
        repeat(
          7,
          (i) =>
            rect(
              9 + i * 15,
              70 - (i % 3) * 14,
              22,
              43 + (i % 3) * 14,
              'sandstone',
            ) + arch(15 + i * 15, 78 - (i % 3) * 14, 5, 10),
        ) + line('M12 108h103', '#a77e61', 2);
    else {
      if (shape === 'canal' || shape === 'harbor') body = water;
      if (shape === 'square')
        body = path('M7 112l57-32 58 32-58 10z', 'marble');
      const houses = 5 + (seed % 3);
      body += repeat(houses, (i) => {
        const w = 104 / houses - 2,
          x = 7 + (i * 104) / houses,
          h = 27 + ((seed * (i + 3)) % 22);
        return hall(x, 113 - h, w, h, i % 2 ? 'sandstone' : 'stone');
      });
      if (shape === 'square') body += tower(94, 18 + (seed % 11), 16, 88 - n);
      if (shape === 'canal') body += path('M18 108q24-27 48 0v7q-24-21-48 0z');
      if (shape === 'harbor') body += line('M10 115h108', '#8c7954', 2);
    }
  } else if (
    [
      'torii',
      'gate',
      'observatory',
      'chariot',
      'jars',
      'stelae',
      'geoglyph',
    ].includes(shape)
  ) {
    if (shape === 'torii')
      body =
        water +
        line(
          'M29 111V44m70 67V44M20 55h88M14 31q50 13 100 0M20 42h88',
          '#b36c51',
          7,
        ) +
        line('M64 46v14', '#b36c51', 4);
    else if (shape === 'gate')
      body =
        rect(15, 51, 98, 61, 'sandstone') +
        arch(48, 67, 32, 45) +
        roof(7, 51, 114, 19, 'copper') +
        roof(35, 30, 58, 17, 'gold') +
        rect(42, 30, 44, 17, 'sandstone');
    else if (shape === 'observatory')
      body =
        path('M10 114l61-88 13 88z', 'stone') +
        path('M70 26l5-5 11 93H73z', 'marble') +
        `<path d="M10 105q55-47 108 0" fill="none" stroke="#af8961" stroke-width="8"/>` +
        line(
          'M20 101l6 5m7-14 5 6m9-14 3 6m12-10v6m13-3-2 6m14-3-3 6m14-2-5 5',
          '#eee0bb',
          2,
        );
    else if (shape === 'chariot')
      body =
        rect(23, 78, 82, 29, 'sandstone') +
        repeat(
          3,
          (i) =>
            `<circle cx="${32 + i * 32}" cy="106" r="11" fill="${paint('stone')}" stroke="#8c7354"/>${line(`M${32 + i * 32} 95v22m-11-11h22m-19-8 16 16m0-16-16 16`, '#81735c', 1)}`,
        ) +
        repeat(5, (i) =>
          rect(44 + i * 4, 70 - i * 12, 40 - i * 8, 12, 'sandstone'),
        );
    else if (shape === 'jars')
      body = repeat(8, (i) => {
        const x = 12 + i * 14,
          y = 73 + (i % 3) * 9;
        return (
          `<ellipse cx="${x + 5}" cy="${y + 23}" rx="8" ry="4" fill="#8c9d77"/>` +
          path(`M${x} ${y}q-9 23 0 27h11q9-23 0-27z`, 'slate') +
          `<ellipse cx="${x + 5.5}" cy="${y}" rx="7" ry="3" fill="#555f50"/>`
        );
      });
    else if (shape === 'stelae')
      body = repeat(6, (i) => {
        const x = 11 + i * 20,
          y = 27 + ((i * 9 + n) % 31);
        return (
          rect(x, y, 9, 86 - y) +
          (id === 'gobekli'
            ? rect(x - 5, y - 3, 19, 6)
            : repeat(5, (k) => rect(x + 2, y + 8 + k * 9, 5, 5, 'slate')))
        );
      });
    else
      body =
        path('M5 104l23-52 77 7 18 53z', 'dune') +
        line(
          'M19 106l29-44 2 45 26-30-8 18 37-20M39 101q-7-10 5-15 16-4 14 7-1 10-10 3-5-5 1-6M78 104l-5-3 2-6 7 1 2 6-6 2m3-7 10-13 4 1-8 16',
          '#f0d5ae',
          1.2,
        );
  } else if (
    ['cliff', 'cliffbuddha', 'clifftemple', 'rocktemple', 'island'].includes(
      shape,
    )
  ) {
    body = rock(
      7,
      top - 8,
      114,
      89 - top / 2,
      id === 'abusimbel' ? 'sandstone' : 'mountain',
    );
    if (shape === 'clifftemple' || shape === 'island')
      body += hall(36, top - 17, 61, 34, 'stone') + tower(55, top - 28, 16, 32);
    else if (shape === 'rocktemple')
      body +=
        rect(25, 53, 78, 57, 'sandstone') +
        repeat(
          4,
          (i) =>
            `<g transform="translate(${33 + i * 20} 78)"><circle cy="-12" r="5" fill="${paint('sandstone')}"/>${path('M-5-6H5l3 24H-8z', 'sandstone')}${rect(-8, 19, 16, 7, 'stone')}</g>`,
        );
    else if (shape === 'cliffbuddha')
      body += `<g transform="translate(65 68)"><circle cy="-20" r="8" fill="${paint('sandstone')}"/>${path('M-9-11H9l8 32h-34z', 'sandstone')}${path('M-17 18l-10 18h54L17 18z', 'sandstone')}${line('M-8-2l-10 17m26-17 10 17', '#e0bd91', 2)}</g>`;
    else
      body +=
        repeat(8, (i) => arch(15 + i * 13, 71 + (i % 2) * 17, 7, 11)) +
        repeat(4, (i) => hall(13 + i * 27, 93 + (i % 2) * 7, 23, 17, 'stone'));
    if (shape === 'island') body = water + body;
  } else if (
    [
      'peaks',
      'pillars',
      'redrocks',
      'badlands',
      'canyon',
      'basalt',
      'volcano',
      'crater',
      'glacier',
      'waterfall',
      'geyser',
      'lakes',
      'terraces',
      'reef',
      'forest',
      'savanna',
      'wetland',
      'mangrove',
      'coast',
      'fjord',
      'garden',
      'waterworks',
      'cave',
      'mine',
    ].includes(shape)
  ) {
    if (
      ['peaks', 'pillars', 'redrocks', 'badlands', 'basalt'].includes(shape)
    ) {
      const material =
        shape === 'redrocks' || shape === 'badlands'
          ? 'sandstone'
          : shape === 'basalt'
            ? 'slate'
            : 'mountain';
      body = repeat(shape === 'basalt' ? 11 : 6, (i) => {
        const w = shape === 'basalt' ? 12 : 24,
          x = 5 + i * (shape === 'basalt' ? 10 : 19),
          h =
            shape === 'basalt'
              ? 26 + ((i * 7 + n) % 28)
              : 39 + ((i * 17 + seed) % 49);
        return (
          rock(x, 112 - h, w, h, material) +
          (shape === 'peaks'
            ? path(`M${x + 4} ${119 - h}l9-10 9 13-7-4-4 4z`, 'snow')
            : tree(x + 8, 111, 12))
        );
      });
    } else if (['volcano', 'crater'].includes(shape)) {
      body =
        path(
          `M5 114l${34 + n}-${61 + n} 18-17 22 3 21 ${37 + n} 23 ${38 - n}z`,
          'mountain',
        ) +
        `<ellipse cx="66" cy="${39 - n}" rx="17" ry="6" fill="#68584e"/>` +
        line(`M35 97l18-36m27-7 17 38`, '#a5b69a');
      if (shape === 'crater')
        body += `<ellipse cx="65" cy="76" rx="34" ry="13" fill="#879d69"/><ellipse cx="71" cy="78" rx="16" ry="5" fill="#8cbab4"/>`;
    } else if (shape === 'glacier')
      body =
        water +
        rock(9, top - 8, 109, 80, 'mountain') +
        path('M42 48l18-13 17 9 7 39 22 25-43 10-25-16 11-28z', 'snow') +
        line('M54 53l7 21-8 29m17-54 1 38 13 19', '#92acaf', 1.4);
    else if (shape === 'canyon')
      body =
        path('M5 44l39-12 5 34-10 47H5z', 'sandstone') +
        path('M81 37l42 7v70H76L70 73z', 'sandstone') +
        repeat(7, (i) =>
          line(`M8 ${52 + i * 8}l28-4M86 ${53 + i * 8}l33 5`, '#c38c62', 2),
        ) +
        path('M63 66l8 10-10 20 17 15-10 9-20-20 10-20z', 'glass');
    else if (shape === 'waterfall')
      body =
        rock(5, top, 118, 75, 'mountain') +
        path(`M${26 + n} 48q35 9 68 0l-4 62H${24 + n}z`, 'glass') +
        repeat(7, (i) =>
          line(
            `M${30 + i * 8} ${51 + (i % 2) * 4}l-3 ${54 - (i % 3) * 4}`,
            '#e3efe1',
            1.5,
          ),
        ) +
        `<ellipse cx="62" cy="112" rx="46" ry="8" fill="#b2d4ca"/>`;
    else if (shape === 'geyser')
      body =
        path('M7 110l25-33 53-8 38 40-50 13z', 'grass') +
        `<ellipse cx="64" cy="101" rx="27" ry="9" fill="#9fc9bf"/>` +
        line(
          `M64 98Q${50 + n} 43 63 24Q84 53 71 94M59 91Q40 45 53 32`,
          '#d0e8dd',
          4,
        );
    else if (shape === 'cave' || shape === 'mine')
      body =
        rock(7, top - 3, 114, 82, 'mountain') +
        arch(34, 56, 61, 57) +
        repeat(7, (i) =>
          path(
            `M${38 + i * 8} 58l3 ${8 + ((i * 11 + seed) % 23)} 4-${8 + ((i * 11 + seed) % 23)}z`,
            'stone',
          ),
        ) +
        (shape === 'mine'
          ? line('M42 110l30-35m-21 38 28-36M52 98l8 3m1-12 8 3', '#ac8c65', 2)
          : '');
    else if (shape === 'terraces')
      body = repeat(
        7,
        (i) =>
          path(
            `M${9 + i * 4} ${111 - i * 9}l${54 - i * 3}-${17 - i} ${54 - i * 3} ${17 - i}-${54 - i * 3} 13z`,
            id === 'huanglong' ? 'glass' : 'grass',
          ) +
          line(
            `M${12 + i * 4} ${113 - i * 9}l${51 - i * 3} 11 ${51 - i * 3}-11`,
            '#d5cf9e',
            1.5,
          ),
      );
    else if (shape === 'reef')
      body =
        water +
        path('M13 84q23-27 47-4 30-28 54 6l-9 23-80-1z', 'grass') +
        `<ellipse cx="65" cy="95" rx="24" ry="10" fill="#73aeb0"/>` +
        repeat(7, (i) =>
          line(`M${18 + i * 14} 113v-9m0 4-4-4m4 2 4-4`, '#c19a85', 1.2),
        );
    else if (
      [
        'forest',
        'savanna',
        'wetland',
        'mangrove',
        'garden',
        'lakes',
        'coast',
        'fjord',
        'waterworks',
      ].includes(shape)
    ) {
      body = path('M5 107l32-42 55 7 31 35-59 15z', 'grass');
      if (shape !== 'forest' && shape !== 'savanna') body += water;
      const count = shape === 'forest' ? 9 : 5;
      body += repeat(count, (i) =>
        tree(
          13 + i * (99 / (count - 1)),
          91 + (i % 3) * 9,
          shape === 'forest' ? 37 + ((i * 7 + n) % 20) : 18 + (seed % 11),
        ),
      );
      if (shape === 'garden')
        body +=
          hall(45, 70, 36, 29) +
          `<ellipse cx="67" cy="109" rx="22" ry="6" fill="#b0d0b8"/>`;
      if (shape === 'lakes')
        body += `<ellipse cx="49" cy="83" rx="26" ry="8" fill="#9bd1c6"/><ellipse cx="88" cy="98" rx="21" ry="7" fill="#87bab7"/>`;
      if (shape === 'coast' || shape === 'fjord')
        body += rock(4, 36 + n, 27, 77 - n) + rock(95, 27 + n, 29, 86 - n);
      if (shape === 'waterworks')
        body +=
          line('M62 115V78l-22-20m22 20 29-23', '#b8d6ca', 6) +
          line('M58 108l-6-20m16 20 6-23', '#c0a47b', 4);
    }
  }
  if (id === 'ayutthaya' || id === 'sukhothai')
    body = repeat(5, (i) => {
      const x = 10 + i * 23,
        h = 38 + ((seed + i * 11) % 4) * 13,
        y = 113 - h;
      return (
        path(
          `M${x} 113l4-${h * 0.45} 3-${h * 0.4} 4-${h * 0.15} 4 ${h * 0.15} 3 ${h * 0.4} 4 ${h * 0.45}z`,
          'sandstone',
        ) + repeat(4, (j) => line(`M${x + 3} ${109 - j * 9}h17`, '#d2ba8d', 1))
      );
    });
  if (id === 'quedlinburg')
    body += repeat(5, (i) =>
      line(`M${12 + i * 22} 85v26m-6-18 12 12m0-12-12 12`, '#7c6b4b', 1.1),
    );
  if (id === 'bamberg') body += tower(43, 27, 12, 85) + tower(62, 31, 12, 81);
  if (id === 'khajuraho')
    body = repeat(5, (i) => {
      const x = 9 + i * 23,
        h = 41 + (i === 2 ? 45 : i % 2 ? 21 : 0);
      return (
        path(
          `M${x} 114l3-${h * 0.4} 7-${h * 0.6} 8 ${h * 0.6} 3 ${h * 0.4}z`,
          'sandstone',
        ) +
        repeat(6, (j) =>
          line(`M${x + 4} ${109 - (j * h) / 9}h13`, '#d5bd95', 0.8),
        )
      );
    });
  if (id === 'hampi')
    body = rock(2, 79, 30, 36, 'stone') + rock(98, 72, 26, 41, 'stone') + body;
  if (id === 'bagan')
    body = repeat(7, (i) => {
      const x = 4 + i * 17,
        h = 39 + ((i + seed) % 3) * 21;
      return (
        rect(x, 113 - h * 0.35, 15, h * 0.35, 'sandstone') +
        path(
          `M${x - 2} ${113 - h * 0.35}l9-${h * 0.45} 9 ${h * 0.45}z`,
          'sandstone',
        ) +
        line(`M${x + 7} ${113 - h * 0.8}v-${h * 0.2}`, '#b3965a', 1.5)
      );
    });
  if (id === 'robbeneiland')
    body =
      water +
      path('M8 105l28-25 64 6 20 24-65 9z', 'grass') +
      hall(24, 78, 73, 25, 'stone') +
      hall(91, 87, 22, 19, 'marble');
  if (id === 'brasilia')
    body =
      path('M6 113h116v5H6z', 'marble') +
      rect(52, 24, 9, 86, 'marble') +
      rect(65, 24, 9, 86, 'marble') +
      `<path d="M10 91h35a17.5 18 0 0 1-35 0M84 107a18 18 0 0 1 36 0z" fill="${paint('marble')}" stroke="#86978c"/>`;
  if (id === 'marrakesh')
    body =
      rect(40, 30, 31, 83, 'sandstone') +
      rect(47, 18, 17, 14, 'sandstone') +
      line('M55 18V6', '#c4ab70', 2) +
      arcade(46, 41, 2, 8, 19) +
      arcade(46, 74, 2, 8, 19) +
      hall(9, 90, 30, 24, 'sandstone');
  if (id === 'isfahan')
    body =
      path('M4 111l60-27 60 27-60 12z', 'marble') +
      rect(8, 75, 112, 18) +
      arcade(12, 79, 9, 9, 15) +
      rect(46, 57, 36, 39) +
      `<path d="M44 57Q64 15 84 57z" fill="#73a5a3" stroke="#5a7e76"/>` +
      tower(16, 43, 10, 65) +
      tower(101, 43, 10, 65);
  if (id === 'qutb')
    body += repeat(7, (i) =>
      line(`M${48 + i * 4} 109l${3 - i} -79`, '#b38e67', 0.7),
    );
  if (id === 'westminster')
    body +=
      rect(97, 19, 17, 91) +
      roof(96, 19, 19, 15, 'slate') +
      `<circle cx="105.5" cy="36" r="6" fill="#e8d8a4"/>` +
      line('M105.5 31v5l4 2', '#657260', 1);
  if (id === 'palenque') body += tower(96, 38, 14, 74, 'stone');
  if (id === 'volklingen')
    body =
      hall(8, 84, 104, 30, 'sandstone') +
      repeat(
        3,
        (i) =>
          rect(14 + i * 34, 39 + i * 5, 18, 49 - i * 5, 'iron') +
          `<ellipse cx="${23 + i * 34}" cy="${39 + i * 5}" rx="9" ry="4" fill="${paint('iron')}"/>` +
          line(`M${23 + i * 34} ${35 + i * 5}V18`, '#6e7b70', 5),
      ) +
      line('M11 68h103M12 74h103', '#a1b09e', 2);
  if (id === 'avignon')
    body +=
      hall(35, 44, 61, 54, 'stone') +
      rect(38, 28, 15, 20) +
      rect(81, 31, 12, 17);
  if (id === 'avila')
    body +=
      repeat(5, (i) => path(`M${10 + i * 23} 76q8-9 16 0v37h-16z`)) +
      arch(56, 87, 16, 26);
  if (id === 'towerlondon')
    body +=
      rect(41, 41, 48, 69, 'marble') +
      repeat(4, (i) => rect(37 + i * 16, 29 + (i % 2) * 7, 8, 21));
  if (id === 'hwaseong')
    body +=
      hall(40, 61, 51, 38, 'stone') +
      roof(36, 57, 59, 14, 'copper') +
      roof(37, 72, 57, 12, 'copper');
  if (id === 'agrafort')
    body +=
      path('M33 110V66l13-10 36 0 12 10v44z', 'sandstone') +
      arch(54, 77, 21, 33) +
      line('M35 70h56', '#e4c59c', 2);
  if (id === 'redfort')
    body +=
      rect(32, 55, 64, 58, 'sandstone') +
      repeat(3, (i) =>
        tower(35 + i * 24, 41 + (i % 2) * 4, 14, 71 - (i % 2) * 4, 'sandstone'),
      );
  if (id === 'douro')
    body += repeat(7, (i) =>
      line(`M${23 + i * 12} ${87 + (i % 3) * 9}v10m-3-7 7 2`, '#537648', 1.5),
    );
  if (id === 'huanglong')
    body += repeat(
      5,
      (i) =>
        `<ellipse cx="${42 + (i % 2) * 35}" cy="${60 + i * 11}" rx="${20 - i}" ry="5" fill="#a8d4c9" stroke="#e6d9b5" stroke-width="2"/>`,
    );
  if (id === 'konso')
    body += repeat(3, (i) =>
      hall(14 + i * 39, 79 + (i % 2) * 14, 23, 24, 'stone'),
    );
  if (id === 'summerpalace')
    body =
      water +
      body +
      path('M10 112q31-34 62 0v6q-31-26-62 0z', 'marble') +
      arcade(19, 103, 5, 7, 10);
  if (id === 'chengde')
    body =
      water +
      rock(9, 32, 105, 73, 'grass') +
      repeat(3, (i) =>
        hall(15 + i * 35, 76 - (i % 2) * 27, 29, 29, 'sandstone'),
      );
  if (id === 'himeji')
    body += hall(6, 83, 28, 29, 'marble') + hall(94, 79, 27, 33, 'marble');
  if (id === 'horyuji') body += hall(5, 75, 35, 37, 'iron');
  if (id === 'kyoto')
    body =
      water +
      hall(23, 54, 79, 52, 'iron') +
      roof(18, 42, 89, 22, 'copper') +
      tree(110, 103, 44) +
      line('M30 113h62', '#d8ddbc', 1.5);
  if (id === 'nara')
    body =
      hall(20, 54, 93, 59, 'iron') +
      roof(16, 45, 101, 20, 'copper') +
      tower(4, 36, 13, 76, 'iron');
  if (id === 'qufu')
    body =
      path('M9 112l55-42 55 42z', 'stone') +
      repeat(3, (i) =>
        hall(25 - i * 5, 35 + i * 29, 78 + i * 10, 19, 'sandstone'),
      );
  if (id === 'bulguksa')
    body =
      hall(24, 51, 82, 39, 'iron') +
      path('M11 113l15-26 78 0 14 26z', 'marble') +
      repeat(2, (i) =>
        repeat(3, (j) =>
          rect(18 + i * 75 + j * 3, 104 - j * 13, 23 - j * 6, 8, 'stone'),
        ),
      ) +
      line('M59 92v23m10-23v23', '#b8b69e', 3);
  if (id === 'changdeokgung')
    body =
      hall(18, 71, 95, 39, 'iron') +
      roof(13, 60, 105, 22, 'copper') +
      hall(42, 29, 43, 25, 'sandstone') +
      tree(10, 99, 38);
  if (id === 'sansa')
    body =
      rock(7, 29, 113, 81, 'grass') +
      hall(13, 77, 45, 34, 'iron') +
      hall(72, 76, 43, 36, 'iron') +
      hall(45, 48, 37, 28, 'iron');
  if (id === 'baekje')
    body =
      path('M14 113l50-14 50 14-50 10z', 'stone') +
      repeat(
        6,
        (i) =>
          rect(36 + i * 3, 96 - i * 12, 56 - i * 6, 9, 'stone') +
          roof(31 + i * 3, 96 - i * 12, 66 - i * 6, 8, 'slate'),
      );
  if (id === 'persepolis')
    body =
      path('M7 113l36-15 78 6-25 17z', 'stone') +
      repeat(
        6,
        (i) =>
          rect(15 + i * 18, 43 + (i % 2) * 5, 5, 65 - (i % 2) * 5, 'marble') +
          rect(12 + i * 18, 37 + (i % 2) * 5, 11, 6, 'stone'),
      ) +
      rect(96, 63, 18, 47) +
      arch(101, 75, 8, 34);
  if (id === 'matera')
    body =
      rock(6, 39, 115, 73, 'stone') +
      repeat(9, (i) =>
        hall(13 + (i % 3) * 34, 59 + Math.floor(i / 3) * 20, 28, 23, 'stone'),
      );
  if (id === 'ajanta')
    body =
      path('M5 56Q64 13 123 56v57H5z', 'mountain') +
      repeat(10, (i) =>
        arch(10 + i * 11, 60 + Math.sin(i * 0.38) * 15, 8, 21),
      ) +
      line('M10 100q53-24 108 0', '#86916f', 5);
  if (id === 'mahabalipuram')
    body =
      water +
      repeat(2, (i) =>
        repeat(5, (j) =>
          rect(
            18 + i * 57 + j * 3,
            102 - j * (i ? 11 : 15),
            37 - j * 6,
            9,
            'sandstone',
          ),
        ),
      ) +
      hall(55, 88, 25, 19, 'stone');
  if (id === 'mahabodhi')
    body =
      path('M34 112l10-91h39l11 91z', 'stone') +
      repeat(8, (i) =>
        line(`M${41 + i} ${33 + i * 9}h${45 - i * 2}`, '#a89a80', 2),
      ) +
      repeat(2, (i) => tower(14 + i * 87, 78, 12, 35, 'stone')) +
      arch(57, 86, 14, 26);
  if (id === 'chaco')
    body =
      path('M8 64q54-31 111 0v46q-55 20-111 0z', 'sandstone') +
      `<ellipse cx="64" cy="76" rx="36" ry="19" fill="#86916d"/>` +
      repeat(7, (i) => arch(16 + i * 14, 91, 7, 12));
  if (id === 'chanchan')
    body =
      rect(9, 61, 111, 53, 'sandstone') +
      path('M34 114V81l30-13 32 13v33z', 'sandstone') +
      repeat(3, (j) =>
        line(
          `M15 ${70 + j * 12}l8-4 8 4 8-4 8 4m35 0 8-4 8 4 8-4 8 4`,
          '#d4b88a',
          1.4,
        ),
      ) +
      arch(56, 91, 17, 23);
  if (id === 'yazd')
    body += repeat(
      3,
      (i) =>
        rect(15 + i * 39, 39 + (i % 2) * 8, 14, 52) +
        repeat(3, (j) =>
          rect(18 + i * 39 + j * 3, 43 + (i % 2) * 8, 1.5, 17, 'slate'),
        ),
    );
  if (id === 'morelia')
    body =
      hall(31, 65, 66, 48, 'sandstone') +
      repeat(
        2,
        (i) =>
          rect(14 + i * 81, 38, 19, 74, 'sandstone') +
          `<path d="M${12 + i * 81} 38q12-38 24 0z" fill="${paint('copper')}"/>` +
          arcade(18 + i * 81, 49, 1, 10, 16),
      );
  if (id === 'volubilis')
    body +=
      rect(43, 63, 45, 49, 'stone') +
      arch(54, 75, 23, 37) +
      rect(39, 59, 53, 6, 'marble');
  if (id === 'babylon')
    body =
      rect(18, 45, 94, 67, 'glass') +
      repeat(8, (i) => rect(15 + i * 13, 36, 8, 12, 'glass')) +
      arch(50, 67, 29, 45) +
      repeat(5, (i) => line(`M26 ${59 + i * 10}h12m56 0h10`, '#d8c17e', 2));
  if (id === 'chiloe')
    body =
      hall(23, 70, 87, 43, 'iron') +
      roof(18, 70, 97, 28, 'copper') +
      rect(54, 35, 21, 78, 'iron') +
      roof(52, 35, 25, 26, 'copper') +
      arch(59, 46, 11, 18) +
      arch(59, 88, 11, 25) +
      repeat(6, (i) => line(`M27 ${79 + i * 5}h23m29 0h27`, '#c9b28c', 0.6));
  if (id === 'giantscauseway')
    body =
      water +
      repeat(14, (i) => {
        const x = 7 + (i % 7) * 16,
          h = 19 + ((i * 7) % 29),
          y = 96 + Math.floor(i / 7) * 17 - h;
        return (
          path(`M${x} ${y}l6-4 7 4v${h}l-7 4-6-4z`, 'slate') +
          path(`M${x} ${y}l6-4 7 4-7 4z`, 'stone') +
          line(`M${x + 6} ${y + 4}v${h}`, '#657b70', 0.7)
        );
      });
  if (id === 'centralamazon')
    body =
      water +
      path('M8 102l17-26 31 3 8 30z', 'grass') +
      path('M79 96l18-25 23 8-4 35H77z', 'grass') +
      repeat(7, (i) => {
        const x = 12 + i * 17,
          y = 91 + (i % 3) * 7;
        return (
          line(`M${x} ${y}v-30m0 16-8-7m8 2 8-8`, '#7d7254', 2) +
          `<ellipse cx="${x}" cy="${y - 31}" rx="13" ry="10" fill="#6f9366"/><ellipse cx="${x - 4}" cy="${y - 37}" rx="10" ry="7" fill="#89a16d"/>`
        );
      });
  if (id === 'serengeti')
    body =
      path('M5 112l25-28 64 3 29 25-59 10z', 'grass') +
      repeat(3, (i) => {
        const x = 24 + i * 38,
          y = 99 + (i % 2) * 10;
        return (
          line(`M${x} ${y}v-30m0 9-8-12m8 12 9-11`, '#796e4f', 2) +
          `<path d="M${x - 20} ${y - 28}q5-11 15-9 7-8 16 0 12-1 12 9z" fill="#769364"/>`
        );
      });
  if (!body) throw new Error(`Missing landmark illustration: ${id} (${shape})`);
  return `<g class="expanded-landmark" data-expansion-shape="${shape}" style="--landmark-accent:${color}">${body}</g>`;
}
