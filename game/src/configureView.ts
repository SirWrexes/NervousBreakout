import type { RequiredDeep, SimplifyDeep } from 'type-fest'
import type { NonZero, OnlyPositive } from 'types/arithmetics'
import type { Vector2 } from 'classes/Vector'

interface ViewScale<X extends number, Y extends number> {
  x?: NonZero<X>
  y?: NonZero<Y>
}

type ViewOrigin = Partial<Vector2.Base>

interface ConfigureViewOptions<
  Width extends number = number,
  Height extends number = number,
  ScaleX extends number = number,
  ScaleY extends number = number,
> {
  width: OnlyPositive<Width>
  height: OnlyPositive<Height>
  scale?: ViewScale<ScaleX, ScaleY>
  origin?: ViewOrigin
  renderBox?: boolean
}

type ViewState = SimplifyDeep<Readonly<RequiredDeep<ConfigureViewOptions>>>

export interface View extends Disposable {
  state: ViewState
  setOrigin: (origin: ViewOrigin) => void
  setScale: <X extends number, Y extends number>(
    scale?: ViewScale<X, Y>
  ) => void
  setRenderBox: (box: true) => void

  pan: (offset: Vector2.Base) => void
  draw: (draw: () => void) => void
  render: () => void
}

const initScale = (scale: ConfigureViewOptions['scale']) => {
  scale = scale ?? {}
  scale.x = scale.x ?? 1
  scale.y = scale.y ?? 1
  return scale as Vector2.Base
}

const initOrigin = (origin: ConfigureViewOptions['origin']) => {
  origin = origin ?? {}
  origin.x = origin.x ?? 1
  origin.y = origin.y ?? 1
  return origin as Vector2.Base
}

export const configureView = <
  Width extends number,
  Height extends number,
  ScaleX extends number,
  ScaleY extends number,
>(
  options: ConfigureViewOptions<Width, Height, ScaleX, ScaleY>
): Readonly<View> => {
  let { renderBox: renderBox = false } = options
  const { width, height } = options
  const scale = initScale(options.scale)
  const origin = initOrigin(options.origin)
  const canvas = love.graphics.newCanvas(width, height)

  const state: ViewState = {
    renderBox: renderBox,
    width,
    height,
    origin,
    scale,
  }

  const box = [
    [0, 0, width, 0], // top left to top right
    [width, 0, width, height], // top right to bottom right
    [width, height, 0, height], // bottom right to bottom left
    [0, height, 0, 0], // bottom left to top left
  ].flat()

  const setOrigin = (newOrigin: ViewOrigin) => {
    origin.x = newOrigin.x ?? origin.x
    origin.y = newOrigin.y ?? origin.y
  }

  const setScale = <X extends number, Y extends number>(
    newScale?: ViewScale<X, Y>
  ) => {
    if (!newScale) {
      scale.x = 1
      scale.y = 1
      return
    }

    scale.x = newScale.x ?? scale.x
    scale.y = newScale.y ?? scale.y
  }

  const pan = (offset: Vector2.Base) => {
    origin.x += offset.x
    origin.y += offset.y
  }

  const setRenderBox = (v: boolean) => {
    renderBox = v
  }

  const draw = (draw: () => void) => {
    love.graphics.setCanvas(canvas)
    draw()
    love.graphics.setCanvas()
  }

  const render = () => {
    if (renderBox) {
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

  const removeHandlers = () => {
    print('boule')
  }

  return {
    draw,
    state,
    render,
    setRenderBox,
    setScale,
    setOrigin,
    pan,

    [Symbol.dispose]: removeHandlers,
  }
}
