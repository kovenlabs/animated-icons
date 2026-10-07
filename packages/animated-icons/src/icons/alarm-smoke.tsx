"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "alarm-smoke": "alarm" | "drift" | "beep"
  }
}

/** A zigzag wisp of smoke rising from (x, 21). */
const wisp = (x: number) => `M${x} 21l1.5-1.6-1.5-1.6 1.5-1.6`

/**
 * The wisps left to right. The middle one is nearest you, so it sways furthest and largest (parallax);
 * each rises with its own delay.
 */
const SMOKE = [
  { part: "smoke-l", x: 6, sway: 1.2, depth: 0.92, delay: 0.12 },
  { part: "smoke-c", x: 11.25, sway: 2.2, depth: 1.12, delay: 0 },
  { part: "smoke-r", x: 16.5, sway: 1.2, depth: 0.92, delay: 0.22 },
] as const

/** 2 colors: detector (primary), smoke and beeps (accent). */
export const AlarmSmoke = createAnimatedIcon({
  name: "alarm-smoke",
  family: "alarm",
  category: "devices",
  keywords: ["smoke detector", "smoke alarm", "fire alarm", "fire", "safety", "sensor", "detector", "ceiling"],
  slots: { primary: "detector", accent: "smoke + beeps" },
  defaultVariant: "alarm",
  variants: {
    // the smoke rises and thins out, the detector catches it and rattles on the ceiling, beeping twice,
    // and fresh smoke drifts back up into place
    alarm: {
      duration: 1400,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...SMOKE.map(({ part, delay }) =>
            animate(
              `[data-part=${part}]`,
              { y: [0, -2, 3, 3, 0], opacity: [1, 0, 0, 0, 1] },
              {
                duration: seconds * 0.7,
                delay: seconds * delay,
                times: [0, 0.35, 0.36, 0.55, 1],
                ease: ["easeOut", snap, "linear", "easeOut"],
              },
            ),
          ),
          animate(
            "[data-part=detector]",
            { x: [0, 0, -1, 1, -1, 1, -1, 0, 0], rotate: [0, 0, -2, 2, -2, 2, -1, 0, 0] },
            { duration: seconds, times: [0, 0.25, 0.32, 0.39, 0.46, 0.53, 0.6, 0.66, 1], ease: "linear" },
          ),
          animate(
            "[data-part=beep]",
            { opacity: [0, 0, 1, 0, 1, 0, 0], scale: [0.6, 0.6, 1, 1.1, 1, 1.1, 1.1] },
            { duration: seconds, times: [0, 0.25, 0.33, 0.43, 0.51, 0.62, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the smoke curls from side to side with depth: the near middle wisp sways wide and swells while the
    // two behind it sway less, a beat later
    drift: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all(
          SMOKE.map(({ part, sway, depth, delay }) =>
            animate(
              `[data-part=${part}]`,
              { x: [0, sway, -sway, 0], scale: [1, depth, depth, 1], y: [0, -1, -1, 0] },
              { duration: seconds * (1 - delay), delay: seconds * delay, ease: "easeInOut" },
            ),
          ),
        ),
    },
    // the detector lunges down toward you twice as it beeps
    beep: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=detector]",
            { scale: [1, 1.1, 1, 1.1, 1] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.65, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=beep]",
            { opacity: [0, 1, 0, 1, 0], scale: [0.6, 1, 1.1, 1, 1.1] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.65, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="detector" style={pivot("50% 0%")}>
        {/* a ceiling plate with the sensor housing hanging under it */}
        <path d="M2 3h20v5H2z" />
        <path d="M7 8l1 4h8l1-4" />
      </g>
      <g stroke={slot.accent}>
        <path data-part="beep" d="M3.5 11.5l-1 3" style={flash("100% 0%")} />
        <path data-part="beep" d="M20.5 11.5l1 3" style={flash("0% 0%")} />
        {SMOKE.map(({ part, x }) => (
          <path key={part} data-part={part} d={wisp(x)} style={pivot("50% 100%")} />
        ))}
      </g>
    </>
  ),
})
