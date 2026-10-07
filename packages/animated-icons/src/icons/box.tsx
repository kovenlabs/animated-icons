"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"
import { cuboid, easeInOut, flipbook, outline, poses } from "../lib/turntable"

declare module "../lib/types" {
  interface IconVariants {
    box: "open" | "turn" | "rattle"
  }
}

/**
 * A cube with a lid, seen from above a corner: 16 wide (8√2 a side), the walls 6.5 tall on the grid and the
 * lid's band 4. It turns on a turntable as a flipbook of poses 7.5° apart; a cube looks the same every
 * quarter turn, so the turn lands back on its resting pose.
 */
const SIDE = 8 * Math.SQRT2
const WALLS = 13 / Math.sqrt(3)
const BAND = 8 / Math.sqrt(3)
const VIEW = { x: 12, y: 17.5, tilt: 30 }
const BODY = cuboid(SIDE, WALLS, SIDE, 0, { open: true })
const LID = cuboid(SIDE, BAND, SIDE, WALLS)

const REST = 45
const YAWS = poses(REST, 7.5, 12)
const draw = (yaw: number) => ({ body: outline(BODY, yaw, VIEW), lid: outline(LID, yaw, VIEW) })
const [RESTING, ...TURNING] = YAWS.map(draw)

/** A quarter turn that swings 6° past and settles back. */
const QUARTER = flipbook(YAWS, (t) => (t < 0.8 ? REST + 96 * easeInOut(t / 0.8) : REST + 96 - 6 * easeInOut((t - 0.8) / 0.2)), {
  period: 90,
})

/** One full tumble of the lid, sampled every 45°: its height on screen is the cosine of the turn. */
const TUMBLE = Array.from({ length: 9 }, (_, i) => Number(Math.cos((i * Math.PI) / 4).toFixed(2)))

/** 2 colors: box (primary), lid (accent). */
export const Box = createAnimatedIcon({
  name: "box",
  category: "design",
  keywords: ["cube", "3d", "container", "storage", "package", "crate", "unbox", "object"],
  slots: { primary: "box", accent: "lid" },
  defaultVariant: "open",
  variants: {
    // the box crouches and pops its lid: the lid flies up, tumbles head over heels and lands back on, and
    // the box squashes under it
    open: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=box]",
            { scaleY: [1, 0.9, 1.04, 1, 0.92, 1] },
            { duration: seconds, times: [0, 0.14, 0.26, 0.7, 0.8, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=lid]",
            { y: [0, 0, -4.5, 0, 0] },
            { duration: seconds, times: [0, 0.14, 0.45, 0.76, 1], ease: ["linear", "easeOut", "easeIn", "linear"] },
          ),
          animate(
            "[data-part=lid]",
            { scaleY: [1, ...TUMBLE, 1] },
            { duration: seconds, times: [0, ...TUMBLE.map((_, i) => 0.16 + (0.58 * i) / 8), 1], ease: "linear" },
          ),
        ]),
    },
    // hops, turns a quarter on the spot (each wall slides round to the next corner) and lands with a squash
    turn: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=box]",
            { y: [0, -2.5, 0, 0], scaleY: [1, 1.03, 0.92, 1] },
            { duration: seconds, times: [0, 0.4, 0.78, 1], ease: "easeInOut" },
          ),
          ...QUARTER.map((opacity, i) =>
            animate(`[data-part=pose${i}]`, { opacity }, { duration: seconds, ease: "linear" }),
          ),
        ]),
    },
    // something inside knocks about: the box rocks on its base and the lid chatters
    rattle: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=box]",
            { rotate: [0, -6, 5, -4, 3, -1, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=lid]",
            { y: [0, -2, 0, -2, 0, -1, 0] },
            { duration: seconds, delay: seconds * 0.05, ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="box" style={pivot("50% 100%")}>
      {/* the walls are an open box; the lid sits on it, its band's lower edges right on the walls' rim */}
      <g data-part="pose0">
        <path d={RESTING!.body} />
        <path data-part="lid" d={RESTING!.lid} stroke={slot.accent} style={pivot("50% 50%")} />
      </g>
      {TURNING.map((pose, i) => (
        <g key={i} data-part={`pose${i + 1}`} style={{ opacity: 0 }}>
          <path d={pose.body} />
          <path d={pose.lid} stroke={slot.accent} />
        </g>
      ))}
    </g>
  ),
})
