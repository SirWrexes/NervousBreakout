import type { DrawableTile } from './Tile'
import * as t from 'types/TileMap/Tile'
import { Vector2 } from 'types/Vector'

// prettier-ignore
type Tile = 
  | t.Empty
  | t.Square
  | t.Circle

export class TileMap<Width extends number, Height extends number>
  implements DrawableTile
{
  private map: Tile[]

  constructor(
    private width: Width,
    private height: Height,
    private raw: string,
    private cell: number,
    private scale: number = 1
  ) {
    this.raw = raw
    this.map = []

    let i: number
    const pos = new Vector2()
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        i = this.index(x, y)
        pos.set(x * cell, y * cell)
        switch (raw[i]) {
          case ' ':
            this.map[i] = new t.Empty()
            break
          case '#':
            this.map[i] = new t.Square(cell, pos.clone())
            break
          case 'o':
            this.map[i] = new t.Circle(cell / 2, pos.clone())
            break
        }
      }
    }
  }

  private index(x: number, y: number) {
    return x + y * this.width
  }

  update(dt: number): void {
    for (const tile of this.map) tile.update()
  }

  draw(): void {
    for (let y = 0; y < this.height; y += 1)
      for (let x = 0; x < this.width; x += 1) this.map[this.index(x, y)].draw()
  }
}
