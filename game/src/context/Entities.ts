import type { Ball } from 'Ball'
import type { Paddle } from 'Paddle'

export class Entities {
  private static _instance: Entities
  private _paddle: Paddle
  private _balls: Ball[]

  private constructor(paddle: Paddle) {
    this._paddle = paddle
    this._balls = []
  }

  static get paddle() {
    return Entities._instance._paddle
  }

  static get balls() {
    return Entities._instance._balls
  }

  static init(paddle: Paddle) {
    assert(!Entities._instance, 'Entities is already initialised')
    Entities._instance = new Entities(paddle)
  }

  static update(dt: number) {
    Entities._instance._paddle.update(dt)
    Entities._instance._balls.forEach(ball => {
      ball.update(dt)
    })
  }

  static draw() {
    Entities._instance._paddle.draw()
    Entities._instance._balls.forEach(ball => {
      ball.draw()
    })
  }
}
