declare namespace math {
  /**
   * Round a number
   */
  function round(x: number): number

  /**
   * Round a number at the `n`th decimal
   */
  function roundn(x: number, n: number): number

  /**
   * Get the sine and cosine of an angle
   *
   * @param x Angle in rads
   */
  function cossin(x: number): LuaMultiReturn<[cos: number, sin: number]>

  /**
   *  Clamp a number between two boundaries
   *
   * @param min Default: `0`
   * @param max Default: {@link math.huge}
   */
  function clamp(x: number, min?: number, max?: number): number
}
