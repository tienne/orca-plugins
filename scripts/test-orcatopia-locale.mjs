import assert from 'node:assert/strict';

export function testOrcatopiaLocale({
  resolveLocale,
  currentLocale,
  translate,
}) {
  for (const [value, expected] of [
    ['ko', 'ko'],
    ['KO-kr', 'ko-KR'],
    ['en', 'en'],
    ['en-US', 'en-US'],
    ['en-GB', 'en-GB'],
  ])
    assert.equal(resolveLocale(value), expected);
  for (const value of [
    'ja-JP',
    'fr-FR',
    '',
    'ko-',
    'not_a_locale',
    null,
    undefined,
    42,
  ])
    assert.equal(resolveLocale(value), 'en-US');

  for (const locale of ['ko', 'ko-KR', 'en-US', 'en-GB']) {
    const number = new Intl.NumberFormat(locale).format(12345);
    assert.equal(
      translate('12345 materials', locale),
      locale.startsWith('ko') ? `재료 ${number}개` : `${number} materials`,
    );
    assert.equal(
      translate('owned ×12345', locale),
      locale.startsWith('ko') ? `보유 ×${number}` : `owned ×${number}`,
    );
    assert.equal(
      translate('https://example.com/12345', locale),
      'https://example.com/12345',
    );
    assert.equal(
      translate('/private/12345.json', locale),
      '/private/12345.json',
    );
    assert.equal(
      translate('Error: host returned 12345', locale),
      locale.startsWith('ko')
        ? '오류: host returned 12345'
        : 'Error: host returned 12345',
    );
  }

  for (const locale of ['en-US', 'ko-KR', 'en-US-u-nu-arab']) {
    assert.equal(
      translate('Error: 12345 materials', locale),
      locale.startsWith('ko')
        ? '오류: 12345 materials'
        : 'Error: 12345 materials',
    );
    assert.equal(
      translate('Source cell 1234 → Destination cell 1500', locale),
      locale.startsWith('ko')
        ? '출발 1234번 칸 → 목적지 1500번 칸'
        : 'Source cell 1234 → Destination cell 1500',
    );
  }
  assert.equal(
    translate('I Discovery 60% · II Treasure 30%', 'en-US-u-nu-arab'),
    'I Discovery ٦٠% · II Treasure ٣٠%',
  );

  assert.equal(
    translate('Error: host returned · 12345 materials', 'en-US'),
    'Error: host returned · 12345 materials',
  );
  assert.equal(translate('World Map', 'KO-kr'), '세계 지도');
  assert.equal(translate('12345 materials', 'bad_locale'), '12,345 materials');

  const originals = new Map(
    ['window', 'navigator', 'location'].map((key) => [
      key,
      Object.getOwnPropertyDescriptor(globalThis, key),
    ]),
  );
  const host = {};
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { orca: host },
  });
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: { language: 'ko-KR' },
  });
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    value: { search: '?lang=ko' },
  });
  try {
    for (const [value, expected] of [
      ['KO-kr', 'ko-KR'],
      ['en-GB', 'en-GB'],
      ['ja-JP', 'en-US'],
      ['', 'en-US'],
      ['bad_locale', 'en-US'],
      [undefined, 'en-US'],
      [null, 'en-US'],
    ]) {
      host.locale = value;
      assert.equal(currentLocale(), expected);
      const timestamp = '2026-11-05T01:02:03Z';
      assert.equal(
        translate(`Exported ${timestamp}`),
        `${expected.startsWith('ko') ? '내보낸 시각' : 'Exported'} ${new Intl.DateTimeFormat(
          expected,
          {
            dateStyle: 'medium',
            timeStyle: 'short',
          },
        ).format(new Date(timestamp))}`,
      );
    }
    globalThis.window.orca = undefined;
    assert.equal(currentLocale(), 'ko');
    globalThis.location.search = '?lang=en-GB';
    assert.equal(currentLocale(), 'en-GB');
    globalThis.location.search = '';
    assert.equal(currentLocale(), 'ko-KR');
    globalThis.location.search = '?lang=';
    assert.equal(currentLocale(), 'en-US');
  } finally {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
}
