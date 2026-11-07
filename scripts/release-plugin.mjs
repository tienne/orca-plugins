import { parseArgs } from 'node:util';
import { resolve } from 'node:path';
import { readFile, writeFile, lstat } from 'node:fs/promises';
import { prepareRelease, publishRelease } from './release/plugin-release.mjs';

const { values } = parseArgs({
  options: {
    plugin: { type: 'string' },
    source: { type: 'string', default: process.env.RELEASE_SOURCE || '.' },
    repository: { type: 'string', default: process.env.RELEASE_REPOSITORY },
    version: { type: 'string', default: process.env.RELEASE_VERSION },
    'source-sha': { type: 'string', default: process.env.RELEASE_SOURCE_SHA },
    report: { type: 'string', default: process.env.RELEASE_REPORT },
    plan: { type: 'string', default: process.env.RELEASE_PLAN },
    publish: { type: 'boolean', default: false },
  },
});
try {
  const source = resolve(values.source);
  if (values.publish) {
    if (!values.plan)
      throw new Error(
        'Publishing requires --publish --plan <prepared JSON> and optional --source only.',
      );
    const plan = JSON.parse(await readFile(resolve(values.plan), 'utf8'));
    if (values.plugin && values.plugin !== (plan.plugin ?? 'git-logs'))
      throw new Error('Requested plugin differs from the prepared plan.');
    await publishRelease(plan, { source });
    console.log(
      JSON.stringify({
        published: true,
        version: plan.version,
        commit: plan.catalogCommit,
        tag: plan.tag,
      }),
    );
  } else {
    if (
      !values.repository ||
      !values.version ||
      !values['source-sha'] ||
      !values.report ||
      values.plan
    )
      throw new Error(
        'Preparation requires --repository <https GitHub URL.git> --version <x.y.z> --source-sha <full SHA> --report <new file>.',
      );
    const report = resolve(values.report);
    try {
      await lstat(report);
      throw new Error('Report already exists; choose a new report file.');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    const plan = await prepareRelease({
      source,
      repository: values.repository,
      version: values.version,
      sourceCommit: values['source-sha'],
      plugin: values.plugin,
    });
    await writeFile(report, `${JSON.stringify(plan, null, 2)}\n`, {
      flag: 'wx',
    });
    for (const [suffix, file] of [
      ['catalog', 'orca-catalog.json'],
      ['provenance', 'release-provenance.json'],
    ]) {
      await writeFile(
        report + '.' + suffix + '.json',
        await readFile(resolve(plan.directory, file)),
        { flag: 'wx' },
      );
    }
    console.log(JSON.stringify({ published: false, report, ...plan }, null, 2));
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
