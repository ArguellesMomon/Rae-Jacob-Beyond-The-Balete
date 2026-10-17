# Rootwater Works — Water Remembering Its Way

This scene carries the grove's twilight forest into a hand-built waterkeeper station. Wet stone, moss, rope-bound bamboo and weathered timber should make the machinery feel tended by the village. Clear channels and warm route lamps keep the puzzle readable within the dense setting.

## Environment and puzzle art

- Stone aqueduct rims, cobbled dry beds, reeds, ferns, layered trees and warm lamps replace the flat ground. Timber bridges have grain, worn edges and damp shadows. The side passage has a deeply textured severed root and a pale circular seal.
- The original 704 × 480 world, collider footprints, control positions and bridge gate are retained. The water surface is confined to the established channels; the generated image adds no walking routes.
- Diverting west reuses the painting's water texture in the western bypass and its dry stone texture beneath the wheel. Clipped image regions change the beds without switching the full background or baking a puzzle state into it.
- Moving ripples show the active route; foam appears beneath the running wheel. The stopped wheel, exposed eastern bed and relocated branch provide separate visible confirmations of diversion. The existing surge, camera tremble and route caption are retained.
- A new native-pixel wheel has a stepped timber rim, grained spokes and axle. Sixteen cached frames retain the jammed, stopped and smoothly rotating behaviors. Pixel clusters are grouped into paths to keep the SVG node count low.
- The diagram, lever, safety-float marks, movable branch, route labels and nameless/named bridge cues remain independent overlays. The diagram labels west/east; no generated lettering is relied on for puzzle directions.
- Foreground crowns and near leaves reuse the exact background pixels and fade near Rae. Bridge-edge depth follows the established walking surface.

**Background motion → Still** freezes water highlights, foam, haze and fireflies. The wheel continues to communicate its mechanical state; characters, retrieval and explicit story transitions keep their established behavior. The existing water-motion preference still controls the flow-camera feedback.

## Relevant scenes

| Scene | Treatment |
| --- | --- |
| Arrival | The route enters beside the grove sign and warm lamp, revealing the two channels in the same detailed environment. |
| Splitter and bypass | The readable diagram and lever remain above their established interaction points. The branch moves to the existing recess. |
| Bell retrieval | Rae's reach/pull poses and string use the original trajectory. The stationary caught bell is hidden during retrieval, avoiding a duplicate bell beneath the moving one. |
| Water restored | Flow returns east, the wheel turns smoothly, and the low-trail puddle and flooded approach disappear through the established progress flag. |
| Named crossing | The existing gate opens after the rung waybell. A small two-line plaque names Bamboo Crossing on the same bridge. |
| Root reveal and Chapter 1 ending | The existing pan, pale-seal highlight and dialogue frame the new severed-root artwork. No ending timing, dialogue or completion behavior changes. |

No new prerequisites, NPCs, inventory rules, save fields or dependencies were added.

## Assets and implementation

The built-in imagegen tool created the environment from the prior empty layout with the grove as a style reference. [The exact prompt and production preparation](rootwater-works-art-prompt.md) are saved. [rootwater-works-v2.png](../assets/maps/rootwater-works-v2.png) is bundled at 1408 × 960, representing a 704 × 480 native pixel grid. Source/native versions stay outside the runtime asset graph.

`WaterworksEnvironment` defines one image, flow-bed clips and foreground masks. `waterworksEnvironmentArt.ts` shares state, motion, pixel-wheel, camera-target and pickup-position functions with the source-art renderer. The installed Expo Asset package preloads the new image with the other maps. The general art/world preview scripts also consume the updated waterworks composition.

## Review and replay

Run `npm.cmd run waterworks:preview` to regenerate:

- [Integrated waterworks](../artifacts/rootwater-works-art-preview.png), [before/after](../artifacts/waterworks-before-after.png) and six states: initial, branch cleared, diverted, bell retrieved, water restored and bridge named
- [Arrival](../artifacts/waterworks-arrival-scene.png), [bell retrieval](../artifacts/waterworks-retrieval-scene.png), [crossing](../artifacts/waterworks-crossing-scene.png) and [root-seal scene](../artifacts/waterworks-root-seal-scene.png)
- [Ending storyboard](../artifacts/waterworks-ending-storyboard.png), [phone framing](../artifacts/waterworks-phone-framing.png), [alignment review](../artifacts/waterworks-alignment-review.png), six depth views and material close-ups
- [Flow feedback animation](../artifacts/water-flow-preview.gif) and [bell-pull animation](../artifacts/waterworks-retrieval-preview.gif)

These are source-art renders, not running-app screenshots. Reachability checks use real collision and target selection in all six states, with the eastern-bank clues correctly unavailable before the rung waybell. All six depth-review positions are walkable. Retrieval framing checks Rae, wheel and bell at 960 × 320, 844 × 390 and 1024 × 768.

Validation: 95 tests and TypeScript pass. Android/iOS/web production exports succeed and include the new environment. The live Metro web bundle returned HTTP 200 and includes the image, flow-bed component, wheel and pickup functions.

Reload Expo Go and choose **Revisit a scene → The waterworks puzzle** for the machinery and bell retrieval, or **Beyond the crossing** for the sealed root and ending. Replays retain the main journey. Physical-phone review remains pending: check controls against the textured background, channel boundaries, active/dry route changes, wheel visibility, the string pull, bridge naming, Still backgrounds, ending framing and actual animation performance.
