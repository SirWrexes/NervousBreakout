import { is } from 'extensions'
import type { Shape } from 'types/Shapes'
import { Rectangle } from 'types/Shapes'
import type { Nullable } from 'types/util'
import { Vector2 } from 'types/Vector'
import * as winpos from 'winpos'
interface WH {
  width: number
  height: number
}

enum Tile {
  '.',
  '#',
  'o',
}

const createTileFactory = (displaySize: WH, cellSize: WH) => {
  assert(
    displaySize.width % cellSize.width === 0,
    'Cell width is not an exact denominator of display width'
  )
  assert(
    displaySize.height % cellSize.height === 0,
    'Cell height is not an exact denominator of display height'
  )

  return (tile: string, x: number, y: number) => {
    switch (tile) {
      case Tile[Tile['#']]:
      case Tile[Tile['o']]:
        return new Rectangle(
          cellSize.width,
          cellSize.height,
          new Vector2(x * cellSize.width, y * cellSize.height)
        )
      case Tile[Tile['.']]:
        return undefined
      default:
        throw `Unrecognised tile character: [${tile}]`
    }
  }
}

const creatTileMapFactory = (
  displaySize: WH,
  cellSize: WH,
  drawTile?: (tile: Nullable<Shape>) => void
) => {
  const YMAX = displaySize.height / cellSize.height
  const XMAX = displaySize.width / cellSize.height

  const createTile = createTileFactory(displaySize, cellSize)
  const flattenInput = (
    template: TemplateStringsArray | string,
    ...vars: unknown[]
  ) => {
    const joint = is('string', template)
      ? template
      : string.joinTemplate(template, ...vars)
    const flat = joint.gsub('%s', '')[0]
    if (flat.length !== XMAX * YMAX)
      throw (
        "Map doesn't respect expected proportions.\n"
        + `x: ${XMAX} y: ${YMAX}\n`
        + joint
      )
    return flat
  }

  drawTile =
    drawTile
    ?? ((tile: Nullable<Shape>) => {
      switch (true) {
        case tile instanceof Rectangle: {
          const [xtl, ytl] = tile.corner('topleft')
          const [xbl, ybl] = tile.corner('botleft')
          const [xtr, ytr] = tile.corner('topright')
          const [xbr, ybr] = tile.corner('botright')

          love.graphics.rectangle(
            'line',
            tile.origin.x,
            tile.origin.y,
            tile.width,
            tile.height
          )
          love.graphics.line(xtl, ytl, xbr, ybr)
          love.graphics.line(xbl, ybl, xtr, ytr)
          break
        }
      }
    })

  return (template: TemplateStringsArray | string) => {
    let zoomLevel = 0
    let scaleFactor = 1
    const origin = new Vector2()
    const canvas = love.graphics.newCanvas()
    const map: Nullable<Rectangle>[][] = []
    const str = flattenInput(template)

    let i = 0
    for (let y = 0; y < YMAX; y += 1) {
      map[y] = []
      for (let x = 0; x < XMAX; x += 1) map[y][x] = createTile(str[i++], x, y)
    }

    const getState = () => ({
      zoomLevel,
      scaleFactor,
      origin: origin.clone(),
    })

    const scale = (n: number) => {
      zoomLevel += n
      if (zoomLevel >= 1) scaleFactor = 1 + zoomLevel
      if (zoomLevel === 0) scaleFactor = 1
      if (zoomLevel < 0) scaleFactor = 1 / (-zoomLevel + 1)
    }

    const pan = (x: number, y: number) => {
      origin.add(x, y)
    }

    const update = (dt?: number) => {
      love.graphics.setCanvas(canvas)
      love.graphics.clear()
      for (let y = 0; y < YMAX; y += 1)
        for (let x = 0; x < XMAX; x += 1) drawTile(map[y][x])
      love.graphics.setCanvas()
    }

    const draw = () => {
      love.graphics.push()
      love.graphics.translate(origin.x, origin.y)
      love.graphics.scale(scaleFactor)
      love.graphics.draw(canvas)
      love.graphics.pop()
    }

    return {
      getState,
      pan,
      scale,
      map,
      update,
      draw,
    }
  }
}

const buildTileMap = creatTileMapFactory(
  { width: 100, height: 100 },
  { width: 20, height: 20 }
)

const { map, getState, pan, scale, update, draw } = buildTileMap`
  #####
  #...#
  #.#.#
  #...#
  #####
`

love.load = () => {
  winpos.load()
  update()
}

love.focus = focus => {}

love.mousepressed = (_x, _y, button) => {
  if (button !== 3) return
  love.mouse.setRelativeMode(true)
  love.mousemoved = (_x, _y, dx, dy) => {
    pan(dx, dy)
  }
}

love.wheelmoved = (_x, y) => {
  scale(y)
}

love.keyreleased = key => {
  if (key === 'r') love.event.quit('restart')
  if (key === 'q') love.event.quit()
}

love.mousereleased = (x, y, button) => {
  if (button === 3) {
    delete love.mousemoved
    love.mouse.setRelativeMode(false)
  }
}

love.update = dt => {}

love.draw = () => {
  draw()
  love.graphics.print(inspect(getState()), 10, 10)
}

love.quit = () => {
  winpos.save()
  return false
}
