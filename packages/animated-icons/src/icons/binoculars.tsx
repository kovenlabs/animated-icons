"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    binoculars: "scan" | "focus" | "peek"
  }
}

/** One barrel: eyepiece, a body whose outer flank steps out to the objective, and its lens bar. */
const BARRELS = [
  { side: "left", body: "M4 7h6v14H2v-5l2-4z", eyepiece: "M5 7V3h4v4", lens: "M2 16h8", glass: 2 },
  { side: "right", body: "M20 7h-6v14h8v-5l-2-4z", eyepiece: "M19 7V3h-4v4", lens: "M14 16h8", glass: 14 },
] as const

/** 2 colors: barrels (primary), lenses and their glint (accent). */
export const Binoculars = createAnimatedIcon({
  name: "binoculars",
  category: "navigation",
  keywords: ["search", "explore", "look", "watch", "view", "spy", "discover", "birdwatching"],
  slots: { primary: "barrels + bridge", accent: "lenses + glint" },
  defaultVariant: "scan",
  variants: {
    // a sweep of the horizon: the pair turns away to one side, foreshortening and raking like a box
    // seen at an angle, swings through to the other side, and catches the sun as it faces you again
    scan: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=binoculars]",
            {
              x: [0, -1.5, 1.5, 0],
              scaleX: [1, 0.82, 0.82, 1],
              skewY: [0, -7, 7, 0],
            },
            { duration: seconds * 0.85, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=glass]",
            { opacity: [0, 0, 1, 0] },
            { duration: seconds, times: [0, 0.8, 0.88, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the barrels hinge apart to fit the eyes and snap back in, the bridge stretching between them,
    // and the lenses flare as the view comes into focus
    focus: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const spread = { duration: seconds * 0.8, times: [0, 0.35, 0.7, 1] }
        return Promise.all([
          animate("[data-part=left]", { x: [0, -1.5, 0.3, 0], rotate: [0, -4, 1, 0] }, { ...spread, ease: ["easeOut", ease.overshoot, "easeOut"] }),
          animate("[data-part=right]", { x: [0, 1.5, -0.3, 0], rotate: [0, 4, -1, 0] }, { ...spread, ease: ["easeOut", ease.overshoot, "easeOut"] }),
          animate("[data-part=bridge]", { scaleX: [1, 1.75, 0.85, 1] }, { ...spread, ease: ["easeOut", ease.overshoot, "easeOut"] }),
          animate(
            "[data-part=glass]",
            { opacity: [0, 0, 1, 0] },
            { duration: seconds, times: [0, 0.55, 0.7, 1], ease: "easeOut" },
          ),
        ])
      },
    },
    // lifted to the eyes: the pair rises and swells toward you while its top tips away, the lenses
    // glint at the top of the lift, and it drops back down with a bounce
    peek: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=binoculars]",
            { y: [0, -1.5, -1.5, 0], scale: [1, 1.06, 1.06, 1], scaleY: [1, 0.9, 0.9, 1] },
            { duration: seconds, times: [0, 0.3, 0.65, 1], ease: ["easeOut", "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=glass]",
            { opacity: [0, 0, 1, 0] },
            { duration: seconds, times: [0, 0.3, 0.42, 0.65], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="binoculars" style={pivot("50% 50%")}>
      <path data-part="bridge" d="M10 10h4" style={pivot("50% 50%")} />
      {BARRELS.map(({ side, body, eyepiece, lens, glass }) => (
        <g key={side} data-part={side} style={pivot(side === "left" ? "100% 0%" : "0% 0%")}>
          {/* the objective glints, filling the lens under its outline */}
          <rect data-part="glass" x={glass} y="16" width="8" height="5" fill={slot.accent} stroke="none" style={flash()} />
          <path d={body} />
          <path d={eyepiece} />
          <path d={lens} stroke={slot.accent} />
        </g>
      ))}
    </g>
  ),
})
