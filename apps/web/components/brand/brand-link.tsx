"use client"

import type { AnimatedIconHandle } from "@kovenlabs/animated-icons"
import Link from "next/link"
import { useRef } from "react"

import { BRAND_COLORS, BrandMark } from "./logo"

/** The header lockup: hovering the whole link (mark + name) launches the badge. */
export function BrandLink() {
  const mark = useRef<AnimatedIconHandle>(null)
  return (
    <Link
      href="/"
      onPointerEnter={() => void mark.current?.play()}
      className="flex shrink-0 items-center gap-2.5 font-semibold tracking-tight whitespace-nowrap"
    >
      <BrandMark ref={mark} trigger="manual" size={24} colors={BRAND_COLORS} aria-label="Animated Icons logo" />
      Animated Icons
    </Link>
  )
}
