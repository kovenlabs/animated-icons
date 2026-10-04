"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "file-audio": "bounce" | "sway"
  }
}

/** 2 colors: page (primary), music note (accent). */
export const FileAudio = createAnimatedIcon({
  name: "file-audio",
  family: "file",
  category: "files",
  keywords: ["audio file", "music file", "sound", "mp3", "recording", "song", "podcast"],
  slots: { primary: "page", accent: "music note" },
  defaultVariant: "bounce",
  variants: {
    // the note hops twice in time, the second hop smaller
    bounce: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=note]",
          { y: [0, -2, 0, -1, 0] },
          { duration: seconds, times: [0, 0.25, 0.5, 0.75, 1], ease: "easeInOut" },
        ),
    },
    // the note rocks on its head to the beat
    sway: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate("[data-part=note]", { rotate: [0, -14, 10, -5, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    // the page spans x 4..18: shifted 1 right so the family sits centred in the 24 grid
    <g transform="translate(1 0)">
      <>
        {/* the file page, as in `file` */}
        <path d="M18 7v15H4V2h9z" />
        <path d="M13 2v5h5" />
        {/* an eighth note: a round head (the object is round), a stem on its right and a short flag,
            the flag's tip clear of the fold's corner */}
        <g data-part="note" style={pivot("30% 85%")}>
          <path d="M11 17v-7l3 1.5" stroke={slot.accent} />
          <circle cx="9" cy="17" r="2" fill={slot.accent} stroke="none" />
        </g>
      </>
    </g>
  ),
})
