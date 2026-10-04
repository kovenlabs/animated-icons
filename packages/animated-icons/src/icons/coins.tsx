"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    coins: "drop" | "flip"
  }
}

/** A coin seen edge-on: a flat hexagon 16 wide and 4 tall, rendered as a rounded rim. */
const coin = (y: number) => `M6 ${y}h12l2 2-2 2H6l-2-2z`

/** 2 colors: stack (primary), top coin (accent). */
export const CoinsIcon = createAnimatedIcon({
  name: "coins",
  category: "finance",
  keywords: ["money", "savings", "cash", "change", "stack", "currency", "earnings", "deposit"],
  slots: { primary: "stack", accent: "top coin" },
  defaultVariant: "drop",
  variants: {
    // the top coin fades away, drops back onto the stack from above, and the stack gives under it
    drop: {
      clip: true,
      duration: 850,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=coin]",
            { y: [0, 0, -7, 0, 0] },
            { duration: seconds, times: [0, 0.2, 0.25, 0.65, 1], ease: ["linear", "linear", ease.in, "linear"] },
          ),
          animate(
            "[data-part=coin]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.2, 0.25, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=stack]",
            { y: [0, 0, 1, 0] },
            { duration: seconds, times: [0, 0.65, 0.78, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the top coin is flicked up, turns over in the air and lands back on the stack
    flip: {
      clip: false,
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=coin]",
          { y: [0, -5, 0, 0], scaleY: [1, -1, 1, 1] },
          { duration: seconds, times: [0, 0.45, 0.85, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <path data-part="stack" d={`${coin(14)}${coin(18)}`} />
      {/* its bottom edge lies on the stack's top edge at rest */}
      <path data-part="coin" d={coin(10)} stroke={slot.accent} style={pivot("50% 50%")} />
    </>
  ),
})
