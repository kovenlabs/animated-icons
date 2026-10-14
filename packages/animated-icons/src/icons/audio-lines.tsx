"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "audio-lines": "equalize" | "wave" | "collapse"
  }
}

/**
 * Five bars 4 apart (2 clear of each other), uneven like a live waveform. `peak` is the most a bar
 * may stretch about its middle before its cap leaves the 2..22 box.
 */
const BARS = [
  { x: 4, top: 9, bottom: 15, peak: 2.2 },
  { x: 8, top: 5, bottom: 19, peak: 1.25 },
  { x: 12, top: 8, bottom: 16, peak: 2 },
  { x: 16, top: 3, bottom: 21, peak: 1.05 },
  { x: 20, top: 9, bottom: 15, peak: 2.2 },
] as const

/** Each bar's level over one equalizer cycle: out of step with its neighbours, every one back at 1. */
const LEVELS = [
  [1, 2.2, 0.6, 1.8, 0.7, 1],
  [1, 0.5, 1.25, 0.6, 1.15, 1],
  [1, 1.9, 0.45, 2, 0.8, 1],
  [1, 0.55, 1.05, 0.4, 0.9, 1],
  [1, 1.5, 2.2, 0.5, 1.6, 1],
]

const bar = (i: number) => `[data-part=bar-${i}]`

/** 2 colors: quiet bars (primary), loudest bar (accent). */
export const AudioLines = createAnimatedIcon({
  name: "audio-lines",
  category: "media",
  keywords: ["audio", "waveform", "sound", "equalizer", "voice", "music", "levels", "spectrum"],
  slots: { primary: "bars", accent: "loudest bar" },
  defaultVariant: "equalize",
  variants: {
    // a live equalizer: every bar jumps to its own beat, out of step with its neighbours
    equalize: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all(LEVELS.map((scaleY, i) => animate(bar(i), { scaleY }, { duration: seconds, ease: "easeInOut" }))),
    },
    // a crest rolls left to right: each bar swells toward you (taller and thicker) as it passes, then dips
    wave: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all(
          BARS.map(({ peak }, i) =>
            animate(
              bar(i),
              { scaleY: [1, peak, 0.45, 1], scaleX: [1, 1.3, 0.9, 1], opacity: [1, 1, 0.55, 1] },
              { duration: seconds * 0.6, delay: i * seconds * 0.1, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
            ),
          ),
        ),
    },
    // the bars squash flat from the middle outward, then spring back past their height and settle
    collapse: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all(
          BARS.map(({ peak }, i) =>
            animate(
              bar(i),
              { scaleY: [1, 0.15, Math.min(peak, 1.5), 0.85, 1], scaleX: [1, 1.25, 0.85, 1.05, 1] },
              {
                duration: seconds * 0.8,
                delay: stagger(seconds * 0.08, { from: "center" })(i, BARS.length),
                times: [0, 0.3, 0.6, 0.8, 1],
                ease: [ease.in, ease.out, "easeInOut", "easeInOut"],
              },
            ),
          ),
        ),
    },
  },
  render: () => (
    <>
      {BARS.map(({ x, top, bottom }, i) => (
        <path
          key={x}
          data-part={`bar-${i}`}
          d={`M${x} ${top}V${bottom}`}
          stroke={i === 3 ? slot.accent : undefined}
          style={pivot("50% 50%")}
        />
      ))}
    </>
  ),
})
