# Turning Paths: the five-arch maze

Generated on 2026-10-19 with the built-in image_gen tool, using the imagegen skill. No API/CLI fallback was used.

- New source: [turning-maze-source.png](../assets/maps/turning-maze-source.png).
- Production asset: [turning-paths-v3.png](../assets/maps/turning-paths-v3.png), normalized to 1280 × 960 for the existing 640 × 480 world.
- Style reference: [turning-paths-v2.png](../assets/maps/turning-paths-v2.png).
- Original layout reference used for generation: [turning-maze-layout-source.png](../assets/maps/turning-maze-layout-source.png).
- The final authored ground follows the generated painting conservatively, rather than granting movement across decorative margins. Its southern cross-path is at y=380, its central row at y=230. See [turningMaze.ts](../src/game/turningMaze.ts).

## Exact generation prompt

Use case: stylized-concept. Asset type: FINAL PLAYABLE background map for a Filipino folklore pixel-art mobile RPG, 1280x960, 4:3.
Input image 1 (turning-paths-v2.png) is STYLE, CAMERA AND MATERIAL REFERENCE ONLY. Input image 2 (turning-maze-layout.png) is the REQUIRED EXACT GROUND LAYOUT. Create a completely NEW enchanted bamboo maze, not the old three-way junction.
Match image 1's exquisite dense retro pixel clusters, mossy deep teal bamboo, golden damp earth, dappled gold light, tiny fern textures, warm Philippine forest atmosphere, top-down 3/4 RPG camera without horizon. Every tan corridor in image 2 MUST remain a continuous unobstructed walkable dirt trail in exactly that location and approximately that width. Preserve every junction, loop and short dead-end spur. The dark green areas become densely planted impassable bamboo islands with low clearly readable edges. Do not merge corridors across green islands. Do not block any tan corridor with plants, rocks, water or foreground trunks. Use natural irregular trail margins extending slightly outside the tan area, but keep the whole tan floor supported and clear.
Bottom entrance centered x=640 pixels. Five trail thresholds: western bend near (120,360), top-left (320,140), top-center (640,140), top-right (960,140), eastern bend (1160,360). These are dirt openings, NO doors, NO signboards. Top ends terminate in distant shadowy bamboo arches with clear dirt beneath. A tiny split mossy boulder BESIDE the left short dead-end near (440,720), a bowed bamboo crown BESIDE the central junction near (640,480), a tiny spring seep BESIDE the right short dead-end near (840,720), all off the walkable dirt.
Art direction: mysterious tikbalang trickster territory, bamboo subtly leaning in opposing directions, faint blue-green ground mist hugging foliage borders, paired misleading hoofprints along the margins, delicate shafts of light, overlapping leaf canopies kept within islands. Welcoming but uncanny and richly atmospheric. Distinct asymmetrical foliage clusters, varied bamboo ages, peeled sheaths, gold litter, fine moss and reflected greens. Crisp game-ready pixel art, no smooth vector aesthetics.
No people or creatures, no UI, no words, no letters, no arrows, no floating effects, no large objects on the dirt. FULL BLEED finished game art, no border. Ground layout is a strict gameplay requirement.
