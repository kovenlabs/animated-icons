"use client"

import type { IconCategory, Trigger } from "@kovenlabs/animated-icons"
import { ChevronDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { categories, icons, iconsByName, type CatalogIcon } from "@/lib/catalog"
import { slotColors, useIconStyle } from "@/lib/icon-style"
import { cn } from "@/lib/utils"

export const PREVIEWS = ["1st", "2nd", "3rd", "cycle"] as const
export type Preview = (typeof PREVIEWS)[number]

export const TRIGGERS: Array<Trigger | "default"> = ["default", "hover", "click", "inView", "auto", "none"]

const pressable =
  "transition-colors focus-visible:relative focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--keyline)]"

/** How many color slots an icon paints, shown as that many squares in the current palette. */
const COLOR_COUNTS = [
  { count: null, label: "Any", slots: [] },
  { count: 1, label: "One", slots: ["primary"] },
  { count: 2, label: "Two", slots: ["primary", "accent"] },
  { count: 3, label: "Three", slots: ["primary", "secondary", "accent"] },
] as const

/**
 * "Colors used": one, two or three color slots. Each option draws its slots in the palette you picked
 * and says how many icons it would leave, so the filter explains itself.
 */
export function ColorsFilter({
  value,
  onChange,
  pool,
}: {
  value: number | null
  onChange: (value: number | null) => void
  /** The icons the other filters leave, to count against. */
  pool: CatalogIcon[]
}) {
  const { style } = useIconStyle()
  const painted = slotColors(style.colors)
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">Colors used</span>
      <div role="radiogroup" aria-label="Colors used" className="flex gap-px border bg-border">
        {COLOR_COUNTS.map((option) => {
          const n = option.count === null ? pool.length : pool.filter((i) => i.meta.colors === option.count).length
          return (
            <button
              key={option.label}
              type="button"
              role="radio"
              aria-checked={value === option.count}
              aria-label={
                option.count === null
                  ? `Any number of colors, ${n} icons`
                  : `${option.label} color${option.count > 1 ? "s" : ""}, ${n} icons`
              }
              title={
                option.count === null
                  ? "Any number of colors"
                  : `Icons that paint ${option.count} color slot${option.count > 1 ? "s" : ""}`
              }
              onClick={() => onChange(option.count)}
              className={cn(
                pressable,
                "flex h-8 items-center gap-2 bg-background px-2.5 text-sm",
                value === option.count ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {option.count === null ? (
                option.label
              ) : (
                <span className="flex gap-0.5" aria-hidden>
                  {option.slots.map((slot) => (
                    <span key={slot} className="size-2.5" style={{ background: painted[slot] }} />
                  ))}
                </span>
              )}
              <span className="text-xs tabular-nums opacity-70">{n}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Which of each icon's moves the grid plays: the first, second, third, or all of them in turn. */
export function PreviewPicker({ value, onChange }: { value: Preview; onChange: (value: Preview) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">Move</span>
      <div role="radiogroup" aria-label="Move to preview" className="flex gap-px border bg-border">
        {PREVIEWS.map((preview) => (
          <button
            key={preview}
            type="button"
            role="radio"
            aria-checked={preview === value}
            onClick={() => onChange(preview)}
            className={cn(
              pressable,
              "h-8 bg-background px-2.5 text-sm",
              preview === value ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted",
            )}
          >
            {preview === "cycle" ? "Cycle" : preview}
          </button>
        ))}
      </div>
    </div>
  )
}

export function SizePicker({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <label className="flex w-36 flex-col gap-1.5">
      <span className="flex justify-between text-xs text-muted-foreground">
        Size <span className="text-foreground tabular-nums">{value}px</span>
      </span>
      <span className="flex h-8 items-center">
        <Slider
          min={16}
          max={64}
          step={4}
          value={[value]}
          onValueChange={(v) => onChange((Array.isArray(v) ? v[0] : v) as number)}
          aria-label="Preview size"
        />
      </span>
    </label>
  )
}

export function TriggerPicker({
  value,
  onChange,
}: {
  value: Trigger | "default"
  onChange: (value: Trigger | "default") => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">Trigger</span>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(pressable, "flex h-8 items-center gap-2 border bg-background px-2.5 text-sm hover:bg-muted")}
        >
          {value === "default" ? "Each icon's own" : value}
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuRadioGroup value={value} onValueChange={(v) => onChange(v as Trigger | "default")}>
            {TRIGGERS.map((trigger) => (
              <DropdownMenuRadioItem key={trigger} value={trigger}>
                {trigger === "default" ? "Each icon's own" : trigger}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

/** Categories, each led by its first icon so the list reads at a glance. */
export function CategoryList({
  category,
  onCategory,
}: {
  category: IconCategory | null
  onCategory: (category: IconCategory | null) => void
}) {
  const items = [{ category: null, count: icons.length }, ...categories]
  return (
    <nav aria-label="Categories" className="flex flex-col">
      {items.map((item) => {
        const first = item.category
          ? icons.find((i) => i.meta.category === item.category)
          : iconsByName.get("layout-grid")
        const Lead = first ?? icons[0]!
        const active = item.category === category
        return (
          <button
            key={item.category ?? "all"}
            type="button"
            aria-current={active ? "true" : undefined}
            onClick={() => onCategory(item.category)}
            className={cn(
              pressable,
              "group flex items-center gap-3 px-2 py-1.5 text-left text-sm capitalize",
              active ? "bg-foreground text-background" : "hover:bg-muted",
            )}
          >
            <Lead
              size={18}
              trigger="none"
              aria-hidden
              className={active ? "[--icon-primary:var(--background)]" : undefined}
            />
            <span className="flex-1">{item.category ?? "All icons"}</span>
            <span className="text-xs tabular-nums opacity-60">{item.count}</span>
          </button>
        )
      })}
    </nav>
  )
}
