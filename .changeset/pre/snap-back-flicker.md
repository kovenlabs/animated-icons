---
"@kovenlabs/animated-icons": patch
---

Fixed icons flickering mid-animation and as they finish. Fades (run by the browser) and moves or
redraws (run on motion's frame loop) keyed to the same `times` drifted apart, because a single `ease`
eased the whole fade but every segment of the move. Lines flashed back at full length before
redrawing (`file-text`, `notebook`, `table`, `newspaper`, …), and parts could show as they jumped
across the frame. Every variant now eases per segment, so its tracks stay in step. `list` (`push`),
`percent` (`spin`) and `ship` (`bob`) also snap back to rest on a single frame with the new `snap`
easing.
