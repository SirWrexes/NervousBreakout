export interface IVector2 {
  x: number
  y: number
}

export interface IVector3 extends IVector2 {
  z: number
}

export class Vector2 implements IVector2 {
  x: number
  y: number

  constructor(vec?: Vector2)
  constructor(x: number, y: number)
  constructor(x: Vector2 | number = 0, y = 0) {
    if (x instanceof Vector2) {
      this.x = x.x
      this.y = x.y
    } else {
      this.x = x
      this.y = y
    }
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
    const v = new Vector2(this)
    if (fn) v.transform(fn)
    return v
  }
}

export class Vector3 implements IVector3 {
  x: number
  y: number
  z: number

  constructor()
  constructor(vec: Vector2 | Vector3)
  constructor(x: number, y: number, z: number)
  constructor(x: Vector2 | Vector3 | number = 0, y = 0, z = 0) {
    if (x instanceof Vector3) {
      this.x = x.x
      this.y = x.y
      this.z = x.z
    } else if (x instanceof Vector2) {
      this.x = x.x
      this.y = x.y
      this.z = z
    } else {
      this.x = x
      this.y = y
      this.z = z
    }
  }

  /**
   * Mutate a vector in place
   *
   * @param fn Function applied to this vector's properties
   */
  transform(fn: (n: number) => number): this {
    this.x = fn(this.x)
    this.y = fn(this.y)
    this.z = fn(this.z)
    return this
  }

  /**
   * Create a copy of the vector
   *
   * @param fn Function applied to the new vector's properties
   */
  clone(fn?: (n: number) => number): Vector3 {
    const v = new Vector3(this)
    if (fn) v.transform(fn)
    return v
  }
}
