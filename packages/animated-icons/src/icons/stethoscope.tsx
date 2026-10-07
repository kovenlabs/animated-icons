"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    stethoscope: "listen" | "swing" | "flip"
  }
}

/** 2 colors: headset + tubing (primary), chest piece + heartbeat (accent). The heartbeat only exists in motion. */
export const Stethoscope = createAnimatedIcon({
  name: "stethoscope",
  category: "education",
  keywords: ["doctor", "medical", "health", "heartbeat", "checkup", "physician", "clinic", "diagnosis"],
  slots: { primary: "headset + tubing", accent: "chest piece + heartbeat" },
  defaultVariant: "listen",
  variants: {
    // the chest piece picks up a heartbeat: two beats, lub then dub, each sending out a pulse
    listen: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=chest]",
            { scale: [1, 1.45, 1, 1.3, 1] },
            { duration: seconds * 0.7, times: [0, 0.15, 0.4, 0.55, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=beat]",
            { opacity: [0, 1, 0, 1, 0], scale: [0.6, 1, 1.1, 1, 1.2] },
            { duration: seconds * 0.8, times: [0, 0.12, 0.4, 0.55, 1], ease: "easeOut" },
          ),
        ]),
    },
    // hung from the earpieces, it swings and settles
    swing: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=stethoscope]",
          { rotate: [0, 12, -8, 4, -1.5, 0] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the chest piece is flipped over twice like a coin, showing its bell then its diaphragm
    flip: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=chest]",
          { scaleX: [1, 0, -1, 0, 1, 0, -1, 0, 1], scale: [1, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    // hangs from between its earpieces
    <g data-part="stethoscope" style={pivot("26% 0%")}>
      {/* earpieces turned in, the headset narrowing to a point, the tubing down round and up */}
      <path d="M5 2H3v7l5 6 5-6V2h-2M8 15v3l3 3h6l3-3v-6" />
      {/* the chest piece is round: a true circle, sitting on the tubing's end */}
      <circle data-part="chest" cx="20" cy="10" r="2" stroke={slot.accent} style={pivot("50% 50%")} />
      <g stroke={slot.accent}>
        <path data-part="beat" d="M20 4.5V3" style={flash("50% 100%")} />
        <path data-part="beat" d="M16.5 6.5 15.5 5.5" style={flash("100% 100%")} />
      </g>
    </g>
  ),
})
