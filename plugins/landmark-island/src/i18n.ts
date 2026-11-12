import { additionalScenes } from './scenes';
import korean from './messages.ko.json';
import expansion from './landmark-expansion.json';
import catalog from './landmarks.json';
import landmarkKorean from './landmarks.ko.json';

export function resolveLocale(value: unknown): string {
  try {
    if (typeof value === 'string') {
      const locale = Intl.getCanonicalLocales(value)[0];
      if (/^(ko|en)(-|$)/.test(locale)) return locale;
    }
  } catch {
    /* Unsupported or malformed host values use English. */
  }
  return 'en-US';
}
export function currentLocale(): string {
  const host = (window as unknown as { orca?: { locale?: string } }).orca;
  // A browser fixture may choose a locale; a real frame always follows Orca.
  return resolveLocale(
    host
      ? host.locale
      : (new URLSearchParams(location.search).get('lang') ??
          navigator.language),
  );
}
const messages: Record<string, string> = { ...korean };
for (const entry of expansion) {
  messages[`${entry.name} garden planting`] = `${entry.nameKo} 정원 식물`;
  messages[`${entry.name} garden retreat`] = `${entry.nameKo} 정원 쉼터`;
}
for (const scene of additionalScenes)
  messages[scene.description] = scene.descriptionKo;
for (const landmark of catalog) {
  const translated = landmarkKorean[landmark.id as keyof typeof landmarkKorean];
  if (!translated) continue;
  messages[`${landmark.name} +`] = `${translated.name} +`;
  messages[`${landmark.name} star monument`] = `${translated.name} 별빛 기념비`;
  messages[`Fuse ${landmark.name} +`] = `${translated.name} + 합성`;
  for (const field of [
    'name',
    'country',
    'region',
    'description',
    'descriptionSourceName',
  ] as const)
    messages[landmark[field]] = translated[field];
}
const templates = Object.entries(messages)
  .filter(([key]) => key.includes('{'))
  .map(([source, target]) => {
    const names: string[] = [];
    const pattern = source
      .split(/(\{\w+\})/)
      .map((part) => {
        if (/^\{\w+\}$/.test(part)) {
          const name = part.slice(1, -1);
          names.push(name);
          return /^(count|owned|available|total|tiles|unique|angle|chance|cell|common|rare|epic|legendary)$/.test(
            name,
          )
            ? '(\\d+)'
            : '(.+?)';
        }
        return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      })
      .join('');
    return { regex: new RegExp(`^${pattern}$`, 'u'), names, target };
  });
export function translate(source: string, locale = currentLocale()): string {
  const text = source.trim();
  if (!text) return source;
  let result = text;
  // Dates keep their ISO source so a language switch can reformat an open backup.
  const date = /^(Exported|Weather updated) (\d{4}-\d{2}-\d{2}T[^ ]+)$/.exec(
    text,
  );
  if (date && Number.isFinite(Date.parse(date[2]))) {
    result = `${locale.startsWith('ko') ? (date[1] === 'Exported' ? '내보낸 시각' : '마지막 날씨 갱신') : date[1]} ${new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date[2]))}`;
  } else if (!locale.startsWith('ko') && text.includes(' · ')) {
    result = text
      .split(' · ')
      .map((part) => translate(part, locale))
      .join(' · ');
  } else if (locale.startsWith('ko')) {
    if (messages[text]) result = messages[text];
    else {
      const template = templates.find((entry) => entry.regex.test(text));
      if (template) {
        const match = template.regex.exec(text)!;
        result = template.target.replace(/\{(\w+)\}/g, (_, name: string) =>
          translate(match[template.names.indexOf(name) + 1], locale),
        );
      } else if (text.includes(' · '))
        result = text
          .split(' · ')
          .map((part) => translate(part, locale))
          .join(' · ');
      else if (/^[☀☁☂❄] /.test(text))
        result = text.slice(0, 2) + translate(text.slice(2), locale);
    }
  }
  return (
    source.slice(0, source.indexOf(text)) +
    result +
    source.slice(source.indexOf(text) + text.length)
  );
}

// Localize only presentation text/accessible labels. English is the canonical
// source; IDs, option values, URLs, saved data and game logic are never rewritten.
// Keeping nodes in place lets language changes preserve focus, dialog state,
// camera position, brush strokes and animation timers.
export function startLocalization() {
  let locale = currentLocale();
  const records = new WeakMap<
    Node,
    Map<string, { source: string; rendered: string }>
  >();
  const attrs = ['aria-label', 'title', 'placeholder', 'alt'];
  const apply = (
    node: Node,
    key: string,
    value: string,
    write: (text: string) => void,
  ) => {
    let slots = records.get(node);
    if (!slots) {
      slots = new Map();
      records.set(node, slots);
    }
    const old = slots.get(key);
    const source = old && old.rendered === value ? old.source : value;
    const rendered = translate(source, locale);
    slots.set(key, { source, rendered });
    if (value !== rendered) write(rendered);
  };
  const visit = (node: Node) => {
    if (node instanceof Text) {
      if (node.parentElement?.closest('script,style,code,pre,[translate="no"]'))
        return;
      apply(node, 'text', node.data, (text) => {
        node.data = text;
      });
    } else if (node instanceof Element) {
      if (node.matches('script,style,code,pre,[translate="no"]')) return;
      for (const key of attrs) {
        const value = node.getAttribute(key);
        if (value !== null)
          apply(node, key, value, (text) => node.setAttribute(key, text));
      }
      node.childNodes.forEach(visit);
    }
  };
  const options = {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: attrs,
  };
  const observer = new MutationObserver((mutations) => {
    observer.disconnect();
    // Inspect only changed branches, not the animated SVG tree each frame.
    for (const mutation of mutations) {
      if (mutation.type === 'childList') mutation.addedNodes.forEach(visit);
      else if (mutation.type === 'attributes') {
        const el = mutation.target as Element,
          key = mutation.attributeName!;
        const value = el.getAttribute(key);
        if (value !== null)
          apply(el, key, value, (text) => el.setAttribute(key, text));
      } else visit(mutation.target);
    }
    observer.observe(document.documentElement, options);
  });
  const refresh = () => {
    // Include pending source writes before switching languages.
    observer.disconnect();
    document.documentElement.lang = locale;
    visit(document.documentElement);
    observer.observe(document.documentElement, options);
  };
  const check = () => {
    const next = currentLocale();
    if (next === locale) return;
    locale = next;
    refresh();
  };
  refresh();
  // Orca exposes locale but documents no locale-change event. Observe only that
  // public property, matching the existing Git Logs integration.
  const timer = window.setInterval(check, 500);
  window.addEventListener('focus', check);
  document.addEventListener('visibilitychange', check);
  window.addEventListener(
    'pagehide',
    () => {
      observer.disconnect();
      clearInterval(timer);
      window.removeEventListener('focus', check);
      document.removeEventListener('visibilitychange', check);
    },
    { once: true },
  );
}
