"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"
import { useShapedDrawing } from "../lib/shape"

declare module "../lib/types" {
  interface IconVariants {
    sunset: "set" | "descend" | "dim"
  }
}

/**
 * Four rays round the half sun, left to right, each with the way it points out from the sun's centre
 * (12, 18): flat at the sun's base on either side, and the two upper diagonals. Same as `sunrise`.
 */
const RAYS = [
  { d: "M2 18h2", out: { x: -1, y: 0 } },
  { d: "M5 11l1.5 1.5", out: { x: -1, y: -1 } },
  { d: "M19 11l-1.5 1.5", out: { x: 1, y: -1 } },
  { d: "M20 18h2", out: { x: 1, y: 0 } },
]

/** 2 colors: horizon and arrow (primary), sun and rays (accent). */
function Drawing() {
  const above = `sunset-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      {/* everything above the horizon, 2px clear of it: the sun sinks out of sight before the line */}
      <mask id={above} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="23" fill="#fff" stroke="none" />
      </mask>
      <path d="M2 22h20" />
      <g data-part="arrow" style={pivot("50% 100%")}>
        <path d="M12 2v7" />
        <path d="M9 6l3 3 3-3" />
      </g>
      <g stroke={slot.accent} mask={`url(#${above})`}>
        {/* the sun is round, so its upper half is a true arc, standing on the line of the side rays */}
        <path data-part="sun" d="M8 18a4 4 0 0 1 8 0" style={pivot("50% 100%")} />
        <g data-part="rays" style={pivot("50% 100%")}>
          {RAYS.map(({ d }, i) => (
            <path key={d} data-part={`ray-${i}`} d={d} style={pivot("50% 50%")} />
          ))}
        </g>
      </g>
    </>,
  )
}

export const Sunset = createAnimatedIcon({
  name: "sunset",
  category: "weather",
  keywords: ["dusk", "evening", "sundown", "sun", "twilight", "nightfall", "golden hour", "weather"],
  slots: { primary: "horizon + arrow", accent: "sun + rays" },
  defaultVariant: "set",
  variants: {
    // the rays fold away and the sun swells and flattens as it sinks below the horizon, the arrow
    // pressing it down; then a new day's sun pops back up into place and opens its rays
    set: {
      clip: false,
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=sun]",
            {
              y: [0, 7, 0, 0],
              scaleX: [1, 1.2, 0.4, 1],
              scaleY: [1, 0.85, 0.4, 1],
              opacity: [1, 1, 0, 1],
            },
            { duration: seconds * 0.85, times: [0, 0.55, 0.56, 1], ease: [ease.in, snap, ease.overshoot] },
          ),
          animate(
            "[data-part=rays]",
            { scale: [1, 0.5, 0.5, 1.08, 1], opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.25, 0.7, 0.88, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=arrow]",
            { y: [0, 2, 0] },
            { duration: seconds * 0.6, times: [0, 0.6, 1], ease: ["easeInOut", ease.overshoot] },
          ),
        ]),
    },
    // the arrow presses down and fades, and a new one drops in from the top of the frame, stretching
    // as it falls and landing with a squash that bumps the sun
    descend: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=arrow]",
            {
              y: [0, 1.5, -11, 0, 0, 0],
              opacity: [1, 0, 1, 1, 1, 1],
              scaleY: [1, 1, 1.3, 1.1, 0.75, 1],
            },
            {
              duration: seconds,
              times: [0, 0.22, 0.25, 0.52, 0.66, 1],
              // it jumps above the frame in one frame, then drops in through the top edge
              ease: [ease.in, snap, "linear", ease.out, "easeInOut"],
            },
          ),
          animate(
            "[data-part=sun]",
            { y: [0, 0, 1.5, 0], scaleX: [1, 1, 1.1, 1] },
            { duration: seconds, times: [0, 0.52, 0.66, 0.9], ease: "easeOut" },
          ),
        ]),
    },
    // dusk: the rays are drawn into the sun one after another as it squats down wide and low, then
    // spring back out in reverse order as it stands up again
    dim: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...RAYS.map(({ out }, i) =>
            animate(
              `[data-part=ray-${i}]`,
              { x: [0, -out.x * 2, -out.x * 2, 0], y: [0, -out.y * 2, -out.y * 2, 0], scale: [1, 0, 0, 1], opacity: [1, 0, 0, 1] },
              {
                duration: seconds * 0.8,
                times: [0, 0.3, 0.6, 1],
                delay: seconds * 0.05 * i,
                ease: ["easeIn", "linear", ease.overshoot],
              },
            ),
          ),
          animate(
            "[data-part=sun]",
            { scaleX: [1, 1.25, 1.25, 0.95, 1], scaleY: [1, 0.6, 0.6, 1.1, 1] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => <Drawing />,
})
