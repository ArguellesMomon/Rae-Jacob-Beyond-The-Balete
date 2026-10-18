# Riverside Hamlet: clear the bridge approach

Used the built-in image_gen tool through the imagegen skill, October 18, 2026.

Removed the Small Water Lesson board from the map, its interaction, dialogue and collision. Also removed the separate outlet fixture shown in the user's screenshot and its collision. The spring puzzle, village baskets and existing bridge remain.

Shipped map: `assets/maps/riverside-hamlet-v3.png`.
Retained generation source: `assets/maps/riverside-hamlet-cleared-source.png`.
The integration script `scripts/integrate-cleared-hamlet.ts` applies only a 124×96 patch at (900,374) to v2. Other map pixels remain unchanged.

## Exact imagegen prompt

Reference/edit target: `assets/maps/riverside-hamlet-v2.png`. Transparent background: false.

Use case: precise-object-edit. Edit target: the attached Riverside Hamlet pixel-art RPG map. Remove ONLY the small vocabulary teaching sign with the text BUKAL / BATIS / AGOS beside the LEFT entrance of the bamboo bridge at the right-center of the image (on a 1280x960 grid, the sign and its two posts occupy roughly x908 to1018, y382 to467). Remove all of that teaching board, its posts and dedicated clutter, and naturally restore the sunlit compacted earth, tiny pebbles and a few ground-edge plants behind it. The bridge approach must be broad, flat and walkable, visually joining the central dirt yard to the existing bamboo bridge without obstruction. Preserve the bridge deck, bridge railings and bridge structural posts. Preserve all houses, waterfall, river, baskets, basket-maker work area, people-free layout, paths, vegetation, pixel-art texture, colors and dappled lighting elsewhere. Do not add any new sign, words, object, person, NPC, UI or decoration on the cleared path. Same complete 4:3 map composition, framing and perspective, no zoom or crop, no border. This is removal/inpainting, not a redesign. Keep everything outside this tiny board area unchanged.

The game and all map review scripts reference v3. Existing navigation coverage now checks every ground point along the cleared approach and bridge centerline (x420–590, y240), before and after the spring repair.
