import { useSyncExternalStore } from 'react';
import { formatDate as date, resolveLocale, translate } from '../i18n/messages';
function currentLocale() {
  // Query overrides exist only in the browser fixture, never in real Orca frames.
  const preview = !window.orca
    ? new URLSearchParams(location.search).get('lang')
    : null;
  return resolveLocale(preview ?? window.orca?.locale ?? navigator.language)
    .locale;
}
const listeners = new Set<() => void>();
let cleanup: (() => void) | undefined;
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!cleanup) {
    let previous = currentLocale();
    document.documentElement.lang = previous;
    const check = () => {
      const locale = currentLocale();
      if (locale === previous) return;
      previous = locale;
      document.documentElement.lang = locale;
      for (const notify of listeners) notify();
    };
    // Orca documents locale but no locale-change event. Observe the public value
    // without subscribing to an undocumented bridge event or internal messages.
    const timer = window.setInterval(check, 500);
    window.addEventListener('focus', check);
    window.addEventListener('git-tools:preview-locale', check);
    cleanup = () => {
      clearInterval(timer);
      window.removeEventListener('focus', check);
      window.removeEventListener('git-tools:preview-locale', check);
    };
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      cleanup?.();
      cleanup = undefined;
    }
  };
}
export function useLocale() {
  return useSyncExternalStore(subscribe, currentLocale);
}
export const t = (source: string, params?: Record<string, string | number>) =>
  translate(source, currentLocale(), params);
export const formatDate = (value: string, full = false) =>
  date(value, currentLocale(), full);
export const formatNumber = (value: number) =>
  new Intl.NumberFormat(currentLocale()).format(value);
export function changesLabel(count: number) {
  return t(
    count === 1 && resolveLocale(currentLocale()).language === 'en'
      ? '{count}개 변경 (단수)'
      : '{count}개 변경',
    { count: formatNumber(count) },
  );
}
export function setPreviewLocale(locale: string) {
  if (window.orca) return;
  const url = new URL(location.href);
  url.searchParams.set('lang', locale);
  history.replaceState(null, '', url);
  window.dispatchEvent(new Event('git-tools:preview-locale'));
}
