# Orcatopia 0.1.0 release preparation

English · [한국어](orcatopia-release.ko.md)

This is an unpublished local candidate. Preparing it does not approve execution,
change a user's island, publish a tag or establish a directory listing.

## Package and product

- Display name: Orcatopia; internal ID: `landmark-island`; minimum Orca: 1.4.248.
- 67 landmarks across 64 catalog countries; 35 Discovery, 22 Treasure, 7 Marvel,
  3 Wonder. Tier probabilities remain 70/23/6/1 percent.
- 142 decorations and up to 318 land tiles; movement, camera follow, canvas
  placement, independent floor/object layers and bilingual inventory search.
- Worktree-created tickets, single/ten-ticket draws, new-discovery animation at
  every tier and a skip checkbox. No purchases, guaranteed rare drops or pity.
- Device-clock daylight, hourly timezone-reference weather, local save and file
  backup/restore. English/Korean follow Orca's locale.
- Trusted Node worker with `workspace:read` and `storage:own`; no new grants.
- Manifest icon, cover and screenshot use bundled original art and an English
  browser DEMO garden. The Korean introduction remains in the Korean README.
  No font files, user save data or runtime artwork downloads are packaged.

## Weather release condition

The proposed first release is free and non-commercial, without advertising,
subscriptions or paid features. Keep the existing hourly Open-Meteo integration
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

Read-only GitHub audit on 2026-11-08 found no deployment environments. Configure
`release-preview` and protected `production` before automated publication.
The API returned HTTP 403 for runners and `ORCA_RELEASE_ENABLED`, so their actual
configuration remains unverified. No GitHub settings were changed.

The latest observed hosted CI passed at source
`2bb2565378f6886043741d560ad66c6056ba8c0c`; it is not this worktree's release check.
[Observed run](https://github.com/tienne/orca-plugins/actions/runs/42431209389).
No new hosted run was dispatched and this source has not been pushed or merged.

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

Both artifacts passed `pnpm validate`. Orcatopia is 15 files / 3,830,546 bytes, with no font files. `plugin inspect` reports the same two capabilities and trusted-worker execution; no execution approval was granted. `plugin check` passed validation but returned no rendered panel scenarios for this HTML panel, so it is not native interaction evidence.
