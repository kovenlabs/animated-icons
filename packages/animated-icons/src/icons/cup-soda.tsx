"use client"

import { type Easing, stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "cup-soda": "sip" | "fizz" | "spin"
  }
}

/** 2 colors: cup and lid (primary), straw and soda (accent). */
export const CupSoda = createAnimatedIcon({
  name: "cup-soda",
  category: "food",
  keywords: ["soda", "soft drink", "cola", "fountain drink", "straw", "beverage", "takeaway", "fast food"],
  slots: { primary: "cup + lid", accent: "straw + soda" },
  defaultVariant: "sip",
  variants: {
    // a long sip: the cup pinches in as the soda drains, the straw twitches, then the level springs back
    // up and fizzes
    sip: {
      duration: 1300,
      run: ({ animate, seconds }) => {
        const beat = {
          duration: seconds,
          times: [0, 0.4, 0.55, 0.8, 1],
          ease: ["easeInOut", "linear", ease.out, "easeInOut"] satisfies Easing[],
        }
        return Promise.all([
          animate("[data-part=soda]", { y: [0, 3, 3, -0.6, 0] }, beat),
          animate("[data-part=turn]", { scaleX: [1, 0.92, 0.92, 1.03, 1] }, beat),
          animate("[data-part=straw]", { rotate: [0, -6, 4, 0, 0] }, beat),
          animate("[data-part=bubble]", { ...blink, y: [0, -1] }, {
            duration: seconds * 0.25,
            delay: stagger(seconds * 0.08, { startDelay: seconds * 0.72 }),
            ease: "easeOut",
          }),
        ])
      },
    },
    // freshly poured: bubbles rise, the surface churns and the straw wiggles while the cup trembles
    fizz: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=bubble]", { ...blink, y: [0, -1] }, {
            duration: seconds * 0.5,
            delay: stagger(seconds * 0.25),
            ease: "easeOut",
          }),
          animate("[data-part=soda]", { scaleY: [1, 1.4, 0.7, 1.25, 1] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=straw]", { rotate: [0, 12, -10, 6, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=cup]", { x: [0, -0.5, 0.5, -0.5, 0.5, 0] }, { duration: seconds, ease: "linear" }),
        ]),
    },
    // the cup hops and spins a full turn, the straw swinging round to the other side and back, lands with a
    // squash and the soda sloshes
    spin: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cup]",
            { y: [0, -1, -1, 0, 0], scaleY: [1, 1, 1, 0.9, 1], scaleX: [1, 1, 1, 1.06, 1] },
            { duration: seconds, times: [0, 0.15, 0.55, 0.7, 1], ease: ["easeOut", "linear", ease.in, "easeOut"] },
          ),
          animate(
            "[data-part=turn]",
            { scaleX: [1, 1, -1, 1, 1] },
            { duration: seconds, times: [0, 0.1, 0.35, 0.6, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=soda]",
            { skewY: [0, 0, 14, -10, 6, 0] },
            { duration: seconds, times: [0, 0.3, 0.5, 0.7, 0.85, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="cup" style={pivot("50% 100%")}>
      <g data-part="turn" style={pivot("50% 50%")}>
        {/* a bent straw rising from the lid, pivoting where it goes in */}
        <path data-part="straw" d="M12 8l1-5h3" stroke={slot.accent} style={pivot("0% 100%")} />
        {/* a tapered cup under an overhanging lid */}
        <path d="M3 8h18" />
        <path d="M5 8l2 14h10l2-14" />
        <path data-part="soda" d="M6 13h1l2.5 2 2.5-2 2.5 2 2.5-2h1" stroke={slot.accent} style={pivot("50% 50%")} />
        <g fill={slot.accent} stroke="none">
          <rect data-part="bubble" x="9" y="17.5" width="2" height="2" style={flash()} />
          <rect data-part="bubble" x="13" y="17.5" width="2" height="2" style={flash()} />
        </g>
      </g>
    </g>
  ),
})
