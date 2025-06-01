import type { NoopLike } from 'types/functionlike'
import type { Handler } from './events'

/** @noSelf */
export interface Renderable {
  render: Handler<'draw'>
}

/** @noSelf */
export interface Drawable {
  draw: NoopLike | ((draw: NoopLike) => void)
}
