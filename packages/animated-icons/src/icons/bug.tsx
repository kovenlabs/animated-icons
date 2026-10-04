"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    bug: "scuttle" | "twitch" | "squash"
  }
}

/**
 * Six legs, each pivoting where it meets the body. A walking insect moves in tripods: the front and
 * back legs swing one way while the middle pair swings the other.
 */
const LEGS = [
  { group: "outer", d: "M6 11 3 8", origin: "100% 100%" },
  { group: "middle", d: "M6 15H3", origin: "100% 50%" },
  { group: "outer", d: "M8 17l-3 3", origin: "100% 0%" },
  { group: "outer", d: "M18 11l3-3", origin: "0% 100%" },
  { group: "middle", d: "M18 15h3", origin: "0% 50%" },
  { group: "outer", d: "M16 17l3 3", origin: "0% 0%" },
] as const

/** 2 colors: body and head (primary), legs and antennae (accent). */
export const Bug = createAnimatedIcon({
  name: "bug",
  category: "development",
  keywords: ["debug", "error", "issue", "defect", "insect", "beetle", "report bug"],
  slots: { primary: "body + head", accent: "legs + antennae" },
  defaultVariant: "scuttle",
  variants: {
    // the legs scuttle in alternating tripods
    scuttle: {
      duration: 800,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=outer]", { rotate: [0, 14, -14, 14, -14, 0] }, timing),
          animate("[data-part=middle]", { rotate: [0, -14, 14, -14, 14, 0] }, timing),
        ])
      },
    },
    // the antennae twitch out of step, feeling the air
    twitch: {
      duration: 900,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=antenna-left]", { rotate: [0, -30, 0, -24, 0, 0] }, timing),
          animate("[data-part=antenna-right]", { rotate: [0, 0, 30, 0, 24, 0] }, timing),
        ])
      },
    },
    // it gets squashed flat, then pops back up
    squash: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bug]",
          { scaleY: [1, 0.55, 0.55, 1.06, 1], scaleX: [1, 1.18, 1.18, 0.97, 1] },
          { duration: seconds, times: [0, 0.2, 0.55, 0.8, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="bug" style={pivot("50% 100%")}>
      {/* a shield-shaped body split by its wing seam, under a solid head (an open head reads as a padlock) */}
      <path d="M6 11l2-2h8l2 2v4l-5 5h-2l-5-5Z" />
      <path d="M12 9v7" />
      <path d="M9.5 9l1-3h3l1 3Z" fill={slot.primary} />
      <g stroke={slot.accent}>
        <path data-part="antenna-left" d="M10.5 6 8 3" style={pivot("100% 100%")} />
        <path data-part="antenna-right" d="M13.5 6 16 3" style={pivot("0% 100%")} />
        {LEGS.map(({ group, d, origin }) => (
          <path key={d} data-part={group} d={d} style={pivot(origin)} />
        ))}
      </g>
    </g>
  ),
})
