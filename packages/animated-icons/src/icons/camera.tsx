"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    camera: "shutter" | "focus" | "flash"
  }
}

/** 3 colors: body (primary), lens (secondary), flash (accent). */
export const Camera = createAnimatedIcon({
  name: "camera",
  category: "media",
  keywords: ["photo", "picture", "snapshot", "capture", "shoot", "photography"],
  slots: { primary: "body", secondary: "lens", accent: "flash" },
  defaultVariant: "shutter",
  variants: {
    // the lens closes to a pinhole and reopens while the flash fires
    shutter: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=lens]",
            { scale: [1, 0.25, 1] },
            { duration: seconds, times: [0, 0.3, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=flash]",
            { scale: [1, 1.5, 1] },
            { duration: seconds * 0.6, delay: seconds * 0.15, ease: ease.out },
          ),
        ]),
    },
    // the lens zooms in, overshoots back and settles on its subject
    focus: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=lens]",
          { scale: [1, 1.15, 0.92, 1] },
          { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // a pre-flash, then the real one
    flash: {
      duration: 650,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=flash]",
            { scale: [1, 1.5, 1, 2, 1] },
            { duration: seconds, times: [0, 0.15, 0.35, 0.55, 1], ease: "easeOut" },
          ),
          // the iris reacts to the main flash
          animate(
            "[data-part=lens]",
            { scale: [1, 1, 1, 0.8, 1] },
            { duration: seconds, times: [0, 0.15, 0.35, 0.55, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* a box with a raised viewfinder hump, centred over the lens */}
      <path d="M2 6h4l2-3h6l2 3h6v15H2Z" />
      {/* a lens is round, so it gets a true circle */}
      <circle data-part="lens" cx="11" cy="13.5" r="3.5" stroke={slot.secondary} style={pivot("50% 50%")} />
      <rect data-part="flash" x="17" y="9" width="2" height="2" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
    </>
  ),
})
