"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    orbit: "revolve" | "tilt" | "flip"
  }
}

/** The planets sit on a ring of radius 9, diagonally opposite; the ring breaks 36° either side of each. */
const PLANETS = [
  { part: "planet-a", cx: 18.364, cy: 5.636, angle: -45 },
  { part: "planet-b", cx: 5.636, cy: 18.364, angle: 135 },
] as const

const STEPS = 24
const sin = (deg: number) => Math.sin((deg * Math.PI) / 180)
/** Cubic ease-in-out, sampled into keyframes so the planets' size can follow their place on the ring. */
const inOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)

/**
 * A full revolution, eased. The lower half of the ring is the near side, so each planet swells as
 * it comes round the bottom and shrinks over the top, relative to where it rests.
 */
function revolution() {
  const turns = Array.from({ length: STEPS + 1 }, (_, i) => 360 * inOut(i / STEPS))
  return {
    ring: { rotate: turns },
    planets: PLANETS.map(({ angle }) => ({ scale: turns.map((t) => 1 + 0.25 * (sin(angle + t) - sin(angle))) })),
  }
}

/** 2 colors: sun + ring (primary), planets (accent). */
export const Orbit = createAnimatedIcon({
  name: "orbit",
  category: "education",
  keywords: ["space", "planet", "solar system", "astronomy", "satellite", "revolve", "galaxy", "science"],
  slots: { primary: "sun + ring", accent: "planets" },
  defaultVariant: "revolve",
  variants: {
    // the planets are carried a full turn round the sun, swelling as they pass the near side
    revolve: {
      duration: 1400,
      run: ({ animate, seconds }) => {
        const { ring, planets } = revolution()
        return Promise.all([
          animate("[data-part=ring]", ring, { duration: seconds, ease: "linear" }),
          ...PLANETS.map(({ part }, i) => animate(`[data-part=${part}]`, planets[i]!, { duration: seconds, ease: "linear" })),
          animate("[data-part=sun]", { scale: [1, 1.15, 1] }, { duration: seconds, ease: "easeInOut" }),
        ])
      },
    },
    // the system tips back into perspective, its ring an ellipse, the planets staying round; the sun
    // sinks back a little as it tips, and it all rocks upright again
    tilt: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=system]",
            { scaleY: [1, 0.62, 0.62, 1], rotate: [0, -14, -14, 0] },
            { duration: seconds, times: [0, 0.35, 0.65, 1], ease: ["easeInOut", "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=planet]",
            { scaleY: [1, 1.6, 1.6, 1] },
            { duration: seconds, times: [0, 0.35, 0.65, 1], ease: ["easeInOut", "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=sun]",
            { scale: [1, 0.8, 0.8, 1] },
            { duration: seconds, times: [0, 0.35, 0.65, 1], ease: ["easeInOut", "linear", ease.overshoot] },
          ),
        ]),
    },
    // the whole system turns a full circle about its upright axis, the ring edge-on twice
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=orbit]",
          { scaleX: [1, 0, -1, 0, 1] },
          { duration: seconds, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
        ),
    },
  },
  render: () => (
    <g data-part="orbit" style={pivot("50% 50%")}>
      {/* everything is round here: true circles and arcs */}
      <circle data-part="sun" cx="12" cy="12" r="3" style={pivot("50% 50%")} />
      <g data-part="system" style={pivot("50% 50%")}>
        <g data-part="ring" style={pivot("50% 50%")}>
          {/* two arcs of the ring, each stopping 2 clear of the planets */}
          <path d="M20.889 10.592A9 9 0 0 1 10.592 20.889M3.111 13.408A9 9 0 0 1 13.408 3.111" />
          <g fill={slot.accent} stroke="none">
            {PLANETS.map(({ part, cx, cy }) => (
              <g key={part} data-part="planet" style={pivot("50% 50%")}>
                <circle data-part={part} cx={cx} cy={cy} r="2.5" style={pivot("50% 50%")} />
              </g>
            ))}
          </g>
        </g>
      </g>
    </g>
  ),
})
