# Bamboo Verge — A Roof Between the Raindrops

The verge introduces a different forest mood after Rootwater Works: warm sunlight through wet bamboo, cool jade shade and a small shelter that makes room for travelers of different sizes. Bagtas stands on clear ground in front of the woven shelter, so his first encounter remains easy to read.

## Environment and wayfinding

- Tall jointed bamboo has worn nodes, warm highlights and layered leaf crowns. Distant blue-green stems recede behind moss, ferns, leaf litter and moist earth.
- The shelter has weathered nipa thatch, bound joints, woven backing, baskets, cloth and a long bench. Its foreground approach stays clear around Bagtas.
- The zigzag trail, knotted cord, hoofprints, covered cups, verse board, two shallow puddles and return route retain their roles. The cup table's small collision footprint and inspection point are aligned with the new painting; old saves inside that footprint recover through the existing save validation.
- The entrance keeps its prominent **TURNING PATHS** name and gold ground arrow. Crisp code-rendered letters and miniature landmark sketches sit over the painting, so generated lettering is never needed for navigation.
- Separate foreground image regions create depth around bamboo, the shelter roof and near leaves. They yield to actors in front and fade where Rae would otherwise be obscured behind them.
- Gentle rain, fallen leaves, small puddle ripples and restrained dappled light add movement. **Background motion → Still** freezes these overlays while character animation retains its established behavior. Weather rendering uses a bounded cache and four updates per second.

The world remains 640 × 480 native pixels. The cup-table alignment is the only collision/interaction adjustment; travel, quest requirements, dialogue, save fields and fork rules are retained. Turning Paths keeps its existing environment in this pass.

## Relevant scenes

| Scene | Treatment |
| --- | --- |
| Arrival from the crossing | The downhill return trail opens into rainlit bamboo. The original player-paced arrival conversation is retained. |
| First encounter with Bagtas | His animated sprite and nameplate remain separate from the environment. Rae's surprise, Bagtas's welcome and their path discussion share the new shelter view. |
| Optional questions and scenery | The same map supports the story, seal and wayfinding conversations, covered cups and survey-cord discoveries. The little verse sketches support the readable dialogue clue. |
| Entering Turning Paths | The named arch, bright threshold and gold arrow identify the existing action point. Before meeting Bagtas, inspection still explains why Rae needs directions; afterward Travel opens normally. |
| Verified route and debrief | The party returns to the same shelter. Existing replies, callbacks and earned progress remain intact. |

No NPCs, items, dialogue branches, story timing or dependencies were added.

## Assets and rendering

The built-in imagegen tool created the environment from the prior empty layout, using Rootwater Works for material detail. [The exact prompt and preparation record](bamboo-verge-art-prompt.md) are saved. The app preloads [bamboo-verge-v2.png](../assets/maps/bamboo-verge-v2.png), 1280 × 960, through the existing Expo Asset package. The original output and native sampling are preserved outside the runtime asset graph.

`BambooEnvironment` defines one image and reuses it for depth regions. `bambooEnvironmentArt.ts` supplies shared wayfinding, weather and overlap rules. The existing `BambooScene` selects the new layers only for Bamboo Verge. `chapter2:preview` also renders the upgraded verge; `verge:preview` provides the focused scene review.

## Review and replay

Run `npm.cmd run verge:preview` to generate:

- [Integrated map](../artifacts/chapter-02-bamboo-verge.png), [before/after](../artifacts/bamboo-verge-before-after.png) and four progress-state views
- [Arrival](../artifacts/bamboo-verge-arrival-scene.png), [Bagtas encounter](../artifacts/bamboo-verge-bagtas-scene.png), [entrance](../artifacts/bamboo-verge-entry-scene.png) and [debrief](../artifacts/bamboo-verge-debrief-scene.png)
- [Introduction storyboard](../artifacts/bamboo-verge-introduction-storyboard.png), [phone framing](../artifacts/bamboo-verge-phone-framing.png), [alignment review](../artifacts/bamboo-verge-alignment-review.png), six depth views and shelter/entrance/cup/rain close-ups
- [Weather animation](../artifacts/bamboo-verge-weather-preview.gif)

These are source-art renders, not running-app screenshots. The introduction uses the actual playable lines to drive expressions. Real collision and target selection checks cover every non-companion interaction in the arrival, introduced, route-verified and debrief states. All six depth positions are walkable. Encounter framing checks Bagtas and both children at 960 × 320, 844 × 390 and 1024 × 768. Save recovery is checked for a previous valid position now covered by the aligned table.

Validation: 95 tests and TypeScript pass. Android/iOS/web production exports include the new map. The running Metro web bundle returned HTTP 200 and includes the asset, foreground, weather and wayfinding layers.

Reload Expo Go and choose **Revisit a scene → Chapter 2: The bamboo verge** for arrival and Bagtas, or **Chapter 2: A route verified** for the debrief. Replays preserve the main journey. Physical-phone review remains pending: check character visibility, the named arch and arrow, table interaction, bamboo overlap, rain/puddle motion, Still backgrounds, text readability and actual animation performance.
