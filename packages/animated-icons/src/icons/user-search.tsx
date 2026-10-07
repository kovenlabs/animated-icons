"use client"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    "user-search": "look" | "zoom" | "nod"
  }
}

/** 2 colors: user (primary), lens (accent). */
export const UserSearch = createAnimatedIcon({
  name: "user-search",
  family: "user",
  category: "users",
  keywords: ["find people", "search user", "lookup", "similar", "candidate search", "discover", "recruit"],
  slots: { primary: "user", accent: "lens" },
  defaultVariant: "look",
  variants: {
    // the lens circles a little over the badge corner, hunting
    look: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=lens]",
          {
            x: [0, -1, 0, 1.5, 0],
            y: [0, 1, 1.5, 1, 0],
            rotate: [0, -8, 0, 8, 0],
          },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
    // the lens magnifies and settles
    zoom: {
      duration: 650,
      run: ({ animate, seconds }) =>
        animate("[data-part=lens]", { scale: [1, 1.2, 1] }, { duration: seconds, ease: ease.out }),
    },
    // two small nods, the second a touch softer, like `user`: a match found
    nod: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=head]",
          { y: [0, 1, 0, 0.6, 0], scaleY: [1, 0.95, 1, 0.97, 1] },
          { duration: seconds, ease: "easeInOut" },
        ),
    },
  },
  render: () => (
    <>
      {/* the `user`, compacted into the left 2..14 like `user-plus`, so the badge zone stays free */}
      <path d="M8 4l3 2v4l-3 2-3-2V6z" data-part="head" style={pivot("50% 100%")} />
      <path d="M2 21v-2l3-3h6l3 3v2" />
      {/* the lens sits in the badge zone, 2px clear of the head */}
      <g data-part="lens" stroke={slot.accent} style={pivot("43% 43%")}>
        <circle cx="18" cy="6" r="3" />
        <path d="M20.5 8.5 22 10" />
      </g>
    </>
  ),
})
