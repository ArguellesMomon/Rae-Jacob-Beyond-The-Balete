# Story objects restored

The previous scenery cleanup removed visual clues that the dialogue and puzzles depend on. Interaction data and reachability tests alone did not catch that regression.

Restored the waterwheel with open spokes, smaller timber details and visible jammed/stopped/repaired states. The splitter diagram is ink on its existing painted board. Its lever, branch, bell and pickup sequence remain. The speaking-tube mouths and grove marker carving are visible again.

Restored animated clothes on Lola's clothesline, including foreground depth as Rae passes behind it and the saved Still setting. Restored the Turning Paths' three changing fork pictures, three study sketches and verse drawings. These use small physical clue plaques; oversized headers, floating arrows, brackets and nameplates remain removed.

Built-in image_gen edited the Bamboo Verge and Riverside Hamlet map paintings. The final app assets are:

- `assets/maps/bamboo-verge-v3.png`: the RAINLIT ROAD sign is baked into the scenery near its existing interaction. It can be inspected before the route is unlocked, then used for travel after Bagtas's debrief.
- `assets/maps/riverside-hamlet-v2.png`: waiting woven baskets and the BUKAL / BATIS / AGOS water lesson are part of the painting. The basket interaction is at native world coordinate (376,239); the lesson is at (478,245). Ground footprints follow the objects and leave the bridge open.

Both final map files are 1280 by 960 pixels for the existing 640 by 480 world. Original map assets remain intact. The Bamboo sign was integrated locally from the generated edit. The complete generated hamlet edit preserves natural shadows; interaction and collision anchors were reviewed against it. The integration script is `scripts/integrate-story-map-edits.ts`. Exact built-in prompts are in `story-map-edit-prompts.md`; the generated source images are retained beside the final assets.

The spring root hollow, stone cradle, empty household outlet and restored-water feedback are visible again. The basket/root support and the newly forming seal still follow quest state.

Validation: TypeScript passes; 126 tests pass, including six added visual/interaction/controller regressions. Rendered-pixel checks require actual fork pictures, distinct changing shapes, visible clothes, a visible wheel with open spokes and a stopped state, the spring hollow/cradle, and the empty/repaired outlet. All nine maps and puzzle states pass reachability review, including the braced spring root. Source-art previews are regenerated with `npm.cmd run props:preview`. Physical-phone touch and performance review remains pending.

Final Android, iOS and web production exports pass. The live web preview and bundle return HTTP 200. Bagtas stands clear of the painted basket rack in the hamlet so both waiting baskets remain visible.
