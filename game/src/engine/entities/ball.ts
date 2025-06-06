import events from 'engine/events'
import type { World } from 'engine/physics/World'
import type { Body, CircleShape, Fixture } from 'love.physics'
import { Vector2 } from 'types/Vector'
import type { Paddle } from './Paddle'
import type { EmptyObject, Tagged } from 'type-fest'
import { glsl } from 'extensions'

declare global {
  interface DebugInfo {
    ball: Ball.Debug
  }
}

export namespace Ball {
  export interface Debug {
    velocity: Vector2.Base
  }

  export interface Options {
    world: World
    paddle: Paddle
    radius?: number
    origin?: Partial<Vector2.Base>
    speed?: number
  }

  export type Tag = Tagged<EmptyObject, 'Ball.Tag'>
}

export class Ball {
  public static readonly tag = {} as Ball.Tag
  get tag() {
    return Ball.tag
  }

  public static readonly isBall = (v: any): v is Ball =>
    v && v.tag && v.tag === Ball.tag

  public readonly radius: number
  public readonly speed: number

  private velocity = new Vector2()
  private _thrown = false
  get thrown() {
    return this._thrown
  }

  private paddle: Paddle

  private world: World
  private body: Body
  private shape: CircleShape
  private fixture: Fixture

  constructor({ world, paddle, radius = 5, speed = 500 }: Ball.Options) {
    this.radius = radius
    this.speed = speed
    this.paddle = paddle

    this.world = world
    {
      const [x, y] = paddle.getCentre()
      this.body = love.physics.newBody(world.box, x, y - this.radius, 'dynamic')
      print(x, y)
    }
    this.shape = love.physics.newCircleShape(radius)
    this.fixture = love.physics.newFixture(this.body, this.shape)
    this.fixture.setUserData(this)

    this.body.setActive(false)
    const initEvents = events.batch({
      mousereleased: (_x, _y, button) => {
        if (button !== 1 || !world.mouse.inBounds) return

        const [x, y] = this.body.getWorldCenter()
        const angle = math.atan2(world.mouse.y - y, world.mouse.x - x)
        const [cos, sin] = math.cossin(angle)
        this.velocity.set(cos, sin).normalise().scale(speed)
        this.body.setLinearVelocity(this.velocity.x, this.velocity.y)
        this.body.setActive(true)
        this.fixture.setRestitution(1)

        for (const rm of initEvents) rm()
      },
    })

    events.on('draw', () => {
      const [x, y] = this.body.getWorldCenter()
      love.graphics.setShader(this.shaders.orange)
      love.graphics.circle('line', x, y, this.radius)
      love.graphics.setShader()
    })
  }

  // XXX: Remove me when things work
  private readonly shaders = {
    orange: love.graphics.newShader(glsl`
      vec4 effect(vec4 color, Image tex, vec2 texture_coords, vec2 screen_coords) {
        return vec4(${'f08000'.toRGB().join(',')});
      }
    `),
  }
}
