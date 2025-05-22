import * as t from 'types'

interface Button {
  update: boolean
  state: t.InputState
}

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
  private _position: t.Vector2
  private _buttons: Partial<Record<MouseButton, Button>>

  private constructor() {
    const [x, y] = love.graphics.getDimensions()
    this._position = new t.Vector2(x, y)
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
    for (const button in this._instance._buttons)
      this._instance._buttons[button as unknown as number]!.update = true
  }

  static get(n: MouseButton) {
    const button =
      this._instance._buttons[n]
      ?? (this._instance._buttons[n] = { update: true } as Button)

    switch (true) {
      case love.mouse.isDown(n):
        button.state = t.InputState.DOWN
        break
      case button.state === t.InputState.DOWN:
        button.state = t.InputState.RELEASED
        break
      default:
        button.state = t.InputState.UP
        break
    }
    button.update = false
    return button.state
  }

  static is(state: keyof typeof t.InputState, button: number) {
    return this.get(button) === t.InputState[state]
  }
}
