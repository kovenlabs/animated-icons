"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "tree-pine": "stack" | "sway" | "grow"
  }
}

/** 1 color: tree. */
export const TreePine = createAnimatedIcon({
  name: "tree-pine",
  family: "tree",
  category: "nature",
  keywords: ["pine", "fir", "conifer", "evergreen", "forest", "christmas tree", "spruce", "woods"],
  slots: { primary: "tree" },
  defaultVariant: "stack",
  variants: {
    // the tree crouches, its tiers spring apart like a stack of layers, the top one rising highest and
    // swelling toward you, then they drop back onto each other and the tree lands with a squash. The
    // crown stays crouched while spread, so the top stays in the frame. Each tier only ever rises off
    // the one below it, so they never cross
    stack: {
      duration: 1300,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=crown]",
            { scaleY: [1, 0.85, 0.9, 0.9, 0.86, 1] },
            { duration: seconds, times: [0, 0.14, 0.32, 0.55, 0.7, 1], ease: ["easeIn", ease.out, "linear", "easeIn", ease.overshoot] },
          ),
          animate(
            "[data-part=upper]",
            { y: [0, 0, -2, -2, 0, -0.8, 0, 0] },
            { duration: seconds, times: [0, 0.14, 0.32, 0.45, 0.62, 0.75, 0.86, 1], ease: ["linear", ease.out, "linear", "easeIn", "easeOut", "easeIn", "linear"] },
          ),
          animate(
            "[data-part=top-tier]",
            { y: [0, 0, -2, -2, 0, -0.8, 0, 0], scale: [1, 1, 1.08, 1.08, 1, 1, 1, 1] },
            { duration: seconds, times: [0, 0.14, 0.34, 0.5, 0.68, 0.8, 0.92, 1], ease: ["linear", ease.out, "linear", "easeIn", "easeOut", "easeIn", "linear"] },
          ),
        ]),
    },
    // bends in the wind tier by tier: each tier leans on the one below, so the crown curves like a real
    // tree and the top whips furthest, a beat behind
    sway: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=crown], [data-part=upper], [data-part=top-tier]",
          { skewX: [0, -10, 7, -4, 1.5, 0] },
          { duration: seconds * 0.85, delay: stagger(seconds * 0.07), ease: "easeInOut" },
        ),
    },
    // grows from the ground up: the trunk shoots, then each tier pops out above the last
    grow: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=trunk]", { scaleY: [0, 1] }, { duration: seconds * 0.2, ease: "easeOut" }),
          // each tier holds at nothing until its turn, then pops out past full size
          ...(["low", "mid", "top"] as const).map((tier, i) =>
            animate(
              `[data-part=tier-${tier}]`,
              { scale: [0, 0, 1.25, 1, 1] },
              { duration: seconds, times: [0, 0.12 + i * 0.18, 0.4 + i * 0.18, 0.54 + i * 0.18, 1], ease: ["linear", ease.out, "easeInOut", "linear"] },
            ),
          ),
        ]),
    },
  },
  render: () => (
    <>
      <path data-part="trunk" d="M12 18v4" style={pivot("50% 100%")} />
      {/* three stacked tiers, each tucking its open top under the base of the tier above. Every group
          is as wide as its own tier, so its pivot stays at that tier's base as the ones above move */}
      <g data-part="crown" style={pivot("50% 100%")}>
        <path data-part="tier-low" d="M9 12 4 18h16l-5-6" style={pivot("50% 100%")} />
        <g data-part="upper" style={pivot("50% 100%")}>
          <path data-part="tier-mid" d="M10 7 6 12h12l-4-5" style={pivot("50% 100%")} />
          <g data-part="top-tier" style={pivot("50% 100%")}>
            <path data-part="tier-top" d="M12 2l4 5H8z" style={pivot("50% 100%")} />
          </g>
        </g>
      </g>
    </>
  ),
})
