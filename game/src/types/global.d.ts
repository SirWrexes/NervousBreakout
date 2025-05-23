/**
 * Arguments passed to command line
 */
declare const arg: string[]

/**
 * `true` if dev mode on
 */
declare const __DEV: boolean

/**
 * `true` if debug mode on
 */
declare const __DEBUG: boolean

/**
 * Types returned by the lua function `type(v)`
 */
declare type LuaTypeName =
  | 'nil'
  | 'number'
  | 'string'
  | 'boolean'
  | 'table'
  | 'function'
  | 'thread'
  | 'userdata'
