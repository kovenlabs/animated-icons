"use client"

import type { AnimatedIconHandle } from "@kovenlabs/animated-icons"
import { createElement, useEffect, useRef } from "react"

import { iconsByName } from "@/lib/catalog"

/**
 * A docs sidebar icon from the library itself. It plays when its link is hovered or focused, and when its
 * page becomes the active one.
 */
export function SidebarIcon({ name }: { name: string }) {
  const icon = useRef<AnimatedIconHandle>(null)
  const anchor = useRef<HTMLSpanElement>(null)
  const Icon = iconsByName.get(name)

  useEffect(() => {
    const link = anchor.current?.closest("a")
    if (!link) return
    const play = () => void icon.current?.play()
    link.addEventListener("pointerenter", play)
    link.addEventListener("focus", play)
    // the sidebar outlives navigation: watch for this link becoming the active page
    const active = new MutationObserver(() => link.dataset.active === "true" && play())
    active.observe(link, { attributes: true, attributeFilter: ["data-active"] })
    return () => {
      link.removeEventListener("pointerenter", play)
      link.removeEventListener("focus", play)
      active.disconnect()
    }
  }, [])

  if (!Icon) return null
  return (
    <span ref={anchor} className="contents">
      {/* looked up by name from the page tree, so created by hand rather than as JSX */}
      {createElement(Icon, { ref: icon, size: 16, trigger: "manual", "aria-hidden": true })}
    </span>
  )
}
