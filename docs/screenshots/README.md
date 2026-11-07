# Git Logs screenshots

English · [한국어](README.ko.md)

These images show the browser demo with English sample data. They do not contain real repository data and are not screenshots of the Orca host. Keep the DEMO label when using them.

| Image                                                | Contents                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| [git-logs-dark.png](git-logs-dark.png)               | Commit graph, commit details, changed files, and side-by-side diff in dark mode |
| [git-logs-light.png](git-logs-light.png)             | The same view in light mode                                                     |
| [git-logs-commit-menu.png](git-logs-commit-menu.png) | Commit context menu in dark mode                                                |

All images are PNG files at 1600 × 1000 pixels. Authors, messages, paths, and code come from fixtures. Capturing them does not run Git commands or require Orca plugin execution approval.

## Capture the images

From the repository root, install dependencies and run:

```sh
pnpm install
pnpm nx run git-logs:screenshots
```

The target builds the plugin and writes these three images to `docs/screenshots/`. It uses an installed Google Chrome. To use Chromium, run `pnpm exec playwright install chromium`, then set `PW_CHANNEL=chromium`.

## Open the demo

```sh
pnpm nx run git-logs:preview
```

Open `http://127.0.0.1:4173/?lang=en&sample=en` and select a theme. `lang=en` chooses English UI text. `sample=en` chooses English fixture data only in the browser demo; it does not translate real Git data in Orca.

See the [repository README](../../README.md) and [development guide](../development.md) for setup and validation details.

## Orcatopia

[orcatopia-island.png](orcatopia-island.png) shows the English browser fixture with Eiffel Tower, Taj Mahal and Petra. The full-page capture retains the DEMO label. It contains no real user save and is not a native Orca capture.

Regenerate and copy it with:

```sh
pnpm nx run landmark-island:ui-test --grep='Orcatopia showcase'
cp test-results/landmark-island/orcatopia-island-demo.png docs/screenshots/orcatopia-island.png
```
