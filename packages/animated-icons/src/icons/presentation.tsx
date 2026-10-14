"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    presentation: "flip" | "draw" | "next"
  }
}

/** A rising trend line, 2 clear of the board's sides, its rail and its bottom edge. */
const CHART = "M8 12l3-3 2 2 3-4"

/** 2 colors: board and stand (primary), chart (accent). */
export const Presentation = createAnimatedIcon({
  name: "presentation",
  category: "charts",
  keywords: ["slides", "whiteboard", "pitch", "meeting", "deck", "keynote", "projector", "talk"],
  slots: { primary: "board + stand", accent: "chart" },
  defaultVariant: "flip",
  variants: {
    // the screen spins a full turn on its stand, leaning into perspective, the chart riding on its face
    flip: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=screen]",
            { scaleX: [1, -1, 1], skewY: [0, 6, 0, -6, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          // the chart sits proud of the board: it swings wider, a touch of parallax
          animate("[data-part=chart]", { x: [0, -1, 0, 1, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // the chart is wiped, redraws from left to right, then jumps with a little pride
    draw: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          // hidden until it has length: a square cap paints a dot at pathLength 0
          animate(
            "[data-part=chart]",
            { opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.12, 0.2, 0.21, 1] },
          ),
          animate(
            "[data-part=chart]",
            { pathLength: [1, 1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.19, 0.2, 0.7, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=chart]",
            { scale: [1, 1, 1.25, 0.92, 1] },
            { duration: seconds, times: [0, 0.7, 0.82, 0.92, 1], ease: "easeOut" },
          ),
        ]),
    },
    // next slide: the chart spins away into the board, a fresh one zooms in and the board shudders
    next: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=chart]",
            { scale: [1, 0, 0, 1.12, 1], rotate: [0, -90, 0, 0, 0], opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.35, 0.45, 0.8, 1], ease: ["easeIn", "linear", ease.overshoot, "easeOut"] },
          ),
          animate(
            "[data-part=screen]",
            { scaleY: [1, 1, 0.94, 1.02, 1] },
            { duration: seconds, times: [0, 0.45, 0.6, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* the rail the screen hangs from, 1 wider than the board each side */}
      <path d="M3 3h18" />
      {/* the stand: two legs meeting under the board's centre */}
      <path d="M7 21l5-5 5 5" />
      <g data-part="screen" style={pivot("50% 0%")}>
        <path d="M4 3v13h16V3" />
        <path data-part="chart" d={CHART} stroke={slot.accent} style={pivot("50% 50%")} />
      </g>
    </>
  ),
})
