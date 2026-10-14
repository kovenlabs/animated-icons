"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    bubbles: "wobble" | "pop" | "blow"
  }
}

/** Droplets the big bubble bursts into: top-left corner of each 2px drop, and the way it flies. */
const DROPS = [
  { x: 10.5, y: 5.5, dx: 0.5, dy: -2 },
  { x: 17, y: 14, dx: 1.5, dy: 0 },
  { x: 16, y: 18.5, dx: 1.3, dy: 0.75 },
]

/** 2 colors: bubbles (primary), shine and droplets (accent). */
export const Bubbles = createAnimatedIcon({
  name: "bubbles",
  category: "nature",
  keywords: ["bubble", "soap", "foam", "fizz", "water", "bath", "clean", "float"],
  slots: { primary: "bubbles", accent: "shine + droplets" },
  defaultVariant: "wobble",
  variants: {
    // each bubble wobbles like jelly in turn, and the shine slides round the big one as if it rolled
    wobble: {
      duration: 1200,
      run: ({ animate, seconds }) => {
        const jelly = { scaleX: [1, 1.12, 0.9, 1.05, 1], scaleY: [1, 0.88, 1.1, 0.96, 1] }
        const options = { duration: seconds * 0.7, ease: "easeInOut" } as const
        return Promise.all([
          animate("[data-part=small]", jelly, options),
          animate("[data-part=mid]", jelly, { ...options, delay: seconds * 0.12 }),
          animate("[data-part=big]", jelly, { ...options, delay: seconds * 0.24 }),
          animate(
            "[data-part=shine]",
            { rotate: [0, -50, 30, -10, 0] },
            { duration: seconds * 0.7, delay: seconds * 0.3, ease: "easeInOut" },
          ),
        ])
      },
    },
    // the big bubble swells, bursts into droplets, the others flinch, and a fresh one blows back in
    pop: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=big]",
            { scale: [1, 1.14, 0.3, 0.3, 1.08, 1], opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.25, 0.32, 0.55, 0.8, 1], ease: ["easeOut", ease.in, "linear", ease.out, "easeInOut"] },
          ),
          ...DROPS.map(({ dx, dy }, i) =>
            animate(
              `[data-part=drop-${i}]`,
              { opacity: [0, 1, 0], x: [0, dx, dx * 1.4], y: [0, dy, dy * 1.4], scale: [0.6, 1, 0.5] },
              { duration: seconds * 0.4, delay: seconds * 0.27, ease: "easeOut" },
            ),
          ),
          animate(
            "[data-part=mid]",
            { scale: [1, 0.8, 1.08, 1] },
            { duration: seconds * 0.4, delay: seconds * 0.28, ease: "easeOut" },
          ),
          animate(
            "[data-part=small]",
            { scale: [1, 0.75, 1.12, 1] },
            { duration: seconds * 0.4, delay: seconds * 0.32, ease: "easeOut" },
          ),
        ]),
    },
    // blown one after another: each bubble swells out of nothing, overshoots and wobbles round, then the shine glints on
    blow: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...(
            [
              ["small", 0.02],
              ["mid", 0.12],
              ["big", 0.26],
            ] as const
          ).map(([part, start]) =>
            animate(
              `[data-part=${part}]`,
              { scaleX: [0, 0, 1.14, 0.93, 1.03, 1, 1], scaleY: [0, 0, 0.9, 1.08, 0.98, 1, 1] },
              {
                duration: seconds,
                times: [0, start, start + 0.2, start + 0.32, start + 0.42, start + 0.5, 1],
                ease: "easeOut",
              },
            ),
          ),
          animate(
            "[data-part=shine]",
            { opacity: [0, 0, 1, 1], pathLength: [0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.72, 0.9, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="big" style={pivot("50% 50%")}>
        <circle cx="9" cy="15" r="6" />
        {/* a quarter-round glint inside the big bubble, on its own centre */}
        <path data-part="shine" d="M7 15a2 2 0 0 1 2-2" stroke={slot.accent} style={pivot("100% 100%")} />
      </g>
      <circle data-part="mid" cx="19" cy="7" r="2.5" style={pivot("50% 50%")} />
      <circle data-part="small" cx="5" cy="4" r="1.5" style={pivot("50% 50%")} />
      {DROPS.map(({ x, y }, i) => (
        <rect
          key={`${x}-${y}`}
          data-part={`drop-${i}`}
          x={x}
          y={y}
          width="2"
          height="2"
          fill={slot.accent}
          stroke="none"
          style={flash()}
        />
      ))}
    </>
  ),
})
