import { useLayoutEffect, useRef, useState } from 'react';

export const ROW_HEIGHT = 64;
export const OVERSCAN = 8;
// 측정 전(첫 렌더, 숨겨진 패널)에도 화면을 채울 만큼은 그린다.
const FALLBACK_HEIGHT = 640;

/** 고정 높이 행 목록에서 스크롤 위치로 그릴 행 범위를 정한다. pinned 행은 창 밖이어도 그린다.
 * resetKey가 바뀌면 목록을 맨 위로 돌린다. */
export function useRowWindow(
  element: HTMLElement | null,
  count: number,
  pinned: number[],
  resetKey: unknown,
) {
  const [view, setView] = useState({ top: 0, height: 0, key: resetKey });
  const keyRef = useRef(resetKey);
  keyRef.current = resetKey;
  useLayoutEffect(() => {
    if (!element) return;
    const update = () =>
      setView((current) =>
        current.top === element.scrollTop &&
        current.height === element.clientHeight &&
        current.key === keyRef.current
          ? current
          : {
              top: element.scrollTop,
              height: element.clientHeight,
              key: keyRef.current,
            },
      );
    update();
    element.addEventListener('scroll', update, { passive: true });
    const observer =
      typeof ResizeObserver === 'function' ? new ResizeObserver(update) : null;
    observer?.observe(element);
    return () => {
      element.removeEventListener('scroll', update);
      observer?.disconnect();
    };
  }, [element]);
  useLayoutEffect(() => {
    if (!element) return;
    element.scrollTop = 0;
    setView({ top: 0, height: element.clientHeight, key: resetKey });
  }, [resetKey]);
  // 목록이 바뀐 렌더에서는 이전 스크롤 위치로 끝에 닿았다고 오판하지 않도록 맨 위로 본다.
  const top = view.key === resetKey ? view.top : 0;
  const height = view.height || FALLBACK_HEIGHT;
  const firstVisible = Math.floor(top / ROW_HEIGHT);
  const lastVisible = Math.min(
    count - 1,
    Math.ceil((top + height) / ROW_HEIGHT) - 1,
  );
  const first = Math.max(0, firstVisible - OVERSCAN);
  const last = Math.min(count - 1, lastVisible + OVERSCAN);
  const indices = new Set<number>();
  for (let i = first; i <= last; i++) indices.add(i);
  for (const index of pinned)
    if (index >= 0 && index < count) indices.add(index);
  // 행 사이 빈 구간은 spacer 높이로 채워 스크롤 높이와 각 행의 위치를 유지한다.
  const segments: ({ index: number } | { gap: number; at: number })[] = [];
  let next = 0;
  for (const index of [...indices].sort((a, b) => a - b)) {
    if (index > next)
      segments.push({ gap: (index - next) * ROW_HEIGHT, at: next });
    segments.push({ index });
    next = index + 1;
  }
  if (count > next)
    segments.push({ gap: (count - next) * ROW_HEIGHT, at: next });
  return { segments, lastVisible };
}
