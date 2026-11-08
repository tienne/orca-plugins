# Git Logs

English · [한국어](README.ko.md)

Explore Git logs with a Git tree visualization and commit graph, then compare files in a read-only side-by-side diff. Commit actions are available from the graph's context menu.

Git Logs 0.1.1 requires Orca 1.4.248 or later and local Git.

This source tree also contains read-only additions planned for 0.2.0: tag badges, filters for message, author, date, and path, infinite scroll over paged history, comparison of any two commits, file history, and keyboard navigation. The manifest version is still 0.1.1, and 0.2.0 has not been versioned, tagged, or released. A 0.1.1 build does not include these features. Sections marked **(0.2.0, unreleased)** describe them. They do not change the existing commit actions, which still prepare, confirm, recheck, and back up as described below.

## Install

1. Open Orca **Settings → Plugins → ⋯ → Catalog sources…**.
2. Add the Git URL `https://github.com/tienne/orca-plugins.git` with ref `release`.
3. Install **Git Logs** (`tienne.git-logs`) and review its execution access.

The plugin reads local Git repositories and files, writes comparison documents and local exclude rules, and can run confirmed Git actions. Its Node worker runs with your user account's access and requests `workspace:read` and `workspace:write`. Installing the plugin does not require Node.js or pnpm.

## Use Git Logs

1. Open a local Git workspace in Orca, then open the Git Logs sidebar.
2. Git Logs connects to the current workspace. If it cannot identify one workspace, select it from the list.
3. Select a commit to read its full message and changed files.
4. Double-click a file to open the central Diff tab, or focus the file and press **Enter**. A single click selects the file.

The graph shows recent commits with parent relationships, HEAD, branch and tag labels, author, date, and hash. A 0.1.1 build loads up to 200 commits. With the 0.2.0 additions, the list loads 200 at a time as you scroll, up to 5,000 commits. Use the branch picker to show the current branch, all branches, or a specific local or remote branch. Choosing a branch changes the history filter; it does not check out that branch. Branch search uses a separate ref list, shows up to 100 results, and excludes symbolic remote HEAD aliases. Add more text to narrow a long list.

**Refresh** reloads Git data. Switching Orca workspaces changes the connection and resets the branch filter. A refresh keeps the selected branch unless that ref has been deleted.

## Search, filter, and page history (0.2.0, unreleased)

**Tags.** A tag that points to a commit appears as a badge on that commit's row. Annotated tags are resolved to the commit they point to. Badges are read-only: tags are not listed in the branch picker, and there is no way to create a tag.

**Search.** The search box matches commit messages, including the body, as literal text without regard to case. Git runs the search over the selected history, not only the rows already loaded, so commits older than the first 200 can be found. Text is limited to 200 characters. If you type four or more hexadecimal characters that resolve to one commit, that commit is also added to the top of the results. Branch names are no longer searched here; use the branch picker.

**Filters.** The **Filters** button opens or closes a row with these fields:

| Field  | Behavior                                                                                          |
| ------ | ------------------------------------------------------------------------------------------------- |
| Author | Literal, case-insensitive match, up to 200 characters                                             |
| Path   | A file or directory path relative to the repository root, matched literally with no glob patterns |
| From   | `YYYY-MM-DD`, from the start of that day                                                          |
| To     | `YYYY-MM-DD`, through the end of that day                                                         |

Dates use the commit's committer date, while the list shows the author date. The two can differ after a rebase or cherry-pick.

Search text, filters, and the selected branch scope combine with AND. For example, selecting a branch and typing an author shows only that author's commits on that branch. Requests are sent after a short pause in typing, and a late response for older input is discarded. Active filters appear as chips; remove one with its **×** or use **Clear all**.

While search text or any filter is active, the graph heading reads **Search results · graph hidden** and no graph lines are drawn. Commits left out of the results would otherwise produce false connections.

**Paging.** Scroll until the end of the list is within 10 rows and the next 200 commits load automatically. There is no Load more button. Loading stops at 5,000 commits and a notice suggests search or filters for older commits. If the history changes between pages, for example after a new commit or a moved branch, Git Logs shows **History changed. Reloading from the start.** and loads the list again from the first page.

## Compare files

| Selection    | Left                                 | Right                       |
| ------------ | ------------------------------------ | --------------------------- |
| Working tree | File at HEAD                         | File saved on disk          |
| Commit       | File in the selected commit's parent | File in the selected commit |
| First commit | Empty tree                           | File in the first commit    |

Merge commits use the first parent by default. Select another direct parent to change the comparison.

Working tree status labels describe where changes exist:

- `staged`: HEAD differs from the Git index.
- `unstaged`: the index differs from the file on disk.
- `untracked`: the file is not in the index. Ignored files are excluded.

These labels are not separate diff modes. **The working tree diff compares HEAD with the final saved contents on disk.** Changes that cancel out to the HEAD contents are omitted. Unsaved editor buffers are not included.

The viewer aligns both sides and highlights changed lines and words. It supports synchronized scrolling, previous/next change, collapsed unchanged regions, and ignoring leading/trailing whitespace. Narrow views keep both panes and scroll code horizontally. Added, deleted, renamed, empty, and missing files are distinguished. Unsupported text comparisons show a file status instead of a misleading diff.

## Compare any two commits (0.2.0, unreleased)

1. Right-click a commit, or focus it and press **Shift+F10**, then choose **Set as comparison base**. A **Base: `<hash>`** chip appears under the search box.
2. Right-click another commit and choose **Compare with base commit**. The item is disabled until a base is set.
3. The file list shows every change between the two commits. Open files as in other comparisons.

The base is the left side and the second commit is the right side. By default the two commits are compared directly. Turn on **Compare from common ancestor** above the file list to compare the commits' common ancestor with the second commit instead; the checkbox is off by default. Clear the base with the chip's **×** or the menu's **Clear base**.

If the two commits have no common ancestor, the list shows **No common ancestor.** when the option is on. If both sides resolve to the same commit, it shows **Both sides are the same commit.** With the option on, this also happens when the second commit is an ancestor of the base.

The comparison points are commits in the list. Choosing a branch or tag by name is not implemented. To compare two releases, pick the commits that carry their tag badges; find older commits with search or filters first. The file count and size limits listed under Limits apply to these comparisons too.

## File history (0.2.0, unreleased)

Right-click a changed file, or focus it and press **Shift+F10**, then choose **History** in the file menu. The commit list is limited to commits that changed that path and follows renames, so history under earlier names is included. A chip shows **File: `<path>` (follows renames)**. Selecting a commit selects that file in its changed-file list when it can be matched by its path, its previous path, or because it is the only changed file. If no match is found, no file is selected. Remove the chip with its **×** to return to the full list; other filters stay.

Typing in the **Path** field instead filters by that path without rename tracking. When the branch picker is set to all branches, rename tracking is not available: the list filters by path only, the chip reads **File: `<path>`**, and a note says that rename tracking is unavailable. Tracking returns when you select a branch.

## Keyboard navigation (0.2.0, unreleased)

Click the commit list or the changed-file list, then press **↑** or **↓** to move the selection. The area you clicked last receives the keys. Movement stops at the first and last rows. Moving down near the end of the loaded commits loads the next page. If the working tree row is selected, the first key press selects the first commit in the list. Arrow keys do nothing while a menu, the branch picker, a dialog, or a text field has focus; menus and the picker keep their own arrow-key handling. Combinations with Shift, Ctrl, Alt, or Cmd are ignored.

## Run a commit action

Right-click a commit, or focus it and press **Shift+F10**.

| Action      | Result                                                               |
| ----------- | -------------------------------------------------------------------- |
| Checkout    | Switch to a local branch at the selected commit, or detach HEAD      |
| New branch  | Create a local branch at the selected commit without switching to it |
| Merge       | Merge the selected commit into the current branch                    |
| Rebase      | Replay the current branch's commits onto the selected commit         |
| Cherry-pick | Apply the selected commit to the current branch                      |
| Revert      | Create a commit that reverses the selected commit                    |
| Reset       | Move HEAD to the selected commit with soft, mixed, or hard mode      |

The same menu has a Compare group with **Set as comparison base**, **Compare with base commit**, and **Clear base** (0.2.0, unreleased). These items only read history and do not run Git actions.

Choose the options, check the repository state, review the branch and target, then confirm execution. Actions require a clean index and working tree with no untracked files. Unsupported states and operations already in progress are rejected.

- Hard reset requires typing the target's short hash.
- Reset and rebase save the previous HEAD under `refs/git-logs/backups/<timestamp>-<uuid>`. These refs preserve commits, **not uncommitted files**. They are not deleted automatically.
- Cherry-pick and revert of a merge commit require a mainline parent.
- Rebase does not preserve merge commits, update other branch refs, or support interactive rebase or squash.
- A branch checked out in another worktree is not taken over by force.
- Conflicts and failures show Git output and conflicting paths. Resolve, continue, or abort the operation in a terminal. There is no automatic rollback or retry.

Git hooks and commit signing are disabled for these UI actions. Automatic stash, rerere application, and recursive submodule updates are also disabled. Repository filters and merge drivers may still run. Avoid running other Git commands on the same repository while an action is executing. An action times out after 120 seconds; inspect the repository state if it is interrupted.

There is no staging, ordinary commit composer, fetch, push, force push, or automatic stash UI.

## Themes and language

The plugin uses Orca's public theme colors for panels, menus, dialogs, and the diff. English and Korean follow Orca's language setting; other languages fall back to English. Commit messages, authors, branch names, paths, and raw Git output are not translated. Some built-in Monaco text remains in English. Reopen the panel or tab if an Orca language change has not reached it.

Drag the short handle to resize the commit details and file list. Arrow keys adjust the height, Shift changes it in larger steps, and Home/End move to the limits. Double-click a handle to restore the default heights. The panes scroll internally. Heights are saved in frame-local storage when available; otherwise they last only within the current frame.

## Access and generated files

Git Logs is a `trusted-worker` plugin. **Its Node process runs with your user account's access to the machine**, including Git and file access. It requires approval before execution. `workspace:read` finds the current workspace, and `workspace:write` opens the workspace and Diff tab.

Opening a Diff tab writes a JSON comparison document to `.orca/git-logs/*.orcadiff` inside the worktree. It records the repository, comparison, and selected file. A document for a two-commit comparison (0.2.0, unreleased) is saved as version 2, which Git Logs 0.1.x cannot open; documents for the working tree and single commits remain version 1. Documents remain while the worktree exists and are removed with its directory; closing a tab or removing only an Orca folder entry does not delete them.

Git Logs checks local exclusion when a worktree is created, the active workspace changes, the sidebar connects, a comparison loads, or a Diff tab opens. It ensures `/.orca/git-logs/` is present once in the existing local `info/exclude` file found through Git. It preserves existing rules and does not edit tracked `.gitignore`, the index, or global Git configuration. Linked worktrees of the same local repository share this rule; other clones are unaffected. Already tracked documents are not untracked automatically, and legacy `.orca/git-tools/` files are outside this rule.

If local exclusion fails, Git Logs still creates the comparison document and opens Diff, with a warning. These documents may appear as untracked files and prevent Git actions that require a clean worktree. Missing or unsafe Git metadata, read-only permissions, or higher-priority unignore rules need to be resolved locally; the plugin does not create missing metadata or override shared rules. The worker subscribes to `workspace.created` and `workspace.changed`; Orca may request approval for those subscriptions.

An external `.orcadiff` does not automatically authorize its repository. Connect that repository in the Git Logs sidebar before refreshing the document. An open Diff tab keeps the repository and comparison recorded in its document when the active workspace changes.

The UI, Monaco, SVG icons, and editor worker are bundled locally. There is no telemetry, analytics, or external translation service.

## Limits

- Only local Git workspaces managed by Orca are supported. There is no SSH or arbitrary path connection.
- Remote branches use refs already stored locally. The plugin does not fetch remote data or download Git LFS content.
- The history list holds at most **5,000 commits**. Use search or filters to reach older ones.
- UTF-8 text comparison is limited to **768 KiB per file** and **2,000 changed files**. Two-commit comparisons use the same limits.
- Tag badges cover tags that resolve to a commit. Tags are not listed in the branch picker.
- Binary, non-UTF-8, large files, symlinks, submodules, and unresolved conflicts are shown as separate states.
- Shallow repositories show the history available locally. Partial clones are rejected to avoid implicit object downloads.
- Git reads are not an atomic snapshot. Refresh after external changes; a changed HEAD can require a reload.
- Commit actions reject assume-unchanged, skip-worktree, sparse checkout, and ongoing merge, rebase, cherry-pick, revert, or bisect states. Ignored files that obstruct target paths are also rejected.

The `local.git-logs` development build was approved and tested on macOS with Orca 1.4.248 for automatic repository connection, two open Diff tabs, Monaco rendering, and local Git exclusion of generated documents. The earlier identity was also checked in light and dark themes. Git actions were tested in temporary repositories. Other operating systems and Orca versions have not been verified.

The 0.2.0 additions are covered by Git worker tests in temporary repositories and by browser tests that use fixture data. The browser demo does not execute Git, and this document records no check of these additions in a live Orca host. On 2026-11-08 the worker was called directly, once per case, against a local project repository of about 12,600 commits (not public). The first page took 0.26 seconds, filters took 0.13 to 0.19 seconds, and the page at offset 4,800 took 0.13 seconds. Results depend on the repository and hardware, so neither these values nor a response-time target is promised.

## Local installation

From the monorepo root, use Node.js 22.12+ or 24+, pnpm 10, Git, and Orca CLI:

```sh
pnpm install
pnpm nx run git-logs:build
pnpm nx run git-logs:typecheck
pnpm nx run git-logs:test
pnpm nx run git-logs:ui-test
pnpm validate
```

The installable build is `dist/plugins/git-logs`. Review its access before loading it:

```sh
orca plugin inspect ./dist/plugins/git-logs --json
orca plugin dev load ./dist/plugins/git-logs --json
```

If Orca returns `approval_required`, review the requested access and approve through Orca's flow. Once approved, a development folder's later code edits run under that approval; additional access requires another review.

For a browser-only demo:

```sh
pnpm nx run git-logs:preview
# Source editing with hot reload
pnpm dev
```

The demo is labeled **DEMO** and uses fixtures. It does not execute Git. Open `http://127.0.0.1:4173/?lang=en&sample=en` for English sample data.

Outside CI, `ui-test` reuses a preview server that is already listening on port 4173. An older server there can serve a stale build, so stop it before running browser tests.

Browser tests use Google Chrome. To use Chromium, run `pnpm exec playwright install chromium`, then run tests with `PW_CHANNEL=chromium`.

## Renamed from git-tools

The plugin ID, package paths, and Nx commands now use `git-logs`. The local install identity is `local.git-logs`; an installation from a repository owned by tienne will use `tienne.git-logs`.

Existing `.orca/git-tools/*.orcadiff` documents remain readable. Existing `refs/git-tools/backups/` refs are left in place. New documents and backups use `git-logs`; there is no automatic migration. Orca treats the new identity as a separate plugin and requires approval. After the new plugin is ready, remove the old `local.git-tools` development connection to avoid duplicate panels and editors.

## License

MIT. The installable build includes `LICENSE` and dependency notices in `licenses/`.
