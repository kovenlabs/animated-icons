"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    pin: "push" | "wiggle" | "pop"
  }
}

/**
 * A push pin, all straight segments: a flat cap 2px wider than the shaft each side, the shaft flaring
 * out into a wide collar. The needle hangs from the collar's middle.
 */
const PIN_BODY = "M7 2h10v4h-2v5l4 3v3H5v-3l4-3V6H7Z"
const PIN_NEEDLE = "M12 17v5"

/** 2 colors: pin (primary), needle (accent). */
export const Pin = createAnimatedIcon({
  name: "pin",
  category: "actions",
  keywords: ["pinned", "attach", "stick", "keep", "favorite", "thumbtack", "save"],
  slots: { primary: "pin", accent: "needle" },
  defaultVariant: "push",
  variants: {
    // lifts, then pushes down into the board with a little squash
    push: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pin]",
          { y: [0, -2.5, 0, 0], scaleY: [1, 1.03, 0.93, 1] },
          { duration: seconds, times: [0, 0.4, 0.65, 1], ease: "easeInOut" },
        ),
    },
    // stuck in the board, it wobbles on its needle tip and settles
    wiggle: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate("[data-part=pin]", { rotate: [0, -12, 9, -5, 2, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the head swells from the collar, as if pressed by a thumb, while the needle stays put
    pop: {
      duration: 450,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=head]",
          { scale: [1, 1.1, 0.97, 1] },
          { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeOut" },
        ),
    },
  },
  render: () => (
    // pivots on the needle tip
    <g data-part="pin" style={pivot("50% 100%")}>
      <path data-part="head" d={PIN_BODY} style={pivot("50% 100%")} />
      <path d={PIN_NEEDLE} stroke={slot.accent} />
    </g>
  ),
})
