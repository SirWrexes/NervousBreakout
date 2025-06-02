import type { Rectangle } from 'types/shapes'
import { Vector2 } from 'types/Vector'
import events from 'engine/events'
import type { Body, Fixture, PolygonShape } from 'love.physics'
import type { World } from 'engine/physics/World'
import { glsl } from 'extensions'

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
    this.body.setFixedRotation(true)
    this.body.setMass(Infinity)

    this.fixture.setUserData(this)
  }

  readonly getPoints = () => this.shape.getPoints()
  readonly getWorldPoints = () => this.body.getWorldPoints(...this.getPoints())
  readonly getWorldCentre = () => this.body.getWorldCenter()

  /// XXX: Remove me
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
  }

  private ev = events.batchAdd({
    draw: () => {
      love.graphics.setShader(this.shaders.green)
      love.graphics.line(
        this.centre.x,
        this.centre.y - 30,
        this.centre.x,
        this.centre.y + 30
      )
      love.graphics.setShader()
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

        const [mx, my] = this.world.toScreen(
          this.world.mouse.x,
          this.world.mouse.y
        )
        const angle = this.centre.angle(mx, my)
        const cos = math.cos(angle)
        this.body.setLinearVelocity(
          math.clamp(this.speed * cos, -this.speed, this.speed),
          0
        )
      },
    ],
  })
}
