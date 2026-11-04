import english from './en.json';
import korean from './ko.json';
const catalogs: Record<'ko' | 'en', Record<string, string>> = {
  ko: korean,
  en: english,
};
const keys = [...new Set([...Object.keys(english), ...Object.keys(korean)])];
export function resolveLocale(value: unknown): {
  locale: string;
  language: 'ko' | 'en';
} {
  try {
    if (typeof value !== 'string') throw new Error('missing locale');
    const locale = Intl.getCanonicalLocales(value)[0];
    const language = locale?.split('-')[0];
    if (language === 'ko' || language === 'en') return { locale, language };
  } catch {
    /* Unknown or malformed locales use English. */
  }
  return { locale: 'en-US', language: 'en' };
}
const templates = keys
  .filter((key) => /\{p\d+\}/.test(key))
  .map((key) => {
    const names: string[] = [];
    const pattern = key
      .split(/(\{p\d+\})/)
      .map((part) => {
        if (/^\{p\d+\}$/.test(part)) {
          names.push(part.slice(1, -1));
          return '([\\s\\S]*?)';
        }
        return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      })
      .join('');
    return { key, names, pattern: new RegExp(`^${pattern}$`) };
  });
const compoundPrefixes = keys
  .filter((key) => key.length > 30 && !key.includes('{'))
  .sort((a, b) => b.length - a.length);
function interpolate(value: string, params: Record<string, string | number>) {
  return value.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.hasOwn(params, key) ? String(params[key]) : match,
  );
}
/** Only UI-owned messages and known worker messages go through this function.
 * Never pass commit messages, authors, paths or raw Git output for translation. */
export function translate(
  source: string,
  locale: string,
  params: Record<string, string | number> = {},
): string {
  const messages = catalogs[resolveLocale(locale).language];
  if (Object.hasOwn(messages, source))
    return interpolate(messages[source], params);
  const trimmed = source.trim();
  if (trimmed !== source && Object.hasOwn(messages, trimmed))
    return (
      source.slice(0, source.indexOf(trimmed)) +
      interpolate(messages[trimmed], params) +
      source.slice(source.indexOf(trimmed) + trimmed.length)
    );
  for (const template of templates) {
    const match = template.pattern.exec(source);
    if (match)
      return interpolate(messages[template.key] ?? template.key, {
        ...Object.fromEntries(
          template.names.map((name, i) => [name, match[i + 1]]),
        ),
        ...params,
      });
  }
  // Mutation results have one owned status line followed by verbatim Git output.
  const line = source.indexOf('\n');
  if (line >= 0)
    return translate(source.slice(0, line), locale) + source.slice(line);
  // Worker summaries combine an action policy with a reset mode or mainline.
  for (const prefix of compoundPrefixes)
    if (source.startsWith(prefix + ' '))
      return (
        (messages[prefix] ?? prefix) +
        ' ' +
        translate(source.slice(prefix.length + 1), locale)
      );
  return interpolate(source, params);
}
export function formatDate(value: string, locale: string, full = false) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return '—';
  return new Intl.DateTimeFormat(resolveLocale(locale).locale, {
    dateStyle: 'short',
    ...(full ? { timeStyle: 'medium' as const } : {}),
  }).format(date);
}
