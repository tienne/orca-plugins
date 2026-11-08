import { t } from './i18n';
import { useEffect, useRef } from 'react';
import { handleMenuKey, restoreFocus } from './menuKeys';

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
  const dismiss = () => {
    const origin = menu?.origin;
    closeMenu();
    restoreFocus(origin);
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
