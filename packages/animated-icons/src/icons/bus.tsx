"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    bus: "drive" | "stop" | "idle"
  }
}

/** 2 colors: body, windows and wheels (primary), headlight and speed lines (accent). */
export const Bus = createAnimatedIcon({
  name: "bus",
  category: "transport",
  keywords: ["school bus", "transport", "transit", "coach", "shuttle", "commute", "public transport"],
  slots: { primary: "body + windows + wheels", accent: "headlight + speed lines" },
  defaultVariant: "drive",
  variants: {
    // drives off to the right, leaving speed lines where it stood, and pulls back in from the left
    drive: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bus]",
            { x: [0, 9, -9, 0], opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.85, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
          ),
          // the lines show only once the bus's back wall has pulled clear of them
          animate(
            "[data-part=speed]",
            { opacity: [0, 1, 0] },
            { duration: seconds * 0.3, delay: seconds * 0.16, ease: "easeOut" },
          ),
        ]),
    },
    // brakes at the stop: the nose dips onto the front wheels and the headlight flashes twice
    stop: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=bus]", { rotate: [0, 3, -1.5, 0] }, { duration: seconds * 0.7, ease: "easeInOut" }),
          animate("[data-part=lamp]", { opacity: [1, 0.2, 1, 0.2, 1] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // the engine idles: the body rumbles on its wheels
    idle: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate("[data-part=body]", { y: [0, -1, 0, -1, 0, -0.5, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <>
      {/* two short streaks where the back of the bus stood, inside the frame */}
      <g data-part="speed" stroke={slot.accent} style={flash()}>
        <path d="M2 10h2" />
        <path d="M2 14h2" />
      </g>
      <g data-part="bus" style={pivot("100% 100%")}>
        <g data-part="body">
          {/* a long box with a raked windscreen (the window band meets it mid-slope), the floor broken where the wheels sit */}
          <path d="M4 18H2V3h16l4 6v9h-3M8 18h7" />
          {/* the window band and its pillars */}
          <path d="M2 8h19.33M6 3v5M10 3v5M14 3v5" />
          {/* the headlight sits 2px clear of the band, the front wall and the front wheel */}
          <rect data-part="lamp" x="17" y="11" width="2" height="2" fill={slot.accent} stroke="none" />
        </g>
        <circle cx="6" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </g>
    </>
  ),
})
