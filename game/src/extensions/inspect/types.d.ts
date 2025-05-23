/* eslint-disable @typescript-eslint/no-explicit-any */

declare namespace inspect {
  interface Processor {
    (item: unknown, path: any): any
  }

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

declare function inspect(root: any, options?: inspect.Options): string
