# Landmark expansion — 67 destinations

[한국어](landmark-expansion-67.ko.md)

Research checked 2026-11-08. Eight landmarks add eight previously absent country groupings to the collection. The catalog now contains **67 landmarks across 64 countries**, with **142 decorations**. Each new landmark has English and Korean descriptions, a map point, an original local SVG illustration and two themed garden decorations.

| Landmark                   | Country     | Game tier | Visual identity                                     | Primary reference                                                                                          |
| -------------------------- | ----------- | --------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Taipei 101                 | Taiwan      | Treasure  | Stacked bamboo-like glass sections                  | [Official / architect source](https://www.onenessarchitects.com/project/Taipei-101?lang=en)                |
| Registan Square            | Uzbekistan  | Treasure  | Three madrasah portals and turquoise domes          | [Official / architect source](https://uzbekistan.travel/en/i/samarkand/)                                   |
| Sultan Qaboos Grand Mosque | Oman        | Treasure  | Sandstone courtyard, central dome and five minarets | [Official / architect source](https://experienceoman.om/en/destinations/muscat/sultan-qaboos-grand-mosque) |
| Kuwait Towers              | Kuwait      | Discovery | Three slender towers and turquoise spheres          | [Official / architect source](https://whc.unesco.org/en/tentativelists/5933/)                              |
| Bahrain World Trade Center | Bahrain     | Discovery | Twin sail-shaped towers and three wind turbines     | [Official / architect source](https://www.bahrainwtc.com/the-bwtc/architecture/)                           |
| Sky Tower                  | New Zealand | Discovery | A tall shaft, observation deck and antenna          | [Official / architect source](https://mollerarchitects.com/project/sky-tower)                              |
| Pyramid of Tirana          | Albania     | Discovery | White stepped slopes and colourful small buildings  | [Official / architect source](https://www.mvrdv.com/projects/312/the-pyramid-of-tirana)                    |
| Palace of Parliament       | Romania     | Discovery | Broad terraces, columns and repeated windows        | [Official / architect source](https://cic.cdep.ro/en/prezentare/cladire)                                   |

## Allocation and compatibility

The five Discovery and three Treasure additions are provisional editorial game allocations. They are not official heritage grades or an independently validated application of numerical recognition scores. Research supports the identities and descriptions, not measured popularity. The existing 59 entries retain their data and tiers. The new distribution is **35 Discovery / 22 Treasure / 7 Marvel / 3 Wonder**, preserving smaller pools at higher tiers.

Tier probabilities remain **70/23/6/1%**. Uniform selection inside each tier gives approximate per-item draw probabilities of **2% / 1.0455% / 0.8571% / 0.3333%** respectively. The new items enter ordinary ticket draws; reading a save grants none. Existing receipts, inventory and placements are preserved. Schema v4 and the 318-tile land cap remain unchanged. A backup containing the new IDs needs a build with this expanded catalog.

## Source boundaries

Coordinates come from Wikidata P625, with entity URLs stored in the catalog. Sky Tower's displayed degrees/minutes/seconds were converted to decimal degrees. Values are rounded to six decimals and are illustrative map points, not survey data. Bahrain has an owned-landmark marker and country collection row; the existing low-resolution country polygon dataset omits its small landmass.

Kuwait Towers' UNESCO source is a **Tentative List submission**, not World Heritage inscription. Sources differ on the opening year, so the description omits it. The Pyramid of Tirana is a 1988 building transformed in 2023; it is not described as newly built in 2023, and its original Hoxha museum context is retained. The Palace of Parliament description retains the Ceaușescu-era context and avoids disputed superlative records.

Illustrations are stylised original vectors, not photographs or measured architectural models. The garden decorations are fictional interpretations. No third-party images, fonts or remote runtime assets are added.

[Preview the eight bundled illustrations](screenshots/orcatopia-destinations-67.png).

## Local verification

Build, typecheck and state/worker checks passed, including all 67 catalog draws, 142 decorations and full-catalog backup round trips. The full browser run passed 71 of 72 scenarios. Its one failure was a test selector matching “Oman” inside “Romania”; after changing it to exact text, all three modern-country scenarios passed on rerun. The new eight-country scenario verifies discovery, placement, gifts, duplicate materials, crafting, reload, Korean descriptions and preservation of an existing collection. The 67-item artwork check passed and the eight new illustrations were visually reviewed.

These checks use isolated browser fixtures. Native Orca clicking remains deferred. No actual user save was seeded, and no execution approval, push or publication was performed.

The final self-contained artifact and `pnpm validate` passed for both plugins.
