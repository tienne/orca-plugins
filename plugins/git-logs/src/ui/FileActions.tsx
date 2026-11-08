import { t } from './i18n';
import { useEffect, useRef } from 'react';
import { handleMenuKey } from './menuKeys';

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
    if (menu)
      menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
  }, [menu]);
  if (!menu) return null;
  return (
    <>
      <div className="context-dismiss" onPointerDown={dismiss} />
      <div
        ref={menuRef}
        role="menu"
        tabIndex={-1}
        aria-label={t('파일 작업')}
        className="commit-menu"
        style={{
          left: Math.max(8, Math.min(menu.x, window.innerWidth - 260)),
          top: Math.max(8, Math.min(menu.y, window.innerHeight - 120)),
        }}
        onKeyDown={(event) => handleMenuKey(event, dismiss)}
      >
        <small role="presentation" title={menu.path}>
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
