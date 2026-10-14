"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "bus-front": "arrive" | "brake" | "turn"
  }
}

/** 2 colors: body, windscreen, mirrors and tyres (primary), headlights and route sign (accent). */
export const BusFront = createAnimatedIcon({
  name: "bus-front",
  family: "bus",
  category: "transport",
  keywords: ["public transport", "transit", "coach", "bus stop", "commute", "shuttle", "front view"],
  slots: { primary: "body + windscreen + mirrors + tyres", accent: "headlights + route sign" },
  defaultVariant: "arrive",
  variants: {
    // pulls in out of the distance: it grows from a speck high on the road, overshoots and flashes twice
    arrive: {
      clip: false,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bus]",
            { scale: [0.3, 1.04, 0.98, 1], y: [-5, 0, 0, 0], opacity: [0, 1, 1, 1] },
            { duration: seconds * 0.75, times: [0, 0.6, 0.8, 1], ease: [ease.in, "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=lamp]",
            { scale: [1, 1, 1.6, 1, 1.6, 1] },
            { duration: seconds, times: [0, 0.5, 0.62, 0.74, 0.87, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // brakes hard towards you: the body squashes onto its springs, rebounds, and the lights flash
    brake: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bus]",
            { scaleY: [1, 0.86, 1.04, 0.97, 1], scaleX: [1, 1.03, 0.99, 1, 1] },
            { duration: seconds * 0.8, times: [0, 0.3, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
          animate("[data-part=lamp]", { opacity: [1, 0.2, 1, 0.2, 1] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // swings through a bend: the body narrows and shears as it yaws, the sign and tyres sliding the other ways
    turn: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bus]",
            { scaleX: [1, 0.82, 1, 0.82, 1], skewY: [0, 5, 0, -5, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=sign]", { x: [0, -1, 0, 1, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=tyres]", { x: [0, 0.8, 0, -0.8, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <g data-part="bus" style={pivot("50% 100%")}>
      {/* a tall box: windscreen above the band, mirrors ticking out from the top corners */}
      <path d="M5 3h14v16H5ZM5 11h14M5 6 3 7M19 6l2 1" />
      <path data-part="tyres" d="M7 19v2h2.5v-2M14.5 19v2H17v-2" />
      <path data-part="sign" d="M10 7h4" stroke={slot.accent} />
      <g fill={slot.accent} stroke="none">
        <rect data-part="lamp" x="8" y="14" width="2" height="2" style={pivot("50% 50%")} />
        <rect data-part="lamp" x="14" y="14" width="2" height="2" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
