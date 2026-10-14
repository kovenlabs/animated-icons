"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "scan-heart": "scan" | "beat" | "flip"
  }
}

/** The scan family's four corner brackets. */
const CORNERS = [
  { part: "tl", d: "M3 8V3h5" },
  { part: "tr", d: "M16 3h5v5" },
  { part: "br", d: "M21 16v5h-5" },
  { part: "bl", d: "M8 21H3v-5" },
] as const

/** The faceted heart of the heart family, shrunk to sit 2 clear of the brackets. */
const HEART = "M12 17l-5-5v-2l2-2h1l2 2 2-2h1l2 2v2Z"

/** 2 colors: viewfinder (primary), heart and scan beam (accent). */
export const ScanHeart = createAnimatedIcon({
  name: "scan-heart",
  family: "scan",
  category: "health",
  keywords: ["health check", "heart rate", "cardio", "vitals", "monitor", "diagnosis", "fitness tracker", "pulse"],
  slots: { primary: "viewfinder", accent: "heart + scan beam" },
  defaultVariant: "scan",
  variants: {
    // a beam sweeps down and back up over the heart, the brackets snap in once it is read, and the
    // heart answers with a double beat
    scan: {
      duration: 1500,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=beam]",
            { y: [-5, 5, -5], opacity: [0, 1, 1, 1, 0] },
            { duration: seconds * 0.6, ease: "easeInOut" },
          ),
          animate(
            "[data-part=brackets]",
            { scale: [1, 1, 0.86, 1.04, 1] },
            { duration: seconds, times: [0, 0.58, 0.68, 0.78, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=heart]",
            { scale: [1, 1, 1.22, 1, 1.18, 1] },
            { duration: seconds, times: [0, 0.62, 0.72, 0.8, 0.88, 1], ease: "easeOut" },
          ),
        ]),
    },
    // beats hard twice, and each beat throbs out through the viewfinder like an echo
    beat: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const times = [0, 0.14, 0.28, 0.42, 0.62, 1]
        return Promise.all([
          animate(
            "[data-part=heart]",
            { scale: [1, 1.2, 0.95, 1.25, 0.97, 1] },
            { duration: seconds, times, ease: ["easeOut", "easeIn", "easeOut", "easeIn", "easeInOut"] },
          ),
          animate(
            "[data-part=brackets]",
            { scale: [1, 1, 1.04, 0.98, 1.05, 1] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
        ])
      },
    },
    // the brackets clamp in as the heart turns over on its upright axis in perspective, then spring
    // back out as it faces you again with a pop
    flip: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=brackets]",
            { scale: [1, 0.86, 0.86, 1.05, 1] },
            { duration: seconds, times: [0, 0.2, 0.65, 0.8, 1], ease: [ease.in, "linear", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=heart]",
            {
              scaleX: [1, 0, -1, 0, 1, 1],
              skewY: [0, 10, 0, -10, 0, 0],
              scale: [1, 0.9, 0.9, 0.9, 1.15, 1],
            },
            { duration: seconds, times: [0, 0.2, 0.35, 0.5, 0.72, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut", ease.overshoot] },
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
      <path data-part="heart" d={HEART} stroke={slot.accent} style={pivot("50% 50%")} />
      <path data-part="beam" d="M7 12h10" stroke={slot.accent} style={flash()} />
    </>
  ),
})
