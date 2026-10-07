"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "scan-face": "turn" | "scan" | "focus"
  }
}

/** Each viewfinder corner, with the direction (x, y) that closes it in on the face. */
const CORNERS = [
  { part: "tl", d: "M3 8V3h5", x: 1, y: 1 },
  { part: "tr", d: "M16 3h5v5", x: -1, y: 1 },
  { part: "br", d: "M21 16v5h-5", x: -1, y: -1 },
  { part: "bl", d: "M8 21H3v-5", x: 1, y: -1 },
] as const

/** 2 colors: viewfinder (primary), face and scan line (accent). */
export const ScanFace = createAnimatedIcon({
  name: "scan-face",
  family: "scan",
  category: "security",
  keywords: ["face id", "face recognition", "biometric", "unlock", "authentication", "selfie", "identity", "scan"],
  slots: { primary: "viewfinder", accent: "face + scan line" },
  defaultVariant: "turn",
  variants: {
    // the head turns one way then the other, its features sliding and narrowing like a face rolled in
    // front of the camera (the mouth, nearer, travels further than the eyes), then the viewfinder snaps
    // onto it once it is recognized
    turn: {
      duration: 1400,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=eyes]",
            { x: [0, -2.5, -2.5, 2.5, 2.5, 0], scaleX: [1, 0.72, 0.72, 0.72, 0.72, 1] },
            { duration: seconds * 0.7, times: [0, 0.22, 0.38, 0.62, 0.78, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=mouth]",
            { x: [0, -3, -3, 3, 3, 0], scaleX: [1, 0.66, 0.66, 0.66, 0.66, 1] },
            { duration: seconds * 0.7, times: [0, 0.22, 0.38, 0.62, 0.78, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=frame]",
            { scale: [1, 1, 0.86, 1.03, 1] },
            { duration: seconds, times: [0, 0.7, 0.8, 0.9, 1], ease: "easeOut" },
          ),
        ]),
    },
    // a scan line sweeps down over the face and back up, and the face lights up once it has been read
    scan: {
      duration: 1300,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=beam]",
            { y: [-6.5, 6.5, -6.5], opacity: [0, 1, 1, 1, 0] },
            { duration: seconds * 0.75, ease: "easeInOut" },
          ),
          animate(
            "[data-part=face]",
            { scale: [1, 1, 1.18, 1] },
            { duration: seconds, times: [0, 0.75, 0.87, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the viewfinder hunts for focus: its corners close in, overshoot back out, then lock onto the face
    focus: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...CORNERS.map(({ part, x, y }) =>
            animate(
              `[data-part=${part}]`,
              { x: [0, 2.5 * x, -0.8 * x, 1.5 * x, 0], y: [0, 2.5 * y, -0.8 * y, 1.5 * y, 0] },
              { duration: seconds * 0.75, ease: "easeInOut" },
            ),
          ),
          animate(
            "[data-part=face]",
            { scale: [1, 1, 1.15, 1] },
            { duration: seconds, times: [0, 0.72, 0.86, 1], ease: ease.out },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="frame" style={pivot("50% 50%")}>
        {CORNERS.map(({ part, d }) => (
          <path key={part} data-part={part} d={d} />
        ))}
      </g>
      <g data-part="face" style={pivot("50% 50%")}>
        <g data-part="eyes" fill={slot.accent} stroke="none" style={pivot("50% 50%")}>
          <rect x="8" y="8" width="2" height="2" />
          <rect x="14" y="8" width="2" height="2" />
        </g>
        {/* a flat-bottomed smile */}
        <path data-part="mouth" d="M8 14l2 2h4l2-2" stroke={slot.accent} style={pivot("50% 50%")} />
      </g>
      <path data-part="beam" d="M6 12h12" stroke={slot.accent} style={flash()} />
    </>
  ),
})
