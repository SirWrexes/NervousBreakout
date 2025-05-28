export type AnyClass = abstract new (...params: any[]) => any

export type ClassProtoype<Cls extends AnyClass> = Cls extends abstract new (
  ...params: any[]
) => infer Proto
  ? Proto
  : never
