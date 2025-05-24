import { InputState, Keyboard, Mouse, Window } from 'context'
import { Rectangle } from 'types/Shapes'

const WIDTH = 120
const HEIGHT = 10

export class Paddle extends Rectangle {
  private distance: number = math.huge
  private velocity: number = 0
  private angle: number = 0

  public centre: Vector2
  public edges = { l: 0, r: 0, u: 0, d: 0 }
  public speed: number = 500

  constructor() {
    super(WIDTH, HEIGHT, new Vector2(0, Window.height - HEIGHT * 3))

    this.centre = new Vector2(
      this.origin.x + this.width / 2,
      this.origin.y + this.height / 2
    )
  }

  updateEdges() {
    this.edges.l = this.origin.x
    this.edges.r = this.origin.x + this.width
    this.edges.u = this.origin.y
    this.edges.d = this.origin.y + this.height
    this.centre.x = this.origin.x + this.width / 2
    this.centre.y = this.origin.y + this.height / 2
  }

  updateDistance() {
    this.distance = math.abs(Mouse.position.x - this.centre.x)
  }

  updateAngle() {
    this.angle = this.centre.angle(Mouse.position)
  }

  updatePosition(dt: number) {
    this.origin.x = this.origin.x + math.cos(this.angle) * this.speed * dt // TODO: Add proper easing
    this.origin.x = math.clamp(this.origin.x, 0, Window.width - this.width)
    this.origin.x = math.round(this.origin.x)
    this.centre.x = this.origin.x + this.width / 2
    this.centre.y = this.origin.y + this.height / 2
  }

  update(dt: number) {
    this.updateDistance()
    if (this.distance <= 2) return
    this.updateAngle()
    if (Keyboard.get('space') === InputState.DOWN) return
    this.updatePosition(dt)
    this.updateEdges()
  }

  draw() {
    love.graphics.rectangle(
      'line',
      this.origin.x,
      this.origin.y,
      this.width,
      this.height
    )
  }
}
