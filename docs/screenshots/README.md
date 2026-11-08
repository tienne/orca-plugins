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

[orcatopia-island.png](orcatopia-island.png) shows an English garden fixture: Eiffel Tower, Mount Fuji, Taj Mahal, Kinderdijk and Petra in a fully expanded garden with cherry groves, flower beds, stone promenades, fountains, pavilions, ponds and lanterns. All decorations use existing game assets and a validated ownership/crafting ledger. The full-page capture retains the DEMO label. It contains no real user save and is not a native Orca capture.

Regenerate and copy it with:

```sh
pnpm nx run landmark-island:ui-test --grep='Orcatopia showcase'
cp test-results/landmark-island/orcatopia-island-demo.png docs/screenshots/orcatopia-island.png
```

### Product introduction images

[English introduction](../../plugins/landmark-island/assets/orcatopia-introduction.png) and [Korean introduction](../../plugins/landmark-island/assets/orcatopia-introduction.ko.png) are 1600 × 1000 promotional compositions: an original island emblem, the Orcatopia name, a short product description and a real browser capture of the fixture garden. The screenshot retains an explicit DEMO label. The composition uses system fonts and local SVG/CSS; it includes no downloaded fonts or generated game imagery. The English image leads the English plugin README; the Korean image leads its Korean counterpart. Both are bundled under `assets/` so the same relative README links work after installation.

The reproducible layout is `plugins/landmark-island/tests/introduction.ts`; the showcase test captures the running game separately in each language before composing the images. The full-page screenshot uses Whole island; the introduction uses three Zoom in presses from that view to show the central garden more closely, in an upright frame. Both views show the same fully expanded fixture. The garden uses the maximum 318 land tiles, unlocked by twelve unique fixture collections. Five placed landmarks frame a central flower garden, a cherry grove, pond terraces, a windmill meadow and coastal walks. Low flower beds, shaded tree canopies and open lawn gaps reduce overlap in the central garden. All paid decorations use the normal ownership and crafting ledger. The showcase test checks full expansion and walking connectivity; this fixture does not modify a real island save.

```sh
pnpm nx run landmark-island:ui-test --grep='Orcatopia showcase'
cp test-results/landmark-island/orcatopia-introduction.png plugins/landmark-island/assets/orcatopia-introduction.png
cp test-results/landmark-island/orcatopia-introduction.ko.png plugins/landmark-island/assets/orcatopia-introduction.ko.png
cp test-results/landmark-island/orcatopia-island-demo.png docs/screenshots/orcatopia-island.png
pnpm nx run landmark-island:build
pnpm validate
```

These are local introduction assets; creating them does not publish a marketplace listing or update a release candidate.
