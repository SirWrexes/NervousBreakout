import { Vector2 } from 'types/Vector'

export class Window {
  private static _instance: Window
  private _size: Vector2

  private constructor() {
    const [x, y] = love.graphics.getDimensions()
    this._size = new Vector2(x, y)
  }

  static get size() {
    return this._instance._size
  }

  static init() {
    assert(!this._instance, `${this.name} is already initialised`)
    this._instance = new Window()
  }

  static update() {
    const [x, y] = love.graphics.getDimensions()
    this.size.set(x, y)
  }
}
