"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    microwave: "heat" | "ding" | "open"
  }
}

/** 2 colors: oven and door (primary), dish and buttons (accent). */
export const Microwave = createAnimatedIcon({
  name: "microwave",
  category: "devices",
  keywords: ["oven", "kitchen", "appliance", "reheat", "cooking", "food", "defrost"],
  slots: { primary: "oven + door", accent: "dish + buttons" },
  defaultVariant: "heat",
  variants: {
    // the dish turns on the turntable: it narrows edge-on, circles to the back (smaller) and comes round
    heat: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=dish]",
            {
              scaleX: [1, 0.2, 1, 0.2, 1],
              x: [0, 1, 0, -1, 0],
              scale: [1, 0.85, 0.75, 0.85, 1],
              y: [0, -0.5, -1, -0.5, 0],
            },
            { duration: seconds, ease: "linear" },
          ),
          animate(
            "[data-part=button]",
            { opacity: [1, 0.25, 1, 0.25, 1] },
            { duration: seconds, delay: stagger(seconds * 0.1), ease: "easeInOut" },
          ),
        ]),
    },
    // done! it jolts up with a squash and stretch, the dish hops a beat late and the buttons pop
    ding: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=microwave]",
            { y: [0, 0, -2, 0, 0], scaleY: [1, 0.88, 1.08, 0.93, 1], scaleX: [1, 1.06, 0.96, 1.04, 1] },
            { duration: seconds, times: [0, 0.18, 0.45, 0.7, 1], ease: ["easeOut", "easeOut", ease.in, ease.overshoot] },
          ),
          animate(
            "[data-part=dish]",
            { y: [0, 0, -1.5, 0, 0] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: ["linear", "easeOut", ease.in, "easeOut"] },
          ),
          animate(
            "[data-part=button]",
            { scale: [1, 1.5, 1], opacity: [1, 0.4, 1] },
            { duration: seconds * 0.4, delay: stagger(seconds * 0.08, { startDelay: seconds * 0.4 }), ease: "easeOut" },
          ),
        ]),
    },
    // the door swings open toward you on its left hinge and bangs shut, rattling the oven
    open: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=door]",
            { scaleX: [1, 0.12, 0.12, 1], skewY: [0, 16, 16, 0] },
            { duration: seconds * 0.8, times: [0, 0.35, 0.6, 1], ease: ["easeOut", "linear", ease.in] },
          ),
          animate(
            "[data-part=microwave]",
            { x: [0, 0, -1, 0.7, -0.3, 0], rotate: [0, 0, -3, 2, -1, 0] },
            { duration: seconds, times: [0, 0.8, 0.86, 0.92, 0.96, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="microwave" style={pivot("50% 100%")}>
      {/* the oven box on two short feet; the control panel to the right of the door */}
      <path d="M2 4h20v15H2Z" />
      <path d="M6 19v2M18 19v2" />
      <g stroke={slot.accent}>
        <path data-part="button" d="M19 8v2" style={pivot("50% 50%")} />
        <path data-part="button" d="M19 13v3" style={pivot("50% 50%")} />
      </g>
      <g data-part="door" style={pivot("0% 50%")}>
        <path d="M2 4h14v15H2Z" />
        <path d="M5 7h8v9H5Z" />
        {/* a dish on the turntable, seen through the window */}
        <path data-part="dish" d="M7 11h4l-1 2H8Z" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
