"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    languages: "translate" | "pop" | "tilt"
  }
}

/** 2 colors: source glyph (primary), translated letter (accent). */
export const Languages = createAnimatedIcon({
  name: "languages",
  category: "text",
  keywords: ["translate", "language", "locale", "i18n", "multilingual", "localization", "international"],
  slots: { primary: "source glyph", accent: "translated letter" },
  defaultVariant: "translate",
  variants: {
    // the letter fades out and is written again, stroke by stroke; hidden while too short to read
    translate: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=letter]",
            { opacity: [1, 0, 0, 1] },
            { duration: seconds * 0.4, times: [0, 0.3, 0.45, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=letter]",
            { pathLength: [1, 1, 0, 1] },
            { duration: seconds * 0.85, times: [0, 0.18, 0.2, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the translated letter pops, as if just produced
    pop: {
      duration: 500,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=target]",
          { scale: [1, 0.85, 1.15, 1] },
          { duration: seconds, times: [0, 0.3, 0.65, 1], ease: ease.out },
        ),
    },
    // the source glyph tips back and forth, as if being read
    tilt: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate("[data-part=source]", { rotate: [0, -10, 7, -3, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    <>
      {/* a character from another script: a top stroke over a bar, and two crossing sweeps */}
      <g data-part="source" style={pivot("50% 50%")}>
        <path d="M7 2v3M2 5h12" />
        <path d="M12 5l-2 3-6 6" />
        <path d="M5 8l6 6" />
      </g>
      {/* the Latin A it translates to */}
      <g data-part="target" stroke={slot.accent} style={pivot("50% 100%")}>
        <path data-part="letter" d="M12 22l5-10 5 10" />
        <path data-part="letter" d="M14 18h6" />
      </g>
    </>
  ),
})
