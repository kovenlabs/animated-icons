"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "lock-open": "swing" | "release" | "hop"
  }
}

/** 2 colors: body (primary), shackle and keyhole (accent). */
export const LockOpen = createAnimatedIcon({
  name: "lock-open",
  family: "lock",
  category: "security",
  keywords: ["unlock", "unlocked", "padlock", "open lock", "access", "unsecure", "permission", "decrypt"],
  slots: { primary: "body", accent: "shackle + keyhole" },
  defaultVariant: "swing",
  variants: {
    // the loose shackle swings on the leg still in the body, out and back; its free leg never reaches the body
    swing: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate("[data-part=shackle]", { rotate: [0, -14, 6, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the key turns a quarter and the shackle springs up, then settles back with a small bounce
    release: {
      duration: 850,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=keyhole]",
            { rotate: [0, -90, -90, 0] },
            { duration: seconds, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=shackle]",
            { y: [0, 0, -2.5, -0.8, 0] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: ease.out },
          ),
        ]),
    },
    // the whole lock hops and lands with a small squash
    hop: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=lock]",
          { y: [0, -2.5, 0, 0], scaleY: [1, 1.04, 0.94, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
  },
  render: () => (
    <g data-part="lock" style={pivot("50% 100%")}>
      {/* the lock's squared-off shackle, raised: the left leg stays in the body, the right one hangs 2 clear of it */}
      <path data-part="shackle" d="M8 11V3h8v4" stroke={slot.accent} style={pivot("0% 100%")} />
      {/* the same body and keyhole as `lock` */}
      <path d="M5 11h14v10H5z" />
      <path data-part="keyhole" d="M12 15v2" stroke={slot.accent} style={pivot("50% 50%")} />
    </g>
  ),
})
