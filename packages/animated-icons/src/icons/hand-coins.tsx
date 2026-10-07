"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"
import { spin } from "../lib/spin"

declare module "../lib/types" {
  interface IconVariants {
    "hand-coins": "toss" | "spin" | "offer"
  }
}

/** Coins are genuinely round: true circles, 4 clear inside and 2 clear of each other and of the hand. */
const COINS = [
  { part: "coin-0", cx: 6, cy: 5 },
  { part: "coin-1", cx: 16, cy: 7 },
] as const

const TURN = spin(2)

/** 2 colors: hand (primary), coins (accent). */
export const HandCoins = createAnimatedIcon({
  name: "hand-coins",
  family: "hand",
  category: "finance",
  keywords: ["pay", "payment", "donate", "tip", "savings", "salary", "money in hand", "give money"],
  slots: { primary: "hand", accent: "coins" },
  defaultVariant: "toss",
  variants: {
    // the hand dips and flicks: both coins fly up turning over, the left one first, the right one higher;
    // they fall back and the hand gives under them as it catches
    toss: {
      duration: 1200,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=hand]",
            { y: [0, 1, -1.5, 0, 0, 1.2, 0] },
            { duration: seconds, times: [0, 0.12, 0.24, 0.36, 0.76, 0.84, 1], ease: "easeInOut" },
          ),
          ...COINS.map(({ part }, i) =>
            Promise.all([
              animate(
                `[data-part=${part}]`,
                { y: [0, 0, i ? -5 : -3, 0, 0] },
                {
                  duration: seconds,
                  times: [0, 0.2 + i * 0.04, 0.48 + i * 0.03, 0.76, 1],
                  ease: ["linear", "easeOut", "easeIn", "linear"],
                },
              ),
              animate(
                `[data-part=${part}]`,
                { scaleX: [1, 1, 0, -1, 0, 1, 1] },
                {
                  duration: seconds,
                  times: [0, 0.2 + i * 0.04, 0.33, 0.47, 0.6, 0.74, 1],
                  ease: ["linear", "easeIn", "easeOut", "easeIn", "easeOut", "linear"],
                },
              ),
            ]),
          ),
        ]),
    },
    // both coins spin on their edges in the open palm, the near one a beat later
    spin: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all(
          COINS.map(({ part }, i) =>
            animate(
              `[data-part=${part}]`,
              { scaleX: TURN.scaleX },
              { duration: seconds * 0.85, delay: seconds * 0.15 * i, times: TURN.times, ease: TURN.ease },
            ),
          ),
        ),
    },
    // held out toward you: the whole offer swells closer, and each coin pops after it, one by one
    offer: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=offer]",
            { scale: [1, 1.15, 0.97, 1], y: [0, -1, 0, 0] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
          ...COINS.map(({ part }, i) =>
            animate(
              `[data-part=${part}]`,
              { scale: [1, 1, 1.3, 0.9, 1] },
              { duration: seconds, times: [0, 0.25 + i * 0.12, 0.45 + i * 0.12, 0.65 + i * 0.12, 1], ease: "easeInOut" },
            ),
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="offer" style={pivot("0% 100%")}>
      <g data-part="hand">
        {/* the sleeve's cuff */}
        <path d="M2 13v9" />
        {/* the thumb lies along the top of the palm; its tip meets the fingers' upper edge */}
        <path d="M4 14h5l4 3H9" />
        {/* the palm, and the fingers reaching up and right, open */}
        <path d="M4 21h10l8-6-2-2-7 4" />
      </g>
      <g stroke={slot.accent}>
        {COINS.map(({ part, cx, cy }) => (
          <circle key={part} data-part={part} cx={cx} cy={cy} r="3" style={pivot("50% 50%")} />
        ))}
      </g>
    </g>
  ),
})
