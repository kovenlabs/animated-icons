"use client"

import Link from "next/link"

import { icons } from "@/lib/catalog"

// a steady, uneven rhythm: every tile on its own timer so the wall never pulses in lockstep
const intervalFor = (i: number) => 1400 + ((i * 617) % 2600)

/** Every icon, playing on its own clock while the wall is on screen. */
export function IconWall() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-muted-foreground">/icons</p>
          <h2 className="text-2xl font-semibold tracking-tight">{icons.length} icons, all alive</h2>
        </div>
        <Link href="/icons" className="text-sm underline-offset-4 hover:underline">
          Open the catalog
        </Link>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] pt-px pl-px">
        {icons.map((Icon, i) => (
          <Link
            key={Icon.meta.name}
            href={`/icons?icon=${Icon.meta.name}`}
            title={Icon.meta.name}
            className="-mt-px -ml-px flex aspect-square items-center justify-center border bg-background transition-colors hover:bg-muted"
          >
            <Icon size={28} trigger="inView" interval={intervalFor(i)} aria-label={Icon.meta.name} />
          </Link>
        ))}
      </div>
    </section>
  )
}
