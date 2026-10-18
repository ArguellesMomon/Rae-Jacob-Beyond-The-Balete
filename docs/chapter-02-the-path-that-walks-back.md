# Chapter 2 - The Path That Walks Back

First playable version: **Bamboo Verge → Turning Paths → a checked route back to Bagtas**. This implements the opening story arc. The rainlit road and the rest of Chapter 2 remain subsequent work.

The agreed continuation is [The Rainlit Road](chapter-02-the-rainlit-road.md), introducing **Mayumi, The Diwata ng Bukal**. Her name and spring-centered identity were confirmed on 2026-10-18. This remains planned content beyond the playable opening.

## Story and continuity

Rae and Tala follow the open bamboo road beside the sealed side passage from Chapter 1. The restored waybell remains restored. They can return to the clearing, Mang Uban and Minda throughout this arc.

Bagtas is the owner of the hoofbeats and the warning at the end of Chapter 1. He is not identified as the original caller beneath Lola's tree. A proud, muscular tikbalang wayfinder, he introduces himself as the finest guide in the bamboo. He has been returning to his own footprints since the surge, and Tala presses him to put aside the boasting long enough to admit it. His confidence, irritation and eventual credit to the children give the encounter its character. He knows an old survey line toward the Heart Balete, but cannot promise that Rae's crossing home is open.

Rae needs reliable directions. Tala needs to keep checking the world beyond her map. Bagtas needs help admitting where his old knowledge has stopped being reliable. Together they establish one route by observing landmarks. Their success helps future travelers and earns an honest next lead, rather than immediately solving the mystery of home.

The original caller, the cause of the surge, the maker of the pale seals and the condition of Rae's crossing remain unresolved. In an optional conversation, Bagtas reports a similar seal on dry ground: the flooding cannot explain every closed passage. The Gatekeeper is not introduced or named here.

## Folklore and original fiction

The [NCCA's Tikbalang account](https://www.flickr.com/photos/nccaofficial/18070087763) describes horse-like features with a humanlike body and hands, and associates the being with misleading travelers. This supplies a visual and thematic starting point. Bagtas's personality, survey cord, shelter, changing posts and cooperative route puzzle are original Silong fiction. Dialogue leaves room for a person to answer the stories told about them. No documented ritual is presented as a universal puzzle password.

All sprites, portraits and map drawings are original SVG pixel artwork. No NCCA image or Pokémon asset is bundled.

## Playable sequence

1. Complete Chapter 1's root-seal conversation. Choose **Begin Chapter 2**, or continue an existing completed save and inspect **Road into the bamboo** on the eastern bank of Rootwater Works.
2. Read Rae and Tala's arrival. Explore the sunshower, covered traveler cups, hoofprints, survey cord and shelter verse.
3. Talk to Bagtas. Choose a playful, cautious or thoughtful reply. Each keeps the same route available and earns a later callback. Three optional topics cover changing paths, family stories and the pale seal.
4. Walk right of Bagtas, past the verse board, to the gold arrow beneath the arch marked **TURNING PATHS**. Choose **Travel**. Inside, compare the left/top/right path signs with the remembered sequence: **split stone → bent bamboo → running water**. Walk close to a sign and choose **Travel** for each step.
5. Each checked landmark persists. Posts change places after a turn. An incorrect branch returns Rae safely to the junction and keeps his checked steps. The southern return always leads to Bagtas.
6. After the third correct landmark, the route reaches the shelter from its other side. Talk to Bagtas to complete the debrief. He adds their findings to his survey cord and offers the rainlit road as the next survey lead. Continue exploring or return to Chapter 1.

This build does not mark the whole of Chapter 2 complete. Its objective acknowledges a verified opening route. There is no empty clickable exit to an unfinished map.

## Map and visual direction

Both new maps are 640 × 480 source pixels. Bamboo Verge has a traveler shelter scaled for different visitors, covered cups, a low bench, a knotted cord, wet ground, hoofprints, layered bamboo and gentle sunshower detail. The feedback pass adds woven/thatch details, water supplies, ground variation, shaded trail edges, low growth, mossy stones and shallow pools to the bamboo maps. A named pixel-lettered entrance arch and gold arrow mark the real Turning Paths interaction. Turning Paths labels the left, top and right paths and the return to Bagtas, with moving landmark sketches, clue posts and a visible three-step record beside the walking trail. Words and distinct shapes support the color cues.

Bagtas has a horse-like head, upright ears, a waist-length dark mane, broad bare chest, defined six-pack, powerful arms and two hoofed legs. A woven green waist wrap carries his survey cord. Shared head artwork keeps his sprite and portrait consistent. Blinking, speech, mane motion and nine expressions accompany his raised chin and confident stance. His muscular standing silhouette contrasts with the massive seated grove watcher. Rae and Tala retain their existing sprites and companion following.

Still backgrounds freezes decorative rain and falling leaves. Navigation fades remain short and skippable. Larger text, dialogue history, stepped controls, camera preferences and saved sound settings carry forward. The existing Silong theme and forest ambience are reused at a softer music level; no new sound files or dependencies are required.

## Puzzle implementation and review

The route rule is authored Silong wayfinding. The verse and normal NPC dialogue provide the full sequence without requiring three notebook checkboxes. Optional clue posts explain the shapes. Hints can repeat the next landmark. No timer, health loss, currency, consumable item or Listening Seed requirement is introduced.

For implementation review, the current placements resolve to **west → east → north**. The labels and glyphs rotate together after each checked landmark. Looking at the sketches works; pressing the same direction repeatedly does not. The fixed arrangement supports repeatable testing in this prototype.

Fork dialogue describes the current attempt. Finishing it commits the step, safe destination and player position before a 1.2-second navigation fade. Backgrounding resolves the fade to a safe paused state. Reopening resumes from the saved junction/shelter without toggling a route step again. An unfinished Bagtas introduction reconstructs its already chosen reply. An unfinished debrief is available by talking to him again.

## Saves and replay

The adventure stays at the existing v2 key. `chapterComplete` retains its Chapter 1 meaning. A new nested `chapterTwo` record holds arrival, meetings, optional topics, checked landmarks, loops and the debrief. Missing fields migrate to a fresh Chapter 2 state. New maps require a completed Chapter 1 checkpoint; invalid positions recover to a safe map spawn. Dependent route flags are normalized.

The Listening Seed, earlier discoveries, personal choices, preferences and conversation history persist across travel. Receiving the seed is optional. Bagtas acknowledges it when present and does not consume or activate it.

**Revisit a scene** adds three separate replay checkpoints: **Chapter 2: The bamboo verge**, **Chapter 2: The turning paths**, and **Chapter 2: A route verified**. The existing replay storage key is retained for compatibility. Main journey and replay writes remain isolated.

## Validation and artifacts

95 tests pass, including 22 actual React-controller tests with mocked native services. New checks cover route gating, old/corrupt save recovery, all fork layouts, wrong-turn progress, reachable approaches with real target selection, the full opening route and return trip, replay isolation, replies, interruption recovery and raster output. TypeScript and Android/iOS/web production exports validate the build. No dependencies changed; the earlier Expo Doctor result was 21/21 and was not rerun.

Regenerate the following with `npm.cmd run chapter2:preview`:

- [Bamboo Verge](../artifacts/chapter-02-bamboo-verge.png)
- [Turning Paths](../artifacts/chapter-02-turning-1.png)
- [Bagtas animation](../artifacts/bagtas-animation.gif)
- [Bagtas expressions](../artifacts/bagtas-expression-sheet.png)
- [Playable dialogue review](chapter-02-dialogue-review.md)

Artwork previews render the source functions; they are not running-app screenshots. Interactive browser and physical-phone playtesting are not claimed. Use [the Chapter 2 device check](chapter-02-device-check.md) to review layout, touch response, animation comfort and audible balance.
