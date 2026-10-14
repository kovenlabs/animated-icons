"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    drone: "takeoff" | "hover" | "yaw"
  }
}

/** A propeller seen edge-on spins as a flip through zero width: `turns` half-turns, ending face-on. */
const spin = (turns: number) => ({
  scaleX: Array.from({ length: turns + 1 }, (_, i) => (i % 2 === 0 ? 1 : -1)),
})

/** 2 colors: body, arms and legs (primary), propellers and downdraft (accent). */
export const Drone = createAnimatedIcon({
  name: "drone",
  category: "transport",
  keywords: ["quadcopter", "uav", "aerial", "flying", "delivery", "camera drone", "rotor"],
  slots: { primary: "body + arms + legs", accent: "propellers + downdraft" },
  defaultVariant: "takeoff",
  variants: {
    // the props spin up, it crouches, springs into the air on a puff of downdraft and drops back onto its skids
    takeoff: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=prop]", spin(12), {
            duration: seconds,
            ease: "linear",
          }),
          animate(
            "[data-part=drone]",
            {
              y: [0, 0.8, -3.5, -2.5, 0, 0],
              scaleY: [1, 0.88, 1.05, 1, 0.9, 1],
            },
            {
              duration: seconds,
              times: [0, 0.2, 0.42, 0.65, 0.85, 1],
              ease: "easeInOut",
            },
          ),
          animate(
            "[data-part=wash]",
            { ...blink, scaleX: [0.6, 1, 1.3] },
            {
              duration: seconds * 0.45,
              delay: seconds * 0.22,
              ease: "easeOut",
            },
          ),
        ]),
    },
    // hovers, banking one way then the other as it holds position, props whirring
    hover: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=prop]", spin(14), {
            duration: seconds,
            ease: "linear",
          }),
          animate("[data-part=drone]", { y: [0, -1.5, 0, -1, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=body]", { rotate: [0, -4, 4, -2, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // turns round on the spot: it narrows edge-on and opens out again, the far propeller swapping sides
    yaw: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=prop]", spin(10), {
            duration: seconds,
            ease: "linear",
          }),
          animate(
            "[data-part=drone]",
            // the drone is mirror-symmetric, so edge-on it jumps from 0.15 to -0.15 instead of squeezing
            // through zero width, where it would vanish for a frame
            {
              scaleX: [1, 0.15, -0.15, -1, -0.15, 0.15, 1],
              y: [0, -1, -1, 0, -1, -1, 0],
            },
            {
              duration: seconds,
              times: [0, 0.25, 0.251, 0.5, 0.75, 0.751, 1],
              ease: ["easeIn", snap, "easeOut", "easeIn", snap, "easeOut"],
            },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* the downdraft, kicked off the ground under the skids */}
      <path data-part="wash" d="M4 21h4M16 21h4" stroke={slot.accent} style={flash()} />
      <g data-part="drone" style={pivot("50% 100%")}>
        <g data-part="body" style={pivot("50% 50%")}>
          {/* a flat body with arms out to two masts, and splayed legs on skids */}
          <path d="M8 10h8v4H8Z" />
          <path d="M8 12H4.5V6M16 12h3.5V6" />
          <path d="M10 14l-2 4M14 14l2 4M6 18h4M14 18h4" />
          <g stroke={slot.accent}>
            <path data-part="prop" d="M2.5 6h4" style={pivot("50% 50%")} />
            <path data-part="prop" d="M17.5 6h4" style={pivot("50% 50%")} />
          </g>
        </g>
      </g>
    </>
  ),
})
