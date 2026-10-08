import Link from "next/link"

import { GITHUB_URL } from "@/lib/site"

import { BRAND_COLORS, BrandMark } from "./brand/logo"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <BrandMark size={20} colors={BRAND_COLORS} />
          <span className="text-sm text-muted-foreground">
            Animated Icons · MIT · built with the library it ships
          </span>
        </div>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/icons" className="hover:text-foreground">
            Icons
          </Link>
          <Link href="/docs" className="hover:text-foreground">
            Docs
          </Link>
          <Link href="/brand" className="hover:text-foreground">
            Brand
          </Link>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  )
}
