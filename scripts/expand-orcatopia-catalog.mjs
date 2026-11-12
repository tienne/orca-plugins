import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = 'plugins/landmark-island/src/';
const rows = (await readFile('scripts/data/orcatopia-expansion.tsv', 'utf8'))
  .trim()
  .split('\n')
  .map((line) => line.split('|'));
const heritage = JSON.parse(
  await readFile('scripts/data/orcatopia-heritage-200.json', 'utf8'),
);
const existing = JSON.parse(
  await readFile(root + 'landmarks.json', 'utf8'),
).slice(0, 100);
const legacyHash = (
  await readFile('scripts/data/orcatopia-legacy100.sha256', 'utf8')
).trim();
if (
  createHash('sha256').update(JSON.stringify(existing)).digest('hex') !==
  legacyHash
)
  throw new Error(
    'The original 100 catalog records changed; review them before regenerating.',
  );
const korean = JSON.parse(await readFile(root + 'landmarks.ko.json', 'utf8'));
const iso3 = Object.fromEntries(
  'AR:ARG BD:BGD BE:BEL BR:BRA BW:BWA CA:CAN CL:CHL CN:CHN DE:DEU EG:EGY ES:ESP ET:ETH FR:FRA GB:GBR GR:GRC IN:IND IQ:IRQ IR:IRN IT:ITA JP:JPN KR:KOR LA:LAO MA:MAR MM:MMR MX:MEX PE:PER PT:PRT TH:THA TN:TUN TR:TUR TZ:TZA US:USA ZA:ZAF ZM:ZMB'
    .split(' ')
    .map((s) => s.split(':')),
);
const en = new Intl.DisplayNames('en', { type: 'region' }),
  ko = new Intl.DisplayNames('ko', { type: 'region' });
const regions = {
  'Europe and North America': '유럽·북아메리카',
  'Asia and the Pacific': '아시아·태평양',
  'Latin America and the Caribbean': '라틴아메리카·카리브해',
  Africa: '아프리카',
  'Arab States': '아랍 지역',
};
const tiers = { C: 'common', R: 'rare', E: 'epic', L: 'legendary' };
const palettes = [
  '#b69772',
  '#c4ac88',
  '#aeb9a0',
  '#bc8b70',
  '#8baba4',
  '#d3b17c',
  '#b7a28c',
  '#829b8a',
  '#bca6a0',
];
const description =
  'Its distinctive forms are shown here as a small illustrated landmark; the map uses a representative point for the UNESCO property or one of its components.';
const descriptionKo =
  '장소의 특징을 작은 그림으로 표현했으며, 지도에는 유네스코 유산이나 해당 구성 요소의 대표 위치를 표시합니다.';
if (rows.length !== 200 || heritage.length !== 200)
  throw new Error('Expected 200 curated landmarks');
const expansion = rows.map(
  ([id, query, name, nameKo, shape, feature, featureKo, tier], index) => {
    const source = heritage[index];
    if (!source || !iso3[source.country] || !tiers[tier])
      throw new Error(`Incomplete metadata: ${id}`);
    const countryCode = iso3[source.country];
    const original = existing.find((entry) => entry.code === countryCode);
    const country = original?.country ?? en.of(source.country);
    const countryKo = original
      ? korean[original.id].country
      : ko.of(source.country);
    const record = {
      id,
      name,
      country,
      code: countryCode,
      tier: tiers[tier],
      lat: source.lat,
      lon: source.lon,
      source: `https://whc.unesco.org/en/list/${source.site}/`,
      region: source.region,
      description: `${feature}. ${description}`,
      descriptionSourceName: 'UNESCO World Heritage Centre',
      descriptionSource: `https://whc.unesco.org/en/list/${source.site}/`,
    };
    korean[id] = {
      name: nameKo,
      country: countryKo,
      region: regions[source.region] ?? source.region,
      description: `${featureKo}. ${descriptionKo}`,
      descriptionSourceName: '유네스코 세계유산센터',
    };
    return {
      record,
      visual: {
        id,
        name,
        nameKo,
        shape,
        feature,
        featureKo,
        seed: index + 1,
        color: palettes[index % palettes.length],
      },
    };
  },
);
const catalog = [...existing, ...expansion.map((e) => e.record)];
if (new Set(catalog.map((e) => e.id)).size !== 300)
  throw new Error('Duplicate catalog ID');
await writeFile(
  root + 'landmarks.json',
  JSON.stringify(catalog, null, 2) + '\n',
);
await writeFile(
  root + 'landmarks.ko.json',
  JSON.stringify(korean, null, 2) + '\n',
);
await writeFile(
  root + 'landmark-expansion.json',
  JSON.stringify(
    expansion.map((e) => e.visual),
    null,
    2,
  ) + '\n',
);
console.log(
  JSON.stringify({
    landmarks: catalog.length,
    countries: new Set(catalog.map((e) => e.code)).size,
    tiers: Object.fromEntries(
      Object.keys(tiers).map((k) => [
        tiers[k],
        catalog.filter((e) => e.tier === tiers[k]).length,
      ]),
    ),
  }),
);
