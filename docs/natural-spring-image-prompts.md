# Natural spring artwork: prompts and asset record

Generated with the built-in image_gen tool through the imagegen skill on October 18, 2026. No CLI/API key workflow was used.

## Shipped assets

- `assets/maps/quiet-spring-v2.png`: localized generated terrain patch plus the generated stone cradle. The rest of v1 is retained pixel-for-pixel.
- `assets/props/spring-root-v1.png`: transparent moving root sprite.
- `assets/props/spring-basket-v1.png`: transparent recoverable basket.
- `assets/props/spring-brace-v1.png`: transparent temporary support.
- `assets/props/spring-cradle-v1.png`: generated stones composited into the fixed terrain.
- `assets/maps/quiet-spring-natural-source.png` and `assets/props/generated/spring-*-source.png`: retained generation sources.

Asset preparation is reproducible with `node --experimental-strip-types scripts/integrate-natural-spring.ts`. Sharp only crops, scales, preserves alpha and composites the generated artwork; image_gen authored the objects and terrain. Original assets remain available.

The new rill follows shared geometry in `src/game/springScene.ts`. Both water animation and collision boundaries use that route. Fixed scenery is painted into the map, while the lifting root, temporary brace and recoverable basket remain separate. Their contact shadows stay on the ground and their group participates in character depth sorting.

## Background edit prompt

Edit target/reference: `assets/maps/quiet-spring-v1.png`. Opaque background.

Use case: precise-object-edit. Asset type: production 2D pixel-art RPG map background, 4:3 composition. Edit target Image 1 is the Quiet Spring map, 1280 x 960; preserve its exact framing, camera angle, forest, spring pool, waterfall, paths, rocks and rich dappled lighting. Make a very localized addition ONLY in the right-hand dirt clearing beneath the pool. Paint a small NATURAL DRY SIDE RILL, an irregular shallow groove in the earth with tiny weathered pebbles, damp brown silt, scattered moss, leaf litter, and soft contact shadows. It must look excavated by water, NOT a pipe, hose, raised trough or constructed canal. On the 1280x960 coordinate grid its center follows (904,422), (908,458), (930,470), (936,492), (978,502), (996,512), (1058,508), (1104,492), (1152,478), (1172,472). Keep the groove narrow, about 10-16 pixels wide, meandering and irregular, blending into the ground; no dark vector outline and no uniform parallel rails. Just inside this curve, centered at (1042,456), paint one low, old exposed tree-root knuckle about 45 pixels wide and 60 pixels tall, partly buried with moss and a small dark natural hollow facing the camera, NOT a cut planked sign, flat rectangle or post. Leave that hollow unmarked, no symbols. Near (814,552), paint three small flat rounded mossy stones embedded in the soil, a low natural cradle for a fallen branch that will be a separate moving sprite; stones should remain within about (796,542)-(834,558). Do NOT add the fallen branch, basket, brace, people, NPCs, UI, labels, captions or signs. The moving items will be separate sprites. Match the reference's detailed crisp pixel clusters, warm reflected earth colors and angled sunlight; everything is grounded, weathered, organic and at the existing map's scale. Preserve every other part of the original composition. Output the complete map with no crop or added border.

The generator approximated placement. The integration script localizes/scales the selected patch so the hollow aligns with the existing story interaction, then derives the rill's final game geometry from the integrated terrain.

## Transparent sprite prompts

Style reference for each: `assets/maps/quiet-spring-v1.png`. These are separate built-in generation calls with transparent_background enabled. The common prefix below was followed by the corresponding subject prompt.

Use case: stylized-concept. Production sprite for a detailed Filipino folklore pixel-art RPG. Input image is STYLE AND LIGHTING REFERENCE ONLY, not the edit target. Match its crisp irregular pixel clusters, weathering, earthy colors, 3/4 top-down view, golden light from upper left, green reflected forest shade and dark warm crevices. One isolated object on a genuinely TRANSPARENT BACKGROUND, no floor tile, no rectangle, no painted landscape, no text or border, no pixel outlines of uniform thickness. Intricate but readable texture, not smooth vector or cartoon shapes. Keep all parts fully inside the canvas with transparent padding.

### root

Subject: ONE old fallen tree ROOT / gnarled branch, lying horizontally from left to right, about 4 times wider than tall. Organic taper, twisted bark with cracks, a little moss and fine torn root fibers, irregular rounded silhouette, NOT straight sawn timber or a plank. The thick blunt left end curves gently down into a low arch and the right end tapers into two slender roots, lowest right tip. A heavy woody root naturally curved rather than a symmetrical bridge. No leaves sticking high up. Designed to span a narrow irrigation rill in an overhead forest clearing. Only the root cutout, no basket, brace, stones or ground. Wide landscape canvas.

### basket

Subject: ONE small worn traditional handwoven bamboo/rattan delivery basket with a single bent carry handle, tilted gently on its side as if caught against a root. Oval opening shows dark interior, loose woven fibers, a patched rim, warm honey-brown reeds, specks of green moss near the damp base. View from above and front at the same angle as the referenced map, not an icon or frontal flat square. About as wide as tall including the handle. No contents, no root, no props, no floor patch. Only the basket cutout.

### brace

Subject: ONE short, sturdy forked wooden support stake. A naturally Y-shaped rough branch, slightly leaning left, with two cut upper prongs and a short thick trunk ending in a worn flat foot. A few tight loops of simple brown fiber rope bind below the fork. Weathered bark, cut pale end grain, moss specks, scratches, irregular silhouette. Fully visible from 3/4 overhead angle matching the map. Intended to wedge under a fallen root, so both supporting tips clearly visible. About twice as tall as wide. Only the small wooden brace, no root, no basket, no separate stones and no ground tile.

### Stone cradle

Use case: stylized-concept. Production pixel-art RPG terrain prop, one isolated low cradle made of THREE SMALL FLAT WEATHERED STONES touching each other in a shallow arc. Input image is lighting, texture and camera style reference only. Rounded irregular brown-gray stone slabs half buried, moss in their crevices, warm gold sunlight upper left and cool dark green shade lower right, dappled light, crisp pixel clusters matching the forest floor in the reference. Three-quarter top-down view, ground-level silhouette about FOUR times wider than tall. The center stone lies flat and low, suitable for resting a fallen root on. Small, practical and natural, NOT a pedestal, brick wall, building, basin, raised object, sign, arch or sacred symbol. Actual transparent background, no tile of soil, no glow, no frame, no text, no surrounding objects. Restrained palette and very soft short contact shadow immediately under the stones. Keep all three stones fully inside a wide canvas.

## Review

137 tests pass, including real alpha, state-specific sprite visibility, root lift/settling, protected map pixels, narrow progressive water flow and rill collision boundaries. Navigation review covers all nine maps and spring puzzle states. TypeScript and Android/iOS/web exports are also checked. Rendered source-art previews were inspected; there is no connected browser or physical device playthrough in this session.

Source-art comparisons: `artifacts/props-spring-states.png`, `artifacts/props-spring-review.png`. Regenerate with `npm run props:preview`.
