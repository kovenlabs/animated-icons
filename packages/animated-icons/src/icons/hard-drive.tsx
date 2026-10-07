"use client"

import type { Easing } from "motion/react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot, snap } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "hard-drive": "tumble" | "access" | "insert"
  }
}

/** Face swap at the moment the drive is edge-on (scaleY 0), lights hidden while its back faces you. */
const FACE = { times: [0, 0.25, 0.251, 0.75, 0.751, 1], ease: ["linear", snap, "linear", snap, "linear"] satisfies Easing[] }

/** The drive's top, end-on, shown around the moments it is edge-on, so the tumble has depth. */
const EDGE = { times: [0, 0.18, 0.25, 0.32, 0.68, 0.75, 0.82, 1] }
const EDGE_ON = [0, 0, 1, 0, 0, 1, 0, 0]

/** 2 colors: drive (primary), activity lights (accent). */
export const HardDrive = createAnimatedIcon({
  name: "hard-drive",
  category: "devices",
  keywords: ["disk", "hdd", "ssd", "storage", "drive", "server", "backup", "data"],
  slots: { primary: "drive", accent: "activity lights" },
  defaultVariant: "tumble",
  variants: {
    // tumbles head over heels on its horizontal axis, lifting toward you; its lights go dark while
    // its underside faces you
    tumble: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=turn]",
            { scaleY: [1, 0, -1, 0, 1] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate("[data-part=drive]", { y: [0, -2, 0], scale: [1, 1.12, 1] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=lights]", { opacity: [1, 1, 0, 0, 1, 1] }, { duration: seconds, ...FACE }),
          animate("[data-part=side]", { opacity: EDGE_ON }, { duration: seconds, ...EDGE }),
        ]),
    },
    // a burst of reads: the lights chatter and the drive hums in your hand
    access: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=drive]",
            { x: [0, -0.8, 0.8, -0.8, 0.8, -0.8, 0.8, 0], rotate: [0, -1.5, 1.5, -1.5, 1.5, -1.5, 1.5, 0] },
            { duration: seconds, ease: "linear" },
          ),
          animate("[data-part=light-1]", { opacity: [1, 0, 1, 0, 1, 1, 0, 1] }, { duration: seconds, ease: "linear" }),
          animate("[data-part=light-2]", { opacity: [1, 1, 0, 1, 0, 1, 1, 0, 1] }, { duration: seconds, ease: "linear" }),
        ]),
    },
    // pushed back into its bay until it is gone, then pulled out toward you, the lights waking last
    insert: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=drive]",
            { scale: [1, 0.45, 0.45, 1.12, 1], opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.35, 0.45, 0.8, 1], ease: ["easeIn", "linear", ease.out, "easeInOut"] },
          ),
          animate(
            "[data-part=lights]",
            { opacity: [1, 1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.35, 0.36, 0.8, 0.9, 1], ease: "linear" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="drive" style={pivot("50% 50%")}>
      {/* the drive's top, seen only while it is tumbled end-on */}
      <path data-part="side" d="M2 10h20v4H2Z" style={flash()} />
      <g data-part="turn" style={pivot("50% 50%")}>
        {/* the slanted top face reads as the drive's lid seen from above; the front panel below it */}
        <path d="M2 12 5 4h14l3 8v8H2Z" />
        <path d="M2 12h20" />
        <g data-part="lights" fill={slot.accent} stroke="none">
          <rect data-part="light-1" x="5" y="15" width="2" height="2" />
          <rect data-part="light-2" x="9" y="15" width="2" height="2" />
        </g>
      </g>
    </g>
  ),
})
