import { Game, Window, Mouse, Keyboard, Entities } from 'context'
import { Paddle } from 'Paddle'
import { Ball } from 'types/Ball'
import { Rectangle } from 'types/Shapes'

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

  Game.init()
  Window.init()
  Mouse.init()
  Keyboard.init()

  bfr = new Rectangle(
    Window.width * 0.5,
    Window.height * 0.5,
    new Vector2(Window.width * 0.25, Window.height * 0.1)
  )

  Entities.init(new Paddle())
  ball = new Ball()
}

love.focus = focus => {
  Game.pause = !focus
}

love.update = dt => {
  Keyboard.update()
  Mouse.update()
  if (Keyboard.is('DOWN', 'q')) love.event.quit()
  if (Keyboard.is('DOWN', 'r')) love.event.quit('restart')
  if (Keyboard.is('RELEASED', 'tab')) Game.pause = !Game.pause
  if (Game.pause) return
  Entities.update(dt)
  ball.update(dt)
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
