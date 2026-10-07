"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    sprout: "grow" | "turn" | "flap"
  }
}

/** 2 colors: stem and soil (primary), leaves (accent). */
export const Sprout = createAnimatedIcon({
  name: "sprout",
  category: "nature",
  keywords: ["seedling", "plant", "grow", "growth", "garden", "eco", "spring", "new"],
  slots: { primary: "stem + soil", accent: "leaves" },
  defaultVariant: "grow",
  variants: {
    // ducks into the soil and shoots back up past its height, the leaves unfurling late with a flick
    grow: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=plant]",
            { scaleY: [1, 0, 0, 1.2, 0.93, 1], scaleX: [1, 1.25, 1.25, 0.9, 1.03, 1] },
            { duration: seconds, times: [0, 0.16, 0.24, 0.58, 0.8, 1], ease: [ease.in, "linear", ease.out, "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=leaf-left]",
            { scale: [1, 0, 0, 1.35, 1], rotate: [0, 0, 0, -16, 0] },
            { duration: seconds, times: [0, 0.16, 0.42, 0.72, 1], ease: [ease.in, "linear", ease.out, ease.overshoot] },
          ),
          animate(
            "[data-part=leaf-right]",
            { scale: [1, 0, 0, 1.35, 1], rotate: [0, 0, 0, 16, 0] },
            { duration: seconds, times: [0, 0.16, 0.48, 0.78, 1], ease: [ease.in, "linear", ease.out, ease.overshoot] },
          ),
        ]),
    },
    // turns a full circle on its stem, the leaves swapping sides as it goes, then flutter as it stops
    turn: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=plant]",
            { scaleX: [1, -1, 1, 1] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=leaf-left]",
            { rotate: [0, 0, -18, 8, -3, 0] },
            { duration: seconds, times: [0, 0.6, 0.75, 0.86, 0.94, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=leaf-right]",
            { rotate: [0, 0, 18, -8, 3, 0] },
            { duration: seconds, times: [0, 0.62, 0.77, 0.88, 0.95, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the leaves flap like little wings while the stem bobs up and down
    flap: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=plant]",
            { scaleY: [1, 1.1, 0.94, 1.05, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=leaf-left]", { rotate: [0, -28, 6, -18, 3, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=leaf-right]", { rotate: [0, 28, -6, 18, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <>
      <path d="M4 21h16" />
      {/* the stem stands in the middle of the soil, so the whole plant turns on it */}
      <g data-part="plant" style={pivot("50% 100%")}>
        <path d="M12 21V11" />
        <g stroke={slot.accent}>
          {/* each leaf is a kite pinned to the stem at its base, the left one on the stem's edge so its
              corner never pokes through when drawn sharp */}
          <path data-part="leaf-left" d="M11 14H6.5L3 9h6z" style={pivot("100% 100%")} />
          <path data-part="leaf-right" d="M12 11l1.5-6L21 3l-2.5 7z" style={pivot("0% 100%")} />
        </g>
      </g>
    </>
  ),
})
