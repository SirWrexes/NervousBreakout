declare namespace inspect {
  type Processor = (this: void, item: unknown, path: any[]) => any

  interface Options {
    depth?: number
    newline?: string
    indent?: string
    process?: Processor | false
  }

  interface ProcessorTable {
    [string]: Processor
  }

  const test: (
    s: string
  ) => LuaMultiReturn<[r: number, g: number, b: number, a: number]>
}

declare function inspect(
  this: void,
  root: any,
  options?: inspect.Options
): string

declare namespace inspect {
  const KEY: unique symbol
}
