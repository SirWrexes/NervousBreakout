import type { EmptyObject, Tagged } from 'type-fest'

type Enum<Name extends string, Keys extends readonly string[]> = Readonly<
  Pretty<
    Keys extends [infer First extends string] ?
      { [x in First]: Tagged<number, `${Name}.${First}`> }
    : Keys extends (
      [infer First extends string, ...infer Tail extends string[]]
    ) ?
      { [x in First]: Tagged<number, `${Name}.${First}`> } & Enum<Name, Tail>
    : EmptyObject
  >
>

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const Enum = <Name extends string, Keys extends readonly string[]>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  name: Name,
  ...keys: Keys
) => {
  const e: Record<string, unknown> = {}
  keys.forEach(key => {
    e[key] = {}
  })
  return e as Enum<Name, Keys>
}
