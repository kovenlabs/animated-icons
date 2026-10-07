"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"
import { marks } from "../lib/turntable"

declare module "../lib/types" {
  interface IconVariants {
    torus: "spin" | "flip" | "wobble"
  }
}

/**
 * A ring seen from above, like a lifebuoy: the rim is an ellipse 20 × 16 and the top of the tube runs in
 * to an inner ellipse 12 × 8. The hole is a lens: the near half of that inner edge (the wide lower arc),
 * closed by the far tube's inner wall (the short upper arc).
 */
const RIM = { rx: 10, ry: 8 }
const HOLE = { rx: 6, ry: 4 }
const rad = (deg: number) => (deg * Math.PI) / 180

/**
 * Bands round the tube, each a radial stroke across its top from the inner edge to the rim. A band at
 * `angle` (0 faces you) sits midway between the two ellipses and points away from the centre; since the
 * tube is 4 across both ways, a band only slides and turns as the ring spins, it never stretches.
 */
const middle = (angle: number) => ({
  x: ((RIM.rx + HOLE.rx) / 2) * Math.sin(rad(angle)),
  y: ((RIM.ry + HOLE.ry) / 2) * Math.cos(rad(angle)),
})
const BANDS = [0, 90, 180, 270]
const SPIN = marks(BANDS, 180, (angle, start) => ({
  x: middle(angle).x - middle(start).x,
  y: middle(angle).y - middle(start).y,
  rotate: start - angle,
}))

/** One full flip, sampled every 45°: the ring's depth on screen is the cosine of the turn. */
const FLIP = Array.from({ length: 9 }, (_, i) => Number(Math.cos((i * Math.PI) / 4).toFixed(2)))

/** 2 colors: ring (primary), bands (accent). */
export const Torus = createAnimatedIcon({
  name: "torus",
  category: "design",
  keywords: ["3d", "donut", "ring", "shape", "solid", "geometry", "lifebuoy", "doughnut"],
  slots: { primary: "ring", accent: "bands" },
  defaultVariant: "spin",
  variants: {
    // the ring turns flat on its axis like a plate on a turntable: its bands ride round the top, through
    // the back and round to the front
    spin: {
      clip: false,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all(
          SPIN.keyframes.map((keyframes, i) =>
            animate(`[data-part=band${i}]`, keyframes, { duration: seconds, times: SPIN.times, ease: SPIN.ease }),
          ),
        ),
    },
    // flipped like a coin: it rises, turns over once through edge-on, and lands flat
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=torus]",
            { y: [0, -3, -3, 0, 0] },
            { duration: seconds, times: [0, 0.3, 0.6, 0.85, 1], ease: ["easeOut", "linear", "easeIn", "linear"] },
          ),
          animate(
            "[data-part=torus]",
            { scaleY: [1, ...FLIP, 0.9, 1] },
            { duration: seconds, times: [0, ...FLIP.map((_, i) => 0.1 + (0.72 * i) / 8), 0.92, 1], ease: "linear" },
          ),
        ]),
    },
    // dropped on its edge, it wobbles flat like a spun coin settling: tipping side to side, faster and lower
    wobble: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=torus]",
          { rotate: [0, -14, 11, -7, 4, -1.5, 0], scaleY: [1, 0.8, 0.86, 0.92, 0.96, 0.99, 1] },
          { duration: seconds, times: [0, 0.2, 0.42, 0.6, 0.75, 0.88, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="torus" style={pivot("50% 50%")}>
      {/* a ring is round, so it is drawn with a true ellipse and elliptical arcs */}
      <ellipse cx="12" cy="12" rx={RIM.rx} ry={RIM.ry} />
      <path d={`M${12 - HOLE.rx} 12A${HOLE.rx} ${HOLE.ry} 0 0 0 ${12 + HOLE.rx} 12`} />
      <path d="M8 14.98A4 2.5 0 0 1 16 14.98" />
      <g stroke={slot.accent}>
        {BANDS.map((angle, i) => {
          const [s, c] = [Math.round(Math.sin(rad(angle))), Math.round(Math.cos(rad(angle)))]
          return (
            <path
              key={angle}
              data-part={`band${i}`}
              d={`M${12 + HOLE.rx * s} ${12 + HOLE.ry * c}L${12 + RIM.rx * s} ${12 + RIM.ry * c}`}
              style={pivot("50% 50%")}
            />
          )
        })}
      </g>
    </g>
  ),
})
