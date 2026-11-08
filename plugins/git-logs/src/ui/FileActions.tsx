import { t } from './i18n';
import { useEffect, useRef } from 'react';

export interface FileMenu {
  path: string;
  x: number;
  y: number;
  origin: HTMLElement;
}

export function FileActions({
  menu,
  closeMenu,
  showHistory,
}: {
  menu: FileMenu | null;
  closeMenu: () => void;
  showHistory: (path: string) => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  // 닫은 뒤에는 메뉴를 연 파일 행으로 포커스를 돌려 키보드 흐름이 끊기지 않게 한다.
  const dismiss = () => {
    const origin = menu?.origin;
    closeMenu();
    if (origin?.isConnected) origin.focus();
  };
  useEffect(() => {
    if (!menu) return;
    menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [menu]);
  if (!menu) return null;
  return (
    <>
      <div className="context-dismiss" onPointerDown={dismiss} />
      <div
        ref={menuRef}
        role="menu"
        aria-label={t('파일 작업')}
        className="commit-menu"
        style={{
          left: Math.max(8, Math.min(menu.x, window.innerWidth - 260)),
          top: Math.max(8, Math.min(menu.y, window.innerHeight - 120)),
        }}
        onKeyDown={(event) => {
          if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key))
            return;
          event.preventDefault();
          const items = [
            ...event.currentTarget.querySelectorAll<HTMLButtonElement>(
              'button',
            ),
          ];
          const index = items.indexOf(
            document.activeElement as HTMLButtonElement,
          );
          items[
            event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? items.length - 1
                : (index +
                    (event.key === 'ArrowDown' ? 1 : -1) +
                    items.length) %
                  items.length
          ]?.focus();
        }}
      >
        <small title={menu.path}>
          {menu.path.split('/').pop()} {t('· 파일 작업')}
        </small>
        <button
          role="menuitem"
          onClick={() => {
            showHistory(menu.path);
            dismiss();
          }}
        >
          {t('히스토리')}
        </button>
      </div>
    </>
  );
}
