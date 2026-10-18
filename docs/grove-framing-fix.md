# Remaining overlays and grove framing

Removed the extra grove path-marker carving and speaking-tube mouth/stand, waterkeeper tube mouth, knotted route cord, and roots-home window shutter graphics. The hamlet basket layer is already empty; its baskets remain in the generated map painting as requested. All named interactions remain available on the scenery. The wheel, laundry, changing fork pictures and quest-state objects remain intact.

The screenshot's side strips came from a second grove image enlarged to twice its size and drawn behind the portrait-shaped map. On a wide screen the camera could see outside the actual map, exposing that duplicate. The duplicate fill is removed from both the live scene and source-art renderer.

The shared camera now fits normal views inside each map's true dimensions and uses equal horizontal/vertical scale. Camera rounding also stays within map edges. Near Mang Uban's perch, the grove smoothly biases its framing to include the seated giant and Rae. Gift shots retain space for both actors; extreme screen ratios use a uniform cinematic fit rather than a repeated map.

Validation: TypeScript and 129 automated tests pass. Three new checks cover normal viewport bounds and equal scale on six screen sizes across all nine maps; grove desktop and gift composition; and transparent regions where the removed overlays used to appear. Existing story-visual and full-controller tests continue to pass.

`npm.cmd run grove:preview` verifies source-art framing and reachability and writes desktop, ultrawide, portrait, conversation and gift previews. The desktop image matching the supplied screenshot size is `artifacts/grove-desktop-framing.png`. These are source-art renders, not captured app screenshots. Physical-phone touch/performance review remains pending.
