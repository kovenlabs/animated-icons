"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { flipbook, poses, project, type Point3 } from "../lib/turntable"

declare module "../lib/types" {
  interface IconVariants {
    "axis-3d": "swivel" | "draw" | "spring"
  }
}

const fmt = (n: number) => Number(n.toFixed(2))

/**
 * A 3D axes gizmo: y stands straight up from the origin, x and z lie flat, seen from 30° above with the
 * floor turned 45°, so x runs off to the lower right and z to the lower left. Each axis ends in a chevron.
 */
const VIEW = { x: 12, y: 13.5, tilt: 30 }
const FLAT = 9.5
const REST = -45

/** An axis from the origin to `tip`, with a chevron 2.5 long aimed along it. */
function axis([tx, ty]: [number, number]) {
  const [ox, oy] = [VIEW.x, VIEW.y]
  const length = Math.hypot(tx - ox, ty - oy)
  const [bx, by] = [(ox - tx) / length, (oy - ty) / length]
  const arm = (sign: number) => {
    const [c, s] = [Math.SQRT1_2, sign * Math.SQRT1_2]
    return `${fmt(tx + 2.5 * (bx * c - by * s))} ${fmt(ty + 2.5 * (bx * s + by * c))}`
  }
  return `M${ox} ${oy}L${tx} ${ty}M${arm(1)}L${tx} ${ty}L${arm(-1)}`
}

const Y_AXIS = axis([12, 2.5])
const X: Point3 = [FLAT, 0, 0]
const Z: Point3 = [0, 0, FLAT]

/** The floor swivels between 85° and 5° of turn: poses every 5° from one end to the other. */
const YAWS = poses(-85, 5, 17)
const RESTING = YAWS.indexOf(REST)
const POSES = YAWS.map((yaw) => ({ x: axis(project(X, yaw, VIEW)), z: axis(project(Z, yaw, VIEW)) }))

/** The floor swings x round towards you, then z, each swing smaller, and settles. */
const SWIVEL = flipbook(YAWS, (t) => REST + 36 * Math.sin(2 * Math.PI * t) * (1 - 0.35 * t))

/** 3 colors: y axis (primary), x axis (secondary), z axis (accent). */
export const Axis3d = createAnimatedIcon({
  name: "axis-3d",
  category: "design",
  keywords: ["3d", "axes", "gizmo", "coordinates", "xyz", "transform", "move", "dimensions"],
  slots: { primary: "y axis", secondary: "x axis", accent: "z axis" },
  defaultVariant: "swivel",
  variants: {
    // the floor swivels on the upright axis, like a gizmo dragged round: x swings towards you while z
    // swings away, then back the other way, and settles
    swivel: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all(
          SWIVEL.map((opacity, i) => animate(`[data-part=pose${i}]`, { opacity }, { duration: seconds, ease: "linear" })),
        ),
    },
    // the axes draw out of the origin one after another: y, x, then z
    draw: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=axis]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.4, delay: stagger(seconds * 0.2), times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=axis]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.6, delay: stagger(seconds * 0.2), times: [0, 0.18, 0.2, 1], ease: "easeOut" },
          ),
        ]),
    },
    // each axis springs out of the origin in turn, overshooting its length, and settles
    spring: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=axis]",
          { scale: [1, 0.7, 1.15, 0.96, 1] },
          {
            duration: seconds * 0.7,
            delay: stagger(seconds * 0.15),
            times: [0, 0.25, 0.6, 0.8, 1],
            ease: ["easeIn", ease.out, "easeInOut", "easeInOut"],
          },
        ),
    },
  },
  render: () => (
    <>
      <path data-part="axis" d={Y_AXIS} style={pivot("50% 100%")} />
      {POSES.map((pose, i) => (
        <g key={i} data-part={`pose${i}`} style={i === RESTING ? undefined : { opacity: 0 }}>
          {/* the resting pose's axes grow out of the origin: x's box starts there at its top left, z's at its top right */}
          <path data-part={i === RESTING ? "axis" : undefined} d={pose.x} stroke={slot.secondary} style={pivot("0% 0%")} />
          <path data-part={i === RESTING ? "axis" : undefined} d={pose.z} stroke={slot.accent} style={pivot("100% 0%")} />
        </g>
      ))}
    </>
  ),
})
