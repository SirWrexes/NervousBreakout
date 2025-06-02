import type { NonZero, OnlyPositive } from 'types/arithmetics'
import type { Body, EdgeShape, Fixture, World as BoxWorld } from 'love.physics'
import type { Tuple } from 'types/arraylike'
import { Vector2 } from 'types/Vector'
import events from '../events'
import type { Transform } from 'love.math'
import { glsl } from 'extensions'

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

  export interface Mouse extends Vector2 {
    inBounds: boolean
    crosshair: boolean
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
  public readonly transform: Transform

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

    this.box = world ?? love.physics.newWorld(0, 0, true)
    this.transform = love.math.newTransform(origin?.x ?? 0, origin?.y ?? 0)
    this.box.translateOrigin(this.origin.x, this.origin.y)
    this.walls = createWalls(this.box, width, height)

    const [x, y] = love.mouse.getPosition()
    this.mouse = new Vector2() as World.Mouse
    this.mouse.crosshair = false
    this.updateMouse(x, y)
  }

  /// XXX: Remove me
  private shaders = {
    red: love.graphics.newShader(glsl`
      vec4 effect(vec4 color, Image tex, vec2 texture_coords, vec2 screen_coords) {
        return vec4(${'ff0000'.toRGB().join(',')});
      }
    `),
    green: love.graphics.newShader(glsl`
      vec4 effect(vec4 color, Image tex, vec2 texture_coords, vec2 screen_coords) {
        return vec4(${'00ff00'.toRGB().join(',')});
      }
    `),
  }

  private ev = events.batchAdd({
    update: dt => {
      this.box.update(dt)
    },
    draw: [
      () => {
        if (!this.renderBox) return

        // love.graphics.applyTransform(this.transform)
        let i = 0
        const lines: [number, number, number, number][] = []
        for (const wall of this.walls) {
          lines[i] = wall.body.getWorldPoints(
            ...wall.shape.getPoints()
          ) as never
          love.graphics.line(lines[i])
          i += 1
        }
      },
      () => {
        if (!this.mouse.crosshair) return
        const [mx, my] = this.toScreen(this.mouse.x, this.mouse.y)
        const [ox, oy] = this.toScreen(0, 0)
        const [width, height] = this.toScreen(this.width, this.height)

        const hx1 = math.clamp(mx - 5, ox, width)
        const hx2 = math.clamp(mx + 5, ox, width)
        const vy1 = math.clamp(my - 5, oy, height)
        const vy2 = math.clamp(my + 5, oy, height)
        const hy = math.clamp(my, oy, height)
        const vx = math.clamp(mx, ox, width)

        love.graphics.setShader(
          this.mouse.inBounds ? this.shaders.green : this.shaders.red
        )
        love.graphics.line(hx1, hy, hx2, hy)
        love.graphics.line(vx, vy1, vx, vy2)
        love.graphics.setShader()
      },
    ],
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
    this.transform.translate(x, y)
  }

  toWorld(x: number, y: number): LuaMultiReturn<[x: number, y: number]> {
    return this.transform.inverseTransformPoint(x, y)
  }

  toScreen(x: number, y: number): LuaMultiReturn<[x: number, y: number]> {
    return this.transform.transformPoint(x, y)
  }
}
