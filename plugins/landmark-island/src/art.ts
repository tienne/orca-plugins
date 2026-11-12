import landmarks from './landmarks.json';
import { expandedLandmarkArt } from './expanded-art';
import { landmarkLife } from './landmark-life';
import { landmarkIntensity } from './landmark-intensity';
// Original architectural illustrations, distributed under the repository MIT license.
// Material patterns use local SVG geometry, not raster noise or runtime downloads.
// Every instance owns its paint IDs so cards, dialogs and island copies never collide.
let instance = 0;
export function art(id: string) {
  const prefix = `landmark-art-${++instance}`;
  const url = (name: string) => `url(#${prefix}-${name})`;
  const gradient = (name: string, light: string, mid: string, dark: string) =>
    `<linearGradient id="${prefix}-${name}" x1="0" y1="0" x2="1" y2=".7"><stop stop-color="${light}"/><stop offset=".45" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/></linearGradient>`;
  const defs = `<defs>${gradient('glass', '#dce8df', '#9dbbbd', '#476a77')}${gradient('titanium', '#efe7c9', '#b9c0b1', '#6c827e')}${gradient('stone', '#e0d0af', '#bba17a', '#796c55')}${gradient('sandstone', '#e3b497', '#c08465', '#774b3c')}${gradient('marble', '#fff9e8', '#dedace', '#989e98')}${gradient('slate', '#a4aaa1', '#778277', '#424e48')}${gradient('copper', '#a1c5b0', '#638f7f', '#355a50')}${gradient('iron', '#c0a58a', '#846e59', '#483c34')}${gradient('snow', '#fcfbef', '#d4e1df', '#879daa')}${gradient('mountain', '#969b94', '#677781', '#364a5a')}${gradient('gold', '#fae5a4', '#d0a44d', '#8c6229')}${gradient('dune', '#edb078', '#c97d4e', '#914c32')}${gradient('grass', '#a6ac76', '#6f8758', '#3e5940')}
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
    body = `${surface('M2 109l19-30 15-30 21 16 21-43 17 29 30 58z', 'grass', 'grain')}<path d="M36 49L22 112h36l-1-47 21-43-12 68 30 20 29-1-30-58-17-29-21 43z" fill="#314f3d" opacity=".4"/>${surface('M8 102l24-23 23 12 24-37 31 13v18L83 74l-24 38-25-13-26 23z')}${surface('M8 102l24-23 23 12 24-37 31 13-1-6-32-14-24 37-23-12-24 25z', 'slate')}${line('M12 99l20-18 23 13 25-37 27 12', '#e4d5ad', 1.4)}${rows(5, (i) => surface(`M${9 + i * 5} ${99 - i * 4.6}v-6l4-3v6z`))}${rows(6, (i) => surface(`M${57 + i * 4} ${89 - i * 6}v-6l3-4v6z`))}${surface('M24 87V67l10-5 12 5v25zM74 62V41l11-5 13 6v27z')}${arch(31, 71, 7, 15)}${arch(82, 46, 7, 15)}${surface('M22 66v-7h5v4l6-3v-5h5v5l6 3v-4h5v9l-15-4zM72 41v-7h5v4l7-3v-5h5v5l6 3v-4h5v9l-15-5z')}`;
  } else if (id === 'cn') {
    body = `${surface('M38 118l18-63h16l18 63H76L65 65l-11 53z', 'marble', 'grain')}
      <path d="M65 58h7l18 60H76z" fill="#788c8e" opacity=".5"/>
      ${surface('M43 48q21-10 42 0v9q-21 10-42 0z', 'marble', 'grain')}<ellipse cx="64" cy="48" rx="21" ry="6" fill="${url('snow')}"/>
      <path d="M44 50q20 7 40 0v5q-20 7-40 0z" fill="#486c78"/>${rows(10, (i) => line(`M${46 + i * 4} ${51 + Math.sin((i / 9) * Math.PI) * 3}v4`, '#d3ded7', 0.65))}
      ${surface('M59 44V27h10v17z', 'marble', 'grain')}${line('M64 27V4', '#8d9992', 2, 1)}${line('M64 4v7m0 4v4', '#bb6756', 2, 1)}
      ${line('M60 64l-9 49M69 64l12 48', '#fdf1d6', 1.1)}${surface('M31 118h66v5H31z', 'stone')}`;
  } else if (id === 'kinderdijk') {
    const mill = (x: number, y: number, scale: number) =>
      `<g transform="translate(${x} ${y}) scale(${scale})">${surface('M-20 67l9-56h22l9 56z', 'sandstone')}${surface('M-14 13l3-10 11-7L11 3l3 10z', 'slate', 'grain')}${arch(-4, 48, 8, 19)}<path d="M-4 26h8v9h-8z" fill="#3a4d43"/>${line('M-4 30h8m-4-4v9', '#ede0ba', 0.7)}<g class="mill-sails" transform="rotate(-35 0 18)">${rows(4, (i) => `<g transform="rotate(${i * 90} 0 18)"><path d="M-2 18V-27h3v45z" fill="#503e2f"/><path d="M1-24h9V9H1z" fill="#d9c398" stroke="#715e43" stroke-width=".7"/>${rows(6, (j) => line(`M1 ${-21 + j * 5}h9`, '#77654b', 0.7, 1))}</g>`)}</g><circle cy="18" r="3.5" fill="#69583c"/>${line('M-18 66h36', '#ead7b0', 1.4)}</g>`;
    body = `<path d="M2 105q29-8 60 0t64-2v18H2z" fill="${url('grass')}"/><path d="M2 112q36-5 65 1t59-2v13H2z" fill="#6e9c9c"/>${mill(100, 59, 0.65)}${mill(48, 38, 1.12)}${line('M7 119h24m28 1h24m18-4h18', '#d5e1c8', 1)}`;
  } else if (id === 'hallgrim') {
    body = `${rows(9, (i) => {
      const x = 10 + i * 4.8,
        y = 100 - i * 6.3;
      return (
        surface(
          `M${x} 118V${y}l4-3v${121 - y}zM${124 - x} 118V${y}l-4-3v${121 - y}z`,
          'marble',
          'grain',
        ) +
        line(
          `M${x + 1} ${y}v${118 - y}M${123 - x} ${y}v${118 - y}`,
          '#75868a',
          0.7,
        )
      );
    })}${surface('M51 119V33l5-6V17l8-13 8 13v10l5 6v86z', 'marble', 'grain')}<path d="M66 8l6 9v10l5 6v86H66z" fill="#9daca7" opacity=".5"/>
      ${line('M64 7v10m-4-6h8M56 35v48m5-48v47m6-47v47m5-47v48', '#657a7b', 1.2)}<circle cx="64" cy="29" r="5" fill="#e5e3ce" stroke="#6c7e78" stroke-width=".8"/>${line('M64 25v4l3 2', '#435c57', 0.9, 1)}${arch(56, 91, 16, 28, '#617972')}${arch(60, 97, 8, 22, '#334f4b')}${surface('M5 119h118v4H5z', 'slate', 'grain')}`;
  } else if (id === 'atomium') {
    const points = [
      [64, 8],
      [28, 30],
      [100, 30],
      [64, 53],
      [16, 79],
      [49, 104],
      [111, 79],
      [80, 104],
      [64, 82],
    ];
    const edges = [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 3],
      [2, 3],
      [1, 4],
      [2, 6],
      [3, 5],
      [3, 7],
      [4, 5],
      [6, 7],
      [5, 8],
      [7, 8],
      [4, 8],
      [6, 8],
      [3, 8],
    ];
    body = `<path d="M43 122l6-18 8 18m14 0 9-18 8 18M9 122l7-43 7 43m82 0 6-43 7 43" fill="#7c8b82"/>
      ${edges
        .map(([a, b]) => {
          const p = points[a],
            q = points[b];
          return (
            line(`M${p[0]} ${p[1]}L${q[0]} ${q[1]}`, '#687c7d', 4.2, 1) +
            line(`M${p[0] - 1} ${p[1]}L${q[0] - 1} ${q[1]}`, '#e2e4d5', 1.1, 1)
          );
        })
        .join('')}
      ${points.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="${url('snow')}" stroke="#7a9193" stroke-width=".6"/><path d="M${x - 7} ${y + 1}q7 5 14 0m-7-9q-5 8 0 16" fill="none" stroke="#82999a" stroke-width=".5"/><ellipse cx="${x - 3}" cy="${y - 3}" rx="2.3" ry="1.7" fill="#fffbea" opacity=".85"/>`).join('')}`;
  } else if (id === 'petronas') {
    const tower = (x: number) =>
      `<g transform="translate(${x} 0)">${surface('M-17 119V67h3V48h3V34h4V24h14v10h4v14h3v19h3v52z', 'snow', 'grain')}<path d="M2 24h5v10h4v14h3v19h3v52H2z" fill="#526f7a" opacity=".45"/>${rows(
        23,
        (i) => {
          const y = 28 + i * 3.9,
            w = y < 34 ? 14 : y < 48 ? 22 : y < 67 ? 28 : 34;
          return (
            line(`M${-w / 2} ${y}h${w}`, '#436777', 1.2, 0.8) +
            line(`M${-w / 2} ${y + 1.3}h${w}`, '#f4f1dd', 0.65, 0.9)
          );
        },
      )}${line('M-7 118V37M0 118V24M7 118V37', '#c5dbd6', 0.8)}<path d="M-5 24V18h3v-7h4v7h3v6z" fill="${url('snow')}"/>${line('M0 11V2', '#6e9299', 1.3, 1)}</g>`;
    body = `${tower(34)}${tower(94)}<path d="M51 65h26v8H51z" fill="${url('snow')}" stroke="#486b78" stroke-width=".7"/>${line('M52 68h24M52 71h24M54 73l-4 14m24-14 4 14', '#5e7e85', 1, 1)}${surface('M11 119h106v4H11z', 'slate', 'grain')}`;
  } else if (id === 'shwedagon') {
    const spire = (x: number, y: number, s: number) =>
      `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-15 0v-6l5-4 3-13 4-6 3-26 3 26 4 6 3 13 5 4v6z" fill="${url('gold')}"/>${line('M-11-8h22m-18-7h14m-11-7h8m-6-8h4', '#f7dd8a', 1, 1)}</g>`;
    body = `${surface('M4 114l16-8h87l17 8v8H4z', 'marble', 'tiles')}${spire(18, 111, 0.8)}${spire(109, 111, 0.8)}<path d="M28 114v-8h5v-7h5l8-12q-2-18 8-30l5-10 5-30 5 30 5 10q10 12 8 30l8 12h5v7h5v8z" fill="${url('gold')}"/><path d="M64 20l5 27 5 10q10 12 8 30l8 12h5v7h5v8H70l-5-28z" fill="#92632a" opacity=".3"/>
      ${rows(5, (i) => line(`M${58 - i} ${40 + i * 4}h${12 + i * 2}`, '#f2d583', 1, 1))}${line('M45 87q19 5 38 0M38 99h52M33 106h62M28 113h72', '#fae7a0', 1.4, 1)}${line('M64 18V3m-5 7h10m-7-4h4', '#c49b43', 1.1, 1)}${spire(31, 117, 0.5)}${spire(98, 117, 0.5)}`;
  } else if (id === 'acropolis') {
    body = `${surface('M4 120l4-20 11-12 4-15 21-12 42 2 21 17 14 29 4 11z', 'stone', 'grain')}<path d="M82 66l25 14 14 29 4 11H82l9-24z" fill="#807c5d" opacity=".4"/>${line('M14 105l13-13 12 3m50-11 14 8-1 17M43 96l-4 13m30-20 4 15', '#8a7d5d', 1.4)}${surface('M16 81l74 2 22-10v7L91 91l-77-3z')}
      ${surface('M22 43l65 1 20-7v39L88 85l-66-3z', 'marble')}<path d="M27 49h55v29H27zM91 49l11-5v29l-11 5z" fill="#6b7565"/>
      ${rows(8, (i) => surface(`M${25 + i * 7.5} 79V49h3.7v30z`, 'marble', 'grain') + line(`M${26 + i * 7.5} 51v26`, '#f8edd3', 0.8))}${rows(3, (i) => surface(`M${90 + i * 5} ${80 - i * 2.2}V${48 - i * 2}h2.5v30z`, 'stone', 'grain'))}
      ${surface('M18 43l37-20 36 21 19-9v7l-20 10-72-2z', 'marble')}${surface('M19 43l36-19 35 20z', 'stone', 'grain')}${line('M26 40l29-12 27 13M19 47l71 2 19-10M17 84l74 3 20-9', '#f9e9c7', 1.2)}`;
  } else if (id === 'basil') {
    const dome = (
      x: number,
      y: number,
      w: number,
      color: string,
      twist = false,
    ) =>
      `<path d="M${x - w / 2} ${y}q${-w * 0.55} ${-w * 0.65} 0 ${-w}l${w / 2} ${-w * 0.7} ${w / 2} ${w * 0.7}q${w * 0.55} ${w * 0.35} 0 ${w}z" fill="${color}" stroke="#806c49" stroke-width=".6"/>${line(`M${x} ${y - w * 1.7}v-7m-3 3h6`, '#d2b56b', 0.9, 1)}${twist ? rows(3, (i) => line(`M${x - w / 2 + 3 + (i * w) / 4} ${y}q${w * 0.7} ${-w * 0.4} ${w * 0.3} ${-w * 0.9}`, '#eee2b1', 1.8, 0.85)) : line(`M${x} ${y - w * 1.7}q${-w * 0.6} ${w * 0.85} 0 ${w * 1.7}m0 ${-w * 1.7}q${w * 0.6} ${w * 0.85} 0 ${w * 1.7}`, '#ead5a0', 1, 0.65)}`;
    body = `${surface('M16 118V76h96v42z', 'sandstone')}${surface('M53 92V47l11-21 11 21v45z', 'sandstone')}${line('M56 47h16m-14 7h12m-14 7h16m-14 7h12', '#f0dcc0', 1.4)}${dome(64, 31, 12, '#c6a047')}
      ${rows(4, (i) => {
        const x = 23 + i * 27,
          y = i === 1 || i === 2 ? 69 : 84;
        return (
          surface(`M${x - 9} 116V${y}h18v${116 - y}z`, 'sandstone') +
          line(`M${x - 9} ${y + 5}h18m-18 12h18m-18 12h18`, '#ead6b4', 1.2) +
          arch(x - 3, y + 10, 6, 12) +
          dome(
            x,
            y,
            19,
            ['#688e79', '#b45c49', '#708e9e', '#b98843'][i],
            i % 2 === 0,
          )
        );
      })}
      ${surface('M47 119V96l17-14 17 14v23z', 'sandstone')}${arch(56, 100, 16, 19, '#485b4a')}${line('M47 98l17-13 17 13M11 119h106', '#f0dfc1', 1.6)}${surface('M8 119h112v5H8z', 'stone')}`;
  } else if (id === 'aitbenhaddou') {
    body = `${surface('M4 119l9-28 15-13 13-25 24-25 16 15 20 38 17 16 7 22z', 'sandstone', 'grain')}${surface('M54 45V33h17v12z', 'sandstone')}${rows(
      4,
      (r) =>
        rows(4, (c) => {
          const x = 14 + c * 25 + (r % 2) * 3,
            y = 79 + r * 10 - (c % 2) * 8;
          return (
            surface(`M${x} ${y + 20}V${y}h19v20z`, 'sandstone') +
            line(`M${x} ${y}h19`, '#f1c29b', 1) +
            arch(x + 7, y + 8, 4, 9, '#724b36')
          );
        }),
    )}
      ${surface('M9 121V85h14V80h5v41zM99 121V82h5v5h15v34z', 'sandstone')}${surface('M28 121V97h71v24z', 'sandstone')}${arch(55, 101, 17, 20, '#674735')}
      ${rows(4, (i) => line(`M${12 + i * 3} 91l1 4 1-4M${104 + i * 3} 93l1 4 1-4`, '#875337', 0.8, 1))}${line('M9 85h14m5 12h71m5-10h15M9 121h110', '#eeb78d', 1.1)}`;
  } else if (id === 'sigiriya') {
    body = `<path d="M2 109l10-12 9 3 10-12 13 6 16-11 17 9 18-4 14 10 12-2 6 14v13H2z" fill="${url('grass')}"/>${surface('M23 112l3-40 9-32 14-13 40-3 14 16 4 32 5 40z', 'sandstone', 'grain')}<path d="M86 25l17 15 4 32 5 40H84l5-35-8-23z" fill="#714d3b" opacity=".5"/>
      ${line('M35 45l-3 30 3 22M46 38l-3 28m33-31 4 19-4 40M95 46l3 29M51 79l-4 26', '#79553e', 1.1, 0.8)}${surface('M36 35l13-10 39-1 12 13-35 7z', 'grass', 'grain')}${surface('M46 33V25l11-3 26 1v8l-26-1z', 'stone')}${line('M49 26h31m-29 3h12m4 0h13', '#d6c4a0', 0.9)}
      <path d="M60 116V91l11-6V59l13-10" fill="none" stroke="#55594b" stroke-width="2"/>${line('M63 115V92l11-5V60l11-9', '#dac9a6', 0.8)}${surface('M45 115l2-14 7-7 5 2v19zM66 115V96l5-2 8 8 2 13z', 'sandstone', 'grain')}${rows(3, (i) => line(`M${48 + i * 3} 113v-7M${70 + i * 3} 113v-7`, '#76513d', 1))}${line('M8 118h33m44 1h33', '#b7ba81', 1.4)}`;
  } else if (id === 'sossusvlei') {
    body = `${surface('M2 95Q28 71 46 26q8 25 28 43l27-22q9 30 24 48v26H2z', 'dune', 'grain')}<path d="M46 26q-2 36 28 69H2q26-24 44-69z" fill="#edb377"/><path d="M101 47q-7 28-12 48h36q-15-18-24-48z" fill="#914c30" opacity=".65"/>
      ${surface('M1 105q22-11 51-7 31 4 75-9v32H1z', 'dune', 'grain')}<path d="M16 111q22-12 48-4t48-3l-8 14-44 5-45-4z" fill="#eadcc0"/><path d="M17 116l20-3 15 3 18-4 13 4 22-6" fill="none" stroke="#b6aa8b" stroke-width=".7"/>
      ${line('M4 94q25-23 42-68M48 35q13 28 27 35l26-23', '#ffce92', 1.2, 0.9)}${rows(5, (i) => line(`M${8 + i * 3} ${99 + i * 2}q22-8 35-4`, '#f1be83', 0.6, 0.6))}<path d="M112 119l2-7 1 5 4-5-2 7m-111 0 2-7 2 5 3-4-1 6" fill="#71734e"/>`;
  } else if (id === 'kilimanjaro') {
    body = `${surface('M2 113l18-24 14-15 11-20 7-16 27-6 13 15 8 26 25 40z', 'mountain', 'grain')}<path d="M78 33L66 60l11 28 10 27h38l-25-42-8-26z" fill="#364e59" opacity=".6"/>
      ${surface('M40 62l5-8 7-16 27-6 13 15 6 19-13-7-5 6-11-11-8 8-6-8-8 10z', 'snow', 'grain')}${line('M52 40l13 1 13-6 12 13M56 63l-9 23-12 16m47-34 10 23 12 17M64 75l-4 29', '#c6d4d1', 1, 0.65)}
      <path d="M2 112l16-6 8 4 13-8 14 6 13-4 16 5 14-7 17 9 12 1v11H2z" fill="${url('grass')}"/><path d="M5 118q34-3 58 1t61-1v5H5z" fill="#b1a66f"/>${line('M16 116v-10m-6 1q6-7 13 0m-10-2h8', '#3e5846', 1.6, 1)}`;
  } else if (id === 'pragueclock') {
    body = `${surface('M32 120V33l32-9 31 10v86z')}${surface('M64 24l31 10v86H64z', 'slate')}
      <path d="M25 34L63 6l39 29-38-9z" fill="${url('slate')}"/>${line('M63 6v20M27 34l37-8 36 9', '#d2c3a0', 1)}
      ${rows(4, (i) => arch(38 + i * 12, 36, 6, 12))}
      <path d="M35 52h46v65H35z" fill="#c4b28c"/><path d="M39 53h37v30H39z" fill="#544b3c"/>
      <circle cx="57" cy="68" r="13" fill="#334d57" stroke="#d9b668" stroke-width="1.7"/><circle cx="57" cy="68" r="9" fill="none" stroke="#c9a35c"/>
      <circle cx="60" cy="66" r="6" fill="none" stroke="#e3c882" stroke-width=".8"/>
      ${rows(12, (i) => {
        const a = (i * Math.PI) / 6;
        return line(
          `M${57 + 11 * Math.cos(a)} ${68 + 11 * Math.sin(a)}l${1.8 * Math.cos(a)} ${1.8 * Math.sin(a)}`,
          '#f7e4a6',
          0.7,
        );
      })}
      ${line('M57 68l8-8m-8 8-8 3', '#f7d277', 1.2, 1)}
      <circle cx="57" cy="99" r="13" fill="${url('gold')}" stroke="#78664c"/><circle cx="57" cy="99" r="8" fill="#839c91"/>
      ${rows(12, (i) => {
        const a = (i * Math.PI) / 6;
        return `<circle cx="${57 + 10 * Math.cos(a)}" cy="${99 + 10 * Math.sin(a)}" r="1.5" fill="#f5dfae"/>`;
      })}
      ${line('M32 51h63M32 117h63M83 57v55', '#eee0c0', 1)}${arch(84, 61, 5, 13)}`;
  } else if (id === 'parliament') {
    body = `${surface('M4 119V80h120v39z')}${surface('M10 80V69h108v11z')}
      <path d="M5 70l12-16 14 16 15-16 18 16 18-16 18 16 13-16 12 16z" fill="#9d675c"/>
      ${rows(12, (i) => `${arch(9 + i * 9.3, 84, 4.6, 17)}${arch(9 + i * 9.3, 105, 4.6, 10)}`)}
      ${surface('M45 119V59h38v60z')}
      <path d="M43 61Q43 34 64 21Q85 34 85 61Z" fill="#a66e60" stroke="#6d584a"/>
      ${rows(7, (i) => line(`M64 21Q${44 + i * 6} 40 ${45 + i * 6} 61`, '#e1b68e', 0.9))}
      <path d="M58 26V17h12v9z" fill="${url('stone')}"/><path d="M59 17l5-12 5 12z" fill="#807761"/>
      ${line('M64 5V0M43 61h42M44 68h40M4 117h120', '#e6d8b8', 1.1)}
      ${rows(4, (i) => arch(49 + i * 8, 73, 5, 18))}${arch(58, 99, 12, 20)}
      ${rows(8, (i) => {
        const x = 8 + i * 16;
        return `<path d="M${x} 82V56h3v26z" fill="${url('stone')}"/><path d="M${x - 2} 56l3.5-13 3.5 13z" fill="#9b6956"/>`;
      })}`;
  } else if (id === 'schonbrunn') {
    body = `<path d="M4 113l58-20 62 20-60 12z" fill="#82966a"/>${surface('M6 108V61h116v47z')}
      <path d="M6 65h116v43H6z" fill="#dfc277"/><path d="M4 62l8-14h104l9 14z" fill="${url('slate')}"/>
      ${rows(12, (i) => `${arch(10 + i * 9.3, 69, 4.5, 12, '#5c706c')}${arch(10 + i * 9.3, 88, 4.5, 13, '#5c706c')}`)}
      ${surface('M47 109V52h34v57z')}
      <path d="M43 54l21-17 22 17z" fill="#e5cd89" stroke="#9b8966"/><circle cx="64" cy="49" r="3.5" fill="#526665"/>
      ${rows(4, (i) => `<path d="M${49 + i * 9} 58v46" stroke="#efe2b3" stroke-width="3"/>`)}
      ${arch(58, 88, 12, 21)}${line('M6 84h116M6 106h116M46 55h37', '#f7e9bd', 1.5)}
      <path d="M57 109h15l10 13H46z" fill="#c4bb9a"/><path d="M14 115l20-6 14 4-20 6zm67-2 14-4 20 6-14 4z" fill="#5e804f"/>
      ${rows(5, (i) => `<circle cx="${16 + i * 4}" cy="115" r="1.3" fill="#d8a9ad"/><circle cx="${95 + i * 4}" cy="115" r="1.3" fill="#d8a9ad"/>`)}`;
  } else if (id === 'matterhorn') {
    body = `${surface('M3 119l29-42 20-32 15-37 9 4 8 37 18 34 24 36z', 'mountain', 'grain')}
      <path d="M67 8L58 69 32 117H5l27-40 20-32z" fill="#b4b9ac" opacity=".6"/>
      ${surface('M52 45L67 8l9 4 8 37-9-9-5 10-5-16-6 18z', 'snow', 'grain')}
      <path d="M76 12l-6 38 10 25 24 43H64l-6-49 9-61z" fill="#4c606c" opacity=".5"/>
      ${line('M67 8l-9 61-26 48M76 12l8 37 18 34M56 61L31 98m33-37 3 40m15-37 16 33M38 84l-8 17', '#e2e5d9', 1.2)}
      ${line('M18 110l23-13 10 4m30-7 17 8 13-3M8 119h117', '#bfd0c6', 1)}
      <path d="M5 119l23-8 15 6 21-5 20 7 23-5 18 5z" fill="#718b6d"/>`;
  } else if (id === 'mermaid') {
    body = `<ellipse cx="64" cy="114" rx="55" ry="10" fill="#82b8b4" opacity=".65"/>${surface('M27 115L23 91l14-20 29-8 26 16 11 32-29 10z', 'slate', 'grain')}
      ${line('M25 92l26-10 22 12 18-15M51 82l6 35M73 94l-3 23', '#c8c6ad', 1)}
      ${surface('M51 76l5-20-3-12 9-5 11 5 3 19-5 8 15 9-7 11-18 6-15 14-9-2 15-22-2-11z', 'copper', 'grain')}
      <ellipse cx="62" cy="32" rx="9" ry="11" fill="${url('copper')}" transform="rotate(-18 62 32)"/>
      <path d="M54 34q-9-18 7-18 13 2 10 17l-5-12-8 3z" fill="#47665b"/>
      ${line('M58 31l-2 5 5 3M56 47l-9 20 7 14m16-32 7 14-11 13M57 83l18 3-19 13-11 10', '#a8c4ac', 1.5, 0.85)}
      <path d="M44 108l-10 4 5 4 12-7" fill="#659180"/>
      ${line('M10 114q8 3 17 0m66 1q12 3 25-1M37 122h15', '#d8e9d7', 1.3)}`;
  } else if (id === 'borgund') {
    body = `${surface('M13 118V82h100v36z', 'iron', 'grain')}
      ${rows(19, (i) => line(`M${17 + i * 5} 87v28`, '#c2a67f', 0.8, 0.5))}
      ${surface('M33 89V57h62v32z', 'iron', 'grain')}${surface('M47 60V36h34v24z', 'iron', 'grain')}
      <path d="M5 84l25-27h67l26 27-59 5zM22 60l21-25h42l23 25-44 5zM38 38L63 14l26 24-25 5z" fill="${url('slate')}"/>
      ${rows(6, (i) => line(`M${8 + i * 4} ${81 - i * 4}H${120 - i * 4}`, '#bca98b', 0.65, 0.6))}
      ${rows(4, (i) => line(`M${26 + i * 4} ${57 - i * 5}H${104 - i * 4}`, '#c4ad87', 0.7, 0.65))}
      <path d="M57 35V19h14v16z" fill="${url('iron')}"/><path d="M52 20L64 1l12 19z" fill="#514c40"/>
      ${line('M64 1v-1M30 57l-8-7-5 2 7 3m74 2 8-7 5 2-7 3M43 35l-7-6-5 2m54 4 7-6 5 2', '#5b4836', 2, 1)}
      ${arch(52, 92, 22, 26, '#302e27')}${line('M48 118V95q0-13 15-13t15 13v23', '#a28a67', 2, 0.9)}
      ${rows(5, (i) => arch(18 + i * 20, 91, 5, 11, '#302e27'))}`;
  } else if (id === 'helsinki') {
    body = `${surface('M5 120v-5h5v-5h6v-5h96v5h6v5h5v5z', 'marble')}${surface('M16 105V66h96v39z', 'marble')}
      <path d="M15 67l23-16h52l23 16z" fill="${url('copper')}"/>
      ${surface('M47 65V44h34v21z', 'marble')}
      <path d="M45 44Q44 24 64 19Q84 24 83 44z" fill="${url('copper')}"/><path d="M60 20V12h8v8" fill="${url('gold')}"/>
      ${line('M64 13V4m-4 4h8M47 44h34', '#e6d7ad', 1.1)}
      ${[26, 102].map((x) => `${surface(`M${x - 8} 68V51h16v17z`, 'marble')}<path d="M${x - 10} 51q0-16 10-17 10 1 10 17z" fill="${url('copper')}"/>${line(`M${x} 34v-7m-3 3h6`, '#cbb681', 0.9)}`).join('')}
      ${surface('M35 105V76h58v29z', 'marble')}<path d="M31 76l33-21 33 21z" fill="${url('marble')}" stroke="#9ba89d"/>
      ${rows(6, (i) => `<path d="M${38 + i * 10} 79v24" stroke="#f9f6e9" stroke-width="4"/><path d="M${40 + i * 10} 79v24" stroke="#9ca89d" stroke-width=".9"/>`)}
      ${arch(58, 83, 12, 22)}${line('M6 115h116M12 110h104M18 105h92M33 77h62', '#a8ada0', 0.8)}`;
  } else if (id === 'obelisco') {
    body = `<path d="M22 114l42-15 42 15-42 12z" fill="#8ca175"/>${surface('M44 119v-7h40v7z', 'marble')}
      ${surface('M51 112l5-94 8-15 8 15 5 94z', 'marble', 'grain')}
      <path d="M64 3l8 15 5 94H64z" fill="#98a9a4" opacity=".65"/>
      ${line('M64 3v109M56 18h16M52 101h24', '#edf0df', 0.8)}
      <path d="M59 25h3v5h-3zM67 25h3v5h-3zM59 92h4v12h-4z" fill="#506464"/>
      ${rows(6, (i) => line(`M${54 + i * 0.12} ${65 + i * 3}h7`, '#878f84', 0.6, 0.7))}
      <path d="M22 109V80m84 29V80" stroke="#7c8068" stroke-width="1.5"/>
      <path d="M22 81h15v10H22zM106 81h-15v10h15z" fill="#a9d2d7"/><path d="M22 84h15v3H22zM106 84h-15v3h15z" fill="#f6edda"/>
      ${line('M34 117h14m32 0h14', '#e3d6b3', 1)}`;
  } else if (id === 'dubrovnik') {
    body = `<path d="M4 112q35-8 64 0t57 0v8H4z" fill="#79aeb1"/>
      ${rows(7, (i) => {
        const x = 15 + i * 13,
          y = 72 + (i % 2) * 8;
        return `${surface(`M${x} ${y + 29}v-24h12v24z`)}<path d="M${x - 2} ${y + 5}l8-10 9 10z" fill="#b6795f"/>${arch(x + 4, y + 12, 3, 9)}`;
      })}
      ${surface('M7 113V82l18-5 14 13 54-4 25-13v40L76 124 33 119z')}
      ${surface('M6 85V65l17-5 16 8v24L23 98 6 92z')}${surface('M91 87V63l14-5 17 7v28l-16 5z')}
      ${rows(5, (i) => `<path d="M${7 + i * 6} ${66 + (i > 2 ? 3 : 0)}v-7h4v7" fill="${url('stone')}"/>`)}
      ${rows(5, (i) => `<path d="M${92 + i * 6} 66v-7h4v7" fill="${url('stone')}"/>`)}
      ${rows(9, (i) => `<path d="M${39 + i * 6} ${89 - i * 0.04}v-5h4v5" fill="${url('stone')}"/>`)}
      ${arch(59, 99, 14, 23)}${arch(17, 72, 5, 12)}${arch(101, 72, 5, 12)}
      ${line('M7 92l16 6 16-6M92 92l14 6 16-5M39 97l52-3', '#f0dfb5', 1.2)}
      ${line('M5 119h20m82 4h16', '#d9e8d4', 1.2)}`;
  } else if (id === 'boudhanath') {
    body = `${surface('M8 117V107l56-15 56 15v10l-56 10z', 'marble')}${surface('M17 105V95l47-14 47 14v10l-47 13z', 'marble')}
      <path d="M25 96a39 39 0 0 1 78 0q-39 19-78 0z" fill="${url('marble')}"/><path d="M64 57q30 5 33 39l-18 7Q90 72 64 57" fill="#acb7ad" opacity=".4"/>
      ${surface('M50 60V38h28v22z', 'gold', 'grain')}
      <path d="M48 38l16-29 16 29z" fill="${url('gold')}"/>${rows(6, (i) => line(`M${50 + i * 2} ${35 - i * 4}h${28 - i * 4}`, '#7c633c', 0.8))}
      ${line('M64 10V2', '#b4914c', 1.2)}<ellipse cx="64" cy="5" rx="4" ry="1.2" fill="#d9b56d"/><circle cx="64" cy="2" r="1.2" fill="#e5ca84"/>
      <path d="M52 46q5-5 10 0-5 5-10 0m14 0q5-5 10 0-5 5-10 0" fill="#faf1d4" stroke="#355459" stroke-width="1"/><circle cx="57" cy="46" r="1.4" fill="#244343"/><circle cx="71" cy="46" r="1.4" fill="#244343"/>
      ${line('M64 48q-4 4 0 6q4 2 0 4', '#476b70', 1)}
      ${line('M64 21Q37 68 8 91M64 21q28 47 56 70', '#8a947b', 0.65)}
      ${rows(8, (i) => {
        const x = 14 + i * 5,
          y = 87 - i * 7;
        return `<path d="M${x} ${y}l5-5 1 8-5 4z" fill="${['#ba7465', '#6b9494', '#d8c27a', '#ece5ca'][i % 4]}"/><path d="M${128 - x} ${y}l-5-5-1 8 5 4z" fill="${['#7c9b78', '#d8c27a', '#b97568', '#719798'][i % 4]}"/>`;
      })}
      ${line('M17 105l47 13 47-13M8 117l56 10 56-10', '#c1c4ad', 0.9)}`;
  } else if (id === 'halong') {
    body = `<path d="M3 101q27-14 58-5t64 6v17q-33 10-63 2t-59-2z" fill="#75aaa6"/><ellipse cx="64" cy="112" rx="56" ry="9" fill="#91c5b8" opacity=".5"/>
      ${[
        [10, 52, 27, 54],
        [43, 19, 32, 85],
        [86, 42, 31, 62],
      ]
        .map(
          ([x, y, w, h]) =>
            `${surface(`M${x} ${y + h}l3-${h - 15} 7-13 9-2 ${w - 19} 8 5 ${h - 8}z`, 'slate', 'grain')}<path d="M${x + 3} ${y + 15}l7-13 9-2 ${w - 19} 8 1 12-9-6-6 7-6-8z" fill="#6e925f"/>${rows(4, (i) => line(`M${x + 7 + i * 5} ${y + 19}l-2 ${h - 22}`, '#b2b7a1', 0.7, 0.7))}`,
        )
        .join('')}
      ${line('M7 108q12 4 23 0m6 7q11 3 21 0m39-3q11 3 22-1', '#d5e6cd', 1.2)}
      <path d="M54 111h32l-8 8H61z" fill="#74624b"/><path d="M69 110V67" stroke="#856d50" stroke-width="1.2"/>
      <path d="M68 72q-17 10-17 32h17zM71 78q12 11 13 26H71z" fill="#d5b177" stroke="#a48259" stroke-width=".7"/>
      ${rows(4, (i) => line(`M${54 - i * 0.4} ${85 + i * 5}H68`, '#94714f', 0.7))}`;
  } else if (id === 'hegra') {
    body = `${surface('M7 116L9 54l11-29 19-11 51 1 22 25 10 76-58 9z', 'sandstone', 'grain')}
      <path d="M90 15l22 25 10 76-26 5-5-77z" fill="#926149" opacity=".65"/>
      ${surface('M29 119V50h60v69z', 'stone')}
      <path d="M24 52V40h8v-8h8v-8h10v8h8v8h8v-8h8v-8h10v8h8v8h6v12z" fill="${url('stone')}"/>
      ${line('M24 52h74M29 57h60M29 67h60M32 42h60', '#f5dcb3', 1.3)}
      ${rows(2, (i) => `${surface(`M${32 + i * 48} 117V68h7v49z`)}${line(`M${34 + i * 48} 70v45`, '#f7debd', 1)}`)}
      <path d="M45 117V86h28v31z" fill="#4d3e31"/>
      <path d="M40 85l19-14 20 14z" fill="${url('stone')}" stroke="#b49a74"/>
      ${line('M43 87h33M48 90v26M70 90v26M12 57l11-9m78 16 10 7M17 90l7-4m78 16 11 3', '#edc5a3', 1, 0.6)}
      <path d="M5 119l25-4 13 6 29-2 24 3 26-5v6H5z" fill="#cfaa7b"/>`;
  } else if (id === 'lotte') {
    body = `${surface('M36 119v-5l28-8 28 8v5l-28 6z', 'marble')}
      <path d="M44 114Q46 49 56 13L62 3 67 4l7 12q9 43 10 98l-20 7z" fill="${url('glass')}"/>
      <path d="M64 5Q62 56 64 121l20-7q-1-55-10-98l-7-12z" fill="#54777e" opacity=".65"/>
      <path d="M56 13l6-10 1 27-5 15zM67 4l7 12-2 29-7-16z" fill="#cbdad3"/>
      ${rows(22, (i) => {
        const y = 29 + i * 3.8,
          w = 10 + Math.pow((y - 29) / 85, 0.7) * 27;
        return line(
          `M${64 - w / 2} ${y}l${w / 2} 3 ${w / 2}-3`,
          '#d0e4dd',
          0.65,
          0.6,
        );
      })}
      ${rows(5, (i) => line(`M${56 + i * 4} 17Q${49 + i * 7} 68 ${48 + i * 8} 114`, '#d8e6dc', 0.8, 0.7))}
      ${line('M44 114l20 7 20-7M56 13l6-10m5 1 7 12M64 32v86', '#f2f0d9', 1.2, 0.9)}
      <path d="M60 111h8v9h-8z" fill="#3c5b60"/>${line('M39 119l25 6 25-6', '#b5b6a0', 0.8)}`;
  } else if (id === 'marinabaysands') {
    body = `<path d="M4 116l57-13 62 13-58 10z" fill="#8ba89a"/>
      ${[14, 48, 82]
        .map(
          (
            x,
            i,
          ) => `<defs><clipPath id="${prefix}-mbs-${i}"><path d="M${x} 111q8-38 2-78l14-2q-5 45 7 82l-12 5z"/></clipPath></defs><g clip-path="${url(`mbs-${i}`)}"><path d="M${x} 111q8-38 2-78l14-2q-5 45 7 82l-12 5z" fill="${url('glass')}"/>
      <path d="M${x + 16} 31q-5 45 7 82l-12 5q-8-45-1-85z" fill="#567d81" opacity=".55"/>
      ${rows(16, (j) => line(`M${x + 3} ${40 + j * 4.5}l11 2 13-2`, '#dce6d5', 0.65, 0.7))}
      ${line(`M${x + 5} 36q3 38-2 73M${x + 14} 34q-3 40 2 78`, '#ebecda', 1, 0.85)}</g>`,
        )
        .join('')}
      <path d="M4 31Q57 16 124 24l-10 13q-46 13-105 5z" fill="${url('stone')}"/>
      <path d="M4 31Q57 16 124 24q-50 18-115 14z" fill="#82956b"/>
      <path d="M15 31q32-7 64-7l-7 5-55 7z" fill="#9ac6bd"/>
      ${line('M5 32q50 8 116-8M10 41q55 9 104-4', '#ead7b0', 1.2, 0.95)}
      ${rows(9, (i) => `<path d="M${79 + i * 3.2} ${27 - i * 0.15}v-4" stroke="#778864" stroke-width=".8"/><circle cx="${79 + i * 3.2}" cy="${22 - i * 0.15}" r="2.5" fill="${i % 2 ? '#718a59' : '#9aac73'}"/>`)}
      ${line('M7 118l54-9 58 8', '#d0d8ba', 1)}`;
  } else if (id === 'guggenheim') {
    body = `<path d="M3 112q44-17 121-4v11q-62 13-121 0z" fill="#88b4b2"/>
      ${surface('M9 110V75l33-11 16 8v40z', 'stone')}${surface('M89 111V66l28 10v35z', 'stone')}
      <path d="M20 93Q2 64 35 48l18 21-6 39z" fill="${url('titanium')}"/><path d="M43 109Q31 59 57 28q18 20 24 39l-10 44z" fill="${url('titanium')}"/>
      <path d="M65 106q9-56 36-59 23 20 15 51l-30 16z" fill="${url('titanium')}"/>
      <path d="M22 96q17-18 41-13 23 2 34 27l-34 13-40-7z" fill="${url('titanium')}"/>
      <path d="M53 68l12-20 14 21-4 34-18-7z" fill="${url('glass')}" stroke="#77969b" stroke-width=".8"/>
      ${line('M57 28q8 34-4 53M35 48q-12 24 2 40M101 47q-22 24-17 54M22 96q24-9 41-4 17 5 34 18', '#f2ebd1', 1.2, 0.9)}
      ${rows(5, (i) => line(`M${46 + i * 1.6} ${48 + i * 6}q12 6 27 2`, '#7f8e87', 0.6, 0.65))}
      ${rows(5, (i) => line(`M${90 - i * 1.2} ${57 + i * 7}q10-2 25 7`, '#89978c', 0.6, 0.7))}
      ${rows(4, (i) => line(`M${18 + i * 2} ${66 + i * 6}l22 8`, '#7d8f86', 0.6, 0.65))}
      ${rows(5, (i) => line(`M${30 + i * 11} ${92 + i * 0.3}l2 24`, '#829188', 0.6, 0.6))}
      ${line('M61 60l-1 30m7-32 3 36M9 110l17 6m78-8 13 3M7 121h14m79 1 20-2', '#d7e4d5', 1, 0.8)}`;
  } else if (id === 'nmoq') {
    body = `<ellipse cx="64" cy="112" rx="61" ry="12" fill="#c6b28e"/>
      ${surface('M17 105V75l24-10 32 6 32-1v35z', 'sandstone', 'grain')}
      ${[
        [29, 77, 32, 11, -31],
        [83, 79, 41, 13, 24],
        [58, 63, 43, 13, -13],
        [32, 49, 27, 10, -48],
        [91, 49, 30, 11, 39],
        [64, 40, 32, 12, 9],
      ]
        .map(
          ([x, y, rx, ry, a]) =>
            `<g transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y + 4}" rx="${rx}" ry="${ry}" fill="#9f8868"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${url('stone')}" stroke="#a79577" stroke-width=".7"/><ellipse cx="${x}" cy="${y}" rx="${rx - 4}" ry="${ry - 2}" fill="none" stroke="#f3e3c4" stroke-width=".7"/></g>`,
        )
        .join('')}
      ${line('M19 107l22 5 27-3 34 3M41 92v15m45-14v14', '#e6d2ab', 1.2)}<path d="M55 105v-12h13v12z" fill="#546663"/>`;
  } else if (id === 'heydar') {
    body = `${surface('M3 115l30-16 72 2 20 15-65 10z', 'marble', 'grain')}
      <path d="M12 109Q32 97 39 60Q50 8 70 19Q87 25 81 60Q79 87 117 100L121 114Q75 126 55 111Q31 121 12 109Z" fill="${url('marble')}" stroke="#9aa69c" stroke-width=".8"/>
      <path d="M34 106Q54 91 65 65Q72 45 78 43Q73 85 112 103L115 111Q82 114 65 99Q51 115 34 106Z" fill="${url('glass')}"/>
      ${rows(9, (i) => line(`M${44 + i * 7} ${101 - Math.sin((i / 8) * Math.PI) * 7}v${10 - Math.sin((i / 8) * Math.PI) * 5}`, '#e0e8da', 0.6))}
      ${line('M17 108Q42 87 47 52T68 24M24 110Q49 92 58 56T76 32M75 25Q85 46 78 66T117 105M10 115q54 17 109-1', '#fdf8e9', 1.2, 0.9)}
      ${line('M46 48q8-11 22-8m-28 29q12-11 22-9m-27 29q10-5 18-4', '#b6beb1', 0.6)}`;
  } else if (id === 'baiterek') {
    body = `${surface('M26 118l38-11 38 11-38 8z', 'marble', 'grain')}
      <path d="M57 114V55h14v59z" fill="${url('marble')}"/>
      ${[28, 38, 48, 80, 90, 100].map((x) => line(`M${x} 46Q${64 + (x - 64) * 0.35} 69 ${58 + (x > 64 ? 12 : 0)} 115`, '#e7e5d4', 3, 1)).join('')}
      <circle cx="64" cy="37" r="24" fill="${url('gold')}" stroke="#a38850" stroke-width=".8"/>
      <defs><clipPath id="${prefix}-orb"><circle cx="64" cy="37" r="23.5"/></clipPath></defs>
      <g clip-path="url(#${prefix}-orb)">${rows(5, (i) => line(`M39 ${21 + i * 8}q25 6 50 0`, '#947c48', 0.6))}${[48, 57, 71, 80].map((x) => line(`M${x} 12q${(64 - x) * 0.45} 25 0 50`, '#f8e2a5', 0.7)).join('')}</g>
      ${rows(5, (i) => line(`M${48 + i} ${71 + i * 8}h${32 - i * 2}`, '#b8c4bc', 0.6))}${line('M62 64v48M33 119h62', '#fff5d8', 1.3)}`;
  } else if (id === 'sangsad') {
    body = `<path d="M3 112l34-13 52 2 36 11-26 13H20z" fill="#79a6a3"/>
      ${surface('M12 105V57l21-8 19 9v51z', 'slate', 'grain')}
      ${surface('M75 107V56l20-8 21 10v48z', 'slate', 'grain')}
      ${surface('M34 108V38l17-13h30l16 14v69z', 'marble', 'grain')}
      <path d="M80 25l17 14v69l-17 9z" fill="#919d94"/>
      <circle cx="58" cy="57" r="15" fill="#415b5d"/><path d="M42 79h32l-16 22z" fill="#49605e"/>
      <path d="M17 75l15-15 14 15zM82 73l13-15 15 15z" fill="#344f51"/>
      ${rows(8, (i) => line(`M35 ${38 + i * 9}h44`, '#c3c7b7', 0.7))}
      ${line('M34 40l18-13h27M17 105h97M58 43v27M45 57h27', '#e9ead7', 1)}
      ${surface('M43 112l14-10h18l15 10-24 7z', 'stone', 'grain')}`;
  } else if (id === 'kigali') {
    body = `${surface('M5 112V85l35-10h64l19 12v25z', 'stone', 'grain')}
      <path d="M18 100Q23 57 44 40Q56 28 64 17Q73 30 85 41Q107 63 111 100Q66 124 18 100Z" fill="${url('glass')}" stroke="#708d87" stroke-width=".8"/>
      ${rows(12, (i) => {
        const y = 29 + i * 6;
        const w = Math.min(45, (y - 17) * 0.57);
        return line(
          `M${64 - w} ${y}q${w} ${w * 0.36} ${w * 2} 0`,
          i % 3 === 0 ? '#d5c48b' : i % 3 === 1 ? '#bed7ce' : '#6d9e9e',
          2,
          0.9,
        );
      })}
      ${[31, 43, 55, 73, 85, 97].map((x) => line(`M64 19Q${x} 57 ${x + (x - 64) * 0.38} 102`, '#e6e8d0', 0.55)).join('')}
      <path d="M47 106v-13q17-9 34 0v13z" fill="#395a5e"/>${line('M49 94q15-7 30 0M64 91v19M17 111q47 19 95-1', '#d9e5d6', 0.8)}`;
  } else if (id === 'blackstar') {
    body = `${surface('M9 118l19-8h77l17 8-57 8z', 'stone', 'grain')}
      ${surface('M21 114V46h21v68zM86 114V46h21v68z', 'marble', 'grain')}
      <path d="M42 53h5v61h-5M107 46l7-4v69l-7 3z" fill="#939d8c"/>
      ${surface('M15 38h97v25H15z', 'marble', 'grain')}
      <path d="M15 38l8-7h96l-7 7z" fill="#f3e9cb"/><path d="M112 38l7-7v25l-7 7z" fill="#9ca58e"/>
      <path d="M64 4l6 17 18 .4-14 11 5 17-15-10-15 10 5-17-14-11 18-.4z" fill="#263c36" stroke="#1d302a" stroke-width=".8"/>
      ${line('M25 67v43m73-43v43M18 60h91M23 116h22m38 0h26', '#d4c9aa', 1.1)}
      <path d="M48 52h30m-27 4h25" stroke="#7a806d" stroke-width="1.3"/>`;
  } else if (id === 'biomuseo') {
    body = `${surface('M6 116l23-14 68-1 25 14-61 10z', 'stone', 'grain')}
      ${surface('M13 108V73h30v37zM77 110V60h36v49z', 'marble', 'grain')}
      ${[26, 46, 65, 86, 104].map((x) => `<path d="M${x} 111V57h3v54z" fill="#ded7bb"/>`).join('')}
      <path d="M7 69l13-36 34 20-14 34z" fill="#ca685b" stroke="#985d4b" stroke-width=".8"/>
      <path d="M32 61l22-34 32 9-13 36z" fill="#e0b550" stroke="#a68b4c" stroke-width=".8"/>
      <path d="M60 76l22-26 40 13-21 24z" fill="#729f87" stroke="#517c69" stroke-width=".8"/>
      <path d="M76 49l16-28 25 13-6 37z" fill="#6b9fb3" stroke="#517a8e" stroke-width=".8"/>
      <path d="M26 87l22-17 30 22-19 13z" fill="#d79155" stroke="#a27146" stroke-width=".8"/>
      ${line('M9 68l12-32 31 18M34 59l21-28 29 8M79 49l15-25 21 12M64 76l19-23 35 11M28 87l20-14 27 20', '#f5dfab', 1.1)}
      ${rows(5, (i) => line(`M${15 + i * 5} ${55 + i * 3}l-4 14`, '#a4544b', 0.6))}${line('M43 107h24M80 94h29M15 112h96', '#687b6f', 1)}`;
  } else if (id === 'casapueblo') {
    body = `<path d="M2 108q40-14 77-6l47 10v14H2z" fill="#799fa4"/>
      ${surface('M7 113V91q13-15 28-5V67q10-15 23-8V39q9-17 22-2v26q15-8 23 6v20q12-5 18 6v23z', 'marble', 'grain')}
      <path d="M9 93q11-9 28-3v17q16-12 34-6V81q12-8 30-4v24q9-4 20 1v16H9z" fill="${url('snow')}"/>
      <path d="M35 68q10-8 24-3v19q13-4 25 1v17H36z" fill="${url('marble')}"/>
      ${[
        [17, 94],
        [43, 72],
        [62, 43],
        [84, 83],
        [101, 104],
        [53, 106],
        [73, 91],
      ]
        .map(([x, y]) => arch(x, y, 7, 12, '#5f8996'))
        .join('')}
      ${line('M8 91q14-9 29-3M36 67q11-8 23-2M59 38q9-9 18 0M74 78q13-7 28-2M10 113q24 2 44-2t65 4', '#fcf8e9', 1.3)}
      ${rows(5, (i) => line(`M${17 + i * 5} ${108 - i * 0.3}v5`, '#9bafa9', 0.6))}<path d="M71 35V20l4 5-3 3" fill="none" stroke="#8e9b89" stroke-width="1"/>`;
  } else if (id === 'taipei101') {
    body = `${surface('M39 119V99h50v20z', 'glass', 'tiles')}<path d="M65 99h24v20H65z" fill="#426a69"/>
      ${rows(8, (i) => {
        const y = 22 + i * 10;
        return `<path d="M43 ${y}h42l-4 9H47z" fill="${url('glass')}" stroke="#4c7771" stroke-width=".8"/><path d="M64 ${y}h21l-4 9H64z" fill="#4f7f7c"/>${line(`M44 ${y + 1}h39M48 ${y + 8}h32`, '#b9d7bd', 1.1)}${rows(5, (j) => line(`M${50 + j * 6} ${y + 2}v5`, '#d9e8ce', 0.55, 0.7))}<path d="M41 ${y}l3-3 3 3m34 0 3-3 3 3" fill="none" stroke="#739b89" stroke-width="1.5"/>`;
      })}
      ${surface('M53 22V13h22v9z', 'glass', 'tiles')}${line('M64 13V1M58 13V9h12v4', '#729b8f', 1.6, 1)}
      <circle cx="44" cy="105" r="4" fill="#9cae89" stroke="#517972"/><circle cx="84" cy="105" r="4" fill="#9cae89" stroke="#517972"/>${surface('M32 119h64v5H32z', 'stone')}`;
  } else if (id === 'registan') {
    const portal = (x: number, y: number, w: number, h: number) =>
      `${surface(`M${x} ${y + h}V${y}h${w}v${h}z`, 'sandstone')}<path d="M${x + 2} ${y + h - 2}V${y + 2}h${w - 4}v${h - 2}" fill="#5d97a2"/>${arch(x + w * 0.24, y + 10, w * 0.52, h - 10, '#294d58')}${rows(6, (i) => line(`M${x + 3} ${y + 5 + (i * (h - 8)) / 6}h3m${w - 9} 0h3`, '#d8c58a', 1.5, 0.9))}${line(`M${x + 6} ${y + 7}h${w - 12}`, '#e2d7a7', 1.5)}`;
    body = `${surface('M4 106l60-20 60 20-60 21z', 'stone', 'tiles')}
      <path d="M15 56V46q0-16 12-21 12 5 12 21v10zM89 56V46q0-16 12-21 12 5 12 21v10z" fill="#579da4" stroke="#417982" stroke-width="1"/>
      ${line('M27 26v26M101 26v26M19 34q-3 10-2 17m18-17q3 10 2 17M93 34q-3 10-2 17m18-17q3 10 2 17', '#9ac4bb', 1)}
      ${surface('M10 102V54h108v48z')}${portal(44, 43, 40, 55)}${portal(7, 58, 31, 48)}${portal(90, 58, 31, 48)}
      ${[4, 39, 86, 120].map((x) => `${surface(`M${x - 2} 107V38h5v69z`, 'sandstone')}<path d="M${x - 3} 38l3-6 4 6z" fill="#609da5"/>${rows(6, (i) => line(`M${x - 2} ${47 + i * 9}h5`, '#72a5aa', 1.2))}`).join('')}
      ${line('M42 106h44M37 112h54M32 117h64', '#eee1bf', 1.3)}`;
  } else if (id === 'qaboos') {
    const minaret = (x: number, top: number, base: number) =>
      `${surface(`M${x - 3} ${base}V${top + 9}h6v${base - top - 9}z`, 'marble')}<path d="M${x - 4} ${top + 10}h8l-2-5h-4zM${x - 2} ${top + 5}v-4h4v4z" fill="${url('stone')}"/>${line(`M${x} ${top + 1}v-5`, '#bda86e', 0.8, 1)}${line(`M${x - 3} ${base - 18}h6M${x - 3} ${top + 15}h6`, '#9d987e', 0.8)}`;
    body = `${minaret(104, 6, 108)}${minaret(31, 42, 97)}${minaret(90, 42, 97)}
      ${surface('M6 112l58-17 58 17-58 13z', 'stone', 'tiles')}${surface('M18 106V77h92v29z', 'marble')}
      ${surface('M40 104V66h48v38z', 'marble')}<path d="M42 65q-1-21 22-32 23 11 22 32z" fill="${url('gold')}" stroke="#b9a479" stroke-width=".6"/>
      ${rows(7, (i) => line(`M${45 + i * 6} 63Q${48 + i * 5} 44 64 34`, '#f5e6b6', 0.65, 0.65))}${line('M64 33V27', '#b7a06f', 1)}
      ${rows(4, (i) => arch(21 + i * 8, 84, 5, 18, '#74775e'))}${rows(4, (i) => arch(79 + i * 8, 84, 5, 18, '#74775e'))}${arch(55, 76, 18, 29, '#645f49')}${arch(59, 83, 10, 22, '#393f31')}
      ${minaret(12, 45, 112)}${minaret(116, 45, 112)}${line('M18 106h92M20 78h88M40 67h48', '#fff7e4', 1.2)}`;
  } else if (id === 'kuwaittowers') {
    const sphere = (x: number, y: number, r: number) =>
      `<circle cx="${x}" cy="${y}" r="${r}" fill="${url('copper')}" stroke="#4e7b76" stroke-width=".8"/>${rows(
        5,
        (i) => {
          const yy = y - r + 3 + (i * (2 * r - 6)) / 4;
          const w = Math.sqrt(Math.max(0, r * r - (yy - y) * (yy - y)));
          return line(
            `M${x - w} ${yy}q${w} 4 ${2 * w} 0`,
            i % 2 ? '#8fc1bc' : '#476f73',
            1,
            0.7,
          );
        },
      )}<path d="M${x - r * 0.4} ${y - r * 0.8}q${-r * 0.5} ${r * 0.7} 0 ${r * 1.4}" fill="none" stroke="#c0d7bd" stroke-width="1.4" opacity=".6"/>`;
    body = `<path d="M5 116q55-12 116 0" fill="none" stroke="#7d9e99" stroke-width="7" opacity=".4"/>
      ${surface('M102 116l5-85 2-10 2 10 4 85z', 'marble', 'grain')}
      ${surface('M69 118l7-78h7l7 78z', 'marble', 'grain')}${sphere(79, 71, 16)}${line('M79 55V21', '#ced4ba', 2, 1)}
      ${surface('M29 120l8-91h8l8 91z', 'marble', 'grain')}${sphere(41, 78, 23)}${sphere(41, 34, 12)}
      ${line('M41 22V3M32 77h18m-19 3h20', '#d6dec7', 1.5, 0.85)}<path d="M30 32q11 3 22 0v4q-11 4-22 0z" fill="#4b7176"/>${line('M32 33h18', '#d5e5d4', 0.6)}
      ${line('M33 112l3-16M47 112l-2-16M73 111l3-23', '#a5ae97', 0.8)}`;
  } else if (id === 'bahrainwtc') {
    body = `<path d="M10 118V92Q18 43 49 7L54 119z" fill="${url('glass')}" stroke="#71969b" stroke-width=".8"/><path d="M74 119L79 7q31 36 39 85v26z" fill="${url('glass')}" stroke="#71969b" stroke-width=".8"/>
      <path d="M49 7l5 112H43zM79 7l-5 112h11z" fill="#436b79" opacity=".7"/>
      ${rows(14, (i) => {
        const y = 25 + i * 6;
        const x = 49 - (y - 10) * 0.36;
        return line(`M${x} ${y}H50M78 ${y}h${50 - x}`, '#dbe7d9', 0.65, 0.7);
      })}
      ${[49, 73, 96].map((y) => `<path d="M51 ${y}h26" stroke="#a5b9ae" stroke-width="3"/><g transform="translate(64 ${y})"><circle r="2" fill="#dce7de"/><g class="catalog-turbine-rotor">${rows(3, (i) => `<path d="M0-1l-1-13 3 2L2-2z" transform="rotate(${i * 120})" fill="#ecebda" stroke="#718d8e" stroke-width=".5"/>`)}</g></g>`).join('')}
      ${surface('M5 119h118v5H5z', 'stone')}${line('M12 117L49 8M79 8l36 109', '#eef0db', 1.4, 0.8)}`;
  } else if (id === 'skytower') {
    body = `${surface('M43 120l11-24V58h20v38l11 24z', 'marble', 'grain')}<path d="M64 59h10v37l11 24H67z" fill="#81918b" opacity=".6"/>
      ${line('M49 117l9-21V61M79 117l-9-21V61', '#e9e8d8', 1.7)}
      <path d="M39 51q25-11 50 0v8q-25 11-50 0z" fill="${url('glass')}" stroke="#658085" stroke-width=".8"/>
      <ellipse cx="64" cy="50" rx="27" ry="7" fill="${url('marble')}"/><path d="M44 52q20 5 40 0v5q-20 7-40 0z" fill="#507c82"/>
      ${rows(9, (i) => line(`M${46 + i * 4.5} 52v5`, '#c4dbce', 0.6))}
      <path d="M50 44l5-7h18l5 7z" fill="${url('marble')}"/><path d="M56 37V25h16v12z" fill="${url('glass')}"/>
      ${line('M64 25V2M60 25V12m8 13V12M54 37h20M39 60q25 11 50 0', '#a7bcb1', 1.3, 1)}${surface('M36 120h56v4H36z', 'slate', 'grain')}`;
  } else if (id === 'tiranapyramid') {
    body = `${surface('M4 107l60-22 60 22-60 19z', 'stone', 'tiles')}
      <path d="M8 105L57 28h14l49 77-56 13z" fill="${url('marble')}" stroke="#9ba89f" stroke-width="1"/><path d="M64 30v86l56-11-49-77z" fill="#b5c1b6"/>
      ${[15, 32, 49, 79, 96, 113]
        .map(
          (x) =>
            `<path d="M${x} 106L64 30" stroke="#f6f4df" stroke-width="5"/>${rows(
              11,
              (i) => {
                const t = (i + 1) / 12,
                  xx = 64 + (x - 64) * t,
                  yy = 30 + 76 * t;
                return line(`M${xx - 2.5} ${yy}h5`, '#92a69c', 0.65, 0.8);
              },
            )}`,
        )
        .join('')}
      ${[
        [13, 91, '#e5a96c'],
        [37, 103, '#b7b061'],
        [91, 91, '#73abb1'],
        [74, 110, '#d48072'],
      ]
        .map(
          ([x, y, color]) =>
            `<g transform="translate(${x} ${y})"><path d="M0 0l10-4 10 4-10 4z" fill="${color}"/><path d="M0 0v12l10 4V4z" fill="${color}"/><path d="M10 4l10-4v12l-10 4z" fill="#6b7770"/><path d="M3 4l4 2v7l-4-1z" fill="#425c59"/></g>`,
        )
        .join('')}
      <path d="M57 28h14l-7-4z" fill="#edf0dc"/>`;
  } else if (id === 'bucharestpalace') {
    body = `${surface('M3 121V83h122v38z', 'marble')}${surface('M12 83V62h104v21z', 'marble')}${surface('M25 62V42h78v20z', 'marble')}${surface('M39 42V26h50v16z', 'marble')}
      ${rows(4, (row) => {
        const y = [32, 49, 69, 91][row],
          x = [44, 30, 17, 8][row],
          n = [7, 13, 17, 20][row];
        return rows(
          n,
          (col) =>
            `<path d="M${x + col * 5.5} ${y}h2.5v${row === 3 ? 17 : 8}h-2.5z" fill="#667468"/>${line(`M${x + col * 5.5 - 1} ${y - 2}v${row === 3 ? 21 : 12}`, '#f8f0da', 1.1, 0.9)}`,
        );
      })}
      ${surface('M47 118V77h34v41z', 'stone')}${rows(5, (i) => `<path d="M${50 + i * 6} 83h3v24h-3z" fill="#faf1da"/>`)}${arch(59, 98, 10, 21, '#485748')}
      ${line('M3 84h122M12 63h104M25 43h78M39 27h50M4 113h40m40 0h39', '#fff6df', 2)}<path d="M44 77l20-8 20 8z" fill="#c8c1a7"/>
      ${line('M40 121h48M44 118h40M48 115h32', '#9aa58b', 1)}${line('M64 26V13', '#838b76', 0.8)}<path d="M65 14h9v5h-9z" fill="#b4ad78"/>`;
  } else if (id === 'lalibela') {
    body = `${surface('M5 91l31-25 79 7 8 41-65 12-53-14z', 'sandstone', 'grain')}<path d="M22 92l30-18 49 6 7 30-48 10-38-13z" fill="#6c4f40"/>${surface('M43 113V78l-13-4V60l17-6V40l31 3v16l17 4v18l-16-2v35l-19 5z', 'sandstone')}${surface('M30 60l17-6V40l31 3v16l17 4-19 8v15l-29-6V66z', 'stone')}${line('M51 45l22 2v14l16 4-18 4v12l-19-5V63l-15-3 15-4z', '#f5d3aa', 1.2)}${rows(3, (i) => arch(49 + i * 10, 87, 4, 13))}${line('M12 100l5-20m88 12 3 13', '#d1a180', 1)}`;
  } else if (id === 'djenne') {
    body = `${surface('M6 116V76h114v40z', 'sandstone', 'grain')}${[22, 61, 99].map((x, i) => `${surface(`M${x - 10} 116l3-66 7-${i === 1 ? 28 : 17} 7 ${i === 1 ? 28 : 17} 4 66z`, 'sandstone', 'grain')}${line(`M${x} ${i === 1 ? 20 : 31}v-8`, '#7c5c3c', 2)}<circle cx="${x}" cy="${i === 1 ? 12 : 23}" r="3" fill="#d8c99e"/>${rows(6, (j) => line(`M${x - 13} ${58 + j * 8}h27`, '#594936', 2))}`).join('')}${rows(8, (i) => surface(`M${8 + i * 14} 116l3-34 4-3 3 37z`, 'dune', 'grain'))}${arch(54, 87, 15, 29, '#443b2b')}${line('M5 117h117', '#e7bd8f', 2)}`;
  } else if (id === 'leptis') {
    body = `${surface('M5 117l26-16 90 6 4 12-91 6z')}${surface('M35 108V39h60v69h-15V67H51v41z')}${surface('M30 36h71v11H30zM37 25h57v13H37z')}${arch(51, 47, 28, 55, '#465349')}${rows(4, (i) => `${surface(`M${12 + i * 29} 113V58h6v55z`)}${surface(`M${9 + i * 29} 55h12v6H${9 + i * 29}z`)}`)}${line('M36 31h58M32 40h67M42 53v50m46-50v50', '#f5e7c5', 1.4)}<path d="M89 114l12-7 14 7z" fill="#83916d"/>`;
  } else if (id === 'eljem') {
    body = `<ellipse cx="64" cy="63" rx="55" ry="25" fill="#746c54"/><ellipse cx="64" cy="63" rx="38" ry="14" fill="#3f5145"/>${surface('M9 63q55 38 110 0v42q-55 34-110 0z')}${surface('M9 63V45q17-17 43-19v25q-25 2-43 12z')}${surface('M85 31q21 6 34 19v13L85 55z')}${rows(3, (r) => rows(12, (c) => arch(13 + c * 9, 66 + Math.sin((c / 11) * Math.PI) * 16 + r * 12, 5.5, 9)))}${rows(3, (r) => line(`M9 ${72 + r * 12}q55 34 110 0`, '#f0d9b2', 1.5))}${line('M10 45q17-17 42-19m33 5q20 5 33 19', '#fff0ce', 1.2)}`;
  } else if (id === 'meroe') {
    body = `<path d="M2 117q26-23 59-5t65 1v11H2" fill="${url('dune')}"/>${[
      [14, 47, 45],
      [47, 18, 55],
      [87, 48, 38],
    ]
      .map(
        ([x, y, w]) =>
          `${surface(`M${x} 115l${w / 2}-${115 - y} ${w / 2} ${115 - y}z`, 'stone')}<path d="M${x + w / 2} ${y}l4 ${115 - y}h${w / 2 - 4}z" fill="#89704c"/>${surface(`M${x + w / 2 - 8} 117v-17h17v17z`, 'sandstone')}${arch(x + w / 2 - 3, 104, 6, 13, '#4a4030')}${rows(7, (i) => line(`M${x + w / 2 - 5 - i * 2} ${y + 20 + i * 8}h${10 + i * 4}`, '#8e7654', 0.6))}`,
      )
      .join('')}`;
  } else if (id === 'timgad') {
    body = `${surface('M8 116V32h111v84h-16V72H83v44H45V72H25v44z')}${arch(48, 45, 32, 72, '#34483c')}${arch(13, 72, 25, 44, '#3c4c3f')}${arch(89, 72, 25, 44, '#3c4c3f')}${surface('M5 30h118v13H5zM15 15h98v16H15z')}${[10, 38, 83, 111].map((x) => `${surface(`M${x} 115V46h6v69z`)}${line(`M${x + 2} 49v62`, '#f3e1bd', 1.5)}`).join('')}${surface('M7 116h114v7H7z')}${line('M16 20h96M6 35h116M46 48q18-20 36 0', '#eeddba', 1.2)}`;
  } else if (id === 'renaissance') {
    body = `${surface('M10 117l24-20h58l26 20z', 'grass', 'grain')}${surface('M37 109l10-12h34l11 12z', 'stone')}${surface('M46 100l8-34-10-24 8-17 13-2 11 17-2 23 15 35-14 3-14-27-4 29z', 'copper', 'grain')}<circle cx="59" cy="16" r="9" fill="${url('copper')}"/><path d="M69 35l22-10 12-14 7 5-12 19-24 12" fill="${url('copper')}"/>${surface('M37 99l-8-30 7-25 13-3 6 21-9 20 5 19z', 'copper', 'grain')}<circle cx="39" cy="33" r="7" fill="${url('copper')}"/><path d="M34 49L17 65l-5-4 18-24M91 23l-6-13 7-5 8 12 13-16 4 4-13 22z" fill="${url('copper')}"/><circle cx="90" cy="4" r="5" fill="${url('copper')}"/>${line('M55 31l-4 12 10 20m-23-16-4 22 8 22m23-59 6 9 18-9', '#d9c9a3', 1.2)}`;
  } else if (id === 'yamoussoukro') {
    body = `${surface('M5 109h118v12H5z', 'marble')}${rows(13, (i) => `${surface(`M${8 + i * 8.6} 109V76h4v33z`, 'marble')}`)}${surface('M3 72q61-24 122 0v6q-61-20-122 0z', 'marble')}${surface('M38 110V66h52v44z', 'marble')}${surface('M34 66Q35 34 64 27q29 7 30 39z', 'marble', 'tiles')}<path d="M64 28q-8 18-7 38h-23q1-30 30-38" fill="#fff9e4" opacity=".5"/>${surface('M57 28V17h14v11z', 'marble')}${line('M64 17V5m-5 6h10M35 67h59M38 73h52', '#a28c63', 1.5)}${arch(55, 81, 18, 29)}${rows(3, (i) => arch(41 + i * 17, 70, 10, 11))}`;
  } else if (id === 'mbanzakongo') {
    body = `${surface('M3 117l24-15 92 4 6 17H3z', 'grass', 'grain')}${surface('M16 111V56l16-18 18 18v55z', 'stone')}${arch(25, 70, 16, 41, '#43513e')}${surface('M50 110V59h58v49z', 'stone')}${surface('M108 108V47l10 7v51z', 'stone')}${rows(4, (i) => arch(57 + i * 12, 72, 7, 29, '#4f5943'))}${line('M18 57l14-16 16 16M52 61h54M53 109h54', '#e5d5b2', 1.3)}<path d="M52 59l6-7 4 6 11-10 7 11 9-5 5 5" fill="#c1ac85"/>${line('M11 116l10-4m80 3 12-7', '#779466', 3)}`;
  } else if (id === 'rila') {
    body = `${surface('M5 111V63h117v49z', 'marble')}${rows(12, (i) => arch(9 + i * 9.5, 78, 7, 28, '#6b4e3f'))}${line('M6 70h116M7 76h113', '#994c43', 4)}${surface('M29 111V60h73v51z', 'marble')}${[42, 65, 88].map((x, i) => `${surface(`M${x - 8} 62V42h16v20z`, 'sandstone')}<path d="M${x - 11} 43q11-${i === 1 ? 26 : 20} 22 0z" fill="${url('slate')}"/>${line(`M${x} ${i === 1 ? 22 : 28}v-8m-3 3h6`, '#ad9565', 1)}`).join('')}${rows(6, (i) => arch(34 + i * 10, 79, 7, 31, '#574e40'))}${rows(4, (i) => line(`M30 ${68 + i * 10}h72`, '#a95749', 2))}${surface('M8 60l15-19 15 19z', 'slate')}`;
  } else if (id === 'mostar') {
    body = `<path d="M2 115q31-17 62-1t62-4v15H2z" fill="#619e9c"/>${surface('M4 107V75Q64 9 124 75v32h-9V80Q64 31 13 80v27z', 'marble')}${line('M6 75Q64 9 122 75M13 79Q64 29 115 79', '#eee6ca', 2)}${rows(
      17,
      (i) => {
        const a = (Math.PI * (i + 1)) / 18;
        return line(
          `M${64 - 55 * Math.cos(a)} ${79 - 42 * Math.sin(a)}l${-6 * Math.cos(a)} ${-11 * Math.sin(a)}`,
          '#a79e82',
          0.8,
        );
      },
    )}${surface('M4 101V55h17v46zM107 101V57h17v44z')}${surface('M1 55l12-14 12 14zM104 57l12-14 12 14z', 'slate')}${arch(9, 67, 6, 16)}${arch(112, 69, 6, 16)}${line('M21 115h28m29 4h26', '#c5e1d4', 1)}`;
  } else if (id === 'sava') {
    body = `${surface('M11 116V83h106v33z', 'marble')}${surface('M31 114V57h66v57z', 'marble')}${surface('M47 59V42h34v17z', 'marble')}<path d="M42 42Q43 14 64 12q22 2 23 30z" fill="${url('copper')}"/>${[23, 105].map((x) => `${surface(`M${x - 9} 85V64h18v21z`, 'marble')}<path d="M${x - 12} 64q12-27 24 0z" fill="${url('copper')}"/>`).join('')}${line('M64 14V2m-5 6h10M42 43h45M32 60h64', '#a9976e', 1.5)}${arch(52, 79, 24, 36)}${[17, 91].map((x) => arch(x, 91, 17, 24)).join('')}${rows(5, (i) => arch(37 + i * 11, 65, 7, 12))}`;
  } else if (id === 'bled') {
    body = `<ellipse cx="64" cy="116" rx="62" ry="11" fill="#77b5b2"/>${surface('M9 112l15-17 15-8 43 2 31 23-45 9z', 'grass', 'grain')}${surface('M30 103V71h57v32z', 'marble')}${surface('M24 72l32-21 36 21z', 'sandstone', 'tiles')}${surface('M77 104V43h17v61z', 'marble')}${surface('M74 43l11-22 12 22z', 'slate')}${line('M85 22V12m-3 5h6', '#9d8a5d', 1)}${arch(81, 48, 8, 13)}${rows(4, (i) => arch(36 + i * 12, 80, 7, 17))}<path d="M48 106l-8 11h13l5-10z" fill="#e7d6b5"/>${line('M7 118h22m61 3h27', '#e1eee0', 1)}<path d="M18 102l6-23 7 23m72 4 5-20 7 20" fill="#4d7c59"/>`;
  } else if (id === 'trakai') {
    body = `<ellipse cx="64" cy="117" rx="62" ry="10" fill="#73a2a6"/>${surface('M13 111V77h104v36z', 'sandstone')}${[22, 104].map((x) => `${surface(`M${x - 10} 114V63h20v51z`, 'sandstone')}<path d="M${x - 14} 63l14-23 14 23z" fill="#865043"/>${arch(x - 3, 76, 6, 16)}`).join('')}${surface('M47 106V38h35v68z', 'sandstone')}${surface('M41 38l23-28 24 28z', 'sandstone', 'tiles')}${rows(3, (i) => arch(53 + i * 9, 48, 5, 11))}${rows(2, (i) => arch(54 + i * 12, 67, 6, 12))}${arch(56, 87, 16, 22)}${line('M14 79h32m37 0h32M45 39h40', '#e2b48e', 1)}<path d="M59 109h13l8 17H50z" fill="#baa180"/>`;
  } else if (id === 'blackheads') {
    body = `${surface('M18 117V61h87v56z', 'sandstone')}${surface('M15 63h13V51h10V39h10V27h12V15h14v12h10v12h10v12h12v12z', 'sandstone')}${surface('M87 117V76h27v41z', 'marble')}${rows(3, (r) => rows(5, (c) => arch(26 + c * 15, 68 + r * 15, 7, 11)))}${line('M20 64h84M29 51h66M41 38h43M50 26h26', '#f5e5c6', 2)}<circle cx="66" cy="47" r="8" fill="#335b61" stroke="#e0c182" stroke-width="2"/>${line('M66 42v5l4 2', '#f8e9be', 1.3)}${[35, 65, 94].map((x) => `<path d="M${x} 96v12" stroke="#d8c496" stroke-width="4"/>`).join('')}${arch(59, 100, 14, 17, '#3f4b3c')}`;
  } else if (id === 'tallinn') {
    body = `${surface('M12 113V66h99v47z', 'marble')}${surface('M6 67l27-28h59l27 28z', 'sandstone', 'tiles')}${rows(8, (i) => arch(19 + i * 11, 89, 8, 24))}${rows(6, (i) => arch(22 + i * 14, 71, 6, 12))}${surface('M96 107V30h11v77z', 'marble')}<path d="M93 31l8-20 9 20zM100 12V0" fill="#5b7f71" stroke="#536f5e"/>${arch(99, 37, 5, 12)}${line('M12 68h98M13 86h98M15 114h97', '#e8dcc1', 1.5)}`;
  } else if (id === 'taktsang') {
    body = `${surface('M9 123l3-46 18-19 2-35 24-16 13 17 17-9 21 25 14 83z', 'mountain', 'grain')}${line('M25 37l10 16-8 25 7 39m59-85-8 21 9 18-6 26', '#c2bba3', 1)}${[
      [17, 74, 34],
      [48, 54, 35],
      [80, 76, 31],
    ]
      .map(
        ([x, y, w]) =>
          `${surface(`M${x} ${y + 31}V${y}h${w}v31z`, 'marble')}<path d="M${x - 4} ${y}l${w / 2 + 4}-13 ${w / 2 + 4} 13-3 5H${x}z" fill="${url('gold')}"/><path d="M${x} ${y + 8}h${w}v7H${x}z" fill="#a04f40"/>${rows(3, (i) => arch(x + 4 + i * 10, y + 19, 5, 9))}`,
      )
      .join('')}${line('M10 110h38m33-2h38', '#e1d6b4', 2)}`;
  } else if (id === 'xiengthong') {
    body = `${surface('M15 115V74h98v41z', 'sandstone')}<path d="M22 80h85v29H22z" fill="#754d38"/>${rows(7, (i) => line(`M${27 + i * 12} 79v32`, '#cfb36c', 3))}${[79, 63, 48].map((y, i) => `${surface(`M${5 + i * 10} ${y}Q36 ${y - 5} 60 ${y - 24}h8q21 19 ${55 - i * 10} 24l-6 7H${11 + i * 10}z`, 'slate', 'tiles')}${line(`M${5 + i * 10} ${y}q59 17 ${118 - i * 20} 0`, '#d5b65a', 2)}`).join('')}${line('M61 24l3-17 4 17M7 78l-4-9m118 9 4-9', '#e1c978', 1.5)}${surface('M9 116h112v6H9z', 'stone')}`;
  } else if (id === 'watarun') {
    const prang = (x: number, y: number, w: number, h: number) =>
      `${surface(`M${x - w / 2} ${y + h}l3-${h * 0.25} 4-3 2-${h * 0.3} 4-7 ${w / 2 - 13}-${h * 0.45 - 10} ${w / 2 - 13} ${h * 0.45 - 10} 4 7 2 ${h * 0.3} 4 3 3 ${h * 0.25}z`, 'marble', 'tiles')}${rows(8, (i) => line(`M${x - w / 2 + 4 + i * 1.1} ${y + h - (i * h) / 10}h${w - 8 - i * 2.2}`, i % 2 ? '#8faaa0' : '#c7b37d', 1.7))}`;
    body = `${prang(22, 61, 34, 56)}${prang(104, 61, 34, 56)}${prang(64, 8, 60, 110)}${surface('M18 116h92v7H18z', 'marble')}${line('M64 10V0m-3 6h6', '#a78f5b', 1.2)}${arch(57, 85, 14, 25)}`;
  } else if (id === 'badshahi') {
    body = `${surface('M4 116h120v7H4z', 'sandstone')}${surface('M23 114V69h82v45z', 'sandstone')}${[39, 64, 89].map((x, i) => `${surface(`M${x - 10} 70V58h20v12z`, 'marble')}<path d="M${x - 13} 59Q${x - 16} ${i === 1 ? 31 : 39} ${x} ${i === 1 ? 26 : 34}Q${x + 16} ${i === 1 ? 31 : 39} ${x + 13} 59z" fill="${url('marble')}"/>`).join('')}${[10, 114].map((x) => `${surface(`M${x - 4} 116V30h8v86z`, 'sandstone')}<path d="M${x - 7} 31q7-16 14 0z" fill="${url('marble')}"/>${rows(4, (i) => line(`M${x - 6} ${44 + i * 18}h12`, '#ecd9bd', 2))}`).join('')}${arch(53, 82, 22, 32)}${[31, 85].map((x) => arch(x, 85, 12, 25)).join('')}${line('M24 74h80M48 112V82q16-17 32 0v30', '#ecd5b6', 1)}`;
  } else if (id === 'golestan') {
    body = `${surface('M5 116V68h118v48z', 'marble')}${surface('M28 68V35h73v33z', 'stone')}${surface('M24 34h81v8H24z', 'marble')}${[31, 89].map((x) => `${surface(`M${x} 68V24h10v44z`, 'stone')}<path d="M${x - 3} 24l8-12 8 12z" fill="${url('slate')}"/>`).join('')}${rows(8, (i) => arch(11 + i * 14, 80, 10, 25, '#486f72'))}${rows(5, (i) => arch(40 + i * 10, 47, 6, 15, '#38686e'))}${rows(6, (i) => `<path d="M${9 + i * 19} 109l8-5 8 5-8 5z" fill="#639b9c"/>`)}${line('M7 73h114M29 43h70M8 116h112', '#d5b675', 2)}<ellipse cx="64" cy="121" rx="27" ry="5" fill="#8bbdb5"/>`;
  } else if (id === 'chinggis') {
    body = `${surface('M13 112q51-28 102 0v10H13z', 'marble')}${rows(12, (i) => line(`M${18 + i * 8} 113v9`, '#81948d', 1.3))}${surface('M32 101l5-30 10-15 33-2 19 17-3 29h-9l-3-25-31 1-12 25z', 'titanium', 'grain')}<path d="M78 59l3-28 8-13 14 8-4 15-11 4 2 22zM37 64L18 76l-3 20 7-3 5-14 17-7" fill="${url('titanium')}"/>${surface('M48 64l2-30 8-12 14 2 7 16-9 25z', 'titanium', 'grain')}<circle cx="64" cy="15" r="8" fill="${url('titanium')}"/><path d="M52 13l12-10 11 9z" fill="#a5b2ac"/>${line('M54 38l16 14 15-13M49 65h30M87 22l8 5M39 77l-3 21m53-21 3 20', '#f2ecd4', 1.6)}`;
  } else if (id === 'tikal') {
    body = `<path d="M0 117l8-20 9 14 7-23 11 29m58 0 9-26 7 17 12-24 7 33" fill="#436f4c"/>${rows(
      9,
      (i) => {
        const y = 113 - i * 7;
        return surface(
          `M${16 + i * 3.7} ${y}h${96 - i * 7.4}v8H${16 + i * 3.7}z`,
          'slate',
        );
      },
    )}${surface('M45 52V24h37v28z', 'stone')}${surface('M47 25V10l17-8 16 8v15z', 'slate')}${arch(56, 30, 15, 22, '#263c32')}<path d="M59 53h10l13 69H45z" fill="#b4b297"/>${rows(17, (i) => line(`M${59 - i * 0.8} ${56 + i * 3.8}h${10 + i * 1.6}`, '#687565', 0.9))}${line('M48 12l16-7 14 7M45 26h37', '#e5d7b2', 1.1)}`;
  } else if (id === 'copan') {
    body = `${rows(6, (i) => surface(`M${4 + i * 6} ${115 - i * 9}h${89 - i * 12}v9H${4 + i * 6}z`, 'stone'))}${surface('M33 62V43h32v19z', 'slate')}${arch(43, 46, 12, 16)}${surface('M88 116V37l11-8 11 8v79z', 'stone', 'grain')}${rows(8, (i) => `<path d="M91 ${43 + i * 8}h15v5H91z" fill="none" stroke="#796c50" stroke-width=".8"/><circle cx="98" cy="${46 + i * 8}" r="1.8" fill="#796c50"/>`)}${rows(5, (i) => rows(6, (j) => line(`M${14 + i * 6 + j * 2} ${109 - i * 9}h3`, '#8d7958', 1)))}${line('M89 37l10-7 10 7M87 116h25', '#eee0b7', 1.3)}`;
  } else if (id === 'joyaceren') {
    body = `${surface('M3 116l27-14 91 4 4 17H3z', 'grass', 'grain')}${[
      [14, 70, 39],
      [67, 82, 43],
    ]
      .map(
        ([x, y, w]) =>
          `${surface(`M${x} ${y + 34}V${y}h${w}v34z`, 'dune', 'grain')}<path d="M${x - 7} ${y}l${w / 2 + 7}-25 ${w / 2 + 7} 25-5 5H${x - 2}z" fill="${url('iron')}"/>${rows(7, (i) => line(`M${x - 3 + (i * (w + 6)) / 6} ${y}L${x + w / 2} ${y - 22}`, '#d4b68a', 0.8))}${arch(x + w / 2 - 5, y + 12, 10, 22)}${line(`M${x + 3} ${y + 25}h8`, '#dfbc8d', 1)}`,
      )
      .join(
        '',
      )}<path d="M8 113l3-16m-3 8-6-5m9 3 6-5" fill="none" stroke="#6a8652" stroke-width="2"/>`;
  } else if (id === 'arenal') {
    body = `${surface('M4 116l22-26 20-38 17-29 10 2 22 49 29 42z', 'mountain', 'grain')}<path d="M65 24L31 114H7l19-24 20-38z" fill="#7f9875" opacity=".6"/>${line('M60 33l8-5 7 4M62 44l-18 39-9 19m41-55 12 37 13 18', '#acb29a', 1.3)}<path d="M4 115l10-12 8 6 8-16 10 13 10-8 12 11 10-9 12 12 13-8 11 9 9-8 7 12v7H4z" fill="#447355"/>${line('M16 113l4-5m37 7 5-4m29 6 5-3', '#8bb17a', 1.5)}<path d="M65 25q-10-9 2-13t-2-10" fill="none" stroke="#e4e1ca" stroke-width="3" opacity=".6"/>`;
  } else if (id === 'cartagena') {
    body = `${surface('M3 116V85h122v31z', 'gold', 'grain')}${rows(3, (i) => arch(10 + i * 42, 89, 25, 27))}${surface('M48 88V42h33v46z', 'gold', 'grain')}<path d="M44 43l20-23 21 23z" fill="#a67a4e"/>${surface('M52 43V27h25v16z', 'gold', 'grain')}<path d="M50 27l14-19 15 19z" fill="#8d775a"/>${line('M64 9V1M44 44h40M48 82h33M3 85h122', '#f7df9e', 1.5)}<circle cx="64" cy="59" r="11" fill="#f0e3be" stroke="#786a50" stroke-width="1.2"/>${line('M64 52v7l5 3', '#514c39', 1.6)}${rows(4, (i) => line(`M${52 + i * 8} 74v6`, '#876d44', 1.2))}`;
  } else if (id === 'quitofrancisco') {
    body = `${surface('M8 115V64h112v51z', 'marble')}${surface('M40 115V55l24-19 24 19v60z', 'stone')}${[14, 97].map((x) => `${surface(`M${x} 66V27h17v39z`, 'marble')}${arch(x + 4, 34, 9, 17)}<path d="M${x - 3} 27l11-17 12 17z" fill="${url('slate')}"/>`).join('')}${arch(52, 79, 24, 36)}${rows(2, (i) => arch(21 + i * 74, 80, 12, 25))}${line('M40 58l24-18 24 18M10 68h29m49 0h30M43 72h42M13 113h104', '#e9dbbc', 1.8)}<circle cx="64" cy="60" r="6" fill="#6e806f"/>${surface('M3 117h122v7H3z', 'stone')}`;
  } else if (id === 'tiwanaku') {
    body = `${surface('M3 115l22-13 95 7 5 14H3z', 'grass', 'grain')}${surface('M22 115V39h82v76H80V73H48v42z', 'slate')}${surface('M18 36h90v30H18z', 'stone')}${rows(3, (r) => rows(11, (c) => `<path d="M${23 + c * 7} ${40 + r * 7}l3-2 3 2v3l-3 1-3-1z" fill="none" stroke="#786e51" stroke-width=".8"/>`))}${line('M23 68h23v44M82 112V68h20M20 36h86', '#d9caa7', 1.5)}<path d="M59 41h14v17H59z" fill="#8a7d60"/>${line('M62 45h8m-4-3v13m-4-4h8', '#d1bd95', 1)}${surface('M5 117h118v6H5z', 'stone')}`;
  } else if (id === 'sanssouci') {
    body = `${surface('M4 117l14-10h91l15 10z', 'grass', 'grain')}${surface('M12 108V53h105v55z', 'stone')}${rows(8, (i) => arch(17 + i * 12, 59, 8, 20))}${rows(8, (i) => arch(17 + i * 12, 85, 8, 23))}${surface('M43 108V39h42v69z', 'stone')}${arch(53, 47, 22, 24, '#4a5546')}${arch(54, 84, 20, 24, '#4a5546')}${line('M13 80h103M44 40h40M43 76h42', '#e6d7b5', 2)}<path d="M43 39l7-7 8 4 8-10 8 12 11 1" fill="#bdaa84"/>${surface('M44 109h40l16 13H28z', 'marble')}${rows(4, (i) => line(`M${43 - i * 3} ${111 + i * 3}h${42 + i * 6}`, '#8b927b', 1))}`;
  } else if (id === 'nanmadol') {
    body = `<path d="M0 112q25-9 49 0t49 0t30 0v15H0z" fill="#649b9b"/>${surface('M9 110l25-17 86 8-24 21z', 'slate', 'grain')}${rows(7, (i) => `${surface(`M16 ${106 - i * 8}l30-17 62 11v6l-62-9-30 16z`, 'slate', 'grain')}${line(`M17 ${107 - i * 8}l29-17 60 11`, '#b0b8a1', 1)}`)}<path d="M45 90V53l37 6v37z" fill="#304e45"/>${rows(6, (i) => surface(`M90 ${106 - i * 8}l20-12 10 3v6l-20 12z`, 'slate', 'grain'))}${line('M5 120h20m83 1h17', '#cce3d4', 1.2)}<path d="M112 44l4-25 5 27" fill="#669167"/>`;
  } else if (id === 'pngparliament') {
    body = `${surface('M12 117V79h107v38z', 'stone')}${surface('M24 115V61l40-45 40 45v54z', 'sandstone', 'grain')}<path d="M10 83Q40 48 64 4q21 44 54 79L64 28z" fill="${url('iron')}"/><path d="M26 75L64 29l38 46v37H26z" fill="#a16d4a"/>${rows(6, (i) => `<path d="M${32 + i * 11} 76v34" stroke="#d5b57a" stroke-width="4"/>`)}<path d="M44 64l20-25 20 25-20 14z" fill="#d2aa65"/><path d="M51 62l13-13 13 13-13 9z" fill="#6e6048"/>${arch(54, 86, 21, 28)}${line('M12 83Q40 48 64 5q21 44 54 78M26 114h76', '#e1bd87', 1.5)}${surface('M6 118h116v6H6z', 'marble')}`;
  } else if (id === 'tongapalace') {
    body = `${surface('M8 115V74h112v41z', 'marble')}${surface('M4 74l24-24h73l23 24z', 'sandstone', 'tiles')}${surface('M49 114V41h30v73z', 'marble')}<path d="M44 42l20-21 20 21z" fill="#a66f58"/>${line('M64 23V5', '#8c8268', 1.2)}<path d="M65 6h17v9H65z" fill="#b16e60"/><path d="M67 8h6v4h-6z" fill="#efe7cf"/>${rows(7, (i) => `${surface(`M${15 + i * 15} 114V84h3v30z`, 'marble')}`)}${rows(6, (i) => arch(17 + i * 17, 88, 9, 17))}${arch(58, 51, 13, 20)}${arch(57, 89, 15, 25)}${line('M10 81h108M51 77h26M8 115h112', '#a7b4a3', 1.3)}<path d="M55 115h19l11 9H44z" fill="#cac3a9"/>`;
  } else if (id === 'giza') {
    body = `${surface('M6 112L56 18l66 94z')}
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
      <path d="M42 57l5-7 4 7z" fill="#5b503c" opacity=".6"/>${line('M17 104l5-5m11-28 3-4m28 27 2 7m25-16 4 6', '#69583e', 0.85, 0.5)}`;
  }
  body = expandedLandmarkArt(id, url) || body;
  const life = landmarkLife(id);
  const tier =
    landmarks.find((landmark) => landmark.id === id)?.tier ?? 'common';
  const wonder = tier === 'legendary';
  const intensity = landmarkIntensity(tier, id, prefix);
  if (wonder) {
    body = `<g class="wonder-body">${body}</g>${life}<g class="wonder-effects"><ellipse cx="64" cy="118" rx="61" ry="15" fill="none" stroke="#d7b46a" stroke-width=".7" opacity=".6"/><g transform="translate(64 72) scale(1 .55)"><g class="wonder-orbit"><path d="M58-8l10 6-2 12-12-4z" fill="${url('stone')}" stroke="#8c7450" stroke-width=".7"/><path d="M-60-10l10 4-2 12-12-6z" fill="${url('stone')}" stroke="#e1c895" stroke-width=".7"/><path d="M39-40l7 3-1 8-8-3zM-46 32l8 3-2 7-7-3zM-40-35l5-3 4 6-5 3zM39 34l6-2 3 6-6 2z" fill="${url('stone')}" stroke="#d4be86" stroke-width=".6"/><circle cx="0" cy="-64" r="2" fill="#f9e8ba"/><circle cx="0" cy="64" r="1.6" fill="#f9e8ba"/></g></g><path class="wonder-spark spark-one" d="M12 40v10m-5-5h10" stroke="#eee2bc" stroke-width="1"/><path class="wonder-spark spark-two" d="M114 28v8m-4-4h8" stroke="#edddb2" stroke-width="1"/></g>`;
  }
  if (!wonder) body += life;
  // 회전하는 날개와 조명이 그림 가장자리에서 잘리지 않도록 여백을 확보한다.
  const viewBox = wonder
    ? '-20 -24 168 168'
    : id && landmarks.findIndex((entry) => entry.id === id) >= 100
      ? '-8 -12 144 144'
      : ['sagrada', 'nanmadol', 'tikal'].includes(id)
        ? '-8 -8 144 144'
        : id === 'kinderdijk'
          ? '-12 -8 152 144'
          : id === 'eiffel'
            ? '-8 -24 144 152'
            : id === 'liberty'
              ? '-4 -6 136 136'
              : '0 0 128 128';
  return `<svg class="landmark-art${wonder ? ' wonder-art' : ''}" data-material-art="${id}" data-animation-tier="${tier}" viewBox="${viewBox}" aria-hidden="true">${defs}${intensity.back}<ellipse ${wonder ? 'class="wonder-shadow"' : ''} cx="64" cy="118" rx="53" ry="7" fill="#34372b" opacity=".17"/>${body}${intensity.front}</svg>`;
}
