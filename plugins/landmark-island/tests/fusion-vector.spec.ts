import { test, expect } from '@playwright/test';

const preview = '/?lang=ko&preview=reveal&fusion=greatwall';

for (const width of [1000, 360]) {
  test(`vector fusion converges existing scenes and preserves workers at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    let mediaRequests = 0;
    page.on('request', (request) => {
      if (/\.(webm|mp4)(\?|$)/.test(request.url())) mediaRequests++;
    });
    await page.goto(preview);
    const before = await page.evaluate(() =>
      localStorage.getItem('landmark-island-demo-v1'),
    );
    await page.locator('#preview-play').click();
    await expect(page.locator('.fusion-vector')).toBeVisible();
    await expect(page.locator('.fusion-source .site-worker')).toHaveCount(4);
    await expect(page.locator('.fusion-source-left .landmark-life')).toHaveCSS(
      'display',
      'inline',
    );
    const gap = async (time: number) =>
      page.locator('.fusion-source').evaluateAll((elements, t) => {
        elements.forEach((el) =>
          el.getAnimations().forEach((a) => {
            a.pause();
            a.currentTime = t;
          }),
        );
        return Math.abs(
          elements[1].getBoundingClientRect().x -
            elements[0].getBoundingClientRect().x,
        );
      }, time);
    const start = await gap(0);
    expect(await gap(1000)).toBeLessThan(start / 2);
    await page.locator('.discovery-stage').screenshot({
      path: `test-results/landmark-island/fusion-vector-${width}.jpg`,
      type: 'jpeg',
      quality: 80,
    });
    await expect(page.locator('.fusion-reveal.revealed')).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator('.fusion-merge, video, canvas')).toHaveCount(0);
    await expect(page.locator('.discovery-monument .site-worker')).toHaveCount(
      2,
    );
    await expect(page.locator('.discovery-monument .wall-porter')).toHaveCSS(
      'animation-play-state',
      'running',
    );
    expect(mediaRequests).toBe(0);
    expect(
      await page.evaluate(() =>
        localStorage.getItem('landmark-island-demo-v1'),
      ),
    ).toBe(before);
  });
}

test('skip and reduced motion remove transient scenes immediately', async ({
  page,
}) => {
  await page.goto(preview);
  await page.locator('#preview-play').click();
  await page.locator('.reveal-skip').click();
  await expect(page.locator('.fusion-merge')).toHaveCount(0);
  await expect(page.locator('.fusion-reveal.revealed')).toBeVisible();
  await page.locator('.reveal-keep').click();
  await page.locator('#preview-play').click();
  await expect(page.locator('.fusion-vector')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.fusion-merge')).toHaveCount(0);
  await expect(page.locator('.fusion-reveal.revealed')).toBeVisible();
  await page.locator('.reveal-keep').click();
  await page.locator('#preview-play').click();
  await expect(page.locator('.fusion-reveal.revealed')).toBeVisible();
  await expect(page.locator('.fusion-merge')).toHaveCount(0);
  await expect(page.locator('.discovery-monument .site-worker')).toHaveCount(2);
});
