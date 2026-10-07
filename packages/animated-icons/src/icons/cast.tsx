"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    cast: "cast" | "turn" | "drop"
  }
}

/**
 * Two quarter arcs round the dot in the screen's open corner, inner to outer. Each pivots on its own
 * bottom-left corner, which is the arcs' shared centre, so a scale grows or shrinks its radius.
 */
const ARCS = [
  { part: "arc-1", d: "M3 15a5 5 0 0 1 5 5" },
  { part: "arc-2", d: "M3 11a9 9 0 0 1 9 9" },
] as const

const sel = (part: string) => `[data-part=${part}]`

/** 2 colors: screen (primary), dot and signal arcs (accent). */
export const Cast = createAnimatedIcon({
  name: "cast",
  category: "devices",
  keywords: ["chromecast", "screen mirroring", "stream", "tv", "broadcast", "project", "wireless display"],
  slots: { primary: "screen", accent: "dot + signal arcs" },
  defaultVariant: "cast",
  variants: {
    // the dot fires, the arcs grow out of it one by one with a springy overshoot, and the screen jumps
    // toward you as the picture arrives
    cast: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            sel("dot"),
            { scale: [1, 1.8, 1] },
            { duration: seconds * 0.3, times: [0, 0.4, 1], ease: ["easeOut", "easeInOut"] },
          ),
          ...ARCS.map(({ part }, i) =>
            animate(
              sel(part),
              { opacity: [1, 0.15, 0.15, 1, 1], scale: [1, 0.5, 0.5, 1.15, 1] },
              {
                duration: seconds,
                times: [0, 0.12, 0.2 + i * 0.16, 0.38 + i * 0.16, 0.55 + i * 0.16],
                ease: ["easeIn", "linear", "easeOut", "easeInOut"],
              },
            ),
          ),
          animate(
            sel("screen"),
            { scale: [1, 1, 1.08, 0.97, 1], y: [0, 0, -0.5, 0, 0] },
            { duration: seconds, times: [0, 0.55, 0.72, 0.86, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the whole set turns a full revolution on its vertical axis, swelling toward you edge-on, and
    // drops back down with a bounce
    turn: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            sel("cast"),
            { scaleX: [1, 0, -1, 0, 1] },
            { duration: seconds * 0.7, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate(
            sel("lift"),
            { scale: [1, 1.08, 1, 1], y: [0, -1, 0.5, 0] },
            { duration: seconds, times: [0, 0.35, 0.75, 1], ease: ["easeOut", "easeIn", ease.overshoot] },
          ),
        ]),
    },
    // the signal falls away into the distance, outer arc first, the dot flickers on its own, then the
    // arcs spring back all at once
    drop: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...[...ARCS].reverse().map(({ part }, k) =>
            animate(
              sel(part),
              { opacity: [1, 1, 0, 0, 1, 1], scale: [1, 1, 0.5, 0.5, 1.15, 1] },
              {
                duration: seconds,
                times: [0, 0.04 + k * 0.14, 0.24 + k * 0.14, 0.7, 0.84, 1],
                ease: ["linear", "easeIn", "linear", "easeOut", "easeInOut"],
              },
            ),
          ),
          animate(
            sel("dot"),
            { opacity: [1, 1, 0.2, 1, 0.2, 1, 1], scale: [1, 1, 1, 1, 1, 1.6, 1] },
            { duration: seconds, times: [0, 0.42, 0.48, 0.55, 0.61, 0.76, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="lift" style={pivot("50% 50%")}>
      <g data-part="cast" style={pivot("50% 50%")}>
        {/* the screen leaves its bottom-left corner open for the signal, 2 clear of the outer arc */}
        <path data-part="screen" d="M3 7V4h18v16h-5" style={pivot("50% 50%")} />
        <g stroke={slot.accent}>
          {/* casting waves are round, so they are true arcs */}
          {ARCS.map(({ part, d }) => (
            <path key={part} data-part={part} d={d} style={pivot("0% 100%")} />
          ))}
        </g>
        <rect data-part="dot" x="2" y="19" width="2" height="2" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
