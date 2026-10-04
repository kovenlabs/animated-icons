"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, flash, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    table: "scan" | "draw"
  }
}

/** The grid inside the frame: a header rule, a body rule and two column rules, 6 apart. */
const RULES = [
  { part: "rule-0", d: "M5 9h14", header: true },
  { part: "rule-1", d: "M4 15h16", header: false },
  { part: "rule-2", d: "M9 4v16", header: false },
  { part: "rule-3", d: "M15 4v16", header: false },
] as const

/** The middle row's three cell interiors (4×4, inside the 2px rules), left to right. */
const CELLS = [4, 10, 16] as const

/**
 * Each rule fades out with the others, then draws on from its start, one after the other.
 * Hidden while its stroke is too short to read: a square cap paints a dot at length 0.
 */
const drawRule = (start: number, end: number) => ({
  opacity: { values: [1, 0, 0, 1, 1], times: [0, 0.15, start, start + 0.01, 1] },
  pathLength: { values: [1, 1, 0, 1, 1], times: [0, start - 0.01, start, end, 1] },
})

/** 2 colors: frame and rules (primary), header rule + selection (accent). */
export const Table = createAnimatedIcon({
  name: "table",
  category: "layout",
  keywords: ["data grid", "spreadsheet", "rows", "columns", "sheet", "grades table", "cells", "records"],
  slots: { primary: "frame + rules", accent: "header rule + selection" },
  defaultVariant: "scan",
  variants: {
    // a selection sweeps along the middle row, lighting each cell in turn
    scan: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate("[data-part=cell]", blink, {
          duration: seconds * 0.5,
          delay: stagger(seconds * 0.22),
          ease: "easeOut",
        }),
    },
    // the rules fade out and draw back in one after another: header, body, then the columns
    draw: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all(
          RULES.map(({ part }, i) => {
            const { opacity, pathLength } = drawRule(0.2 + i * 0.18, 0.4 + i * 0.18)
            return Promise.all([
              animate(`[data-part=${part}]`, { opacity: opacity.values }, { duration: seconds, times: opacity.times }),
              animate(
                `[data-part=${part}]`,
                { pathLength: pathLength.values },
                { duration: seconds, times: pathLength.times, ease: "easeOut" },
              ),
            ])
          }),
        ),
    },
  },
  render: () => (
    <>
      <g fill={slot.accent} stroke="none">
        {CELLS.map((x) => (
          <rect key={x} data-part="cell" x={x} y="10" width="4" height="4" style={flash("50% 50%")} />
        ))}
      </g>
      <path d="M3 3h18v18H3z" />
      {RULES.map(({ part, d, header }) => (
        <path key={part} data-part={part} d={d} stroke={header ? slot.accent : undefined} />
      ))}
    </>
  ),
})
