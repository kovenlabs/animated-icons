"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    paintbrush: "dab" | "swish" | "twirl"
  }
}

/** Paint flicked off the bristles on a dab: 2×2 flecks either side of the tip, and where they fly. */
const FLECKS = [
  { x: 2, y: 13, dx: -0.5, dy: -1.5 },
  { x: 9.5, y: 20, dx: 1.5, dy: 0.5 },
] as const

/** The bristles' root, where they meet the ferrule, as a pivot inside their own box. */
const ROOT = "84% 16%"

/** 2 colors: handle and ferrule (primary), bristles and paint (accent). */
export const Paintbrush = createAnimatedIcon({
  name: "paintbrush",
  category: "design",
  keywords: ["paint", "brush", "art", "draw", "color", "artist", "canvas", "decorate"],
  slots: { primary: "handle + ferrule", accent: "bristles + paint" },
  defaultVariant: "dab",
  variants: {
    // pulled back, then jabbed onto the canvas: the wet bristles squash and spring long, flicking paint
    dab: {
      duration: 850,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=brush]",
            { x: [0, 1.5, -1, 0], y: [0, -1.5, 1, 0] },
            { duration: seconds, times: [0, 0.35, 0.5, 1], ease: ["easeOut", ease.in, ease.overshoot] },
          ),
          animate(
            "[data-part=bristles]",
            { scale: [1, 1, 0.72, 1.14, 1] },
            { duration: seconds, times: [0, 0.4, 0.52, 0.72, 1], ease: "easeInOut" },
          ),
          ...FLECKS.map(({ dx, dy }, i) =>
            animate(
              `[data-part=fleck][data-index="${i}"]`,
              { ...blink, x: [0, dx, dx * 2], y: [0, dy, dy * 2] },
              { duration: seconds * 0.45, delay: seconds * 0.48, ease: "easeOut" },
            ),
          ),
        ]),
    },
    // swung like a pendulum through a broad stroke; the loaded bristles drag a beat behind the handle
    swish: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=brush]",
            { rotate: [0, -12, 9, -4, 0] },
            { duration: seconds, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=bristles]",
            { rotate: [0, 0, 10, -8, 3, 0], scaleY: [1, 1.1, 0.92, 1.06, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.4, 0.68, 0.88, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // twirled between the fingers: the brush turns all the way over on its own axis and back
    twirl: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=brush]",
          { scaleX: [1, -1, 1], scaleY: [1, 0.94, 1], y: [0, -1, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g fill={slot.accent} stroke="none">
        {FLECKS.map(({ x, y }, i) => (
          <rect key={x} data-part="fleck" data-index={i} x={x} y={y} width="2" height="2" style={flash()} />
        ))}
      </g>
      <g data-part="brush" style={pivot("50% 50%")}>
        {/* a slim handle running up to the top-right corner */}
        <path d="M15 9l5.5-5.5" />
        {/* the ferrule, a square band clamped across the handle */}
        <path d="M13.5 7.5l3 3-3 3-3-3Z" />
        {/* the loaded bristles: a solid tuft that swells and tapers to a point */}
        <path
          data-part="bristles"
          d="M10.5 10.5 8 12l-4 8 8-4 1.5-2.5Z"
          fill={slot.accent}
          stroke="none"
          style={pivot(ROOT)}
        />
      </g>
    </>
  ),
})
