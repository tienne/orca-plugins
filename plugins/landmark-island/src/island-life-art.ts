export type ResidentRole = 'gardener' | 'photographer' | 'visitor';

/** 탐험가와 구분되는 작업 도구와 복장으로 섬 주민을 그린다. */
export function residentArt(role: ResidentRole) {
  const color =
    role === 'gardener'
      ? '#77955d'
      : role === 'photographer'
        ? '#799ea5'
        : '#be8b76';
  const hat =
    role === 'gardener'
      ? '<path d="M6 10q10-3 20 0l-1 2H7zM10 10l2-6h8l2 6z" fill="#ceb47d" stroke="#89794f" stroke-width=".7"/>'
      : '<path d="M10 7q6-5 12 1l3 3H10z" fill="#d5d9bc" stroke="#8b967f" stroke-width=".6"/>';
  return `<svg viewBox="0 0 32 44" aria-hidden="true"><ellipse class="resident-shadow" cx="16" cy="41" rx="9" ry="2.2" fill="#244c3438"/><g class="resident-figure" stroke-linecap="round" stroke-linejoin="round">
    <path class="resident-leg resident-leg-left" d="M12 31v8l-2 1" fill="none" stroke="#746346" stroke-width="3.4"/><path class="resident-leg resident-leg-right" d="M20 31v8l2 1" fill="none" stroke="#746346" stroke-width="3.4"/>
    <path class="resident-seated-legs" d="M12 31l7 3v6m1-9 6 3v6" fill="none" stroke="#746346" stroke-width="3.2"/>
    <path d="M10 19q6-3 12 0l2 14H8z" fill="${color}" stroke="#5e7557" stroke-width=".7"/>
    ${role === 'gardener' ? '<path d="M12 20h8l2 13H10z" fill="#aab788"/><path d="M13 26h6v4h-6z" fill="#87986b"/>' : '<path d="M10 19l13 12" stroke="#d7c595" stroke-width="1.5"/><path d="M21 27h6v7h-7z" fill="#b99d70" stroke="#8b7957" stroke-width=".6"/>'}
    <circle cx="16" cy="13" r="6" fill="#e4c394" stroke="#a18b67" stroke-width=".6"/>${hat}<circle cx="18" cy="13" r=".7" fill="#52624a"/><path d="M17 17h3" stroke="#b48c65" stroke-width=".6"/>
    <path d="M10 23l-3 6" stroke="#dfbd90" stroke-width="3"/>
    ${role === 'gardener' ? '<g class="resident-watering-arm"><path d="M22 22l3 5" stroke="#dfbd90" stroke-width="3"/><path d="M23 27h7v6h-7zM30 28l4-3" fill="#8eaba1" stroke="#65877a" stroke-width=".8"/><path class="resident-water" d="M34 25l3 6m-2-5 4 5" stroke="#cce4d5" stroke-width=".8" stroke-dasharray="1 2"/></g>' : role === 'photographer' ? '<g class="resident-camera-arm"><path d="M22 23l4 2" stroke="#dfbd90" stroke-width="3"/><rect x="22" y="21" width="8" height="5" rx="1" fill="#7d8070" stroke="#576954" stroke-width=".6"/><circle cx="27" cy="23.5" r="1.6" fill="#bdd7cd"/><path class="resident-camera-flash" d="M29 18v-5m-2 2 4 1" stroke="#f7ebbc" stroke-width="1"/></g>' : '<path d="M22 23l4 3" stroke="#dfbd90" stroke-width="3"/><path d="M23 25l6-2 1 7-6 2z" fill="#e6dbad" stroke="#a99d74" stroke-width=".7"/><path d="M25 26l3 1-2 2" fill="none" stroke="#9daf8e" stroke-width=".7"/>'}
    <g class="resident-lantern"><path d="M7 28v6" stroke="#b99b62"/><ellipse cx="7" cy="37" rx="10" ry="12" fill="#ffe4a3" opacity=".15"/><rect x="4" y="33" width="6" height="8" rx="1.5" fill="#ffe5a0" stroke="#9c8759" stroke-width=".7"/><path d="M7 34v5" stroke="#fff8d2" stroke-width="1.4"/></g>
    <g class="resident-cold"><path d="M10 23l10 3m2-3-10 5" stroke="#e4c394" stroke-width="3"/><path d="M11 19q5 4 11 0l-1 5-7-1-3 6-2-2 3-5z" fill="#bb795c"/></g>
    <g class="resident-umbrella"><path d="M20 24V0q-3-6-5-1" fill="none" stroke="#8d7956" stroke-width="1.3"/><path d="M2 1Q16-25 31 1q-5-4-8 0-6-4-10 0-6-4-11 0" fill="#8ba6a0" stroke="#566f67" stroke-width=".8"/><path d="M16-13q-5 5-3 14m3-14q8 4 7 14" fill="none" stroke="#b9c7b0" stroke-width=".8"/><path d="M16-13v-3" stroke="#8d7956" stroke-width="1"/></g>
  </g></svg>`;
}

/** 새의 그림자와 비행하는 몸체를 분리해 착지점을 유지한다. */
export function birdArt() {
  return `<svg viewBox="0 0 24 20" aria-hidden="true"><ellipse class="critter-shadow" cx="12" cy="17" rx="5" ry="1.3" fill="#254b3530"/><g class="critter-perch"><g class="critter-body"><path d="M7 12l-5 1 3-4" fill="#6f8f79"/><ellipse cx="11" cy="11" rx="5" ry="3.6" fill="#8aa69a"/><path class="bird-wing" d="M10 11Q3 3 5 2q8 1 10 8z" fill="#bdd0ab" stroke="#7d9b7e" stroke-width=".5"/><circle cx="16" cy="8" r="3" fill="#a9bea3"/><circle cx="17" cy="7.5" r=".65" fill="#465b46"/><path d="M18 8h4l-3 2" fill="#c8a976"/><path d="M10 14v2m4-2v2" stroke="#8e7753" stroke-width=".7"/></g></g></svg>`;
}

/** 날갯짓과 추적 위치가 서로 영향을 주지 않는 나비를 그린다. */
export function butterflyArt(color: string) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><g class="critter-perch"><g class="critter-body"><g class="butterfly-wings" fill="${color}" stroke="#8c9270" stroke-width=".45"><path d="M12 12Q0 0 3 12q-5 10 9 2z"/><path d="M12 12Q24 0 21 12q5 10-9 2z"/></g><path d="M12 9v9m0-7-3-4m3 4 3-4" stroke="#7c815e" stroke-width=".8" stroke-linecap="round"/><circle cx="8" cy="11" r="1.2" fill="#eee2b1"/><circle cx="17" cy="11" r="1.2" fill="#eee2b1"/></g></g></svg>`;
}
