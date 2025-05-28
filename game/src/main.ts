import { Game, Mouse, Keyboard, Entities, Window } from 'context'
import type { Ball } from 'types/Ball'
import type { Rectangle } from 'types/Shapes'

declare let bfr: Rectangle

const winpos = {
  load: () => {
    const [chunk, e] = love.filesystem.load('winpos.lua')

    if (!chunk) {
      print(e)
      return
    }

    const winpos = chunk() as number[] | undefined
    if (!winpos) return
    love.window.setPosition(winpos[0], winpos[1], winpos[2])
  },
  save: () =>
    love.filesystem.write(
      'winpos.lua',
      `return  ${inspect(love.window.getPosition())}`
    ),
} as const

let ball: Ball

love.load = () => {
  winpos.load()
  Keyboard.init()
  Mouse.init()
  Window.init()
}

love.focus = focus => {
  if (!focus) Game.pause = true
}

love.update = dt => {
  Keyboard.update()
  Mouse.update()
  if (Keyboard.is('DOWN', 'q')) love.event.quit()
  if (Keyboard.is('DOWN', 'r')) love.event.quit('restart')
  if (Keyboard.is('RELEASED', 'tab')) Game.pause = !Game.pause
  if (Game.pause) return
}

love.draw = () => {
  love.graphics.rectangle(
    'line',
    bfr.origin.x,
    bfr.origin.y,
    bfr.width,
    bfr.height
  )
  Entities.draw()
  ball.draw()
  if (Game.pause) {
    love.graphics.scale(1.5)
    love.graphics.print('PAUSED', 150, 5)
    love.graphics.scale(1)
  }
}

love.quit = () => {
  winpos.save()
  return false
}
