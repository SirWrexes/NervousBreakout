import { Entities } from 'context'
import type { Rectangle } from 'types/Shapes'
import { Circle } from 'types/Shapes'
import { update } from './callbacks/update'
import { Vector2 } from 'types/Vector'

const RADIUS = 5
const SPEED = 200

export class Ball extends Circle {
  protected angle = 0
  protected out = false
  protected thrown = false
  protected speed = SPEED
  protected velocity = new Vector2(SPEED)

  protected _update: ((this: this, dt: number) => void) | ((this: this) => void)
  get update() {
    return this._update
  }

  constructor() {
    super(RADIUS, Entities.paddle.centre.clone())
    this.origin.y -= Entities.paddle.height / 2 + this.radius
    this._update = update
  }

  protected getNextPosition(dt: number) {
    const [cos, sin] = math.cossin(this.angle)
    return this.origin.clone().transform((x, y) => {
      x += this.velocity.x * cos * dt
      y += this.velocity.y * sin * dt
      return $multi(x, y)
    })
  }

  protected getNearestPoint(from: Vector2, to: Rectangle) {
    return from
      .clone()
      .max(to.origin.x + to.width, to.origin.y + to.height)
      .min(to.origin.x, to.origin.y)
  }

  protected getCollisionData(
    at: Vector2,
    rect: Rectangle
  ): LuaMultiReturn<[ray: Vector2, overlap: number]> {
    const nearest = this.getNearestPoint(at, rect)
    const ray = nearest.clone().subtract(at)
    const overlap = math.max(0, this.radius - ray.magnitude)
    return $multi(ray, overlap)
  }

  protected resolveCollision(pos: Vector2, ray: Vector2, overlap: number) {
    const normal = ray.normalise()

    this.velocity.transform((x, y) => {
      if (normal.x !== 0) x *= -1
      if (normal.y !== 0) y *= -1
      return $multi(x, y)
    })

    return pos.subtract(normal.scale(overlap))
  }

  draw() {
    love.graphics.circle('line', this.origin.x, this.origin.y, this.radius)
  }
}
