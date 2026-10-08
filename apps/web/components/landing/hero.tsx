"use client"

import Link from "next/link"
import { useState, type ReactNode } from "react"

import { InstallMenu } from "@/components/install-menu"
import { Button } from "@/components/ui/button"
import { iconsByName, icons } from "@/lib/catalog"

import { Specimen } from "./specimen"

// three slots and three moves: the specimen opens on an icon that shows the most at once
const FIRST = iconsByName.get("rocket") ?? icons[0]!

/** `status` is the live npm and GitHub strip, rendered on the server. */
export function Hero({ status }: { status?: ReactNode }) {
  const [index, setIndex] = useState(icons.indexOf(FIRST))
  const icon = icons[index]!
  const [variant, setVariant] = useState(icon.meta.defaultVariant)

  const show = (next: number) => {
    const wrapped = (next + icons.length) % icons.length
    setIndex(wrapped)
    setVariant(icons[wrapped]!.meta.defaultVariant)
  }

  return (
    <section className="mx-auto grid w-full max-w-[1440px] gap-12 px-4 pt-10 pb-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-16 lg:pt-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,29rem)]">
      <div className="flex flex-col gap-8 lg:pt-8">
        <h1 className="dot-headline text-[clamp(3.25rem,10vw,8.5rem)] leading-[0.9] text-balance">Icons that move.</h1>
        <p className="max-w-[34rem] text-lg leading-relaxed text-pretty text-muted-foreground">
          <span className="text-foreground">
            {icons.length} animated React icons whose colors follow your shadcn/ui theme.
          </span>{" "}
          Each has its own set of moves, and every corner is rounded at render time, so the whole set takes on the shape
          of your brand.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" nativeButton={false} render={<Link href="/icons" />}>
            Browse {icons.length} icons
          </Button>
          <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/docs" />}>
            Read the docs
          </Button>
          <InstallMenu name="all" />
        </div>
        {status}
      </div>

      <Specimen
        icon={icon}
        variant={variant}
        onVariant={setVariant}
        onStep={(by) => show(index + by)}
        onShuffle={() => show(index + 1 + Math.floor(Math.random() * (icons.length - 1)))}
      />
    </section>
  )
}
