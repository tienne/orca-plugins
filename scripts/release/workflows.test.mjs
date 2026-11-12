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
  const commands = Object.values(checks.jobs)
    .flatMap((job) => job.steps)
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
  assert.ok(commands.includes('nx run landmark-island:ui-test'));
  assert.equal(checks.jobs['orcatopia-ui'].needs, 'check');
});

test('release defaults to read-only preview and gates hosted promotion on trusted manual main runs', async () => {
  const release = await load('release'),
    promote = await load('promote');
  assert.deepEqual(Object.keys(release.on), ['workflow_dispatch']);
  assert.equal(release.on.workflow_dispatch.inputs.publish.default, false);
  assert.equal(release.jobs.preview.permissions.contents, 'read');
  assert.equal(release.jobs.publish.permissions.contents, 'write');
  assert.equal(release.concurrency['cancel-in-progress'], false);
  const job = promote.jobs.promote;
  assert.equal(job['runs-on'], 'macos-15');
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

test('configuration preflight precedes builds and protected promotion, with hash checked at publish', async () => {
  const release = await load('release');
  const promote = await load('promote');
  assert.equal(release.jobs.preflight['runs-on'], 'ubuntu-latest');
  assert.equal(release.jobs.preflight.permissions.actions, 'read');
  assert.equal(release.jobs.preflight.permissions.contents, 'read');
  assert.equal(release.jobs.checks.needs, 'preflight');
  for (const name of ['preview', 'publish']) {
    assert.equal(release.jobs[name].needs, 'checks');
    assert.equal(release.jobs[name].permissions.actions, 'read');
  }
  assert.equal(release.on.workflow_dispatch.inputs.expected_hash.default, '');
  assert.equal(
    release.jobs.publish.with.expected_hash,
    '${{ inputs.expected_hash }}',
  );
  assert.equal(
    promote.jobs.promote.env.RELEASE_EXPECTED_HASH,
    '${{ inputs.expected_hash }}',
  );
  assert.equal(
    promote.jobs.promote.environment,
    "${{ inputs.publish && 'production' || 'release-preview' }}",
  );
  const steps = promote.jobs.promote.steps;
  const recheck = steps.findIndex(
    (s) => s.name === 'Recheck release configuration',
  );
  const publish = steps.findIndex(
    (s) => s.name === 'Publish branch and source tag',
  );
  assert.ok(recheck >= 0 && recheck < publish);
  assert.ok(steps[recheck].run.includes(':release-preflight'));
  for (const step of release.jobs.preflight.steps)
    assert.ok(!step.run?.includes('${{ inputs.'));
});

test('both plugins are checked and selectable, with Git Logs still the release default', async () => {
  const checks = await load('checks');
  const commands = checks.jobs.check.steps
    .map((step) => step.run || '')
    .join('\n');
  for (const plugin of ['git-logs', 'landmark-island']) {
    assert.ok(commands.includes(`-p ${plugin} --output-style=static`));
    const upload = checks.jobs.check.steps.find(
      (step) => step.with?.name === `${plugin}-\${{ github.sha }}`,
    );
    assert.equal(upload.with.path, `dist/plugins/${plugin}/`);
  }
  const release = await load('release');
  const selector = release.on.workflow_dispatch.inputs.plugin;
  assert.equal(selector.default, 'git-logs');
  assert.deepEqual(selector.options, ['git-logs', 'landmark-island']);
  for (const name of ['preview', 'publish'])
    assert.equal(release.jobs[name].with.plugin, '${{ inputs.plugin }}');
  const promote = await load('promote');
  assert.equal(promote.on.workflow_call.inputs.plugin.default, 'git-logs');
  assert.equal(promote.jobs.promote.env.RELEASE_PLUGIN, '${{ inputs.plugin }}');
  assert.ok(
    promote.jobs.promote.steps.some((step) =>
      step.run?.includes("['git-logs', 'landmark-island'].includes(plugin)"),
    ),
  );
});

test('promotion installs the pinned CLI before validation without launching the app', async () => {
  const {
    jobs: { promote: job },
  } = await load('promote');
  const setup = job.steps.findIndex(
    (step) => step.name === 'Prepare pinned Orca CLI',
  );
  const validate = job.steps.findIndex(
    (step) => step.name === 'Verify Orca CLI and run release integration tests',
  );
  assert.ok(setup >= 0 && setup < validate);
  assert.equal(job.env.ORCA_CLI_COMMAND, undefined);
  assert.ok(job.steps[validate].run.includes('"$ORCA_CLI_COMMAND" --version'));
  const script = await readFile('scripts/release/setup-orca-macos.sh', 'utf8');
  assert.ok(
    script.indexOf('shasum -a 256 --check') < script.indexOf('ditto -x -k'),
  );
  assert.match(script, /orca_version='1\.4\.252'/);
  assert.match(script, /orca_sha256='[a-f0-9]{64}'/);
  assert.ok(script.includes('actual_version'));
  assert.ok(script.includes('>> "$GITHUB_ENV"'));
  assert.ok(!script.includes('open -a'));
  assert.ok(!script.includes('plugin enable'));
});
