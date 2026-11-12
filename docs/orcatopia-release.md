# Orcatopia release preparation

English · [한국어](orcatopia-release.ko.md)

## 0.3.0 fusion candidate (2026-11-13)

This candidate adds 300 fusion-only + variants and 300 exclusive star monuments, taking the decoration catalog to 908. Normal draw weights and tier assignments are unchanged. Schema v6 preserves historical discovery rewards and records idempotent fusion operations; v1–v5 migrate when read. The minimum host and requested capabilities remain unchanged from 0.2.0. Game/worker tests cover save failure, response loss, concurrent requests, restart replay, placement protection, migration and backup conservation. Fusion browser tests cover English/Korean, narrow screens, reduced motion and placement. Full UI, ship review and publication evidence must be recorded for the final source commit before release. A full Orca application restart remains deferred by the user's earlier instruction; do not quit their app to test this release.

## 0.2.0 candidate (2026-11-12)

The existing custom catalog has published 0.1.0. The next release is 0.2.0,
under the same `tienne.landmark-island` identity, `release` ref and
`plugins/landmark-island` path, with source tag `landmark-island/v0.2.0`.
Existing releases and the Git Logs subtree must remain intact.

The candidate has 300 landmarks across 101 catalog country groupings,
153 Discovery / 115 Treasure / 24 Marvel / 8 Wonder entries, 608 garden pieces
and the existing maximum 1,044 land tiles. It adds individual landmark scenes,
tier effects, residents and wildlife, and an agent expedition camp. Existing
landmark IDs, original tier assignments and collection saves are preserved.
Journal animations pause outside the visible scroll area.

The trusted worker now requests `agent:read` in addition to `workspace:read`
and `storage:own`, and subscribes to `agent.status.changed`. The local development
identity was explicitly approved and reloaded. That approval does not grant
execution to the catalog identity or to another user's installation. The catalog
update must disclose the added access and follow the host's approval result.

Local checks passed: full UI coverage of 125 tests before the journal optimization,
six scoped tests after it, build, typecheck, game/worker tests, package validation
and the installed host compatibility check. These do not establish final-identity
clean installation, full Orca restart or update persistence. Those native release
checks remain pending. The previous PR CI reached the shared job's 20-minute limit;
the next run has a 45-minute budget and must pass for the final source commit.

The sections below record the earlier 0.1.0 preparation and its historical checks.
They are not verification evidence for 0.2.0.

## Current distribution and native checkpoint (2026-11-12)

The existing community installation resolves through Orca's community mirror to
[`tienne/orcatopia`](https://github.com/tienne/orcatopia). Its root package and
`vX.Y.Z` tags are the update path for that installation. Update this existing
repository as well as the optional custom catalog; do not assume the monorepo
catalog alone updates community installs. Generic tags in `tienne/orca-plugins`
remain reserved for Git Logs.

With explicit user approval, candidate `a3fcce5` was installed as
`tienne.landmark-island` 0.2.0 after a private backup. Orca refused changing a
community install directly to a Git source. Its supported removal step also
removed the plugin storage directory, so the saved original bytes were restored
before installing the candidate. The collection matched the backup immediately
after installation. Later progress has been separately backed up and must not be
replaced with the older pre-update backup. Restorable backup export was also
validated through the worker against a read-only copy of the store.

The real panel rendered the 300-entry catalog, existing island, residents and
observed expedition records without capture errors. This is panel-render and
storage evidence, not proof that every native interaction passed. The user
explicitly deferred a full Orca application restart; do not quit the app for this
release. Candidate-source installation is temporary: restore the community update
route only when it offers 0.2.0 or newer, preserving the latest store during any
required reinstall. Never downgrade a save containing new landmark IDs to 0.1.0.

The first CI attempt passed 111 of 126 UI tests and timed out in 15. The next
run passed 119 of 131 in 40.2 minutes: all exhaustive descriptions, artwork and
scene checks passed, while 12 long gameplay scenarios exhausted their total
30/60-second budgets. CI now distributes all 131 tests across three independent
machines, retaining one browser worker each. CI gameplay budgets are 120 seconds,
or 180 seconds for the multi-country flows; assertion waits remain unchanged.
Every shard must pass before promotion. The new remote result is still required.

Candidate `79d1ffe` updated the existing 0.2.0 installation without an application
restart or new grants. The native panel captured without errors and earlier state
was retained, with only newly issued tickets added at the comparison checkpoint.
The user confirmed playing the 20 new acquisitions and three new placements.
Latest raw and restorable backups are private and separate from the pre-update
backup. This is user-tested native draw/placement evidence, not a full restart test.

## Historical 0.1.0 preparation

This is an unpublished local candidate. Preparing it does not approve execution,
change a user's island, publish a tag or establish a directory listing.

## Package and product

- Display name: Orcatopia; internal ID: `landmark-island`; minimum Orca: 1.4.248.
- 100 landmarks across 97 catalog countries; 56 Discovery, 32 Treasure, 9 Marvel,
  3 Wonder. Tier probabilities remain 70/23/6/1 percent.
- 208 decorations and up to 1,044 land tiles; movement, camera follow, canvas
  placement, independent floor/object layers and bilingual inventory search.
  Click a landmark for Move and two-facing rotation; select Move, then a destination.
  Save schema v5 preserves landmark facing and migrates earlier saves.
- Worktree-created tickets, single/ten-ticket draws, new-discovery animation at
  every tier, a skip checkbox, distinct new/duplicate results and repeat 1/10 draws
  with insufficient-ticket controls. No purchases, guaranteed rare drops or pity.
- Device-clock daylight, hourly timezone-reference weather, local save and file
  backup/restore. English/Korean follow Orca's locale.
- Trusted Node worker with `workspace:read` and `storage:own`; no new grants.
- Manifest icon, cover and screenshot use bundled original art and an English
  browser DEMO garden. The Korean introduction remains in the Korean README.
  No font files, user save data or runtime artwork downloads are packaged.

## Weather release condition

The user confirmed a free, non-commercial first release on 2026-11-08, without advertising,
subscriptions or paid features. This operating decision is kept in the release checklist, not used as product marketing copy. Keep the existing hourly Open-Meteo integration
under that condition. Free software is not automatically non-commercial in every
deployment; commercial use must satisfy the provider's separate service terms.
Do not embed a shared paid API key in the downloadable plugin. A commercial
distribution needs its own credential/operating design before publication.

The worker sends only reference coordinates and forecast parameters; normal
network metadata also reaches Open-Meteo. Data is attributed in the UI and the
bundled notice, including its adaptation to four artistic weather types.
Cache and failure cooldown persist for an hour. Provider quotas can still apply
across users or shared IPs; the client cache is not a global quota system.
Manual and simulated weather remain usable without a weather response.

References: [provider terms and privacy](https://open-meteo.com/en/terms),
[bundled notice](../plugins/landmark-island/licenses/weather.txt).

## Distribution route

Prepare the first release for the existing `tienne/orca-plugins` custom catalog,
ref `release`, path `plugins/landmark-island`. The identity will be
`tienne.landmark-island`, with source tag `landmark-island/v0.1.0`.
Preserve every existing Git Logs file, release entry and generic `vX.Y.Z` tag.

Public search is a separate step. The [directory](https://www.onorca.dev/plugins/add)
requires a public repository with a root manifest and a `vX.Y.Z` tag. If a separate
listing is wanted, use a separate tienne-owned repository containing the exact
validated root package and public source/provenance. Keep ID `landmark-island`;
do not reuse this repository's Git Logs directory tags. No new repository, topic,
tag or listing has been created. Recheck directory policy and repository identity
when that publication is authorized; a source-repository change can require
execution approval even when the plugin ID stays the same.

## Native installation and save transfer — pending

These steps are a manual release gate. Native clicks remain deferred by request.
Use an isolated profile where possible and never replace a real island as a test.

1. In `local.landmark-island`, export a backup and keep a separate copy. Record
   tickets, unique/total landmarks, materials, placements and land count locally.
   Backups can contain workspace identifiers; do not attach them to public issues.
2. Disable the old development identity before using the release identity so both
   do not independently receive new worktree events.
3. Install the reviewed candidate under its final identity. Review its separate
   trusted-worker approval; prior approval does not transfer. A clean install
   should not grant tickets for existing worktrees.
4. Restore the backup through the existing preview and confirmation. Check all
   recorded counts and positions. A restore replaces data rather than merging it.
5. Fully quit and reopen Orca. Confirm the same save, one ticket for one newly
   created test worktree, safe single/ten-ticket draws, placement, backup save
   dialog, English/Korean and light/dark controls. Check weather after resume.
6. Test an update with the same final identity and verify unchanged save contents.
   Keep the original file and pre-restore recovery copy until these checks pass.

Worker and browser fixtures cover migration, corrupt backups, stale restore
previews, failed writes and retries; they do not replace this host verification.

## CI and candidate checks

On 2026-11-08, configured `release-preview` and `production` with an exact
`main` deployment branch rule. Production requires review by repository owner
`tienne`; preview needs no deployment review. The owner may approve their own
manually dispatched production run. No production run or approval was performed.
The default GitHub account was not switched. Promotion uses GitHub-hosted
`macos-15` with a pinned Orca CLI; no self-hosted runner registration is needed.
The activation variable will be enabled after the reviewed workflow reaches `main`.

The prepared automation now checks setup before CI, defaults to preview and
requires the reviewed preview content hash for publication. It rechecks environment
rules before publishing. Run `pnpm nx run landmark-island:release-preflight --mode=publish`
to inspect setup without changing GitHub. Follow the [release procedure](releases.md)
to configure the environments and run a hosted preview from the reviewed `main` source.
Source integration is tracked in [PR #5](https://github.com/tienne/orca-plugins/pull/5).

Automation verification on 2026-11-08 passed 41 release/setup/workflow tests with
the mock validator and another 41 with the installed Orca CLI. Pinned actionlint
1.7.11 and formatting checks passed. Publication tests used disposable local bare
repositories. The real read-only setup audit correctly reported not ready.

After switching promotion to hosted macOS, all 41 tests passed again with the
mock adapter and the freshly downloaded, checksum-verified Orca 1.4.252 CLI.
The same setup script used by CI extracted the CLI into a temporary directory;
standalone package validation also passed with network access denied. Actionlint
1.7.11 and shell syntax checks passed. This was local verification, not a hosted
GitHub run. No runner service was installed on the developer's Mac.

Check [CI](https://github.com/tienne/orca-plugins/actions/workflows/ci.yml) and
[release previews](https://github.com/tienne/orca-plugins/actions/workflows/release.yml)
for the exact source SHA being considered. A successful run on an older source
does not validate a newer candidate. A preview is not a publication.

Use the [existing preparation commands](releases.md#orcatopia-candidates) after
committing and building. Refresh the release base, generate a new candidate,
validate its package and catalog, and compare the retained Git Logs subtree and
catalog history against that base. Keep the report's source commit, artifact
commit and content hash together. Any source/package/base change invalidates it.

## Reproducible browser measurements

`ORCATOPIA_PROFILE=1 pnpm nx run landmark-island:ui-test --grep='Orcatopia showcase'`
captures the full-size garden and writes
`test-results/landmark-island/idle-profile.json`. It samples three 30-second
animated idle windows and one reduced-motion window, with garbage-collected heap
measurements before/after and a save-integrity check. It reports renderer main
thread occupancy, not whole-process/GPU CPU or native Orca memory. A two-minute
fixture measurement does not establish long-running leak freedom or low-end
device performance. Keep native/background/sleep endurance checks pending.

## Local verification on 2026-11-08

Build, typecheck and worker/state tests passed. The earlier full browser checkpoint
passed 82 scenarios; the changed showcase and optional 120-second profile passed
again against the packaged UI. Release orchestration/workflow tests passed all
22 cases with the installed Orca 1.4.252 CLI and disposable local repositories.
No user repository was pushed.

The visible garden had 318 tiles, 5 placed landmarks and 118 decorations. Its
25 running animations used 0.095–0.153% renderer main-thread time during the three
30-second idle windows; reduced motion stopped all 25 animations. Post-GC JS heap
was 6,207,356 bytes before and 6,207,900 bytes after. Saved progress stayed identical.
These are local headless measurements, not total CPU, GPU, native memory or proof
of long-term leak freedom. The observed +544-byte heap difference is diagnostic.

Both artifacts passed `pnpm validate`. At that checkpoint Orcatopia was 15 files / 3,830,546 bytes, with no font files. `plugin inspect` reports the same two capabilities and trusted-worker execution; no execution approval was granted. `plugin check` passed validation but returned no rendered panel scenarios for this HTML panel, so it is not native interaction evidence.

## Release audit on 2026-11-09 (KST)

The current local release scope includes 100 landmarks, 208 decorations, up to
1,044 land tiles, landmark action menus and facing persistence, the treasure
choice menu, distinct new/duplicate results and repeat draws. Existing marketing
images show an earlier sample garden, not the current maximum island; the manifest
caption describes sample progress accordingly.

The read-only publish preflight passed with the existing `tienne` credential,
without changing the active GitHub account. `ORCA_RELEASE_ENABLED=true`, exact
`main` environment branch rules and production reviewers were verified. The active
`wad-kwonyunhak` credential could not read the variable (HTTP 403); that was an
access limitation, not evidence that deployment was disabled.

Remote `main` was `2808d878e46d5a73e3071e64cc68aade443973cc`. Its latest successful
publication was Git Logs 0.2.0, not Orcatopia. The remote catalog contained only
Git Logs and no `landmark-island/v0.1.0` tag existed. Preserve that latest release
base when preparing Orcatopia. The local candidate still needs source integration
and hosted checks/preview on the resulting exact main commit before publication.
Native installation, restart and update verification remains pending as above.

The current [directory instructions](https://www.onorca.dev/plugins/add) and
[listing policy](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-listing-policy.md)
were rechecked. Custom-catalog publication does not itself establish public search
availability. No push, main merge, production deployment or execution approval was
performed during this audit.

Current-source local verification passed build, typecheck, worker/state tests,
all 93 browser scenarios and all 41 release/setup/workflow tests (mock adapter).
The installed Orca validator accepted the built package. These results do not
represent a hosted preview or the deferred native installation checks.
