# Old Balete Grove — The Watcher Above the Roots

The grove should feel older and quieter than the village. Its enormous balete makes Rae small; blue-green woodland recedes behind warm paths and a few familiar lamps. The art emphasizes bark, roots, moss, leaf litter and bamboo rather than adding more quest objects.

## Environment and depth

- Deep bark grooves, lichen, ferns and buttress roots give the central tree weight. Distant trunks and overlapping crowns create depth without changing the walking routes.
- The speaking tube keeps its bamboo segments, bound joints, listening mouth and route toward the eastern maintenance trail. The old marker, Doro's seed trays, fallen log, leaf cup and listening stone retain their interaction positions.
- Separate image masks place near boughs and foliage in front of actors. They fade when needed to preserve Rae's visibility. A narrow perch edge reuses the exact background pixels in front of Mang Uban so he sits within the environment.
- Mang Uban remains a separate animated sprite with the established face, expressions, speech and hand movement. Small shirt/trouser texture clusters add material detail.
- Restrained cool shafts, warm lamp pools, smoke, fireflies and low haze animate over the painting. Tube sound marks and trembling dust disappear when water is diverted or the bell is recovered. **Background motion → Still** freezes the environmental overlays.

The existing 480 × 512 playable geometry is retained. Wide cinematic views have a dim enlarged forest backdrop beyond the map edges; this is decorative overscan and adds no paths, actors, interactions or collision area.

## Story scenes

| Scene | Treatment |
| --- | --- |
| First approach | The established pan rises from Rae toward Mang Uban against the enormous trunk. Existing reveal, skip and recovery behavior is retained. |
| Conversation | The same grove frames his animated face and gestures. No replacement background or baked-in character is used. |
| Quiet grove | The same environment loses its tube vibration/dust cues as the water puzzle progresses. |
| Listening Seed | A wider shot frames the giant and child together. The original 1.4-second offering uses the existing smoothstep trajectory; seed ownership and reward timing are unchanged. |
| Returning after the gift | The optional gift marker disappears through the existing saved reward state; the map remains available for exploration. |

No new dialogue, prerequisites, inventory behavior, save fields or dependencies were added in this art pass.

## Assets and shared rendering

The built-in imagegen tool created the environment using the existing empty layout and Lantern Clearing as references. [The exact prompt and preparation record](old-balete-grove-art-prompt.md) are saved. The app bundles [old-balete-grove-v2.png](../assets/maps/old-balete-grove-v2.png), 960 × 1024, sampled on a 480 × 512 native pixel grid and enlarged with nearest-neighbor sampling. Original and native images are retained outside the runtime asset graph.

`GroveEnvironment` defines one image and reuses it for the backdrop, perch and foreground. `groveEnvironmentArt.ts` shares the camera, depth, light and seed-position functions with the source-art review. The existing Expo Asset preload now includes the grove. General art/world preview scripts also use the new composition.

## Review and replay

Run `npm.cmd run grove:preview` to generate:

- [Integrated map](../artifacts/old-balete-grove-art-preview.png), [before/after](../artifacts/grove-before-after.png) and five progress-state views
- [Reveal storyboard](../artifacts/grove-reveal-storyboard.png), [conversation](../artifacts/grove-conversation-scene.png), [gift shot](../artifacts/mang-uban-gift-preview.png) and [seed animation](../artifacts/grove-seed-offering.gif)
- [Phone framing](../artifacts/grove-phone-framing.png), [alignment](../artifacts/grove-alignment-review.png), six walkable depth views and close-ups of bark, bamboo and Doro's plot

These are source-art renders, not screenshots or recordings of the running application. Reachability checks use real collision and interaction selection across the initial, introduced, diverted, gift-available and gift-received states. Gift framing checks 960 × 320, 844 × 390, 1024 × 768 and 390 × 844 views at three approach positions, including both participants and the painted backdrop bounds.

Validation: 95 tests and TypeScript pass. Android, iOS and web production exports succeed and include the grove asset. The running Metro web bundle returned HTTP 200 and includes the asset, shared seed trajectory and perch layer.

Reload Expo Go and choose **Revisit a scene → The watcher in the tree** to review the reveal and conversations. For the reward, use **A village recovering**, then return to Mang Uban's grove. Replays preserve the main journey. Physical-phone review remains pending: check actor readability, tree overlap, the two exits, Still backgrounds, the reveal pan, offering framing and actual animation performance.
