/* eslint-disable @typescript-eslint/no-unused-vars
 */

type FunLen<
  Len extends number,
  FnUnion extends Lambda,
> = FnUnion extends infer Member extends Lambda
  ? Parameters<Member>['length'] extends Len
    ? Member
    : never
  : never

declare let funlen: <Len extends number, FnUnion extends AnyFunction>(
  fn: FnUnion,
  expected: Len
) => fn is Extract<FnUnion, FunLen<Len, FnUnion>>

funlen = <Len extends number, FnUnion extends AnyFunction>(
  fn: FnUnion,
  expected: Len
): fn is Extract<FnUnion, FunLen<Len, FnUnion>> => fn.length === expected
