import { Mouse, Window } from 'context'
import Paddle from 'Paddle'

let paddle: Paddle

love.load = () => {
  Mouse.init()
  Window.init()
  paddle = new Paddle()
}

love.update = dt => {
  Mouse.update()
  Window.update()
  paddle.update(dt)
}

love.draw = () => {
  paddle.draw()
}
