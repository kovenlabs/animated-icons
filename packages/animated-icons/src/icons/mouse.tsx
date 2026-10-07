"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    mouse: "click" | "scroll" | "lift"
  }
}

/** Two wheel notches rolling over the top of the wheel: each sinks, squeezes and fades, the next rises in. */
const ROLL = { times: [0, 0.22, 0.28, 0.5, 0.72, 0.78, 1] }

/** 2 colors: body (primary), wheel and button press (accent). */
export const Mouse = createAnimatedIcon({
  name: "mouse",
  category: "devices",
  keywords: ["computer mouse", "click", "pointer", "scroll wheel", "input", "peripheral", "cursor"],
  slots: { primary: "body", accent: "wheel + button press" },
  defaultVariant: "click",
  variants: {
    // the left button lights up as the mouse is pressed flat, then it springs back up past its height
    click: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=mouse]",
            { scaleY: [1, 0.86, 1.06, 1], scaleX: [1, 1.06, 0.97, 1] },
            { duration: seconds, times: [0, 0.2, 0.55, 1], ease: ["easeOut", ease.overshoot, "easeInOut"] },
          ),
          animate("[data-part=press]", { opacity: [0, 1, 0] }, { duration: seconds * 0.7, times: [0, 0.2, 1], ease: "easeOut" }),
          animate("[data-part=wheel]", { y: [0, 1, 0] }, { duration: seconds * 0.5, ease: "easeOut" }),
        ]),
    },
    // the wheel rolls two notches: each one turns over the top of the wheel and the next rolls up
    scroll: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=wheel]",
            { y: [0, 2.5, -2.5, 0, 2.5, -2.5, 0], scaleY: [1, 0.3, 0.3, 1, 0.3, 0.3, 1] },
            { duration: seconds, ...ROLL, ease: ["easeIn", "linear", "easeOut", "easeIn", "linear", "easeOut"] },
          ),
          animate("[data-part=wheel]", { opacity: [1, 0, 0, 1, 0, 0, 1] }, { duration: seconds, ...ROLL }),
        ]),
    },
    // picked up toward you, carried across the pad with a tilt, and set back down with a squash
    lift: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=hold]",
            { x: [0, -1.5, 1.5, 0, 0], y: [0, -1, -1, 0, 0], rotate: [0, -10, 8, 0, 0], scale: [1, 1.12, 1.12, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.6, 0.8, 1], ease: ["easeOut", "easeInOut", "easeIn", "linear"] },
          ),
          animate(
            "[data-part=mouse]",
            { scaleY: [1, 1, 0.88, 1], scaleX: [1, 1, 1.06, 1] },
            { duration: seconds, times: [0, 0.8, 0.88, 1], ease: ["linear", "easeOut", ease.overshoot] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="mouse" style={pivot("50% 100%")}>
      {/* held in the hand: lifts and tilts about its middle, while landings squash it from its base */}
      <g data-part="hold" style={pivot("50% 50%")}>
        {/* the left button, lit while it is pressed: a quarter of the shell's inside */}
        <path data-part="press" d="M6 11V9a6 6 0 0 1 6-6v8Z" fill={slot.accent} fillOpacity={0.3} stroke="none" style={flash()} />
        {/* a mouse is round, so its shell is a capsule of true arcs */}
        <path d="M5 9a7 7 0 0 1 14 0v6a7 7 0 0 1-14 0Z" />
        <path data-part="wheel" d="M12 6v4" stroke={slot.accent} style={pivot("50% 50%")} />
      </g>
    </g>
  ),
})
