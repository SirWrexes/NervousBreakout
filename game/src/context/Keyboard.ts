import type { KeyConstant } from 'love.keyboard'
import { InputState } from 'types'

export class Keyboard {
  private static _instance: Keyboard
  private _keys: Partial<Record<KeyConstant, InputState>>

  private constructor() {
    this._keys = {}
  }

  static init() {
    assert(!Keyboard._instance, 'Mouse is already initialised')
    Keyboard._instance = new Keyboard()
  }

  static update() {}

  static button(key: KeyConstant) {
    const down = love.keyboard.isDown(key)

    switch (true) {
      case down:
        return (Keyboard._instance._keys[key] = InputState.DOWN)
      case Keyboard._instance._keys[key] === InputState.DOWN:
        return (Keyboard._instance._keys[key] = InputState.RELEASED)
      default:
        return (Keyboard._instance._keys[key] = InputState.UP)
    }
  }
}
