"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    dice: "roll" | "throw" | "shake"
  }
}

/**
 * An isometric cube: a regular hexagon, 10 from its centre to every corner, split into three faces
 * by a Y. A third of a turn about the centre maps the cube, its faces and their pips onto themselves,
 * which is what lets it tumble and snap back to rest unseen.
 */
const CUBE = "M12 2l8.66 5v10L12 22l-8.66-5V7z"
const EDGES = "M3.34 7 12 12l8.66-5M12 12v10"

/** One pip in the middle of each face, drawn in the face's own plane: 3 along each edge, 2 clear of the face's edges. */
const PIPS = [
  "M12 5.5l2.6 1.5L12 8.5 9.4 7z",
  "M15.03 13.75l2.6-1.5v3l-2.6 1.5z",
  "M8.97 13.75l-2.6-1.5v3l2.6 1.5z",
]

/** 2 colors: cube (primary), pips (accent). */
export const Dice = createAnimatedIcon({
  name: "dice",
  category: "gaming",
  keywords: ["die", "roll", "random", "chance", "game", "board game", "luck", "gamble"],
  slots: { primary: "cube", accent: "pips" },
  defaultVariant: "roll",
  variants: {
    // crouches, hops and tumbles a third of a turn in the air, then lands with a squash; the tumble
    // ends in the cube's own pose and snaps back unseen
    roll: {
      duration: 1150,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=dice]",
            { y: [0, 0, -5, 0, 0, 0], scaleY: [1, 0.86, 1.06, 1, 0.86, 1], scaleX: [1, 1.08, 0.96, 1, 1.08, 1] },
            { duration: seconds, times: [0, 0.15, 0.45, 0.72, 0.82, 1], ease: ["easeOut", "easeOut", "easeIn", "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=cube]",
            { rotate: [0, 0, 120, 120, 0] },
            { duration: seconds, times: [0, 0.15, 0.72, 0.999, 1], ease: ["linear", "easeInOut", "linear", snap] },
          ),
        ]),
    },
    // thrown off to the right, tumbling; it rolls back in from the left and settles with a rock
    throw: {
      duration: 1300,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=dice]",
            { x: [0, 24, -24, 0] },
            { duration: seconds, times: [0, 0.4, 0.401, 1], ease: [ease.in, snap, ease.overshoot] },
          ),
          animate(
            "[data-part=cube]",
            { rotate: [0, 120, 240, 360] },
            { duration: seconds, times: [0, 0.4, 0.401, 1], ease: [ease.in, snap, ease.overshoot] },
          ),
        ]),
    },
    // rattled in a cup, then tossed out with a little hop that lands with a squash
    shake: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cube]",
            { rotate: [0, -14, 12, -12, 10, -8, 0, 0] },
            { duration: seconds, times: [0, 0.08, 0.17, 0.26, 0.35, 0.44, 0.55, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=dice]",
            { x: [0, -1.5, 1.5, -1.5, 1.5, -1, 0, 0, 0, 0] },
            { duration: seconds, times: [0, 0.08, 0.17, 0.26, 0.35, 0.44, 0.55, 0.7, 0.85, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=dice]",
            { y: [0, 0, -3, 0, 0], scaleY: [1, 1, 1.04, 0.88, 1], scaleX: [1, 1, 0.97, 1.07, 1] },
            { duration: seconds, times: [0, 0.55, 0.7, 0.84, 1], ease: ["linear", "easeOut", "easeIn", "easeOut"] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="dice" style={pivot("50% 100%")}>
      <g data-part="cube" style={pivot("50% 50%")}>
        <path d={CUBE} />
        <path d={EDGES} />
        <g fill={slot.accent} stroke="none">
          {PIPS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>
    </g>
  ),
})
