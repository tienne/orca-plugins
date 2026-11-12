import { defineConfig } from '@playwright/test';
export default defineConfig({
  workers: process.env.CI ? 1 : undefined,
  fullyParallel: Boolean(process.env.CI),
  timeout: process.env.CI ? 120_000 : 30_000,
  testDir: './tests',
  outputDir: '../../test-results/landmark-island',
  use: {
    baseURL: 'http://127.0.0.1:43189',
    locale: 'en-US',
    channel: process.env.PW_CHANNEL ?? 'chrome',
    viewport: { width: 1000, height: 900 },
  },
  webServer: {
    command:
      'pnpm exec vite preview --config plugins/landmark-island/vite.config.ts --host 127.0.0.1 --port 43189 --strictPort',
    cwd: '../..',
    url: 'http://127.0.0.1:43189',
    reuseExistingServer: false,
  },
});
