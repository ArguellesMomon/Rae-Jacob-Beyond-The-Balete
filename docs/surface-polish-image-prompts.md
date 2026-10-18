# Spring and Rootwater Works: surface artwork polish

October 18, 2026. Used the built-in image_gen tool through the imagegen skill. No CLI fallback was used.

## Generated assets saved in the project

- `assets/props/works-lever-v1.png`: weathered wooden handle, rope grip and stone socket.
- `assets/props/works-branch-v1.png`: mossy, crooked fallen wood with broken ends.
- `assets/props/spring-wet-bed-v1.png`: translucent shallow water painted into the existing streambed.
- `assets/props/spring-bark-seal-v1.png`: fine original twig/vein seal integrated into the hollow's bark rim.

Full generated sources are retained under `assets/props/generated/` with matching `*-source.png` filenames. Run `node --experimental-strip-types scripts/integrate-surface-polish.ts` to reproduce cropping, resizing and edge alpha preparation. Original scene assets remain available.

## Integration

The old flat water strip and dotted white seal are removed. The generated wet texture is clipped to an irregular, softly edged streambed mask, widens into small shallow pockets, and reveals downstream during restoration. Only small broken glints animate above it. Collision geometry follows the revised bed centerline; the seal interaction is on the dry bank at (520,281).

The wooden lever and movable bypass branch replace their former flat SVG silhouettes. The lever's stone socket stays fixed while its handle turns around (320,201), rather than mirroring the entire assembly. Its short turn uses the existing flow-change event, skips initial-load replays and respects Still. The branch keeps its original blocked/recess locations. Props sort with actors by depth.

The bark inlay is original Silong artwork, not a claim to reproduce a traditional or sacred design. It appears only after the existing story reveal; no bright cross or UI-like ring covers the hollow.

All four textures are preloaded with the game's environment assets for Expo Go/native and web.

## Exact built-in imagegen prompts

## Validation

- 140 tests pass, including generated PNG alpha, visible lever turn frames, fixed-pivot endpoints, Still/load behavior, streambed confinement and downstream reveal, hollow darkness and seal visibility.
- TypeScript passes; Android, iOS and web exports succeed.
- Navigation review covers all nine maps, including every spring repair state and replay spawn.
- Runtime art reviewed in `artifacts/spring-surface-final-review.png` and `artifacts/works-props-final-review.png`. The detail previews render at four pixels per world unit so raster textures retain their display detail.
- These are source-art and build checks. No connected browser/device playthrough is claimed.
