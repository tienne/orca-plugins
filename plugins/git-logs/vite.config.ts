import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import opentype from 'opentype.js';

function iconMasks() {
  const bytes = readFileSync(
    fileURLToPath(
      new URL(
        './node_modules/monaco-editor/esm/vs/base/browser/ui/codicons/codicon/codicon.ttf',
        import.meta.url,
      ),
    ),
  );
  const font = opentype.parse(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
  );
  const baseline = (font.ascender * 16) / font.unitsPerEm;
  const masks: Record<string, string> = {};
  for (let index = 0; index < font.glyphs.length; index++) {
    const glyph = font.glyphs.get(index);
    if (!glyph.unicodes.length) continue;
    const path = glyph.getPath(0, baseline, 16).toPathData(3);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="${path}"/></svg>`;
    for (const codepoint of glyph.unicodes) {
      masks[`\\${codepoint.toString(16)}`] =
        `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    }
  }
  return masks;
}

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: './',
  plugins: [
    react(),
    {
      name: 'git-logs-svg-icons',
      resolveId(id) {
        if (id === 'virtual:git-logs-icon-masks')
          return '\0git-logs-icon-masks';
      },
      load(id) {
        if (id === '\0git-logs-icon-masks')
          return `export default ${JSON.stringify(iconMasks())};`;
      },
    },
  ],
  build: {
    outDir: '../../dist/plugins/git-logs/ui',
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        panel: fileURLToPath(new URL('./index.html', import.meta.url)),
        editor: fileURLToPath(new URL('./editor.html', import.meta.url)),
      },
    },
  },
});
