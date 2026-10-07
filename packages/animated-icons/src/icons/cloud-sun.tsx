"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot, snap } from "../lib/motion"
import { useShapedDrawing } from "../lib/shape"

declare module "../lib/types" {
  interface IconVariants {
    "cloud-sun": "peek" | "drift" | "shine"
  }
}

/** The cloud of the cloud family, drawn smaller and lower-left so the sun can stand behind it. */
const CLOUD = "M5 21l-3-3v-2l2-2h1l1.5-3 2.5-1.5h2l2.5 1.5 1.5 3h1l2 2v2l-3 3z"

/** The sun's centre, upper right, and the four rays that clear the cloud: right, two diagonals, up. */
const SUN = { x: 15, y: 9, r: 3.5 }
const RAYS = [0, -45, -90, -135].map((deg) => {
  const [cos, sin] = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)]
  const at = (r: number) => `${+(SUN.x + r * cos).toFixed(3)} ${+(SUN.y + r * sin).toFixed(3)}`
  return `M${at(5.5)}L${at(7)}`
})

/**
 * The rays' box runs from the upper-left ray's tip to the right ray's tip, and down to the right ray;
 * this is the sun's centre inside it, so the rays wheel round the disc.
 */
const RAYS_ORIGIN = `${(((SUN.x - (SUN.x - 7 * Math.SQRT1_2)) / (22 - (SUN.x - 7 * Math.SQRT1_2))) * 100).toFixed(3)}% 100%`

/** 2 colors: cloud (primary), sun (accent). */
function Drawing() {
  const behind = `cloud-sun-${useId().replace(/[^\w-]/g, "")}`
  // drawn in its own component (for the mask id), so it shapes its corners from context
  return useShapedDrawing(
    <>
      {/* the sun hides behind the cloud, 2px clear of its outline; the mask's cloud moves with the cloud */}
      <mask id={behind} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
        <rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none" />
        <path data-part="cloud" d={CLOUD} fill="#000" stroke="#000" strokeWidth={6} style={pivot("50% 100%")} />
      </mask>
      <g mask={`url(#${behind})`}>
        <g data-part="sun" stroke={slot.accent} style={pivot("50% 50%")}>
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
    </>,
  )
}

export const CloudSun = createAnimatedIcon({
  name: "cloud-sun",
  family: "cloud",
  category: "weather",
  keywords: ["partly cloudy", "sunny", "weather", "sun", "cloud", "forecast", "clearing", "day"],
  slots: { primary: "cloud", accent: "sun" },
  defaultVariant: "peek",
  variants: {
    // the sun ducks down behind the cloud, then bobs back up over it with its rays wheeling round,
    // and the cloud gives a little as it covers it
    peek: {
      clip: false,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=sun]",
            { x: [0, -3, -3, 0], y: [0, 8, 8, 0] },
            { duration: seconds, times: [0, 0.35, 0.45, 1], ease: [ease.in, "linear", ease.overshoot] },
          ),
          animate(
            "[data-part=rays]",
            // turned back a quarter while out of sight, so they wheel forward into place as it rises
            { rotate: [0, 0, -90, 0] },
            { duration: seconds, times: [0, 0.4, 0.401, 1], ease: ["linear", snap, ease.out] },
          ),
          animate(
            "[data-part=cloud]",
            { scaleY: [1, 1, 0.9, 1.04, 1], scaleX: [1, 1, 1.05, 0.98, 1] },
            { duration: seconds, times: [0, 0.3, 0.42, 0.6, 0.8], ease: "easeInOut" },
          ),
        ]),
    },
    // a sideways look across the sky: the near cloud sweeps a long way and the far sun only a little,
    // so the cloud slides across the sun and back
    drift: {
      clip: true,
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cloud]",
            { x: [0, 3, -2.5, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=sun]",
            { x: [0, 0.8, -0.6, 0] },
            { duration: seconds, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the sun flares: its disc swells and the rays wheel all the way round, ducking behind the cloud
    shine: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=rays]", { rotate: [0, 360] }, { duration: seconds, ease: ease.inOut }),
          animate(
            "[data-part=disc]",
            { scale: [1, 1.25, 0.95, 1] },
            { duration: seconds * 0.8, times: [0, 0.4, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => <Drawing />,
})
