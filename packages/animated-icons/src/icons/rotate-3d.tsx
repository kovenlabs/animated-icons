"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { easeInOut } from "../lib/turntable"

declare module "../lib/types" {
  interface IconVariants {
    "rotate-3d": "spin" | "gyro" | "draw"
  }
}

const rad = (deg: number) => (deg * Math.PI) / 180
const fmt = (n: number) => Number(n.toFixed(2))

/** A tall ring (7 × 20) stands in a flat orbit (20 × 10); both are round, so both are true elliptical arcs. */
const RING = { rx: 3.5, ry: 10 }
const ORBIT = { rx: 10, ry: 5 }
const on = (angle: number): [number, number] => [
  fmt(12 + ORBIT.rx * Math.cos(rad(angle))),
  fmt(12 + ORBIT.ry * Math.sin(rad(angle))),
]
const onRing = (angle: number) => `${fmt(12 + RING.rx * Math.cos(rad(angle)))} ${fmt(12 + RING.ry * Math.sin(rad(angle)))}`

/**
 * The orbit passes in front of the ring's lower half, so the ring breaks for it there: 2 above and below
 * the crossings (y 16.76), between 16° and 42.5° either side of its foot. However far the ring has turned,
 * the orbit's front still crosses it between those heights, so the break never has to move.
 */
const RING_PATH = [
  `M${onRing(42.5)}A${RING.rx} ${RING.ry} 0 0 1 ${onRing(137.5)}`,
  `M${onRing(164)}A${RING.rx} ${RING.ry} 0 1 1 ${onRing(16)}`,
].join("")

/**
 * The orbit runs from its right side round the back, the left and the front (angles on screen, 0 to the
 * right, 90 at the front) and ends 30° short of where it began, at the front right, in a chevron aimed
 * along it: the turn goes from left to right across the front.
 */
const FROM = -25
const TO = 30
const [TIP_X, TIP_Y] = on(TO)
const tangent = (() => {
  const [dx, dy] = [ORBIT.rx * Math.sin(rad(TO)), -ORBIT.ry * Math.cos(rad(TO))]
  const length = Math.hypot(dx, dy)
  return [dx / length, dy / length] as const
})()
const arm = (deg: number) => {
  const [bx, by] = [-tangent[0], -tangent[1]]
  const [c, s] = [Math.cos(rad(deg)), Math.sin(rad(deg))]
  return `${fmt(TIP_X + 3 * (bx * c - by * s))} ${fmt(TIP_Y + 3 * (bx * s + by * c))}`
}
const PATH = `M${on(FROM).join(" ")}A${ORBIT.rx} ${ORBIT.ry} 0 1 0 ${TIP_X} ${TIP_Y}`
const HEAD = `M${arm(45)}L${TIP_X} ${TIP_Y}L${arm(-45)}`

/** One full turn, sampled every 22.5° of an eased turn: a ring's width on screen is the cosine of its turn. */
const TURN = Array.from({ length: 17 }, (_, i) => fmt(Math.cos(2 * Math.PI * easeInOut(i / 16))))

/** 2 colors: ring (primary), orbit arrow (accent). */
export const Rotate3d = createAnimatedIcon({
  name: "rotate-3d",
  family: "rotate",
  category: "design",
  keywords: ["3d rotate", "orbit", "rotation", "gyroscope", "spin", "turn", "360", "transform"],
  slots: { primary: "ring", accent: "orbit arrow" },
  defaultVariant: "spin",
  variants: {
    // the arrow gives a push and the ring turns a full circle on its upright axis: it narrows to an edge,
    // opens out the other way round and comes back
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=ring]", { scaleX: TURN }, { duration: seconds, ease: "linear" }),
          animate(
            "[data-part=head]",
            { x: [0, tangent[0] * 1.5, 0], y: [0, tangent[1] * 1.5, 0] },
            { duration: seconds * 0.35, ease: "easeOut" },
          ),
        ]),
    },
    // a gyroscope: the ring turns on its upright axis while the orbit, half a beat behind, tumbles over
    // on its flat one, flattening to a line and opening out again
    gyro: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=ring]", { scaleX: TURN }, { duration: seconds * 0.75, ease: "linear" }),
          animate(
            "[data-part=orbit]",
            { scaleY: TURN },
            { duration: seconds * 0.75, delay: seconds * 0.25, ease: "linear" },
          ),
        ]),
    },
    // the orbit draws itself round from its tail, the chevron snapping on at the end; the ring turns a full
    // circle as the arrow passes
    draw: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=path]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.3, times: [0, 0.4, 0.5, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=path]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.85, times: [0, 0.14, 0.15, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=head]",
            { opacity: [1, 0, 0, 1], scale: [1, 1, 0.4, 1] },
            { duration: seconds, times: [0, 0.1, 0.85, 1], ease: ["easeOut", "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=ring]",
            { scaleX: [1, 1, -1, 1] },
            { duration: seconds, times: [0, 0.25, 0.6, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <path data-part="ring" d={RING_PATH} style={pivot("50% 50%")} />
      <g data-part="orbit" stroke={slot.accent} style={pivot("50% 50%")}>
        <path data-part="path" d={PATH} />
        <path data-part="head" d={HEAD} style={pivot("100% 50%")} />
      </g>
    </>
  ),
})
