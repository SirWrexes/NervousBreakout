import type { Remover } from 'engine/events'
import events from 'engine/events'
import * as winpos from 'winpos'
import { Ball, Paddle, World } from 'engine'
import { glsl, is } from 'extensions'

const game = () => {
  const [width, height] = love.graphics.getDimensions()
  const world = new World({ width, height })
  const paddle = new Paddle({ world })
  const ball = new Ball({ world, paddle })
  let panning = false
  let rm: Remover[] = []

  world.renderBox = true
  world.mouse.crosshair = true

  const start = () => {
    rm = events.batch({
      mousepressed: (x, y, button) => {
        if (button !== 3) return
        love.mouse.setRelativeMode(true)
        panning = true
      },
      mousereleased: (x, y, button) => {
        if (button !== 3) return
        love.mouse.setRelativeMode(false)
        panning = false
      },
      mousemoved: (_x, _y, x, y) => {
        if (panning) world.pan(x, y)
      },
      wheelmoved: (_x, y) => {
        const factor = love.keyboard.isDown('lctrl') ? -100 : -10
        if (love.keyboard.isDown('lshift')) world.pan(y * factor, 0)
        else world.pan(0, y * factor)
      },
    })
  }

  const stop = () => {
    for (const unsub of rm) unsub()
  }

  return {
    world,
    start,
    stop,
  }
}

const { start, stop } = game()

events.batch({
  load: () => {
    winpos.load()
    start()
  },
  quit: () => {
    stop()
    winpos.save()
    return false
  },
  keypressed: key => {
    if (key === 'q') love.event.quit()
    if (key === 'r') love.event.quit('restart')
  },
})

if (__DEBUG) {
  const textColour = 'f08000'.toRGB()
  const gridShader = love.graphics.newShader(glsl`
    vec4 effect(vec4 color, Image tex, vec2 texture_coords, vec2 screen_coords) {
      return vec4(${'cecece50'.toRGB().join(',')});
    }
  `)
  const [ww, wh] = love.graphics.getDimensions()
  const grid = love.graphics.newCanvas(ww, wh)
  grid.renderTo(() => {
    const dot = (x: number, y: number) => {
      love.graphics.circle('fill', x, y, x % 100 === 0 && y % 100 === 0 ? 3 : 1)
    }

    love.graphics.setShader(gridShader)
    for (const y of $range(0, wh, 10))
      for (const x of $range(0, ww, 10)) dot(x, y)
    for (const y of $range(0, wh, 10))
      for (const x of $range(0, ww, 10)) dot(x, y)
    love.graphics.setShader()
  })

  events.batch({
    draw: () => {
      love.graphics.draw(grid)
      love.graphics.print([
        textColour,
        inspect(__DEBUG[__DPart], {
          process: (item, path) => {
            if (
              path.length === 2
              && path[1] === inspect.KEY
              && path[0] === __DPart
            )
              return
            if (is('number', item)) return math.roundn(item, 2)
            return item
          },
        }),
      ])
    },
  })
}
