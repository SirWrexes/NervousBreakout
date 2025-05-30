import { InputState, Keyboard, Mouse, Window } from 'context'
import { Rectangle } from 'classes/Shapes'
import { Vector2 } from 'classes/Vector'

const WIDTH = 120
const HEIGHT = 10

declare global {
  interface CustomHandlers {
    ['paddle/update']: () => void
  }
}

export class Paddle extends Rectangle {
  private distance: number = math.huge
  private velocity: number = 0
  private angle: number = 0

  public readonly centre: Vector2
  public readonly speed: number = 500

  constructor() {
    super(WIDTH, HEIGHT, new Vector2(0, Window.height - HEIGHT * 3))

    this.centre = new Vector2(
      this.origin.x + this.width / 2,
      this.origin.y + this.height / 2
    )
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
