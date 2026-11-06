// Original architectural illustrations, distributed under the repository MIT license.
// Material patterns use local SVG geometry, not raster noise or runtime downloads.
// Every instance owns its paint IDs so cards, dialogs and island copies never collide.
let instance = 0;
export function art(id: string) {
  const prefix = `landmark-art-${++instance}`;
  const url = (name: string) => `url(#${prefix}-${name})`;
  const gradient = (name: string, light: string, mid: string, dark: string) =>
    `<linearGradient id="${prefix}-${name}" x1="0" y1="0" x2="1" y2=".7"><stop stop-color="${light}"/><stop offset=".45" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/></linearGradient>`;
  const defs = `<defs>${gradient('stone', '#e0d0af', '#bba17a', '#796c55')}${gradient('sandstone', '#e3b497', '#c08465', '#774b3c')}${gradient('marble', '#fff9e8', '#dedace', '#989e98')}${gradient('slate', '#a4aaa1', '#778277', '#424e48')}${gradient('copper', '#a1c5b0', '#638f7f', '#355a50')}${gradient('iron', '#c0a58a', '#846e59', '#483c34')}${gradient('snow', '#fcfbef', '#d4e1df', '#879daa')}${gradient('mountain', '#969b94', '#677781', '#364a5a')}${gradient('grass', '#a6ac76', '#6f8758', '#3e5940')}
  <pattern id="${prefix}-masonry" width="13" height="8" patternUnits="userSpaceOnUse"><path d="M0 .4H13M0 4.4H13M4 0v4m6 0v4" stroke="#514337" stroke-opacity=".25" stroke-width=".55"/><path d="M0 1H13M0 5H13" stroke="#fff4d2" stroke-opacity=".25" stroke-width=".4"/><path d="M1 2h2m4 4h2m1-4h1" stroke="#fff7e3" stroke-opacity=".28" stroke-width=".65"/><path d="M6 2h2m-6 5h1" stroke="#433d33" stroke-opacity=".14" stroke-width=".5"/></pattern>
  <pattern id="${prefix}-grain" width="11" height="13" patternUnits="userSpaceOnUse"><path d="M1 3l2-.7m4 6 2-.5M4 12l1-2m4-7 1 2" stroke="#342e27" stroke-opacity=".2" stroke-width=".65"/><path d="M3 5l3 1m1 6h2M8 1h2" stroke="#fff3d4" stroke-opacity=".3" stroke-width=".7"/><circle cx="2" cy="8" r=".45" fill="#322e26" opacity=".2"/></pattern>
  <pattern id="${prefix}-tiles" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(25)"><path d="M0 0h5v5" fill="none" stroke="#817d69" stroke-opacity=".35" stroke-width=".45"/><path d="M1 1h3" stroke="#fffdf0" stroke-opacity=".8" stroke-width=".5"/></pattern></defs>`;
  const surface = (d: string, material = 'stone', texture = 'masonry') =>
    `<path d="${d}" fill="${url(material)}"/><path d="${d}" fill="${url(texture)}"/>`;
  const line = (d: string, color = '#fff0d1', width = 0.7, opacity = 0.65) =>
    `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" opacity="${opacity}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const arch = (
    x: number,
    y: number,
    w: number,
    h: number,
    color = '#4d463c',
  ) =>
    `<path d="M${x} ${y + h}v${-h + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0v${h - w / 2}z" fill="${color}"/>${line(`M${x - 0.8} ${y + h}v${-h + w / 2}a${w / 2 + 0.8} ${w / 2 + 0.8} 0 0 1 ${w + 1.6} 0v${h - w / 2}`, '#f1dec0', 0.7, 0.6)}`;
  const rows = (count: number, fn: (i: number) => string) =>
    Array.from({ length: count }, (_, i) => fn(i)).join('');
  let body = '';
  if (id === 'eiffel') {
    body = `<path d="M23 118L49 64l10-40h10l10 40 26 54H88L71 86H57l-17 32z" fill="${url('iron')}"/>
      <path d="M41 105l12-31h22l13 31-13-17H54zM55 64l9-34 9 34z" fill="#b9b9a5" opacity=".15"/>
      <path d="M47 96Q64 65 81 96l7 22H40z" fill="none" stroke="#685a49" stroke-width="2.2"/>
      ${rows(6, (i) => {
        const y = 105 - i * 7,
          a = 28 + i * 3.4,
          b = 48 + i * 1.9;
        return line(
          `M${a} ${y}l${b - a - 2} -7m${-(b - a - 2)} 0l${b - a - 1} 7M${128 - a} ${y}l${-(b - a - 2)} -7m${b - a - 2} 0l${-(b - a - 1)} 7`,
          '#e0c5a3',
          0.8,
        );
      })}
      ${rows(5, (i) => {
        const y = 60 - i * 6,
          w = 18 - i * 2.3;
        return line(
          `M${64 - w / 2} ${y}l${w - 2} -6m${-w + 2} 0l${w - 2} 6`,
          '#edceab',
          0.7,
        );
      })}
      ${line('M24 118L50 63l11-39M104 118L78 63 67 24M59 24h10M63 24V6m2 18V9', '#503e2f', 1.1, 0.9)}
      <path d="M43 70h42v5H43zM51 58h26v4H51zM58 23h12v4H58z" fill="${url('iron')}"/>
      ${line('M43 70h42M51 58h26M58 23h12', '#edc9a2', 1)}
      ${rows(14, (i) => line(`M${45 + i * 2.8} 70v4`, '#40362d', 0.55))}`;
  } else if (id === 'colosseum') {
    body = `<ellipse cx="64" cy="52" rx="54" ry="24" fill="#786c56"/><ellipse cx="64" cy="52" rx="39" ry="13" fill="#393f34"/>${surface('M10 51Q63 85 118 51v48Q65 131 10 99z')}${surface('M10 51V40Q36 17 74 28v17Q35 35 10 61z')}
      ${rows(3, (row) =>
        rows(11, (col) => {
          const x = 15 + col * 9.3,
            curve = Math.sin(((col + 0.5) / 11) * Math.PI) * 15;
          return arch(x, 54 + curve + row * 13, 5.4, 9.5);
        }),
      )}
      ${rows(3, (r) => line(`M10 ${62 + r * 13}Q64 ${94 + r * 13} 118 ${62 + r * 13}`, '#ecddbd', 1.4))}
      ${rows(5, (i) => arch(18 + i * 10, 34 - Math.sin((i / 4) * Math.PI) * 6, 5.5, 11))}
      ${line('M10 40Q36 17 74 28M10 51Q64 83 118 51M10 99Q64 130 118 99', '#f2e4c4', 1)}
      <path d="M74 28l-5 5 3 5-8 3 2 4 9-1z" fill="#c1aa86"/>`;
  } else if (id === 'stonehenge') {
    const stone = (x: number, y: number, w: number, h: number) =>
      `${surface(`M${x} ${y + h}l2-${h - 3} ${w - 4}-3 3 ${h}z`, 'slate', 'grain')}<path d="M${x + w - 4} ${y}l3 ${h} 4-3-2-${h - 2}z" fill="#48594b"/>${line(`M${x + 3} ${y + 6}l-1 ${h - 11}`, '#cbd1b5', 1.4, 0.4)}`;
    body = `<ellipse cx="64" cy="112" rx="54" ry="9" fill="#77825c" opacity=".3"/>${stone(21, 48, 14, 58)}${stone(78, 44, 13, 60)}${stone(46, 42, 12, 62)}${stone(7, 54, 16, 60)}${stone(40, 46, 18, 70)}${stone(89, 52, 18, 63)}${surface('M5 43l29-4 5 7-2 12-31 2z', 'slate', 'grain')}${surface('M35 31l41-2 5 9-2 13-42 1z', 'slate', 'grain')}${surface('M76 40l37 4 4 11-4 9-35-5z', 'slate', 'grain')}${line('M6 43l28-3M37 32l38-2M78 41l34 4', '#d4d7c2', 1.3)}${line('M14 83l3-10 1 20M47 63l4 8-3 17M98 78l-3 16', '#344b3d', 1, 0.6)}<path d="M9 108l12-2 3 7-16 2m33-2 17-1-2 7-15-2m49-4 16-2 2 5-18 2" fill="#66784a" opacity=".7"/>`;
  } else if (id === 'liberty') {
    body = `${surface('M39 117v-9h4V88h33v20h6v9z')}${surface('M47 88l-2-11 7-28-13-12-5-22 6-2 8 20 14 8 12 3 7 25-9 4 2 15z', 'copper', 'grain')}
      <path d="M53 50l-6 36h9l5-40 3 40h9l-3-42z" fill="#40685b" opacity=".65"/>
      ${line('M52 49l-3 32m10-32-5 35m13-34 3 31M43 36l12 13M49 64l18 4', '#b3c7a8', 1.2, 0.7)}
      <path d="M69 47l11 2-3 20-10-2z" fill="#477565"/>${line('M70 49l8 2-2 15', '#b7c2a2', 0.8)}
      <path d="M55 38l-2-11 4-6 10 1 5 7-5 12z" fill="${url('copper')}"/>
      <path d="M54 28l-8-5 9 1-3-10 7 8 3-12 3 12 8-8-4 11 10-2-8 6z" fill="#6e9986"/>
      ${line('M59 29h2m4 0h2m-5 2-1 4 4 1', '#304e44', 0.8, 0.8)}
      <path d="M32 16l-2-7 4-2 1-7 5 6 1 8-3 4z" fill="#c8a366"/><path d="M30 17h12v4H30z" fill="#58796a"/>
      ${line('M43 91h33M43 107h33M39 113h43', '#f4e1b9', 1)}${rows(4, (i) => arch(47 + i * 7, 94, 3, 9, '#7a705d'))}`;
  } else if (id === 'opera') {
    body = `${surface('M5 109l24-10 89 2 5 14-89 6-29-6z')}
      ${surface('M11 103L6 65q25 3 48 41z', 'marble', 'tiles')}${surface('M35 106L28 24q38 18 48 82z', 'marble', 'tiles')}${surface('M59 107L70 12q26 31 31 94z', 'marble', 'tiles')}${surface('M81 107l30-62q12 28 9 60z', 'marble', 'tiles')}
      <path d="M28 24q14 53 20 83l-13-1zM70 12l8 95H59zM111 45l-14 62H81z" fill="#9aabac" opacity=".35"/>
      ${line('M6 65q25 3 48 41M28 24q38 18 48 82M70 12q26 31 31 94M111 45q12 28 9 60', '#fffbea', 1.4, 0.95)}
      <path d="M38 104l12-17 17 19zm34 2 10-24 14 24zm29 0 11-16 8 15z" fill="#526c71"/>
      ${rows(8, (i) => line(`M${42 + i * 3} 105l2-10`, '#b2c0b7', 0.6))}${line('M9 113l27 4 84-6', '#eee2c4', 1.2)}`;
  } else if (id === 'fuji') {
    body = `${surface('M3 114l19-21 20-31 15-30 12-8 8 4 13 35 19 30 17 21z', 'mountain', 'grain')}
      <path d="M69 24L43 112H13l29-50 15-30z" fill="#b5b4a2" opacity=".35"/>
      ${surface('M45 57l12-25 12-8 8 4 12 33-11-9-3 9-7-16-7 14-5-8-8 13z', 'snow', 'grain')}
      ${line('M56 39l8-10 11 1M62 52l-14 38-11 16M77 56l12 30 12 18M55 64l-12 18M70 68l-9 37', '#c9d0c5', 0.8, 0.5)}
      <path d="M4 112l15-7 6 5 11-7 7 5 17-5 12 6 19-5 11 7 14-5 9 8z" fill="#3c594a"/>
      <path d="M3 115q34-4 63 0t61 0v7H3z" fill="#6c9295" opacity=".7"/>${line('M16 118h31m30 1h28', '#d1dfcc', 0.6)}`;
  } else if (id === 'taj') {
    const minaret = (x: number, y: number) =>
      `${surface(`M${x} 113l1-${113 - y}h5l1 ${113 - y}z`, 'marble', 'grain')}<path d="M${x - 2} ${y}q5-10 11 0z" fill="${url('marble')}"/>${line(`M${x - 1} ${y + 18}h9m-9 18h9m-9 18h9`, '#9d9985', 1)}`;
    body = `${minaret(11, 50)}${minaret(105, 50)}${surface('M26 111V67l14-5h48l15 5v44z', 'marble', 'grain')}${surface('M43 62Q34 44 49 34l15-13 15 13q15 10 6 28z', 'marble', 'grain')}
      <path d="M64 21q-9 19-8 41H44Q34 44 49 34z" fill="#fffdf1" opacity=".6"/>
      ${line('M64 21V12m-3 5h6M42 63h44M25 70h79M26 109h77', '#9d937c', 0.8)}
      ${arch(53, 74, 22, 37, '#7b8077')}${arch(58, 81, 12, 30, '#3d514e')}
      ${rows(2, (i) => arch(32 + i * 53, 76, 9, 14, '#879084') + arch(32 + i * 53, 94, 9, 13, '#66786d'))}
      ${surface('M29 65V53h14v12zM85 65V53h14v12z', 'marble', 'grain')}<path d="M27 53q9-18 18 0zm56 0q9-18 18 0z" fill="${url('marble')}"/>
      ${minaret(4, 64)}${minaret(115, 64)}${surface('M3 113h121v6H3z', 'marble', 'tiles')}
      ${line('M51 111V77q13-18 26 0v34M47 71v38m34-38v38', '#c3b59e', 0.65)}`;
  } else if (id === 'petra') {
    body = `${surface('M8 118l-1-76 9-20 9-11 8 9 18-11 16 5 12-8 16 13 13-2 13 28-2 73z', 'sandstone', 'grain')}
      ${line('M14 26l5 17-5 28 5 26M110 35l-5 18 6 23-4 27M32 14l6 8m49-8 7 14', '#774b3c', 1.2, 0.5)}
      <path d="M23 116V65h82v51zM28 60V43h72v17z" fill="#855740"/>
      ${surface('M20 63h88v7H20zM20 112h88v6H20zM26 43l18-17 19 17zM67 43l18-17 18 17z', 'sandstone')}
      ${rows(6, (i) => {
        const x = 27 + i * 13;
        return (
          surface(`M${x} 110V74h6v36z`, 'sandstone', 'grain') +
          line(`M${x + 1} 76v32`, '#e9b294', 1) +
          surface(`M${x - 2} 70h10v4h-10zM${x - 2} 110h10v3h-10z`, 'sandstone')
        );
      })}
      ${surface('M51 61V39l12-7 12 7v22z', 'sandstone', 'grain')}${arch(57, 41, 12, 20, '#8c5941')}
      <path d="M53 34l10-8 11 8zM61 26v-7h5v7z" fill="#d9a080"/>
      ${arch(54, 80, 20, 32, '#392d26')}${line('M25 66h78M30 44h18m30 0h21M19 116h90', '#edc0a0', 1)}${surface('M15 118h98v4H15z', 'sandstone')}`;
  } else if (id === 'chichen') {
    body = rows(9, (i) => {
      const y = 112 - i * 8,
        left = 8 + i * 4.5,
        right = 120 - i * 3.8;
      return (
        surface(
          `M${left} ${y}L62 ${y - 7} ${right} ${y - 3}v7L62 ${y + 4} ${left} ${y + 7}z`,
        ) +
        `<path d="M62 ${y - 7}L${right} ${y - 3}v7L62 ${y + 4}z" fill="#6c654e" opacity=".3"/>` +
        line(`M${left} ${y}L62 ${y - 7} ${right} ${y - 3}`, '#ead9b6', 0.8)
      );
    });
    body += `${surface('M41 43V20l22-5 24 6v22l-23 4z')}
      <path d="M64 16v31l23-4V21z" fill="#796d54" opacity=".6"/>${arch(49, 25, 8, 17, '#393e34')}${arch(70, 25, 8, 16, '#393e34')}
      ${surface('M39 19l25-6 25 6v5l-25-5-25 5z')}
      <path d="M57 47h12l7 73H41z" fill="#aca081"/>
      ${rows(19, (i) => {
        const y = 49 + i * 3.6,
          left = 57 - i * 0.82,
          right = 69 + i * 0.37;
        return line(`M${left} ${y}h${right - left}`, '#4a4b3a', 0.75, 0.65);
      })}
      ${line('M56 47l-18 73m33-73 8 73', '#e4d4b0', 2, 0.85)}`;
  } else if (id === 'angkor') {
    const tower = (x: number, y: number, h: number) =>
      `${surface(`M${x - 10} ${y + h}v-${h * 0.4}l3-4v-${h * 0.25}l4-6 3-${h * 0.2} 3 ${h * 0.2} 4 6v${h * 0.25}l3 4v${h * 0.4}z`, 'slate')}${rows(5, (i) => line(`M${x - 5 - i} ${y + 10 + (i * (h - 15)) / 5}h${10 + i * 2}`, '#c3ba93', 1, 0.7))}${arch(x - 3, y + h - 16, 6, 16, '#2e3b32')}`;
    body = `${tower(40, 32, 60)}${tower(89, 32, 60)}${surface('M7 114V89l24-9h66l24 9v25z', 'slate')}${tower(21, 51, 49)}${tower(106, 51, 49)}${tower(64, 9, 95)}
      ${rows(13, (i) => arch(11 + i * 8, 94, 4.5, 16, '#344236'))}${surface('M3 114h122v6H3z', 'slate')}${line('M5 114h117M29 87h21m28 0h22', '#d3c39c', 1.4)}
      <path d="M5 113l12-5 7 5 12-3 6 6H5m55-5 9-3 9 6 15-3 8 6H60" fill="#526846" opacity=".6"/>`;
  } else if (id === 'machu') {
    body = `${surface('M18 91l16-34 13-9 8-19 13-16 6-9 9 16 5 23 12 23 14 30z', 'grass', 'grain')}
      <path d="M74 4l-8 44-9 19-4 32h35l-8-42 5-14-2-23z" fill="#2f5042" opacity=".5"/>${line('M69 19l-4 26-12 20m28-35-3 19 12 23', '#c3c399', 1, 0.5)}
      ${rows(6, (i) => surface(`M${3 + i * 3} ${119 - i * 7}l37-15 81 9v5l-81-8-37 15z`, 'stone') + `<path d="M${3 + i * 3} ${118 - i * 7}l37-15 81 9-4 2-77-8-34 14z" fill="#8a9b60"/>`)}
      ${rows(7, (i) => {
        const x = 28 + (i % 4) * 18,
          y = 88 - Math.floor(i / 4) * 16;
        return (
          surface(`M${x} ${y}v-13l7-7 10 6v13z`, 'slate') +
          `<path d="M${x + 7} ${y - 20}l10 6v13l-10-3z" fill="#5a6755"/>` +
          `<path d="M${x + 2} ${y - 8}h4v7h-4z" fill="#344239"/>`
        );
      })}`;
  } else if (id === 'gyeongbokgung') {
    const roof = (y: number, width: number) =>
      `${surface(`M${64 - width / 2} ${y}Q35 ${y - 2} 46 ${y - 19}h36q11 17 ${width / 2 - 18} 19l4 6H${60 - width / 2}z`, 'slate', 'tiles')}${line(`M${64 - width / 2} ${y}Q64 ${y + 9} ${64 + width / 2} ${y}`, '#b2bfa5', 1.5)}`;
    body = `${surface('M8 113l13-9h87l12 9v7H8z', 'marble')}${surface('M21 105V70h86v35z', 'sandstone', 'grain')}<path d="M26 76h76v27H26z" fill="#365d4b"/>${rows(7, (i) => line(`M${28 + i * 12} 75v30`, '#ad6245', 3))}${rows(6, (i) => line(`M${33 + i * 12} 80v20m-3-14h6m-6 6h6`, '#d9ba7c', 0.8))}${roof(66, 108)}${surface('M36 61V44h56v17z', 'sandstone', 'grain')}${rows(5, (i) => line(`M${40 + i * 12} 44v17`, '#448575', 2))}${roof(40, 78)}${line('M48 20h32M19 74h90M28 109h72', '#d8b580', 1.8)}<path d="M56 105h16l12 15H44z" fill="${url('marble')}"/>${rows(4, (i) => line(`M${54 - i * 2} ${109 + i * 3}h${20 + i * 4}`, '#7d8478', 0.7))}`;
  } else if (id === 'merlion') {
    body = `<ellipse cx="64" cy="115" rx="50" ry="8" fill="#71a4a4"/>${surface('M45 107q-13-20 5-44l-8-14 1-23 16-13 22 6 5 14-8 12-1 16q15 20 7 40l18-8-4 17-19 5z', 'marble', 'grain')}
      <path d="M48 61q-10-20-1-35l10-8 17 1-17 9-5 17 9 11z" fill="#a8b2a8"/>${line('M54 25l-7 14 11 12m-6-24-3 16 14 11m-6-28 7-3', '#697d76', 1)}<path d="M68 26l13 3 9 10-12 3-6-6-9-2z" fill="#f0ede0"/>${line('M70 28l6 1m1 8h8', '#4c665e', 1.4)}
      ${rows(6, (r) => rows(4, (c) => line(`M${45 + c * 10 + (r % 2) * 3} ${68 + r * 6}q4 6 8 0`, '#7e958b', 0.8)))}${line('M61 57q-23 31-7 49m21-45q16 24 6 40', '#f5f2de', 1.5)}<path d="M86 39q30 4 32 62" fill="none" stroke="#bce1df" stroke-width="4" opacity=".8"/>${line('M88 38q28 3 31 62M12 116q15-7 31 0t33 0t39 0', '#eef9e7', 1.2)}${surface('M33 111h54v7H33z', 'marble', 'tiles')}`;
  } else if (id === 'brandenburg') {
    body = `${surface('M5 112h118v7H5z')}${surface('M7 55h114v12H7zM23 39h82v16H23z')}${rows(
      6,
      (i) => {
        const x = 16 + i * 18;
        return (
          surface(`M${x} 110V68h7v42z`, 'stone', 'grain') +
          line(`M${x + 2} 70v38m2-38v38`, '#877a61', 0.7) +
          surface(`M${x - 2} 65h11v5h-11zM${x - 2} 108h11v4h-11z`)
        );
      },
    )}${surface('M1 73h10v37H1zM117 73h10v37h-10z')}${line('M8 59h112M24 43h80M8 114h112', '#f0e4cb', 1.3)}
      <path d="M48 39h31l-4-7H52zM62 32V17l3-4 4 5-2 14z" fill="${url('copper')}"/>${rows(
        4,
        (i) => {
          const x = 42 + i * 11;
          return `<path d="M${x} 32l1-12 4-6 4 4-3 5v10m-6-5-3 9m9-9 2 9" fill="${url('copper')}" stroke="#496c5c" stroke-width="1.4"/>`;
        },
      )}${line('M65 15V7m-3 3h6', '#658775', 1.4)}`;
  } else if (id === 'belem') {
    const turret = (x: number, y: number) =>
      `${surface(`M${x} 112V${y}h12v${112 - y}z`)}<path d="M${x - 2} ${y}l8-11 8 11z" fill="${url('stone')}"/>${arch(x + 4, y + 7, 4, 8)}`;
    body = `${surface('M13 110V81l90-8 15 35-51 13z')}${surface('M39 102V32h49v67z')}${rows(3, (r) => rows(3, (c) => arch(44 + c * 14, 40 + r * 18, 7, 12)))}${surface('M35 30h57v8H35z')}${rows(6, (i) => surface(`M${36 + i * 10} 30v-7h5v7z`))}${turret(31, 38)}${turret(85, 38)}${turret(7, 84)}${turret(106, 80)}${line('M47 96h32M39 57h49M39 75h49M18 109l47 7 41-10', '#f8ebc9', 1.1)}${rows(6, (i) => arch(27 + i * 12, 90, 5, 9))}<path d="M7 120q21-5 42 0t40 0t36 0" stroke="#79a9a8" stroke-width="3" fill="none"/>`;
  } else if (id === 'christ') {
    body = `${surface('M9 119l13-23 20-14 18-17 23 18 19 12 18 24z', 'grass', 'grain')}${surface('M43 118V101h42v17z', 'slate')}${surface('M54 101l3-48-9-4-35-2v-8l42 2 2-9h14l2 9 42-2v8l-35 2-9 4 3 48z', 'marble', 'tiles')}${surface('M57 32V19l7-5 8 5v13l-7 6z', 'marble', 'grain')}<path d="M65 53l1 48h8l-3-48 9-4 35-2v-4l-40 3-9-3z" fill="#879c99" opacity=".45"/>${line('M60 58l-3 40m7-43-2 45M18 42l34 3m24 0 33-3M60 23h3m4 0h3m-5 2v4', '#728b86', 0.9)}${line('M47 106h34M47 112h34', '#c8cbb4', 1)}`;
  } else if (id === 'burj') {
    body = `${surface('M33 118V98h7V80h7V60h6V43h5V28h4V12h4v16h4v19h5v22h6v20h7v16h8v13z', 'marble', 'tiles')}
      <path d="M64 12v106h32v-13h-8V89h-7V69h-6V47h-5V28h-4V12z" fill="#6f9aa6" opacity=".65"/>${rows(25, (i) => line(`M${i < 5 ? 35 : i < 10 ? 42 : i < 15 ? 49 : i < 20 ? 55 : 60} ${115 - i * 3.6}h${i < 5 ? 57 : i < 10 ? 42 : i < 15 ? 28 : i < 20 ? 17 : 8}`, '#cad9d5', 0.55, 0.9))}${line('M63 119V13m3 106V16m-6 102V33m10 85V48m-18 70V66m24 52V73M64 13V2', '#f3f4e6', 1.1)}<path d="M27 118h73v4H27z" fill="#a4b4b0"/>`;
  } else if (id === 'hagia') {
    const minaret = (x: number, y: number) =>
      `${surface(`M${x} 112V${y}h5v${112 - y}z`, 'stone', 'grain')}<path d="M${x - 1} ${y}l3-13 4 13z" fill="${url('slate')}"/>${line(`M${x - 2} ${y + 20}h9`, '#d5c49d', 2)}`;
    body = `${minaret(14, 29)}${minaret(106, 25)}${surface('M24 113V70h80v43z', 'sandstone')}${surface('M35 79V55h58v24z', 'stone')}${surface('M35 55q1-32 29-32t29 32z', 'slate', 'tiles')}<path d="M64 23q-12 7-13 32H35q1-32 29-32" fill="#d4d0b0" opacity=".4"/>${line('M64 23v-6M35 56h58', '#d4bb83', 1.1)}<path d="M66 9a4 4 0 1 0 0 7 4.5 4.5 0 0 1 0-7z" fill="#d4bb83"/>${surface('M19 81q4-19 22-19t22 19zM65 81q4-19 22-19t22 19z', 'slate', 'tiles')}${rows(6, (i) => arch(31 + i * 11, 89, 5, 13, '#584b3c'))}${arch(56, 94, 16, 19)}${minaret(4, 51)}${minaret(118, 45)}${surface('M13 113h103v6H13z')}`;
  } else if (id === 'borobudur') {
    const stupa = (x: number, y: number, s: number) =>
      `<g transform="translate(${x} ${y}) scale(${s})">${surface('M-11 20q1-15 7-17V0h8v3q6 2 7 17z', 'slate', 'grain')}${line('M0 0v-7m-11 27h22', '#b1ad8f', 1)}${rows(3, (i) => `<path d="M${-6 + i * 6} 8l2 3-2 3-2-3zM${-6 + i * 6} 15l2 3-2 3-2-3z" fill="#35453d"/>`)}</g>`;
    body = rows(5, (i) =>
      surface(
        `M${4 + i * 8} ${114 - i * 9}l${60 - i * 8}-12 ${60 - i * 8} 12v7l-${60 - i * 8}-10-${60 - i * 8} 10z`,
        'slate',
      ),
    );
    body += `${stupa(64, 42, 1.2)}${stupa(36, 62, 0.85)}${stupa(91, 62, 0.85)}${stupa(18, 89, 0.65)}${stupa(46, 74, 0.75)}${stupa(78, 74, 0.75)}${stupa(109, 89, 0.65)}<path d="M59 69h10l12 51H46z" fill="#9da58b"/>${rows(12, (i) => line(`M${58 - i * 0.9} ${75 + i * 3.6}h${12 + i * 1.8}`, '#4e5c4c', 0.9))}`;
  } else if (id === 'zimbabwe') {
    body = `<ellipse cx="64" cy="93" rx="58" ry="25" fill="#7b9060"/>${surface('M7 77Q60 38 121 77v30Q62 139 7 107z')}${surface('M9 77Q62 106 119 77v-5Q64 95 9 72z', 'slate')}<path d="M14 83q49 26 101 0v-7q-52 25-101 0z" fill="#766e54"/>${surface('M47 94l7-48q10-8 19 0l9 48q-15 11-35 0z')}${rows(9, (i) => line(`M${54 - i * 0.65} ${49 + i * 5}q10 5 ${20 + i * 1.1} 0`, '#756b51', 0.8))}${rows(12, (i) => line(`M${11 + i * 9} ${85 + Math.sin((i / 11) * Math.PI) * 14}l4 5 4-5`, '#ebe0bb', 1.4))}<path d="M91 111V91l9-3v19z" fill="#3c4938"/>${line('M9 108q51 27 109-1', '#d4c49b', 1)}`;
  } else if (id === 'sagrada') {
    const spire = (x: number, y: number) =>
      `${surface(`M${x - 7} 101l3-${87 - y} 4-14 4 14 3 ${87 - y}z`, 'sandstone', 'grain')}${rows(7, (i) => arch(x - 2, y + 18 + (i * (76 - y)) / 7, 4, 5, '#635246'))}<circle cx="${x}" cy="${y}" r="3" fill="#c2c17e"/>${line(`M${x} ${y - 7}v7m-3-4h6`, '#d4c595', 1)}`;
    body = `${spire(44, 14)}${spire(84, 14)}${spire(22, 30)}${spire(106, 30)}${surface('M28 118V80l18-8 18-28 18 28 18 8v38z', 'stone', 'grain')}${rows(3, (i) => arch(35 + i * 22, 91, 16, 27, '#525c47'))}${rows(9, (i) => line(`M${30 + i * 8} 86l5-12 3 12`, '#bc9770', 1.2))}${line('M64 48V35m-5 5h10M29 118h71', '#e0d1a4', 1.6)}<path d="M58 79l6-9 6 9-6 9z" fill="#8aaf9b"/>${line('M64 73v12m-4-6h8', '#e7d68f', 0.9)}${surface('M20 118h88v5H20z')}`;
  } else if (id === 'moai') {
    const figure = (x: number, y: number, s: number) =>
      `<g transform="translate(${x} ${y}) scale(${s})">${surface('M-17 97l2-32 6-9-4-36 6-10 24 3 3 42-9 7 8 35z', 'slate', 'grain')}<path d="M7 13l10 1 3 42-9 7 8 34H7L2 62l4-7z" fill="#556454"/>${line('M-10 29l9-2 10 2m-11 0-2 20 10 1m-13 9h17m-15 3h13M-11 70l-2 18 12 5m12-24 4 19-11 5', '#344b40', 1.8, 0.85)}${line('M-10 23l2-6h17M-10 34l3-1m12 1h5', '#c4c3a5', 1.1)}</g>`;
    body = `${surface('M3 112l55-13 67 11v10H3z', 'grass', 'grain')}${figure(24, 27, 0.84)}${figure(96, 29, 0.82)}${figure(60, 4, 1.12)}${surface('M4 118h120v5H4z', 'slate')}`;
  } else if (id === 'greatwall') {
    body = `<g class="wonder-body">${surface('M2 109l19-30 15-30 21 16 21-43 17 29 30 58z', 'grass', 'grain')}<path d="M36 49L22 112h36l-1-47 21-43-12 68 30 20 29-1-30-58-17-29-21 43z" fill="#314f3d" opacity=".4"/>${surface('M8 102l24-23 23 12 24-37 31 13v18L83 74l-24 38-25-13-26 23z')}${surface('M8 102l24-23 23 12 24-37 31 13-1-6-32-14-24 37-23-12-24 25z', 'slate')}${line('M12 99l20-18 23 13 25-37 27 12', '#e4d5ad', 1.4)}${rows(5, (i) => surface(`M${9 + i * 5} ${99 - i * 4.6}v-6l4-3v6z`))}${rows(6, (i) => surface(`M${57 + i * 4} ${89 - i * 6}v-6l3-4v6z`))}${surface('M24 87V67l10-5 12 5v25zM74 62V41l11-5 13 6v27z')}${arch(31, 71, 7, 15)}${arch(82, 46, 7, 15)}${surface('M22 66v-7h5v4l6-3v-5h5v5l6 3v-4h5v9l-15-4zM72 41v-7h5v4l7-3v-5h5v5l6 3v-4h5v9l-15-5z')}</g>
      <g class="wonder-effects"><ellipse cx="64" cy="119" rx="61" ry="12" fill="none" stroke="#d7b46a" stroke-width=".8" opacity=".6"/><g transform="translate(64 65) scale(1 .6)"><g class="wonder-orbit"><circle cx="60" cy="0" r="3" fill="#f9dda1"/><circle cx="-60" cy="0" r="2" fill="#f9dda1"/><path d="M-6-57h12v7H-6zM-4 54h8v6h-8z" fill="#c8ae81" stroke="#f3dfb2"/></g></g><path class="wonder-spark spark-one" d="M12 45v10m-5-5h10" stroke="#fff0c2"/><path class="wonder-spark spark-two" d="M112 28v10m-5-5h10" stroke="#fff0c2"/></g>`;
  } else if (id === 'giza') {
    body = `<g class="wonder-body">${surface('M6 112L56 18l66 94z')}
      <path d="M56 18l16 94h50z" fill="#8c704c" opacity=".6"/><path d="M56 18l-7 14 9-1z" fill="#f4e5c0"/>
      ${rows(20, (i) => {
        const y = 25 + i * 4.25,
          left = 56 - ((y - 18) * 50) / 94,
          edge = 56 + ((y - 18) * 16) / 94,
          right = 56 + ((y - 18) * 66) / 94;
        return (
          line(`M${left} ${y}H${edge}L${right} ${y}`, '#725d40', 0.65, 0.45) +
          line(`M${left + 1} ${y + 1}H${edge}`, '#f5dfae', 0.45, 0.55)
        );
      })}
      ${line('M6 112L56 18l16 94M6 112h116', '#f3dca8', 1, 0.85)}
      <path d="M42 57l5-7 4 7z" fill="#5b503c" opacity=".6"/>${line('M17 104l5-5m11-28 3-4m28 27 2 7m25-16 4 6', '#69583e', 0.85, 0.5)}</g>
      <g class="wonder-effects"><ellipse cx="64" cy="118" rx="61" ry="15" fill="none" stroke="#d7b46a" stroke-width=".7" opacity=".6"/><g transform="translate(64 72) scale(1 .55)"><g class="wonder-orbit"><path d="M58-8l10 6-2 12-12-4z" fill="#c5ab7c" stroke="#8c7450" stroke-width=".7"/><path d="M-60-10l10 4-2 12-12-6z" fill="#ad9166" stroke="#e1c895" stroke-width=".7"/><circle cx="0" cy="-64" r="2" fill="#f9e8ba"/><circle cx="0" cy="64" r="1.6" fill="#f9e8ba"/></g></g><path class="wonder-spark spark-one" d="M12 40v10m-5-5h10" stroke="#eee2bc" stroke-width="1"/><path class="wonder-spark spark-two" d="M114 28v8m-4-4h8" stroke="#edddb2" stroke-width="1"/></g>`;
  }
  const wonder = id === 'giza' || id === 'greatwall';
  return `<svg class="landmark-art${wonder ? ' wonder-art' : ''}" data-material-art="${id}" viewBox="${wonder ? '-20 -24 168 168' : '0 0 128 128'}" aria-hidden="true">${defs}<ellipse ${wonder ? 'class="wonder-shadow"' : ''} cx="64" cy="118" rx="53" ry="7" fill="#34372b" opacity=".17"/>${body}</svg>`;
}
