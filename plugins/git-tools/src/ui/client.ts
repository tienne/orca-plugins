import type { Requests } from '../protocol';
export async function request<K extends keyof Requests>(
  name: K,
  input: Requests[K]['input'],
): Promise<Requests[K]['output']> {
  if (!window.orca)
    throw new Error('실제 Git 조회는 Orca 플러그인에서만 가능합니다.');
  if (
    window.orca.api?.major !== 1 ||
    window.orca.api.minor < 2 ||
    !window.orca.host.has('plugin.request')
  )
    throw new Error(
      '이 Orca에서 plugin.request를 지원하지 않습니다. Host API 1.2 이상이 필요합니다.',
    );
  return window.orca.plugin.request<Requests[K]['output']>(name, input, {
    timeoutMs: 60000,
  });
}
