import { Rectangle } from 'types/Shapes'
import { Vector2 } from 'types/Vector'

export class Window extends Rectangle {
  private static _instance: Window

  private constructor() {
    const [width, height] = love.graphics.getDimensions()
    super(width, height, new Vector2())
  }

  static init() {
    assert(!this._instance, `${this.name} is already initialised`)
    this._instance = new Window()
  }

  static update() {
    const [x, y] = love.graphics.getDimensions()
    this._instance._size.set(x, y)
  }

  static get origin() {
    return this._instance.origin
  }

  static get width() {
    return this._instance.width
  }

  static get height() {
    return this._instance.height
  }
}
