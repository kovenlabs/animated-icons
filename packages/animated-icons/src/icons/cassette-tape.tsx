"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "cassette-tape": "flip" | "wind" | "pop"
  }
}

/** 2 colors: shell (primary), reels and tape (accent). */
export const CassetteTape = createAnimatedIcon({
  name: "cassette-tape",
  category: "media",
  keywords: ["cassette", "tape", "mixtape", "audio", "retro", "music", "recording", "80s"],
  slots: { primary: "shell", accent: "reels + tape" },
  defaultVariant: "flip",
  variants: {
    // tossed and turned over to side B: it lifts, turns a full circle on its vertical axis (the shell
    // leans into perspective each time it goes edge-on), lands with a squash and the reels give a kick
    flip: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=turn]",
            { scaleX: [1, 0, -1, 0, 1], skewY: [0, 14, 0, -14, 0] },
            { duration: seconds * 0.7, delay: seconds * 0.08, ease: "easeInOut" },
          ),
          animate(
            "[data-part=cassette]",
            { y: [0, -3, 0, 0], scaleY: [1, 1.04, 0.88, 1] },
            { duration: seconds * 0.95, times: [0, 0.45, 0.82, 1], ease: ["easeOut", "easeIn", ease.overshoot] },
          ),
          animate(
            "[data-part=reel]",
            { scale: [1, 1, 1.35, 1] },
            { duration: seconds, times: [0, 0.78, 0.9, 1], ease: "easeOut" },
          ),
        ]),
    },
    // play: the tape winds from the left reel onto the right one. Each reel grows or shrinks about its
    // bottom, where the tape leaves it, so the tape stays tangent to both
    wind: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=reel-l]",
            { scale: [1, 0.6, 0.6, 1] },
            { duration: seconds, times: [0, 0.6, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=reel-r]",
            { scale: [1, 1.3, 1.3, 1] },
            { duration: seconds, times: [0, 0.6, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=cassette]",
            { rotate: [0, -2, 2, -2, 2, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // held up to the camera: it comes toward you, tipping, then drops back into place
    pop: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=cassette]",
          { scale: [1, 1.3, 1], y: [0, -1.5, 0], rotate: [0, -8, 0] },
          { duration: seconds, times: [0, 0.4, 1], ease: ["easeOut", ease.overshoot] },
        ),
    },
  },
  render: () => (
    <g data-part="cassette" style={pivot("50% 50%")}>
      <g data-part="turn" style={pivot("50% 50%")}>
        {/* the shell, and the head opening on its bottom edge */}
        <path d="M2 4h20v16H2z" />
        <path d="M5 20l2-3h10l2 3" />
        <g stroke={slot.accent}>
          {/* the reels are round, so true circles; they sit on the tape that runs between their bottoms */}
          <g data-part="reel" style={pivot("50% 100%")}>
            <circle data-part="reel-l" cx="8" cy="10" r="2" style={pivot("50% 100%")} />
          </g>
          <g data-part="reel" style={pivot("50% 100%")}>
            <circle data-part="reel-r" cx="16" cy="10" r="2" style={pivot("50% 100%")} />
          </g>
          <path d="M8 12h8" />
        </g>
      </g>
    </g>
  ),
})
