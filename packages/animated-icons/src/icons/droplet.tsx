"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    droplet: "fall" | "wobble"
  }
}

/** A faceted drop: a sharp tip, straight shoulders, a round belly cut into flats. */
const DROP = "M12 2l5 6 2 5v3l-2 3-3 2h-4l-3-2-2-3v-3l2-5z"

/** Splashes thrown up beside the drop's base, each drawn from its inner end (where it grows from). */
const SPLASH = [
  { d: "M4 19 2.5 17.5", origin: "100% 100%" },
  { d: "M20 19l1.5-1.5", origin: "0% 100%" },
]

/** 2 colors: drop (primary), shine and splash (accent). */
export const Droplet = createAnimatedIcon({
  name: "droplet",
  category: "nature",
  keywords: ["water", "drop", "liquid", "rain", "humidity", "fluid", "hydrate", "ink"],
  slots: { primary: "drop", accent: "shine + splash" },
  defaultVariant: "fall",
  variants: {
    // the drop falls out through the bottom, drops back in from the top, lands with a squash and splashes
    fall: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=drop]",
            { y: [0, 7, -7, 0, 0], opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.32, 0.6, 1], ease: [ease.in, "linear", ease.in, "linear"] },
          ),
          animate(
            "[data-part=drop]",
            { scaleY: [1, 1, 0.88, 1.03, 1], scaleX: [1, 1, 1.06, 0.98, 1] },
            { duration: seconds, times: [0, 0.6, 0.72, 0.86, 1], ease: "easeOut" },
          ),
          animate("[data-part=splash]", blink, { duration: seconds * 0.35, delay: seconds * 0.6, ease: "easeOut" }),
        ]),
    },
    // the drop wobbles like jelly on its flat base
    wobble: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=drop]",
          { scaleX: [1, 1.1, 0.94, 1.03, 1], scaleY: [1, 0.9, 1.06, 0.98, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {SPLASH.map(({ d, origin }) => (
          <path key={d} data-part="splash" d={d} style={flash(origin)} />
        ))}
      </g>
      <g data-part="drop" style={pivot("50% 100%")}>
        <path d={DROP} />
        <path d="M9 13v3l1.5 1.5" stroke={slot.accent} />
      </g>
    </>
  ),
})
