math.round = (x: number) => {
  const [mod, f] = math.modf(x)
  return f > 0.5 ? math.ceil(mod) : math.floor(mod)
}

math.roundn = (x: number, n: number) => {
  assert(n > 0, 'n must be be >= 0')
  n = 10 ** math.floor(n)
  x *= n
  const [_mod, f] = math.modf(x)
  return (f > 0.5 ? math.ceil(x) : math.floor(x)) / n
}
