"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    tv: "power" | "tune" | "hop"
  }
}

/** 2 colors: set (primary), antenna, picture beam and glow (accent). */
export const Tv = createAnimatedIcon({
  name: "tv",
  category: "devices",
  keywords: ["television", "screen", "broadcast", "channel", "streaming", "show", "display"],
  slots: { primary: "set", accent: "antenna + picture beam + glow" },
  defaultVariant: "power",
  variants: {
    // switched on like an old tube: a bright line opens across the middle, then the picture blooms out of it
    power: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=beam]", { scaleX: [0, 1, 1] }, { duration: seconds * 0.6, times: [0, 0.5, 1], ease: ease.out }),
          animate(
            "[data-part=beam]",
            { opacity: [0, 1, 1, 0] },
            { duration: seconds * 0.6, times: [0, 0.1, 0.6, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=glow]",
            { scaleY: [0, 0, 1, 1], opacity: [0, 0, 1, 0] },
            { duration: seconds, times: [0, 0.3, 0.6, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the rabbit ears are jiggled for a better signal, swinging on their foot
    tune: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate("[data-part=antenna]", { rotate: [0, -14, 11, -7, 4, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the set hops and lands with a squash; the antenna lags the landing
    hop: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=tv]",
            { y: [0, -2.5, 0, 0], scaleY: [1, 1.04, 0.94, 1] },
            { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=antenna]",
            { rotate: [0, 0, 10, -6, 0] },
            { duration: seconds, times: [0, 0.45, 0.65, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="tv" style={pivot("50% 100%")}>
      {/* the ears meet on the top of the set and swing from there */}
      <path data-part="antenna" d="M8 3l4 4 4-4" stroke={slot.accent} style={pivot("50% 100%")} />
      <path d="M2 7h20v14H2Z" />
      {/* the screen's inside: the set's stroke has its inner edge at 3..21 × 8..20 */}
      <rect data-part="glow" x="3" y="8" width="18" height="12" fill={slot.accent} fillOpacity={0.2} stroke="none" style={flash()} />
      <path data-part="beam" d="M6 14h12" stroke={slot.accent} style={flash()} />
    </g>
  ),
})
