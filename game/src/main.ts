import type { Remover } from 'engine/events'
import events from 'engine/events'
import * as winpos from 'winpos'
import { Ball, Paddle, World } from 'engine'

const game = () => {
  const [wWidth, wHeight] = love.graphics.getDimensions()
  const world = new World({
    width: wWidth * 0.8,
    height: wHeight * 0.8,
  })
  const paddle = new Paddle({ world })
  const ball = new Ball({ world, paddle })
  let panning = false
  let rm: Remover[] = []

  world.renderBox = true

  const start = () => {
    rm = events.batchAdd({
      mousepressed: (x, y, button) => {
        if (button !== 3) return
        love.mouse.setRelativeMode(true)
        panning = true
      },
      mousereleased: (x, y, button) => {
        if (button !== 3) return
        love.mouse.setRelativeMode(false)
        panning = false
      },
      mousemoved: (_x, _y, x, y) => {
        if (panning) world.pan(x, y)
      },
    })
  }

  const stop = () => {
    for (const unsub of rm) unsub()
  }

  return {
    start,
    stop,
  }
}

const { start, stop } = game()

events.batchAdd({
  load: () => {
    winpos.load()
    start()
  },
  quit: () => {
    stop()
    winpos.save()
    return false
  },
  keypressed: key => {
    if (key === 'q') love.event.quit()
    if (key === 'r') love.event.quit('restart')
  },
})
