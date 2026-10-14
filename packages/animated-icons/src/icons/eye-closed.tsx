"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "eye-closed": "flutter" | "squeeze" | "drowse"
  }
}

/**
 * Each lash, rooted on the lid, with the corner of its box it hinges on and the way it flicks (the left
 * pair flick clockwise, the right pair counter-clockwise, so all four lift away from the lid). The
 * inner pair, rooted on the flat of the lid, swing half as far so they never fold back onto it.
 */
const LASHES = [
  { part: "lash-0", d: "M5.5 10.5 3.5 13", origin: "100% 0%", flick: 1 },
  { part: "lash-1", d: "M9.5 13l-1 3", origin: "100% 0%", flick: 0.5 },
  { part: "lash-2", d: "M14.5 13l1 3", origin: "0% 0%", flick: -0.5 },
  { part: "lash-3", d: "M18.5 10.5l2 2.5", origin: "0% 0%", flick: -1 },
] as const

/** 2 colors: lid (primary), lashes (accent). */
export const EyeClosed = createAnimatedIcon({
  name: "eye-closed",
  family: "eye",
  category: "security",
  keywords: ["hidden", "hide password", "sleep", "private", "invisible", "conceal", "visibility off"],
  slots: { primary: "lid", accent: "lashes" },
  defaultVariant: "flutter",
  variants: {
    // the lashes flick up one after another, twice, as the lid crimps under them
    flutter: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...LASHES.map(({ part, flick }, i) =>
            animate(
              `[data-part=${part}]`,
              { rotate: [0, 32 * flick, -6 * flick, 24 * flick, 0] },
              { duration: seconds * 0.8, delay: seconds * 0.05 * i, ease: "easeInOut" },
            ),
          ),
          animate(
            "[data-part=eye]",
            { scaleY: [1, 0.8, 1.08, 0.86, 1] },
            { duration: seconds * 0.9, ease: "easeInOut" },
          ),
        ]),
    },
    // screwed shut: the lid pinches narrow and deep, the lashes clamp down, then it lets go with a bounce
    squeeze: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=eye]",
            { scaleX: [1, 0.78, 0.78, 1.06, 1], scaleY: [1, 1.4, 1.4, 0.85, 1] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.75, 1], ease: ["easeOut", "linear", ease.out, "easeInOut"] },
          ),
          ...LASHES.map(({ part, flick }) =>
            animate(
              `[data-part=${part}]`,
              { rotate: [0, -18 * flick, -18 * flick, 10 * flick, 0] },
              { duration: seconds, times: [0, 0.3, 0.55, 0.75, 1], ease: "easeInOut" },
            ),
          ),
        ]),
    },
    // nods off: the eye sinks and tips, then jolts awake and the lashes spring
    drowse: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=eye]",
            {
              y: [0, 2, 2.5, -1.5, 0],
              rotate: [0, -8, -10, 3, 0],
              scale: [1, 0.96, 0.96, 1.1, 1],
            },
            { duration: seconds, times: [0, 0.45, 0.6, 0.75, 1], ease: ["easeInOut", "linear", ease.in, "easeOut"] },
          ),
          ...LASHES.map(({ part, flick }) =>
            animate(
              `[data-part=${part}]`,
              { rotate: [0, 0, 30 * flick, 0] },
              { duration: seconds, times: [0, 0.62, 0.78, 1], ease: "easeOut" },
            ),
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="eye" style={pivot("50% 0%")}>
      {/* the lower lid of a shut eye: a flat-bottomed sag between two pointed corners */}
      <path d="M3 8l5 5h8l5-5" />
      <g stroke={slot.accent}>
        {LASHES.map(({ part, d, origin }) => (
          <path key={part} data-part={part} d={d} style={pivot(origin)} />
        ))}
      </g>
    </g>
  ),
})
