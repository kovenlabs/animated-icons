"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    bed: "sleep" | "fluff" | "bounce"
  }
}

/** 2 colors: frame and mattress (primary), pillow and Z (accent). */
export const Bed = createAnimatedIcon({
  name: "bed",
  category: "navigation",
  keywords: ["sleep", "bedroom", "hotel", "rest", "night", "accommodation", "lodging", "nap"],
  slots: { primary: "frame + mattress", accent: "pillow + Z" },
  defaultVariant: "sleep",
  variants: {
    // a head sinks into the pillow, and a Z drifts up and away, swelling as it nears and fading out
    sleep: {
      clip: true,
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=pillow]",
            { scaleY: [1, 0.65, 0.75, 0.75, 1], scaleX: [1, 1.12, 1.08, 1.08, 1] },
            { duration: seconds, times: [0, 0.2, 0.35, 0.85, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=z]",
            { opacity: [0, 1, 1, 0], y: [3, 0, -2, -5], x: [-3, -1, 0, 1], scale: [0.4, 0.8, 1.1, 1.4], rotate: [-15, 0, 8, 12] },
            { duration: seconds * 0.75, delay: seconds * 0.2, times: [0, 0.3, 0.7, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the pillow is tossed up, flips over in the air and lands with a squash
    fluff: {
      clip: false,
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pillow]",
          {
            y: [0, -5, -5, 0, 0, 0],
            scaleX: [1, 1, -1, 1, 1.15, 1],
            scaleY: [1, 1.1, 1.1, 1, 0.75, 1],
          },
          { duration: seconds, times: [0, 0.3, 0.5, 0.7, 0.82, 1], ease: ["easeOut", "easeInOut", ease.in, "easeOut", ease.overshoot] },
        ),
    },
    // someone flops down: the mattress sinks onto the springs and rebounds, the pillow hops a beat later
    bounce: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bed]",
            { scaleY: [1, 0.9, 1.04, 0.98, 1], scaleX: [1, 1.04, 0.98, 1.01, 1] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=mattress]",
            { y: [0, 1.5, -1.5, 0.5, 0] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=pillow]",
            { y: [0, 0, -2.5, 0, 0], rotate: [0, 0, -10, 0, 0] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: ["linear", "easeOut", ease.in, ease.overshoot] },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <path data-part="z" d="M15 2h4l-4 4h4" stroke={slot.accent} style={flash("0% 100%")} />
      <g data-part="bed" style={pivot("50% 100%")}>
        {/* a tall headboard, the side rail, and a footpost */}
        <path d="M3 4v16M3 16h18v4" />
        <g data-part="mattress">
          {/* the mattress, chamfered at the foot down onto the rail */}
          <path d="M3 11h16l2 2v3" />
          <path data-part="pillow" d="M7 11V7h5l2 4" stroke={slot.accent} style={pivot("50% 100%")} />
        </g>
      </g>
    </>
  ),
})
