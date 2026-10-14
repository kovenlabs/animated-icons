"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "file-spreadsheet": "fill" | "flip" | "sum"
  }
}

/**
 * A 2×2 block of 3×3 cells, reading order, each 2 clear of the page, the fold and each other.
 * `dx`/`dy` point from the cell to the block's centre (11, 15), for gathering them in.
 */
const CELLS = [
  { x: 7, y: 11, dx: 2.5, dy: 2.5 },
  { x: 12, y: 11, dx: -2.5, dy: 2.5 },
  { x: 7, y: 16, dx: 2.5, dy: -2.5 },
  { x: 12, y: 16, dx: -2.5, dy: -2.5 },
] as const

/** 2 colors: page (primary), cells (accent). */
export const FileSpreadsheet = createAnimatedIcon({
  name: "file-spreadsheet",
  family: "file",
  category: "files",
  keywords: ["spreadsheet", "excel", "csv", "sheet", "table file", "data", "xlsx", "cells"],
  slots: { primary: "page", accent: "cells" },
  defaultVariant: "fill",
  variants: {
    // the cells shrink away together, then pop back in one by one in reading order
    fill: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cell]",
          { scale: [1, 0, 0, 1.25, 1] },
          {
            duration: seconds * 0.6,
            times: [0, 0.2, 0.35, 0.75, 1],
            ease: ["easeIn", "linear", ease.overshoot, "easeOut"],
            delay: stagger(seconds * 0.13),
          },
        ),
    },
    // the cells turn over one after another, like the flaps of a departure board
    flip: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cell]",
          { scaleY: [1, -1, 1], skewX: [0, 15, 0, -15, 0] },
          { duration: seconds * 0.55, ease: "easeInOut", delay: stagger(seconds * 0.15) },
        ),
    },
    // the cells are summed: they gather into one block in the middle, then burst back to their places
    sum: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...CELLS.map(({ dx, dy }, i) =>
            animate(
              `[data-part=cell]:nth-of-type(${i + 1})`,
              { x: [0, dx, dx, 0], y: [0, dy, dy, 0] },
              { duration: seconds, times: [0, 0.35, 0.55, 1], ease: [ease.in, "linear", ease.overshoot] },
            ),
          ),
          animate(
            "[data-part=cells]",
            { scale: [1, 1, 1.2, 0.95, 1] },
            { duration: seconds, times: [0, 0.35, 0.45, 0.55, 1], ease: "easeOut" },
          ),
          animate("[data-part=page]", { rotate: [0, 0, -4, 3, 0] }, { duration: seconds, times: [0, 0.5, 0.65, 0.8, 1] }),
        ]),
    },
  },
  render: () => (
    // the page spans x 4..18: shifted 1 right so the family sits centred in the 24 grid
    <g transform="translate(1 0)">
      <g data-part="page" style={pivot("50% 100%")}>
        {/* the file page, as in `file` */}
        <path d="M18 7v15H4V2h9z" />
        <path d="M13 2v5h5" />
        <g data-part="cells" fill={slot.accent} stroke="none" style={pivot("50% 50%")}>
          {CELLS.map(({ x, y }) => (
            <rect key={`${x}-${y}`} data-part="cell" x={x} y={y} width="3" height="3" style={pivot("50% 50%")} />
          ))}
        </g>
      </g>
    </g>
  ),
})
