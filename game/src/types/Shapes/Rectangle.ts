type CornerName = 'topright' | 'topleft' | 'botright' | 'botleft'

export class Rectangle {
  protected _size: Vector2

  origin: Vector2

  constructor(width: number, height: number, position = new Vector2()) {
    this._size = new Vector2(width, height)
    this.origin = position
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

  corner(name: CornerName): Vector2.LuaUnpacked {
    switch (name) {
      case 'topleft':
        return this.origin.unpack()
      case 'topright':
        return $multi(this.origin.x + this._size.x, this.origin.y)
      case 'botleft':
        return $multi(this.origin.x, this.origin.y + this._size.y)
      case 'botright':
        return $multi(
          this.origin.x + this._size.x,
          this.origin.y + this._size.y
        )
    }
  }
}
