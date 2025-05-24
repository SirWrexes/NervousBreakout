import * as ctx from 'context'
import * as t from 'types/TileMap/Tile'

// prettier-ignore
type Tile = 
  | t.Empty
  | t.Square
  | t.Circle

const shader = love.graphics.newShader(glsl`
  vec4 effect(vec4 colour, Image texture, vec2 texpos, vec2 scrpos) {
    return vec4(0.0, 1.0, 0.0, 1.0);
  }
`)

// TODO: Use builder pattern
export class TileMap<Width extends number, Height extends number> {
  private map: Tile[]

  constructor(
    private width: Width,
    private height: Height,
    private raw: string,
    private cell: number
  ) {
    this.raw = raw
    this.map = []

    let i: number
    const pos = new Vector2()
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        i = this.getRelativeMonoIndex(x, y)
        pos.set(x * cell, y * cell)
        switch (raw[i]) {
          case ' ':
            this.map[i] = new t.Empty(cell, pos.clone())
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

  private getRelativeCoordinates(x: number, y: number): Vector2.LuaUnpacked {
    return $multi(x * this.cell, y * this.cell)
  }

  /**
   * @param ix X index relative to the map
   * @param iy Y index relative to the map
   */
  private getRelativeMonoIndex(ix: number, iy: number) {
    return ix + iy * this.width
  }

  /**
   * @param ix X index relative to the map
   * @param iy Y index relative to the map
   */
  private getRelativeTile(ix: number, iy: number) {
    return this.map[this.getRelativeMonoIndex(ix, iy)]
  }

  update(dt: number) {
    for (const tile of this.map) tile.update()
  }

  draw() {
    let hover: boolean

    for (const tile of this.map) {
      hover = tile.isHovered(ctx.Mouse.position)
      if (hover) love.graphics.setShader(shader)
      tile.draw()
      if (hover) {
        if (ctx.Mouse.is('RELEASED', 2))
          love.window.showMessageBox(
            'Hovered tile',
            inspect(tile),
            'info',
            false
          )
        love.graphics.setShader()
      }
    }
  }
}
