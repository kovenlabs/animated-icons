"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"
import { ROSETTE } from "../lib/parts"
import { spin } from "../lib/spin"

declare module "../lib/types" {
  interface IconVariants {
    "badge-dollar-sign": "flip" | "coin" | "chime"
  }
}

const TURN = spin(2, "inOut")

/** 2 colors: badge (primary), dollar sign (accent). */
export const BadgeDollarSign = createAnimatedIcon({
  name: "badge-dollar-sign",
  family: "badge",
  category: "finance",
  keywords: ["price", "cost", "paid", "sale", "money", "pricing", "deal", "price tag"],
  slots: { primary: "badge", accent: "dollar sign" },
  defaultVariant: "flip",
  variants: {
    // the sticker turns over on its vertical axis: its back is blank, and the sign is back as it
    // comes round to face you, then kicks out with a twist and settles
    flip: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=seal]",
            { scaleX: [1, 0, -1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.14, 0.28, 0.42, 0.56, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut", "linear"] },
          ),
          animate(
            "[data-part=dollar]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.13, 0.14, 0.41, 0.42, 1], ease: ["linear", snap, "linear", snap, "linear"] },
          ),
          animate(
            "[data-part=dollar]",
            { scale: [1, 1, 1.12, 0.9, 1], rotate: [0, 0, -12, 6, 0] },
            { duration: seconds, times: [0, 0.56, 0.7, 0.85, 1], ease: ["linear", ease.out, "easeInOut", "easeInOut"] },
          ),
        ]),
    },
    // the dollar spins on its edge inside the seal, two turns that wind up and down; side-on it shows
    // its rim, and the rosette turns an eighth the other way under it
    coin: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=dollar]", { scaleX: TURN.scaleX }, { duration: seconds, times: TURN.times, ease: TURN.ease }),
          animate("[data-part=rim]", { opacity: TURN.edge }, { duration: seconds, times: TURN.times, ease: TURN.ease }),
          // eight-fold, so an eighth of a turn lands on the resting pose: snap back unseen
          animate(
            "[data-part=badge]",
            { rotate: [0, -45, 0] },
            { duration: seconds, times: [0, 0.999, 1], ease: ["easeInOut", snap] },
          ),
        ]),
    },
    // struck like a bell: the seal rings in shrinking beats, the sign ducking deeper on each squeeze
    // and swinging out past its place on each rebound
    chime: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=badge]",
            { scale: [1, 0.88, 1, 0.93, 1, 0.98, 1] },
            { duration: seconds, times: [0, 0.15, 0.32, 0.48, 0.64, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=dollar]",
            { scale: [1, 0.76, 1.12, 0.86, 1.06, 0.97, 1], rotate: [0, -10, 8, -5, 3, -1, 0] },
            { duration: seconds, times: [0, 0.15, 0.32, 0.48, 0.64, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="seal" style={pivot("50% 50%")}>
      <path data-part="badge" d={ROSETTE} style={pivot("50% 50%")} />
      <g data-part="dollar" stroke={slot.accent} style={pivot("50% 50%")}>
        {/* a faceted S whose ends hook in, kept clear of the rosette's notches, on a short bar */}
        <path d="M15 9.5 13.5 8h-3L9 9.5v1l1.5 1.5h3l1.5 1.5v1L13.5 16h-3L9 14.5" />
        <path d="M12 6.5v11" />
      </g>
      <rect data-part="rim" x="11" y="6.5" width="2" height="11" fill={slot.accent} stroke="none" style={flash()} />
    </g>
  ),
})
