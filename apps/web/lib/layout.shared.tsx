import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

/** The docs layout's own nav: the site header already carries the logo and links. */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <span className="dot-headline text-xl">docs</span>,
    },
    // the site header has the theme toggle
    themeSwitch: { enabled: false },
  }
}
