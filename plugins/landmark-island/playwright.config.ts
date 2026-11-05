import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  outputDir: '../../test-results/landmark-island',
  use: {
    baseURL: 'http://127.0.0.1:43187',
    channel: process.env.PW_CHANNEL ?? 'chrome',
    viewport: { width: 1000, height: 900 },
  },
  webServer: {
    command:
      'pnpm exec vite preview --config plugins/landmark-island/vite.config.ts --host 127.0.0.1 --port 43187 --strictPort',
    cwd: '../..',
    url: 'http://127.0.0.1:43187',
    reuseExistingServer: false,
  },
});
