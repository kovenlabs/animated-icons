"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    rss: "broadcast" | "flip" | "ping"
  }
}

/**
 * Two quarter arcs round the dot, inner to outer. Each pivots on its own bottom-left corner, the arcs'
 * shared centre (5, 19), so a scale grows or shrinks its radius.
 */
const ARCS = [
  { part: "arc-1", d: "M5 11.5a7.5 7.5 0 0 1 7.5 7.5", pop: 1.15 },
  { part: "arc-2", d: "M5 4a15 15 0 0 1 15 15", pop: 1.1 },
] as const

const sel = (part: string) => `[data-part=${part}]`

/** 2 colors: arcs (primary), dot (accent). */
export const Rss = createAnimatedIcon({
  name: "rss",
  category: "social",
  keywords: ["feed", "subscribe", "blog", "news", "syndication", "podcast", "updates", "atom"],
  slots: { primary: "arcs", accent: "dot" },
  defaultVariant: "broadcast",
  variants: {
    // the dot fires and the arcs grow back out of it one after the other, each overshooting its place
    broadcast: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            sel("dot"),
            { scale: [1, 0.6, 1.7, 1] },
            { duration: seconds * 0.5, times: [0, 0.3, 0.6, 1], ease: ["easeIn", "easeOut", "easeInOut"] },
          ),
          ...ARCS.map(({ part, pop }, i) =>
            animate(
              sel(part),
              { scale: [1, 0.35, 0.35, pop, 1], opacity: [1, 0.15, 0.15, 1, 1] },
              {
                duration: seconds,
                times: [0, 0.15, 0.28 + i * 0.16, 0.5 + i * 0.16, 0.66 + i * 0.16],
                ease: [ease.in, "linear", ease.out, "easeInOut"],
              },
            ),
          ),
        ]),
    },
    // the whole badge turns a full revolution on its own diagonal, the arcs folding flat along it and
    // opening out again, and the dot gives a kick as it faces front
    flip: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            sel("flip"),
            { scaleY: [1, 0, -1, 0, 1] },
            { duration: seconds * 0.7, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate(
            sel("dot"),
            { scale: [1, 1, 1.7, 1] },
            { duration: seconds, times: [0, 0.66, 0.8, 1], ease: ["linear", "easeOut", ease.overshoot] },
          ),
        ]),
    },
    // the dot squashes and pings, and a shockwave runs out through the arcs and springs back
    ping: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            sel("dot"),
            { scaleX: [1, 1.3, 0.8, 1], scaleY: [1, 0.7, 1.4, 1] },
            { duration: seconds * 0.5, times: [0, 0.3, 0.6, 1], ease: "easeInOut" },
          ),
          ...ARCS.map(({ part }, i) =>
            animate(
              sel(part),
              { x: [0, 1.2, -0.4, 0], y: [0, -1.2, 0.4, 0] },
              { duration: seconds * 0.55, delay: seconds * (0.15 + i * 0.12), times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
            ),
          ),
        ]),
    },
  },
  render: () => (
    // the badge is symmetric about its diagonal through the dot: turned so that diagonal is level, the
    // `flip` group can turn the badge on it with a plain scaleY, then turned back
    <g transform="rotate(-45 5 19)">
      <g data-part="flip" style={pivot("50% 50%")}>
        <g transform="rotate(45 5 19)">
          {/* a feed's waves are round, so they are true arcs */}
          {ARCS.map(({ part, d }) => (
            <path key={part} data-part={part} d={d} style={pivot("0% 100%")} />
          ))}
          <rect data-part="dot" x="3.5" y="17.5" width="3" height="3" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
        </g>
      </g>
    </g>
  ),
})
