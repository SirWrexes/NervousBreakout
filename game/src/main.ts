import { Ball } from 'Ball'
import { Paddle } from 'Paddle'
import { Entities, InputState, Keyboard, Mouse, Window } from 'context'

love.load = () => {
  Window.init()
  Mouse.init()
  Keyboard.init()
  Entities.init(new Paddle())
  Entities.balls.push(new Ball())
}

let pause = false

love.update = dt => {
  if (Keyboard.button('q') === InputState.DOWN) love.event.quit()
  else if (Keyboard.button('r') === InputState.DOWN) love.event.quit('restart')
  else if (Keyboard.button('tab') === InputState.RELEASED) pause = !pause
  Mouse.update()
  Window.update()

  if (pause) return
  Entities.update(dt)
}

love.draw = () => {
  Entities.draw()
}
