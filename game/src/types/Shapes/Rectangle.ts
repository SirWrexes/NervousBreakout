import { Vector2 } from 'types/Vector'
import { Shape } from './Shape'

export class Rectangle extends Shape {
  protected _size: Vector2

  constructor(width: number, height: number, origin = new Vector2()) {
    super(origin)
    this._size = new Vector2(width, height)
  }

  get width() {
    return this._size.x
  }

  set width(n: number) {
    this._size.x = n
  }

  get height() {
    return this._size.y
  }

  set height(n: number) {
    this._size.y = n
  }

  corner(c: Rectangle.Corner): Vector2.LuaUnpacked {
    switch (c) {
      case Rectangle.Corner.TopLeft:
        return this.origin.unpack()
      case Rectangle.Corner.TopRight:
        return $multi(this.origin.x + this._size.x, this.origin.y)
      case Rectangle.Corner.BotLeft:
        return $multi(this.origin.x, this.origin.y + this._size.y)
      case Rectangle.Corner.BotRight:
        return $multi(
          this.origin.x + this._size.x,
          this.origin.y + this._size.y
        )
    }
  }

  diagonal(d: Rectangle.Diagonal): [number, number, number, number] {
    let x1, x2, y1, y2
    switch (d) {
      case Rectangle.Diagonal.TLBR:
        ;[x1, y1] = this.corner(Rectangle.Corner.TopLeft)
        ;[x2, y2] = this.corner(Rectangle.Corner.BotRight)
        return [x1, y1, x2, y2]
      case Rectangle.Diagonal.BLTR:
        ;[x1, y1] = this.corner(Rectangle.Corner.BotLeft)
        ;[x2, y2] = this.corner(Rectangle.Corner.TopRight)
        return [x1, y1, x2, y2]
    }
  }
}

export namespace Rectangle {
  export enum Corner {
    TopLeft,
    TopRight,
    BotLeft,
    BotRight,
  }

  export enum Diagonal {
    /** Top Left to Bottom Right */
    TLBR,
    /** Bottom Left to Top Right */
    BLTR,
  }
}
