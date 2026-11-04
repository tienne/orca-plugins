import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
const dir = await mkdtemp(join(tmpdir(), 'git-logs-tests-'));
try {
  const suites = ['worker/git', 'i18n/messages'];
  const outfiles = suites.map((suite) =>
    join(dir, suite.replace('/', '-') + '.test.mjs'),
  );
  await Promise.all(
    suites.map((suite, index) =>
      build({
        entryPoints: [`plugins/git-logs/src/${suite}.test.ts`],
        outfile: outfiles[index],
        bundle: true,
        platform: 'node',
        format: 'esm',
        target: 'node22',
      }),
    ),
  );
  const result = spawnSync(
    process.execPath,
    ['--test', ...outfiles, 'scripts/validate-plugin-artifact.test.mjs'],
    {
      stdio: 'inherit',
    },
  );
  process.exitCode = result.status ?? 1;
} finally {
  await rm(dir, { recursive: true, force: true });
}
