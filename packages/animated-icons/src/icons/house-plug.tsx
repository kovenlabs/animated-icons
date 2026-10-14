"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "house-plug": "unplug" | "charge" | "turn"
  }
}

/** 2 colors: house (primary), plug and cord (accent). */
export const HousePlug = createAnimatedIcon({
  name: "house-plug",
  category: "devices",
  keywords: ["smart home", "energy", "electricity", "power", "home charging", "utility", "plug", "grid"],
  slots: { primary: "house", accent: "plug + cord" },
  defaultVariant: "unplug",
  variants: {
    // yanked: the plug drops out through the open floor, then shoots back up into place and the house jolts
    unplug: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=plug]",
            { y: [0, 10, 10, -0.8, 0, 0] },
            {
              duration: seconds,
              times: [0, 0.3, 0.5, 0.72, 0.85, 1],
              ease: [ease.in, "linear", "easeOut", "easeInOut", "linear"],
            },
          ),
          animate(
            "[data-part=house]",
            { x: [0, 0, -0.8, 0.8, -0.4, 0], scaleY: [1, 1, 0.94, 1.02, 1, 1] },
            { duration: seconds, times: [0, 0.68, 0.76, 0.84, 0.92, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // power surges in: the prongs jump, the plug swells, and the house gives a thump
    charge: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=prong]",
            { scaleY: [1, 1.2, 0.85, 1.15, 1] },
            { duration: seconds * 0.8, ease: "easeInOut" },
          ),
          animate(
            "[data-part=plug]",
            { scale: [1, 1.12, 0.96, 1.08, 1] },
            { duration: seconds * 0.8, ease: "easeInOut" },
          ),
          animate(
            "[data-part=house]",
            { scaleY: [1, 0.92, 1.02, 1], scaleX: [1, 1.04, 0.99, 1] },
            { duration: seconds, times: [0, 0.3, 0.6, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the house swivels one way and the other; the plug hangs in front, so it slides against the walls
    turn: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=house]",
            { scaleX: [1, 0.6, 1, 0.6, 1], skewY: [0, 8, 0, -8, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=plug]", { x: [0, -1, 0, 1, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <g data-part="house" style={pivot("50% 100%")}>
      <path d="M3 11l9-8 9 8" />
      {/* no floor: the cord leaves the house through the bottom; the walls start inside the roof stroke */}
      <path d="M5 10v11M19 10v11" />
      <g data-part="plug" stroke={slot.accent} style={pivot("50% 37.5%")}>
        {/* prongs 2px clear of each other and of the roof's underside */}
        <path data-part="prong" d="M10 12v-2M14 12v-2" style={pivot("50% 100%")} />
        <path d="M9 12h6v3l-1.5 2.5h-3L9 15z" />
        <path d="M12 17.5V21" />
      </g>
    </g>
  ),
})
