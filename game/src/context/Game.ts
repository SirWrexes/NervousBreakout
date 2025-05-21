export class Game {
  private static _instance: Game
  private _pause: boolean

  private constructor() {
    this._pause = false
  }

  static init() {
    assert(!this._instance, `${this.name} is already initialised`)
    this._instance = new this()
  }

  static get pause() {
    return this._instance._pause
  }

  static set pause(p) {
    this._instance._pause = p
  }
}
