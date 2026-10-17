# Lantern Clearing — A Light Left for Someone

The clearing carries the warmth of Lola's yard into a much larger, unfamiliar forest. Rae is small beneath the roots; the homes are smaller still. Cool twilight and a readable trail of amber lamps make this a place he can be frightened of and drawn toward at the same time.

## Environment

- Mossy buttress roots, worn bark, layered crowns, distant violet-blue forest and near leaves establish scale and depth.
- Root cottages have timber grain, curved moss roofs, woven shutters, tiny thresholds and warm windows. The northern grove path stays recognizable by its existing arrow sign.
- Packed-earth paths soften into leaf litter and low plants. Stones, root edges, reflected water and small flowers replace flat ground blocks.
- The actual right-side channel keeps its impassable footprint. The shallow trickle under Tala's bridge stays local; the generated draft's misleading extra creek was removed before integration.
- Foreground regions reuse the exact background pixels for roots, roofs, arch, bridge edge and near foliage. Regions fade when needed to keep Rae visible; the arch/bridge ordering follows his feet.

This is a visual replacement of the existing 576 × 448 map. The houses, residents, bridge, work station, bell arch, arrival hollow, exits, collision geometry and interaction points retain their gameplay positions. Characters remain separate animated sprites. Decorative background buildings and foliage have no new quest behavior.

## Story scenes and repair states

| Scene/state | Visual treatment |
| --- | --- |
| Falling between worlds | A new textured root-descent backdrop matches the clearing's bark, moss and twilight. The existing 9.6-second timing, full blackout, player animation, captions, skip and recovery logic are retained. |
| Arrival and Tala | The same detailed map reveals behind the crossing, with the sealed hollow, clear landing area, amber lamps and tiny walkway. |
| Minda and the closed work path | A separately rendered textured wood barrier and closed window leaves represent the unrepaired state. No second background is substituted. |
| Water restored | The barrier disappears, the warm window reopens and tiny slippers return to the threshold. Water highlights become calmer. |
| Bell hung | The existing animated bell hangs from a new cord; the crossing name remains unearned. |
| Bell rung | The wooden name plaque gains BAMBOO CROSSING, light pulses settle, and the background neighbor returns home with a basket. |
| Quiet aftermath | The same source layers appear in a wider screen-filling view. Minda remains by the arch, and the existing conversation and interruption recovery continue. |

The named plaque, cord, barrier and shutters are pixel overlays. Decorative lantern/window illumination is baked into the painting; restrained animated glow and motes add motion on top. **Background motion → Still** freezes fireflies, haze, lamp overlays, water marks and background recovery motion. Character movement and the story transition keep their established behavior.

## Assets and implementation

The built-in imagegen tool produced the map and root backdrop using the existing layout and the updated yard as references. [The exact prompts and asset preparation record](lantern-clearing-art-prompts.md) are saved. The running app bundles [lantern-clearing-v2.png](../assets/maps/lantern-clearing-v2.png), 1152 × 896, and [root-descent-v2.png](../assets/maps/root-descent-v2.png), 640 × 360. They are sampled on their native pixel grids before nearest-neighbor enlargement. Sources and drafts stay outside the runtime asset graph.

`ClearingEnvironment` defines the image once per scene and reuses it for foregrounds. `clearingEnvironmentArt.ts` supplies shared state, light, recovery and depth rendering. The installed Expo Asset package preloads the two images with the yard asset. No dependencies, save fields, puzzle prerequisites, dialogue branches or NPC interactions were added.

## Review

Run `npm.cmd run clearing:preview` for:

- [Integrated clearing](../artifacts/lantern-clearing-art-preview.png) and [before/after](../artifacts/clearing-before-after.png)
- Separate initial, repaired, bell-hung and bell-rung map images under `artifacts/clearing-*-art-preview.png`
- [Arrival](../artifacts/clearing-arrival-scene.png), [Tala](../artifacts/clearing-tala-scene.png), [Minda](../artifacts/clearing-minda-scene.png) and [after-bell scene](../artifacts/clearing-after-bell-scene.png)
- [Crossing storyboard](../artifacts/clearing-crossing-storyboard.png), [phone framing](../artifacts/clearing-phone-framing.png), [alignment review](../artifacts/clearing-alignment-review.png) and six depth views
- Close-ups of the root homes, waterkeeper station and bell arch

These are source-art renders, not running-app screenshots. The render script checks all interaction approaches using real selection/collision logic in all four repair states and verifies each depth-review position is walkable. The general `art:preview` script uses the same clearing composition.

Validation for this pass: 95 tests and TypeScript pass. Android/iOS/web production exports succeed and include both new environment PNGs. The source-art review completed all four stage checks and six depth positions. The restarted Expo Go server is available at `exp://10.21.117.52:8081`; its live web bundle returned HTTP 200 and includes both image modules, the clearing state layers and environment preloading. No physical-phone playtest result is claimed.

Phone review remains pending. Reload Expo Go and use **Revisit a scene → First steps in Silong** for arrival/Tala, **Bring the bell home** for Minda and the repaired bank, and **A village recovering** for the bell-rung village. Use **A new afternoon** to review the full crossing. Existing main-journey progress is retained in these separate replay scenes. Check readability of actors, action markers and water boundaries, roof/root overlap, the opened work route, Still backgrounds, the ringing cue and post-bell framing on a physical device.
