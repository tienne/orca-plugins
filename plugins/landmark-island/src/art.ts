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
  return `<svg class="landmark-art${id === 'giza' ? ' wonder-art' : ''}" data-material-art="${id}" viewBox="${id === 'giza' ? '-20 -24 168 168' : '0 0 128 128'}" aria-hidden="true">${defs}<ellipse ${id === 'giza' ? 'class="wonder-shadow"' : ''} cx="64" cy="118" rx="53" ry="7" fill="#34372b" opacity=".17"/>${body}</svg>`;
}
