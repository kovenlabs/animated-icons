"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    lock: "unlock" | "shake" | "turn"
  }
}

/** 2 colors: body (primary), shackle and keyhole (accent). */
export const Lock = createAnimatedIcon({
  name: "lock",
  category: "security",
  keywords: ["padlock", "secure", "private", "password", "protected", "unlock", "locked"],
  slots: { primary: "body", accent: "shackle + keyhole" },
  defaultVariant: "unlock",
  variants: {
    // the shackle lifts clear of the body, holds, then drops back in
    unlock: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=shackle]",
          { y: [0, -3, -3, 0] },
          { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
        ),
    },
    // access denied: a short side-to-side refusal
    shake: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate("[data-part=lock]", { x: [0, -2, 2, -2, 2, 0] }, { duration: seconds, ease: "linear" }),
    },
    // a key turns a quarter in the keyhole and the shackle clicks
    turn: {
      duration: 750,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=keyhole]",
            { rotate: [0, 90, 90, 0] },
            { duration: seconds, times: [0, 0.35, 0.65, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=shackle]",
            { y: [0, 0, -1.5, 0] },
            { duration: seconds, times: [0, 0.35, 0.5, 1], ease: ease.out },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="lock">
      {/* a squared-off shackle whose legs sink into the body */}
      <path data-part="shackle" d="M8 11V5h8v6" stroke={slot.accent} />
      <path d="M5 11h14v10H5z" />
      <path data-part="keyhole" d="M12 15v2" stroke={slot.accent} style={pivot("50% 50%")} />
    </g>
  ),
})
