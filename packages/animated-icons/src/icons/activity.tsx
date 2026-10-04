"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    activity: "trace" | "beat" | "pulse"
  }
}

/** A flat line that spikes up, plunges down and settles: the peaks sit on y 5 and 19 so their miters stay inside. */
const TRACE = "M2 12h4l3-7 6 14 3-7h4"

/** 1 color. */
export const Activity = createAnimatedIcon({
  name: "activity",
  category: "charts",
  keywords: ["pulse", "heartbeat", "health", "monitor", "vitals", "ecg", "signal", "performance"],
  slots: { primary: "trace" },
  defaultVariant: "trace",
  variants: {
    // the trace fades and is written again from left to right, like a monitor sweep
    // (hidden while the stroke is too short to read)
    trace: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=trace]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.4, times: [0, 0.3, 0.4, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=trace]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds, times: [0, 0.12, 0.13, 1], ease: "linear" },
          ),
        ]),
    },
    // the spike jumps twice about the baseline, lub-dub
    beat: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=trace]",
          { scaleY: [1, 1.2, 0.95, 1.12, 1] },
          { duration: seconds, times: [0, 0.18, 0.36, 0.55, 1], ease: "easeInOut" },
        ),
    },
    // the trace dims and a bright pulse runs along it from left to right
    pulse: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=trace]",
            { opacity: [1, 0.25, 0.25, 1] },
            { duration: seconds, times: [0, 0.12, 0.85, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=pulse]",
            { pathLength: [0.3, 0.3], pathOffset: [0, 0.7], opacity: [0, 1, 1, 0] },
            { duration: seconds * 0.85, delay: seconds * 0.05, ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* scales about the baseline, so the flat ends stay put while the spike moves */}
      <path data-part="trace" d={TRACE} style={pivot("50% 50%")} />
      <path data-part="pulse" d={TRACE} style={flash()} />
    </>
  ),
})
