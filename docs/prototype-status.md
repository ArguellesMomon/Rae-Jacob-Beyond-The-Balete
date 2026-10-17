# Chapter 1 — Complete Playable Prototype

The accepted Chapter 1 story now has a continuous playable route: Lola's Yard, the root crossing, Lantern Clearing, Old Balete Grove, Rootwater Works, the returned waybell, the restored Bamboo Crossing, and the sealed side passage that introduces Bagtas's unseen voice. The opening Chapter 2 arc now continues through Bamboo Verge and Turning Paths to a checked route back to Bagtas. The remaining Chapter 2 story is subsequent work. This prototype includes audio, comfort, and character/story passes. Further production polish and physical-device animation, pacing, listening/performance review remain outstanding.

## Nineteenth milestone — Turning Paths environmental art

- Replaced the flat junction with a detailed pixel bamboo woodland: wet earth, layered stems/crowns, moss, off-trail puddles and pale filtered light.
- Kept the established ground silhouette, colliders, travel targets and puzzle rules. Fork signs, static clue frames/sketches, checked count and return label stay separate from the painting. Timber grain and borders improve the panels without obscuring their glyphs.
- Foreground depth, sparse rain, leaf drift, puddle rings and haze respect Still. The existing safe-loop fade and checked-route return share the new environment and upgraded verge.
- Source-art review covers four puzzle states, all relevant targets, five route scenes, six legal-ground depth positions, three screen sizes, transition storyboard and weather animation. All 102 tests and TypeScript pass, including the real-controller Chapter 2 route and six-map movement regressions.
- Android/iOS/web production exports pass. The restarted live Metro bundle includes the new map, ground checks and companion spawning. The refreshed QR uses `exp://192.168.1.9:8081`. Physical-phone touch/performance review remains pending.

See [visual direction and review](turning-paths-visual-direction.md), [generation prompts](turning-paths-art-prompts.md), [updated map](../artifacts/turning-paths-art-preview.png) and [ground alignment](../artifacts/navigation-turning-review.png).

## Eighteenth milestone — Ground and movement boundaries

- Added explicit ground/path silhouettes to all six maps. The complete foot rectangle must remain supported; distant forests, roofs, channel beds and decorative map margins no longer count as walking space.
- Retained wall sliding, normalized input and puzzle gates. Added collision along the clearing's trickle banks so its plank bridge is the crossing. Bridge-edge floating-point stability prevents Tala from getting stranded.
- Rae/Tala use the same floor checks. Companion spawning checks the whole connection to Rae, and invalid live positions/breadcrumbs recover safely. Old v1/v2 background positions recover without losing discoveries, keepsakes or chapter progress.
- Updated automated journey routes and art-review positions to use real ground. Added seven regression cases spanning all maps, boundaries, corner support, held/diagonal input, delayed frames, following, transitions and saved positions. All 102 tests pass.
- Reviewed 16 map/state combinations and every replay spawn; all expected interactions remain reachable. Source geometry overlays are available for every map. Physical-phone touch/performance review remains pending.

See [the movement review](movement-boundary-review.md) and [all-map alignment](../artifacts/navigation-all-maps-review.png).

## Seventeenth milestone — Bamboo Verge and Bagtas's shelter

- Replaced the verge's flat artwork with rainlit bamboo, receding woodland, moist earth, moss, detailed nipa thatch, woven backing and richer traveler-shelter materials.
- Arrival, Bagtas's introduction/conversations, the named entrance and route debrief share the new environment. The pixel-lettered arch, gold arrow and small verse sketches remain independent, readable overlays.
- Foreground bamboo/roof/near foliage respects actor depth and fades near Rae. Sparse rain, fallen leaves, puddle ripples and dappled light honor Still.
- Aligned the cup table's collider/inspection point with the painting. The existing v2 save recovery handles positions covered by that adjustment. Routes, dialogue, progress and fork rules remain intact; Turning Paths retains its prior art.
- Source-art review checks four progress states, every non-companion target, safe save recovery, six walkable depth positions and three encounter aspect ratios. 95 tests, TypeScript and Android/iOS/web exports pass. Physical-phone visual/performance review remains pending.

See [visual direction and review](bamboo-verge-visual-direction.md), [generation prompt](bamboo-verge-art-prompt.md), [updated map](../artifacts/chapter-02-bamboo-verge.png) and [encounter storyboard](../artifacts/bamboo-verge-introduction-storyboard.png).

## Sixteenth milestone — Rootwater Works and the crossing ending

- Replaced the flat waterworks with textured stone aqueducts, cobbled dry beds, worn timber bridges, bound bamboo, reeds, layered forest and warm route lighting. The severed root and pale seal share that environment.
- Independent clipped water/dry-bed layers retain the rich materials as the lever changes routes. A native-pixel timber wheel, active-channel ripples and wheel foam communicate the machinery's state alongside the existing surge/camera feedback.
- The arrival, string retrieval, restored crossing and root reveal use the updated map. Retrieval shows a single moving bell. Diagram directions, lever, float, branch, route labels and bridge naming remain separate state overlays.
- Background highlights honor Still; foreground depth protects actor visibility. Existing collision geometry, puzzle requirements, progress, saves and ending behavior remain intact.
- Source-art review covers six states, all expected interaction approaches, the eastern-bank gate, six depth positions, three retrieval-screen aspect ratios, ending storyboard and flow/retrieval animations. 95 tests, TypeScript and Android/iOS/web exports pass; physical-phone review remains pending.

See [visual direction and review](rootwater-works-visual-direction.md), [generation prompt](rootwater-works-art-prompt.md), [updated waterworks](../artifacts/rootwater-works-art-preview.png) and [ending storyboard](../artifacts/waterworks-ending-storyboard.png).

## Fifteenth milestone — Old Balete Grove and Mang Uban's scenes

- Replaced the flat grove with a detailed pixel forest: deeply grooved balete bark, mossy buttress roots, layered crowns, distant blue woodland, tactile earth/bamboo and warm exit lamps.
- Reused the environment for Mang Uban's reveal, conversations and Listening Seed offering. A foreground perch edge seats the animated giant among the roots; small cloth clusters add material detail to his existing sprite.
- Layered branches/foliage protect Rae's visibility. Smoke, fireflies, faint haze and vibration/dust cues honor Still; diverted water or bell recovery quiets the tube. Gift framing includes both characters across the reviewed aspect ratios, with decorative forest beyond the playable map.
- All interaction approaches pass source-art reachability checks in five progress states; six depth views and four gift-screen aspect ratios are reviewed. Existing collision, reward, quest and save behavior are retained.
- 95 tests, TypeScript and Android/iOS/web exports pass. The live Metro web bundle includes the new asset and scene layers. Physical-phone visual/performance review remains pending.

See [visual direction and review](old-balete-grove-visual-direction.md), [generation prompt](old-balete-grove-art-prompt.md), [updated grove](../artifacts/old-balete-grove-art-preview.png) and [reveal storyboard](../artifacts/grove-reveal-storyboard.png).

## Fourteenth milestone — Lantern Clearing and its scenes

- Replaced the clearing's flat artwork with a detailed twilight root village: warm lamps, mossy cottage roofs, timber/bark textures, layered forest depth, worn paths and water reflections.
- Updated arrival, Tala/Minda scenes, the returned bell and quiet aftermath to share the same environment. A matching root-descent image replaces the flat crossing backdrop while retaining timing and story behavior.
- Independent barrier, shutters, cord and name-plaque overlays preserve the four repair states without repainting the full map. Foreground roots/roofs/arch and bridge edge respect actor depth; ambient water/light/recovery motion honors Still.
- Existing collision geometry, interactions, saves and puzzles remain. The source-art review checks all interaction approaches in all four stages, six depth positions and phone-size framing. Physical phone review remains pending.

See [visual direction and scene review](lantern-clearing-visual-direction.md), [generation prompts](lantern-clearing-art-prompts.md), [updated map](../artifacts/lantern-clearing-art-preview.png) and [crossing storyboard](../artifacts/clearing-crossing-storyboard.png).

## Thirteenth milestone — Lola's Yard environmental art

- Replaced the yard's flat ground artwork with a detailed, locally bundled pixel environment: warm afternoon light, timber grain, roof patina, capiz panes, worn earth, layered tropical plants, mineral/water detail and richer shade.
- Foreground regions reuse the exact background pixels for roof/tree overlap and near foliage. Character visibility is protected behind crowns. Textured laundry renders in front of or behind Rae according to his position.
- Updated the crossing's opening yard shot, title framing and art render tools to use the same environment. Ambient light, basin highlights, pollen, butterflies and cloth honor the saved Still setting.
- Existing yard geometry and quest behavior are retained. The production image is preloaded with the installed Expo Asset package; no dependencies or NPC/item requirements were added.

See [the art direction and integration notes](lolas-yard-visual-direction.md), [generation brief](lolas-yard-art-prompt.md), [integrated map](../artifacts/lolas-yard-art-preview.png), and [before/after](../artifacts/lolas-yard-before-after.png). Physical phone review remains pending.

## Twelfth milestone — First encounters and bamboo navigation

- Rae reacts to his first duwende, kapre and tikbalang with surprise, hesitation and questions inspired by Lola's stories. Optional conversations let him ask about their homes, size, fears and everyday habits. Returning characters keep their established familiarity.
- Inspecting the root mark opens the Chapter 1 completion invitation only when that conversation first completes the chapter. Later inspections stay in exploration, including after reloading. The open bamboo road remains available.
- Bamboo Verge has a named pixel-lettered entrance arch, a gold ground arrow and matching directions in Bagtas's dialogue, Tala's advice, hints and objectives. Turning Paths identifies the left, top and right paths, its return route and checked progress; the introduction explains Travel and the repeating junction.
- Both bamboo maps have layered ground texture, shaded trail edges, low plants, mossy stones, shallow pools and additional shelter details. Source-art renders are available under `artifacts/chapter-02-*`.
- Regression coverage exercises the first invitation, repeat inspection, reload and subsequent Chapter 2 entry. Phone readability and dialogue pacing still require device review.

## Eleventh milestone — Chapter 2 opening

- Two connected bamboo maps, an animated Bagtas with expressive portrait, three optional topics and a personal reply choice with a later callback.
- A three-landmark route puzzle with changing posts, clear shapes/labels, optional clue objects, hints and safe loops that retain checked progress.
- A route-verification debrief and another lead toward the Heart Balete. The remaining Chapter 2 story is subsequent work.
- Entry from the earned Chapter 1 crossing, return travel, three independent replay checkpoints and additive v2 save migration. Earlier choices, history and Listening Seed remain intact.
- Two notebook pages, a Bagtas People entry, Chapter 2 recaps, decorative sunshower motion and short interruptible navigation fades.

See [the first playable arc](chapter-02-the-path-that-walks-back.md), [dialogue review](chapter-02-dialogue-review.md), [map art](../artifacts/chapter-02-bamboo-verge.png) and [device check](chapter-02-device-check.md).

## Tenth milestone — Connected story moments

- Lola's ordinary care follows Rae through sensory memories, family stories and the food shared after the bell.
- Tala's outdated waterworks route becomes a shared correction, with a return-trail callback and changing People notes. Older saves can discover the lesson through her map question.
- Two reply points offer playful, cautious or thoughtful exchanges and later callbacks. Answers persist immediately; history includes only the branch reached. Every response retains the puzzle route and ending.
- Seven optional yard-to-Silong links reward noticing familiar patterns without making exploration mandatory.
- A skippable village view leads into a player-paced post-bell conversation about friendship, helping and missing home. Its completion and interruption recovery are independent of the earned repair.
- Continue shows a dismissible, progress-aware notebook recap. New replay checkpoints and fresh journeys do not show it.

See [the connected story notes](chapter-01-connected-story.md), [generated branch review](chapter-01-story-moments-review.md) and [device review](chapter-01-device-check.md).

## Ninth milestone — Chapter 1 polish

- More precise slow movement, stable diagonal facing, collision-aware companion catch-up and pixel target brackets with intervening-wall rejection.
- Four-map atmosphere layers, quieter grove audio, distance-aware water ambience and a saved still-background choice.
- Rae's dust-brushing, curiosity, listening and celebration; Tala protecting her map; resident work gestures.
- Story continuity fixes, a closing promise to Lola, reached-line searchable dialogue history and larger reading text.
- Open shutters, neighbors at home, a basket carrier and household details reinforce the restored clearing.
- Seven replay checkpoints save independently of the main journey, with replay continuation, return to main, Back/Escape recovery and an optional callback-pacing meter.

See [polish implementation and review notes](chapter-01-polish.md) and the expanded [device check](chapter-01-device-check.md).

## Eighth milestone — Neighbors, keepsake and water feedback

- Nine new optional scenery discoveries and additional decoration in the clearing, grove and works. Four duwende residents have original sprites, introductions and rotating, repair-aware remarks. Completed visits persist and unlock their notebook entries.
- Mang Uban's post-bell Listening Seed scene includes a wider frame, lowering case, thirteen-line conversation, persistent keepsake and repeatable pocket inspection. Interrupted offers are recoverable, gifts do not duplicate, and completed saves can receive one without replaying the chapter. Its use is reserved for a later chapter.
- Lever changes show a traveling surge, direction marks and caption, with a short camera beat and gentle tremble. Steady view disables the extra camera motion. Loading/resuming and blocked lever attempts do not replay the effect.

See [world enrichment](world-enrichment.md), [the resident gallery](../artifacts/residents-preview.png), [gift scene art](../artifacts/mang-uban-gift-preview.png) and [water source animation](../artifacts/water-flow-preview.gif).

## Seventh milestone — Opening, yard and pixel controls

- Pixel-framed main buttons and joystick, square menu tabs, and continuous movement retained beneath the decorative control art.
- Corrected side profiles: a single face and all of its features move inside the same head group. The whole left view mirrors the right.
- A 29-line exchange with the unknown caller explains the accidental crossing. A skippable 9.6-second scene fades through full black before the root journey and into the clearing; arrival has 17 lines. All spoken dialogue remains player-paced.
- Longer NPC introductions, personal memories, return conversations and ending, with an explicit distinction between the first caller and the ending voice.
- More yard detail, ambient animation and five optional discoveries: Muning, calamansi, kitchen garden, sungka board and covered rain jar. All ten interaction targets remain reachable; new discoveries migrate under the existing save key.

See [the opening and yard notes](opening-and-yard-pass.md), [controls preview](../artifacts/pixel-controls-preview.png), [animated profiles](../artifacts/profile-walk-preview.gif), and [generated script review](chapter-01-dialogue-review.md).

## Sixth milestone — Characters and story

- Five expressive portrait sets, denser four-direction pixel sprites, six-frame walking, blinking, breathing, speech movement and character-specific gestures. Lola waves, Tala studies a map, Minda works, Rae reaches/pulls, and Mang's brows, mouth and hand respond.
- Rewritten key introductions, the arrival, bell return and ending, with 12 new optional personal topics. Existing quest-state replies remain. Personal topics record visited checks without changing puzzle progress.
- A People notebook page with unlocked profiles, changing relationship notes and source links. The folklore notes distinguish particular recorded accounts from the game's original village, family histories and waybell magic.
- Additive save fields preserve earlier journeys. New controller coverage checks personal conversations, background recovery, menu exit and persistence. Expanded dialogue lengths no longer depend on fixed line counts in integration tests; the hoofbeat follows an authored cue.

See [characters and folklore](characters-and-folklore.md), the [animated source-art preview](../artifacts/character-animation-preview.gif) and [expression sheet](../artifacts/character-expression-sheet.png). Phone review of the new animation, dialogue scrolling and pacing is still outstanding.

## Fifth milestone — Sound and comfort

- Fifteen locally bundled, original synthesized WAVs: two area themes, three environmental beds, quiet footsteps, interface feedback, branch/lever cues, bell/clang, retrieval, crossing, hoofbeats and completion. Music ducks during dialogue; the irregular clang stops once its cause is removed.
- Four reusable playback voices, independent Music and Sounds/ambience Off/Soft/On controls, a waybell preview, browser autoplay retry, and cleanup on teardown. Pause, notes, settings and backgrounding stop game audio. On iPhone, silent mode is respected. Recording and background playback are disabled in native configuration.
- Sound and camera preferences use their own local key, preserve deliberate mute, and leave the adventure save untouched. Settings return to their entry context, including title and unfinished dialogue.
- Continuous joystick speed replaces the sharp walk/jog threshold. Gentle camera follow is frame-rate independent; Direct remains available. Short landscape screens retain enough vertical world space and compact headers move the objective below the location panel.
- NPCs and journal reminders distinguish wheel repair, bell return, hanging and ringing. The objective also honors players who follow the tube clue before speaking to Mang Uban.

## Fourth milestone

- Rootwater Works has original pixel art, a rocking/stopped/smooth waterwheel, readable east/west currents, a splitter diagram, safety float, lever, branch recess, safe grating, speaking tube, footbridge, and a separate sealed side passage.
- Push the branch into its one safe recess, divert water west, inspect the stopped wheel, choose Rae's spare kite string, retrieve the bell, and restore water east. Turning the water back on before retrieval is reversible. Once repaired, the works stay repaired.
- The drained low trail returns directly to Minda. Return the bell, help her hang it, and ring it through separate actions. Minda moves to the arch; a window reopens, the work barrier opens, the path marker gains its name, lamps steady, and the bell visibly swings with a caption.
- Tala chooses to travel onward as Rae's friend. The bridge opens after the wheel and waybell are restored. The smooth cut and pale seal belong to an adjacent side passage; the earned onward road remains open.
- A skippable camera scene reveals the seal. The ending conversation includes visual hoofbeat captions and the unseen voice. Completing it saves Chapter 1 and offers continued exploration.
- The notebook has four pages, a small pocket inventory, and player-requested hints that follow the current stage. No optional discovery or conversation topic is a hidden prerequisite for solving the puzzle.

## Saves and interruption recovery

Original v1 yard saves and all earlier v2 clearing/grove saves remain compatible. Use **Continue your journey**. At the old grove endpoint, interact with the eastern maintenance trail to enter the waterworks. New fields default to initial puzzle states under the existing v2 storage key.

Each durable puzzle step persists independently. Branch, lever and arch actions commit with their visible result before explanatory dialogue, and the dialogue records that its action has already happened. It cannot toggle a lever twice. Tool selection can be cancelled safely. Bell retrieval commits before its animation. Backgrounding resolves the current short scene to a safe paused conversation. A root reveal interrupted before its conversation finishes resumes with that conversation, while a completed chapter resumes on the earned eastern bank.

Save loading normalizes dependent puzzle flags, prevents a duplicate bell, checks current dynamic colliders, and recovers invalid positions to a safe map spawn. Neither turning off water nor merely retrieving the bell opens the bridge: restoring the wheel and ringing the rehung waybell both matter.

## Validation and review

The current suite has **95 passing tests**, including twenty-two actual React-controller integration checks with mocked native storage/lifecycle services. Checks walk the controller through the puzzle, return trip, bell restoration and ending; interrupt retrieval and reveal; cancel tool selection; let scenes finish automatically; and return safely from settings. Engine checks cover reachable controls, bridge collision, reversible puzzle actions, hints and save normalization. New checks cover saved preferences, speed continuity, camera convergence/framing, stage-aware dialogue, cue timing, mute/pause/preview, native voice cleanup and delayed replay, browser autoplay retry, and valid PCM signals with headroom and quiet loop seams. TypeScript and Android/iOS/web production exports validate the current polish build. Replay slot isolation, fast scene switching, history persistence/return context and target occlusion are covered. The earlier audio milestone passed Expo Doctor 21/21; dependencies are unchanged and Doctor was not rerun for this pass.

These are automated checks and source-art review, not physical-phone or interactive-browser playtesting. Audio signal validation is not a listening review. Device review should cover joystick reach, menus and dialogue on short landscape screens, camera comfort, frame rate, audible mix, and save/audio behavior after backgrounding. See [the device check](chapter-01-device-check.md).

Source-art previews: [initial works](../artifacts/rootwater-initial-art-preview.png), [water diverted](../artifacts/rootwater-diverted-art-preview.png), [restored works](../artifacts/rootwater-restored-art-preview.png), [restored clearing](../artifacts/clearing-restored-art-preview.png), [grove](../artifacts/old-balete-grove-art-preview.png), and [yard](../artifacts/lolas-yard-art-preview.png). These images are rendered from the actual source art and are not full UI screenshots. See [README](../README.md) for run instructions and validation commands, and [the accepted chapter](chapter-01-the-bell-beneath-the-balete.md) for the story specification.

The next useful milestone is a phone playthrough and listening review using the device check, then targeted fixes before extending Chapter 2 beyond its verified bamboo route.
