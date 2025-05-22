import type { Vector2 } from 'types/Vector'

export interface DrawableTile {
  draw(xOffset: number, yOffset: number): void
  update(dt: number): void
  isHovered(v: Vector2): boolean
}
