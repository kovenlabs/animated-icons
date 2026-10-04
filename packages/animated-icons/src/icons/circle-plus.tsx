"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "circle-plus": "pop" | "spin" | "grow"
  }
}

/** The four arms of the plus, each its own stroke drawn out from the centre, so `grow` opens them all at once. */
const ARMS = ["M12 12V8", "M12 12h4", "M12 12v4", "M12 12H8"]

/** 2 colors: ring (primary), plus (accent). */
export const CirclePlus = createAnimatedIcon({
  name: "circle-plus",
  family: "circle",
  category: "actions",
  keywords: ["add", "new", "create", "insert", "more", "plus", "include"],
  slots: { primary: "ring", accent: "plus" },
  defaultVariant: "pop",
  variants: {
    // the plus punches out from the middle and settles
    pop: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate("[data-part=plus]", { scale: [1, 1.2, 0.95, 1] }, { duration: seconds, ease: ease.out }),
    },
    // the plus turns a full circle inside the ring, like a dial
    spin: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate("[data-part=plus]", { rotate: [0, 360] }, { duration: seconds, ease: "easeInOut" }),
    },
    // the plus fades out and grows its four arms back out of the centre; hidden while too short to read
    grow: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=arm]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.5, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=arm]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds, times: [0, 0.2, 0.22, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=ring]",
            { scale: [1, 1, 1.06, 1] },
            { duration: seconds, times: [0, 0.5, 0.75, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* a ring is round, so it gets a true circle */}
      <circle data-part="ring" cx="12" cy="12" r="10" style={pivot("50% 50%")} />
      <g data-part="plus" stroke={slot.accent} style={pivot("50% 50%")}>
        {ARMS.map((d) => (
          <path key={d} data-part="arm" d={d} />
        ))}
      </g>
    </>
  ),
})
