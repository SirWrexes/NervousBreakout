import type { NoopLike } from 'types/functionlike'

export interface Destroyable {
  destroy: NoopLike
}
