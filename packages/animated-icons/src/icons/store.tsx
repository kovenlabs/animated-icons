"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    store: "flutter" | "open" | "roll"
  }
}

/** 2 colors: walls (primary), awning + door (accent). */
export const Store = createAnimatedIcon({
  name: "store",
  category: "commerce",
  keywords: ["shop", "storefront", "retail", "market", "boutique", "merchant", "business", "marketplace"],
  slots: { primary: "walls", accent: "awning + door" },
  defaultVariant: "flutter",
  variants: {
    // the awning catches a breeze: its fringe lifts and drops back
    flutter: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=awning]",
          { scaleY: [1, 0.82, 1.06, 0.96, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the door swings half open on its hinge, turning away into the shop, and closes again
    open: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=door]",
          { scaleX: [1, 0.4, 0.4, 1], opacity: [1, 0.35, 0.35, 1] },
          { duration: seconds, times: [0, 0.35, 0.65, 1], ease: "easeInOut" },
        ),
    },
    // closing time: the awning rolls up under its top bar, then unrolls and lands with a little bounce
    roll: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=awning]",
          { scaleY: [1, 0.3, 0.3, 1] },
          { duration: seconds, times: [0, 0.35, 0.5, 1], ease: ["easeInOut", "linear", ease.overshoot] },
        ),
    },
  },
  render: () => (
    <>
      {/* walls standing under the awning's fringe, and a door in the middle */}
      <path d="M4 12v10h16V12" />
      <path data-part="door" d="M9 22v-6h6v6" stroke={slot.accent} style={pivot("0% 100%")} />
      {/* a striped awning: a flared top, its stripes ending on a zigzag fringe */}
      <g data-part="awning" stroke={slot.accent} style={pivot("50% 0%")}>
        <path d="M4 3h16l2 5-2.5 2.5L17 8l-2.5 2.5L12 8l-2.5 2.5L7 8l-2.5 2.5L2 8z" />
        <path d="M8 3 7 8M12 3v5M16 3l1 5" />
      </g>
    </>
  ),
})
