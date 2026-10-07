"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    microscope: "turn" | "focus" | "nod"
  }
}

/** 2 colors: stand (primary), tube + objective lens (accent). */
export const Microscope = createAnimatedIcon({
  name: "microscope",
  category: "education",
  keywords: ["science", "lab", "biology", "research", "magnify", "laboratory", "specimen", "zoom"],
  slots: { primary: "stand", accent: "tube + lens" },
  defaultVariant: "turn",
  variants: {
    // turned round on the bench like a turntable: edge-on, then facing the other way with its arm on
    // the left, edge-on again and home, hopping a little at each half turn
    turn: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=microscope]",
          { scaleX: [1, 0, -1, 0, 1], y: [0, -1.5, 0, -1.5, 0] },
          { duration: seconds, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
        ),
    },
    // the tube racks up, comes down onto the slide and settles in focus, the lens glinting as it lands
    focus: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tube]",
            { y: [0, -2.5, 1, 0], scaleY: [1, 1.04, 0.96, 1] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: ["easeOut", "easeIn", ease.overshoot] },
          ),
          animate(
            "[data-part=lens]",
            { scale: [1, 1, 1.6, 1] },
            { duration: seconds, times: [0, 0.65, 0.8, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the tube tips back on its arm to look up, then nods down at the slide and settles
    nod: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=tube]",
          { rotate: [0, 16, -8, 3, 0] },
          { duration: seconds, times: [0, 0.3, 0.6, 0.8, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <g data-part="microscope" style={pivot("50% 100%")}>
      {/* base, stage, and a C-shaped arm from the base round to the tube */}
      <path d="M4 21h16M7 17h12M13 7h3l3 3v7l-4 4" />
      {/* the tube hangs from the arm's tip: it tips about (13, 7), 5 of its 12 down */}
      <g data-part="tube" stroke={slot.accent} style={pivot("100% 41.67%")}>
        <path d="M7 2h6v10H7z" />
        <rect data-part="lens" x="9" y="12" width="2" height="2" fill={slot.accent} stroke="none" style={pivot("50% 0%")} />
      </g>
    </g>
  ),
})
