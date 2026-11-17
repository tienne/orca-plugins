import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const normalize = (value) =>
  value.replace(/landmark-art-\d+/g, 'landmark-art-instance');
const group = (markup, marker) => {
  const start = markup.indexOf(marker);
  if (start < 0) return '';
  const tags = /<\/?g\b[^>]*>/g;
  tags.lastIndex = start;
  let depth = 0,
    match;
  while ((match = tags.exec(markup))) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return markup.slice(start, tags.lastIndex);
  }
  return '';
};
const hash = (value) =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex');
export async function testCatalog700({
  landmarks,
  decorations,
  art,
  landmarkLife,
  translate,
  placementType,
  canPlaceLandmark,
  empty,
}) {
  const read = async (path) => JSON.parse(await readFile(path, 'utf8'));
  const catalog = await read('plugins/orcatopia/src/catalog-700.json');
  const korean = await read('plugins/orcatopia/src/landmarks.ko.json');
  const baseline = await read('scripts/data/orcatopia-legacy600.sha256.json');
  const originalArt = await read(
    'scripts/data/orcatopia-legacy600-art.sha256.json',
  );
  assert.equal(Object.keys(originalArt.hashes).length, 1200);
  for (const [id, expected] of Object.entries(originalArt.hashes)) {
    assert.equal(
      createHash('sha256').update(normalize(art(id))).digest('hex'),
      expected,
      `${id}: preserve original complete artwork`,
    );
  }
  const originalScenes = await read(
    'scripts/data/orcatopia-legacy600-scenes.sha256.json',
  );
  assert.equal(Object.keys(originalScenes.hashes).length, 600);
  for (const [id, expected] of Object.entries(originalScenes.hashes)) {
    assert.equal(
      createHash('sha256').update(landmarkLife(id)).digest('hex'),
      expected,
      `${id}: preserve original scene`,
    );
  }
  const sources = await read('scripts/data/orcatopia-water-100-sources.json');
  assert.equal(sources.length, 100);
  assert.deepEqual(
    sources.map((e) => e.id),
    catalog.map((e) => e.record.id),
  );
  assert.equal(
    hash(landmarks.slice(0, 600)),
    baseline.records,
    'all 600 records, including tiers and coordinates, stay identical',
  );
  assert.equal(
    hash(
      Object.fromEntries(
        landmarks.slice(0, 600).map((e) => [e.id, korean[e.id]]),
      ),
    ),
    baseline.korean,
  );
  for (const r of landmarks.slice(0, 600)) {
    assert.equal(
      translate(r.name, 'ko-KR'),
      korean[r.id].name,
      `${r.id}: preserve translated name`,
    );
    assert.equal(
      translate(r.description, 'ko-KR'),
      korean[r.id].description,
      `${r.id}: preserve translated field guide`,
    );
  }
  assert.deepEqual(
    landmarks.slice(600),
    catalog.map((e) => e.record),
  );
  assert.equal(catalog.length, 100);
  assert.equal(landmarks.length, 700);
  assert.equal(
    new Set(landmarks.map((e) => e.name.normalize('NFKC').toLowerCase())).size,
    700,
  );
  const count = (entries, field) =>
    Object.fromEntries(
      [...new Set(entries.map(field))]
        .sort()
        .map((key) => [key, entries.filter((e) => field(e) === key).length]),
    );
  assert.deepEqual(
    count(landmarks, (e) => placementType(e.id)),
    { coastal: 33, land: 504, river: 91, sea: 72 },
  );
  for (const [surface, distribution] of [
    ['sea', { common: 20, epic: 5, legendary: 1, rare: 24 }],
    ['river', { common: 22, epic: 5, legendary: 1, rare: 22 }],
  ]) {
    const entries = catalog.filter((e) => e.surface === surface);
    assert.equal(entries.length, 50);
    assert.deepEqual(
      count(entries, (e) => e.record.tier),
      distribution,
    );
  }
  const pictures = new Map(),
    scenes = new Map();
  const remember = (map, key, id) =>
    map.set(key, [...(map.get(key) ?? []), id]);
  const state = empty();
  state.discoveredPlaces = landmarks.slice(0, 25).map((e) => e.id);
  const river = structuredClone(state);
  river.floors = [{ decoration: 'river', cell: 0 }];
  for (const entry of catalog) {
    const { record: r, korean: ko, visual, surface } = entry;
    assert.ok(Number.isFinite(r.lat) && Math.abs(r.lat) <= 90);
    assert.ok(Number.isFinite(r.lon) && Math.abs(r.lon) <= 180);
    assert.match(r.code, /^[A-Z]{3}$/);
    assert.match(r.descriptionSource, /^https:\/\//);
    assert.equal(r.descriptionSource, r.source);
    const evidence = sources.find((s) => s.id === r.id);
    assert.equal(evidence.officialUrl, r.descriptionSource);
    assert.equal(evidence.coordinate.lat, r.lat);
    assert.equal(evidence.coordinate.lon, r.lon);
    assert.ok(evidence.coordinate.url.startsWith('https://'));
    assert.ok(
      ['direct-page-text', 'official-search-index'].includes(
        evidence.sourceCheck.method,
      ),
    );
    for (const field of [
      'name',
      'country',
      'region',
      'description',
      'descriptionSourceName',
    ]) {
      assert.ok(r[field]?.trim() && ko[field]?.trim(), `${r.id}/${field}`);
      assert.equal(
        translate(r[field], 'ko-KR'),
        ko[field],
        `${r.id}/${field}: runtime localization`,
      );
    }
    assert.equal(
      translate(entry.scene.description, 'ko-KR'),
      entry.scene.descriptionKo,
    );
    const normal = art(r.id),
      enhanced = art(`${r.id}+`);
    for (const picture of [normal, enhanced]) {
      assert.ok(!/NaN|undefined|Infinity/.test(picture), r.id);
      assert.ok(picture.includes(`data-water-place="${r.id}"`), r.id);
      assert.ok(picture.includes(`data-water-shape="${visual.shape}"`), r.id);
      assert.equal(
        (picture.match(new RegExp(`data-landmark-life="${r.id}"`, 'g')) ?? [])
          .length,
        1,
      );
    }
    const structure = group(
      normal,
      '<g class="expanded-landmark" data-water-place=',
    );
    assert.ok(structure?.length > 300, `${r.id}: authored structure`);
    assert.ok(
      normalize(enhanced).includes(normalize(structure)),
      `${r.id}: fusion retains the complete structure`,
    );
    remember(
      pictures,
      hash(normalize(structure).replace(/data-water-place="[^"]+"/g, '')),
      r.id,
    );
    const life = group(normal, '<g class="landmark-life catalog-scene"');
    assert.ok(life && life.includes('scene-motion'), `${r.id}: animated scene`);
    remember(
      scenes,
      hash(life.replace(/data-landmark-life="[^"]+"/g, '')),
      r.id,
    );
    for (const id of [r.id, `${r.id}+`]) {
      assert.equal(placementType(id), surface);
      assert.equal(canPlaceLandmark(state, id, 1599), surface === 'sea');
      assert.equal(canPlaceLandmark(river, id, 0), surface === 'river');
      assert.equal(
        canPlaceLandmark(state, id, 0),
        true,
        'legacy land placement remains compatible',
      );
    }
    const themed = decorations.filter((d) => d.landmark === r.id);
    assert.equal(themed.length, 2);
    assert.equal(themed.filter((d) => d.gift).length, 1);
    assert.ok(themed.every((d) => d.surface === surface));
    assert.ok(
      decorations.some(
        (d) => d.id === `${r.id}-plus-star` && d.landmark === `${r.id}+`,
      ),
      `${r.id}: fusion monument`,
    );
  }
  assert.equal(
    pictures.size,
    100,
    `unique geometry: ${JSON.stringify([...pictures.values()].filter((ids) => ids.length > 1))}`,
  );
  assert.equal(
    scenes.size,
    100,
    `unique scene composition: ${JSON.stringify([...scenes.values()].filter((ids) => ids.length > 1))}`,
  );
  console.log(
    'PASS: all 600 original records/translations retained; 700 places; sea72/river91/coastal33/land504; 100 unique structures/scenes and normal/+ placement/gift contracts',
  );
}
