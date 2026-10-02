"use client"

import type { AnimatedIconHandle } from "@kovenlabs/animated-icons"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef } from "react"

import { BRAND_COLORS, LogoMark } from "@/components/brand/logo"
import { CopyButton } from "@/components/catalog/copy-button"
import { Button } from "@/components/ui/button"
import { icons } from "@/lib/catalog"

const INSTALL = "npx shadcn add @kovenlabs/bell"

export function Hero() {
  const mark = useRef<AnimatedIconHandle>(null)

  // the badge launches once the page has settled, then on every hover
  useEffect(() => {
    const id = setTimeout(() => void mark.current?.play(), 400)
    return () => clearTimeout(id)
  }, [])

  return (
    <section className="icon-stage relative border-b">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-4 py-20 text-center sm:py-28">
        <span onPointerEnter={() => void mark.current?.play()} className="border bg-background p-5">
          <LogoMark ref={mark} size={88} colors={BRAND_COLORS} trigger="manual" aria-label="Animated Icons logo" />
        </span>
        <div className="flex flex-col items-center gap-4">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Icons that move. Colors that follow your theme.
          </h1>
          <p className="max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg">
            {icons.length} animated icons with one to three color slots, piped from your shadcn/ui tokens. Each one
            has its own animations. Copy them into your codebase with the shadcn CLI.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" nativeButton={false} render={<Link href="/icons" />}>
            Browse icons <ArrowRight />
          </Button>
          <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/docs" />}>
            Read the docs
          </Button>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 border bg-background py-1 pr-1 pl-4">
            <code className="font-mono text-sm">{INSTALL}</code>
            <CopyButton text={INSTALL} label="Copy" />
          </div>
          <p className="text-xs text-muted-foreground">
            or all {icons.length} at once with <code className="font-mono">@kovenlabs/all</code>, or{" "}
            <code className="font-mono">pnpm add @kovenlabs/animated-icons</code>
          </p>
        </div>
      </div>
    </section>
  )
}
