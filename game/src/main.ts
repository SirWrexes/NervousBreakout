import { Ball } from 'Ball'
import { Paddle } from 'Paddle'
import * as ctx from 'context'
import { Rectangle } from 'types/Shapes'

declare let bfr: Rectangle

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
  bfr = new Rectangle(
    ctx.Window.width * 0.5,
    ctx.Window.height * 0.5,
    new Vector2(ctx.Window.width * 0.25, ctx.Window.height * 0.1)
  )
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
  love.graphics.rectangle(
    'line',
    bfr.origin.x,
    bfr.origin.y,
    bfr.width,
    bfr.height
  )
  ctx.Entities.draw()
}

love.quit = () => {
  love.filesystem.write(
    'winpos.lua',
    `return  ${inspect(love.window.getPosition())}`
  )
  return false
}
