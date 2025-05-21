import type { DrawableTile } from './Drawable'
import * as s from 'types/Shapes'

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
}
