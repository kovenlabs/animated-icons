"use client"

import type { Easing } from "motion/react"
import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    plug: "insert" | "spark" | "twist"
  }
}

/** The cord runs 6 from the plug's foot (y 16) to the frame's bottom edge (y 22). */
const CORD = 6

/** The cord stays anchored to the frame's bottom edge: it stretches from its top by the plug's rise. */
const stretch = (ys: number[]) => ys.map((y) => (CORD - y) / CORD)

/** Sparks crackling round the prongs: one between them, one off each shoulder. */
const SPARKS = ["M12 2v2.5", "M4.5 4.5 3 3", "M19.5 4.5 21 3"]

/** 2 colors: body + cord (primary), prongs, glow and sparks (accent). */
export const Plug = createAnimatedIcon({
  name: "plug",
  category: "devices",
  keywords: ["power", "socket", "outlet", "electricity", "connect", "charger", "mains"],
  slots: { primary: "body + cord", accent: "prongs + glow + sparks" },
  defaultVariant: "insert",
  variants: {
    // winds back, rams up into the socket above the frame (the prongs slip out through the top),
    // seats with a squash and glows, then is pulled back out
    insert: {
      clip: true,
      duration: 1100,
      run: ({ animate, seconds }) => {
        const ys = [0, 1.5, -5, -5, -5, 0]
        const timing = {
          duration: seconds,
          times: [0, 0.15, 0.32, 0.4, 0.7, 1],
          ease: ["easeOut", ease.in, "easeOut", "linear", "easeInOut"] satisfies Easing[],
        }
        return Promise.all([
          animate("[data-part=plug]", { y: ys }, timing),
          animate("[data-part=cord]", { scaleY: stretch(ys) }, timing),
          animate("[data-part=head]", { scaleY: [1, 1.08, 1, 0.84, 1, 1], scaleX: [1, 0.95, 1, 1.1, 1, 1] }, timing),
          animate("[data-part=glow]", { opacity: [0, 0, 0, 1, 1, 0] }, timing),
        ])
      },
    },
    // live current: the plug shudders, the prongs flicker long and short, sparks crackle and the body
    // glows in two jolts
    spark: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=head]",
            { x: [0, -0.8, 0.8, -0.6, 0.6, -0.8, 0.8, 0], rotate: [0, -3, 3, -2, 2, -3, 2, 0] },
            { duration: seconds * 0.8, ease: "linear" },
          ),
          animate(
            "[data-part=prong]",
            { scaleY: [1, 1.3, 0.8, 1.25, 0.85, 1] },
            { duration: seconds * 0.8, delay: stagger(seconds * 0.05), ease: "easeInOut" },
          ),
          animate("[data-part=spark]", { ...blink, scale: [0.4, 1.3, 1.5] }, { duration: seconds * 0.35, delay: stagger(seconds * 0.12), ease: "easeOut" }),
          animate("[data-part=glow]", { opacity: [0, 1, 0.2, 1, 0] }, { duration: seconds, times: [0, 0.15, 0.35, 0.55, 1], ease: "easeOut" }),
        ]),
    },
    // spun round on its own cord: the head turns a full face around its upright axis, leaning into the
    // turn for perspective, while the cord twists after it
    twist: {
      duration: 1200,
      run: ({ animate, seconds }) => {
        const times = [0, 0.12, 0.3, 0.48, 0.66, 0.84, 1]
        return Promise.all([
          animate(
            "[data-part=head]",
            { scaleX: [1, 1, 0, -1, 0, 1, 1], skewY: [0, 0, 12, 0, -12, 0, 0] },
            { duration: seconds, times, ease: ["linear", "easeIn", "easeOut", "easeIn", "easeOut", "linear"] },
          ),
          animate("[data-part=plug]", { y: [0, 1, -2, -2, -1, 0.5, 0] }, { duration: seconds, times, ease: "easeInOut" }),
          animate("[data-part=cord]", { scaleY: stretch([0, 1, -2, -2, -1, 0.5, 0]) }, { duration: seconds, times, ease: "easeInOut" }),
          animate(
            "[data-part=cord]",
            { skewX: [0, 0, -14, 10, -8, 4, 0] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
        ])
      },
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {SPARKS.map((d) => (
          <path key={d} data-part="spark" d={d} style={flash()} />
        ))}
      </g>
      <g data-part="plug">
        {/* the cord hangs from the plug's foot: it stretches and twists from there */}
        <path data-part="cord" d={`M12 16v${CORD}`} style={pivot("50% 0%")} />
        <g data-part="head" style={pivot("50% 50%")}>
          <rect data-part="glow" x="7" y="9" width="10" height="3" fill={slot.accent} fillOpacity={0.35} stroke="none" style={flash()} />
          {/* a square shoulder that tapers to the cord in two straight chamfers */}
          <path d="M5 7h14v5l-3 4H8l-3-4Z" />
          <g stroke={slot.accent}>
            <path data-part="prong" d="M9 2v5" style={pivot("50% 100%")} />
            <path data-part="prong" d="M15 2v5" style={pivot("50% 100%")} />
          </g>
        </g>
      </g>
    </>
  ),
})
