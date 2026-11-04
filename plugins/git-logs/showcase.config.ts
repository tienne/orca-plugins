import { defineConfig } from '@playwright/test';
import base from './playwright.config';
export default defineConfig({
  ...base,
  testDir: './showcase',
  outputDir: '../../test-results/git-logs-showcase',
  use: {
    ...base.use,
    locale: 'en-US',
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  },
});
