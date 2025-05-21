import { Vector2 } from 'types/Vector'

export class Circle {
  radius: number
  position: Vector2

  constructor(radius: number, position: Vector2 = new Vector2()) {
    this.radius = radius
    this.position = position
  }

  get diameter() {
    return this.radius * 2
  }

  get centre() {
    return this.position
  }
}
