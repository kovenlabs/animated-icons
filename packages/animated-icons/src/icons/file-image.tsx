"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "file-image": "rise" | "shine" | "lift"
  }
}

/** 2 colors: page (primary), picture: sun and hill (accent). */
export const FileImage = createAnimatedIcon({
  name: "file-image",
  family: "file",
  category: "files",
  keywords: ["image file", "picture", "photo", "jpg", "png", "graphic", "media", "attachment"],
  slots: { primary: "page", accent: "sun + hill" },
  defaultVariant: "rise",
  variants: {
    // the sun sinks and fades, then rises back into its place
    rise: {
      duration: 900,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=sun]",
          { y: [0, 2, 2, 0], opacity: [1, 0, 0, 1] },
          { duration: seconds, times: [0, 0.35, 0.5, 1], ease: "easeInOut" },
        ),
    },
    // the sun swells and settles, like a flash of light
    shine: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate("[data-part=sun]", { scale: [1, 1.25, 1] }, { duration: seconds, ease: ease.out }),
    },
    // the page lifts off the desk, picture and all, and settles back with a little squash
    lift: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=file]",
          { y: [0, -2, 0, 0], scaleY: [1, 1, 0.95, 1] },
          { duration: seconds, times: [0, 0.4, 0.7, 1], ease: "easeOut" },
        ),
    },
  },
  render: () => (
    // the page spans x 4..18: shifted 1 right so the family sits centred in the 24 grid
    <g transform="translate(1 0)">
      <g data-part="file" style={pivot("50% 100%")}>
        {/* the file page and its folded corner, as in `file` */}
        <path d="M18 7v15H4V2h9z" />
        <path d="M13 2v5h5" />
        <g stroke={slot.accent}>
          {/* the sun is genuinely round: 2 clear of the page's left edge */}
          <circle data-part="sun" cx="10" cy="11" r="2" style={pivot("50% 50%")} />
          {/* a hill rising from the page's foot to a peak and down to its right edge, 2+ clear of the sun */}
          <path d="M8 22l6-6 4 4" />
        </g>
      </g>
    </g>
  ),
})
