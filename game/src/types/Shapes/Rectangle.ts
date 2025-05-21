import { Vector2 } from 'types/Vector'

type CornerName = 'topright' | 'topleft' | 'botright' | 'botleft'

export class Rectangle {
  protected _size: Vector2

  position: Vector2

  constructor(width: number, height: number, position = new Vector2()) {
    this._size = new Vector2(width, height)
    this.position = position
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
        return this.position.unpack()
      case 'topright':
        return $multi(this.position.x + this._size.x, this.position.y)
      case 'botleft':
        return $multi(this.position.x, this.position.y + this._size.y)
      case 'botright':
        return $multi(
          this.position.x + this._size.x,
          this.position.y + this._size.y
        )
    }
  }
}
