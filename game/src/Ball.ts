import { Entities, Game, Mouse, Window } from 'context'
import type { Shape } from 'types/Shapes'
import { Rectangle, Circle } from 'types/Shapes'

const RADIUS = 5
const SPEED = 200

export class Ball extends Circle {
  private out = false
  private angle = 0
  private speed = SPEED
  private thrown = false
  private velocity = new Vector2(SPEED)

  private collisionTargets: Shape[] = []

  private next = new Vector2()
  private nearest = new Vector2()

  constructor() {
    super(RADIUS, Entities.paddle.centre.clone())
    this.origin.y -= Entities.paddle.height / 2 + this.radius
  }

  private getCollisionData(rect: Rectangle) {
    this.nearest
      .copy(this.next)
      .max(rect.origin.x + rect.width, rect.origin.y + rect.height)
      .min(rect.origin.x, rect.origin.y)

    const ray = this.nearest.clone().subtract(this.next)
    let overlap = this.radius - ray.magnitude

    if (overlap === -Infinity) overlap = 0
    if (ray.x === Infinity || ray.y === Infinity) Game.pause = true

    return $multi(ray.normalise(), overlap)
  }

  private updateThrown(dt: number) {
    const [cos, sin] = math.cossin(this.angle)
    this.next.x = this.origin.x + this.velocity.x * cos * dt
    this.next.y = this.origin.y + this.velocity.y * sin * dt

    if (this.next.y + this.radius >= Window.height) {
      this.out = true
      return
    }

    const targets: Rectangle[] = [
      new Rectangle(
        Window.width,
        Window.height,
        new Vector2(0, -Window.height)
      ),
      new Rectangle(Window.width, Window.height, new Vector2(-Window.width, 0)),
      new Rectangle(Window.width, Window.height, new Vector2(Window.width, 0)),
      // @ts-expect-error aaaaaaaaaaaaaaaaaaa
      bfr,
      Entities.paddle,
    ]
    for (const target of targets) {
      const [normal, overlap] = this.getCollisionData(target)
      if (overlap === 0) break
      this.velocity.transform((x, y) => {
        if (normal.x !== 0) x *= -1
        if (normal.y !== 0) y *= -1
        return $multi(x, y)
      })
      this.next.subtract(normal.scale(overlap))
    }

    this.origin.copy(this.next)
  }

  private updateStandby() {
    love.graphics.print('bah oui connard')
    // TODO: onPaddleMove
    this.origin.set(
      Entities.paddle.centre.x,
      Entities.paddle.centre.y - this.diameter
    )
    // TODO: onMouseMove
    this.angle = this.centre.angle(Mouse.position)
  }

  update(dt: number) {
    if (this.out) {
      if (!Mouse.is('RELEASED', 1)) return
      this.thrown = false
      this.out = false
      this.velocity.set(this.speed)
    }
    if (!this.thrown && Mouse.is('RELEASED', 1)) this.thrown = true
    if (this.thrown) this.updateThrown(dt)
    else this.updateStandby()
  }

  draw() {
    love.graphics.circle('line', this.origin.x, this.origin.y, this.radius)
  }
}
