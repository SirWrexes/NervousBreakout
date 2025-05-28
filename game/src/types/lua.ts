/**
 * Arguments passed to command line
 */
export declare const arg: string[]

/**
 * Types returned by the lua function `type(v)`
 */
export type LuaTypeName =
  | 'nil'
  | 'number'
  | 'string'
  | 'boolean'
  | 'table'
  | 'function'
  | 'thread'
  | 'userdata'
