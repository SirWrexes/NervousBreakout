import type { Handlers } from 'love-typescript-definitions/typings/love/handlers'
import type { Event } from 'love.event'
import type { Tagged } from 'type-fest'
import type { NoopLike, NoSelf } from 'types/functionlike'
import type { Nullable } from 'types/util'

export type Handler<Name extends Event = Event> = NoSelf<Handlers[Name] & {}>

export type HandlerTable = {
  [name in Event]?: Handler<name>[]
}

export type HandlerParams<E extends Event = Event> = Parameters<
  Handlers[E] & {}
>

/**
 * I *think* this is what the `a` in the demonstration of {@link love.run}
 * is supposed to be. But I really have no idea.
 *
 * Either way, it should work.
 *
 * @see https://love2d.org/wiki/love.run
 */
export type ExitStatus = Nullable<number | 'restart'>

export type Remover = Tagged<NoopLike, 'Events.Remover'>

export type { Event, Handlers }
