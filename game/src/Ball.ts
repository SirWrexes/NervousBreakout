import { Entities, InputState, Mouse } from 'context'
import { Vector2 } from 'types/Vector'

export class Ball {
  position: Vector2
  edges = { l: 0, r: 0, u: 0, d: 0 }
  size: Vector2 = new Vector2(5)
  speed: number = 500
  thrown: boolean = false
  angle: number = 0

  get radius() {
    return this.size.x
  }

  get diameter() {
    return this.radius * 2
  }

  get centre() {
    return this.position
  }

  /**
   *
   */
  constructor() {
    const [x, y] = Entities.paddle.centre.unpack()
    this.position = new Vector2(x, y - this.radius)
  }

  updateThrown(dt: number) {}

  updateStandby() {
    const [x, y] = [Entities.paddle.centre.x, Entities.paddle.edges.u]
    this.position.set(x, y - this.diameter)
  }

  updateEdges() {
    this.edges.l = this.centre.x - this.radius
    this.edges.r = this.centre.x + this.radius
    this.edges.u = this.centre.y - this.radius
    this.edges.d = this.centre.y + this.radius
  }

  update(dt: number) {
    if (!this.thrown && Mouse.button(1) === InputState.RELEASED)
      this.thrown = true
    if (this.thrown) this.updateThrown(dt)
    else this.updateStandby()
    this.updateEdges()
  }

  draw() {
    love.graphics.print('<Ball> ' + inspect(this), 150, 10)
    love.graphics.circle('line', this.position.x, this.position.y, this.size.x)
  }
}
