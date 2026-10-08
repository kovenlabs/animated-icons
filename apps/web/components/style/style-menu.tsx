"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useIconStyle } from "@/lib/icon-style"

import { StyleControls, Swatch } from "./style-controls"

/** The site-wide icon style, one click away on every page. */
export function StyleMenu() {
  const { style, changed, reset } = useIconStyle()
  return (
    <Popover>
      <PopoverTrigger
        aria-label="Icon style"
        className="flex h-8 items-center gap-2 border px-2.5 text-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-[var(--keyline)]"
      >
        <Swatch colors={style.colors} />
        <span className="hidden sm:inline">Icon style</span>
      </PopoverTrigger>
      <PopoverContent align="end" className="max-h-[calc(100svh-5rem)] w-80 gap-4 overflow-y-auto p-4">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-sm text-pretty text-muted-foreground">
            Every icon on the site follows this, and it&apos;s kept for your next visit.
          </p>
          {changed && (
            <button type="button" onClick={reset} className="shrink-0 text-sm underline underline-offset-4">
              Reset
            </button>
          )}
        </div>
        <StyleControls />
      </PopoverContent>
    </Popover>
  )
}
