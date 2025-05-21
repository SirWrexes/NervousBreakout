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

/**
 *       0.2345
 * ×  1000.0000
 * ------------
 *     234.5000
 * ~~~~~~~~~~~~
 *     235.0000
 * ÷  1000.0000
 * ------------
 *       0.2350
 */

math.roundn = (x: number, n: number) => {
  assert(n > 0, 'n must be be >= 0')
  n = 10 ** math.floor(n)
  x *= n
  const [_mod, f] = math.modf(x)
  return (f > 0.5 ? math.ceil(x) : math.floor(x)) / n
}

math.round = (x: number) => {
  const [mod, f] = math.modf(x)
  return f > 0.5 ? math.ceil(mod) : math.floor(mod)
}

math.cossin = (x: number) => $multi(math.cos(x), math.sin(x))

math.clamp = (x: number, min?: number, max?: number) =>
  math.max(min ?? 0, math.min(max ?? math.huge, x))
