/** @noSelfInFile */

declare namespace math {
  function round(n: number): number
}

math.round = (n: number) => {
  const [mod, f] = math.modf(n)
  return f > 0.5 ? math.ceil(mod) : math.floor(mod)
}
