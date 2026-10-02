"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    sun: "spin" | "pulse" | "rise"
  }
}

/** One ray, 8 to 10 out from the centre, turned into place: cardinal rays first, then the diagonals. */
const RAY = "M12 2v2"
const CARDINAL = [0, 90, 180, 270]
const DIAGONAL = [45, 135, 225, 315]

/** 2 colors: disc (primary), rays (accent). */
export const SunIcon = createAnimatedIcon({
  name: "sun",
  category: "weather",
  keywords: ["weather", "sunny", "day", "light", "brightness", "light mode", "summer"],
  slots: { primary: "disc", accent: "rays" },
  defaultVariant: "spin",
  variants: {
    // the rays wheel once round the still disc
    spin: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        animate("[data-part=rays]", { rotate: [0, 360] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the rays push outward in two rings, cardinals first, while the disc draws in a little
    pulse: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cardinal]",
            { scale: [1, 1.1, 1] },
            { duration: seconds * 0.75, ease: "easeInOut" },
          ),
          animate(
            "[data-part=diagonal]",
            { scale: [1, 1.1, 1] },
            { duration: seconds * 0.75, delay: seconds * 0.25, ease: "easeInOut" },
          ),
          animate("[data-part=disc]", { scale: [1, 0.9, 1] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // the sun lifts 2px and settles, its rays flaring as it clears the horizon
    rise: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=sun]",
            { y: [0, -2, 0] },
            { duration: seconds, times: [0, 0.45, 1], ease: ["easeOut", ease.inOut] },
          ),
          animate(
            "[data-part=rays]",
            { scale: [1, 1.1, 1] },
            { duration: seconds * 0.8, delay: seconds * 0.1, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="sun">
      {/* a sun is round, so its disc is a true circle */}
      <circle data-part="disc" cx="12" cy="12" r="4" style={pivot("50% 50%")} />
      <g data-part="rays" stroke={slot.accent} style={pivot("50% 50%")}>
        <g data-part="cardinal" style={pivot("50% 50%")}>
          {CARDINAL.map((angle) => (
            <path key={angle} d={RAY} transform={`rotate(${angle} 12 12)`} />
          ))}
        </g>
        <g data-part="diagonal" style={pivot("50% 50%")}>
          {DIAGONAL.map((angle) => (
            <path key={angle} d={RAY} transform={`rotate(${angle} 12 12)`} />
          ))}
        </g>
      </g>
    </g>
  ),
})
