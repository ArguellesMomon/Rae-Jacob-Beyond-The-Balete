# Bagtas’s bargain and the spring’s aftermath

Current playable revision, 2026-10-19. This supersedes the earlier three-exit Turning Paths design and the interpretation of Bagtas as a guide trapped in someone else’s loop.

## Bagtas

Bagtas deliberately returns travelers to his shelter, throws hoofbeat echoes and rearranges the signs. He enjoys controlling an encounter and wants respect for his territory. Those motives do not excuse frightening Rae: Tala challenges him, and Rae negotiates an open return path, no imitations of Lola and no disappearance of his companion. Victory earns a specific promise of passage and reluctant respect. His subsequent help at the spring fulfills that bargain and his obligation to Luning; it is not automatic friendliness.

The introduction, three optional conversations, personal reply branches, debrief, Mang Uban/Minda callbacks, notebook, recap, character biography and creature-codex memory now agree with that characterization. Bagtas is not identified as the caller beneath Lola’s tree or the maker of the pale seals.

## Playable puzzle

The new generated painting has a southern loop, two outer trails, upper interconnections, five arches and two short proof trails. Ground geometry is shared by the layout renderer, collision surface and review tools. No new dependencies are needed.

1. Inspect the split-stone proof in the left short side trail. Match a seam, rather than a hollow.
2. Take its true arch. The five signs change places.
3. Inspect the bowed bamboo at the central junction. Match its bent stalk and three leaves.
4. Take that true arch. Inspect the running seep in the right short side trail. A moving leaf distinguishes it from still water.
5. Return beside the bowed bamboo and use the inside-out clothing remedy. The doubled hoofprints and mist fade; Rae’s sando shows an outside seam and tag.
6. Choose the running-water arch, then hold Bagtas to his bargain at the shelter.

Development solution: western arch → top-left moss arch → top-center arch, with the relevant inspected proofs and the counter-charm. Normal dialogue gives the rule and observations; the second hint level provides direct assistance. Wrong turns preserve all inspected proofs, the counter-charm and already earned steps. The southern return stays accessible throughout. The optional Listening Seed is never required.

Older completed route saves stay completed. Older unfinished saves keep their earned steps and can collect the remaining proofs. Positions on the replaced three-way background recover to supported ground. Revisit a scene → Chapter 2: The turning paths starts the new challenge without overwriting the main journey.

## Spring resolution and hamlet coda

Mayumi now has a longer quiet conversation about patience, worry, remaining with a place and being cared for in return. The fresh seal still interrupts that rest, but the closing dialogue gives Rae room to reflect on the people whose ordinary days existed before his arrival. Bagtas’s next involvement is his choice, not another staged need for his help. The Listening Seed is acknowledged when earned and is neither consumed nor forced into an invented revelation.

After restoration, five duwende neighbors visibly fill cups, rinse cloth, soften basket fiber and carry water. They stand on dry ground with small matching footprints, leaving the bridge approach open. Their activity stops under Still backgrounds.

The ending screen offers Return to Riverside Hamlet. Talk to Luning there for a once-only coda: household work resumes, Bagtas carries jars instead of making a speech, and Rae receives a place at supper. Completing the conversation persists homecomingSeen; an interruption leaves it available. An old completed save receives the new coda on its next conversation with Luning. Repeat interactions return to short dialogue.

## Folklore basis and limits

- [NCCA’s tikbalang cultural entry](https://www.flickr.com/photos/nccaofficial/18070087763) records the horse-like figure and sunshower saying. Its institutional entry is kept distinct from Bagtas’s authored personality and puzzle rules.
- [The Aswang Project’s source-history discussion](https://www.aswangproject.com/tikbalang/) describes misleading-road motifs and changes across recorded accounts. There is no single unchanging description across every region and period.
- [Read Tiktik’s modern field-guide retelling](https://www.readtiktik.com/fieldguide/tikbalang) includes the inside-out clothing counter-trick. The game presents it as advice Rae remembers from his grandmother, not a universal ritual or a claim about a particular sacred practice. This is a secondary retelling, not firsthand ethnography.

The five arches, proof logic, guaranteed escape route, Bagtas’s negotiated terms and his relation to the seals are original Silong fiction. Mayumi remains the original character The Diwata ng Bukal, not a traditional named figure renamed for this game.

## Review

- [Exact image prompt and production assets](turning-maze-image-prompt.md).
- [Integrated maze](../artifacts/turning-maze-v3/turning-maze-final-review.png) and [ground alignment](../artifacts/navigation-turning-review.png).
- [Hamlet before/after](../artifacts/hamlet-ending-before-after.png).
- Source-art previews are not device screenshots. User’s prior phone playtests apply to the previous version; a new physical-phone playtest is not claimed.

Commands: npm run typecheck; npm test; npm run turning:preview; npm run navigation:review; node --experimental-strip-types scripts/render-ending-polish.ts; npx expo export --platform all --output-dir dist-preview.

Validation: all 146 tests pass, including the actual React-controller maze journey, wrong turns, required proofs, counter-charm, save/reload, companion walking, the spring resolution and an interrupted/once-only hamlet coda. TypeScript passes. All nine map surfaces and every expected interaction were checked for reachability. Android, iOS and web production exports pass. The live Expo web bundle returned HTTP 200 at localhost:8081 (2,833,211 bytes).

On this Windows environment, the Hermes export uses a process-local TEMP/TMP directory at .expo/build-temp to avoid sandbox temp-file permissions. The map preview renderer writes generated buffers through Node rather than holding native PNG output handles against an open preview. These affect build/review tooling, not gameplay.
