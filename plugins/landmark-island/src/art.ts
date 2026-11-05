// Original miniature vector silhouettes, distributed under the repository MIT license.
const shapes: Record<string, string> = {
  eiffel:
    'M29 5h6l3 26 9 27H35l-3-14-4 14H16l10-27z M19 37h26 M23 27h18 M27 17h10',
  colosseum:
    'M7 28Q32 10 57 28v27Q32 65 7 55z M7 37q25 10 50 0 M16 28v27 M27 24v33 M38 24v33 M49 28v27 M7 46q25 10 50 0',
  stonehenge:
    'M10 22h9v35h-9z M27 19h9v38h-9z M45 22h9v35h-9z M6 16h19v9H6z M23 12h19v9H23z M40 16h19v9H40z',
  liberty:
    'M24 58h22v-8H24z M28 49l5-24-8-9-6-13-5 3 6 17 8 8-5 18z M32 25l10 1 6 17-7 3-4-12 M31 17l-4-6 6 2 3-7 2 7 7-2-4 7z',
  opera:
    'M5 53h54v5H5z M7 49L4 29q20-1 23 20z M22 49L16 12q27 6 26 37z M37 49L49 20q15 11 10 29z',
  fuji: 'M4 58L31 8l29 50z M21 27l10-19 11 20-8-5-6 5-3-4z',
  taj: 'M12 55V33h40v22z M20 33q-3-14 12-23 15 9 12 23z M5 55V24h5v31z M54 55V24h5v31z M27 55V42q5-9 10 0v13 M32 10V5',
  petra:
    'M8 57V20l24-15 24 15v37z M10 23h44 M18 27v26 M25 27v26 M39 27v26 M47 27v26 M29 57V41h7v16 M17 18h30',
  chichen:
    'M4 57v-8h5v-8h6v-8h6v-8h5V14h13v11h5v8h6v8h6v8h5v8z M29 57V24h6v33 M26 20h13',
  angkor:
    'M5 57V38h9V25h6V15h5v22h3V23h2V10h4V4h3v6h3v13h2v14h3V15h5v10h6v13h5v19z M10 45h45 M15 51h40',
  machu:
    'M3 35L16 14l15 22L43 5l18 30v23H3z M9 40h23v7H9z M18 48h28v7H18z M36 32h15v8H36z M5 57h55',
  giza: 'M3 56L28 9l33 47z M28 9l8 47 M3 56h58',
};
const washes: Record<string, string> = {
  eiffel: '#b79470',
  colosseum: '#c9ab7e',
  stonehenge: '#9baf9c',
  liberty: '#88aa94',
  opera: '#efe3c4',
  fuji: '#a4b2be',
  taj: '#eee1bd',
  petra: '#d59f80',
  chichen: '#c5b580',
  angkor: '#adb086',
  machu: '#9bb28b',
  giza: '#d9bd7c',
};
export function art(id: string) {
  if (id === 'giza')
    return `<svg class="wonder-art" viewBox="-10 -12 84 84" aria-hidden="true"><ellipse class="wonder-shadow" cx="32" cy="59" rx="25" ry="5" fill="#65522d40"/><g class="wonder-effects"><ellipse cx="32" cy="59" rx="32" ry="9" fill="#f5cc5422" stroke="#dfba5e" stroke-width=".8"/><ellipse cx="32" cy="59" rx="25" ry="6" fill="none" stroke="#fff0af" stroke-width=".8" stroke-dasharray="3 4"/><path d="M28 4V-5m-3 7v-5m6 6v-4" stroke="#ffe5a2" stroke-width="1.6" stroke-linecap="round"/></g><g class="wonder-body"><path d="M3 56L28 9l33 47z" fill="#e4c275" stroke="#8b672e" stroke-width="1.2" stroke-linejoin="round"/><path d="M28 9l8 47h25z" fill="#ad7b37"/><path d="M28 9l-4 10 6-1z" fill="#fff3bc"/><path d="M9 47h25m-21-8h19m-14-8h12m-7-9h6m5 25h20m-23-8h15m-18-8h10" stroke="#b08b4b" stroke-width=".65" opacity=".6"/><path d="M28 9l8 47M3 56h58" fill="none" stroke="#ffe6a3" stroke-width="1"/></g><g class="wonder-effects"><g transform="translate(32 36) scale(1 .55)"><g class="wonder-orbit"><path d="M29-4l5 3-1 6-6-2z" fill="#eac879" stroke="#9b7439" stroke-width=".8"/><path d="M-30-5l5 2-1 6-6-3z" fill="#bd914d" stroke="#ffdf89" stroke-width=".8"/><circle cx="0" cy="-32" r="2" fill="#fff2b3"/><circle cx="0" cy="32" r="1.6" fill="#ffe5a1"/></g></g><path class="wonder-spark spark-one" d="M6 20v8m-4-4h8" stroke="#fff1b3" stroke-width="1.5" stroke-linecap="round"/><path class="wonder-spark spark-two" d="M57 14v6m-3-3h6" stroke="#ffe69b" stroke-width="1.2" stroke-linecap="round"/></g></svg>`;
  return `<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="58" rx="28" ry="5" fill="#685b3d20"/><path d="${shapes[id] ?? ''}" fill="${washes[id] ?? '#c9ab7e'}" stroke="#736a51" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
}
