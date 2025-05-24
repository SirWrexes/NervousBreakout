import type { Rectangle } from './Rectangle'
import { Shape } from './Shape'

type CollisionData = {
  target: Rectangle
  normal: Vector2
  overlap: number
}

export class Circle extends Shape {
  public radius: number

  constructor(radius: number, origin: Vector2 = new Vector2()) {
    super(origin)
    this.radius = radius
  }

  get diameter() {
    return this.radius * 2
  }

  get centre() {
    return this.origin
  }
}
