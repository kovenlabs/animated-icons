"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { BADGE } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    "mail-warning": "alert" | "shake" | "blink"
  }
}

/**
 * The `mail` envelope with its top-right corner open, opened lower on the right than for the dot badge:
 * the exclamation fills the badge zone's full height, so the right edge starts 2px clear of its dot. The
 * flap stops short as in `mail-check`.
 */
const ENVELOPE = "M14 5H3v14h18v-6"
const FLAP = "M3 5l9 7 2.25-1.75"

/** 3 colors: envelope (primary), flap (secondary), exclamation mark (accent). */
export const MailWarning = createAnimatedIcon({
  name: "mail-warning",
  family: "mail",
  category: "communication",
  keywords: ["email warning", "no email", "missing email", "undeliverable", "bounced", "mail error", "alert"],
  slots: { primary: "envelope", secondary: "flap", accent: "exclamation mark" },
  defaultVariant: "alert",
  variants: {
    // the exclamation pops in from its dot and lands, the way `mail`'s badge does
    alert: {
      duration: 550,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=mark]", { scale: [0, 1.2, 1] }, { duration: seconds, ease: ease.overshoot }),
          animate("[data-part=envelope]", { y: [0, 1, 0] }, { duration: seconds * 0.7, ease: "easeOut" }),
        ]),
    },
    // the whole letter shudders side to side, like a bounced send
    shake: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=mail]",
          { x: [0, -1.5, 1.5, -1, 1, 0], rotate: [0, -3, 3, -2, 1, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the exclamation blinks twice, like a warning light
    blink: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=mark]",
          { opacity: [1, 0, 1, 0, 1] },
          {
            duration: seconds,
            times: [0, 0.2, 0.45, 0.65, 0.9],
            ease: "easeInOut",
          },
        ),
    },
  },
  render: () => (
    <g data-part="mail" style={pivot("50% 100%")}>
      <g data-part="envelope">
        <path d={ENVELOPE} />
        <path d={FLAP} stroke={slot.secondary} />
      </g>
      {/* centred in the badge zone (y 2..10): a 4px bar, a 2px gap, a 2px dot; it pops from the dot */}
      <g data-part="mark" style={pivot("50% 100%")}>
        <path d={`M${BADGE.cx} 3v2`} stroke={slot.accent} />
        <rect fill={slot.accent} height="2" stroke="none" width="2" x={BADGE.cx - 1} y="8" />
      </g>
    </g>
  ),
})
