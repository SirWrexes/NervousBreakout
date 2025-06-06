import type { Rectangle } from 'types/shapes'
import type { Vector2 } from 'types/Vector'
import type { Body, Fixture, MouseJoint, PolygonShape } from 'love.physics'
import type { World } from 'engine/physics/World'
import { glsl } from 'extensions'
import type { EmptyObject, Tagged } from 'type-fest'
import events from 'engine/events'
import type { Tuple } from 'types/arraylike'

declare global {
  interface DebugInfo {
    paddle: any
  }
}

export namespace Paddle {
  export interface Options {
    world: World
    width?: number
    height?: number
    origin?: Partial<Vector2.Base>
    speed?: number
  }

  export interface State extends Rectangle {
    velocity: Vector2
    /** From center to mouse */
    angle: number
    /** From center to mouse */
    distance: number
    frozen: boolean
  }

  export type Tag = Tagged<EmptyObject, 'Paddle.tag'>
}

export class Paddle {
  public static readonly tag = {} as Paddle.Tag
  get tag() {
    return Paddle.tag
  }

  public static readonly isPaddle = (v: any): v is Paddle =>
    v && v.tag && v.tag === Paddle.tag

  public readonly width: number
  public readonly height: number
  public readonly speed: number
  public frozen: boolean = false

  private world: World
  private body: Body
  private shape: PolygonShape
  private fixture: Fixture
  private mouse?: MouseJoint

  constructor({
    world,
    width = 100,
    height = 20,
    speed = 300,
    origin,
  }: Paddle.Options) {
    origin = origin ?? {}
    origin.x = origin.x ?? world.width / 2 - width / 2
    origin.y = origin.y ?? world.height - 100

    this.width = width
    this.height = height
    this.speed = speed

    this.world = world
    this.body = love.physics.newBody(
      world.box,
      width / 2,
      height / 2,
      'kinematic'
    )
    this.shape = love.physics.newRectangleShape(
      origin.x,
      origin.y,
      width,
      height
    )
    this.fixture = love.physics.newFixture(this.body, this.shape)
    this.body.setLinearDamping(2)
    this.body.setFixedRotation(true)
    this.fixture.setUserData(this)

    events.on('draw', () => {
      love.graphics.polygon('fill', ...this.getWorldPoints())
      if (
        !this.fixture.testPoint(
          ...(love.mouse.getPosition() as Tuple<2, number>)
        )
      )
        return
      love.graphics.setShader(this.shaders.green)
      love.graphics.polygon('line', ...this.getWorldPoints())
      love.graphics.setShader()
    })

    events.on('mousepressed', (x, y, button) => {
      if (button !== 1 || !this.fixture.testPoint(x, y)) return
      this.mouse = love.physics.newMouseJoint(
        this.body,
        ...(this.getCentre() as Tuple<2, number>)
      )
    })

    events.on('mousereleased', (_x, _y, button) => {
      if (button !== 1 || !this.mouse) return
      this.mouse.destroy()
      delete this.mouse
    })

    events.on('mousemoved', x => {
      if (!this.mouse) return
      const [, y] = this.getCentre()
      this.mouse.setTarget(x, y)
    })

    events.on('update', () => {
      this.body.setLinearVelocity(this.body.getLinearVelocity()[0], 0)
    })
  }

  // XXX: Remove me when things work
  private shaders = {
    blue: love.graphics.newShader(glsl`
      vec4 effect(vec4 color, Image tex, vec2 texture_coords, vec2 screen_coords) {
        return vec4(${'0000ff'.toRGB().join(',')});
      }
    `),
    green: love.graphics.newShader(glsl`
      vec4 effect(vec4 color, Image tex, vec2 texture_coords, vec2 screen_coords) {
        return vec4(${'00ff00'.toRGB().join(',')});
      }
    `),
    elevation: love.graphics.newShader(glsl`
      vec4 effect(vec4 color, Image tex, vec2 texture_coords, vec2 screen_coords) {
        return vec4(${'cdcdcd50'.toRGB().join(',')});
      }
    `),
  }

  getPoints() {
    return this.shape.getPoints()
  }

  getWorldPoints() {
    return this.body.getWorldPoints(...this.getPoints())
  }

  getCentre() {
    return this.body.getWorldCenter()
  }
}
