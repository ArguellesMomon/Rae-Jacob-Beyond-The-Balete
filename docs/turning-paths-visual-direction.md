# Turning Paths — The Road Keeps Its Own Counsel

Current revision (2026-10-19): the five-arch maze and Bagtas’s trickster bargain supersede the earlier three-exit design below. See [the current story, puzzle, ending and review notes](bagtas-maze-and-spring-ending.md). The Rainlit Road continuation is playable, including Mayumi’s resolution and the hamlet coda.


The junction carries the verge's tactile bamboo art into a quieter forest. Receding jade stems, warm patches of moist earth, moss, leaf litter, small off-trail puddles and filtered light give the repeating paths depth without hiding the landmarks Rae and Tala must read.

## Environment and navigation

- A locally bundled pixel painting replaces the flat forest and trails. The central corridor, horizontal crossbar, three fork mouths and southern return retain their established ground boundaries.
- The generated clue boards were removed before production. Three independently drawn timber frames hold the static stone, bamboo and water sketches at their existing interaction points.
- All three changing fork signs, LEFT/TOP/RIGHT labels, CHECKED counter and TO BAGTAS return label remain code-rendered. Small timber/grain details enrich the panels while keeping high contrast between each sketch and its background.
- Foreground crowns, side foliage and inner bamboo reuse exact image regions. They fade near the party where needed, with route labels kept outside their masks.
- Restrained dappled light, rain marks, drifting leaves, puddle rings and low haze animate at three updates per second using a bounded cache. **Background motion → Still** freezes these layers. Character and explicit path-transition behavior remains intact.

The map still has its 640 × 480 native world, the same ground silhouette, colliders, travel targets and puzzle rules. There are no new objects to discover, hidden requirements, dialogue branches, save fields or dependencies. The movement fix applies here exactly as on the other five maps: the full foot rectangle must fit on supported ground.

## Relevant scenes and states

| Scene/state | Treatment |
| --- | --- |
| Arrival | The party enters on the southern corridor, with the named return route behind them and the crossbar ahead. The existing arrival conversation explains the three forks. |
| Stone, bamboo and water stages | The same environment is reused. Real puzzle state changes each fork's sketch and the checked count; the painting never supplies a solution or changes a path. |
| Wrong turn and safe loop | The existing brief path fade returns to the junction. Earned checked steps remain. |
| Route verified | CHECKED 3/3 remains visible on revisits. The established route returns to Bagtas. |
| Back to the shelter | The southward action and existing transition use the upgraded verge on the other side. No new chapter content is implied. |

## Assets and review

The built-in imagegen tool created and revised the environment. [Exact prompts and production preparation](turning-paths-art-prompts.md) are saved. [turning-paths-v2.png](../assets/maps/turning-paths-v2.png), 1280 × 960, is preloaded through the existing Expo Asset package. Source/native versions remain outside the runtime asset graph.

`TurningEnvironment` shares one image across the base and foreground masks. `turningEnvironmentArt.ts` supplies static clue frames, depth and weather to both the app and source-art renderer. The general `chapter2:preview` uses the upgraded turning scene, and `navigation:review` checks its new painting against the unchanged movement surface.

Run `npm.cmd run turning:preview` for:

- [Integrated junction](../artifacts/turning-paths-art-preview.png), [before/after](../artifacts/turning-before-after.png) and all four checked-count states under `artifacts/chapter-02-turning-*.png`
- [Arrival](../artifacts/turning-arrival-scene.png), [left](../artifacts/turning-left-fork-scene.png), [top](../artifacts/turning-top-fork-scene.png), [right](../artifacts/turning-right-fork-scene.png) and [return](../artifacts/turning-return-scene.png) views
- [Phone framing](../artifacts/turning-phone-framing.png), [transition storyboard](../artifacts/turning-transition-storyboard.png), six legal-ground depth views, material close-ups and [weather animation](../artifacts/turning-weather-preview.gif)

These are source-art renders, not running-app screenshots. Reachability checks cover every non-companion interaction in all four states. The three puzzle stages retain three distinct sketches and exactly one correct landmark. Depth positions remain on legal ground. The north-fork label, sketch and party fit the reviewed 960 × 320, 844 × 390 and 1024 × 768 screens.

Validation: all 102 tests and TypeScript pass, including the real-controller Chapter 2 playthrough with a wrong loop, saved progress, three checked landmarks and the return to Bagtas. Android/iOS/web production exports succeed. The live Metro web bundle returned HTTP 200 and includes the new map, foreground, ground checks and shared companion spawning. [The all-map movement review](movement-boundary-review.md) covers the six boundaries and relevant puzzle states.

Reload Expo Go and choose **Revisit a scene → Chapter 2: The turning paths**. The current server is `exp://192.168.1.9:8081`; [the refreshed QR](../artifacts/expo-go-qr.png) works while it is running and both devices share the network. Replays preserve the main journey. Physical-phone touch/performance review remains pending: check the three labels and sketches, movement at each path edge, Tala's following, Still backgrounds, the brief loop fade and the southern return.
