"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot } from "../lib/motion"
import { easeInOut, flipbook, outline, poses, type Solid } from "../lib/turntable"

declare module "../lib/types" {
  interface IconVariants {
    pyramid: "turn" | "rise" | "bounce"
  }
}

/**
 * A square pyramid seen from above a base corner: the base is 19 wide on the grid, the apex 16 above it.
 * It turns as a flipbook of poses 7.5° apart; a square base looks the same every quarter turn, so the turn
 * lands back on its resting pose.
 */
const TILT = 25
const HALF = (9.5 * Math.SQRT2) / 2
const HEIGHT = 16 / Math.cos((TILT * Math.PI) / 180)
const SOLID: Solid = {
  vertices: [
    [-HALF, 0, -HALF],
    [HALF, 0, -HALF],
    [HALF, 0, HALF],
    [-HALF, 0, HALF],
    [0, HEIGHT, 0],
  ],
  faces: [
    [0, 1, 2, 3],
    [0, 1, 4],
    [1, 2, 4],
    [2, 3, 4],
    [3, 0, 4],
  ],
}
const VIEW = { x: 12, y: 17.9, tilt: TILT }
const REST = 45
const YAWS = poses(REST, 7.5, 12)
const [RESTING, ...TURNING] = YAWS.map((yaw) => outline(SOLID, yaw, VIEW))

/** A quarter turn that swings 6° past and settles back. */
const QUARTER = flipbook(YAWS, (t) => (t < 0.8 ? REST + 96 * easeInOut(t / 0.8) : REST + 96 - 6 * easeInOut((t - 0.8) / 0.2)), {
  period: 90,
})

/** 1 color: a pyramid. */
export const Pyramid = createAnimatedIcon({
  name: "pyramid",
  category: "design",
  keywords: ["3d", "triangle", "egypt", "giza", "shape", "solid", "geometry", "monument"],
  slots: { primary: "pyramid" },
  defaultVariant: "turn",
  variants: {
    // hops and turns a quarter on the spot, the front edge swinging round to the side, and lands
    turn: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pyramid]",
            { y: [0, -2.5, 0, 0], scaleY: [1, 1.04, 0.92, 1] },
            { duration: seconds, times: [0, 0.4, 0.78, 1], ease: "easeInOut" },
          ),
          ...QUARTER.map((opacity, i) =>
            animate(`[data-part=pose${i}]`, { opacity }, { duration: seconds, ease: "linear" }),
          ),
        ]),
    },
    // sinks flat into the ground and is raised again, overshooting its peak before it settles
    rise: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pyramid]",
          { scaleY: [1, 0.15, 1.2, 0.94, 1] },
          { duration: seconds, times: [0, 0.32, 0.66, 0.84, 1], ease: ["easeIn", "easeOut", "easeInOut", "easeInOut"] },
        ),
    },
    // crouches, springs up stretched tall, and lands with a wide squash
    bounce: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pyramid]",
          { y: [0, 0, -4, 0, 0, 0], scaleY: [1, 0.86, 1.12, 1, 0.88, 1], scaleX: [1, 1.08, 0.94, 1, 1.08, 1] },
          { duration: seconds, times: [0, 0.18, 0.45, 0.68, 0.8, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="pyramid" style={pivot("50% 100%")}>
      <path data-part="pose0" d={RESTING} />
      {TURNING.map((d, i) => (
        <path key={i} data-part={`pose${i + 1}`} d={d} style={{ opacity: 0 }} />
      ))}
    </g>
  ),
})
