# Chapter 1 polish pass

This pass strengthens the existing chapter before Chapter 2. The four-map route, optional discoveries, folklore references, water puzzle and Listening Seed remain part of the same journey. New crossing rules and personal histories remain original Silong fiction.

## 1. Movement and interaction

- A gentle acceleration immediately above the joystick dead zone allows small positioning corrections. Walking and jogging still join continuously.
- Diagonal facing holds its current axis near the diagonal instead of flickering between side and front views. Tala catches up along Rae's recorded route when she falls behind, with the same collision checks.
- Pixel corner brackets identify the selected interaction. The selector rejects an intervening wall while allowing an item's own small footing; Tala retains her lower priority beside scenery and other people.

## 2. Place and atmosphere

- Yard: stepped warm sunlight, faint moving leaf shadows and sunlit motes.
- Clearing: lantern pools that steady after the bell, plus the existing fireflies and flowing channel.
- Grove: deeper root shadows, faint drifting haze and a falling leaf. The existing music and forest bed play more quietly here.
- Waterworks: damp stone patches and foam following the selected channel. Water ambience softens with distance from the active channel.
- **Sound & comfort → Background motion → Still** freezes the decorative atmosphere and recovery vignette. Water feedback, story scenes and character movement remain visible. The separate **Water scene motion → Steady view** option removes the lever's camera pan/tremble.

Atmosphere SVGs update at three time steps per second and use a bounded cache. They add no downloaded images or new packages. Source-art renders are available for all four maps; they are not running-app screenshots.

## 3. Character acting

Rae brushes dust from his clothes, pauses to think and listens in the clearing. Tala opens her map, listens and holds the folded sheet close while traveling near the waterworks. Minda alternates between rest and small repair gestures; residents move their hands around their existing tools. Rae raises both hands during the bell celebration. Authored speech gestures take priority over idle acting. The corrected left/right profiles remain intact.

Review [the idle source animation](../artifacts/character-idle-preview.gif) and [gesture sheet](../artifacts/character-gesture-sheet.png). They use the same frame functions as the game.

## 4. Story and reading

Scenery conversations no longer give Tala lines before Rae has met her. Mang Uban's bell celebration reply is identified as a voice from the grove, and Rae closes the chapter with a quiet promise to Lola. The voices, player-paced opening and existing optional personal stories remain available.

**LOG**, the dialogue's **History** button, **Read conversations** in notes/pause, or **H** on a keyboard opens a searchable conversation record. Filter by the current place or search names and clue words. Only lines actually reached appear; unseen future dialogue is excluded. Up to 600 recent lines save with the current journey, with 40 shown initially and more available on request. Older saves begin with an empty record.

The explicit **Continue** button advances dialogue. Scrolling the text does not advance it. **Dialogue size → Larger** increases spoken text and history text; long speeches remain scrollable. Opening history suspends input and sound, preserves the current line, and returns to the mode it was opened from.

## 5. A settlement recovering

After water is restored, small household items reappear near the homes. After the waybell rings, shutters open, neighbors look out, a basket is carried home, and a small cooking plume rises. These join the existing steady lights, named marker, reopened barrier, bridge, resident replies and Minda's move to the arch. The details are decorative and add no new collision or required errands.

See [the restored clearing source render](../artifacts/clearing-restored-art-preview.png).

## 6. Safe replay and verification

Choose **Revisit Chapter 1** on the title or **Revisit a Chapter 1 scene** in pause. Seven checkpoints cover the yard, arrival, Mang's grove, water puzzle, bell return, recovering village/gift and ending. A scene starts a new replay; **Continue my replay** resumes the last one. Replay stores its own progress and history under `@rae-jacob/chapter-1-replay/v1`. The main journey remains under its original `@rae-jacob/adventure/v2` key. **Return to my saved journey** restores that slot. Replacing the main journey still uses the existing fresh-start confirmation.

Replay choices pause gameplay and audio. Back/Escape closes them to the title or pause context. Choosing a new replay scene resets only the replay. Sound and comfort preferences are shared independently of both story slots.

In replay, pause and choose **Show frame pacing**, then resume. The optional overlay reports JavaScript animation callback cadence, intervals over 50 ms, and the longest interval in the reporting window. It is a diagnostic aid, **not a GPU frame-rate measurement**. Opening menus hides it; it is never shown in the main journey.

Validation: 77 tests pass, including 16 real React-controller tests using mocked native services. Coverage includes the complete puzzle/ending route and interruptions, replay/main isolation, rapid scene switches, history persistence and modal return context, target occlusion, animation output, preferences and audio behavior. TypeScript and Android/iOS/web production export checks also pass. No dependencies were added in this pass; the earlier Expo Doctor result was 21/21 and was not rerun here.

Browser control is unavailable in this session. Artwork was rendered and inspected, and the controller was tested headlessly. Touch response, shortest-screen layout, animation comfort, actual performance and the audible mix still require the [physical-device check](chapter-01-device-check.md).
