import type { Lambda, AnyFunction } from 'types/functionlike'

type FunLen<
  Len extends number,
  FnUnion extends Lambda,
> = FnUnion extends infer Member extends Lambda
  ? Parameters<Member>['length'] extends Len
    ? Member
    : never
  : never

export const funlen = <Len extends number, FnUnion extends AnyFunction>(
  fn: FnUnion,
  expected: Len
): fn is Extract<FnUnion, FunLen<Len, FnUnion>> => fn.length === expected
