"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    gamepad: "press" | "dpad" | "rumble"
  }
}

/** Face buttons, top-left corners of 2×2 squares on a diagonal. */
const BUTTONS = [
  { x: 13.5, y: 11.5 },
  { x: 16.5, y: 8.5 },
] as const

/** 3 colors: body (primary), d-pad (secondary), buttons (accent). */
export const GamepadIcon = createAnimatedIcon({
  name: "gamepad",
  category: "gaming",
  keywords: ["game", "controller", "joystick", "play", "console", "gaming", "esports"],
  slots: { primary: "body", secondary: "d-pad", accent: "buttons" },
  defaultVariant: "press",
  variants: {
    // the face buttons sink one after the other, the pad giving a little under each press
    press: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=button]",
            { scale: [1, 0.3, 1] },
            { duration: seconds * 0.4, delay: stagger(seconds * 0.35, { startDelay: seconds * 0.05 }), ease: "easeInOut" },
          ),
          animate(
            "[data-part=pad]",
            { y: [0, 0.75, 0, 0.75, 0, 0] },
            { duration: seconds, times: [0, 0.25, 0.42, 0.6, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the d-pad clicks left, right, up and down
    dpad: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=dpad]",
          { x: [0, -1, 0, 1, 0, 0, 0, 0, 0], y: [0, 0, 0, 0, 0, -1, 0, 1, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // a rumble: shaken in the hands
    rumble: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=pad]",
          { x: [0, -1, 1, -1, 1, 0], rotate: [0, -4, 4, -4, 4, 0] },
          { duration: seconds, ease: "linear" },
        ),
    },
  },
  render: () => (
    <g data-part="pad" style={pivot("50% 50%")}>
      {/* a faceted controller: flat top, raked shoulders, two grips with a notch between them */}
      <path d="M6 6h12l3 2 1 8-2 3h-2l-3-3H9l-3 3H4l-2-3 1-8Z" />
      <path data-part="dpad" d="M8 9.5v3M6.5 11h3" stroke={slot.secondary} />
      <g fill={slot.accent} stroke="none">
        {BUTTONS.map(({ x, y }) => (
          <rect key={x} data-part="button" x={x} y={y} width="2" height="2" style={pivot("50% 50%")} />
        ))}
      </g>
    </g>
  ),
})
