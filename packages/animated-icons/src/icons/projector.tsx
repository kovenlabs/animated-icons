"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    projector: "beam" | "pan" | "flicker"
  }
}

/** 2 colors: body (primary), lens and light (accent). */
export const Projector = createAnimatedIcon({
  name: "projector",
  category: "devices",
  keywords: ["beamer", "presentation", "cinema", "movie", "screening", "slideshow", "light", "film"],
  slots: { primary: "body", accent: "lens + light" },
  defaultVariant: "beam",
  variants: {
    // switched on: the light pulls back into the lens, the lens swells toward you, and the rays shoot
    // back out past their length before settling
    beam: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ray]",
            { scale: [1, 0, 0, 1.5, 1], opacity: [1, 0, 0, 1, 1] },
            { duration: seconds, times: [0, 0.25, 0.4, 0.65, 1], ease: ["easeIn", "linear", "easeOut", "easeInOut"] },
          ),
          animate(
            "[data-part=lens]",
            { scale: [1, 0.8, 0.8, 1.3, 1] },
            { duration: seconds, times: [0, 0.25, 0.4, 0.6, 1], ease: ["easeIn", "linear", "easeOut", ease.overshoot] },
          ),
        ]),
    },
    // pans round to aim at another screen and back: the body narrows and leans into perspective as it
    // turns, and the light swings with it
    pan: {
      duration: 1300,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=projector]",
          { scaleX: [1, 0.55, 0.55, 1], skewY: [0, -12, -12, 0], x: [0, -1.5, -1.5, 0] },
          { duration: seconds, times: [0, 0.35, 0.6, 1], ease: ["easeInOut", "linear", ease.overshoot] },
        ),
    },
    // the film is running: the light flickers frame by frame and the motor hums through the body
    flicker: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=ray]",
            { opacity: [1, 0.15, 1, 0.3, 1, 0.1, 1, 0.4, 1], scale: [1, 0.7, 1.15, 0.8, 1.1, 0.7, 1.2, 0.85, 1] },
            { duration: seconds, ease: "linear" },
          ),
          animate(
            "[data-part=projector]",
            { y: [0, -0.6, 0, -0.6, 0, -0.6, 0, -0.6, 0] },
            { duration: seconds, ease: "linear" },
          ),
        ]),
    },
  },
  render: () => (
    <g data-part="projector" style={pivot("50% 100%")}>
      {/* the body, its top edge stopping at the lens, a vent slot, and two short feet */}
      <path d="M12 12H2v8h20v-8h-4" />
      <path d="M5 16h3M5 20v2M19 20v2" />
      <g stroke={slot.accent}>
        {/* the lens is round, so a true circle, standing proud of the body's top edge */}
        <circle cx="15" cy="13" data-part="lens" r="3" style={pivot("50% 50%")} />
        {/* three rays fanning up from the lens; each scales from its lens end */}
        <path d="M11 7.5 9.5 6" data-part="ray" style={pivot("100% 100%")} />
        <path d="M15 6V3" data-part="ray" style={pivot("50% 100%")} />
        <path d="M19 7.5l1.5-1.5" data-part="ray" style={pivot("0% 100%")} />
      </g>
    </g>
  ),
})
