"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    watch: "sweep" | "buzz" | "wake"
  }
}

/** Buzz ticks either side of the face, clear of its stroke. */
const BUZZ = ["M2.5 10v4", "M21.5 10v4"]

/** 2 colors: case + straps (primary), hands, buzz ticks and face light (accent). */
export const Watch = createAnimatedIcon({
  name: "watch",
  category: "devices",
  keywords: ["smartwatch", "wristwatch", "time", "wearable", "fitness", "clock", "wrist"],
  slots: { primary: "case + straps", accent: "hands + buzz ticks + face light" },
  defaultVariant: "sweep",
  variants: {
    // the minute hand sweeps one unhurried hour round the dial
    sweep: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate("[data-part=minute]", { rotate: [0, 360] }, { duration: seconds, ease: "easeInOut" }),
    },
    // a notification buzzes it side to side while the ticks flicker either side
    buzz: {
      duration: 600,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=watch]",
            { x: [0, -0.75, 0.75, -0.75, 0.75, -0.75, 0.75, 0], rotate: [0, -3, 3, -3, 3, -3, 3, 0] },
            { duration: seconds, ease: "linear" },
          ),
          animate("[data-part=buzz]", { opacity: [0, 1, 0.4, 1, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // raised to wake: the watch tips toward you and the face lights up
    wake: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=watch]",
            { rotate: [0, -14, 4, 0] },
            { duration: seconds, times: [0, 0.35, 0.7, 1], ease: "easeInOut" },
          ),
          animate("[data-part=glow]", { opacity: [0, 1, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {BUZZ.map((d) => (
          <path key={d} data-part="buzz" d={d} style={flash()} />
        ))}
      </g>
      <g data-part="watch" style={pivot("50% 50%")}>
        {/* tapered straps, each meeting the round case where it leaves it */}
        <path d="M9 6.8 10 2h4l1 4.8M9 17.2 10 22h4l1-4.8" />
        <circle data-part="glow" cx="12" cy="12" r="5" fill={slot.accent} fillOpacity={0.2} stroke="none" style={flash()} />
        {/* a watch face is round, so it gets a true circle */}
        <circle cx="12" cy="12" r="6" />
        <g stroke={slot.accent}>
          {/* the minute hand turns on its foot, the centre of the dial; the hour hand stays put */}
          <path data-part="minute" d="M12 12V9" style={pivot("50% 100%")} />
          <path d="M12 12h2" />
        </g>
      </g>
    </>
  ),
})
