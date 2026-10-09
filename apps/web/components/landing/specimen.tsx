"use client"

import type { ColorSlot } from "@kovenlabs/animated-icons"
import { ChevronLeft, ChevronRight, Shuffle } from "lucide-react"

import { CopyButton } from "@/components/catalog/copy-button"
import { Button } from "@/components/ui/button"
import type { CatalogIcon } from "@/lib/catalog"
import { useIconStyle } from "@/lib/icon-style"
import { usageSnippet } from "@/lib/snippet"
import { DraftingBoard } from "@/components/style/drafting"
import { cn } from "@/lib/utils"

const SLOTS: ColorSlot[] = ["primary", "secondary", "accent"]

export function Specimen({
  icon,
  variant,
  onVariant,
  onStep,
  onShuffle,
}: {
  icon: CatalogIcon
  variant: string
  onVariant: (variant: string) => void
  onStep: (by: number) => void
  onShuffle: () => void
}) {
  const { style } = useIconStyle()
  const { meta } = icon
  const Icon = icon
  const code = usageSnippet(meta, variant, style, { imports: false })

  return (
    <figure className="flex w-full flex-col gap-4">
      <DraftingBoard>
        <Icon
          key={`${meta.name}:${variant}`}
          size="100%"
          variant={variant}
          trigger="auto"
          interval={700}
          className="relative"
          aria-label={`${meta.name}, ${variant}`}
        />
      </DraftingBoard>

      <figcaption className="flex flex-col gap-3 pl-5">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => onStep(-1)} aria-label="Previous icon">
            <ChevronLeft />
          </Button>
          <p className="min-w-0 flex-1 truncate text-center" aria-live="polite">
            <span className="font-medium">{meta.name}</span>
            <span className="text-muted-foreground"> in {meta.category}</span>
          </p>
          <Button variant="outline" size="icon" onClick={() => onStep(1)} aria-label="Next icon">
            <ChevronRight />
          </Button>
          <Button variant="outline" size="icon" onClick={onShuffle} aria-label="Random icon">
            <Shuffle />
          </Button>
        </div>

        <div role="radiogroup" aria-label="Animation" className="flex gap-px border bg-border">
          {meta.variants.map((name) => (
            <button
              key={name}
              type="button"
              role="radio"
              aria-checked={name === variant}
              onClick={() => onVariant(name)}
              className={cn(
                "flex-1 bg-background px-2 py-2 text-sm transition-colors focus-visible:relative focus-visible:outline-2 focus-visible:outline-[var(--keyline)]",
                name === variant ? "bg-foreground text-background" : "hover:bg-muted",
              )}
            >
              {name}
            </button>
          ))}
        </div>

        <dl className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {SLOTS.filter((slot) => meta.slots[slot]).map((slot) => (
            <div key={slot} className="flex items-center gap-2">
              <dt className="flex items-center gap-2">
                <span className="size-3 shrink-0" style={{ background: `var(--icon-${slot})` }} />
                {slot}
              </dt>
              <dd className="text-muted-foreground">{meta.slots[slot]}</dd>
            </div>
          ))}
        </dl>

        <div className="flex items-start gap-2 border bg-muted/40 pr-2">
          <pre className="min-w-0 flex-1 overflow-x-auto py-3 pl-3 font-mono text-[13px] leading-relaxed">{code}</pre>
          <CopyButton text={code} label="Copy JSX" className="mt-2 shrink-0" />
        </div>
      </figcaption>
    </figure>
  )
}
