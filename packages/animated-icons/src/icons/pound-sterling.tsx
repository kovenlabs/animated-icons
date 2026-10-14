"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"
import { spin } from "../lib/spin"

declare module "../lib/types" {
  interface IconVariants {
    "pound-sterling": "spin" | "toss" | "thud"
  }
}

const TURN = spin(2, "inOut")

/** 2 colors: sign (primary), crossbar and rim (accent). */
export const PoundSterling = createAnimatedIcon({
  name: "pound-sterling",
  category: "finance",
  keywords: ["gbp", "currency", "money", "price", "british", "uk", "payment", "pound sign"],
  slots: { primary: "sign", accent: "crossbar + rim" },
  defaultVariant: "spin",
  variants: {
    // spun on its edge: two turns that wind up and down again, drawing back from you at full speed.
    // Side-on, the flat sign shows its rim
    spin: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=sign]", { scaleX: TURN.scaleX }, { duration: seconds, times: TURN.times, ease: TURN.ease }),
          animate("[data-part=rim]", { opacity: TURN.edge }, { duration: seconds, times: TURN.times, ease: TURN.ease }),
          animate(
            "[data-part=pound]",
            { scale: [1, 0.84, 1.03, 1] },
            { duration: seconds, times: [0, 0.5, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // flipped end over end: thrown up and away from you (it shrinks as it rises), one turn over the
    // horizontal axis, a squash as it lands
    toss: {
      duration: 1100,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pound]",
            { y: [0, -5, 0, 0], scale: [1, 0.7, 1, 1] },
            { duration: seconds, times: [0, 0.38, 0.75, 1], ease: ["easeOut", "easeIn", "linear"] },
          ),
          animate(
            "[data-part=pound]",
            { scaleY: [1, 1, 0.84, 1.04, 1], scaleX: [1, 1, 1.1, 0.98, 1] },
            { duration: seconds, times: [0, 0.75, 0.83, 0.92, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=sign]",
            { scaleY: [1, 0, -1, 0, 1] },
            { duration: seconds * 0.75, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate(
            "[data-part=rim-flat]",
            { opacity: [0, 1, 0, 1, 0] },
            { duration: seconds * 0.75, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
        ]),
    },
    // a pound weight: hoisted up and away, dropped hard, it lands in a heavy squash and the bar jolts
    // down under the impact before everything springs back
    thud: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pound]",
            { y: [0, -3, -3, 0, 0, 0, 0] },
            {
              duration: seconds,
              times: [0, 0.3, 0.42, 0.55, 0.62, 0.8, 1],
              ease: ["easeOut", "linear", ease.in, "linear", "linear", "linear"],
            },
          ),
          animate(
            "[data-part=pound]",
            { scaleX: [1, 0.8, 0.8, 0.9, 1.12, 0.98, 1], scaleY: [1, 0.86, 0.86, 1, 0.78, 1.05, 1] },
            {
              duration: seconds,
              times: [0, 0.3, 0.42, 0.55, 0.62, 0.8, 1],
              ease: ["easeOut", "linear", ease.in, "easeOut", "easeInOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=bar]",
            { y: [0, 0, 2, 0] },
            { duration: seconds, times: [0, 0.56, 0.68, 1], ease: ["linear", "easeOut", ease.overshoot] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="pound" style={pivot("50% 100%")}>
      <g data-part="sign" style={pivot("50% 50%")}>
        {/* a faceted hook that runs down into the stem, standing on its base */}
        <path d="M17 7V5l-2-2h-4L9 5v16" />
        <path d="M5 21h14" />
        <path data-part="bar" d="M5 13h9" stroke={slot.accent} />
      </g>
      {/* the coin's rim, seen only side-on: upright for a spin, flat for a flip */}
      <g fill={slot.accent} stroke="none">
        <rect data-part="rim" x="11" y="4" width="2" height="16" style={flash()} />
        <rect data-part="rim-flat" x="4" y="11" width="16" height="2" style={flash()} />
      </g>
    </g>
  ),
})
