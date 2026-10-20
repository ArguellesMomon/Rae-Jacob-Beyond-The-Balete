# Rae Jacob: Beyond the Balete

A React Native + TypeScript + Expo SDK 57 adventure prototype with a complete playable Chapter 1 and a complete playable Chapter 2 story arc. Chapter 1, *The Bell Beneath the Balete*, follows this route: **Lola's Yard → Lantern Clearing → Old Balete Grove → Rootwater Works → the restored crossing and root-seal ending**.

## Play

From this project folder in PowerShell:

```powershell
npm.cmd install
npm.cmd start
```

Open Expo Go on a physical phone and scan the terminal's QR code. Keep the phone and computer on the same Wi-Fi network and hold the phone in landscape. Allow Node's local-network connection if Windows Firewall asks. A physical-device connection and actual touch responsiveness still need to be checked on the user's phone.

The current handoff also includes [a QR image](artifacts/expo-go-qr.png) and [its encoded local address](artifacts/expo-go-url.txt). They only apply while that server is running at that LAN address. After an address change, use the fresh terminal QR; optionally regenerate the image with `node scripts/expo-qr.mjs exp://YOUR-LAN-IP:8081`.

For the browser preview:

```powershell
npm.cmd run web
```

If Metro is already running on port 8081, open http://localhost:8081 instead of starting a second server. A running server can also display its web preview using its `w` shortcut. Start without remote Expo lookups using `npm.cmd start -- --offline`; this still serves the project locally and does not mean the phone can connect without Wi-Fi.

Expo currently directs physical-device Expo Go projects to SDK 57 during the SDK 58 transition: [official setup guidance](https://docs.expo.dev/get-started/create-a-project/). Native versions were selected using `expo install`, including [react-native-svg](https://docs.expo.dev/versions/v57.0.0/sdk/svg/).

## Continue to Mayumi

Continue your existing save. After checking the three Turning Paths landmarks and speaking to Bagtas, go up behind him to the gold **RAINLIT ROAD** sign below the shelter. Choose **Travel**. No restart is needed.

The continuation adds **Rainlit Road → Riverside Hamlet → The Quiet Spring**, **Mayumi, The Diwata ng Bukal**, and **Luning**, a duwende basket-maker. Rae’s first encounter with Mayumi has time for surprise, questions and homesickness. Bagtas travels with the party, and Tala makes observations that determine the repair.

At the spring: ask Mayumi, inspect Tala’s narrow rill, use the forked support beside Bagtas, free the trapped basket, then use the same support to settle the root. A visible current reaches the outlet and the hamlet’s domestic spout. Return the basket to Luning whenever you like. Speak to Mayumi after the repair for the chapter’s quiet scene and fresh-seal ending. The optional Listening Seed provides a memory and is never a required key.

For a separate replay, choose **Revisit a scene ? Chapter 2: The rainlit road**; **The Diwata ng Bukal**, **A little room for water**, and **The spring remembers** start at later review points. These keep the main journey separate.

The notebook distinguishes Mayumi’s original biography and costume from documented local traditions and includes sources and a bukal/batis/agos vocabulary note. See [the implemented story and play guide](docs/chapter-02-the-rainlit-road.md), [folklore research](docs/folklore-research-mayumi-and-cast.md), and [map art prompts and saved assets](docs/rainlit-art-prompts.md).

Run `npm.cmd run rainlit:preview` for [three new scene previews](artifacts/rainlit-scenes-review.png), [Mayumi and Luning’s cast sheet](artifacts/spring-cast-review.png), and the before/braced/restored spring states. These are source-art renders, not device screenshots.

## Controls

| Action | Phone / touch | Browser keyboard |
| --- | --- | --- |
| Move | Drag the left joystick | WASD or arrow keys |
| Jog | Drag the joystick farther | Full-speed movement with keys |
| Talk / inspect | Approach an object and press the right action button | E, Space, or Enter |
| Advance dialogue | Continue button | E, Space, or Enter |
| Choose Rae's reply | Tap one of three responses | 1, 2, or 3 |
| Field notes | Book button | N |
| Read conversations | LOG or History button | H |
| Replay a scene safely | Revisit a scene on title/pause | Select a scene |
| Pause / resume | Pause button; Android back button | Escape |
| Sound & comfort | Speaker button, or pause menu | Select the same on-screen controls |

## Chapter 2 opening - The Path That Walks Back

The first playable Chapter 2 arc adds **Bamboo Verge → Turning Paths → Bagtas's checked route**. Choose **Begin Chapter 2** after the Chapter 1 ending, or continue an existing completed save and follow **Road into the bamboo** on the eastern bank of Rootwater Works. **Revisit a scene** offers the bamboo opening and four new Rainlit Road replay checkpoints.

Meet Bagtas, a proud tikbalang who misleads travelers with echoing hoofbeats. His three randomized trails each require one destination sign. Small worn arrows appear every few stretches; fallen white petals mark the correct branches and leaf ties confirm the way. A Tigmamanukan omen bird gives short flight hints near the start; Aling Dalisay, an original giantess inspired by an Isneg tale, offers directions from a side clearing. Both have encounter-based Codex pages that distinguish recorded lore from game inventions. See [the folklore guide notes](docs/folklore-trail-guides.md). Their help is optional. The required route is 12–20 path sections, and the pause-menu return keeps earned trials. See [the current guided-trial design](docs/three-randomized-trials.md).

The new maps have original layered pixel artwork, shelter details, sunshower motion, readable landmark sketches and short navigation fades. Bagtas has a new sprite, portrait, expressions, speech and idle animation. Earlier choices, discoveries, the optional Listening Seed, settings and dialogue history carry forward. No new packages are required. Continue through the RAINLIT ROAD sign behind the shelter after Bagtas’s debrief.

See [story, implementation and folklore references](docs/chapter-02-the-path-that-walks-back.md), [new map artwork](artifacts/chapter-02-bamboo-verge.png), [Bagtas animation](artifacts/bagtas-animation.gif), [playable dialogue](docs/chapter-02-dialogue-review.md) and [phone review](docs/chapter-02-device-check.md). Artwork previews render source functions; they are not running-app screenshots.

Talk to Lola at the porch stairs. You can inspect the merienda on the right side of the porch, the clothesline east of the yard, and the basin southwest of the house. Discoveries are optional and can be visited in any order. After talking to Lola, approach the old balete through the opening in the fence to hear the voice beneath its roots.

The story now continues through a short animated root tunnel into **Lantern Clearing**. Advance the arrival dialogue, follow the lamps northeast from the hollow, and approach Tala near the little plank walkway. Her introduction starts automatically when you get close. You can ask her six questions in any order or choose to explore. Tala then follows Rae along his route and can be spoken to again with the same action button.

Visit the root homes northwest of Tala, Minda's station to the east, and the empty bell arch farther southeast. The northern path now travels into the **Old Balete Grove** after its short conversation. Tala comes with Rae, and the southern path in the grove returns to the clearing without resetting discoveries or conversations.

Walk north toward the enormous tree to reveal **Mang Uban**. His camera pan can be skipped and safely interrupted. After his introduction, ask about home, the ringing, and the forest in any order, or keep exploring. Inspect the bamboo speaking tube southeast of the tree, the old marker to the southwest, and the trembling dust beneath the roots. The tube follows the eastern maintenance trail into **Rootwater Works**. Either the tube clue or Mang's directions opens this route; optional questions are never a completion requirement.

Rootwater Works introduces the chapter's water puzzle. Explore the diagram, bypass, lever, safe grating, and speaking tube. The wheel and water respond visibly to your actions. An unsafe lever change is blocked by a safety float without punishment. The first tool interaction opens Rae's pocket so you can select his spare kite string. The string stays with Rae after use.

Restore the wheel, return to Minda using the drained low trail, help rehang the waybell, and ring it once. The clearing changes: an open window, an open maintenance barrier, a named marker, steady path lights, and Minda beside the arch. Tala chooses to continue as Rae's friend. Take the maintenance path back to the repaired footbridge, cross to the eastern bank, and inspect the pale mark on the severed root for the Chapter 1 ending. You can keep exploring after the completion screen or begin Chapter 2 along the open bamboo road.

The notebook has Home, Clearing, Grove, and Waterworks pages, a small pocket inventory, and optional hints requested one step at a time. Objectives, tool labels, and NPC replies reflect the current puzzle state. All required clues work without audio; this build uses visual captions for clanging, ringing, and the final hoofbeats.

## Characters and story

The character pass adds denser pixel sprites, eight-frame four-direction traveler walking, blinking, idle movement, speech animation and character gestures. Lola waves from the porch, Tala studies her map, Minda works with her tools, and Mang Uban changes expression and moves his hand. Six larger bust portraits support nine expressions each.

Rewritten introductions, family memories and 12 new personal conversation topics deepen the existing chapter. Tala and Mang each have six topics, while Lola and Minda each have three personal topics. They remain optional. The notebook now includes **People**, with character histories, changing relationship notes, and folklore references that distinguish recorded motifs from Silong's invented world. See [the character and folklore notes](docs/characters-and-folklore.md).

Existing saves remain compatible. Continue can revisit available NPCs; a fresh journey shows Lola and the rewritten introductions. Starting a fresh journey replaces the existing journey only after the game's confirmation.

Review [the animated character preview](artifacts/character-animation-preview.gif), [expression sheet](artifacts/character-expression-sheet.png), and [Rae's walk cycles](artifacts/rae-animation-sheet.png). These are source-art renders, not recordings of the running app.

## Turning Paths environmental art

The junction now has detailed bamboo, receding woodland, textured damp trails, moss and filtered light. Every fork sign, landmark sketch, checked count and return label remains separately rendered so the puzzle stays readable across all stages. Subtle weather and foreground depth honor Still, and the six-map movement boundaries remain active.

Run `npm.cmd run turning:preview` for three generated maps and nine close camera views. Full-map previews are developer reviews; the playable game keeps the camera close. See [the current trial design](docs/three-randomized-trials.md), [joined terrain artwork and exact generation prompts](docs/maze-terrain-blending.md) and [movement alignment](artifacts/navigation-turning-review.png). These are source-art renders. Use **Revisit a scene → Chapter 2: The turning paths** to review it in Expo Go. The backward wind and borrowed current also have their own replay entries.

## Ground and movement boundaries

Rae and Tala now stay on explicit ground/path surfaces in all nine maps. Their entire foot area must fit on supported ground, while existing solid objects and puzzle gates still apply. Forest backgrounds, roofs, water beds and decorative space beyond the maps are blocked. The clearing's trickle is crossed on its plank bridge. Tala spawns on the same connected surface and follows without catching on floating-point bridge seams. Older saves outside the legal ground recover safely while retaining discoveries and story progress.

Run `npm.cmd run navigation:review` for [the nine-map alignment review](artifacts/navigation-all-maps-review.png) and [state-by-state reachability results](docs/movement-boundary-review.md). Regression tests cover held/diagonal movement, large frame delays, narrow crossings, companion following, every replay/travel spawn and old saves. The real controller completes the waterworks and Chapter 2 using the legal paths. Physical-phone touch/performance review remains pending.

## Bamboo Verge environmental art

The verge now has detailed rainlit bamboo, layered woodland, warm shafts of sun, moist earth, a woven traveler shelter and richer covered-cup/cord/verse details. Arrival, Bagtas's introduction, entry to Turning Paths and the debrief share the new environment. The named arch and gold arrow remain prominent. Foreground bamboo fades to protect Rae, and gentle rain, leaves and puddle ripples honor Still. The cup table's collision/inspection point follows its new painted position, with existing save recovery retained.

Run `npm.cmd run verge:preview` for four progress states, encounter/entry scenes, material close-ups, depth and interaction review, three screen sizes and weather animation. See [visual direction and device review](docs/bamboo-verge-visual-direction.md), [production artwork](assets/maps/bamboo-verge-v2.png), [generation prompt](docs/bamboo-verge-art-prompt.md) and [Bagtas scene](artifacts/bamboo-verge-bagtas-scene.png). These are source-art renders. Turning Paths retains its existing map in this pass.

## Rootwater Works environmental art

The waterworks now has the detailed pixel environment style of the grove: mossy stone channels, cobbled dry beds, wet timber bridges, bamboo pipes, layered forest and warm route lamps. Independent flow-bed layers reuse the painting's water/stone textures as the lever diverts the current. A grained pixel waterwheel, ripples and foam reinforce each mechanical state. The arrival, bell pull, restored crossing and sealed-root ending share the same art. The bell pull now displays one moving bell, and background water highlights honor Still.

Run `npm.cmd run waterworks:preview` for six progress states, relevant scenes, flow/retrieval animations, material close-ups, collision/interaction review and phone framing. See [visual direction and device review](docs/rootwater-works-visual-direction.md), [production artwork](assets/maps/rootwater-works-v2.png), [generation prompt](docs/rootwater-works-art-prompt.md) and [ending scene](artifacts/waterworks-root-seal-scene.png). These are source-art renders. Existing puzzle rules, routes, saves and completion behavior remain intact.

## Old Balete Grove environmental art

The grove now shares the detailed pixel environment style of the yard and clearing: an enormous weathered balete, layered mossy roots, distant blue forest, textured earth and bamboo, and warm lamps marking both exits. Foreground branches and a separate perch edge give Mang Uban depth while retaining his animated face, speech and gestures. Subtle smoke, fireflies and dust honor Still; the tube's vibration cues quiet when the water is diverted. His reveal, conversations and Listening Seed gift use the same environment, with a wider gift shot that frames both Mang Uban and Rae.

Run `npm.cmd run grove:preview` for five progress states, the reveal storyboard, gift animation, material close-ups, interaction/depth checks and phone framing. See [visual direction and device review](docs/old-balete-grove-visual-direction.md), [production artwork](assets/maps/old-balete-grove-v2.png), [generation prompt](docs/old-balete-grove-art-prompt.md) and [gift scene preview](artifacts/mang-uban-gift-preview.png). These are source-art renders. Existing routes, puzzle requirements, saves and reward behavior remain intact.

## Lantern Clearing environmental art

The clearing now has the detailed pixel environment style introduced in Lola's yard, with cool twilight, amber lanterns, mossy root cottages, layered crowns, tactile earth/stone and clearer water boundaries. The root-descent backdrop, arrival, Tala/Minda views and quiet aftermath share that style. Foreground depth protects character visibility. Separate barrier, shutter, bell-cord and named-plaque layers retain the initial, repaired, bell-hung and bell-rung states; the map does not switch paintings on completion. Background overlays respect Still, including water glints.

Run `npm.cmd run clearing:preview` for all four states, scene views, material details, mobile framing, depth checks and the crossing storyboard. See [art direction and device review](docs/lantern-clearing-visual-direction.md), [map artwork](assets/maps/lantern-clearing-v2.png), [root-descent artwork](assets/maps/root-descent-v2.png) and [generation prompts](docs/lantern-clearing-art-prompts.md). No new dependencies or gameplay requirements were added.

## Lola's Yard environmental art

The yard now uses a detailed, locally bundled pixel-art environment with warm afternoon light, weathered timber and roof metal, varied capiz windows, layered tropical foliage, worn earth, deeper shadows and richer garden materials. The layout and existing interactions are retained. Matching image regions place roofs, crowns and near foliage in front of Rae; tree overlap preserves his visibility. Textured laundry has front/behind ordering and gentle motion. Environment overlays respect **Background motion → Still**. The root-crossing opening shot shares the same art, and the title fills the frame with a lighter tint.

Run `npm.cmd run yard:preview` for the integrated map, material close-ups, phone framing, collision alignment, depth views and cloth animation. See [art direction and review notes](docs/lolas-yard-visual-direction.md), [the production image](assets/maps/lolas-yard-v2.png), [before/after](artifacts/lolas-yard-before-after.png) and [the generation prompt](docs/lolas-yard-art-prompt.md). These previews render source layers and are not phone screenshots. The production map is preloaded through the existing Expo Asset package; no dependencies changed.

## Updated opening, yard and controls

The opening now gives Rae a longer conversation with **???** before a staged fade to full black, root journey and arrival. The voice explains how Silong's damaged crossing reached the yard, while its identity stays unresolved. Rae has more time to react after arriving, and NPC conversations develop his search for home. The added crossing rules are original to this story.

Lola's Yard has a stepping-stone path, porch objects, hanging plants, chimes, a rain jar, more garden detail and ambient movement. Meet Muning, inspect the calamansi and kitchen garden, handle a shell at Lolo's sungka board, and check the covered jar. These five new interactions bring the yard to ten targets, including Lola and the balete; its eight discoveries stay optional. The sungka interaction is a family memory, not a full minigame.

Buttons and the joystick now have pixel corners and beveled edges. Rae and Tala use corrected single side profiles during left/right walking. Review [the controls](artifacts/pixel-controls-preview.png), [animated profiles](artifacts/profile-walk-preview.gif), [updated yard](artifacts/lolas-yard-art-preview.png), and [opening/story notes](docs/opening-and-yard-pass.md). The [dialogue review copy](docs/chapter-01-dialogue-review.md) is generated from the playable script.

## Neighbors, a keepsake and changing water

The clearing, grove and waterworks now have nine new optional scenery discoveries, more household/work details, and four original duwende neighbors: Nilo the lampkeeper, Sela the basket mender, Doro the seed tender and Pilo the apprentice. They introduce themselves, then offer short, varied remarks that respond to repairs. Met neighbors appear in People; completed visits and discoveries save locally.

After ringing the restored waybell, visit Mang Uban for his **Listening Seed** gift scene. The keepsake remains in Rae's pocket. An optional dry-bank memory at Mayumi's spring acknowledges it in Chapter 2; it is never consumed or required. Examine it from the notebook. Existing completed saves can receive it; no restart is needed.

Lever changes now show a traveling surge, current marks, a route caption, and a brief camera move with a soft tremble. **Sound & comfort → Water scene motion → Steady view** removes that camera motion while retaining visual water feedback. Blocked lever attempts and loading old saves do not replay the effect.

See [world/story notes](docs/world-enrichment.md), [new residents](artifacts/residents-preview.png), [gift art](artifacts/mang-uban-gift-preview.png), and [animated water source preview](artifacts/water-flow-preview.gif). These are source-art renders, not running UI captures.

## Connected story moments

Lola's care now follows Rae through familiar smells, food and family stories. Tala needs Rae's help when they discover an outdated route on her map; their correction returns in later dialogue and her People entry. Two personal reply points offer playful, cautious or thoughtful responses, with different immediate exchanges and later callbacks. Every response retains the same required clues, routes and ending.

Optional yard discoveries now connect to later scenery and puzzle observations. After the bell celebration, a short village view leads into a quiet conversation about helping, friendship and missing home. Continuing a save also shows a dismissible notebook reminder based on earned progress.

Review the introductions through **Revisit a scene → First steps in Silong**, the map lesson through **The waterworks puzzle**, and the new aftermath through **A village recovering**. Existing journeys can hear the map lesson through Tala's map question and the aftermath by revisiting the bell arch. See [implementation notes](docs/chapter-01-connected-story.md), [all authored reply branches](docs/chapter-01-story-moments-review.md) and [the phone review](docs/chapter-01-device-check.md).

## Chapter 1 polish

The new pass adds precise slow movement, steadier diagonal facing, clearer target brackets and wall-aware interactions; layered light, shadows, haze and channel foam across all four maps; and distinctive idle acting for Rae, Tala and the residents. The restored clearing now shows neighbors at open windows, household activity and a basket carried home. The grove has a quieter mix and water ambience follows proximity to the active channel.

Use **LOG / History** to search conversations Rae has reached. **Continue** now advances a line separately from scrolling. **Sound & comfort** adds larger dialogue text and still decorative backgrounds. Choose **Revisit a scene** to jump among ten scenes across Chapters 1 and 2 in a separate replay save, then return to your main journey. Replay also offers an optional frame-pacing meter for phone checks.

See [the full polish notes](docs/chapter-01-polish.md), [new idle acting](artifacts/character-idle-preview.gif), and [restored clearing artwork](artifacts/clearing-restored-art-preview.png). These previews render source artwork; actual phone layout, performance and listening review are still pending.

## Sound and comfort

The first audio pass includes two original area music loops, garden/forest/water ambience, quiet footsteps, a distant irregular clang, puzzle machinery, bell retrieval, the restored waybell, hoofbeats, and the chapter completion cue. All 15 sound files are bundled locally; no stream, recording, or audio service is used. Native playback uses [Expo Audio for SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/audio/). The browser adapter handles autoplay rejection and retries on a user gesture.

Open the **speaker button → Sound & comfort** from the title or game, or use the pause menu. Music and sounds/ambience have separate Off, Soft, and On choices. Use **Preview the waybell** to check the effects level while game audio is paused. On iPhone, the game respects silent mode. Audio stops during pause, notebook/settings menus, and app/browser backgrounding. If browser sound is blocked, tap Preview to retry; gameplay and visual clues remain available.

Camera follow defaults to **Gentle**, with **Direct** available in the same menu. Short landscape displays show more vertical world space, and the walk-to-jog transition now changes continuously with joystick distance. Volume and camera choices save independently of story progress and survive starting a new journey. NPC replies and notebook reminders now account for the repaired wheel, returned bell, hung bell, and restored crossing.

Completed conversations, discoveries, current map, and safe player position save locally. Continue resumes the journey. Starting again asks before replacing existing progress. Saves are specific to the device/browser and Expo project's local storage; there is no account or cloud sync.

**Existing yard saves are preserved.** Choose “Continue your journey.” A save that already completed the old balete encounter enters the new crossing directly; earlier saves continue in the yard. The app reads the original `@rae-jacob/yard/v1` key when no new save exists and writes the migrated adventure to `@rae-jacob/adventure/v2`, leaving the old record intact as a migration backup. The crossing commits its arrival checkpoint before playing, so closing the app halfway through resumes with Rae safely in the clearing. Completed optional discoveries carry forward.

Existing Lantern Clearing saves remain compatible with the grove addition. New progress fields default safely when absent. If you ended the previous build at the northern sign, continue and interact with that same path to enter the grove. Each map change saves a safe entry position, and the reveal preserves an unfinished Mang introduction across app interruption. If a later map edit blocks a saved position, the save restores Rae at that map's safe spawn while retaining his story progress.

**Existing grove saves also continue.** Interact with the eastern trail that previously showed the Rootwater Works preview. New puzzle fields default to their initial values under the same v2 storage key. Each branch, splitter, retrieval, return, hanging, ringing, and ending checkpoint persists separately. World actions commit when activated, so interruptions during their explanatory dialogue do not undo them or toggle the lever twice. Retrieval commits before its animation, and an interrupted root-seal reveal resumes with the unfinished ending conversation.

## Implemented

- Original pixel artwork: wooden house, capiz-style windows, porch, merienda, plants, garden bed, fences, washing area, laundry, kite, and balete.
- Rae in a white sando, teal shorts, flip-flops, and medium-long straight hair; four-direction facing with walking/jogging animation.
- Eight-direction movement, normalized diagonal speed, foot collision, wall sliding, and a following camera.
- Floating joystick and contextual interaction button; keyboard controls for desktop review.
- Lola's conversation, eight optional discoveries, field notes, pause, and save/resume.
- Moving laundry, leaves, and kite. Text and fonts are bundled with the app; no runtime font download is required.
- Safe-area-aware controls and scrollable menus for short landscape screens.
- A skippable root-slide animation, safe arrival checkpoint, and Rae's first reaction to Silong.
- A separate twilight map with lanterns, fireflies, root homes, a blocked hollow, water channel, work barrier, bell arch, and grove sign.
- Tala's automatic introduction, six repeatable question topics, companion following with collision-aware route breadcrumbs, and a companion badge.
- Minda's waterkeeper dialogue, four new environmental discoveries, new portraits, and scene-aware objectives.
- Notebook pages and compatible local saves from the original yard build.
- A connected Old Balete Grove, return travel to the clearing, and Tala following through both areas.
- Original giant-scale Mang Uban artwork, portrait, blinking eyes, drifting smoke, and a skippable camera reveal.
- Mang's introduction and six repeatable questions, the speaking-tube clue, an old crossing marker, and trembling root dust.
- A third notebook page, location-aware companion dialogue, expanded objectives, and safe reveal recovery.
- A fourth original map with an animated waterwheel, alternate currents, a branch recess, splitter diagram and lever, safe grating, speaking tube, footbridge, and bamboo road.
- A reversible, guarded water puzzle, contextual string selection and animated retrieval, persistent quest bell, and a drained shortcut to the clearing.
- Minda's bell return, hanging and ringing actions, animated bell feedback, settlement recovery, and restored crossing access.
- A fourth notebook page, pocket inventory, optional staged hints, state-aware objectives and dialogue, and compatible puzzle saves.
- A skippable root-seal camera scene, captioned unseen voice, Chapter 1 completion, and continued exploration after the ending.
- Original bundled music, environmental ambience and story/puzzle cues; lifecycle-aware playback, independent saved volume controls, and a waybell preview.
- Gentle/direct camera choices, improved short-screen framing, continuous walk-to-jog speed, and repaired-state NPC/quest reminders.

The complete Chapter 1 story and puzzle route are playable at prototype quality, including audio, comfort, and character/story passes. Physical-phone animation, dialogue pacing, listening/performance review, further production polish, and the next chapter remain future work. The accepted chapter and visual direction remain in `docs/`. The concept board is an art-direction reference; it is not the playable map or final production asset quality.

## Validation

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd exec --yes --package=expo-doctor -- expo-doctor
npm.cmd exec -- expo export --platform all --output-dir dist-preview
```

The current build has **118 passing tests** plus TypeScript checking. Checks cover all nine maps' connectivity, save migration and recovery, interrupted crossing/reveal checkpoints, question order, companion following, contextual targeting, the reversible puzzle, guarded bell retrieval, hints, restored bridge collision, and travel. Twenty-four controller integration tests mount the real React game hook with mocked native storage/lifecycle services. These include walking the puzzle route, returning and ringing the bell, completing the ending across interruptions, cancelling tool selection, automatic scene completion, and returning safely from settings to title, pause, or unfinished dialogue. New character checks cover optional-topic persistence without quest mutation, character discovery, authored animation frame distinctions, valid raster output, and ending cue metadata. Additional checks cover preference persistence, smooth speed/camera behavior, audio cue timing, independent mute, preview/background behavior, native voice cleanup and delayed seeks, web autoplay rejection/retry, and valid WAV signals with quiet loop seams. New Chapter 2 checks cover all fork layouts, safe loops, optional discoveries, save gates/recovery, Bagtas replies, the full route and return journey, and replay isolation. The connected-story checks cover six Chapter 1 reply branches, reached-line history, interruption recovery, optional clue callbacks, the post-bell scene and save recaps. The polish checks also cover separate replay saves, rapid scene switching, reached-line history and return context, safe replay presets, thin-wall targeting and frame-pacing statistics. Node.js 24 is used for these tests and their native-service mock loader.

The current polish build passes TypeScript. The earlier sound-and-comfort build passed all 21 Expo Doctor checks with its SDK-matched audio/asset packages; no dependencies changed in this pass and Doctor was not rerun. Android/iOS/web production exports validate both platform-specific playback adapters and package the WAV assets. The running local preview returns HTTP 200.

All nine maps and the character artwork have source-art previews, including initial, diverted, and restored waterworks states and the repaired clearing. The user playtested the first yard build. The agent has not playtested the expanded sequence interactively in a browser or on a physical phone, so the mobile UI, camera comfort, frame rate, and audible mix still require device playtesting. Automated signal checks do not substitute for listening. Use [the short device check](docs/chapter-01-device-check.md) to review this build. Headless controller tests and bundle success are not claims of physical-device testing.

An npm audit on 2026-10-16 reported 22 advisories (15 high, 7 moderate), inherited through Expo/React Native's CLI, Metro, code-signing, and native project tooling dependencies. Registry versions of `braces` (3.0.3) and `node-forge` (1.4.0) were still in the affected ranges at this check. No forced SDK downgrades or unverified transitive overrides were applied. Recheck upstream patches before a release; the prototype does not invoke code signing or process user-supplied build patterns.

## Mang Uban and Bagtas redesign / 2026-10-17

Mang Uban now shares a deep-browed, silver-bearded face between his seated sprite and portrait, with weathered skin, coarse arm hair, woven clothing, massive hands and a thick tobacco cigar. Grove smoke rises from its new tip and freezes with Still backgrounds. Bagtas has a broad bare chest, defined six-pack, waist-length mane, powerful arms, hoofed legs and a woven waist wrap. His introduction, optional stories, reply branches, debrief and journal now carry his proud, boastful personality while preserving all route clues and quest state.

Run `npm.cmd run creatures:preview` for the [design sheet](artifacts/creature-design-review.png), [expressions](artifacts/creature-expression-review.png), [acting](artifacts/creature-acting-preview.gif), [grove scene](artifacts/mang-uban-scene-redesign.png) and [bamboo scene](artifacts/bagtas-scene-redesign.png). These are renders from the app's artwork, not running-app screenshots. Review the encounters through **The watcher in the tree** and **Chapter 2: The bamboo verge** replay scenes. Check Mang's gift through **A village recovering**. The [dialogue review](docs/creature-redesign-review.md) contains the revised encounters. Physical-device review remains pending.

## Rae Jacob and Tala redesign / 2026-10-17

Rae now has short, tousled hair, a trimmed nape, shaded sando folds and readable flip-flops. Tala has a compact duwende build, broad tapered ears, forest-toned woven clothing and a detailed mapmaker's kit. Both share matching sprite/portrait faces and use an eight-frame walk in four directions, with planted feet, opposing limbs and internal body motion. Directional poses keep faces clear and equipment on the correct anatomical side.

Run `npm.cmd run travelers:preview` for the [design review](artifacts/travelers-design-review.png), [walking animation](artifacts/travelers-four-direction-walk.gif), [story gestures](artifacts/travelers-directional-acting.gif) and [six-scene palette review](artifacts/travelers-scene-review.png). See the [implementation and device review notes](docs/traveler-redesign.md). These are source-art previews; physical-phone testing remains pending.

## Source layout

```text
App.tsx                       Title, HUD, dialogue, notebook, pause, ending
src/hooks/useAdventureGame.ts  Game loop, map transition, input, dialogue, persistence
src/hooks/useGameAudio.ts      Playback lifecycle and browser/app focus
src/hooks/usePreferences.ts    Sound/camera settings independent of game saves
src/audio/                    Cue director and native/web playback adapters
src/game/camera.ts            Viewport bounds and gentle camera following
src/game/engine.ts            Movement, collision, companion trail, save migration
src/game/world.ts             Four maps, dynamic colliders, interaction anchors
src/game/dialogue.ts          Story, repeatable NPC topics, puzzle feedback, ending
src/game/chapterOneMoments.ts  Family memories, Tala arc and the quiet aftermath
src/game/storyChoices.ts       Personal replies and persistent callbacks
src/game/recap.ts              Earned-progress reminders on Continue
src/game/chapterTwo.ts         Bamboo route rules, state recovery and hints
src/game/chapterTwoWorld.ts    New map colliders and interaction anchors
src/game/chapterTwoDialogue.ts Bagtas, landmark clues and the first route debrief
src/art/bambooArt.ts           Bamboo maps, marker glyphs and sunshower layers
src/art/bagtasArt.ts           Original tikbalang sprite and expressive portrait
src/art/characterArt.ts        Character dispatch and supporting-cast art
src/art/travelerArt.ts         Rae/Tala designs, portraits and directional animation
src/game/characterDialogues.ts Character stories and authored acting
src/game/characters.ts         Biographies, relationships and folklore sources
src/art/pixelArt.ts            Original code-native SVG pixel artwork
src/art/clearingArt.ts         Twilight clearing, Tala and Minda artwork
src/art/groveArt.ts            Old balete, Mang Uban, and maintenance trail artwork
src/art/waterworksArt.ts       Machinery, channels, bell, seal, and restoration art
src/components/               Scene renderer, joystick, portraits, icons
tests/                        Gameplay, migration, and real controller checks
scripts/render-art.ts         Reproducible art previews and app icon
scripts/generate-audio.mjs     Original deterministic audio synthesis
assets/audio/                 Bundled WAVs and signal metadata
docs/                         Accepted chapter story and preproduction blueprint
```

To regenerate the artwork previews and icon:

```powershell
npm.cmd run art:preview
npm.cmd run characters:preview
npm.cmd run opening:preview
npm.cmd run world:preview
npm.cmd run story:review
npm.cmd run chapter2:preview
npm.cmd run props:preview
```

The PNG/SVG previews in `artifacts/` show the game's actual source artwork. They are not screenshots of a running UI. Google Fonts files are supplied by the font packages and retain their respective licenses; all scene drawing code is original to this project.

Regenerate the original audio with `npm.cmd run audio:generate`. Its manifest records duration, bytes, peak and RMS levels for each mono PCM16 asset. No third-party music or sound samples are included.

The current [story-object restoration](docs/story-object-restoration.md) preserves essential clue signs, the waterwheel, laundry and interactive scenery. The Rainlit Road sign and hamlet baskets/water lesson are baked into the map artwork. Floating brackets, arrows and character nameplates remain removed.

Story objects are restored: wheel, animated laundry, changing fork clues, a baked Rainlit Road sign and the hamlet's baskets/water lesson. See [the restoration review](docs/story-object-restoration.md) and [image-generation prompts](docs/story-map-edit-prompts.md). The final maps are `bamboo-verge-v3.png` and `riverside-hamlet-v2.png`.

The [remaining overlay and grove framing fix](docs/grove-framing-fix.md) removes duplicate marker/tube/cord/window graphics and the magnified side fill. Normal cameras stay inside each map at uniform scale; the baked hamlet baskets and their interactions remain.
