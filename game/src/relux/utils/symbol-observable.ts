

declare global {
  interface SymbolConstructor {
    readonly observable: symbol
  }
}

const $$observable = (() =>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  Symbol.observable
  // @ts-expect-error hacky global
  ?? (Symbol.observable = Symbol('@@observable')))()

export default $$observable
