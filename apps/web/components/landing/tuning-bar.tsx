"use client"

import { CornersPicker, PresetPicker, RadiusSlider, StrokeSlider } from "@/components/style/style-controls"
import { icons } from "@/lib/catalog"
import { useIconStyle } from "@/lib/icon-style"

/** The site-wide style, laid out as a bar: what a user sets once in their provider or config.ts. */
export function TuningBar() {
  const { changed, reset } = useIconStyle()

  return (
    <div className="sticky top-14 z-30 border-y bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5 sm:px-6">
        <PresetPicker />
        <CornersPicker />
        <RadiusSlider className="hidden w-36 md:flex" />
        <StrokeSlider className="hidden w-36 md:flex" />
        <p className="ml-auto hidden text-sm text-muted-foreground xl:block" aria-live="polite">
          {changed ? (
            <>
              Applied to all {icons.length} icons, on every page.{" "}
              <button type="button" className="text-foreground underline underline-offset-4" onClick={reset}>
                Reset
              </button>
            </>
          ) : (
            <>One provider styles every icon on the site.</>
          )}
        </p>
      </div>
    </div>
  )
}
