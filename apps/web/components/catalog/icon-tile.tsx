"use client"

import type { AnimatedIconHandle, Trigger } from "@kovenlabs/animated-icons"
import { useEffect, useRef } from "react"

import type { CatalogIcon } from "@/lib/catalog"
import { cn } from "@/lib/utils"

/**
 * A grid cell. Hover-driven icons play when the whole tile is hovered, not just the glyph;
 * icons with their own behaviour (a loader loops) keep it unless a trigger is forced.
 */
export function IconTile({
  icon: Icon,
  variant,
  size,
  trigger,
  selected,
  onOpen,
}: {
  icon: CatalogIcon
  variant: string
  size: number
  trigger: Trigger | "default"
  selected: boolean
  onOpen: () => void
}) {
  const ref = useRef<AnimatedIconHandle>(null)
  const shown = useRef(variant)
  const effective = trigger === "default" ? (Icon.meta.defaults?.trigger ?? "hover") : trigger
  const hoverDriven = effective === "hover"

  // a new variant (the Animation control) shows itself. Compared to the last one shown, not a
  // "mounted" flag: StrictMode runs effects twice and would play every tile on load.
  useEffect(() => {
    if (shown.current === variant) return
    shown.current = variant
    void ref.current?.play()
  }, [variant])

  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerEnter={() => hoverDriven && void ref.current?.play()}
      aria-pressed={selected}
      className={cn(
        "group relative -mt-px -ml-px flex aspect-square border flex-col items-center justify-center gap-2 bg-background p-3 outline-none transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-[var(--keyline)] focus-visible:ring-inset",
        selected && "drafting bg-background ring-2 ring-[var(--keyline)] ring-inset hover:bg-background",
      )}
    >
      <span className="flex flex-1 items-center justify-center">
        <Icon
          key={variant}
          ref={ref}
          variant={variant}
          size={size}
          trigger={hoverDriven ? "manual" : trigger === "default" ? undefined : trigger}
        />
      </span>
      <span
        className={cn(
          "w-full truncate text-center text-xs text-muted-foreground group-hover:text-foreground",
          selected && "text-foreground",
        )}
      >
        {Icon.meta.name}
      </span>
    </button>
  )
}
