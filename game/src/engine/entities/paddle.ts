import type { Rectangle } from 'types/shapes'
import { Vector2 } from 'classes/Vector'
import type { View } from 'engine/view'
import type { NoopLike } from 'types/functionlike'
import type { Destroyable } from 'engine/types/destroyable'
import events from 'engine/events'

namespace Paddle {
  export interface Options {
    view: View
    width?: number
    height?: number
    origin?: Vector2
    speed?: number
  }

  export interface State extends Rectangle {
    velocity: Vector2
    /** From center to mouse */
    angle: number
    /** From center to mouse */
    distance: number
    frozen: boolean
  }
}

interface Paddle extends Destroyable {
  state: Paddle.State
  render: NoopLike
}

export const createPaddle = ({
  view,
  width = 120,
  height = 10,
  speed = 300,
  origin = new Vector2(0, view.state.height - height * 3),
}: Paddle.Options): Readonly<Paddle> => {
  const unsubs: NoopLike[] = []
  const velocity = new Vector2()
  const centre = new Vector2()

  const state: Paddle.State = {
    width,
    height,
    angle: 0,
    distance: 0,
    velocity,
    origin,
    centre,
    frozen: true,
  }

  const paddle = { state } as Paddle

  paddle.destroy = () => {
    for (const unsub of unsubs) unsub()
  }

  paddle.render = () => {
    love.graphics.rectangle('fill', origin.x, origin.y, width, height)
  }

  events.batchAdd({
    keypressed: key => {
      if (key === 'space') state.frozen = true
    },
    keyreleased: key => {
      if (key === 'space') state.frozen = false
    },
    update: dt => {
      if (state.frozen) return
      let [x, y] = love.mouse.getPosition()

      ;[x, y] = view.toRelativeCoords(x, y)
      state.angle = math.atan2(y - centre.y, x - centre.x)
      state.distance = x - centre.x

      origin.x += math.cos(state.angle) * speed * dt
      origin.xclamp(0, view.state.width - width)
      centre
        .copy(origin)
        .transform((x, y) => $multi(x + width / 2, y + height / 2))
    },
  })

  return paddle
}
