"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "bell-ring": "ring" | "toll" | "buzz"
  }
}

/** 2 colors: body (primary), clapper and sound waves (accent). */
export const BellRing = createAnimatedIcon({
  name: "bell-ring",
  family: "bell",
  category: "communication",
  keywords: ["notification", "ringing", "alert", "alarm", "reminder", "wake up", "new notification"],
  slots: { primary: "body", accent: "clapper + sound waves" },
  defaultVariant: "ring",
  variants: {
    // swings hard from its hanger; each wave is knocked outward as the bell swings toward it, and the
    // clapper lags behind the body
    ring: {
      duration: 1100,
      run: ({ animate, seconds }) => {
        const times = [0, 0.18, 0.38, 0.56, 0.74, 1]
        return Promise.all([
          animate(
            "[data-part=body]",
            { rotate: [0, -14, 12, -7, 3, 0] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=clapper]",
            { x: [0, 3, -3, 2, -1, 0] },
            { duration: seconds, delay: seconds * 0.06, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=wave-r]",
            { x: [0, 1, 0, 0.6, 0, 0], y: [0, -0.8, 0, -0.5, 0, 0] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=wave-l]",
            { x: [0, 0, -1, 0, -0.5, 0], y: [0, 0, -0.8, 0, -0.4, 0] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
        ])
      },
    },
    // swings toward you and away: the bell foreshortens and grows as its mouth comes forward, the clapper
    // follows through below it, and both waves are thrown outward on the forward swings
    toll: {
      duration: 1200,
      run: ({ animate, seconds }) => {
        const times = [0, 0.25, 0.5, 0.75, 1]
        return Promise.all([
          animate(
            "[data-part=bell]",
            { scaleY: [1, 0.78, 1.04, 0.88, 1], scale: [1, 1.12, 0.97, 1.05, 1] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=clapper]",
            { y: [0, 1.2, -0.5, 0.6, 0] },
            { duration: seconds, delay: seconds * 0.08, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=wave-l]",
            { x: [0, -1, 0, -0.6, 0], y: [0, -0.8, 0, -0.5, 0], opacity: [1, 0.5, 1, 0.7, 1] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
          animate(
            "[data-part=wave-r]",
            { x: [0, 1, 0, 0.6, 0], y: [0, -0.8, 0, -0.5, 0], opacity: [1, 0.5, 1, 0.7, 1] },
            { duration: seconds, times, ease: "easeInOut" },
          ),
        ])
      },
    },
    // vibrates like a phone on a table, the waves pulsing out on every beat
    buzz: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bell]",
            { x: [0, -1.2, 1.2, -1.2, 1.2, -0.8, 0.8, 0], rotate: [0, -5, 5, -5, 5, -3, 3, 0] },
            { duration: seconds, ease: "linear" },
          ),
          animate("[data-part=wave-l]", { x: [0, -1, 0, -1, 0, -1, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=wave-r]", { x: [0, 1, 0, 1, 0, 1, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <>
      {/* the waves ring the bell's shoulders, 2 clear of its crown */}
      <g stroke={slot.accent}>
        <path data-part="wave-l" d="M5 2 2 5v3" style={pivot("100% 0%")} />
        <path data-part="wave-r" d="M19 2l3 3v3" style={pivot("0% 0%")} />
      </g>
      <g data-part="bell" style={pivot("50% 0%")}>
        <g data-part="body" style={pivot("50% 0%")}>
          <path d="M12 2v3" />
          {/* the bell's own trapezoid: flat crown, straight flanks, flared lip */}
          <path d="M8 5h8l1.5 10 2.5 3H4l2.5-3z" />
        </g>
        <path data-part="clapper" d="M10 21h4" stroke={slot.accent} />
      </g>
    </>
  ),
})
