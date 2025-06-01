import { is } from 'extensions'
import { Rectangle, type Shape } from 'classes/Shapes'
import type { Nullable } from 'types/util'
import { Vector2 } from 'classes/Vector'
import type { TileMap } from './types/TileMap'

const __errorNoInit = () => {
  throw new Error('Tile map is not initialised. Provide a map with `.setMap()`')
}

const initOrigin = (origin: Nullable<TileMap.Origin>) => {
  origin = origin ?? {}
  origin.x = origin.x ?? 0
  origin.y = origin.y ?? 0
  return origin as Vector2.Base
}

const defaultDrawTile = (tile: Shape | undefined) => {
  if (!tile) return
  switch (true) {
    case tile instanceof Rectangle:
      love.graphics.rectangle(
        'line',
        tile.origin.x,
        tile.origin.y,
        tile.width,
        tile.height
      )
      love.graphics.line(tile.diagonal(Rectangle.Diagonal.TLBR))
      love.graphics.line(tile.diagonal(Rectangle.Diagonal.BLTR))
      break
  }
}

export function createTileMap<
  GridWidth extends number,
  GridHeight extends number,
  CellWidth extends number,
  CellHeight extends number,
>(
  options: TileMap.Options<GridWidth, GridHeight, CellWidth, CellHeight>
): Readonly<TileMap<GridWidth, GridHeight, CellWidth, CellHeight, false>>

export function createTileMap<
  GridWidth extends number,
  GridHeight extends number,
  CellWidth extends number,
  CellHeight extends number,
  Map extends TileMap.LiteralGrid,
>(
  options: TileMap.Options<GridWidth, GridHeight, CellWidth, CellHeight, Map>
): Readonly<TileMap<GridWidth, GridHeight, CellWidth, CellHeight, true>>

export function createTileMap<
  GridWidth extends number,
  GridHeight extends number,
  CellWidth extends number,
  CellHeight extends number,
  Map extends Nullable<TileMap.LiteralGrid> = undefined,
  Init extends boolean = Map extends undefined ? false : true,
>(
  options: TileMap.Options<GridWidth, GridHeight, CellWidth, CellHeight, Map>
): Readonly<TileMap<GridWidth, GridHeight, CellWidth, CellHeight, Init>> {
  const { grid, cell, drawTile = defaultDrawTile } = options
  if (grid.height % cell.height !== 0)
    throw new Error(`Invalid height ratio`, {
      cause: { grid: grid.height, cell: cell.height },
    })
  if (grid.width % cell.width !== 0)
    throw new Error(`Invalid width ratio`, {
      cause: { grid: grid.width, cell: cell.width },
    })

  const origin = initOrigin(options.origin)
  const canvas = love.graphics.newCanvas(grid.width, grid.height)
  let init = !!options.map
  let map: Shape[][]

  const state = {
    init,
    grid,
    cell,
  } as TileMap.State<GridWidth, GridHeight, CellWidth, CellHeight>
  const tilemap = { state } as TileMap<
    GridWidth,
    GridHeight,
    CellWidth,
    CellHeight,
    Init
  >

  const XMAX = grid.width / cell.width
  const YMAX = grid.height / cell.height

  const render = () => {
    love.graphics.push()
    love.graphics.translate(origin.x, origin.y)
    love.graphics.draw(canvas)
    love.graphics.pop()
  }

  tilemap.render = __errorNoInit

  tilemap.setMap = input => {
    const str = is('array', input) ? input.flat().join('') : input
    if (str.length !== XMAX * YMAX)
      throw new Error('Invalid map proportions', { cause: input })

    let c
    map = []
    for (let y = 0; y < YMAX; y += 1) {
      map[y] = []
      for (let x = 0; x < XMAX; x += 1) {
        switch ((c = str[x + x * y])) {
          case ' ':
            continue
          case '#':
            map[y][x] = new Rectangle(
              cell.width,
              cell.height,
              new Vector2(x, y).scale(cell.width, cell.height)
            )
            continue
          default:
            throw new Error('Unknown tile character', { cause: c })
        }
      }
    }

    state.init = true
    tilemap.render = render

    return tilemap as Readonly<
      TileMap<GridWidth, GridHeight, CellWidth, CellHeight, true>
    >
  }

  tilemap.draw = () => {
    for (let y = 0; y < YMAX; y += 1)
      for (let x = 0; x < XMAX; x += 1) drawTile(map[y][x])
  }

  return tilemap
}
