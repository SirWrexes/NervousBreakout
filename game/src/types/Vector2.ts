namespace Extenstions {
  // @GlobalClass
  export class Vector2 implements Vector2.Base {
    x: number
    y: number

    get magnitude() {
      return math.sqrt(this.x * this.x + this.y * this.y)
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

    set(x = 0, y = x) {
      this.x = x
      this.y = y
      return this
    }

    copy(vec: Vector2.Base) {
      this.x = vec.x
      this.y = vec.y
      return this
    }

    min(x: number, y = 0) {
      if (this.x < x) this.x = x
      if (this.y < y) this.y = y
      return this
    }

    max(x: number, y = 0) {
      if (this.x > x) this.x = x
      if (this.y > y) this.y = y
      return this
    }

    normalise() {
      const r = 1 / this.magnitude
      if (r !== Infinity) {
        this.x *= r
        this.y *= r
      }
      return this
    }

    angle(x: number, y: number): number
    angle(v: Vector2.Base): number
    angle(v: Vector2.Base | number, y?: number) {
      return is('number', v)
        ? math.atan2(y! - this.y, v - this.x)
        : math.atan2(v.y - this.y, v.x - this.x)
    }

    subtract(x: number, y?: number): this
    subtract(v: Vector2.Base): this
    subtract(x: Vector2.Base | number, y?: number) {
      if (is('number', x)) {
        this.x -= x
        this.y -= y ?? x
      } else {
        this.x -= x.x
        this.y -= x.y
      }
      return this
    }

    add(x: number, y?: number): this
    add(v: Vector2.Base): this
    add(x: Vector2.Base | number, y?: number) {
      if (is('number', x)) {
        this.x += x
        this.y += y ?? x
      } else {
        this.x += x.x
        this.y += x.y
      }
      return this
    }

    scale(x: number, y?: number): this
    scale(v: Vector2.Base): this
    scale(x: Vector2.Base | number, y?: number) {
      if (is('number', x)) {
        this.x *= x
        this.y *= y ?? x
      } else {
        this.x *= x.x
        this.y *= x.y
      }
      return this
    }

    dot(x: number, y?: number): number
    dot(v: Vector2.Base): number
    dot(x: Vector2.Base | number, y?: number) {
      if (is('number', x)) return this.x * x + this.y * (y ?? x)
      if (x instanceof Vector2)
        return this.magnitude * x.magnitude * math.cos(this.angle(x))
      return this.x * x.x + this.y * x.y
    }
  }
}

// @ts-expect-error Decorators broken
_G.Vector2 = Extenstions.Vector2
