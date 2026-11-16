import { build } from 'esbuild';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const temp = await mkdtemp(join(tmpdir(), 'orcatopia-catalog-'));
try {
  await build({
    entryPoints: [
      'plugins/orcatopia/src/placement.ts',
      'plugins/orcatopia/src/game.ts',
    ],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outdir: temp,
    outExtension: { '.js': '.mjs' },
  });
  const { placementType } = await import(
    pathToFileURL(join(temp, 'placement.mjs'))
  );
  const { draw, empty, collectionTheme } = await import(
    pathToFileURL(join(temp, 'game.mjs'))
  );
  const catalog = JSON.parse(
    await readFile('plugins/orcatopia/src/landmarks.json', 'utf8'),
  );
  const tiers = ['common', 'rare', 'epic', 'legendary'];
  const weights = [70, 23, 6, 1];
  const counts = (pool) =>
    Object.fromEntries(
      tiers.map((tier) => [tier, pool.filter((l) => l.tier === tier).length]),
    );
  let seed = 6257;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const simulate = (pool) => {
    const buckets = tiers.map((tier) => pool.filter((l) => l.tier === tier));
    if (buckets.some((bucket) => !bucket.length))
      throw Error('Simulation requires all four tier pools');
    const sums = [0, 0];
    for (let run = 0; run < 100_000; run++) {
      const unique = new Set();
      let draws = 0,
        reachedTwelve = false;
      while (unique.size < 25) {
        const roll = random() * 100;
        const bucket =
          buckets[roll < 70 ? 0 : roll < 93 ? 1 : roll < 99 ? 2 : 3];
        unique.add(bucket[Math.floor(random() * bucket.length)].id);
        draws++;
        if (unique.size === 12 && !reachedTwelve) {
          reachedTwelve = true;
          sums[0] += draws;
        }
      }
      sums[1] += draws;
    }
    return {
      pool: pool.length,
      meanDrawsTo12: sums[0] / 100_000,
      meanDrawsTo25: sums[1] / 100_000,
    };
  };
  const simulateActual = (firstRiver) => {
    seed = 6257;
    const runs = 10_000;
    const sums = [0, 0];
    for (let run = 0; run < runs; run++) {
      const state = empty();
      const unique = new Set();
      let draws = 0;
      let reachedTwelve = false;
      while (unique.size < 25) {
        const id = draw(random, state);
        unique.add(id);
        state.discoveredPlaces = [...unique];
        draws++;
        if (unique.size === 12 && !reachedTwelve) {
          sums[0] += draws;
          reachedTwelve = true;
          if (firstRiver) {
            unique.add(draw(random, state, 'river'));
            state.discoveredPlaces = [...unique];
            draws++;
          }
        }
      }
      sums[1] += draws;
    }
    return {
      runs,
      seed: 6257,
      firstRiver,
      meanTicketsTo12: sums[0] / runs,
      meanTicketsTo25: sums[1] / runs,
    };
  };
  const baselineScenarios = [
    simulate(catalog.slice(0, 306)),
    simulate(catalog),
    simulate(catalog.filter((l) => placementType(l.id) === 'land')),
  ];
  const tierCounts = counts(catalog);
  console.log(
    JSON.stringify(
      {
        normal: catalog.length,
        enhanced: catalog.length,
        countries: new Set(catalog.map((l) => l.code)).size,
        addedCountries:
          new Set(catalog.map((l) => l.code)).size -
          new Set(catalog.slice(0, 306).map((l) => l.code)).size,
        tiers: tierCounts,
        additionTiers: counts(catalog.slice(306)),
        placement: Object.fromEntries(
          ['land', 'river', 'sea', 'coastal'].map((type) => [
            type,
            counts(catalog.filter((l) => placementType(l.id) === type)),
          ]),
        ),
        additionPlacement: Object.fromEntries(
          ['land', 'river', 'sea', 'coastal'].map((type) => [
            type,
            catalog.slice(306).filter((l) => placementType(l.id) === type)
              .length,
          ]),
        ),
        individualChancePercent: Object.fromEntries(
          tiers.map((tier, i) => [tier, weights[i] / tierCounts[tier]]),
        ),
        simulation: {
          runs: 100_000,
          seed: 6257,
          note: 'Independent fixed-pool baselines; actualDraw uses the integrated draw function with river/sea thresholds 12/25 and coastal classified as sea.',
          actualDraw: [simulateActual(false), simulateActual(true)],
          themeTiers: Object.fromEntries(
            ['land', 'river', 'sea'].map((theme) => [
              theme,
              counts(catalog.filter((l) => collectionTheme(l.id) === theme)),
            ]),
          ),
          scenarios: baselineScenarios,
        },
      },
      null,
      2,
    ),
  );
} finally {
  await rm(temp, { recursive: true, force: true });
}
