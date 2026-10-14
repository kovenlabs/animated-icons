"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    haze: "drift" | "shimmer" | "rise"
  }
}

/** The horizon runs along y 13; the sun is the half disc above it, round (12, 13). */
const HORIZON = 13

/** The rays, 8 to 10 out from the sun's centre: up and the two upper diagonals. */
const RAYS = [-90, -45, -135].map((deg) => {
  const [cos, sin] = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)]
  const at = (r: number) => `${+(12 + r * cos).toFixed(3)} ${+(HORIZON + r * sin).toFixed(3)}`
  return `M${at(8)}L${at(10)}`
})

/**
 * The rays' box runs from the up ray's tip (y 3) down to the diagonals' inner ends (y 13 - 8·√½); this
 * is the sun's centre on the horizon, below that box, so the rays grow out from it.
 */
const RAYS_ORIGIN = `50% ${((10 / (10 - 8 * Math.SQRT1_2)) * 100).toFixed(3)}%`

/** Two banks of haze, each broken where the haze thins: the far bank first, then the near one. */
const BANKS = ["M2 17h7M13 17h9", "M2 21h11M17 21h5"]

/** 2 colors: sun and horizon (primary), haze (accent). */
export const Haze = createAnimatedIcon({
  name: "haze",
  category: "weather",
  keywords: ["haze", "hazy", "mist", "smog", "fog", "weather", "humid", "visibility"],
  slots: { primary: "sun + horizon", accent: "haze" },
  defaultVariant: "drift",
  variants: {
    // the haze drifts across the low sun: the near bank slides a long way and the far one a little the
    // other way, so the two layers part in depth, and the sun pales behind them until they settle
    drift: {
      clip: true,
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=near]",
            { x: [0, 5, -3, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=far]",
            { x: [0, -2.5, 1.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=sun]",
            { opacity: [1, 0.35, 1], scale: [1, 0.9, 1] },
            { duration: seconds, times: [0, 0.45, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // heat shimmer: the sun wavers on the horizon as if seen through hot air, its rays flickering, and
    // the banks ripple one after the other
    shimmer: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=sun]",
            { skewX: [0, 10, -8, 5, 0], scaleY: [1, 0.88, 1.06, 0.95, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=ray]",
            { opacity: [1, 0.2, 1, 0.4, 1] },
            { duration: seconds * 0.8, delay: stagger(seconds * 0.07), ease: "linear" },
          ),
          animate(
            "[data-part=bank]",
            { x: [0, -2, 1.5, -0.5, 0], scaleX: [1, 0.85, 1.04, 0.97, 1] },
            { duration: seconds * 0.75, delay: stagger(seconds * 0.15), ease: "easeInOut" },
          ),
        ]),
    },
    // the sun sinks into the horizon and climbs out of it again, its rays shooting back out as it clears,
    // and the haze thins and fills back in under it
    rise: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=sun]",
            { scale: [1, 0.3, 1.05, 1] },
            { duration: seconds, times: [0, 0.35, 0.75, 1], ease: [ease.in, ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=rays]",
            { scale: [1, 0.6, 0.6, 1], opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.25, 0.45, 0.85], ease: [ease.in, "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=bank]",
            { scaleX: [1, 0.6, 1.05, 1], opacity: [1, 0.4, 1, 1] },
            { duration: seconds * 0.8, delay: stagger(seconds * 0.1, { startDelay: seconds * 0.1 }), ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* the sun's box is centred on x 12 and ends on the horizon, so it scales and skews from (12, 13) */}
      <g data-part="sun" style={pivot("50% 100%")}>
        {/* the sun is round, so it is a true half circle on the horizon */}
        <path d={`M8 ${HORIZON}a4 4 0 0 1 8 0`} />
        <g data-part="rays" style={pivot(RAYS_ORIGIN)}>
          {RAYS.map((d) => (
            <path key={d} data-part="ray" d={d} />
          ))}
        </g>
      </g>
      {/* the horizon either side of the sun, 8 to 10 out like the rays */}
      <path d={`M2 ${HORIZON}h2M20 ${HORIZON}h2`} />
      <g stroke={slot.accent}>
        <g data-part="far">
          <path data-part="bank" d={BANKS[0]} style={pivot("50% 50%")} />
        </g>
        <g data-part="near">
          <path data-part="bank" d={BANKS[1]} style={pivot("50% 50%")} />
        </g>
      </g>
    </>
  ),
})
