export interface IVector2 {
  x: number
  y: number
}

export class Vector2 implements IVector2 {
  x: number
  y: number

  constructor(x: number = 0, y: number = x) {
    this.x = x
    this.y = y
  }

  set(x = 0, y = 0) {
    this.x = x
    this.y = y
    return this
  }

  /**
   * Mutate a vector in place
   *
   * @param fn Function applied to this vector's properties
   */
  transform(fn: (n: number) => number): this {
    this.x = fn(this.x)
    this.y = fn(this.y)
    return this
  }

  /**
   * Create a copy of the vector
   *
   * @param fn Function applied to the new vector's properties
   */
  clone(fn?: (n: number) => number): Vector2 {
    const v = new Vector2(this.x, this.y)
    if (fn) v.transform(fn)
    return v
  }

  unpack(): LuaMultiReturn<[x: number, y: number]> {
    return $multi(this.x, this.y)
  }
}

export default Vector2
