"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "monitor-speaker": "boom" | "power" | "turn"
  }
}

/** 2 colors: monitor + speaker cabinet (primary), drivers and screen glow (accent). */
export const MonitorSpeaker = createAnimatedIcon({
  name: "monitor-speaker",
  family: "monitor",
  category: "devices",
  keywords: ["desktop audio", "speaker", "computer", "sound system", "studio monitor", "pc", "music"],
  slots: { primary: "monitor + cabinet", accent: "drivers + screen glow" },
  defaultVariant: "boom",
  variants: {
    // a bass drop: the woofer punches out twice, the cabinet squashes on each hit and the monitor
    // jumps on its foot from the shock
    boom: {
      duration: 1000,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.12, 0.35, 0.5, 0.75, 1], ease: "easeOut" as const }
        return Promise.all([
          animate("[data-part=woofer]", { scale: [1, 1.45, 0.9, 1.4, 0.95, 1] }, timing),
          animate("[data-part=tweeter]", { scale: [1, 1.6, 1, 1.5, 1, 1] }, timing),
          animate("[data-part=cabinet]", { scaleY: [1, 0.93, 1.03, 0.94, 1.02, 1] }, timing),
          animate(
            "[data-part=monitor]",
            { y: [0, -2, 0, -1.5, 0, 0], scaleY: [1, 1.04, 0.92, 1.03, 0.96, 1] },
            { ...timing, delay: seconds * 0.05, ease: "easeInOut" },
          ),
        ])
      },
    },
    // switched on: the screen glows, then the tweeter and the woofer pop on one after the other
    power: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=glow]", { opacity: [0, 1, 0.6, 0] }, { duration: seconds * 0.8, times: [0, 0.2, 0.6, 1], ease: "easeOut" }),
          animate(
            "[data-part=tweeter]",
            { scale: [1, 0, 0, 1.8, 1, 1] },
            { duration: seconds, times: [0, 0.1, 0.3, 0.45, 0.6, 1], ease: ["easeIn", "linear", ease.overshoot, "easeInOut", "linear"] },
          ),
          animate(
            "[data-part=woofer]",
            { scale: [1, 0, 0, 1.45, 1, 1] },
            { duration: seconds, times: [0, 0.1, 0.45, 0.62, 0.8, 1], ease: ["easeIn", "linear", ease.overshoot, "easeInOut", "linear"] },
          ),
        ]),
    },
    // the cabinet swivels to face the screen in 3D: it narrows and leans, the drivers sliding toward
    // the near edge, and the monitor nods back
    turn: {
      duration: 1200,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.35, 0.65, 1], ease: "easeInOut" as const }
        return Promise.all([
          animate("[data-part=cabinet]", { scaleX: [1, 0.5, 0.5, 1], skewY: [0, 12, 12, 0] }, timing),
          animate("[data-part=driver]", { x: [0, -1, -1, 0] }, timing),
          animate(
            "[data-part=monitor]",
            { rotate: [0, 0, 5, 0] },
            { duration: seconds, times: [0, 0.3, 0.55, 1], ease: ["linear", "easeOut", ease.overshoot] },
          ),
        ])
      },
    },
  },
  render: () => (
    <>
      <g data-part="monitor" style={pivot("50% 100%")}>
        <rect data-part="glow" x="3" y="7" width="5" height="8" fill={slot.accent} fillOpacity={0.25} stroke="none" style={flash()} />
        {/* a small screen seen from the side, open toward the speaker, on a neck and foot */}
        <path d="M8 6H2v10h6" />
        <path d="M5 16v4M3 20h4" />
      </g>
      <g data-part="cabinet" style={pivot("50% 100%")}>
        <path d="M12 3h10v18H12Z" />
        <g fill={slot.accent} stroke="none">
          {/* the drivers are round, so they are true circles */}
          <g data-part="driver">
            <circle data-part="tweeter" cx="17" cy="7.5" r="1" style={pivot("50% 50%")} />
          </g>
          <g data-part="driver">
            <circle data-part="woofer" cx="17" cy="15" r="2" style={pivot("50% 50%")} />
          </g>
        </g>
      </g>
    </>
  ),
})
