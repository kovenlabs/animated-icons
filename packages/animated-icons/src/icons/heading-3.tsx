"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "heading-3": "pop" | "grow" | "draw"
  }
}

/** 2 colors: H (primary), level digit (accent). */
export const Heading3 = createAnimatedIcon({
  name: "heading-3",
  family: "heading",
  category: "text",
  keywords: ["heading 3", "h3", "title", "header", "headline", "text size", "format"],
  slots: { primary: "letter", accent: "digit" },
  defaultVariant: "pop",
  variants: {
    // the digit winds back small and pops out a size bigger before settling
    pop: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=digit]",
          { scale: [1, 0.7, 1.2, 1] },
          { duration: seconds, times: [0, 0.3, 0.6, 1], ease: ["easeInOut", ease.out, "easeInOut"] },
        ),
    },
    // the H swells up from its baseline, the way a heading outsizes body text, then eases back
    grow: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=letter]",
          { scale: [1, 1.1, 1.1, 1] },
          { duration: seconds, times: [0, 0.35, 0.6, 1], ease: ["easeOut", "linear", "easeInOut"] },
        ),
    },
    // the digit is lifted off and written again from its top bar; hidden until it has length
    draw: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=digit]", { opacity: [1, 0, 0, 1] }, { duration: seconds, times: [0, 0.15, 0.3, 0.31] }),
          animate(
            "[data-part=digit]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.29, 0.3, 0.85, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* a full-height H, the same 16 tall as the other letters in the set */}
      <path data-part="letter" d="M3 4v16M11 4v16M3 12h8" style={pivot("0% 100%")} />
      {/* a flat-topped 3 with a faceted lower bowl, standing on the same baseline */}
      <path data-part="digit" d="M15 10h6l-3 4h1l2 2v2l-2 2h-3l-1-1" stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  ),
})
