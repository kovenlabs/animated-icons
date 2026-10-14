"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "wand-sparkles": "cast" | "twinkle" | "twirl"
  }
}

/** The sparkles, each with its offset (0..1 of the cycle) when they act one after another. */
const SPARKLES = [
  { part: "dot", at: 0 },
  { part: "big", at: 0.08 },
  { part: "small", at: 0.16 },
] as const

const ALL = SPARKLES.map(({ part }) => `[data-part=${part}]`).join(", ")

/** 3 colors: stick (primary), tip (secondary), sparkles (accent). */
export const WandSparkles = createAnimatedIcon({
  name: "wand-sparkles",
  family: "wand",
  category: "design",
  keywords: ["magic", "sparkles", "spell", "wizard", "enhance", "auto", "ai", "generate"],
  slots: { primary: "stick", secondary: "tip", accent: "sparkles" },
  defaultVariant: "cast",
  variants: {
    // the sparkles are drawn into the tip, the wand winds back and whips forward, and they burst back out
    cast: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...SPARKLES.map(({ part, at }) =>
            animate(
              `[data-part=${part}]`,
              { scale: [1, 0, 0, 1.25, 1, 1] },
              {
                duration: seconds,
                times: [0, 0.12, 0.55 + at, 0.7 + at, 0.82 + at, 1],
                ease: [ease.in, "linear", ease.out, "easeInOut", "linear"],
              },
            ),
          ),
          animate(
            "[data-part=wand]",
            { rotate: [0, 0, -12, 8, 0, 0] },
            {
              duration: seconds,
              times: [0, 0.12, 0.32, 0.44, 0.55, 1],
              ease: ["linear", "easeOut", ease.in, "easeOut", "linear"],
            },
          ),
          animate(
            "[data-part=tip]",
            { scale: [1, 1, 1, 1.15, 1, 1] },
            { duration: seconds, times: [0, 0.12, 0.32, 0.44, 0.55, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the tip glows twice and each sparkle twinkles in turn: winks small, flares and settles
    twinkle: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...SPARKLES.map(({ part, at }) =>
            animate(
              `[data-part=${part}]`,
              { scale: [1, 1, 0.2, 1.25, 1, 1], opacity: [1, 1, 0.3, 1, 1, 1] },
              {
                duration: seconds,
                times: [0, at * 2.5 + 0.1, at * 2.5 + 0.22, at * 2.5 + 0.36, at * 2.5 + 0.5, 1],
                ease: ["linear", "easeIn", "easeOut", "easeInOut", "linear"],
              },
            ),
          ),
          animate(
            "[data-part=tip]",
            { scale: [1, 1.15, 1, 1.1, 1] },
            { duration: seconds * 0.7, ease: "easeInOut" },
          ),
        ]),
    },
    // the sparkles wink out, the wand spins a full turn while sinking into the distance, and they pop back
    twirl: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            ALL,
            { scale: [1, 0, 0, 1.25, 1] },
            { duration: seconds, times: [0, 0.12, 0.76, 0.88, 1], ease: [ease.in, "linear", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=spin]",
            { rotate: [0, 0, 360, 360, 360], scale: [1, 0.6, 0.6, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.12, 0.66, 0.76, 1],
              ease: ["easeIn", ease.inOut, ease.overshoot, "linear"],
            },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="spin" style={pivot("50% 50%")}>
        {/* a long 45° stick; it swings on its handle, bottom-left */}
        <g data-part="wand" style={pivot("9.4% 90.6%")}>
          <path d="M12.5 8.5 3 18l3 3 9.5-9.5" />
          {/* the tip, set off from the stick by a band; it flares from that band */}
          <path data-part="tip" d="M12.5 8.5 16 5l3 3-3.5 3.5Z" stroke={slot.secondary} style={pivot("23% 77%")} />
        </g>
      </g>
      <g stroke={slot.accent}>
        <path data-part="big" d="M6 3v6M3 6h6" style={pivot("50% 50%")} />
        <path data-part="small" d="M19 14v6M16 17h6" style={pivot("50% 50%")} />
        <rect data-part="dot" x="20" y="2" width="2" height="2" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      </g>
    </>
  ),
})
