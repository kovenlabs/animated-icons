"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { badgeGlyph } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    "mail-plus": "add" | "pulse" | "stamp"
  }
}

/**
 * The `mail` envelope with its top-right corner open wide enough for the plus (15..21 × 3..9): the top
 * edge and the flap stop short of it as in `mail-check`, and the right edge starts 2px below it as in
 * `mail-warning`.
 */
const ENVELOPE = "M11 5H3v14h18v-6"
const FLAP = "M3 5l9 7 2.25-1.75"

/** 3 colors: envelope (primary), flap (secondary), plus (accent). */
export const MailPlus = createAnimatedIcon({
  name: "mail-plus",
  family: "mail",
  category: "communication",
  keywords: ["invite by email", "new email", "compose", "add email", "invite", "new message", "write"],
  slots: { primary: "envelope", secondary: "flap", accent: "plus" },
  defaultVariant: "add",
  variants: {
    // the plus turns in from a diagonal and lands square, the way `user-plus` does; the envelope dips under it
    add: {
      duration: 650,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=plus]",
            { scale: [0, 1.15, 1], rotate: [-90, 0, 0] },
            { duration: seconds * 0.8, ease: ease.overshoot },
          ),
          animate("[data-part=envelope]", { y: [0, 0, 1, 0] }, { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeInOut" }),
        ]),
    },
    // the plus swells once from its centre
    pulse: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate("[data-part=plus]", { scale: [1, 1.2, 1] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the whole letter lifts a touch and presses down like a stamp
    stamp: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=mail]",
          { y: [0, -1, 1.5, 0], scaleY: [1, 1, 0.95, 1] },
          { duration: seconds, times: [0, 0.35, 0.65, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="mail" style={pivot("50% 100%")}>
      <g data-part="envelope">
        <path d={ENVELOPE} />
        <path d={FLAP} stroke={slot.secondary} />
      </g>
      <path data-part="plus" d={badgeGlyph.plus()} stroke={slot.accent} style={pivot("50% 50%")} />
    </g>
  ),
})
