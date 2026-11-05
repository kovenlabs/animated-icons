"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { badgeGlyph } from "../lib/parts"

declare module "../lib/types" {
  interface IconVariants {
    "search-x": "shake" | "strike" | "turn"
  }
}

/** The badge X centred in the lens, split into its two strokes so `strike` can redraw them in turn. */
const STROKES = badgeGlyph.x(10, 10).split(/(?=M)/)

/** 2 colors: lens and handle (primary), X (accent). */
export const SearchX = createAnimatedIcon({
  name: "search-x",
  family: "search",
  category: "actions",
  keywords: ["no results", "nothing found", "clear search", "search failed", "not found", "empty search"],
  slots: { primary: "lens + handle", accent: "x" },
  defaultVariant: "shake",
  variants: {
    // the glass shakes its head: side to side, damped
    shake: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate("[data-part=glass]", { x: [0, -2, 2, -1.25, 0.5, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the X fades out and strikes again, one stroke after the other; each is hidden while too short to read
    strike: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all(
          STROKES.map((_, i) => {
            const start = 0.2 + i * 0.35
            return Promise.all([
              animate(`[data-part=stroke-${i + 1}]`, { opacity: [1, 0, 0, 1, 1] }, { duration: seconds, times: [0, 0.15, start, start + 0.01, 1] }),
              animate(
                `[data-part=stroke-${i + 1}]`,
                { pathLength: [1, 1, 0, 1, 1] },
                { duration: seconds, times: [0, start - 0.01, start, start + 0.35, 1], ease: "easeOut" },
              ),
            ])
          }),
        ),
    },
    // the X turns a quarter on its centre with a small swell (an X looks the same at -90°, so it starts there unseen)
    turn: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate("[data-part=x]", { rotate: [-90, 0], scale: [1, 1.12, 1] }, { duration: seconds, ease: ease.inOut }),
    },
  },
  render: () => (
    <g data-part="glass" style={pivot("40% 40%")}>
      {/* a lens is round, so it gets a true circle */}
      <circle cx="10" cy="10" r="7" />
      <path d="M15 15l5.5 5.5" />
      <g data-part="x" stroke={slot.accent} style={pivot("50% 50%")}>
        {STROKES.map((d, i) => (
          <path key={d} data-part={`stroke-${i + 1}`} d={d} />
        ))}
      </g>
    </g>
  ),
})
