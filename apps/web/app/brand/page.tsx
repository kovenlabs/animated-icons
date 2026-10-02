"use client"

import type { AnimatedIconHandle } from "@kovenlabs/animated-icons"
import { useRef } from "react"

import { BRAND_COLORS, LogoMark } from "@/components/brand/logo"
import { CopyButton } from "@/components/catalog/copy-button"
import { Button } from "@/components/ui/button"

const SWATCHES = [
  { name: "Accent (badge)", value: "#2563eb" },
  { name: "Trail", value: "#10b981" },
  { name: "Ink", value: "#0a0a0a" },
  { name: "Paper", value: "#fafafa" },
]

export default function BrandPage() {
  const hero = useRef<AnimatedIconHandle>(null)

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 p-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Brand</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          <strong className="text-foreground">Escape.</strong> The canvas leaves its top-right corner open, the
          set&apos;s badge idiom, and the accent escapes through it along a motion trail. Three color slots, one
          motion: an icon, alive. The mark is itself an animated icon, built with this library.
        </p>
      </header>

      <section className="grid gap-px border bg-border md:grid-cols-[2fr_1fr]">
        <div className="icon-stage relative flex aspect-[4/3] items-center justify-center bg-background">
          <LogoMark ref={hero} size={200} colors={BRAND_COLORS} trigger="hover" aria-label="Animated Icons logo" />
          <div className="absolute right-3 bottom-3 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => void hero.current?.play()}>
              Launch
            </Button>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-6 bg-background p-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold">Sizes</h2>
            <div className="flex items-end gap-5">
              {[64, 32, 24, 16].map((size) => (
                <div key={size} className="flex flex-col items-center gap-1">
                  <LogoMark size={size} colors={BRAND_COLORS} />
                  <span className="font-mono text-[10px] text-muted-foreground">{size}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold">Mono &amp; favicon</h2>
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center border">
                <LogoMark size={28} colors={{ primary: "foreground" }} />
              </span>
              <span className="flex size-12 items-center justify-center bg-foreground">
                <LogoMark size={28} colors={{ primary: "background" }} />
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.svg" alt="Favicon" className="size-12" />
            </div>
            <p className="text-xs text-muted-foreground">
              One color paints the whole mark (the color cascade). At favicon sizes the trail is dropped.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Colors</h2>
        <div className="grid grid-cols-2 gap-px border bg-border sm:grid-cols-4">
          {SWATCHES.map((swatch) => (
            <div key={swatch.name} className="flex flex-col gap-2 bg-background p-4">
              <span className="h-12 border" style={{ background: swatch.value }} />
              <span className="text-xs">{swatch.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{swatch.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Files</h2>
        <div className="flex flex-wrap gap-2">
          <a href="/logo.svg" download className="border px-3 py-1.5 text-sm hover:bg-muted">
            logo.svg
          </a>
          <a href="/icon.svg" download className="border px-3 py-1.5 text-sm hover:bg-muted">
            favicon (icon.svg)
          </a>
          <CopyButton
            label="React usage"
            text={`import { LogoMark } from "@/components/brand/logo"\n\n<LogoMark colors={BRAND_COLORS} />`}
          />
        </div>
      </section>
    </main>
  )
}
