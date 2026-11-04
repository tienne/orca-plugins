# Git Logs

English · [한국어](README.ko.md)

Explore Git logs with a Git tree visualization and commit graph, then compare files in a read-only side-by-side diff. Commit actions are available from the graph's context menu.

Version 0.1.0 is a local development build. There is no public installation URL yet. Orca 1.4.248 or later and local Git are required.

## Use Git Logs

1. Open a local Git workspace in Orca, then open the Git Logs sidebar.
2. Git Logs connects to the current workspace. If it cannot identify one workspace, select it from the list.
3. Select a commit to read its full message and changed files.
4. Double-click a file to open the central Diff tab, or focus the file and press **Enter**. A single click selects the file.

The graph shows up to 200 recent commits with parent relationships, HEAD, branch labels, author, date, and hash. Use the branch picker to show the current branch, all branches, or a specific local or remote branch. Choosing a branch changes the history filter; it does not check out that branch.

Search commits by message, author, or hash. Search applies to the loaded history. Graph lines are hidden during commit search to avoid drawing false connections across omitted commits. Branch search uses a separate ref list, shows up to 100 results, and excludes symbolic remote HEAD aliases. Add more text to narrow a long list.

**Refresh** reloads Git data. Switching Orca workspaces changes the connection and resets the branch filter. A refresh keeps the selected branch unless that ref has been deleted.

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

Opening a Diff tab writes a JSON comparison document to `.orca/git-logs/*.orcadiff` inside the worktree. It records the repository, comparison, and selected file. Documents remain while the worktree exists and are removed with its directory; closing a tab or removing only an Orca folder entry does not delete them.

Git Logs checks local exclusion when a worktree is created, the active workspace changes, the sidebar connects, a comparison loads, or a Diff tab opens. It ensures `/.orca/git-logs/` is present once in the existing local `info/exclude` file found through Git. It preserves existing rules and does not edit tracked `.gitignore`, the index, or global Git configuration. Linked worktrees of the same local repository share this rule; other clones are unaffected. Already tracked documents are not untracked automatically, and legacy `.orca/git-tools/` files are outside this rule.

Read-only views show a warning if setup fails. New comparison documents are not created until Git confirms they will be ignored. Missing or unsafe Git metadata, read-only permissions, or higher-priority unignore rules need to be resolved locally; the plugin does not create missing metadata or override shared rules. The worker subscribes to `workspace.created` and `workspace.changed`; Orca may request approval for those subscriptions.

An external `.orcadiff` does not automatically authorize its repository. Connect that repository in the Git Logs sidebar before refreshing the document. An open Diff tab keeps the repository and comparison recorded in its document when the active workspace changes.

The UI, Monaco, fonts, and editor worker are bundled locally. There is no telemetry, analytics, or external translation service.

## Limits

- Only local Git workspaces managed by Orca are supported. There is no SSH or arbitrary path connection.
- Remote branches use refs already stored locally. The plugin does not fetch remote data or download Git LFS content.
- UTF-8 text comparison is limited to **768 KiB per file** and **2,000 changed files**.
- Binary, non-UTF-8, large files, symlinks, submodules, and unresolved conflicts are shown as separate states.
- Shallow repositories show the history available locally. Partial clones are rejected to avoid implicit object downloads.
- Git reads are not an atomic snapshot. Refresh after external changes; a changed HEAD can require a reload.
- Commit actions reject assume-unchanged, skip-worktree, sparse checkout, and ongoing merge, rebase, cherry-pick, revert, or bisect states. Ignored files that obstruct target paths are also rejected.

The earlier development identity was tested on macOS with Orca 1.4.248 for repository connection and the central Diff. Git actions were tested in temporary repositories. The renamed `local.git-logs` identity still awaits execution approval. Other operating systems and Orca versions have not been verified.

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

Browser tests use Google Chrome. To use Chromium, run `pnpm exec playwright install chromium`, then run tests with `PW_CHANNEL=chromium`.

## Renamed from git-tools

The plugin ID, package paths, and Nx commands now use `git-logs`. The local install identity is `local.git-logs`; an installation from a repository owned by tienne will use `tienne.git-logs`.

Existing `.orca/git-tools/*.orcadiff` documents remain readable. Existing `refs/git-tools/backups/` refs are left in place. New documents and backups use `git-logs`; there is no automatic migration. Orca treats the new identity as a separate plugin and requires approval. After the new plugin is ready, remove the old `local.git-tools` development connection to avoid duplicate panels and editors.

## License

MIT. The installable build includes `LICENSE` and dependency notices in `licenses/`.
