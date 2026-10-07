"use client"

import { useAnimate, useInView, useReducedMotion } from "motion/react"
import { useEffect, useImperativeHandle, useRef, useState } from "react"

import { useIconConfig } from "./context"
import { slot } from "./motion"
import { createPlayer } from "./player"
import { ShapeProvider, shapeDrawing, type Shape } from "./shape"
import { colorVars, resolveIconOptions } from "./resolve"
import type { AnimatedIconComponent, AnimatedIconProps, Corners, IconDefinition, IconMeta } from "./types"

const STROKE: Record<Corners, { cap: "square" | "round"; join: "miter" | "bevel" | "round" }> = {
  sharp: { cap: "square", join: "miter" },
  bevel: { cap: "square", join: "bevel" },
  round: { cap: "round", join: "round" },
}

const toPascal = (name: string) => name.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase())

type Keyframes = Record<string, unknown>
type Stoppable = { stop: () => void }

/** On a restart, animate from wherever each part is (motion's `null` keyframe) instead of snapping back. */
export function fromCurrent(keyframes: Keyframes): Keyframes {
  return Object.fromEntries(
    Object.entries(keyframes).map(([key, value]) => [
      key,
      Array.isArray(value) && value.length > 1 ? [null, ...value.slice(1)] : value,
    ]),
  )
}

/**
 * One easing per keyframe segment. motion runs some values (opacity) on WAAPI and others (SVG transforms,
 * `pathLength`) on its frame loop. Given `times` and a single `ease`, WAAPI applies that ease to the whole
 * animation while the frame loop applies it to every segment, so two tracks keyed to the same `times`
 * drift apart: a line flashes back at full length before it redraws, an arrow is still visible as it
 * jumps across the frame. Expanding the ease to one per segment makes WAAPI ease each segment too, like
 * the frame loop and like `times` means. A missing ease becomes motion's keyframe default, `easeInOut`.
 */
export function perSegmentEase(keyframes: Keyframes, transition: unknown): unknown {
  const segments = Math.max(0, ...Object.values(keyframes).map((value) => (Array.isArray(value) ? value.length - 1 : 0)))
  if (segments < 2) return transition
  const options = (transition ?? {}) as Record<string, unknown>
  const { ease } = options
  // an array of easings is already per segment; a cubic-bezier (four numbers) is one easing
  if (Array.isArray(ease) && !ease.every((n) => typeof n === "number")) return transition
  return { ...options, ease: Array.from({ length: segments }, () => ease ?? "easeInOut") }
}

/** Where a finished cycle leaves each property: its last keyframe. */
export function restingPose(keyframes: Keyframes): Keyframes {
  return Object.fromEntries(
    Object.entries(keyframes).map(([key, value]) => [key, Array.isArray(value) ? value.at(-1) : value]),
  )
}

const copyKeyframes = (keyframes: Keyframes): Keyframes =>
  Object.fromEntries(Object.entries(keyframes).map(([key, value]) => [key, Array.isArray(value) ? [...value] : value]))

/**
 * motion draws `pathLength` as the dash pattern `pl (1 - pl)`: the next dash starts right at the path's
 * end, and its cap paints a stray dot there mid-draw. A spacing of 1 pushes that dash off the path.
 */
const withPathSpacing = (keyframes: Keyframes): Keyframes =>
  "pathLength" in keyframes && !("pathSpacing" in keyframes)
    ? {
        ...keyframes,
        pathSpacing: Array.isArray(keyframes.pathLength) ? keyframes.pathLength.map(() => 1) : 1,
      }
    : keyframes

/** motion's transform keys. On SVG, motion 13 routes a key to `transform` only if it's also a CSS property. */
const TRANSFORM_KEYS = new Set([
  "x", "y", "z", "translateX", "translateY", "translateZ",
  "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ",
  "skew", "skewX", "skewY", "transformPerspective",
])

/**
 * Works around motion 13 (latest as of writing): on SVG elements it decides between a CSS transform and an
 * attribute with `key in element.style`. `scale`, `rotate`, `x`, `y` pass, but `scaleX`, `scaleY` and `skewX`
 * aren't CSS properties, so they silently became attributes and never moved. A harmless expando on each
 * target's style object makes them route as transforms.
 */
export function routeTransforms(root: Element | null, target: unknown, keyframes: Keyframes) {
  if (!root || typeof target !== "string") return
  const keys = Object.keys(keyframes).filter((key) => TRANSFORM_KEYS.has(key))
  if (keys.length === 0) return
  for (const element of root.querySelectorAll(target)) {
    const style = (element as SVGElement).style
    for (const key of keys) {
      if (!(key in style)) Object.defineProperty(style, key, { value: "", writable: true, configurable: true })
    }
  }
}

const isKeyframes = (value: unknown): value is Keyframes =>
  typeof value === "object" && value !== null && !Array.isArray(value)

interface InFlight {
  variant: string
  controls: Stoppable[]
  /** Every part this cycle animated, with the pose it would have ended in. */
  touched: Array<[target: unknown, pose: Keyframes]>
}

export function createAnimatedIcon<const V extends string>(definition: IconDefinition<V>): AnimatedIconComponent<V> {
  // the drawing is static: shape it once per corner style and radius, not on every render
  const drawings = new Map<string, React.ReactNode>()
  const drawingFor = (shape: Shape) => {
    const key = `${shape.corners}:${shape.radius}`
    if (!drawings.has(key)) drawings.set(key, shapeDrawing(definition.render(), shape))
    return drawings.get(key)
  }

  function AnimatedIcon({
    variant,
    trigger,
    interval,
    speed,
    reducedMotion,
    corners,
    cornerRadius,
    duration,
    animate: controlled,
    colors,
    size,
    ref,
    style,
    onPointerEnter,
    onClick,
    ...svgProps
  }: AnimatedIconProps<V>) {
    const config = useIconConfig()
    const options = resolveIconOptions(definition, config, {
      variant,
      trigger,
      interval,
      speed,
      reducedMotion,
      corners,
      cornerRadius,
      size,
      duration,
    })

    const [scope, animate] = useAnimate<SVGSVGElement>()
    const inView = useInView(scope, { amount: 0.5 })
    const prefersReducedMotion = Boolean(useReducedMotion())
    // static by request (`none`) or by the user's reduced-motion setting: the player never runs
    const disabled = options.trigger === "none" || (options.reducedMotion === "respect" && prefersReducedMotion)

    // The player lives across renders; it reads the latest options through this ref.
    const latest = useRef({ options, disabled, animate, scope })
    useEffect(() => {
      latest.current = { options, disabled, animate, scope }
    })

    const inFlight = useRef<InFlight | null>(null)

    const [player] = useState(() =>
      createPlayer({
        run: ({ restart }) => {
          const { options, animate, scope } = latest.current
          const animateAny = animate as (...args: unknown[]) => Stoppable

          // Restarting into another variant: put the old variant's parts back at rest first.
          const previous = inFlight.current
          if (restart && previous && previous.variant !== options.variant) {
            for (const [target, pose] of previous.touched) {
              routeTransforms(scope.current, target, pose)
              animateAny(target, pose, { duration: 0 })
            }
          }

          const cycle: InFlight = { variant: options.variant, controls: [], touched: [] }
          inFlight.current = cycle

          // Track every animation so an interrupt can stop it, and start restarts from the current pose.
          const tracked = ((target: unknown, keyframes: unknown, transition?: unknown) => {
            if (isKeyframes(keyframes)) {
              cycle.touched.push([target, restingPose(keyframes)])
              routeTransforms(scope.current, target, keyframes)
            }
            // always hand motion fresh arrays: it resolves keyframes in place, and icons share some (`blink`)
            const next = isKeyframes(keyframes)
              ? restart
                ? fromCurrent(withPathSpacing(keyframes))
                : copyKeyframes(withPathSpacing(keyframes))
              : keyframes
            const controls = animateAny(target, next, isKeyframes(next) ? perSegmentEase(next, transition) : transition)
            cycle.controls.push(controls)
            return controls
          }) as typeof animate

          return definition.variants[options.variant as V].run({ animate: tracked, seconds: options.duration / 1000 })
        },
        // stop() commits each value where it is, so the restart picks up from there
        interrupt: () => inFlight.current?.controls.forEach((controls) => controls.stop()),
        interval: () => latest.current.options.interval,
        enabled: () => !latest.current.disabled,
      }),
    )

    useImperativeHandle(ref, () => ({ play: player.play, start: player.start, stop: player.stop }), [player])

    const isControlled = controlled !== undefined
    const shouldLoop = isControlled
      ? controlled
      : options.trigger === "auto" || (options.trigger === "inView" && inView)

    useEffect(() => {
      if (shouldLoop && !disabled) player.start()
      else player.stop()
    }, [shouldLoop, disabled, player])

    // Hard stop on unmount: the cycle in flight is interrupted, never left hanging.
    useEffect(() => () => player.cancel(), [player])

    const label = svgProps["aria-label"]
    const shape: Shape = { corners: options.corners, radius: options.cornerRadius }
    const clip = definition.variants[options.variant as V]?.clip

    return (
      <>
        <svg
          ref={scope}
          xmlns="http://www.w3.org/2000/svg"
          width={options.size}
          height={options.size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={slot.primary}
          strokeWidth={2}
          // drawings are sharp by design; `corners` softens them by changing how strokes end and meet
          strokeLinecap={STROKE[options.corners].cap}
          strokeLinejoin={STROKE[options.corners].join}
          // pops and swings may overshoot the 24px box; variants that slip out of the frame clip to it
          overflow={clip ? "hidden" : "visible"}
          data-clip={clip === undefined ? undefined : String(clip)}
          role={label ? "img" : undefined}
          aria-hidden={label ? undefined : true}
          data-icon={definition.name}
          data-variant={options.variant}
          data-trigger={options.trigger}
          data-corners={options.corners}
          {...svgProps}
          style={{ ...colorVars({ ...config.icons[definition.name]?.colors, ...colors }), ...style }}
          onPointerEnter={(event) => {
            onPointerEnter?.(event)
            if (!isControlled && options.trigger === "hover") void player.play()
          }}
          onClick={(event) => {
            onClick?.(event)
            if (!isControlled && options.trigger === "click") void player.play()
          }}
        >
          <ShapeProvider value={shape}>{drawingFor(shape)}</ShapeProvider>
        </svg>
      </>
    )
  }

  AnimatedIcon.displayName = toPascal(definition.name)

  const meta: IconMeta<V> = {
    name: definition.name,
    family: definition.family ?? definition.name,
    category: definition.category,
    keywords: definition.keywords ?? [],
    slots: definition.slots,
    colors: Object.keys(definition.slots).length,
    variants: Object.keys(definition.variants) as V[],
    defaultVariant: definition.defaultVariant,
    defaults: definition.defaults,
  }
  return Object.assign(AnimatedIcon, { meta })
}
