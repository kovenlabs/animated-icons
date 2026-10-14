"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "car-front": "approach" | "swerve" | "hop"
  }
}

/** 2 colors: body, windscreen and tyres (primary), headlights (accent). */
export const CarFront = createAnimatedIcon({
  name: "car-front",
  family: "car",
  category: "transport",
  keywords: ["vehicle", "auto", "front view", "headlights", "taxi", "driving", "road"],
  slots: { primary: "body + windscreen + tyres", accent: "headlights" },
  defaultVariant: "approach",
  variants: {
    // drives at you out of the distance: small and high on the road, it swells past full size and flashes its lights
    approach: {
      clip: false,
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=car]",
            { scale: [0.35, 1.07, 0.97, 1], y: [-5, 0, 0, 0], opacity: [0, 1, 1, 1] },
            { duration: seconds * 0.75, times: [0, 0.6, 0.8, 1], ease: [ease.in, "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=lamp]",
            { scale: [1, 1, 1.6, 1, 1.6, 1] },
            { duration: seconds, times: [0, 0.45, 0.6, 0.72, 0.86, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // swerves left and right: the body narrows and rolls as it yaws, the roof sliding further than the tyres
    swerve: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=car]",
            { scaleX: [1, 0.86, 1, 0.86, 1], skewY: [0, 4, 0, -4, 0], rotate: [0, -3, 0, 3, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=roof]", { x: [0, -1.8, 0, 1.8, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=tyres]", { x: [0, 0.8, 0, -0.8, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // crouches, hops and lands hard on its springs, the headlights blinking at the bump
    hop: {
      duration: 850,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=car]",
            {
              y: [0, 0, -1.2, -2.5, 0, 0, 0],
              scaleY: [1, 0.88, 1.06, 1, 0.86, 1.03, 1],
              scaleX: [1, 1.06, 0.96, 1, 1.07, 0.99, 1],
            },
            { duration: seconds, times: [0, 0.18, 0.3, 0.45, 0.62, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=lamp]",
            { opacity: [1, 1, 0.2, 1] },
            { duration: seconds, times: [0, 0.6, 0.72, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="car" style={pivot("50% 100%")}>
      {/* a raked windscreen standing on a wide body, a short grille between the lights */}
      <path data-part="roof" d="M5.5 10 7.5 4.5h9l2 5.5" />
      <path d="M3 10h18v8H3ZM11 14h2" />
      <path data-part="tyres" d="M4 18v3h3v-3M17 18v3h3v-3" />
      <g fill={slot.accent} stroke="none">
        <rect data-part="lamp" x="6" y="13" width="2" height="2" style={pivot("50% 50%")} />
        <rect data-part="lamp" x="16" y="13" width="2" height="2" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
