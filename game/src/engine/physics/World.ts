import type { NonZero, OnlyPositive } from 'types/arithmetics'
import type { Body, EdgeShape, Fixture, World as BoxWorld } from 'love.physics'
import type { Tuple } from 'types/arraylike'
import type { Vector2 } from 'types/Vector'
import events from '../events'

export namespace World {
  export interface Wall {
    body: Body
    shape: EdgeShape
    fixture: Fixture
  }

  export type Bounds = Tuple<4, Readonly<Wall>>

  export interface Scale<X extends number = number, Y extends number = number> {
    x?: NonZero<X>
    y?: NonZero<Y>
  }

  export type Origin = Partial<Vector2.Base>

  export interface Options<
    Width extends number = number,
    Height extends number = number,
  > {
    width: OnlyPositive<Width>
    height: OnlyPositive<Height>
    world?: BoxWorld
    origin?: Origin
    renderBox?: boolean
  }

  export interface Mouse extends Vector2.Base {
    inBounds: boolean
  }
}

const createWalls = (
  world: BoxWorld,
  width: number,
  height: number
): World.Bounds => {
  let body, shape, fixture
  const walls: World.Wall[] = []

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

  return walls as World.Bounds
}

export class World<
  Width extends number = number,
  Height extends number = number,
> {
  public readonly width: number
  public readonly height: number
  public readonly origin: Vector2.Base

  public readonly box: BoxWorld
  public readonly walls: World.Bounds

  public readonly mouse: World.Mouse

  /**
   * Debug stuff
   */
  // TODO: Remove this eventually
  public renderBox: boolean

  constructor({
    width,
    height,
    renderBox = false,
    origin,
    world,
  }: World.Options<Width, Height>) {
    this.width = width
    this.height = height
    this.origin = (origin ?? {}) as Vector2.Base
    this.origin.x = (this.origin as Partial<Vector2.Base>).x ?? 0
    this.origin.y = (this.origin as Partial<Vector2.Base>).y ?? 0
    this.renderBox = renderBox

    this.box =
      world ?? love.physics.newWorld(this.origin.x, this.origin.y, true)
    this.box.translateOrigin(this.origin.x, this.origin.y)
    this.walls = createWalls(this.box, width, height)

    const [x, y] = love.mouse.getPosition()
    this.mouse = {} as World.Mouse
    this.updateMouse(x, y)
  }

  private ev = events.batchAdd({
    update: dt => {
      this.box.update(dt)
    },
    draw: () => {
      if (this.renderBox)
        for (const wall of this.walls)
          love.graphics.line(
            ...wall.body.getWorldPoints(...wall.shape.getPoints())
          )
      const [x, y] = love.mouse.getPosition()
      love.graphics.print(
        inspect({
          relative: this.mouse,
          absolute: { x, y },
          origin: this.origin,
        })
      )
    },
    mousemoved: (x, y) => {
      this.updateMouse(x, y)
    },
  })

  private updateMouse(x: number, y: number) {
    ;[x, y] = this.toWorld(x, y)
    this.mouse.x = x
    this.mouse.y = y
    this.mouse.inBounds =
      x >= 0 && x <= this.width && y >= 0 && y <= this.height
  }

  pan(x?: number, y?: number) {
    x = x ?? 0
    y = y ?? 0
    this.box.translateOrigin(-x, -y)
    this.origin.x += x
    this.origin.y += y
  }

  contains(x: number, y: number) {
    return (
      x >= this.origin.x
      && x <= this.origin.x + this.width
      && y >= this.origin.y
      && y <= this.origin.y + this.height
    )
  }

  toWorld(x: number, y: number): LuaMultiReturn<[x: number, y: number]> {
    return $multi(x - this.origin.x, y - this.origin.y)
  }

  toScreen(x: number, y: number): LuaMultiReturn<[x: number, y: number]> {
    return $multi(x + this.origin.x, y + this.origin.y)
  }
}
