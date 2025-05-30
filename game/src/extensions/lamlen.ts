import type { NoSelf } from 'types/functionlike'

type LamLen<
  Len extends number,
  FnUnion extends NoSelf,
> = FnUnion extends infer Member extends NoSelf
  ? Parameters<Member>['length'] extends Len
    ? Member
    : never
  : never

export const lamlen = <Len extends number, FnUnion extends NoSelf>(
  fn: FnUnion,
  expected: Len
): fn is Extract<FnUnion, LamLen<Len, FnUnion>> => fn.length === expected
