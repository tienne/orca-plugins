// Read-only GitHub setup audit. Missing access is never treated as readiness.
export const RELEASE_REPOSITORY = 'tienne/orca-plugins';

export function requireReviewedHash(plan, expected) {
  if (!/^[a-f0-9]{64}$/.test(expected ?? ''))
    throw new Error(
      'Publishing requires the 64-character content hash from a reviewed preview.',
    );
  if (plan.contentHash !== expected)
    throw new Error(
      'Candidate differs from the reviewed content hash. Run and review a new preview.',
    );
}

export async function auditReleaseSetup({
  request,
  mode = 'preview',
  enabled,
}) {
  if (!['preview', 'publish'].includes(mode))
    throw new Error('Unknown release mode.');
  const checks = [];
  const record = (id, status, detail) => checks.push({ id, status, detail });
  const read = async (path, id) => {
    try {
      const value = await request(`repos/${RELEASE_REPOSITORY}/${path}`);
      if (!value || typeof value !== 'object' || Array.isArray(value))
        throw new Error('Unexpected response.');
      return value;
    } catch (error) {
      record(
        id,
        error.status === 404 ? 'fail' : 'unknown',
        error.status === 404
          ? 'Not configured or not visible to this token.'
          : `Cannot verify GitHub configuration${error.status ? ` (HTTP ${error.status})` : ''}.`,
      );
      return null;
    }
  };
  const list = async (path, field, id) => {
    const values = [];
    for (let page = 1; page <= 10; page++) {
      const data = await read(`${path}?per_page=100&page=${page}`, id);
      if (!data) return null;
      if (
        !Array.isArray(data[field]) ||
        !Number.isInteger(data.total_count) ||
        data.total_count < 0
      ) {
        record(id, 'unknown', 'Unexpected paginated GitHub response.');
        return null;
      }
      values.push(...data[field]);
      if (values.length >= data.total_count) return values;
      if (!data[field].length) break;
    }
    record(id, 'unknown', 'Could not inspect the complete GitHub list.');
    return null;
  };
  if (enabled === undefined) {
    const variable = await read(
      'actions/variables/ORCA_RELEASE_ENABLED',
      'enabled',
    );
    if (variable) enabled = variable.value;
  }
  if (enabled !== undefined)
    record(
      'enabled',
      enabled === 'true' ? 'pass' : 'fail',
      'Repository variable ORCA_RELEASE_ENABLED must equal true.',
    );
  else if (!checks.some((c) => c.id === 'enabled'))
    record('enabled', 'unknown', 'Release activation could not be verified.');

  for (const name of mode === 'publish'
    ? ['release-preview', 'production']
    : ['release-preview']) {
    const environment = await read(`environments/${name}`, name);
    if (!environment) continue;
    const policy = environment.deployment_branch_policy;
    if (
      policy?.custom_branch_policies !== true ||
      policy.protected_branches !== false
    ) {
      record(
        `${name}:branches`,
        'fail',
        'Select only the main branch in deployment branch rules.',
      );
    } else {
      const policies = await list(
        `environments/${name}/deployment-branch-policies`,
        'branch_policies',
        `${name}:branches`,
      );
      if (policies)
        record(
          `${name}:branches`,
          policies.length === 1 &&
            policies[0].name === 'main' &&
            (policies[0].type ?? 'branch') === 'branch'
            ? 'pass'
            : 'fail',
          'Only the exact main branch may deploy; no tag or wildcard rules.',
        );
    }
    if (name === 'production') {
      const reviewers = Array.isArray(environment.protection_rules)
        ? environment.protection_rules.find(
            (r) => r?.type === 'required_reviewers',
          )?.reviewers
        : undefined;
      record(
        'production:reviewers',
        Array.isArray(reviewers) && reviewers.length > 0 ? 'pass' : 'fail',
        'Production requires at least one configured reviewer.',
      );
    }
  }
  return {
    repository: RELEASE_REPOSITORY,
    mode,
    ready: checks.every((c) => c.status === 'pass'),
    runner: 'github-hosted macos-15 (arm64)',
    checks,
  };
}
