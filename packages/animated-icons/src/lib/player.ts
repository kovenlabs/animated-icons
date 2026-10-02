export interface Cycle {
  /** True when this cycle replaced one still in flight: animate from the current pose, not from rest. */
  restart: boolean
}

export interface PlayerOptions {
  /** One animation cycle. */
  run: (cycle: Cycle) => unknown
  /** Stop the in-flight animations where they are. */
  interrupt: () => void
  /** Read lazily so a prop change applies from the next rest. */
  interval: () => number
  /** False under reduced motion: play and start become no-ops. */
  enabled: () => boolean
}

export interface Player {
  /** Play a cycle. If one is running it restarts from the current pose. */
  play: () => Promise<void>
  start: () => void
  /** Graceful: the running cycle finishes, no new one starts. */
  stop: () => void
  /** Hard stop for unmount: ends the loop and interrupts the running cycle. */
  cancel: () => void
  readonly looping: boolean
}

interface Running {
  promise: Promise<void>
  abort: () => void
}

/**
 * Framework-free playback loop: one cycle at a time, `interval` rest between cycles.
 *
 * A cycle never waits on its animations alone: motion leaves a stopped animation's promise
 * pending forever, so every cycle also races an abort signal and always settles.
 */
export function createPlayer({ run, interrupt, interval, enabled }: PlayerOptions): Player {
  let current: Running | null = null
  let looping = false
  let timer: ReturnType<typeof setTimeout> | undefined
  let wake: (() => void) | undefined

  const begin = (restart: boolean) => {
    let abort!: () => void
    const aborted = new Promise<void>((resolve) => (abort = resolve))
    const cycle: Running = { promise: Promise.resolve(), abort }
    cycle.promise = (async () => {
      try {
        await Promise.race([run({ restart }), aborted])
      } catch {
        // a failed cycle must not kill the loop
      } finally {
        if (current === cycle) current = null
      }
    })()
    current = cycle
    return cycle.promise
  }

  const halt = () => {
    if (!current) return
    interrupt()
    current.abort()
    current = null
  }

  const play = () => {
    if (!enabled()) return Promise.resolve()
    const restart = current !== null
    halt()
    return begin(restart)
  }

  /** The loop joins a cycle already in flight (say, from a hover) rather than restarting it. */
  const join = () => current?.promise ?? begin(false)

  const rest = (ms: number) =>
    new Promise<void>((resolve) => {
      wake = resolve
      timer = setTimeout(resolve, ms)
    })

  const loop = async () => {
    while (looping && enabled()) {
      await join()
      // a play() during that cycle replaced it: wait for the replacement too
      while (current) await current.promise
      if (!looping) break
      // always yield a macrotask, so even a synchronous variant cannot starve the page
      await rest(Math.max(0, interval()))
    }
    looping = false
  }

  const stop = () => {
    looping = false
    clearTimeout(timer)
    wake?.()
  }

  return {
    play,
    start() {
      if (looping || !enabled()) return
      looping = true
      void loop()
    },
    stop,
    cancel() {
      stop()
      halt()
    },
    get looping() {
      return looping
    },
  }
}
