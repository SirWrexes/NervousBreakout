/* eslint-disable @typescript-eslint/no-unused-vars */

type LamLen<
  Len extends number,
  FnUnion extends Lambda,
> = FnUnion extends infer Member extends Lambda
  ? Parameters<Member>['length'] extends Len
    ? Member
    : never
  : never

declare let lamlen: <Len extends number, FnUnion extends Lambda>(
  fn: FnUnion,
  expected: Len
) => fn is Extract<FnUnion, LamLen<Len, FnUnion>>

lamlen = <Len extends number, FnUnion extends Lambda>(
  fn: FnUnion,
  expected: Len
): fn is Extract<FnUnion, LamLen<Len, FnUnion>> => fn.length === expected
