"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"
import { spin } from "../lib/spin"

declare module "../lib/types" {
  interface IconVariants {
    "japanese-yen": "spin" | "toss" | "bow"
  }
}

const TURN = spin(2, "inOut")

/** 2 colors: Y (primary), bars and rim (accent). */
export const JapaneseYen = createAnimatedIcon({
  name: "japanese-yen",
  category: "finance",
  keywords: ["jpy", "yen", "yuan", "currency", "money", "price", "japan", "yen sign"],
  slots: { primary: "Y", accent: "bars + rim" },
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
            "[data-part=yen]",
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
            "[data-part=yen]",
            { y: [0, -5, 0, 0], scale: [1, 0.7, 1, 1] },
            { duration: seconds, times: [0, 0.38, 0.75, 1], ease: ["easeOut", "easeIn", "linear"] },
          ),
          animate(
            "[data-part=yen]",
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
    // a deep bow: the top tips toward you (foreshortened, its arms spreading wider as they come
    // close), holds, and straightens up past upright; the bars ripple down after it
    bow: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=yen]",
            { scaleY: [1, 0.62, 0.62, 1.05, 1], skewX: [0, -6, -6, 2, 0] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: ["easeInOut", "linear", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=arms]",
            { scaleX: [1, 1.25, 1.25, 0.95, 1] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: ["easeInOut", "linear", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=bar]",
            { scaleX: [1, 1.2, 0.9, 1] },
            { duration: seconds * 0.4, delay: stagger(seconds * 0.08, { startDelay: seconds * 0.55 }), ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="yen" style={pivot("50% 100%")}>
      <g data-part="sign" style={pivot("50% 50%")}>
        {/* a Y: two straight arms meeting on the stem, crossed by two equal bars */}
        <path data-part="arms" d="M6 3l6 7 6-7" style={pivot("50% 100%")} />
        <path d="M12 10v11" />
        <g stroke={slot.accent}>
          <path data-part="bar" d="M7 13h10" style={pivot("50% 50%")} />
          <path data-part="bar" d="M7 17h10" style={pivot("50% 50%")} />
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
