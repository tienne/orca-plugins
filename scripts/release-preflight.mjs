import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { readFile, writeFile, appendFile } from 'node:fs/promises';
import {
  auditReleaseSetup,
  requireReviewedHash,
} from './release/readiness.mjs';

try {
  const { values } = parseArgs({
    options: {
      plugin: { type: 'string' },
      mode: { type: 'string', default: 'preview' },
      workflow: { type: 'boolean', default: false },
      report: { type: 'string' },
    },
  });
  if (!['git-logs', 'landmark-island', 'jira-tasks'].includes(values.plugin))
    throw new Error('Unsupported release plugin.');
  const manifest = JSON.parse(
    await readFile(
      `plugins/${values.plugin === 'landmark-island' ? 'orcatopia' : values.plugin}/orca-plugin.json`,
      'utf8',
    ),
  );
  const version = process.env.RELEASE_VERSION || manifest.version;
  if (
    !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version) ||
    version !== manifest.version
  )
    throw new Error(
      'Requested stable version must match the committed manifest.',
    );
  if (
    values.workflow &&
    (process.env.GITHUB_EVENT_NAME !== 'workflow_dispatch' ||
      process.env.GITHUB_REF !== 'refs/heads/main' ||
      process.env.GITHUB_REPOSITORY !== 'tienne/orca-plugins')
  )
    throw new Error(
      'Workflow release checks require a manual main run in tienne/orca-plugins.',
    );
  if (values.workflow && values.mode === 'publish')
    requireReviewedHash(
      { contentHash: process.env.RELEASE_EXPECTED_HASH },
      process.env.RELEASE_EXPECTED_HASH,
    );
  const request = async (path) => {
    try {
      return JSON.parse(
        execFileSync(
          'gh',
          ['api', '--method', 'GET', '--hostname', 'github.com', path],
          {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'pipe'],
            timeout: 20_000,
            maxBuffer: 4 * 1024 * 1024,
          },
        ),
      );
    } catch (cause) {
      const error = new Error('GitHub configuration unavailable.');
      error.status =
        Number(/HTTP (\d{3})/.exec(String(cause.stderr))?.[1]) || undefined;
      throw error;
    }
  };
  const result = {
    plugin: values.plugin,
    version,
    checkedAt: new Date().toISOString(),
    ...(await auditReleaseSetup({
      request,
      mode: values.mode,
      enabled: values.workflow
        ? (process.env.ORCA_RELEASE_ENABLED ?? '')
        : undefined,
    })),
  };
  const json = JSON.stringify(result, null, 2) + '\n';
  console.log(json);
  if (values.report) await writeFile(values.report, json, { flag: 'wx' });
  if (process.env.GITHUB_STEP_SUMMARY)
    await appendFile(
      process.env.GITHUB_STEP_SUMMARY,
      `\n## Release setup: ${result.ready ? 'ready' : 'not ready'}\n\n${result.checks.map((c) => `- ${c.status}: ${c.id} — ${c.detail}`).join('\n')}\n\nRunner: ${result.runner}. No self-hosted registration is required; this setup audit does not verify hosted runner availability.\n`,
    );
  if (!result.ready) process.exitCode = 2;
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
