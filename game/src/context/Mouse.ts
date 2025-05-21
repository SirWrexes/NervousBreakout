import { InputState, Vector2 } from 'types'

type MouseButton =
  /** Left click */
  | 1
  /** Right click */
  | 2
  /** Mouse wheel click */
  | 3
  | (number & {})

export class Mouse {
  private static _instance: Mouse
  private _position: Vector2
  private _buttons: Partial<Record<MouseButton, InputState>>

  private constructor() {
    const [x, y] = love.graphics.getDimensions()
    this._position = new Vector2(x, y)
    this._buttons = {}
  }

  static get position() {
    return this._instance._position
  }

  static init() {
    assert(!this._instance, `${this.name} is already initialised`)
    this._instance = new this()
  }

  static update() {
    const [x, y] = love.mouse.getPosition()
    this.position.set(x, y)
  }

  static button(n: MouseButton) {
    const down = love.mouse.isDown(n)

    switch (true) {
      case down:
        return (this._instance._buttons[n] = InputState.DOWN)
      case this._instance._buttons[n] === InputState.DOWN:
        return (this._instance._buttons[n] = InputState.RELEASED)
      default:
        return (this._instance._buttons[n] = InputState.UP)
    }
  }
}
