import { useEffect, useRef, useState } from 'react';
import type { BranchRef } from '../protocol';
import { t, useLocale } from './i18n';
export function BranchPicker({
  branches,
  value,
  disabled,
  onChange,
}: {
  branches: BranchRef[];
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const selected = branches.find((branch) => branch.ref === value);
  const label =
    value === 'all' ? t('전체 브랜치') : (selected?.name ?? t('현재 브랜치'));
  const matches = branches.filter((branch) =>
    branch.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  const choose = (next: string) => {
    close();
    onChange(next);
  };
  useEffect(() => {
    if (!open) return;
    search.current?.focus();
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  return (
    <div
      ref={root}
      className="branch-picker"
      onKeyDown={(event) => {
        if (
          open &&
          event.key === 'Enter' &&
          event.target === search.current &&
          matches.length
        ) {
          event.preventDefault();
          choose(matches[0].ref);
          return;
        }
        if (event.key === 'Escape' && open) {
          event.preventDefault();
          event.stopPropagation();
          close();
        }
        if (
          !open ||
          !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)
        )
          return;
        // Home/End inside the search field remain text navigation keys.
        if (
          event.target === search.current &&
          ['Home', 'End'].includes(event.key)
        )
          return;
        event.preventDefault();
        const options = [
          ...root.current!.querySelectorAll<HTMLButtonElement>('[role=option]'),
        ];
        const index = options.indexOf(
          document.activeElement as HTMLButtonElement,
        );
        const next =
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? options.length - 1
              : index < 0
                ? event.key === 'ArrowUp'
                  ? options.length - 1
                  : options.length > 2
                    ? 2
                    : 0
                : (index +
                    (event.key === 'ArrowDown' ? 1 : -1) +
                    options.length) %
                  options.length;
        options[next]?.focus();
      }}
    >
      <button
        ref={trigger}
        className="branch-trigger"
        aria-label={t('브랜치 범위')}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        title={selected?.name ?? label}
        onClick={() => {
          setQuery('');
          setOpen((value) => !value);
        }}
      >
        <span>{label}</span>
        <span aria-hidden="true">⌄</span>
      </button>
      {open && (
        <div className="branch-popover">
          <input
            ref={search}
            aria-label={t('브랜치 검색')}
            placeholder={t('브랜치 이름 검색')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div
            role="listbox"
            aria-label={t('브랜치 목록')}
            className="branch-options"
          >
            <button
              role="option"
              aria-selected={value === 'current'}
              onClick={() => choose('current')}
            >
              {t('현재 브랜치')}
            </button>
            <button
              role="option"
              aria-selected={value === 'all'}
              onClick={() => choose('all')}
            >
              {t('전체 브랜치')}
            </button>
            <div className="branch-matches">
              {matches.slice(0, 100).map((branch) => (
                <button
                  key={branch.ref}
                  role="option"
                  aria-selected={value === branch.ref}
                  onClick={() => choose(branch.ref)}
                  title={branch.name}
                >
                  <span className="branch-name">{branch.name}</span>
                  <small>{t(branch.kind === 'local' ? '로컬' : '원격')}</small>
                </button>
              ))}
            </div>
          </div>
          {!matches.length && (
            <p className="branch-note" role="status">
              {t('일치하는 브랜치가 없습니다.')}
            </p>
          )}
          {matches.length > 100 && (
            <p className="branch-note" role="status">
              {t('검색 결과가 많습니다. 이름을 더 입력하세요.')}
            </p>
          )}
          <p className="branch-note">{t('커밋 목록만 바뀝니다.')}</p>
        </div>
      )}
    </div>
  );
}
