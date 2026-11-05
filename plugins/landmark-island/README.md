# Landmark Island

English · [한국어](README.ko.md)

An unpublished Orca plugin prototype. New worktree creation earns an exploration ticket: use it in the panel to discover a real landmark, then place it on your fictional 24 × 24 island world with 318 land tiles. Requires Orca 1.4.248+.

## Play

Open the Landmark Island panel. In **Explore island**, click grass to walk around buildings, or focus the island and use Arrow keys / WASD. On-screen direction buttons also work. The camera follows the explorer. Drag to pan freely; hover over the map and scroll to zoom at the pointer (12–180%), without clicking, focusing, or holding a modifier key. Scrolling outside the map still scrolls the page. Wheel zoom switches to the free camera without taking keyboard focus; **Follow explorer** resumes tracking. The + / − buttons and two-finger pinch also work. **Whole island** on the minimap fits the island into view; **Follow explorer** recenters on the character. Reset camera restores 100% zoom and following.

**Arrange landmarks** switches to editing. Selecting a collection card also enters this mode. Select an owned landmark and an empty cell to place it. Select a placed landmark, then an empty cell to move it, or **Return to collection** to remove it. Copies use owned quantities. **World Map** shows real geographic locations and unique country totals, regardless of island placements. Refresh reads the save without awarding anything.

There are 12 landmarks: 6 common, 3 rare, 2 epic and 1 legendary. Each draw first chooses a tier with 70/23/6/1 percent probabilities, then uniformly selects a landmark in that tier. Owned items always remain eligible; duplicates increase quantity. Tickets are earned only through worktree creation; there is no purchase, pity, or completion guarantee. Original miniature vector art is bundled locally.

Only `workspace.created` with `kind: worktree` earns one ticket. It does not draw a landmark automatically. Folder creation, chats, refreshes, workspace switching and app launch do not earn tickets. Use **Use ticket · Discover** in the panel whenever you want to redeem one. Unused tickets accumulate and survive restarts and worktree removal.

A sealed invitation opens into an illustrated atlas; a light traces a route and the landmark rises from the paper. Discovery / Treasure / Marvel / Wonder reveals take 3 / 3.4 / 4 / 4.6 seconds. Treasure adds blue light, Marvel violet mist, and Wonder golden orbiting stones and a moving miniature. **Skip animation** or Escape reveals the saved result immediately; reduced-motion preferences show it without waiting. The result shows country, rarity and owned quantity, with **Place on island** and **Keep exploring** actions. Escape closes the result.

The worker serializes ticket earning, draws and placements. Ticket identity is the workspace ID. A draw saves its result and ticket consumption together before animation; retrying the same ticket returns the existing reward, including after a lost response or worker restart. A failed storage write does not consume a ticket unless storage actually committed; retry safely recovers that outcome. Reloading during animation keeps the reward in the collection. UI animation never determines randomness. No event paths are accessed and no Git operations occur.

Schema v1 saves are validated and read as v2: existing receipts become already-redeemed tickets, preserving inventory, placements and worktree deduplication without extra tickets. The next successful mutation writes v2 under the existing storage key (`island-v1`, or `landmark-island-demo-v1` in the demo). Reads do not rewrite saves. Older builds cannot read the new schema.

## Rarity and collection progress

Each landmark has a fixed rarity: **I Discovery** (6 landmarks, 70% tier chance), **II Treasure** (3, 23%), **III Marvel** (2, 6%) or **IV Wonder** (1, 1%). Each badge has a Roman numeral and a four-slot scale: one filled mark is the lowest rarity, four is the highest. The same scale appears on cards, filters, field-guide pages and acquisition notices, with accessible labels such as “Wonder, rarity 4 of 4”. Color is an additional cue; unowned entries keep their full rarity scale. These are fixed ranks, not upgrade progress. The latest acquisition notice and field-guide page show the tier; the field guide explains its draw probability. These are tier probabilities, not the probability of each individual item: items within a tier remain equally likely.

The collection has All / Discovery / Treasure / Marvel / Wonder filters and a progress bar. Counts track unique discoveries, so duplicates increase owned quantities without advancing completion. Filters only change the visible collection entries and do not alter island mode, camera, placements or draw odds. Unowned entries retain their rarity badge and remain readable. Internal tier IDs remain `common`, `rare`, `epic` and `legendary`. All existing tier assignments, probabilities and saved quantities are unchanged; no pity or guaranteed completion has been added.

Owned Treasures gain a blue sheen and Marvels a violet halo. The current Wonder, the Great Pyramid of Giza, has a gold frame and a living miniature: the pyramid levitates above a grounded shadow while small stones and lights orbit it. This animation appears in the collection, its detail page and island placements. Unowned Wonders stay still. Reduced-motion preferences replace motion with a static floating pose and light effects. These are fictional visual effects; they do not change movement, placement, ownership or probabilities.

## Landmark field guide

Every collection entry shows its country separately from rarity. **About this landmark** opens a field-guide page with the country, region, a short historical description and an official reference link. All 12 entries can be read before acquisition, even if no copies are available to place. In **Explore island**, click a placed building or its ground tile to read its story; in **Arrange landmarks**, the same click selects it for moving as before. Reading never awards an item or changes a placement. Close with the × button or Escape; keyboard focus returns to the opener.

Descriptions are original English summaries checked against UNESCO, the Eiffel Tower operator, Rome tourism, APSARA and Egypt’s Ministry of Tourism and Antiquities on 2026-11-05. Reference URLs are stored separately from the existing Wikidata coordinate sources. Text is bundled for offline reading; opening a reference link requires a browser connection.

## Expanded land and existing saves

Original cell IDs 0–35 keep their identity and relative 6 × 6 layout at the center (columns/rows 9–14) of the larger map. New IDs address the surrounding terrain. Existing receipts and placements are read unchanged; there is no reset or coordinate migration. New land placements use the same serialized, versioned save and quantity checks. Water is rejected by the worker, not just hidden by the UI. Older plugin builds cannot read placements outside their 36-cell limit: use this build for expanded saves.

At default zoom the camera shows a local area of the island; use the minimap for an overview, then follow the explorer again. Movement and camera state are still session-only. No expansion purchases or unlock requirements are implemented.

## A living island

The woodland-adventure presentation keeps a paper-textured journal and uses deeper forest colors, a green-tunic explorer with a travel pack, mossy stones, and paving stones. Highland rock obstacles appear as weathered rune stones; their collision and placement rules are unchanged. Sunbeams, drifting motes and a trail lantern add ambient light, with weather/time-of-day variants and reduced-motion support. These are decorative scenery, not quests or collectible rewards. The collection is laid out as a field guide. All artwork and texture patterns are bundled vector/CSS assets; no fonts or images are fetched at runtime. Light and dark host classes use paper and dusk reading palettes respectively.

The fixed isometric world has a central landmark commons, woods, meadows, a lagoon and graded highland terraces. Tiles have visible side faces; the explorer, buildings and trees render in depth order so they can pass in front of or behind one another. The scene includes flowers, a sandy shoreline, drifting clouds and a bobbing boat. This is a local 2.5D vector scene, not a 3D physics engine. **Weather** offers Sunny, Cloudy, Rain and Snow. Auto cycles weather every 30 seconds and advances Day → Sunset → Night → Dawn every 60 seconds while the panel is visible. Select a manual weather option to stop automatic weather/time progression; the time-of-day button works in either mode. This is fictional weather, without location access, a forecast service, or runtime network calls.

Walking, camera and climate are session-only visual state: reopening/reloading resets them, while inventory and landmark layout remain saved. Walking never awards items or changes placements. Buildings block routes; a completely filled island has no walking space until a building is returned. Trees and rocks block walking; flowers are passable. Placing a landmark on vegetation replaces that decoration visually; removing it restores the vegetation. Pan/zoom is limited and can be reset. Background panels pause climate advancement. Reduced-motion preferences disable ambient animation and movement transitions. There is no sound.

## Local preview and verification

From the repository root:

```sh
pnpm nx run-many -t build typecheck test ui-test -p landmark-island
pnpm nx run landmark-island:preview
pnpm validate
```

Open http://127.0.0.1:43187. The browser is visibly labeled **DEMO**; **Demo worktree** simulates a creation event and earns one ticket. Then choose **Use ticket · Discover**. It uses only `landmark-island-demo-v1` in browser localStorage. Host mode has no manual ticket-grant button and reads/writes only through its own worker. Browser demo storage does not touch the Orca save. UI text is English in this prototype.

The packaged plugin is `dist/plugins/landmark-island`. It needs no runtime downloads. The build validates artifact policy; `pnpm validate` uses Orca's actual manifest validator. Node tests simulate concurrent and repeated events, restart persistence, failed storage, placement limits and worker delivery without panels. Browser tests exercise acquisition, duplicates, island edits, map counts, reloads, narrow layout and light/dark classes. These are fixtures, not live host evidence.

## Host access and limits

This is a trusted Node worker running with your OS account's access. Its declared capabilities are `workspace:read` and `storage:own`. It does not request Git writes, terminals, agents, notifications, or network services. Authorizing Git Logs does not authorize this identity.

**The plugin has not been loaded or approved in Orca.** After reviewing the artifact and explicitly authorizing execution, use `orca plugin dev load dist/plugins/landmark-island --json` and review the exact approval fingerprint/access returned by Orca. No approval has been performed by this implementation. Live verification must still create a new worktree with the panel closed, open the panel, restart the worker/app, and check that exactly one ticket appears, spend it in the panel, and confirm restart/repeated delivery does not add another ticket or draw. Disabled-event replay is not documented: events missed while disabled are not backfilled, and storage failures may lose an event unless it is delivered again. No historical workspace scan runs on launch.

One plugin-local collection is shared across repositories/worktrees on this host. It is an offline save, not a cloud account or backup. Clearing plugin data can lose it. Receipts are retained indefinitely for deduplication, so very large saves will eventually encounter host storage/response limits; archiving receipts is not implemented. Future schemas are refused rather than silently overwritten. Multiple independent worker processes writing the same store are outside the prototype contract; the queue assumes Orca's single worker per plugin. Multiple browser demo tabs are not coordinated.

Map data: [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/), public domain. Landmark coordinates: Wikidata CC0; entity source links are included in the bundled catalog. See [geography attribution](licenses/geography.txt). Geometry is generalized, and small countries may not appear. Fictional island cells are unrelated to geographic coordinates.

Deferred: decoration economy, further terrain expansion, cloud sync, trading, localization and a 120-landmark collection. Nothing is published.

## Verification record (2026-11-05)

- `pnpm nx run landmark-island:typecheck`: passed.
- `pnpm nx run landmark-island:test`: passed ticket/reward atomicity, concurrent deduplication, response-loss recovery, v1 migration without extra tickets, worker draw handling, and the worker/state assertions above, stable original cell addresses, water/boundary rejection, expanded placement persistence, and reachability of all unoccupied land around terrain obstacles.
- `pnpm nx run landmark-island:ui-test --output-style=static`: 15 browser tests passed, including ticket accumulation, explicit drawing, failed-save retry, repeated-click protection, animation skipping/reduced motion, reload during reveal, mobile results, direct placement, and live Wonder motion in all three views, unowned/static reduced-motion alternatives, unchanged saves, rarity filters, Wonder/Discovery acquisition badges, all four ordinal scales and accessible rank labels, duplicate-safe collection progress, all 12 country/description pages, unowned reading, modal keyboard/focus/mobile behavior, inspection versus building edits, unfocused pointer-anchored wheel zoom and outside-page scrolling, walking around buildings, depth order, keyboard controls, camera follow/pan/zoom/reset, minimap overview on narrow screens, automatic/manual climate, reduced motion, ownership isolation and persistence of both original and expanded land placements; screenshots inspected under `test-results/landmark-island/`.
- `pnpm nx run git-logs:build --skipNxCache --output-style=static`: passed with the shared builder; Git Logs source is unchanged. Its typecheck passed and its worker/artifact suite passed 49 tests.
- Git Logs UI regression run was attempted but its server timed out: port 4173 is occupied by an older preview in another worktree returning HTTP 404. That process was not stopped or changed.
- `pnpm validate`: both packaged manifests passed the installed Orca validator. `orca plugin inspect dist/plugins/landmark-island --json` reports valid and `needsApproval: true`.
- No real-host loading, execution approval, background lifecycle verification, push, merge or publication was performed.

Nx generator discovery found no Orca-specific generator. The installed Orca `worker-panel` scaffolder failed because its bundled `orca.d.ts` resource was missing. This plugin follows the existing Nx run-command build pattern and narrow API contracts from the installed authoring references.
