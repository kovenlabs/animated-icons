import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { RootProvider } from "fumadocs-ui/provider/next"

import { SiteHeader } from "@/components/site-header"
import { SITE_URL } from "@/lib/site"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

import "./globals.css"

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Animated Icons", template: "%s · Animated Icons" },
  description: "Animated icons with 1–3 color slots that take their colors from your shadcn/ui theme.",
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
