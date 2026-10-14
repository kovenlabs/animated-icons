"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    baby: "giggle" | "look" | "doze"
  }
}

/** 2 colors: head, ears and curl (primary), eyes and mouth (accent). */
export const Baby = createAnimatedIcon({
  name: "baby",
  category: "users",
  keywords: ["child", "infant", "newborn", "kid", "toddler", "nursery", "parenting"],
  slots: { primary: "head + ears + curl", accent: "eyes + mouth" },
  defaultVariant: "giggle",
  variants: {
    // bounces with a belly laugh: hops and rocks with squash and stretch, eyes squeezed shut, mouth wide
    giggle: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=baby]",
            {
              y: [0, -2, 0, -1.5, 0, 0],
              rotate: [0, -6, 0, 6, 0, 0],
              scaleY: [1, 1.06, 0.9, 1.05, 0.93, 1],
              scaleX: [1, 0.96, 1.05, 0.97, 1.04, 1],
            },
            { duration: seconds, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=eye]",
            { scaleY: [1, 0.2, 0.2, 0.2, 0.2, 1] },
            { duration: seconds, times: [0, 0.12, 0.4, 0.6, 0.85, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=mouth]",
            { scaleX: [1, 1.15, 1, 1.15, 1, 1], scaleY: [1, 1.25, 0.8, 1.25, 0.8, 1] },
            { duration: seconds, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: "easeInOut" },
          ),
        ]),
    },
    // turns its head left then right: the face slides and foreshortens, the far ear tucks behind
    look: {
      duration: 1300,
      run: ({ animate, seconds }) => {
        const times = [0, 0.2, 0.4, 0.6, 0.8, 1]
        const opts = { duration: seconds, times, ease: "easeInOut" } as const
        return Promise.all([
          animate(
            "[data-part=face], [data-part=curl]",
            { x: [0, -1.25, -1.25, 1.25, 1.25, 0], scaleX: [1, 0.75, 0.75, 0.75, 0.75, 1] },
            opts,
          ),
          animate("[data-part=head]", { rotate: [0, -6, -6, 6, 6, 0] }, opts),
          animate("[data-part=ear-l]", { scaleX: [1, 0, 0, 1.3, 1.3, 1] }, opts),
          animate("[data-part=ear-r]", { scaleX: [1, 1.3, 1.3, 0, 0, 1] }, opts),
        ])
      },
    },
    // nods off, eyes drooping shut, then startles awake with a jump and wide eyes
    doze: {
      duration: 1400,
      run: ({ animate, seconds }) => {
        const times = [0, 0.3, 0.6, 0.72, 0.85, 1]
        return Promise.all([
          animate(
            "[data-part=eye]",
            { scaleY: [1, 0.15, 0.15, 1.4, 1.4, 1] },
            { duration: seconds, times, ease: ["easeInOut", "linear", ease.out, "linear", "easeInOut"] },
          ),
          animate(
            "[data-part=face]",
            { y: [0, 1, 1, -0.5, -0.5, 0], scaleY: [1, 0.85, 0.85, 1, 1, 1] },
            { duration: seconds, times, ease: ["easeInOut", "linear", ease.out, "linear", "easeInOut"] },
          ),
          animate(
            "[data-part=head]",
            { rotate: [0, 10, 12, -4, 0, 0] },
            { duration: seconds, times, ease: ["easeInOut", "linear", ease.out, "easeInOut", "linear"] },
          ),
          animate(
            "[data-part=baby]",
            { y: [0, 0, 0, -2, 0, 0] },
            { duration: seconds, times, ease: ["linear", "linear", ease.out, ease.overshoot, "linear"] },
          ),
          animate(
            "[data-part=mouth]",
            { scale: [1, 1, 1, 1.3, 1.3, 1] },
            { duration: seconds, times, ease: ["linear", "linear", ease.out, "linear", "easeInOut"] },
          ),
        ])
      },
    },
  },
  render: () => (
    <g data-part="baby" style={pivot("50% 100%")}>
      <g data-part="head" style={pivot("50% 50%")}>
        {/* a round head with little half-round ears */}
        <circle cx="12" cy="13" r="7.5" />
        <path data-part="ear-l" d="M4.65 11.5A1.5 1.5 0 0 0 4.65 14.5" style={pivot("100% 50%")} />
        <path data-part="ear-r" d="M19.35 11.5A1.5 1.5 0 0 1 19.35 14.5" style={pivot("0% 50%")} />
        {/* the curl hanging over the forehead */}
        <path data-part="curl" d="M12 5.5l2 2-2 2" style={pivot("50% 50%")} />
        <g data-part="face" fill={slot.accent} stroke="none" style={pivot("50% 50%")}>
          <rect data-part="eye" x="7.5" y="11.5" width="2" height="2" style={pivot("50% 50%")} />
          <rect data-part="eye" x="14.5" y="11.5" width="2" height="2" style={pivot("50% 50%")} />
          {/* an open little smile */}
          <path data-part="mouth" d="M10.25 15.5h3.5L12 17.5Z" style={pivot("50% 0%")} />
        </g>
      </g>
    </g>
  ),
})
