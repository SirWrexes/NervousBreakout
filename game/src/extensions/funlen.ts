/* eslint-disable @typescript-eslint/no-explicit-any */

type FunWithLen<
  N extends number,
  FnUnion extends (...args: any[]) => any,
> = FnUnion extends infer Member extends (...args: any[]) => unknown
  ? Parameters<Member>['length'] extends N
    ? Extract<FnUnion, Member>
    : never
  : never

declare let funlen: <
  Len extends number,
  FnUnion extends
    | ((this: void, ...args: any[]) => any)
    | ((...args: any[]) => any),
>(
  expected: Len,
  fn: FnUnion
) => fn is FunWithLen<Len, FnUnion>

// eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
funlen = (expected, fn): fn is FunWithLen<typeof expected, typeof fn> =>
  fn.length === expected
