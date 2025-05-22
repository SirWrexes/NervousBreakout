import type { DrawableTile } from './Drawable'
import * as s from 'types/Shapes'
import type { Vector2 } from 'types/Vector'

export class Square extends s.Square implements DrawableTile {
  draw() {
    love.graphics.rectangle(
      'line',
      this.position.x,
      this.position.y,
      this._size.x,
      this._size.y
    )
  }

  update() {}

  isHovered(v: Vector2) {
    return (
      v.x >= this.position.x
      && v.x <= this.position.x + this.size
      && v.y >= this.position.y
      && v.y <= this.position.y + this.size
    )
  }
}
