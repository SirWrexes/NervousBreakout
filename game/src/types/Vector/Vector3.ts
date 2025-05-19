import type { IVector2 } from './Vector2'
import { isType } from 'util'

export interface IVector3 extends IVector2 {
  z: number
}

export class Vector3 implements IVector3 {
  x: number
  y: number
  z: number

  constructor()
  constructor(tuple: [x: number, y: number, z: number])
  constructor(vec3?: IVector2 | IVector3)
  constructor(x: number, y: number, z: number)
  constructor(
    x: IVector2 | IVector3 | [x: number, y: number, z: number] | number = 0,
    y = x as number,
    z = x as number
  ) {
    if (isType(x, 'number')) {
      this.x = x
      this.y = y
      this.z = z
    } else if (isType(x, 'array')) {
      this.x = x[0]
      this.y = x[1]
      this.z = x[2]
    } else {
      this.x = x.x
      this.y = x.y
      // @ts-expect-error `x.z` will either be set or nil
      this.z = x.z ?? z
    }
  }

  set(vec: IVector2 | IVector3): this
  set(tuple: [x: number, y: number, z: number]): this
  set(x: number, y: number): this
  set(
    x: IVector2 | IVector3 | [x: number, y: number, z?: number] | number,
    y = 0,
    z = 0
  ) {
    if (isType(x, 'number')) {
      this.x = x
      this.y = y!
      this.z = z!
    } else if (isType(x, 'array')) {
      this.x = x[0]
      this.y = x[1]
      this.z = x[2] ?? z
    } else {
      this.x = x.x
      this.y = x.y
      // @ts-expect-error `x.z` will either be set or nil
      this.z = x.z ?? z
    }
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
