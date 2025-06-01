import type { Shape } from 'classes/Shapes'
import type { OnlyPositive, NonZero } from 'types/arithmetics'
import type { Nullable } from 'types/util'
import type { Drawable, Renderable } from './graphics'

export namespace TileMap {
  export interface CellSize<W extends number, H extends number> {
    width: OnlyPositive<NonZero<W>>
    height: OnlyPositive<NonZero<H>>
  }

  export interface GridSize<W extends number, H extends number> {
    width: OnlyPositive<NonZero<W>>
    height: OnlyPositive<NonZero<H>>
  }

  export interface Origin {
    x?: number
    y?: number
  }

  export type LiteralCell = ' ' | '#'
  export type LiteralGrid = LiteralCell[][] | string

  export interface Options<
    GridWidth extends number = number,
    GridHeight extends number = number,
    CellWidth extends number = number,
    CellHeight extends number = number,
    Map extends Nullable<TileMap.LiteralGrid> = undefined,
  > {
    grid: TileMap.GridSize<GridWidth, GridHeight>
    cell: TileMap.CellSize<CellWidth, CellHeight>
    map?: Map
    origin?: TileMap.Origin
    drawTile?: (tile: Shape | undefined) => void
  }

  export interface BaseState<
    GridWidth extends number,
    GridHeight extends number,
    CellWidth extends number,
    CellHeight extends number,
  > {
    grid: TileMap.GridSize<GridWidth, GridHeight>
    cell: TileMap.CellSize<CellWidth, CellHeight>
  }

  export namespace State {
    export interface Uninitialised<
      GridWidth extends number,
      GridHeight extends number,
      CellWidth extends number,
      CellHeight extends number,
    > extends BaseState<GridWidth, GridHeight, CellWidth, CellHeight> {
      init: false
      map: undefined
    }

    export interface Initialised<
      GridWidth extends number,
      GridHeight extends number,
      CellWidth extends number,
      CellHeight extends number,
    > extends BaseState<GridWidth, GridHeight, CellWidth, CellHeight> {
      init: true
      map: Shape[][]
    }
  }

  export type State<
    GridWidth extends number = number,
    GridHeight extends number = number,
    CellWidth extends number = number,
    CellHeight extends number = number,
    Init extends boolean = boolean,
  > = Init extends true
    ? State.Initialised<GridWidth, GridHeight, CellWidth, CellHeight>
    : State.Uninitialised<GridWidth, GridHeight, CellWidth, CellHeight>
}

export interface TileMap<
  GridWidth extends number,
  GridHeight extends number,
  CellWidth extends number,
  CellHeight extends number,
  Init extends boolean,
> extends Drawable,
    Renderable {
  state: TileMap.State<GridWidth, GridHeight, CellWidth, CellHeight, Init>
  setMap: (
    map: TileMap.LiteralGrid
  ) => TileMap<GridWidth, GridHeight, CellWidth, CellHeight, true>
}
