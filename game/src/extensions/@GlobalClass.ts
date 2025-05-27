/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters, @typescript-eslint/no-unused-vars, prefer-const */

declare let GlobalClass: <
  This,
  Params extends any[],
  Class extends abstract new (...params: Params) => This,
>(
  this: This,
  cls: Class,
  context: ClassDecoratorContext
) => void

GlobalClass = (target, ctx) => {
  if (ctx.name)
    // @ts-expect-error Knowing the index value here doesn't matter
    _G[ctx.name] = target
}
