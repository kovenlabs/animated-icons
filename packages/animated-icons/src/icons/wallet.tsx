"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { useShapedDrawing } from "../lib/shape"
import { pivot, slot } from "../lib/motion"

declare module "../lib/types" {
  interface IconVariants {
    wallet: "peek" | "open" | "shake"
  }
}

/**
 * The card's sides run on down into the wallet, clipped at the centre of the body's top stroke: when
 * the card rises its sides slide up out of the pocket instead of lifting off it. Drawn in its own
 * component (for the clip id), so it shapes its corners from context.
 */
function Drawing() {
  const clip = `wallet-${useId().replace(/[^\w-]/g, "")}`
  return useShapedDrawing(
    <g data-part="wallet" style={pivot("50% 100%")}>
      <clipPath id={clip}>
        {/* wider than the frame, so its own corners stay outside the drawing */}
        <rect x="-4" y="-4" width="32" height="12" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        {/* tipped a little, so it reads as a card slipped into the pocket, not a handle */}
        <g transform="rotate(-10 10 8)">
          <path data-part="card" d="M5 13V4h10v9" stroke={slot.accent} />
        </g>
      </g>
      <path d="M3 8h18v13H3z" />
      {/* the clasp folds in over the right edge; it opens on that edge */}
      <path data-part="clasp" d="M21 12h-5v5h5" stroke={slot.secondary} style={pivot("100% 50%")} />
    </g>,
  )
}

/** 3 colors: wallet (primary), clasp (secondary), card (accent). */
export const Wallet = createAnimatedIcon({
  name: "wallet",
  category: "finance",
  keywords: ["money", "payment", "purse", "balance", "funds", "cash", "billfold", "pay"],
  slots: { primary: "wallet", secondary: "clasp", accent: "card" },
  defaultVariant: "peek",
  variants: {
    // the card slides up out of the pocket, holds a beat, and tucks back in
    peek: {
      duration: 850,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=card]",
          { y: [0, -2, -2, 0.5, 0] },
          { duration: seconds, times: [0, 0.35, 0.6, 0.85, 1], ease: "easeInOut" },
        ),
    },
    // the clasp unsnaps and swings out over the right edge, then snaps shut again
    open: {
      duration: 800,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=clasp]",
          { scaleX: [1, -0.5, -0.5, 1] },
          { duration: seconds, times: [0, 0.35, 0.6, 1], ease: "easeInOut" },
        ),
    },
    // shaken upside down for loose change: it rattles on its base
    shake: {
      duration: 550,
      run: ({ animate, seconds }) =>
        animate(
          "[data-part=wallet]",
          { x: [0, -1, 1, -1, 1, 0], rotate: [0, -5, 5, -5, 5, 0] },
          { duration: seconds, ease: "linear" },
        ),
    },
  },
  render: () => <Drawing />,
})
