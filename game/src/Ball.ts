import { Entities, Mouse, Window } from 'context'
import { Vector2 } from 'types'
import { Circle } from 'types/Shapes'

const RADIUS = 5
const SPEED = 200

export class Ball extends Circle {
  private active = true
  private angle = 0
  private speed = 200
  private thrown = false
  private velocity = new Vector2(SPEED)

  private next = new Vector2()

  constructor() {
    super(RADIUS, Entities.paddle.centre.clone())
    this.origin.y -= Entities.paddle.height / 2 + this.radius
  }

  updateThrown(dt: number) {
    const [cos, sin] = math.cossin(this.angle)
    const l = this.origin.x <= 0
    const r = this.origin.x + this.radius >= Window.width
    const u = this.origin.y <= 0
    const d = this.origin.y + this.radius >= Window.height
    const h = l || r

    if (d) {
      this.active = false
      return
    }
    this.origin.x = math.clamp(this.origin.x, 0, Window.width - this.radius)
    this.origin.y = math.clamp(this.origin.y, 0, Window.height - this.radius)
    this.velocity.transform((x, y) => {
      if (h) x *= -1
      if (u) y *= -1
      return $multi(x, y)
    })
    const x = this.origin.x + this.velocity.x * cos * dt
    const y = this.origin.y + this.velocity.y * sin * dt
    this.origin.x = math.clamp(x, 0, Window.width - this.radius)
    this.origin.y = math.clamp(y, 0, Window.height - this.radius)
  }

  updateStandby() {
    this.origin.set(
      Entities.paddle.centre.x,
      Entities.paddle.centre.y - this.diameter
    )
    this.angle = this.centre.angle(Mouse.position)
  }

  update(dt: number) {
    if (!this.active) {
      if (!Mouse.is('RELEASED', 1)) return
      this.thrown = false
      this.active = true
      this.velocity.set(SPEED)
    }
    if (!this.thrown && Mouse.is('RELEASED', 1)) this.thrown = true
    if (this.thrown) this.updateThrown(dt)
    else this.updateStandby()
  }

  draw() {
    love.graphics.circle('line', this.origin.x, this.origin.y, this.radius)
  }
}
