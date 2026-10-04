"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "layout-grid": "pop" | "shuffle"
  }
}

/** Four 7×7 tiles in clockwise order (top-left, top-right, bottom-right, bottom-left), 4 apart. */
const TILES = [
  { x: 3, y: 3 },
  { x: 14, y: 3 },
  { x: 14, y: 14 },
  { x: 3, y: 14 },
] as const

/** How small the tiles shrink while they rearrange: small enough that sliding tiles never touch. */
const LIFT = 0.55

/**
 * Every tile steps one slot clockwise, four times, so each walks the whole grid and lands home.
 * All four move at once, each into the slot its neighbour is leaving; at full size their corners
 * would brush mid-step, so the tiles shrink to `LIFT` for the whole tour.
 */
function shuffle(index: number) {
  const home = TILES[index]!
  const at = (step: number) => TILES[(index + step) % 4]!
  const x: number[] = [0]
  const y: number[] = [0]
  const times: number[] = [0]
  for (let s = 1; s <= 4; s++) {
    const start = 0.12 + (s - 1) * 0.19
    // hold in the slot, then slide to the next one
    x.push(at(s - 1).x - home.x, at(s).x - home.x)
    y.push(at(s - 1).y - home.y, at(s).y - home.y)
    times.push(start, start + 0.14)
  }
  x.push(0)
  y.push(0)
  times.push(1)
  return { x, y, times }
}

/** 2 colors: tiles (primary), the lead tile (accent). */
export const LayoutGrid = createAnimatedIcon({
  name: "layout-grid",
  category: "layout",
  keywords: ["grid", "tiles", "dashboard", "gallery", "apps", "blocks", "layout", "view"],
  slots: { primary: "tiles", accent: "lead tile" },
  defaultVariant: "pop",
  variants: {
    // the tiles shrink away together, then pop back in one by one, clockwise from the lead tile
    pop: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=tile]",
          { scale: [1, 0, 0, 1.15, 1] },
          {
            duration: seconds * 0.6,
            times: [0, 0.2, 0.35, 0.75, 1],
            ease: ["easeIn", "linear", ease.overshoot, "easeOut"],
            delay: stagger(seconds * 0.13),
          },
        ),
    },
    // the tiles lift (shrink) and rearrange: each steps one slot clockwise, four times, until the
    // lead tile is home again, then they settle back to full size
    shuffle: {
      // an 11px slide per step, always inside the frame
      clip: false,
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tile]",
            { scale: [1, LIFT, LIFT, 1] },
            { duration: seconds, times: [0, 0.1, 0.9, 1], ease: ["easeOut", "linear", ease.overshoot] },
          ),
          ...TILES.map((_, i) => {
            const { x, y, times } = shuffle(i)
            return animate(`[data-part=tile][data-index="${i}"]`, { x, y }, { duration: seconds, times, ease: "easeInOut" })
          }),
        ]),
    },
  },
  render: () => (
    <>
      {TILES.map(({ x, y }, i) => (
        <rect
          key={i}
          data-part="tile"
          data-index={i}
          x={x}
          y={y}
          width="7"
          height="7"
          stroke={i === 0 ? slot.accent : undefined}
          style={pivot("50% 50%")}
        />
      ))}
    </>
  ),
})
