import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: './',
  // Monaco 0.57 exports JS subpaths only; resolve its bundled font stylesheet explicitly.
  resolve: {
    alias: {
      '@git-tools/codicons.css': fileURLToPath(
        new URL(
          './node_modules/monaco-editor/esm/vs/base/browser/ui/codicons/codicon/codicon.css',
          import.meta.url,
        ),
      ),
    },
  },
  plugins: [react()],
  build: { outDir: '../../dist/plugins/git-tools/ui', emptyOutDir: true },
});
