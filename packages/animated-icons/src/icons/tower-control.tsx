"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "tower-control": "scan" | "beacon" | "sway"
  }
}

/** The cab: a wide band of glass flaring out over the shaft. */
const CAB = "M4 7h16l-2 6H6z"

/** 2 colors: tower (primary), window frames, glass and beacon (accent). */
export const TowerControl = createAnimatedIcon({
  name: "tower-control",
  category: "transport",
  keywords: ["air traffic control", "airport", "atc", "control tower", "aviation", "runway", "radar"],
  slots: { primary: "tower", accent: "window frames + beacon" },
  defaultVariant: "scan",
  variants: {
    // the cab turns on its shaft: the window frames sweep in to the middle and out again twice, as the beacon blinks
    scan: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=mullions]",
            { scaleX: [1, 0, 1, 0, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=cab]", { scaleX: [1, 0.9, 1, 0.9, 1] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=beacon]",
            { opacity: [1, 0.2, 1, 0.2, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // the beacon throbs twice and the whole cab lights up behind its frames with each flash
    beacon: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=beacon]",
            { scale: [1, 1.8, 1, 1.8, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=glass]",
            { opacity: [0, 0.35, 0, 0.35, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // a gust: the tower leans from its base and the heavy cab lags behind on top of the shaft
    sway: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tower]",
            { rotate: [0, -3, 2.5, -1.5, 0.5, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=cab]",
            { rotate: [0, -3, 3, -1.5, 0.5, 0] },
            { duration: seconds * 0.92, delay: seconds * 0.08, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="tower" style={pivot("50% 100%")}>
      <path d="M5 22h14" />
      <path d="M8 22v-9M16 22v-9" />
      <g data-part="cab" style={pivot("50% 100%")}>
        <path data-part="glass" d={CAB} fill={slot.accent} stroke="none" style={flash()} />
        <path d={CAB} />
        {/* two window frames, 2px clear of each other and of the raked sides, their ends tucked into the cab */}
        <g data-part="mullions" stroke={slot.accent} style={pivot("50% 50%")}>
          <path d="M10 8v4M14 8v4" />
        </g>
        <path d="M12 7V5" />
        <rect
          data-part="beacon"
          x="11"
          y="2"
          width="2"
          height="2"
          fill={slot.accent}
          stroke="none"
          style={pivot("50% 50%")}
        />
      </g>
    </g>
  ),
})
