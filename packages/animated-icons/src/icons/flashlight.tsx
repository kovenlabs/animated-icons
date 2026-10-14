"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    flashlight: "beam" | "sweep" | "flicker"
  }
}

/** Three rays fanning up off the lens, each scaling out from its lens end. */
const RAYS = [
  { d: "M8 4 6 2", origin: "100% 100%" },
  { d: "M12 4V2", origin: "50% 100%" },
  { d: "M16 4l2-2", origin: "0% 100%" },
]

/** 2 colors: torch body (primary), switch, lens glow and beam (accent). */
export const Flashlight = createAnimatedIcon({
  name: "flashlight",
  category: "devices",
  keywords: ["torch", "light", "beam", "lamp", "search", "dark", "illuminate"],
  slots: { primary: "torch body", accent: "switch + lens glow + beam" },
  defaultVariant: "beam",
  variants: {
    // the switch is thumbed down, the torch kicks back on it, and the beam bursts out of the lens
    // ray by ray, overshooting before it fades
    beam: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=switch]",
            { scaleY: [1, 0.4, 1], y: [0, 0.6, 0] },
            { duration: seconds * 0.3, ease: "easeInOut" },
          ),
          animate(
            "[data-part=torch]",
            { y: [0, 1, 0], scaleY: [1, 0.94, 1] },
            { duration: seconds * 0.5, times: [0, 0.35, 1], ease: ["easeOut", ease.overshoot] },
          ),
          animate(
            "[data-part=glow]",
            { opacity: [0, 0, 1, 1, 0] },
            { duration: seconds, times: [0, 0.2, 0.3, 0.75, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=ray]",
            { opacity: [0, 1, 1, 0], scale: [0.3, 1.25, 1, 1] },
            {
              duration: seconds * 0.7,
              times: [0, 0.3, 0.6, 1],
              delay: stagger(seconds * 0.06, { startDelay: seconds * 0.22 }),
              ease: [ease.overshoot, "easeOut", "easeIn"],
            },
          ),
        ]),
    },
    // a search in the dark: the lit torch swings to one side and the other, foreshortening as it
    // turns away like a cylinder seen at an angle, then settles facing you and clicks off
    sweep: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=torch]",
            { rotate: [0, -11, 11, 0], scaleX: [1, 0.86, 0.86, 1] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=glow]",
            { opacity: [0, 1, 1, 0] },
            { duration: seconds, times: [0, 0.1, 0.85, 1], ease: "linear" },
          ),
          animate(
            "[data-part=ray]",
            { opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] },
            { duration: seconds, times: [0, 0.12, 0.85, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the batteries are going: the beam stutters and dies, the torch gets a hard smack that squashes
    // it, and the light snaps back on brighter than before
    flicker: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=glow]",
            { opacity: [0, 1, 0.2, 1, 0, 0.6, 0, 0, 1, 0] },
            { duration: seconds, times: [0, 0.06, 0.12, 0.18, 0.26, 0.32, 0.38, 0.6, 0.66, 1], ease: "linear" },
          ),
          animate(
            "[data-part=ray]",
            { opacity: [0, 1, 0.2, 1, 0, 0.6, 0, 0, 1, 1, 0], scale: [1, 1, 1, 1, 1, 1, 1, 0.4, 1.3, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.06, 0.12, 0.18, 0.26, 0.32, 0.38, 0.6, 0.66, 0.85, 1],
              ease: "linear",
            },
          ),
          animate(
            "[data-part=torch]",
            {
              rotate: [0, 0, 9, -6, 3, 0],
              scaleY: [1, 1, 0.9, 1.04, 1, 1],
              scaleX: [1, 1, 1.06, 0.98, 1, 1],
            },
            { duration: seconds, times: [0, 0.45, 0.55, 0.65, 0.78, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="torch" style={pivot("50% 100%")}>
      <g stroke={slot.accent}>
        {RAYS.map(({ d, origin }) => (
          <path key={d} data-part="ray" d={d} style={flash(origin)} />
        ))}
      </g>
      {/* the lens glows inside the head, under its outline */}
      <rect data-part="glow" x="6" y="9" width="12" height="2" fill={slot.accent} stroke="none" style={flash()} />
      {/* a wide head that chamfers into a straight barrel */}
      <path d="M5 8h14v4l-3 3v7H8v-7l-3-3z" />
      <rect
        data-part="switch"
        x="11"
        y="17"
        width="2"
        height="2"
        fill={slot.accent}
        stroke="none"
        style={pivot("50% 100%")}
      />
    </g>
  ),
})
