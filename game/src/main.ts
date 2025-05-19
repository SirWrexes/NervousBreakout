import { Ball } from 'Ball'
import { Paddle } from 'Paddle'
import { Entities, Keyboard, Mouse, Window } from 'context'

love.load = () => {
  Window.init()
  Mouse.init()
  Keyboard.init()
  Entities.init(new Paddle())
  Entities.balls.push(new Ball())
}

love.update = dt => {
  Mouse.update()
  Window.update()
  Entities.update(dt)
}

love.draw = () => {
  Entities.draw()
}
