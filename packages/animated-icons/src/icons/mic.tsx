"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    mic: "level" | "wobble" | "pulse"
  }
}

/** Pulse ticks either side of the capsule, above the cradle: a diagonal and a level one per side. */
const TICKS = [
  { d: "M5 3.5 3.5 2", origin: "100% 100%" },
  { d: "M5 8H3", origin: "100% 50%" },
  { d: "M19 3.5l1.5-1.5", origin: "0% 100%" },
  { d: "M19 8h2", origin: "0% 50%" },
]

/** 2 colors: capsule + stand (primary), level + pulse ticks (accent). */
export const MicIcon = createAnimatedIcon({
  name: "mic",
  category: "media",
  keywords: ["microphone", "record", "voice", "audio", "dictate", "podcast", "speak"],
  slots: { primary: "capsule + stand", accent: "level + pulse ticks" },
  defaultVariant: "level",
  variants: {
    // the level rises and falls like a voice
    level: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=level]",
          { scaleY: [1, 1.9, 0.7, 1.5, 1] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // rocks on its base and settles
    wobble: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate("[data-part=mic]", { rotate: [0, -10, 8, -4, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the capsule swells and ticks blink out on both sides
    pulse: {
      duration: 650,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=capsule]", { scale: [1, 1.06, 1] }, { duration: seconds * 0.6, ease: ease.out }),
          animate("[data-part=tick]", blink, { duration: seconds * 0.7, delay: stagger(seconds * 0.05), ease: "easeOut" }),
        ]),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {TICKS.map(({ d, origin }) => (
          <path key={d} data-part="tick" d={d} style={flash(origin)} />
        ))}
      </g>
      <g data-part="mic" style={pivot("50% 100%")}>
        <g data-part="capsule" style={pivot("50% 50%")}>
          {/* the level fills the capsule's lower part, under its outline */}
          <rect data-part="level" x="9" y="9" width="6" height="5" fill={slot.accent} stroke="none" style={pivot("50% 100%")} />
          {/* drawn square: the renderer rounds its ends */}
          <rect x="9" y="2" width="6" height="12" />
        </g>
        {/* a squared cradle with chamfered bottom corners, a stem and a foot */}
        <path d="M4 12v3l3 3h10l3-3v-3" />
        <path d="M12 18v3M8 21h8" />
      </g>
    </>
  ),
})
