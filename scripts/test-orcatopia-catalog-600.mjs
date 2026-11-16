import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

export async function testCatalog600({
  landmarks,
  decorations,
  art,
  translate,
  placementType,
  canPlaceLandmark,
  empty,
}) {
  const read = async (path) => JSON.parse(await readFile(path, 'utf8'));
  const profiles = await read('plugins/orcatopia/src/catalog-600.json');
  const sources = await read('scripts/data/orcatopia-heritage-294.json');
  const korean = await read('plugins/orcatopia/src/landmarks.ko.json');
  const terrainState = empty();
  terrainState.receipts = landmarks.slice(0, 25).map((entry, i) => ({
    workspaceId: `terrain-${i}`,
    landmark: entry.id,
    at: '2026-11-15',
  }));
  terrainState.tickets = terrainState.receipts.map(({ workspaceId, at }) => ({
    workspaceId,
    at,
  }));
  const riverState = structuredClone(terrainState);
  riverState.floors = [{ decoration: 'river', cell: 0 }];
  assert.equal(
    createHash('sha256')
      .update(
        JSON.stringify(
          Object.fromEntries(
            landmarks
              .slice(0, 306)
              .map((entry) => [entry.id, korean[entry.id]]),
          ),
        ),
      )
      .digest('hex'),
    (
      await readFile('scripts/data/orcatopia-legacy306-ko.sha256', 'utf8')
    ).trim(),
  );
  assert.equal(profiles.length, 294);
  assert.equal(sources.length, 294);
  assert.equal(new Set(sources.map((source) => source.site)).size, 294);
  assert.equal(
    new Set(
      sources.map((source) =>
        source.officialName.normalize('NFKC').toLowerCase(),
      ),
    ).size,
    294,
  );
  assert.equal(
    new Set(
      landmarks
        .slice(0, 600)
        .map((entry) => entry.name.normalize('NFKC').toLowerCase()),
    ).size,
    600,
  );
  const priorSources = new Set(
    landmarks
      .slice(0, 306)
      .map((entry) => /\/list\/(\d+)/.exec(entry.descriptionSource)?.[1])
      .filter(Boolean),
  );
  for (const [index, profile] of profiles.entries()) {
    const entry = landmarks[index + 306];
    const source = sources[index];
    assert.equal(entry.id, profile.id);
    assert.equal(source.id, profile.id);
    assert.ok(
      !priorSources.has(source.site),
      `${entry.id}: UNESCO property already represented`,
    );
    assert.match(entry.code, /^[A-Z]{3}$/);
    assert.equal(
      entry.descriptionSource,
      `https://whc.unesco.org/en/list/${source.site}/`,
    );
    assert.equal(entry.lat, source.lat);
    assert.equal(entry.lon, source.lon);
    assert.match(source.descriptionSha256, /^[a-f0-9]{64}$/);
    assert.ok(
      source.officialName &&
        source.recordApi.startsWith('https://data.unesco.org/'),
    );
    assert.equal(placementType(entry.id), profile.placement);
    assert.ok(['land', 'river', 'sea', 'coastal'].includes(profile.placement));
    assert.equal(placementType(`${entry.id}+`), profile.placement);
    for (const id of [entry.id, `${entry.id}+`]) {
      assert.equal(
        canPlaceLandmark(terrainState, id, 0),
        true,
        `${id}: retain land compatibility`,
      );
      assert.equal(
        canPlaceLandmark(terrainState, id, 1599),
        ['sea', 'coastal'].includes(profile.placement),
        `${id}: sea boundary`,
      );
      assert.equal(
        canPlaceLandmark(riverState, id, 0),
        profile.placement === 'river',
        `${id}: river boundary`,
      );
    }
    assert.notEqual(translate(entry.name, 'ko-KR'), entry.name);
    assert.notEqual(korean[entry.id].description, entry.description);
    const picture = art(entry.id);
    assert.ok(!/NaN|undefined|Infinity/.test(picture), entry.id);
    assert.ok(
      picture.includes(`data-place-detail="${profile.detail}"`),
      entry.id,
    );
    assert.equal(
      (picture.match(new RegExp(`data-landmark-life="${entry.id}"`, 'g')) ?? [])
        .length,
      1,
    );
    const themed = decorations.filter((d) => d.landmark === entry.id);
    assert.equal(themed.length, 2);
    assert.equal(themed.filter((d) => d.gift).length, 1);
    for (const d of themed)
      assert.equal(
        d.surface,
        profile.placement === 'land'
          ? undefined
          : profile.placement === 'river'
            ? 'river'
            : 'sea',
      );
  }
  assert.equal(
    decorations.filter((d) => d.shape === 'starMonument').length,
    landmarks.length,
  );
  assert.equal(decorations.filter((d) => d.surface).length, 392);
  assert.equal(
    decorations.filter((d) => d.gift && d.shape !== 'starMonument').length,
    713,
  );
  assert.equal(decorations.filter((d) => !d.landmark).length, 9);
  const baseline = await read(
    'scripts/data/orcatopia-legacy306-art.sha256.json',
  );
  for (const [id, hash] of Object.entries(baseline))
    assert.equal(
      createHash('sha256')
        .update(art(id).replace(/landmark-art-\d+/g, 'landmark-art-instance'))
        .digest('hex'),
      hash,
      `${id}: unchanged original art and scene`,
    );
  console.log(
    'PASS: 294 sourced, localized, explicitly classified additions; 600-place wave retained; 700 star monuments and 392 water decorations; original 306 complete art+scene hashes',
  );
}
