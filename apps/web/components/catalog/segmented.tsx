"use client"

import { cn } from "@/lib/utils"

/** A row of mutually exclusive options, square and compact. */
export function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
  format = String,
}: {
  label: string
  options: readonly T[]
  value: T | null
  onChange: (value: T) => void
  format?: (value: T) => string
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-px border bg-border">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={option === value}
            onClick={() => onChange(option)}
            className={cn(
              "flex-1 bg-background px-2 py-1.5 text-xs transition-colors",
              option === value ? "bg-foreground text-background" : "hover:bg-muted",
            )}
          >
            {format(option)}
          </button>
        ))}
      </div>
    </div>
  )
}
