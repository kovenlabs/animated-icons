"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    volleyball: "spike" | "bounce" | "spin"
  }
}

/** A point turned about the ball's centre (12, 12). */
function turn(x: number, y: number, deg: number) {
  const a = (deg * Math.PI) / 180
  const round = (n: number) => Math.round(n * 100) / 100
  return { x: round(12 + x * Math.cos(a) - y * Math.sin(a)), y: round(12 + x * Math.sin(a) + y * Math.cos(a)) }
}

/**
 * Three seams pinwheeling out of the centre, each a straight run that kinks once and meets the rim:
 * a third of a turn maps them onto themselves, so a spin can snap back to rest unseen.
 */
const SEAM_POINTS = [0, 120, 240].map((deg) => [turn(0, -5.5, deg), turn(-4.2, -9.07, deg)] as const)
const SEAMS = SEAM_POINTS.map(([kink, rim]) => `M12 12L${kink.x} ${kink.y}L${rim.x} ${rim.y}`)

/** The seams' own box is off-centre, so their pivot is placed on the ball's centre explicitly. */
const SEAM_PIVOT = (() => {
  const xs = [12, ...SEAM_POINTS.flatMap(([a, b]) => [a.x, b.x])]
  const ys = [12, ...SEAM_POINTS.flatMap(([a, b]) => [a.y, b.y])]
  const at = (values: number[]) => {
    const min = Math.min(...values)
    return `${(((12 - min) / (Math.max(...values) - min)) * 100).toFixed(2)}%`
  }
  return `${at(xs)} ${at(ys)}`
})()

/** 2 colors: ball (primary), seams (accent). */
export const Volleyball = createAnimatedIcon({
  name: "volleyball",
  category: "gaming",
  keywords: ["ball", "sport", "beach", "game", "spike", "serve", "team", "play"],
  slots: { primary: "ball", accent: "seams" },
  defaultVariant: "spike",
  variants: {
    // struck from the left: the ball flattens against the hit, rockets out to the right spinning, and
    // comes back in from the left to settle
    spike: {
      clip: true,
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ball]",
            { x: [0, 0, 26, -26, 0], scaleX: [1, 0.72, 1.15, 1, 1], scaleY: [1, 1.18, 0.9, 1, 1] },
            { duration: seconds, times: [0, 0.18, 0.45, 0.451, 1], ease: ["easeOut", ease.in, snap, ease.overshoot] },
          ),
          animate(
            "[data-part=seams]",
            { rotate: [0, 0, 360] },
            { duration: seconds, times: [0, 0.18, 1], ease: ["linear", ease.out] },
          ),
        ]),
    },
    // dropped: it rises, falls and squashes flat on the floor, then a smaller rebound, spinning a third
    // of a turn that snaps back unseen
    bounce: {
      clip: true,
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ball]",
            {
              y: [0, -6, 0, -2.5, 0, 0],
              scaleY: [1, 1.08, 0.78, 1.04, 0.9, 1],
              scaleX: [1, 0.94, 1.2, 0.97, 1.07, 1],
            },
            {
              duration: seconds,
              times: [0, 0.3, 0.55, 0.72, 0.86, 1],
              ease: ["easeOut", ease.in, "easeOut", ease.in, ease.overshoot],
            },
          ),
          animate(
            "[data-part=seams]",
            { rotate: [0, 120, 0] },
            { duration: seconds, times: [0, 0.999, 1], ease: [ease.out, snap] },
          ),
        ]),
    },
    // the ball turns on its vertical axis: the seams sweep across its face and around the back
    spin: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=seams]", { scaleX: [1, -1, 1] }, { duration: seconds, ease: ease.inOut }),
          animate(
            "[data-part=ball]",
            { scale: [1, 1.08, 1], rotate: [0, -10, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="ball" style={pivot("50% 100%")}>
      {/* a ball is round, so it gets a true circle */}
      <circle cx="12" cy="12" r="10" />
      <g data-part="seams" stroke={slot.accent} style={pivot(SEAM_PIVOT)}>
        {SEAMS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </g>
  ),
})
