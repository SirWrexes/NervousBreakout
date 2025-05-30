export type NoSelf<Fn extends AnyFunction = AnyFunction> = Fn extends (
  ...args: infer Args extends any[]
) => infer R
  ? (this: void, ...args: Args) => R
  : never

export type AnyFunction = (...args: any[]) => any
