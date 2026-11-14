export function issueTypeTone(type: { name: string; subtask?: boolean }): {
  hue: number;
  symbol: string;
} {
  const name = type.name.trim().toLowerCase();
  if (/bug|버그|결함/.test(name)) return { hue: 25, symbol: '!' };
  if (/epic|에픽/.test(name)) return { hue: 300, symbol: '◆' };
  if (/story|스토리/.test(name)) return { hue: 150, symbol: '◇' };
  if (type.subtask || /sub[ -]?task|하위\s*(작업|항목)/.test(name))
    return { hue: 205, symbol: '↳' };
  if (/task|작업/.test(name)) return { hue: 255, symbol: '✓' };
  let hash = 0;
  for (const character of name)
    hash = (Math.imul(hash, 31) + character.codePointAt(0)!) | 0;
  return { hue: Math.abs(hash) % 360, symbol: '◇' };
}
