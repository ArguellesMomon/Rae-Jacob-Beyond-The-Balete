# Rainlit Road playable build review

Implemented 2026-10-18. Chapter 2 now continues from Bagtas's checked Turning Paths route through Rainlit Road, Riverside Hamlet and The Quiet Spring, with Mayumi, The Diwata ng Bukal, and Luning. It ends after the restored spring, the uncertain familiar voice, and the newly witnessed seal.

## Validation

- 118 automated tests pass, including 24 mounted-controller cases using native storage and lifecycle mocks.
- TypeScript passes. Android, iOS and web production exports complete in `dist-preview`.
- All nine maps have ground, solid-object, spawn and interaction reachability checks. Additional reviews cover the onward sign after Bagtas's debrief and the spring with and without the optional Listening Seed.
- The full controller test walks the new route using movement input, checks both travelers stay on supported ground, introduces Luning and Mayumi, attempts an unsafe early basket pull, completes the ordered repair, returns the basket, interrupts and resumes both spring scenes, and confirms the ending panel does not replay.
- Basket return is also supported before the root is lowered. Dialogue acknowledges the unfinished repair instead of claiming the neighbors already have water.
- Old saves gain empty Rainlit progress. Corrupt later flags cannot invent Mayumi's introduction, an earned seed memory or a completed ending. Separate replay saves retain the main journey.
- Source-art reviews decode the three live raster assets, render Mayumi/Luning portraits and speech/blink states, and compare the repair, flowing current and forming seal.

## Review in Expo Go

Continue an existing journey. After the Turning Paths debrief, use the gold RAINLIT ROAD sign behind Bagtas, below his shelter. The RIVERSIDE sign leads east to Luning; the SPRING sign crosses the hamlet's plank bridge. At the spring, the objective and gold marker follow the current task.

For an isolated review, use **Revisit a scene** and choose **The rainlit road**, **The Diwata ng Bukal**, **A little room for water**, or **The spring remembers**. All four use the separate replay save.

The local Expo server is available at `exp://192.168.1.9:8081` while Metro is running and the phone shares this computer's network. The [QR image](../artifacts/expo-go-qr.png) contains that address. Regenerate it if the local address changes.

## Art and research

- [Exact built-in image-generation prompts and saved map assets](rainlit-art-prompts.md)
- [Three scene source-art review](../artifacts/rainlit-scenes-review.png)
- [Mayumi and Luning source-art review](../artifacts/spring-cast-review.png)
- [Nine-map movement alignment](../artifacts/navigation-all-maps-review.png)
- [Story and play guide](chapter-02-the-rainlit-road.md)
- [Research, regional contexts and creative boundaries](folklore-research-mayumi-and-cast.md)

These images are source-art renders, not running-app screenshots. No browser UI surface was available in the session. Physical Expo Go touch, UI framing, animation smoothness, audible mix and dialogue pacing still need device playtesting; automated controller and export checks do not substitute for that review.
