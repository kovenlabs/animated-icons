"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    weight: "drop" | "swing" | "twist"
  }
}

/** Dust kicked up either side of the base when it lands. */
const DUST = [
  { x: 2, side: -1 },
  { x: 20, side: 1 },
] as const

/** 2 colors: body (primary), handle and dust (accent). */
export const Weight = createAnimatedIcon({
  name: "weight",
  category: "sports",
  keywords: ["kettlebell", "heavy", "mass", "kilogram", "scale", "gym", "fitness", "load"],
  slots: { primary: "body", accent: "handle + dust" },
  defaultVariant: "drop",
  variants: {
    // tossed up out of the frame, it falls back in stretched by the speed, lands with a heavy squash and
    // kicks up dust either side
    drop: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=toss]",
            { y: [0, 1.5, -20, 0, 0] },
            { duration: seconds, times: [0, 0.15, 0.42, 0.66, 1], ease: ["easeOut", "easeOut", ease.in, "linear"] },
          ),
          animate(
            "[data-part=squash]",
            {
              scaleX: [1, 1.08, 0.9, 0.92, 1.12, 0.97, 1],
              scaleY: [1, 0.88, 1.12, 1.1, 0.8, 1.04, 1],
            },
            { duration: seconds, times: [0, 0.15, 0.3, 0.64, 0.72, 0.86, 1], ease: "easeOut" },
          ),
          ...DUST.map(({ side }) =>
            animate(
              `[data-part=dust-${side < 0 ? "l" : "r"}]`,
              { ...blink, y: [2, 0, -1.5], x: [0, side * 0.5, side * 0.5] },
              { duration: seconds * 0.3, delay: seconds * 0.66, ease: "easeOut" },
            ),
          ),
        ]),
    },
    // hangs from its handle and swings like a pendulum, turning a little edge-on at each end of the
    // arc, the handle twisting ahead of the body
    swing: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=swing]",
            { rotate: [0, 10, -9, 6, -3, 0], scaleX: [1, 0.9, 0.92, 0.95, 0.98, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=handle]",
            { scaleX: [1, 0.5, 0.6, 0.75, 0.9, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // hoisted by the handle, it spins round twice on the cord, the handle turning edge-on and through,
    // then is set down with a thud
    twist: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=handle]",
            { scaleX: [1, 0, -1, 0, 1, 0, -1, 0, 1] },
            { duration: seconds * 0.75, ease: "easeInOut" },
          ),
          animate(
            "[data-part=toss]",
            { y: [0, -2, -2, 0, 0] },
            { duration: seconds, times: [0, 0.15, 0.7, 0.8, 1], ease: ["easeOut", "linear", ease.in, "linear"] },
          ),
          animate(
            "[data-part=squash]",
            { scaleX: [1, 1, 1.08, 0.98, 1], scaleY: [1, 1, 0.86, 1.03, 1] },
            { duration: seconds, times: [0, 0.8, 0.86, 0.94, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g fill={slot.accent} stroke="none">
        {DUST.map(({ x, side }) => (
          <rect key={x} data-part={`dust-${side < 0 ? "l" : "r"}`} x={x} y="13" width="2" height="2" style={flash()} />
        ))}
      </g>
      <g data-part="toss">
        <g data-part="squash" style={pivot("50% 100%")}>
          <g data-part="swing" style={pivot("50% 0%")}>
            {/* the handle, a true ring sitting on the body's flat top */}
            <circle data-part="handle" cx="12" cy="7" r="3" stroke={slot.accent} style={pivot("50% 50%")} />
            {/* a squat trapezoid body, flared at the base */}
            <path d="M8 10h8l3 10H5Z" />
          </g>
        </g>
      </g>
    </>
  ),
})
