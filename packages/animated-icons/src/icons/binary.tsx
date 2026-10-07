"use client"

import { stagger, type Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    binary: "flip" | "roll" | "wave"
  }
}

/** A digit's cell: 4 wide, 6 tall, its top-left corner at (x, y). */
const zero = (x: number, y: number) => `M${x} ${y}h4v6h-4z`
const one = (x: number, y: number) => `M${x} ${y + 1.5}L${x + 2} ${y}v6M${x} ${y + 6}h4`

/** A bit: a zero is drawn in the body color, a one in the accent. */
function Digit({ value, x, y, ...rest }: { value: 0 | 1; x: number; y: number } & React.SVGProps<SVGPathElement>) {
  return <path d={value ? one(x, y) : zero(x, y)} stroke={value ? slot.accent : undefined} {...rest} />
}

/** Columns 10 apart and rows 12 apart: the reels repeat every two rows. */
const COLUMNS = [5, 15] as const
const ROWS = [3, 15] as const
const REEL = 24

/** 2 colors: zeros (primary), ones (accent). */
export const Binary = createAnimatedIcon({
  name: "binary",
  category: "development",
  keywords: ["bits", "bytes", "zeros and ones", "digital", "machine code", "data", "base 2", "code"],
  slots: { primary: "zeros", accent: "ones" },
  defaultVariant: "flip",
  variants: {
    // every bit flips like a tile, one after another: it turns edge-on, comes round as its opposite,
    // holds, and turns back. The digit swaps while the tile is edge-on, so the swap itself is never seen
    flip: {
      duration: 1400,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds * 0.64, delay: stagger(seconds * 0.12) }
        const swap = {
          ...timing,
          times: [0, 0.19, 0.2, 0.79, 0.8, 1],
          ease: ["linear", snap, "linear", snap, "linear"] satisfies Easing[],
        }
        return Promise.all([
          animate(
            "[data-part=bit]",
            { scaleX: [1, 0, 1, 1, 0, 1], scaleY: [1, 1.2, 1, 1, 1.2, 1] },
            {
              ...timing,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              ease: ["easeIn", ease.out, "linear", "easeIn", ease.out],
            },
          ),
          animate("[data-part=face]", { opacity: [1, 1, 0, 0, 1, 1] }, swap),
          animate("[data-part=flipside]", { opacity: [0, 0, 1, 1, 0, 0] }, swap),
        ])
      },
    },
    // the columns spin like slot-machine reels, the left one up and the right one down, a whole turn
    // of the reel each; they kick back, run, overshoot and settle on the same bits they started from
    roll: {
      duration: 1300,
      clip: true,
      run: ({ animate, seconds }) => {
        const spin = (direction: number, delay: number) => {
          const timing = { duration: seconds * (1 - delay), delay: seconds * delay }
          return [
            animate(
              `[data-part=reel-${direction < 0 ? "up" : "down"}]`,
              { y: [0, -1.5 * direction, REEL * direction, REEL * direction, 0] },
              { ...timing, times: [0, 0.15, 0.8, 0.999, 1], ease: ["easeOut", ease.overshoot, "linear", snap] },
            ),
            // the next turn of the reel only exists while it spins
            animate(
              `[data-part=reel-${direction < 0 ? "up" : "down"}] [data-part=spare]`,
              { opacity: [0, 1, 1, 0] },
              { ...timing, times: [0, 0.01, 0.999, 1], ease: ["linear", "linear", snap] },
            ),
          ]
        }
        return Promise.all([...spin(-1, 0), ...spin(1, 0.08)])
      },
    },
    // the bits leap towards you one after another, column by column, and land with a small rebound
    wave: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bit]",
          { scale: [1, 1.4, 0.92, 1] },
          {
            duration: seconds * 0.55,
            delay: stagger(seconds * 0.15),
            times: [0, 0.4, 0.75, 1],
            ease: [ease.out, "easeInOut", "easeOut"],
          },
        ),
    },
  },
  render: () => {
    // 0 1 over 1 0; each bit holds its opposite on its flip side
    const bit = (value: 0 | 1, x: number, y: number) => (
      <g data-part="bit" style={pivot("50% 50%")}>
        <Digit data-part="face" value={value} x={x} y={y} />
        <Digit data-part="flipside" value={value ? 0 : 1} x={x} y={y} style={flash()} />
      </g>
    )
    const [left, right] = COLUMNS
    const [top, bottom] = ROWS
    return (
      <>
        {/* each reel carries one more turn of itself beyond the frame, the way it spins */}
        <g data-part="reel-up">
          {bit(0, left, top)}
          {bit(1, left, bottom)}
          <Digit data-part="spare" value={0} x={left} y={top + REEL} style={flash()} />
          <Digit data-part="spare" value={1} x={left} y={bottom + REEL} style={flash()} />
        </g>
        <g data-part="reel-down">
          {bit(1, right, top)}
          {bit(0, right, bottom)}
          <Digit data-part="spare" value={1} x={right} y={top - REEL} style={flash()} />
          <Digit data-part="spare" value={0} x={right} y={bottom - REEL} style={flash()} />
        </g>
      </>
    )
  },
})
