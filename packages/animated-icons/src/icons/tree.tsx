"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    tree: "sway" | "grow"
  }
}

/** A pine in three stepped tiers, each wider than the one above, standing on a flat base. */
const PINE = "M12 2l4 6h-2l4 5h-2l4 5H4l4-5H6l4-5H8z"

/** 1 color: tree. */
export const Tree = createAnimatedIcon({
  name: "tree",
  category: "nature",
  keywords: ["pine", "forest", "nature", "christmas", "evergreen", "park", "outdoors", "wood"],
  slots: { primary: "tree" },
  defaultVariant: "sway",
  variants: {
    // the crown bends in the wind over a still trunk, its tip travelling furthest
    sway: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate("[data-part=crown]", { skewX: [0, -8, 6, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the tree sinks into the ground and springs back up to its full height
    grow: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=tree]",
          { scaleY: [1, 0.7, 1.06, 1], scaleX: [1, 0.9, 1.02, 1] },
          { duration: seconds, times: [0, 0.3, 0.7, 1], ease: ["easeIn", ease.out, "easeInOut"] },
        ),
    },
  },
  render: () => (
    <g data-part="tree" style={pivot("50% 100%")}>
      <path data-part="crown" d={PINE} style={pivot("50% 100%")} />
      <path d="M12 18v4" />
    </g>
  ),
})
