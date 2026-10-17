# Lola's Yard — An Afternoon Kept Warm

The yard should feel like somewhere Rae has always been loved. The house, kitchen plants, waiting merienda and shady corners carry that feeling through materials, composition and light. The balete belongs to the same landscape, with a cooler, older presence that leaves room for the mystery to come.

## Visual direction

| Element | Treatment |
| --- | --- |
| Afternoon light | Amber sunlight from the upper left; luminous leaf edges and long, soft, stepped shadows. |
| House | Honey-brown timber, individual plank grain, darker joins, weathered corrugated metal, varied capiz panes and a shaded porch. |
| Ground | Worn earth with embedded flat stones, small pebbles, leaf litter and uneven transitions into grass. The broad play space stays open. |
| Garden | Distinct leaf forms, layered tropical greens, fine flower clusters, fruit and darker understory. |
| Balete | A broad dark crown, aerial roots, textured bark and a south-facing hollow. The kite and approach retain their story positions. |
| Domestic materials | Mineral marks on the basin, reflected water, woven fibers, earthenware and shaded laundry folds. |
| Depth | Baked contact/eave shadows, projected character shadows, matching foreground image regions and front/behind laundry ordering. |

The detailed background is sampled onto the 640 × 448 world grid and enlarged with nearest-neighbor sampling to the bundled 1280 × 896 asset. The production map has no baked people or laundry fabric; Rae, Lola and the laundry remain separate. Existing gameplay coordinates, collision geometry, discoveries, saves and dialogue are retained. No new NPCs or interaction requirements were added in this pass.

The image was produced with the built-in **imagegen** tool using a source-art layout reference. [The final prompt and provenance](lolas-yard-art-prompt.md) are preserved alongside the [original generated image](../assets/maps/lolas-yard-painted-source.png), [native-resolution sampling](../assets/maps/lolas-yard-native.png) and [bundled image](../assets/maps/lolas-yard-v2.png). The generated image contains the already existing sleeping cat and kite; neither is drawn a second time by the scene.

## Integration

- `YardEnvironment` defines the bundled image once in each SVG scene; foreground regions reuse the same pixels. Roof and tree crowns become translucent when Rae is behind them. Lower-corner plants frame the yard.
- `YardScene` orders laundry around Rae according to his feet. Its original garment footprints gain cloth shading, hems, weave and four ambient frames.
- Subtle moving shade, basin glints, pollen and two butterflies share bounded, cached source frames. **Background motion → Still** freezes all of these environment overlays and laundry at a stable frame while retaining character animation.
- The first yard shot of `RootCrossing` uses the same new map, avoiding an artwork change during the fade. The title framing fills the screen and uses a lighter tint so the environment is visible behind the title.
- The map is a locally bundled PNG and is preloaded with the existing Expo Asset package. There are no remote art requests or new dependencies. Only the production PNG is referenced by the running game; the larger source and review artifacts stay outside the runtime asset graph.

## Review artifacts

Run `npm.cmd run yard:preview` to reproduce:

- [Integrated map](../artifacts/lolas-yard-art-preview.png)
- [Before and after](../artifacts/lolas-yard-before-after.png), legacy on the left
- [House materials](../artifacts/lolas-house-detail.png)
- [Balete and calamansi](../artifacts/balete-garden-detail.png)
- [Kitchen garden and washing area](../artifacts/kitchen-garden-detail.png)
- [Phone-size framing](../artifacts/lolas-yard-phone-framing.png)
- [Collision and interaction alignment](../artifacts/lolas-yard-alignment-review.png), pink rectangles and pale target dots
- Six `yard-depth-*.png` views covering both tree crowns, both sides of the laundry, the balete approach and the roof
- [Laundry detail animation](../artifacts/yard-laundry-depth.gif)

These are source-art renders, not screenshots from a running phone. The script checks actual walkable review positions and existing key action targets. The general `art:preview` script also uses the new integrated yard.

## Device review

Validation for this pass: 95 existing tests pass, TypeScript passes, and Android/iOS/web production exports include the bundled yard image successfully. The render script completed all six walkable depth positions and key target checks. Integrated artwork, collision alignment, phone-size framing, cloth ordering and roof/tree overlap were inspected from source-art renders. The local Expo preview returned HTTP 200. No physical-device runtime result is claimed.

Reload Expo Go and choose **Revisit a scene → A new afternoon** to review without replacing the main journey. Check the title and the initial yard framing, walk up to the porch and behind the laundry, visit the basin and garden, then approach the balete. Confirm Rae remains visible through overlapping foliage and that targets remain legible against the detailed art. Compare Animated and Still backgrounds. Play the caller scene and the first fade to confirm there is no artwork switch. Review loading and frame pacing on a physical phone; these device checks have not been marked passed.
