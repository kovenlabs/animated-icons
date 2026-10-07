"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "spray-can": "spray" | "shake" | "turn"
  }
}

/**
 * The mist: square dots in a cone opening left from the nozzle. `from` is where each sits relative to
 * the nozzle (it shoots out from there), `drift` where it carries on to as it disperses.
 */
const MIST = [
  { d: "M7 5h2v2H7Z", from: { x: 4, y: 0 }, drift: { x: -1.5, y: 0 } },
  { d: "M3 2h2v2H3Z", from: { x: 8, y: 3 }, drift: { x: -1, y: -0.75 } },
  { d: "M3 8h2v2H3Z", from: { x: 8, y: -3 }, drift: { x: -1, y: 0.75 } },
]

/** 2 colors: can (primary), nozzle and mist (accent). */
export const SprayCan = createAnimatedIcon({
  name: "spray-can",
  category: "design",
  keywords: ["spray paint", "aerosol", "graffiti", "airbrush", "paint", "street art", "spray"],
  slots: { primary: "can", accent: "nozzle + mist" },
  defaultVariant: "spray",
  variants: {
    // the nozzle is pressed down and the can kicks back; the old mist drifts off and fades as a fresh
    // puff shoots out of the nozzle and spreads into the cone
    spray: {
      duration: 1100,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=nozzle]",
            { scaleY: [1, 0.55, 0.55, 1, 1] },
            { duration: seconds, times: [0, 0.12, 0.5, 0.65, 1], ease: ["easeOut", "linear", ease.overshoot, "linear"] },
          ),
          animate(
            "[data-part=can]",
            { rotate: [0, 6, 6, 0, 0] },
            { duration: seconds, times: [0, 0.15, 0.5, 0.8, 1], ease: ["easeOut", "linear", ease.overshoot, "linear"] },
          ),
          ...MIST.map(({ from, drift }, i) =>
            animate(
              `[data-part=mist-${i}]`,
              {
                x: [0, drift.x, from.x, drift.x * 0.4, 0, 0],
                y: [0, drift.y, from.y, drift.y * 0.4, 0, 0],
                scale: [1, 0.6, 0.3, 1.3, 1, 1],
                opacity: [1, 0, 0, 1, 1, 1],
              },
              {
                duration: seconds,
                times: [0, 0.14, 0.15, 0.5 + i * 0.05, 0.72 + i * 0.05, 1],
                ease: ["easeOut", "linear", ease.out, "easeInOut", "linear"],
              },
            ),
          ),
        ]),
    },
    // shaken hard to rattle the ball inside: the mist clears while it swings, then puffs back
    shake: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=can]",
            { rotate: [0, -12, 12, -12, 12, -6, 0], y: [0, -1.5, 0, -1.5, 0, -0.5, 0] },
            { duration: seconds * 0.75, ease: "easeInOut" },
          ),
          ...MIST.map((_, i) =>
            animate(
              `[data-part=mist-${i}]`,
              { opacity: [1, 0, 0, 1, 1], scale: [1, 0.3, 0.3, 1, 1] },
              {
                duration: seconds,
                times: [0, 0.1, 0.72, 0.88 + i * 0.04, 1],
                ease: ["easeIn", "linear", ease.overshoot, "linear"],
              },
            ),
          ),
        ]),
    },
    // hops and turns a full circle about its upright axis, the label slanting the other way halfway
    turn: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=can]",
            { y: [0, -3, 0, 0], scaleY: [1, 1.04, 0.9, 1] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: ["easeOut", ease.in, ease.overshoot] },
          ),
          animate("[data-part=turn]", { scaleX: [1, -1, 1] }, { duration: seconds * 0.75, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <>
      <g fill={slot.accent} stroke="none">
        {MIST.map(({ d }, i) => (
          <path key={d} data-part={`mist-${i}`} d={d} style={pivot("50% 50%")} />
        ))}
      </g>
      {/* swings and turns about the middle of its base */}
      <g data-part="can" style={pivot("50% 100%")}>
        <g data-part="turn" style={pivot("50% 50%")}>
          {/* a can with bevelled shoulders and a slanted label stripe */}
          <path d="M14 8h4l2 2v12h-8V10Z" />
          <path d="M12 17l8-3" />
          {/* the push-button nozzle sits on the can's top, its spout aimed left; it squashes down onto it */}
          <path data-part="nozzle" d="M14 8V4h4v4M14 6h-2" stroke={slot.accent} style={pivot("50% 100%")} />
        </g>
      </g>
    </>
  ),
})
