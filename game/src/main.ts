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
' as const

const tiles = new TileMap(5, 5, rawmap, 50)

love.load = () => {
  ctx.Game.init()
  ctx.Window.init()
  ctx.Mouse.init()
  ctx.Keyboard.init()
}

love.wheelmoved = (_x, y) => {
  tiles.zoom += y
}

love.update = dt => {
  ctx.Keyboard.update()
  ctx.Mouse.update()
  if (ctx.Keyboard.is('DOWN', 'q')) love.event.quit()
  if (ctx.Keyboard.is('DOWN', 'r')) love.event.quit('restart')
  if (ctx.Keyboard.is('RELEASED', 'tab')) ctx.Game.pause = !ctx.Game.pause
  if (ctx.Keyboard.is('RELEASED', 'space')) tiles.zoom = 0

  tiles.update(dt)
}

love.draw = () => {
  tiles.draw()
}
