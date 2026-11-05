"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    pilcrow: "ink" | "hop"
  }
}

/** The bowl's outline: the top bar running left off the first stem, a faceted curve back to it. */
const BOWL = "M13 4H9L6 7v3l3 3h4"

/** 2 colors: stems and bowl outline (primary), ink in the bowl (accent). */
export const Pilcrow = createAnimatedIcon({
  name: "pilcrow",
  category: "text",
  keywords: ["pilcrow", "paragraph", "paragraph mark", "formatting marks", "line break", "text", "typography"],
  slots: { primary: "mark", accent: "ink" },
  defaultVariant: "ink",
  variants: {
    // the bowl fills with ink, the solid printed pilcrow, holds a beat and drains again
    ink: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=ink]",
          { opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 1] },
          { duration: seconds, times: [0, 0.35, 0.65, 1], ease: ["easeOut", "linear", "easeIn"] },
        ),
    },
    // the mark stretches up off its baseline and lands with a little squash, a new paragraph starting
    hop: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=mark]",
          { y: [0, -3, 0, 0], scaleY: [1, 1.04, 0.92, 1] },
          { duration: seconds, times: [0, 0.4, 0.65, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="mark" style={pivot("50% 100%")}>
      {/* the ink fills the bowl's outline from underneath the strokes, so only its inside shows */}
      <path data-part="ink" d={`${BOWL}Z`} fill={slot.accent} stroke="none" style={flash("70% 50%")} />
      <path d={`${BOWL}M13 4v16M17 4v16M13 4h6`} />
    </g>
  ),
})
