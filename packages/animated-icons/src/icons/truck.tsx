"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    truck: "deliver" | "bounce"
  }
}

/** 2 colors: cab, chassis and wheels (primary), cargo box (accent). */
export const Truck = createAnimatedIcon({
  name: "truck",
  category: "transport",
  keywords: ["delivery", "shipping", "lorry", "freight", "logistics", "dispatch", "van"],
  slots: { primary: "cab + chassis + wheels", accent: "cargo box" },
  defaultVariant: "deliver",
  variants: {
    // drives off to the right, pulls back in from the left and brakes, the cargo rocking on its bed
    deliver: {
      clip: true,
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=truck]",
            { x: [0, 9, -9, 0], opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.8, times: [0, 0.45, 0.55, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=speed]",
            { opacity: [0, 1, 0] },
            { duration: seconds * 0.3, delay: seconds * 0.05, ease: "easeOut" },
          ),
          animate(
            "[data-part=cargo]",
            { rotate: [0, 0, -4, 0] },
            { duration: seconds, times: [0, 0.75, 0.88, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // rattles over a rough road: the truck jolts and the cargo hops on its bed, twice
    bounce: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=truck]",
            { y: [0, -1, 0, -0.5, 0] },
            { duration: seconds * 0.8, ease: "easeInOut" },
          ),
          animate(
            "[data-part=cargo]",
            { y: [0, -2.5, 0, -1.5, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="speed" style={flash()}>
        <path d="M0 8h1" />
        <path d="M0 12h1" />
      </g>
      <g data-part="truck" style={pivot("50% 100%")}>
        {/* the bed the cargo rests on, the cab with a sloped nose, and the wheels */}
        <path d="M2 16h12" />
        <path d="M14 16V8h4.5l3.5 4.5V18h-3" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
        <rect data-part="cargo" x="2" y="4" width="12" height="12" stroke={slot.accent} style={pivot("0% 100%")} />
      </g>
    </>
  ),
})
