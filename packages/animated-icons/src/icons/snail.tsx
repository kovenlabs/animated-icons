"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    snail: "peek" | "spin" | "turn"
  }
}

/**
 * The shell is round, so it is a true circle (centre (10, 13), r 7) sitting on the foot, with a spiral of
 * two half-turns inside: r 2.5 over the top, then r 4.5 under the bottom. The spiral's box is x 6..15,
 * y 10.5..17.5, so the shell's centre sits at 44.4% / 35.7% of it.
 */
const SPIRAL = "M10 13a2.5 2.5 0 0 1 5 0a4.5 4.5 0 0 1-9 0"

/** 2 colors: shell and body (primary), spiral and eye stalks (accent). */
export const Snail = createAnimatedIcon({
  name: "snail",
  category: "nature",
  keywords: ["slow", "animal", "slug", "shell", "garden", "sluggish", "mollusc"],
  slots: { primary: "shell + body", accent: "spiral + eye stalks" },
  defaultVariant: "peek",
  variants: {
    // startled, it snaps its eye stalks in and jumps, landing on a squashed shell; then the stalks creep
    // out one after the other, overshoot and wobble before they settle
    peek: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=stalk-left]",
            { scale: [1, 0.15, 0.15, 1.25, 0.92, 1], rotate: [0, 0, 0, -12, 6, 0] },
            {
              duration: seconds,
              times: [0, 0.1, 0.4, 0.58, 0.72, 0.86],
              ease: [ease.in, "linear", ease.out, "easeInOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=stalk-right]",
            { scale: [1, 0.15, 0.15, 1.25, 0.92, 1], rotate: [0, 0, 0, -8, 4, 0] },
            {
              duration: seconds,
              times: [0, 0.1, 0.52, 0.7, 0.84, 1],
              ease: [ease.in, "linear", ease.out, "easeInOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=snail]",
            { y: [0, -2, 0, 0] },
            { duration: seconds * 0.4, times: [0, 0.3, 0.65, 1], ease: ["easeOut", ease.in, "linear"] },
          ),
          animate(
            "[data-part=shell]",
            { scaleY: [1, 1.04, 0.92, 1], scaleX: [1, 0.98, 1.05, 1] },
            { duration: seconds * 0.4, times: [0, 0.3, 0.65, 1], ease: ["easeOut", ease.in, "easeOut"] },
          ),
        ]),
    },
    // the spiral whirls a full turn inside the shell, which swells and settles, while the stalks reel dizzily
    spin: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=spiral]", { rotate: [0, 360] }, { duration: seconds, ease: ease.inOut }),
          animate(
            "[data-part=shell]",
            { scaleY: [1, 1.06, 0.96, 1.03, 1], scaleX: [1, 0.97, 1.03, 0.99, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=stalk-left]", { rotate: [0, -14, 8, -4, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=stalk-right]", { rotate: [0, 8, -14, 4, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // it turns round to face the other way (squeezing through edge-on), holds a beat, and turns back
    turn: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=snail]",
            { scaleX: [1, -1, -1, 1, 1], y: [0, -1, 0, -1, 0] },
            { duration: seconds, times: [0, 0.26, 0.58, 0.84, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=stalks]",
            { rotate: [0, -10, 0, 0, -10, 0] },
            { duration: seconds, times: [0, 0.18, 0.4, 0.58, 0.76, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="snail" style={pivot("50% 50%")}>
      {/* the foot runs under the shell, then the neck rises to the stalks */}
      <path d="M2 20h15l3-3V9" />
      <g data-part="shell" style={pivot("50% 100%")}>
        <circle cx="10" cy="13" r="7" />
        <path data-part="spiral" d={SPIRAL} stroke={slot.accent} style={pivot("44.44% 35.71%")} />
      </g>
      <g data-part="stalks" stroke={slot.accent} style={pivot("50% 100%")}>
        <path data-part="stalk-left" d="M20 9l-2-5" style={pivot("100% 100%")} />
        <path data-part="stalk-right" d="M20 9l2-5" style={pivot("0% 100%")} />
      </g>
    </g>
  ),
})
