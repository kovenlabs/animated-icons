"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "tram-front": "arrive" | "curve" | "brake"
  }
}

/** 2 colors: car, pantograph and wheels (primary), headlights and beams (accent). */
export const TramFront = createAnimatedIcon({
  name: "tram-front",
  category: "transport",
  keywords: ["tram", "streetcar", "trolley", "light rail", "metro", "transit", "commute", "public transport"],
  slots: { primary: "car + pantograph", accent: "headlights + beams" },
  defaultVariant: "arrive",
  variants: {
    // rushes at you and past the camera, and the next one is already pulling in from far down the line,
    // headlights blazing as it arrives
    arrive: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tram]",
            { scale: [1, 1.8, 0.3, 1.08, 1], y: [0, 3, -4, 0.5, 0], opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.34, 0.8, 1], ease: [ease.in, "linear", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=light]",
            { scale: [1, 1, 1.5, 1] },
            { duration: seconds, times: [0, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=beam]",
            { opacity: [0, 0, 1, 0] },
            { duration: seconds, times: [0, 0.6, 0.8, 1], ease: "easeOut" },
          ),
        ]),
    },
    // rounds a bend: the front turns away to one side, then the other, the pantograph swaying behind it
    curve: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tram]",
            { scaleX: [1, 0.78, 1, 0.78, 1], skewY: [0, 9, 0, -9, 0], x: [0, -1.5, 0, 1.5, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=pantograph]",
            { rotate: [0, 0, -18, 6, 18, -6, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // brakes hard: the car dips onto its nose and rebounds, the headlights flashing twice
    brake: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tram]",
            { scaleY: [1, 0.86, 1.06, 0.98, 1], scaleX: [1, 1.08, 0.97, 1.01, 1] },
            { duration: seconds * 0.8, times: [0, 0.3, 0.6, 0.8, 1], ease: "easeInOut" },
          ),
          animate("[data-part=light]", { scale: [1, 1.5, 1, 1.5, 1] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=beam]", { opacity: [0, 1, 0, 1, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <g data-part="tram" style={pivot("50% 100%")}>
      <g stroke={slot.accent}>
        <path data-part="beam" d="M3 13.5 2 14.5M3 16.5 2 17.5" style={flash("100% 50%")} />
        <path data-part="beam" d="M21 13.5l1 1M21 16.5l1 1" style={flash("0% 50%")} />
      </g>
      {/* the pantograph rises from the roof to the wire */}
      <path data-part="pantograph" d="M9 2l3 3 3-3" style={pivot("50% 100%")} />
      {/* a square front, the windscreen split down the middle, and two legs onto the rails */}
      <path d="M5 5h14v14H5Z" />
      <path d="M5 11h14M12 5v6" />
      <path d="M8 19l-2 3M16 19l2 3" />
      <g fill={slot.accent} stroke="none">
        <rect data-part="light" x="8" y="14" width="2" height="2" style={pivot("50% 50%")} />
        <rect data-part="light" x="14" y="14" width="2" height="2" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
