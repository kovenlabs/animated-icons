"use client"

import { stagger } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "phone-call": "ring" | "talk" | "answer"
  }
}

/** The `phone` handset: earpiece top-left, mouthpiece bottom-right, faceted back. */
const HANDSET = "M3 3h5l2 5-2.5 2.5 6 6L16 14l5 2v5h-5l-7-3-3-3-3-7Z"

/**
 * Three short rays aimed away from (14, 10), in the corner the handset leaves open: up, diagonal and
 * right, each 4 out from that point. Each pivots on its inner end and pushes out along its own line.
 */
const RAYS = [
  { d: "M14 6V2", origin: "50% 100%", out: { x: 0, y: -1.5 } },
  { d: "M17 7l3-3", origin: "0% 100%", out: { x: 1, y: -1 } },
  { d: "M18 10h4", origin: "0% 50%", out: { x: 1.5, y: 0 } },
]

/** 2 colors: handset (primary), call rays (accent). */
export const PhoneCall = createAnimatedIcon({
  name: "phone-call",
  family: "phone",
  category: "communication",
  keywords: ["calling", "call", "telephone", "ringing", "contact", "on a call", "voice call"],
  slots: { primary: "handset", accent: "call rays" },
  defaultVariant: "ring",
  variants: {
    // the handset rattles in place while the rays dim and push out from it, then snap back bright
    ring: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=handset]",
            { rotate: [0, -12, 10, -8, 6, -3, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          ...RAYS.map(({ out }, i) =>
            animate(
              `[data-part=ray][data-ray="${i}"]`,
              { x: [0, out.x, 0, out.x, 0], y: [0, out.y, 0, out.y, 0], opacity: [1, 0.3, 1, 0.3, 1] },
              { duration: seconds * 0.85, delay: seconds * 0.05 * i, ease: "easeInOut" },
            ),
          ),
        ]),
    },
    // a conversation: the rays rise and fall in turn like a voice level, the handset still
    talk: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=ray]",
          { scale: [1, 0.35, 1, 0.6, 1] },
          { duration: seconds * 0.75, delay: stagger(seconds * 0.12), ease: "easeInOut" },
        ),
    },
    // picked up: the handset lifts and tips back, the rays go quiet, then it all settles
    answer: {
      duration: 850,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=handset]",
            { y: [0, -2.5, -2.5, 0], rotate: [0, -8, -8, 0] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=ray]",
            { opacity: [1, 0, 0, 1], scale: [1, 0.4, 0.4, 1] },
            { duration: seconds, times: [0, 0.2, 0.75, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <path data-part="handset" d={HANDSET} style={pivot("50% 50%")} />
      <g stroke={slot.accent}>
        {RAYS.map(({ d, origin }, i) => (
          <path key={d} data-part="ray" data-ray={i} d={d} style={pivot(origin)} />
        ))}
      </g>
    </>
  ),
})
