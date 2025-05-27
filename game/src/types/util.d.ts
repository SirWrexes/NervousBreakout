/* eslint-disable @typescript-eslint/no-explicit-any */

declare type AnyClass = abstract new (...params: any[]) => any

declare type ClassProtoype<Cls extends AnyClass> = Cls extends abstract new (
  ...params: any[]
) => infer Proto
  ? Proto
  : never

declare type Lambda<
  Fn extends (...args: any[]) => any = (...args: any[]) => any,
> = Fn extends (...args: infer Args extends any[]) => infer R
  ? (this: void, ...args: Args) => R
  : never

declare type AnyFunction = (...args: any[]) => any
