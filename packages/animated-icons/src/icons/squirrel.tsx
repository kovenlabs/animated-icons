"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    squirrel: "flick" | "nibble" | "hop"
  }
}

/**
 * Sitting up, facing right: the haunch, a chest under a pointed snout, one pricked ear, and a hunched
 * back that runs down to the base. The tail is drawn against the back line, which closes it.
 */
const BODY = "M9 21h9l-2-4v-3l5-2v-2l-2-3h-2l-1-2-1 2-2 3v4l-4 4z"

/**
 * A big plume that rises from the back, bulges out to the left and hooks over at the top. Both of its
 * ends sit on the back line; it hinges on the base and only swings away from the head.
 */
const TAIL = "M9 18H5l-2-3V8l3-4 4-1 2 2-1 3H8l-1 3 2 3 2 2"

/** An acorn held up to the chest: a flat cap over a pointed nut. */
const ACORN = "M18 16h4v1.5l-2 3-2-3z"

/** 2 colors: body and tail (primary), eye and acorn (accent). */
export const Squirrel = createAnimatedIcon({
  name: "squirrel",
  category: "nature",
  keywords: ["chipmunk", "rodent", "animal", "acorn", "forest", "park", "wildlife", "autumn"],
  slots: { primary: "body + tail", accent: "eye + acorn" },
  defaultVariant: "flick",
  variants: {
    // the tail flicks back and stretches, snaps up, flicks again smaller, and settles; the eye blinks
    // at the snap
    flick: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tail]",
            { rotate: [0, -18, 4, -11, 2, 0], scaleY: [1, 1.1, 0.9, 1.05, 0.98, 1] },
            { duration: seconds, times: [0, 0.2, 0.38, 0.56, 0.76, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=squirrel]",
            { scaleY: [1, 0.96, 1.02, 0.98, 1, 1] },
            { duration: seconds, times: [0, 0.2, 0.38, 0.56, 0.76, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=eye]",
            { scaleY: [1, 1, 0.15, 1, 1] },
            { duration: seconds, times: [0, 0.32, 0.38, 0.46, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // it turns the acorn round in its paws and gnaws: the nut turns over edge-on and back, rocking on each bite,
    // and the whole body jitters with the chewing
    nibble: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=acorn]",
            { scaleX: [1, 1, -1, 1, 1, 1], rotate: [0, -20, 0, 15, -8, 0], y: [0, -1, 0, -1, 0, 0] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=squirrel]",
            { y: [0, 0.6, 0, 0.6, 0, 0.6, 0, 0] },
            { duration: seconds, times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=tail]",
            { rotate: [0, -6, 0, -6, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // it crouches and springs straight up, stretched, with the tail trailing behind; lands on a squash and
    // the tail whips through and settles
    hop: {
      duration: 1200,
      clip: false,
      run: ({ animate, seconds }) => {
        const times = [0, 0.18, 0.42, 0.62, 0.8, 1]
        return Promise.all([
          animate(
            "[data-part=squirrel]",
            {
              y: [0, 0.5, -4, 0, 0, 0],
              scaleY: [1, 0.86, 1.08, 0.86, 1.03, 1],
              scaleX: [1, 1.08, 0.95, 1.1, 0.98, 1],
            },
            { duration: seconds, times, ease: ["easeInOut", ease.out, ease.in, "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=tail]",
            { rotate: [0, 3, -16, 4, -5, 0] },
            { duration: seconds, times: [0, 0.18, 0.46, 0.68, 0.84, 1], ease: "easeInOut" },
          ),
        ])
      },
    },
  },
  render: () => (
    <g data-part="squirrel" style={pivot("50% 100%")}>
      {/* the tail's box is x 3..12, y 3..18: it hinges at (10, 17), low on the back */}
      <path data-part="tail" d={TAIL} style={pivot("78% 93%")} />
      <path d={BODY} />
      <g fill={slot.accent} stroke="none">
        <rect data-part="eye" x="16" y="9" width="2" height="2" style={pivot("50% 50%")} />
        <path data-part="acorn" d={ACORN} style={pivot("50% 45%")} />
      </g>
    </g>
  ),
})
