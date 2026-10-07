"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "alarm-clock": "ring" | "turn" | "snooze"
  }
}

/** 2 colors: case + feet (primary), bells + hands (accent). */
export const AlarmClock = createAnimatedIcon({
  name: "alarm-clock",
  family: "alarm",
  category: "time",
  keywords: ["alarm", "wake up", "morning", "reminder", "ring", "clock", "snooze", "timer"],
  slots: { primary: "case + feet", accent: "bells + hands" },
  defaultVariant: "ring",
  variants: {
    // the alarm goes off: the clock rattles and hops on its feet, landing with a squash each time,
    // while the two bells hammer outwards in turn
    ring: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=alarm]",
            { y: [0, -2.5, 0, -2.5, 0, -1.5, 0], scaleY: [1, 1.04, 0.9, 1.04, 0.9, 1.02, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=body]",
            { rotate: [0, -10, 10, -10, 10, -10, 8, -6, 4, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          // each bell is struck away from the case, never into it
          animate(
            "[data-part=bell-left]",
            { x: [0, -1, 0, -1, 0, -1, 0, -1, 0], y: [0, -1, 0, -1, 0, -1, 0, -1, 0] },
            { duration: seconds * 0.9, ease: "easeInOut" },
          ),
          animate(
            "[data-part=bell-right]",
            { x: [0, 0, 1, 0, 1, 0, 1, 0, 1, 0], y: [0, 0, -1, 0, -1, 0, -1, 0, -1, 0] },
            { duration: seconds * 0.9, ease: "easeInOut" },
          ),
        ]),
    },
    // a turn on a turntable: the clock spins round its upright axis, shows its handless back, and comes
    // round to the front again, hopping as it goes
    turn: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=body]",
            { scaleX: [1, 0, -1, 0, 1] },
            { duration: seconds * 0.85, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          // the hands are on the face only: gone while the back is towards you
          animate(
            "[data-part=hands]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            {
              duration: seconds * 0.85,
              times: [0, 0.25, 0.251, 0.75, 0.751, 1],
              ease: ["linear", snap, "linear", snap, "linear"],
            },
          ),
          animate(
            "[data-part=alarm]",
            { y: [0, -2, 0, 0], scaleY: [1, 1.03, 0.92, 1] },
            { duration: seconds, times: [0, 0.4, 0.85, 1], ease: ["easeOut", "easeIn", "easeOut"] },
          ),
        ]),
    },
    // slapped quiet: the clock squashes flat under the blow, springs back taller, and the bells jump
    // and settle a beat later
    snooze: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=alarm]",
            { scaleY: [1, 0.72, 1.08, 0.96, 1], scaleX: [1, 1.15, 0.95, 1.02, 1] },
            { duration: seconds, times: [0, 0.15, 0.45, 0.7, 1], ease: ["easeOut", "easeOut", "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=bell-left]",
            { x: [0, 0, -1.5, 0], y: [0, 0, -2, 0] },
            { duration: seconds, times: [0, 0.2, 0.5, 1], ease: ["linear", "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=bell-right]",
            { x: [0, 0, 1.5, 0], y: [0, 0, -2, 0] },
            { duration: seconds, times: [0, 0.25, 0.55, 1], ease: ["linear", "easeOut", "easeInOut"] },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="alarm" style={pivot("50% 100%")}>
      <g data-part="body" style={pivot("50% 50%")}>
        {/* two bells capping the shoulders, clear of the case */}
        <g stroke={slot.accent}>
          <path data-part="bell-left" d="M2 6l4-4" />
          <path data-part="bell-right" d="M18 2l4 4" />
        </g>
        {/* a clock face is round, so it gets a true circle; the feet splay from its rim */}
        <circle cx="12" cy="13" r="8" />
        <path d="M6.5 18.5 4 21M17.5 18.5 20 21" />
        <path data-part="hands" d="M12 9v4h3" stroke={slot.accent} />
      </g>
    </g>
  ),
})
