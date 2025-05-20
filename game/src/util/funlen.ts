/* eslint-disable @typescript-eslint/no-explicit-any */

export const funlen = <
  Len extends number,
  FnUnion extends (...args: any[]) => any,
>(
  expected: Len,
  fn: FnUnion
  // @ts-expect-error shut up, it works
): fn is FnUnion extends infer Member extends (...args: any[]) => any
  ? Parameters<Member>['length'] extends Len
    ? Member
    : never
  : never => fn.length === expected
