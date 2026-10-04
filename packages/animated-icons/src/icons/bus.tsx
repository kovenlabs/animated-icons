"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    bus: "drive" | "stop" | "idle"
  }
}

/** 2 colors: body, windows and wheels (primary), headlight and speed lines (accent). */
export const BusIcon = createAnimatedIcon({
  name: "bus",
  category: "transport",
  keywords: ["school bus", "transport", "transit", "coach", "shuttle", "commute", "public transport"],
  slots: { primary: "body + windows + wheels", accent: "headlight + speed lines" },
  defaultVariant: "drive",
  variants: {
    // drives off to the right, leaving speed lines behind, and pulls back in from the left
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
          animate(
            "[data-part=speed]",
            { opacity: [0, 1, 0] },
            { duration: seconds * 0.3, delay: seconds * 0.05, ease: "easeOut" },
          ),
        ]),
    },
    // brakes at the stop: the nose dips onto the front wheels and the headlight pulses twice
    stop: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bus]",
            { rotate: [0, 3, -1.5, 0] },
            { duration: seconds * 0.7, ease: "easeInOut" },
          ),
          animate(
            "[data-part=lamp]",
            { scale: [1, 1.4, 1, 1.4, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // the engine idles: the body rumbles on its wheels
    idle: {
      duration: 700,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=body]",
          { y: [0, -1, 0, -1, 0, -0.5, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g data-part="speed" stroke={slot.accent} style={flash()}>
        <path d="M0 11h1" />
        <path d="M0 15h1" />
      </g>
      <g data-part="bus" style={pivot("100% 100%")}>
        <g data-part="body">
          {/* a long box with a raked windscreen (the window band meets it mid-slope), the floor broken where the wheels sit */}
          <path d="M4 17H2V4h16l4 6v7h-3M8 17h7" />
          {/* the window band and its pillars */}
          <path d="M2 9h19.33M6 4v5M10 4v5M14 4v5" />
          <rect data-part="lamp" x="19" y="11.5" width="2" height="2" fill={slot.accent} stroke="none" style={pivot("100% 50%")} />
        </g>
        <circle cx="6" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </g>
    </>
  ),
})
