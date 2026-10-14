"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"
import { ROSETTE } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    "badge-alert": "alarm" | "flip" | "siren"
  }
}

/** 2 colors: badge (primary), exclamation mark (accent). */
export const BadgeAlert = createAnimatedIcon({
  name: "badge-alert",
  family: "badge",
  category: "status",
  keywords: ["warning", "alert", "attention", "error", "notice", "unverified", "issue", "exclamation"],
  slots: { primary: "badge", accent: "exclamation mark" },
  defaultVariant: "alarm",
  variants: {
    // the seal jangles like an alarm bell, damped, while the mark lurches big and holds
    alarm: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=seal]",
            { rotate: [0, -20, 16, -11, 7, -3, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=mark]",
            { scale: [1, 0.8, 1.18, 1.18, 1] },
            { duration: seconds, times: [0, 0.12, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the seal turns over on its upright axis: its back is blank, and the mark punches back out as it
    // comes round to face you
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
            "[data-part=mark]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.13, 0.14, 0.41, 0.42, 1], ease: ["linear", snap, "linear", snap, "linear"] },
          ),
          animate(
            "[data-part=mark]",
            { scale: [1, 1, 1.25, 0.92, 1] },
            { duration: seconds, times: [0, 0.56, 0.7, 0.84, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // a turning siren: the rosette spins a full turn behind the mark, which strobes twice, stretching
    // as it lights
    siren: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=badge]", { rotate: [0, 360] }, { duration: seconds, ease: ease.inOut }),
          animate(
            "[data-part=mark]",
            { opacity: [1, 0.15, 1, 0.15, 1], scaleY: [1, 0.85, 1.2, 0.85, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="seal" style={pivot("50% 50%")}>
      <path data-part="badge" d={ROSETTE} style={pivot("50% 50%")} />
      <g data-part="mark" style={pivot("50% 50%")}>
        <path d="M12 7v5" stroke={slot.accent} />
        <rect x="11" y="15" width="2" height="2" fill={slot.accent} stroke="none" />
      </g>
    </g>
  ),
})
