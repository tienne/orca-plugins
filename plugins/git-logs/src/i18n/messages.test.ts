import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveLocale, translate, formatDate } from './messages';
test('localization resolves regional Orca locales and falls back to English for unsupported/malformed tags', () => {
  assert.deepEqual(resolveLocale('KO-kr'), { language: 'ko', locale: 'ko-KR' });
  assert.deepEqual(resolveLocale('en-GB'), { language: 'en', locale: 'en-GB' });
  for (const locale of ['fr-FR', 'not_a_locale', '', null, undefined])
    assert.deepEqual(resolveLocale(locale), {
      language: 'en',
      locale: 'en-US',
    });
});
test('localized worker messages preserve captured paths and verbatim Git output', () => {
  const path = '문서/{p0}\nfile.txt';
  assert.equal(
    translate(
      `ignored 파일과 대상 경로가 겹칩니다: ${path}. 먼저 별도로 보관하세요.`,
      'en-US',
    ),
    `An ignored file overlaps a target path: ${path}. Back it up separately first.`,
  );
  assert.equal(
    translate(
      '진행 중인 Git 작업(rebase-merge)이 있습니다. 터미널에서 완료하거나 중단한 뒤 새로고침하세요.',
      'en',
    ),
    'A Git operation (rebase-merge) is in progress. Finish or abort it in a terminal, then refresh.',
  );
  assert.equal(
    translate('완료했습니다.\nraw Git output\n완료했습니다.', 'en'),
    'Completed.\nraw Git output\n완료했습니다.',
  );
  assert.equal(
    translate('Git output unknown to the plugin', 'ko'),
    'Git output unknown to the plugin',
  );
  assert.equal(
    translate('열린 워크트리 · {p0}', 'en', { p0: '워크트리/{p1}' }),
    'Workspace · 워크트리/{p1}',
  );
});
test('localized compound confirmation messages retain reset risks and merge mainline', () => {
  const reset =
    '현재 브랜치의 끝을 선택 커밋으로 옮깁니다. 공유한 브랜치의 이력을 바꿀 수 있습니다. Hard: index와 작업 트리를 선택 커밋 내용으로 바꿉니다. 경로를 막는 untracked 파일이 삭제될 수 있습니다.';
  const english = translate(reset, 'en');
  assert.match(english, /Shared branch history may be rewritten/);
  assert.match(english, /untracked files may be deleted/);
  assert.doesNotMatch(english, /[가-힣]/);
  const merge =
    '선택 커밋의 변경을 취소하는 새 커밋을 현재 브랜치에 만듭니다. 기존 이력은 유지합니다. 부모 2(abcdef0)을 기준으로 합니다.';
  assert.match(
    translate(merge, 'en'),
    /Use parent 2 \(abcdef0\) as the mainline/,
  );
});
test('date formatting follows supported regional locale rather than machine language', () => {
  const value = '2026-11-04T12:00:00Z';
  assert.notEqual(formatDate(value, 'en-US'), formatDate(value, 'en-GB'));
  assert.match(formatDate(value, 'ko-KR'), /26/);
  assert.equal(formatDate('not-a-date', 'en-US'), '—');
});

test('Korean copy keeps reset warnings and treats workspace labels separately from Git working trees', () => {
  assert.equal(translate('{count}개 변경', 'ko', { count: 3 }), '3개 변경');
  assert.equal(
    translate('부모 {p0}({p1})을 기준으로 합니다.', 'ko', {
      p0: 2,
      p1: 'abcdef0',
    }),
    '부모 2(abcdef0)을 기준으로 합니다.',
  );
  assert.equal(
    translate('열린 워크트리 · {p0}', 'ko', { p0: '작업트리/{p1}' }),
    '작업 공간 · 작업트리/{p1}',
  );
  const reset =
    '현재 브랜치의 끝을 선택 커밋으로 옮깁니다. 공유한 브랜치의 이력을 바꿀 수 있습니다. Hard: index와 작업 트리를 선택 커밋 내용으로 바꿉니다. 경로를 막는 untracked 파일이 삭제될 수 있습니다.';
  const text = translate(reset, 'ko');
  assert.match(text, /이미 공유한 이력도 바뀔 수 있습니다/);
  assert.match(text, /untracked 파일이 삭제될 수 있습니다/);
  assert.equal(
    translate('완료했습니다.\nraw Git output\n열린 워크트리', 'ko'),
    '완료했습니다.\nraw Git output\n열린 워크트리',
  );
});
