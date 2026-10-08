"use client"

import { Rocket, type ColorSlot } from "@kovenlabs/animated-icons"
import { Check, ChevronDown } from "lucide-react"
import { useState, type ReactNode } from "react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { CORNERS, PRESETS, SLOTS, cssColor, presetOf, slotColors, useIconStyle } from "@/lib/icon-style"
import { cn } from "@/lib/utils"

const TOKENS = [
  { token: "foreground", name: "Foreground" },
  { token: "muted-foreground", name: "Muted" },
  { token: "primary", name: "Primary" },
  { token: "destructive", name: "Destructive" },
  { token: "chart-1", name: "Chart 1" },
  { token: "chart-2", name: "Chart 2" },
  { token: "chart-3", name: "Chart 3" },
  { token: "chart-4", name: "Chart 4" },
  { token: "chart-5", name: "Chart 5" },
]

const SLOT_INFO: Record<ColorSlot, { title: string; body: string; auto: string }> = {
  primary: { title: "Primary", body: "The main shape", auto: "From your theme" },
  secondary: { title: "Secondary", body: "Supporting parts", auto: "Same as primary" },
  accent: { title: "Accent", body: "The part that moves", auto: "Same as secondary" },
}

const pressable =
  "transition-colors focus-visible:relative focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--keyline)]"

const sliderValue = (v: number | readonly number[]) => (Array.isArray(v) ? v[0] : v) as number

/** Three squares: what primary, secondary and accent paint with these colors. */
export function Swatch({ colors, className }: { colors: Parameters<typeof slotColors>[0]; className?: string }) {
  const painted = slotColors(colors)
  return (
    <span className={cn("flex shrink-0", className)} aria-hidden>
      {SLOTS.map((slot) => (
        <span key={slot} className="size-2.5" style={{ background: painted[slot] }} />
      ))}
    </span>
  )
}

/** The palettes as one row of radios. A customized slot shows as "Custom". */
export function PresetPicker({ wrap = false, className }: { wrap?: boolean; className?: string }) {
  const { style, update } = useIconStyle()
  const active = presetOf(style.colors)
  // one joined strip in a bar; separate chips when it wraps, so a short last row leaves no filled gap
  const chip = wrap && "border"
  return (
    <div
      role="radiogroup"
      aria-label="Palette"
      className={cn(
        wrap ? "flex flex-wrap gap-1" : "flex max-w-full gap-px overflow-x-auto border bg-border",
        className,
      )}
    >
      {PRESETS.map((preset) => (
        <button
          key={preset.name}
          type="button"
          role="radio"
          aria-checked={preset.name === active}
          onClick={() => update({ colors: preset.colors })}
          className={cn(
            pressable,
            "flex shrink-0 items-center gap-2 bg-background px-2.5 py-1.5 text-sm",
            chip,
            preset.name === active ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted",
          )}
        >
          <Swatch colors={preset.colors} />
          {preset.name}
        </button>
      ))}
      {active === null && (
        <span className={cn("flex shrink-0 items-center gap-2 bg-muted px-2.5 py-1.5 text-sm font-medium", chip)}>
          <Swatch colors={style.colors} />
          Custom
        </span>
      )}
    </div>
  )
}

function SlotPopover({ slot }: { slot: ColorSlot }) {
  const { style, update } = useIconStyle()
  const [open, setOpen] = useState(false)
  const value = style.colors[slot]
  const painted = slotColors(style.colors)[slot]
  const set = (next: string | undefined) => update({ colors: { ...style.colors, [slot]: next } })
  const hex = value?.startsWith("#") ? value : ""

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          pressable,
          "flex h-8 min-w-0 items-center gap-2 border bg-background pr-2 pl-1.5 text-sm hover:bg-muted",
        )}
        aria-label={`${SLOT_INFO[slot].title} color: ${value ?? SLOT_INFO[slot].auto}`}
      >
        <span className="size-5 shrink-0 border" style={{ background: painted }} />
        <span className="min-w-0 truncate">
          {value ? (TOKENS.find((t) => t.token === value)?.name ?? value) : "Auto"}
        </span>
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 gap-3 p-3">
        <button
          type="button"
          onClick={() => {
            set(undefined)
            setOpen(false)
          }}
          className={cn(
            pressable,
            "flex items-center justify-between border px-2.5 py-2 text-left text-sm hover:bg-muted",
          )}
        >
          <span className="flex flex-col">
            <span className="font-medium">Auto</span>
            <span className="text-xs text-muted-foreground">{SLOT_INFO[slot].auto}</span>
          </span>
          {value === undefined && <Check className="size-4" />}
        </button>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Theme tokens, they follow light and dark</span>
          <div className="grid grid-cols-3 gap-1">
            {TOKENS.map(({ token, name }) => (
              <button
                key={token}
                type="button"
                onClick={() => {
                  set(token)
                  setOpen(false)
                }}
                aria-pressed={value === token}
                className={cn(
                  pressable,
                  "flex items-center gap-1.5 border px-1.5 py-1 text-left text-xs hover:bg-muted",
                  value === token && "border-foreground",
                )}
              >
                <span className="size-3 shrink-0 border" style={{ background: cssColor(token) }} />
                <span className="truncate">{name}</span>
              </button>
            ))}
          </div>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Any color</span>
          <span className="flex items-center gap-2 border px-1.5 py-1">
            <span className="relative size-6 shrink-0 border" style={{ background: hex || "transparent" }}>
              <input
                type="color"
                value={hex || "#2563eb"}
                onChange={(event) => set(event.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label={`Pick a ${slot} color`}
              />
            </span>
            <input
              type="text"
              inputMode="text"
              spellCheck={false}
              placeholder="#2563eb or oklch(…)"
              defaultValue={hex}
              key={hex}
              onKeyDown={(event) => event.key === "Enter" && event.currentTarget.blur()}
              onBlur={(event) => {
                const next = event.target.value.trim()
                if (next && CSS.supports("color", next)) set(next)
              }}
              className="min-w-0 flex-1 bg-transparent font-mono text-xs outline-none"
            />
          </span>
        </label>
      </PopoverContent>
    </Popover>
  )
}

/**
 * One row per slot, each with a rocket that lights up only the parts that slot paints, so the three
 * slots explain themselves.
 */
export function SlotEditor() {
  const { style } = useIconStyle()
  const painted = slotColors(style.colors)
  return (
    <div className="flex flex-col gap-2">
      {SLOTS.map((slot) => {
        const dim = "color-mix(in oklch, var(--muted-foreground) 30%, transparent)"
        const lit = Object.fromEntries(SLOTS.map((s) => [s, s === slot ? painted[slot] : dim]))
        return (
          <div key={slot} className="flex items-center gap-3">
            <span className="drafting flex size-10 shrink-0 items-center justify-center border">
              <Rocket size={26} colors={lit} trigger="none" aria-hidden />
            </span>
            <span className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="text-sm font-medium">{SLOT_INFO[slot].title}</span>
              <span className="truncate text-xs text-muted-foreground">{SLOT_INFO[slot].body}</span>
            </span>
            <SlotPopover slot={slot} />
          </div>
        )
      })}
    </div>
  )
}

export function CornersPicker({ className }: { className?: string }) {
  const { style, update } = useIconStyle()
  return (
    <div role="radiogroup" aria-label="Corners" className={cn("flex gap-px border bg-border", className)}>
      {CORNERS.map((corners) => (
        <button
          key={corners}
          type="button"
          role="radio"
          aria-checked={corners === style.corners}
          onClick={() => update({ corners })}
          className={cn(
            pressable,
            "flex-1 bg-background px-2.5 py-1.5 text-sm",
            corners === style.corners ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted",
          )}
        >
          {corners}
        </button>
      ))}
    </div>
  )
}

function Measure({
  label,
  shown,
  children,
  className,
}: {
  label: string
  shown: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn("flex flex-col gap-2", className)}>
      <span className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums">{shown}</span>
      </span>
      {children}
    </label>
  )
}

export function RadiusSlider({ className }: { className?: string }) {
  const { style, update } = useIconStyle()
  const sharp = style.corners === "sharp"
  return (
    <Measure label="Corner radius" shown={sharp ? "Off" : style.cornerRadius} className={className}>
      <Slider
        min={0.5}
        max={4}
        step={0.5}
        disabled={sharp}
        value={[style.cornerRadius]}
        onValueChange={(v) => update({ cornerRadius: sliderValue(v) })}
        aria-label="Corner radius"
      />
    </Measure>
  )
}

export function StrokeSlider({ className }: { className?: string }) {
  const { style, update } = useIconStyle()
  return (
    <Measure label="Stroke width" shown={style.strokeWidth} className={className}>
      <Slider
        min={1}
        max={3}
        step={0.25}
        value={[style.strokeWidth]}
        onValueChange={(v) => update({ strokeWidth: sliderValue(v) })}
        aria-label="Stroke width"
      />
    </Measure>
  )
}

export function SpeedSlider({ className }: { className?: string }) {
  const { style, update } = useIconStyle()
  return (
    <Measure label="Speed" shown={`${style.speed}×`} className={className}>
      <Slider
        min={0.25}
        max={2}
        step={0.25}
        value={[style.speed]}
        onValueChange={(v) => update({ speed: sliderValue(v) })}
        aria-label="Animation speed"
      />
    </Measure>
  )
}

/** Every style control, stacked: the header popover and the catalog's style panel. */
export function StyleControls() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Palette</span>
        <PresetPicker wrap />
      </div>
      <SlotEditor />
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Corners</span>
        <CornersPicker />
      </div>
      <RadiusSlider />
      <StrokeSlider />
      <SpeedSlider />
    </div>
  )
}
