import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const root = 'plugins/orcatopia/src/';
const read = async (path) => JSON.parse(await readFile(path, 'utf8'));
const catalog = await read(root + 'catalog-700.json');
const records = (await read(root + 'landmarks.json')).slice(0, 600);
const korean = await read(root + 'landmarks.ko.json');
const baseline = await read('scripts/data/orcatopia-legacy600.sha256.json');
const hash = (value) =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex');
assert.equal(
  hash(records),
  baseline.records,
  'preserve the existing catalog before synchronizing',
);
assert.equal(
  hash(Object.fromEntries(records.map((e) => [e.id, korean[e.id]]))),
  baseline.korean,
  'preserve existing translations',
);
assert.equal(catalog.length, 100);
assert.equal(
  new Set([...records.map((e) => e.id), ...catalog.map((e) => e.record.id)])
    .size,
  700,
);
for (const { record, korean: translated } of catalog)
  korean[record.id] = translated;
await writeFile(
  root + 'landmarks.json',
  JSON.stringify([...records, ...catalog.map((e) => e.record)], null, 2) + '\n',
);
await writeFile(
  root + 'landmarks.ko.json',
  JSON.stringify(korean, null, 2) + '\n',
);
