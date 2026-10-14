"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    balloon: "sway" | "pop" | "away"
  }
}

/** Burst lines around the balloon's centre (12, 7.5), from radius 5.5 out to 7.5. */
const BURST = [0, 60, 120, 180, 240, 300].map((deg) => {
  const a = (deg * Math.PI) / 180
  const at = (r: number) => `${(12 + Math.cos(a) * r).toFixed(2)} ${(7.5 + Math.sin(a) * r).toFixed(2)}`
  return { deg, d: `M${at(5.5)}L${at(7.5)}` }
})

/** 2 colors: string (primary), balloon and knot (accent). */
export const Balloon = createAnimatedIcon({
  name: "balloon",
  category: "social",
  keywords: ["party", "birthday", "celebration", "festive", "kids", "float", "helium"],
  slots: { primary: "string", accent: "balloon + knot" },
  defaultVariant: "sway",
  variants: {
    // swings on its string from the hand holding it, the balloon lagging and the string bending
    sway: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=all]",
            { rotate: [0, -10, 8, -5, 2, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=balloon]",
            { rotate: [0, 0, -8, 7, -4, 0], scaleY: [1, 1.04, 0.96, 1.03, 0.99, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=string]",
            { skewX: [0, 14, -12, 8, -3, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // swells, wobbles and bursts; the string drops, and a fresh balloon puffs back up on the knot
    pop: {
      duration: 1400,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=skin]",
            {
              scaleX: [1, 1.08, 1.04, 1.1, 1.35, 1, 1],
              scaleY: [1, 1.04, 1.08, 1.06, 1.35, 1, 1],
              opacity: [1, 1, 1, 1, 0, 0, 1],
            },
            { duration: seconds, times: [0, 0.12, 0.22, 0.32, 0.38, 0.46, 0.47], ease: "easeInOut" },
          ),
          animate(
            "[data-part=balloon]",
            { scale: [1, 1, 0, 1.12, 1] },
            {
              duration: seconds,
              times: [0, 0.45, 0.46, 0.85, 1],
              ease: ["linear", snap, ease.overshoot, "easeInOut"],
            },
          ),
          animate(
            "[data-part=tail]",
            { y: [0, 0, 3, 0, 0], rotate: [0, 0, 12, 0, 0] },
            { duration: seconds, times: [0, 0.36, 0.6, 0.9, 1], ease: ["linear", ease.in, ease.overshoot, "linear"] },
          ),
          animate("[data-part=burst]", blink, { duration: seconds * 0.3, delay: seconds * 0.34, ease: "easeOut" }),
        ]),
    },
    // lets go and floats off the top, then a new one rises in from below
    away: {
      duration: 1400,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=all]",
            { y: [0, 1, -24, 24, 0], rotate: [0, 0, 10, -10, 0] },
            { duration: seconds, times: [0, 0.12, 0.5, 0.501, 1], ease: [ease.out, ease.in, snap, ease.out] },
          ),
          animate(
            "[data-part=string]",
            { skewX: [0, 0, -16, 16, -6, 0] },
            { duration: seconds, times: [0, 0.12, 0.5, 0.501, 0.8, 1], ease: ["linear", "easeIn", snap, "easeOut", "easeInOut"] },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {BURST.map(({ deg, d }) => (
          <path key={deg} data-part="burst" d={d} style={flash()} />
        ))}
      </g>
      <g data-part="all" style={pivot("50% 100%")}>
        <g data-part="tail" style={pivot("50% 0%")}>
          {/* a zigzag string under a triangular knot */}
          <path data-part="string" d="M12 17.5 10.5 20l1.5 2" style={pivot("50% 0%")} />
          <path d="M12 15l-2 2.5h4Z" fill={slot.accent} stroke="none" />
        </g>
        <g data-part="balloon" style={pivot("50% 100%")}>
          {/* a true circle drawn down to a point: tangent flanks meeting at the knot */}
          <path
            data-part="skin"
            d="M12 15 8.27 11.53A5.5 5.5 0 1 1 15.73 11.53Z"
            stroke={slot.accent}
            style={pivot("50% 50%")}
          />
        </g>
      </g>
    </>
  ),
})
