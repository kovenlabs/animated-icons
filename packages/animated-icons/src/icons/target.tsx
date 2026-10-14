"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    target: "hit" | "pulse" | "turn"
  }
}

/** 2 colors: rings (primary), bullseye and arrow (accent). */
export const Target = createAnimatedIcon({
  name: "target",
  category: "gaming",
  keywords: ["goal", "aim", "bullseye", "focus", "objective", "archery", "darts", "precision"],
  slots: { primary: "rings", accent: "bullseye + arrow" },
  defaultVariant: "hit",
  variants: {
    // an arrow flies in from the corner, shrinking as it travels away from you, and thuds into the
    // bullseye: the board recoils and its rings ripple out from the impact
    hit: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=arrow]",
            { opacity: [0, 1, 1, 1, 0], x: [9, 0, 0, 0, 0], y: [-9, 0, 0, 0, 0], scale: [2.4, 1, 1, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.4, 0.85, 1], ease: [ease.in, "linear", "linear", "easeOut"] },
          ),
          animate(
            "[data-part=board]",
            { scale: [1, 1, 0.88, 1.04, 1], skewX: [0, 0, -6, 3, 0] },
            { duration: seconds * 0.7, times: [0, 0.43, 0.55, 0.8, 1], ease: "easeOut" },
          ),
          // each ring swells less than the one inside it, so the outer ring stays inside the frame
          ...(
            [
              ["eye", 1.3],
              ["mid", 1.14],
              ["outer", 1.08],
            ] as const
          ).map(([part, swell], i) =>
            animate(
              `[data-part=${part}]`,
              { scale: [1, swell, 1] },
              { duration: seconds * 0.35, delay: seconds * (0.32 + 0.08 * i), ease: "easeOut" },
            ),
          ),
        ]),
    },
    // a sonar ping: the bullseye throbs and each ring swells after it, from the centre out
    pulse: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=eye]", { scale: [1, 1.9, 0.85, 1] }, { duration: seconds * 0.55, ease: "easeInOut" }),
          animate(
            "[data-part=mid]",
            { scale: [1, 1.2, 0.95, 1] },
            { duration: seconds * 0.55, delay: seconds * 0.18, ease: "easeInOut" },
          ),
          animate(
            "[data-part=outer]",
            { scale: [1, 1.08, 0.97, 1] },
            { duration: seconds * 0.55, delay: seconds * 0.36, ease: "easeInOut" },
          ),
        ]),
    },
    // the board turns on its vertical axis, left then right; the rings sit at different depths, so the
    // bullseye slides furthest, like a cone seen from the side
    turn: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=board]",
            { scaleX: [1, 0.5, 1, 0.5, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=mid]", { x: [0, 1.6, 0, -1.6, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=eye]", { x: [0, 3.2, 0, -3.2, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <g data-part="board" style={pivot("50% 50%")}>
      {/* a target is round, so it gets true circles: the bullseye and rings, listed centre out */}
      <circle data-part="eye" cx="12" cy="12" r="1.5" stroke={slot.accent} style={pivot("50% 50%")} />
      <circle data-part="mid" cx="12" cy="12" r="6" style={pivot("50% 50%")} />
      <circle data-part="outer" cx="12" cy="12" r="10" style={pivot("50% 50%")} />
      {/* an arrow stuck in the bullseye: a shaft out to the top right, fletched with two corners */}
      <g data-part="arrow" stroke={slot.accent} style={flash("0% 100%")}>
        <path d="M12 12l6-6" />
        <path d="M16 5v3h3M18 3v3h3" />
      </g>
    </g>
  ),
})
