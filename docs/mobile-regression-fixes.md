# Phone rendering regression repair — 2026-10-20

The [subsequent Turning Paths motion repair](turning-motion-fix.md) keeps native traveler images mounted through idle/blink changes and separates the cached terrain surface from moving actors.

## Stopping jumps, Tala and missing maze creatures

The previous optimization put walking atlases and maze helpers in nested SVG views with `x` and `y` offsets. Browser SVG supports those offsets. The installed native SvgView interface exposes viewport sizes and viewBox properties, but no `x`/`y` placement. Android's `SvgView.drawChildren` draws a nested viewport at the current canvas origin. Consequently the walking crop appeared at a different anchor from the standing vector art. Maze helper art could render near the world origin while its interaction remained at the correct destination.

Walking now uses a group translation, a small explicit clip path and a translated image. It has the same uniform-fit dimensions and fixed foot anchor as standing artwork. Bird flight and giantess art use group transforms internally, and their scene wrappers translate to the correct ground anchors. Terrain fringe chunks and Rae's opening scene received the same correction.

The earlier browser crop tests could not catch this platform distinction. New tests load the actual scene components with a native boundary that deliberately ignores unsupported nested SVG positioning. Tests cover Android/iOS walking, all four directions, repeated start/stop transitions, both helper creatures, each trial and portrait/landscape camera sizes. Real controller tests separately verify that repeated joystick releases preserve world coordinates on every map and trial.

## Spring after restoration

The restored spring previously activated a world-sized live luminance mask. The installed native renderer implements masks through extra compositing passes; memoizing its React component does not remove that drawing work when the root scene redraws.

The existing wet-bed painting and feathered mask are now compiled once into `assets/props/spring-water-mobile.png` (320 × 144). It retains the original masked pixels. During restoration, a small geometric clip advances along the rill. After restoration that clip is removed, leaving a single transparent image without a runtime mask. Sparkles still animate. The completed seal no longer mounts an empty animated SVG layer.

Unchanged character bodies, aura, water glints, weather and Bagtas artwork are memoized at the XML boundary. A regression check verifies zero XML redraws across eight ticks that do not change an art frame. Developer-only trail attributes that produced React console errors were replaced with supported SVG IDs.

Rebuild the water surface after editing its source texture or rill geometry:

`node --experimental-strip-types scripts/prepare-spring-water.ts`

## Verification

Artifacts are under `artifacts/native-scene-fixes/`; the spring image there is rendered from the actual component tree using the native coordinate contract, not captured from a physical phone. The full tests, type checking, all-platform export and fresh browser replay are checked alongside these regressions. Existing spring-controller tests play through the repair, interruption recovery and Chapter 2 ending.

No connected Android/iOS device or native GPU profiler is available in this workspace. These checks establish correct placement and remove the identified rendering work, but do not establish a measured physical-device frame rate. Fully reload Expo Go to replace the older crop component and load the new water asset.

Final results: 170/170 tests passed; TypeScript passed; Android, iOS and web exports succeeded. A fresh browser replay showed the guide bird and both travelers, with no new console warnings or errors. The restored spring workload check has zero live masks and zero unchanged-art XML redraws across eight intervening scene ticks.
