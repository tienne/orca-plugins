function camel(color: string) {
  return `<g class="caravan-presence"><ellipse cy="1" rx="8" ry="1.6" fill="#6d533b" opacity=".2"/><ellipse cy="-5" rx="6" ry="3" fill="#b88b5f"/><path d="M-3-7q0-6 5-1M5-5l2-7 4 1-2 7" fill="#b88b5f" stroke="#8e6c47" stroke-width=".6"/><circle cx="10" cy="-11" r="1.7" fill="#c29b6d"/><path class="caravan-legs" d="M-4-4l-1 5m5-5 1 5m3-5 2 5" stroke="#92704b" stroke-width="1.2"/><path d="M-3-7h6v4h-6z" fill="${color}"/><circle cy="-12" r="1.5" fill="#e0bd91"/><path d="M-2-11h4l1 5h-6z" fill="${color}"/><path d="M-2-13h4" stroke="#e6d7ae" stroke-width="1.4"/></g>`;
}

export function landmarkEncore(id: string) {
  if (id === 'eiffel')
    return `<g class="eiffel-show"><path class="eiffel-light-wave" d="M29 114L51 65l13-40 13 40 22 49M44 72h40M52 60h24" fill="none" stroke="#ffedb3" stroke-width="1.8" stroke-dasharray="16 160"/>
      <g transform="translate(19 119)"><circle cy="-8" r="1.8" fill="#d5b08a"/><path d="M-2-6h4v5h-4z" fill="#6f8f8d"/><path d="M-1-1v3m3-3v3" stroke="#6f6451"/><path d="M1-6l4-2" stroke="#d5b08a"/><rect x="3" y="-10" width="4" height="3" rx=".6" fill="#716b57"/><path class="eiffel-camera-flash" d="M5-15v8m-4-4h8" stroke="#fff5ce" stroke-width="1"/></g>
    </g>`;
  if (id === 'opera')
    return `<g class="opera-performance"><path class="opera-stage-windows" d="M43 103l7-13 8 14zm30 1 9-17 9 17zm30-1 9-10 5 10z" fill="#e3bd79"/>
      ${[
        [31, 36],
        [102, 34],
      ]
        .map(
          ([x, y], i) =>
            `<g transform="translate(${x} ${y})"><g class="opera-music" style="--life-delay:-${i * 3}s"><path d="M0 0v-8l5-2v8m-5-3 5-2" fill="none" stroke="#c4a76a" stroke-width="1"/><ellipse cx="-1" cy="0" rx="2" ry="1.5" fill="#c4a76a"/><ellipse cx="4" cy="-2" rx="2" ry="1.5" fill="#c4a76a"/></g></g>`,
        )
        .join('')}</g>`;
  if (id === 'taj')
    return `<g class="taj-fountain-show"><path class="taj-fountains" d="M51 123q3-17 6 0m4 0q3-22 6 0m4 0q3-17 6 0" fill="none" stroke="#d4eee4" stroke-width="1" stroke-dasharray="2 2"/><ellipse class="taj-fountain-rings" cx="64" cy="123" rx="21" ry="3.1" fill="none" stroke="#e3f2df" stroke-width=".8"/></g>`;
  if (id === 'colosseum')
    return `<g class="arena-crowd">${[
      [34, 43],
      [42, 39],
      [50, 37],
      [78, 37],
      [86, 39],
      [94, 43],
    ]
      .map(
        ([x, y], i) =>
          `<g transform="translate(${x} ${y})"><g class="arena-spectator" style="--life-delay:-${i * 0.035}s"><circle cy="-4" r="1.3" fill="#d3b68b"/><path d="M-1.8-2h3.6v3h-3.6z" fill="${i % 2 ? '#859e90' : '#b39a78'}"/><path class="arena-cheering-arms" d="M-1-1l-3-3m5 3 3-3" fill="none" stroke="#d3b68b" stroke-width=".9"/></g></g>`,
      )
      .join('')}</g>`;
  return '';
}

export function landmarkSpectacle(id: string) {
  if (id === 'petra')
    return `<g class="landmark-life wonder-story" data-landmark-life="petra" aria-hidden="true">
      <path class="petra-sunshaft" d="M-10-14l24 3 69 126-36 8z" fill="#ffe2a2"/>
      <path class="petra-facade-reveal" d="M20 64h88M27 75v34m13-34v34m13-34v34m26-34v34m13-34v34M28 44h25m24 0h24M20 113h88" fill="none" stroke="#ffe3ac" stroke-width="1.3"/>
      <path d="M-3 134q65-5 134 0" fill="none" stroke="#a88a64" stroke-width="1"/>
      <g transform="translate(-4 132)"><g class="petra-caravan">${camel('#a96950')}<g transform="translate(25 1)">${camel('#6e8d83')}</g></g></g>
    </g>`;
  if (id === 'angkor')
    return `<g class="landmark-life wonder-story" data-landmark-life="angkor" aria-hidden="true">
      <g class="angkor-jungle"><path class="angkor-vines" d="M-5 121Q2 93-2 72T9 24M132 122q-12-33-5-61t-8-41" fill="none" stroke="#52785b" stroke-width="2" stroke-dasharray="140"/>
      <path class="angkor-leaves" d="M0 64q-17-14-8-25Q6 44 0 64m0 0q2-20 15-19Q14 59 0 64m126 7q-2-22-17-21Q111 65 126 71m0 0q17-16 9-28-13 9-9 28" fill="#729260"/></g>
      <path class="angkor-sanctuary-light" d="M60 110V95q4-7 8 0v15z" fill="#eacc83"/>
      <path d="M37 133h58" stroke="#899475" stroke-width="2"/>
      <g class="angkor-procession">${[44, 60, 76].map((x, i) => `<g transform="translate(${x} 131)"><circle cy="-10" r="1.6" fill="#d4ad7d"/><path d="M-2-8h4l2 8h-8z" fill="${i % 2 ? '#b98b57' : '#c7a070'}"/><path d="M1-6l5 2" stroke="#d4ad7d" stroke-width=".8"/><rect x="4" y="-5" width="3" height="4" rx="1" fill="#e7c575"/></g>`).join('')}</g>
      ${[
        [26, 116],
        [100, 111],
        [82, 105],
      ]
        .map(
          ([x, y], i) =>
            `<g transform="translate(${x} ${y})"><g class="angkor-lantern" style="--life-delay:-${i * 3}s"><path d="M-2-5q2-2 4 0v6h-4z" fill="#e8c777"/><circle cy="-2" r="4" fill="#e9ce86" opacity=".18"/><path d="M-1 1h2" stroke="#a57e45" stroke-width=".8"/></g></g>`,
        )
        .join('')}
    </g>`;
  if (id === 'machu')
    return `<g class="landmark-life wonder-story" data-landmark-life="machu" aria-hidden="true">
      <g class="machu-sunrise"><circle cx="103" cy="-5" r="7" fill="#e4c579"/><path d="M103-17v-4m12 16h5m-29 0h-5m25-9 4-4M95-13l-4-4" stroke="#e8d49a" stroke-width="1"/><path d="M93 1L31 121l57 6 23-121z" fill="#efd796" opacity=".15"/></g>
      <g transform="translate(0 121)"><path class="machu-cloud-sea" d="M-15 0q9-9 20-4 10-14 24-4 9-5 17 2 12-12 26-3 12-5 19 2 15-11 30 0 12-4 23 6v12H-15z" fill="#e1e8d4" opacity=".75"/></g>
      <g transform="translate(-8 130)"><path class="machu-cloud-front" d="M0 0q16-10 30-3 18-9 33 0 16-10 31-2 14-7 29 1 11-4 23 1v10H0z" fill="#eef0db" opacity=".75"/></g>
      <g transform="translate(15 4)"><g class="machu-condor"><path class="condor-wings" d="M0 0l-13-3-2-3 8 1-4-5 10 6 3 1 10-7-3 6 8-2-3 4L1 1z" fill="#58624e"/><path d="M-1-2l2-2 2 2-2 6-3 2z" fill="#79745c"/><circle cx="1" cy="-4" r="1.3" fill="#a59b79"/></g></g>
    </g>`;
  return '';
}
