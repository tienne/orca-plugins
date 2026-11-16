import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const root = 'plugins/orcatopia/src/';
const read = async (path) => JSON.parse(await readFile(path, 'utf8'));
const write = (path, value) =>
  writeFile(path, JSON.stringify(value, null, 2) + '\n');
const rows = (await readFile('scripts/data/orcatopia-600.tsv', 'utf8'))
  .trim()
  .split('\n')
  .map((line) => line.split('|'));
const sources = await read('scripts/data/orcatopia-heritage-294.json');
const profiles = new Map(
  (await readFile('scripts/data/orcatopia-600-profiles.tsv', 'utf8'))
    .trim()
    .split('\n')
    .map((line) => {
      const [id, heights, detail] = line.split('|');
      return [id, { heights: heights.split(',').map(Number), detail }];
    }),
);
const catalog = (await read(root + 'landmarks.json')).slice(0, 306);
const korean = await read(root + 'landmarks.ko.json');
const legacyKorean = Object.fromEntries(
  catalog.map((entry) => [entry.id, korean[entry.id]]),
);
if (
  createHash('sha256').update(JSON.stringify(legacyKorean)).digest('hex') !==
  (await readFile('scripts/data/orcatopia-legacy306-ko.sha256', 'utf8')).trim()
)
  throw new Error(
    'The original Korean descriptions changed; review before regeneration.',
  );
const visuals = (await read(root + 'landmark-expansion.json')).slice(0, 206);
const legacyHash = (
  await readFile('scripts/data/orcatopia-legacy306.sha256', 'utf8')
).trim();
if (
  createHash('sha256').update(JSON.stringify(catalog)).digest('hex') !==
  legacyHash
)
  throw new Error(
    'The original 306 places changed; review the snapshot before regeneration.',
  );
if (
  rows.length !== 294 ||
  sources.length !== 294 ||
  visuals.length !== 206 ||
  profiles.size !== 294
)
  throw new Error(
    'Expected 294 curated additions and 206 existing expanded illustrations.',
  );

const iso3 = Object.fromEntries(
  'AE:ARE AF:AFG AG:ATG AL:ALB AM:ARM AT:AUT AU:AUS AZ:AZE BA:BIH BB:BRB BD:BGD BF:BFA BG:BGR BH:BHR BJ:BEN BO:BOL BR:BRA BY:BLR CA:CAN CD:COD CG:COG CH:CHE CI:CIV CL:CHL CM:CMR CN:CHN CO:COL CR:CRI CU:CUB CY:CYP CZ:CZE DE:DEU DK:DNK DM:DMA DO:DOM DZ:DZA EC:ECU ER:ERI ES:ESP ET:ETH FI:FIN FJ:FJI FR:FRA GB:GBR GE:GEO GH:GHA GR:GRC GT:GTM HN:HND HR:HRV HU:HUN ID:IDN IE:IRL IN:IND IR:IRN IS:ISL IT:ITA JO:JOR JP:JPN KE:KEN KG:KGZ KH:KHM KR:KOR KZ:KAZ LB:LBN LC:LCA LK:LKA LT:LTU LV:LVA ME:MNE MG:MDG ML:MLI MN:MNG MR:MRT MU:MUS MW:MWI MX:MEX MY:MYS MZ:MOZ NA:NAM NE:NER NG:NGA NO:NOR NP:NPL NZ:NZL OM:OMN PA:PAN PE:PER PG:PNG PH:PHL PK:PAK PL:POL PT:PRT QA:QAT RO:ROU RS:SRB SA:SAU SB:SLB SC:SYC SD:SDN SI:SVN SK:SVK SN:SEN SR:SUR TD:TCD TJ:TJK TM:TKM TN:TUN TR:TUR TZ:TZA UA:UKR UG:UGA US:USA UY:URY UZ:UZB VE:VEN VN:VNM VU:VUT ZA:ZAF ZW:ZWE'
    .split(' ')
    .map((pair) => pair.split(':')),
);
const en = new Intl.DisplayNames('en', { type: 'region' });
const ko = new Intl.DisplayNames('ko', { type: 'region' });
const regions = {
  'Europe and North America': '유럽·북아메리카',
  'Asia and the Pacific': '아시아·태평양',
  'Latin America and the Caribbean': '라틴아메리카·카리브해',
  Africa: '아프리카',
  'Arab States': '아랍 지역',
};
const tiers = { C: 'common', R: 'rare', E: 'epic', L: 'legendary' };
const colors = [
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
const usedSites = new Set(
  catalog
    .map((l) => /\/list\/(\d+)/.exec(l.descriptionSource)?.[1])
    .filter(Boolean),
);
const additions = rows.map(
  (
    [id, site, name, nameKo, shape, placement, tier, feature, featureKo],
    index,
  ) => {
    const source = sources[index];
    if (
      !/^[a-z][a-z0-9]*$/.test(id) ||
      !['land', 'river', 'sea', 'coastal'].includes(placement) ||
      !name ||
      !nameKo ||
      !shape ||
      !feature ||
      !featureKo
    )
      throw new Error(`Incomplete curated place: ${id}`);
    if (
      source?.id !== id ||
      source.site !== site ||
      !iso3[source.country] ||
      !tiers[tier] ||
      usedSites.has(site)
    )
      throw new Error(`Invalid or duplicate UNESCO property: ${id}`);
    usedSites.add(site);
    const code = iso3[source.country];
    const prior = catalog.find((l) => l.code === code);
    const country = prior?.country ?? en.of(source.country);
    const countryKo = prior ? korean[prior.id].country : ko.of(source.country);
    const url = `https://whc.unesco.org/en/list/${site}/`;
    const record = {
      id,
      name,
      country,
      code,
      tier: tiers[tier],
      lat: source.lat,
      lon: source.lon,
      source: url,
      region: source.region,
      description: `${feature}. The illustration is a miniature interpretation; the map marks a representative point of the UNESCO property or one of its components.`,
      descriptionSourceName: 'UNESCO World Heritage Centre',
      descriptionSource: url,
    };
    korean[id] = {
      name: nameKo,
      country: countryKo,
      region: regions[source.region],
      description: `${featureKo}. 그림은 장소를 작게 재해석한 것이며, 지도에는 유네스코 유산이나 해당 구성 요소의 대표 위치를 표시합니다.`,
      descriptionSourceName: '유네스코 세계유산센터',
    };
    const visual = {
      id,
      name,
      nameKo,
      shape,
      feature,
      featureKo,
      seed: 207 + index,
      color: colors[index % colors.length],
    };
    const profile = profiles.get(id);
    if (
      !profile ||
      profile.heights.length !== 5 ||
      profile.heights.some((n) => !Number.isInteger(n) || n < 0 || n > 110)
    )
      throw new Error(`Missing illustrated profile: ${id}`);
    return { record, visual, placement, ...profile };
  },
);
if (
  new Set([...catalog, ...additions.map((a) => a.record)].map((l) => l.id))
    .size !== 600
)
  throw new Error('Duplicate place ID');
await write(root + 'landmarks.json', [
  ...catalog,
  ...additions.map((a) => a.record),
]);
await write(root + 'landmarks.ko.json', korean);
await write(root + 'landmark-expansion.json', [
  ...visuals,
  ...additions.map((a) => a.visual),
]);
await write(
  root + 'catalog-600.json',
  additions.map(({ visual, placement, heights, detail }) => ({
    id: visual.id,
    placement,
    heights,
    detail,
  })),
);
console.log(
  JSON.stringify({
    count: 600,
    additions: additions.length,
    countries: new Set(
      [...catalog, ...additions.map((a) => a.record)].map((l) => l.code),
    ).size,
    tiers: Object.fromEntries(
      Object.values(tiers).map((t) => [
        t,
        [...catalog, ...additions.map((a) => a.record)].filter(
          (l) => l.tier === t,
        ).length,
      ]),
    ),
  }),
);
// 앞선 확장을 재생성해도 이후 추가한 수상 도감이 사라지지 않도록 연결한다.
await import('./sync-orcatopia-water-700.mjs');
