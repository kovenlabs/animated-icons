"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    paperclip: "wiggle" | "attach"
  }
}

/** 1 color. */
export const Paperclip = createAnimatedIcon({
  name: "paperclip",
  category: "files",
  keywords: ["attachment", "attach", "clip", "attached file", "add file", "upload", "document"],
  slots: { primary: "clip" },
  defaultVariant: "wiggle",
  variants: {
    // the clip swings from its top loop, like it was just hung on a page
    wiggle: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=clip]",
          { rotate: [0, -10, 7, -3, 0] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // the clip squeezes as it grips a page, then springs back; it spans the whole frame, so the squeeze
    // pulls toward its top loop and the rebound stays under a pixel
    attach: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=clip]",
          { scaleY: [1, 0.88, 1.03, 1] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ease.out },
        ),
    },
  },
  render: () => (
    // One wire bent into two loops: four legs 4 apart (x 6, 10, 14, 18), the inner loop's ends 4 clear
    // of the outer wire. Drawn sharp; the factory rounds the bends into a wire.
    <path data-part="clip" d="M14 6v12h-4V2h8v20H6V6" style={pivot("50% 0%")} />
  ),
})
