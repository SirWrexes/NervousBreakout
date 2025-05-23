import { funlen, isType } from 'util'

export namespace Vector2 {
  export interface Base {
    x: number
    y: number
  }

  export type Unpacked = [x: number, y: number]
  export type LuaUnpacked = LuaMultiReturn<Vector2.Unpacked>
}

export class Vector2 implements Vector2.Base {
  x: number
  y: number

  get magnitude() {
    return math.sqrt(this.x ** 2 + this.y ** 2)
  }

  constructor(x: number = 0, y: number = x) {
    this.x = x
    this.y = y
  }

  unpack(): Vector2.LuaUnpacked {
    return $multi(this.x, this.y)
  }

  clone() {
    return new Vector2(this.x, this.y)
  }

  transform(
    map:
      | ((n: number) => number)
      | ((x: number, y: number) => Vector2.LuaUnpacked)
  ) {
    if (funlen(1, map)) {
      this.x = map(this.x)
      this.y = map(this.y)
    } else {
      const [x, y] = map(this.x, this.y)
      this.x = x
      this.y = y
    }
    return this
  }

  set(x = 0, y = 0) {
    this.x = x
    this.y = y
    return this
  }

  copy(vec: Vector2.Base) {
    this.x = vec.x
    this.y = vec.y
    return this
  }

  normalise() {
    const mag = this.magnitude
    this.x /= mag
    this.y /= mag
    return this
  }

  angle(x: number, y: number): number
  angle(vec: Vector2.Base): number
  angle(v: Vector2.Base | number, y?: number) {
    return isType(v, 'number')
      ? math.atan2(y! - this.y, v - this.x)
      : math.atan2(v.y - this.y, v.x - this.x)
  }

  scale(n: number) {
    this.x *= n
    this.y *= n
    return this
  }

  dot(vec: Vector2.Base) {
    return vec instanceof Vector2
      ? this.magnitude * vec.magnitude * math.cos(this.angle(vec))
      : this.x * vec.x + this.y * vec.y
  }
}
