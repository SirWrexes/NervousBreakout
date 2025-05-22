import type { DrawableTile } from './Drawable'
import { Vector2 } from 'types/Vector'

export class Empty implements DrawableTile {
  constructor(
    public size: number,
    public position: Vector2 = new Vector2()
  ) {}

  draw() {}
  update() {}

  isHovered(v: Vector2): boolean {
    return (
      v.x >= this.position.x
      && v.x <= this.position.x + this.size
      && v.y >= this.position.y
      && v.y <= this.position.y + this.size
    )
  }
}
