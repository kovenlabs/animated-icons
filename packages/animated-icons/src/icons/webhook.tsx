"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    webhook: "relay" | "spin" | "flip"
  }
}

/**
 * Three hooks, turned 120° apart about (12, 13.5). Each is a half circle curled round a hook centre,
 * (12, 7), (17.63, 16.75) and (6.37, 16.75), open on the side facing the next hook (the hooks are round,
 * so they are true arcs). A straight line leaves each hook's centre through that open side and runs into
 * the start of the next hook's curl. Listed in the order an event travels: left to top, top to right,
 * right to left.
 */
const HOOKS = [
  "M6.37 16.75L8.54 9A4 4 0 0 1 15.46 5",
  "M12 7L17.63 12.75A4 4 0 0 1 17.63 20.75",
  "M17.63 16.75L9.83 18.75A4 4 0 0 1 2.91 14.75",
] as const

/** 2 colors: hooks (primary), the hook the event fires from (accent). */
export const Webhook = createAnimatedIcon({
  name: "webhook",
  category: "development",
  keywords: ["callback", "event", "integration", "api", "trigger", "endpoint", "notification", "automation"],
  slots: { primary: "hooks", accent: "firing hook" },
  defaultVariant: "relay",
  variants: {
    // an event is relayed round the ring: all three hooks let go, then each shoots out of the last one
    // and curls round the next, and the ring pops once it closes
    relay: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        Promise.all([
          ...HOOKS.map((_, i) => {
            const start = 0.14 + i * 0.22
            return Promise.all([
              animate(
                `[data-part=hook-${i + 1}]`,
                { pathLength: [1, 1, 0, 0, 1, 1] },
                {
                  duration: seconds,
                  times: [0, 0.08, 0.1, start, start + 0.24, 1],
                  ease: ["linear", "linear", "linear", "easeOut", "linear"],
                },
              ),
              // hidden while it's too short to read, so its cap never shows as a dot
              animate(
                `[data-part=hook-${i + 1}]`,
                { opacity: [1, 1, 0, 0, 1, 1] },
                { duration: seconds, times: [0, 0.08, 0.09, start, start + 0.02, 1], ease: "linear" },
              ),
            ])
          }),
          animate(
            "[data-part=ring]",
            { scale: [1, 1, 1.15, 1] },
            { duration: seconds, times: [0, 0.82, 0.9, 1], ease: ["linear", ease.out, ease.overshoot] },
          ),
        ]),
    },
    // the ring whirls a full turn, drawing in as it speeds up and overshooting as it lands
    spin: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ring]",
            { rotate: [0, 380, 352, 360] },
            { duration: seconds, times: [0, 0.6, 0.82, 1], ease: [ease.inOut, "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=ring]",
            { scale: [1, 0.8, 1.06, 1] },
            { duration: seconds, times: [0, 0.35, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // the ring turns over about its vertical axis like a coin, swelling as it stands edge-on
    flip: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=ring]",
          { scaleX: [1, 0, -1, 0, 1], scaleY: [1, 1.12, 1, 1.12, 1] },
          { duration: seconds, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
        ),
    },
  },
  render: () => (
    <g data-part="ring" style={pivot("50% 50%")}>
      {HOOKS.map((d, i) => (
        <path key={d} data-part={`hook-${i + 1}`} d={d} stroke={i === 0 ? slot.accent : undefined} />
      ))}
    </g>
  ),
})
