"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot } from "../lib/motion"
import { cuboid, easeInOut, flipbook, outline, poses } from "../lib/turntable"

declare module "../lib/types" {
  interface IconVariants {
    cuboid: "turn" | "roll" | "push"
  }
}

/**
 * A long box, 18 × 8.5 × 8.5, seen from above with its right end turned towards you. It turns and rolls as
 * a flipbook of poses: half a turn, or a quarter roll about its square cross-section, brings back exactly
 * the resting picture.
 */
const LENGTH = 18
const SECTION = 8.5
const VIEW = { x: 12, y: 12, tilt: 30 }
const SOLID = cuboid(LENGTH, SECTION, SECTION, -SECTION / 2)
const REST = -30

const TURN_YAWS = poses(REST, 10, 18)
const ROLLS = poses(0, 7.5, 12)
const RESTING = outline(SOLID, REST, VIEW)
const TURNING = TURN_YAWS.slice(1).map((yaw) => outline(SOLID, yaw, VIEW))
const ROLLING = ROLLS.slice(1).map((roll) => outline(SOLID, REST, VIEW, roll))

/** Half a turn that swings 8° past and settles back. */
const HALF = flipbook(
  TURN_YAWS,
  (t) => (t < 0.8 ? REST + 188 * easeInOut(t / 0.8) : REST + 188 - 8 * easeInOut((t - 0.8) / 0.2)),
  { period: 180 },
)
/** A quarter roll: a heave over the edge, then a drop onto the next side. */
const QUARTER = flipbook(ROLLS, (t) => 90 * easeInOut(t), { period: 90 })
/** Rolling over its edge lifts the box's axis: up to (√2 − 1) × half the section, at the half roll. */
const LIFT = Array.from({ length: 9 }, (_, i) =>
  Number((-(Math.SQRT2 * Math.cos(((45 - easeInOut(i / 8) * 90) * Math.PI) / 180) - 1) * (SECTION / 2) * 0.87).toFixed(2)),
)

/** 1 color: a long box. */
export const Cuboid = createAnimatedIcon({
  name: "cuboid",
  category: "design",
  keywords: ["3d", "box", "brick", "block", "prism", "rectangular", "solid", "shape"],
  slots: { primary: "box" },
  defaultVariant: "turn",
  variants: {
    // hops and spins half a turn on its centre, the long side swinging round to the back, and lands
    turn: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cuboid]",
            { y: [0, -2.5, 0, 0], scaleY: [1, 1.04, 0.92, 1] },
            { duration: seconds, times: [0, 0.4, 0.78, 1], ease: "easeInOut" },
          ),
          ...HALF.map((opacity, i) =>
            animate(`[data-part=${i === 0 ? "pose" : `turn${i}`}]`, { opacity }, { duration: seconds, ease: "linear" }),
          ),
        ]),
    },
    // tips over its front edge onto the next side, the top rolling towards you; its axis rises and settles
    roll: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=cuboid]", { y: LIFT }, { duration: seconds, ease: "linear" }),
          ...QUARTER.map((opacity, i) =>
            animate(`[data-part=${i === 0 ? "pose" : `roll${i}`}]`, { opacity }, { duration: seconds, ease: "linear" }),
          ),
        ]),
    },
    // slides away into the distance, shrinking and fading, then rushes back past its place and settles
    push: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cuboid]",
          { scale: [1, 0.55, 0.55, 1.15, 1], y: [0, -3, -3, 0.5, 0], opacity: [1, 0.4, 0.4, 1, 1] },
          { duration: seconds, times: [0, 0.38, 0.5, 0.82, 1], ease: ["easeInOut", "linear", "easeIn", "easeOut"] },
        ),
    },
  },
  render: () => (
    <g data-part="cuboid" style={pivot("50% 50%")}>
      <path data-part="pose" d={RESTING} />
      {TURNING.map((d, i) => (
        <path key={`turn${i}`} data-part={`turn${i + 1}`} d={d} style={{ opacity: 0 }} />
      ))}
      {ROLLING.map((d, i) => (
        <path key={`roll${i}`} data-part={`roll${i + 1}`} d={d} style={{ opacity: 0 }} />
      ))}
    </g>
  ),
})
