# Rae Jacob: Beyond the Balete
## Chapter 1 — The Bell Beneath the Balete

Status: Chapter story accepted by the user. Visual and gameplay decisions are developed in [the Chapter 1 preproduction blueprint](chapter-01-preproduction-blueprint.md), incorporating the user's direction for Lola's Yard and Rae's appearance. These are design documents; game implementation has not begun.

Target: A 20–30 minute first playthrough on mobile, with optional exploration. React Native, TypeScript, and Expo Go remain development targets; this document specifies story and player experience, not a technical implementation.

### 1. Chapter promise

A playful boy falls into another world, makes an unlikely friend, and earns his first route home by solving a small community’s very noisy problem.

The player should finish feeling: “I understand how to explore this world, I care about these characters, and I want to see what lies beyond the next path.”

The chapter introduces movement, talking, inspecting, a reusable item, environmental clues, one connected puzzle, and a visible consequence. There is no combat, health system, skill tree, or timed objective in this chapter.

### 2. Rae and the supporting cast

**Rae Jacob, age ten.** An energetic, outdoorsy boy visiting his grandmother. He improvises, climbs, asks questions, and sometimes acts before looking. He begins frightened by being lost but covers it with jokes. His first growth is learning to observe before rushing in; he remains playful throughout.

**Tala, a young duwende and aspiring mapmaker.** Small enough to enter root passages but unable to cross the flooded approach to the waterworks. Practical, proud, and curious about the human world. She knows the clearing, not the entire realm. She travels beside Rae after their introduction and supplies observations and optional hints; she never solves the puzzle for him.

**Mang Uban, a kapre.** The enormous resident of the old balete above the settlement. His dry humor masks concern for the villagers below. He has been unable to rest because an irregular ringing travels into his tree. He can point Rae toward the Heart Balete but cannot open a passage home himself.

**Minda, a duwende waterkeeper.** Maintains the clearing’s channels and wheel. The recent surge has made the wheel’s narrow service alcove unsafe. She understands the machinery and tells Rae how to stop it; Rae contributes a fresh pair of eyes and the reach to use the larger maintenance controls. She is competent, helpful, and worried about damage to the root homes.

**Lola Selya.** Rae’s grandmother, seen in the prologue. Warm and observant. She establishes what home feels like and gives Rae a useful habit rather than a prophecy.

The named characters, Silong, waybells, and the chapter’s magic are original game fiction. The creature types are folklore inspirations, not a claim that all Philippine communities share one account of them. Regional inspirations and variants should be documented during later character research.

### 3. The small playable world

There are four compact maps, including the prologue. Each has a different purpose and a small number of readable landmarks.

| Map | Landmarks and atmosphere | Purpose |
| --- | --- | --- |
| Lola’s Yard | A warm, lived-in grandparent's home with a wooden porch, capiz-style windows, potted plants, clothesline, kite, dirt yard, and old balete beyond the fence | Establish Rae, home, and basic movement before the crossing. |
| Lantern Clearing | Warm root-house windows, workbench, footbridge, and an empty bell arch | Meet Tala and Minda, gather clues, and see the settlement recover. |
| Old Balete Grove | Huge roots, Mang Uban’s silhouette, hanging bamboo tubes, drifting smoke | Meet Mang Uban and trace the ringing toward its source. |
| Rootwater Works | A splitter gate, two channels, a fallen branch, wheel, and service alcove | Solve the chapter puzzle and reveal the exit toward Chapter 2. |

The clearing, grove, and waterworks connect directly. The player can revisit them without loading a sprawling overworld. Minda's visible work barrier keeps the waterworks crossing closed until the wheel repair is complete. Its path marker remains magically unreadable until the bell is rehung.

### 4. Story and playable sequence

#### Beat 1 — One more minute (about 3 minutes)

The game opens during a warm afternoon. Rae is flying a patched homemade kite near Lola’s yard.

Lola: “Rae Jacob! Merienda!”

Rae: “One more minute, La! It’s finally flying straight!”

A gust pulls the kite toward the old balete. The player follows it, learning movement and the contextual interaction button. Inspecting ordinary objects gives short, playful observations. No inventory or quest menu interrupts the opening.

Lola, as Rae moves away: “If you lose your way, stop first. Look around.”

The kite catches beyond a gap between the roots. Rae crouches to reach it. A light flickers on the far side, and a small voice calls, “Hello? Who’s there?” Rae leans forward, the soil gives way, and he slides down a root-lined hollow.

This is a brief, gentle fall into leaves. Rae is startled but unharmed. His kite remains behind; recovering it is not a Chapter 1 objective. A short length of spare kite string is already in his pocket.

The familiar afternoon ambience fades into insects and an unfamiliar three-note birdcall. Through the roots, Rae sees a violet sky. The gap behind him is now solid earth.

Rae: “La? …Okay. This is a very big tree.”

The chapter title appears as the player regains control.

#### Beat 2 — The mapmaker (about 4 minutes)

Rae follows warm lights to Lantern Clearing. Small homes fit beneath roots. A tiny resident is surveying a damaged footbridge with an oversized pencil: Tala.

Tala: “Please move your foot.”

Rae: “What?”

Tala: “You’re standing on the road.”

Rae looks down and steps aside. This introduces inspecting the space around a character rather than immediately walking through it.

Rae explains that he fell through the tree. Tala recognizes that he is human and takes his worry seriously. She has heard of crossings but has never seen one open.

The player can ask, in any order:

- “Where am I?” — Tala names the clearing and describes its nearby paths.
- “Did you see a way back?” — She says the root opening Rae describes is not on her map.
- “What’s that ringing?” — A metallic rattle interrupts her answer and shakes dust from the roots.

These questions remain available; none is a hidden correct answer. Asking about home establishes the long-term objective: **Find a way home.**

Tala suggests asking Mang Uban, who watches the older forest paths. She joins Rae voluntarily because the disturbance is damaging her community and she wants to understand why her map no longer matches the paths.

At the empty bell arch, she notices its broken hanging cord. Its painted path marker is a pale blur. The player can inspect it now or return later.

#### Beat 3 — The giant above the road (about 4 minutes)

Rae and Tala enter the grove. The camera reveals Mang Uban gradually: feet, knees, then his face among the branches. He is imposing but not framed as an enemy.

Mang Uban: “Three times.”

Rae: “Three times what?”

Mang Uban: “That bell. Every time I begin to sleep.”

An irregular clang sounds below. Mang Uban winces. Tala admits that some villagers thought his restless movements were shaking their homes.

Mang Uban: “If I were walking, little mapmaker, you would know.”

Rae asks how to return home. Mang Uban explains that the old crossings lead through the Heart Balete. The first route toward it begins beyond the clearing, but the crossing is flooded and its guiding bell is missing.

He cannot promise that Rae’s passage is still open. He offers a concrete first step: help restore the local crossing, then follow the road toward Bagtas, who knows the bamboo paths.

The local objective becomes **Find the source of the ringing.** No bargain is required to access his basic information; Rae helps because the same repair will aid both him and the village.

#### Beat 4 — Follow the evidence (about 4 minutes)

The player investigates three complementary clues. Only information relevant to the current mystery enters Rae’s notebook.

1. **Minda’s account:** The ringing began after the upstream surge. The clearing’s bell disappeared during the same event. She has closed access to the flooded footbridge because the wheel is shuddering and throwing water onto the approach.
2. **The bell arch:** A snapped cord and fresh scrape show that the bell was pulled toward the channel. Tala explains that the bell helps travelers recognize this particular crossing; that is a local magical rule of our fictional setting.
3. **The bamboo tube in the grove:** The sound is strongest beside it. Its open end points downstream toward the waterworks. Minda identifies the tubes as old speaking tubes used by maintenance workers, explaining why the noise carries so clearly into the tree.

The clues converge on a visible place. There are no arbitrary dialogue passwords or mandatory repeated conversations. A player who finds the waterworks early may inspect the mechanism and solve it without first collecting every notebook entry.

Rae opens the notebook for the first time after obtaining any clue:

“Things I Know So Far: Giant tree man did not steal a bell. Probably.”

Tala: “You wrote ‘probably’?”

Rae: “It’s an investigation.”

#### Beat 5 — The bell beneath the balete (about 6 minutes)

At the waterworks, Rae sees the small bronze bell wedged beside a waterwheel paddle. Water repeatedly pushes the paddle against it; the wheel rocks, the bell clangs, and its axle sends vibrations into the adjoining roots. The maintenance tube carries the ringing uphill.

Minda explains the safe repair through the maintenance speaking tube from her station in the clearing: divert the water, remove the bell, and restore the wheel. The alternate channel must be cleared first. A portrait and speaker label make her location and dialogue clear.

The exact puzzle is specified in Section 5. During it, Rae uses observation, a movable branch, and his spare kite string. Tala stays on the safe bank and points out consequences without giving unsolicited step-by-step answers.

Once the bell is removed and water is restored, the wheel turns smoothly. The overflow recedes, the bell falls silent, and the footbridge approach becomes safe. Minda confirms the repair through the speaking tube and Tala opens the simple work barrier. These visible changes happen before any reward dialogue. The onward route still folds back on itself until its waybell is rehung.

Rae, after a quiet beat: “So… not a monster.”

Tala: “A bell.”

Rae: “A very committed bell.”

#### Beat 6 — A road with a name (about 4 minutes)

The player returns the bell to Minda at the arch. She hangs it with a replacement cord while Rae and Tala assist. Rae rings it once through an interaction prompt.

The painted marker becomes readable: **Bamboo Crossing.** Lights along the nearby path steady. In this setting, a waybell anchors the identity of a local crossing; rehanging it does not repair the whole realm.

The clearing responds to the practical repair: a resident reopens a window, Minda’s work area drains, and Tala revises her map. Mang Uban speaks from above:

Mang Uban: “Much better.”

Rae: “You’re welcome!”

Mang Uban: “I meant the silence.”

After a pause, a large leaf falls beside Rae, carefully folded around a dry snack packet Minda had left for the giant. Tala recognizes it as an offer to share. This is a story gesture, not a required food or stamina system.

Tala chooses to travel onward. Her stated reason is both personal and practical: she wants to map the road, and Rae needs someone who can read its markings. Rae welcomes her as a friend rather than receiving her as a quest reward.

Tala: “I’m coming as far as the bamboo paths.”

Rae: “Because I’ll get lost?”

Tala: “Because I haven’t drawn them yet.”

#### Beat 7 — Something closed the way (about 2 minutes)

The player crosses the repaired footbridge with Tala. Beyond it, a living root lies severed across an old side passage. Its cut is unnaturally smooth, marked by a pale circular seal. This passage is not the open road into Chapter 2, so the player’s earned route remains available.

Tala’s old sketch shows the side passage intact. She dates that sketch to before the recent surge. Neither companion knows what the seal means.

Rae: “Did the water do that?”

Tala: “Water doesn’t leave a mark like that.”

From deeper in the bamboo comes a sharp hoofbeat, then another from a different direction.

Unknown voice: “If you two are taking that road, you’ve already taken the wrong one!”

Rae turns. The path ahead bends out of sight.

The chapter ends at a safe arrival point facing the bamboo forest. New objective: **Find Bagtas in the bamboo paths.** The Gatekeeper is not named or explained yet.

### 5. Exact puzzle rules

#### Physical arrangement

An upstream splitter sends water down one of two channels. The east channel powers the wheel. The west channel is a maintenance bypass that rejoins the stream below the wheel and away from the homes. A fallen branch obstructs that bypass. A narrow grating beside the wheel provides safe access only when the wheel is stopped.

The player can reach the branch, the splitter lever, and the inspection point from the starting bank. There is no need to walk into moving water.

#### Initial state

- Splitter points east.
- Bell obstructs the wheel, which rocks in place and splashes the bridge approach.
- West bypass is blocked by a branch.
- The bell cannot be reached while the wheel is moving.

#### Solution

1. **Inspect the splitter.** Its weathered diagram shows the east wheel channel and west bypass. Minda’s explanation remains available in the notebook.
2. **Clear the bypass.** Push the fallen branch once into a visibly open, shallow recess. Its constrained movement prevents it from being pushed into an unrecoverable position. This introduces pushing without becoming a separate maze.
3. **Divert water west.** Interact with the splitter lever. The bypass fills and the wheel stops. If the bypass is still blocked, the lever’s safety float prevents the change, with a clear visual indication and the text: “The other channel needs room for the water.” There is no damage or punishment.
4. **Recover the bell.** Approach the stopped wheel’s grating. Rae can see the bell’s raised handle just below his reach. Select the string interaction: Rae lowers a loop of string around the handle, tightens it, and pulls the bell free. The string remains in the inventory for future puzzles.
5. **Restore water east.** Use the lever again. The freed wheel turns smoothly and splash flooding subsides. A short camera emphasis shows the footbridge approach draining.
6. **Return and rehang the bell.** Speak with Minda at the arch; after the brief animation, interact to ring it and restore the path marker.

The bell is a quest item until rehung. It cannot be discarded, sold, or used elsewhere. Turning the wheel back on before retrieving it simply returns the previous visible state; the player can stop it again. Retrieving the bell never puts Rae in moving machinery.

#### Clarity and hinting

Water movement, gate direction, wheel movement, and channel obstruction must be visible. Sound reinforces these states but never carries a required clue alone. Ringing has optional captions and visible bell movement; vibrations show as small root tremors.

The notebook offers player-requested hints in increasing detail:

1. “Minda said the other channel goes around the wheel.”
2. “Something is blocking that channel. Where could Rae move it?”
3. “Move the branch aside, then change the splitter to send water down the clear channel.”

Once the wheel stops, hint text updates to mention the bell’s handle and Rae’s string. Once the bell is retrieved, it reminds the player to restore the wheel. Hints do not advance automatically while the player explores.

### 6. Controls and interaction language

- Landscape layout, floating joystick on the left, large contextual action button on the right.
- Action labels change clearly: Talk, Inspect, Push, Use, Take, and Ring.
- A nearby interactable receives a subtle outline. The interface identifies the intended target before activation.
- The inventory is intentionally small: spare kite string and, temporarily, the recovered bell. There is no full equipment screen.
- First item use opens a compact contextual selection showing Rae’s available item; it teaches the interaction used by later tools.
- Notebook and pause controls stay accessible outside short story transitions.
- Dialogue advances by tap, can reveal text immediately, and preserves essential clues in the notebook. No timed choices.
- Conversations use player-advanced text, portraits, expressions, and light sound effects. Full voice acting is outside the chapter scope.

The notebook is a hand-drawn record, not a mandatory clue-combination interface. Finding an answer in the environment always works without first checking a journal box.

### 7. Progress and visible rewards

Rae gains a companion, a notebook, experience using his string, an open crossing, and a lead toward home. There are no experience points, coins, reputation meters, or creature capture mechanics in Chapter 1.

There are four objective stages beneath the ongoing goal of returning home:

1. Ask someone about a way home.
2. Find the source of the ringing.
3. Recover and return the path bell.
4. Find Bagtas in the bamboo paths.

Only the current local objective is emphasized. The game saves after the arrival in the clearing, important puzzle changes, the restored bell, and the chapter transition. Resuming preserves completed actions and places Rae at the nearest safe position. Backgrounding the app pauses active play.

Optional interactions add personality rather than completion pressure: inspect a tiny laundry line, compare Rae’s flip-flop with Tala’s road, read a waterkeeper’s sign, or hear Mang Uban’s changed dialogue after the repair. No collectible count is required.

### 8. Visual and audio direction

Use top-down pixel art with four-direction character facing, clear silhouettes, and layered environmental depth. Warm lamps and amber house windows make the clearing inviting against the violet forest. The grove uses larger shapes, sparse light, and slow smoke to create scale. The waterworks uses visible currents and strong mechanical animation for readability.

Rae wears a white sando, muted teal shorts, and reddish-brown flip-flops. He has light brown skin and medium-long straight dark hair, reaching his nape with a loose fringe. His hair is not curly or spiky. His idle motion is restless; Tala frequently checks her map; Mang Uban moves slowly but has expressive eyes and hands. The companion preproduction blueprint records the palette and sprite scale.

Required story animation moments: the root slide, Tala’s introduction, Mang Uban’s reveal, the rocking wheel and bell, the smooth restored wheel, the rehung bell, and the final root-seal reveal. Most dialogue uses simple sprite poses and portraits.

Audio moves from the familiar yard to the unfamiliar forest. The irregular bell acts as a mystery motif, not a continuous loud effect. Its repetition is spaced out to avoid fatigue. Restoration brings a smoother water rhythm and a fuller clearing ambience. The final hoofbeats introduce the next chapter.

### 9. Continuity beyond Chapter 1

Confirmed story facts:

- Rae reached Silong through a crossing beneath a balete; the same entrance is now inaccessible.
- Some old crossings connect with the Heart Balete, but Rae has no guarantee that his route home is currently open.
- A recent water surge displaced this settlement’s bell and damaged its infrastructure.
- Repairing machinery and restoring one waybell fixes a local crossing only.
- At least one separate root passage has been deliberately sealed by an unknown force.
- Tala accompanies Rae by choice and has limited, local knowledge.
- Bagtas is the immediate next lead; the Gatekeeper remains unknown.

Questions deliberately left open: Who sealed the passage? Why are paths changing beyond the flood damage? What caused the surge? Can the Heart Balete return Rae home? The chapter does not answer these with an exposition scene.

### 10. Chapter completion criteria

Use the accepted story and companion preproduction blueprint as the basis for the first prototype, within the user's instruction to finish planning before generating game code. The eventual playable chapter should meet these experience checks:

- A new player understands Rae’s immediate wish to get home and the bell problem without reading external instructions.
- Rae and Tala each contribute meaningfully, and their friendship develops through events.
- Clues lead logically to the waterworks; dialogue order cannot block progress.
- The water puzzle has visible cause and effect and can always be recovered from an incomplete action.
- The string interaction is taught in context and remains useful beyond this chapter.
- Restoring the wheel and bell produces visible changes before the chapter ends.
- Required clues remain understandable without hearing the audio.
- The ending resolves the local mystery while giving the player a specific next destination.
- No code, backend, extra chapters, combat system, or production art is required to consider this story-design pass complete.

### Reference carried forward from the concept discussion

The NCCA discussion of regional traditions and relationships among people, nature, and spirits informs the broad research approach, not the invented waybell mechanic or these characters’ individual traits: https://ncca.gov.ph/about-ncca-3/subcommissions/subcommission-on-the-arts-sca/dance/rituals-in-philippine-dance/
