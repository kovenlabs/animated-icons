"use client"

import { createElement } from "react"

import { iconsByName } from "@/lib/catalog"

/** A small drawing board with the page's icon (its `icon` frontmatter, also the sidebar's) on it, looping. */
export function PageMark({ icon }: { icon?: string }) {
  const Icon = iconsByName.get(icon ?? "sparkles")
  if (!Icon) return null
  return (
    <div className="drafting relative hidden size-28 shrink-0 items-center justify-center border border-[var(--keyline)]/40 bg-background sm:flex">
      <span aria-hidden className="absolute inset-[8.33%] border border-dashed border-[var(--keyline)]/50" />
      {createElement(Icon, { size: 72, trigger: "auto", interval: 1400, "aria-hidden": true, className: "relative" })}
    </div>
  )
}
