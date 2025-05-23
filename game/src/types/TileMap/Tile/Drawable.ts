import type { Vector2 } from 'types'

export interface DrawableTile {
  draw(xOffset: number, yOffset: number): void
  update(dt: number): void
  isHovered(v: Vector2): boolean
}
