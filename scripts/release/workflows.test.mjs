import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';
const load = async (name) =>
  parse(await readFile(`.github/workflows/${name}.yml`, 'utf8'));

test('CI uses hosted runners for pull requests and runs all required Nx checks', async () => {
  const ci = await load('ci'),
    checks = await load('checks');
  assert.ok('pull_request' in ci.on);
  assert.ok(!('pull_request_target' in ci.on));
  assert.equal(ci.permissions.contents, 'read');
  assert.equal(checks.jobs.check['runs-on'], 'ubuntu-latest');
  const commands = checks.jobs.check.steps
    .map((step) => step.run || '')
    .join('\n');
  for (const target of [
    'build',
    'typecheck',
    'test',
    'release-test',
    'ui-test',
  ])
    assert.ok(commands.includes(target));
  assert.ok(commands.includes('playwright install --with-deps chromium'));
});

test('release defaults to read-only preview and gates the self-hosted runner on trusted manual main runs', async () => {
  const release = await load('release'),
    promote = await load('promote');
  assert.deepEqual(Object.keys(release.on), ['workflow_dispatch']);
  assert.equal(release.on.workflow_dispatch.inputs.publish.default, false);
  assert.equal(release.jobs.preview.permissions.contents, 'read');
  assert.equal(release.jobs.publish.permissions.contents, 'write');
  assert.equal(release.concurrency['cancel-in-progress'], false);
  const job = promote.jobs.promote;
  assert.deepEqual(job['runs-on'], ['self-hosted', 'macOS', 'orca-release']);
  for (const guard of [
    'workflow_dispatch',
    'refs/heads/main',
    'tienne/orca-plugins',
    'ORCA_RELEASE_ENABLED',
  ])
    assert.ok(job.if.includes(guard));
  const publish = job.steps.find(
    (step) => step.name === 'Publish branch and source tag',
  );
  assert.equal(publish.if, 'inputs.publish');
  for (const step of job.steps)
    assert.ok(
      !step.run?.includes('${{ inputs.'),
      'Inputs must reach shell steps through environment variables.',
    );
});

test('external actions are pinned to commit hashes', async () => {
  for (const name of ['ci', 'checks', 'release', 'promote']) {
    const workflow = await load(name);
    for (const job of Object.values(workflow.jobs)) {
      for (const step of job.steps ?? []) {
        if (step.uses && !step.uses.startsWith('./'))
          assert.match(step.uses, /@[a-f0-9]{40}$/);
      }
    }
  }
});
