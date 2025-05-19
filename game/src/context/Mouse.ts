import { Vector2 } from 'types/Vector'

export class Mouse {
  private static _instance: Mouse
  private _position: Vector2

  private constructor() {
    const [x, y] = love.graphics.getDimensions()
    this._position = new Vector2(x, y)
  }

  static get position() {
    return Mouse._instance._position
  }

  static init() {
    assert(!Mouse._instance, 'Mouse is already initialised')
    Mouse._instance = new Mouse()
  }

  static update() {
    const [x, y] = love.mouse.getPosition()
    Mouse.position.set(x, y)
  }
}
