# Chapter 2 continuation — The Rainlit Road

Story concept agreed with the user on 2026-10-18. This continuation follows the verified Turning Paths route and Bagtas's debrief. The continuation is now implemented as playable prototype content.

## Mayumi — The Diwata ng Bukal

Confirmed name: **Mayumi**. Confirmed title: **The Diwata ng Bukal**. This replaces the working name Amihan in the continuation.

The [research notes](folklore-research-mayumi-and-cast.md) record a Namayan/Santa Ana spring-diwata parallel and a separate Panay epic reference. These support the role while retaining their distinct local contexts. Mayumi's personal name and biography remain our adaptation; the reviewed sources do not establish them as inherited lore.

Mayumi's identity, responsibilities and magic center on the spring: its source, its flow and the lives that depend on it. Introduce her tending the damaged bukal before explaining her connection to the wider mystery. Her concern for the surrounding forest follows that relationship with the water.

She is composed, observant and firm about careless behavior. Her warmth emerges through practical care. She does not immediately trust visitors who ask to open a passage without considering where its water and roots lead.

Visual direction: a clear silhouette beside the spring, layered water-toned clothing, restrained reflected light, wet stone and living-root details. Her appearance and the game's spring magic are original character and world design. Specific regional traditions or ceremonial details require their own research before inclusion; the chosen name and title alone do not establish historical accuracy.

## Story and cast

Rae and Tala follow Bagtas along the rainlit road to a riverside hamlet. Familiar routes have shifted, deliveries have gone astray and the spring has grown quiet. Bagtas's confidence is tested by evidence that his remembered route has changed.

- Rae remains a curious child experiencing these beings for the first time. Wonder, nervous questions and homesickness shape the encounter with Mayumi.
- Tala compares dated observations, investigates passages suited to her size and contributes decisions of her own.
- Bagtas provides experience and physical help, while learning to credit the travelers who check his claims.
- Mayumi, the Diwata ng Bukal, tends the spring and recognizes that some closed passages may protect nearby inhabitants. She does not supply every answer about the seals or Rae's way home.
- Luning is the original duwende basket-maker whose missing delivery provides evidence about the changed paths.

## Places and puzzle

Three implemented maps: **Rainlit Road**, **Riverside Hamlet** and **The Quiet Spring**.

The main problem combines residents' accounts with visible water and root markings. Rae can move an obstruction, Tala can inspect a narrow channel, and the player compares the findings to restore the spring's local flow. Keep the clues visible and the objective specific; establish how a mechanism works before requiring its use.

Mang Uban's Listening Seed may provide an optional memory fragment. It must not become a required key, since receiving it was optional.

## Ending and continuity

After the spring is restored, Rae hears a brief sound resembling Lola calling him. Its source remains uncertain. A fresh pale seal then forms across another passage while the group is present: the closures are ongoing.

This completes the playable Chapter 2 arc and points toward investigating whoever is closing the roads. Preserve the unresolved identity of the original caller, the cause of the surge and the condition of Rae's crossing home. Mayumi is not automatically identified as the maker of the seals.

## Playable route and checks

After Bagtas’s Turning Paths debrief, use the gold RAINLIT ROAD sign behind him, below the shelter. The rainlit road’s eastern RIVERSIDE sign leads to the hamlet. Speak with Luning beside the basket rack, then use the SPRING sign on the eastern plank bridge.

1. Meet Mayumi on the dry bank. Her introduction explains the repair and gives Rae time to react.
2. Inspect the narrow rill to her right. Tala reads the waterline and trapped strap.
3. Use the forked support beside Bagtas. He braces the root on firm stone; nobody must hold it indefinitely if the player leaves.
4. Take the trapped basket at the right end of the root. Rae loosens the snag instead of pulling blindly.
5. Use the same support again. The root settles onto its stone cradle, and an animated current reaches the outlet. The hamlet’s domestic spout changes too; its larger river is a separate watercourse.
6. Return the basket to Luning as an optional kindness. Speak to Mayumi after the repair for the quiet voice scene and fresh-seal reveal. Inspect the seal to finish Chapter 2.

The notebook provides a current objective, hints, optional questions, a character journal, sourced local contexts and vocabulary. Mang Uban’s seed provides an optional memory; the chapter is tested without the gift or optional discoveries. Return paths stay open, and revisiting a completed scene does not repeat its ending panel.

Old saves migrate additively with no invented Mayumi meetings. A supported root, rescued basket, repaired outlet and witnessed seal each persist. Backgrounding a cutscene completes it into recoverable dialogue; terminating during the seal reveal resumes its explanation. Four new replay checkpoints use the existing separate replay save.

Validation: TypeScript; nine-map ground, collider and interaction reachability review; new guard, save, lore-context, source-art and full-controller route tests; Android/iOS/web production export. The full controller route walks both characters through the maps, attempts the basket too early, returns it to Luning, interrupts the restoration and seal scenes, resumes, and confirms the ending is only shown once. Physical Expo Go touch, frame-rate, audible mix and pacing review remains pending on a device.

Artwork: built-in image generation, saved under `assets/maps/`; [exact prompts and assets](rainlit-art-prompts.md). Run `npm.cmd run rainlit:preview` for source-art reviews, and `npm.cmd run navigation:review` for movement overlays.
