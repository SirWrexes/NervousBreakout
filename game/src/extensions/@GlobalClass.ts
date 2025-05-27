/* eslint-disable @typescript-eslint/no-unused-vars */

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
    // @ts-expect-error Force injection into global scope
    _G[ctx.name] = target
}
