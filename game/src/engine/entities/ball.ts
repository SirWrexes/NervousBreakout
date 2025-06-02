import events from 'engine/events'
import type { World } from 'engine/physics/World'
import type { Body, CircleShape, Fixture } from 'love.physics'
import { Vector2 } from 'types/Vector'
import type { Paddle } from './Paddle'
import type { EmptyObject, Tagged } from 'type-fest'

export namespace Ball {
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

  public readonly radius: number
  public readonly speed: number

  private velocity = new Vector2()
  private _thrown = false

  private paddle: Paddle

  private world: World
  private body: Body
  private shape: CircleShape
  private fixture: Fixture

  get thrown() {
    return this._thrown
  }

  constructor({
    world,
    paddle,
    radius = 5,
    origin,
    speed = 200,
  }: Ball.Options) {
    origin = origin ?? ({} as Vector2.Base)
    origin.x = origin.x ?? 0
    origin.y = origin.y ?? 0

    this.radius = radius
    this.speed = speed
    this.paddle = paddle

    this.world = world
    this.body = love.physics.newBody(world.box, origin.x, origin.y, 'dynamic')
    this.shape = love.physics.newCircleShape(radius)
    this.fixture = love.physics.newFixture(this.body, this.shape)

    this.body.setActive(false)
    const initialRemovers = events.batchAdd({
      update: () => {
        this.body.setPosition(
          paddle.centre.x,
          paddle.centre.y - this.radius * 2
        )
      },
      mousereleased: (_x, _y, button) => {
        if (button !== 1 || !world.mouse.inBounds) return

        const [x, y] = this.body.getWorldCenter()
        const angle = math.atan2(world.mouse.y - y, world.mouse.x - x)
        const [cos, sin] = math.cossin(angle)
        this.velocity.set(cos, sin).normalise().scale(speed)
        this.body.setLinearVelocity(this.velocity.x, this.velocity.y)
        this.body.setActive(true)
        this.fixture.setRestitution(1)

        for (const rm of initialRemovers) rm()
      },
    })
  }

  private ev = events.batchAdd({
    draw: () => {
      const [x, y] = this.body.getWorldCenter()
      love.graphics.circle('line', x, y, this.radius)
    },
  })
}
