# Git branches and releases

English · [한국어](releases.ko.md)

Source lives on `main`. The `release` branch contains installable plugin files and the catalog. The catalog in the source branch stays an empty template. GitHub Actions builds a candidate first; pushing it is a separate, explicit choice.

Source is public at [tienne/orca-plugins](https://github.com/tienne/orca-plugins). The release runner and protected environments still need configuration for automated publication. Orca supports a publishing ref and directory; this branch split is our repository convention, not an Orca requirement.

## Branches and versioning

| Ref                  | Contents                                                          |
| -------------------- | ----------------------------------------------------------------- |
| `main`               | Source, documentation, tests, and workflows                       |
| `feat/*`, `fix/*`    | Changes reviewed before merging into `main`                       |
| `release`            | Built plugins, `orca-catalog.json`, and `release-provenance.json` |
| `directory/git-logs` | Git Logs bundle at the repository root for directory discovery    |
| `git-logs/vX.Y.Z`    | Immutable tag on the source commit used for that version          |
| `vX.Y.Z`             | Tag on the root bundle commit used by the public directory        |

Do not edit generated files on `release`. Fix the source and publish a newer version. The first release candidate starts an orphan history; later candidates retain that history and other plugin directories. There is no merge from `release` back into `main`.

Only stable `X.Y.Z` versions are supported. Update `plugins/git-logs/orca-plugin.json` and the plugin's `package.json` before merging. A published version cannot be reused or downgraded. The catalog retains previous releases; after 32 releases the script stops so compatibility can be reviewed before pruning.

## CI

`ci.yml` calls `checks.yml` for pull requests to `main`, pushes to `main`, and manual checks. All checks run on GitHub-hosted Ubuntu with read-only repository access:

- actionlint checks workflow syntax and expressions. Its version and download checksum are pinned.
- pnpm installs the lockfile dependencies with Node 24.
- Nx runs build, typecheck, Git/translation/artifact tests, release tests, and browser UI tests.
- Playwright uses Chromium and starts a fresh preview server in CI.
- Successful runs save the installable plugin for 14 days. Browser results are retained for 7 days, including on failure.

Hosted release tests use a mock Orca adapter for orchestration checks. They do not establish Orca schema or hash compatibility. The promotion job repeats the tests with the installed Orca CLI.

## Configure GitHub once

These steps require the repository owner's action after publishing the source repository.

1. Use the intended repository, `tienne/orca-plugins`, and merge the reviewed source into `main`.
2. Protect `main` and require the CI check from the first workflow run. Restrict updates to `release` to release maintainers or the workflow. Allow the release actor to push directly; source-branch PR and CI requirements must not block generated release commits.
3. Register a dedicated, preferably ephemeral macOS runner with labels `self-hosted`, `macOS`, and `orca-release`. Install the tested Orca desktop CLI, Git, and a supported Node environment; `orca --version` must work. The workflow sets up Node 24 and pnpm.
4. Create `release-preview` and `production` environments. Restrict deployment branches to `main`. Configure required reviewers for `production` before enabling publication. The workflow references environments but **does not create their protection rules**.
5. Permit the workflow's `GITHUB_TOKEN` to write repository contents for the publish job. Preview receives read access only. No personal access token is required for this same-repository layout.
6. Set the repository Actions variable `ORCA_RELEASE_ENABLED=true` after the runner and environments are ready.

The self-hosted runner runs only for manually dispatched `main` workflows in `tienne/orca-plugins` with the enable variable set. Pull requests never use it. Do not register a personal development machine as this runner; it executes trusted repository code and publication credentials are available in the publish job. An ephemeral runner also removes candidate directories after each job.

Pin the runner's Orca version to a tested build. It must support `plugin validate` and `plugin release-entry`; 1.4.248 was used for local verification. Neither command loads or approves plugin code.

## Preview a release

In GitHub Actions, run **Release Git Logs** from `main`:

- `version`: the stable version already committed to the manifest, such as `0.1.0`.
- `publish`: leave unchecked, which is the default.

The workflow reruns CI, downloads the artifact from that same run and source SHA, and uses the macOS runner to prepare a candidate. It checks that the artifact matches the source manifest and runs Orca validation.

The candidate contains two commits:

1. Built files in `plugins/git-logs/` and source provenance.
2. The catalog entry generated by Orca, pointing to the **first commit** and its `contentHash`.

The job summary records the source, artifact, catalog commits, and content hash. The `release-plan-<SHA>` artifact includes the plan, candidate catalog, and provenance. Preview does not push any refs.

## Publish

Review the preview, then run **Release Git Logs** again from `main` with the same version and `publish` checked. This is a new run: it rebuilds and revalidates, rather than reusing the previous candidate's temporary directory. Check its source SHA and content hash. The `production` environment applies the reviewer rules configured above.

The script checks the source checkout, candidate history, artifact bytes, Orca hash, catalog, provenance, destination URL, existing version tag, and current remote refs. It also compares committed blobs with the validated files, including catalog and provenance, to catch Git clean-filter changes. It then pushes the `release` branch and the source tag in one atomic Git operation.

The artifact commit must extend the previous release tip, and the catalog commit must immediately follow it. An exact-base server lease rejects release changes or deletion between preflight and push. The script does not allow history rewrites; the lease is used only after proving that parent relationship. Tags are never overwritten. Named-remote push URLs are ignored by pushing the verified repository URL explicitly; push-only URL rewrite rules are rejected.

The source SHA is fixed when the workflow starts. If `main` has already changed at publication preflight, the run stops. An independent `main` advance after that check does not change the artifact, tag, or provenance: the release still uses the reviewed source snapshot. The workflow does not lock or update `main`.

A failed push must not be force-retried. Fetch the new release state and prepare another candidate. There is no automatic rollback or redeployment of an old version; ship a newer source version with the fix.

## Run locally without publishing

Commit source changes and build first. Preparation requires a clean source checkout. Fetch the current `release` branch into `refs/remotes/origin/release` when it exists. A missing local release ref is treated as a first-release candidate; publication still checks the actual remote and refuses an unexpected existing branch.

```sh
pnpm nx run git-logs:build

RELEASE_REPOSITORY=https://github.com/tienne/orca-plugins.git \
RELEASE_VERSION=0.1.0 \
RELEASE_SOURCE_SHA="$(git rev-parse HEAD)" \
RELEASE_REPORT=/tmp/git-logs-release-plan.json \
pnpm nx run git-logs:release-prepare
```

Choose a new report filename each time. The command validates locally and copies Git objects into a separate temporary repository; it does not contact network remotes, push, change source branches, or approve a plugin. It prints the candidate directory. Inspect it and remove it when finished. Keep the report and candidate together if publication will be performed later on the same machine.

`release-publish` is a separate target and writes remote refs. It requires `RELEASE_PLAN` pointing to the reviewed plan, a matching HTTPS GitHub origin, and the unchanged source checkout. Use it only when publication is authorized. It is not part of CI or preview.

Run the release tests with:

```sh
pnpm nx run git-logs:release-test
ORCA_RELEASE_INTEGRATION=1 ORCA_CLI_COMMAND=orca pnpm nx run git-logs:release-test
```

Tests push only to temporary local bare repositories. The second command uses the real installed Orca validator and release hash generator. On Linux use the Orca desktop CLI name `orca-ide`, not the unrelated GNOME `orca` executable.

## Installation and directory listing

Users add the Git URL of `tienne/orca-plugins` and ref `release` under Orca **Settings → Plugins → ⋯ → Catalog sources…**. The catalog installs only `plugins/git-logs` as `tienne.git-logs`. Users do not build the source or need pnpm. Git Logs still requires execution approval on installation.

The automated release workflow publishes the custom catalog. Public-directory discovery uses a separate root export on `directory/git-logs`, tagged `vX.Y.Z`. The `git-logs/vX.Y.Z` tag continues to identify the source commit; do not move it. The repository's `orca-plugin` topic enables discovery. See the [directory status page](https://www.onorca.dev/plugins/tienne/orca-plugins) for indexing results; publishing the tag does not prove it is searchable yet.

### Publish a directory export

1. Start from the immutable artifact commit pinned by the published catalog. Export only `plugins/git-logs/` to the root of a separate Git checkout. Keep the installable files unchanged; provenance belongs in the commit message rather than extra package files.
2. Run `orca plugin validate`, `orca plugin check`, and `orca plugin release-entry` on the exported root. Compare the resulting content hash with the existing catalog release and compare every committed blob with the validated package bytes.
3. Publish `directory/git-logs` and its new `vX.Y.Z` tag atomically without rewriting existing refs. Later exports must extend the directory branch. The generic `vX.Y.Z` tags in this repository are reserved for Git Logs.
4. Check the public status page. The directory indexes on its own schedule; do not report search availability before the listing appears.

For 0.1.0, the directory tag points to `d957b8a6bbff132cac1b4e60e80d5bd518dd1a2e`, exported from artifact `c06f01b7c62909b4f8752e1e91a2f182b3dfd97e`. Both contain the same 18 files and Orca content hash `4e4723bf66e38ecee3807d05257019cd025074f6432921e6b70c41f26be14f41`. The root export passed local validation; the directory's own indexing result is tracked on its status page. Directory exports are currently a manual step and are not included in `Release Git Logs`.

References: [Orca authoring](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-authoring.md#5-publish-to-a-catalog), [catalog fields](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-catalog.md), [public directory](https://www.onorca.dev/plugins/add).
