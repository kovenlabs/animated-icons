"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "sun-moon": "toggle" | "spin" | "shine"
  }
}

/**
 * Day and night round one centre, (12, 12). The sun is its upper-right quarter: a true arc of radius
 * 4 (the sun is round) and three rays. The crescent fills the lower left: its bite is the same circle
 * of radius 4, from 205° round to 65°, leaving a 2px gap to the sun at either horn, and its back is a
 * true arc round (8.818, 15.182), 4.5 down and left of the centre.
 */
const MOON = "M8.375 10.31A4 4 0 0 0 13.69 15.625A4.893 4.893 0 1 1 8.375 10.31Z"
const SUN = "M12 8a4 4 0 0 1 4 4"

/** The rays, up, up-right and right, each with the way it points out from the centre. */
const RAYS = [
  { d: "M12 4V2", out: { x: 0, y: -1 } },
  { d: "M17.5 6.5 19 5", out: { x: Math.SQRT1_2, y: -Math.SQRT1_2 } },
  { d: "M20 12h2", out: { x: 1, y: 0 } },
]

/**
 * The centre inside the whole drawing's box (x 3.925 to 22 at the crescent's back and the right ray,
 * y 2 to 20.075 at the top ray and the crescent's foot), so a spin turns round it.
 */
const CENTRE = `${((8.075 / 18.075) * 100).toFixed(3)}% ${((10 / 18.075) * 100).toFixed(3)}%`

/** 2 colors: moon (primary), sun (accent). */
export const SunMoon = createAnimatedIcon({
  name: "sun-moon",
  family: "sun",
  category: "weather",
  keywords: ["theme", "dark mode", "light mode", "day and night", "toggle", "appearance", "auto", "contrast"],
  slots: { primary: "moon", accent: "sun" },
  defaultVariant: "toggle",
  variants: {
    // a theme switch: the sun folds into the centre, the crescent lifts toward you and turns a full
    // circle on its upright axis, then the sun bursts back out with a bounce
    toggle: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=sun]",
            { scale: [1, 0, 0, 1.2, 1], opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.2, 0.6, 0.85, 1], ease: [ease.in, "linear", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=lift]",
            { scale: [1, 1, 1.15, 1.15, 1] },
            { duration: seconds, times: [0, 0.12, 0.3, 0.5, 0.6], ease: "easeInOut" },
          ),
          animate(
            "[data-part=moon]",
            { scaleX: [1, 1, -1, 1] },
            { duration: seconds, times: [0, 0.18, 0.37, 0.56], ease: ["linear", ease.in, ease.out] },
          ),
        ]),
    },
    // day turns into night and back: the whole badge spins once round its centre, overshooting a
    // touch before it settles
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate("[data-part=badge]", { rotate: [0, 360] }, { duration: seconds, ease: ease.overshoot }),
    },
    // the sun shines out: its rays push out one after another as its disc swells, and the crescent
    // shrinks back into the distance, tipping away, until the sun settles
    shine: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...RAYS.map(({ out }, i) =>
            animate(
              `[data-part=ray-${i}]`,
              { x: [0, out.x * 1.5, 0], y: [0, out.y * 1.5, 0] },
              { duration: seconds * 0.6, delay: seconds * 0.1 * i, ease: "easeInOut" },
            ),
          ),
          animate("[data-part=disc]", { scale: [1, 1.18, 1] }, { duration: seconds * 0.8, ease: "easeInOut" }),
          animate(
            "[data-part=lift]",
            { scale: [1, 0.85, 1], rotate: [0, -12, 0] },
            { duration: seconds, times: [0, 0.4, 1], ease: ["easeOut", ease.overshoot] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="badge" style={pivot(CENTRE)}>
      <g data-part="lift" style={pivot("50% 50%")}>
        <path data-part="moon" d={MOON} style={pivot("50% 50%")} />
      </g>
      {/* the sun's box has the centre at its bottom-left corner, so it folds and swells from there */}
      <g data-part="sun" stroke={slot.accent} style={pivot("0% 100%")}>
        <path data-part="disc" d={SUN} style={pivot("0% 100%")} />
        {RAYS.map(({ d }, i) => (
          <path key={d} data-part={`ray-${i}`} d={d} />
        ))}
      </g>
    </g>
  ),
})
