import type { Lambda } from 'types/functionlike'

type LamLen<
  Len extends number,
  FnUnion extends Lambda,
> = FnUnion extends infer Member extends Lambda
  ? Parameters<Member>['length'] extends Len
    ? Member
    : never
  : never

export const lamlen = <Len extends number, FnUnion extends Lambda>(
  fn: FnUnion,
  expected: Len
): fn is Extract<FnUnion, LamLen<Len, FnUnion>> => fn.length === expected
