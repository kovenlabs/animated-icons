"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    skateboard: "ollie" | "kickflip" | "roll"
  }
}

/** Wheel centres, under the two trucks. */
const WHEELS = [7, 17] as const

/** 2 colors: deck and trucks (primary), wheels (accent). */
export const Skateboard = createAnimatedIcon({
  name: "skateboard",
  category: "transport",
  keywords: ["skate", "skating", "board", "ollie", "trick", "street", "sport", "hobby"],
  slots: { primary: "deck + trucks", accent: "wheels" },
  defaultVariant: "ollie",
  variants: {
    // an ollie: the tail snaps down, the board springs up and levels out, then lands and compresses
    ollie: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=board]",
            { y: [0, 0, -3, -4, -2, 0, 0], scaleY: [1, 1, 1, 1, 1, 0.82, 1], scaleX: [1, 1, 1, 1, 1, 1.05, 1] },
            { duration: seconds, times: [0, 0.15, 0.35, 0.5, 0.65, 0.78, 1], ease: ["easeOut", "easeOut", "easeInOut", "easeIn", "easeIn", ease.overshoot] },
          ),
          animate(
            "[data-part=deck]",
            { rotate: [0, -12, -4, 3, 0, 0] },
            { duration: seconds, times: [0, 0.15, 0.35, 0.5, 0.65, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // a kickflip: popped into the air, the board spins a full turn on its long axis, wheels over the
    // top and back, and lands
    kickflip: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=board]",
            { y: [0, -3, -3, 0, 0], scaleX: [1, 0.95, 0.95, 1.06, 1] },
            { duration: seconds, times: [0, 0.25, 0.65, 0.8, 1], ease: ["easeOut", "linear", "easeIn", ease.overshoot] },
          ),
          animate(
            "[data-part=deck]",
            { scaleY: [1, 1, -1, 1, 1], rotate: [0, -6, 0, 6, 0] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // rolls off to the right leaning into its speed and comes back in from the left, bumping as it lands
    roll: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=board]",
          {
            x: [0, -1.5, 12, -12, 0, 0],
            skewX: [0, 6, -14, -14, 6, 0],
            opacity: [1, 1, 0, 0, 1, 1],
          },
          {
            duration: seconds,
            times: [0, 0.15, 0.45, 0.47, 0.8, 1],
            ease: ["easeOut", ease.in, "linear", "easeOut", ease.overshoot],
          },
        ),
    },
  },
  render: () => (
    <g data-part="board" style={pivot("50% 100%")}>
      <g data-part="deck" style={pivot("50% 50%")}>
        {/* a flat deck with both ends kicked up */}
        <path d="M3.5 7l2 3h13l2-3" />
        {/* the trucks, dropping from the deck to the wheels */}
        {WHEELS.map((x) => (
          <path key={x} d={`M${x} 10v3`} />
        ))}
        <g stroke={slot.accent}>
          {WHEELS.map((x) => (
            <circle key={x} cx={x} cy="15" r="2" />
          ))}
        </g>
      </g>
    </g>
  ),
})
