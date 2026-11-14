/** Local promotional layout. Its only image is a real, validated browser fixture capture. */
export function introductionHtml(
  screenshot: string,
  locale: 'en' | 'ko',
  wonders?: string,
) {
  const korean = locale === 'ko';
  const copy = korean
    ? {
        tagline: '기다리는 시간을,<br>나만의 섬으로.',
        description:
          '워크트리에서 얻은 탐험권으로<br>세계의 랜드마크를 모으고<br>강과 바다까지 가꿔 보세요.',
        footer: '작업 사이, 잠시 머무는 작은 세계',
        label: 'DEMO · 게임 화면',
      }
    : {
        tagline: 'A little escape<br>between tasks.',
        description:
          'Earn tickets from new worktrees.<br>Discover world landmarks.<br>Shape the land, rivers and sea.',
        footer: 'A small world to enjoy while you wait',
        label: 'DEMO · GAME SCREEN',
      };
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><title>Orcatopia · Introduction</title><style>
    * { box-sizing: border-box; }
    html, body { margin: 0; width: 1600px; height: 1000px; overflow: hidden; }
    body { background: #f0eddc; color: #294c46; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .cover { position: relative; width: 1600px; height: 1000px; isolation: isolate; background: #f4f0e4; }
    .landscape { position: absolute; inset: 0; width: 100%; height: 100%; z-index: -1; opacity: .35; }
    .copy { position: absolute; left: 72px; top: 220px; width: 425px; }
    .mark { display: block; width: 92px; height: 92px; margin-bottom: 32px; }
    .eyebrow { position: absolute; top: 90px; left: 90px; font-size: 15px; letter-spacing: 3px; color: #648176; }
    h1 { font-family: Georgia, 'Times New Roman', serif; font-size: 78px; font-weight: 500; letter-spacing: -5px; line-height: 1.05; margin: 0 0 32px; }
    h2 { font-family: ${korean ? '-apple-system, BlinkMacSystemFont, sans-serif' : "Georgia, 'Times New Roman', serif"}; font-weight: ${korean ? '500' : '400'}; font-size: ${korean ? '38px' : '43px'}; letter-spacing: -1.2px; line-height: 1.35; margin: 0 0 26px; color: #467b6b; }
    .description { font-size: 23px; line-height: 1.65; color: #67776c; margin: 0; }
    .screen { position: absolute; left: 540px; top: 70px; width: 1000px; margin: 0; padding: 8px; background: #faf6e9; border: 1px solid #bfcbb7; border-radius: 26px; box-shadow: 0 28px 64px #345c4824, 0 3px 8px #345c4814;  }
    .screen img { display: block; width: 100%; height: auto; border-radius: 16px; }
    .demo { position: absolute; top: 28px; left: 50%; transform: translateX(-50%); height: fit-content; padding: 6px 10px; border-radius: 5px; background: #f9f5e8ed; color: #42685c; font-size: 11px; font-weight: 600; letter-spacing: 1.3px; }
    .wonder-screen { top: 610px; }
    .wonder-screen img { height: 290px; object-fit: cover; }
    .scene-label { position: absolute; left: 548px; top: 570px; margin: 0; font-size: 14px; color: #648176; letter-spacing: 2px; }
    .footer { position: absolute; left: 90px; bottom: 80px; font-size: 16px; color: #6e8476; }
  </style></head><body><main class="cover">
    <svg class="landscape" viewBox="0 0 1600 1000" aria-hidden="true"><path d="M-100 880Q420 620 920 835t800-70V1100H-100Z" fill="#cfddc8" opacity=".48"/><path d="M-100 985Q440 760 980 930t800-90" fill="none" stroke="#8eae98" stroke-width="2" opacity=".25"/><path d="M1060 110q140-60 330 0M1170 87q80-25 143 0" fill="none" stroke="#fcfaf0" stroke-width="2" opacity=".65"/><circle cx="1420" cy="130" r="42" fill="#f8edc7" opacity=".7"/></svg>
    <span class="eyebrow">A LITTLE WORLD IN ORCA</span>
    <section class="copy">
      <svg class="mark" viewBox="0 0 128 128" role="img" aria-label="Orcatopia island emblem"><rect width="128" height="128" rx="30" fill="#315f57"/><path d="M12 91q26-12 51 0t53 0m-97 11q21-9 43 0t45 0" fill="none" stroke="#81aca0" stroke-width="1.8"/><path d="M22 82L62 61l44 21-42 25z" fill="#bea97e"/><path d="M22 75L62 54l44 21-42 25z" fill="#99b57c"/><path d="M52 83l12-18 12 18-12 7z" fill="#e9d9ae"/><path d="M67 71V39h17v40l-8 5z" fill="#ddd2ad"/><path d="M64 40l12-16 12 16z" fill="#a8c8ba"/><path d="M72 49h7v8h-7zM72 68q4-7 7 0v12h-7z" fill="#496e61"/><path d="M40 75V48" stroke="#8f8664" stroke-width="5"/><path d="M27 53q-9-10 0-17-2-11 10-11 7-9 14 1 12 0 11 12 9 7 0 16-4 9-14 4-11 7-21-5" fill="#d7aaa8"/><path d="M32 38l9-4m3 14 10-3" stroke="#edc9bc" stroke-width="1.4" fill="none"/><circle cx="99" cy="23" r="8" fill="#e7d598"/></svg>
      <h1>Orcatopia</h1><h2>${copy.tagline}</h2><p class="description">${copy.description}</p>
    </section>
    <figure class="screen"><img src="data:image/png;base64,${screenshot}" alt="Orcatopia garden with landmarks, paths and decorations"><figcaption class="demo">${copy.label}</figcaption></figure>
    ${wonders ? `<p class="scene-label">${korean ? '최상위 등급 · 크게 만나는 불가사의' : 'WONDER · LITTLE LANDMARKS, BIG STORIES'}</p><figure class="screen wonder-screen"><img src="data:image/png;base64,${wonders}" alt="Enlarged Wonder-tier landmark scenes"><figcaption class="demo">DEMO · IV ${korean ? '불가사의' : 'WONDER'}</figcaption></figure>` : ''}
    <span class="footer">${copy.footer}</span>
  </main></body></html>`;
}
