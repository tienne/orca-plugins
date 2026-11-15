import { test, assert } from 'orca/testing';
import { resolveLocale, formatNumber } from './locale';

test('keeps supported regional locale tags and uses en-US for all other inputs', () => {
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
  for (const locale of ['ko', 'ko-KR', 'en-GB', 'fr-FR', 'not_a_locale'])
    assert.equal(
      formatNumber(12345.6, locale),
      new Intl.NumberFormat(resolveLocale(locale)).format(12345.6),
    );
});
