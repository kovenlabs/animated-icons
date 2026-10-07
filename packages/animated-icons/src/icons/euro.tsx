"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"
import { spin } from "../lib/spin"

declare module "../lib/types" {
  interface IconVariants {
    euro: "spin" | "toss" | "mint"
  }
}

const TURN = spin(2, "inOut")

/** 2 colors: C (primary), bars and rim (accent). */
export const Euro = createAnimatedIcon({
  name: "euro",
  category: "finance",
  keywords: ["eur", "currency", "money", "price", "europe", "payment", "cost", "euro sign"],
  slots: { primary: "C", accent: "bars + rim" },
  defaultVariant: "spin",
  variants: {
    // spun on its edge: it winds up through two turns and back to face you, swelling toward you at
    // full speed. Side-on, the flat sign shows its rim
    spin: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=sign]", { scaleX: TURN.scaleX }, { duration: seconds, times: TURN.times, ease: TURN.ease }),
          animate("[data-part=rim]", { opacity: TURN.edge }, { duration: seconds, times: TURN.times, ease: TURN.ease }),
          animate(
            "[data-part=euro]",
            { scale: [1, 1.18, 0.96, 1] },
            { duration: seconds, times: [0, 0.5, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // flipped end over end: thrown up, one turn over the horizontal axis, a squash as it lands
    toss: {
      duration: 1100,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=euro]",
            { y: [0, -6, 0, 0] },
            { duration: seconds, times: [0, 0.38, 0.75, 1], ease: ["easeOut", "easeIn", "linear"] },
          ),
          animate(
            "[data-part=euro]",
            { scaleY: [1, 1, 0.86, 1.04, 1] },
            { duration: seconds, times: [0, 0.75, 0.83, 0.92, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=sign]",
            { scaleY: [1, 0, -1, 0, 1] },
            { duration: seconds * 0.75, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate("[data-part=rim-flat]", { opacity: [0, 1, 0, 1, 0] }, { duration: seconds * 0.75, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] }),
        ]),
    },
    // the sign is pressed back into the die and struck out toward you, then the bars are cut again, top first
    mint: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=sign]",
            { scale: [1, 0.6, 1.3, 0.94, 1], opacity: [1, 0.4, 1, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.78, 1], ease: ["easeInOut", ease.out, "easeInOut", "easeInOut"] },
          ),
          // hidden while the bars are too short to read: a square cap paints a dot at length 0
          animate(
            "[data-part=bar]",
            { opacity: [1, 0, 0, 1, 1] },
            {
              duration: seconds * 0.8,
              delay: stagger(seconds * 0.1),
              times: [0, 0.25, 0.5, 0.52, 1],
              ease: ["easeOut", "linear", snap, "linear"],
            },
          ),
          animate(
            "[data-part=bar]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.8, delay: stagger(seconds * 0.1), times: [0, 0.3, 0.5, 1], ease: ["linear", snap, ease.out] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="euro" style={pivot("50% 100%")}>
      <g data-part="sign" style={pivot("50% 50%")}>
        {/* a faceted C, open to the right, crossed by two bars, the lower one shorter */}
        <path d="M20 6.5 17.5 4H12L8 8v8l4 4h5.5l2.5-2.5" />
        <g stroke={slot.accent}>
          <path data-part="bar" d="M4 10h11" />
          <path data-part="bar" d="M4 14h9" />
        </g>
      </g>
      {/* the coin's rim, seen only side-on: upright for a spin, flat for a flip */}
      <g fill={slot.accent} stroke="none">
        <rect data-part="rim" x="11" y="4" width="2" height="16" style={flash()} />
        <rect data-part="rim-flat" x="4" y="11" width="16" height="2" style={flash()} />
      </g>
    </g>
  ),
})
