# Landmark rarity criteria — allocation revision 2

[한국어](landmark-rarity-criteria.ko.md)

Status: internal allocation policy, revision 2, 2026-11-07. The user authorized a descending number of entries per tier. This revision supersedes draft 1's absolute-score tier bands. The 18/10/5/3 allocation is implemented in the source catalog; internal scores and reasons remain outside the player UI. This is an editorial prototype allocation using the latest conversational assessment, not a completed independent recognition or heritage study.

Catalog update (2026-11-08): the allocation above describes the original 36 entries. The expanded catalog now has 100 entries at 56/32/9/3; the [latest expansion research record](landmark-expansion-100.md) distinguishes the latest editorial additions from a full rubric reassessment.

Catalog update (2026-11-12): the source catalog now contains 300 entries at 153/115/24/8. The additional 200 are explicit editorial game allocations in [the curated table](../scripts/data/orcatopia-expansion.tsv), following the prototype expansion approach rather than claiming a completed scored reassessment. Existing 100 entries retain their grades. Five new Wonders use distinctive built or natural landscapes: Mont-Saint-Michel, Neuschwanstein, the Forbidden City, Bagan and the Grand Canyon. These choices are not official UNESCO grades or measured recognition scores. Each catalog entry links to its UNESCO property, and the adapted source metadata is documented in [heritage credits](../plugins/landmark-island/licenses/heritage.txt). The scoring rubric below remains guidance for a formal reassessment; no invented scores have been added to the player interface or metadata.

## Purpose and limits

Assign collection ranks consistently when adding or reassessing landmarks. These ranks are editorial game decisions, not an official heritage classification, measured public recognition or a ranking of cultures. A low collection rank can still describe a significant place worth discovering.

The earlier 36-item conversational assessment was an illustrative first pass. Its scores and totals are not validated inputs to this rubric. Do not obtain a new ranking simply by moving those scores between new thresholds: reassess the evidence and anchors first.

## Weighted score

Use four integer ratings from 0 through 5:

`total = 6 × recognition + 6 × distinctiveness + 5 × significance + 3 × landscape impact`

Weights remain 30/30/25/15, with a maximum total of 100. No decimal ratings, rounding, hidden bonuses or country multipliers. An unknown rating is pending, not zero. A zero requires evidence supporting the lowest anchor; lack of available English-language sources is never such evidence.

| Rating | Recognition — 30                                                                                 | Distinctiveness — 30                                                                                        | Historical/natural significance — 25                                                                    | Landscape impact — 15                                                                            |
| ------ | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 0      | Recognition is documented as confined to a very narrow audience                                  | No distinguishing feature is identified relative to a declared comparison set                               | No particular significance is identified after an adequate review                                       | Little spatial presence is identified in a representative view                                   |
| 1      | Primarily a local point of interest                                                              | A familiar type with minor decorative or surface differences                                                | A documented local role or local natural feature                                                        | A small focal point with limited relationship to its setting                                     |
| 2      | Recognized principally within its country or specialist audience                                 | A clear distinguishing detail within a familiar type                                                        | A documented national or regional role, or representative natural example                               | A distinct focal point in a relatively ordinary setting                                          |
| 3      | Sustained international recognition among travelers or a specialist field                        | A distinctive combination of features, with meaningful comparable examples                                  | A substantial example for understanding a cultural tradition, technical development or natural process  | A strong composition of the site and its setting, beyond raw height or size                      |
| 4      | Broad recognition across multiple cultural regions, extending beyond specialists                 | Few close comparators in its declared type; the difference is structural or spatial                         | A major contribution or unusually important surviving example, supported beyond promotional claims      | Exceptional scale, spatial complexity or relationship with terrain across representative views   |
| 5      | An enduring global symbol, with unusually strong evidence of recognition across regions and time | An exceptional, hard-to-substitute combination whose distinctiveness survives comparison with leading peers | A field-defining contribution or exceptionally informative surviving record of human or natural history | An exceptional overall landscape experience: scale, setting and composition reinforce each other |

The anchors guide judgment; they do not turn editorial opinions into measurements. Ratings 4 and 5 need a short justification of what makes the next lower anchor insufficient. A rating of 5 must also record a credible comparator and explain the material distinction. Multiple items may receive 5; it is not an exclusive title.

## Keep the axes distinct

- Recognition concerns familiarity, not visitor volume, national wealth, the number of translations on a website or the evaluator's personal familiarity. With no comparable survey, label this an editorial assessment and record uncertainty.
- Distinctiveness concerns what the place actually is. A record height, age or UNESCO designation alone does not establish exceptional distinctiveness.
- Significance accepts both human and natural evidence. Buildings may show architectural influence, engineering contribution or cultural continuity; natural places may show geological records, ecological processes or rare formations. Ancient age alone is insufficient, and recent construction does not imply insignificance.
- Landscape impact concerns representative views and spatial relationships. It does not measure the quality of the current SVG, animation budget, seasonal lighting or a single dramatic photograph. Small sites can score highly through composition and setting.
- One fact can inform two axes only with separate explanations. For example, height may affect landscape impact; a distinct engineering system needs separate evidence to affect significance. Do not award the same height bonus four times.

## Collection ranks — capacity policy

For 36 entries, allocate 3 Wonder, 5 Marvel, 10 Treasure and 18 Discovery slots. Rank by weighted total, then distinctiveness, significance, recognition and landscape impact, in that order. Exact ties across a cutoff require an explicit editorial decision; item IDs must not decide a tier. No cutoff in this snapshot splits an exact tie.

Wonder eligibility retains the previous safeguards: total at least 90, distinctiveness and significance at least 4, and at least one of those two ratings 5. Choose the three highest eligible candidates. If fewer than three qualify, give unused slots to Marvel. Allocate Marvel, Treasure and Discovery from the remaining ranked candidates. Other tiers no longer use absolute score boundaries; a high-scoring entry can be Discovery within this selected catalog.

Future catalog sizes need an explicit capacity review using this descending shape as a guide. The runtime does not calculate scores or automatically demote existing entries when content is added. Reassessment, tie decisions and capacity changes are versioned editorial operations.

## Evidence and uncertainty

Each assessment records the landmark ID, rubric version, evaluation date, four ratings, a short reason per axis, supporting source links, declared comparison set, credible alternative ratings and the resulting rank. Sources establish factual premises; the editor remains responsible for the ratings.

Use official site documentation, heritage assessments, research and credible visual records as appropriate. For a decisive rating of 4 or 5, seek two independent source origins or one substantial primary assessment with explicit supporting evidence. Two pages from the same organization, syndicated copies, and translations of the same page are one origin. Promotional superlatives alone are insufficient. Country and language diversity in evidence matters; lack of accessible evidence leads to pending review, not demotion.

Record uncertainty as a plausible integer interval for each contested axis, for example recognition 3–4. Calculate the lowest and highest possible ranks including the Wonder conditions. If they differ, mark the proposed reassignment pending and collect better evidence. Do not invent a confidence percentage or average unsupported alternatives into a precise score. A one-point change shifts the total by 3, 5 or 6, so a score such as 89 is not a measured fact one unit below 90.

Review candidates near a capacity cutoff, all possible Wonders, and apparent inconsistencies between comparable sites. This is a consistency check, not an invitation to nudge a favorite over the line. Unresolved existing entries retain their current implemented rank until the reassessment is resolved. A pending new entry is not assigned zero or automatically added to the draw pool.

## Applying the draft to the catalog

1. Freeze this rubric version before reassessing the 36 entries. Declare each site's scope: an individual building, archaeological ensemble, mountain or wider landscape. Align that scope with the catalog's name, description and representative artwork.
2. Assess the four axes without looking at the old rarity. Record evidence and uncertainty, including comparators outside this small catalog.
3. Compare like cases for consistent anchors, including human-built and natural sites. Resolve boundary cases before assigning final proposals.
4. Produce a review table of current rank, proposed rank, evidence status and reason. Do not reuse the earlier conversational scores as established facts.
5. Inspect the resulting game economy separately. Do not alter assessment scores to manufacture a desired allocation; the user-authorized capacities determine the collection ranks. Do not lower a culture’s assessment to fill a tier. A catalog of internationally famous destinations may naturally have few Discovery entries; smaller destinations can be added for variety.
6. Before any implementation, calculate per-item odds using actual pool sizes and check for empty pools. The current tier probabilities are 70/23/6/1%; those probabilities are unchanged by this document. An empty pool must be handled explicitly before changing runtime tier assignments.
7. If implemented later, preserve all existing item IDs, quantities, receipts, placements, gifts and unlocked land. Reassessment must not reroll past draws or award extra items. Explain changed badge/effect behavior in release documentation without exposing the internal scorecard in the game.

## Revision policy

Reassess on substantive new evidence, a clarified site scope or a documented rubric revision. Do not change rarity in response to transient search trends, a new visual asset or a desired daily draw result. Apply rubric revisions consistently across the catalog rather than selectively boosting new additions.

## Implemented editorial snapshot (2026-11-07)

This snapshot uses the latest 36-item reassessment shown in the conversation and the subsequently approved capacity policy. Scores are editorial estimates; independent recognition evidence and comparator reviews are incomplete. That limitation remains explicit even though the user authorized implementing the game allocation. No new historical claims or source verification are asserted here. Source links for descriptive facts remain in the bundled catalog. A future evidence review may propose a versioned change; it does not happen automatically.

Machu Picchu ranks first (95). Petra and Angkor Wat follow (94, distinctiveness 5); they precede the other 94-point entries whose distinctiveness is 4. At the Treasure cutoff, Chichen Itza and Saint Basil’s Cathedral (80, distinctiveness 4) precede the Statue of Liberty (80, distinctiveness 3). These rules account for the changed tiers without changing anyone's scores.

| Landmark                | Recognition / distinctiveness / significance / impact | Total | Implemented rank |
| ----------------------- | ----------------------------------------------------- | ----- | ---------------- |
| Machu Picchu            | 5 / 5 / 4 / 5                                         | 95    | IV Wonder        |
| Angkor Wat              | 4 / 5 / 5 / 5                                         | 94    | IV Wonder        |
| Petra                   | 4 / 5 / 5 / 5                                         | 94    | IV Wonder        |
| Great Pyramid of Giza   | 5 / 4 / 5 / 5                                         | 94    | III Marvel       |
| Great Wall of China     | 5 / 4 / 5 / 5                                         | 94    | III Marvel       |
| Taj Mahal               | 5 / 4 / 5 / 5                                         | 94    | III Marvel       |
| Colosseum               | 5 / 4 / 5 / 4                                         | 91    | III Marvel       |
| Sagrada Família         | 4 / 5 / 4 / 5                                         | 89    | III Marvel       |
| Moai of Rapa Nui        | 4 / 5 / 4 / 4                                         | 86    | II Treasure      |
| Sydney Opera House      | 4 / 5 / 4 / 4                                         | 86    | II Treasure      |
| Eiffel Tower            | 5 / 4 / 4 / 4                                         | 86    | II Treasure      |
| Borobudur Temple        | 3 / 5 / 5 / 4                                         | 85    | II Treasure      |
| Acropolis of Athens     | 4 / 4 / 5 / 4                                         | 85    | II Treasure      |
| Hagia Sophia            | 4 / 4 / 5 / 4                                         | 85    | II Treasure      |
| Burj Khalifa            | 4 / 4 / 4 / 5                                         | 83    | II Treasure      |
| Stonehenge              | 4 / 4 / 5 / 3                                         | 82    | II Treasure      |
| Saint Basil’s Cathedral | 4 / 4 / 4 / 4                                         | 80    | II Treasure      |
| Chichén Itzá            | 4 / 4 / 4 / 4                                         | 80    | II Treasure      |
| Statue of Liberty       | 5 / 3 / 4 / 4                                         | 80    | I Discovery      |
| Christ the Redeemer     | 5 / 3 / 3 / 5                                         | 78    | I Discovery      |
| Sigiriya                | 3 / 4 / 4 / 5                                         | 77    | I Discovery      |
| Sossusvlei              | 3 / 4 / 4 / 5                                         | 77    | I Discovery      |
| Mount Fuji              | 4 / 3 / 4 / 5                                         | 77    | I Discovery      |
| Mount Kilimanjaro       | 4 / 3 / 4 / 5                                         | 77    | I Discovery      |
| Shwedagon Pagoda        | 3 / 4 / 4 / 4                                         | 74    | I Discovery      |
| Petronas Twin Towers    | 4 / 3 / 3 / 4                                         | 69    | I Discovery      |
| Brandenburg Gate        | 4 / 3 / 4 / 2                                         | 68    | I Discovery      |
| Atomium                 | 3 / 4 / 3 / 3                                         | 66    | I Discovery      |
| Great Zimbabwe          | 2 / 4 / 4 / 3                                         | 65    | I Discovery      |
| Gyeongbokgung Palace    | 3 / 3 / 4 / 3                                         | 65    | I Discovery      |
| Kinderdijk Windmills    | 3 / 3 / 4 / 3                                         | 65    | I Discovery      |
| Hallgrímskirkja         | 3 / 4 / 2 / 3                                         | 61    | I Discovery      |
| Belém Tower             | 3 / 3 / 3 / 3                                         | 60    | I Discovery      |
| Ait-Ben-Haddou          | 2 / 3 / 3 / 4                                         | 57    | I Discovery      |
| CN Tower                | 3 / 2 / 3 / 4                                         | 57    | I Discovery      |
| Merlion                 | 3 / 3 / 2 / 2                                         | 52    | I Discovery      |
