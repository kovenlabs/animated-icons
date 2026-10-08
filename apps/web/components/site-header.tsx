import Link from "next/link"

import { GITHUB_URL } from "@/lib/site"

import { BrandLink } from "./brand/brand-link"
import { StyleMenu } from "./style/style-menu"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 h-14 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-2 px-4 sm:px-6">
        <BrandLink />
        <nav className="flex items-center gap-0.5 text-sm sm:gap-1">
          <Link href="/icons" className="px-2 py-1.5 hover:bg-muted sm:px-3">
            Icons
          </Link>
          <Link href="/docs" className="px-2 py-1.5 hover:bg-muted sm:px-3">
            Docs
          </Link>
          <Link href="/brand" className="hidden px-3 py-1.5 hover:bg-muted md:block">
            Brand
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden px-3 py-1.5 hover:bg-muted md:block"
          >
            GitHub
          </a>
          <StyleMenu />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
