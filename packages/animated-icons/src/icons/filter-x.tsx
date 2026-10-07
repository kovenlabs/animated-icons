"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { badgeGlyph } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    "filter-x": "turn" | "pop" | "strike"
  }
}

/**
 * The `filter` funnel, moved left to centre on x 10 so the badge zone stays free: the rim stops 2px short
 * of the X and the right slant gives way to it, leaving the neck's right wall standing on its own.
 */
const FUNNEL = "M11 4H2l6 7v7M12 18v-7"

/** The X's two strokes, falling then rising, so `strike` can redraw them one after the other. */
const STROKES = badgeGlyph.x().split(/(?=M)/)

/** 2 colors: funnel (primary), X (accent). */
export const FilterX = createAnimatedIcon({
  name: "filter-x",
  family: "filter",
  category: "actions",
  keywords: ["clear filters", "remove filter", "reset", "funnel", "unfilter", "show all"],
  slots: { primary: "funnel", accent: "x" },
  defaultVariant: "turn",
  variants: {
    // the X turns a quarter on its centre with a small swell (an X looks the same at -90°, so it starts there unseen)
    turn: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate("[data-part=x]", { rotate: [-90, 0], scale: [1, 1.1, 1] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the X pops in from nothing and lands
    pop: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate("[data-part=x]", { scale: [0, 1.15, 1] }, { duration: seconds, ease: ease.overshoot }),
    },
    // the X fades out and strikes again, one stroke after the other; each is hidden while too short to read
    strike: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all(
          STROKES.map((_, i) => {
            const start = 0.2 + i * 0.35
            return Promise.all([
              animate(
                `[data-part=stroke-${i + 1}]`,
                { opacity: [1, 0, 0, 1, 1] },
                { duration: seconds, times: [0, 0.15, start, start + 0.01, 1] },
              ),
              animate(
                `[data-part=stroke-${i + 1}]`,
                { pathLength: [1, 1, 0, 1, 1] },
                {
                  duration: seconds,
                  times: [0, start - 0.01, start, start + 0.35, 1],
                  ease: "easeOut",
                },
              ),
            ])
          }),
        ),
    },
  },
  render: () => (
    <>
      <path data-part="funnel" d={FUNNEL} />
      <g data-part="x" stroke={slot.accent} style={pivot("50% 50%")}>
        {STROKES.map((d, i) => (
          <path key={d} data-part={`stroke-${i + 1}`} d={d} />
        ))}
      </g>
    </>
  ),
})
