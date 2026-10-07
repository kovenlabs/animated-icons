"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "candlestick-chart": "flip" | "tick" | "grow"
  }
}

/**
 * Two candles, each a hollow 4-wide body with a wick above and below, 2 clear of each other and of the
 * axes. The left closes low, the right high.
 */
const CANDLES = [
  { part: "candle-0", x: 9, wick: [5, 17], body: [9, 15] },
  { part: "candle-1", x: 17, wick: [3, 16], body: [5, 13] },
] as const

const sel = (part: string) => `[data-part=${part}]`

/** 2 colors: axes (primary), candles (accent). */
export const CandlestickChart = createAnimatedIcon({
  name: "candlestick-chart",
  category: "charts",
  keywords: ["stocks", "trading", "market", "ohlc", "finance chart", "price chart", "crypto", "investing"],
  slots: { primary: "axes", accent: "candles" },
  defaultVariant: "flip",
  variants: {
    // each candle turns over on its wick like a card, showing a filled body on its back side, holds,
    // and turns back hollow; the right one follows a beat behind
    flip: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all(
          CANDLES.map(({ part }, i) =>
            Promise.all([
              animate(
                sel(part),
                { scaleX: [1, 0, 1, 1, 0, 1] },
                {
                  duration: seconds * 0.85,
                  delay: seconds * 0.15 * i,
                  times: [0, 0.15, 0.3, 0.6, 0.75, 0.9],
                  ease: ["easeIn", "easeOut", "linear", "easeIn", "easeOut"],
                },
              ),
              animate(
                sel(`${part}-fill`),
                { opacity: [0, 0, 1, 1, 0, 0] },
                {
                  duration: seconds * 0.85,
                  delay: seconds * 0.15 * i,
                  times: [0, 0.149, 0.15, 0.749, 0.75, 1],
                  ease: ["linear", snap, "linear", snap, "linear"],
                },
              ),
            ]),
          ),
        ),
    },
    // the market ticks: the candles slide to new prices, past each other's level, and back
    tick: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(sel("candle-0"), { y: [0, -3, 1, 0] }, { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" }),
          animate(sel("candle-1"), { y: [0, 2, -1, 0] }, { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" }),
        ]),
    },
    // the candles drop to their feet together, then grow back one after the other, overshooting
    grow: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          CANDLES.map(({ part }, i) =>
            animate(
              sel(part),
              { scaleY: [1, 0, 0, 1] },
              { duration: seconds, times: [0, 0.15, 0.25 + i * 0.15, 0.65 + i * 0.15], ease: ["easeIn", "linear", ease.overshoot] },
            ),
          ),
        ),
    },
  },
  render: () => (
    <>
      <path d="M3 3v18h18" />
      <g stroke={slot.accent}>
        {CANDLES.map(({ part, x, wick: [top, bottom], body: [open, close] }) => (
          <g key={part} data-part={part} style={pivot("50% 100%")}>
            <path d={`M${x} ${top}V${open}M${x} ${close}V${bottom}`} />
            <rect x={x - 2} y={open} width="4" height={close - open} />
            {/* the body's filled back side, seen only while it is turned over */}
            <rect
              data-part={`${part}-fill`}
              x={x - 2}
              y={open}
              width="4"
              height={close - open}
              fill={slot.accent}
              stroke="none"
              style={flash()}
            />
          </g>
        ))}
      </g>
    </>
  ),
})
