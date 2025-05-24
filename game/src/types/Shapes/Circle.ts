import { Rectangle } from './Rectangle'
import { Shape } from './Shape'

export class Circle extends Shape {
  constructor(
    public radius: number,
    origin: Vector2 = new Vector2()
  ) {
    super(origin)
    this.radius = radius
  }

  get diameter() {
    return this.radius * 2
  }

  get centre() {
    return this.origin
  }

  getRectangleCollisionData(rect: Rectangle) {
    return false
  }

  getCollisionData(shape: Shape) {
    switch (true) {
      case shape instanceof Rectangle: {
        return this.getRectangleCollisionData(shape)
      }
    }
  }
}
