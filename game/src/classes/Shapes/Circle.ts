import { Vector2 } from 'classes/Vector'
import { Shape } from './Shape'

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
