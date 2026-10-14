"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    worm: "pop" | "wiggle" | "look"
  }
}

/**
 * A worm rearing out of its hole: a 4px-wide tube that rises from the ground, leans over to the right
 * and ends in a blunt head. It is open at the bottom, where it disappears into the hole.
 */
const BODY = "M8 20v-8l5-7h3l3 3v2l-2 2h-3l-2 2v6"

/** 2 colors: worm and ground (primary), body band and eye (accent). */
export const Worm = createAnimatedIcon({
  name: "worm",
  category: "animals",
  keywords: ["earthworm", "garden", "soil", "bug", "bait", "fishing", "dirt", "compost"],
  slots: { primary: "worm + ground", accent: "band + eye" },
  defaultVariant: "pop",
  variants: {
    // it ducks down into its hole, then shoots back out stretched thin, flinging clods of dirt either
    // side, and wobbles on a squash before it stands still and blinks
    pop: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=worm]",
            { scaleY: [1, 0.15, 0.15, 1.2, 0.9, 1.04, 1], scaleX: [1, 1.3, 1.3, 0.84, 1.08, 0.98, 1] },
            {
              duration: seconds,
              times: [0, 0.16, 0.3, 0.48, 0.64, 0.8, 1],
              ease: [ease.in, "linear", ease.out, "easeInOut", "easeInOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=clod-left]",
            { ...blink, x: [0, -2, -3], y: [0, -4, -2] },
            { duration: seconds * 0.35, delay: seconds * 0.3, ease: "easeOut" },
          ),
          animate(
            "[data-part=clod-right]",
            { ...blink, x: [0, 2, 3], y: [0, -4, -2] },
            { duration: seconds * 0.35, delay: seconds * 0.32, ease: "easeOut" },
          ),
          animate(
            "[data-part=eye]",
            { scaleY: [1, 1, 0.15, 1] },
            { duration: seconds, times: [0, 0.84, 0.9, 0.96], ease: "easeInOut" },
          ),
        ]),
    },
    // it sways from the hole like a dancer, bending further each way and stretching up as it passes upright
    wiggle: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=worm]",
            { skewX: [0, -16, 14, -10, 6, -2, 0], scaleY: [1, 0.94, 0.94, 0.96, 0.98, 1, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=band]",
            { scaleY: [1, 1.4, 0.8, 1.3, 0.9, 1, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // it leans out to look one way, then the other: the face slides across the tube as if it turned
    // round, the body narrowing edge-on, then it faces you again and blinks
    look: {
      duration: 1400,
      run: ({ animate, seconds }) => {
        const look = { duration: seconds, times: [0, 0.18, 0.4, 0.58, 0.78, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=worm]", { rotate: [0, -10, -10, 10, 10, 0], scaleX: [1, 0.9, 0.9, 0.9, 0.9, 1] }, look),
          animate("[data-part=eye]", { x: [0, -1.5, -1.5, 1.5, 1.5, 0] }, look),
          animate(
            "[data-part=eye]",
            { scaleY: [1, 1, 0.15, 1] },
            { duration: seconds, times: [0, 0.86, 0.92, 0.98], ease: "easeInOut" },
          ),
        ])
      },
    },
  },
  render: () => (
    <>
      {/* the ground, broken by the hole the worm comes out of */}
      <path d="M2 20h4M14 20h8" />
      <g fill={slot.primary} stroke="none">
        <rect data-part="clod-left" x="4" y="16" width="2" height="2" style={flash()} />
        <rect data-part="clod-right" x="14.5" y="16" width="2" height="2" style={flash()} />
      </g>
      {/* the worm's box is x 8..19: it stands on the middle of its tube, at x 10 */}
      <g data-part="worm" style={pivot("18% 100%")}>
        {/* the band round its middle sits under the outline, so only the stretch inside the tube shows */}
        <path data-part="band" d="M8 16.5h4" stroke={slot.accent} style={pivot("50% 50%")} />
        <path d={BODY} />
        <rect data-part="eye" x="14" y="8" width="2" height="2" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      </g>
    </>
  ),
})
