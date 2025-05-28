export type Lambda<
  Fn extends (...args: any[]) => any = (...args: any[]) => any,
> = Fn extends (...args: infer Args extends any[]) => infer R
  ? (this: void, ...args: Args) => R
  : never

export type AnyFunction = (...args: any[]) => any
