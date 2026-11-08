import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { resolveLocale, translate, formatDate } from './messages';
import english from './en.json';
import korean from './ko.json';
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

// 번들된 테스트 파일은 임시 폴더에 풀리므로 import.meta 대신 Nx가 실행하는 저장소 루트를 기준으로 소스를 찾는다.
const sourceRoot = join(process.cwd(), 'plugins/git-logs/src');
const ts = createRequire(join(process.cwd(), 'package.json'))(
  'typescript',
) as typeof import('typescript');
const hangul = /[가-힣]/;
const placeholders = (text: string) =>
  [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(entry.name) &&
      !/\.(test|d)\.ts$/.test(entry.name) &&
      entry.name !== 'fixture.ts'
      ? [path]
      : [];
  });
}
// 문자열 리터럴과 템플릿 리터럴(보간은 {p0}, {p1} 순서로 치환), JSX 텍스트 중 한글이 든 것을 모은다.
function koreanLiterals(
  path: string,
  keep: (node: import('typescript').Node) => boolean = () => true,
) {
  const file = ts.createSourceFile(
    path,
    readFileSync(path, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    path.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const found: string[] = [];
  const visit = (node: import('typescript').Node) => {
    let text: string | undefined;
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
      text = node.text;
    else if (ts.isTemplateExpression(node))
      text =
        node.head.text +
        node.templateSpans
          .map((span, i) => `{p${i}}${span.literal.text}`)
          .join('');
    else if (ts.isJsxText(node)) text = node.text.trim();
    if (text !== undefined && hangul.test(text) && keep(node)) found.push(text);
    if (!ts.isTemplateExpression(node)) ts.forEachChild(node, visit);
  };
  visit(file);
  return found;
}
const catalog = english as Record<string, string>;
const koCatalog = korean as Record<string, string>;
const isCataloged = (text: string) => text in catalog || text.trim() in catalog;

// 0.2.0에서 새로 노출한 문구. 소스와 어긋나면 아래 두 번째 테스트가 잡는다.
const added020 = [
  '커밋 메시지 검색',
  '커밋 본문을 불러오지 못했습니다.',
  '필터',
  '작성자',
  '경로',
  '메시지',
  '시작일',
  '종료일',
  '시작일 (committer date)',
  '종료일 (committer date)',
  '날짜 필터는 committer date 기준입니다. 목록의 날짜는 작성일입니다.',
  '적용된 필터',
  '{p0} 필터 해제',
  '모두 해제',
  '잘못된 필터입니다.',
  '검색어는 200자 이하로 입력하세요.',
  '작성자는 200자 이하로 입력하세요.',
  '검색어에 줄바꿈이나 NUL 문자를 쓸 수 없습니다.',
  '작성자에 줄바꿈이나 NUL 문자를 쓸 수 없습니다.',
  '날짜는 YYYY-MM-DD 형식의 실제 날짜여야 합니다.',
  '전체 브랜치에서는 이름 변경 추적을 쓸 수 없습니다.',
  '/ 최대 {p0}',
  '이전 커밋을 불러오는 중…',
  '최근 커밋 {p0}개까지만 불러옵니다. 더 오래된 커밋은 검색이나 필터로 찾으세요.',
  'stale-cursor: 이력이 바뀌었습니다. 처음부터 다시 불러옵니다.',
  '잘못된 페이지 커서입니다. 처음부터 다시 불러오세요.',
  '비교',
  '비교 기준으로 지정',
  '지정한 커밋과 비교',
  '기준 해제',
  '비교 기준',
  '비교 기준 해제',
  '기준: {p0}',
  '공통 조상 기준으로 비교',
  '끄면 기준과 대상을 직접 비교하고, 켜면 두 지점의 공통 조상에서 대상까지의 변경을 봅니다.',
  '공통 조상이 없습니다.',
  '같은 커밋입니다.',
  '파일 작업',
  '· 파일 작업',
  '히스토리',
  '파일',
  '파일: {p0} (이름 변경 추적)',
  '전체 브랜치 보기에서는 이름 변경 추적을 쓸 수 없습니다.',
];
// 워커가 라벨을 끼워 만드는 오류. 소스에는 템플릿만 있고 완성 문구는 카탈로그에만 있다.
const workerTemplates: Record<
  string,
  [string, Record<string, string | number>]
> = {
  '검색어는 200자 이하로 입력하세요.': [
    '{p0}는 {p1}자 이하로 입력하세요.',
    { p0: '검색어', p1: 200 },
  ],
  '작성자는 200자 이하로 입력하세요.': [
    '{p0}는 {p1}자 이하로 입력하세요.',
    { p0: '작성자', p1: 200 },
  ],
  '검색어에 줄바꿈이나 NUL 문자를 쓸 수 없습니다.': [
    '{p0}에 줄바꿈이나 NUL 문자를 쓸 수 없습니다.',
    { p0: '검색어' },
  ],
  '작성자에 줄바꿈이나 NUL 문자를 쓸 수 없습니다.': [
    '{p0}에 줄바꿈이나 NUL 문자를 쓸 수 없습니다.',
    { p0: '작성자' },
  ],
};
const fill = (template: string, params: Record<string, string | number>) =>
  template.replace(/\{(p\d+)\}/g, (_, name: string) => String(params[name]));

test('every 0.2.0 message has an English translation with matching placeholders and no Korean left', () => {
  assert.equal(new Set(added020).size, added020.length);
  for (const key of added020) {
    assert.ok(key in catalog, `en.json is missing: ${key}`);
    assert.doesNotMatch(catalog[key], hangul, `Korean left in: ${key}`);
    assert.deepEqual(placeholders(catalog[key]), placeholders(key), key);
    const params = Object.fromEntries(
      placeholders(key).map((name) => [name, `<${name}>`]),
    );
    assert.equal(
      translate(fill(key, params), 'en'),
      fill(catalog[key], params),
      key,
    );
  }
});

test('the 0.2.0 message list matches the strings the source actually shows', () => {
  const literals = new Set(
    ['ui', 'worker'].flatMap((dir) =>
      sourceFiles(join(sourceRoot, dir)).flatMap((path) =>
        koreanLiterals(path),
      ),
    ),
  );
  // 브라우저 fixture가 흉내 내는 워커 오류도 같은 문구여야 영어 화면에서 번역된다.
  const fixtureErrors = new Set(
    koreanLiterals(
      join(sourceRoot, 'ui/fixture.ts'),
      (node) => node.parent !== undefined && ts.isNewExpression(node.parent),
    ),
  );
  for (const key of added020) {
    const generated = workerTemplates[key];
    if (generated) {
      assert.ok(literals.has(generated[0]), `no source template for: ${key}`);
      assert.equal(fill(generated[0], generated[1]), key);
    } else assert.ok(literals.has(key), `no source string for: ${key}`);
  }
  for (const key of [
    '공통 조상이 없습니다.',
    '같은 커밋입니다.',
    'stale-cursor: 이력이 바뀌었습니다. 처음부터 다시 불러옵니다.',
    '잘못된 페이지 커서입니다. 처음부터 다시 불러오세요.',
  ])
    assert.ok(fixtureErrors.has(key), `fixture no longer throws: ${key}`);
});

test('every Korean string literal shown by the UI or worker has an English translation', () => {
  // 번역하지 않는 것: 언어 선택기의 자기 언어 이름, 오류 시연용 fixture 문구, 라벨만 있는 템플릿 조각.
  const untranslated = new Set([
    '한국어',
    'DEMO 커밋 본문 조회 실패 fixture',
    '검색어',
    ...Object.values(workerTemplates).map(([template]) => template),
  ]);
  const missing = ['ui', 'worker'].flatMap((dir) =>
    sourceFiles(join(sourceRoot, dir)).flatMap((path) =>
      koreanLiterals(path)
        .filter((text) => !isCataloged(text) && !untranslated.has(text))
        .map((text) => `${path.slice(sourceRoot.length + 1)}: ${text}`),
    ),
  );
  assert.deepEqual(missing, []);
});

test('Korean overrides exist only for changed Korean copy and stale-cursor hides its internal prefix', () => {
  for (const key of Object.keys(koCatalog)) {
    assert.ok(key in catalog, `ko.json key without English entry: ${key}`);
    assert.deepEqual(placeholders(koCatalog[key]), placeholders(key), key);
  }
  const stale = 'stale-cursor: 이력이 바뀌었습니다. 처음부터 다시 불러옵니다.';
  assert.equal(
    translate(stale, 'ko'),
    '이력이 바뀌었습니다. 처음부터 다시 불러옵니다.',
  );
  assert.equal(
    translate(stale, 'en'),
    'History changed. Reloading from the start.',
  );
  // 한국어 덮어쓰기가 없는 0.2.0 문구는 원문 그대로, 자리표시자만 채워 보여 준다.
  assert.equal(
    translate('{p0} 필터 해제', 'ko', { p0: '작성자' }),
    '작성자 필터 해제',
  );
  assert.equal(
    translate('공통 조상이 없습니다.', 'ko'),
    '공통 조상이 없습니다.',
  );
  assert.equal(
    translate('같은 커밋입니다.', 'en'),
    'Both sides are the same commit.',
  );
});
