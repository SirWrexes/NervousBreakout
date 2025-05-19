import { Vector2 } from 'types/Vector'

export class Window {
  private static _instance: Window
  private _size: Vector2

  private constructor() {
    const [x, y] = love.graphics.getDimensions()
    this._size = new Vector2(x, y)
  }

  static get size() {
    return Window._instance._size
  }

  static init() {
    assert(!Window._instance, 'Mouse is already initialised')
    Window._instance = new Window()
  }

  static update() {
    const [x, y] = love.graphics.getDimensions()
    Window.size.set(x, y)
  }
}
