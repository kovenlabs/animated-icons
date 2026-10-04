"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    settings: "spin" | "tune" | "press"
  }
}

/** Eight parallel-sided teeth on a polygonal body, all straight segments. */
const GEAR =
  "M10.4 5.4V3h3.2v2.4l1.94.8 1.69-1.7 2.27 2.27-1.7 1.69.8 1.94H21v3.2h-2.4l-.8 1.94 1.7 1.69-2.27 2.27-1.69-1.7-1.94.8V21h-3.2v-2.4l-1.94-.8-1.69 1.7-2.27-2.27 1.7-1.69-.8-1.94H3v-3.2h2.4l.8-1.94-1.7-1.69L6.77 4.5l1.69 1.7z"

/** 2 colors: gear (primary), hub (accent). */
export const Settings = createAnimatedIcon({
  name: "settings",
  category: "actions",
  keywords: ["gear", "cog", "preferences", "options", "configure", "setup"],
  slots: { primary: "gear", accent: "hub" },
  defaultVariant: "spin",
  variants: {
    // one full, unhurried turn around a fixed hub
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate("[data-part=gear]", { rotate: [0, 360] }, { duration: seconds, ease: "easeInOut" }),
    },
    // dialled back and forth like a knob being adjusted
    tune: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=gear]", { rotate: [0, -30, 14, -5, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=hub]", { rotate: [0, 30, -14, 5, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // pressed like a button: the gear gives, the hub pops
    press: {
      duration: 600,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=gear]", { scale: [1, 0.9, 1.04, 1] }, { duration: seconds, ease: "easeOut" }),
          animate(
            "[data-part=hub]",
            { scale: [1, 1, 1.2, 1] },
            { duration: seconds, times: [0, 0.3, 0.6, 1], ease: ease.overshoot },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <path data-part="gear" d={GEAR} style={pivot("50% 50%")} />
      {/* a solid hex nut: reads as a hub even at 16px */}
      <path
        data-part="hub"
        d="M8.8 12l1.6-2.77h3.2L15.2 12l-1.6 2.77h-3.2z"
        fill={slot.accent}
        stroke="none"
        style={pivot("50% 50%")}
      />
    </>
  ),
})
