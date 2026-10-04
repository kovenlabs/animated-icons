"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, flash, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    smartphone: "vibrate" | "notify" | "light"
  }
}

/** Buzz ticks either side of the body, 2 clear of it. */
const BUZZ = ["M3 9v6", "M21 9v6"]

/** 2 colors: body (primary), home bar, notification and screen light (accent). */
export const Smartphone = createAnimatedIcon({
  name: "smartphone",
  category: "devices",
  keywords: ["phone", "mobile", "cell", "iphone", "android", "device", "vibrate"],
  slots: { primary: "body", accent: "home bar + notification + screen light" },
  defaultVariant: "vibrate",
  variants: {
    // buzzes side to side while the ticks flicker either side
    vibrate: {
      duration: 600,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=phone]",
            { x: [0, -0.75, 0.75, -0.75, 0.75, -0.75, 0.75, 0], rotate: [0, -2, 2, -2, 2, -2, 2, 0] },
            { duration: seconds, ease: "linear" },
          ),
          animate("[data-part=buzz]", { opacity: [0, 1, 0.4, 1, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // a notification dot pops onto the screen, the phone gives a small hop, and the dot fades away
    notify: {
      duration: 900,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=notification]",
            { scale: [0, 1.2, 1] },
            { duration: seconds * 0.45, times: [0, 0.65, 1], ease: ease.out },
          ),
          animate(
            "[data-part=notification]",
            { opacity: [0, 1, 1, 0] },
            { duration: seconds, times: [0, 0.1, 0.75, 1], ease: "easeInOut" },
          ),
          animate("[data-part=phone]", { y: [0, -1.5, 0] }, { duration: seconds * 0.45, ease: "easeOut" }),
        ]),
    },
    // the screen wakes: it lights up and the home bar pops
    light: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=screen]", { opacity: [0, 1, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=home]", { scaleX: [1, 1.5, 1] }, { duration: seconds * 0.6, ease: ease.overshoot }),
        ]),
    },
  },
  render: () => (
    <>
      <g stroke={slot.accent}>
        {BUZZ.map((d) => (
          <path key={d} data-part="buzz" d={d} style={flash()} />
        ))}
      </g>
      <g data-part="phone" style={pivot("50% 50%")}>
        <rect data-part="screen" x="8" y="3" width="8" height="18" fill={slot.accent} fillOpacity={0.2} stroke="none" style={flash()} />
        <path d="M7 2h10v20H7Z" />
        <path data-part="home" d="M11 18h2" stroke={slot.accent} style={pivot("50% 50%")} />
        <rect data-part="notification" x="12" y="5" width="2" height="2" fill={slot.accent} stroke="none" style={flash()} />
      </g>
    </>
  ),
})
