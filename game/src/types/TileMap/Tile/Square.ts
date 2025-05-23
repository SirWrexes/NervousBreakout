import type { DrawableTile } from './Drawable'
import * as s from 'types/Shapes'
import type { Vector2 } from 'types/Vector'

export class Square extends s.Square implements DrawableTile {
  draw() {
    love.graphics.rectangle(
      'line',
      this.origin.x,
      this.origin.y,
      this._size.x,
      this._size.y
    )
  }

  update() {}

  isHovered(v: Vector2) {
    return (
      v.x >= this.origin.x
      && v.x <= this.origin.x + this.size
      && v.y >= this.origin.y
      && v.y <= this.origin.y + this.size
    )
  }
}
