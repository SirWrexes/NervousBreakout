import type { Remover } from 'engine/events'
import events from 'engine/events'
import { createView } from 'engine/view'
import { createPaddle } from 'engine/entities/paddle'
import * as winpos from 'winpos'

const game = () => {
  const [wWidth, wHeight] = love.graphics.getDimensions()
  const view = createView({
    width: wWidth,
    height: wHeight,
  })
  const paddle = createPaddle({ view })
  let panning = false
  let rm: Remover[] = []

  view.state.renderBox = true

  const start = () => {
    rm = events.batchAdd({
      draw: () => {
        view.startDrawing()
        love.graphics.print(
          inspect({ ...paddle.state, cos: math.cos(paddle.state.angle) })
        )
        paddle.render()
        view.stopDrawing()
        view.render()
      },
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
        if (panning) view.pan({ x, y })
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
