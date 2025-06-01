import type { Rectangle } from 'types/shapes'
import { Vector2 } from 'types/Vector'
import events from 'engine/events'
import type { Body, Fixture, PolygonShape } from 'love.physics'
import type { World } from 'engine/physics/World'

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
}

export class Paddle {
  public readonly width: number
  public readonly height: number
  public readonly centre: Vector2
  public readonly speed: number

  public frozen: boolean = false

  private world: World
  private body: Body
  private shape: PolygonShape
  private fixture: Fixture

  constructor({
    world,
    width = 120,
    height = 10,
    speed = 300,
    origin,
  }: Paddle.Options) {
    origin = origin ?? {}
    origin.x = origin.x ?? world.width / 2 - width / 2
    origin.y = origin.y ?? world.height - height * 3

    this.width = width
    this.height = height
    this.speed = speed

    this.world = world
    this.body = love.physics.newBody(
      world.box,
      width / 2,
      height / 2,
      'dynamic'
    )
    this.shape = love.physics.newRectangleShape(
      origin.x,
      origin.y,
      width,
      height
    )
    this.fixture = love.physics.newFixture(this.body, this.shape)

    this.centre = new Vector2(...this.getWorldCentre())
    this.body.setLinearDamping(2)
  }

  readonly getPoints = () => this.shape.getPoints()
  readonly getWorldPoints = () => this.body.getWorldPoints(...this.getPoints())
  readonly getWorldCentre = () => this.body.getWorldCenter()

  private ev = events.batchAdd({
    draw: () => {
      love.graphics.polygon(
        'fill',
        ...this.body.getWorldPoints(...this.shape.getPoints())
      )
    },
    keypressed: key => {
      if (key === 'space') this.frozen = true
    },
    keyreleased: key => {
      if (key === 'space') this.frozen = false
    },
    update: [
      () => {
        this.centre.set(...this.getWorldCentre())
      },
      () => {
        if (!this.world.mouse.inBounds || this.frozen) return

        const angle = this.centre.angle(this.world.mouse.x, this.world.mouse.y)
        const cos = math.cos(angle)
        this.body.setLinearVelocity(
          math.clamp(this.speed * cos, -this.speed, this.speed),
          0
        )
        this.body.setAngularVelocity(0)
      },
    ],
  })
}
