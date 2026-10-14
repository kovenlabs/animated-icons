"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    cable: "transmit" | "coil" | "turn"
  }
}

/**
 * The lead: down from the left plug's foot, a chamfered U-turn along the bottom, up the middle, a
 * second U-turn along the top, and down into the right plug.
 */
const LEAD = "M5 9v9l2 2h3l2-2V6l2-2h3l2 2v8"

/** 2 colors: lead (primary), plugs and signal (accent). */
export const Cable = createAnimatedIcon({
  name: "cable",
  category: "devices",
  keywords: ["cord", "wire", "connector", "lead", "adapter", "connection", "plug", "hdmi"],
  slots: { primary: "lead", accent: "plugs + signal" },
  defaultVariant: "transmit",
  variants: {
    // the left plug kicks, a signal races along the lead from end to end, and the right plug jolts
    // as it arrives
    transmit: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=plug-in]",
            { scaleY: [1, 0.7, 1.1, 1], scaleX: [1, 1.15, 0.95, 1] },
            { duration: seconds * 0.35, ease: "easeOut" },
          ),
          animate(
            "[data-part=signal]",
            { pathLength: [0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.15, 0.7, 1], ease: ["linear", "easeInOut", "linear"] },
          ),
          // hidden while the stroke is too short to read, so its square cap never shows as a dot
          animate(
            "[data-part=signal]",
            { opacity: [0, 0, 1, 1, 0] },
            { duration: seconds, times: [0, 0.17, 0.22, 0.75, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=plug-out]",
            { scaleY: [1, 1, 1.1, 0.85, 1], scaleX: [1, 1, 0.94, 1.1, 1] },
            { duration: seconds, times: [0, 0.65, 0.75, 0.88, 1], ease: "easeOut" },
          ),
        ]),
    },
    // squashed like a spring: the whole cable compresses, rebounds tall and thin, and settles
    coil: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cable]",
            { scaleY: [1, 0.68, 1.03, 0.96, 1], scaleX: [1, 1.14, 0.92, 1.03, 1] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.78, 1], ease: ["easeIn", "easeOut", "easeInOut", "easeOut"] },
          ),
          animate(
            "[data-part=plug-in]",
            { rotate: [0, 0, -10, 5, 0] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.78, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=plug-out]",
            { rotate: [0, 0, -10, 5, 0] },
            { duration: seconds, times: [0, 0.3, 0.55, 0.78, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // turned round: the cable spins a full face around its upright axis, leaning and shrinking into
    // the turn for perspective, and dips as it comes back to face you
    turn: {
      duration: 1200,
      run: ({ animate, seconds }) => {
        const times = [0, 0.1, 0.3, 0.5, 0.7, 0.88, 1]
        return Promise.all([
          animate(
            "[data-part=cable]",
            { scaleX: [1, 1, 0, -1, 0, 1, 1], skewY: [0, 0, -10, 0, 10, 0, 0] },
            { duration: seconds, times, ease: ["linear", "easeIn", "easeOut", "easeIn", "easeOut", "linear"] },
          ),
          animate(
            "[data-part=cable]",
            { y: [0, 0, 0, 0, 0, 0.8, 0], scaleY: [1, 1, 0.88, 1, 0.88, 0.92, 1] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
        ])
      },
    },
  },
  render: () => (
    <g data-part="cable" style={pivot("50% 50%")}>
      <path d={LEAD} />
      <path data-part="signal" d={LEAD} stroke={slot.accent} style={flash()} />
      <g stroke={slot.accent}>
        {/* the left plug points up: two prongs on a tapered head */}
        <g data-part="plug-in" style={pivot("50% 100%")}>
          <path d="M2 4h6v3l-1.5 2h-3L2 7Z" />
          <path d="M3 2v2M7 2v2" />
        </g>
        {/* the right plug hangs from the lead, prongs down */}
        <g data-part="plug-out" style={pivot("50% 0%")}>
          <path d="M17.5 14h3l1.5 2v3h-6v-3Z" />
          <path d="M17 19v2M21 19v2" />
        </g>
      </g>
    </g>
  ),
})
