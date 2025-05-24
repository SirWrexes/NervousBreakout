/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters, @typescript-eslint/no-unused-vars, prefer-const */

declare let GlobalClass: <Class, CtorParams extends unknown[]>(
  this: unknown,
  cls: new (...params: CtorParams) => Class,
  context: ClassDecoratorContext
) => void

GlobalClass = (target, ctx) => {
  if (ctx.name)
    // @ts-expect-error Knowing the index value here doesn't matter
    _G[ctx.name] = target
}
