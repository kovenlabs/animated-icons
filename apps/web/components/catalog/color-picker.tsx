"use client"

import type { ColorSlot, IconColors } from "@kovenlabs/animated-icons"

import { cn } from "@/lib/utils"

const TOKENS = ["foreground", "muted-foreground", "primary", "destructive", "chart-1", "chart-2", "chart-3", "chart-4", "chart-5"]
const SLOTS: ColorSlot[] = ["primary", "secondary", "accent"]
const ABOVE: Record<ColorSlot, string> = { primary: "theme", secondary: "primary", accent: "secondary" }

function Swatch({ color, active, label, onClick }: { color: string; active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "size-5 border border-border outline-offset-2 transition-transform hover:scale-110",
        active && "outline-2 outline-foreground",
      )}
      style={{ background: color }}
    />
  )
}

/**
 * One row per slot. "Auto" leaves the slot unset, so it cascades from the slot above it,
 * exactly like the library: primary → secondary → accent.
 */
export function ColorPicker({ colors, onChange }: { colors: IconColors; onChange: (colors: IconColors) => void }) {
  const set = (slot: ColorSlot, value: string | undefined) => onChange({ ...colors, [slot]: value })

  return (
    <div className="flex flex-col gap-3">
      {SLOTS.map((slot) => {
        const value = colors[slot]
        const custom = value?.startsWith("#") ? value : "#888888"
        return (
          <div key={slot} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono">{slot}</span>
              <span className="text-muted-foreground">{value ?? `auto (${ABOVE[slot]})`}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => set(slot, undefined)}
                aria-pressed={value === undefined}
                className={cn(
                  "h-5 border px-1.5 text-[10px] leading-none text-muted-foreground",
                  value === undefined && "border-foreground text-foreground",
                )}
              >
                auto
              </button>
              {TOKENS.map((token) => (
                <Swatch
                  key={token}
                  color={`var(--${token})`}
                  label={token}
                  active={value === token}
                  onClick={() => set(slot, token)}
                />
              ))}
              <label
                title="Custom color"
                className={cn(
                  "relative size-5 cursor-pointer border border-dashed border-border bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)]",
                  value?.startsWith("#") && "outline-2 outline-offset-2 outline-foreground",
                )}
              >
                <input
                  type="color"
                  value={custom}
                  onChange={(event) => set(slot, event.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  aria-label={`Custom ${slot} color`}
                />
              </label>
            </div>
          </div>
        )
      })}
    </div>
  )
}
