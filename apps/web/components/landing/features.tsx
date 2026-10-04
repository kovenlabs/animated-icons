"use client"

import {
  AlertTriangle,
  Bell,
  Calendar,
  Mail,
  Star,
  type AnimatedIconHandle,
  type Corners,
  type IconColors,
} from "@kovenlabs/animated-icons"
import { useEffect, useRef, useState, type ReactNode } from "react"

import { Segmented } from "@/components/catalog/segmented"
import { Slider } from "@/components/ui/slider"

function Feature({ label, title, body, children }: { label: string; title: string; body: string; children: ReactNode }) {
  return (
    <article className="flex flex-col bg-background">
      <div className="icon-stage flex min-h-56 flex-1 flex-col items-center justify-center gap-6 border-b p-6">
        {children}
      </div>
      <div className="flex flex-col gap-2 p-6">
        <p className="font-mono text-xs text-muted-foreground">{label}</p>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{body}</p>
      </div>
    </article>
  )
}

const PALETTES: Array<{ label: string; colors?: IconColors }> = [
  { label: "Theme" },
  { label: "1 color", colors: { primary: "chart-1" } },
  { label: "2 colors", colors: { primary: "foreground", secondary: "destructive" } },
  { label: "Ocean", colors: { primary: "chart-3", secondary: "chart-2", accent: "#38bdf8" } },
]

function ColorsDemo() {
  const [palette, setPalette] = useState(PALETTES[0]!.label)
  const colors = PALETTES.find((p) => p.label === palette)?.colors
  return (
    <>
      <Mail size={96} colors={colors} trigger="auto" interval={1600} />
      <div className="w-full max-w-xs">
        <Segmented label="Palette" options={PALETTES.map((p) => p.label)} value={palette} onChange={setPalette} />
      </div>
    </>
  )
}

const BELL_VARIANTS = ["ring", "shake", "jump"] as const

function VariantsDemo() {
  const [variant, setVariant] = useState<(typeof BELL_VARIANTS)[number]>("ring")
  const bell = useRef<AnimatedIconHandle>(null)
  const shown = useRef(variant)
  useEffect(() => {
    if (shown.current === variant) return
    shown.current = variant
    void bell.current?.play()
  }, [variant])
  return (
    <>
      <span onPointerEnter={() => void bell.current?.play()}>
        <Bell key={variant} ref={bell} size={96} variant={variant} trigger="manual" />
      </span>
      <div className="w-full max-w-xs">
        <Segmented label="variant" options={BELL_VARIANTS} value={variant} onChange={setVariant} />
      </div>
    </>
  )
}

const CORNERS: Corners[] = ["round", "bevel", "sharp"]

function CornersDemo() {
  const [corners, setCorners] = useState<Corners>("round")
  const [radius, setRadius] = useState(2)
  return (
    <>
      <div className="flex items-center gap-6">
        {[AlertTriangle, Star, Calendar].map((Icon, i) => (
          <Icon key={i} size={64} corners={corners} cornerRadius={radius} />
        ))}
      </div>
      <div className="flex w-full max-w-xs flex-col gap-3">
        <Segmented label="corners" options={CORNERS} value={corners} onChange={setCorners} />
        <Slider
          min={0.5}
          max={4}
          step={0.5}
          disabled={corners === "sharp"}
          value={[radius]}
          onValueChange={(v) => setRadius(Array.isArray(v) ? (v[0] as number) : (v as number))}
          aria-label="Corner radius"
        />
      </div>
    </>
  )
}

export function Features() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6">
      <div className="mb-6">
        <p className="font-mono text-xs text-muted-foreground">why</p>
        <h2 className="text-2xl font-semibold tracking-tight">Built for design systems, not screenshots</h2>
      </div>
      <div className="grid gap-px border bg-border lg:grid-cols-3">
        <Feature
          label="colors"
          title="Your theme's colors"
          body="Three slots, read from your shadcn tokens, dark mode included. Give one color and it paints the whole icon; give two and the third follows."
        >
          <ColorsDemo />
        </Feature>
        <Feature
          label="variants"
          title="Every icon, its own moves"
          body="A bell rings, shakes or jumps. Variant names are typed per icon, in props and in your global config. Re-trigger mid-animation and it picks up from where it is."
        >
          <VariantsDemo />
        </Feature>
        <Feature
          label="corners"
          title="Round, bevel or sharp"
          body="Drawn sharp, rendered round: the geometry itself is reshaped at render, at whatever radius fits your brand. One prop, the whole set."
        >
          <CornersDemo />
        </Feature>
      </div>
    </section>
  )
}
