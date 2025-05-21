import { InputState, Keyboard, Mouse, Window } from 'context'
import { Vector2 } from 'types/Vector/Vector2'

export class Paddle {
  position: Vector2
  centre: Vector2
  size: Vector2 = new Vector2(120, 10)
  edges = { l: 0, r: 0, u: 0, d: 0 }
  speed: number = 500

  private distance: number = math.huge
  private velocity: number = 0
  private angle: number = 0

  constructor() {
    this.position = new Vector2(0, Window.size.y - this.size.y * 3)

    this.centre = new Vector2(
      this.position.x + this.size.x / 2,
      this.position.y + this.size.y / 2
    )
  }

  updateEdges() {
    this.edges.l = this.position.x
    this.edges.r = this.position.x + this.size.x
    this.edges.u = this.position.y
    this.edges.d = this.position.y + this.size.y
    this.centre.x = this.position.x + this.size.x / 2
    this.centre.y = this.position.y + this.size.y / 2
  }

  updateDistance() {
    this.distance = math.abs(Mouse.position.x - this.centre.x)
  }

  updateAngle() {
    this.angle = this.centre.angle(Mouse.position)
  }

  updatePosition(dt: number) {
    this.position.x = this.position.x + math.cos(this.angle) * this.speed * dt // TODO: Add proper easing
    if (this.position.x > Window.size.x - this.size.x)
      this.position.x = Window.size.x - this.size.x
    else if (this.position.x < 0) this.position.x = 0
    this.position.x = math.round(this.position.x)
    this.centre.x = this.position.x + this.size.x / 2
    this.centre.y = this.position.y + this.size.x / 2
  }

  update(dt: number) {
    this.updateDistance()
    if (this.distance <= 2) return
    this.updateAngle()
    if (Keyboard.button('space') === InputState.DOWN) return
    this.updatePosition(dt)
    this.updateEdges()
  }

  draw() {
    love.graphics.rectangle(
      'line',
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    )
  }
}
