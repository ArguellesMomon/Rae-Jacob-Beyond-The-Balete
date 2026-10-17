# Rae Jacob and Tala — visual and movement pass

Implemented 2026-10-17. The playable sprites, dialogue portraits, notebook descriptions and source-art previews use the new designs.

## Character direction

- **Rae Jacob:** short, tousled straight hair with a trimmed nape; light-brown skin; a warm white sando with shaded folds and seams; teal shorts; visible flip-flop straps and soles; spare kite string at the pocket. The face stays youthful, curious and expressive. Forest-toned outlines and restrained highlights connect the clothes and skin to the environments.
- **Tala:** a compact duwende silhouette, broad tapered ears, rounded cheeks, wider nose, small olive eye accents and a leaf clasp. The ochre scarf, woven moss-green tunic, sturdy shoes, leather map pouch, pencil and ink-marked fingers identify a working mapmaker. These proportions and features are original character design for Silong, rather than a claim that all Philippine accounts describe duwende this way. The existing character voice and story identity continue.

Both portraits reuse the same face drawing as their world sprites. Nine expressions, blinking and speech use the same facial landmarks. Supporting cast designs remain with their own art generators.

## Movement and direction

An eight-frame walk uses opposing arms and legs, bent knees, lifted passing feet and a small torso bob. It advances by distance traveled, with quicker steps for Tala's shorter legs. The external whole-sprite bounce is removed for these two travelers. At least one foot remains at ground level in each frame; the head and clothing can move above it.

Front, back and profile views have separate geometry. Profiles show one eye, front views two, and back views hide facial features. Rae's hair stays short at every angle. Tala's satchel remains on the same anatomical hip: the clasp is visible on the near side and hidden behind the torso on the far side. The strap changes direction across the back. Pencil, map and hand placement respect their depth order. Turning does not mirror the entire equipment layout.

Waving, celebrating, listening, thinking, talking, bowing, brushing dust, working, reaching, pulling, opening a map and protecting it have directional poses. Raised hands clear the eyes and ears. The map is held in front when facing the viewer; a back view shows its edges beside the body.

The internal pixel grid is 64 × 96 for Rae and 64 × 80 for Tala. Public source canvases remain 32 × 48 and 32 × 40, and live world sizes remain 20 × 30 and 18 × 22. Existing feet, interaction anchors, ground boundaries, collision and save positions retain their dimensions.

## Review files

Run `npm.cmd run travelers:preview` to regenerate:

- [Designs and all four angles](../artifacts/travelers-design-review.png)
- [Eight-frame Rae sheet](../artifacts/rae-eight-frame-review.png)
- [Eight-frame Tala sheet](../artifacts/tala-eight-frame-review.png)
- [Walking animation in all four directions](../artifacts/travelers-four-direction-walk.gif)
- [Directional story gestures](../artifacts/travelers-directional-acting.gif)
- [The six environment palettes](../artifacts/travelers-scene-review.png)

These are source-art renders, not screenshots or recordings of a running app. `characters:preview` refreshes the full cast's portrait and gesture sheets; `opening:preview` refreshes the side-profile animation review.

## Validation and device review

109 tests pass, along with TypeScript checking. New raster checks cover all 64 walk frames, eight distinct frames at the real world display sizes, eye counts and placement by direction, 208 story poses without edge clipping, all portrait expressions, blinking, speech and the anatomical placement of the satchel. Existing controller, companion-following, map boundaries, puzzles and save recovery checks still pass.

On Expo Go, use **Revisit a scene → A new afternoon** for Rae, **First steps in Silong** for Tala's introduction, and **The waterworks puzzle** to check the carried map. Walk horizontal and vertical paths, stop and reverse direction, and compare each side with its portrait. Watch the feet at slow joystick speed and while jogging. Check Tala's ears and scarf remain readable at normal phone size and the pencil does not cover the face during a turn.

Physical-device animation, visual comfort and performance review remain pending.
