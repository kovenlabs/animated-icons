"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    siren: "spin" | "blare" | "buzz"
  }
}

/** The light rays around the dome, each with the unit direction it bursts out along. */
const RAYS = [
  { part: "ray-l", d: "M2 12h2", x: -1, y: 0, origin: "100% 50%" },
  { part: "ray-tl", d: "M4.5 4.5 6 6", x: -0.7, y: -0.7, origin: "100% 100%" },
  { part: "ray-t", d: "M12 2v2", x: 0, y: -1, origin: "50% 100%" },
  { part: "ray-tr", d: "M19.5 4.5 18 6", x: 0.7, y: -0.7, origin: "0% 100%" },
  { part: "ray-r", d: "M20 12h2", x: 1, y: 0, origin: "0% 50%" },
] as const

/** 2 colors: dome and base (primary), lamp and light rays (accent). */
export const Siren = createAnimatedIcon({
  name: "siren",
  category: "status",
  keywords: ["alarm", "emergency", "alert", "police", "beacon", "warning", "incident", "urgent"],
  slots: { primary: "dome + base", accent: "lamp + light rays" },
  defaultVariant: "spin",
  variants: {
    // a rotating beacon, twice round: the lamp slides to the right edge of the dome, narrowing as it turns
    // away, vanishes behind, comes back round from the left; the rays flash on whichever side it faces
    spin: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=lamp]",
            {
              x: [0, 2.2, -2.2, 0, 2.2, -2.2, 0],
              scaleX: [1, 0.3, 0.3, 1, 0.3, 0.3, 1],
              opacity: [1, 0, 0, 1, 0, 0, 1],
            },
            {
              duration: seconds,
              times: [0, 0.22, 0.28, 0.5, 0.72, 0.78, 1],
              ease: ["easeIn", snap, "easeOut", "easeIn", snap, "easeOut"],
            },
          ),
          ...["ray-r", "ray-tr"].map((part) =>
            animate(
              `[data-part=${part}]`,
              { opacity: [0, 1, 0, 0, 1, 0, 0], scale: [0.6, 1, 1.15, 0.6, 1, 1.15, 1.15] },
              { duration: seconds, times: [0, 0.08, 0.24, 0.5, 0.58, 0.74, 1], ease: "easeOut" },
            ),
          ),
          ...["ray-l", "ray-tl"].map((part) =>
            animate(
              `[data-part=${part}]`,
              { opacity: [0, 0, 1, 0, 0, 1, 0], scale: [0.6, 0.6, 1, 1.15, 0.6, 1, 1.15] },
              { duration: seconds, times: [0, 0.28, 0.34, 0.5, 0.78, 0.84, 1], ease: "easeOut" },
            ),
          ),
        ]),
    },
    // the siren stretches up and squashes down twice, blaring, and every ray bursts outward with each blast
    blare: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=siren]",
            { scaleY: [1, 1.12, 0.9, 1.1, 0.94, 1], scaleX: [1, 0.95, 1.06, 0.96, 1.03, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          ...RAYS.map(({ part, x, y }) =>
            animate(
              `[data-part=${part}]`,
              { opacity: [0, 1, 0, 1, 0], x: [0, 1.5 * x, 0, 1.5 * x, 0], y: [0, 1.5 * y, 0, 1.5 * y, 0] },
              { duration: seconds * 0.9, times: [0, 0.2, 0.45, 0.65, 1], ease: "easeOut" },
            ),
          ),
        ]),
    },
    // it buzzes on its base, rattling side to side while the lamp and rays flicker
    buzz: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=siren]",
            { x: [0, -1, 1, -1, 1, -1, 1, 0], rotate: [0, -4, 4, -4, 4, -3, 2, 0] },
            { duration: seconds, ease: "linear" },
          ),
          animate("[data-part=lamp]", { opacity: [1, 0.2, 1, 0.2, 1] }, { duration: seconds, ease: "linear" }),
          ...RAYS.map(({ part }) =>
            animate(`[data-part=${part}]`, { opacity: [0, 1, 0, 1, 0] }, { duration: seconds, ease: "linear" }),
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {RAYS.map(({ part, d, origin }) => (
          <path key={part} data-part={part} d={d} style={flash(origin)} />
        ))}
      </g>
      <g data-part="siren" style={pivot("50% 100%")}>
        {/* a siren's dome is round: a true arc on straight legs */}
        <path d="M8 17v-5a4 4 0 0 1 8 0v5" />
        <path d="M5 17h14v4H5z" />
        <path data-part="lamp" d="M12 12v5" stroke={slot.accent} style={pivot("50% 50%")} />
      </g>
    </>
  ),
})
