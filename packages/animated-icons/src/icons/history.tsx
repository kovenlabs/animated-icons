"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    history: "rewind" | "nudge"
  }
}

/**
 * The dial runs the long way round from 9 o'clock to 12 (a true arc, since a dial is round), then cuts
 * straight back to the arrowhead's corner: the gap at the top-left is where time runs backwards.
 */
const RIM = "M3 12A9 9 0 1 0 12 3L3 8"
/** A right-angled head at the end of the rim: its miter points down-left, against the clock. */
const HEAD = "M3 3v5h4"

/** 2 colors: dial and arrow (primary), hands (accent). */
export const History = createAnimatedIcon({
  name: "history",
  category: "time",
  keywords: ["recent", "past", "undo", "rewind", "log", "activity", "timeline"],
  slots: { primary: "dial + arrow", accent: "hands" },
  defaultVariant: "rewind",
  variants: {
    // the hands sweep one hour backwards round the dial
    rewind: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate("[data-part=hands]", { rotate: [0, -360] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the whole dial is pulled back against the clock, then springs forward to rest
    nudge: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=history]",
          { rotate: [0, -12, 4, 0] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="history" style={pivot("50% 50%")}>
      <path d={RIM} />
      <path d={HEAD} />
      {/* minute hand up, hour hand down-right; they turn together on the centre of the dial (12, 12). Both
          are short enough that their sweep passes inside the arrowhead's foot at (7, 8) */}
      <path data-part="hands" d="M12 8v4l3 1.5" stroke={slot.accent} style={pivot("0% 72.73%")} />
    </g>
  ),
})
