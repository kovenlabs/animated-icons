"use client"

import { createAnimatedIcon } from "../lib/create-icon"

declare module "../lib/types" {
  interface IconVariants {
    "grip-vertical": "drag" | "wave" | "spread"
  }
}

/** Two columns of three 2×2 dots: 2px clear between the columns once stroked, 3px between rows. */
const ROWS = [
  { part: "row-a", y: 4 },
  { part: "row-b", y: 11 },
  { part: "row-c", y: 18 },
] as const
const COLUMNS = [
  { part: "col-l", x: 8 },
  { part: "col-r", x: 14 },
] as const

/** 1 color. */
export const GripVertical = createAnimatedIcon({
  name: "grip-vertical",
  category: "layout",
  keywords: ["drag", "handle", "reorder", "move", "grab", "sort", "dots"],
  slots: { primary: "dots" },
  defaultVariant: "drag",
  variants: {
    // picked up and dragged up a step, down a step, then dropped back in place
    drag: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=grip]",
          { y: [0, -3, 3, 0] },
          { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // each row nudges sideways in turn, top to bottom
    wave: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all(
          ROWS.map(({ part }, i) =>
            animate(
              `[data-part=${part}]`,
              { x: [0, 2.5, 0] },
              { duration: seconds * 0.5, delay: seconds * 0.25 * i, ease: "easeInOut" },
            ),
          ),
        ),
    },
    // the columns part like a grip being squeezed open, then close back
    spread: {
      duration: 650,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=col-l]",
            { x: [0, -2, 0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=col-r]",
            { x: [0, 2, -0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="grip">
      {COLUMNS.map((column) => (
        <g key={column.part} data-part={column.part}>
          {ROWS.map((row) => (
            <g key={row.part} data-part={row.part}>
              <rect x={column.x} y={row.y} width="2" height="2" />
            </g>
          ))}
        </g>
      ))}
    </g>
  ),
})
