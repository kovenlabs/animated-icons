"use client"

import { Bot, Check, ChevronDown, Copy, Package, Terminal } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { installOptions, type InstallOption } from "@/lib/snippet"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "animated-icons:install"

const GROUPS: Array<{ group: InstallOption["group"]; title: string; icon: typeof Bot }> = [
  { group: "agent", title: "For your AI agent", icon: Bot },
  { group: "registry", title: "Copy the source", icon: Terminal },
  { group: "package", title: "Install the package", icon: Package },
]

function remembered() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "shadcn"
  } catch {
    return "shadcn"
  }
}

/**
 * Every way to install an icon or the set, behind one split button: the main half copies the way you
 * used last, the arrow lists them all.
 */
export function InstallMenu({ name, className }: { name: string | "all"; className?: string }) {
  const options = installOptions(name)
  const [chosen, setChosen] = useState("shadcn")
  const [copied, setCopied] = useState(false)

  // eslint-disable-next-line react-hooks/set-state-in-effect -- the last-used way, read once after mount
  useEffect(() => setChosen(remembered()), [])

  const current = options.find((o) => o.id === chosen) ?? options[1]!

  const copy = async (option: InstallOption) => {
    await navigator.clipboard.writeText(option.text)
    setChosen(option.id)
    try {
      localStorage.setItem(STORAGE_KEY, option.id)
    } catch {
      // storage blocked: the choice lasts for this visit
    }
    setCopied(true)
    toast.success(option.id === "prompt" ? "Copied the prompt. Paste it into your agent." : `Copied: ${option.text}`)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={cn("flex h-8 items-stretch border bg-background text-sm", className)}>
      <button
        type="button"
        onClick={() => void copy(current)}
        className="flex min-w-0 flex-1 items-center gap-2 px-2.5 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--keyline)]"
      >
        {copied ? <Check className="size-4 shrink-0" /> : <Copy className="size-4 shrink-0" />}
        <span className="truncate">
          {name === "all" ? "Install all" : "Install"}{" "}
          <span className="text-muted-foreground">with {current.label}</span>
        </span>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="More ways to install"
          className="flex items-center border-l px-2 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--keyline)] data-popup-open:bg-muted"
        >
          <ChevronDown className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[22rem] p-1">
          {GROUPS.map(({ group, title, icon: Icon }, i) => (
            <DropdownMenuGroup key={group}>
              {i > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon className="size-3.5" /> {title}
              </DropdownMenuLabel>
              {options
                .filter((o) => o.group === group)
                .map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => void copy(option)}
                    className="flex flex-col items-start gap-0.5 py-2"
                  >
                    <span className="flex w-full items-center justify-between gap-2 font-medium">
                      {option.label}
                      {option.id === current.id && (
                        <span className="text-xs font-normal text-muted-foreground">last used</span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">{option.hint}</span>
                    {option.id !== "prompt" && (
                      <code className="mt-0.5 w-full truncate font-mono text-[11px] text-foreground/80">
                        {option.text}
                      </code>
                    )}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuGroup>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
