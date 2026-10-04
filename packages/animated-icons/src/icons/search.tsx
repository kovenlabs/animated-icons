"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    search: "scan" | "look" | "zoom"
  }
}

/** 2 colors: lens and handle (primary), glint and scan line (accent). */
export const Search = createAnimatedIcon({
  name: "search",
  category: "actions",
  keywords: ["find", "magnifier", "magnifying glass", "lookup", "explore", "filter", "query"],
  slots: { primary: "lens + handle", accent: "glint + scan line" },
  defaultVariant: "scan",
  variants: {
    // a scan line sweeps down through the lens
    scan: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=scanline]",
            { y: [-4, 4], opacity: [0, 1, 1, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=glint]", { opacity: [1, 0, 0, 1] }, { duration: seconds, times: [0, 0.15, 0.85, 1] }),
        ]),
    },
    // the glass circles a little, hunting for something
    look: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=glass]",
          { x: [0, -2, 0, 2, 0], y: [0, -1.5, -2.5, -1.5, 0], rotate: [0, -6, 0, 6, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the lens magnifies and the glint redraws
    zoom: {
      duration: 650,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=glass]", { scale: [1, 1.12, 1] }, { duration: seconds, ease: ease.out }),
          animate(
            "[data-part=glint]",
            { pathLength: [0, 1] },
            { duration: seconds * 0.6, delay: seconds * 0.3, ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="glass" style={pivot("40% 40%")}>
      {/* a lens is round, so it gets a true circle */}
      <circle cx="10" cy="10" r="7" />
      <path d="M15 15l5.5 5.5" />
      <g stroke={slot.accent}>
        <path data-part="glint" d="M7 10a3 3 0 0 1 3-3" />
        <path data-part="scanline" d="M7 10h6" style={flash()} />
      </g>
    </g>
  ),
})
