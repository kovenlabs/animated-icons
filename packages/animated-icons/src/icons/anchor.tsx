"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    anchor: "sway" | "drop"
  }
}

/** 2 colors: ring, shank and stock (primary), arms (accent). */
export const Anchor = createAnimatedIcon({
  name: "anchor",
  category: "transport",
  keywords: ["ship", "sea", "nautical", "marine", "harbor", "port", "dock", "moor"],
  slots: { primary: "ring + shank + stock", accent: "arms" },
  defaultVariant: "sway",
  variants: {
    // hangs from its ring and swings on the current, settling plumb
    sway: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate("[data-part=anchor]", { rotate: [0, 10, -8, 5, -2, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // hauled up a little, let go, plunges and bobs back to its mark
    drop: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=anchor]",
          { y: [0, -1.5, 3, -0.5, 0] },
          { duration: seconds, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    // swings from the top of its ring
    <g data-part="anchor" style={pivot("50% 0%")}>
      {/* the ring is round: a true circle */}
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v14M8 11h8" />
      {/* the crown is round too: a half circle from fluke to fluke, each tip barbed inward */}
      <path d="M5.5 14 3 12A9 9 0 0 0 21 12l-2.5 2" stroke={slot.accent} />
    </g>
  ),
})
