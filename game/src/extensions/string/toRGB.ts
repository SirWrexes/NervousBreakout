// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface String {
  /**
   * Convert a given string to RGBA values.
   *
   * @throws If the string is not in proper RGBA format
   *
   * @param fractional Return values as percents (`1 > x > 0`)\
   *                   Default: `true`
   */
  toRGB(
    this: string,
    fractional?: boolean
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  ): LuaMultiReturn<import('love.math').RGBA>
}

string.toRGB = function (fractional = true) {
  let [hex] = this.gsub('^#', '')
  const values = [] as unknown as [number, number, number, number]
  const len = hex.length

  if (len < 6) {
    if (len === 3) {
      hex =
        hex.substring(0, 1).repeat(2)
        + hex.substring(1, 2).repeat(2)
        + hex.substring(2, 3).repeat(2)
    } else if (len === 2) hex = hex.repeat(3)
    else
      throw `Hexadeximal colour string should be 2, 3, 6 or 8 characters long\nGot ${len}.`
  }
  if (len < 8) hex += 'ff'
  values[0] = tonumber(hex.substring(0, 2), 16)!
  values[1] = tonumber(hex.substring(2, 4), 16)!
  values[2] = tonumber(hex.substring(4, 6), 16)!
  values[3] = tonumber(hex.substring(6, 8), 16)!
  if (fractional) {
    values[0] = (values[0] * 100) / 255 / 100
    values[1] = (values[1] * 100) / 255 / 100
    values[2] = (values[2] * 100) / 255 / 100
    values[3] = (values[3] * 100) / 255 / 100
  }

  return $multi(...values)
}
