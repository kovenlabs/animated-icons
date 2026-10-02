import { createPlayer } from "../src/lib/player"

function deferredRun() {
  const calls: Array<() => void> = []
  const run = vi.fn((_cycle: { restart: boolean }) => new Promise<void>((resolve) => calls.push(resolve)))
  const finish = async () => {
    calls.shift()?.()
    await vi.advanceTimersByTimeAsync(0)
  }
  return { run, finish }
}

const setup = (interval = 0, enabled = true) => {
  const { run, finish } = deferredRun()
  const interrupt = vi.fn()
  const player = createPlayer({ run, interrupt, interval: () => interval, enabled: () => enabled })
  return { run, finish, interrupt, player }
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe("createPlayer", () => {
  it("restarts a running cycle on play(): interrupts it and runs again from the current pose", async () => {
    const { run, interrupt, player, finish } = setup()

    const first = player.play()
    expect(run).toHaveBeenLastCalledWith({ restart: false })
    player.play()
    expect(interrupt).toHaveBeenCalledTimes(1)
    expect(run).toHaveBeenCalledTimes(2)
    expect(run).toHaveBeenLastCalledWith({ restart: true })

    // the interrupted cycle settles even though its animations never resolve
    await expect(first).resolves.toBeUndefined()
    await finish()
  })

  it("never hangs on a cycle whose animations were stopped (cancel, then play again)", async () => {
    const run = vi.fn(() => new Promise<void>(() => {})) // motion's stopped animations never resolve
    const interrupt = vi.fn()
    const player = createPlayer({ run, interrupt, interval: () => 0, enabled: () => true })

    const hung = player.play()
    player.cancel()
    await expect(hung).resolves.toBeUndefined()
    expect(interrupt).toHaveBeenCalledTimes(1)

    player.play()
    expect(run).toHaveBeenCalledTimes(2)
    expect(run).toHaveBeenLastCalledWith({ restart: false })
  })

  it("rests for `interval` between loop cycles", async () => {
    const { run, finish, player } = setup(1000)

    player.start()
    expect(run).toHaveBeenCalledTimes(1)
    await finish()

    await vi.advanceTimersByTimeAsync(999)
    expect(run).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(1)
    expect(run).toHaveBeenCalledTimes(2)
    player.stop()
  })

  it("lets a loop join a restarted cycle instead of restarting it again", async () => {
    const { run, finish, interrupt, player } = setup(1000)

    player.start() // cycle 1
    player.play() // hover mid-cycle: cycle 2 replaces it
    expect(interrupt).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(5000)
    expect(run).toHaveBeenCalledTimes(2) // the loop waits on cycle 2, no extra run

    await finish() // cycle 1's resolver (already abandoned)
    await finish() // cycle 2 ends
    await vi.advanceTimersByTimeAsync(1000)
    expect(run).toHaveBeenCalledTimes(3)
    expect(run).toHaveBeenLastCalledWith({ restart: false })
    expect(interrupt).toHaveBeenCalledTimes(1)
    player.stop()
  })

  it("stops gracefully: the running cycle finishes, no new one starts", async () => {
    const { run, finish, interrupt, player } = setup()

    player.start()
    player.stop()
    expect(player.looping).toBe(false)
    await finish()
    await vi.advanceTimersByTimeAsync(5000)
    expect(run).toHaveBeenCalledTimes(1)
    expect(interrupt).not.toHaveBeenCalled()
  })

  it("never runs two loops after a quick stop → start", async () => {
    const { run, finish, player } = setup(1000)

    player.start()
    player.stop()
    player.start()
    await finish()
    await vi.advanceTimersByTimeAsync(1000)
    expect(run).toHaveBeenCalledTimes(2)
    await finish()
    await vi.advanceTimersByTimeAsync(1000)
    expect(run).toHaveBeenCalledTimes(3)

    await finish()
    player.stop()
    await vi.advanceTimersByTimeAsync(5000)
    expect(run).toHaveBeenCalledTimes(3)
  })

  it("does nothing while disabled (reduced motion)", async () => {
    const { run, player } = setup(0, false)

    await player.play()
    player.start()
    await vi.advanceTimersByTimeAsync(1000)
    expect(run).not.toHaveBeenCalled()
    expect(player.looping).toBe(false)
  })

  it("keeps looping after a cycle throws", async () => {
    const run = vi.fn().mockRejectedValueOnce(new Error("boom")).mockResolvedValue(undefined)
    const player = createPlayer({ run, interrupt: vi.fn(), interval: () => 100, enabled: () => true })

    player.start()
    await vi.advanceTimersByTimeAsync(100)
    expect(run).toHaveBeenCalledTimes(2)
    player.stop()
  })
})
