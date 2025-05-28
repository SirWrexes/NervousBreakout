import type { Vector2 } from 'types/Vector'
import { Rectangle } from './Rectangle'

export class Square extends Rectangle {
  constructor(size: number, position?: Vector2) {
    super(size, size, position)
  }

  get size() {
    return this._size.x
  }

  set size(n: number) {
    this._size.x = n
    this._size.y = n
  }
}
