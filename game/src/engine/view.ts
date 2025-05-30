import type { RequiredDeep, SimplifyDeep } from 'type-fest'
import type { NonZero, OnlyPositive } from 'types/arithmetics'
import type { Vector2 } from 'classes/Vector'
import type { Nullable } from 'types/util'
import type { NoopLike } from 'types/functionlike'
import type { Drawable, Renderable } from './types/graphics'

namespace View {
  export interface Scale<X extends number = number, Y extends number = number> {
    x?: NonZero<X>
    y?: NonZero<Y>
  }

  export type Origin = Partial<Vector2.Base>

  export interface Options<
    Width extends number = number,
    Height extends number = number,
    ScaleX extends number = number,
    ScaleY extends number = number,
  > {
    width: OnlyPositive<Width>
    height: OnlyPositive<Height>
    scale?: View.Scale<ScaleX, ScaleY>
    origin?: View.Origin
    renderBox?: boolean
  }

  export interface State extends SimplifyDeep<RequiredDeep<Options>> {
    /** Prefer using setScale for making sure you don't set it to something wrong */
    scale: Vector2.Base
  }
}

export interface View extends Renderable, Drawable {
  state: View.State
  setOrigin: (origin: View.Origin) => void
  setScale: <X extends number, Y extends number>(
    scale?: View.Scale<X, Y>
  ) => void

  toRelativeCoords: <
    X extends number | undefined = undefined,
    Y extends number | undefined = undefined,
  >(
    x?: X,
    y?: Y
  ) => LuaMultiReturn<
    [
      x: X extends number ? number : undefined,
      y: Y extends number ? number : undefined,
      xInBounds: X extends number ? boolean : undefined,
      yInBounds: Y extends number ? boolean : undefined,
    ]
  >

  pan: (offset: Vector2.Base) => void
  startDrawing: NoopLike
  stopDrawing: NoopLike
}

const initScale = (scale: Nullable<View.Scale>) => {
  scale = scale ?? {}
  scale.x = scale.x ?? 1
  scale.y = scale.y ?? 1
  return scale as Vector2.Base
}

const initOrigin = (origin: Nullable<View.Origin>) => {
  origin = origin ?? {}
  origin.x = origin.x ?? 1
  origin.y = origin.y ?? 1
  return origin as Vector2.Base
}

export const createView = <
  Width extends number,
  Height extends number,
  ScaleX extends number,
  ScaleY extends number,
>(
  options: View.Options<Width, Height, ScaleX, ScaleY>
): Readonly<View> => {
  let { renderBox: renderBox = false } = options
  const { width, height } = options
  const scale = initScale(options.scale)
  const origin = initOrigin(options.origin)
  const canvas = love.graphics.newCanvas(width, height)

  const state: View.State = {
    renderBox,
    width,
    height,
    origin,
    scale,
  }

  const view = { state } as View

  const box = [
    [0, 0, width, 0], // top left to top right
    [width, 0, width, height], // top right to bottom right
    [width, height, 0, height], // bottom right to bottom left
    [0, height, 0, 0], // bottom left to top left
  ].flat()

  view.setOrigin = newOrigin => {
    origin.x = newOrigin.x ?? origin.x
    origin.y = newOrigin.y ?? origin.y
  }

  view.setScale = newScale => {
    if (!newScale) {
      scale.x = 1
      scale.y = 1
      return
    }

    scale.x = newScale.x ?? scale.x
    scale.y = newScale.y ?? scale.y
  }

  // @ts-expect-error TypeScript being weird about that number | undefined juggling
  view.toRelativeCoords = (x, y) => {
    let xib, yib
    if (x) {
      xib = x >= origin.x && x <= origin.x + width
      // @ts-expect-error TypeScript being weird
      x -= origin.x
    }

    if (y) {
      yib = y >= origin.y && y <= origin.y + height
      // @ts-expect-error TypeScript being weird
      y = y - origin.y
    }

    return $multi(x, y, xib, yib)
  }

  view.pan = offset => {
    origin.x += offset.x
    origin.y += offset.y
  }

  view.startDrawing = () => {
    love.graphics.setCanvas(canvas)
    love.graphics.clear()
  }

  view.stopDrawing = () => {
    love.graphics.setCanvas()
  }

  view.draw = draw => {
    love.graphics.setCanvas(canvas)
    draw()
    love.graphics.setCanvas()
  }

  view.render = () => {
    if (state.renderBox) {
      love.graphics.setCanvas(canvas)
      love.graphics.line(box)
      love.graphics.setCanvas()
    }

    love.graphics.push()
    love.graphics.translate(origin.x, origin.y)
    love.graphics.scale(scale.x, scale.y)
    love.graphics.draw(canvas)
    love.graphics.pop()
  }

  return view
}
