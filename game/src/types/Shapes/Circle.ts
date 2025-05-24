import type { Rectangle } from './Rectangle'

export class Circle {
  radius: number
  origin: Vector2

  constructor(radius: number, position: Vector2 = new Vector2()) {
    this.radius = radius
    this.origin = position
  }

  get diameter() {
    return this.radius * 2
  }

  get centre() {
    return this.origin
  }

  collidesWith(rect: Rectangle) {}
}
