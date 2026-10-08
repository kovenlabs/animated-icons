import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

// the drawing's own coordinates: the frame, the 2-unit padding every icon keeps, and the centre
const MARKS = [0, 2, 12, 22, 24]
const UNITS = Array.from({ length: 25 }, (_, i) => i)

/** The 24 × 24 grid every icon is drawn on, with the padding keylines at 2 and 22. */
export function ConstructionGrid() {
  return (
    <svg viewBox="0 0 24 24" className="absolute inset-0 size-full" aria-hidden>
      <g stroke="var(--grid-line)" strokeWidth={1} vectorEffect="non-scaling-stroke">
        {UNITS.map((u) => (
          <g key={u}>
            <line x1={u} y1={0} x2={u} y2={24} vectorEffect="non-scaling-stroke" />
            <line x1={0} y1={u} x2={24} y2={u} vectorEffect="non-scaling-stroke" />
          </g>
        ))}
      </g>
      <g stroke="var(--keyline)" strokeWidth={1} fill="none" vectorEffect="non-scaling-stroke">
        <rect x={2} y={2} width={20} height={20} strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
        <line x1={12} y1={0} x2={12} y2={24} strokeOpacity={0.4} vectorEffect="non-scaling-stroke" />
        <line x1={0} y1={12} x2={24} y2={12} strokeOpacity={0.4} vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  )
}

export function Ruler({ axis }: { axis: "x" | "y" }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative text-[11px] text-muted-foreground tabular-nums",
        axis === "x" ? "h-5 w-full" : "h-full w-5",
      )}
    >
      {MARKS.map((mark) => (
        <span
          key={mark}
          className={cn("absolute", axis === "x" ? "top-0 -translate-x-1/2" : "right-1.5 -translate-y-1/2")}
          style={axis === "x" ? { left: `${(mark / 24) * 100}%` } : { top: `${(mark / 24) * 100}%` }}
        >
          {mark}
        </span>
      ))}
    </div>
  )
}

/** An icon's 24 × 24 drawing grid at full size, with rulers: put an icon at `size="100%"` inside. */
export function DraftingBoard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-[1.25rem_1fr] grid-rows-[1.25rem_auto]", className)}>
      <span />
      <Ruler axis="x" />
      <Ruler axis="y" />
      <div className="relative aspect-square w-full border border-[var(--keyline)]/40 bg-background">
        <ConstructionGrid />
        {children}
      </div>
    </div>
  )
}
