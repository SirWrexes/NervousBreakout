import type { Handlers } from 'love-typescript-definitions/typings/love/handlers'
import type { Event } from 'love.event'

export type EventParams<E extends Event = Event> = Parameters<Handlers[E] & {}>

export type PollReturn = {
  [E in Event]: LuaMultiReturn<[E, ...EventParams<E>]>
}

declare module 'love.event' {
  function poll(): LuaIterable<LuaMultiReturn<[Event, ...any[]]>>
}
