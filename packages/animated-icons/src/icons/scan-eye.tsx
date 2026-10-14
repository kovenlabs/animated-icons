"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "scan-eye": "scan" | "look" | "focus"
  }
}

/** The scan family's four corner brackets. */
const CORNERS = [
  { part: "tl", d: "M3 8V3h5" },
  { part: "tr", d: "M16 3h5v5" },
  { part: "br", d: "M21 16v5h-5" },
  { part: "bl", d: "M8 21H3v-5" },
] as const

/** 2 colors: viewfinder (primary), eye and scan beam (accent). */
export const ScanEye = createAnimatedIcon({
  name: "scan-eye",
  family: "scan",
  category: "security",
  keywords: ["retina scan", "iris scan", "biometric", "watch", "surveillance", "monitor", "view", "inspect"],
  slots: { primary: "viewfinder", accent: "eye + scan beam" },
  defaultVariant: "scan",
  variants: {
    // a beam sweeps down and back up; the eye flinches shut as it passes, then the viewfinder snaps on
    // and the pupil pops once the iris is read
    scan: {
      duration: 1400,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=beam]",
            { y: [-6.5, 6.5, -6.5], opacity: [0, 1, 1, 1, 0] },
            { duration: seconds * 0.7, ease: "easeInOut" },
          ),
          animate(
            "[data-part=eye]",
            { scaleY: [1, 1, 0.15, 1, 0.2, 1] },
            { duration: seconds * 0.7, times: [0, 0.15, 0.25, 0.5, 0.75, 0.9], ease: "easeInOut" },
          ),
          animate(
            "[data-part=brackets]",
            { scale: [1, 1, 0.84, 1.05, 1] },
            { duration: seconds, times: [0, 0.68, 0.8, 0.9, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=pupil]",
            { scale: [1, 1, 1.9, 1] },
            { duration: seconds, times: [0, 0.75, 0.87, 1], ease: ease.out },
          ),
        ]),
    },
    // the eyeball rolls left then right like a turning sphere: the almond narrows as it slides, the
    // pupil travels further than the lids, and the brackets drift the other way for depth
    look: {
      duration: 1400,
      run: ({ animate, seconds }) => {
        const times = [0, 0.2, 0.4, 0.6, 0.8, 1]
        return Promise.all([
          animate(
            "[data-part=eye]",
            { x: [0, -2, -2, 2, 2, 0], scaleX: [1, 0.8, 0.8, 0.8, 0.8, 1] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate("[data-part=pupil]", { x: [0, -1, -1, 1, 1, 0] }, { duration: seconds, times, ease: "easeInOut" }),
          animate(
            "[data-part=brackets]",
            { x: [0, 1, 1, -1, -1, 0] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
        ])
      },
    },
    // the brackets clamp in while the eye squints and recedes, then they spring back out and the eye
    // flies open with a dilated pupil
    focus: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=brackets]",
            { scale: [1, 0.82, 0.82, 1.06, 1] },
            { duration: seconds, times: [0, 0.3, 0.5, 0.7, 1], ease: [ease.in, "linear", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=eye]",
            { scaleX: [1, 0.75, 0.75, 1.2, 1], scaleY: [1, 0.3, 0.3, 1.2, 1] },
            { duration: seconds, times: [0, 0.3, 0.5, 0.72, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=pupil]",
            { scale: [1, 1, 1, 1.6, 1] },
            { duration: seconds, times: [0, 0.3, 0.5, 0.75, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="brackets" style={pivot("50% 50%")}>
        {CORNERS.map(({ part, d }) => (
          <path key={part} data-part={part} d={d} />
        ))}
      </g>
      <g data-part="eye" style={pivot("50% 50%")}>
        {/* the eye's almond, shrunk to sit 2 clear of the brackets */}
        <path d="M5 12l4-4h6l4 4-4 4H9z" stroke={slot.accent} />
        <rect
          data-part="pupil"
          x="11"
          y="11"
          width="2"
          height="2"
          fill={slot.accent}
          stroke="none"
          style={pivot("50% 50%")}
        />
      </g>
      <path data-part="beam" d="M6 12h12" stroke={slot.accent} style={flash()} />
    </>
  ),
})
