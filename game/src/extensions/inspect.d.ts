/* eslint-disable @typescript-eslint/no-explicit-any */
/** @noSelfInfile */

declare namespace inspect {
  interface Processor {
    <T>(item: T, table: any): T
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
}

declare const inspect: (root: any, options?: inspect.Options) => string
