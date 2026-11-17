# Orcatopia 600-place catalog expansion

English · [한국어](orcatopia-600.ko.md)

The current 700-place catalog is documented in the [100-place water expansion](orcatopia-700.md). Counts and simulations below remain the historical 600-place record.

This records the development catalog, provenance and game contracts. It does not claim a public release or verification against actual user storage.

There are 600 distinct normal places and 600 fusion-only + variants. The original 306 places are retained and 294 are added, increasing collection country groupings from 103 to 146. New places use distinct UNESCO properties and do not reuse an existing property's identifier or add an alias of an existing location. Country counts describe collection groupings, not legal status.

| Tier      | Previous | Added | Total | Tier chance | Individual chance |
| --------- | -------: | ----: | ----: | ----------: | ----------------: |
| Discovery |      154 |   137 |   291 |         70% |          0.24055% |
| Treasure  |      119 |   124 |   243 |         23% |          0.09465% |
| Marvel    |       25 |    29 |    54 |          6% |          0.11111% |
| Wonder    |        8 |     4 |    12 |          1% |          0.08333% |

| Terrain    | Added | Total | Total by tier (Discovery/Treasure/Marvel/Wonder) |
| ---------- | ----: | ----: | ------------------------------------------------ |
| Land       |   217 |   504 | 254 / 201 / 40 / 9                               |
| River      |    34 |    41 | 17 / 17 / 6 / 1                                  |
| Sea        |    16 |    22 | 0 / 15 / 6 / 1                                   |
| Land & sea |    27 |    33 | 20 / 10 / 2 / 1                                  |

The 1,839 decorations comprise 1,226 themed pieces (600×2 plus 26 retained extra pieces from 13 earlier water-compatible landmarks), five free basics, four focal garden pieces, 600 fusion star monuments and four tourism buildings. Water-only pieces total 96×2=192. There are 613 normal-discovery gift IDs and 600 fusion-gift IDs: the 13 earlier compatible places retain both their garden and water gifts.

## Provenance and reproduction

Original records come from the official [UNESCO DataHub whc001](https://data.unesco.org/explore/dataset/whc001/) dataset. `scripts/data/orcatopia-heritage-294.json` retains official names, ISO alpha-2 country codes, representative component coordinates, record API URLs, retrieval date (2026-11-15), and SHA-256 checksums of the original short descriptions. `orcatopia-600.tsv` holds edited bilingual names, core features, terrain and tiers; `orcatopia-600-profiles.tsv` holds individual relative outline heights and structural motifs. Drawings are miniature interpretations, not surveyed models; animation scenes are fictional rather than historical claims. No UNESCO photos, logos or remote fonts are used. Adapted factual metadata and translations are attributed under CC BY-SA 4.0 in the plugin's `licenses/heritage.txt`.

Content review compares the original descriptions with the core features. Automated tests do not establish historical truth: they check counts, unique IDs/property numbers/official names, country-code format, coordinates, provenance linkage, translations, art/scenes, normal/+ and decoration classification. Broad or serial properties use the first listed component point and may not mark the illustrated facade. Some properties lie outside the state's mainland, including Ilulissat under Denmark. Small countries omitted from the low-resolution world polygons still have map points and country-list entries.

Run `node scripts/expand-orcatopia-catalog.mjs` to regenerate and `node scripts/analyze-orcatopia-catalog.mjs` to reproduce statistics and collection-speed estimates. Generation is offline and refuses a changed original-306 checksum. Normalized hashes also protect all 306 original complete SVG illustrations and scenes.

## Preservation and unlock-order integration

Existing IDs, bilingual metadata, sources, tiers, receipts, quantities, placements, fusion, decorations, open land and backups are retained. Expansion itself grants no rewards. The existing storage key and 1,044-tile cap at 100 unique discoveries remain unchanged. Integrated main uses schema v8 for tourism, preserving the cumulative discoveries and first-exploration records introduced in v7. Schemas v1–v7 remain readable; the first worker read writes the tourism baseline without backpay. Catalog expansion adds no migration of its own. Backups containing new IDs need a compatible later build. Exports use compact JSON with the same envelope and 256 KiB limit; existing indented backups remain readable. This avoids whitespace pushing a fully collected and paved island over the limit.

The merged unlock and tourism changes are integrated. River unlocks at 12 cumulative unique places and sea at 25; duplicates and + versions add no places, and locked themes are excluded from normal draws. `collectionTheme` reads the shared `water-themes.ts` catalog: coastal entries belong to sea collection even though they can also be placed on land. The 41 river candidates have tier counts 17 / 17 / 6 / 1, and the 55 sea/coastal candidates have 20 / 25 / 8 / 2. Both first-exploration pools therefore retain all four weights; the existing implementation rescales weights if a theme lacks a tier. Each one-time themed exploration spends one existing ticket, and restore/retry/fusion preservation checks cover the expanded candidates.

Fixed-pool 100,000-run baselines with seed 6257 reach 12/25 unique places after mean draws of 12.25/26.21 (old 306), 12.13/25.61 (unrestricted 600), and 12.15/25.71 (504-place land-only). These are comparison baselines, not the integrated unlock simulation. Using the actual integrated `draw` function in 10,000 runs with seed 6257, normal draws reach river/sea unlock after mean 12.15/25.66 tickets. Spending the first river exploration ticket immediately at 12 places gives 12.15/25.64 total tickets, including that guaranteed-theme ticket; the first sea exploration is available after reaching 25 and costs one additional ticket. These estimates assume every available ticket is spent, rather than elapsed work time. Fewer early duplicates do not imply faster full completion. No pity or threshold changes are introduced.

Browser verification uses fixtures only. Parallel worktrees can isolate the port with `ORCATOPIA_TEST_PORT=43207 pnpm nx run landmark-island:ui-test -- --workers=2`. Installation/execution approval, real user-state injection and public release are excluded.

The journal retains all 600 searchable cards but constructs each decorative SVG only when its card enters the visible scroll area. Cached drawing strings are reused on rerender; already shown cards retain their SVG while offscreen animations pause. Standalone preview still renders all 600 scenes for inspection. Localization skips textless decorative SVG branches while continuing to translate SVG text, accessibility labels and map titles. Browser tests cover first appearance, search, scrolling, refresh, normal/+ and live locale changes.

## 294 added places

| ID                   | Name                                   | Country code | Terrain    | Tier      | Original source                                     |
| -------------------- | -------------------------------------- | ------------ | ---------- | --------- | --------------------------------------------------- |
| `jam`                | Minaret of Jam                         | AF           | Land       | Treasure  | [UNESCO 211](https://whc.unesco.org/en/list/211/)   |
| `bamiyan`            | Bamiyan Valley                         | AF           | Land       | Marvel    | [UNESCO 208](https://whc.unesco.org/en/list/208/)   |
| `butrint`            | Butrint                                | AL           | Land       | Treasure  | [UNESCO 570](https://whc.unesco.org/en/list/570/)   |
| `berat`              | Berat and Gjirokastra                  | AL           | Land       | Discovery | [UNESCO 569](https://whc.unesco.org/en/list/569/)   |
| `haghpat`            | Haghpat and Sanahin Monasteries        | AM           | Land       | Treasure  | [UNESCO 777](https://whc.unesco.org/en/list/777/)   |
| `geghard`            | Geghard Monastery                      | AM           | Land       | Treasure  | [UNESCO 960](https://whc.unesco.org/en/list/960/)   |
| `zvartnots`          | Echmiatsin and Zvartnots               | AM           | Land       | Discovery | [UNESCO 1011](https://whc.unesco.org/en/list/1011/) |
| `bakuwalled`         | Walled City of Baku                    | AZ           | Land       | Treasure  | [UNESCO 958](https://whc.unesco.org/en/list/958/)   |
| `gobustan`           | Gobustan Rock Art                      | AZ           | Land       | Discovery | [UNESCO 1076](https://whc.unesco.org/en/list/1076/) |
| `sheki`              | Sheki Khan's Palace                    | AZ           | Land       | Treasure  | [UNESCO 1549](https://whc.unesco.org/en/list/1549/) |
| `visegrad`           | Višegrad Bridge                        | BA           | River      | Treasure  | [UNESCO 1260](https://whc.unesco.org/en/list/1260/) |
| `vjetrenica`         | Vjetrenica Cave                        | BA           | Land       | Discovery | [UNESCO 1673](https://whc.unesco.org/en/list/1673/) |
| `boyana`             | Boyana Church                          | BG           | Land       | Discovery | [UNESCO 42](https://whc.unesco.org/en/list/42/)     |
| `madara`             | Madara Rider                           | BG           | Land       | Discovery | [UNESCO 43](https://whc.unesco.org/en/list/43/)     |
| `kazanlak`           | Thracian Tomb of Kazanlak              | BG           | Land       | Discovery | [UNESCO 44](https://whc.unesco.org/en/list/44/)     |
| `ivanovo`            | Rock-Hewn Churches of Ivanovo          | BG           | Land       | Discovery | [UNESCO 45](https://whc.unesco.org/en/list/45/)     |
| `nessebar`           | Ancient Nessebar                       | BG           | Land & sea | Treasure  | [UNESCO 217](https://whc.unesco.org/en/list/217/)   |
| `srebarna`           | Srebarna Nature Reserve                | BG           | River      | Discovery | [UNESCO 219](https://whc.unesco.org/en/list/219/)   |
| `pirin`              | Pirin National Park                    | BG           | Land       | Treasure  | [UNESCO 225](https://whc.unesco.org/en/list/225/)   |
| `qalabahrain`        | Qal'at al-Bahrain                      | BH           | Land & sea | Discovery | [UNESCO 1192](https://whc.unesco.org/en/list/1192/) |
| `dilmunmounds`       | Dilmun Burial Mounds                   | BH           | Land       | Discovery | [UNESCO 1542](https://whc.unesco.org/en/list/1542/) |
| `mir`                | Mir Castle                             | BY           | Land       | Treasure  | [UNESCO 625](https://whc.unesco.org/en/list/625/)   |
| `nesvizh`            | Nesvizh Castle                         | BY           | Land       | Discovery | [UNESCO 1196](https://whc.unesco.org/en/list/1196/) |
| `paphos`             | Paphos                                 | CY           | Land       | Discovery | [UNESCO 79](https://whc.unesco.org/en/list/79/)     |
| `troodos`            | Painted Churches of Troodos            | CY           | Land       | Discovery | [UNESCO 351](https://whc.unesco.org/en/list/351/)   |
| `choirokoitia`       | Choirokoitia                           | CY           | Land       | Discovery | [UNESCO 848](https://whc.unesco.org/en/list/848/)   |
| `ceskykrumlov`       | Český Krumlov                          | CZ           | Land       | Treasure  | [UNESCO 617](https://whc.unesco.org/en/list/617/)   |
| `telc`               | Telč                                   | CZ           | Land       | Discovery | [UNESCO 621](https://whc.unesco.org/en/list/621/)   |
| `zelenahora`         | Zelená Hora Pilgrimage Church          | CZ           | Land       | Treasure  | [UNESCO 690](https://whc.unesco.org/en/list/690/)   |
| `kutnahora`          | Kutná Hora                             | CZ           | Land       | Treasure  | [UNESCO 732](https://whc.unesco.org/en/list/732/)   |
| `lednice`            | Lednice-Valtice                        | CZ           | Land       | Discovery | [UNESCO 763](https://whc.unesco.org/en/list/763/)   |
| `olomouc`            | Holy Trinity Column in Olomouc         | CZ           | Land       | Discovery | [UNESCO 859](https://whc.unesco.org/en/list/859/)   |
| `kromeriz`           | Kroměříž Gardens and Castle            | CZ           | Land       | Discovery | [UNESCO 860](https://whc.unesco.org/en/list/860/)   |
| `litomysl`           | Litomyšl Castle                        | CZ           | Land       | Discovery | [UNESCO 901](https://whc.unesco.org/en/list/901/)   |
| `mtskheta`           | Mtskheta Monuments                     | GE           | Land       | Treasure  | [UNESCO 708](https://whc.unesco.org/en/list/708/)   |
| `svaneti`            | Upper Svaneti                          | GE           | Land       | Treasure  | [UNESCO 709](https://whc.unesco.org/en/list/709/)   |
| `gelati`             | Gelati Monastery                       | GE           | Land       | Discovery | [UNESCO 710](https://whc.unesco.org/en/list/710/)   |
| `colchic`            | Colchic Rainforests and Wetlands       | GE           | River      | Discovery | [UNESCO 1616](https://whc.unesco.org/en/list/1616/) |
| `split`              | Diocletian's Palace at Split           | HR           | Land       | Treasure  | [UNESCO 97](https://whc.unesco.org/en/list/97/)     |
| `plitvice`           | Plitvice Lakes                         | HR           | River      | Marvel    | [UNESCO 98](https://whc.unesco.org/en/list/98/)     |
| `porec`              | Euphrasian Basilica at Poreč           | HR           | Land       | Discovery | [UNESCO 809](https://whc.unesco.org/en/list/809/)   |
| `trogir`             | Historic Trogir                        | HR           | Land & sea | Discovery | [UNESCO 810](https://whc.unesco.org/en/list/810/)   |
| `sibenik`            | Cathedral of St James in Šibenik       | HR           | Land       | Discovery | [UNESCO 963](https://whc.unesco.org/en/list/963/)   |
| `starigrad`          | Stari Grad Plain                       | HR           | Land       | Discovery | [UNESCO 1240](https://whc.unesco.org/en/list/1240/) |
| `holloko`            | Hollókő                                | HU           | Land       | Discovery | [UNESCO 401](https://whc.unesco.org/en/list/401/)   |
| `hortobagy`          | Hortobágy Puszta                       | HU           | Land       | Discovery | [UNESCO 474](https://whc.unesco.org/en/list/474/)   |
| `pannonhalma`        | Pannonhalma Abbey                      | HU           | Land       | Discovery | [UNESCO 758](https://whc.unesco.org/en/list/758/)   |
| `tokaj`              | Tokaj Wine Landscape                   | HU           | Land       | Discovery | [UNESCO 1063](https://whc.unesco.org/en/list/1063/) |
| `sulaimantoo`        | Sulaiman-Too                           | KG           | Land       | Treasure  | [UNESCO 1230](https://whc.unesco.org/en/list/1230/) |
| `yasawi`             | Mausoleum of Khoja Ahmed Yasawi        | KZ           | Land       | Treasure  | [UNESCO 1103](https://whc.unesco.org/en/list/1103/) |
| `tanbaly`            | Tanbaly Petroglyphs                    | KZ           | Land       | Discovery | [UNESCO 1145](https://whc.unesco.org/en/list/1145/) |
| `saryarka`           | Saryarka Steppe and Lakes              | KZ           | River      | Discovery | [UNESCO 1102](https://whc.unesco.org/en/list/1102/) |
| `vilnius`            | Vilnius Historic Centre                | LT           | Land       | Treasure  | [UNESCO 541](https://whc.unesco.org/en/list/541/)   |
| `kernave`            | Kernavė                                | LT           | Land       | Discovery | [UNESCO 1137](https://whc.unesco.org/en/list/1137/) |
| `kuldiga`            | Old Town of Kuldīga                    | LV           | Land       | Discovery | [UNESCO 1658](https://whc.unesco.org/en/list/1658/) |
| `durmitor`           | Durmitor National Park                 | ME           | Land       | Treasure  | [UNESCO 100](https://whc.unesco.org/en/list/100/)   |
| `kotor`              | Kotor Region                           | ME           | Land & sea | Treasure  | [UNESCO 125](https://whc.unesco.org/en/list/125/)   |
| `orkhon`             | Orkhon Valley                          | MN           | Land       | Discovery | [UNESCO 1081](https://whc.unesco.org/en/list/1081/) |
| `burkhankhaldun`     | Burkhan Khaldun Mountain               | MN           | Land       | Treasure  | [UNESCO 1440](https://whc.unesco.org/en/list/1440/) |
| `deerstones`         | Mongolian Deer Stones                  | MN           | Land       | Discovery | [UNESCO 1621](https://whc.unesco.org/en/list/1621/) |
| `sagarmatha`         | Sagarmatha National Park               | NP           | Land       | Wonder    | [UNESCO 120](https://whc.unesco.org/en/list/120/)   |
| `chitwan`            | Chitwan National Park                  | NP           | Land       | Treasure  | [UNESCO 284](https://whc.unesco.org/en/list/284/)   |
| `lumbini`            | Lumbini                                | NP           | Land       | Treasure  | [UNESCO 666](https://whc.unesco.org/en/list/666/)   |
| `bahla`              | Bahla Fort                             | OM           | Land       | Treasure  | [UNESCO 433](https://whc.unesco.org/en/list/433/)   |
| `bat`                | Bat, Al-Khutm and Al-Ayn               | OM           | Land       | Discovery | [UNESCO 434](https://whc.unesco.org/en/list/434/)   |
| `frankincense`       | Land of Frankincense                   | OM           | Land       | Discovery | [UNESCO 1010](https://whc.unesco.org/en/list/1010/) |
| `aflaj`              | Aflaj Irrigation Systems               | OM           | River      | Discovery | [UNESCO 1207](https://whc.unesco.org/en/list/1207/) |
| `moenjodaro`         | Moenjodaro                             | PK           | Land       | Marvel    | [UNESCO 138](https://whc.unesco.org/en/list/138/)   |
| `taxila`             | Taxila                                 | PK           | Land       | Treasure  | [UNESCO 139](https://whc.unesco.org/en/list/139/)   |
| `takhtibahi`         | Takht-i-Bahi                           | PK           | Land       | Discovery | [UNESCO 140](https://whc.unesco.org/en/list/140/)   |
| `rohtas`             | Rohtas Fort                            | PK           | Land       | Treasure  | [UNESCO 586](https://whc.unesco.org/en/list/586/)   |
| `krakow`             | Kraków Historic Centre                 | PL           | Land       | Treasure  | [UNESCO 29](https://whc.unesco.org/en/list/29/)     |
| `warsaw`             | Warsaw Historic Centre                 | PL           | Land       | Discovery | [UNESCO 30](https://whc.unesco.org/en/list/30/)     |
| `wieliczka`          | Wieliczka and Bochnia Salt Mines       | PL           | Land       | Treasure  | [UNESCO 32](https://whc.unesco.org/en/list/32/)     |
| `zamosc`             | Zamość                                 | PL           | Land       | Discovery | [UNESCO 564](https://whc.unesco.org/en/list/564/)   |
| `torun`              | Medieval Toruń                         | PL           | Land       | Discovery | [UNESCO 835](https://whc.unesco.org/en/list/835/)   |
| `malbork`            | Malbork Castle                         | PL           | Land       | Marvel    | [UNESCO 847](https://whc.unesco.org/en/list/847/)   |
| `centennialhall`     | Centennial Hall in Wrocław             | PL           | Land       | Discovery | [UNESCO 1165](https://whc.unesco.org/en/list/1165/) |
| `danubedelta`        | Danube Delta                           | RO           | River      | Treasure  | [UNESCO 588](https://whc.unesco.org/en/list/588/)   |
| `hurezi`             | Hurezi Monastery                       | RO           | Land       | Discovery | [UNESCO 597](https://whc.unesco.org/en/list/597/)   |
| `moldavia`           | Painted Churches of Moldavia           | RO           | Land       | Discovery | [UNESCO 598](https://whc.unesco.org/en/list/598/)   |
| `sighisoara`         | Sighișoara                             | RO           | Land       | Discovery | [UNESCO 902](https://whc.unesco.org/en/list/902/)   |
| `maramures`          | Wooden Churches of Maramureș           | RO           | Land       | Discovery | [UNESCO 904](https://whc.unesco.org/en/list/904/)   |
| `studenica`          | Studenica Monastery                    | RS           | Land       | Discovery | [UNESCO 389](https://whc.unesco.org/en/list/389/)   |
| `gamzigrad`          | Gamzigrad-Romuliana                    | RS           | Land       | Discovery | [UNESCO 1253](https://whc.unesco.org/en/list/1253/) |
| `skocjan`            | Škocjan Caves                          | SI           | River      | Marvel    | [UNESCO 390](https://whc.unesco.org/en/list/390/)   |
| `spis`               | Spiš Castle and Levoča                 | SK           | Land       | Treasure  | [UNESCO 620](https://whc.unesco.org/en/list/620/)   |
| `vlkolinec`          | Vlkolínec                              | SK           | Land       | Discovery | [UNESCO 622](https://whc.unesco.org/en/list/622/)   |
| `bardejov`           | Bardejov                               | SK           | Land       | Discovery | [UNESCO 973](https://whc.unesco.org/en/list/973/)   |
| `sarazm`             | Sarazm                                 | TJ           | Land       | Discovery | [UNESCO 1141](https://whc.unesco.org/en/list/1141/) |
| `pamirs`             | Tajik National Park                    | TJ           | Land       | Marvel    | [UNESCO 1252](https://whc.unesco.org/en/list/1252/) |
| `merv`               | Ancient Merv                           | TM           | Land       | Treasure  | [UNESCO 886](https://whc.unesco.org/en/list/886/)   |
| `kunyaurgench`       | Kunya-Urgench                          | TM           | Land       | Treasure  | [UNESCO 1199](https://whc.unesco.org/en/list/1199/) |
| `nisa`               | Parthian Fortresses of Nisa            | TM           | Land       | Discovery | [UNESCO 1242](https://whc.unesco.org/en/list/1242/) |
| `kyivsophia`         | Saint Sophia and Kyiv-Pechersk Lavra   | UA           | Land       | Treasure  | [UNESCO 527](https://whc.unesco.org/en/list/527/)   |
| `lviv`               | Lviv Historic Centre                   | UA           | Land       | Discovery | [UNESCO 865](https://whc.unesco.org/en/list/865/)   |
| `itchankala`         | Itchan Kala                            | UZ           | Land       | Treasure  | [UNESCO 543](https://whc.unesco.org/en/list/543/)   |
| `bukhara`            | Historic Bukhara                       | UZ           | Land       | Treasure  | [UNESCO 602](https://whc.unesco.org/en/list/602/)   |
| `shakhrisyabz`       | Shakhrisyabz                           | UZ           | Land       | Discovery | [UNESCO 885](https://whc.unesco.org/en/list/885/)   |
| `abomey`             | Royal Palaces of Abomey                | BJ           | Land       | Treasure  | [UNESCO 323](https://whc.unesco.org/en/list/323/)   |
| `loropeni`           | Ruins of Loropéni                      | BF           | Land       | Discovery | [UNESCO 1225](https://whc.unesco.org/en/list/1225/) |
| `tiebele`            | Royal Court of Tiébélé                 | BF           | Land       | Discovery | [UNESCO 1713](https://whc.unesco.org/en/list/1713/) |
| `virunga`            | Virunga National Park                  | CD           | Land       | Marvel    | [UNESCO 63](https://whc.unesco.org/en/list/63/)     |
| `okapi`              | Okapi Wildlife Reserve                 | CD           | Land       | Treasure  | [UNESCO 718](https://whc.unesco.org/en/list/718/)   |
| `odzala`             | Odzala-Kokoua Forest                   | CG           | Land       | Discovery | [UNESCO 692](https://whc.unesco.org/en/list/692/)   |
| `taiforest`          | Taï National Park                      | CI           | Land       | Discovery | [UNESCO 195](https://whc.unesco.org/en/list/195/)   |
| `grandbassam`        | Grand-Bassam                           | CI           | Land & sea | Discovery | [UNESCO 1322](https://whc.unesco.org/en/list/1322/) |
| `dja`                | Dja Faunal Reserve                     | CM           | Land       | Discovery | [UNESCO 407](https://whc.unesco.org/en/list/407/)   |
| `benihammad`         | Al Qal'a of Beni Hammad                | DZ           | Land       | Discovery | [UNESCO 102](https://whc.unesco.org/en/list/102/)   |
| `tassili`            | Tassili n'Ajjer                        | DZ           | Land       | Treasure  | [UNESCO 179](https://whc.unesco.org/en/list/179/)   |
| `mzab`               | M'Zab Valley                           | DZ           | Land       | Discovery | [UNESCO 188](https://whc.unesco.org/en/list/188/)   |
| `djemila`            | Djémila                                | DZ           | Land       | Discovery | [UNESCO 191](https://whc.unesco.org/en/list/191/)   |
| `tipasa`             | Tipasa                                 | DZ           | Land & sea | Discovery | [UNESCO 193](https://whc.unesco.org/en/list/193/)   |
| `asmara`             | Asmara                                 | ER           | Land       | Discovery | [UNESCO 1550](https://whc.unesco.org/en/list/1550/) |
| `fasilghebbi`        | Fasil Ghebbi                           | ET           | Land       | Treasure  | [UNESCO 19](https://whc.unesco.org/en/list/19/)     |
| `harar`              | Harar Jugol                            | ET           | Land       | Discovery | [UNESCO 1189](https://whc.unesco.org/en/list/1189/) |
| `balemountains`      | Bale Mountains                         | ET           | Land       | Treasure  | [UNESCO 111](https://whc.unesco.org/en/list/111/)   |
| `asante`             | Asante Traditional Buildings           | GH           | Land       | Discovery | [UNESCO 35](https://whc.unesco.org/en/list/35/)     |
| `mountkenya`         | Mount Kenya                            | KE           | Land       | Treasure  | [UNESCO 800](https://whc.unesco.org/en/list/800/)   |
| `turkana`            | Lake Turkana                           | KE           | River      | Treasure  | [UNESCO 801](https://whc.unesco.org/en/list/801/)   |
| `lamu`               | Lamu Old Town                          | KE           | Land & sea | Discovery | [UNESCO 1055](https://whc.unesco.org/en/list/1055/) |
| `fortjesus`          | Fort Jesus                             | KE           | Land & sea | Discovery | [UNESCO 1295](https://whc.unesco.org/en/list/1295/) |
| `thimlich`           | Thimlich Ohinga                        | KE           | Land       | Discovery | [UNESCO 1450](https://whc.unesco.org/en/list/1450/) |
| `ambohimanga`        | Royal Hill of Ambohimanga              | MG           | Land       | Discovery | [UNESCO 950](https://whc.unesco.org/en/list/950/)   |
| `atsinanana`         | Atsinanana Rainforests                 | MG           | Land       | Treasure  | [UNESCO 1257](https://whc.unesco.org/en/list/1257/) |
| `timbuktu`           | Timbuktu                               | ML           | Land       | Treasure  | [UNESCO 119](https://whc.unesco.org/en/list/119/)   |
| `bandiagara`         | Cliff of Bandiagara                    | ML           | Land       | Treasure  | [UNESCO 516](https://whc.unesco.org/en/list/516/)   |
| `askia`              | Tomb of Askia                          | ML           | Land       | Discovery | [UNESCO 1139](https://whc.unesco.org/en/list/1139/) |
| `bancarguin`         | Banc d'Arguin                          | MR           | Sea        | Treasure  | [UNESCO 506](https://whc.unesco.org/en/list/506/)   |
| `lemorne`            | Le Morne                               | MU           | Land       | Treasure  | [UNESCO 1259](https://whc.unesco.org/en/list/1259/) |
| `lakemalawi`         | Lake Malawi National Park              | MW           | River      | Discovery | [UNESCO 289](https://whc.unesco.org/en/list/289/)   |
| `mozambiqueisland`   | Island of Mozambique                   | MZ           | Land & sea | Discovery | [UNESCO 599](https://whc.unesco.org/en/list/599/)   |
| `twyfelfontein`      | Twyfelfontein                          | NA           | Land       | Discovery | [UNESCO 1255](https://whc.unesco.org/en/list/1255/) |
| `agadez`             | Agadez                                 | NE           | Land       | Discovery | [UNESCO 1268](https://whc.unesco.org/en/list/1268/) |
| `osunosogbo`         | Osun-Osogbo Sacred Grove               | NG           | Land       | Discovery | [UNESCO 1118](https://whc.unesco.org/en/list/1118/) |
| `aldabra`            | Aldabra Atoll                          | SC           | Sea        | Marvel    | [UNESCO 185](https://whc.unesco.org/en/list/185/)   |
| `valleedemai`        | Vallée de Mai                          | SC           | Land       | Discovery | [UNESCO 261](https://whc.unesco.org/en/list/261/)   |
| `sanganeb`           | Sanganeb Marine Parks                  | SD           | Sea        | Treasure  | [UNESCO 262](https://whc.unesco.org/en/list/262/)   |
| `djoudj`             | Djoudj Bird Sanctuary                  | SN           | River      | Discovery | [UNESCO 25](https://whc.unesco.org/en/list/25/)     |
| `saintlouis`         | Island of Saint-Louis                  | SN           | River      | Discovery | [UNESCO 956](https://whc.unesco.org/en/list/956/)   |
| `saloum`             | Saloum Delta                           | SN           | River      | Treasure  | [UNESCO 1359](https://whc.unesco.org/en/list/1359/) |
| `ounianga`           | Lakes of Ounianga                      | TD           | River      | Treasure  | [UNESCO 1400](https://whc.unesco.org/en/list/1400/) |
| `ennedi`             | Ennedi Massif                          | TD           | Land       | Treasure  | [UNESCO 1475](https://whc.unesco.org/en/list/1475/) |
| `ichkeul`            | Ichkeul National Park                  | TN           | River      | Discovery | [UNESCO 8](https://whc.unesco.org/en/list/8/)       |
| `kilwa`              | Kilwa Kisiwani and Songo Mnara         | TZ           | Land & sea | Discovery | [UNESCO 144](https://whc.unesco.org/en/list/144/)   |
| `bwindi`             | Bwindi Impenetrable Forest             | UG           | Land       | Marvel    | [UNESCO 682](https://whc.unesco.org/en/list/682/)   |
| `rwenzori`           | Rwenzori Mountains                     | UG           | Land       | Treasure  | [UNESCO 684](https://whc.unesco.org/en/list/684/)   |
| `capefloral`         | Cape Floral Region                     | ZA           | Land       | Treasure  | [UNESCO 1007](https://whc.unesco.org/en/list/1007/) |
| `mapungubwe`         | Mapungubwe                             | ZA           | Land       | Discovery | [UNESCO 1099](https://whc.unesco.org/en/list/1099/) |
| `manapools`          | Mana Pools                             | ZW           | River      | Treasure  | [UNESCO 302](https://whc.unesco.org/en/list/302/)   |
| `matobo`             | Matobo Hills                           | ZW           | Land       | Discovery | [UNESCO 306](https://whc.unesco.org/en/list/306/)   |
| `khami`              | Khami Ruins                            | ZW           | Land       | Discovery | [UNESCO 365](https://whc.unesco.org/en/list/365/)   |
| `antiguadockyard`    | Antigua Naval Dockyard                 | AG           | Land & sea | Discovery | [UNESCO 1499](https://whc.unesco.org/en/list/1499/) |
| `bridgetown`         | Historic Bridgetown                    | BB           | Land & sea | Discovery | [UNESCO 1376](https://whc.unesco.org/en/list/1376/) |
| `potosi`             | Potosí                                 | BO           | Land       | Treasure  | [UNESCO 420](https://whc.unesco.org/en/list/420/)   |
| `sucre`              | Historic Sucre                         | BO           | Land       | Discovery | [UNESCO 566](https://whc.unesco.org/en/list/566/)   |
| `samaipata`          | Fuerte de Samaipata                    | BO           | Land       | Discovery | [UNESCO 883](https://whc.unesco.org/en/list/883/)   |
| `noelkempff`         | Noel Kempff Mercado                    | BO           | Land       | Discovery | [UNESCO 967](https://whc.unesco.org/en/list/967/)   |
| `olinda`             | Historic Olinda                        | BR           | Land       | Discovery | [UNESCO 189](https://whc.unesco.org/en/list/189/)   |
| `congonhas`          | Bom Jesus do Congonhas                 | BR           | Land       | Treasure  | [UNESCO 334](https://whc.unesco.org/en/list/334/)   |
| `pantanal`           | Pantanal Conservation Area             | BR           | River      | Treasure  | [UNESCO 999](https://whc.unesco.org/en/list/999/)   |
| `fernandonoronha`    | Fernando de Noronha and Atol das Rocas | BR           | Sea        | Treasure  | [UNESCO 1000](https://whc.unesco.org/en/list/1000/) |
| `lencois`            | Lençóis Maranhenses                    | BR           | River      | Marvel    | [UNESCO 1611](https://whc.unesco.org/en/list/1611/) |
| `pampulha`           | Pampulha Modern Ensemble               | BR           | Land       | Discovery | [UNESCO 1493](https://whc.unesco.org/en/list/1493/) |
| `lanseauxmeadows`    | L'Anse aux Meadows                     | CA           | Land       | Treasure  | [UNESCO 4](https://whc.unesco.org/en/list/4/)       |
| `sgang`              | SGang Gwaay                            | CA           | Land & sea | Discovery | [UNESCO 157](https://whc.unesco.org/en/list/157/)   |
| `woodbuffalo`        | Wood Buffalo National Park             | CA           | Land       | Discovery | [UNESCO 256](https://whc.unesco.org/en/list/256/)   |
| `oldquebec`          | Old Québec                             | CA           | Land       | Treasure  | [UNESCO 300](https://whc.unesco.org/en/list/300/)   |
| `rideau`             | Rideau Canal                           | CA           | River      | Discovery | [UNESCO 1221](https://whc.unesco.org/en/list/1221/) |
| `joggins`            | Joggins Fossil Cliffs                  | CA           | Land & sea | Discovery | [UNESCO 1285](https://whc.unesco.org/en/list/1285/) |
| `humberstone`        | Humberstone and Santa Laura            | CL           | Land       | Discovery | [UNESCO 1178](https://whc.unesco.org/en/list/1178/) |
| `sewell`             | Sewell Mining Town                     | CL           | Land       | Discovery | [UNESCO 1214](https://whc.unesco.org/en/list/1214/) |
| `mompox`             | Santa Cruz de Mompox                   | CO           | River      | Discovery | [UNESCO 742](https://whc.unesco.org/en/list/742/)   |
| `sanagustin`         | San Agustín Archaeological Park        | CO           | Land       | Treasure  | [UNESCO 744](https://whc.unesco.org/en/list/744/)   |
| `chiribiquete`       | Chiribiquete National Park             | CO           | Land       | Marvel    | [UNESCO 1174](https://whc.unesco.org/en/list/1174/) |
| `cocosisland`        | Cocos Island                           | CR           | Sea        | Treasure  | [UNESCO 820](https://whc.unesco.org/en/list/820/)   |
| `diquis`             | Diquís Stone Spheres                   | CR           | Land       | Discovery | [UNESCO 1453](https://whc.unesco.org/en/list/1453/) |
| `havana`             | Old Havana                             | CU           | Land & sea | Treasure  | [UNESCO 204](https://whc.unesco.org/en/list/204/)   |
| `vinales`            | Viñales Valley                         | CU           | Land       | Treasure  | [UNESCO 840](https://whc.unesco.org/en/list/840/)   |
| `sanpedroroca`       | San Pedro de la Roca Castle            | CU           | Land & sea | Discovery | [UNESCO 841](https://whc.unesco.org/en/list/841/)   |
| `mornetrois`         | Morne Trois Pitons                     | DM           | Land       | Treasure  | [UNESCO 814](https://whc.unesco.org/en/list/814/)   |
| `santodomingo`       | Colonial Santo Domingo                 | DO           | Land       | Discovery | [UNESCO 526](https://whc.unesco.org/en/list/526/)   |
| `galapagos`          | Galápagos Islands                      | EC           | Sea        | Wonder    | [UNESCO 1](https://whc.unesco.org/en/list/1/)       |
| `sangay`             | Sangay National Park                   | EC           | Land       | Treasure  | [UNESCO 260](https://whc.unesco.org/en/list/260/)   |
| `antiguaguatemala`   | Antigua Guatemala                      | GT           | Land       | Discovery | [UNESCO 65](https://whc.unesco.org/en/list/65/)     |
| `quirigua`           | Quiriguá                               | GT           | Land       | Discovery | [UNESCO 149](https://whc.unesco.org/en/list/149/)   |
| `rioplatano`         | Río Plátano Biosphere Reserve          | HN           | Land       | Discovery | [UNESCO 196](https://whc.unesco.org/en/list/196/)   |
| `pitons`             | Saint Lucia Pitons                     | LC           | Land & sea | Treasure  | [UNESCO 1161](https://whc.unesco.org/en/list/1161/) |
| `eltajin`            | El Tajín                               | MX           | Land       | Treasure  | [UNESCO 631](https://whc.unesco.org/en/list/631/)   |
| `paquime`            | Paquimé                                | MX           | Land       | Discovery | [UNESCO 560](https://whc.unesco.org/en/list/560/)   |
| `vizcaino`           | El Vizcaíno Whale Sanctuary            | MX           | Sea        | Treasure  | [UNESCO 554](https://whc.unesco.org/en/list/554/)   |
| `xochicalco`         | Xochicalco                             | MX           | Land       | Discovery | [UNESCO 939](https://whc.unesco.org/en/list/939/)   |
| `monarch`            | Monarch Butterfly Reserve              | MX           | Land       | Treasure  | [UNESCO 1290](https://whc.unesco.org/en/list/1290/) |
| `pinacate`           | El Pinacate and Gran Desierto          | MX           | Land       | Marvel    | [UNESCO 1410](https://whc.unesco.org/en/list/1410/) |
| `padretembleque`     | Padre Tembleque Aqueduct               | MX           | River      | Discovery | [UNESCO 1463](https://whc.unesco.org/en/list/1463/) |
| `coiba`              | Coiba National Park                    | PA           | Sea        | Treasure  | [UNESCO 1138](https://whc.unesco.org/en/list/1138/) |
| `chavin`             | Chavín                                 | PE           | Land       | Treasure  | [UNESCO 330](https://whc.unesco.org/en/list/330/)   |
| `huascaran`          | Huascarán National Park                | PE           | Land       | Treasure  | [UNESCO 333](https://whc.unesco.org/en/list/333/)   |
| `caral`              | Sacred City of Caral-Supe              | PE           | Land       | Marvel    | [UNESCO 1269](https://whc.unesco.org/en/list/1269/) |
| `chankillo`          | Chankillo                              | PE           | Land       | Treasure  | [UNESCO 1624](https://whc.unesco.org/en/list/1624/) |
| `paramaribo`         | Paramaribo Historic Centre             | SR           | Land       | Discovery | [UNESCO 940](https://whc.unesco.org/en/list/940/)   |
| `redwood`            | Redwood National and State Parks       | US           | Land       | Treasure  | [UNESCO 134](https://whc.unesco.org/en/list/134/)   |
| `olympic`            | Olympic National Park                  | US           | Land       | Treasure  | [UNESCO 151](https://whc.unesco.org/en/list/151/)   |
| `cahokia`            | Cahokia Mounds                         | US           | Land       | Discovery | [UNESCO 198](https://whc.unesco.org/en/list/198/)   |
| `hawaiivolcanoes`    | Hawaii Volcanoes                       | US           | Land       | Marvel    | [UNESCO 409](https://whc.unesco.org/en/list/409/)   |
| `colonia`            | Colonia del Sacramento                 | UY           | Land & sea | Discovery | [UNESCO 747](https://whc.unesco.org/en/list/747/)   |
| `canaima`            | Canaima National Park                  | VE           | River      | Wonder    | [UNESCO 701](https://whc.unesco.org/en/list/701/)   |
| `kakadu`             | Kakadu National Park                   | AU           | River      | Treasure  | [UNESCO 147](https://whc.unesco.org/en/list/147/)   |
| `uluru`              | Uluru-Kata Tjuta                       | AU           | Land       | Wonder    | [UNESCO 447](https://whc.unesco.org/en/list/447/)   |
| `sharkbay`           | Shark Bay                              | AU           | Sea        | Treasure  | [UNESCO 578](https://whc.unesco.org/en/list/578/)   |
| `bluemountains`      | Greater Blue Mountains                 | AU           | Land       | Treasure  | [UNESCO 917](https://whc.unesco.org/en/list/917/)   |
| `purnululu`          | Purnululu                              | AU           | Land       | Marvel    | [UNESCO 1094](https://whc.unesco.org/en/list/1094/) |
| `ningaloo`           | Ningaloo Coast                         | AU           | Sea        | Treasure  | [UNESCO 1369](https://whc.unesco.org/en/list/1369/) |
| `tongariro`          | Tongariro National Park                | NZ           | Land       | Marvel    | [UNESCO 421](https://whc.unesco.org/en/list/421/)   |
| `tewahipounamu`      | Te Wahipounamu                         | NZ           | Land & sea | Treasure  | [UNESCO 551](https://whc.unesco.org/en/list/551/)   |
| `levuka`             | Levuka Historical Port Town            | FJ           | Land & sea | Discovery | [UNESCO 1399](https://whc.unesco.org/en/list/1399/) |
| `roimata`            | Chief Roi Mata's Domain                | VU           | Land & sea | Discovery | [UNESCO 1280](https://whc.unesco.org/en/list/1280/) |
| `eastrennell`        | East Rennell                           | SB           | Sea        | Treasure  | [UNESCO 854](https://whc.unesco.org/en/list/854/)   |
| `kuk`                | Kuk Early Agricultural Site            | PG           | Land       | Discovery | [UNESCO 887](https://whc.unesco.org/en/list/887/)   |
| `bagerhat`           | Mosque City of Bagerhat                | BD           | Land       | Discovery | [UNESCO 321](https://whc.unesco.org/en/list/321/)   |
| `paharpur`           | Somapura Mahavihara at Paharpur        | BD           | Land       | Treasure  | [UNESCO 322](https://whc.unesco.org/en/list/322/)   |
| `preahvihear`        | Temple of Preah Vihear                 | KH           | Land       | Treasure  | [UNESCO 1224](https://whc.unesco.org/en/list/1224/) |
| `kohker`             | Koh Ker                                | KH           | Land       | Treasure  | [UNESCO 1667](https://whc.unesco.org/en/list/1667/) |
| `komodo`             | Komodo National Park                   | ID           | Sea        | Marvel    | [UNESCO 609](https://whc.unesco.org/en/list/609/)   |
| `prambanan`          | Prambanan Temple Compounds             | ID           | Land       | Treasure  | [UNESCO 642](https://whc.unesco.org/en/list/642/)   |
| `balisubak`          | Bali Subak Landscape                   | ID           | River      | Treasure  | [UNESCO 1194](https://whc.unesco.org/en/list/1194/) |
| `kinabalu`           | Kinabalu Park                          | MY           | Land       | Treasure  | [UNESCO 1012](https://whc.unesco.org/en/list/1012/) |
| `gunungmulu`         | Gunung Mulu                            | MY           | Land       | Marvel    | [UNESCO 1013](https://whc.unesco.org/en/list/1013/) |
| `puertoprincesa`     | Puerto-Princesa Subterranean River     | PH           | River      | Treasure  | [UNESCO 652](https://whc.unesco.org/en/list/652/)   |
| `tubbataha`          | Tubbataha Reefs                        | PH           | Sea        | Marvel    | [UNESCO 653](https://whc.unesco.org/en/list/653/)   |
| `cordilleraterraces` | Philippine Cordilleras Rice Terraces   | PH           | River      | Treasure  | [UNESCO 722](https://whc.unesco.org/en/list/722/)   |
| `hue`                | Hué Monuments                          | VN           | Land       | Treasure  | [UNESCO 678](https://whc.unesco.org/en/list/678/)   |
| `hoian`              | Hoi An                                 | VN           | Land       | Discovery | [UNESCO 948](https://whc.unesco.org/en/list/948/)   |
| `trangan`            | Trang An                               | VN           | River      | Marvel    | [UNESCO 1438](https://whc.unesco.org/en/list/1438/) |
| `anuradhapura`       | Anuradhapura                           | LK           | Land       | Treasure  | [UNESCO 200](https://whc.unesco.org/en/list/200/)   |
| `galle`              | Galle Fort                             | LK           | Land & sea | Discovery | [UNESCO 451](https://whc.unesco.org/en/list/451/)   |
| `dambulla`           | Dambulla Cave Temple                   | LK           | Land       | Treasure  | [UNESCO 561](https://whc.unesco.org/en/list/561/)   |
| `gyeongju`           | Gyeongju Historic Areas                | KR           | Land       | Treasure  | [UNESCO 976](https://whc.unesco.org/en/list/976/)   |
| `hahoeyangdong`      | Hahoe and Yangdong Villages            | KR           | Land       | Discovery | [UNESCO 1324](https://whc.unesco.org/en/list/1324/) |
| `namhansanseong`     | Namhansanseong                         | KR           | Land       | Treasure  | [UNESCO 1439](https://whc.unesco.org/en/list/1439/) |
| `seowon`             | Seowon Academies                       | KR           | Land       | Discovery | [UNESCO 1498](https://whc.unesco.org/en/list/1498/) |
| `qinmausoleum`       | First Qin Emperor's Mausoleum          | CN           | Land       | Marvel    | [UNESCO 441](https://whc.unesco.org/en/list/441/)   |
| `pingyao`            | Ancient Ping Yao                       | CN           | Land       | Discovery | [UNESCO 812](https://whc.unesco.org/en/list/812/)   |
| `yungang`            | Yungang Grottoes                       | CN           | Land       | Marvel    | [UNESCO 1039](https://whc.unesco.org/en/list/1039/) |
| `westlake`           | West Lake of Hangzhou                  | CN           | River      | Treasure  | [UNESCO 1334](https://whc.unesco.org/en/list/1334/) |
| `haniterraces`       | Honghe Hani Rice Terraces              | CN           | River      | Treasure  | [UNESCO 1111](https://whc.unesco.org/en/list/1111/) |
| `pattadakal`         | Pattadakal                             | IN           | Land       | Discovery | [UNESCO 239](https://whc.unesco.org/en/list/239/)   |
| `shivajiterminus`    | Chhatrapati Shivaji Terminus           | IN           | Land       | Treasure  | [UNESCO 945](https://whc.unesco.org/en/list/945/)   |
| `nalanda`            | Nalanda Mahavihara                     | IN           | Land       | Treasure  | [UNESCO 1502](https://whc.unesco.org/en/list/1502/) |
| `bam`                | Bam and its Cultural Landscape         | IR           | Land       | Treasure  | [UNESCO 1208](https://whc.unesco.org/en/list/1208/) |
| `shushtar`           | Shushtar Hydraulic System              | IR           | River      | Treasure  | [UNESCO 1315](https://whc.unesco.org/en/list/1315/) |
| `gonbadeqabus`       | Gonbad-e Qābus                         | IR           | Land       | Discovery | [UNESCO 1398](https://whc.unesco.org/en/list/1398/) |
| `cappadocia`         | Göreme and Cappadocia                  | TR           | Land       | Marvel    | [UNESCO 357](https://whc.unesco.org/en/list/357/)   |
| `nemrut`             | Nemrut Dağ                             | TR           | Land       | Treasure  | [UNESCO 448](https://whc.unesco.org/en/list/448/)   |
| `pamukkale`          | Hierapolis-Pamukkale                   | TR           | River      | Marvel    | [UNESCO 485](https://whc.unesco.org/en/list/485/)   |
| `troy`               | Troy                                   | TR           | Land       | Treasure  | [UNESCO 849](https://whc.unesco.org/en/list/849/)   |
| `baalbek`            | Baalbek                                | LB           | Land       | Marvel    | [UNESCO 294](https://whc.unesco.org/en/list/294/)   |
| `byblos`             | Byblos                                 | LB           | Land & sea | Treasure  | [UNESCO 295](https://whc.unesco.org/en/list/295/)   |
| `quseiramra`         | Quseir Amra                            | JO           | Land       | Discovery | [UNESCO 327](https://whc.unesco.org/en/list/327/)   |
| `wadirum`            | Wadi Rum                               | JO           | Land       | Marvel    | [UNESCO 1377](https://whc.unesco.org/en/list/1377/) |
| `atturaif`           | At-Turaif                              | SA           | Land       | Discovery | [UNESCO 1329](https://whc.unesco.org/en/list/1329/) |
| `alahsa`             | Al-Ahsa Oasis                          | SA           | Land       | Treasure  | [UNESCO 1563](https://whc.unesco.org/en/list/1563/) |
| `alzubarah`          | Al Zubarah                             | QA           | Land       | Discovery | [UNESCO 1402](https://whc.unesco.org/en/list/1402/) |
| `alain`              | Al Ain Cultural Sites                  | AE           | Land       | Discovery | [UNESCO 1343](https://whc.unesco.org/en/list/1343/) |
| `shirakami`          | Shirakami-Sanchi                       | JP           | Land       | Discovery | [UNESCO 663](https://whc.unesco.org/en/list/663/)   |
| `ogasawara`          | Ogasawara Islands                      | JP           | Sea        | Treasure  | [UNESCO 1362](https://whc.unesco.org/en/list/1362/) |
| `tomioka`            | Tomioka Silk Mill                      | JP           | Land       | Discovery | [UNESCO 1449](https://whc.unesco.org/en/list/1449/) |
| `salzburg`           | Historic Salzburg                      | AT           | Land       | Treasure  | [UNESCO 784](https://whc.unesco.org/en/list/784/)   |
| `hallstatt`          | Hallstatt-Dachstein                    | AT           | River      | Treasure  | [UNESCO 806](https://whc.unesco.org/en/list/806/)   |
| `berne`              | Old City of Berne                      | CH           | Land       | Discovery | [UNESCO 267](https://whc.unesco.org/en/list/267/)   |
| `stgall`             | Abbey of St Gall                       | CH           | Land       | Treasure  | [UNESCO 268](https://whc.unesco.org/en/list/268/)   |
| `wurzburg`           | Würzburg Residence                     | DE           | Land       | Treasure  | [UNESCO 169](https://whc.unesco.org/en/list/169/)   |
| `trier`              | Roman Monuments of Trier               | DE           | Land       | Discovery | [UNESCO 367](https://whc.unesco.org/en/list/367/)   |
| `speicherstadt`      | Speicherstadt and Kontorhaus           | DE           | River      | Discovery | [UNESCO 1467](https://whc.unesco.org/en/list/1467/) |
| `kronborg`           | Kronborg Castle                        | DK           | Land & sea | Treasure  | [UNESCO 696](https://whc.unesco.org/en/list/696/)   |
| `ilulissat`          | Ilulissat Icefjord                     | DK           | Sea        | Marvel    | [UNESCO 1149](https://whc.unesco.org/en/list/1149/) |
| `suomenlinna`        | Suomenlinna Fortress                   | FI           | Land & sea | Treasure  | [UNESCO 583](https://whc.unesco.org/en/list/583/)   |
| `rauma`              | Old Rauma                              | FI           | Land       | Discovery | [UNESCO 582](https://whc.unesco.org/en/list/582/)   |
| `orangetheatre`      | Roman Theatre of Orange                | FR           | Land       | Treasure  | [UNESCO 163](https://whc.unesco.org/en/list/163/)   |
| `cordouan`           | Cordouan Lighthouse                    | FR           | Sea        | Treasure  | [UNESCO 1625](https://whc.unesco.org/en/list/1625/) |
| `maisoncarree`       | Maison Carrée of Nîmes                 | FR           | Land       | Discovery | [UNESCO 1569](https://whc.unesco.org/en/list/1569/) |
| `edinburgh`          | Old and New Edinburgh                  | GB           | Land       | Treasure  | [UNESCO 728](https://whc.unesco.org/en/list/728/)   |
| `pontcysyllte`       | Pontcysyllte Aqueduct                  | GB           | River      | Treasure  | [UNESCO 1303](https://whc.unesco.org/en/list/1303/) |
| `kew`                | Royal Botanic Gardens Kew              | GB           | Land       | Discovery | [UNESCO 1084](https://whc.unesco.org/en/list/1084/) |
| `delphi`             | Delphi                                 | GR           | Land       | Marvel    | [UNESCO 393](https://whc.unesco.org/en/list/393/)   |
| `epidaurus`          | Sanctuary of Asklepios at Epidaurus    | GR           | Land       | Treasure  | [UNESCO 491](https://whc.unesco.org/en/list/491/)   |
| `mycenae`            | Mycenae and Tiryns                     | GR           | Land       | Treasure  | [UNESCO 941](https://whc.unesco.org/en/list/941/)   |
| `brunaboinne`        | Brú na Bóinne                          | IE           | Land       | Treasure  | [UNESCO 659](https://whc.unesco.org/en/list/659/)   |
| `thingvellir`        | Þingvellir                             | IS           | Land       | Treasure  | [UNESCO 1152](https://whc.unesco.org/en/list/1152/) |
| `agrigento`          | Valley of the Temples at Agrigento     | IT           | Land       | Treasure  | [UNESCO 831](https://whc.unesco.org/en/list/831/)   |
| `cinqueterre`        | Portovenere and Cinque Terre           | IT           | Land & sea | Treasure  | [UNESCO 826](https://whc.unesco.org/en/list/826/)   |
| `bryggen`            | Bryggen                                | NO           | Land & sea | Discovery | [UNESCO 59](https://whc.unesco.org/en/list/59/)     |
| `tomar`              | Convent of Christ in Tomar             | PT           | Land       | Treasure  | [UNESCO 265](https://whc.unesco.org/en/list/265/)   |
| `teide`              | Teide National Park                    | ES           | Land       | Marvel    | [UNESCO 1258](https://whc.unesco.org/en/list/1258/) |
