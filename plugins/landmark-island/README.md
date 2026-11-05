# Landmark Island

English · [한국어](README.ko.md)

An unpublished Orca plugin prototype. New worktree creation is an expedition: collect a real landmark, then place it on your fictional 24 × 24 island world with 318 land tiles. Requires Orca 1.4.248+.

## Play

Open the Landmark Island panel. In **Explore island**, click grass to walk around buildings, or focus the island and use Arrow keys / WASD. On-screen direction buttons also work. The camera follows the explorer. Drag to pan freely; hover over the map and scroll to zoom at the pointer (12–180%), without clicking, focusing, or holding a modifier key. Scrolling outside the map still scrolls the page. Wheel zoom switches to the free camera without taking keyboard focus; **Follow explorer** resumes tracking. The + / − buttons and two-finger pinch also work. **Whole island** on the minimap fits the island into view; **Follow explorer** recenters on the character. Reset camera restores 100% zoom and following.

**Arrange landmarks** switches to editing. Selecting a collection card also enters this mode. Select an owned landmark and an empty cell to place it. Select a placed landmark, then an empty cell to move it, or **Return to collection** to remove it. Copies use owned quantities. **World Map** shows real geographic locations and unique country totals, regardless of island placements. Refresh reads the save without awarding anything.

There are 12 landmarks: 6 common, 3 rare, 2 epic and 1 legendary. Each draw first chooses a tier with 70/23/6/1 percent probabilities, then uniformly selects a landmark in that tier. Owned items always remain eligible; duplicates increase quantity. There is no pity, currency, purchase, or completion guarantee. Original miniature vector art is bundled locally.

Only `workspace.created` with `kind: worktree` awards a reward. Folder creation, chats, refreshes, workspace switching and app launch do not. A single worker queue serializes receipts and placements. The schema-versioned save records one receipt per workspace ID, so repeated delivery and worker restarts do not award twice. Saved rewards survive worktree removal. No paths from events are accessed, and no Git operations occur.

## Expanded land and existing saves

Original cell IDs 0–35 keep their identity and relative 6 × 6 layout at the center (columns/rows 9–14) of the larger map. New IDs address the surrounding terrain. Existing receipts and placements are read unchanged; there is no reset or coordinate migration. New land placements use the same serialized, versioned save and quantity checks. Water is rejected by the worker, not just hidden by the UI. Older plugin builds cannot read placements outside their 36-cell limit: use this build for expanded saves.

At default zoom the camera shows a local area of the island; use the minimap for an overview, then follow the explorer again. Movement and camera state are still session-only. No expansion purchases or unlock requirements are implemented.

## A living island

The fixed isometric world has a central landmark commons, woods, meadows, a lagoon and graded highland terraces. Tiles have visible side faces; the explorer, buildings and trees render in depth order so they can pass in front of or behind one another. The scene includes flowers, a sandy shoreline, drifting clouds and a bobbing boat. This is a local 2.5D vector scene, not a 3D physics engine. **Weather** offers Sunny, Cloudy, Rain and Snow. Auto cycles weather every 30 seconds and advances Day → Sunset → Night → Dawn every 60 seconds while the panel is visible. Select a manual weather option to stop automatic weather/time progression; the time-of-day button works in either mode. This is fictional weather, without location access, a forecast service, or runtime network calls.

Walking, camera and climate are session-only visual state: reopening/reloading resets them, while inventory and landmark layout remain saved. Walking never awards items or changes placements. Buildings block routes; a completely filled island has no walking space until a building is returned. Trees and rocks block walking; flowers are passable. Placing a landmark on vegetation replaces that decoration visually; removing it restores the vegetation. Pan/zoom is limited and can be reset. Background panels pause climate advancement. Reduced-motion preferences disable ambient animation and movement transitions. There is no sound.

## Local preview and verification

From the repository root:

```sh
pnpm nx run-many -t build typecheck test ui-test -p landmark-island
pnpm nx run landmark-island:preview
pnpm validate
```

Open http://127.0.0.1:43187. The browser is visibly labeled **DEMO**; **Demo expedition** simulates a creation event. It uses only `landmark-island-demo-v1` in browser localStorage. Host mode has no manual reward button and reads/writes only through its own worker. Browser demo storage does not touch the Orca save. UI text is English in this prototype.

The packaged plugin is `dist/plugins/landmark-island`. It needs no runtime downloads. The build validates artifact policy; `pnpm validate` uses Orca's actual manifest validator. Node tests simulate concurrent and repeated events, restart persistence, failed storage, placement limits and worker delivery without panels. Browser tests exercise acquisition, duplicates, island edits, map counts, reloads, narrow layout and light/dark classes. These are fixtures, not live host evidence.

## Host access and limits

This is a trusted Node worker running with your OS account's access. Its declared capabilities are `workspace:read` and `storage:own`. It does not request Git writes, terminals, agents, notifications, or network services. Authorizing Git Logs does not authorize this identity.

**The plugin has not been loaded or approved in Orca.** After reviewing the artifact and explicitly authorizing execution, use `orca plugin dev load dist/plugins/landmark-island --json` and review the exact approval fingerprint/access returned by Orca. No approval has been performed by this implementation. Live verification must still create a new worktree with the panel closed, open the panel, restart the worker/app, and check that no extra reward appears. Disabled-event replay is not documented: events missed while disabled are not backfilled, and storage failures may lose an event unless it is delivered again. No historical workspace scan runs on launch.

One plugin-local collection is shared across repositories/worktrees on this host. It is an offline save, not a cloud account or backup. Clearing plugin data can lose it. Receipts are retained indefinitely for deduplication, so very large saves will eventually encounter host storage/response limits; archiving receipts is not implemented. Future schemas are refused rather than silently overwritten. Multiple independent worker processes writing the same store are outside the prototype contract; the queue assumes Orca's single worker per plugin. Multiple browser demo tabs are not coordinated.

Map data: [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/), public domain. Landmark coordinates: Wikidata CC0; entity source links are included in the bundled catalog. See [geography attribution](licenses/geography.txt). Geometry is generalized, and small countries may not appear. Fictional island cells are unrelated to geographic coordinates.

Deferred: decoration economy, further terrain expansion, cloud sync, trading, localization and a 120-landmark collection. Nothing is published.

## Verification record (2026-11-05)

- `pnpm nx run landmark-island:typecheck`: passed.
- `pnpm nx run landmark-island:test`: passed the worker/state assertions above, stable original cell addresses, water/boundary rejection, expanded placement persistence, and reachability of all unoccupied land around terrain obstacles.
- `pnpm nx run landmark-island:ui-test --output-style=static`: 8 browser tests passed, including unfocused pointer-anchored wheel zoom and outside-page scrolling, walking around buildings, depth order, keyboard controls, camera follow/pan/zoom/reset, minimap overview on narrow screens, automatic/manual climate, reduced motion, ownership isolation and persistence of both original and expanded land placements; screenshots inspected under `test-results/landmark-island/`.
- `pnpm nx run git-logs:build --skipNxCache --output-style=static`: passed with the shared builder; Git Logs source is unchanged. Its typecheck passed and its worker/artifact suite passed 49 tests.
- Git Logs UI regression run was attempted but its server timed out: port 4173 is occupied by an older preview in another worktree returning HTTP 404. That process was not stopped or changed.
- `pnpm validate`: both packaged manifests passed the installed Orca validator. `orca plugin inspect dist/plugins/landmark-island --json` reports valid and `needsApproval: true`.
- No real-host loading, execution approval, background lifecycle verification, push, merge or publication was performed.

Nx generator discovery found no Orca-specific generator. The installed Orca `worker-panel` scaffolder failed because its bundled `orca.d.ts` resource was missing. This plugin follows the existing Nx run-command build pattern and narrow API contracts from the installed authoring references.
