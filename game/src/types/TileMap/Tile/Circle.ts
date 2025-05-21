import type { DrawableTile } from './Drawable'
import * as s from 'types/Shapes'

export class Circle extends s.Circle implements DrawableTile {
  draw() {
    love.graphics.circle(
      'line',
      this.position.x - this.radius,
      this.position.y - this.radius,
      this.radius
    )
  }

  update() {}
}
