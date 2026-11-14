# Git Logs screenshots

English · [한국어](README.ko.md)

These images show the browser demo with English sample data. They do not contain real repository data and are not screenshots of the Orca host. Keep the DEMO label when using them.

| Image                                                | Contents                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| [git-logs-dark.png](git-logs-dark.png)               | Commit graph, commit details, changed files, and side-by-side diff in dark mode |
| [git-logs-light.png](git-logs-light.png)             | The same view in light mode                                                     |
| [git-logs-commit-menu.png](git-logs-commit-menu.png) | Commit context menu in dark mode                                                |
| [git-logs-hero.png](git-logs-hero.png)               | Product card with the dark capture in a frame, next to a title and short copy   |

All images are PNG files at 1600 × 1000 pixels. Authors, messages, paths, and code come from fixtures. Capturing them does not run Git commands or require Orca plugin execution approval.

## Capture the images

From the repository root, install dependencies and run:

```sh
pnpm install
pnpm nx run git-logs:screenshots
```

The target builds the plugin and writes these four images to `docs/screenshots/`. It uses an installed Google Chrome. To use Chromium, run `pnpm exec playwright install chromium`, then set `PW_CHANNEL=chromium`.

## Plugin page images

The manifest uses `git-logs-hero.png` as the cover, and the dark, light and commit menu captures as screenshots; the dark and light ones are tagged so Orca shows each with its matching theme. The icon is a 256 × 256 PNG rendered from `plugins/git-logs/showcase/icon.svg`, the same emblem as the product card, and is committed at `plugins/git-logs/assets/git-logs-icon.png`. The build copies the four captures from `docs/screenshots/` into the package's `assets/`, so each image is stored once in the repository. The manifest paths point at the packaged files, which do not exist in the source tree. The installed Orca validator checks dimensions and file sizes: `pnpm nx run git-logs:validate-plugin`.

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

[English introduction](../../plugins/orcatopia/assets/orcatopia-introduction.png) and [Korean introduction](../../plugins/orcatopia/assets/orcatopia-introduction.ko.png) are 1600 × 1000 promotional compositions: an original island emblem, the Orcatopia name, a short product description and a real browser capture of the fixture garden. The screenshot retains an explicit DEMO label. The composition uses system fonts and local SVG/CSS; it includes no downloaded fonts or generated game imagery. The English image leads the English plugin README; the Korean image leads its Korean counterpart. Both are bundled under `assets/` so the same relative README links work after installation.

The reproducible layout is `plugins/orcatopia/tests/introduction.ts`; the showcase test captures the running game separately in each language before composing the images. The full-page screenshot uses Whole island; the introduction uses three Zoom in presses from that view to show the central garden more closely, in an upright frame. Both views show the same fully expanded fixture. The garden uses the maximum 318 land tiles, unlocked by fifteen unique fixture collections (the maximum area is reached at twelve). Five placed landmarks frame a central flower garden, a cherry grove, pond terraces, a windmill meadow and coastal walks. Cherry ponds, a paved fountain court, a fern-and-stone woodland, a warm earth oasis and a tulip meadow have different planting palettes. Cypress, pine, maple and palm silhouettes break up the rounded canopies; earth paths connect to stone promenades. Low flower beds and lawn gaps preserve sight lines. All paid decorations use the normal ownership and crafting ledger. The showcase test checks full expansion and walking connectivity; this fixture does not modify a real island save.

```sh
pnpm nx run landmark-island:ui-test --grep='Orcatopia showcase'
cp test-results/landmark-island/orcatopia-introduction.png plugins/orcatopia/assets/orcatopia-introduction.png
cp test-results/landmark-island/orcatopia-introduction.ko.png plugins/orcatopia/assets/orcatopia-introduction.ko.png
cp test-results/landmark-island/orcatopia-icon.png plugins/orcatopia/assets/orcatopia-icon.png
cp test-results/landmark-island/orcatopia-island-demo.png plugins/orcatopia/assets/orcatopia-island.png
cp test-results/landmark-island/orcatopia-island-demo.png docs/screenshots/orcatopia-island.png
pnpm nx run landmark-island:build
pnpm validate
```

These are local introduction assets; creating them does not publish a marketplace listing or update a release candidate.

### Eight new countries

[Modern landmark artwork](orcatopia-modern-countries.png) shows the eight additions from Qatar, Azerbaijan, Kazakhstan, Bangladesh, Rwanda, Ghana, Panama and Uruguay. The DEMO contact sheet renders the bundled game artwork with English catalog labels. It is a browser fixture, not a photograph or native Orca capture. See the [research record](../modern-landmarks-research.md) for institutional sources.

```sh
pnpm nx run landmark-island:ui-test --grep='material artwork'
cp test-results/landmark-island/modern-landmarks-59-demo.png docs/screenshots/orcatopia-modern-countries.png
```

The manifest now uses the English introduction as its cover, the 256 × 256 PNG rendered from the same vector emblem as its icon, and the full English DEMO garden as its screenshot. Captures explicitly select sunny daytime, so device time does not change release artwork. Both introduction languages remain bundled. All image dimensions and file sizes are checked by the installed Orca validator.


## Current Orcatopia registration images

The current cover combines a validated water-island scene and enlarged Wonder-tier artwork. `?preview=showcase` switches between Sea & river, Wonders up close and SVG fusion, independently of saved browser progress. Use `pnpm nx run landmark-island:screenshots` for the current set; the older garden showcase above remains a separate fixture. Copy `orcatopia-introduction.png`, `orcatopia-introduction.ko.png`, `orcatopia-wonders.png` and `orcatopia-fusion.png` from `test-results/landmark-island/` into `plugins/orcatopia/assets/`; copy `orcatopia-island-demo.png` as `orcatopia-island.png`. Covers and screenshots are 1600 × 1000 and retain DEMO labels. The manifest includes English and Korean versions of the water scene, Wonder close-ups and fusion result (six images); the cover also has a Korean README variant. All imagery comes from local game SVG/CSS, with no external image assets. The fixture validates placement surfaces and craft quantities and tests unchanged browser saves.

The current resort fixture places 26 landmarks (10 at sea), 310 decorations and 80 river tiles. Multi-row river tiles form a continuous broad water surface. Repeated coastal palms, distinct woodland gardens, flower borders, resting places and offshore boats/corals use the normal ownership and funded crafting records.

The registration gallery now contains six images: the three English scenes followed by the three Korean scenes. The cover remains English. Regeneration also produces `orcatopia-island-demo.ko.png`, `orcatopia-wonders.ko.png` and `orcatopia-fusion.ko.png`; copy them to plugin assets, renaming the island image to `orcatopia-island.ko.png`. Images share a gallery and do not switch automatically by UI language.

For 0.4.0, copy regeneration outputs to `orcatopia-<scene>-v0.4.0[.ko].png` in plugin assets. The original unversioned introduction/island files remain unchanged for historical catalog image hashes. `docs/screenshots/orcatopia-island.png` is the current documentation copy.
