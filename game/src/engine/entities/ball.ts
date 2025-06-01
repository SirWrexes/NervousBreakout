import type { Vector2 } from 'classes/Vector'
import type { Renderable } from 'engine/types/graphics'
import type { View } from 'engine/view'
import type { Circle } from 'types/shapes'

export namespace Ball {
  export interface State {
    /** From centre to mouse */
    angle: number
    out: boolean
    thrown: boolean
  }

  export interface Options {
    view: View
    radius?: number
    origin?: Vector2
    speed?: number
  }
}

interface Ball extends Circle, Renderable {
  state: Ball.State
}

export const createBall = (options: Ball.Options): Readonly<Ball> => {
  const state = {} as Ball.State
  const ball = { state } as Ball

  return ball
}
