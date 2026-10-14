"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    joystick: "waggle" | "orbit" | "fire"
  }
}

/** Sparks off the fire button: 2px dashes fanning up from its top. */
const SPARKS = ["M3.5 10.5l-1-1.5", "M5.5 10v-2", "M7.5 10.5l1-1.5"] as const

/** 2 colors: base and shaft (primary), knob, button and sparks (accent). */
export const Joystick = createAnimatedIcon({
  name: "joystick",
  category: "gaming",
  keywords: ["game", "controller", "arcade", "stick", "retro", "play", "console", "gaming"],
  slots: { primary: "base + shaft", accent: "knob + button" },
  defaultVariant: "waggle",
  variants: {
    // yanked hard left and right: the stick slams over and springs back, the base rocking under it
    waggle: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=stick]",
            { rotate: [0, -20, 18, -9, 4, 0] },
            { duration: seconds, times: [0, 0.18, 0.42, 0.65, 0.83, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=base]",
            { rotate: [0, 2, -2, 1, 0], y: [0, -0.5, -0.5, 0, 0] },
            { duration: seconds, times: [0, 0.2, 0.45, 0.7, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // stirred round in a circle: the stick foreshortens as it tips away and the knob swells as it
    // swings toward you, faking the depth of a full sweep
    orbit: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=stick]",
            { rotate: [0, -16, 0, 16, 0], scaleY: [1, 0.92, 0.8, 0.92, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=knob]",
            { scale: [1, 1.08, 0.85, 1.08, 1] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the fire button is mashed: it sinks twice and throws sparks while the stick jolts toward you
    fire: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=button]",
            { scaleY: [1, 0.3, 1, 0.3, 1] },
            { duration: seconds * 0.7, times: [0, 0.2, 0.45, 0.65, 1], ease: "easeInOut" },
          ),
          animate("[data-part=spark]", blink, { duration: seconds * 0.4, delay: seconds * 0.12, ease: "easeOut" }),
          animate(
            "[data-part=stick]",
            { scaleY: [1, 0.88, 1.04, 1] },
            { duration: seconds * 0.6, delay: seconds * 0.1, times: [0, 0.3, 0.7, 1], ease: ["easeOut", "easeOut", ease.overshoot] },
          ),
          animate(
            "[data-part=knob]",
            { scale: [1, 1.18, 1] },
            { duration: seconds * 0.6, delay: seconds * 0.1, ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {SPARKS.map((d) => (
          <path key={d} data-part="spark" d={d} style={flash("50% 100%")} />
        ))}
      </g>
      <g data-part="base" style={pivot("50% 100%")}>
        {/* a raked console base, wider at the foot */}
        <path d="M4 16h16l1.5 5h-19Z" />
        {/* the fire button, a solid block on the left of the deck */}
        <path data-part="button" d="M4 12.5h3V15H4Z" fill={slot.accent} stroke="none" style={pivot("50% 100%")} />
      </g>
      {/* hinged at its foot in the deck */}
      <g data-part="stick" style={pivot("50% 100%")}>
        <path d="M14 16V9.5" />
        <circle data-part="knob" cx="14" cy="6.5" r="3" stroke={slot.accent} style={pivot("50% 50%")} />
      </g>
    </>
  ),
})
