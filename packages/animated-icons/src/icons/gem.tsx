"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    gem: "glint" | "spin" | "drop"
  }
}

/** 2 colors: stone (primary), facets and glints (accent). */
export const Gem = createAnimatedIcon({
  name: "gem",
  category: "commerce",
  keywords: ["diamond", "jewel", "premium", "crystal", "luxury", "pro plan", "value", "ruby"],
  slots: { primary: "stone", accent: "facets + glints" },
  defaultVariant: "glint",
  variants: {
    // lifted toward you, the stone turns a little: its facets shear across it as if seen from another
    // angle, then back, and the light catches a corner in two twinkles
    glint: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=gem]",
            { scale: [1, 1.12, 1.12, 1], y: [0, -1, -1, 0] },
            { duration: seconds, times: [0, 0.25, 0.75, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=facets]",
            { skewX: [0, -9, 7, 0] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
          animate("[data-part=glint]", blink, { duration: seconds * 0.4, delay: seconds * 0.35, ease: "easeOut" }),
          animate("[data-part=twinkle]", blink, { duration: seconds * 0.35, delay: seconds * 0.55, ease: "easeOut" }),
        ]),
    },
    // flipped into the air, it turns a full circle about its vertical axis, lands with a squash and
    // flashes
    spin: {
      duration: 1250,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=turn]",
            { scaleX: [1, 1, 0, -1, 0, 1, 1] },
            {
              duration: seconds,
              times: [0, 0.1, 0.25, 0.4, 0.55, 0.7, 1],
              ease: ["linear", "easeIn", "easeOut", "easeIn", "easeOut", "linear"],
            },
          ),
          animate(
            "[data-part=gem]",
            { y: [0, -3.5, 0, 0, 0], scaleY: [1, 1.05, 1, 0.86, 1], scaleX: [1, 0.97, 1, 1.08, 1] },
            { duration: seconds, times: [0, 0.4, 0.7, 0.8, 1], ease: ["easeOut", "easeIn", "easeOut", "easeInOut"] },
          ),
          animate("[data-part=glint]", blink, { duration: seconds * 0.35, delay: seconds * 0.7, ease: "easeOut" }),
        ]),
    },
    // dropped in from above the frame, it bounces once, squashing on each landing, and glints
    drop: {
      duration: 1100,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=gem]",
            { y: [-22, 0, 0, -4, 0, 0], scaleY: [1, 1, 0.8, 1.04, 0.92, 1], scaleX: [1, 1, 1.12, 0.97, 1.05, 1] },
            { duration: seconds, times: [0, 0.35, 0.45, 0.62, 0.8, 1], ease: [ease.in, "easeOut", "easeOut", "easeIn", "easeOut"] },
          ),
          animate("[data-part=glint]", blink, { duration: seconds * 0.3, delay: seconds * 0.7, ease: "easeOut" }),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="gem" style={pivot("50% 100%")}>
        <g data-part="turn" style={pivot("50% 50%")}>
          {/* a flat table, a crown sloping out to the girdle, a pavilion to the point */}
          <path d="M6 3h12l4 6-10 13L2 9zM2 9h20" />
          {/* the facets shear from the point, which stays put, so their ends stay on the outline */}
          <path data-part="facets" d="M10 3 8 9l4 13 4-13-2-6" stroke={slot.accent} style={pivot("50% 100%")} />
        </g>
      </g>
      <g stroke={slot.accent}>
        {/* glints over the table's corners: they exist only in motion */}
        <path data-part="glint" d="M19 1v6M16 4h6" style={flash()} />
        <path data-part="twinkle" d="M5 1.5v3M3.5 3h3" style={flash()} />
      </g>
    </>
  ),
})
