export type AnyArray = any[] | readonly any[]

export type Tuple<Size extends number, T = any, A extends T[] = []> =
  Length<A> extends Size ? A : Tuple<Size, T, [T, ...A]>

export type Length<T extends AnyArray> = T['length'] extends number
  ? T['length']
  : never

export type IndicesPlusOne<T extends AnyArray> = Length<Partial<T>>
export type Indices<T extends AnyArray> = Exclude<IndicesPlusOne<T>, Length<T>>
