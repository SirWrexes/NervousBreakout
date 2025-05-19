import type { ValueOf } from 'type-fest'
import { Enum } from 'types'

export const InputState = Enum('InputState', 'UP', 'DOWN', 'RELEASED')
export type InputState = ValueOf<typeof InputState>
