import events from "engine/events"

declare global {
  interface CustomHandlers {
    ['ball:update'](dt?: number): void
  }
}

events.addHandler('update', dt => {
  events.push('ball:update', dt)
})
