"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "file-cog": "spin" | "tune"
  }
}

/** Six short teeth around the hub, centred on (16, 17) like file-search's lens: straight segments only. */
const TEETH =
  "M16 13.5V12M19.03 15.25l1.3-.75M19.03 18.75l1.3.75M16 20.5V22M12.97 18.75l-1.3.75M12.97 15.25l-1.3-.75"

/** 2 colors: page (primary), cog (accent). */
export const FileCog = createAnimatedIcon({
  name: "file-cog",
  family: "file",
  category: "files",
  keywords: ["file settings", "config file", "configuration", "preferences", "setup", "document settings"],
  slots: { primary: "page", accent: "cog" },
  defaultVariant: "spin",
  variants: {
    // the cog makes one unhurried turn
    spin: {
      duration: 1200,
      run: ({ animate, seconds }) =>
        animate("[data-part=cog]", { rotate: [0, 360] }, { duration: seconds, ease: "easeInOut" }),
    },
    // dialled back and forth like a knob being adjusted
    tune: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate("[data-part=cog]", { rotate: [0, -40, 20, -8, 0] }, { duration: seconds, ease: "easeInOut" }),
    },
  },
  render: () => (
    // the page spans x 4..18: shifted 1 right so the family sits centred in the 24 grid
    <g transform="translate(1 0)">
      <>
        {/* file-search's page, opened wider: the right edge keeps only a stub under the fold and the bottom
            edge stops short, so the cog's spinning teeth stay clear of both */}
        <path d="M18 9V7l-5-5H4v20h5" />
        <path d="M13 2v5h5" />
        {/* the hub is round, so it gets a true circle; the teeth are short spokes off it */}
        <g data-part="cog" stroke={slot.accent} style={pivot("50% 50%")}>
          <circle cx="16" cy="17" r="2.5" />
          <path d={TEETH} />
        </g>
      </>
    </g>
  ),
})
