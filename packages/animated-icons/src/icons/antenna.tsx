"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    antenna: "tune" | "sway" | "receive"
  }
}

/** The arcs' shared centre: the top of the mast. */
const CY = 11
const fmt = (n: number) => String(Math.round(n * 1000) / 1000)

/** A true arc of radius r over the mast, `half` degrees either side of straight up. */
function arc(r: number, half: number) {
  const a = (half * Math.PI) / 180
  const dx = r * Math.sin(a)
  const dy = r * Math.cos(a)
  return `M${fmt(12 - dx)} ${fmt(CY - dy)}A${r} ${r} 0 0 1 ${fmt(12 + dx)} ${fmt(CY - dy)}`
}

/** Inner to outer. The inner arc is kept narrow so its ends stay 2 clear of the top element. */
const WAVES = [
  { part: "wave-1", d: arc(4.5, 27) },
  { part: "wave-2", d: arc(8.5, 35) },
] as const

/** The elements, longest at the top, each centred on the mast. */
const ELEMENTS = ["M6 11h12", "M7.5 15h9", "M9 19h6"]

const sel = (part: string) => `[data-part=${part}]`

/** 2 colors: mast and elements (primary), signal waves (accent). */
export const Antenna = createAnimatedIcon({
  name: "antenna",
  category: "devices",
  keywords: ["tv antenna", "aerial", "signal", "reception", "broadcast", "radio", "rooftop", "receiver"],
  slots: { primary: "mast + elements", accent: "signal waves" },
  defaultVariant: "tune",
  variants: {
    // the elements twist a full turn round the mast one after another, top to bottom, like the aerial
    // being turned to find the signal, and the waves light up once it is found
    tune: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            sel("element"),
            { scaleX: [1, 0, -1, 0, 1] },
            { duration: seconds * 0.55, delay: stagger(seconds * 0.08), ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          ...WAVES.map(({ part }, i) =>
            animate(
              sel(part),
              { opacity: [1, 0.15, 0.15, 1, 1], scale: [1, 0.8, 0.8, 1.15, 1] },
              {
                duration: seconds,
                times: [0, 0.1, 0.66 + i * 0.1, 0.8 + i * 0.1, 0.9 + i * 0.1],
                ease: ["easeOut", "linear", "easeOut", "easeInOut"],
              },
            ),
          ),
        ]),
    },
    // a gust bends the aerial on its foot; the elements lag behind on the mast and settle after it
    sway: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            sel("antenna"),
            { rotate: [0, -10, 7, -4, 2, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            sel("element"),
            { rotate: [0, 8, -7, 4, -2, 0] },
            { duration: seconds * 0.9, delay: seconds * 0.1, ease: "easeInOut" },
          ),
        ]),
    },
    // the signal comes in from far off: each wave drops in from above, shrinking into place, outer
    // first, and the elements light up down the mast as it arrives
    receive: {
      duration: 1200,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...[...WAVES].reverse().map(({ part }, k) =>
            animate(
              sel(part),
              { opacity: [1, 0, 0, 1, 1], y: [0, 0, -3, 0, 0], scale: [1, 1, 1.3, 0.95, 1] },
              {
                duration: seconds,
                times: [0, 0.12, 0.14 + k * 0.16, 0.4 + k * 0.16, 0.52 + k * 0.16],
                ease: ["easeIn", "linear", ease.out, "easeInOut"],
              },
            ),
          ),
          animate(
            sel("element"),
            { scaleX: [1, 1.25, 1], opacity: [1, 0.4, 1] },
            { duration: seconds * 0.3, delay: stagger(seconds * 0.1, { startDelay: seconds * 0.55 }), ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="antenna" style={pivot("50% 100%")}>
      <g stroke={slot.accent}>
        {/* radio waves are round, so they are true arcs */}
        {WAVES.map(({ part, d }) => (
          <path key={part} data-part={part} d={d} style={pivot("50% 100%")} />
        ))}
      </g>
      <path d="M12 11v11" />
      {ELEMENTS.map((d) => (
        <path key={d} data-part="element" d={d} style={pivot("50% 50%")} />
      ))}
    </g>
  ),
})
