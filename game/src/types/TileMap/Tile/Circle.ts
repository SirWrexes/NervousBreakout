import type { DrawableTile } from './Drawable'
import * as s from 'types/Shapes'
import type { Vector2 } from 'types/Vector'

export class Circle extends s.Circle implements DrawableTile {
  constructor(radius: number, position: Vector2) {
    super(
      radius,
      position.transform((x: number) => x + radius)
    )
  }

  draw() {
    love.graphics.circle('line', this.position.x, this.position.y, this.radius)
  }

  update() {}

  isHovered(v: Vector2): boolean {
    // prettier-ignore
    return (
      (v.x - this.centre.x) ** 2
    + (v.y - this.centre.y) ** 2 
    ) <= this.radius ** 2
  }
}
