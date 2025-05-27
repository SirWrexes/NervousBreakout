/* eslint-disable
    @typescript-eslint/no-explicit-any,
    @typescript-eslint/no-unsafe-member-access,
    @typescript-eslint/no-unnecessary-type-parameters
    */

import type { EmptyObject, Tagged } from 'type-fest'

type Enum<E extends string, Keys extends string[]> = Readonly<{
  [k in Keys[number]]: EnumKey<E, k>
}>

type EnumKey<E extends string, K extends string> = Tagged<
  EmptyObject,
  `${E}.${K}`
>

export const Enum = <Name extends string, Keys extends string[]>(
  name: Name,
  ...keys: Keys
) => {
  const e = {} as any
  keys.forEach(key => {
    e[key] = Symbol(`${name}.${key}`)
  })
  return e as Enum<Name, Keys>
}
