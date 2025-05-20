import { Entities, InputState, Mouse, Window } from 'context'
import { Vector2 } from 'types/Vector'

export class Ball {
  position: Vector2
  edges = { l: 0, r: 0, u: 0, d: 0 }
  size = new Vector2(5)
  speed = 200
  thrown = false
  angle = 0
  active = true

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
    return $multi<[h: boolean, v: boolean]>(h, v)
  }

  updateThrown(dt: number) {
    let [cos, sin] = math.cossin(this.angle)
    const [h, v] = this.checkWindowCollision()

    this.position.transform((x, y) => {
      if (h) {
        x = math.clamp(x, 0, Window.size.x - this.radius)
        cos *= -1
      }
      if (v) {
        y = math.clamp(y, 0, Window.size.y - this.radius)
        sin *= -1
      }
      return $multi(x, y)
    })

    const x = this.position.x + cos * this.speed * dt
    const y = this.position.y + sin * this.speed * dt
    const angle = math.atan2(y - this.position.y, x - this.position.x)

    this.angle = angle
    this.position.x = x
    this.position.y = y
  }

  updateStandby() {
    const [x, y] = [Entities.paddle.centre.x, Entities.paddle.edges.u]
    this.position.set(x, y - this.diameter)
    this.angle = this.centre.angle(Mouse.position)
  }

  updateEdges() {
    this.edges.l = this.centre.x - this.radius
    this.edges.r = this.centre.x + this.radius
    this.edges.u = this.centre.y - this.radius
    this.edges.d = this.centre.y + this.radius
  }

  update(dt: number) {
    switch (true) {
      case !this.active:
        return
      case !this.thrown && Mouse.button(1) === InputState.RELEASED:
        this.thrown = true
      // fall through
      case this.thrown:
        this.updateThrown(dt)
        break
      default:
        this.updateStandby()
        break
    }
    this.updateEdges()
  }

  draw() {
    love.graphics.print('<Ball> ' + inspect(this), 150, 10)
    love.graphics.circle('line', this.position.x, this.position.y, this.size.x)
  }
}
