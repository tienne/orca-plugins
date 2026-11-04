import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  outputDir: '../../test-results/git-tools',
  fullyParallel: false,
  use: {
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
    baseURL: 'http://127.0.0.1:4173',
    channel: process.env.PW_CHANNEL ?? 'chrome',
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm nx run git-tools:preview --output-style=static',
    cwd: '../..',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 60000,
  },
});
