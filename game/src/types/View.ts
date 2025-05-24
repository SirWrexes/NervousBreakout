import type { Canvas } from 'love.graphics'
import type { RGBA } from 'love.math'

export class View {
  private _scale: number
  private _origin: Vector2
  private _dimensions: Vector2
  private _showBox: boolean
  private _canvas: Canvas
  private _bgColour: RGBA

  public draw: (this: View, ...args: never[]) => void

  constructor() {
    this._scale = 1
    this._origin = new Vector2()
    this._dimensions = new Vector2()
    this._showBox = false
    this._canvas = love.graphics.newCanvas()
    this._bgColour = [0, 0, 0, 1]
    this.draw = noop
  }

  setScale(factor: number) {
    this._scale = factor
    return this
  }

  setOrigin(x: number, y: number = x) {
    this._origin.set(x, y)
    return this
  }

  setDimensions(width: number, height: number = width) {
    this._dimensions.set(width, height)
    this._canvas = love.graphics.newCanvas(width, height)
    return this
  }

  setBackgroundColour(hex: string) {
    const [r, g, b, a] = hex.toRGB()
    this._bgColour[0] = r
    this._bgColour[1] = g
    this._bgColour[2] = b
    this._bgColour[3] = a
    return this
  }

  showBox(show: boolean) {
    this._showBox = show
    return this
  }

  render() {
    const [r, g, b, a] = love.graphics.getBackgroundColor()

    love.graphics.push()
    love.graphics.scale(this._scale)
    love.graphics.translate(this._origin.x, this._origin.y)
    love.graphics.setCanvas(this._canvas)
    love.graphics.setBackgroundColor(this._bgColour)

    this.draw()
    if (this._showBox)
      // prettier-ignore
      love.graphics.line(
        // top left to top right
        0                 , 0                 ,
        this._dimensions.x, 0                 ,

        // top right to bottom right
        this._dimensions.x, 0                 ,
        this._dimensions.x, this._dimensions.y,

        // bottom right to bottom left
        this._dimensions.x, this._dimensions.y,
        0,                  this._dimensions.y,

        // bottom left to top left
        0,                  this._dimensions.y,
        0                 , 0                 ,
      )

    love.graphics.setCanvas()
    love.graphics.setBackgroundColor(r, g, b, a)
    love.graphics.pop()

    love.graphics.draw(this._canvas)
  }
}
