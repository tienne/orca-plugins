import catalog from './catalog-600.json';

const profiles = new Map(catalog.map((entry) => [entry.id, entry]));
type Visual = { id: string; shape: string; color: string };

/** 장소별로 정한 다섯 윤곽 높이와 구조 특징으로 새 도감의 미니어처를 그린다. */
export function catalog600Art(entry: Visual, paint: (name: string) => string) {
  const profile = profiles.get(entry.id);
  if (!profile) return '';
  const { heights: h, detail } = profile;
  const { shape, color } = entry;
  if (
    ![
      'adobe',
      'aqueduct',
      'basilica',
      'bridge',
      'canal',
      'castle',
      'cathedral',
      'cave',
      'cliff',
      'cliffbuddha',
      'clifftemple',
      'cloister',
      'coast',
      'columns',
      'dome',
      'forest',
      'fortress',
      'gate',
      'garden',
      'glacier',
      'hall',
      'harbor',
      'industrial',
      'island',
      'jars',
      'lakes',
      'mangrove',
      'minaret',
      'mine',
      'modern',
      'mosque',
      'observatory',
      'palace',
      'peaks',
      'pillars',
      'pyramid',
      'redrocks',
      'reef',
      'rocktemple',
      'roundhouse',
      'roundtemple',
      'ruins',
      'savanna',
      'square',
      'stelae',
      'stupa',
      'templetower',
      'terraces',
      'thatched',
      'theatre',
      'tomb',
      'towers',
      'town',
      'volcano',
      'waterfall',
      'waterworks',
      'wetland',
      'woodchurch',
      'ziggurat',
      'crater',
      'fjord',
    ].includes(shape)
  )
    throw new Error(`Unsupported catalog illustration: ${entry.id}`);
  const material = ['earth', 'paintedearth', 'brick', 'terracotta'].includes(
    detail,
  )
    ? 'sandstone'
    : detail === 'white' || detail === 'marble'
      ? 'marble'
      : 'stone';
  const path = (d: string, fill = material) =>
    `<path d="${d}" fill="${paint(fill)}" stroke="#666653" stroke-width=".7" stroke-linejoin="round"/>`;
  const line = (d: string, stroke = '#d3c9a6', width = 1) =>
    `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`;
  const rect = (
    x: number,
    y: number,
    w: number,
    height: number,
    fill = material,
  ) => path(`M${x} ${y}h${w}v${height}h-${w}z`, fill);
  const repeat = (n: number, fn: (i: number) => string) =>
    Array.from({ length: n }, (_, i) => fn(i)).join('');
  const arch = (x: number, y: number, w: number, height: number) =>
    `<path d="M${x} ${y + height}v-${height - w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0v${height - w / 2}z" fill="#47645b"/>`;
  const roof = (x: number, y: number, w: number, height = 11) =>
    path(
      `M${x - 2} ${y}l${w / 2 + 2}-${height} ${w / 2 + 2} ${height}z`,
      'copper',
    );
  const water = `<path d="M4 106q29-16 60-3t60 2v16H4z" fill="#82b8bc"/>${line('M12 113h23m15 5h28m15-7h21', '#d7e9d6', 1.3)}`;
  const contour = `M7 113${h.map((v, i) => `L${12 + i * 25} ${114 - v}`).join('')}L123 113L65 123z`;
  const tree = (x: number, y: number, height: number, palm = false) =>
    line(`M${x} ${y}v-${height * 0.7}`, '#7e7050', 2) +
    (palm
      ? `<path d="M${x} ${y - height * 0.7}q-18-20-24-5 17-4 24 5 7-20 23-12-18 1-23 12-4-26 4-25 3 13-4 25z" fill="#769965"/>`
      : `<ellipse cx="${x}" cy="${y - height * 0.7}" rx="${8 + height / 10}" ry="${height * 0.3}" fill="#799765"/><ellipse cx="${x - 4}" cy="${y - height * 0.83}" rx="${6 + height / 12}" ry="${height * 0.21}" fill="#94aa78"/>`);
  let body = '';

  if (['castle', 'fortress'].includes(shape)) {
    body = rect(9, 77, 110, 36) + arch(54, 89, 20, 24);
    body += h
      .map((height, i) => {
        const x = 9 + i * 23,
          y = 114 - height;
        return (
          rect(x, y, 17, height) +
          arch(x + 5, y + 12, 7, 12) +
          (detail === 'spires'
            ? roof(x, y, 17, 19)
            : repeat(4, (j) => rect(x - 1 + j * 5, y - 5, 3, 7)))
        );
      })
      .join('');
    body += line('M10 84h41m29 0h37M10 108h38m34 0h34');
  } else if (shape === 'minaret' || shape === 'towers') {
    if (shape === 'towers') body += rect(10, 91, 108, 22);
    body += h
      .map((height, i) => {
        if (!height || (shape === 'minaret' && i !== 2 && height < 30))
          return '';
        const x = 11 + i * 23,
          y = 114 - height,
          w = shape === 'minaret' ? 20 : 15;
        return (
          path(`M${x - 2} 114l4-${height}h${w - 7}l5 ${height}z`) +
          roof(x, y, w, detail === 'flutes' ? 13 : 7) +
          repeat(4, (j) =>
            line(
              `M${x + 1} ${y + 14 + (j * height) / 6}h${w - 2}`,
              detail === 'blue' ? '#6d9ea4' : '#dfc7a2',
              2,
            ),
          ) +
          arch(x + 5, y + 9, 6, 11)
        );
      })
      .join('');
    if (detail === 'beacon')
      body += `<circle cx="67" cy="20" r="4" fill="#f5dfa0"/>`;
    if (detail === 'sculpture')
      body += repeat(
        5,
        (i) =>
          `<circle cx="${49 + i * 7}" cy="${65 + Math.abs(2 - i) * 8}" r="3" fill="#b4ad90"/>`,
      );
  } else if (
    [
      'basilica',
      'cathedral',
      'dome',
      'mosque',
      'roundtemple',
      'stupa',
    ].includes(shape)
  ) {
    body =
      rect(18, 73, 92, 40) + repeat(6, (i) => arch(23 + i * 14, 88, 8, 25));
    const y = 114 - h[2];
    if (shape === 'stupa')
      body +=
        path(`M29 85q0-${h[2]} 35-${h[2]}t35 ${h[2]}z`) +
        rect(57, y - 1, 14, 18) +
        line(`M64 ${y - 5}v-12`, '#d9c391', 2);
    else
      body +=
        path(
          `M35 75q-3-${75 - y} 29-${75 - y}t29 ${75 - y}z`,
          detail === 'blue' ? 'glass' : detail === 'gold' ? 'copper' : material,
        ) + rect(57, y - 8, 14, 14);
    if (shape !== 'stupa')
      body += [1, 3]
        .map((i) => {
          const x = i === 1 ? 11 : 101,
            top = 114 - h[i];
          return (
            rect(x, top, 16, h[i]) +
            roof(x, top, 16, 12) +
            arch(x + 5, top + 8, 6, 10)
          );
        })
        .join('');
    if (['cross', 'gold', 'marble'].includes(detail))
      body += line(`M64 ${y - 8}v-13m-4 5h8`, '#b8a57c', 1.6);
    if (detail === 'star')
      body += path(
        'M64 30l8 20 21-2-16 15 5 22-18-12-18 12 5-22-16-15 21 2z',
        'copper',
      );
    if (detail === 'ribs')
      body += repeat(7, (i) =>
        line(`M64 ${y}Q${30 + i * 11} 53 ${35 + i * 10} 75`, '#bbbba3'),
      );
  } else if (
    [
      'palace',
      'cloister',
      'hall',
      'town',
      'square',
      'thatched',
      'adobe',
      'roundhouse',
      'woodchurch',
      'modern',
      'harbor',
      'canal',
    ].includes(shape)
  ) {
    if (['canal', 'harbor'].includes(shape)) body += water;
    body += h
      .map((height, i) => {
        const x = 8 + i * 23,
          y = 114 - height;
        const walls =
          detail === 'timber' || detail === 'turf' ? 'iron' : material;
        const base =
          shape === 'roundhouse'
            ? `<ellipse cx="${x + 10}" cy="110" rx="11" ry="5" fill="#b8a280"/>${path(`M${x} ${y + 10}q10-12 20 0v${height - 10}q-10 8-20 0z`)}`
            : rect(x, y, 21, height, walls);
        return (
          base +
          (shape === 'adobe'
            ? rect(x - 1, y - 3, 23, 5, 'sandstone')
            : detail === 'turf'
              ? path(`M${x - 3} ${y}l13-13 14 13z`, 'grass')
              : roof(x, y, 21, shape === 'thatched' ? 17 : 10)) +
          (detail === 'arcade'
            ? arch(x + 3, 95, 15, 19)
            : repeat(2, (j) => arch(x + 4 + j * 9, y + 10, 5, 9))) +
          line(`M${x + 2} ${y + 25}h17m-17 17h17`)
        );
      })
      .join('');
    if (detail === 'clock')
      body += `<circle cx="65" cy="${124 - h[2]}" r="6" fill="#e8d9b5"/>${line(`M65 ${120 - h[2]}v5l4 2`, '#695f4f')}`;
    if (detail === 'sgraffito' || detail === 'paintedearth')
      body += repeat(8, (i) =>
        line(`M${14 + i * 13} 88l5-7 5 7-5 7z`, '#7d6a55'),
      );
    if (detail === 'curves')
      body += path(`M9 105q15-${h[1]} 32-5t35-9 43 8v12H9z`, 'glass');
  } else if (['templetower', 'pyramid', 'ziggurat'].includes(shape)) {
    body = h
      .map((height, i) => {
        const x = 10 + i * 23;
        return (
          repeat(shape === 'templetower' ? 5 : 7, (j) => {
            const step = height / 7,
              w = 23 - j * 2.5;
            return (
              rect(x + j * 1.25, 114 - (j + 1) * step, w, step + 1) +
              line(`M${x + j * 1.25} ${114 - (j + 1) * step}h${w}`, '#e0cea8')
            );
          }) + arch(x + 7, 103 - height / 2, 7, 14)
        );
      })
      .join('');
    body += line(`M61 112V${122 - h[2]}m6 0v${h[2] - 10}`, '#c6ba96', 2);
  } else if (
    ['columns', 'ruins', 'gate', 'theatre', 'bridge', 'aqueduct'].includes(
      shape,
    )
  ) {
    if (shape === 'bridge' || shape === 'aqueduct') body += water;
    if (shape === 'theatre') {
      body += path(contour);
      body += repeat(
        6,
        (i) =>
          `<path d="M${12 + i * 5} ${65 + i * 7}q${52 - i * 5} ${53 - i * 4} ${104 - i * 10} 0" fill="none" stroke="#d7ccb0" stroke-width="3"/>`,
      );
      if (detail === 'stagewall')
        body +=
          rect(12, 114 - h[2], 104, 30) +
          repeat(8, (i) => arch(17 + i * 12, 118 - h[2], 7, 20));
    } else if (shape === 'bridge' || shape === 'aqueduct') {
      const count = entry.id === 'visegrad' ? 11 : 7,
        y = 114 - h[2];
      body +=
        rect(7, y, 114, h[2] - 8) +
        repeat(count, (i) =>
          arch(10 + i * (109 / count), y + 8, 105 / count - 3, h[2] - 14),
        );
      body += line(`M7 ${y - 2}h114m-114 5h114`, '#8c8c76', 2);
    } else {
      body += rect(6, 110, 116, 6);
      if (shape === 'ruins' && detail !== 'columns') {
        body += h
          .map((height, i) => {
            const x = 10 + i * 23,
              y = 113 - height * 0.4;
            return (
              rect(x, y, 18, 113 - y) +
              line(`M${x} ${y + 7}h18m-18 7h18m-13-14v7m8 0v7`, '#ac9f7e')
            );
          })
          .join('');
        if (detail === 'drystone')
          body += repeat(4, (i) =>
            line(`M${10 + i * 5} ${106 - i * 8}q50-17 96 0`, '#d5cfb0', 3),
          );
      } else {
        body += h
          .map((height, i) => {
            const x = 13 + i * 24,
              y = 114 - height;
            return (
              rect(x, y, shape === 'gate' ? 15 : 9, height) +
              rect(x - 3, y - 4, shape === 'gate' ? 21 : 15, 6) +
              line(`M${x + 3} ${y + 7}v${height - 9}`, '#c2b694')
            );
          })
          .join('');
      }
      if (shape === 'columns')
        body += path(`M6 ${120 - h[2]}l58-19 58 19v7H6z`);
      if (shape === 'gate') body += rect(9, 114 - Math.max(...h), 110, 12);
    }
  } else if (['stelae', 'jars', 'tomb', 'observatory'].includes(shape)) {
    body = path('M5 112l54-15 63 15-58 11z', 'grass');
    body += h
      .map((height, i) => {
        const x = 13 + i * 23,
          y = 114 - height;
        if (shape === 'tomb')
          return (
            `<path d="M${x - 3} 113q-3-${height} 11-${height}t11 ${height}z" fill="${paint(material)}" stroke="#81785d"/>` +
            arch(x + 4, 103, 7, 11)
          );
        if (detail === 'spheres')
          return `<circle cx="${x + 6}" cy="${112 - height / 3}" r="${height / 3}" fill="${paint('stone')}" stroke="#79785f"/><ellipse cx="${x}" cy="${106 - height / 3}" rx="${height / 8}" ry="${height / 10}" fill="#d6ceb1"/>`;
        return (
          rect(x, y, 13, height) +
          line(`M${x + 3} ${y + 10}l7 7-7 7 7 8m-7 8h7`, '#7c7359', 1.3) +
          (detail === 'heads' || detail === 'army'
            ? `<circle cx="${x + 6}" cy="${y}" r="7" fill="${paint(material)}"/>${line(`M${x + 3} ${y}h7m-4-3v7`, '#6e6858')}`
            : '')
        );
      })
      .join('');
    if (shape === 'observatory')
      body += repeat(13, (i) =>
        rect(6 + i * 9, 66 + Math.abs(i - 6) * 3, 5, 47 - Math.abs(i - 6) * 3),
      );
  } else if (['industrial', 'mine'].includes(shape)) {
    body =
      shape === 'mine'
        ? path(contour, 'mountain') + arch(42, 77, 44, 37)
        : rect(9, 71, 111, 43, 'sandstone') +
          roof(9, 71, 111, 26) +
          repeat(10, (i) => arch(14 + i * 10, 83, 6, 22));
    body += [1, 3]
      .map(
        (i) =>
          rect(9 + i * 24, 114 - h[i], 13, h[i]) +
          line(`M${15 + i * 24} ${118 - h[i]}v${h[i] - 7}`, '#b3a282'),
      )
      .join('');
    body += `<circle cx="65" cy="52" r="16" fill="none" stroke="#8d7854" stroke-width="4"/>${line('M49 52h32M65 36v32M54 41l22 22m0-22-22 22', '#b49b6d', 2)}`;
    if (detail === 'silk')
      body += repeat(5, (i) => line(`M${45 + i * 9} 80v25`, '#e0d9b3', 2));
  } else {
    const aquatic =
      [
        'lakes',
        'wetland',
        'mangrove',
        'reef',
        'island',
        'coast',
        'fjord',
        'waterworks',
      ].includes(shape) || profile.placement !== 'land';
    if (aquatic) body += water;
    if (['peaks', 'pillars', 'redrocks', 'glacier'].includes(shape)) {
      body += h
        .map((height, i) => {
          const x = 3 + i * 23,
            y = 114 - height;
          const fill =
            shape === 'redrocks' || shape === 'pillars'
              ? 'sandstone'
              : 'mountain';
          return (
            path(
              `M${x} 114l4-${height * 0.6} 10-${height * 0.4} 9 ${height * 0.3} 6 ${height * 0.7}z`,
              fill,
            ) +
            line(
              `M${x + 14} ${y + 4}l-4 ${height * 0.51} 12 ${height * 0.32}m-8-${height * 0.49} 8 ${height * 0.28}`,
              '#a6ac95',
              0.8,
            )
          );
        })
        .join('');
    } else if (
      [
        'cliff',
        'rocktemple',
        'clifftemple',
        'cliffbuddha',
        'cave',
        'fjord',
      ].includes(shape)
    ) {
      body += path(
        `M5 113V${117 - h[0]}l20-8 18 4 23-${Math.abs(h[1] - h[2]) / 2} 25 5 31 10v${h[0] - 5}l-57 13z`,
        'sandstone',
      );
      body += repeat(7, (i) =>
        line(`M8 ${49 + i * 9}l32-4 22 5 26-2 32 5`, '#baa180', 0.9),
      );
    } else if (
      [
        'forest',
        'garden',
        'terraces',
        'wetland',
        'mangrove',
        'savanna',
        'lakes',
        'island',
        'coast',
        'waterworks',
        'reef',
      ].includes(shape)
    ) {
      body += path(
        `M5 112l29-${13 + h[0] / 6} 55 4 34 12-58 11z`,
        detail === 'dunes' ? 'sandstone' : 'grass',
      );
    } else body += path(contour, 'mountain');
    if (['peaks', 'glacier'].includes(shape))
      body += h
        .map((height, i) =>
          path(`M${6 + i * 25} ${131 - height}l6-17 12 16-8-3-5 5z`, 'snow'),
        )
        .join('');
    if (shape === 'cave') {
      body +=
        arch(30, 45, 68, 68) +
        repeat(5, (i) =>
          path(`M${32 + i * 14} 48l5 ${14 + h[i] / 5} 7-${14 + h[i] / 5}z`),
        );
      if (detail === 'caveriver')
        body += `<path d="M50 90l15-7 10 30-20 7z" fill="#83bdbe"/>`;
    }
    if (['rocktemple', 'clifftemple', 'cliffbuddha'].includes(shape)) {
      body += repeat(3, (i) => {
        const y = 114 - h[i + 1] * 0.72,
          x = 25 + i * 31;
        return (
          arch(x, y, 19, 111 - y) +
          (shape === 'cliffbuddha' && entry.id !== 'bamiyan'
            ? `<circle cx="${x + 9}" cy="${y + 13}" r="5" fill="#c7b798"/>${path(`M${x + 3} 108l3-${90 - y}h7l5 ${90 - y}z`)}`
            : '')
        );
      });
    }
    if (
      [
        'forest',
        'garden',
        'wetland',
        'mangrove',
        'savanna',
        'lakes',
        'island',
        'coast',
        'fjord',
      ].includes(shape) &&
      !['dunes', 'stromatolite', 'whale', 'waterbirds'].includes(detail)
    )
      body += h
        .map((height, i) =>
          tree(13 + i * 25, 111 - (i % 2) * 8, height, detail === 'palm'),
        )
        .join('');
    if (detail === 'dunes')
      body += repeat(
        4,
        (i) =>
          `<path d="M${8 + i * 27} 111q12-${38 + h[i] / 2} 27 0" fill="#dfd4ac" stroke="#c3b78d"/>`,
      );
    if (shape === 'reef')
      body += repeat(8, (i) =>
        line(
          `M${13 + i * 14} 114v-${14 + h[i % 5] / 3}m0 8-6-7m6 3 6-9`,
          i % 2 ? '#deaf99' : '#c6b587',
          2.7,
        ),
      );
    if (['lakes', 'wetland', 'island'].includes(shape) || detail === 'lagoon')
      body += `<ellipse cx="64" cy="${101 - h[2] / 4}" rx="${23 + h[0] / 5}" ry="10" fill="#8dc5c0" stroke="#d0dfbc" stroke-width="2"/>`;
    if (['terraces', 'waterworks'].includes(shape))
      body += repeat(
        6,
        (i) =>
          `<path d="M${9 + i * 5} ${109 - i * 9}q${51 - i * 5} 20 ${103 - i * 10} 0" fill="none" stroke="${detail === 'whitewater' ? '#e7e6d0' : '#c2c795'}" stroke-width="5"/>`,
      );
    if (['volcano', 'crater'].includes(shape))
      body += `<ellipse cx="62" cy="${118 - h[2]}" rx="16" ry="6" fill="#695c51"/>${line('M44 79l14 12 9 20', detail === 'lava' ? '#d88c57' : '#b8c1a1', 2)}`;
    if (shape === 'waterfall' || detail === 'waterfall')
      body += `<path d="M75 ${123 - h[3]}l10 3-4 ${h[3] - 15}-12 2z" fill="#b4d9d0"/>${line(`M78 ${132 - h[3]}l-4 ${h[3] - 30}`, '#ebf0d9', 2)}`;
    if (detail === 'bands')
      body += repeat(6, (i) =>
        line(`M12 ${62 + i * 8}q49 13 98-3`, i % 2 ? '#6e6858' : '#ceaa79', 3),
      );
    if (detail === 'archrock') body += arch(43, 63, 45, 51);
    if (detail === 'rift')
      body += `<path d="M58 58l10 8-8 18 12 22-13 11-10-10 9-22-8-14z" fill="#435c58"/>`;
  }

  if (shape === 'columns') {
    const height = 60 + h[2] / 6,
      width = 100 + h[0] / 8,
      x = 64 - width / 2,
      y = 109 - height;
    body =
      repeat(3, (i) =>
        rect(x - 5 - i * 2, 110 + i * 3, width + 10 + i * 4, 3),
      ) +
      repeat(6, (i) => {
        const at = x + (i * (width - 8)) / 5;
        return (
          rect(at, y, 8, height) +
          rect(at - 2, y - 4, 12, 5) +
          line(`M${at + 3} ${y + 5}v${height - 7}`, '#d1c5a3')
        );
      }) +
      rect(x - 3, y - 10, width + 6, 7);
    if (entry.id !== 'baalbek')
      body += path(
        `M${x - 6} ${y - 10}l${width / 2 + 6}-16 ${width / 2 + 6} 16z`,
      );
  }
  if (entry.id === 'uluru') {
    body =
      path(
        `M7 112q-4-${h[1]} 31-${h[1]}l48-3q37 2 35 ${h[1] + 3}l-57 10z`,
        'sandstone',
      ) +
      repeat(9, (i) =>
        line(
          `M${21 + i * 11} ${51 + (i % 3) * 3}q-5 22 2 ${44 + (i % 4)}`,
          '#bd9975',
          1.2,
        ),
      );
  } else if (entry.id === 'plitvice') {
    body =
      path('M7 112l28-73 62 7 25 65-57 12z', 'grass') +
      repeat(
        4,
        (i) =>
          `<ellipse cx="${55 + i * 7}" cy="${54 + i * 17}" rx="${21 + i * 6}" ry="7" fill="#89c8be" stroke="#d3d6ad" stroke-width="3"/><path d="M${54 + i * 7} ${60 + i * 17}v12m5-12v12" stroke="#c4e2d4" stroke-width="3"/>`,
      ) +
      tree(15, 111, 51) +
      tree(111, 112, 63);
  } else if (entry.id === 'cappadocia') {
    body =
      path('M4 113l58-21 62 20-59 11z', 'sandstone') +
      h
        .map((height, i) => {
          const x = 3 + i * 24,
            y = 114 - height;
          return (
            path(`M${x} 114l11-${height} 15 ${height}z`, 'sandstone') +
            path(`M${x + 3} ${y + 24}l8-28 13 26z`, 'mountain') +
            arch(x + 9, 94, 6, 14) +
            arch(x + 10, y + 40, 5, 7)
          );
        })
        .join('');
  } else if (
    entry.id === 'aldabra' ||
    entry.id === 'tubbataha' ||
    entry.id === 'sanganeb'
  ) {
    body =
      water +
      `<ellipse cx="64" cy="99" rx="56" ry="20" fill="#b5c69a" stroke="#83b6b2" stroke-width="5"/><ellipse cx="64" cy="98" rx="${31 + h[1] / 8}" ry="13" fill="#6fabb2"/>` +
      repeat(7, (i) =>
        line(
          `M${18 + i * 15} ${105 + (i % 3)}v-9m0 5-4-5m4 4 4-6`,
          '#cfad8f',
          2,
        ),
      );
  } else if (entry.id === 'cordouan') {
    body =
      water +
      path('M35 112l8-33h43l8 33z') +
      rect(49, 49, 31, 34) +
      path('M51 49l5-24h16l6 24z') +
      rect(55, 15, 18, 13, 'glass') +
      roof(54, 15, 20, 8) +
      repeat(6, (i) =>
        line(`M${43 + i} ${105 - i * 13}h${43 - i * 3}`, '#d6d1b8', 2),
      ) +
      arch(59, 87, 10, 23);
  } else if (entry.id === 'qinmausoleum') {
    body =
      path('M6 114l54-23 62 20-58 12z', 'sandstone') +
      repeat(18, (i) => {
        const row = Math.floor(i / 6),
          x = 12 + (i % 6) * 19 + row * 3,
          y = 59 + row * 23;
        return (
          `<circle cx="${x}" cy="${y}" r="4.3" fill="#c2a77f"/>` +
          path(`M${x - 5} ${y + 6}h10l2 17h-14z`, 'sandstone') +
          line(`M${x - 4} ${y + 9}h8m-8 5h8m-8 5h8m-6 4v7m4-7v7`, '#8d775d', 1)
        );
      });
  } else if (entry.id === 'yasawi') {
    body =
      path('M52 58q0-45 25-45t25 45z', 'glass') +
      rect(46, 59, 62, 54) +
      rect(17, 35, 65, 79, 'sandstone') +
      arch(27, 44, 45, 70) +
      line('M20 38h59m-57 5v66m54-66v66M91 60v49', '#7da8a7', 2.5);
  } else if (entry.id === 'geghard') {
    body =
      path('M3 113l12-65 25-22 34 12 30-11 22 86-62 10z', 'mountain') +
      rect(34, 73, 63, 40) +
      roof(31, 73, 69, 17) +
      rect(53, 43, 26, 32) +
      roof(51, 43, 30, 21) +
      arch(57, 90, 16, 23) +
      line('M66 22V9m-5 5h10', '#d5c6a0', 1.4) +
      arch(17, 83, 13, 30);
  } else if (entry.id === 'bagerhat') {
    body =
      rect(10, 76, 110, 38, 'sandstone') +
      repeat(8, (i) => arch(16 + i * 13, 88, 8, 25)) +
      repeat(12, (i) => {
        const x = 19 + (i % 6) * 17,
          y = 65 + Math.floor(i / 6) * 12;
        return path(`M${x - 8} ${y}q0-17 8-17t8 17z`, 'sandstone');
      }) +
      rect(7, 56, 9, 58) +
      rect(114, 56, 9, 58);
  } else if (entry.id === 'canaima') {
    body =
      water +
      path('M5 113V40l28-8 19 7v75z', 'mountain') +
      path('M57 114V31l38-6 28 13v77z', 'mountain') +
      path('M5 40l28-8 19 7-24 9z', 'grass') +
      path('M57 31l38-6 28 13-37 5z', 'grass') +
      repeat(6, (i) => line(`M7 ${55 + i * 9}l42 3m11-8 60 5`, '#a6aa91')) +
      `<path d="M80 39h11l-3 74h-13z" fill="#b5dace"/>${line('M84 43l-5 64m8-60-4 55', '#f0edda', 2)}`;
  } else if (entry.id === 'kutnahora') {
    body =
      rect(14, 77, 103, 37) +
      repeat(7, (i) => arch(20 + i * 14, 87, 8, 25)) +
      repeat(3, (i) =>
        path(
          `M${12 + i * 35} 78q18-15 18-${42 + h[i] / 5} 0 ${27 + h[i] / 5} 18 ${42 + h[i] / 5}z`,
          'slate',
        ),
      ) +
      repeat(7, (i) => rect(17 + i * 15, 75, 3, 40));
  } else if (
    entry.id === 'porec' ||
    entry.id === 'congonhas' ||
    entry.id === 'boyana' ||
    entry.id === 'mtskheta'
  ) {
    body =
      rect(28, 67, 73, 46) +
      roof(25, 67, 79, 24) +
      rect(47, 63, 36, 50) +
      roof(44, 63, 42, 22) +
      arch(57, 91, 15, 22) +
      line('M65 41V29m-5 5h10', '#d4c397', 1.4);
    if (entry.id !== 'boyana')
      body += [18, 98]
        .map(
          (x) =>
            rect(x, 37, 15, 76) + roof(x, 37, 15, 15) + arch(x + 4, 44, 7, 13),
        )
        .join('');
    if (entry.id === 'congonhas')
      body += repeat(4, (i) =>
        path(`M${18 - i * 3} ${111 + i * 3}h${91 + i * 6}v3H${18 - i * 3}z`),
      );
  } else if (entry.id === 'lumbini') {
    body =
      path('M6 112l55-23 62 22-59 12z', 'grass') +
      rect(27, 78, 62, 34, 'marble') +
      rect(23, 71, 70, 8, 'sandstone') +
      arch(49, 87, 16, 25) +
      rect(101, 39, 6, 73) +
      rect(98, 35, 12, 5) +
      tree(14, 110, 62);
  } else if (entry.id === 'quseiramra') {
    body =
      rect(18, 79, 88, 34, 'sandstone') +
      repeat(3, (i) =>
        path(`M${16 + i * 30} 79q0-30 15-30t15 30z`, 'sandstone'),
      ) +
      arch(50, 90, 14, 23) +
      rect(9, 88, 16, 25, 'sandstone');
  } else if (entry.id === 'mycenae') {
    body =
      rect(6, 59, 39, 55) +
      rect(84, 56, 38, 58) +
      rect(40, 40, 47, 19) +
      rect(45, 59, 7, 55) +
      rect(77, 59, 7, 55) +
      path('M44 40l20-22 19 22z') +
      line(
        'M8 74h35m-35 16h35m-35 15h35m43-31h34m-34 17h34M64 24v14',
        '#d6c9a7',
        1.8,
      );
  } else if (entry.id === 'shakhrisyabz') {
    body =
      rect(13, 28, 28, 86, 'sandstone') +
      rect(87, 24, 27, 90, 'sandstone') +
      line('M17 32v77m20-77v77M91 29v80m19-80v80', '#6ca4ac', 3) +
      path('M41 69q7-18 17-24l-1 11-16 25z', 'glass') +
      path('M87 67q-9-18-18-24v11l18 26z', 'glass');
  }
  if (
    detail === 'lakeside' ||
    detail === 'terracedtown' ||
    (shape === 'coast' && detail === 'seabird')
  ) {
    body += repeat(5, (i) => {
      const x = 12 + i * 21,
        y = 95 - h[i] / 4;
      return (
        rect(x, y, 16, 114 - y) + roof(x, y, 16, 10) + arch(x + 5, y + 8, 5, 11)
      );
    });
  }
  if (detail === 'stromatolite')
    body += repeat(
      8,
      (i) =>
        `<ellipse cx="${13 + i * 14}" cy="${105 + (i % 3) * 3}" rx="6" ry="${4 + h[i % 5] / 12}" fill="#9b9d80"/>`,
    );

  if (
    [
      'mosaic',
      'fresco',
      'relief',
      'engravings',
      'sculpture',
      'deer',
      'horse',
      'fossils',
    ].includes(detail)
  )
    body += repeat(4, (i) =>
      line(
        `M${27 + i * 19} 96v-12l5-5 5 5v7l-7 5m-2-5 9 8`,
        detail === 'mosaic' || detail === 'fresco' ? '#ad836c' : '#82775d',
        1.2,
      ),
    );
  if (['channels', 'drainage', 'causeway', 'forestwater'].includes(detail))
    body += line('M20 104l21-12 20 11 22-12 27 14m-49-2-10 13', '#8dc7c6', 3);
  if (['tiles', 'blue', 'lattice'].includes(detail))
    body += line(
      'M20 84h89m-78 7h65',
      detail === 'blue' ? '#68a2ac' : '#d9bb81',
      2,
    );
  if (detail === 'glasshouse')
    body +=
      path('M35 111V82q29-43 58 0v29z', 'glass') +
      line('M35 88h58M64 65v46m-16-37v37m32-37v37', '#dfdfc2', 1.5);
  return `<g class="expanded-landmark" data-expansion-shape="${shape}" data-place-detail="${detail}" style="--landmark-accent:${color}">${body}</g>`;
}
