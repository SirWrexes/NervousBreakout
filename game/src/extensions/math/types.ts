// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace math {
  /**
   * Round a number
   */
  let round: (this: void, x: number) => number

  /**
   * Round a number at the `n`th decimal
   */
  let roundn: (this: void, x: number, n: number) => number

  /**
   * Get the sine and cosine of an angle
   *
   * @param x Angle in rads
   */
  let cossin: (
    this: void,
    x: number
  ) => LuaMultiReturn<[cos: number, sin: number]>

  /**
   *  Clamp a number between two boundaries
   *
   * @param min Default: `0`
   * @param max Default: {@link math.huge}
   */
  let clamp: (this: void, x: number, min?: number, max?: number) => number
}
