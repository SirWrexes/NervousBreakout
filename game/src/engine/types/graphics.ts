import type { NoopLike } from 'types/functionlike'

export interface Renderable {
  render: NoopLike
}

export interface Drawable {
  draw: NoopLike | ((draw: NoopLike) => void)
}
