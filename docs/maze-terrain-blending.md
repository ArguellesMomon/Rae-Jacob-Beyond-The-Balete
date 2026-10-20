# Joined terrain for the three randomized trials

Current revision: the user requested the V1 floor/forest texture families again, while retaining the current maze layouts. The runtime now uses mobile-sized V1 material plates and viewport-limited clip paths. [Current material and phone-performance notes](mobile-maze-performance.md). The V2 generation history below is preserved as an asset record.

The previous atlas contained complete upright bamboo scenery. Repeating its square crops across the world cut bamboo, rocks and lighting at tile boundaries. Independent rounded path rectangles made those cuts more conspicuous.

All three trials now use the same corrected terrain pipeline:

- Two continuous 3072 × 2304 production plates span the entire 1536 × 1152 world. Small generated ground materials are prepared with periodic overlap blending at their edges before baking these plates. No scenery tiles, mirrored quadrants or runtime SVG patterns remain.
- A single contour is traced around the union of the logical trails, including its holes. Slight seeded variation, rounded small corners, a narrow translucent transition and leaf flecks soften the boundary.
- Eight complete transparent foliage sprites sit in non-walkable forest space. Their full silhouettes are checked against every supported trail and clue clearing before placement.
- Ground detail has two source pixels per world pixel and pixel rendering on web, avoiding the enlarged blurry texture from the first revision. The stage tints remain cool stone, golden wind and blue-green water.
- Gameplay graphs, collision rectangles, seed persistence, witness clues and puzzle rules are unchanged. Other story maps already use complete background paintings; the repeated scenery pattern was confined to the three generated trials.

## Saved production assets

- [Earth plate](../assets/maps/maze-earth-v2.png)
- [Understory plate](../assets/maps/maze-understory-v2.png)
- [Transparent foliage atlas](../assets/maps/maze-foliage-source-v2.png)
- [Foliage 1](../assets/maps/maze-foliage-1-v2.png)
- [Foliage 2](../assets/maps/maze-foliage-2-v2.png)
- [Foliage 3](../assets/maps/maze-foliage-3-v2.png)
- [Foliage 4](../assets/maps/maze-foliage-4-v2.png)
- [Foliage 5](../assets/maps/maze-foliage-5-v2.png)
- [Foliage 6](../assets/maps/maze-foliage-6-v2.png)
- [Foliage 7](../assets/maps/maze-foliage-7-v2.png)
- [Foliage 8](../assets/maps/maze-foliage-8-v2.png)
- [Earth generation source](../assets/maps/maze-earth-source-v2.png)
- [Understory generation source](../assets/maps/maze-understory-source-v2.png)

Generated using the built-in image_gen tool and imagegen skill on 2026-10-19. No CLI/API fallback. Production preparation crops and normalizes sprites and bakes material plates; the exact steps are in scripts/prepare-maze-terrain.ts.

## Exact prompt set

### Earth

Use case: stylized-concept. Asset type: production RPG terrain material, one continuous square bitmap.
Paint a continuous TOP-DOWN view of fine warm ochre soil on the floor of a Philippine bamboo forest. This is a ground material plate to cover an entire 1536 by 1152 game world ONCE, not an illustration of a scene. Square composition at high resolution. Very small-scale pixel-art detail, tiny scattered dull pebbles, tiny bamboo leaf fragments and flecks, gently varied packed earth and subtle dusty patches. Uniform overhead soft daylight, low contrast, consistent hue and scale across the whole image. The whole image is WALKABLE bare soil. Most surface is quiet midtone soil so small game characters read clearly. Rich handmade retro RPG pixel texture with crisp small pixel clusters, natural muted golden brown, no blurry photographic macro surfaces. NO vegetation clumps, no rocks larger than tiny gravel, no trunks, no bamboo poles, no roots, no path outlines, no roads, no perspective, no horizon, no isolated bright pools or directional sunbeams, no large dark shapes, no repeating arrangement, no borders, no panels, no grid, no text, no characters or items. All four edges have the same calm soil density as the center.

### Understory

Use case: stylized-concept. Asset type: production RPG terrain material, one continuous square bitmap.
Paint a continuous directly TOP-DOWN forest-floor ground cover in a Philippine bamboo woodland. A single large natural uninterrupted material plate to cover an entire 1536 by 1152 game world ONCE. High resolution square image. Densely interwoven small jade and deep olive leaflets, tiny moss clumps, tiny fallen bamboo leaves, dark cool earth glimpsing between little low ground-cover plants. Very small-scale detail, fine crisp handmade pixel-art clusters, quiet overall low-contrast shaded green field. Consistent overhead soft ambient daylight and plant scale across entire canvas. Rich retro RPG art, visually readable behind sprites. This is ONLY the low underlying forest floor, with no standing tall vegetation, no scenery or landmark. NO upright bamboo culms, no tall trees, no large fronds, no boulders, no thick roots, no open paths, no patchwork, no horizon, no perspective vanishing point, no sunbeams, no large light or dark patches, no panels, no border, no text, no characters. Leaves should feel scattered naturally with no obvious directional rows. All edges remain natural small ground cover.

### Foliage atlas

Use case: stylized-concept. Asset type: transparent pixel-art foliage sprite sheet for a Philippine bamboo-forest adventure game.
A precisely aligned sprite atlas with FOUR columns and TWO rows, eight isolated plant clumps, one per equal square cell. Genuine transparent background everywhere outside plants. Each plant entirely inside its cell with at least 12 percent clear padding on every side; no clipping, no ground rectangles, no tile borders, no text. Same consistent 3/4 overhead retro RPG perspective and fine crisp pixel-art clusters, handmade lush jade, olive, soft yellow-green highlights, deep blue-green shadows and earthy base. Soft light from upper left. Same scale and baseline across cells. These are compact natural plants suitable for trail edges, not giant trees.
Top row left to right: 1 low small broad-leaf fern rosette, 2 compact cluster of leafy bamboo shoots with three short visible culms, 3 low mossy stone partly covered by tiny ferns, 4 compact bush of drooping narrow bamboo leaves.
Bottom row left to right: 5 small fern with curled young frond, 6 short bamboo cluster with sparse canopy and five culms, 7 low woodland leaves with two tiny pale flowers, 8 mossy root nub with small grass and narrow bamboo leaf litter.
No people, no buildings, no props, no cast shadow rectangles, no huge upright trunk, no photorealism, no glossy 3D. Individual complete silhouettes and soft organic edges. This will be cropped into eight real production sprites.

### Transparent cutout correction

Edit target: the attached eight-plant sprite sheet. Remove only the entire blurred green backdrop and replace it with genuine zero-alpha TRANSPARENCY. Every gap between leaves and between all eight plant clumps must be transparent, as must all four image edges. Preserve the exact eight plant designs, their colors, pixel-art details, current 4-column by 2-row positions and silhouettes. Do not add any background color, checkerboard, gradient, scenery, glow, floor, border or text. This is a production cutout PNG atlas, not an illustration on a green canvas. Keep leaves and their existing fine edges intact.

## Review

Run npm run turning:preview for all three maps and nine close camera frames under artifacts/random-trials/. Full-map views are developer review artifacts, not player-facing maps. tests/maze-terrain.test.ts rasterizes the contour for nine seed/trial combinations and checks every supported floor sample, foliage exclusion and genuine sprite transparency.

Validation completed: 153 tests pass, TypeScript passes, and Android/iOS/web exports pass. All three close camera source-art views were inspected, followed by a live browser walk on the first trial at 844 × 390. [Live mobile browser capture](../artifacts/maze-blend-mobile-browser.jpg). No new physical-device performance playtest is claimed.
