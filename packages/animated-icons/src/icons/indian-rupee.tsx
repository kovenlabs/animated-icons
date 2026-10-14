"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"
import { spin } from "../lib/spin"

declare module "../lib/types" {
  interface IconVariants {
    "indian-rupee": "spin" | "toss" | "mint"
  }
}

const TURN = spin(2, "inOut")

/** 2 colors: bowl and tail (primary), bars and rim (accent). */
export const IndianRupee = createAnimatedIcon({
  name: "indian-rupee",
  category: "finance",
  keywords: ["inr", "rupee", "currency", "money", "price", "india", "payment", "rupee sign"],
  slots: { primary: "bowl + tail", accent: "bars + rim" },
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
            "[data-part=rupee]",
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
            "[data-part=rupee]",
            { y: [0, -5, 0, 0], scale: [1, 0.7, 1, 1] },
            { duration: seconds, times: [0, 0.38, 0.75, 1], ease: ["easeOut", "easeIn", "linear"] },
          ),
          animate(
            "[data-part=rupee]",
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
    // struck like a coin: the sign is pressed back into the die and punched out toward you with a
    // twist, then the bars are cut again, top first
    mint: {
      duration: 1150,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=sign]",
            { scale: [1, 0.6, 1.1, 0.95, 1], rotate: [0, 8, -6, 2, 0], opacity: [1, 0.4, 1, 1, 1] },
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
    <g data-part="rupee" style={pivot("50% 100%")}>
      <g data-part="sign" style={pivot("50% 50%")}>
        {/* a faceted bowl leaving from along the top bar, closed by a short foot; the tail leaves the foot
            from inside its stroke, so the sharp 45° turn never mitres into a spike */}
        <path d="M8 3h2l4 3v4l-3 3H6M8.5 13.5l7.5 7.5" />
        <g stroke={slot.accent}>
          <path data-part="bar" d="M6 3h12" />
          <path data-part="bar" d="M6 8h12" />
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
