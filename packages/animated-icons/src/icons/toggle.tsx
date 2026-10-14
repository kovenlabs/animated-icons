"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    toggle: "switch" | "roll" | "bounce"
  }
}

/** How far the knob slides from off (left) to on (right), keeping 2 clear of the track either side. */
const THROW = 6

/** 2 colors: track (primary), knob and on-glow (accent). */
export const Toggle = createAnimatedIcon({
  name: "toggle",
  category: "actions",
  keywords: ["switch", "on off", "toggle left", "enable", "disable", "settings", "preference", "checkbox"],
  slots: { primary: "track", accent: "knob + on glow" },
  defaultVariant: "switch",
  variants: {
    // flicked on: the knob stretches as it races across, squashes into the far wall, the track lights
    // up, then it's flicked back off the same way
    switch: {
      clip: false,
      duration: 1200,
      run: ({ animate, seconds }) => {
        const times = [0, 0.18, 0.26, 0.36, 0.6, 0.76, 0.84, 1]
        const timing = { duration: seconds, times, ease: [ease.in, "easeOut", "easeOut", "linear", ease.in, "easeOut", "easeOut"] satisfies Easing[] }
        return Promise.all([
          animate("[data-part=knob]", { x: [0, THROW * 0.6, THROW + 0.4, THROW, THROW, THROW * 0.4, -0.4, 0] }, timing),
          animate(
            "[data-part=knob]",
            { scaleX: [1, 1.35, 0.8, 1, 1, 1.35, 0.8, 1], scaleY: [1, 0.85, 1.15, 1, 1, 0.85, 1.15, 1] },
            timing,
          ),
          animate("[data-part=glow]", { opacity: [0, 0, 1, 1, 1, 0, 0, 0] }, timing),
        ])
      },
    },
    // the knob rolls across like a die tumbling down the track, a half turn each way, hopping on its
    // corners as it goes
    roll: {
      clip: false,
      duration: 1300,
      run: ({ animate, seconds }) => {
        const times = [0, 0.35, 0.45, 0.55, 0.9, 1]
        return Promise.all([
          animate(
            "[data-part=knob]",
            { x: [0, THROW, THROW, THROW, 0, 0], rotate: [0, 180, 180, 180, 0, 0] },
            { duration: seconds, times, ease: ["easeInOut", "linear", "linear", "easeInOut", "linear"] },
          ),
          animate(
            "[data-part=knob]",
            { scale: [1, 0.85, 1, 0.85, 1] },
            { duration: seconds * 0.9, times: [0, 0.2, 0.4, 0.8, 1], ease: "easeInOut" },
          ),
          animate("[data-part=glow]", { opacity: [0, 0, 1, 1, 0, 0] }, { duration: seconds, times, ease: "easeOut" }),
        ])
      },
    },
    // it won't stay on: the knob slams across, the whole switch wobbles like jelly from the hit, and
    // the knob springs straight back off
    bounce: {
      clip: false,
      duration: 1100,
      run: ({ animate, seconds }) => {
        const times = [0, 0.25, 0.35, 0.6, 0.8, 1]
        return Promise.all([
          animate(
            "[data-part=knob]",
            { x: [0, THROW, THROW, -0.6, 0.3, 0], scaleX: [1, 1.3, 0.75, 1.2, 0.95, 1], scaleY: [1, 0.85, 1.2, 0.9, 1.03, 1] },
            { duration: seconds, times, ease: [ease.in, "easeOut", ease.in, "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=toggle]",
            { skewX: [0, 0, -8, 6, -3, 0], scaleX: [1, 1, 0.86, 0.9, 0.97, 1], scaleY: [1, 1, 0.9, 1.06, 0.98, 1] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate("[data-part=glow]", { opacity: [0, 0, 0.8, 0, 0, 0] }, { duration: seconds, times, ease: "easeOut" }),
        ])
      },
    },
  },
  render: () => (
    <g data-part="toggle" style={pivot("50% 100%")}>
      <rect data-part="glow" x="4" y="7" width="16" height="10" fill={slot.accent} fillOpacity={0.2} stroke="none" style={flash()} />
      {/* the track: a flat bar, its ends rounded at render like every other corner */}
      <path d="M2 5h20v14H2Z" />
      {/* the knob sits off, at the left */}
      <path data-part="knob" d="M6 9h6v6H6Z" stroke={slot.accent} style={pivot("50% 50%")} />
    </g>
  ),
})
