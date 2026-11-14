import { assert, test } from 'orca/testing';
import { avatarUrl, createAvatarLoader } from './avatar';
const url =
  'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/demo/48';

test('accepts only public Atlassian avatar hosts without credentials or redirects', async () => {
  let calls = 0;
  const load = createAvatarLoader(async (_url, options) => {
    calls++;
    assert.equal(options?.redirect, 'error');
    assert.equal(options?.credentials, 'omit');
    return new Response(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]));
  });
  for (const value of [
    'http://127.0.0.1/avatar.png',
    'https://catchtable.atlassian.net/avatar',
    'https://evil.example/avatar.png',
    url.replace('https://', 'https://user:secret@'),
  ]) {
    assert.equal(avatarUrl(value), '');
    assert.equal(await load({ url: value }), null);
  }
  assert.ok((await load({ url }))?.startsWith('data:image/png;base64,'));
  await load({ url });
  assert.equal(calls, 1);
});
test('rejects oversized and non-image responses, and tolerates network failure', async () => {
  assert.equal(
    await createAvatarLoader(async () => new Response(new Uint8Array(65537)))({
      url,
    }),
    null,
  );
  assert.equal(
    await createAvatarLoader(
      async () => new Response('<svg>not a raster image</svg>'),
    )({ url }),
    null,
  );
  assert.equal(
    await createAvatarLoader(async () => {
      throw new Error('offline');
    })({ url }),
    null,
  );
});
