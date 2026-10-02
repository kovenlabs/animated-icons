import Link from "next/link"

import { GITHUB_URL } from "@/lib/site"

import { BrandLink } from "./brand/brand-link"
import { ThemeToggle } from "./theme-toggle"


export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 h-14 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-6">
        <BrandLink />
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/icons" className="px-3 py-1.5 hover:bg-muted">
            Icons
          </Link>
          <Link href="/docs" className="px-3 py-1.5 hover:bg-muted">
            Docs
          </Link>
          <Link href="/brand" className="hidden px-3 py-1.5 hover:bg-muted sm:block">
            Brand
          </Link>
          <a href={GITHUB_URL} className="hidden px-3 py-1.5 hover:bg-muted sm:block">
            GitHub
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
