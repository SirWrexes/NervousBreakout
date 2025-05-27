import { Enum } from './Enum'
import type { ValueOf } from 'type-fest'

export const InputState = Enum('InputState', 'UP', 'DOWN', 'RELEASED')
export type InputState = ValueOf<typeof InputState>
