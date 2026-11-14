export function statusTone(status: string): { hue: number; chroma: number } {
  const name = status
    .trim()
    .toUpperCase()
    .replace(/[\s_-]+/g, ' ');
  const colors: Record<string, { hue: number; chroma: number }> = {
    'IN PROGRESS': { hue: 255, chroma: 0.14 },
    '진행 중': { hue: 255, chroma: 0.14 },
    'IN QA': { hue: 300, chroma: 0.14 },
    QA: { hue: 300, chroma: 0.14 },
    '테스트 중': { hue: 300, chroma: 0.14 },
    PR: { hue: 205, chroma: 0.12 },
    'IN REVIEW': { hue: 205, chroma: 0.12 },
    '리뷰 중': { hue: 205, chroma: 0.12 },
    HOLD: { hue: 75, chroma: 0.13 },
    'ON HOLD': { hue: 75, chroma: 0.13 },
    보류: { hue: 75, chroma: 0.13 },
    BLOCKED: { hue: 25, chroma: 0.15 },
    차단: { hue: 25, chroma: 0.15 },
    DONE: { hue: 150, chroma: 0.13 },
    COMPLETED: { hue: 150, chroma: 0.13 },
    완료: { hue: 150, chroma: 0.13 },
    RESOLVED: { hue: 175, chroma: 0.12 },
    BACKLOG: { hue: 225, chroma: 0.055 },
    'TO DO': { hue: 260, chroma: 0.015 },
    TODO: { hue: 260, chroma: 0.015 },
    CANCELLED: { hue: 30, chroma: 0.055 },
    CANCELED: { hue: 30, chroma: 0.055 },
    취소: { hue: 30, chroma: 0.055 },
  };
  if (Object.hasOwn(colors, name)) return colors[name];
  let hash = 0;
  for (const character of name)
    hash = (Math.imul(hash, 31) + character.codePointAt(0)!) | 0;
  return { hue: Math.abs(hash) % 360, chroma: 0.11 };
}
