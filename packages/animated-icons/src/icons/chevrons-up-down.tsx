"use client"

import { createAnimatedIcon } from "../lib/create-icon"

declare module "../lib/types" {
  interface IconVariants {
    "chevrons-up-down": "expand" | "collapse" | "shuffle"
  }
}

/** 1 color. */
export const ChevronsUpDownIcon = createAnimatedIcon({
  name: "chevrons-up-down",
  family: "chevron",
  category: "arrows",
  keywords: ["select", "sort", "dropdown", "combobox", "picker", "reorder", "toggle"],
  slots: { primary: "chevrons" },
  defaultVariant: "expand",
  variants: {
    // the chevrons spread apart and close back together, like a list opening
    expand: {
      duration: 700,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=up]", { y: [0, -2, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=down]", { y: [0, 2, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // the chevrons press toward the middle and spring back
    collapse: {
      duration: 650,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate("[data-part=up]", { y: [0, 2, -0.5, 0] }, { duration: seconds, ease: "easeInOut" }),
          animate("[data-part=down]", { y: [0, -2, 0.5, 0] }, { duration: seconds, ease: "easeInOut" }),
        ]),
    },
    // one after the other: up nudges up, then down nudges down
    shuffle: {
      duration: 800,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=up]",
            { y: [0, -2.5, 0, 0] },
            { duration: seconds, times: [0, 0.25, 0.5, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=down]",
            { y: [0, 0, 2.5, 0] },
            { duration: seconds, times: [0, 0.5, 0.75, 1], ease: "easeInOut" },
          ),
        ]),
    },
  },
  render: () => (
    <>
      {/* two right-angled chevrons pointing away from each other */}
      <path data-part="up" d="M7 9l5-5 5 5" />
      <path data-part="down" d="M7 15l5 5 5-5" />
    </>
  ),
})
