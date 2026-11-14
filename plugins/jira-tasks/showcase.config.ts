import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './showcase',
  workers: 1,
  use: {
    browserName: 'chromium',
    channel: 'chrome',
    baseURL: 'http://127.0.0.1:43281',
  },
  webServer: {
    command: 'node scripts/jira-tasks.mjs serve',
    cwd: process.cwd(),
    url: 'http://127.0.0.1:43281',
    reuseExistingServer: false,
  },
  outputDir: '../../test-results/jira-tasks-showcase',
});
