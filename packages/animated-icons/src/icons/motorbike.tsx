"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    motorbike: "ride" | "jump" | "rev"
  }
}

/** 2 colors: frame and wheels (primary), headlight and speed lines (accent). */
export const Motorbike = createAnimatedIcon({
  name: "motorbike",
  category: "transport",
  keywords: ["motorcycle", "chopper", "scooter", "moped", "rider", "delivery", "bike"],
  slots: { primary: "frame + wheels", accent: "headlight + speed lines" },
  defaultVariant: "ride",
  variants: {
    // pops a wheelie, tears off to the right leaving speed lines, and rolls back in from the left
    ride: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bike]",
            { rotate: [0, -8, -6, 0, 0] },
            { duration: seconds, times: [0, 0.2, 0.42, 0.5, 1], ease: ["easeOut", ease.in, "linear", "linear"] },
          ),
          animate(
            "[data-part=bike]",
            { x: [0, 0.5, 11, -11, 0], opacity: [1, 1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.55, 1], ease: ["easeOut", ease.in, "linear", ease.out] },
          ),
          animate(
            "[data-part=speed]",
            { opacity: [0, 1, 0] },
            { duration: seconds * 0.3, delay: seconds * 0.3, ease: "easeOut" },
          ),
        ]),
    },
    // hops a kerb: the front lifts first, the rear follows, and it lands squashing onto its suspension
    jump: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bike]",
            { y: [0, 0, -3, 0, 0, 0], rotate: [0, -6, 2, 3, 0, 0] },
            { duration: seconds, times: [0, 0.15, 0.4, 0.62, 0.78, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=frame]",
            { scaleY: [1, 1, 1.04, 0.84, 1.04, 1] },
            { duration: seconds, times: [0, 0.15, 0.4, 0.66, 0.84, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // revs on the spot: the frame squats on its wheels in throbs and the headlight pulses with each one
    rev: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=frame]",
            { scaleY: [1, 0.86, 1.03, 0.86, 1.03, 1], rotate: [0, -2, 0, -2, 0, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=lamp]", { scale: [1, 1.6, 1, 1.6, 1, 1] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <>
      <path data-part="speed" d="M2 6h3M2 12.5h2" stroke={slot.accent} style={flash()} />
      {/* turns about the rear wheel's ground contact */}
      <g data-part="bike" style={pivot("15% 100%")}>
        {/* seat, tank and engine block, the fork raking up to the handlebar; squats onto the wheels' tops */}
        <g data-part="frame" style={pivot("50% 100%")}>
          <path d="M2.5 9.5 8.5 11.5 10 9h4l2.6 1.5M9.25 10.25 11 13h2l2.3-3.25" />
          <path d="M18 14 14.4 5H12" />
          <rect
            data-part="lamp"
            x="17"
            y="8"
            width="2"
            height="2"
            fill={slot.accent}
            stroke="none"
            style={pivot("0% 50%")}
          />
        </g>
        <circle cx="5" cy="17" r="3" />
        <circle cx="19" cy="17" r="3" />
      </g>
    </>
  ),
})
