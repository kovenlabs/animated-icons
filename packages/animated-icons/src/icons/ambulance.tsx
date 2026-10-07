"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    ambulance: "rush" | "siren" | "approach"
  }
}

/** 2 colors: body, cab and wheels (primary), cross, beacon and its flashes (accent). */
export const Ambulance = createAnimatedIcon({
  name: "ambulance",
  category: "transport",
  keywords: ["emergency", "hospital", "paramedic", "medical", "rescue", "siren", "first aid", "911"],
  slots: { primary: "body + cab + wheels", accent: "cross + beacon + flashes" },
  defaultVariant: "rush",
  variants: {
    // crouches, leans back as it tears off to the right with the beacon flashing, races back in from the
    // left and brakes hard, pitching forward before it settles
    rush: {
      clip: true,
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=van]",
            {
              x: [0, -1, 10, -10, 1.5, 0],
              skewX: [0, -4, 14, 10, -12, 0],
              opacity: [1, 1, 0, 0, 1, 1],
            },
            { duration: seconds, times: [0, 0.12, 0.42, 0.5, 0.78, 1], ease: ["easeOut", ease.in, "linear", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=siren]",
            { scaleX: [1, 0.2, 1, 0.2, 1, 0.2, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part^=ray-]", { opacity: [0, 1, 0, 1, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // the beacon turns on the roof, its flash swinging left and right, while the cross pulses
    siren: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=siren]",
            { scaleX: [1, 0.15, 1, 0.15, 1, 0.15, 1], scaleY: [1, 1.15, 1, 1.15, 1, 1.15, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=ray-left]",
            { opacity: [0, 1, 0, 0, 1, 0, 0], scale: [0.6, 1.1, 1, 0.6, 1.1, 1, 0.6] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=ray-right]",
            { opacity: [0, 0, 1, 0, 0, 1, 0], scale: [0.6, 0.6, 1.1, 1, 0.6, 1.1, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=cross]",
            { scale: [1, 1.3, 1, 1.3, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // pulls back into the distance, then rushes at you, looming past full size before it settles
    approach: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=van]",
            { scale: [1, 0.5, 1.3, 1], y: [0, -3, 1, 0] },
            { duration: seconds, times: [0, 0.3, 0.65, 1], ease: ["easeInOut", ease.in, ease.out] },
          ),
          animate(
            "[data-part=siren]",
            { scaleX: [1, 0.2, 1, 0.2, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part^=ray-]",
            { opacity: [0, 0, 1, 0] },
            { duration: seconds, times: [0, 0.4, 0.65, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="van" style={pivot("50% 100%")}>
      {/* the beacon's flashes, one each side of it */}
      <g stroke={slot.accent}>
        <path data-part="ray-left" d="M8 3.5 6.5 2" style={flash("100% 100%")} />
        <path data-part="ray-right" d="M15 3.5 16.5 2" style={flash("0% 100%")} />
      </g>
      {/* a tall box with a lower cab: raked windscreen, the window line running back to the box */}
      <path d="M5 18H2V6h13v12M15 9h3.5l3.5 4v5h-3M9 18h6M15 13h7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path data-part="cross" d="M8.5 9.5v5M6 12h5" stroke={slot.accent} style={pivot("50% 50%")} />
      {/* the beacon sits on the roof */}
      <rect data-part="siren" x="10" y="3" width="3" height="3" fill={slot.accent} stroke="none" style={pivot("50% 100%")} />
    </g>
  ),
})
