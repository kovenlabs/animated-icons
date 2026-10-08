"use client"

import Link from "next/link"

import { icons } from "@/lib/catalog"

// on a phone the full wall is thousands of pixels of scrolling: show a screenful and send the rest to the catalog
const PHONE_LIMIT = 60

// a steady, uneven rhythm: every tile on its own timer so the wall never pulses in lockstep
const intervalFor = (i: number) => 1400 + ((i * 617) % 2600)

/** Every icon, playing on its own clock while the wall is on screen. */
export function IconWall() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pt-20 pb-16 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div className="flex max-w-xl flex-col gap-2">
          <h2 className="text-3xl font-semibold tracking-tight">All {icons.length}, playing</h2>
          <p className="text-muted-foreground">
            Each one runs on its own clock. Change the palette or the corners in the bar above and every icon here
            redraws, the same way your own theme and config would restyle them.
          </p>
        </div>
        <Link href="/icons" className="text-sm font-medium underline underline-offset-4">
          Search the catalog
        </Link>
      </div>
      <ul className="wall grid grid-cols-[repeat(auto-fill,minmax(4rem,1fr))]">
        {icons.map((Icon, i) => (
          <li key={Icon.meta.name} className={i >= PHONE_LIMIT ? "max-sm:hidden" : undefined}>
            <Link
              href={`/icons?icon=${Icon.meta.name}`}
              className="group relative flex aspect-square items-center justify-center transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--keyline)]"
            >
              <Icon size={28} trigger="inView" interval={intervalFor(i)} aria-hidden />
              <span className="pointer-events-none absolute inset-x-0 bottom-1 truncate px-1 text-center text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {Icon.meta.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted-foreground sm:hidden">
        Showing {PHONE_LIMIT} of {icons.length}.{" "}
        <Link href="/icons" className="text-foreground underline underline-offset-4">
          See them all in the catalog
        </Link>
      </p>
    </section>
  )
}
