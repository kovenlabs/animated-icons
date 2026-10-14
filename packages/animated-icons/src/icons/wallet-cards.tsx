"use client"

import { useId } from "react"

import { createAnimatedIcon } from "../lib/create-icon"
import { ease, pivot, slot } from "../lib/motion"
import { useShapedDrawing } from "../lib/shape"

declare module "../lib/types" {
  interface IconVariants {
    "wallet-cards": "deal" | "snap" | "flip"
  }
}

/**
 * Two cards stand in the pocket, the back one up and to the left. Their sides run on down into the
 * wallet, clipped at the centre of the pocket's top stroke, so a card that rises slides out of the
 * pocket instead of lifting off it. The back card is also clipped out behind the front one, by a clip
 * that rides with the cards, so it can rise on its own without showing through. Drawn in its own
 * component (for the clip ids), so it shapes its corners from context.
 */
function Drawing() {
  const id = useId().replace(/[^\w-]/g, "")
  const [pocket, behind] = [`wallet-cards-pocket-${id}`, `wallet-cards-behind-${id}`]
  return useShapedDrawing(
    <g data-part="wallet" style={pivot("50% 100%")}>
      <clipPath id={pocket}>
        {/* wider than the frame, so its own corners stay outside the drawing */}
        <rect x="-4" y="-12" width="32" height="23" />
      </clipPath>
      <clipPath id={behind}>
        {/* everything but the front card's face, from the centre of its top stroke down */}
        <path d="M-4-12H28V28H19V7H9V28H-4z" />
      </clipPath>
      <g clipPath={`url(#${pocket})`}>
        <g data-part="cards" style={pivot("50% 100%")}>
          <g clipPath={`url(#${behind})`}>
            <path data-part="back" d="M5 20V3h10v17" stroke={slot.accent} style={pivot("50% 100%")} />
          </g>
          <path d="M9 20V7h10v13" stroke={slot.accent} />
        </g>
      </g>
      <path d="M3 11h18v10H3z" />
      {/* the flap, dipping to a point where it snaps shut; it hinges along its top line */}
      <path data-part="flap" d="M3 15h7l2 2 2-2h7" style={pivot("50% 0%")} />
    </g>,
  )
}

/** 2 colors: wallet and flap (primary), cards (accent). */
export const WalletCards = createAnimatedIcon({
  name: "wallet-cards",
  family: "wallet",
  category: "finance",
  keywords: ["cards", "credit card", "payment", "billfold", "money", "pay", "purse", "card holder"],
  slots: { primary: "wallet + flap", accent: "cards" },
  defaultVariant: "deal",
  variants: {
    // the back card is whipped up out of the pocket and off the top of the frame, then dropped back
    // in from above; the wallet squashes as it lands and springs back
    deal: {
      duration: 1200,
      clip: true,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=back]",
            { y: [0, -8, -8, 0.8, 0], rotate: [0, -8, -8, 2, 0] },
            { duration: seconds, times: [0, 0.3, 0.45, 0.68, 1], ease: [ease.out, "linear", ease.in, "easeInOut"] },
          ),
          animate(
            "[data-part=wallet]",
            { scaleY: [1, 1, 0.88, 1.04, 1], scaleX: [1, 1, 1.03, 0.99, 1] },
            { duration: seconds, times: [0, 0.66, 0.76, 0.88, 1], ease: "easeOut" },
          ),
          animate(
            "[data-part=cards]",
            { y: [0, 0, 1, -0.5, 0] },
            { duration: seconds, times: [0, 0.66, 0.76, 0.88, 1], ease: "easeOut" },
          ),
        ]),
    },
    // the flap flips up off its point, the cards jump in the open pocket, and it snaps shut with a
    // jolt that runs through the wallet
    snap: {
      duration: 1000,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=flap]",
            { scaleY: [1, -0.5, -0.5, 1.2, 1] },
            { duration: seconds, times: [0, 0.25, 0.5, 0.62, 1], ease: [ease.out, "linear", ease.in, "easeInOut"] },
          ),
          animate(
            "[data-part=cards]",
            { scaleY: [1, 1.06, 0.94, 1, 1] },
            { duration: seconds, times: [0, 0.3, 0.45, 0.62, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=wallet]",
            { scaleY: [1, 1, 0.92, 1.03, 1], scaleX: [1, 1, 1.03, 0.99, 1] },
            { duration: seconds, times: [0, 0.6, 0.7, 0.84, 1], ease: "easeOut" },
          ),
        ]),
    },
    // turned over on its vertical axis and back, dipping as it goes edge-on; facing you again, the
    // cards bounce up in the pocket
    flip: {
      duration: 1100,
      run: ({ animate, seconds }) =>
        Promise.all([
          animate(
            "[data-part=wallet]",
            { scaleX: [1, 0, -1, 0, 1], scaleY: [1, 0.94, 1, 0.94, 1] },
            { duration: seconds * 0.8, ease: ["easeIn", "easeOut", "easeIn", "easeOut"] },
          ),
          animate(
            "[data-part=cards]",
            { scaleY: [1, 1, 1.07, 0.96, 1] },
            { duration: seconds, times: [0, 0.75, 0.85, 0.93, 1], ease: "easeInOut" },
          ),
          animate(
            "[data-part=wallet]",
            { y: [0, 0, 0.6, 0] },
            { duration: seconds, times: [0, 0.8, 0.88, 1], ease: "easeOut" },
          ),
        ]),
    },
  },
  render: () => <Drawing />,
})
