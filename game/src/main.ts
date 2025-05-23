import { Ball } from 'Ball'
import { Paddle } from 'Paddle'
import * as ctx from 'context'
import { TileMap } from 'types/TileMap'

// prettier-ignore
const rawmap = // =>
'\
#####\
#   #\
# o #\
#   #\
#####\
'

const tiles = new TileMap(5, 5, rawmap, 50)

love.load = () => {
  const [chunk, _err] = love.filesystem.load('winpos.lua')
  if (chunk) {
    const winpos = chunk() as number[]
    love.window.setPosition(winpos[0], winpos[1], winpos[2])
  }
  ctx.Game.init()
  ctx.Window.init()
  ctx.Mouse.init()
  ctx.Keyboard.init()
  ctx.Entities.init(new Paddle())
  ctx.Entities.balls.push(new Ball())
}

love.update = dt => {
  ctx.Keyboard.update()
  ctx.Mouse.update()
  if (ctx.Keyboard.is('DOWN', 'q')) love.event.quit()
  if (ctx.Keyboard.is('DOWN', 'r')) love.event.quit('restart')
  if (ctx.Keyboard.is('RELEASED', 'tab')) ctx.Game.pause = !ctx.Game.pause
  if (ctx.Game.pause) return
  ctx.Entities.update(dt)
}

love.draw = () => {
  ctx.Entities.draw()
}

love.quit = () => {
  love.filesystem.write(
    'winpos.lua',
    `return  ${inspect(love.window.getPosition())}`
  )
  return false
}
