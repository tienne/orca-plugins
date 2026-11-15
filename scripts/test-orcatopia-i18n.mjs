import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import {
  extractMessages,
  markupMessages,
  coverageIssues,
  catalogIssues,
} from './i18n/orcatopia-coverage.mjs';

export async function testI18nCoverage(runtime) {
  const root = 'plugins/orcatopia/';
  const templateSources = Object.keys(runtime.messages).filter((source) =>
    source.includes('{'),
  );
  runtime = {
    ...runtime,
    templates: runtime.templates.map((entry, i) => ({
      ...entry,
      source: templateSources[i],
    })),
  };
  const policy = JSON.parse(
    await readFile('scripts/i18n/orcatopia-policy.json', 'utf8'),
  );
  const exclusions = [
    ...policy.exclusions,
    ...policy.groups.flatMap(({ values, ...group }) =>
      values.map((text) => ({ ...group, text })),
    ),
  ];
  const categories = new Set([
    'technical',
    'brand',
    'diagnostic',
    'log',
    'user-data',
    'url',
    'saved-data',
  ]);
  for (const entry of exclusions) {
    assert.ok(
      categories.has(entry.category) && entry.reason?.trim(),
      `Missing exclusion reason/category: ${entry.text}`,
    );
  }
  for (const entry of policy.fragments) {
    assert.ok(
      entry.reason?.trim() && entry.samples.length,
      `Missing fragment bindings: ${entry.text}`,
    );
  }
  const catalog = JSON.parse(
    await readFile(root + 'src/landmarks.json', 'utf8'),
  );
  const options = {
    ...runtime,
    exclusions,
    fragments: policy.fragments,
    identifiers: catalog.map((l) => l.id),
  };
  const candidates = [];
  for (const file of (
    await readdir(root + 'src', { recursive: true })
  ).sort()) {
    if (!file.endsWith('.ts') || file.endsWith('.d.ts')) continue;
    const path = root + 'src/' + file;
    candidates.push(...extractMessages(path, await readFile(path, 'utf8')));
  }
  candidates.push(
    ...markupMessages(await readFile(root + 'index.html', 'utf8')).map(
      (entry) => ({ ...entry, file: root + 'index.html', line: 1, column: 1 }),
    ),
  );
  assert.deepEqual(
    catalogIssues(
      JSON.parse(await readFile(root + 'src/messages.ko.json', 'utf8')),
    ),
    [],
  );
  assert.deepEqual(
    coverageIssues(candidates, options),
    [],
    'Orcatopia translation coverage',
  );

  const checkSource = (source, overrides = {}) =>
    coverageIssues(extractMessages(root + 'src/ui.ts', source), {
      ...options,
      ...overrides,
    });
  for (const source of [
    'panel.innerHTML = `<button>new untranslated action</button>`;',
    ...['aria-label', 'title', 'placeholder', 'alt'].map(
      (attribute) =>
        `panel.innerHTML = '<input ${attribute}="new untranslated label">';`,
    ),
    'panel.setAttribute("aria-label", `New accessible label ${count}`);',
    'panel.textContent = `New dynamic error: ${error.message}`;',
    'throw new Error("New worker failure");',
    'throw Error(`New backup failure ${filename}`);',
    'panel.innerHTML = `<button>${ready ? "Place" : "new branch label"}</button>`;',
    'panel.textContent = "land";',
    'const summary = { status: "new visible status" };',
    'const label = "Me";',
    'panel.innerHTML = `<input aria-label=Untranslated>`;',
    'panel.innerHTML = `<button>land</button>`;',
    'panel.innerHTML = `<button aria-label="land"></button>`;',
    'panel.textContent = "Error: New nested failure";',
    'panel.textContent = "World Map · new untranslated segment";',
  ])
    assert.ok(
      checkSource(source).some((error) =>
        error.includes('Missing translation:'),
      ),
      `Must reject untranslated UI: ${source}`,
    );

  assert.deepEqual(
    checkSource(`
    import item from './technical-module';
    type Status = 'technical-status';
    const saved = { id: 'saved-identifier', code: 'XXX' };
    panel.innerHTML = '<button id="private-id" data-user="User original" value="stored-value" aria-label="Place">World Map</button><a href="https://example.com/private">Place</a>';
    panel.textContent = userOriginal;
    panel.setAttribute('aria-label', userOriginal);
    const url = 'https://example.com/private';
    panel.querySelector('#technical-selector');
    panel.innerHTML = '<a href="https://example.com/user">https://example.com/user</a>';
    panel.innerHTML = '<code>Stored data original</code><span translate="no" aria-label="User original"><b>User original</b></span><script>Internal program</script>';
  `),
    [],
  );

  const missing = { ...runtime.messages };
  delete missing['World Map'];
  assert.ok(
    checkSource('panel.textContent = "World Map";', { messages: missing })
      .length,
    'Deleting a real translation must fail',
  );
  const missingError = { ...runtime.messages };
  delete missingError['Error: Fusion request was already used.'];
  assert.ok(
    checkSource('throw new Error("Fusion request was already used.");', {
      messages: missingError,
    }).length,
    'Deleting a contextual worker-error translation must fail',
  );
  const missingTemplate = { ...runtime.messages };
  delete missingTemplate['Cell {cell}: {name}'];
  assert.ok(
    checkSource('panel.textContent = `Cell ${cell}: ${name}`;', {
      messages: missingTemplate,
    }).length,
    'Deleting a real template must fail',
  );
  for (const target of [
    '{wrong}번 칸: {name}',
    '{cell}번 칸',
    '{cell}번 칸: {name} {name}',
    '',
  ]) {
    const messages = { ...runtime.messages, 'Cell {cell}: {name}': target };
    assert.ok(
      coverageIssues([], { ...options, messages }).length,
      `Must reject invalid placeholder target: ${target}`,
    );
  }
  assert.deepEqual(
    catalogIssues({ '{name} / {count}': '{count} / {name}' }),
    [],
  );
  assert.ok(catalogIssues({ '{name} {name}': '{name}' }).length);

  const changedFragment = policy.fragments.find(
    (entry) => entry.text === 'Brush · {1}',
  );
  assert.ok(
    checkSource('panel.textContent = `Brush · ${value}`;', {
      fragments: [
        { ...changedFragment, text: 'Brush · {0}', samples: ['World Map'] },
      ],
    }).length,
    'Unrelated samples cannot suppress a fragment',
  );
  const unexplained = {
    file: root + 'src/ui.ts',
    kind: 'text',
    text: 'New untranslated action',
    category: 'technical',
    reason: '',
  };
  assert.ok(
    checkSource('panel.textContent = "New untranslated action";', {
      exclusions: [unexplained],
    }).length,
    'Exclusions need a reason',
  );

  for (const [source, expected] of [
    [
      'Error: Choose a normal landmark and a valid fusion request.',
      '오류: 일반 랜드마크와 올바른 합성 요청을 선택하세요.',
    ],
    [
      'Error: Fusion request was already used.',
      '오류: 이미 사용한 합성 요청입니다.',
    ],
    [
      'Error: Fusion needs two unplaced normal copies. Return placed copies first.',
      '오류: 미배치 일반 랜드마크 2개가 필요합니다. 배치한 랜드마크를 먼저 회수하세요.',
    ],
    ['Discovery, rarity 1.5 of 4.5', '발견, 희귀도 1.5 / 4.5'],
    ['Discovery · Rarity 1.5/4.5', '발견 · 희귀도 1.5/4.5'],
    [
      'I Discovery · Rarity 1/4 · 70% tier chance per draw · 7 of 154 discovered',
      'I 발견 · 희귀도 1/4 · 뽑기마다 해당 등급 확률 70% · 154종 중 7종 발견',
    ],
  ])
    assert.equal(runtime.translate(source, 'ko-KR'), expected);
  console.log(
    `PASS: Orcatopia translation coverage (${candidates.length} source candidates), placeholder parity, reasoned exclusions and missing/invalid-translation mutations`,
  );
}
