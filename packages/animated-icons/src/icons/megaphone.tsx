"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    megaphone: "announce" | "shout" | "raise"
  }
}

/** Three short sound lines fanning out from the mouth, each pivoting on its inner end. */
const WAVES = [
  { d: "M19.5 7.5l2-2", origin: "0% 100%" },
  { d: "M19.5 12H22", origin: "0% 50%" },
  { d: "M19.5 16.5l2 2", origin: "0% 0%" },
]

/** 2 colors: horn and handle (primary), sound lines (accent). */
export const Megaphone = createAnimatedIcon({
  name: "megaphone",
  category: "communication",
  keywords: ["announcement", "broadcast", "loudspeaker", "marketing", "promote", "bullhorn", "news"],
  slots: { primary: "horn + handle", accent: "sound lines" },
  defaultVariant: "announce",
  variants: {
    // the horn kicks forward from its back while the sound lines flicker out of the mouth
    announce: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=horn]",
            { scale: [1, 1.08, 0.98, 1] },
            { duration: seconds * 0.7, times: [0, 0.35, 0.7, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=wave]",
            { opacity: [1, 0.2, 1, 0.2, 1] },
            { duration: seconds, delay: stagger(seconds * 0.05), ease: "easeInOut" },
          ),
        ]),
    },
    // top to bottom, each sound line sucks back into the mouth and springs out again a touch long
    shout: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=wave]",
          { scale: [1, 0.3, 1.15, 1], opacity: [1, 0.2, 1, 1] },
          { duration: seconds * 0.7, times: [0, 0.35, 0.75, 1], delay: stagger(seconds * 0.12), ease: "easeInOut" },
        ),
    },
    // raised to speak: tips up on its handle, holds, and comes back down
    raise: {
      duration: 850,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=megaphone]",
          { rotate: [0, -12, -12, 2, 0] },
          { duration: seconds, times: [0, 0.3, 0.6, 0.85, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="megaphone" style={pivot("30% 100%")}>
      <g data-part="horn" style={pivot("0% 50%")}>
        {/* a short box at the back, then the cone flaring out to a flat mouth */}
        <path d="M2 8h6l8-4v16l-8-4H2Z" />
        {/* the seam between box and cone runs on down into the handle */}
        <path d="M8 8v13H5l-2-5" />
      </g>
      <g stroke={slot.accent}>
        {WAVES.map(({ d, origin }) => (
          <path key={d} data-part="wave" d={d} style={pivot(origin)} />
        ))}
      </g>
    </g>
  ),
})
