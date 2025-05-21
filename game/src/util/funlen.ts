/* eslint-disable @typescript-eslint/no-explicit-any */

type FunWithLen<
  N extends number,
  FnUnion extends (...args: any[]) => unknown,
> = FnUnion extends infer Member extends (...args: any[]) => unknown
  ? Parameters<Member>['length'] extends N
    ? Extract<FnUnion, Member>
    : never
  : never

export const funlen = <
  Len extends number,
  FnUnion extends
    | ((this: void, ...args: any[]) => any)
    | ((...args: any[]) => any),
>(
  expected: Len,
  fn: FnUnion
): fn is FunWithLen<Len, FnUnion> => fn.length === expected
