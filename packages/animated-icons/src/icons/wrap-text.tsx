"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "wrap-text": "flow" | "carry"
  }
}

/** 2 colors: text lines (primary), wrapping line and its arrowhead (accent). */
export const WrapText = createAnimatedIcon({
  name: "wrap-text",
  category: "text",
  keywords: ["wrap text", "text wrap", "word wrap", "line break", "reflow", "paragraph", "format"],
  slots: { primary: "lines", accent: "wrapping line" },
  defaultVariant: "flow",
  variants: {
    // the wrapping line runs out along the row, turns down at the margin and comes back; its arrowhead
    // pops in where it ends. Hidden until it has length: a square cap paints a dot at pathLength 0
    flow: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=wrap]", { opacity: [1, 0, 0, 1] }, { duration: seconds, times: [0, 0.12, 0.2, 0.21] }),
          animate(
            "[data-part=wrap]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.19, 0.2, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=head]",
            { opacity: [1, 0, 0, 1, 1], scale: [1, 1, 0.5, 1.15, 1] },
            { duration: seconds, times: [0, 0.12, 0.65, 0.8, 1], ease: ["linear", "linear", ease.out, "easeInOut"] },
          ),
        ]),
    },
    // the short wrapped line fades, then slides back in from the left edge as the text reflows
    carry: {
      clip: true,
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=carried]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.2, 0.4, 0.8], ease: "easeOut" },
          ),
          animate(
            "[data-part=carried]",
            { x: [0, 0, -7, 0] },
            { duration: seconds, times: [0, 0.39, 0.4, 0.8], ease: ["linear", "linear", ease.out] },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <path d="M3 5h18" />
      {/* the carried short line stops 2 clear of the arrowhead's tip */}
      <path data-part="carried" d="M3 19h6" />
      <g stroke={slot.accent}>
        {/* the middle line turns down in a faceted loop at the margin and runs back left */}
        <path data-part="wrap" d="M3 12h15l3 3v1l-3 3h-5" />
        <path data-part="head" d="M16 16l-3 3 3 3" style={pivot("0% 50%")} />
      </g>
    </>
  ),
})
