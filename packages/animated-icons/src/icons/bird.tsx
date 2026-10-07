"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    bird: "flutter" | "turn" | "fly"
  }
}

/**
 * A perched bird facing right: a long tail wedge at the bottom left, the back rising to a flat crown,
 * a straight face carrying the beak, and a belly flat enough to stand two legs on.
 */
const BODY = "M2 20l6-5 3-8 3-3h4l1 2v6l-4 6H9z"

/** 2 colors: body and legs (primary), wing and beak (accent). */
export const Bird = createAnimatedIcon({
  name: "bird",
  category: "nature",
  keywords: ["animal", "sparrow", "robin", "tweet", "wildlife", "birdwatching", "pet bird"],
  slots: { primary: "body + legs", accent: "wing + beak" },
  defaultVariant: "flutter",
  variants: {
    // it hops up, beating its wing (the wing folds flat towards you and opens again), tips its head
    // back on the way up, and lands with a squash
    flutter: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bird]",
            { y: [0, -3, -3, 0, 0], rotate: [0, -6, -4, 3, 0] },
            { duration: seconds, times: [0, 0.3, 0.6, 0.82, 1], ease: [ease.out, "easeInOut", ease.in, "easeOut"] },
          ),
          animate(
            "[data-part=body]",
            { scaleY: [1, 1, 1, 0.9, 1], scaleX: [1, 1, 1, 1.05, 1] },
            { duration: seconds, times: [0, 0.3, 0.8, 0.88, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=wing]",
            { scaleY: [1, 0.2, 1, 0.2, 1, 0.2, 1] },
            { duration: seconds * 0.8, ease: "easeInOut" },
          ),
          animate(
            "[data-part=legs]",
            { scaleY: [1, 0.6, 0.6, 1] },
            { duration: seconds, times: [0, 0.3, 0.7, 0.85], ease: "easeInOut" },
          ),
        ]),
    },
    // it turns round on its perch to look the other way (a squeeze through edge-on), holds, then turns back
    turn: {
      duration: 1300,
      run: ({ animate, seconds }) => {
        const times = [0, 0.22, 0.6, 0.82, 1]
        return Promise.all([
          animate(
            "[data-part=bird]",
            { scaleX: [1, -1, -1, 1, 1] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=hop]",
            { y: [0, -1.5, 0, 0, -1.5, 0, 0] },
            { duration: seconds, times: [0, 0.11, 0.22, 0.6, 0.71, 0.82, 1], ease: "easeInOut" },
          ),
        ])
      },
    },
    // it takes off up and out through the top right, then flies back in from the bottom left and lands
    fly: {
      duration: 1300,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=hop]",
            { x: [0, 10, -10, 0], y: [0, -12, 12, 0], opacity: [1, 0, 0, 1] },
            { duration: seconds, times: [0, 0.42, 0.45, 1], ease: [ease.in, "linear", ease.out] },
          ),
          animate(
            "[data-part=bird]",
            { rotate: [0, -14, -14, 0] },
            { duration: seconds, times: [0, 0.3, 0.6, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=wing]",
            { scaleY: [1, 0.2, 1, 0.2, 1, 0.2, 1, 0.2, 1] },
            { duration: seconds * 0.9, ease: "easeInOut" },
          ),
          animate(
            "[data-part=legs]",
            { scaleY: [1, 0.4, 0.4, 1] },
            { duration: seconds, times: [0, 0.2, 0.75, 0.95], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="hop">
      <g data-part="bird" style={pivot("50% 100%")}>
        <g data-part="body" style={pivot("50% 100%")}>
          <path d={BODY} />
          <rect x="15" y="6" width="2" height="2" fill={slot.primary} stroke="none" />
          <g stroke={slot.accent}>
            {/* the folded wing hinges on its top edge, along the shoulder */}
            <path data-part="wing" d="M12 11h5l-5 5z" style={pivot("50% 0%")} />
            <path d="M19 7l3 1.5-3 1.5" />
          </g>
        </g>
        <path data-part="legs" d="M11 18v4M14 18v4" style={pivot("50% 0%")} />
      </g>
    </g>
  ),
})
