import type { Thread } from 'love.thread'

export const isType = <Type extends LuaTypeName | 'array'>(
  v: unknown,
  expected: Type
): v is Type extends 'number' ? number
: Type extends 'nil' ? undefined
: Type extends 'string' ? string
: Type extends 'boolean' ? boolean
: // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
Type extends 'function' ? Function
: // eslint-disable-next-line @typescript-eslint/no-explicit-any
Type extends 'array' ? any[]
: Type extends 'table' ? object
: Type extends 'thread' ? Thread
: Type extends 'userdata' ? LuaUserdata
: never => {
  if (expected === 'array') return Array.isArray(v)
  return type(v) === expected
}
