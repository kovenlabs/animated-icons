"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { blink, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    bell: "ring" | "shake" | "jump"
  }
}

/** 2 colors: body (primary), clapper and sound waves (accent). */
export const Bell = createAnimatedIcon({
  name: "bell",
  category: "communication",
  keywords: ["notification", "alert", "alarm", "reminder", "ring", "subscribe"],
  slots: { primary: "body", accent: "clapper + sound waves" },
  defaultVariant: "ring",
  variants: {
    ring: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          // swings from the top of its hanger
          animate("[data-part=body]", { rotate: [0, -14, 11, -7, 4, 0] }, { duration: seconds, ease: "easeInOut" }),
          // the clapper lags the body slightly, like a real bell
          animate(
            "[data-part=clapper]",
            { x: [0, 2, -2, 1.2, 0] },
            { duration: seconds, delay: seconds * 0.07, ease: "easeInOut" },
          ),
          animate("[data-part=wave]", blink, { duration: seconds * 0.85, delay: seconds * 0.14, ease: "easeOut" }),
        ]),
    },
    shake: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=bell]",
          { x: [0, -1, 1, -1, 1, 0], rotate: [0, -4, 4, -4, 4, 0] },
          { duration: seconds, ease: "linear" },
        ),
    },
    // a small hop that lands with a squash
    jump: {
      duration: 650,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=bell]",
            { y: [0, -2.5, 0, 0], scaleY: [1, 1.04, 0.94, 1] },
            { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
          ),
          animate("[data-part=clapper]", { x: [0, 0, 1.5, -1, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        <path data-part="wave" d="M4 8 2.5 6.5" style={flash("100% 100%")} />
        <path data-part="wave" d="M3.5 12H1.5" style={flash("100% 50%")} />
        <path data-part="wave" d="M20 8l1.5-1.5" style={flash("0% 100%")} />
        <path data-part="wave" d="M20.5 12h2" style={flash("0% 50%")} />
      </g>
      <g data-part="bell" style={pivot("50% 100%")}>
        <g data-part="body" style={pivot("50% 0%")}>
          <path d="M12 2v3" />
          {/* a trapezoid: flat crown, straight flanks, flared lip */}
          <path d="M8 5h8l1.5 10 2.5 3H4l2.5-3z" />
        </g>
        <path data-part="clapper" d="M10 21h4" stroke={slot.accent} />
      </g>
    </>
  ),
})
