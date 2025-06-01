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

type BatchOperation = {
  [event in Event]?: Handler<event> | Handler<event>[]
}

interface Batch {
  add?: BatchOperation
  remove?: BatchOperation
}

/** @noSelf */
interface EventManager {
  addHandler: <E extends Event>(
    event: E,
    handler: Handler<E>,
    removers?: Remover[]
  ) => Remover

  removeHandler: <E extends Event>(event: E, handler: Handler<E>) => void

  purgeHandlers: (event: Event) => void

  batchAdd: (handlers: BatchOperation, rm?: Remover[]) => Remover[]

  batchRemove: (handlers: BatchOperation) => void

  batch: (handlers: Batch) => Remover[]

  push: typeof love.event.push
}

export const createEventManager = () => {
  if (handlers as Nullable<HandlerTable>)
    throw new Error('THERE CAN BE ONLY OOOOOOOOONEEEEE')

  handlers = {}
  const manager = {} as EventManager

  /** @noSelf */
  manager.addHandler = (event, handler, removers?) => {
    if (!handlers[event]) handlers[event] = []

    const rm = (() => {
      manager.removeHandler(event, handler)
    }) as Remover
    handlers[event].push(handler)
    if (removers) removers.push(rm)

    return rm
  }

  /** @noSelf */
  manager.removeHandler = (event, handler) => {
    if (handlers[event])
      handlers[event] = handlers[event].filter(h => h !== handler) as never
  }

  /** @noSelf */
  manager.purgeHandlers = (event: Event) => {
    delete handlers[event]
  }

  /** @noSelf */
  manager.batchAdd = (batch, removers) => {
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
          manager.removeHandler(event, addition)
        }) as Remover
        continue
      }
      addedHandlers = []
      for (const handler of addition) {
        addedHandlers[a++] = handler
        finalRemovers[r++] = (() => {
          manager.removeHandler(event, handler)
        }) as Remover
      }
      handlers[event] = handlers[event].concat(addedHandlers as never) as never
      a = 0
    }

    return finalRemovers
  }

  /** @noSelf */
  manager.batchRemove = batch => {
    for (const [event, removal] of batch as LuaPairsIterable<
      Event,
      Handler | Handler[]
    >) {
      if (!handlers[event]) continue
      if (is('function', removal)) {
        manager.removeHandler(event, removal)
        continue
      }
      handlers[event] = handlers[event].filter(h => {
        for (const rm of removal) if (h === rm) return false
        return true
      }) as never
    }
  }

  manager.batch = batch => {
    if (batch.remove) manager.batchRemove(batch.remove)
    if (batch.add) return manager.batchAdd(batch.add)
    return []
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
