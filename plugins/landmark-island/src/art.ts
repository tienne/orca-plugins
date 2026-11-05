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
export function art(id: string) {
  return `<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="58" rx="28" ry="5" fill="#102c3540"/><path d="${shapes[id] ?? ''}" fill="currentColor" stroke="#284647" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
}
