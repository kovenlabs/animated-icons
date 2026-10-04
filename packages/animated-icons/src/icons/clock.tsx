"use client"

import { steps } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    clock: "sweep" | "tick" | "alarm"
  }
}

/** 2 colors: face (primary), hands and alarm lines (accent). */
export const Clock = createAnimatedIcon({
  name: "clock",
  category: "time",
  keywords: ["time", "watch", "hour", "schedule", "pending", "history", "alarm"],
  slots: { primary: "face", accent: "hands + alarm lines" },
  defaultVariant: "sweep",
  variants: {
    // the minute hand sweeps one unhurried hour round the dial
    sweep: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate("[data-part=minute]", { rotate: [0, 360] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the same hour, ticked off five minutes at a time
    tick: {
      duration: 1400,
      run: ({ animate, seconds }) =>
        animate("[data-part=minute]", { rotate: [0, 360] }, { duration: seconds, ease: steps(12) }),
    },
    // the alarm goes off: the clock rattles in place while the alarm lines flash at its shoulders
    alarm: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=clock]",
            { rotate: [0, -12, 12, -10, 8, -4, 0], x: [0, -0.5, 0.5, -0.5, 0.5, 0, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate("[data-part=ring]", blink, { duration: seconds * 0.8, delay: seconds * 0.1, ease: "easeOut" }),
        ]),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        <path data-part="ring" d="M2 4l2-2" style={flash("100% 100%")} />
        <path data-part="ring" d="M20 2l2 2" style={flash("0% 100%")} />
      </g>
      <g data-part="clock" style={pivot("50% 50%")}>
        {/* a clock face is round, so it gets a true circle */}
        <circle cx="12" cy="12" r="9" />
        <g stroke={slot.accent}>
          {/* the minute hand turns on its foot, the centre of the dial; the hour hand stays put */}
          <path data-part="minute" d="M12 12V7" style={pivot("50% 100%")} />
          <path d="M12 12h3.5" />
        </g>
      </g>
    </>
  ),
})
