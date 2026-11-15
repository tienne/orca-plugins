import { test } from 'node:test';
import assert from 'node:assert/strict';
import { t, formatDate, formatNumber, setPreviewLocale } from './i18n';

test('host locale is authoritative even when missing, invalid or unsupported', () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const originalLocation = Object.getOwnPropertyDescriptor(
    globalThis,
    'location',
  );
  const originalNavigator = Object.getOwnPropertyDescriptor(
    globalThis,
    'navigator',
  );
  const host: { locale?: unknown } = {};
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { orca: host },
  });
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    value: { search: '?lang=ko' },
  });
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: { language: 'ko-KR' },
  });
  try {
    const value = '2026-11-05T01:02:03Z';
    for (const [input, expected] of [
      ['ko', 'ko'],
      ['KO-kr', 'ko-KR'],
      ['en-US', 'en-US'],
      ['en-GB', 'en-GB'],
      ['ja-JP', 'en-US'],
      ['fr-FR', 'en-US'],
      ['', 'en-US'],
      ['ko-', 'en-US'],
      ['not_a_locale', 'en-US'],
      [undefined, 'en-US'],
      [null, 'en-US'],
    ] as const) {
      host.locale = input;
      assert.equal(
        t('완료했습니다.'),
        expected.startsWith('ko') ? '완료했습니다.' : 'Completed.',
      );
      assert.equal(
        formatNumber(12345.6),
        new Intl.NumberFormat(expected).format(12345.6),
      );
      assert.equal(
        formatDate(value, true),
        new Intl.DateTimeFormat(expected, {
          dateStyle: 'short',
          timeStyle: 'medium',
        }).format(new Date(value)),
      );
    }
    // 호스트 프레임에서는 미리보기 변경이 URL이나 호스트를 수정하지 않아야 한다.
    setPreviewLocale('ko');
    assert.equal(host.locale, null);
    (window as unknown as { orca?: unknown }).orca = undefined;
    assert.equal(t('완료했습니다.'), '완료했습니다.');
    (location as unknown as { search: string }).search = '?lang=en-GB';
    assert.equal(t('완료했습니다.'), 'Completed.');
    (location as unknown as { search: string }).search = '';
    assert.equal(t('완료했습니다.'), '완료했습니다.');
    (location as unknown as { search: string }).search = '?lang=';
    assert.equal(t('완료했습니다.'), 'Completed.');
  } finally {
    for (const [key, descriptor] of [
      ['window', originalWindow],
      ['location', originalLocation],
      ['navigator', originalNavigator],
    ] as const) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
