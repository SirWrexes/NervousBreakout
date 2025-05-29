import { configureView } from 'configureView'
import * as winpos from 'winpos'

const zoomFactory = () => {
  let level = 0

  const calc = () => {
    if (level > 0) return 1 + level
    if (level < 0) return 1 / (-level + 1)
    return 1
  }

  return {
    update: (n: number) => {
      level += n
      return $multi(calc(), calc())
    },
    reset: () => {
      level = 0
      return $multi(0, 0)
    },
  }
}

const zoom = zoomFactory()

const view = configureView({
  width: 100,
  height: 100,
  renderBox: true,
})

love.load = () => {
  winpos.load()
}

love.focus = focus => {}

love.mousepressed = (_x, _y, button) => {
  if (button !== 3) return
  love.mouse.setRelativeMode(true)
  love.mousemoved = (_x, _y, x, y) => {
    view.pan({ x, y })
  }
}

love.mousereleased = (x, y, button) => {
  if (button !== 3) return
  love.mouse.setRelativeMode(false)
  delete love.mousemoved
}

love.wheelmoved = (x, y) => {
  const [zx, zy] = zoom.update(y)
  view.setScale({ x: zx, y: zy })
}

love.keyreleased = key => {
  if (key === 'r') love.event.quit('restart')
  if (key === 'q') love.event.quit()
  if (key === 'space') {
    zoom.reset()
    view.setScale({ x: 1, y: 1 })
  }
}

love.update = dt => {}

love.draw = () => {
  view.render()
  love.graphics.print(inspect(view.state), 10, 10)
}

love.quit = () => {
  winpos.save()
  return false
}
