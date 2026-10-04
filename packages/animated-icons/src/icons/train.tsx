"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    train: "chug" | "lights"
  }
}

/** 2 colors: locomotive (primary), headlights and beams (accent). */
export const TrainIcon = createAnimatedIcon({
  name: "train",
  category: "transport",
  keywords: ["railway", "metro", "subway", "locomotive", "transit", "commute", "tram"],
  slots: { primary: "locomotive", accent: "headlights + beams" },
  defaultVariant: "chug",
  variants: {
    // chugs down the line, rocking side to side on its rails
    chug: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=train]",
          { rotate: [0, -4, 4, -4, 4, 0], y: [0, -1, 0, -1, 0, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the headlights blink in turn, like a crossing signal, and throw their beams
    lights: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all(
          ["left", "right"].map((side, i) =>
            Promise.all([
              animate(
                `[data-part=${side}-light]`,
                { scale: [1, 1.3, 1] },
                { duration: seconds * 0.5, delay: seconds * 0.5 * i, ease: "easeInOut" },
              ),
              animate(
                `[data-part=${side}-beam]`,
                { opacity: [0, 1, 0] },
                { duration: seconds * 0.5, delay: seconds * 0.5 * i, ease: "easeInOut" },
              ),
            ]),
          ),
        ),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        <path data-part="left-beam" d="M3.5 14.5H2M3.5 11.5 2 10.5" style={flash("100% 50%")} />
        <path data-part="right-beam" d="M20.5 14.5H22M20.5 11.5l1.5-1" style={flash("0% 50%")} />
      </g>
      <g data-part="train" style={pivot("50% 100%")}>
        {/* a chamfered front, the windscreen hanging from the roof, two legs onto the rails */}
        <path d="M7 3h10l2 2.5v11L17 19H7l-2-2.5v-11Z" />
        <path d="M8 3v5h8V3" />
        <path d="M8 19l-2 3M16 19l2 3" />
        <g fill={slot.accent} stroke="none">
          <rect data-part="left-light" x="7.5" y="12.5" width="2.5" height="2.5" style={pivot("50% 50%")} />
          <rect data-part="right-light" x="14" y="12.5" width="2.5" height="2.5" style={pivot("50% 50%")} />
        </g>
      </g>
    </>
  ),
})
