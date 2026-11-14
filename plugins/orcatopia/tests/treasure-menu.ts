import type { Page } from '@playwright/test';

export async function openTreasure(page: Page) {
  const opener = page.locator('#open-treasure');
  if ((await opener.getAttribute('aria-expanded')) !== 'true')
    await opener.click();
}
