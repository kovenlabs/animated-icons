"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    speaker: "pump" | "spin" | "thump"
  }
}

/** Face swap at the moment the cabinet is edge-on (scaleX 0), held while its back faces you. */
const FACE = { times: [0, 0.25, 0.251, 0.75, 0.751, 1], ease: ["linear", snap, "linear", snap, "linear"] satisfies Easing[] }

/** The cabinet's side panel, shown around the moments it is edge-on, so the turn has depth. */
const EDGE = { times: [0, 0.18, 0.25, 0.32, 0.68, 0.75, 0.82, 1] }
const EDGE_ON = [0, 0, 1, 0, 0, 1, 0, 0]

/** 2 colors: cabinet (primary), cone, tweeter and back panel (accent). */
export const Speaker = createAnimatedIcon({
  name: "speaker",
  category: "media",
  keywords: ["audio", "sound", "music", "loudspeaker", "woofer", "bass", "hifi", "stereo"],
  slots: { primary: "cabinet", accent: "cone + tweeter + back panel" },
  defaultVariant: "pump",
  variants: {
    // two beats: the cone pumps out at you, its dust cap further than its rim, the tweeter flickers
    // and the cabinet swells with each hit
    pump: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=rim]", { scale: [1, 1.15, 0.92, 1.15, 0.92, 1] }, { duration: seconds, ease: "easeOut" }),
          animate("[data-part=cap]", { scale: [1, 1.9, 0.8, 1.9, 0.8, 1] }, { duration: seconds, ease: "easeOut" }),
          animate("[data-part=tweeter]", { scale: [1, 1.6, 1, 1.6, 1, 1] }, { duration: seconds, ease: "easeOut" }),
          animate("[data-part=cabinet]", { scale: [1, 1.03, 1, 1.03, 1, 1] }, { duration: seconds, ease: "easeOut" }),
        ]),
    },
    // the cabinet spins a full turn on its upright axis, lifting toward you, and shows its back
    // (a port and a vent) while it faces away
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=turn]",
            { scaleX: [1, 0, -1, 0, 1] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate("[data-part=cabinet]", { y: [0, -1.5, 0], scale: [1, 1.1, 1] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=front]", { opacity: [1, 1, 0, 0, 1, 1] }, { duration: seconds, ...FACE }),
          animate("[data-part=back]", { opacity: [0, 0, 1, 1, 0, 0] }, { duration: seconds, ...FACE }),
          animate("[data-part=side]", { opacity: EDGE_ON }, { duration: seconds, ...EDGE }),
        ]),
    },
    // one big bass hit: the cabinet squashes into the floor and stretches up, the cone kicks out,
    // and it all wobbles to a stop
    thump: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=body]",
            { scaleY: [1, 0.82, 1.12, 0.96, 1.02, 1], scaleX: [1, 1.1, 0.94, 1.03, 0.99, 1] },
            { duration: seconds, times: [0, 0.15, 0.4, 0.62, 0.82, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=rim]",
            { scale: [1, 0.85, 1.18, 0.95, 1] },
            { duration: seconds, times: [0, 0.15, 0.4, 0.65, 1], ease: ["easeOut", ease.overshoot, "easeInOut", "easeInOut"] },
          ),
          animate(
            "[data-part=cap]",
            { scale: [1, 0.7, 2, 0.9, 1] },
            { duration: seconds, times: [0, 0.15, 0.4, 0.65, 1], ease: ["easeOut", ease.overshoot, "easeInOut", "easeInOut"] },
          ),
        ]),
    },
  },
  render: () => (
    // the body squashes on the floor; the cabinet lifts and swells about its middle
    <g data-part="body" style={pivot("50% 100%")}>
      <g data-part="cabinet" style={pivot("50% 50%")}>
        {/* the cabinet's side panel, seen only while it is turned side-on */}
        <path data-part="side" d="M10 2h4v20h-4Z" style={flash()} />
        <g data-part="turn" style={pivot("50% 50%")}>
          <path d="M4 2h16v20H4Z" />
          <g data-part="front" fill={slot.accent}>
            {/* round drivers are true circles: a tweeter dot, and a woofer cone around its dust cap */}
            <circle data-part="tweeter" cx="12" cy="6" r="1" stroke="none" style={pivot("50% 50%")} />
            <circle data-part="rim" cx="12" cy="14" r="4" fill="none" stroke={slot.accent} style={pivot("50% 50%")} />
            <circle data-part="cap" cx="12" cy="14" r="1" stroke="none" style={pivot("50% 50%")} />
          </g>
          {/* the back: two vent slots over a bass port */}
          <g data-part="back" stroke={slot.accent} style={flash()}>
            <path d="M8 6h8M8 10h8" />
            <circle cx="12" cy="16" r="2" />
          </g>
        </g>
      </g>
    </g>
  ),
})
