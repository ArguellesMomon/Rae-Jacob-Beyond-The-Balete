# Three guided Turning Paths trials

This revision replaces the difficult seven-exit, two-witness puzzle. Each map now has exactly one destination sign. Follow occasional worn arrows, fallen white petals and leaf ties, then inspect that sign to complete the trial. Watch the Tigmamanukan near the start or ask Aling Dalisay for directions along the way. The final sign includes Rae’s inside-out sando moment in its conversation; it is no longer a separate alcove requirement. See [the current folklore guide design](folklore-trail-guides.md).

| Trial | Destination | Required walk from entrance |
| --- | --- | --- |
| The Divided Stone | Split-stone sign | 12–16 path sections |
| The Backward Wind | Bowed-bamboo sign | 14–18 path sections |
| The Borrowed Current | Running-water sign | 16–20 path sections |

The larger 1536 × 1152 forest maps and seeded route graphs remain. Their required goal is selected from a bounded distance band rather than the farthest part of the maze. The rest of each map is optional exploration.

## Direction and visibility

Small, low-contrast arrow carvings appear only occasionally, with at least 160 world pixels between them, even where the winding path folds back. At least three quarters of the former per-cell markers are removed. Each remaining arrow follows a real corridor toward the goal. Fallen white petals lead into the correct branch at required turns and junctions; small leaf ties confirm the route between them.

The camera is now 1.35 times normal zoom, and mist has a wider 260-pixel clear area with only a light outer vignette. Other regions keep their camera behavior. Ground clues remain static and visible with ambient motion disabled. A Tigmamanukan perches near the start and flies briefly toward the next real corridor; Aling Dalisay, an original giantess inspired by a recorded Isneg tale, rests farther along in a side clearing. Inspecting the bird or talking to Dalisay gives the next bend or junction from the current seed. These optional encounters have separate save records and unlock their Codex and People pages. Their footprints leave the route open, and their animations freeze in Still mode. Nilo and Sela remain duwende in Lantern Clearing.

## Completion and saves

There are no prerequisite witnesses, proof pickups, rune combinations, wrong-exit resets or reshuffled invitations. Inspect the single destination sign; its short conversation records the landmark and advances to the next map. Each trial has a distinct interaction identity so a duplicate completion cannot advance another trial.

Existing seed, map layout, current position, completed trials and earlier discoveries persist. Legacy witness fields are still accepted in saves but no longer gate progress. Removed signs also lose their collision footprints. A new clearing supports the active sign.

Pause → Return to this trial’s entrance offers an immediate way out of a long wandering route. It keeps the arrangement and all earned trials, and does not restart the chapter or replace the main journey. Continuing a save or replay keeps its seed; a newly selected replay scene receives a new arrangement.

## Story and presentation

Bagtas remains a boastful, mischievous tikbalang. His echoes tempt travelers to trust sound over ground, while the bargain explicitly promises honest gold waymarks. The introductions, objectives, hints, notebook, replay descriptions and debrief now explain one sign per trial. The clothing reversal retains its family-story context; the trial structure and arrows are original game fiction.

The joined ground and collision layout remain. The V1 floor/forest material families are restored using mobile-sized continuous plates, and runtime terrain is limited to the camera's neighborhood: [current material and performance notes](mobile-maze-performance.md). The goal is the only upright puzzle sign besides the entrance return plaque. Gold ground waymarks need no extra interaction.

## Validation

All 157 tests pass, including a real controller playthrough that watches the bird, speaks to Dalisay, and completes all three single-sign trials with interruption/reload, the pause-menu return, and the later spring ending. Ninety seed/trial layouts verify connected walkable routes, one active sign, bounded destination distance, all corridor centers remaining open with NPC footings, and no new connection through a rest clearing. Direction checks across sixty layouts verify that every arrow follows a real edge and strictly approaches the goal. Additional checks cover sparse-marker separation across 45 layouts, natural clues at required decisions, NPC approaches and optional dialogue across 30 layouts, four creature poses, bird flight, Still mode, Codex encounters and legacy encounter migration. Existing terrain, collision and save migration checks remain.

TypeScript passes. Run npm run turning:preview for three full-map developer reviews and nine close views. Full-map reviews never appear in normal play. Current logs: artifacts/quiet-wayfinding-tests.txt, artifacts/quiet-wayfinding-art.txt and artifacts/quiet-wayfinding-export.txt. Run node --experimental-strip-types scripts/review-maze-wayfinding.ts for six source-art close views and a direction report under artifacts/quiet-wayfinding/.
