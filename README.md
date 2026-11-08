# Tienne Orca Plugins

English · [한국어](README.ko.md)

Orca plugins built with pnpm, Nx, TypeScript, React, Vite, and esbuild. Each directory under `plugins/` is a separate plugin with its own installable build.

## Plugins

| Plugin                                               | Features                                                                    | Status                |
| ---------------------------------------------------- | --------------------------------------------------------------------------- | --------------------- |
| [Git Logs](plugins/git-logs/README.md)               | Commit graph, branch and commit search, side-by-side diffs, commit actions  | 0.2.0                 |
| [Orcatopia](plugins/landmark-island/README.md) | Worktree expeditions, collectible landmarks, island placement and world map | Unpublished prototype |

The source-branch catalog is an empty template. The installable catalog and built plugins live on `release`. In Orca **Settings → Plugins → ⋯ → Catalog sources…**, add `https://github.com/tienne/orca-plugins.git` with ref `release`, then install Git Logs. See the [installation and usage guide](plugins/git-logs/README.md#install) for access and usage details.

## Git Logs

Explore Git logs through a Git tree visualization and commit graph. Open a changed file in a central tab to compare its contents side by side.

- View up to 200 recent commits, parent relationships, HEAD, and local and remote branch labels.
- Filter by branch and search commit messages, authors, or hashes.
- Compare changes with line and word highlights, synchronized scrolling, change navigation, and collapsed unchanged regions.
- Checkout, create a branch, merge, rebase, cherry-pick, revert, or reset from a commit's context menu.
- Use Orca theme colors and English or Korean UI text.

Diffs are read-only. Git actions require a separate confirmation. Git Logs connects to local Git workspaces managed by Orca; SSH workspaces are not supported. See the [Git Logs guide](plugins/git-logs/README.md) for comparison rules, permissions, and action limits.

![Git Logs English demo with a commit graph and side-by-side diff in dark mode](docs/screenshots/git-logs-dark.png)

This is a browser demo with sample data, not a real repository or an Orca host screenshot.

[Light theme](docs/screenshots/git-logs-light.png) · [Commit menu](docs/screenshots/git-logs-commit-menu.png) · [Screenshot instructions](docs/screenshots/README.md)

## Develop locally

Use Node.js 22.12+ or 24+, pnpm 10, and Git. Orca integration and manifest validation also require the Orca desktop app and CLI. Git Logs requires Orca 1.4.248 or later.

Run these commands from the repository root:

```sh
pnpm install
pnpm nx run git-logs:build
pnpm nx run git-logs:preview
```

The build is written to `dist/plugins/git-logs`. It includes the UI, Monaco, SVG icons, editor worker, both language guides, and dependency licenses. It does not need a separate `node_modules` directory after installation.

Open `http://127.0.0.1:4173` for the browser demo, or `http://127.0.0.1:4173/?lang=en&sample=en` for English sample data. The demo does not run Git commands. Use `pnpm dev` for source editing with hot reload.

To use the build in Orca, review its access and follow the [local installation steps](plugins/git-logs/README.md#local-installation). Git Logs runs a Node process with your user account's access and requests `workspace:read` and `workspace:write`.

## Check a build

```sh
pnpm nx run-many -t build typecheck test ui-test -p git-logs
pnpm validate
```

| Target            | Checks                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `test`            | Git operations in temporary repositories, translations, and artifact rules                 |
| `ui-test`         | Packaged graph, diff, themes, languages, keyboard controls, and layout                     |
| `validate-plugin` | Orca manifest validation of the packaged plugin; `pnpm validate` runs this for all plugins |
| `screenshots`     | English demo captures in light and dark themes, the commit menu, and a product card        |

Browser checks use an installed Google Chrome. To use Chromium, run `pnpm exec playwright install chromium`, then set `PW_CHANNEL=chromium`. Test output is written to `test-results/`.

Generate the README images with:

```sh
pnpm nx run git-logs:screenshots
```

## Repository layout

```text
plugins/git-logs/         # Plugin source, manifest, and user guides
  src/ui/                # Graph, Monaco diff, and browser fixtures
  src/worker/            # Git and file access, action preparation and execution
  showcase/              # English screenshot captures
scripts/                 # Build, test, and artifact checks
docs/development.md      # Host integration, validation, and release details
docs/screenshots/        # Demo images and capture instructions
dist/plugins/git-logs/   # Generated build; not tracked by Git
orca-catalog.json        # Source catalog template; installed releases live on release
```

Git and file operations belong in workers. Plugin frames use bundled local assets. Source manifests point to packaged entries, so validate `dist/plugins/*`, not the source directories.

## CI and releases

Pull requests and main pushes run build, typecheck, Git, browser, and release tests on hosted Ubuntu runners. Manual release runs default to a preview. Publication uses a separately configured macOS Orca runner and production environment. See [Git branches and releases](docs/releases.md) for setup, permissions, and the main → release workflow.

The source repository is public at [tienne/orca-plugins](https://github.com/tienne/orca-plugins). A release must include the built plugin files in Git and pin the installable directory to an exact commit and `contentHash` in a catalog. See the [development guide](docs/development.md) for release requirements and the current validation record.

## License

[MIT](LICENSE). Dependency licenses are included in each plugin build's `licenses/` directory.
