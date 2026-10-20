# Three trial terrain atlas

Created with the built-in image_gen tool and the imagegen skill on 2026-10-19. No CLI/API fallback was used. The previous Turning Paths painting was a style reference, not an edit target.

Source: [maze-trial-atlas-source.png](../assets/maps/maze-trial-atlas-source.png), 1024 × 1536.

The six 512 × 512 swatches are cropped production textures. In each trial, the renderer applies one forest texture and one dirt texture to a generated, collision-matched route network. These are distinct, newly generated maps; a fixed painting is not stretched to impersonate different layouts.

- [Stone floor](../assets/maps/maze-stone-floor-v1.png), [stone forest](../assets/maps/maze-stone-forest-v1.png).
- [Wind floor](../assets/maps/maze-wind-floor-v1.png), [wind forest](../assets/maps/maze-wind-forest-v1.png).
- [Water floor](../assets/maps/maze-water-floor-v1.png), [water forest](../assets/maps/maze-water-forest-v1.png).

## Exact generation prompt

Use case: stylized-concept. Asset type: A SINGLE PRODUCTION TERRAIN ATLAS for three procedural Filipino folklore pixel-art RPG maze maps. Reference image is STYLE ONLY. New image size 1024x1536, exactly 2 columns by 3 rows of square 512x512 seamless material swatches. NO grid lines or gaps: each swatch fills its allotted square edge to edge.
Left column: walkable forest floor texture, absolutely no impassable objects. Right column: dense bamboo foliage/obstacle texture viewed from above at slight 3/4 RPG angle, tiny mossy boulders and ferns, no dirt paths. All six squares are texture swatches, NOT composed maps, no roads through them.
ROW 1, y=0..511: moss-stone trial. Left earthy tan gray dirt, tiny stone chips, leaf scatter, dappled warm golden light with cool green reflections. Right intricate mossy green bamboo clumps and small granite boulders, deep teal crevices.
ROW 2, y=512..1023: wind trial. Left warm amber dirt, tiny fallen bamboo leaves and small dry sheaths, dappled golden light, irregular pixel clusters. Right dense golden-green bamboo leaf crowns, curved stems visible among leaves, tiny light fern tips, dark green crevices.
ROW 3, y=1024..1535: water-echo trial. Left damp brown earth with pale gravel and tiny blue reflections, still DRY WALKABLE SOIL, no pools. Right lush blue-green bamboo, wet mossy stones, delicate blue-white flowers, very small water pockets fully surrounded by foliage, emerald shade.
Match reference's richly detailed retro pixel art, crisp tiny irregular pixel clusters, tactile material texture, excellent environmental depth, gold upper-left light and deep green ambient shadows. Natural organic art, no smooth vectors, no harsh cartoon outlines, no UI. Consistent scale: leaves roughly 8-20 pixels, bamboo clumps 90-150 pixels across. Lighting is distributed so swatches repeat without an obvious bright center. Texture MUST extend consistently to all four boundaries; no vignette, no border, no horizons, no characters, no text, no labels, no symbols, no signboards.
