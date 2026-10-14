"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "hard-hat": "bonk" | "tip" | "spin"
  }
}

/** 2 colors: shell and brim (primary), ridge, falling brick and impact marks (accent). */
export const HardHat = createAnimatedIcon({
  name: "hard-hat",
  family: "hard",
  category: "tools",
  keywords: ["helmet", "safety", "construction", "builder", "worker", "engineer", "protection", "site"],
  slots: { primary: "shell + brim", accent: "ridge + brick" },
  defaultVariant: "bonk",
  variants: {
    // a brick drops onto the crown: the hat squashes flat under it, springs back, and the brick
    // bounces off to the side
    bonk: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=brick]",
            { y: [-8, 1, -4, -1], x: [0, 0, 5, 9], rotate: [0, 0, 60, 140], opacity: [1, 1, 1, 0] },
            { duration: seconds, times: [0, 0.3, 0.6, 1], ease: [ease.in, "easeOut", "easeIn"] },
          ),
          animate(
            "[data-part=hat]",
            { scaleY: [1, 1, 0.75, 1.08, 0.97, 1], scaleX: [1, 1, 1.12, 0.96, 1.01, 1] },
            { duration: seconds, times: [0, 0.3, 0.38, 0.55, 0.75, 1], ease: "easeOut" },
          ),
          animate("[data-part=impact]", blink, { duration: seconds * 0.3, delay: seconds * 0.3, ease: "easeOut" }),
        ]),
    },
    // doffed in greeting: lifted and tilted, held a beat, then set back down with a little squash
    tip: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=hat]",
          {
            y: [0, -2.5, -2.5, 0, 0],
            rotate: [0, -14, -8, 0, 0],
            scaleY: [1, 1.05, 1.05, 0.88, 1],
            scaleX: [1, 0.97, 0.97, 1.06, 1],
          },
          { duration: seconds, times: [0, 0.3, 0.6, 0.82, 1], ease: ["easeOut", "easeInOut", ease.in, "easeOut"] },
        ),
    },
    // spun a full turn on the head with a hop, the peak swinging round from front to back
    spin: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=hat]",
          { scaleX: [1, -1, 1], y: [0, -2, 0], scaleY: [1, 1.04, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <rect data-part="brick" x="10" y="0" width="4" height="2" fill={slot.accent} stroke="none" style={flash()} />
      <g stroke={slot.accent}>
        <path data-part="impact" d="M7.5 4 6 2.5" style={flash("100% 100%")} />
        <path data-part="impact" d="M16.5 4 18 2.5" style={flash("0% 100%")} />
      </g>
      {/* squashes, tips and turns about the middle of the brim */}
      <g data-part="hat" style={pivot("50% 100%")}>
        {/* a faceted dome over a brim whose peak juts out to the right */}
        <path d="M4 16v-3l3-5 3-2h4l3 2 3 5v3" />
        <path d="M2 16h16l4 3H2Z" />
        <path d="M10 11V4h4v7" stroke={slot.accent} />
      </g>
    </>
  ),
})
