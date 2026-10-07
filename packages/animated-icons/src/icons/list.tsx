"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    list: "slide" | "push"
  }
}

/** Rows 6 apart; a push moves every row down by exactly one slot. */
const ROW_GAP = 6
const ROWS = [6, 12, 18] as const

/**
 * A 2×2 bullet, 2 clear of its line (whose square cap reaches x 7). Called, not mounted as a
 * component, so the factory's corner shaping reaches its path.
 */
const row = (part: string, y: number, style: React.CSSProperties) => (
  <g key={part} data-part={part} style={style}>
    <rect x="3" y={y - 1} width="2" height="2" fill={slot.accent} stroke="none" />
    <path d={`M8 ${y}h12`} />
  </g>
)

/** 2 colors: lines (primary), bullets (accent). */
export const List = createAnimatedIcon({
  name: "list",
  category: "layout",
  keywords: ["list", "bullets", "items", "unordered list", "rows", "feed", "todo"],
  slots: { primary: "lines", accent: "bullets" },
  defaultVariant: "slide",
  variants: {
    // the rows fade out together, then slide back in from the left edge one after another
    slide: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          ROWS.map((_, i) => {
            const start = 0.25 + i * 0.17
            const end = start + 0.4
            return Promise.all([
              animate(
                `[data-part=row-${i}]`,
                { opacity: [1, 0, 0, 1] },
                { duration: seconds, times: [0, 0.15, start, end], ease: "easeOut" },
              ),
              animate(
                `[data-part=row-${i}]`,
                { x: [0, 0, -7, 0] },
                { duration: seconds, times: [0, start - 0.01, start, end], ease: ["linear", "linear", ease.out] },
              ),
            ])
          }),
        ),
    },
    // a new row drops in on top and pushes the list down a slot; the last row slips out the bottom.
    // The rows are identical, so the shifted list is the resting list and snaps back unseen
    push: {
      clip: true,
      duration: 900,
      run: ({ animate, seconds }) => {
        // slide down a slot, hold, then snap back on the last frame: `snap` keeps every track on one
        // frame loop, so the fades can't start blending before the rows jump home
        const shift = [0, ROW_GAP, ROW_GAP, 0]
        const options = {
          duration: seconds,
          times: [0, 0.75, 0.999, 1],
          ease: ["easeInOut" as const, "linear" as const, snap],
        }
        return Promise.all([
          animate("[data-part=row-0], [data-part=row-1]", { y: shift }, options),
          animate("[data-part=row-2]", { y: shift, opacity: [1, 0, 0, 1] }, options),
          animate("[data-part=incoming]", { y: [-ROW_GAP, 0, 0, 0], opacity: [0, 1, 1, 0] }, options),
        ])
      },
    },
  },
  render: () => (
    <>
      {row("incoming", ROWS[0], flash())}
      {ROWS.map((y, i) => row(`row-${i}`, y, pivot("50% 50%")))}
    </>
  ),
})
