import type { NonZero, OnlyPositive } from 'types/arithmetics'
import type { Body, EdgeShape, Fixture, World as BoxWorld } from 'love.physics'
import { Vector2 } from 'types/Vector'
import events from '../events'
import type { Transform } from 'love.math'
import { glsl } from 'extensions'
import type { ContactListener } from 'engine/types/ContactListener'
import type { Tuple } from 'types/arraylike'

declare global {
  interface DebugInfo {
    world?: Partial<World.Debug>
  }
}

export namespace World {
  export interface Debug {
    origin: Vector2.Base
    width: number
    height: number
  }

  export interface Wall {
    body: Body
    shape: EdgeShape
    fixture: Fixture
  }

  export interface Bounds {
    body: Body
    edges: Tuple<4, EdgeShape>
  }

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
  const body = love.physics.newBody(world, 0, 0)
  const edges: Tuple<4, EdgeShape> = [
    love.physics.newEdgeShape(0, 0, width, 0),
    love.physics.newEdgeShape(width, 0, width, height),
    love.physics.newEdgeShape(width, height, 0, height),
    love.physics.newEdgeShape(0, height, 0, 0),
  ]

  love.physics.newFixture(body, edges[0]).setUserData(world)
  love.physics.newFixture(body, edges[1]).setUserData(world)
  love.physics.newFixture(body, edges[2]).setUserData(world)
  love.physics.newFixture(body, edges[3]).setUserData(world)

  return {
    body,
    edges,
  }
}

export class World<
  Width extends number = number,
  Height extends number = number,
> {
  public readonly width: number
  public readonly height: number

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
    world,
  }: World.Options<Width, Height>) {
    this.width = width
    this.height = height
    this.renderBox = renderBox

    this.box = world ?? love.physics.newWorld(0, 0, true)
    this.transform = love.math.newTransform(0, 0)
    this.walls = createWalls(this.box, width, height)

    const [x, y] = love.mouse.getPosition()
    this.mouse = new Vector2() as World.Mouse
    this.mouse.crosshair = false
    this.updateMouse(x, y)

    events.batch({
      update: dt => {
        this.box.update(dt)
      },
      mousemoved: (x, y) => {
        this.updateMouse(x, y)
      },
      draw: [
        () => {
          if (!this.renderBox) return
          for (const edge of this.walls.edges)
            love.graphics.line(
              ...this.walls.body.getWorldPoints(...edge.getPoints())
            )
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
    })
  }

  /// XXX: Remove me when things work
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

  private updateMouse(x: number, y: number) {
    ;[x, y] = this.toLocal(x, y)
    this.mouse.x = x
    this.mouse.y = y
    this.mouse.inBounds =
      x >= 0 && x <= this.width && y >= 0 && y <= this.height
  }

  setContactListener(cl: ContactListener) {
    this.box.setCallbacks(
      cl.beginContact,
      cl.endContact,
      cl.preSolve,
      cl.postSolve
    )
  }

  pan(x?: number, y?: number) {
    x = x ?? 0
    y = y ?? 0
    this.box.translateOrigin(-x, -y)
    this.transform.translate(x, y)
  }

  toLocal(x: number, y: number): LuaMultiReturn<[x: number, y: number]> {
    return this.transform.inverseTransformPoint(x, y)
  }

  toScreen(x: number, y: number): LuaMultiReturn<[x: number, y: number]> {
    return this.transform.transformPoint(x, y)
  }
}
