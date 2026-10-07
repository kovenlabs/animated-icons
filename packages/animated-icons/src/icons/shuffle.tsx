"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    shuffle: "flip" | "swap" | "riffle"
  }
}

/**
 * Two arrows crossing in the middle (10, 12), each diagonal rising 12 over 10. The rising one is whole;
 * the falling one breaks around the crossing, each end 4.6 from the other's centre line, so over 2px stay
 * clear on both sides. Each diagonal turns flat 4.5 before its right-angled head (whose miter makes the
 * point, as in `repeat`), so it never runs alongside the head's arm. Both pivot on the crossing, so
 * scaling either keeps it centred in the other's gap.
 */
const RISING = { shaft: "M2 18h3l10-12h4.5", head: "M17 2l4 4-4 4", origin: "42.105% 62.5%" }
const FALLING = { shaft: "M2 6h3l2 2.4M13 15.6l2 2.4h4.5", head: "M17 14l4 4-4 4", origin: "42.105% 37.5%" }

/** 2 colors: rising arrow (primary), falling arrow (accent). */
export const Shuffle = createAnimatedIcon({
  name: "shuffle",
  category: "media",
  keywords: ["random", "shuffle play", "mix", "randomize", "playlist", "order", "player", "media"],
  slots: { primary: "rising arrow", accent: "falling arrow" },
  defaultVariant: "flip",
  variants: {
    // turned over like a card around its middle: the arrows trade places, then turn back with a bounce
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=deck]",
            { scaleY: [1, 0, -1, -1, 0, 1] },
            { duration: seconds, times: [0, 0.18, 0.36, 0.55, 0.73, 1], ease: ["easeIn", "easeOut", "linear", "easeIn", ease.overshoot] },
          ),
          animate(
            "[data-part=shuffle]",
            { scale: [1, 1.15, 1.15, 1.15, 1] },
            { duration: seconds, times: [0, 0.18, 0.55, 0.73, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // shuffled in depth: one arrow comes toward you while the other sinks back, then they trade
    swap: {
      duration: 1200,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=rising]", { scale: [1, 1.22, 0.8, 1], opacity: [1, 1, 0.45, 1] }, timing),
          animate("[data-part=falling]", { scale: [1, 0.8, 1.22, 1], opacity: [1, 0.45, 1, 1] }, timing),
        ])
      },
    },
    // riffled: the arrows spring apart up and down and snap back together, twice
    riffle: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.2, 0.42, 0.62, 0.82, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=rising]", { y: [0, -1.5, 0.4, -1.5, 0.4, 0] }, timing),
          animate("[data-part=falling]", { y: [0, 1.5, -0.4, 1.5, -0.4, 0] }, timing),
        ])
      },
    },
  },
  render: () => (
    <g data-part="shuffle" style={pivot("50% 50%")}>
      <g data-part="deck" style={pivot("50% 50%")}>
        <g data-part="rising" style={pivot(RISING.origin)}>
          <path d={RISING.shaft} />
          <path d={RISING.head} />
        </g>
        <g data-part="falling" stroke={slot.accent} style={pivot(FALLING.origin)}>
          <path d={FALLING.shaft} />
          <path d={FALLING.head} />
        </g>
      </g>
    </g>
  ),
})
