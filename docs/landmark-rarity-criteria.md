# Landmark rarity criteria — draft 1

[한국어](landmark-rarity-criteria.ko.md)

Status: internal design proposal, 2026-11-07. This document does not change the catalog, draw probabilities, saved inventory or artwork. Scores, scoring criteria and selection explanations are not intended for the player UI. Existing rarity names, colors and effects remain the player-facing presentation.

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

## Collection ranks

| Rank        | Weighted total                    | Meaning within the game                                    |
| ----------- | --------------------------------- | ---------------------------------------------------------- |
| I Discovery | Below 60                          | A place to discover, with a meaningful identity of its own |
| II Treasure | 60–74                             | A distinctive destination supported by several strengths   |
| III Marvel  | 75–89                             | A strong centerpiece for the collection                    |
| IV Wonder   | 90–100, plus the conditions below | An exceptional collection goal                             |

A Wonder must also have distinctiveness **at least 4**, significance **at least 4**, and **at least one of these two ratings equal to 5**. If the total is 90 or more but these conditions fail, assign Marvel. Recognition and visual spectacle alone cannot produce a Wonder. These are proposed boundaries, not implemented draw rules.

Example calculations use fictional candidates, not assessed real landmarks:

| Candidate                                                        | Recognition / distinctiveness / significance / impact | Total | Result                               |
| ---------------------------------------------------------------- | ----------------------------------------------------- | ----- | ------------------------------------ |
| Local destination with a distinctive identity                    | 2 / 3 / 3 / 3                                         | 54    | Discovery                            |
| Regional destination with international interest                 | 3 / 3 / 4 / 3                                         | 65    | Treasure                             |
| Widely recognized, distinctive landmark                          | 5 / 4 / 4 / 4                                         | 86    | Marvel                               |
| Widely recognized place with exceptional distinctiveness         | 5 / 5 / 4 / 4                                         | 92    | Wonder                               |
| Visually spectacular but weak in historical/natural significance | 5 / 5 / 3 / 5                                         | 90    | Marvel: significance condition fails |

## Evidence and uncertainty

Each assessment records the landmark ID, rubric version, evaluation date, four ratings, a short reason per axis, supporting source links, declared comparison set, credible alternative ratings and the resulting rank. Sources establish factual premises; the editor remains responsible for the ratings.

Use official site documentation, heritage assessments, research and credible visual records as appropriate. For a decisive rating of 4 or 5, seek two independent source origins or one substantial primary assessment with explicit supporting evidence. Two pages from the same organization, syndicated copies, and translations of the same page are one origin. Promotional superlatives alone are insufficient. Country and language diversity in evidence matters; lack of accessible evidence leads to pending review, not demotion.

Record uncertainty as a plausible integer interval for each contested axis, for example recognition 3–4. Calculate the lowest and highest possible ranks including the Wonder conditions. If they differ, mark the proposed reassignment pending and collect better evidence. Do not invent a confidence percentage or average unsupported alternatives into a precise score. A one-point change shifts the total by 3, 5 or 6, so a score such as 89 is not a measured fact one unit below 90.

Review candidates within five points of a rank boundary (60, 75, 90), all possible Wonders, and apparent inconsistencies between comparable sites. This is a consistency check, not an invitation to nudge a favorite over the line. Unresolved existing entries retain their current implemented rank until the reassessment is resolved. A pending new entry is not assigned zero or automatically added to the draw pool.

## Applying the draft to the catalog

1. Freeze this rubric version before reassessing the 36 entries. Declare each site's scope: an individual building, archaeological ensemble, mountain or wider landscape. Align that scope with the catalog's name, description and representative artwork.
2. Assess the four axes without looking at the old rarity. Record evidence and uncertainty, including comparators outside this small catalog.
3. Compare like cases for consistent anchors, including human-built and natural sites. Resolve boundary cases before assigning final proposals.
4. Produce a review table of current rank, proposed rank, evidence status and reason. Do not reuse the earlier conversational scores as established facts.
5. Inspect the resulting game economy separately. Do not force fixed numbers of items into tiers or lower the rank of one culture to fill Discovery. A catalog of internationally famous destinations may naturally have few Discovery entries; smaller destinations can be added for variety.
6. Before any implementation, calculate per-item odds using actual pool sizes and check for empty pools. The current tier probabilities are 70/23/6/1%; those probabilities are unchanged by this document. An empty pool must be handled explicitly before changing runtime tier assignments.
7. If implemented later, preserve all existing item IDs, quantities, receipts, placements, gifts and unlocked land. Reassessment must not reroll past draws or award extra items. Explain changed badge/effect behavior in release documentation without exposing the internal scorecard in the game.

## Revision policy

Reassess on substantive new evidence, a clarified site scope or a documented rubric revision. Do not change rarity in response to transient search trends, a new visual asset or a desired daily draw result. Apply rubric revisions consistently across the catalog rather than selectively boosting new additions.
