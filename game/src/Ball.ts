import { Entities, InputState, Mouse, Window } from 'context'
import { Vector2 } from 'types'

export class Ball {
  active = true
  angle = 0
  position: Vector2
  size = new Vector2(5)
  speed = 200
  thrown = false
  velocity = new Vector2()

  private next = new Vector2()

  get radius() {
    return this.size.x
  }

  get diameter() {
    return this.radius * 2
  }

  get centre() {
    return this.position
  }

  constructor() {
    const [x, y] = Entities.paddle.centre.unpack()
    this.position = new Vector2(x, y - this.radius)
  }

  checkWindowCollision() {
    const l = this.position.x - this.radius <= 0
    const r = this.position.x + this.radius >= Window.size.x
    const u = this.position.y - this.radius <= 0
    const d = this.position.y + this.radius >= Window.size.y
    const h = l || r
    const v = u || d
    return $multi<[h: boolean, v: boolean, u: boolean, d: boolean]>(h, v, u, d)
  }

  updateThrown(dt: number) {
    const [cos, sin] = math.cossin(this.angle)
    const [h, v, u, d] = this.checkWindowCollision()

    if (d) {
      this.active = false
      return
    }

    this.position.transform((x, y) => {
      if (h) x = math.clamp(x, 0, Window.size.x - this.radius)
      if (v) y = math.clamp(y, 0, Window.size.y - this.radius)
      return $multi(x, y)
    })

    this.next.x = this.position.x + (h ? -1 : 1) * cos * this.speed * dt
    this.next.y = this.position.y + (v ? -1 : 1) * sin * this.speed * dt
    this.angle = this.position.angle(this.next)
    this.position.copy(this.next).transform(math.round)
  }

  updateStandby() {
    const [x, y] = [Entities.paddle.centre.x, Entities.paddle.edges.u]
    this.position.set(x, y - this.diameter)
    this.angle = this.centre.angle(Mouse.position)
  }

  update(dt: number) {
    switch (true) {
      case !this.active:
        return
      case !this.thrown && Mouse.get(1) === InputState.RELEASED:
        this.thrown = true
      // fall through
      case this.thrown:
        this.updateThrown(dt)
        break
      default:
        this.updateStandby()
        break
    }
  }

  draw() {
    love.graphics.circle('line', this.position.x, this.position.y, this.size.x)
  }
}
