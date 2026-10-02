"use client"

import { Children, cloneElement, createContext, createElement, isValidElement, useContext, type ReactNode } from "react"

import { rectPath, roundPath } from "./round"
import type { Corners } from "./types"

export interface Shape {
  corners: Corners
  radius: number
}

const ShapeContext = createContext<Shape>({ corners: "sharp", radius: 0 })

export const ShapeProvider = ShapeContext.Provider

type Props = Record<string, unknown> & { children?: ReactNode }

/**
 * Rewrites a drawing's geometry for the corner style: every `path` gets its corners rounded or
 * beveled, every `rect` becomes a path so its corners follow too. Everything else (circles, data
 * attributes, styles, keys) passes through, so animations still find their parts.
 */
export function shapeDrawing(node: ReactNode, { corners, radius }: Shape): ReactNode {
  if (corners === "sharp" || radius <= 0) return node
  return Children.map(node, (child) => {
    if (!isValidElement<Props>(child)) return child
    const { props } = child

    if (child.type === "path" && typeof props.d === "string") {
      return cloneElement(child, { d: roundPath(props.d, radius, corners) })
    }
    if (child.type === "rect" && !props.rx && !props.ry) {
      const { x = 0, y = 0, width = 0, height = 0, ...rest } = props
      const d = rectPath(Number(x), Number(y), Number(width), Number(height))
      return createElement("path", { ...rest, key: child.key, d: roundPath(d, radius, corners) })
    }
    if (props.children !== undefined) {
      return cloneElement(child, undefined, shapeDrawing(props.children, { corners, radius }))
    }
    return child
  })
}

/** For icons that draw inside their own component (e.g. to use a mask id): shape it from context. */
export function useShapedDrawing(node: ReactNode) {
  return shapeDrawing(node, useContext(ShapeContext))
}
