import type { RequiredDeep, SimplifyDeep } from 'type-fest'
import type { NonZero, OnlyPositive } from 'types/arithmetics'
import type { Vector2 } from 'classes/Vector'
import type { Nullable } from 'types/util'
import type { NoopLike } from 'types/functionlike'
import type { Drawable, Renderable } from './types/graphics'
import type { Destroyable } from './types/destroyable'
import type { Body, EdgeShape, Fixture, World } from 'love.physics'
import type { Physic } from './types/physics'
import type { Tuple } from 'types/arraylike'
import events from './events'

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
    world?: World
    scale?: View.Scale<ScaleX, ScaleY>
    origin?: View.Origin
    renderBox?: boolean
  }

  export interface Wall {
    body: Body
    shape: EdgeShape
    fixture: Fixture
  }

  export interface Physics {
    world: World
    walls: Tuple<4, Wall>
  }

  export interface State
    extends SimplifyDeep<RequiredDeep<Omit<Options, 'world'>>> {
    /** Prefer using setScale for making sure you don't set it to something wrong */
    scale: Vector2.Base
    physics: View.Physics
  }
}

const createWalls = (
  world: World,
  width: number,
  height: number
): View.Physics['walls'] => {
  let body, shape, fixture
  const walls: Physic[] = []

  // TOP
  body = love.physics.newBody(world, 0, 0)
  shape = love.physics.newEdgeShape(0, 0, width, 0)
  fixture = love.physics.newFixture(body, shape)
  walls[0] = {
    body,
    shape,
    fixture,
  }

  // RIGHT
  body = love.physics.newBody(world, width, 0)
  shape = love.physics.newEdgeShape(0, 0, 0, height)
  fixture = love.physics.newFixture(body, shape)
  walls[1] = {
    body,
    shape,
    fixture,
  }

  // BOTTOM
  body = love.physics.newBody(world, 0, height)
  shape = love.physics.newEdgeShape(0, 0, width, 0)
  fixture = love.physics.newFixture(body, shape)
  walls[2] = {
    body,
    shape,
    fixture,
  }

  // LEFT
  body = love.physics.newBody(world, 0, 0)
  shape = love.physics.newEdgeShape(0, 0, 0, height)
  fixture = love.physics.newFixture(body, shape)
  walls[3] = {
    body,
    shape,
    fixture,
  }

  return walls as View.Physics['walls']
}

export interface View extends Renderable, Drawable, Destroyable {
  state: View.State
  physics: View.Physics

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

  toAbsoluteCoords: <
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
>({
  width,
  height,
  renderBox = false,
  world = love.physics.newWorld(0, 0, true),
  ...options
}: View.Options<Width, Height, ScaleX, ScaleY>): Readonly<View> => {
  const scale = initScale(options.scale)
  const origin = initOrigin(options.origin)
  const canvas = love.graphics.newCanvas(width, height)

  print(inspect(origin))
  world.translateOrigin(origin.x, origin.y)

  const state: View.State = {
    physics: {
      world,
      walls: createWalls(world, width, height),
    },
    width,
    height,
    origin,
    scale,
    renderBox,
  }

  const view = { state } as View

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
      y -= origin.y
    }

    return $multi(x, y, xib, yib)
  }

  // @ts-expect-error TypeScript being weird about that number | undefined juggling
  view.toAbsoluteCoords = (x, y) => {
    let xib, yib

    if (x) {
      // @ts-expect-error TypeScript being weird
      x += origin.x
      xib = x >= origin.x && x <= origin.x + width
    }
    if (y) {
      // @ts-expect-error TypeScript being weird
      y += origin.y
      yib = y >= origin.y && y <= origin.y + height
    }

    return $multi(x, y, xib, yib)
  }

  view.pan = offset => {
    world.translateOrigin(-offset.x, -offset.y)
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
      let x1: number, y1: number, x2: number, y2: number
      for (const wall of state.physics.walls) {
        ;[x1, y1, x2, y2] = wall.shape.getPoints()
        ;[x1, y1, x2, y2] = wall.body.getWorldPoints(x1, y1, x2, y2)
        love.graphics.line(x1, y1, x2, y2)
      }
      love.graphics.push()
      love.graphics.translate(origin.x, origin.y)
      love.graphics.pop()
    }
  }

  events.addHandler('update', dt => {
    world.update(dt)
  })

  return view
}
