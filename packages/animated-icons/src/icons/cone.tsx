"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"
import { marks } from "../lib/turntable"

declare module "../lib/types" {
  interface IconVariants {
    cone: "spin" | "topple" | "bounce"
  }
}

/**
 * A cone standing on its base: apex at (12, 2.5), the base an ellipse 18 wide and 6 deep centred 16 below
 * it. The flanks meet the base where the lines from the apex graze the ellipse, b²/16 above its centre.
 */
const APEX = { x: 12, y: 2.5 }
const BASE = { cy: 18.5, rx: 9, ry: 3 }
const GRAZE = { dx: 8.84, y: 17.94 }

/** The front seam runs from the apex straight down to the front of the base. */
const SEAM = BASE.cy + BASE.ry - APEX.y

/**
 * A seam at `angle` round the cone (0 faces you) runs from the apex to that point of the base: the front
 * seam turned and stretched to reach it, faded out as it rounds the flank.
 */
function seam(angle: number) {
  const a = (angle * Math.PI) / 180
  const dx = BASE.rx * Math.sin(a)
  const dy = BASE.cy - APEX.y + BASE.ry * Math.cos(a)
  return {
    rotate: (-Math.atan2(dx, dy) * 180) / Math.PI,
    scale: Math.hypot(dx, dy) / SEAM,
    opacity: Math.min(1, Math.max(0, (Math.cos(a) - 0.15) / 0.35)),
  }
}

/** Three seams a quarter turn apart; a half turn brings the last one round to the front. */
const SPIN = marks([0, -90, -180], 180, seam)

/** 2 colors: cone (primary), seams (accent). */
export const Cone = createAnimatedIcon({
  name: "cone",
  category: "design",
  keywords: ["3d", "shape", "solid", "geometry", "funnel", "spinning top", "party hat", "traffic cone"],
  slots: { primary: "cone", accent: "seams" },
  defaultVariant: "spin",
  variants: {
    // spins half a turn on its base like a top: the seam sweeps round the flank and out of sight while the
    // next one comes round from the back
    spin: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all(
          SPIN.keyframes.map((keyframes, i) =>
            animate(`[data-part=seam${i}]`, keyframes, { duration: seconds, times: SPIN.times, ease: SPIN.ease }),
          ),
        ),
    },
    // tips over onto the edge of its base, rocks back past upright and settles
    topple: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=tip]",
          { rotate: [0, -24, 7, -3, 0] },
          { duration: seconds, times: [0, 0.35, 0.62, 0.82, 1], ease: ["easeOut", "easeIn", "easeInOut", "easeInOut"] },
        ),
    },
    // crouches, springs up stretched tall, and lands with a wide squash
    bounce: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cone]",
          { y: [0, 0, -4, 0, 0, 0], scaleY: [1, 0.86, 1.12, 1, 0.88, 1], scaleX: [1, 1.08, 0.94, 1, 1.08, 1] },
          { duration: seconds, times: [0, 0.18, 0.45, 0.68, 0.8, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    // topples on the left edge of its base, bounces from the middle of it
    <g data-part="tip" style={pivot("0% 100%")}>
      <g data-part="cone" style={pivot("50% 100%")}>
        {/* the base is round, so its front rim is a true elliptical arc; the back of it is hidden */}
        <path d={`M${APEX.x - GRAZE.dx} ${GRAZE.y}A${BASE.rx} ${BASE.ry} 0 1 0 ${APEX.x + GRAZE.dx} ${GRAZE.y}`} />
        <path d={`M${APEX.x - GRAZE.dx} ${GRAZE.y}L${APEX.x} ${APEX.y}L${APEX.x + GRAZE.dx} ${GRAZE.y}`} />
        <g stroke={slot.accent}>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              data-part={`seam${i}`}
              d={`M${APEX.x} ${APEX.y}V${APEX.y + SEAM}`}
              style={i === 0 ? pivot("50% 0%") : { ...pivot("50% 0%"), opacity: 0 }}
            />
          ))}
        </g>
      </g>
    </g>
  ),
})
