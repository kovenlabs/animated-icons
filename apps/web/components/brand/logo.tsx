"use client"

// The product's mark, built with the library's own factory: the logo is the product working.
// The static SVGs (favicons, README) are generated from this geometry: scripts/build-brand.mts
import { createAnimatedIcon, ease, pivot, slot } from "@kovenlabs/animated-icons"
import { stagger } from "motion/react"

/** Fixed brand colors: the identity doesn't follow the theme's accent. Defined in globals.css. */
export const BRAND_COLORS = { secondary: "brand-trail", accent: "brand-accent" } as const

/**
 * Escape: the canvas leaves its top-right corner open, the set's badge idiom, and the accent badge
 * escapes through it along a motion trail. Canvas primary, trail secondary, badge accent.
 */
export const LogoMark = createAnimatedIcon({
  name: "logo",
  category: "status",
  slots: { primary: "canvas", secondary: "trail", accent: "badge" },
  defaultVariant: "launch",
  variants: {
    // the badge flies out of the canvas along the trail and lands in the corner
    launch: {
      duration: 900,
      clip: false,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=badge]",
            { x: [-9, 0], y: [9, 0], opacity: [0, 1], scale: [0.6, 1] },
            { duration: seconds * 0.6, ease: ease.overshoot },
          ),
          animate("[data-part=trail]", { opacity: [1, 0.2, 1] }, { duration: seconds * 0.55, delay: stagger(seconds * 0.12) }),
        ]),
    },
    // a quarter turn and a pop (a square looks the same a quarter turn back)
    pop: {
      duration: 600,
      run: ({ animate, seconds }) =>
        animate("[data-part=badge]", { rotate: [-90, 0], scale: [1, 1.25, 1] }, { duration: seconds, ease: ease.out }),
    },
  },
  render: () => (
    <>
      <path d="M13 3H3v18h18V11" />
      <g stroke={slot.secondary}>
        <path data-part="trail" d="M7.5 16.5l2-2" />
        <path data-part="trail" d="M11.5 12.5l2-2" />
      </g>
      <rect
        data-part="badge"
        x="16.5"
        y="2.5"
        width="5"
        height="5"
        fill={slot.accent}
        stroke="none"
        style={pivot("50% 50%")}
      />
    </>
  ),
})
