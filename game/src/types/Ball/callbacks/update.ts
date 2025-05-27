import { Rectangle } from 'types/Shapes'
import type { Ball } from '..'
import { Entities, Mouse, Window } from 'context'

function out(this: Ball) {
  if (!Mouse.is('RELEASED', 1)) return
  this.thrown = false
  this.out = false
  this.velocity.set(this.speed)
  this._update = update
}

declare const bfr: Rectangle

let targets: Rectangle[]

function thrown(this: Ball, dt: number) {
  let next = this.getNextPosition(dt)
  if (next.y + this.radius >= Window.height) {
    this.out = true
    this._update = out
    return
  }

  let ray: Vector2
  let overlap: number
  for (const target of targets) {
    ;[ray, overlap] = this.getCollisionData(next, target)
    if (overlap === 0) continue
    next = this.resolveCollision(next, ray, overlap)
  }

  this.origin.copy(next)
  return
}

function update(this: Ball) {
  if (Mouse.is('RELEASED', 1)) {
    this.thrown = true
    this._update = thrown
    return
  }

  this.origin.set(
    Entities.paddle.centre.x,
    Entities.paddle.centre.y - this.diameter
  )
  this.angle = this.centre.angle(Mouse.position)
}

function init(this: Ball) {
  // XXX
  {
    targets = [
      new Rectangle(
        Window.width,
        Window.height,
        new Vector2(0, -Window.height)
      ),
      new Rectangle(Window.width, Window.height, new Vector2(-Window.width, 0)),
      new Rectangle(Window.width, Window.height, new Vector2(Window.width, 0)),
      bfr,
      Entities.paddle,
    ]
  }

  this._update = update
}

export { init as update }
