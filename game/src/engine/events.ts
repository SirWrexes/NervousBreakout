import type { Event } from 'love.event'
import type { ExitStatus, Handler, HandlerTable, Remover } from './types/events'
import type { Nullable } from 'types/util'
import type { NoSelf } from 'types/functionlike'
import { is } from 'extensions'

/**
 * Command line arguments
 */
declare const arg: string[]

declare module 'love.event' {
  function poll(): LuaIterable<LuaMultiReturn<[Event, ...any[]]>>
}

let delta = 0
let handlers: HandlerTable

/**
 * Actual event loop.
 * Roughly the same as the default event loop implementation. but instead of
 * using a single handler for each event, it uses an array in which multiple
 * handlers can be registered.
 */
const loop = () => {
  love.event.pump()

  for (const [name, a, b, c, d, e, f] of love.event.poll()) {
    if (name === 'quit')
      if (
        !handlers.quit
        || !handlers.quit.reduce((prev, curr) => prev || curr(), false)
      )
        return (a as ExitStatus) ?? 0
    if (handlers[name])
      for (const h of handlers[name]) (h as NoSelf)(a, b, c, d, e, f)
  }

  delta = love.timer.step()
  if (handlers.update) for (const update of handlers.update) update(delta)

  if (love.graphics.isActive()) {
    love.graphics.origin()
    love.graphics.clear(love.graphics.getBackgroundColor())
    if (handlers.draw) for (const draw of handlers.draw) draw()
    love.graphics.present()
  }

  love.timer.sleep(0.001)
}

type Batach = {
  [event in Event]?: Handler<event> | Handler<event>[]
}

/** @noSelf */
interface EventManager {
  /**
   * Add a handler.
   */
  on: <E extends Event>(
    event: E,
    handler: Handler<E>,
    removers?: Remover[]
  ) => Remover

  /**
   * Add a handler that will automatically remove itself after its first use.
   */
  once: <E extends Event>(event: E, handler: Handler<E>) => void

  /**
   * Add multiple handlers.
   */
  batch: (handlers: Batach, rm?: Remover[]) => Remover[]

  /**
   * Remove a given handler.
   */
  remove: <E extends Event>(event: E, handler: Handler<E>) => void

  /**
   * Remove all handlers for {@link event}.
   */
  purge: (event: Event) => void

  /**
   * Shorthand for calling {@link love.event.push}.
   */
  push: typeof love.event.push
}

export const createEventManager = () => {
  if (handlers as Nullable<HandlerTable>)
    throw new Error('THERE CAN BE ONLY OOOOOOOOONEEEEE')

  handlers = {}
  const manager = {} as EventManager

  /** @noSelf */
  manager.on = (event, handler, removers?) => {
    if (!handlers[event]) handlers[event] = []

    const rm = (() => {
      manager.remove(event, handler)
    }) as Remover
    handlers[event].push(handler)
    if (removers) removers.push(rm)

    return rm
  }

  /** @noSelf */
  manager.once = (event, handler) => {
    if (!handlers[event]) handlers[event] = []
    handlers[event].push(
      /** @noSelf */
      ((...params: any[]) => {
        handler(...(params as never[]))
        manager.remove(event, handler)
      }) as never
    )
  }

  /** @noSelf */
  manager.remove = (event, handler) => {
    if (handlers[event])
      handlers[event] = handlers[event].filter(h => h !== handler) as never
  }

  /** @noSelf */
  manager.purge = (event: Event) => {
    delete handlers[event]
  }

  /** @noSelf */
  manager.batch = (batch, removers) => {
    const finalRemovers = removers ?? []
    let addedHandlers: Handler[]
    let r = finalRemovers.length
    let a = 0

    for (const [event, addition] of batch as LuaPairsIterable<
      Event,
      Handler | Handler[]
    >) {
      if (!handlers[event]) handlers[event] = []
      if (is('function', addition)) {
        handlers[event].push(addition as never)
        finalRemovers[r++] = (() => {
          manager.remove(event, addition)
        }) as Remover
        continue
      }
      addedHandlers = []
      for (const handler of addition) {
        addedHandlers[a++] = handler
        finalRemovers[r++] = (() => {
          manager.remove(event, handler)
        }) as Remover
      }
      handlers[event] = handlers[event].concat(addedHandlers as never) as never
      a = 0
    }

    return finalRemovers
  }

  manager.push = love.event.push

  love.run = () => {
    if (handlers.load)
      for (const load of handlers.load)
        load(love.arg.parseGameArguments(arg), arg)
    love.timer.step() // Ignore load times
    delta = 0
    return loop
  }

  return manager
}

const events = createEventManager()

export * from './types/events'
export default events
