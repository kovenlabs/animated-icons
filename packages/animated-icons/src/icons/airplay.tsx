"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    airplay: "send" | "roll" | "hop"
  }
}

/** 2 colors: screen (primary), triangle and screen glow (accent). */
export const Airplay = createAnimatedIcon({
  name: "airplay",
  category: "devices",
  keywords: ["screen mirroring", "stream", "cast", "apple tv", "wireless display", "project", "share screen"],
  slots: { primary: "screen", accent: "triangle + screen glow" },
  defaultVariant: "send",
  variants: {
    // the triangle shrinks away from you up into the screen, which flares as it receives it; a fresh
    // triangle then springs up in its place
    send: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          // it shrinks before it rises, so it is already clear of the screen's open edge when it passes it
          animate(
            "[data-part=triangle]",
            {
              scale: [1, 0.6, 0.35, 0, 0, 1.15, 1],
              y: [0, -1.5, -4, -4.5, 0, 0, 0],
              opacity: [1, 1, 0.7, 0, 0, 1, 1],
            },
            {
              duration: seconds,
              times: [0, 0.18, 0.34, 0.42, 0.66, 0.82, 1],
              ease: ["easeInOut", "easeIn", "easeIn", "linear", ease.out, "easeInOut"],
            },
          ),
          animate(
            "[data-part=glow]",
            { opacity: [0, 0, 1, 0] },
            { duration: seconds, times: [0, 0.36, 0.48, 0.8], ease: "easeOut" },
          ),
          animate(
            "[data-part=screen]",
            { scale: [1, 1, 1.06, 0.98, 1] },
            { duration: seconds, times: [0, 0.38, 0.5, 0.64, 0.78], ease: "easeOut" },
          ),
        ]),
    },
    // the screen rolls up into its top bar like a projector screen and drops back down with a bounce
    roll: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=screen]",
            { scaleY: [1, 0.08, 0.08, 1.06, 0.98, 1] },
            { duration: seconds, times: [0, 0.3, 0.42, 0.66, 0.82, 1], ease: ["easeIn", "linear", "easeIn", "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=glow]",
            { opacity: [0, 0, 1, 0] },
            { duration: seconds, times: [0, 0.6, 0.72, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the triangle crouches, springs up with a stretch and lands squashed; the screen lights as it lands
    hop: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=triangle-hop]",
            {
              y: [0, 0, -2, 0, 0, 0],
              scaleY: [1, 0.75, 1.15, 1, 0.82, 1],
              scaleX: [1, 1.15, 0.9, 1, 1.12, 1],
            },
            { duration: seconds, times: [0, 0.18, 0.45, 0.68, 0.8, 1], ease: ["easeOut", "easeOut", "easeIn", "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=glow]",
            { opacity: [0, 0, 1, 0] },
            { duration: seconds, times: [0, 0.66, 0.76, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <g data-part="screen" style={pivot("50% 0%")}>
        {/* the screen's bottom edge opens 3 either side of the triangle so its tip can sit inside */}
        <path d="M6 16H3V3h18v13h-3" />
        <rect data-part="glow" x="4" y="4" width="16" height="9" fill={slot.accent} fillOpacity={0.25} stroke="none" style={flash()} />
      </g>
      <g data-part="triangle-hop" style={pivot("50% 100%")}>
        <path data-part="triangle" d="M12 14l5.5 7h-11z" stroke={slot.accent} style={pivot("50% 0%")} />
      </g>
    </>
  ),
})
