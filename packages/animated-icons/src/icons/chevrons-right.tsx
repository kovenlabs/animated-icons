"use client"

import { createAnimatedIcon } from "../lib/create-icon"

declare module "../lib/types" {
  interface IconVariants {
    "chevrons-right": "bounce" | "wave" | "slide"
  }
}

/** 1 color. */
export const ChevronsRight = createAnimatedIcon({
  name: "chevrons-right",
  family: "chevron",
  category: "arrows",
  keywords: ["last", "fast forward", "skip", "end", "double right", "next", "expand"],
  slots: { primary: "chevrons" },
  defaultVariant: "bounce",
  variants: {
    // the pair knocks to the right twice, the second time softer
    bounce: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=chevrons]",
          { x: [0, 3, 0, 1.5, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // the leading chevron steps out first and the trailing one follows; the trailing one heads home
    // first, so the pair spreads and closes but the gap between them never narrows, like a fast-forward
    wave: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=lead]",
            { x: [0, 2.5, 2.5, 0, 0] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.9, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=trail]",
            { x: [0, 0, 2.5, 0, 0] },
            { duration: seconds, times: [0, 0.15, 0.45, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // slips out through the right edge, back in from the other side
    slide: {
      clip: true,
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=chevrons]",
          { x: [0, 7, -7, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    // two right-angled chevrons, 7 apart so neither can reach the other in motion
    <g data-part="chevrons">
      <path data-part="lead" d="M13 7l5 5-5 5" />
      <path data-part="trail" d="M6 7l5 5-5 5" />
    </g>
  ),
})
