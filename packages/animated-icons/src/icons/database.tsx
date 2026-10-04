"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    database: "lift" | "fill" | "hop"
  }
}

/** 2 colors: drum (primary), middle ring (accent). */
export const Database = createAnimatedIcon({
  name: "database",
  category: "development",
  keywords: ["storage", "db", "sql", "server", "data", "records", "table", "backend"],
  slots: { primary: "drum", accent: "middle ring" },
  defaultVariant: "lift",
  variants: {
    // the lid lifts off the drum and drops back into place
    lift: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=lid]",
          { y: [0, -2.5, -2.5, 0] },
          { duration: seconds, times: [0, 0.35, 0.55, 1], ease: ["easeOut", "linear", "easeIn"] },
        ),
    },
    // the middle ring fades and fills back in round the drum, left to right
    // (hidden while it is too short to read)
    fill: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ring]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.45, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=ring]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds, times: [0, 0.14, 0.15, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the whole drum hops and lands with a squash
    hop: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=drum]",
          { y: [0, -2.5, 0, 0], scaleY: [1, 1.04, 0.94, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
  },
  render: () => (
    // a drum is round, so its rims are true ellipses and elliptical arcs
    <g data-part="drum" style={pivot("50% 100%")}>
      <ellipse data-part="lid" cx="12" cy="6" rx="9" ry="3" />
      <path d="M3 6v12A9 3 0 0 0 21 18V6" />
      <path data-part="ring" d="M3 12A9 3 0 0 0 21 12" stroke={slot.accent} />
    </g>
  ),
})
