"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    cactus: "wave" | "hop" | "bloom"
  }
}

/** A saguaro trunk with a pointed crown, standing on the ground line. */
const TRUNK = "M10 21V8l2-2 2 2v13"

/**
 * Each arm is a 4px-wide tube that leaves the trunk, bends up and ends in a point. It is open where it
 * meets the trunk, so it hinges on that joint and only ever swings outwards, away from the trunk.
 */
const ARM_LEFT = "M10 16H5l-2-2V7l2-2 2 2v5h3"
const ARM_RIGHT = "M14 13h5l2-2V5l-2-2-2 2v4h-3"

/** 2 colors: cactus and ground (primary), flower (accent). */
export const Cactus = createAnimatedIcon({
  name: "cactus",
  category: "nature",
  keywords: ["desert", "succulent", "plant", "saguaro", "dry", "western", "prickly", "houseplant"],
  slots: { primary: "cactus + ground", accent: "flower" },
  defaultVariant: "wave",
  variants: {
    // it waves hello: the right arm swings out and back twice while the left one answers a beat later,
    // the trunk leaning into the greeting and the flower nodding along
    wave: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=arm-right]",
            { rotate: [0, 24, 4, 22, 2, 0] },
            { duration: seconds, times: [0, 0.18, 0.36, 0.54, 0.74, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=arm-left]",
            { rotate: [0, 0, -18, -2, -12, 0] },
            { duration: seconds, times: [0, 0.14, 0.34, 0.52, 0.72, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=cactus]",
            { skewX: [0, -5, 4, -3, 1, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
          animate(
            "[data-part=flower]",
            { rotate: [0, -20, 16, -10, 4, 0] },
            { duration: seconds, ease: "easeInOut" },
          ),
        ]),
    },
    // it crouches, springs off the ground with its arms flung out and its body narrowed (it already
    // stands as tall as the frame, so the leap is in the gap under it), lands on a fat squash and wobbles
    // back to its height
    hop: {
      duration: 1200,
      clip: false,
      run: ({ animate, seconds }) => {
        const times = [0, 0.18, 0.42, 0.62, 0.8, 1]
        return Promise.all([
          animate(
            "[data-part=cactus]",
            {
              y: [0, 0.5, -2.5, 0, 0, 0],
              scaleY: [1, 0.8, 0.97, 0.82, 1.05, 1],
              scaleX: [1, 1.14, 0.92, 1.16, 0.97, 1],
            },
            { duration: seconds, times, ease: ["easeInOut", ease.out, ease.in, "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=arm-left]",
            { rotate: [0, 6, -20, 4, -4, 0] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=arm-right]",
            { rotate: [0, -6, 20, -4, 4, 0] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=flower]",
            { scaleY: [1, 1, 0.7, 1.3, 0.9, 1], scaleX: [1, 1, 1.2, 0.8, 1.05, 1] },
            { duration: seconds, times: [0, 0.2, 0.46, 0.68, 0.86, 1], ease: "easeInOut" },
          ),
        ])
      },
    },
    // the flower closes to nothing, then the trunk stretches and pushes it out: it spins open past full
    // size and settles, as both arms lift in a cheer
    bloom: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=flower]",
            { scale: [1, 0, 0, 1.4, 0.85, 1], rotate: [0, 0, 0, 270, 380, 360] },
            {
              duration: seconds,
              times: [0, 0.16, 0.34, 0.62, 0.82, 1],
              ease: [ease.in, "linear", ease.out, "easeInOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=cactus]",
            { scaleY: [1, 1, 0.9, 1.06, 0.97, 1], scaleX: [1, 1, 1.08, 0.95, 1.02, 1] },
            {
              duration: seconds,
              times: [0, 0.16, 0.34, 0.56, 0.78, 1],
              ease: ["linear", "easeInOut", ease.out, "easeInOut", "easeInOut"],
            },
          ),
          animate(
            "[data-part=arm-left]",
            { rotate: [0, 0, -18, -14, 0] },
            { duration: seconds, times: [0, 0.4, 0.6, 0.78, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=arm-right]",
            { rotate: [0, 0, 18, 14, 0] },
            { duration: seconds, times: [0, 0.44, 0.64, 0.82, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      <path d="M3 21h18" />
      <g data-part="cactus" style={pivot("50% 100%")}>
        <path d={TRUNK} />
        {/* each arm hinges on the middle of its joint with the trunk */}
        <path data-part="arm-left" d={ARM_LEFT} style={pivot("100% 82%")} />
        <path data-part="arm-right" d={ARM_RIGHT} style={pivot("0% 80%")} />
        {/* a diamond bloom resting on the crown's point */}
        <path
          data-part="flower"
          d="M12 2l2 2-2 2-2-2z"
          fill={slot.accent}
          stroke="none"
          style={pivot("50% 50%")}
        />
      </g>
    </>
  ),
})
