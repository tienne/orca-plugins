const MAX_BYTES = 64 * 1024;
export function avatarUrl(value: unknown): string {
  if (typeof value !== 'string' || value.length > 2000) return '';
  try {
    const url = new URL(value);
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      url.port ||
      !/^avatar-management--avatars\.[a-z0-9-]+\.prod\.public\.atl-paas\.net$/.test(
        url.hostname,
      )
    )
      return '';
    return url.href;
  } catch {
    return '';
  }
}
export function createAvatarLoader(fetchImage: typeof fetch = fetch) {
  const cache = new Map<
    string,
    { expires: number; result: Promise<string | null> }
  >();
  return async (
    input: { url: string },
    signal?: AbortSignal,
  ): Promise<string | null> => {
    const url = avatarUrl(input?.url);
    if (!url) return null;
    const cached = cache.get(url);
    if (cached && cached.expires > Date.now()) return cached.result;
    if (cache.size >= 100) cache.delete(cache.keys().next().value!);
    const result = (async () => {
      try {
        const response = await fetchImage(url, {
          redirect: 'error',
          credentials: 'omit',
          signal: signal
            ? AbortSignal.any([signal, AbortSignal.timeout(5000)])
            : AbortSignal.timeout(5000),
        });
        if (!response.ok || !response.body) return null;
        if (Number(response.headers.get('content-length')) > MAX_BYTES) {
          await response.body.cancel();
          return null;
        }
        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        let size = 0;
        while (true) {
          const part = await reader.read();
          if (part.done) break;
          size += part.value.byteLength;
          if (size > MAX_BYTES) {
            await reader.cancel();
            return null;
          }
          chunks.push(part.value);
        }
        const bytes = Buffer.concat(chunks);
        const mime = bytes
          .subarray(0, 8)
          .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
          ? 'image/png'
          : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
            ? 'image/jpeg'
            : bytes.subarray(0, 4).toString() === 'RIFF' &&
                bytes.subarray(8, 12).toString() === 'WEBP'
              ? 'image/webp'
              : '';
        return mime ? `data:${mime};base64,${bytes.toString('base64')}` : null;
      } catch {
        return null;
      }
    })();
    cache.set(url, { expires: Date.now() + 5 * 60 * 1000, result });
    return result;
  };
}
