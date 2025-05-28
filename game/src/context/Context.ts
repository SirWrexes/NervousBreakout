// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Context {
  protected static _instance: Context

  static init() {
    assert(!this._instance, `${this.name} is already initialised.`)
    this._instance = new this()
  }
}
