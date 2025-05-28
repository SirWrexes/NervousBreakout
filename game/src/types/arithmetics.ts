import type { PositiveInfinity } from 'type-fest'
import type { Length, Tuple } from './arraylike'

type MultiAdd<
  Step extends number,
  N extends number,
  R extends number = 0,
> = Step extends 0 ? R : MultiAdd<Subtract<Step, 1>, N, Add<N, R>>

type MultiSub<N extends number, D extends number, Q extends number> =
  LowerThan<N, D> extends true ? Q : MultiSub<Subtract<N, D>, D, Add<Q, 1>>

type AtTerminus<A extends number, B extends number> = A extends 0
  ? true
  : B extends 0
    ? true
    : false

export type Equal<A extends number, B extends number> = A extends B
  ? B extends A
    ? true
    : false
  : false

export type LowerThan<A extends number, B extends number> =
  AtTerminus<A, B> extends true
    ? Equal<A, B> extends true
      ? false
      : A extends 0
        ? true
        : false
    : LowerThan<Subtract<A, 1>, Subtract<B, 1>>

export type Add<A extends number, B extends number> = Length<
  [...Tuple<A>, ...Tuple<B>]
>

export type Subtract<A extends number, B extends number> =
  Tuple<A> extends [...infer U, ...Tuple<B>] ? Length<U> : never

export type Multiply<A extends number, B extends number> = A extends 0
  ? 0
  : B extends 0
    ? 0
    : MultiAdd<A, B>

export type Divide<A extends number, B extends number> = B extends 0
  ? PositiveInfinity
  : MultiSub<A, B, 0>

export type Modulo<A extends number, B extends number> = B extends 0
  ? PositiveInfinity
  : LowerThan<A, B> extends true
    ? A
    : Modulo<Subtract<A, B>, B>
