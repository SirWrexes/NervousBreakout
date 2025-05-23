math.clamp = (x: number, min?: number, max?: number) =>
  math.max(min ?? 0, math.min(max ?? math.huge, x))
