import { Thread } from 'love.thread'

declare global {
  export type LuaTypeName =
    | 'nil'
    | 'number'
    | 'string'
    | 'boolean'
    | 'table'
    | 'function'
    | 'thread'
    | 'userdata'
}

export const isType = <Type extends LuaTypeName>(
  v: unknown,
  expected: Type
): v is Type extends 'number' ? number
: Type extends 'nil' ? undefined
: Type extends 'string' ? string
: Type extends 'boolean' ? boolean
: // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
Type extends 'function' ? Function
: // eslint-disable-next-line @typescript-eslint/no-explicit-any
Type extends 'table' ? object | any[]
: Type extends 'thread' ? Thread
: Type extends 'userdata' ? LuaUserdata
: never => type(v) === expected
