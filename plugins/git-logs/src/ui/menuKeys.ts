import type { KeyboardEvent } from 'react';

const MOVE_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End'];

/** 파일·커밋 메뉴가 같이 쓰는 키 처리. Esc와 Tab은 메뉴를 닫고, 방향키와 Home/End는 항목을 옮긴다.
 * Esc는 메뉴 요소에서 끊어 document의 keydown 리스너까지 번지지 않게 한다. */
export function handleMenuKey(
  event: KeyboardEvent<HTMLElement>,
  dismiss: () => void,
) {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    dismiss();
    return;
  }
  // Tab은 기본 동작(다음 요소로 이동)을 그대로 두고 메뉴만 닫는다.
  if (event.key === 'Tab') {
    dismiss();
    return;
  }
  if (!MOVE_KEYS.includes(event.key)) return;
  event.preventDefault();
  const items = [
    ...event.currentTarget.querySelectorAll<HTMLButtonElement>('button'),
  ];
  if (items.length === 0) return;
  const index = items.indexOf(document.activeElement as HTMLButtonElement);
  const down = event.key === 'ArrowDown';
  const last = items.length - 1;
  // 포커스가 메뉴 div 자체에 있으면 index가 -1이라, 아래로는 첫 항목 위로는 마지막 항목으로 간다.
  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? last
        : index < 0
          ? down
            ? 0
            : last
          : (index + (down ? 1 : -1) + items.length) % items.length;
  items[next]?.focus();
}
