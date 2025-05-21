export interface DrawableTile {
  draw(xOffset: number, yOffset: number): void
  update(dt: number): void
}
