import { IVector2, Vector2 } from './Vector'

const SIZE: IVector2 = {
  x: 120,
  y: 10
}

export class Paddle {
  position: Vector2
  centre: Vector2

  size: Vector2
  rounding: Vector2

  speed = 500

  constructor() {
    const [x, y] = love.graphics.getDimensions()

    this.position = new Vector2(x, y)
    this.size = new Vector2()

    this.centre = new Vector2(
      this.position.x + this.size.x / 2,
      this.position.y + this.size.y / 2
    )
  }
}

export default Paddle
