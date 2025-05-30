import type { Handler, Remover } from 'engine/events'
import events from 'engine/events'
import { createView } from 'engine/view'
import { createPaddle } from 'entities/Paddle'
import * as winpos from 'winpos'

const game = () => {
  const [wWidth, wHeight] = love.graphics.getDimensions()
  const view = createView({ width: wWidth * 0.8, height: wHeight * 0.8 })
  const paddle = createPaddle({ view })
  let rm: Remover[] = []

  view.state.renderBox = true

  const panView: Handler<'mousemoved'> = (_x, _y, x, y) => {
    view.pan({ x, y })
  }

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
        events.addHandler('mousemoved', panView)
      },
      mousereleased: (x, y, button) => {
        if (button !== 3) return
        love.mouse.setRelativeMode(false)
        events.removeHandler('mousemoved', panView)
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
