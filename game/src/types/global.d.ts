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

/**
 * Flatten intersecrtion in editor tooltips
 */
declare type Pretty<T extends object, Deep extends boolean = false> = {
  [key in keyof T]: Deep extends false ? T[key]
  : T[key] extends object ? Pretty<T[key]>
  : T[key]
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
} & unknown
