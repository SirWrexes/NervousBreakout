import { Mouse } from 'context'
import { dispatch, getState } from 'experiments/store'

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

love.load = () => {
  Mouse.init()
}

love.focus = focus => {}

love.wheelmoved = (x, y) => {
  if (Mouse.is('DOWN', 1)) dispatch({ type: 'left/add', payload: y })
  if (Mouse.is('DOWN', 2)) dispatch({ type: 'right/add', payload: y })
}

love.update = dt => {}

love.draw = () => {
  love.graphics.print(inspect(getState()), 10, 10)
}

love.quit = () => {
  winpos.save()
  return false
}
