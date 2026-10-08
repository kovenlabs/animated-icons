"use client"

import { Bell, Check, Heart, Loader, Send, type AnimatedIconHandle } from "@kovenlabs/animated-icons"
import { useRef, type ReactNode } from "react"

import { Button } from "@/components/ui/button"

function Station({ trigger, body, children }: { trigger: string; body: string; children: ReactNode }) {
  return (
    <li className="flex flex-col bg-background">
      <div className="drafting flex h-40 items-center justify-center gap-4 border-b">{children}</div>
      <div className="flex flex-col gap-1.5 p-5">
        <code className="font-mono text-sm">trigger=&quot;{trigger}&quot;</code>
        <p className="text-sm text-muted-foreground">{body}</p>
      </div>
    </li>
  )
}

function ManualDemo() {
  const send = useRef<AnimatedIconHandle>(null)
  return (
    <>
      <Send ref={send} size={56} trigger="manual" aria-label="send" />
      <Button variant="outline" size="sm" onClick={() => void send.current?.play()}>
        Send
      </Button>
    </>
  )
}

/** The five triggers, each on an icon that suits it. */
export function Triggers() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6">
      <div className="mb-8 flex max-w-xl flex-col gap-2">
        <h2 className="text-3xl font-semibold tracking-tight">Five ways to start a move</h2>
        <p className="text-muted-foreground">
          Set a trigger per icon, per subtree or once for the whole app. Re-trigger mid-move and it carries on from the
          pose it&apos;s in.
        </p>
      </div>
      <ul className="grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-5">
        <Station trigger="hover" body="Plays once when the pointer lands on it. The default.">
          <Bell size={56} trigger="hover" aria-label="bell" />
        </Station>
        <Station trigger="click" body="Plays on every click or tap.">
          <Heart size={56} trigger="click" variant="burst" aria-label="heart" />
        </Station>
        <Station trigger="inView" body="Loops while it's on screen and rests once it scrolls away.">
          <Check size={56} trigger="inView" interval={1200} aria-label="check" />
        </Station>
        <Station trigger="auto" body="Loops from the moment it mounts. Loaders ship with this.">
          <Loader size={56} aria-label="loader" />
        </Station>
        <Station trigger="manual" body="Waits for your code to call play(), start() or stop() on its ref.">
          <ManualDemo />
        </Station>
      </ul>
    </section>
  )
}
