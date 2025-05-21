import type { KeyConstant } from 'love.keyboard'
import * as t from 'types'

interface Key {
  update: boolean
  state: t.InputState
}

export class Keyboard {
  private static _instance: Keyboard
  private _keys: Partial<Record<KeyConstant, Key>>

  private constructor() {
    this._keys = {}
  }

  static init() {
    assert(!this._instance, `${this.name} is already initialised`)
    this._instance = new Keyboard()
  }

  static update() {
    for (const key in this._instance._keys)
      this._instance._keys[key as KeyConstant]!.update = true
  }

  static button(name: KeyConstant) {
    const key =
      this._instance._keys[name]
      ?? (this._instance._keys[name] = { update: true } as Key)

    if (key.update) {
      switch (true) {
        case love.keyboard.isDown(name):
          key.state = t.InputState.DOWN
          break
        case key.state === t.InputState.DOWN:
          key.state = t.InputState.RELEASED
          break
        default:
          key.state = t.InputState.UP
          key.update = false
          break
      }
      return key.state
    }
  }

  static is(state: keyof typeof t.InputState, key: KeyConstant) {
    return this.button(key) === t.InputState[state]
  }
}
