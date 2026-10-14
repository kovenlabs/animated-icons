"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    accessibility: "roll" | "wheelie" | "push"
  }
}

/**
 * The wheel: a true circle round (8, 16), radius 5, broken into two arcs so its turning shows. The
 * gaps sit at the lower right and upper left, clear of the hip that rests on the rim.
 */
const WHEEL = ["M9.71 20.698A5 5 0 0 1 3.302 14.29", "M6.29 11.302A5 5 0 0 1 12.698 17.71"]

/** 2 colors: rider (primary), wheel (accent). */
export const Accessibility = createAnimatedIcon({
  name: "accessibility",
  category: "users",
  keywords: ["wheelchair", "disability", "a11y", "accessible", "handicap", "mobility", "inclusive", "ramp"],
  slots: { primary: "rider", accent: "wheel" },
  defaultVariant: "roll",
  variants: {
    // leans back, then rolls off to the right with the wheel spinning and the rider leaning into it,
    // and rolls back in from the left to brake with a lurch
    roll: {
      clip: true,
      duration: 1400,
      run: ({ animate, seconds }) => {
        const times = [0, 0.15, 0.46, 0.54, 0.85, 1]
        return Promise.all([
          animate(
            "[data-part=chair]",
            { x: [0, -1, 22, -22, 1, 0] },
            { duration: seconds, times, ease: ["easeOut", ease.in, snap, ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=wheel]",
            { rotate: [0, -20, 380, 380, 700, 720] },
            { duration: seconds, times, ease: ["easeOut", ease.in, snap, ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=rider]",
            { rotate: [0, -5, 7, 7, -6, 0] },
            { duration: seconds, times, ease: ["easeOut", "easeIn", snap, "easeOut", ease.overshoot] },
          ),
        ])
      },
    },
    // pops a wheelie: tips back on the wheel, balances there as the wheel rocks, and drops onto the
    // front with a bounce
    wheelie: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=chair]",
            { rotate: [0, -9, -7, -9, 0, 0] },
            { duration: seconds, times: [0, 0.25, 0.45, 0.62, 0.78, 1], ease: [ease.out, "easeInOut", "easeInOut", ease.in, "linear"] },
          ),
          animate(
            "[data-part=wheel]",
            { rotate: [0, -60, -30, -60, 0] },
            { duration: seconds, times: [0, 0.25, 0.45, 0.62, 0.78], ease: "easeInOut" },
          ),
          animate(
            "[data-part=bounce]",
            { scaleY: [1, 1, 0.9, 1.04, 1], scaleX: [1, 1, 1.05, 0.98, 1] },
            { duration: seconds, times: [0, 0.78, 0.85, 0.93, 1], ease: "easeOut" },
          ),
        ]),
    },
    // three hard pushes on the rim: the arm drives forward, the rider rocks into it, and each push
    // turns the wheel a third of a turn
    push: {
      duration: 1400,
      run: ({ animate, seconds }) => {
        const times = [0, 0.15, 0.33, 0.48, 0.66, 0.81, 1]
        return Promise.all([
          animate(
            "[data-part=arm]",
            { rotate: [0, -12, 0, -12, 0, -12, 0] },
            { duration: seconds, times, ease: [ease.in, "easeOut", ease.in, "easeOut", ease.in, "easeOut"] },
          ),
          animate(
            "[data-part=rider]",
            { rotate: [0, 4, 0, 4, 0, 4, 0] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=wheel]",
            { rotate: [0, 0, 120, 120, 240, 240, 360] },
            { duration: seconds, times, ease: "easeOut" },
          ),
        ])
      },
    },
  },
  render: () => (
    <g data-part="bounce" style={pivot("50% 100%")}>
      <g data-part="chair" style={pivot("31.25% 73.68%")}>
        <g data-part="wheel" stroke={slot.accent} style={pivot("50% 50%")}>
          {WHEEL.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        {/* the rider pivots on the hip, where it sits on the rim */}
        <g data-part="rider" style={pivot("53.33% 61.11%")}>
          <rect x="15" y="2" width="3" height="3" fill={slot.primary} stroke="none" />
          {/* the arm, swept back from the shoulder */}
          <path data-part="arm" d="M13 8 7 5 4 8" style={pivot("100% 100%")} />
          {/* shoulder down to the hip, out along the thigh and down the shin */}
          <path d="M13 8l-1 5h7l-1 7" />
        </g>
      </g>
    </g>
  ),
})
