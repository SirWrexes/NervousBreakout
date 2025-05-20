/** @noSelfInFile */

declare namespace math {
  /**
   * Round a number
   */
  function round(n: number): number

  /**
   * Get the sine and cosine of an angle
   *
   * @param n Angle in rads
   */
  function cossin(n: number): LuaMultiReturn<[cos: number, sin: number]>

  /**
   *  Clamp a number between two boundaries
   *
   * @param min Default: `0`
   * @param max Default: {@link math.huge}
   */
  function clamp(n: number, min?: number, max?: number): number
}

math.round = (n: number) => {
  const [mod, f] = math.modf(n)
  return f > 0.5 ? math.ceil(mod) : math.floor(mod)
}

math.cossin = (n: number) => $multi(math.cos(n), math.sin(n))

math.clamp = (n: number, min = 0, max = math.huge) =>
  math.max(min, math.min(max, n))
