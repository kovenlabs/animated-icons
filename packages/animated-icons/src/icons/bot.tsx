"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    bot: "blink" | "beep" | "tilt"
  }
}

/** 2 colors: head (primary), eyes, antenna light and signal (accent). */
export const Bot = createAnimatedIcon({
  name: "bot",
  category: "communication",
  keywords: ["robot", "assistant", "ai", "chatbot", "automation", "agent", "helper"],
  slots: { primary: "head", accent: "eyes + antenna light + signal" },
  defaultVariant: "blink",
  variants: {
    // both eyes shut and open, twice, the head dipping a little with each blink
    blink: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=eye]",
            { scaleY: [1, 0, 1, 1, 0, 1] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.55, 0.7, 0.85], ease: "easeInOut" },
          ),
          animate(
            "[data-part=bot]",
            { y: [0, 1, 0, 0, 1, 0] },
            { duration: seconds, times: [0, 0.15, 0.3, 0.55, 0.7, 0.85], ease: "easeInOut" },
          ),
        ]),
    },
    // the antenna light pops and sends out a signal on both sides
    beep: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=light]", { scale: [1, 1.2, 1] }, { duration: seconds * 0.6, ease: ease.overshoot }),
          animate("[data-part=signal]", blink, { duration: seconds * 0.8, delay: seconds * 0.15, ease: "easeOut" }),
        ]),
    },
    // tilts its head, curious, and straightens up
    tilt: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bot]",
          { rotate: [0, -12, -12, 4, 0] },
          { duration: seconds, times: [0, 0.3, 0.55, 0.8, 1], ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        <path data-part="signal" d="M8 2v2" style={flash()} />
        <path data-part="signal" d="M16 2v2" style={flash()} />
      </g>
      <g data-part="bot" style={pivot("50% 100%")}>
        <rect x="4" y="8" width="16" height="12" />
        {/* the antenna stands on the head; the ears are stubs off its sides */}
        <path d="M12 8V5M2 14h2M20 14h2" />
        <g fill={slot.accent} stroke="none">
          <rect data-part="light" x="11" y="2" width="2" height="2" style={pivot("50% 100%")} />
          <rect data-part="eye" x="8" y="12" width="2" height="4" style={pivot("50% 50%")} />
          <rect data-part="eye" x="14" y="12" width="2" height="4" style={pivot("50% 50%")} />
        </g>
      </g>
    </>
  ),
})
