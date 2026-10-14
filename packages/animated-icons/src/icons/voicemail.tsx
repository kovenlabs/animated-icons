"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    voicemail: "walk" | "flip" | "rewind"
  }
}

/** The tape's slope when one reel stands 3 up: its rise over the 12 between the reels. */
const TILT = (Math.atan2(3, 12) * 180) / Math.PI

/** A reel: a true circle (it is round) round a square hub, which shows the reel turning. */
const reel = (side: "left" | "right", cx: number) => (
  <g data-part="reel" data-side={side} style={pivot("50% 100%")}>
    <circle cx={cx} cy="12" r="4" />
    <rect data-part="hub" x={cx - 1} y="11" width="2" height="2" fill={slot.accent} stroke="none" style={pivot("50% 50%")} />
  </g>
)

/** 2 colors: reels + tape (primary), hubs (accent). */
export const Voicemail = createAnimatedIcon({
  name: "voicemail",
  category: "communication",
  keywords: ["voice message", "answering machine", "tape", "recording", "message", "phone", "inbox"],
  slots: { primary: "reels + tape", accent: "hubs" },
  defaultVariant: "walk",
  variants: {
    // the reels waddle: each hops in turn, hubs spinning, and the tape between them tips like a seesaw
    walk: {
      duration: 1200,
      run: ({ animate, seconds }) => {
        const timing = { duration: seconds, times: [0, 0.2, 0.4, 0.5, 0.7, 0.9, 1] }
        const hop = [0, -3, 0, 0, 0, 0, 0]
        const squash = { scaleY: [1, 1.04, 0.86, 1, 1, 1, 1], scaleX: [1, 0.97, 1.03, 1, 1, 1, 1] }
        return Promise.all([
          animate("[data-part=reel][data-side=left]", { y: hop, ...squash }, { ...timing, ease: ["easeOut", ease.in, "easeOut", "linear", "linear", "linear"] }),
          animate(
            "[data-part=reel][data-side=right]",
            { y: [0, 0, 0, 0, -3, 0, 0], scaleY: [1, 1, 1, 1, 1.04, 0.86, 1], scaleX: [1, 1, 1, 1, 0.97, 1.03, 1] },
            { ...timing, ease: ["linear", "linear", "linear", "easeOut", ease.in, "easeOut"] },
          ),
          // the tape rises at whichever end has hopped, hinged on the reel still standing
          animate("[data-part=tape-hinge]", { rotate: [0, TILT, 0, 0, 0, 0, 0] }, { ...timing, ease: ["easeOut", ease.in, "linear", "linear", "linear", "linear"] }),
          animate("[data-part=tape]", { rotate: [0, 0, 0, 0, -TILT, 0, 0] }, { ...timing, ease: ["linear", "linear", "linear", "easeOut", ease.in, "linear"] }),
          animate("[data-part=hub]", { rotate: [0, 180, 180, 180, 360, 360, 360] }, { ...timing, ease: "easeInOut" }),
        ])
      },
    },
    // the tape turns over to side B in 3D, tipping through edge-on and back, hubs spinning as it goes
    flip: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=cassette]",
            {
              scaleY: [1, 0, -1, -1, 0, 1],
              scaleX: [1, 0.9, 1, 1, 0.9, 1],
              skewX: [0, 8, 0, 0, -8, 0],
            },
            {
              duration: seconds,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              ease: ["easeIn", "easeOut", "linear", "easeIn", ease.overshoot],
            },
          ),
          animate("[data-part=hub]", { rotate: [0, 360] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // fast rewind: the hubs whirl backwards and the reels pump in turn, the whole tape shuddering
    rewind: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=hub]", { rotate: [0, -720] }, { duration: seconds, ease: "easeInOut" }),
          animate(
            "[data-part=reel][data-side=left]",
            { scaleY: [1, 1.15, 0.92, 1.15, 0.92, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=reel][data-side=right]",
            { scaleY: [1, 0.92, 1.15, 0.92, 1.15, 1] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=cassette]",
            { y: [0, 0.6, -0.6, 0.6, -0.6, 0.6, -0.6, 0] },
            { duration: seconds, ease: "linear" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="cassette" style={pivot("50% 50%")}>
      {reel("left", 6)}
      {reel("right", 18)}
      {/* the tape runs flat along the bottoms of the reels */}
      <g data-part="tape-hinge" style={pivot("100% 50%")}>
        <path data-part="tape" d="M6 16h12" style={pivot("0% 50%")} />
      </g>
    </g>
  ),
})
