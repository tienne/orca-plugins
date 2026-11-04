import * as monaco from 'monaco-editor/editor/editor.api.js';

const themeName = 'orca-git-tools';
// Resolve CSS variables through the browser: Orca themes may use hex, rgb,
// oklch or color-mix, while Monaco requires normalized hex colors.
function palette() {
  const probe = document.createElement('span');
  probe.hidden = true;
  document.body.appendChild(probe);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const context = canvas.getContext('2d', { willReadFrequently: true })!;
  function read(variable: string) {
    probe.style.color = `var(${variable})`;
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = getComputedStyle(probe).color;
    context.fillRect(0, 0, 1, 1);
    return (
      '#' +
      [...context.getImageData(0, 0, 1, 1).data]
        .map((n) => n.toString(16).padStart(2, '0'))
        .join('')
    );
  }
  try {
    return {
      background: read('--bg'),
      foreground: read('--fg'),
      card: read('--card'),
      cardForeground: read('--card-fg'),
      popover: read('--popover'),
      popoverForeground: read('--popover-fg'),
      muted: read('--muted'),
      border: read('--line'),
      accent: read('--accent'),
      primary: read('--primary'),
      primaryForeground: read('--primary-fg'),
      primaryHover: read('--primary-hover'),
      focus: read('--focus'),
      field: read('--field'),
      added: read('--addition'),
      removed: read('--danger'),
    };
  } finally {
    probe.remove();
  }
}
const alpha = (color: string, opacity: number) =>
  color.slice(0, 7) +
  Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');

export function syncMonacoTheme() {
  let last = '';
  const update = () => {
    const p = palette();
    // Background luminance also handles custom light themes without a class.
    const values = [1, 3, 5].map(
      (i) => parseInt(p.background.slice(i, i + 2), 16) / 255,
    );
    const dark =
      values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722 < 0.5;
    const key = JSON.stringify(p);
    if (key === last) return;
    last = key;
    monaco.editor.defineTheme(themeName, {
      base: dark ? 'vs-dark' : 'vs',
      inherit: true,
      rules: [
        { token: '', foreground: p.foreground.slice(1, 7) },
        { token: 'comment', foreground: p.muted.slice(1, 7) },
        { token: 'keyword', foreground: p.primary.slice(1, 7) },
        { token: 'string', foreground: p.added.slice(1, 7) },
        { token: 'number', foreground: p.primary.slice(1, 7) },
        { token: 'delimiter', foreground: p.foreground.slice(1, 7) },
        { token: 'type.identifier', foreground: p.primary.slice(1, 7) },
      ],
      colors: {
        'editor.background': p.background,
        'editor.foreground': p.foreground,
        'editorGutter.background': p.background,
        'editorLineNumber.foreground': p.muted,
        'editorLineNumber.activeForeground': p.foreground,
        'editorCursor.foreground': p.primary,
        'editor.selectionBackground': p.accent,
        'editor.inactiveSelectionBackground': alpha(p.primary, 0.12),
        'editor.lineHighlightBackground': alpha(p.primary, 0.05),
        'editor.lineHighlightBorder': '#00000000',
        'editorWhitespace.foreground': alpha(p.muted, 0.45),
        'editorIndentGuide.background1': p.border,
        'editorIndentGuide.activeBackground1': p.muted,
        focusBorder: p.focus,
        'editorWidget.background': p.card,
        'editorWidget.foreground': p.cardForeground,
        'editorWidget.border': p.border,
        'editorHoverWidget.background': p.popover,
        'editorHoverWidget.foreground': p.popoverForeground,
        'editorHoverWidget.border': p.border,
        'input.background': p.field,
        'input.foreground': p.foreground,
        'input.border': p.border,
        'button.background': p.primary,
        'button.foreground': p.primaryForeground,
        'button.hoverBackground': p.primaryHover,
        'scrollbarSlider.background': alpha(p.muted, 0.3),
        'scrollbarSlider.hoverBackground': alpha(p.muted, 0.5),
        'scrollbarSlider.activeBackground': alpha(p.primary, 0.5),
        'diffEditor.border': p.border,
        'diffEditor.diagonalFill': alpha(p.muted, 0.3),
        'diffEditor.insertedLineBackground': alpha(p.added, dark ? 0.16 : 0.12),
        'diffEditor.removedLineBackground': alpha(
          p.removed,
          dark ? 0.18 : 0.11,
        ),
        'diffEditor.insertedTextBackground': alpha(p.added, 0.28),
        'diffEditor.removedTextBackground': alpha(p.removed, 0.28),
        'diffEditorGutter.insertedLineBackground': alpha(p.added, 0.25),
        'diffEditorGutter.removedLineBackground': alpha(p.removed, 0.25),
        'diffEditor.unchangedRegionBackground': p.card,
        'diffEditor.unchangedRegionForeground': p.muted,
        'diffEditor.unchangedRegionShadow': '#00000000',
      },
    });
    monaco.editor.setTheme(themeName);
  };
  update();
  const observer = new MutationObserver(update);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'style'],
  });
  // Also catch theme stylesheets updated in place. Palette comparison prevents
  // Monaco's own stylesheet changes from causing a theme update loop.
  observer.observe(document.head, {
    subtree: true,
    childList: true,
    characterData: true,
  });
  const media = matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', update);
  const unsubscribe = window.orca?.on?.('theme', update);
  return () => {
    observer.disconnect();
    media.removeEventListener('change', update);
    if (typeof unsubscribe === 'function') unsubscribe();
    else if (
      unsubscribe &&
      typeof (unsubscribe as { dispose?: unknown }).dispose === 'function'
    )
      (unsubscribe as { dispose(): void }).dispose();
  };
}
