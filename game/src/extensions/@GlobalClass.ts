/* eslint-disable @typescript-eslint/no-unused-vars,
                  @typescript-eslint/no-explicit-any,
                  prefer-const
                  */

declare let GlobalClass: <
  This,
  Class extends abstract new (...params: any[]) => This,
>(
  this: This,
  cls: Class,
  context: ClassDecoratorContext<Class>
) => void

GlobalClass = (target, ctx) => {
  if (ctx.name)
    // @ts-expect-error Knowing the index value here doesn't matter
    _G[ctx.name] = target
}
