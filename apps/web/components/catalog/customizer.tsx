"use client"

import type { Corners, IconCategory, Trigger } from "@kovenlabs/animated-icons"
import { RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { categories, icons } from "@/lib/catalog"
import type { Customization } from "@/lib/snippet"
import { cn } from "@/lib/utils"

import { ColorPicker } from "./color-picker"
import { Segmented } from "./segmented"

export const ANIMATIONS = ["1st", "2nd", "3rd", "cycle"] as const
export type Animation = (typeof ANIMATIONS)[number]

export const DEFAULT_CUSTOMIZATION: Customization = {
  colors: {},
  size: 32,
  speed: 1,
  trigger: "default",
  corners: "round",
  cornerRadius: 2,
}

const CORNERS: Corners[] = ["round", "bevel", "sharp"]

const TRIGGERS: Array<Trigger | "default"> = ["default", "hover", "auto", "click", "inView", "none"]

const value = (v: number | readonly number[]) => (Array.isArray(v) ? v[0] : v) as number

export function Customizer({
  customization,
  onCustomization,
  animation,
  onAnimation,
}: {
  customization: Customization
  onCustomization: (customization: Customization) => void
  animation: Animation
  onAnimation: (animation: Animation) => void
}) {
  const update = (patch: Partial<Customization>) => onCustomization({ ...customization, ...patch })

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Customize</h2>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => {
            onCustomization(DEFAULT_CUSTOMIZATION)
            onAnimation("1st")
          }}
        >
          <RotateCcw /> Reset
        </Button>
      </div>

      <ColorPicker colors={customization.colors} onChange={(colors) => update({ colors })} />

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs">
          <span className="font-medium text-muted-foreground">Size</span>
          <span className="font-mono">{customization.size}px</span>
        </div>
        <Slider min={16} max={64} step={4} value={[customization.size]} onValueChange={(v) => update({ size: value(v) })} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs">
          <span className="font-medium text-muted-foreground">Speed</span>
          <span className="font-mono">{customization.speed}×</span>
        </div>
        <Slider
          min={0.25}
          max={2}
          step={0.25}
          value={[customization.speed]}
          onValueChange={(v) => update({ speed: value(v) })}
        />
      </div>

      <Segmented label="Corners" options={CORNERS} value={customization.corners} onChange={(corners) => update({ corners })} />

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs">
          <span className="font-medium text-muted-foreground">Radius</span>
          <span className="font-mono">{customization.corners === "sharp" ? "n/a" : customization.cornerRadius}</span>
        </div>
        <Slider
          min={0.5}
          max={4}
          step={0.5}
          disabled={customization.corners === "sharp"}
          value={[customization.cornerRadius]}
          onValueChange={(v) => update({ cornerRadius: value(v) })}
        />
      </div>
      <Segmented label="Trigger" options={TRIGGERS} value={customization.trigger} onChange={(trigger) => update({ trigger })} />
      <Segmented label="Animation" options={ANIMATIONS} value={animation} onChange={onAnimation} />
    </section>
  )
}

export function CategoryList({
  category,
  onCategory,
}: {
  category: IconCategory | null
  onCategory: (category: IconCategory | null) => void
}) {
  const items: Array<{ category: IconCategory | null; count: number }> = [
    { category: null, count: icons.length },
    ...categories,
  ]
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold">Categories</h2>
      <ul className="flex flex-col">
        {items.map((item) => (
          <li key={item.category ?? "all"}>
            <button
              type="button"
              onClick={() => onCategory(item.category)}
              className={cn(
                "flex w-full items-center justify-between px-2 py-1.5 text-sm capitalize transition-colors hover:bg-muted",
                item.category === category && "bg-foreground text-background hover:bg-foreground",
              )}
            >
              {item.category ?? "All icons"}
              <span className="font-mono text-xs opacity-60">{item.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
