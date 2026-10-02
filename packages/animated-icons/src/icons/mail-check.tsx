"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { badgeGlyph } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    "mail-check": "check" | "pop" | "stamp"
  }
}

/**
 * The `mail` envelope with its top-right corner open, opened a little wider than for the dot badge: the
 * check is wider than the badge square, so the top edge and the flap stop 2px short of it.
 */
const ENVELOPE = "M11 5H3v14h18v-9"
const FLAP = "M3 5l9 7 2.25-1.75"

/** 3 colors: envelope (primary), flap (secondary), check (accent). */
export const MailCheckIcon = createAnimatedIcon({
  name: "mail-check",
  family: "mail",
  category: "communication",
  keywords: ["email", "sent", "delivered", "read", "verified", "confirmed", "inbox"],
  slots: { primary: "envelope", secondary: "flap", accent: "check" },
  defaultVariant: "check",
  variants: {
    // the check fades out and redraws from its short leg while the envelope gives a small nod
    check: {
      duration: 750,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=check]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.45, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=check]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.85, times: [0, 0.18, 0.2, 1], ease: "easeOut" },
          ),
          animate("[data-part=envelope]", { y: [0, 0, 1, 0] }, { duration: seconds, times: [0, 0.5, 0.75, 1], ease: "easeInOut" }),
        ]),
    },
    // the check pops from its elbow, the way `mail`'s badge lands
    pop: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate("[data-part=check]", { scale: [0, 1.15, 1] }, { duration: seconds, ease: ease.overshoot }),
    },
    // the whole letter lifts a touch and presses down like a stamp; a full hop would lift the check out of the frame
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
      {/* pivots on its elbow */}
      <path data-part="check" d={badgeGlyph.check()} stroke={slot.accent} style={pivot("35% 100%")} />
    </g>
  ),
})
