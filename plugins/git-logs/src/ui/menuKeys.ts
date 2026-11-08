import type { KeyboardEvent } from 'react';

const MOVE_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End'];

/** 파일·커밋 메뉴가 같이 쓰는 키 처리. Esc와 Tab은 메뉴를 닫고, 방향키와 Home/End는 항목을 옮긴다.
 * Esc는 메뉴 요소에서 끊어 바깥 핸들러(방향키 이동, 다이얼로그)로 번지지 않게 한다. */
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
  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? items.length - 1
        : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) %
          items.length;
  items[next]?.focus();
}
