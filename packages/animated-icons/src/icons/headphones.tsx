"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    headphones: "pulse" | "bob"
  }
}

/** Sound bars standing between the cups, only there in motion. */
const BARS = ["M10 16v4", "M14 14v6"]

/** 2 colors: headband (primary), ear cups and sound bars (accent). */
export const Headphones = createAnimatedIcon({
  name: "headphones",
  category: "media",
  keywords: ["audio", "music", "listen", "sound", "podcast", "headset", "earphones"],
  slots: { primary: "headband", accent: "ear cups + sound bars" },
  defaultVariant: "pulse",
  variants: {
    // the cups thump twice to the beat while the sound bars jump between them
    pulse: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cup]",
            { scale: [1, 1.15, 1, 1.12, 1] },
            { duration: seconds, times: [0, 0.15, 0.4, 0.55, 1], ease: ease.out },
          ),
          animate(
            "[data-part=bar]",
            { opacity: [0, 1, 1, 0], scaleY: [0.4, 1.2, 0.7, 1] },
            { duration: seconds * 0.8, delay: stagger(seconds * 0.1), ease: "easeInOut" },
          ),
        ]),
    },
    // nods along: rocks side to side with a small hop on each beat
    bob: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=headphones]",
          { rotate: [0, -9, 0, 9, 0], y: [0, -1.5, 0, -1.5, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {BARS.map((d) => (
          <path key={d} data-part="bar" d={d} style={flash("50% 100%")} />
        ))}
      </g>
      <g data-part="headphones" style={pivot("50% 100%")}>
        {/* a faceted band: straight sides, raked shoulders, a flat crown */}
        <path d="M3 14v-3l2-5 4-3h6l4 3 2 5v3" />
        <g stroke={slot.accent}>
          <path data-part="cup" d="M3 14h4v7H3Z" style={pivot("50% 50%")} />
          <path data-part="cup" d="M17 14h4v7h-4Z" style={pivot("50% 50%")} />
        </g>
      </g>
    </>
  ),
})
