import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { RootProvider } from "fumadocs-ui/provider/next"

import { SiteHeader } from "@/components/site-header"
import { pageMetadata, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/seo"
import { GITHUB_URL, SITE_URL } from "@/lib/site"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

import "./globals.css"

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({ description: SITE_DESCRIPTION, path: "/" }),
  title: { default: `${SITE_NAME}: ${SITE_TAGLINE}`, template: `%s · ${SITE_NAME}` },
  applicationName: SITE_NAME,
  keywords: [
    "animated icons",
    "react icons",
    "shadcn",
    "shadcn/ui",
    "motion",
    "framer motion",
    "svg icons",
    "tailwind",
    "icon library",
    "next.js",
  ],
  authors: [{ name: "Kovenlabs", url: GITHUB_URL }],
  creator: "Kovenlabs",
  publisher: "Kovenlabs",
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        {/* Fumadocs' provider: themes (next-themes) and docs search for the whole site */}
        <RootProvider>
          <TooltipProvider>
            <SiteHeader />
            {children}
            <Toaster />
          </TooltipProvider>
        </RootProvider>
      </body>
    </html>
  )
}
