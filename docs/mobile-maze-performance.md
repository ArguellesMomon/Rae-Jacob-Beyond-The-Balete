# V1 Turning Paths materials and mobile rendering

Follow-up: [phone rendering regression repair](mobile-regression-fixes.md) corrects native walking/helper placement and removes the restored spring's live mask. The original browser-only crop check did not cover native nested SVG placement.

The requested rollback concerns textures only. Stone, wind and water use their original `maze-*-floor-v1.png` and `maze-*-forest-v1.png` material families again. Maze layouts, saved seeds, camera zoom, NPCs, current trials and the one-sign requirement are retained.

## Asset preparation

`scripts/prepare-mobile-art.ts` prepares six continuous 1536 × 1152 mobile plates from the existing six V1 PNGs, with periodic overlap blending at source edges. The originals are untouched. Each pair uses 13.5 MiB of decoded RGBA pixels, compared with 54 MiB for the previous two 3072 × 2304 ground plates, before decoder/GPU overhead. Asset preloading does not require drawing every stage at once.

The script also compiles Rae and Tala's authored walking frames into two transparent atlases. Phone movement draws an image cell instead of rebuilding the vector sprite's many individual shapes. All eight strides, four directions, blinks, Rae's common walking expressions and Tala's carried-map pose are included. Portraits, dialogue and other gestures keep their original expressive artwork. Pixel comparisons verify every atlas cell against its source.

## Rendering changes

- Joined floor contours are traced and cached in 256-pixel regions. Only camera-adjacent regions and foliage mount in the scene. A small overlap supports rounded edges without gaps between regions. Each leaf-fringe surface has region-sized bounds.
- Native floor clipping uses local clip paths rather than full-world alpha masks. The sight tint covers the current viewport. Static XML layers and terrain regions are memoized; off-screen creature sprites are culled.
- Vegetation placement has its own seeded cache, so entering a trial does not need the full-map contour merely to find nearby plants.
- Native movement uses the compiled traveler frames. The joystick's input callback is stable, allowing its controls to skip unrelated world updates.
- Static menus and unfocused app states stop scene-clock updates. Conversation portraits update at 12/s, title ambience at 8/s, and active gameplay targets 30 scene updates/s. Movement and collision simulation retain their independent RAF timestep.
- Fractional paint time carries across 60/90/120 Hz displays, avoiding a timing comparison that could unintentionally drop a nominal 30/s budget toward 20/s.
- Pause → Show frame pacing works in the journey and replay. It measures committed scene updates, with a 30/s target; it is not a native GPU frame profiler.

## Terminal warning

The pasted warnings match `react-native-svg`'s gradient parser: its percentage/number-string regex rejects leading-dot strings such as `".55"` and `".85"`. The maze now passes numeric offsets `0.55` and `0.85`; Mayumi's aura uses a valid `"0.5"` offset. Opacity values are a separate SVG property and do not require this change. No warnings are hidden or filtered.

## Validation and limits

Checks cover complete walkable-floor coverage across region seams, forest walls remaining unpainted, bounded visible geometry on portrait and landscape phone cameras, unchanged traveler pixels, gradient-number syntax, stable joystick callbacks, paused/background clocks, and 30/s scheduling on common display refresh rates. Existing controller/navigation/save/story checks remain in place.

Run `node --experimental-strip-types scripts/review-mobile-maze.ts` for six source-art phone frames and a structural render-budget report under `artifacts/mobile-maze-review/`. These are developer renders, not physical-device screenshots. Run `node --experimental-strip-types scripts/prepare-mobile-art.ts` after changing V1 materials or walking source art.

No physical-phone FPS measurement is claimed. Reload Expo Go and compare movement plus Pause → Show frame pacing on the affected device; release builds may behave differently from development mode.

Final verification (2026-10-20): all 165 tests pass, TypeScript checking passes, and Android, iOS and web bundles export successfully. The running web preview resumed the existing Backward Wind replay with V1 textures and the frame-pacing control present. No replay reset was required.
