import type { Event } from 'love.event'
import type { ExitStatus, Handler, HandlerTable } from './types'
import type { Nullable } from 'types/util'
import type { NoSelf } from 'types/functionlike'

/**
 * Command line arguments
 */
declare const arg: string[]

let delta = 0
let handlers: HandlerTable

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
      /**
       * Those parameters are typed like shit because of {@link IterableIterator} limiatations
       */
      for (const h of handlers[name]) (<NoSelf>h)(a, b, c, d, e, f)
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

/** @noSelf */
interface EventManager {
  addHandler: <E extends Event>(
    event: E,
    handler: Handler<E>
  ) => LuaMultiReturn<[EventManager, remove: () => void]>

  removeHandler: <E extends Event>(
    event: E,
    handler: Handler<E>
  ) => EventManager

  purgeHandlers: (event: Event) => EventManager

  push: typeof love.event.push
}

export const createEventManager = () => {
  if (handlers as Nullable<HandlerTable>)
    throw new Error('THERE CAN BE ONLY OOOOOOOOONEEEEE')

  handlers = {}
  const manager = {} as EventManager

  /** @noSelf */
  manager.addHandler = <E extends Event>(event: E, handler: Handler<E>) => {
    if (!handlers[event]) handlers[event] = []
    handlers[event].push(handler)

    return $multi(manager, () => {
      manager.removeHandler(event, handler)
    })
  }

  /** @noSelf */
  manager.removeHandler = <E extends Event>(event: E, handler: Handler<E>) => {
    if (handlers[event])
      handlers[event] = handlers[event].filter(
        h => h !== handler
      ) as HandlerTable[E]
    return manager
  }

  /** @noSelf */
  manager.purgeHandlers = (event: Event) => {
    delete handlers[event]
    return manager
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
