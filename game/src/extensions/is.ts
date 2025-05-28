import type { LuaTypeName } from 'types/lua'

type TypeName = LuaTypeName | 'array'
type OfType<Expected extends TypeName> = Expected extends 'number'
  ? number
  : Expected extends 'nil'
    ? undefined
    : Expected extends 'string'
      ? string
      : Expected extends 'boolean'
        ? boolean
        : Expected extends 'function'
          ? // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
            Function
          : Expected extends 'array'
            ? unknown[]
            : Expected extends 'table'
              ? object
              : Expected extends 'thread'
                ? // eslint-disable-next-line @typescript-eslint/consistent-type-imports
                  import('love.thread').Thread
                : Expected extends 'userdata'
                  ? LuaUserdata
                  : never

export const is = <Expected extends TypeName>(
  expected: Expected,
  v: unknown
): v is OfType<Expected> =>
  expected === 'array' ? Array.isArray(v) : type(v) === expected
