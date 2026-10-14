"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    lamp: "click" | "wobble" | "glow"
  }
}

/** 2 colors: shade, stem and base (primary), pull cord and light (accent). */
export const Lamp = createAnimatedIcon({
  name: "lamp",
  category: "home",
  keywords: ["table lamp", "light", "lighting", "bedside", "desk lamp", "furniture", "interior"],
  slots: { primary: "shade + stand", accent: "pull cord + light" },
  defaultVariant: "click",
  variants: {
    // the cord is tugged and springs back, the shade jumps, and light bursts out from under it
    click: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cord]",
            { scaleY: [1, 1.6, 0.8, 1.1, 1] },
            { duration: seconds * 0.6, times: [0, 0.3, 0.6, 0.8, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=shade]",
            { y: [0, 0, -1, 0, 0], scaleX: [1, 1, 0.92, 1.06, 1], scaleY: [1, 1, 1.06, 0.94, 1] },
            { duration: seconds * 0.7, times: [0, 0.2, 0.45, 0.75, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=ray]",
            { opacity: [0, 1, 1, 0], scale: [0.3, 1.2, 1.3, 1.4] },
            { duration: seconds * 0.65, delay: seconds * 0.25, times: [0, 0.25, 0.7, 1], ease: "easeOut" },
          ),
        ]),
    },
    // bumped: the lamp rocks on its base, the shade lags on the stem and the cord swings like a pendulum
    wobble: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=lamp]", { rotate: [0, -8, 6, -3, 1, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=shade]",
            { rotate: [0, -6, 9, -5, 2, 0] },
            { duration: seconds, delay: seconds * 0.06, ease: "easeInOut" },
          ),
          animate(
            "[data-part=cord]",
            { rotate: [0, 22, -18, 12, -5, 0] },
            { duration: seconds, delay: seconds * 0.12, ease: "easeInOut" },
          ),
        ]),
    },
    // switched on with a thump: the lamp squashes and stretches, and light rings out from it twice
    glow: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=lamp]",
            { scaleY: [1, 0.86, 1.06, 0.97, 1], scaleX: [1, 1.1, 0.94, 1.02, 1] },
            { duration: seconds * 0.7, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=ray]",
            { opacity: [0, 1, 0, 1, 0], scale: [0.4, 1.3, 0.4, 1.4, 1.6] },
            { duration: seconds * 0.8, delay: seconds * 0.2, times: [0, 0.25, 0.45, 0.7, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=shade]",
            { y: [0, 0, -0.6, 0.4, 0] },
            { duration: seconds * 0.7, delay: seconds * 0.1, ease: ease.overshoot },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="lamp" style={pivot("50% 100%")}>
      <g stroke={slot.accent}>
        <path data-part="ray" d="M5 14l-2 3" style={flash("100% 0%")} />
        <path data-part="ray" d="M19 14l2 3" style={flash("0% 0%")} />
      </g>
      {/* the stem starts inside the shade's rim stroke, so its cap stays hidden as the shade hops */}
      <path d="M12 11.5V21M8 21h8" />
      <g data-part="shade" style={pivot("50% 100%")}>
        {/* a flat-topped trapezoid shade, the cord hanging from its lip */}
        <path d="M8 3h8l3 8H5Z" />
        <path data-part="cord" d="M16 11v4" stroke={slot.accent} style={pivot("50% 0%")} />
      </g>
    </g>
  ),
})
