"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    usb: "insert" | "flip" | "wiggle"
  }
}

/** The cable runs 5 from the plug's foot (y 17) to the frame's bottom edge (y 22). */
const CABLE = 5

/**
 * The cable stays anchored to the frame's bottom edge while the plug moves: it stretches from its
 * top, which rides with the plug, by exactly the plug's rise.
 */
const stretch = (ys: number[]) => ys.map((y) => (CABLE - y) / CABLE)

/** 2 colors: plug + cable (primary), contact holes and power glow (accent). */
export const Usb = createAnimatedIcon({
  name: "usb",
  category: "devices",
  keywords: ["plug", "connector", "cable", "port", "charging", "flash drive", "thumb drive", "connect"],
  slots: { primary: "plug + cable", accent: "contact holes + power glow" },
  defaultVariant: "insert",
  variants: {
    // a wind-up, then the plug is pushed up into the port above, seats with a squash and lights up,
    // and is pulled back out (it slips out through the top of the frame, like into a socket)
    insert: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) => {
        const ys = [0, 1.5, -6, -6, -6, 0]
        const timing = { duration: seconds, times: [0, 0.15, 0.32, 0.4, 0.7, 1], ease: ["easeOut", "easeIn", "easeOut", "linear", "easeInOut"] satisfies Easing[] }
        return Promise.all([
          animate("[data-part=plug]", { y: ys }, timing),
          animate("[data-part=cable]", { scaleY: stretch(ys) }, timing),
          animate("[data-part=head]", { scaleY: [1, 1, 1, 0.9, 1, 1] }, timing),
          animate("[data-part=glow]", { opacity: [0, 0, 0, 1, 1, 0] }, timing),
        ])
      },
    },
    // the old joke: it won't go in, so it is spun round on its own axis, and then it goes in
    flip: {
      clip: true,
      duration: 1400,
      run: ({ animate, seconds }) => {
        const times = [0, 0.1, 0.18, 0.55, 0.68, 0.84, 1]
        const ys = [0, -2, 0, 0, -6, -6, 0]
        const ease = ["easeIn", "easeOut", "linear", "easeIn", "linear", "easeInOut"] satisfies Easing[]
        return Promise.all([
          animate("[data-part=plug]", { y: ys }, { duration: seconds, times, ease }),
          animate("[data-part=cable]", { scaleY: stretch(ys) }, { duration: seconds, times, ease }),
          // the bump that fails: squashed against the port
          animate("[data-part=head]", { scaleY: [1, 0.92, 1, 1] }, { duration: seconds, times: [0, 0.1, 0.2, 1], ease: "easeOut" }),
          animate(
            "[data-part=head]",
            { scaleX: [1, 1, 0, -1, 0, 1, 1] },
            { duration: seconds, times: [0, 0.2, 0.29, 0.38, 0.46, 0.55, 1], ease: ["linear", "easeIn", "easeOut", "easeIn", "easeOut", "linear"] },
          ),
          animate("[data-part=glow]", { opacity: [0, 0, 1, 1, 0] }, { duration: seconds, times: [0, 0.68, 0.72, 0.84, 1] }),
        ])
      },
    },
    // jiggled in the port: the plug rocks on its tip and the cable swings a beat behind it
    wiggle: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=plug]", { rotate: [0, -14, 12, -9, 6, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=cable]",
            { rotate: [0, 0, 10, -9, 7, -4, 2, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    // the plug rocks on its tip, the top of the metal shell
    <g data-part="plug" style={pivot("50% 0%")}>
      {/* the cable hangs from the plug's foot: it stretches and swings from there */}
      <path data-part="cable" d={`M12 17v${CABLE}`} style={pivot("50% 0%")} />
      <g data-part="head" style={pivot("50% 0%")}>
        {/* the grip, glowing while the plug is seated */}
        <rect data-part="glow" x="6" y="11" width="12" height="5" fill={slot.accent} fillOpacity={0.25} stroke="none" style={flash()} />
        <path d="M5 10h14v7H5Z" />
        {/* the metal shell, open at its foot where it meets the grip, with its two contact holes */}
        <path d="M6 10V2h12v8" />
        <rect x="9" y="5" width="2" height="2" fill={slot.accent} stroke="none" />
        <rect x="13" y="5" width="2" height="2" fill={slot.accent} stroke="none" />
      </g>
    </g>
  ),
})
