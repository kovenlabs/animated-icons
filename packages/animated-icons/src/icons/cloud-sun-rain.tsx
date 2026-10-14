"use client"

import { useId } from "react"
import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { useShapedDrawing } from "../lib/shape"

declare module "../lib/types" {
  interface IconVariants {
    "cloud-sun-rain": "shower" | "clear" | "squall"
  }
}

/**
 * The cloud of the cloud family, drawn smaller and lower left so the sun can stand behind it, open
 * along its base for the rain.
 */
const CLOUD = "M5 19l-3-3v-1.5l2-2h1l1.5-2.5 2-1.5h2l2 1.5 1.5 2.5h1l2 2v1.5l-3 3"

/** The sun, upper right, and the three short rays that clear the cloud: up, up-right and right. */
const SUN = { x: 14, y: 10, r: 3 }
const RAYS = [-90, -45, 0].map((deg) => {
  const [cos, sin] = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)]
  const at = (r: number) => `${+(SUN.x + r * cos).toFixed(3)} ${+(SUN.y + r * sin).toFixed(3)}`
  return `M${at(7)}L${at(8)}`
})

/** The rays' box runs from the up ray (x 14) to the right ray's tip (x 22), and from y 2 down to the right ray (y 10). */
const RAYS_ORIGIN = "0% 100%"

/**
 * The whole sun's box (disc and rays): x 11 to 22, y 2 to 13. Its origin sits at the disc's centre,
 * so it shrinks and swells round the disc.
 */
const SUN_ORIGIN = `${(((SUN.x - 11) / 11) * 100).toFixed(3)}% ${(((SUN.y - 2) / 11) * 100).toFixed(3)}%`

/** Three drops, listed in the order they fall: one under the cloud, two inside its open base. */
const DROPS = [
  { x: 9.5, y: 20.5 },
  { x: 8, y: 14.5 },
  { x: 11, y: 14.5 },
]

/** 2 colors: cloud (primary), sun and rain (accent). */
function Drawing() {
  const behind = `cloud-sun-rain-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      {/* the sun hides behind the cloud, 2px clear of its outline; the mask's cloud moves with the cloud */}
      <mask id={behind} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
        <path data-part="cloud" d={`${CLOUD}z`} fill="#000" stroke="#000" strokeWidth={6} style={pivot("50% 100%")} />
      </mask>
      <g mask={`url(#${behind})`}>
        <g data-part="sun" stroke={slot.accent} style={pivot(SUN_ORIGIN)}>
          {/* the sun is round, so its disc is a true circle */}
          <circle data-part="disc" cx={SUN.x} cy={SUN.y} r={SUN.r} style={pivot("50% 50%")} />
          <g data-part="rays" style={pivot(RAYS_ORIGIN)}>
            {RAYS.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </g>
      </g>
      <path data-part="cloud" d={CLOUD} style={pivot("50% 100%")} />
      <g stroke={slot.accent}>
        {DROPS.map(({ x, y }) => (
          <path key={`${x}-${y}`} data-part="drop" d={`M${x} ${y}v${y > 20 ? 1.5 : 2}`} style={pivot("50% 0%")} />
        ))}
      </g>
    </>,
  )
}

export const CloudSunRain = createAnimatedIcon({
  name: "cloud-sun-rain",
  family: "cloud",
  category: "weather",
  keywords: ["sun shower", "showers", "partly cloudy", "rain", "weather", "forecast", "drizzle", "spring"],
  slots: { primary: "cloud", accent: "sun + rain" },
  defaultVariant: "shower",
  variants: {
    // a sun shower: the drops stretch as they fall out through the bottom and fresh ones swell back in
    // place, the cloud pumps them out, and the sun bobs behind it
    shower: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=drop]",
            { y: [0, 4, 0, 0], scaleY: [1, 1.6, 0.3, 1], opacity: [1, 0, 0, 1] },
            {
              duration: seconds * 0.65,
              times: [0, 0.5, 0.55, 1],
              delay: stagger(seconds * 0.12),
              ease: [ease.in, "linear", ease.overshoot],
            },
          ),
          animate(
            "[data-part=cloud]",
            { scaleY: [1, 0.9, 1.05, 0.96, 1], scaleX: [1, 1.04, 0.98, 1.01, 1] },
            { duration: seconds * 0.8, ease: "easeInOut" },
          ),
          animate(
            "[data-part=sun]",
            { y: [0, 1.5, -0.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the sun breaks through: the rain dries up, the near cloud slides off to the left uncovering the
    // sun, which swells with its rays wheeling a quarter turn, then the cloud drifts back and it rains again
    clear: {
      clip: true,
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=drop]",
            { scale: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.2, 0.82, 1], ease: [ease.in, "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=cloud]",
            { x: [0, -3, -3, 0] },
            { duration: seconds, times: [0, 0.4, 0.6, 0.85], ease: "easeInOut" },
          ),
          animate(
            "[data-part=disc]",
            { scale: [1, 1.2, 1.2, 1] },
            { duration: seconds, times: [0, 0.4, 0.6, 0.85], ease: "easeInOut" },
          ),
          animate(
            "[data-part=rays]",
            { rotate: [0, 90, 90, 0] },
            { duration: seconds, times: [0, 0.45, 0.6, 0.9], ease: [ease.out, "linear", "easeInOut"] },
          ),
        ]),
    },
    // a squall blows in: the cloud squashes and springs twice, flinging the drops long, while the sun
    // shrinks away into the distance and comes back forward when it passes
    squall: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cloud]",
            { scaleX: [1, 1.08, 0.94, 1.05, 0.98, 1], scaleY: [1, 0.86, 1.08, 0.9, 1.03, 1] },
            { duration: seconds * 0.85, ease: "easeInOut" },
          ),
          animate(
            "[data-part=drop]",
            { scaleY: [1, 1.4, 0.8, 1.3, 1] },
            { duration: seconds * 0.8, delay: stagger(seconds * 0.05), ease: "easeInOut" },
          ),
          animate(
            "[data-part=sun]",
            { scale: [1, 0.6, 0.6, 1.08, 1], opacity: [1, 0.45, 0.45, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.6, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => <Drawing />,
})
