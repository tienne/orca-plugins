import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { auditReleaseSetup, requireReviewedHash } from './readiness.mjs';

function fixture(overrides = {}) {
  const environment = {
    deployment_branch_policy: {
      custom_branch_policies: true,
      protected_branches: false,
    },
    protection_rules: [
      {
        type: 'required_reviewers',
        reviewers: [{ type: 'User', reviewer: { id: 1 } }],
      },
    ],
  };
  const responses = {
    'actions/variables/ORCA_RELEASE_ENABLED': { value: 'true' },
    'environments/release-preview': environment,
    'environments/production': environment,
    'environments/release-preview/deployment-branch-policies?per_page=100&page=1':
      { total_count: 1, branch_policies: [{ name: 'main', type: 'branch' }] },
    'environments/production/deployment-branch-policies?per_page=100&page=1': {
      total_count: 1,
      branch_policies: [{ name: 'main', type: 'branch' }],
    },
    ...overrides,
  };
  const calls = [];
  return {
    calls,
    request: async (path) => {
      const key = path.replace('repos/tienne/orca-plugins/', '');
      calls.push(key);
      assert.ok(Object.hasOwn(responses, key), `Unexpected API: ${key}`);
      if (responses[key] instanceof Error) throw responses[key];
      return responses[key];
    },
  };
}

test('readiness requires enabled variable, main-only environments, production reviewers without registering a runner', async () => {
  const f = fixture();
  const result = await auditReleaseSetup({ ...f, mode: 'publish' });
  assert.equal(result.ready, true);
  assert.equal(result.checks.length, 4);
  assert.ok(!f.calls.some((path) => path.startsWith('actions/runners')));
  assert.ok(f.calls.every((path) => !path.includes('secrets')));
});

for (const status of [403, 404])
  test(`unavailable GitHub configuration fails closed (HTTP ${status})`, async () => {
    const result = await auditReleaseSetup({
      ...fixture({
        'environments/release-preview': Object.assign(new Error(), { status }),
      }),
    });
    assert.equal(result.ready, false);
    assert.equal(
      result.checks.find((c) => c.id === 'release-preview').status,
      status === 403 ? 'unknown' : 'fail',
    );
  });

test('malformed API response cannot count as readiness', async () => {
  const result = await auditReleaseSetup(
    fixture({ 'environments/release-preview': null }),
  );
  assert.equal(result.ready, false);
});

for (const value of ['', 'false', 'TRUE'])
  test(`activation value ${JSON.stringify(value)} blocks release`, async () => {
    assert.equal(
      (await auditReleaseSetup({ ...fixture(), enabled: value })).ready,
      false,
    );
  });

for (const policies of [
  [{ name: '*', type: 'branch' }],
  [{ name: 'main', type: 'tag' }],
  [
    { name: 'main', type: 'branch' },
    { name: 'dev', type: 'branch' },
  ],
  [],
])
  test(`unsafe deployment rules rejected: ${JSON.stringify(policies)}`, async () => {
    const result = await auditReleaseSetup(
      fixture({
        'environments/release-preview/deployment-branch-policies?per_page=100&page=1':
          { total_count: policies.length, branch_policies: policies },
      }),
    );
    assert.equal(result.ready, false);
  });

test('publish requires configured production reviewers; preview does not access production', async () => {
  const f = fixture({
    'environments/production': {
      deployment_branch_policy: {
        custom_branch_policies: true,
        protected_branches: false,
      },
      protection_rules: [],
    },
  });
  assert.equal((await auditReleaseSetup(f)).ready, true);
  assert.ok(!f.calls.includes('environments/production'));
  assert.equal(
    (await auditReleaseSetup({ ...f, mode: 'publish' })).ready,
    false,
  );
});

test('workflow uses provided activation and does not need runner administration access', async () => {
  const f = fixture();
  const result = await auditReleaseSetup({
    ...f,
    enabled: 'true',
  });
  assert.equal(result.ready, true);
  assert.equal(result.runner, 'github-hosted macos-15 (arm64)');
  assert.ok(!f.calls.some((path) => path.startsWith('actions/')));
});

test('all pages are inspected before allowing branch policy', async () => {
  const result = await auditReleaseSetup(
    fixture({
      'environments/release-preview/deployment-branch-policies?per_page=100&page=1':
        { total_count: 2, branch_policies: [{ name: 'main', type: 'branch' }] },
      'environments/release-preview/deployment-branch-policies?per_page=100&page=2':
        { total_count: 2, branch_policies: [{ name: '*', type: 'branch' }] },
    }),
  );
  assert.equal(result.ready, false);
});

test('unknown mode rejected', async () => {
  await assert.rejects(
    auditReleaseSetup({ ...fixture(), mode: 'deploy' }),
    /Unknown release mode/,
  );
});

test('publishing requires the exact reviewed package hash', () => {
  const plan = { contentHash: 'a'.repeat(64) };
  for (const expected of [undefined, '', 'a', 'g'.repeat(64)])
    assert.throws(
      () => requireReviewedHash(plan, expected),
      /reviewed preview/,
    );
  assert.throws(() => requireReviewedHash(plan, 'b'.repeat(64)), /differs/);
  assert.doesNotThrow(() => requireReviewedHash(plan, plan.contentHash));
});

test('CLI rejects missing or changed reviewed hash before inspecting or publishing candidate', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'release-hash-guard-'));
  try {
    const plan = join(dir, 'plan.json');
    await writeFile(plan, JSON.stringify({ contentHash: 'a'.repeat(64) }));
    for (const expected of ['', 'b'.repeat(64)]) {
      const result = spawnSync(
        process.execPath,
        [
          'scripts/release-plugin.mjs',
          '--publish',
          '--plan',
          plan,
          '--expected-hash',
          expected,
        ],
        { encoding: 'utf8' },
      );
      assert.equal(result.status, 1);
      assert.match(result.stderr, /reviewed preview|differs from the reviewed/);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
