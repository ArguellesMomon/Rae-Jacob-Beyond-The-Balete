# Chapter 1 — Map, Visual Direction, and Gameplay Blueprint

Project: Rae Jacob: Beyond the Balete  
Companion story: [The Bell Beneath the Balete](chapter-01-the-bell-beneath-the-balete.md)  
Stage: Preproduction. No game code or dependency selection in this pass.

## 1. Direction established by the user

- Lola's Yard must feel like a warm, homey, traditional grandparent's house and yard.
- Rae has light brown skin, medium-long straight hair, shorts, and flip-flops. Interpret the user's "white sanda" as a white sando, a sleeveless undershirt.
- The remaining environments, supporting character appearances, and gameplay details are delegated to the designer.
- The accepted Chapter 1 story remains the foundation. These decisions make that story concrete rather than expanding it into additional chapters.

## 2. Visual foundation

Use original 2D top-down pixel art, with a slight overhead angle that shows building fronts. Depth comes from overlapping foliage, characters passing behind trunks, shadows beneath objects, and bridges over channels. Terrain remains easy to read; this is not an isometric movement system.

**Working art scale:** 16 × 16 source pixels per ground tile; Rae occupies a 16 × 24 sprite canvas. These are production starting points to validate in the prototype. Keep a shared pixel grid and use nearest-neighbor scaling, not blurred filtering. Artwork should read in silhouette before small texture is added.

**Camera:** approximately 20 × 11 tiles visible on a standard landscape composition, with a small adjustment for device aspect ratio. Center the camera slightly ahead of Rae's movement and clamp it to the map boundaries. Plan important clues away from the lower control corners. Cinematic framing uses short, controlled pans; avoid constant zooming.

**Color and light:** the human world has late-afternoon honey, faded painted wood, terracotta, leaf green, and cream. Silong has indigo shadows and moss greens, with amber settlement lights. Keep walkable paths lighter and less textured than the surrounding foliage. Foreground leaves can frame the scene, but should fade when they obscure Rae or an interaction target.

| Purpose | Color | Hex |
| --- | --- | --- |
| Warm cream / sando highlight | Soft ivory | #F5EEDC |
| Yard sunlight | Honey | #E7B66B |
| Dry ground | Warm earth | #BA8B5C |
| Weathered wood | Walnut | #76513A |
| Familiar foliage | Leaf green | #5E7A45 |
| Silong shadow | Deep indigo | #30344F |
| Silong foliage | Deep moss | #36584A |
| Lantern light | Amber | #F2B45E |
| Water | Muted turquoise | #5E9C9B |
| Interactive machinery accent | Weathered ochre | #C89446 |

Color supports object identification, but shapes, animation, and labels also communicate important states.

## 3. Lola's Yard — the emotional anchor

### Home and atmosphere

Lola's house feels maintained through years of everyday care. Use a modest, low-raised house with weathered timber walls, capiz-style window panels, a simple masonry base, and an aged galvanized roof. A deep shaded porch has a wooden bench, a small table, an enamel pitcher, and a plate prepared for merienda. The yard is open packed earth with patches of grass, not a paved courtyard.

Place familiar domestic details in small groups:

- A pair of slippers beside the steps and a broom leaning near the wall.
- Clay and reused plant pots with gumamela and leafy plants.
- A calamansi tree beside the fence; banana leaves at the rear boundary.
- A clothesline with a towel and a few faded shirts moving in the breeze.
- A water basin beside the outdoor washing area.
- A low bamboo fence and an uneven dirt path toward the balete.

Keep the central yard clear enough for Rae to run with his kite. The house must feel like the place someone is waiting for him. It should not look abandoned, luxurious, or ominous. These are choices for this fictional home, not a claim that every traditional Philippine house has the same features.

Lola is visible on the porch during the opening, with a small waving animation when she calls Rae. The balete sits beyond the rear fence, reached by a short side path. Keep it visible from the yard as a natural landmark, with the unusual light appearing only when Rae approaches its roots.

### Suggested blockout

Working map size: **40 × 28 tiles**. Coordinates are layout anchors for blockout, not final collision boundaries; north is up, x increases east, and y increases south.

| Anchor | Approximate tile | Function |
| --- | --- | --- |
| House and porch | House at x3–18, y3–11 | Familiar background and Lola's position. |
| Lola | x12, y12 | Calls Rae; optional short conversation. |
| Rae start / kite yard | x14, y21 | Open movement tutorial with clear foreground. |
| Clothesline | x5–12, y16 | Short inspection and breeze animation. |
| Washing area | x4, y23 | Optional observation. |
| Fence opening | x28, y13 | Clearly connects yard to the tree path. |
| Balete root opening | x34, y6 | Prologue transition trigger after the kite lands. |

The kite flies from the open yard toward the tree, showing the intended route. Invisible camera-edge instructions are unnecessary. The player may explore before approaching the roots. No real-time merienda deadline applies.

### Environmental observations

- Porch snacks: Rae says, "I can smell that from here."
- Clothesline: "Excellent wind report."
- Washing basin: "That is not a swimming pool. Lola was very clear."

Use at most three optional observations in the first prototype so the prologue stays short.

## 4. Character visual sheet

### Rae Jacob

**User-defined appearance:** ten-year-old boy, light brown skin, white sando, shorts, flip-flops, medium-long straight hair.

**Chosen details:** muted teal knee-above shorts with a small pocket for kite string; reddish-brown flip-flop straps; deep brown-black hair reaching the nape, with a loose side fringe and straight strands framing the ears. His face is open and expressive. Keep his build and proportions visibly childlike.

| Element | Base color |
| --- | --- |
| Sando | #F5EEDC, with warm gray shadows |
| Skin | #BC8056, with warm highlights and deeper brown shadows |
| Hair | #2C211E |
| Shorts | #3D7776 |
| Flip-flop straps | #A14C38 |

His white sando is the main recognition point against the forest. Skin shades should remain consistent when lighting changes; the environment tint must not replace his base complexion. Hair silhouette must stay consistent across all directions. He has no shoes, socks, armor, hat, or backpack in Chapter 1.

**Motion:** springy walk, slightly forward-leaning jog, curious head turn at idle, crouch for low interactions, small two-handed pull when using string. Flip-flops remain visible in enlarged references even if only a few pixels read at gameplay scale.

### Lola Selya

Warm brown skin, silver-streaked hair gathered in a low bun, a faded sage blouse, a muted floral skirt, and house slippers. Her silhouette is relaxed, with a hand resting on the porch rail. A waving pose communicates affection without a long cutscene. Palette stays quieter than Rae's white top.

### Tala

A young duwende, roughly two-thirds Rae's visible height in gameplay. Warm brown complexion, short dark hair, a moss-green practical tunic, ochre neckerchief, and a cross-body map pouch. Carries a folded map and a pencil almost as long as her forearm. Avoid a generic red pointed gnome hat. Her readable identifying shapes are the pencil, pouch, and squared, determined stance.

Use a 16 × 16 sprite canvas with transparent padding as needed. Important dialogue portraits show her expressions more clearly than the small world sprite can. Her clothing and individual traits are original character design.

### Minda

An older duwende with warm brown skin, tied-back gray hair, rolled sleeves, a faded blue work apron, and a small belt of maintenance tools. Her posture and work station establish her as the waterkeeper. She remains visually distinct from Tala through blue clothing, gray hair, and a broader silhouette. A compact portrait identifies her when she speaks through the bamboo tube.

### Mang Uban

A giant with deep brown skin, a broad silhouette, long charcoal hair with gray streaks, a heavy brow, and expressive, tired eyes. Wears simple dark earth-toned clothing. His scale is built into the tree composition: a seated body spanning several tiles, with feet and one hand readable below the canopy. Keep a slow smoke effect around his perch and strong facial expression; the smoke is not a gameplay hazard.

Treat him as a partly animated environmental character rather than building a full giant locomotion system for this chapter. The reveal pans upward from the roots to his face, then returns to the interaction framing. His size remains legible without shrinking Rae to an unreadable dot.

## 5. Connected map blueprint

```text
HUMAN WORLD
Lola's Yard ---- root hollow ----> Arrival beneath the roots
                                      |
SILONG                                v
                                Lantern Clearing
                                /              \
                       Old Balete Grove <--> Rootwater Works
                                                  |
                                      repaired footbridge
                                                  |
                                       bell-guided exit
                                                  |
                                Bamboo paths / Chapter 2
```

Arrival is a small area within Lantern Clearing's map, not a fifth map. The final root-seal reveal sits on the waterworks exit approach. The grove-to-waterworks connection creates a short investigation loop rather than forcing the player to repeat a long corridor.

### Lantern Clearing

Working size: **36 × 28 tiles**. Main identity: amber windows in large roots, tiny domestic paths, and a clear central gathering area.

| Anchor | Approximate tile | Function |
| --- | --- | --- |
| Arrival hollow | x4, y23 | Safe arrival; original opening visibly closed. |
| Tala introduction | x11, y18 | Required first meeting on the approach to the central clearing. |
| Tiny root homes | x5–15, y6–12 | Domestic scale; optional observations. |
| Minda's work station | x24, y12 | Waterkeeper conversation and speaking tube. |
| Empty bell arch | x28, y19 | Broken cord clue and final bell restoration. |
| Grove exit | x16, y2 | Large roots and deeper shade visibly distinguish it. |
| Waterworks exit | x34, y15 | Follow the channel and maintenance signs east. |

The bell arch marks the local crossing network; it is not itself the final chapter boundary. Rehanging it restores the route beyond the footbridge, with a brief camera cue and updated map entry showing where to go next. Minda walks from her nearby station to the arch for the return scene.

### Old Balete Grove

Working size: **30 × 32 tiles**. Main identity: enormous vertical roots, a quiet lower clearing, and Mang Uban's upper perch.

| Anchor | Approximate tile | Function |
| --- | --- | --- |
| Clearing connection | x13, y30 | Safe southern entrance. |
| Conversation position | x14, y21 | Clear view of Rae, Tala, and the giant reveal. |
| Mang Uban's perch | x12–21, y6–16 | Large environmental character with canopy layers. |
| Speaking tube clue | x23, y23 | Visible vibration and sound caption. |
| Waterworks connection | x28, y25 | A short maintenance trail following the tube. |

The grove looks mysterious rather than hostile. Avoid random enemies or damaging plants. The bell occasionally interrupts its slow ambience; it must not ring constantly.

### Rootwater Works

Working size: **38 × 30 tiles**. Main identity: one understandable machine with two clearly separated water routes. Preserve room to see the splitter and both destinations before committing to an action.

```text
                         UPSTREAM INTAKE
                                |
                    [splitter + control lever]
                         /             \
                  WEST BYPASS       EAST CHANNEL
                       |                  |
                 [fallen branch]    [wheel + bell]
                       |             [service grate]
                       |                  |
                       |            [footbridge approach]
                       \__________________/
                           downstream

        Dry service paths connect the lever, branch, and grate.
        The west bypass rejoins BELOW the footbridge approach.
```

The diagram shows water topology, not walkable corridors. Build dry banks and a maintenance catwalk so Rae can reach every puzzle control without crossing moving water. The branch can be pushed from the dry bank into one outlined shallow recess. Its movement is constrained to that safe destination.

The service grate is beside the wheel, accessible from above. The bell handle can be seen through it, explaining the use of a string loop after the wheel stops. Keep the bell visibly distinct from wooden paddles.

Minda has placed a work barrier at the footbridge approach. While the repair is incomplete, inspecting it explains that the crossing remains closed for maintenance. Diverting water can reduce splashing before the repair is finished; it does not automatically remove the barrier. Once the bell is retrieved and normal wheel flow restored, Minda confirms the repair through the tube and Tala opens the simple barrier. This makes the restriction explicit rather than relying on invisible collision after the water stops.

Beyond the bridge, the destination remains unreadable and the visible path curls back toward the crossing until the waybell is rehung. Inspecting it says, "The path keeps folding back on itself." After the bell is restored, its marker reads Bamboo Crossing and the route visibly straightens. Do not use an unexplained locked exit.

The sealed side passage is visible beside this exit. It remains separate from the newly opened road and does not block the earned chapter transition.

## 6. Gameplay specification

### Movement and collision

- Landscape play. Eight-direction movement with four-direction character facing and animation.
- Floating left joystick. Approximately 18% dead zone; inner travel walks, outer travel jogs. No stamina or separate run button.
- Starting speeds: about three tiles per second walking and four-and-a-half jogging; tune on a phone rather than treating these as fixed promises.
- Normalize diagonal movement so it is not faster than straight movement.
- Use Rae's feet for collision, with an initial footprint around 10 × 6 source pixels. His head may overlap scenery where appropriate.
- Allow gentle sliding along walls and roots. No jumping, climbing, swimming, or platform timing in Chapter 1.
- Tala follows roughly one tile behind. She does not block Rae, push objects, or fall into water. Catch her up at a safe location after transitions if scenery separates them.

### Camera and readability

- Keep the world pixel aligned. Interface text is independently scaled for phone readability.
- Reserve lower corners for controls; an important object must remain visible when Rae is close enough to use it.
- Tree canopy and foreground roots become partially transparent if they hide Rae or the focused target.
- Story pans briefly lock movement and restore it clearly when finished. Normal dialogue does not move the camera unnecessarily.

### Interactions

- A contextual action button chooses a nearby reachable target, starting around one-and-a-quarter tiles from Rae's feet.
- Prefer the closest target in his facing direction. Keep the current target stable while it remains valid, preventing flicker between adjacent objects.
- Show a subtle outline and an action label before pressing: Talk, Inspect, Push, Use, Take, or Ring.
- Face Rae toward the target automatically on interaction; do not demand precise joystick alignment.
- Place targets far enough apart that each has an obvious approach. Avoid interaction through walls or from the wrong side of the wheel.
- First string use opens a compact item selector. Selecting string performs a short authored action; the player does not need to draw a lasso or aim a physics rope.

### Mobile interface

- Left joystick roughly 112 device-independent pixels wide; main action button roughly 64, with at least a 48-pixel touch target for smaller controls.
- Right-side secondary item button appears after inventory is introduced. Notebook and pause controls sit at the upper edges, inside safe areas.
- Controls use subdued translucent shapes; dialogue boxes use warm parchment, a dark wood border, and high-contrast text.
- Use a clear UI font for dialogue. Reserve decorative pixel lettering for short titles and signs. Do not rasterize long dialogue into tiny pixel text.
- Dialogue opens over the lower portion of the screen, with a portrait and speaker name. Movement pauses and the joystick hides. Choices are large stacked buttons with no time limit.
- Tapping reveals the rest of a line, then advances on the next tap. Essential clues are also recorded in the notebook.
- Haptic taps and sound are optional feedback. Neither is required to understand a clue.

### Puzzle and story progression

Persist these conceptual states; implementation names can change:

| State | Values / purpose |
| --- | --- |
| Arrival | Prologue complete and arrival scene seen. |
| Tala | Met; accompanying Rae. |
| Mang Uban | Introduced; Heart Balete lead delivered. |
| Evidence | Bell arch, Minda account, speaking tube; independently discovered. |
| Bypass | Branch obstructing or cleared. |
| Splitter | East or west. West is blocked by the safety float until the branch is cleared. |
| Bell | In wheel, carried by Rae, or rehung. |
| Repair | Complete when the bell is removed and the splitter is restored east. |
| Route | Restored when repair is complete and bell is rehung. |
| Ending | Root-seal reveal seen; Chapter 1 complete. |

Mechanics do not require every clue to be collected. The wheel can be repaired before talking to Mang Uban. If the player does that, Mang Uban introduces himself and delivers the Heart Balete lead during the restoration celebration instead; his dialogue acknowledges that Rae already solved the noise. The notebook's joke about the giant appears only after Rae has met him. Earlier conversations must recognize completed repairs rather than asking the player to repeat them.

The long-term goal stays "Find a way home." Show one local objective at a time. Completed actions never reset because the player discovered information in an unexpected order.

### Saving, interruption, and recovery

- Local persistent save for the single-player prototype; no account, server, or cloud dependency.
- Save after scene changes, key conversations, each durable puzzle change, bell restoration, and chapter completion.
- Save on app backgrounding when the platform allows it, but do not rely on that as the only save opportunity. Pause play when the app is inactive.
- Resume at the nearest safe point in the current map with puzzle state intact. If interrupted during a short animation, restore the last completed logical step rather than leaving an object halfway moved.
- The branch has no invalid push position. The bell and string cannot be discarded. There are no deaths, lost items, or resource costs for experimentation.
- The pause menu contains Resume, Notebook, Sound, and Return to Title. Starting a new game over an existing save requires a clear overwrite choice in the eventual implementation.

## 7. Prototype and asset order

1. **Movement scene:** a small section of Lola's Yard, Rae, foot collision, camera, joystick, and one inspectable object. Validate the white sando silhouette, hair, and flip-flops on a phone.
2. **Conversation scene:** add Lola and Tala using reusable dialogue presentation. Validate text and touch targets in landscape.
3. **Waterworks blockout:** playable dry banks, lever, branch, wheel, string use, and visible repair states. Use simple temporary art to resolve puzzle readability first.
4. **Complete chapter flow:** connect four maps, include the required story beats, add notebook and saving, and handle alternate discovery order.
5. **Art and sound pass:** replace blockout assets with consistent sprites and tiles, add ambient motion, portraits, music, and the short story animations.

First animation budget: Rae four-direction idle/walk/jog plus short interaction poses; Tala idle/walk/map check; Lola idle/wave; Minda idle/work; Mang Uban idle/blink/hand movement. Environment priorities are water, wheel states, lanterns, clothesline, foliage, and bell movement. A full kite tool, advanced companion AI, combat, day/night simulation, and unrestricted rope physics are not part of this chapter.

This sequence validates the Expo Go target before committing to final asset production. Compatibility and actual device performance still need to be demonstrated by the prototype; the concept image is not evidence of either.

## 8. Review artifacts

- This document: map blueprint, character direction, and gameplay rules.
- [Chapter story](chapter-01-the-bell-beneath-the-balete.md): narrative beats, example dialogue, and intended ending.
- [Concept preview prompt](art-direction/lolas-yard-concept-prompt.md): exact prompt for the generated yard and Rae visual reference. The concept preview is art direction, not a production tileset or animation sheet.
- [Lola's Yard and Rae concept preview](art-direction/lolas-yard-rae-concept-v1.png): generated using the built-in image_gen tool and copied into this workspace. The preview establishes warmth, costume, and environmental detail. Its camera and high detail level are illustrative; actual maps use the simpler overhead view and tile scale specified above. Background animals and incidental props in the generated preview are optional decoration, not additional gameplay requirements.
