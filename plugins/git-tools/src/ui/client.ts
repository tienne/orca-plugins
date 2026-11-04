import type { Requests } from '../protocol';
export async function request<K extends keyof Requests>(
  name: K,
  input: Requests[K]['input'],
): Promise<Requests[K]['output']> {
  if (!window.orca)
    throw new Error('실제 Git 조회는 Orca 플러그인에서만 가능합니다.');
  return window.orca.plugin.request<Requests[K]['output']>(name, input, {
    timeoutMs: 60000,
  });
}
