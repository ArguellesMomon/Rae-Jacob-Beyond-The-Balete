# Scenery and interaction review

Updated 2026-10-18. The subsequent [story-object restoration](story-object-restoration.md) supersedes the original cleanup below: story clues, machinery, laundry, the Rainlit Road sign, waiting baskets and the water lesson are restored.

The painted maps provide the scenery. Removed the extra texture patches, cups, furniture, stone/seal patches, noticeboards, arch lettering, direction arrows, crossing plaques, wheel sprite, laundry sprites and trail boards that were drawn over those paintings. The existing scenery can still be interacted with directly at the same locations.

World-space targeting brackets, floating interaction arrows and the spring's quest diamond are removed. The normal interaction button, dialogue, notebook and objectives still identify nearby interactions and explain clues. The persistent Tala badge and character nameplates remain removed.

Visible overlays are reserved for changing gameplay state: the movable bypass branch, lever, carried/rehung bell, opening barrier, spring root and support, rescued basket, water repair and story seal reveal. Characters, atmosphere and cinematic transitions remain.

Removed collision boxes belonging to deleted overlays, including the extra turning-path boards. Painted terrain, water, furniture and architecture retain their existing geometry. The visible spring basket and temporary root support have state-dependent ground footprints.

Verification: 120 automated tests pass, TypeScript passes, all nine map reachability and puzzle-state checks pass. Regression coverage checks for invisible walls at removed overlay positions, basket removal, intentional Tala conversations, sustained/diagonal input, delayed frames and full story controllers.

Source-art review: npm.cmd run props:preview. The images in artifacts/props-all-maps-review.png and artifacts/props-material-closeups.png now show the cleaned scenes. These are source-art renders, not device screenshots. Physical-phone touch/performance review remains pending.
