# Git Logs development

English · [한국어](development.ko.md)

This guide records the host integration, Git behavior, and release requirements for Git Logs. For everyday use, read the [plugin guide](../plugins/git-logs/README.md). Commands below run from the repository root.

The source tree contains read-only additions planned for 0.2.0: tag badges, log filters, infinite scroll over paged history, two-commit comparison, file history, and keyboard navigation. The manifest version is still 0.1.1 and 0.2.0 is unreleased. The additions do not change `prepare`/`execute`, `operations.ts`, or the manifest's capabilities, minimum Orca version, or execution profile.

## Build and verify

Use Node.js 22.12+ or 24+, pnpm 10, Git, and the Orca CLI.

```sh
pnpm install
pnpm nx run-many -t build typecheck test ui-test -p git-logs
pnpm validate
```

`build` bundles React, Monaco, the editor worker, SVG icons, the Git worker, and dependency licenses into `dist/plugins/git-logs`. The source manifest points to packaged entries; run Orca validation against that output directory. The installed plugin must not depend on sibling packages or a `node_modules` symlink.

`test` runs Git cases in temporary repositories, translation checks, and artifact checks. `ui-test` exercises the packaged UI in a browser. Use [screenshot instructions](screenshots/README.md) to generate the English demo images.

Run the targets separately when you need one result:

```sh
pnpm nx run git-logs:test      # Git/worker, translation, and artifact checks
pnpm nx run git-logs:ui-test   # browser tests against the packaged UI and fixtures
pnpm validate                  # Orca validation of the built artifact
```

Outside CI, `ui-test` reuses a server that is already listening on port 4173. If an older preview server is running there, the tests can exercise a stale build and report misleading results. Stop it before running `ui-test`.

Browser tests use Google Chrome. For Chromium, run `pnpm exec playwright install chromium`, then set `PW_CHANNEL=chromium`. `preview` serves the build at `http://127.0.0.1:4173`; `pnpm dev` starts source development with hot reload. Without an Orca bridge, `?fixture=<name>` selects a demo state. The paging and comparison scenarios are `paged`, `stale`, `many`, `rename`, and `unrelated`. `src/ui/fixture.ts` imports the page size and load limit from `protocol.ts`, so there are no copies to keep in sync.

## Code layout

| Path                               | Responsibility                                                                                  |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| `plugins/git-logs/src/ui`          | Graph, file list, Monaco diff, menus, themes, and browser fixtures                              |
| `plugins/git-logs/src/ui/hooks`    | Panel state split from `main.tsx`: repository, filters, paging, comparison, keyboard navigation |
| `plugins/git-logs/src/worker`      | Git reads and actions, path checks, comparison documents, and host calls                        |
| `plugins/git-logs/src/protocol.ts` | UI/worker messages and the narrow Orca API types used by the plugin                             |
| `plugins/git-logs/src/i18n`        | English and Korean strings, locale selection, and translation tests                             |
| `scripts/build-plugin.mjs`         | Bundling and artifact checks                                                                    |
| `plugins/git-logs/showcase`        | English demo capture scenarios                                                                  |

The browser UI has no direct Node, filesystem, or Git access. It calls the same plugin's worker through `plugin.request`. The worker runs Git with argument arrays and validates repository boundaries, paths, and refs. Do not add shell command concatenation.

## Orca integration

The minimum supported host is Orca 1.4.248. Public documentation on `main` can describe newer behavior; check the installed CLI's version-matched guide, field `Since` versions, and validator before using another API.

The plugin declares `trusted-worker`, `workspace:read`, and `workspace:write`. A trusted worker runs as the signed-in operating system user, not inside the UI sandbox. The workspace grants do not restrict all filesystem access available to Node.

`workspace:read` supplies context, workspace lists, and workspace change events. `workspace:write` is used for `workspace.open` and `editor.open`. The grant also permits built-in commands, but Git Logs does not call those commands.

Check `host.has`, API major/minor, and method presence before use. Worker requests require API 1.2; workspace listing and central editor opening require API 1.3. Check `document.session` separately. Unsupported hosts receive an error instead of an assumed API call.

The installed type generator failed because a bundled declaration resource was missing. `protocol.ts` therefore contains only the API types confirmed for this implementation. Recheck generation when upgrading Orca.

### Workspace connection

The installed `workspace.readContext` returns a name, branch, and terminal list, but no workspace path or ID. Match its name and branch against `workspace.list`. Automatically connect only when the result identifies exactly one local Git worktree. The installed host uses `hostId: "local"`; older `null` values are also accepted.

Duplicate names/branches, local/SSH name collisions, or a truncated list require a choice. Do not derive a path from a workspace name or use the worker's current directory as a fallback. The picker lists only local Git workspaces managed by Orca. There is no arbitrary path entry.

Subscribe to `workspace.changed` and prevent late results from a previous request from replacing the new connection. Keep connections in worker memory. Restarting the worker requires reconnection through the sidebar.

### Panel and custom editor

`index.html` is the panel entry and `editor.html` is the custom editor entry. Use the explicit surface marker to distinguish them: the host can supply `orca.document` on a sidebar too.

Custom editors receive document content, not a filesystem path. To open a diff, the worker writes `.orca/git-logs/<uuid>.orcadiff` containing the repository, comparison, and selected file. It then opens the matching workspace and passes a workspace-relative path to `editor.open`.

The worker verifies each parent directory, rejects symlinks and paths outside the repository, and creates documents with `wx` and mode `0600`. Before creating a document it checks local Git exclusion; a failed check produces a warning without preventing document creation. It does not modify source files, the index, or shared `.gitignore` files. Documents remain until removed by the user or the worktree directory is deleted.

A descriptor does not grant access to a repository by itself. The sidebar must connect that repository before the document can read it. An open editor keeps the document's repository and comparison across workspace changes. Documents for two-commit comparisons use a newer `version`; see Descriptor versions under Git reads and comparisons.

The custom editor requires an isolated desktop frame. Do not intercept ordinary file clicks or assume an API exists to replace Orca's built-in diff.

### Local exclude setup

The worker subscribes to `workspace.created` and `workspace.changed`. Re-resolve created IDs through `workspace.list`, require a local worktree, and compare canonical paths before access. For workspace changes, re-read current context and reject ambiguous or truncated matches. Do not trust an event path or an SSH path on its own. These background checks do not authorize a comparison document's repository.

Also check on sidebar connection, comparison loading, and before opening a Diff descriptor so an existing workspace or a missed event is repaired. Git resolves `--git-common-dir` and `--git-path info/exclude`. Ensure the exact `/.orca/git-logs/` rule is present once, preserving existing bytes and newline style. A shared ignore rule does not replace this local registration. Serialize updates to the same canonical exclude path across linked worktrees.

Only an existing, small regular exclude file with one link is writable. Refuse symlinked metadata, hard links, unsafe paths, or missing metadata. Open without creation, compare device/inode before and after opening, and use append mode; a parent replacement must not create an outside file. Bound reads, warn when Git still reports actual untracked documents, and check the exact generated filename before writing it. Do not infer effective exclusion from a representative file or trailing-slash probe.

Setup failure does not block descriptor creation or opening Diff. The open response carries an optional `setupWarning`, which the panel displays after a successful open. Documents may remain untracked and prevent actions that require a clean worktree. Repository authorization and path checks still block unsafe access. Shared ignore negations are not overridden. The rule is local to the repository and shared by its linked worktrees; it is not removed when one workspace closes. Tracked documents and old `git-tools` paths are not changed. No worktree-specific configuration extension or global excludes setting is enabled.

## Git reads and comparisons

- Load commits from parent relationships in pages of 200, up to 5,000. Pin commit comparisons to full hashes.
- Branch filtering resolves a canonical local or remote ref from a separately queried list. It never checks out the branch. Remote HEAD aliases are omitted; branch search shows up to 100 results.
- Text search and filters run in Git over the selected history, not over loaded rows, and the graph hides its edges while any of them is active. Refresh retains a branch filter unless its ref has disappeared; a workspace switch resets it.
- Working tree comparison is HEAD versus the final file on disk. `staged`, `unstaged`, and `untracked` are status labels, not separate comparison modes. Omit changes whose final contents match HEAD.
- A selected commit compares against its first parent unless another direct parent is chosen. The initial commit compares against an empty tree.
- Saved files are the source of working tree contents. Unsaved buffers are not included. Reads are not an atomic snapshot; a changed HEAD can require a refresh.

Text diffs support UTF-8 files up to 768 KiB and at most 2,000 changed files. Added, deleted, renamed, empty, and missing files are handled separately. Binary, non-UTF-8, oversized, symlink, submodule, and unmerged paths return status views. A file-mode-only change may have no text hunks.

Shallow repositories expose only local history. Partial clones are rejected to avoid implicit object fetching. There is no fetch, SSH access, remote file access, or Git LFS download.

### Log filters and paging (0.2.0, unreleased)

The `log` request takes `repo`, `all`, `branchRef`, an optional `filter`, and an optional `cursor`. The response adds `nextCursor` and `hasMore` to the existing fields. `filter` is `{ text, author, since, until, path, follow }`, each field optional. The UI sends it after a 300 ms pause and sends only well-formed dates. While an input method such as Korean is composing a character, it waits 600 ms instead and sends the value as composed so far.

Tags are read from `refs/tags` in the same `for-each-ref` call and attached to commit rows as `tag: <name>` labels. A tag counts when it points to a commit or is an annotated tag whose target is a commit. Tags are not added to `branches`, so they stay out of the branch picker and out of the cursor snapshot below.

`validateFilter` runs before any Git call and enforces these rules:

- `text` and `author` must be strings, are trimmed, and are ignored when empty. More than 200 characters, a newline, a carriage return, or NUL is rejected. Each value becomes a single argument, `--grep=<text>` or `--author=<text>`, together with `--fixed-strings` and `--regexp-ignore-case`. A value that starts with `--` cannot become an option.
- `since` and `until` must match `YYYY-MM-DD` and survive a round trip through `Date`, so `2026-02-30` is rejected. They become `--since=<date> 00:00:00` and `--until=<date> 23:59:59` so the whole day is included. Git applies them to the committer date; the list shows the author date.
- `path` goes through the repository-relative path check (no absolute path, `..`, `.git`, or NUL) and a 4,096-character limit. It is placed after `--`, and `--literal-pathspecs` is a global option before `log`, so pathspec magic such as `:(glob)` is not interpreted.
- `follow` must be a boolean and only has effect with a `path`. The worker rejects it when `all` is set. It adds `--follow` only when the path is not a tree at the starting commit, because `--follow` is meant for a single file. The UI drops `follow` before the request when the scope is all branches; the worker check is the backstop.
- A filter with no usable field returns the unfiltered list.

When `text` is 4 to 64 hexadecimal characters, the worker also runs `rev-parse --verify --quiet <text>^{commit}`. The result counts only if it is a full hash that starts with that text, so a branch or tag with the same name does not match. The commit is added at the top of the first page when it is not already there, and later pages do not repeat it.

Paging uses two constants in `protocol.ts`: `PAGE_SIZE = 200` and `LOAD_LIMIT = 5000`. The worker, the UI, and the browser fixture share them, so they are declared only there. The worker asks Git for one row more than the page size to detect another page, and caps the page at `LOAD_LIMIT - skip`. `hasMore` is true only when more rows exist and the next offset is below the limit; `nextCursor` is present only then. At the limit, `hasMore` is false and the UI shows a notice. Normal pages use `--skip`. With `follow`, `--skip` would count commits that do not touch the file and miss renames inside the skipped part, so the worker reads from the start and drops the first `skip` rows itself.

The cursor is a base64url JSON object holding the offset and a snapshot hash. It is stateless because the worker loses memory on restart. The snapshot is a SHA-256 over these values: the HEAD hash, every `refs/heads` and `refs/remotes` line from `for-each-ref`, the `all` flag, `branchRef`, and the normalized filter (arguments, path, `follow`). In the all-branches view (`all`), the other refs that `--all` walks, such as tags, stash, and notes, are hashed too, so moving or deleting a tag invalidates the cursor. In the current-branch and selected-branch scopes tags are left out, so adding or moving a tag does not invalidate a cursor. Moving any branch, even one outside the current scope, does.

A cursor fails as an invalid cursor in these cases: it is longer than 512 characters, it is outside the base64url alphabet, it is not valid JSON, or its offset is not an integer from 0 to the limit. A snapshot mismatch fails with a message that starts with `stale-cursor:`. The UI answers that error by loading from the first page again. It sends one page request at a time and drops a response that belongs to an earlier filter, branch, or reload.

A `log` request that reads the first page (including filter changes and refreshes) sends `cancelKey: 'filter'`. The worker stops the Git run of an earlier `filter` request for the same repository and answers only the new one. Page requests carry no `cancelKey`, so they never cancel a filter request.

The list carries only commit subjects. `commitMessage` takes `repo` and a full `commit` hash and returns `{ message }` from `git show -s --format=%B`. The UI requests it when a commit is selected and shows the subject first. A failed request leaves the subject in place with an error note and the cause of the failure, and a late response for an earlier selection is discarded.

### Two-commit comparison (0.2.0, unreleased)

A `range` comparison is `{ kind: 'range', base, target, mergeBase? }`. `base` and `target` must be full commit hashes; an abbreviated hash or a ref name is rejected with the same error as other comparisons. By default the left side is `base`. With `mergeBase: true`, the worker runs `git merge-base base target` and uses its result as the left side; no result fails with a no-common-ancestor error. The same-commit check runs after that replacement, so it also fires when `target` is an ancestor of `base` with `mergeBase: true`. The file list comes from `git diff --no-ext-diff --no-textconv -M --name-status -z <left> <target> --`. The response normalizes `mergeBase` to a boolean and reports the resolved left hash as `left` and the target as `right`. A per-file `diff` request recomputes the change set, so its left side follows the same rule.

The 2,000 changed-file limit and the 768 KiB per-file text limit apply to ranges in the same way as to commit comparisons. Exceeding the file limit returns an error instead of a partial list.

The panel marks a base commit in UI state only. It is not stored in the worker or in a document. The menu items and chip are the only entry points; there is no picker for branch or tag names.

### Descriptor versions

`.orcadiff` documents carry `version`. The worker writes `2` for a `range` comparison and `1` for every other comparison. Both the worker and the editor accept 1 and 2, reject a version 1 document that contains a `range`, and reject any other version with an unsupported-document error. Git Logs 0.1.1 accepts only version 1, so it refuses version 2 documents. Documents written before 0.2.0 stay readable.

## Git action contract

Actions use two worker requests: prepare a confirmation, then execute its token. The token is valid for five minutes and can be consumed once. Execution rechecks HEAD, branch, repository state, workspace identity, and checkout target refs. A workspace that cannot be uniquely identified from the active context cannot run actions.

Reject dirty index or working tree state, untracked files, assume-unchanged, skip-worktree, sparse checkout, and ongoing merge/rebase/cherry-pick/revert/bisect. Also reject ignored files that obstruct target paths. Do not stash automatically, discard changes, or force a branch away from another worktree.

| Action               | Contract                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Checkout             | Switch to a local branch at the selected commit, or detach HEAD                                                                       |
| New branch           | Create without switching; branch names containing `/` are supported                                                                   |
| Merge                | Fast-forward when possible, otherwise create a merge commit                                                                           |
| Rebase               | Replay the current branch onto the target; no merge preservation, interactive mode, squash, or automatic updates to other branch refs |
| Cherry-pick / revert | Require a mainline parent for merge commits; reverting a merge affects later merges too                                               |
| Reset                | Soft preserves index and files; mixed updates the index and preserves files; hard replaces both and requires the target's short hash  |

Before reset or rebase, save HEAD under `refs/git-logs/backups/<timestamp>-<uuid>` and show that ref in the result. It preserves committed history, not uncommitted files, and is not deleted automatically. Inspect it with `git show <backup-ref>` before recovery. Reset and rebase can rewrite shared history; there is no push or force push UI.

Serialize actions within the same common Git directory. External tools remain outside that lock, so do not claim atomicity with terminal or other app activity. The timeout is 120 seconds.

Disable Git hooks, commit signing, automatic stash, rerere application, and recursive submodule updates for UI actions. Repository filters and merge drivers may still execute. Refresh the graph and working tree after an action.

On conflict or failure, show output and conflicting files. Do not automatically roll back or retry. Users resolve and stage conflicts in a terminal, then run the appropriate `git merge --continue`, `git rebase --continue`, `git cherry-pick --continue`, or `git revert --continue`; use that operation's `--abort` to cancel it. Stops without conflicting files, such as an empty cherry-pick, are still failures. There is no conflict editor or staging UI.

## UI contracts

Monaco is read-only and keeps side-by-side layout on narrow screens. Use a bundled relative worker URL, not a CDN or blob worker. Schedule layout from `ResizeObserver` through `requestAnimationFrame` to avoid the host's observer loop warning. Theme and language changes must not recreate editor models or reset scroll position.

Use the documented `--orca-*` frame variables for surfaces, text, selection, borders, focus, and radius. Keep the root rem base at 16px. Do not assume app-only chart, diff, syntax, font, or density tokens are available in frames. Semantic graph and addition colors use local fallbacks; deletion uses the public destructive color. Graph lanes mix local hues with host foreground. Author, date, and hash use distinct text treatments.

The details/file panes scroll internally and resize through centered handles. Default heights are 144px/240px when space permits; small windows clamp them. Pointer and keyboard resizing, Escape cancellation, and double-click reset are supported. Frame-local storage persists heights where available. Retain the old `git-tools.panes.v1.*` key for existing frame settings; no additional storage capability is requested.

### Language

Read public `window.orca.locale`. Support Korean and English BCP-47 tags; unsupported or invalid locales fall back to `en-US`. Pass supported regional tags to `Intl` for dates and numbers. Do not translate commit data or raw Git output.

There is no dedicated public locale-change event. Check on mount, focus, and at 500ms intervals. Orca 1.4.248 may only send locale when connecting a frame, so reopening or reloading can be necessary. Do not inspect private bridge messages or app settings files.

Manifest and catalog descriptions accept one string; they do not have per-language description fields. English is the default documentation language, with separate `.ko.md` guides linked from each English page. UI localization is independent of those documents.

Translations live in `src/i18n/ko.json` and `en.json`. Existing Korean source strings remain keys. Extend locale selection and tests when adding a language. Monaco's built-in text is partly English.

Browser preview uses `navigator.language` or the `lang` query and language picker. `sample=en` selects English mock data only when there is no Orca bridge. Neither override applies to real host data.

## Validation record

On 2026-11-04, using local Git 2.41.0, checks covered build/typecheck, 27 Git/worker cases, 5 translation cases, 2 artifact cases, 21 browser UI cases, and 2 screenshot scenarios. Build and manifest validation passed. Screenshots covered light, dark, and narrow layouts.

Temporary Git repositories cover root and merge commits, current/all branch histories, the 200-commit limit, full messages, special filenames, renames, deletions, staged/unstaged combinations, canceled changes, staged deletion with recreation, binary/large/non-UTF-8 files, symlinks, conflicts, boundary checks, and worker messages. Mutation cases cover each action, backup refs, stale confirmations, repeated execution, worktree occupancy, active workspace boundaries, hidden index flags, and ignored-file collisions.

On 2026-11-05, local exclude checks added 14 temporary-repository cases, bringing the logic/translation/artifact suite to 48 cases. Browser coverage increased to 22 cases, including translated setup warnings that retain the graph. Workspace event delivery was exercised through fixture hosts; live delivery of the new subscriptions has not been verified.

Before the rename, the approved development identity was tested on macOS with Orca 1.4.248 for repository connection, workspace selection, central tab opening, `document.session`, and Monaco rendering. Dark and light editor captures reported no frame errors or CSP blockage for local assets. Git action menus and confirmations were rendered without mutating a real user repository. On 2026-11-05, the renamed `local.git-logs` development build was approved and loaded. The active handler resolved the current local workspace; two generated descriptors opened separate central tabs. A live window capture showed the selected protocol file in Monaco with aligned sides, inline highlights, and folded unchanged regions. The generated documents passed `git check-ignore`; the tracked checkout stayed clean. Plugin logs and `plugin check` reported no errors. The old `local.git-tools` plugin was disabled to avoid duplicate editor registrations. Native accessibility inspection failed despite reported permission grants, so live context-menu input was not rechecked. Other operating systems, host versions, and remote hosts remain unverified.

On 2026-11-08, the 0.2.0 read-only additions were checked with Git worker tests in temporary repositories and with browser tests against fixtures. The worker tests cover tag labels, filter validation and literal matching, date bounds, path and `follow` handling, paging in pages of 200 with cursor validation and stale cursors, cursor invalidation when a tag moves in the all-branches view, filter request cancellation, the hash-prefix row, `commitMessage`, range comparisons with and without the merge-base option, same-commit and no-common-ancestor errors, over-limit file counts, and descriptor versions. The browser tests cover tag badges, filter chips and the hidden graph, infinite scroll and the 5,000-commit notice, stale-cursor reload, the comparison base menu and chip, the merge-base toggle, version 2 descriptors in the editor entry, the file history menu with rename tracking, and arrow-key navigation. The arrow-key tests include the cases where nothing moves while a menu, picker, or input has focus, and where holding a key requests changes only for the commit it stops on. These counts are not recorded as numbers here because they change with the suite; run the targets above for current results.

During development, filter and page requests in temporary repositories took between 0.04 and 0.6 seconds. On 2026-11-08, the worker's `log` was called directly, once per case, against a local project repository of about 12,600 commits (not public). The first page took 0.26 seconds, author, text, and path filters took 0.13 to 0.19 seconds, and an author filter in the all-branches view took 0.19 seconds. Plain pages at offsets 0, 2,400, and 4,800 each took 0.13 seconds. `follow` on the file with the longest history (about 300 commits) took 0.98 seconds at offset 200. No file there has a longer history, so deep `follow` offsets were not measured. Repository size and hardware differ, so these values are not a guarantee, and no response-time target is verified. The browser fixtures do not execute Git or run in Orca, and no live-host check of the 0.2.0 additions is recorded. The screenshots under `docs/screenshots` were not regenerated and do not show these additions.

## Package and release

The build rejects symlinks, `node_modules`, executables, native modules, archives, and unreviewed file types. Worker dependencies must be bundled unless they are Node built-ins. No WASM or font files are shipped. The public directory rejected the 0.1.0 Codicon font. Starting with 0.1.1, the build converts the installed Monaco glyphs into inline SVG masks; the editor icon registry resolves aliases and theme colors use currentColor. Font parsing runs only at build time. Artifact checks reject font files so they cannot be reintroduced into a release.

The bundle declares `type: module` for `worker.js`. Generated comparison documents and local validation captures are not release assets. Both language guides and dependency licenses belong in the installable directory.

Source is hosted at [tienne/orca-plugins](https://github.com/tienne/orca-plugins). `dist/` is not tracked on source branches. Do not create catalog entries with placeholder commits or hashes. A future release must:

1. Commit the installable artifact to its publishing repository.
2. Generate release metadata with `orca plugin release-entry` for that committed directory.
3. Set catalog `source.path` to the directory containing the packaged manifest. Orca installs only that directory.
4. Pin the release to the generated full commit and `contentHash`, validate it, and test installation before public listing.

The intended public identity is `tienne.git-logs` when installed from a tienne-owned repository. Do not use the reserved `orca-` ID prefix or reserved publisher names. Keep older catalog releases when raising the minimum Orca version so older clients retain a compatible release. Leave deprecated `publisher` out of the manifest. The public registration page has described it differently, so recheck its instructions against the current validator before releasing. Catalog and public-directory registration are separate steps; do not assume a monorepo catalog automatically satisfies the directory's root-manifest instructions.

### Rename compatibility

Current paths and commands use `git-logs`. Existing `.orca/git-tools/*.orcadiff` documents and `refs/git-tools/backups/` refs are not moved or removed. The document format and `.orcadiff` extension remain compatible. New files and backup refs use `git-logs`.

The new local identity requires its own Orca approval. Once it is ready, unload the old development connection to avoid duplicate panel/editor registrations. Do not treat offline validation as execution approval.

### Listing policy and search

Keep installation and use free. Do not add paywalls, license keys, trials, telemetry, analytics, tracking, or external data collection. Keep the source available for public listing, preserve MIT and dependency notices, and do not add obfuscation intended to hide behavior. Do not imply endorsement by Orca, JetBrains, or another vendor. IntelliJ informed the comparison UX; its branding is not part of the plugin. Policy violations can lead to delisting; Orca can disable harmful releases through its kill list.

The description includes `Git logs`, `Git tree`, `commit graph`, and `side-by-side diff`. Current manifest/catalog schemas have no separate keyword or search-alias field. The published catalog uses the same description. Registered GitHub topics include `orca-plugin`, `git-logs`, `git-tree`, `commit-graph`, and `git-diff`. See the [release guide](releases.md#publish-a-directory-export) for public-directory publication and indexing checks. Topic registration does not confirm search availability or ranking.

## CI and release automation

The implemented workflows use hosted Ubuntu for PR checks and a trusted manual macOS job for Orca validation and publication. See [Git branches and releases](releases.md) for runner setup, preview and publish modes, source tags, provenance, and catalog pinning. `pnpm nx run git-logs:release-test` tests release orchestration with local bare remotes; set `ORCA_RELEASE_INTEGRATION=1` and the platform Orca CLI to repeat it with real validation and hashes. GitHub-hosted results are recorded in the repository’s pull-request checks and Actions runs; local verification does not establish hosted CI success.

## References

- Orca: [authoring](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-authoring.md), [manifest](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-manifest.md), [host API](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-host-api.md), [catalog](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-catalog.md), [theme tokens](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-theme-tokens.md), [listing policy](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-listing-policy.md), [public registration](https://www.onorca.dev/plugins/add)
- Git: [merge](https://git-scm.com/docs/git-merge), [rebase](https://git-scm.com/docs/git-rebase), [cherry-pick](https://git-scm.com/docs/git-cherry-pick), [revert](https://git-scm.com/docs/git-revert), [reset](https://git-scm.com/docs/git-reset)
- UX reference: [IntelliJ Differences Viewer](https://www.jetbrains.com/help/idea/differences-viewer.html)
