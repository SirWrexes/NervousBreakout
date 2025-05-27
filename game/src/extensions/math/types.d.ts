declare namespace math {
  /**
   * Round a number
   */
  let round: Lambda<(x: number) => number>

  /**
   * Round a number at the `n`th decimal
   */
  let roundn: Lambda<(x: number, n: number) => number>

  /**
   * Get the sine and cosine of an angle
   *
   * @param x Angle in rads
   */
  let cossin: Lambda<(x: number) => LuaMultiReturn<[cos: number, sin: number]>>

  /**
   *  Clamp a number between two boundaries
   *
   * @param min Default: `0`
   * @param max Default: {@link math.huge}
   */
  let clamp: Lambda<(x: number, min?: number, max?: number) => number>
}
